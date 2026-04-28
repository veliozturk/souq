# Souq Dubai — Veritabanı Tasarımı (Aşama 1: Tablo Envanteri)

## Context

**Ne yapıyoruz:** Dubai pazarı için Letgo benzeri (C2C ikinci el pazaryeri) uygulamasının veri modelini tasarlıyoruz.

**Neden şimdi:** Mevcut ön yüz (`/Users/veliozturk/projects/souq1`) bir prototip — tüm veri `.jsx` dosyaları içinde hard-coded. Mock'lardan gerçek backend'e geçiş için önce kapsamlı bir şema çıkarmalıyız. Yaklaşım iteratif: **önce tablo listesi, sonra field'lar**.

**Kapsam:**
- **Son kullanıcı kanalı:** sadece mobil (iOS/Android) — web son kullanıcı yok.
- **Admin kanalı:** web tabanlı admin paneli.
- **Coğrafya:** sadece Dubai (UAE). Diğer emirate'ler bugünün scope'unda değil.

---

## Konvansiyonlar

**Veritabanı:** PostgreSQL (sürüm: 17+ önerilir, native `uuidv7()` için).

**İsimlendirme:**
- **Tablo:** `<modul_prefiksi>_<adı>` formatı, **tamamen snake_case**. Örn: `usr_users`, `lst_listing_photos`, `wal_wallet_transactions`.
- **Sütun:** saf snake_case. Örn: `created_at`, `auth0_sub`, `accept_offers`, `is_verified`.
- PG identifier folding ile uyumlu — quoting gerek yok, raw SQL temiz: `SELECT id, created_at FROM lst_listings WHERE is_active = 1`.

**Modül prefiks tablosu:**
| Prefix | Modül |
|---|---|
| `usr_` | Kullanıcı + cihaz |
| `loc_` | Lokasyon (mahalle) |
| `cat_` | Katalog (kategori, kondisyon, attribute tanımları) |
| `lst_` | İlan + foto + metrik |
| `eng_` | Engagement (favori) |
| `msg_` | Mesajlaşma (konuşma + mesaj) |
| `ofr_` | Teklif |
| `wal_` | Cüzdan + ledger |
| `bst_` | Boost (promosyon) |
| `mod_` | Moderasyon (rapor + audit) |
| `nty_` | Bildirim |
| `trn_` | Çeviri |

**PK:**
- Tip: **UUID v7** (sequential — index locality + zaman sıralı). PG 17 native `uuidv7()`; eski sürümde `pg_uuidv7` extension veya app tarafında üretim.
- Sütun adı: `id` (her tabloda).

**Audit field'ları (her tabloda, ledger hariç):**
- `created_at` — `TIMESTAMPTZ NOT NULL DEFAULT now()`
- `created_by` — `UUID NULL` (FK → `usr_users.id`; sistem-üretiminde NULL)
- `updated_at` — `TIMESTAMPTZ NOT NULL DEFAULT now()` (trigger ile güncellenir)
- `updated_by` — `UUID NULL` (FK → `usr_users.id`)

**Append-only / immutable tablolar** (sadece `created_at` + `created_by`, update yok):
- `wal_wallet_transactions` — finansal ledger
- `mod_moderation_actions` — admin audit log
- `bst_boosts` — finansal kayıt (durum değişimi için ayrı satır, mevcut satır immutable)

**Boolean konvansiyonu:**
- Tip: `SMALLINT NOT NULL DEFAULT 0` (0 = false, 1 = true).
- Constraint: her boolean kolonda `CHECK (kolon_adi IN (0, 1))`.
- Naming: `is_*` veya `has_*` öneki (örn: `is_verified`, `is_admin`, `accept_offers`, `has_pickup`).

**Soft delete politikası:**

| Tablo | Strateji | Neden |
|---|---|---|
| `usr_users` | Soft (`deleted_at`, `deleted_by`) | Moderasyon + dispute tarihçesi |
| `usr_user_devices` | Hard | Token rotasyonu, eski cihazlar atılır |
| `loc_neighborhoods` | `is_active` flag | Catalog data; semantik olarak deactivate, delete değil |
| `cat_categories` | `is_active` flag | Aynı |
| `cat_conditions` | `is_active` flag | Aynı |
| `cat_category_attributes` | `is_active` flag | Aynı |
| `lst_listings` | Soft | Audit + moderasyon + sold history |
| `lst_listing_photos` | Hard | Listing ile cascade; tek tek silme normal |
| `lst_listing_daily_metrics` | Hard | Analytics; gerekirse yeniden hesaplanır |
| `eng_favorites` | Hard | Audit ihtiyacı yok |
| `msg_conversations` | Soft | Legal/dispute retention |
| `msg_messages` | Soft | Aynı |
| `ofr_offers` | Soft | Audit trail |
| `wal_wallets` | **Asla silinmez** | Finansal hesap |
| `wal_wallet_transactions` | **Asla silinmez** (append-only) | Ledger integrity |
| `bst_boosts` | **Asla silinmez** (append-only) | Finansal kayıt |
| `mod_reports` | Soft | Audit |
| `mod_moderation_actions` | **Asla silinmez** (append-only) | Audit log |
| `nty_notifications` | Hard | Cleanup OK (eski bildirimler atılabilir) |
| `trn_translation_jobs` | Hard | Tamamlanan job'lar temizlenir |

**Soft delete pattern:** `deleted_at TIMESTAMPTZ NULL` + `deleted_by UUID NULL`. WHERE filter'ları default `deleted_at IS NULL` ile çalışır (view veya RLS ile zorlanabilir).

**Cascade ilkesi:** FK'ler **ON DELETE RESTRICT** default; cascade istenirse açıkça belirtilir (örn: `lst_listings → lst_listing_photos` CASCADE).

---

## Felsefe: 90/10 + MVP-vs-sonra

Doğrulanmış UI davranışını **bulletproof**, henüz doğrulanmamış / spekülatif olanı **işaretli ve ertelenmiş** tutuyoruz. Tablo listesini ikiye ayırıyoruz:

- **[MVP]** — UI'da çalışır halde, app'in canlıya çıkması için şart.
- **[sonra]** — UI'da ipucu var ama akış yok, ya da ileride büyürken eklenecek. Bugün yazmıyoruz; sadece nereye geleceğini biliyoruz.

---

## MVP Tabloları (20 tablo, v1 launch)

### A. Kimlik & Erişim (`usr_`)
**Auth:** Auth0 (mdp-frontend pattern). Mobil için Auth0 SMS Passwordless (OTP) + sosyal connection'lar (Apple, Google), admin web için Auth0 Universal Login (email). Tek Auth0 tenant, custom claims ile rol bilgisi JWT'ye işlenir.

| # | Tablo | Amaç |
|---|---|---|
| 1 | `usr_users` | Tek tablo — hem mobil son kullanıcı hem admin. Auth0'ın "shadow"u: `auth0_sub` linki + lokal profil verisi (name, handle, location, vb). Rol bilgisi `is_admin`/`is_super_admin`/`is_moderator` smallint flag'leri (Auth0 claims source-of-truth, DB read-side gating + admin paneli listing için). |
| 2 | `usr_user_devices` | Push notification için device token + platform (iOS/Android). |

### B. Lokasyon (`loc_`)
| # | Tablo | Amaç |
|---|---|---|
| 3 | `loc_neighborhoods` | Dubai mahalleleri (Marina, Downtown, JBR, …) + koordinat. Tek emirate olduğu için `loc_emirates` **[sonra]**. `name` JSONB `{en, ar}`. |

### C. Katalog (`cat_`)
| # | Tablo | Amaç |
|---|---|---|
| 4 | `cat_categories` | Ürün kategorileri (Furniture, Electronics, …). `parent_id` alanı bugünden konur ama flat kullanılır (alt-kategori v2). `name` JSONB `{en, ar}`. |
| 5 | `cat_conditions` | Ürün durumu (Brand new/Like new/Good/Fair). `name` JSONB `{en, ar}`. |
| 6 | `cat_category_attributes` | Kategori-özel attribute tanımları (örn: araba → mileage/year, ev → bedrooms/sqft). Tip (string/number/enum), required flag, sıralama, enum options JSONB. Listing'de değer `lst_listings.attributes` JSONB'sinde tutulur. |

### D. İlan (`lst_`)
| # | Tablo | Amaç |
|---|---|---|
| 7 | `lst_listings` | Ana ilan tablosu — `status` enum: draft/active/paused/sold/deleted. `title`/`description` UGC JSONB `{original, en, ar}`. `attributes` JSONB (kategori-özel değerler). Satış olduğunda `sold_to_user_id` + `sold_at` doldurulur. |
| 8 | `lst_listing_photos` | İlan fotoğrafları (sıralı, ilki cover). Listing'e CASCADE. |
| 9 | `lst_listing_daily_metrics` | İlan başına günlük rollup (views, saves, messages, offers). 7 günlük grafik için yeterli. |

### E. Engagement (`eng_`)
| # | Tablo | Amaç |
|---|---|---|
| 10 | `eng_favorites` | Kullanıcının kaydettiği ilanlar. Hard delete. |

### F. Mesajlaşma (`msg_`)
| # | Tablo | Amaç |
|---|---|---|
| 11 | `msg_conversations` | İlan + alıcı + satıcı üçlüsü için tek thread. Okundu takibi `buyer_last_read_message_id` / `seller_last_read_message_id` alanlarıyla burada. |
| 12 | `msg_messages` | Tek tek mesajlar (text veya offer referansı). `text` UGC JSONB `{original, en, ar}`. |

### G. Teklif (`ofr_`)
| # | Tablo | Amaç |
|---|---|---|
| 13 | `ofr_offers` | Fiyat teklifleri — kendi state machine'i (new/countered/accepted/declined/expired). `msg_messages`'a FK ile bağlı. |

### H. Cüzdan (`wal_`)
| # | Tablo | Amaç |
|---|---|---|
| 14 | `wal_wallets` | Kullanıcı cüzdan bakiyesi (1:1 kullanıcıyla). |
| 15 | `wal_wallet_transactions` | Cüzdan defteri — credit/debit hareketleri. **Append-only** (asla update/delete). |

### I. Boost (`bst_`)
| # | Tablo | Amaç |
|---|---|---|
| 16 | `bst_boosts` | Satın alınmış boost kayıtları — listing, başlangıç/bitiş, kaynak (cüzdan/PSP). **Append-only**. |

### J. Moderasyon (`mod_`)
| # | Tablo | Amaç |
|---|---|---|
| 17 | `mod_reports` | Kullanıcı şikayetleri (`reportable_type`: listing/user/message + reason). |
| 18 | `mod_moderation_actions` | Admin eylem audit günlüğü. **Append-only**. |

### K. Bildirim (`nty_`)
| # | Tablo | Amaç |
|---|---|---|
| 19 | `nty_notifications` | In-app bildirim merkezi (yeni mesaj/teklif/onay). v1 tüm tipler açık. `title`/`body` JSONB `{en, ar}` (template'ten render). |

### L. Çeviri (`trn_`)
| # | Tablo | Amaç |
|---|---|---|
| 20 | `trn_translation_jobs` | UGC (listings, messages) için async çeviri kuyruğu. Job düşer, worker harici API'ye çağrı atar, sonucu kaynak satıra yazar. Status: pending/done/failed. |

**MVP toplam: 20 tablo.**

---

## [sonra] — v2'ye Bırakılanlar

Spekülatif olduğu, akışı gösterilmediği veya v1'de basit alternatifle çözüldüğü için ertelenenler:

| Tablo (ileride) | Neden ertelendi |
|---|---|
| ~~`usr_otp_codes`~~ | **Auth0 yönetir** (Passwordless SMS Connection). |
| ~~`usr_user_sessions`~~ | **Auth0 yönetir** (JWT + session). |
| ~~`usr_oauth_accounts`~~ | **Auth0 yönetir** (sosyal login Auth0 connection). |
| ~~`usr_admin_users`~~ | `usr_users` + role flags yeterli (mdp-frontend pattern). |
| ~~`usr_admin_roles`~~ | Role flags enum yeter. RBAC matrisi gerekirse sonra. |
| `loc_emirates` | Dubai-only; tek satırlık tablo lüks. Genişlemede eklenir. |
| `usr_user_verifications` | **KYC v1'de yok.** İleride: belge upload + admin onay akışı. v1: `usr_users.is_verified` smallint (admin elle açar). |
| `rvw_reviews` | **v1'de yok** (kullanıcı kararı). UI'daki "Reviews · 9" tab v2'de aktive olur. (Yeni prefix: `rvw_`.) |
| `lst_sales` | `lst_listings.status='sold' + sold_at + sold_to_user_id` ile "11 sold / 3.2k earned" türetilir. Formal sipariş akışı yok. |
| `lst_listing_status_history` | Status değişimi audit'i için. v1'de `mod_moderation_actions` yeterli. |
| `mod_blocks` | Kullanıcı engelleme UI'sı yok. Spekülatif. |
| `wal_payments` | Şu an tek para hareketi: cüzdan boost. PSP entegrasyonu v2. |
| `nty_notification_preferences` | v1: tüm bildirimler açık. Toggle ekranı sonra. |
| `eng_searches` | Arama geçmişi/analytics için, MVP'de değil. |
| `msg_message_reads` | `msg_conversations` üstünde son okunan ile çözülür. Per-message tracking ileride lazım olursa. |
| `lst_listing_views` (event) | Daily aggregate v1 için yeterli. Event tablosu unique-viewer / fraud detection için sonra. |
| `cfg_feature_flags` | Env var ile başlanır. (Yeni prefix: `cfg_`.) |
| `cfg_app_config` | Boost fiyatı, welcome credit gibi sabitler env / constants. Admin'den canlı düzenleme v2. |

---

## Karar Verilenler

- **DB:** PostgreSQL 17+, **snake_case** (tablo + kolon), modül prefix'li tablolar (yukarı bkz. Konvansiyonlar).
- **PK:** UUID v7 (sequential), kolon adı `id`.
- **Boolean:** `SMALLINT NOT NULL DEFAULT 0/1` + CHECK constraint, `is_*`/`has_*` öneki.
- **Audit:** `created_at`/`created_by`/`updated_at`/`updated_by` her tabloda (append-only ledger'lar hariç).
- **Soft delete:** Tablo bazında karar verildi (yukarı tablo).
- **i18n:** AR + EN, lookup'larda JSONB `{en, ar}`; UGC'de JSONB `{original, en, ar}` + `trn_translation_jobs` async çeviri kuyruğu.
- **Auth:** Auth0 (mdp-frontend pattern). Tek `usr_users` + role flags. `auth0_sub` linki.
- **KYC:** v1'de yok (basit `is_verified` flag, admin elle açar).
- **Reviews:** v1'de yok.
- **Push notifications:** v1'de var.
- **Sosyal login:** Apple + Google açık (Auth0 connection ile, schema etkisi yok).
- **Kategori-özel attribute:** v1'de var (`cat_category_attributes` definitions + `lst_listings.attributes` JSONB değerler).

## Açık Sorular (Field Aşamasından Önce — Acil Değil)

1. **PSP entegrasyonu:** v1: sadece welcome credit ile boost (PSP yok). v2'de cüzdana topup için Stripe/Telr/PayTabs seçimi yapılacak.
2. **Çeviri sağlayıcısı:** Google Translate / DeepL / AWS Translate / Anthropic? Schema etkisi yok, sonra karar.
3. **PostgreSQL sürümü:** 17+ varsayıyorum (native `uuidv7()`). Daha eskiyse `pg_uuidv7` extension veya app-side üretim.

---

## Güven & Bayraklar

- **Güven:** Liste finalize. Ön yüz envanteri + kullanıcı kararları + DB konvansiyonları entegre.
- **MVP toplam: 20 tablo.**
- **Maliyet bayrağı:** Her UGC mutation = 1 translate API çağrısı (mesajlar dahil). Cache stratejisi (hash key ile aynı metin = aynı çeviri) ve provider seçimi sonradan.
- **Auth0 not:** Auth0 tenant'ında connection'lar: SMS Passwordless (mobil), Apple, Google (sosyal), Database/Email (admin). Custom claims kuralı (Auth0 Action) kullanıcının role flag'lerini JWT'ye yazar. `usr_users.auth0_sub` ile DB ↔ Auth0 senkron (signup hook ile DB'ye satır insert).

---

## Sonraki Adım

**Aşama 2 — Field-level tasarım** (her tablo için):
- FK + cascade davranışları
- Required/nullable
- Unique constraint'ler ve index'ler
- Enum vs lookup tablosu kararları
- JSONB shape'leri (`{en, ar}`, `{original, en, ar}`, attributes)

Sonra **Aşama 3 — ER diyagramı** (Mermaid veya dbdiagram.io).
