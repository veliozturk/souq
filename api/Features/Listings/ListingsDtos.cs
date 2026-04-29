using Souq.Api.Common;

namespace Souq.Api.Features.Listings;

public sealed record ListingCardDto
{
    public Guid Id { get; init; }
    public BilingualUgcText Title { get; init; } = null!;
    public decimal PriceAed { get; init; }
    public decimal? PreviousPriceAed { get; init; }
    public DateTime? PublishedAt { get; init; }
    public Guid CategoryId { get; init; }
    public NeighborhoodSummaryDto Neighborhood { get; init; } = null!;
    public SellerSummaryDto Seller { get; init; } = null!;
    public CoverPhotoDto? CoverPhoto { get; init; }
    public bool IsBoosted { get; init; }
    public ListingCardSellerStatsDto? SellerStats { get; init; }
}

public sealed record ListingCardSellerStatsDto
{
    public int ViewsCount { get; init; }
    public int MessagesCount { get; init; }
    public int PendingOffersCount { get; init; }
}

public sealed record NeighborhoodSummaryDto
{
    public Guid Id { get; init; }
    public string Slug { get; init; } = "";
    public BilingualName Name { get; init; } = null!;
}

public sealed record SellerSummaryDto
{
    public Guid Id { get; init; }
    public string Handle { get; init; } = "";
    public string Name { get; init; } = "";
    public string? AvatarUrl { get; init; }
    public string? AvatarInitial { get; init; }
    public bool IsVerified { get; init; }
    public short JoinedYear { get; init; }
}

public sealed record CoverPhotoDto
{
    public string Url { get; init; } = "";
    public string? ThumbUrl { get; init; }
}

public sealed record CreateListingRequest(
    Guid UserId,
    Guid CategoryId,
    Guid ConditionId,
    Guid NeighborhoodId,
    string Title,
    string? Description,
    decimal PriceAed,
    bool AcceptOffers,
    bool HasPickup,
    string? PickupNote);

public sealed record UpdateListingRequest(
    string? Status,
    string? Title,
    string? Description,
    Guid? CategoryId,
    Guid? ConditionId,
    Guid? NeighborhoodId,
    decimal? PriceAed,
    bool? AcceptOffers);
