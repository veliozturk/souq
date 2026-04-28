-- =============================================================================
-- Souq Dubai — initial schema (PostgreSQL 14)
-- Generated from db-design.md + db-design-fields.md (Phase 2 field-level design)
--
-- Apply with:
--   psql -h localhost -p 5432 -U postgres -d postgres -f db/schema.sql
--
-- All objects are created in the `souq` schema (already exists).
-- To wipe and re-apply during dev:
--   DROP SCHEMA souq CASCADE; CREATE SCHEMA souq AUTHORIZATION postgres;
-- =============================================================================

SET search_path = souq, pg_catalog;

-- =============================================================================
-- Section 0 — Helpers
-- =============================================================================

CREATE OR REPLACE FUNCTION souq.trg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $fn$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$fn$;

-- =============================================================================
-- Section A — usr_*  (identity & access)
-- =============================================================================

-- A.1 usr_users
CREATE TABLE usr_users (
    id                    uuid         PRIMARY KEY DEFAULT uuidv7(),
    auth0_sub             varchar(64)  NOT NULL,
    email                 varchar(254) NULL,
    phone                 varchar(20)  NULL,
    name                  varchar(80)  NOT NULL,
    handle                varchar(32)  NOT NULL,
    avatar_url            varchar(500) NULL,
    avatar_initial        varchar(2)   NULL,
    bio                   varchar(500) NULL,
    home_neighborhood_id  uuid         NULL,                              -- FK in Section M
    joined_year           smallint     NOT NULL DEFAULT EXTRACT(YEAR FROM now())::smallint,
    is_verified           smallint     NOT NULL DEFAULT 0 CHECK (is_verified    IN (0, 1)),
    is_admin              smallint     NOT NULL DEFAULT 0 CHECK (is_admin       IN (0, 1)),
    is_super_admin        smallint     NOT NULL DEFAULT 0 CHECK (is_super_admin IN (0, 1)),
    is_moderator          smallint     NOT NULL DEFAULT 0 CHECK (is_moderator   IN (0, 1)),
    is_new_seller         smallint     NOT NULL DEFAULT 1 CHECK (is_new_seller  IN (0, 1)),
    last_seen_at          timestamptz  NULL,
    created_at            timestamptz  NOT NULL DEFAULT now(),
    created_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at            timestamptz  NOT NULL DEFAULT now(),
    updated_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at            timestamptz  NULL,
    deleted_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT usr_users_auth0_sub_key UNIQUE (auth0_sub),
    CONSTRAINT usr_users_handle_key    UNIQUE (handle),
    CONSTRAINT usr_users_handle_format_chk CHECK (handle ~ '^[a-z0-9._]+$')
);

CREATE UNIQUE INDEX usr_users_email_active_uniq ON usr_users (email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX usr_users_phone_active_uniq ON usr_users (phone) WHERE deleted_at IS NULL;

CREATE TRIGGER usr_users_set_updated_at
    BEFORE UPDATE ON usr_users
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- A.2 usr_user_devices  (hard delete; no soft-delete columns)
CREATE TABLE usr_user_devices (
    id           uuid         PRIMARY KEY DEFAULT uuidv7(),
    user_id      uuid         NOT NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    platform     varchar(10)  NOT NULL CHECK (platform IN ('ios', 'android')),
    push_token   varchar(255) NOT NULL,
    app_version  varchar(20)  NULL,
    os_version   varchar(20)  NULL,
    last_seen_at timestamptz  NOT NULL DEFAULT now(),
    created_at   timestamptz  NOT NULL DEFAULT now(),
    created_by   uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at   timestamptz  NOT NULL DEFAULT now(),
    updated_by   uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT usr_user_devices_push_token_key UNIQUE (push_token)
);

CREATE TRIGGER usr_user_devices_set_updated_at
    BEFORE UPDATE ON usr_user_devices
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- A.3 usr_sessions  (opaque-token sessions; pre-Auth0)
-- The id UUID is the bearer token sent in `Authorization: Session <id>`.
CREATE TABLE usr_sessions (
    id           uuid        PRIMARY KEY DEFAULT uuidv7(),
    user_id      uuid        NOT NULL REFERENCES usr_users(id) ON DELETE CASCADE,
    created_at   timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz NOT NULL DEFAULT now(),
    revoked_at   timestamptz NULL
);

CREATE INDEX usr_sessions_user_id_idx ON usr_sessions(user_id);

-- =============================================================================
-- Section B — loc_*  (location)
-- =============================================================================

-- B.1 loc_neighborhoods  (no soft-delete; uses is_active flag)
CREATE TABLE loc_neighborhoods (
    id          uuid          PRIMARY KEY DEFAULT uuidv7(),
    slug        varchar(60)   NOT NULL,
    name        jsonb         NOT NULL CHECK (name ? 'en' AND name ? 'ar'),
    center_lat  numeric(9, 6) NULL CHECK (center_lat BETWEEN -90  AND 90),
    center_lng  numeric(9, 6) NULL CHECK (center_lng BETWEEN -180 AND 180),
    sort_order  integer       NOT NULL DEFAULT 0,
    is_active   smallint      NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at  timestamptz   NOT NULL DEFAULT now(),
    created_by  uuid          NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at  timestamptz   NOT NULL DEFAULT now(),
    updated_by  uuid          NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT loc_neighborhoods_slug_key UNIQUE (slug)
);

CREATE TRIGGER loc_neighborhoods_set_updated_at
    BEFORE UPDATE ON loc_neighborhoods
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section C — cat_*  (catalog)
-- =============================================================================

-- C.1 cat_categories  (self-ref parent; no soft-delete; uses is_active)
CREATE TABLE cat_categories (
    id         uuid        PRIMARY KEY DEFAULT uuidv7(),
    slug       varchar(60) NOT NULL,
    name       jsonb       NOT NULL CHECK (name ? 'en' AND name ? 'ar'),
    icon_name  varchar(60) NULL,
    parent_id  uuid        NULL REFERENCES cat_categories(id) ON DELETE RESTRICT,
    sort_order integer     NOT NULL DEFAULT 0,
    is_active  smallint    NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT cat_categories_slug_key UNIQUE (slug)
);

CREATE TRIGGER cat_categories_set_updated_at
    BEFORE UPDATE ON cat_categories
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- C.2 cat_conditions
CREATE TABLE cat_conditions (
    id         uuid        PRIMARY KEY DEFAULT uuidv7(),
    slug       varchar(40) NOT NULL,
    name       jsonb       NOT NULL CHECK (name ? 'en' AND name ? 'ar'),
    sort_order integer     NOT NULL DEFAULT 0,
    is_active  smallint    NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT cat_conditions_slug_key UNIQUE (slug)
);

CREATE TRIGGER cat_conditions_set_updated_at
    BEFORE UPDATE ON cat_conditions
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- C.3 cat_category_attributes  (CASCADE: tied to its category)
CREATE TABLE cat_category_attributes (
    id            uuid        PRIMARY KEY DEFAULT uuidv7(),
    category_id   uuid        NOT NULL REFERENCES cat_categories(id) ON DELETE CASCADE,
    key           varchar(40) NOT NULL,
    name          jsonb       NOT NULL CHECK (name ? 'en' AND name ? 'ar'),
    data_type     varchar(10) NOT NULL CHECK (data_type IN ('string', 'number', 'enum', 'bool')),
    is_required   smallint    NOT NULL DEFAULT 0 CHECK (is_required IN (0, 1)),
    enum_options  jsonb       NULL,
    unit          varchar(16) NULL,
    sort_order    integer     NOT NULL DEFAULT 0,
    is_active     smallint    NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at    timestamptz NOT NULL DEFAULT now(),
    created_by    uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at    timestamptz NOT NULL DEFAULT now(),
    updated_by    uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT cat_category_attributes_category_key_key UNIQUE (category_id, key)
);

CREATE TRIGGER cat_category_attributes_set_updated_at
    BEFORE UPDATE ON cat_category_attributes
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section D — lst_*  (listings)
-- =============================================================================

-- D.1 lst_listings
CREATE TABLE lst_listings (
    id                  uuid           PRIMARY KEY DEFAULT uuidv7(),
    seller_id           uuid           NOT NULL REFERENCES usr_users(id)         ON DELETE RESTRICT,
    category_id         uuid           NOT NULL REFERENCES cat_categories(id)    ON DELETE RESTRICT,
    condition_id        uuid           NOT NULL REFERENCES cat_conditions(id)    ON DELETE RESTRICT,
    neighborhood_id     uuid           NOT NULL REFERENCES loc_neighborhoods(id) ON DELETE RESTRICT,
    title               jsonb          NOT NULL CHECK (title       ? 'original' AND title       ? 'en' AND title       ? 'ar'),
    description         jsonb          NOT NULL CHECK (description ? 'original' AND description ? 'en' AND description ? 'ar'),
    price_aed           numeric(12, 2) NOT NULL CHECK (price_aed          >= 0),
    previous_price_aed  numeric(12, 2) NULL     CHECK (previous_price_aed >= 0),
    accept_offers       smallint       NOT NULL DEFAULT 1 CHECK (accept_offers IN (0, 1)),
    has_pickup          smallint       NOT NULL DEFAULT 0 CHECK (has_pickup    IN (0, 1)),
    pickup_note         varchar(200)   NULL,
    attributes          jsonb          NOT NULL DEFAULT '{}'::jsonb,
    status              varchar(20)    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'sold')),
    sold_at             timestamptz    NULL,
    sold_to_user_id     uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    sold_price_aed      numeric(12, 2) NULL CHECK (sold_price_aed >= 0),
    published_at        timestamptz    NULL,
    created_at          timestamptz    NOT NULL DEFAULT now(),
    created_by          uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at          timestamptz    NOT NULL DEFAULT now(),
    updated_by          uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at          timestamptz    NULL,
    deleted_by          uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER lst_listings_set_updated_at
    BEFORE UPDATE ON lst_listings
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- D.2 lst_listing_photos  (CASCADE: hard-delete with parent)
CREATE TABLE lst_listing_photos (
    id          uuid         PRIMARY KEY DEFAULT uuidv7(),
    listing_id  uuid         NOT NULL REFERENCES lst_listings(id) ON DELETE CASCADE,
    url         varchar(500) NOT NULL,
    thumb_url   varchar(500) NULL,
    sort_order  smallint     NOT NULL DEFAULT 0,
    width       integer      NULL,
    height      integer      NULL,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    created_by  uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at  timestamptz  NOT NULL DEFAULT now(),
    updated_by  uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT lst_listing_photos_listing_sort_key UNIQUE (listing_id, sort_order)
);

CREATE TRIGGER lst_listing_photos_set_updated_at
    BEFORE UPDATE ON lst_listing_photos
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- D.3 lst_listing_daily_metrics  (CASCADE: rebuildable analytics)
CREATE TABLE lst_listing_daily_metrics (
    id             uuid        PRIMARY KEY DEFAULT uuidv7(),
    listing_id     uuid        NOT NULL REFERENCES lst_listings(id) ON DELETE CASCADE,
    metric_date    date        NOT NULL,
    view_count     integer     NOT NULL DEFAULT 0,
    save_count     integer     NOT NULL DEFAULT 0,
    message_count  integer     NOT NULL DEFAULT 0,
    offer_count    integer     NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now(),
    created_by     uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at     timestamptz NOT NULL DEFAULT now(),
    updated_by     uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT lst_listing_daily_metrics_listing_date_key UNIQUE (listing_id, metric_date)
);

CREATE TRIGGER lst_listing_daily_metrics_set_updated_at
    BEFORE UPDATE ON lst_listing_daily_metrics
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section E — eng_*  (engagement)
-- =============================================================================

-- E.1 eng_favorites  (hard delete; toggle = INSERT/DELETE; no updated_at, no trigger)
CREATE TABLE eng_favorites (
    id          uuid        PRIMARY KEY DEFAULT uuidv7(),
    user_id     uuid        NOT NULL REFERENCES usr_users(id)    ON DELETE RESTRICT,
    listing_id  uuid        NOT NULL REFERENCES lst_listings(id) ON DELETE RESTRICT,
    created_at  timestamptz NOT NULL DEFAULT now(),
    created_by  uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT eng_favorites_user_listing_key UNIQUE (user_id, listing_id)
);

-- =============================================================================
-- Section F — msg_*  (messaging)
-- =============================================================================

-- F.1 msg_conversations  (cross-FKs to msg_messages added in Section M)
CREATE TABLE msg_conversations (
    id                            uuid        PRIMARY KEY DEFAULT uuidv7(),
    listing_id                    uuid        NOT NULL REFERENCES lst_listings(id) ON DELETE RESTRICT,
    buyer_id                      uuid        NOT NULL REFERENCES usr_users(id)    ON DELETE RESTRICT,
    seller_id                     uuid        NOT NULL REFERENCES usr_users(id)    ON DELETE RESTRICT,
    last_message_at               timestamptz NULL,
    buyer_last_read_message_id    uuid        NULL,                                 -- FK in Section M
    seller_last_read_message_id   uuid        NULL,                                 -- FK in Section M
    created_at                    timestamptz NOT NULL DEFAULT now(),
    created_by                    uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at                    timestamptz NOT NULL DEFAULT now(),
    updated_by                    uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at                    timestamptz NULL,
    deleted_by                    uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT msg_conversations_triple_key UNIQUE (listing_id, buyer_id, seller_id)
);

CREATE TRIGGER msg_conversations_set_updated_at
    BEFORE UPDATE ON msg_conversations
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- F.2 msg_messages  (cross-FK to ofr_offers added in Section M)
CREATE TABLE msg_messages (
    id              uuid        PRIMARY KEY DEFAULT uuidv7(),
    conversation_id uuid        NOT NULL REFERENCES msg_conversations(id) ON DELETE RESTRICT,
    sender_id       uuid        NOT NULL REFERENCES usr_users(id)         ON DELETE RESTRICT,
    message_type    varchar(10) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'offer', 'system')),
    text            jsonb       NULL CHECK (text IS NULL OR (text ? 'original' AND text ? 'en' AND text ? 'ar')),
    offer_id        uuid        NULL,                                              -- FK in Section M
    created_at      timestamptz NOT NULL DEFAULT now(),
    created_by      uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at      timestamptz NOT NULL DEFAULT now(),
    updated_by      uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at      timestamptz NULL,
    deleted_by      uuid        NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER msg_messages_set_updated_at
    BEFORE UPDATE ON msg_messages
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section G — ofr_*  (offers)
-- =============================================================================

-- G.1 ofr_offers  (self-ref counter; soft-delete)
CREATE TABLE ofr_offers (
    id                    uuid           PRIMARY KEY DEFAULT uuidv7(),
    listing_id            uuid           NOT NULL REFERENCES lst_listings(id)       ON DELETE RESTRICT,
    conversation_id       uuid           NOT NULL REFERENCES msg_conversations(id)  ON DELETE RESTRICT,
    buyer_id              uuid           NOT NULL REFERENCES usr_users(id)          ON DELETE RESTRICT,
    seller_id             uuid           NOT NULL REFERENCES usr_users(id)          ON DELETE RESTRICT,
    amount_aed            numeric(12, 2) NOT NULL CHECK (amount_aed       >  0),
    listed_price_aed      numeric(12, 2) NOT NULL CHECK (listed_price_aed >= 0),
    status                varchar(20)    NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'countered', 'accepted', 'declined', 'expired')),
    expires_at            timestamptz    NOT NULL,
    pickup_at             timestamptz    NULL,
    responded_at          timestamptz    NULL,
    counter_of_offer_id   uuid           NULL REFERENCES ofr_offers(id) ON DELETE RESTRICT,
    created_at            timestamptz    NOT NULL DEFAULT now(),
    created_by            uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at            timestamptz    NOT NULL DEFAULT now(),
    updated_by            uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at            timestamptz    NULL,
    deleted_by            uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER ofr_offers_set_updated_at
    BEFORE UPDATE ON ofr_offers
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section H — wal_*  (wallet)
-- =============================================================================

-- H.1 wal_wallets  (1:1 with user; never deleted)
CREATE TABLE wal_wallets (
    id           uuid           PRIMARY KEY DEFAULT uuidv7(),
    user_id      uuid           NOT NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    balance_aed  numeric(12, 2) NOT NULL DEFAULT 0   CHECK (balance_aed >= 0),
    currency     varchar(3)     NOT NULL DEFAULT 'AED' CHECK (currency IN ('AED')),
    created_at   timestamptz    NOT NULL DEFAULT now(),
    created_by   uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at   timestamptz    NOT NULL DEFAULT now(),
    updated_by   uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    CONSTRAINT wal_wallets_user_key UNIQUE (user_id)
);

CREATE TRIGGER wal_wallets_set_updated_at
    BEFORE UPDATE ON wal_wallets
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- H.2 wal_wallet_transactions  (append-only: only created_at + created_by; no trigger)
CREATE TABLE wal_wallet_transactions (
    id                  uuid           PRIMARY KEY DEFAULT uuidv7(),
    wallet_id           uuid           NOT NULL REFERENCES wal_wallets(id) ON DELETE RESTRICT,
    direction           varchar(10)    NOT NULL CHECK (direction IN ('credit', 'debit')),
    amount_aed          numeric(12, 2) NOT NULL CHECK (amount_aed > 0),
    balance_after_aed   numeric(12, 2) NOT NULL CHECK (balance_after_aed >= 0),
    reason              varchar(40)    NOT NULL CHECK (reason IN ('welcome_credit', 'boost_purchase', 'admin_adjust', 'refund')),
    reference_type      varchar(20)    NULL,
    reference_id        uuid           NULL,
    note                varchar(255)   NULL,
    created_at          timestamptz    NOT NULL DEFAULT now(),
    created_by          uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

-- =============================================================================
-- Section I — bst_*  (boost)
-- =============================================================================

-- I.1 bst_boosts  (append-only: only created_at + created_by; no trigger)
CREATE TABLE bst_boosts (
    id                       uuid           PRIMARY KEY DEFAULT uuidv7(),
    listing_id               uuid           NOT NULL REFERENCES lst_listings(id) ON DELETE RESTRICT,
    user_id                  uuid           NOT NULL REFERENCES usr_users(id)    ON DELETE RESTRICT,
    package                  varchar(20)    NOT NULL CHECK (package IN ('boost_24h', 'boost_7d')),
    duration_hours           integer        NOT NULL CHECK (duration_hours > 0),
    starts_at                timestamptz    NOT NULL DEFAULT now(),
    ends_at                  timestamptz    NOT NULL,
    price_aed                numeric(12, 2) NOT NULL CHECK (price_aed >= 0),
    source                   varchar(20)    NOT NULL CHECK (source IN ('wallet', 'psp')),
    wallet_transaction_id    uuid           NULL REFERENCES wal_wallet_transactions(id) ON DELETE RESTRICT,
    created_at               timestamptz    NOT NULL DEFAULT now(),
    created_by               uuid           NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

-- =============================================================================
-- Section J — mod_*  (moderation)
-- =============================================================================

-- J.1 mod_reports
CREATE TABLE mod_reports (
    id                    uuid         PRIMARY KEY DEFAULT uuidv7(),
    reporter_user_id      uuid         NOT NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    reportable_type       varchar(20)  NOT NULL CHECK (reportable_type IN ('listing', 'user', 'message')),
    reportable_id         uuid         NOT NULL,                                       -- polymorphic; no FK
    reason                varchar(40)  NOT NULL CHECK (reason IN ('spam', 'offensive', 'fraud', 'duplicate', 'prohibited', 'other')),
    detail                varchar(500) NULL,
    status                varchar(20)  NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
    resolved_by_user_id   uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    resolved_at           timestamptz  NULL,
    resolution_note       varchar(500) NULL,
    created_at            timestamptz  NOT NULL DEFAULT now(),
    created_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at            timestamptz  NOT NULL DEFAULT now(),
    updated_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    deleted_at            timestamptz  NULL,
    deleted_by            uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER mod_reports_set_updated_at
    BEFORE UPDATE ON mod_reports
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- J.2 mod_moderation_actions  (append-only: only created_at + created_by; no trigger)
CREATE TABLE mod_moderation_actions (
    id              uuid         PRIMARY KEY DEFAULT uuidv7(),
    admin_user_id   uuid         NOT NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    action          varchar(40)  NOT NULL CHECK (action IN (
                        'verify_user', 'unverify_user',
                        'remove_listing', 'restore_listing',
                        'ban_user', 'unban_user',
                        'dismiss_report', 'resolve_report',
                        'adjust_wallet'
                    )),
    target_type     varchar(20)  NOT NULL CHECK (target_type IN ('user', 'listing', 'report', 'wallet', 'message')),
    target_id       uuid         NOT NULL,                                             -- polymorphic; no FK
    note            varchar(500) NULL,
    meta            jsonb        NOT NULL DEFAULT '{}'::jsonb,
    created_at      timestamptz  NOT NULL DEFAULT now(),
    created_by      uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

-- =============================================================================
-- Section K — nty_*  (notifications)
-- =============================================================================

-- K.1 nty_notifications  (hard delete; no soft-delete columns)
CREATE TABLE nty_notifications (
    id              uuid         PRIMARY KEY DEFAULT uuidv7(),
    user_id         uuid         NOT NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    type            varchar(40)  NOT NULL CHECK (type IN (
                        'new_message', 'new_offer',
                        'offer_accepted', 'offer_declined', 'offer_countered',
                        'listing_sold', 'listing_approved', 'listing_removed',
                        'wallet_credit', 'boost_expired'
                    )),
    title           jsonb        NOT NULL CHECK (title ? 'en' AND title ? 'ar'),
    body            jsonb        NOT NULL CHECK (body  ? 'en' AND body  ? 'ar'),
    action_url      varchar(500) NULL,
    reference_type  varchar(20)  NULL,
    reference_id    uuid         NULL,
    read_at         timestamptz  NULL,
    created_at      timestamptz  NOT NULL DEFAULT now(),
    created_by      uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at      timestamptz  NOT NULL DEFAULT now(),
    updated_by      uuid         NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER nty_notifications_set_updated_at
    BEFORE UPDATE ON nty_notifications
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section L — trn_*  (translation)
-- =============================================================================

-- L.1 trn_translation_jobs  (hard delete; cleanup-friendly)
CREATE TABLE trn_translation_jobs (
    id              uuid          PRIMARY KEY DEFAULT uuidv7(),
    target_table    varchar(40)   NOT NULL CHECK (target_table IN ('lst_listings', 'msg_messages', 'nty_notifications')),
    target_id       uuid          NOT NULL,
    target_field    varchar(40)   NOT NULL,
    source_lang     varchar(8)    NULL,
    source_text     varchar(4000) NOT NULL,
    status          varchar(20)   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'done', 'failed')),
    attempt_count   smallint      NOT NULL DEFAULT 0,
    last_error      varchar(500)  NULL,
    started_at      timestamptz   NULL,
    completed_at    timestamptz   NULL,
    created_at      timestamptz   NOT NULL DEFAULT now(),
    created_by      uuid          NULL REFERENCES usr_users(id) ON DELETE RESTRICT,
    updated_at      timestamptz   NOT NULL DEFAULT now(),
    updated_by      uuid          NULL REFERENCES usr_users(id) ON DELETE RESTRICT
);

CREATE TRIGGER trn_translation_jobs_set_updated_at
    BEFORE UPDATE ON trn_translation_jobs
    FOR EACH ROW EXECUTE FUNCTION souq.trg_set_updated_at();

-- =============================================================================
-- Section M — Deferred / circular FKs
-- =============================================================================

-- usr_users → loc_neighborhoods (forward dependency: loc_* defined in section B)
ALTER TABLE usr_users
    ADD CONSTRAINT usr_users_home_neighborhood_fk
    FOREIGN KEY (home_neighborhood_id) REFERENCES loc_neighborhoods(id) ON DELETE RESTRICT;

-- msg_conversations.{buyer,seller}_last_read_message_id → msg_messages
ALTER TABLE msg_conversations
    ADD CONSTRAINT msg_conversations_buyer_last_read_fk
    FOREIGN KEY (buyer_last_read_message_id) REFERENCES msg_messages(id) ON DELETE RESTRICT;

ALTER TABLE msg_conversations
    ADD CONSTRAINT msg_conversations_seller_last_read_fk
    FOREIGN KEY (seller_last_read_message_id) REFERENCES msg_messages(id) ON DELETE RESTRICT;

-- msg_messages.offer_id → ofr_offers
ALTER TABLE msg_messages
    ADD CONSTRAINT msg_messages_offer_fk
    FOREIGN KEY (offer_id) REFERENCES ofr_offers(id) ON DELETE RESTRICT;

-- =============================================================================
-- End of schema
-- =============================================================================
