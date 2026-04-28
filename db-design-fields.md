# Souq Dubai — Aşama 2: Field-Level Şema Tasarımı

## Context

**Ne yapıyoruz:** [db-design.md](./db-design.md) içinde Aşama 1 (tablo envanteri, 20 MVP tablo) tamamlandı. Bu dosya Aşama 2: her tablo için kolon-bazlı tasarım — tip, NULL'ability, default, constraint.

**Neden:** Backend'e geçiş için DDL üretebilir hale gelmek. Frontend prototipindeki tüm UI veri ihtiyaçları frontend taramasıyla çıkarıldı (rating, sold_count, accept_offers, attributes JSONB, vb).

**Kurallar:**
1. Modül modül, sıralı (A → L).
2. **Gerekmedikçe `text` kullanma** — `character varying(N)` kullan; sadece gerçekten sınırsız uzunluk gerekirse `text`.
3. **NULL olmaması gerekiyorsa NOT NULL yap.**

---

## Yeni Konvansiyonlar (Aşama 2 için)

### Varchar boyut katalogu

| Anlamsal alan | Tip | Gerekçe |
|---|---|---|
| Auth0 sub | `varchar(64)` | `auth0\|...`, `sms\|...` formatı ~30-50 char |
| Email | `varchar(254)` | RFC 5321 max |
| Telefon (E.164) | `varchar(20)` | `+9715xxxxxxxx` + tampon |
| Display name | `varchar(80)` | İnsan ad-soyadı |
| Handle/username | `varchar(32)` | URL-safe kullanıcı adı |
| Slug | `varchar(60)` | URL slug |
| Bio | `varchar(500)` | Profil bio |
| Şehir/mahalle adı | `varchar(80)` | i18n JSONB içindeki string max |
| İlan başlığı (UGC string) | UGC JSONB içinde — uzunluk app-side validate (120 char) |
| Açıklama (UGC) | UGC JSONB içinde — uzunluk app-side validate (4000 char) |
| Mesaj metni (UGC) | UGC JSONB içinde — uzunluk app-side validate (2000 char) |
| Foto URL / S3 key | `varchar(500)` | S3 key + parametreler |
| Status enum | `varchar(20)` + CHECK | Genelde 8-12 char yeterli |
| Action/reason enum | `varchar(40)` + CHECK | Daha geniş enum'lar |
| Para birimi | `varchar(3)` + CHECK | ISO-4217, sadece `AED` v1 |
| Push token (FCM/APNs) | `varchar(255)` | APNs ~64 hex, FCM 152-200 |
| App/OS version string | `varchar(20)` | `17.4.1`, `Android 14` |
| Icon adı | `varchar(60)` | Frontend ikon mapping |
| Note/detail (kısa) | `varchar(255)` | Tek satır not |
| Note/detail (uzun) | `varchar(500)` | Çok satırlı kısa not |
| Error message | `varchar(500)` | API hata mesajları |
| Lang code | `varchar(8)` | `en`, `ar`, `en-US` |
| Hex renk | `varchar(7)` | `#RRGGBB` |

### Para
- Tüm para alanları: `numeric(12,2)` — AED, fils için 2 decimal, max 9.999.999.999,99 AED (yeterli).
- Kolon sonu `_aed` suffix'i (gelecekte multi-currency için).
- Negatif olamaz: `CHECK (kolon_adi >= 0)`. Transaction `amount_aed`'i için `> 0`.

### Tarih/zaman
- Tüm zaman damgaları: `TIMESTAMPTZ` (PG default UTC; offset client tarafında).
- Tarih (gün): `DATE` (örn: `metric_date`).

### NULL/NOT NULL kararı
- **NOT NULL** default — açıkça optional UI alanı varsa NULL.
- FK'ler ilişki zorunluysa NOT NULL, değilse NULL (örn `sold_to_user_id` NULL).
- Audit field'ları: `created_at`/`updated_at` NOT NULL (DEFAULT `now()`); `created_by`/`updated_by` NULL (sistem üretiminde).
- Soft delete: `deleted_at`/`deleted_by` NULL.

### CHECK constraint isimlendirme
- `<tablo>_<kolon>_check` (PG default).
- Boolean smallint: `CHECK (<kolon> IN (0,1))`.
- Status enum: `CHECK (<kolon> IN ('a','b','c'))`.

### Index
- Her FK için index (PG FK index'i otomatik koymaz).
- UNIQUE constraint'ler tabloda belirtilecek.
- Composite index/perf-tuning Aşama 3'te (DDL üretiminde).

---

## Modül modül field tasarımı

Format: `kolon_adı | tip | null | default | not`. Audit field'ları (created_at/created_by/updated_at/updated_by) ve soft delete (deleted_at/deleted_by) **konvansiyondan gelir** — tablo bazında tekrar yazılmaz, sadece append-only/no-soft istisnaları belirtilir.

---

### A. `usr_` — Kimlik & Erişim

#### A.1 `usr_users`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| auth0_sub | varchar(64) | NOT NULL | — | UNIQUE |
| email | varchar(254) | NULL | — | UNIQUE; admin için zorunlu, mobil için opsiyonel |
| phone | varchar(20) | NULL | — | UNIQUE; mobil için zorunlu, admin için opsiyonel; E.164 format |
| name | varchar(80) | NOT NULL | — | Display name |
| handle | varchar(32) | NOT NULL | — | UNIQUE; URL-safe; CHECK regex `^[a-z0-9._]+$` |
| avatar_url | varchar(500) | NULL | — | S3 key |
| avatar_initial | varchar(2) | NULL | — | Fallback display |
| bio | varchar(500) | NULL | — | |
| home_neighborhood_id | uuid | NULL | — | FK → `loc_neighborhoods.id` ON DELETE RESTRICT |
| joined_year | smallint | NOT NULL | `extract(year from now())` | UI: "Joined 2024" |
| is_verified | smallint | NOT NULL | 0 | CHECK IN (0,1); admin elle açar |
| is_admin | smallint | NOT NULL | 0 | CHECK IN (0,1); Auth0 claims SoT |
| is_super_admin | smallint | NOT NULL | 0 | CHECK IN (0,1) |
| is_moderator | smallint | NOT NULL | 0 | CHECK IN (0,1) |
| is_new_seller | smallint | NOT NULL | 1 | CHECK IN (0,1); ilk sale'den sonra 0 |
| last_seen_at | timestamptz | NULL | — | Aktivite tracking |

**Audit:** standart 4 + soft delete 2.
**UNIQUE:** `(handle)`, `(email) WHERE deleted_at IS NULL`, `(phone) WHERE deleted_at IS NULL`, `(auth0_sub)`. **Index:** Aşama 3.

#### A.2 `usr_user_devices`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| user_id | uuid | NOT NULL | — | FK → `usr_users.id` ON DELETE RESTRICT (parent soft-delete; CASCADE anlamsız) |
| platform | varchar(10) | NOT NULL | — | CHECK IN ('ios','android') |
| push_token | varchar(255) | NOT NULL | — | UNIQUE (rotation: silinip yeniden eklenir) |
| app_version | varchar(20) | NULL | — | |
| os_version | varchar(20) | NULL | — | |
| last_seen_at | timestamptz | NOT NULL | `now()` | |

**Audit:** standart 4. **Soft delete YOK** (hard delete; token rotation). **UNIQUE:** `(push_token)`. **Index:** Aşama 3.

---

### B. `loc_` — Lokasyon

#### B.1 `loc_neighborhoods`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| slug | varchar(60) | NOT NULL | — | UNIQUE; örn `dubai-marina` |
| name | jsonb | NOT NULL | — | `{en, ar}`; CHECK `?` operatörü ile en+ar var |
| center_lat | numeric(9,6) | NULL | — | -90..90 |
| center_lng | numeric(9,6) | NULL | — | -180..180 |
| sort_order | integer | NOT NULL | 0 | UI sıralaması |
| is_active | smallint | NOT NULL | 1 | CHECK IN (0,1) |

**Audit:** standart 4. **Soft delete YOK** (`is_active` flag). **UNIQUE:** `(slug)`. **Index:** Aşama 3.

---

### C. `cat_` — Katalog

#### C.1 `cat_categories`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| slug | varchar(60) | NOT NULL | — | UNIQUE; örn `furniture` |
| name | jsonb | NOT NULL | — | `{en, ar}` |
| icon_name | varchar(60) | NULL | — | Frontend ikon mapping |
| parent_id | uuid | NULL | — | FK → `cat_categories.id` self-ref; v1 flat, v2 alt-kategori |
| sort_order | integer | NOT NULL | 0 | |
| is_active | smallint | NOT NULL | 1 | CHECK IN (0,1) |

**Audit:** standart 4. **Soft delete YOK** (`is_active`). **UNIQUE:** `(slug)`. **Index:** Aşama 3.

#### C.2 `cat_conditions`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| slug | varchar(40) | NOT NULL | — | UNIQUE; `brand_new`, `like_new`, `good`, `fair` |
| name | jsonb | NOT NULL | — | `{en, ar}` |
| sort_order | integer | NOT NULL | 0 | |
| is_active | smallint | NOT NULL | 1 | CHECK IN (0,1) |

**Audit:** standart 4. **Soft delete YOK** (`is_active`). **UNIQUE:** `(slug)`. **Index:** Aşama 3.

#### C.3 `cat_category_attributes`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| category_id | uuid | NOT NULL | — | FK → `cat_categories.id` ON DELETE CASCADE |
| key | varchar(40) | NOT NULL | — | snake_case; örn `mileage`, `bedrooms` |
| name | jsonb | NOT NULL | — | `{en, ar}` |
| data_type | varchar(10) | NOT NULL | — | CHECK IN ('string','number','enum','bool') |
| is_required | smallint | NOT NULL | 0 | CHECK IN (0,1) |
| enum_options | jsonb | NULL | — | `[{value, label_en, label_ar}]`; sadece `data_type='enum'` ise |
| unit | varchar(16) | NULL | — | `km`, `m²`, `AED` (UI suffix) |
| sort_order | integer | NOT NULL | 0 | |
| is_active | smallint | NOT NULL | 1 | CHECK IN (0,1) |

**Audit:** standart 4. **Soft delete YOK** (`is_active`). **UNIQUE:** `(category_id, key)`. **Index:** Aşama 3.

---

### D. `lst_` — İlan

#### D.1 `lst_listings`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| seller_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| category_id | uuid | NOT NULL | — | FK → `cat_categories.id` |
| condition_id | uuid | NOT NULL | — | FK → `cat_conditions.id` |
| neighborhood_id | uuid | NOT NULL | — | FK → `loc_neighborhoods.id` |
| title | jsonb | NOT NULL | — | `{original, en, ar}`; max 120 char (app-side) |
| description | jsonb | NOT NULL | — | `{original, en, ar}`; max 4000 char (app-side) |
| price_aed | numeric(12,2) | NOT NULL | — | CHECK ≥ 0 |
| previous_price_aed | numeric(12,2) | NULL | — | UI'da "was 950" — discount badge için |
| accept_offers | smallint | NOT NULL | 1 | CHECK IN (0,1) |
| has_pickup | smallint | NOT NULL | 0 | CHECK IN (0,1) |
| pickup_note | varchar(200) | NULL | — | UI'da "Pickup near Marina Walk" |
| attributes | jsonb | NOT NULL | `'{}'::jsonb` | Kategori-özel `{mileage:12000, year:2020}` |
| status | varchar(20) | NOT NULL | `'draft'` | CHECK IN ('draft','active','paused','sold'); **`deleted` yok** — soft delete `deleted_at` kolonuyla işaretlenir |
| sold_at | timestamptz | NULL | — | status=sold olunca dolar |
| sold_to_user_id | uuid | NULL | — | FK → `usr_users.id` |
| sold_price_aed | numeric(12,2) | NULL | — | Counter-offer için snapshot |
| published_at | timestamptz | NULL | — | İlk active'e geçiş zamanı |

> **Boost durumu:** `is_boosted`/`boost_expires_at` denorm kolonları **yok**. Aktif boost `bst_boosts` ile JOIN edilerek türetilir.
>
> **Sayaçlar (view_count/save_count/message_count/offer_count):** lst_listings'te denorm **yok**. `lst_listing_daily_metrics` SUM'undan türetilir. Read-path hotspot olursa Aşama 3'te denorm + trigger ekleyebiliriz.

**Audit:** standart 4 + soft delete 2. **Index:** Aşama 3.

#### D.2 `lst_listing_photos`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` ON DELETE CASCADE |
| url | varchar(500) | NOT NULL | — | S3 key |
| thumb_url | varchar(500) | NULL | — | İmaj resize'den sonra |
| sort_order | smallint | NOT NULL | 0 | 0=cover |
| width | integer | NULL | — | EXIF'den |
| height | integer | NULL | — | |

**Audit:** standart 4. **Soft delete YOK** (CASCADE). **UNIQUE:** `(listing_id, sort_order)`. **Index:** Aşama 3.

#### D.3 `lst_listing_daily_metrics`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` ON DELETE CASCADE |
| metric_date | date | NOT NULL | — | UTC gün |
| view_count | integer | NOT NULL | 0 | |
| save_count | integer | NOT NULL | 0 | |
| message_count | integer | NOT NULL | 0 | |
| offer_count | integer | NOT NULL | 0 | |

**Audit:** standart 4. **Soft delete YOK** (yeniden hesaplanır). **UNIQUE:** `(listing_id, metric_date)`. **Index:** Aşama 3.

---

### E. `eng_` — Engagement

#### E.1 `eng_favorites`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| user_id | uuid | NOT NULL | — | FK → `usr_users.id` ON DELETE RESTRICT (parent soft-delete) |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` ON DELETE RESTRICT (parent soft-delete) |

**Audit:** sadece `created_at` + `created_by` (update yok, hard delete; toggle = INSERT/DELETE). **UNIQUE:** `(user_id, listing_id)`. **Index:** Aşama 3.

---

### F. `msg_` — Mesajlaşma

#### F.1 `msg_conversations`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` |
| buyer_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| seller_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| last_message_at | timestamptz | NULL | — | Inbox sıralaması; UI'da kritik (yoksa her thread'de SELECT MAX gerek) |
| buyer_last_read_message_id | uuid | NULL | — | FK → `msg_messages.id`; okundu işareti |
| seller_last_read_message_id | uuid | NULL | — | FK → `msg_messages.id` |

> **Çıkarıldı (türev):** `last_message_id`, `buyer_unread_count`, `seller_unread_count`, `has_active_offer` — hepsi `msg_messages` / `ofr_offers` üzerinden hesaplanır. Read-path hotspot olursa Aşama 3'te denorm + trigger.

**Audit:** standart 4 + soft delete 2. **UNIQUE:** `(listing_id, buyer_id, seller_id)`. **Index:** Aşama 3.

#### F.2 `msg_messages`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| conversation_id | uuid | NOT NULL | — | FK → `msg_conversations.id` ON DELETE RESTRICT |
| sender_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| message_type | varchar(10) | NOT NULL | `'text'` | CHECK IN ('text','offer','system') |
| text | jsonb | NULL | — | `{original, en, ar}`; type='text' ise zorunlu (app-validate); offer için NULL |
| offer_id | uuid | NULL | — | FK → `ofr_offers.id`; type='offer' ise zorunlu |

**Audit:** standart 4 + soft delete 2. **Index:** Aşama 3.

---

### G. `ofr_` — Teklif

#### G.1 `ofr_offers`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` |
| conversation_id | uuid | NOT NULL | — | FK → `msg_conversations.id` |
| buyer_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| seller_id | uuid | NOT NULL | — | FK → `usr_users.id` (snapshot) |
| amount_aed | numeric(12,2) | NOT NULL | — | CHECK > 0 |
| listed_price_aed | numeric(12,2) | NOT NULL | — | Snapshot (UI: "12% off ...") |
| status | varchar(20) | NOT NULL | `'new'` | CHECK IN ('new','countered','accepted','declined','expired') |
| expires_at | timestamptz | NOT NULL | — | UI'da "Expires 4h" |
| pickup_at | timestamptz | NULL | — | UI'da "today, 6pm" |
| responded_at | timestamptz | NULL | — | accept/decline/counter zamanı |
| counter_of_offer_id | uuid | NULL | — | FK → `ofr_offers.id` self; counter zinciri |

**Audit:** standart 4 + soft delete 2. **Index:** Aşama 3.

---

### H. `wal_` — Cüzdan

#### H.1 `wal_wallets`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| user_id | uuid | NOT NULL | — | UNIQUE; FK → `usr_users.id` |
| balance_aed | numeric(12,2) | NOT NULL | 0 | CHECK ≥ 0 |
| currency | varchar(3) | NOT NULL | `'AED'` | CHECK IN ('AED') |

**Audit:** standart 4. **Soft delete YOK** (asla silinmez). **UNIQUE:** `(user_id)`.

#### H.2 `wal_wallet_transactions` (append-only)

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| wallet_id | uuid | NOT NULL | — | FK → `wal_wallets.id` ON DELETE RESTRICT |
| direction | varchar(10) | NOT NULL | — | CHECK IN ('credit','debit') |
| amount_aed | numeric(12,2) | NOT NULL | — | CHECK > 0 |
| balance_after_aed | numeric(12,2) | NOT NULL | — | Transaction sonrası bakiye (audit) |
| reason | varchar(40) | NOT NULL | — | CHECK IN ('welcome_credit','boost_purchase','admin_adjust','refund') |
| reference_type | varchar(20) | NULL | — | `'boost'`, `'moderation_action'` |
| reference_id | uuid | NULL | — | İlgili kaydın id'si |
| note | varchar(255) | NULL | — | Admin elle adjust için açıklama |

**Audit:** sadece `created_at` + `created_by` (append-only; update/delete yok). **Index:** Aşama 3.

---

### I. `bst_` — Boost

#### I.1 `bst_boosts` (append-only)

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| listing_id | uuid | NOT NULL | — | FK → `lst_listings.id` |
| user_id | uuid | NOT NULL | — | FK → `usr_users.id` (satın alan) |
| package | varchar(20) | NOT NULL | — | CHECK IN ('boost_24h','boost_7d') |
| duration_hours | integer | NOT NULL | — | CHECK > 0 |
| starts_at | timestamptz | NOT NULL | `now()` | |
| ends_at | timestamptz | NOT NULL | — | `starts_at + duration_hours` |
| price_aed | numeric(12,2) | NOT NULL | — | CHECK ≥ 0 |
| source | varchar(20) | NOT NULL | — | CHECK IN ('wallet','psp'); v1: sadece `wallet` |
| wallet_transaction_id | uuid | NULL | — | FK → `wal_wallet_transactions.id`; source='wallet' ise NOT NULL (app-validate) |

> **Saf append-only:** Status kolonu **yok**. Aktiflik `now() BETWEEN starts_at AND ends_at` ile türetilir. **MVP'de admin-cancellation feature yok** — gerekirse Aşama 3'te `bst_boost_cancellations` ayrı tablosu eklenir.

**Audit:** sadece `created_at` + `created_by` (append-only). **Soft delete YOK**. **Index:** Aşama 3.

---

### J. `mod_` — Moderasyon

#### J.1 `mod_reports`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| reporter_user_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| reportable_type | varchar(20) | NOT NULL | — | CHECK IN ('listing','user','message') |
| reportable_id | uuid | NOT NULL | — | Polymorphic; FK yok (DB-level) |
| reason | varchar(40) | NOT NULL | — | CHECK IN (...) — **enum tahmin: validate edilmeli**; ön taslak: `'spam','offensive','fraud','duplicate','prohibited','other'` |
| detail | varchar(500) | NULL | — | Kullanıcının ek açıklaması |
| status | varchar(20) | NOT NULL | `'open'` | CHECK IN ('open','resolved','dismissed') |
| resolved_by_user_id | uuid | NULL | — | FK → `usr_users.id` (admin) |
| resolved_at | timestamptz | NULL | — | |
| resolution_note | varchar(500) | NULL | — | Admin notu |

**Audit:** standart 4 + soft delete 2. **Index:** Aşama 3.

#### J.2 `mod_moderation_actions` (append-only)

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| admin_user_id | uuid | NOT NULL | — | FK → `usr_users.id` |
| action | varchar(40) | NOT NULL | — | CHECK IN (...) — **enum tahmin: admin paneli speclendiğinde validate edilecek**; ön taslak: `'verify_user','unverify_user','remove_listing','restore_listing','ban_user','unban_user','dismiss_report','resolve_report','adjust_wallet'` |
| target_type | varchar(20) | NOT NULL | — | CHECK IN ('user','listing','report','wallet','message') |
| target_id | uuid | NOT NULL | — | Polymorphic |
| note | varchar(500) | NULL | — | |
| meta | jsonb | NOT NULL | `'{}'::jsonb` | Aksiyon-spesifik veri (eski/yeni değer) |

**Audit:** sadece `created_at` + `created_by` (append-only). **Index:** Aşama 3.

---

### K. `nty_` — Bildirim

#### K.1 `nty_notifications`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| user_id | uuid | NOT NULL | — | FK → `usr_users.id` ON DELETE RESTRICT (parent soft-delete) |
| type | varchar(40) | NOT NULL | — | CHECK IN (...) — **enum tahmin: bildirim spec'i belirginleşince validate**; ön taslak: `'new_message','new_offer','offer_accepted','offer_declined','offer_countered','listing_sold','listing_approved','listing_removed','wallet_credit','boost_expired'` |
| title | jsonb | NOT NULL | — | `{en, ar}` (template'ten render) |
| body | jsonb | NOT NULL | — | `{en, ar}` |
| action_url | varchar(500) | NULL | — | Deep link |
| reference_type | varchar(20) | NULL | — | İlgili entity tipi |
| reference_id | uuid | NULL | — | |
| read_at | timestamptz | NULL | — | |

**Audit:** standart 4. **Soft delete YOK** (hard delete; cleanup OK). **Index:** Aşama 3.

---

### L. `trn_` — Çeviri

#### L.1 `trn_translation_jobs`

| Kolon | Tip | Null | Default | Not |
|---|---|---|---|---|
| id | uuid | NOT NULL | `uuidv7()` | PK |
| target_table | varchar(40) | NOT NULL | — | CHECK IN ('lst_listings','msg_messages','nty_notifications') |
| target_id | uuid | NOT NULL | — | Polymorphic |
| target_field | varchar(40) | NOT NULL | — | `'title'`, `'description'`, `'text'`, `'body'` |
| source_lang | varchar(8) | NULL | — | `'en'`, `'ar'`, NULL=auto-detect |
| source_text | varchar(4000) | NOT NULL | — | Snapshot — kaynak satır soft-delete edilse bile worker çalışabilsin diye |
| status | varchar(20) | NOT NULL | `'pending'` | CHECK IN ('pending','running','done','failed') |
| attempt_count | smallint | NOT NULL | 0 | |
| last_error | varchar(500) | NULL | — | |
| started_at | timestamptz | NULL | — | |
| completed_at | timestamptz | NULL | — | |

**Audit:** standart 4. **Soft delete YOK** (hard delete; tamamlananlar temizlenir). **Index:** Aşama 3.

---

## Kararlar

1. **`bst_boosts` saf append-only (Aşama 1 sadık):** Status kolonu **yok**; aktiflik `now() BETWEEN starts_at AND ends_at` ile türetilir. MVP'de admin-cancellation feature yok — gerekirse Aşama 3'te `bst_boost_cancellations` ayrı tablosu eklenir.
2. **`lst_listings` denorm temiz:** `is_boosted`/`boost_expires_at` ve sayaçlar (view/save/message/offer_count) **yok** — JOIN/SUM ile türetilir. Read-path hotspot olursa Aşama 3'te denorm + trigger.
3. **`usr_users` denorm temiz:** `sold_count`, `total_earned_aed`, `rating_avg`, `typical_reply_minutes` **yok** — Aşama 1 kararına ("türetilir") sadık. Reviews v2'de gelince `rating_avg` eklenir.
4. **`usr_users.email` / `phone` UNIQUE:** PARTIAL `WHERE deleted_at IS NULL` — soft-delete'li hesabın email/phone'u yeni kullanıcıya geri açılır.
5. **JSONB i18n CHECK:** Lookup tablolarındaki `name jsonb` ve UGC tablolarındaki `{en,ar}` zorunlu alanlar için `CHECK (name ? 'en' AND name ? 'ar')` (UGC'de ek olarak `? 'original'`).
6. **UGC max length:** App-side validate (title 120, description 4000, message text 2000, bio 500). DB'de JSONB string length CHECK koymayız.
7. **`lst_listings.previous_price_aed`:** Satıcının elle güncellediği promosyonel "was-price"; ilk-yayın snapshot'ı **değil**.
8. **Soft-delete edilmiş parent → child FK:** Hard-delete child'lar için `ON DELETE RESTRICT` (CASCADE anlamsız — parent fiziksel silinmiyor). Cleanup ayrı (Aşama 3).
9. **`lst_listings.status`:** `'deleted'` değeri **yok** — soft delete sadece `deleted_at` üzerinden.
10. **Index tasarımı: Aşama 3.** Bu doküman sadece kolonlar, tipler, NULL'ability, default, CHECK, FK ve UNIQUE üretiyor.

---

## Aşama 3'e Bırakılan / Açık

- **Enum içerikleri** (`mod_reports.reason`, `mod_moderation_actions.action`, `nty_notifications.type`) — admin paneli + bildirim spec'i hazır olunca lock'lanır; şu an "ön taslak" notuyla.
- **PostgreSQL sürümü** (Aşama 1'de açık) — `uuidv7()` PG17 native; eski sürümde extension veya app-side.
- **Index tasarımı** — query path'leri belirginleştikten sonra Aşama 3'te.
- **Trigger / view DDL** (özellikle `updated_at` trigger, boost JOIN view) — Aşama 3.
- **Migration tooling** (Flyway / sqitch / app migrations) — kararlaştırılmadı.
