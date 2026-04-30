using Microsoft.EntityFrameworkCore;
using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Users;

public sealed class UsersService(SouqDbContext db)
{
    public async Task<object> GetMeDtoAsync(UsrUser u)
    {
        var statusCounts = await db.Listings
            .AsNoTracking()
            .Where(l => l.SellerId == u.Id
                        && l.DeletedAt == null
                        && (l.Status != "active" || l.PublishedAt != null))
            .GroupBy(l => l.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();
        int active = statusCounts.FirstOrDefault(x => x.Status == "active")?.Count ?? 0;
        int inactive = statusCounts.FirstOrDefault(x => x.Status == "paused")?.Count ?? 0;
        int sold = statusCounts.FirstOrDefault(x => x.Status == "sold")?.Count ?? 0;

        int unreadOffers = await db.Offers
            .AsNoTracking()
            .CountAsync(o => o.SellerId == u.Id && o.Status == "new" && o.DeletedAt == null);

        int savedItems = await db.Favorites
            .AsNoTracking()
            .CountAsync(f => f.UserId == u.Id);

        decimal earnedAed = await db.Listings
            .AsNoTracking()
            .Where(l => l.SellerId == u.Id && l.Status == "sold" && l.DeletedAt == null)
            .SumAsync(l => (decimal?)l.PriceAed) ?? 0m;

        decimal walletBalanceAed = await db.Database
            .SqlQueryRaw<decimal>(
                "SELECT COALESCE(balance_aed, 0)::numeric AS \"Value\" FROM souq.wal_wallets WHERE user_id = {0}",
                u.Id)
            .SingleOrDefaultAsync();

        long views7d = await db.Database
            .SqlQueryRaw<long>(
                """
                SELECT COALESCE(SUM(m.view_count), 0)::bigint AS "Value"
                FROM souq.lst_listing_daily_metrics m
                JOIN souq.lst_listings l ON l.id = m.listing_id
                WHERE l.seller_id = {0}
                  AND l.deleted_at IS NULL
                  AND m.metric_date >= (CURRENT_DATE - INTERVAL '7 days')
                """,
                u.Id)
            .SingleAsync();

        return new
        {
            id = u.Id,
            handle = u.Handle,
            displayName = u.Name,
            avatarUrl = u.AvatarUrl == null
                ? null
                : (u.AvatarUrl.StartsWith("http") ? u.AvatarUrl : "/uploads/" + u.AvatarUrl),
            avatarInitial = u.AvatarInitial,
            isVerified = u.IsVerified == 1,
            ratingAvg = (decimal?)null,
            soldCount = sold,
            homeNeighborhood = u.HomeNeighborhood is null ? null : (object)new
            {
                id = u.HomeNeighborhood.Id,
                slug = u.HomeNeighborhood.Slug,
                name = u.HomeNeighborhood.Name,
            },
            counts = new
            {
                activeListings = active,
                inactiveListings = inactive,
                soldListings = sold,
                unreadOffers,
                savedItems,
            },
            sellerStats = new
            {
                views7d = (int)views7d,
                earnedAed,
            },
            walletBalanceAed,
        };
    }
}
