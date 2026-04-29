using Microsoft.EntityFrameworkCore;
using Souq.Api.Domain;

namespace Souq.Api.Persistence;

public sealed class SouqDbContext(DbContextOptions<SouqDbContext> options) : DbContext(options)
{
    public DbSet<UsrUser> Users => Set<UsrUser>();
    public DbSet<LocNeighborhood> Neighborhoods => Set<LocNeighborhood>();
    public DbSet<CatCategory> Categories => Set<CatCategory>();
    public DbSet<CatCondition> Conditions => Set<CatCondition>();
    public DbSet<LstListing> Listings => Set<LstListing>();
    public DbSet<LstListingPhoto> ListingPhotos => Set<LstListingPhoto>();
    public DbSet<BstBoost> Boosts => Set<BstBoost>();
    public DbSet<LstListingDailyMetric> ListingDailyMetrics => Set<LstListingDailyMetric>();
    public DbSet<MsgConversation> Conversations => Set<MsgConversation>();
    public DbSet<MsgMessage> Messages => Set<MsgMessage>();
    public DbSet<OfrOffer> Offers => Set<OfrOffer>();
    public DbSet<EngFavorite> Favorites => Set<EngFavorite>();
    public DbSet<UsrSession> Sessions => Set<UsrSession>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.HasDefaultSchema("souq");

        b.Entity<UsrUser>(e =>
        {
            e.ToTable("usr_users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Auth0Sub).HasColumnName("auth0_sub");
            e.Property(x => x.Email).HasColumnName("email");
            e.Property(x => x.Phone).HasColumnName("phone");
            e.Property(x => x.Name).HasColumnName("name");
            e.Property(x => x.Handle).HasColumnName("handle");
            e.Property(x => x.AvatarUrl).HasColumnName("avatar_url");
            e.Property(x => x.AvatarInitial).HasColumnName("avatar_initial");
            e.Property(x => x.Bio).HasColumnName("bio");
            e.Property(x => x.HomeNeighborhoodId).HasColumnName("home_neighborhood_id");
            e.Property(x => x.JoinedYear).HasColumnName("joined_year");
            e.Property(x => x.IsVerified).HasColumnName("is_verified");
            e.Property(x => x.IsAdmin).HasColumnName("is_admin");
            e.Property(x => x.IsSuperAdmin).HasColumnName("is_super_admin");
            e.Property(x => x.IsModerator).HasColumnName("is_moderator");
            e.Property(x => x.IsNewSeller).HasColumnName("is_new_seller");
            e.Property(x => x.LastSeenAt).HasColumnName("last_seen_at");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.UpdatedBy).HasColumnName("updated_by");
            e.Property(x => x.DeletedAt).HasColumnName("deleted_at");
            e.Property(x => x.DeletedBy).HasColumnName("deleted_by");

            e.HasOne(x => x.HomeNeighborhood)
                .WithMany()
                .HasForeignKey(x => x.HomeNeighborhoodId);
        });

        b.Entity<LocNeighborhood>(e =>
        {
            e.ToTable("loc_neighborhoods");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Slug).HasColumnName("slug");
            e.Property(x => x.Name).HasColumnName("name").HasColumnType("jsonb");
            e.Property(x => x.CenterLat).HasColumnName("center_lat");
            e.Property(x => x.CenterLng).HasColumnName("center_lng");
            e.Property(x => x.SortOrder).HasColumnName("sort_order");
            e.Property(x => x.IsActive).HasColumnName("is_active");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        b.Entity<CatCategory>(e =>
        {
            e.ToTable("cat_categories");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Slug).HasColumnName("slug");
            e.Property(x => x.Name).HasColumnName("name").HasColumnType("jsonb");
            e.Property(x => x.IconName).HasColumnName("icon_name");
            e.Property(x => x.ParentId).HasColumnName("parent_id");
            e.Property(x => x.SortOrder).HasColumnName("sort_order");
            e.Property(x => x.IsActive).HasColumnName("is_active");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        b.Entity<CatCondition>(e =>
        {
            e.ToTable("cat_conditions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Slug).HasColumnName("slug");
            e.Property(x => x.Name).HasColumnName("name").HasColumnType("jsonb");
            e.Property(x => x.SortOrder).HasColumnName("sort_order");
            e.Property(x => x.IsActive).HasColumnName("is_active");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        });

        b.Entity<LstListing>(e =>
        {
            e.ToTable("lst_listings");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.SellerId).HasColumnName("seller_id");
            e.Property(x => x.CategoryId).HasColumnName("category_id");
            e.Property(x => x.ConditionId).HasColumnName("condition_id");
            e.Property(x => x.NeighborhoodId).HasColumnName("neighborhood_id");
            e.Property(x => x.Title).HasColumnName("title").HasColumnType("jsonb");
            e.Property(x => x.Description).HasColumnName("description").HasColumnType("jsonb");
            e.Property(x => x.PriceAed).HasColumnName("price_aed");
            e.Property(x => x.PreviousPriceAed).HasColumnName("previous_price_aed");
            e.Property(x => x.AcceptOffers).HasColumnName("accept_offers");
            e.Property(x => x.HasPickup).HasColumnName("has_pickup");
            e.Property(x => x.PickupNote).HasColumnName("pickup_note");
            e.Property(x => x.Status).HasColumnName("status");
            e.Property(x => x.PublishedAt).HasColumnName("published_at");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.DeletedAt).HasColumnName("deleted_at");

            e.HasOne(x => x.Seller).WithMany().HasForeignKey(x => x.SellerId);
            e.HasOne(x => x.Category).WithMany().HasForeignKey(x => x.CategoryId);
            e.HasOne(x => x.Condition).WithMany().HasForeignKey(x => x.ConditionId);
            e.HasOne(x => x.Neighborhood).WithMany().HasForeignKey(x => x.NeighborhoodId);
            e.HasMany(x => x.Photos).WithOne().HasForeignKey(x => x.ListingId);
        });

        b.Entity<LstListingPhoto>(e =>
        {
            e.ToTable("lst_listing_photos");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.ListingId).HasColumnName("listing_id");
            e.Property(x => x.Url).HasColumnName("url");
            e.Property(x => x.ThumbUrl).HasColumnName("thumb_url");
            e.Property(x => x.SortOrder).HasColumnName("sort_order");
            e.Property(x => x.Width).HasColumnName("width");
            e.Property(x => x.Height).HasColumnName("height");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        });

        b.Entity<BstBoost>(e =>
        {
            e.ToTable("bst_boosts");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.ListingId).HasColumnName("listing_id");
            e.Property(x => x.StartsAt).HasColumnName("starts_at");
            e.Property(x => x.EndsAt).HasColumnName("ends_at");
        });

        b.Entity<LstListingDailyMetric>(e =>
        {
            e.ToTable("lst_listing_daily_metrics");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.ListingId).HasColumnName("listing_id");
            e.Property(x => x.MetricDate).HasColumnName("metric_date");
            e.Property(x => x.ViewCount).HasColumnName("view_count");
            e.Property(x => x.SaveCount).HasColumnName("save_count");
            e.Property(x => x.MessageCount).HasColumnName("message_count");
            e.Property(x => x.OfferCount).HasColumnName("offer_count");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.UpdatedBy).HasColumnName("updated_by");
            e.HasIndex(x => new { x.ListingId, x.MetricDate }).IsUnique();
        });

        b.Entity<MsgConversation>(e =>
        {
            e.ToTable("msg_conversations");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.ListingId).HasColumnName("listing_id");
            e.Property(x => x.BuyerId).HasColumnName("buyer_id");
            e.Property(x => x.SellerId).HasColumnName("seller_id");
            e.Property(x => x.LastMessageAt).HasColumnName("last_message_at");
            e.Property(x => x.BuyerLastReadMessageId).HasColumnName("buyer_last_read_message_id");
            e.Property(x => x.SellerLastReadMessageId).HasColumnName("seller_last_read_message_id");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.DeletedAt).HasColumnName("deleted_at");

            e.HasOne(x => x.Listing).WithMany().HasForeignKey(x => x.ListingId);
            e.HasOne(x => x.Buyer).WithMany().HasForeignKey(x => x.BuyerId);
            e.HasOne(x => x.Seller).WithMany().HasForeignKey(x => x.SellerId);
        });

        b.Entity<MsgMessage>(e =>
        {
            e.ToTable("msg_messages");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.ConversationId).HasColumnName("conversation_id");
            e.Property(x => x.SenderId).HasColumnName("sender_id");
            e.Property(x => x.MessageType).HasColumnName("message_type");
            e.Property(x => x.Text).HasColumnName("text").HasColumnType("jsonb");
            e.Property(x => x.OfferId).HasColumnName("offer_id");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.DeletedAt).HasColumnName("deleted_at");
        });

        b.Entity<OfrOffer>(e =>
        {
            e.ToTable("ofr_offers");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.ListingId).HasColumnName("listing_id");
            e.Property(x => x.ConversationId).HasColumnName("conversation_id");
            e.Property(x => x.BuyerId).HasColumnName("buyer_id");
            e.Property(x => x.SellerId).HasColumnName("seller_id");
            e.Property(x => x.AmountAed).HasColumnName("amount_aed");
            e.Property(x => x.ListedPriceAed).HasColumnName("listed_price_aed");
            e.Property(x => x.Status).HasColumnName("status");
            e.Property(x => x.ExpiresAt).HasColumnName("expires_at");
            e.Property(x => x.PickupAt).HasColumnName("pickup_at");
            e.Property(x => x.RespondedAt).HasColumnName("responded_at");
            e.Property(x => x.CounterOfOfferId).HasColumnName("counter_of_offer_id");
            e.Property(x => x.CreatedAt).HasColumnName("created_at");
            e.Property(x => x.UpdatedAt).HasColumnName("updated_at");
            e.Property(x => x.DeletedAt).HasColumnName("deleted_at");

            e.HasOne(x => x.Listing).WithMany().HasForeignKey(x => x.ListingId);
            e.HasOne(x => x.Buyer).WithMany().HasForeignKey(x => x.BuyerId);
        });

        b.Entity<EngFavorite>(e =>
        {
            e.ToTable("eng_favorites");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.CreatedAt).HasColumnName("created_at").ValueGeneratedOnAdd();
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.Property(x => x.ListingId).HasColumnName("listing_id");

            e.HasOne(x => x.Listing).WithMany().HasForeignKey(x => x.ListingId);
        });

        b.Entity<UsrSession>(e =>
        {
            e.ToTable("usr_sessions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.Property(x => x.CreatedAt).HasColumnName("created_at").ValueGeneratedOnAdd();
            e.Property(x => x.LastUsedAt).HasColumnName("last_used_at").ValueGeneratedOnAdd();
            e.Property(x => x.RevokedAt).HasColumnName("revoked_at");
        });
    }
}
