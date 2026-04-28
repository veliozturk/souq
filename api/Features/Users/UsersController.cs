using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Users;

[ApiController]
[Route("api")]
public sealed class UsersController(SouqDbContext db, UsersService users) : ControllerBase
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
            avatarUrl = user.AvatarUrl,
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
                    avatarUrl = f.Listing.Seller.AvatarUrl,
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
