using Souq.Api.Domain;
using Souq.Api.Persistence;

namespace Souq.Api.Features.Listings;

public static class ListingProjections
{
    public static IQueryable<ListingCardDto> SelectListingCard(
        this IQueryable<LstListing> q, SouqDbContext db, DateTime now, bool includeSellerStats = false)
        => q.Select(l => new ListingCardDto
        {
            Id = l.Id,
            Title = l.Title,
            PriceAed = l.PriceAed,
            PreviousPriceAed = l.PreviousPriceAed,
            PublishedAt = l.PublishedAt,
            CategoryId = l.CategoryId,
            Neighborhood = new NeighborhoodSummaryDto
            {
                Id = l.Neighborhood.Id,
                Slug = l.Neighborhood.Slug,
                Name = l.Neighborhood.Name,
            },
            Seller = new SellerSummaryDto
            {
                Id = l.Seller.Id,
                Handle = l.Seller.Handle,
                Name = l.Seller.Name,
                AvatarUrl = l.Seller.AvatarUrl == null
                    ? null
                    : (l.Seller.AvatarUrl.StartsWith("http")
                        ? l.Seller.AvatarUrl
                        : "/uploads/" + l.Seller.AvatarUrl),
                AvatarInitial = l.Seller.AvatarInitial,
                IsVerified = l.Seller.IsVerified == 1,
                JoinedYear = l.Seller.JoinedYear,
            },
            CoverPhoto = l.Photos
                .OrderBy(p => p.SortOrder)
                .Select(p => new CoverPhotoDto
                {
                    Url = p.Url.StartsWith("http") ? p.Url : "/uploads/" + p.Url,
                    ThumbUrl = p.ThumbUrl == null ? null : (p.ThumbUrl.StartsWith("http") ? p.ThumbUrl : "/uploads/" + p.ThumbUrl),
                })
                .FirstOrDefault(),
            IsBoosted = db.Boosts.Any(b =>
                b.ListingId == l.Id && b.StartsAt <= now && b.EndsAt >= now),
            SellerStats = includeSellerStats
                ? new ListingCardSellerStatsDto
                {
                    ViewsCount = db.ListingDailyMetrics
                        .Where(m => m.ListingId == l.Id)
                        .Sum(m => (int?)m.ViewCount) ?? 0,
                    MessagesCount = 0,
                    PendingOffersCount = 0,
                }
                : null,
        });
}
