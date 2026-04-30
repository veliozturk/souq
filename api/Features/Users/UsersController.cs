using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using Souq.Api.Persistence;
using Souq.Api.Storage;

namespace Souq.Api.Features.Users;

[ApiController]
[Route("api")]
public sealed class UsersController(
    SouqDbContext db,
    UsersService users,
    IObjectStorage storage,
    PhotoProcessor processor,
    ILogger<UsersController> logger) : ControllerBase
{
    [HttpGet("users/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.HomeNeighborhood)
            .Where(u => u.Id == id && u.DeletedAt == null)
            .FirstOrDefaultAsync();

        if (user is null) return NotFound();

        return Ok(new
        {
            id = user.Id,
            handle = user.Handle,
            name = user.Name,
            avatarUrl = PrefixAvatarUrl(user.AvatarUrl),
            avatarInitial = user.AvatarInitial,
            joinedYear = user.JoinedYear,
            isVerified = user.IsVerified == 1,
            homeNeighborhood = user.HomeNeighborhood is null ? null : new
            {
                id = user.HomeNeighborhood.Id,
                slug = user.HomeNeighborhood.Slug,
                name = user.HomeNeighborhood.Name,
            },
            ratingAvg = (decimal?)null,
            soldCount = 0,
            replyTime = (string?)null,
        });
    }

    internal static string? PrefixAvatarUrl(string? raw) =>
        raw is null ? null : (raw.StartsWith("http") ? raw : "/uploads/" + raw);

    [HttpGet("me")]
    public async Task<IActionResult> Me([FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        var user = await db.Users
            .AsNoTracking()
            .Include(u => u.HomeNeighborhood)
            .FirstOrDefaultAsync(u => u.Id == userId.Value && u.DeletedAt == null);
        return user is null ? NotFound() : Ok(await users.GetMeDtoAsync(user));
    }

    public sealed record PatchMeRequest(
        string? DisplayName,
        string? Handle,
        Guid? HomeNeighborhoodId);

    private static readonly Regex HandleRegex = new("^[a-z0-9._]{3,32}$", RegexOptions.Compiled);

    [HttpPatch("me")]
    public async Task<IActionResult> PatchMe([FromQuery] Guid? userId, [FromBody] PatchMeRequest body)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });

        var user = await db.Users
            .Include(u => u.HomeNeighborhood)
            .FirstOrDefaultAsync(u => u.Id == userId.Value && u.DeletedAt == null);
        if (user is null) return NotFound();

        if (body.DisplayName is not null)
        {
            var name = body.DisplayName.Trim();
            if (name.Length == 0) return BadRequest(new { error = "name_required" });
            if (name.Length > 80) return BadRequest(new { error = "name_too_long" });
            user.Name = name;
        }

        if (body.Handle is not null)
        {
            var handle = body.Handle.Trim().ToLowerInvariant();
            if (!HandleRegex.IsMatch(handle)) return BadRequest(new { error = "handle_invalid" });
            var taken = await db.Users.AnyAsync(u =>
                u.Handle == handle && u.Id != userId.Value && u.DeletedAt == null);
            if (taken) return Conflict(new { error = "handle_taken" });
            user.Handle = handle;
        }

        if (body.HomeNeighborhoodId is { } nid)
        {
            var nbh = await db.Neighborhoods.FindAsync(nid);
            if (nbh is null) return BadRequest(new { error = "neighborhoodId not found" });
            user.HomeNeighborhoodId = nid;
        }

        await db.SaveChangesAsync();
        await db.Entry(user).Reference(u => u.HomeNeighborhood).LoadAsync();
        return Ok(await users.GetMeDtoAsync(user));
    }

    [HttpPost("me/avatar")]
    [IgnoreAntiforgeryToken]
    [EnableRateLimiting("uploads")]
    public async Task<IActionResult> UploadAvatar([FromQuery] Guid? userId, CancellationToken ct)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        if (!Request.HasFormContentType) return BadRequest(new { error = "multipart/form-data required" });

        var user = await db.Users
            .Include(u => u.HomeNeighborhood)
            .FirstOrDefaultAsync(u => u.Id == userId.Value && u.DeletedAt == null, ct);
        if (user is null) return NotFound();

        var form = await Request.ReadFormAsync(ct);
        var file = form.Files["file"] ?? form.Files.FirstOrDefault();
        if (file is null || file.Length == 0) return BadRequest(new { error = "no file" });
        if (file.Length > PhotoProcessor.MaxInputBytes)
            return BadRequest(new { error = "file_too_large" });
        if (!PhotoProcessor.AcceptedMimes.Contains(file.ContentType ?? ""))
            return StatusCode(StatusCodes.Status415UnsupportedMediaType);

        PhotoProcessor.Result processed;
        try
        {
            await using var input = file.OpenReadStream();
            processed = await processor.ProcessAsync(input, ct);
        }
        catch (InvalidPhotoException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (ImageFormatException)
        {
            return BadRequest(new { error = "unsupported or corrupted image" });
        }

        var oldKey = user.AvatarUrl;
        var newKey = $"users/{user.Id}/{Guid.NewGuid()}/avatar.jpg";

        try
        {
            await using var ms = new MemoryStream(processed.ThumbJpeg, writable: false);
            await storage.PutAsync(newKey, ms, "image/jpeg", ct);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "avatar upload failed for user {UserId}", user.Id);
            throw;
        }

        user.AvatarUrl = newKey;
        await db.SaveChangesAsync(ct);

        if (!string.IsNullOrEmpty(oldKey) && !oldKey.StartsWith("http"))
        {
            try { await storage.DeleteAsync(oldKey, CancellationToken.None); }
            catch (Exception ex) { logger.LogWarning(ex, "old avatar delete failed: {Key}", oldKey); }
        }

        return Ok(await users.GetMeDtoAsync(user));
    }

    [HttpGet("me/favorites")]
    public async Task<IActionResult> Favorites([FromQuery] Guid? userId)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        var me = userId.Value;
        var now = DateTime.UtcNow;

        var rows = await db.Favorites
            .AsNoTracking()
            .Where(f => f.UserId == me)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                id = f.Listing.Id,
                title = f.Listing.Title,
                priceAed = f.Listing.PriceAed,
                previousPriceAed = f.Listing.PreviousPriceAed,
                publishedAt = f.Listing.PublishedAt,
                categoryId = f.Listing.CategoryId,
                neighborhood = new
                {
                    id = f.Listing.Neighborhood.Id,
                    slug = f.Listing.Neighborhood.Slug,
                    name = f.Listing.Neighborhood.Name,
                },
                seller = new
                {
                    id = f.Listing.Seller.Id,
                    handle = f.Listing.Seller.Handle,
                    name = f.Listing.Seller.Name,
                    avatarUrl = f.Listing.Seller.AvatarUrl == null
                        ? null
                        : (f.Listing.Seller.AvatarUrl.StartsWith("http")
                            ? f.Listing.Seller.AvatarUrl
                            : "/uploads/" + f.Listing.Seller.AvatarUrl),
                    avatarInitial = f.Listing.Seller.AvatarInitial,
                    isVerified = f.Listing.Seller.IsVerified == 1,
                    joinedYear = f.Listing.Seller.JoinedYear,
                },
                coverPhoto = f.Listing.Photos
                    .OrderBy(p => p.SortOrder)
                    .Select(p => new
                    {
                        url = p.Url.StartsWith("http") ? p.Url : "/uploads/" + p.Url,
                        thumbUrl = p.ThumbUrl == null ? null : (p.ThumbUrl.StartsWith("http") ? p.ThumbUrl : "/uploads/" + p.ThumbUrl),
                    })
                    .FirstOrDefault(),
                isBoosted = db.Boosts.Any(b =>
                    b.ListingId == f.ListingId && b.StartsAt <= now && b.EndsAt >= now),
                favoritedAt = f.CreatedAt,
            })
            .ToListAsync();

        return Ok(rows);
    }

    [HttpGet("me/offers")]
    public async Task<IActionResult> MyOffers([FromQuery] Guid? userId, [FromQuery] string? status)
    {
        if (userId is null) return BadRequest(new { error = "userId is required (auth deferred)" });
        var me = userId.Value;

        var query = db.Offers
            .AsNoTracking()
            .Where(o => o.SellerId == me && o.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(o => o.Status == status);

        var rows = await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                id = o.Id,
                buyer = new
                {
                    id = o.Buyer.Id,
                    displayName = o.Buyer.Name,
                    avatarInitial = o.Buyer.AvatarInitial,
                },
                listing = new
                {
                    id = o.Listing.Id,
                    title = o.Listing.Title,
                    priceAed = o.Listing.PriceAed,
                    coverPhoto = o.Listing.Photos
                        .OrderBy(p => p.SortOrder)
                        .Select(p => new
                        {
                            url = p.Url.StartsWith("http") ? p.Url : "/uploads/" + p.Url,
                            thumbUrl = p.ThumbUrl == null ? null : (p.ThumbUrl.StartsWith("http") ? p.ThumbUrl : "/uploads/" + p.ThumbUrl),
                        })
                        .FirstOrDefault(),
                },
                offerAed = o.AmountAed,
                state = o.Status,
                createdAt = o.CreatedAt,
                expiresAt = o.ExpiresAt,
            })
            .ToListAsync();

        return Ok(rows);
    }
}
