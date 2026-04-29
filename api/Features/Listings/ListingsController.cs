using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;
using Souq.Api.Features.Auth;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Listings;

[ApiController]
[Route("api/listings")]
public sealed class ListingsController(SouqDbContext db) : ControllerBase
{
    [HttpGet("")]
    public async Task<IActionResult> Browse(
        [FromQuery] Guid? categoryId,
        [FromQuery] Guid? sellerId,
        [FromQuery] Guid? neighborhoodId,
        [FromQuery] string? q,
        [FromQuery] string? status,
        [FromQuery] int? limit,
        [FromQuery] int? offset,
        [FromServices] IUserContext userCtx = null!)
    {
        if (status is not null && status is not ("active" or "paused" or "sold"))
            return BadRequest(new { error = "status must be active, paused, or sold" });

        var now = DateTime.UtcNow;
        var take = Math.Clamp(limit ?? 20, 1, 100);
        var skip = Math.Max(offset ?? 0, 0);
        var statusFilter = string.IsNullOrWhiteSpace(status) ? "active" : status;

        var query = db.Listings
            .AsNoTracking()
            .Where(l => l.Status == statusFilter && l.DeletedAt == null
                        && (statusFilter != "active" || l.PublishedAt != null));

        if (categoryId.HasValue) query = query.Where(l => l.CategoryId == categoryId.Value);
        if (sellerId.HasValue) query = query.Where(l => l.SellerId == sellerId.Value);
        if (neighborhoodId.HasValue) query = query.Where(l => l.NeighborhoodId == neighborhoodId.Value);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var pattern = $"%{q}%";
            query = query.Where(l =>
                EF.Functions.ILike(l.Title.En, pattern) ||
                EF.Functions.ILike(l.Title.Original, pattern));
        }

        var includeSellerStats = sellerId.HasValue
            && userCtx?.CurrentUserId == sellerId.Value;

        var rows = await query
            .OrderByDescending(l => l.PublishedAt)
            .Skip(skip)
            .Take(take)
            .SelectListingCard(db, now, includeSellerStats)
            .ToListAsync();

        return Ok(rows);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var now = DateTime.UtcNow;

        var listing = await db.Listings
            .AsNoTracking()
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new
            {
                id = l.Id,
                title = l.Title,
                description = l.Description,
                priceAed = l.PriceAed,
                previousPriceAed = l.PreviousPriceAed,
                acceptOffers = l.AcceptOffers == 1,
                hasPickup = l.HasPickup == 1,
                pickupNote = l.PickupNote,
                status = l.Status,
                publishedAt = l.PublishedAt,
                seller = new
                {
                    id = l.Seller.Id,
                    handle = l.Seller.Handle,
                    name = l.Seller.Name,
                    avatarUrl = l.Seller.AvatarUrl,
                    avatarInitial = l.Seller.AvatarInitial,
                    isVerified = l.Seller.IsVerified == 1,
                    joinedYear = l.Seller.JoinedYear,
                },
                category = new
                {
                    id = l.Category.Id,
                    slug = l.Category.Slug,
                    name = l.Category.Name,
                },
                condition = new
                {
                    id = l.Condition.Id,
                    slug = l.Condition.Slug,
                    name = l.Condition.Name,
                },
                neighborhood = new
                {
                    id = l.Neighborhood.Id,
                    slug = l.Neighborhood.Slug,
                    name = l.Neighborhood.Name,
                    centerLat = l.Neighborhood.CenterLat,
                    centerLng = l.Neighborhood.CenterLng,
                },
                photos = l.Photos
                    .OrderBy(p => p.SortOrder)
                    .Select(p => new
                    {
                        id = p.Id,
                        url = p.Url.StartsWith("http") ? p.Url : "/uploads/" + p.Url,
                        thumbUrl = p.ThumbUrl == null ? null : (p.ThumbUrl.StartsWith("http") ? p.ThumbUrl : "/uploads/" + p.ThumbUrl),
                        sortOrder = p.SortOrder,
                        width = p.Width,
                        height = p.Height,
                    })
                    .ToList(),
                isBoosted = db.Boosts.Any(b =>
                    b.ListingId == l.Id && b.StartsAt <= now && b.EndsAt >= now),
                boostEndsAt = db.Boosts
                    .Where(b => b.ListingId == l.Id && b.StartsAt <= now && b.EndsAt >= now)
                    .Select(b => (DateTime?)b.EndsAt)
                    .FirstOrDefault(),
            })
            .FirstOrDefaultAsync();

        if (listing is null) return NotFound();
        return Ok(listing);
    }

    [HttpPost("{id:guid}/view")]
    public async Task<IActionResult> RecordView(Guid id, [FromServices] IUserContext userCtx)
    {
        const string sql = """
            WITH self_check AS (
                SELECT seller_id FROM souq.lst_listings
                WHERE id = @lid AND deleted_at IS NULL
            )
            INSERT INTO souq.lst_listing_daily_metrics (listing_id, metric_date, view_count)
            SELECT @lid, (now() AT TIME ZONE 'UTC')::date, 1
            FROM self_check
            WHERE seller_id IS DISTINCT FROM @vid
            ON CONFLICT (listing_id, metric_date)
            DO UPDATE SET view_count = souq.lst_listing_daily_metrics.view_count + 1;
            """;
        var lidParam = new NpgsqlParameter("lid", NpgsqlDbType.Uuid) { Value = id };
        var vidParam = new NpgsqlParameter("vid", NpgsqlDbType.Uuid)
        {
            Value = (object?)userCtx.CurrentUserId ?? DBNull.Value,
        };
        await db.Database.ExecuteSqlRawAsync(sql, lidParam, vidParam);
        return NoContent();
    }

    [HttpGet("{id:guid}/stats")]
    public async Task<IActionResult> Stats(Guid id, [FromServices] IUserContext userCtx)
    {
        if (userCtx.CurrentUserId is null) return NotFound();

        var listing = await db.Listings.AsNoTracking()
            .Where(l => l.Id == id && l.DeletedAt == null)
            .Select(l => new { l.SellerId })
            .FirstOrDefaultAsync();
        if (listing is null) return NotFound();

        var caller = await db.Users.AsNoTracking()
            .Where(u => u.Id == userCtx.CurrentUserId.Value)
            .Select(u => new { u.IsAdmin, u.IsSuperAdmin })
            .FirstOrDefaultAsync();

        var isOwner = listing.SellerId == userCtx.CurrentUserId.Value;
        var isAdmin = caller is not null && (caller.IsAdmin == 1 || caller.IsSuperAdmin == 1);
        if (!isOwner && !isAdmin) return NotFound();

        var totalViews = await db.ListingDailyMetrics.AsNoTracking()
            .Where(m => m.ListingId == id)
            .SumAsync(m => (int?)m.ViewCount) ?? 0;

        var todayUtc = DateOnly.FromDateTime(DateTime.UtcNow);
        var windowStart = todayUtc.AddDays(-6);

        var rows = await db.ListingDailyMetrics.AsNoTracking()
            .Where(m => m.ListingId == id && m.MetricDate >= windowStart)
            .Select(m => new { m.MetricDate, m.ViewCount })
            .ToListAsync();
        var rowMap = rows.ToDictionary(r => r.MetricDate, r => r.ViewCount);

        var views7d = Enumerable.Range(0, 7)
            .Select(i => windowStart.AddDays(i))
            .Select(d => new
            {
                dayLabel = d.ToString("ddd", CultureInfo.InvariantCulture),
                count = rowMap.GetValueOrDefault(d, 0),
                isToday = d == todayUtc,
            })
            .ToList();

        return Ok(new
        {
            listingId = id,
            totals = new
            {
                views = totalViews,
                viewsTodayDelta = rowMap.GetValueOrDefault(todayUtc, 0),
                saves = 0,
                savesRatePct = 0,
                messages = 0,
                unreadMessages = 0,
            },
            views7d,
        });
    }

    [HttpGet("drafts")]
    public IActionResult Drafts() => Ok(Array.Empty<object>());

    [HttpGet("drafts/{id}")]
    public IActionResult DraftById(string id) => NotFound();
}
