---
title: db module
status: current
tags: [architecture, module, postgresql, drizzle]
created: 2026-05-19
updated: 2026-05-19
type: module
binding: true
related: [[../05-Building-Blocks]], [[db-schema]], [[../09-Decisions/ADR-0021-revised-tech-stack]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0028-postgres-transactional-outbox]]
---

# packages/db (`@soccer-manager/db`)

## Purpose

The PostgreSQL system of record. Owns the Drizzle schema (single source of
truth), the connection pool, the typed `QueryGateway` that enforces the
schema-per-save isolation contract, the migrator, and the drizzle-zod
runtime validators used at server-function boundaries.

The substrate decision is [[../09-Decisions/ADR-0027-postgres-data-model]]
(supersedes ADR-0004); the outbox/audit substrate is
[[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (supersedes
ADR-0013).

## Owns

- `src/schema/platform/**` — `public` schema: `user`, `device`, `session`,
  `save_registry` (with `schema_version`), `mp_group`, `invite`,
  `outbox_event`, `outbox_event_archive` (partitioned),
  `consumer_event_offset`, `catalog_*`.
- `src/schema/save/**` — the per-save template applied to every `save_<hex>`
  schema (leagues, clubs, players, fixtures, matches, transfers, finances,
  training, watch-parties, rivalries, narrative event log, etc. —
  domain set is finalised in the engineering wave).
- `src/client.ts` — single `pg.Pool` from `DATABASE_URL` (no other module
  may construct a pool).
- `src/gateway.ts` — `QueryGateway` with `withPlatform(fn)` and
  `withSave(saveId, fn)` (the latter applies lazy per-save migrations and
  sets `LOCAL search_path = save_<hex>, public`).
- `migrations/{platform,save}/**` — forward-only numbered SQL files generated
  by `drizzle-kit generate`; one hand-authored SQL migration for the
  `outbox_event_archive` partitioning (the single hand-SQL exception per
  ADR-0028 §4).
- `drizzle.config.ts` — drizzle-kit config; reads `DATABASE_URL` from env
  (provided via sops+age+direnv per
  [[../../30-Implementation/secrets-management]]).
- `scripts/emit-db-schema-mirror.ts` — codegen that writes the
  standalone Zod mirror into `packages/db-schema/src/generated/**`
  (composite-build safe).
- The typed `withOutbox(tx, event)` helper (no raw outbox inserts allowed —
  ADR-0028 §1).
- `provisionSave(saveId)` / `dropSave(saveId)` / `snapshotAndImport(src,dst)`
  (Hotseat→MP) — all in one transaction across schemas.

## Inputs

- `DATABASE_URL` env var (mapped from the sops `dsn:` secret —
  [[../../30-Implementation/secrets-management]] §3.4).
- The domain ADRs ([[../09-Decisions/ADR-0027-postgres-data-model]],
  [[../09-Decisions/ADR-0028-postgres-transactional-outbox]]).

## Outputs

- Connection-acquisition + Drizzle-typed handlers via the `QueryGateway`
  (no raw `pg.Pool` or `drizzle()` export — lint gate).
- drizzle-zod schemas (`createInsertSchema`/`createSelectSchema`) for use at
  server-function boundaries.
- Generated standalone Zod mirror under `packages/db-schema/src/generated/**`
  (consumed by the PWA's bundle-critical client path).

## Invariants

- **Schema-per-save isolation is mechanical, not by convention** — domain
  handlers only ever reach tables through `QueryGateway.withSave(saveId)`,
  which sets `LOCAL search_path`. A wrong scope yields relation-not-found,
  never a silent cross-tenant read ([[../09-Decisions/ADR-0019-modular-monolith-ddd]] §6).
- **No cross-context foreign keys** — cross-context refs are `uuid` columns
  with branded TS types; intra-context FKs are allowed.
- **Forward-only migrations**, drizzle-kit-generated, committed; CI drift
  gate runs `pnpm db:generate && git diff --exit-code`.
- **No raw pool / `drizzle()`** outside this package (lint rule).
- **No raw outbox inserts** outside `withOutbox(tx, event)` (lint rule).
- **UUIDv7** is app-generated for ID columns (not `gen_random_uuid()`).
- Integer-only numeric model (ADR-0027 §7).

## Dependencies

- `drizzle-orm`, `drizzle-zod`, `drizzle-kit` (dev), `pg` (driver — added in
  the engineering wave together with `client.ts`).
- [[../09-Decisions/ADR-0021-revised-tech-stack]] · [[../09-Decisions/ADR-0027-postgres-data-model]] · [[../09-Decisions/ADR-0028-postgres-transactional-outbox]]
- Consumed by every server-side context (Identity, Game, MP, Outbox publisher,
  Match Worker) via the gateway.
- Drives [[db-schema]] via the mirror emitter.
