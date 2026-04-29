using Souq.Api.Common;

namespace Souq.Api.Domain;

public sealed class UsrUser
{
    public Guid Id { get; set; }
    public string Auth0Sub { get; set; } = "";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Name { get; set; } = "";
    public string Handle { get; set; } = "";
    public string? AvatarUrl { get; set; }
    public string? AvatarInitial { get; set; }
    public string? Bio { get; set; }
    public Guid? HomeNeighborhoodId { get; set; }
    public short JoinedYear { get; set; }
    public short IsVerified { get; set; }
    public short IsAdmin { get; set; }
    public short IsSuperAdmin { get; set; }
    public short IsModerator { get; set; }
    public short IsNewSeller { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }

    public LocNeighborhood? HomeNeighborhood { get; set; }
}

public sealed class LocNeighborhood
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public BilingualName Name { get; set; } = new();
    public decimal? CenterLat { get; set; }
    public decimal? CenterLng { get; set; }
    public int SortOrder { get; set; }
    public short IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public sealed class CatCategory
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public BilingualName Name { get; set; } = new();
    public string? IconName { get; set; }
    public Guid? ParentId { get; set; }
    public int SortOrder { get; set; }
    public short IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public sealed class CatCondition
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public BilingualName Name { get; set; } = new();
    public int SortOrder { get; set; }
    public short IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public sealed class LstListing
{
    public Guid Id { get; set; }
    public Guid SellerId { get; set; }
    public Guid CategoryId { get; set; }
    public Guid ConditionId { get; set; }
    public Guid NeighborhoodId { get; set; }
    public BilingualUgcText Title { get; set; } = new();
    public BilingualUgcText Description { get; set; } = new();
    public decimal PriceAed { get; set; }
    public decimal? PreviousPriceAed { get; set; }
    public short AcceptOffers { get; set; }
    public short HasPickup { get; set; }
    public string? PickupNote { get; set; }
    public string Status { get; set; } = "";
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public UsrUser Seller { get; set; } = null!;
    public CatCategory Category { get; set; } = null!;
    public CatCondition Condition { get; set; } = null!;
    public LocNeighborhood Neighborhood { get; set; } = null!;
    public List<LstListingPhoto> Photos { get; set; } = new();
}

public sealed class LstListingPhoto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string Url { get; set; } = "";
    public string? ThumbUrl { get; set; }
    public short SortOrder { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public sealed class BstBoost
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
}

public sealed class LstListingDailyMetric
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public DateOnly MetricDate { get; set; }
    public int ViewCount { get; set; }
    public int SaveCount { get; set; }
    public int MessageCount { get; set; }
    public int OfferCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
}

public sealed class MsgConversation
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid BuyerId { get; set; }
    public Guid SellerId { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public Guid? BuyerLastReadMessageId { get; set; }
    public Guid? SellerLastReadMessageId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public LstListing Listing { get; set; } = null!;
    public UsrUser Buyer { get; set; } = null!;
    public UsrUser Seller { get; set; } = null!;
}

public sealed class MsgMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string MessageType { get; set; } = "text";
    public BilingualUgcText? Text { get; set; }
    public Guid? OfferId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public sealed class OfrOffer
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid ConversationId { get; set; }
    public Guid BuyerId { get; set; }
    public Guid SellerId { get; set; }
    public decimal AmountAed { get; set; }
    public decimal ListedPriceAed { get; set; }
    public string Status { get; set; } = "new";
    public DateTime ExpiresAt { get; set; }
    public DateTime? PickupAt { get; set; }
    public DateTime? RespondedAt { get; set; }
    public Guid? CounterOfOfferId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public LstListing Listing { get; set; } = null!;
    public UsrUser Buyer { get; set; } = null!;
}

public sealed class EngFavorite
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ListingId { get; set; }
    public DateTime CreatedAt { get; set; }

    public LstListing Listing { get; set; } = null!;
}

public sealed class UsrSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUsedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
}
