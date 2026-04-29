# Souq Dubai — Claude project guide

Bilingual (EN/AR, RTL) C2C second-hand marketplace for Dubai. Mobile-first.

## Status

| Layer | State |
|---|---|
| **Database** | PostgreSQL 18 schema in [db/schema.sql](db/schema.sql) — 20 tables in the `souq` schema. Design rationale in [db-design.md](db-design.md), per-field semantics in [db-design-fields.md](db-design-fields.md). |
| **Backend** | ASP.NET Core 10 scaffold in [api/](api/). `/healthz` + DB ping working. No entities, no auth, no real endpoints yet. |
| **Mobile app** | Expo / React Native + TypeScript in [mobile/](mobile/). **This is the primary consumer surface — when the user says "the app", "frontend", or "UI" without qualifying, they mean this.** |
| **Web prototype** | React 18 + Vite in [src/](src/) with hardcoded data — older prototype kept around but not the active consumer target. Only touch when explicitly asked about "web" or "src". |
| **Admin panel** | Vite + React + TypeScript in [admin/](admin/). |
| **Deployment** | Not deployed. Target: DigitalOcean BLR1. |

## Repo layout

```
souq1/
├── api/                  ASP.NET Core 10 backend (Souq.Api.csproj at root, single project)
├── db/schema.sql         Authoritative PostgreSQL schema; all objects in `souq` schema
├── mobile/               Expo / React Native consumer app — DEFAULT target for "frontend"/"UI"/"the app"
├── admin/                Vite + React + TS admin panel
├── src/                  Older React/Vite web prototype (not the active consumer target)
├── db-design.md          Schema design rationale + v2 deferrals (reviews, payments)
└── db-design-fields.md   Per-field semantics (bilingual JSONB shape, soft-delete rules)
```

## Common commands

```bash
# Backend
cd api && dotnet run                                 # http://localhost:5127
curl http://localhost:5127/healthz                   # → {"status":"ok","db":"ok","tables":20}
open http://localhost:5127/scalar/v1                 # OpenAPI doc UI

# Marketplace prototype
npm run dev                                          # Vite dev server

# Database
psql -U veliozturk -d souq                           # connect (Postgres.app default port 5432)
psql -U veliozturk -d souq -c "\dt souq.*"           # list tables
```

## Local environment gotchas

- **`.NET 10 SDK` is at `$HOME/.dotnet`**, NOT on default PATH. Older 6/7/8/9 SDKs are at `/usr/local/share/dotnet`. To use 10 from any shell, add `export PATH="$HOME/.dotnet:$PATH"` to `~/.zshrc`.
- **All tables live in the `souq` schema, not `public`.** Connection strings must include `Search Path=souq` so unqualified queries resolve. The schema header sets `SET search_path = souq, pg_catalog;` — if `souq` schema doesn't exist, every CREATE TABLE falls through to `pg_catalog` and gets "permission denied".
- **Reloading the schema from scratch:**
  ```bash
  dropdb -U veliozturk souq && createdb -U veliozturk souq
  psql -U veliozturk -d souq -c "CREATE SCHEMA souq AUTHORIZATION veliozturk;"
  psql -U veliozturk -d souq -v ON_ERROR_STOP=1 -f db/schema.sql
  ```
- **Postgres 18 native `uuidv7()`** is used for primary keys — schema requires PG 18+, will not load on PG ≤ 17 without modification.

## Database conventions worth remembering

- **JWT user identifier**: `usr_users.auth0_sub` (NOT `auth0_id`).
- **Roles are flags, not an enum**: `is_admin`, `is_super_admin`, `is_moderator`, `is_verified` — separate `smallint` columns with CHECK 0/1. Authorization is policy-based on combinations of these.
- **Booleans are `smallint` 0/1 across the board** (not the native `boolean` type) for portability.
- **Bilingual JSONB shape**:
  - Lookup tables (`cat_categories`, `loc_neighborhoods`, etc.): `{"en": "...", "ar": "..."}`
  - User-generated content (`lst_listings.title/description`, `msg_messages.text`): `{"original": "...", "en": "...", "ar": "..."}` — `en` and `ar` are filled async by the translation worker pulling from `trn_translation_jobs`.
- **Soft delete** via `deleted_at` + `deleted_by` on user-facing tables (users, listings, conversations, messages, offers, reports).
- **Append-only ledgers** (no UPDATE, no DELETE): `wal_wallet_transactions`, `bst_boosts`, `mod_moderation_actions`. They have only `created_at` + `created_by` — no `updated_at`, no soft-delete columns, no update trigger.
- **Hard-delete tables**: `usr_user_devices`, `eng_favorites`, `nty_notifications`, `trn_translation_jobs`.
- **Boost active-state is a query, not a flag**: a listing is boosted iff a row exists in `bst_boosts` where `now() BETWEEN starts_at AND ends_at`. There is no `is_boosted` column on `lst_listings`.
- **Polymorphic columns without FKs**: `mod_reports.reportable_id` and `mod_moderation_actions.target_id` reference different tables based on a sibling `*_type` column.

## Locked stack decisions (don't re-litigate)

These were debated and locked in [a planning session](~/.claude/plans/it-will-be-a-snoopy-stonebraker.md). Each has a re-evaluation trigger; only revisit if the trigger fires.

| Choice | Trigger to revisit |
|---|---|
| ASP.NET Core 10 single project (no Clean Architecture layers yet) | Project grows enough that the single project genuinely hurts |
| EF Core 10 + Npgsql (no separate query libs like Dapper) | Hot-path query needs raw SQL perf |
| **Vite + React + TS** for admin (NOT Next.js) | Admin needs SSR or server actions |
| Auth0 for identity (NOT Cognito/Clerk/self-rolled) | SMS-OTP unit cost bites — swap Auth0 SMS for Twilio Verify |
| `IHostedService` for background jobs (NOT Hangfire) | API scales beyond 1 instance |
| DigitalOcean BLR1 (NOT AWS me-central-1 / Azure UAE North) | KYC stores Emirates ID copies (PDPL trigger), or Dubai latency complaints |
| PostgreSQL 18 (NOT 14/15/16/17) | n/a — locked |
| Local dev + prod only (NO staging) | First paying users + first deploy-mismatch incident |

## Working with this codebase

- **Default surface is mobile.** When the user says "the app", "frontend", "UI", "screen", or names a feature without specifying a surface, they mean [mobile/](mobile/) (Expo / React Native). Only touch the [src/](src/) web prototype if they explicitly say "web" or "src". The admin panel is its own thing — only when they say "admin".
- When asked for "specs" or "recommendations", deliver a decisions document — not implementation steps, repo restructures, or verification checklists.
- When implementing backend code: match schema field names exactly (`auth0_sub`, role flags, `bst_boosts.starts_at/ends_at`, JSONB `{original,en,ar}` shape).
- Don't add Redis, SignalR, Hangfire, OpenSearch, or OpenTelemetry without one of the deferred-list triggers firing — see `~/.claude/projects/-Users-veliozturk-projects-souq1/memory/project_souq_overview.md`.
- Don't restructure the existing root-level `src/` (React app) into `apps/marketplace/` as a side effect of other work — it's been deliberately left alone.
