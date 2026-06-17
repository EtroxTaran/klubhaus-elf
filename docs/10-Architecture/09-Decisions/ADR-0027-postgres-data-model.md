---
title: ADR-0027 PostgreSQL Data Model (per-save schema isolation, Drizzle source of truth)
status: accepted
tags: [adr, architecture, data, postgresql, drizzle, schema, saves]
created: 2026-05-19
updated: 2026-06-17
accepted_at: 2026-05-19
type: adr
binding: true
supersedes: ADR-0004-data-model
amended_by: [[ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
related: [[ADR-0004-data-model]], [[ADR-0021-revised-tech-stack]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0028-postgres-transactional-outbox]], [[ADR-0005-save-format]], [[ADR-0007-naming-schema]], [[ADR-0020-hybrid-online-mvp-offline-ready]], [[../../60-Research/investor-mp-transition-neutralization-2026-06-16]], [[../../40-Execution/fmx-189-investor-mp-separation-decision-record-2026-06-16]], [[../bounded-context-map]]
---

# ADR-0027: PostgreSQL Data Model (per-save schema isolation, Drizzle source of truth)

## Status

accepted

> **FMX-182 reference note (2026-06-17):** Older pre-mortem/security drafts used
> `ADR-0027` as a placeholder for "BYOC Match Validation Quorum." That mapping
> is invalid. Current ADR-0027 is only the PostgreSQL Data Model. BYOC remains
> future-scope/unassigned until its own decision gate and ADR.

## Date

2026-05-19

## Context

[[ADR-0021-revised-tech-stack]] swapped SurrealDB → PostgreSQL+Drizzle as the
system of record. [[ADR-0004-data-model]] still describes the SurrealDB-era
mechanics (`.surql` generator, SCHEMAFULL/SCHEMALESS directives, `RELATE`
edges, `record<player>` cross-table pointers, namespace+database isolation).
ADR-0004's *domain invariants* are correct and substrate-agnostic; its
*mechanics* are SurrealDB-specific and must be redesigned.

The data layer is **greenfield** (`db/schema.surql` was 5 lines; `db/` is
marked superseded; `packages/db` exists as a Drizzle scaffold with one
`clubs` table). The exploration inventory (Wave-2 plan) enumerated every
SurrealDB-specific mechanic that needs a Postgres equivalent. This ADR
delivers those equivalents and supersedes ADR-0004 for the substrate.

ADR-0004's substrate-agnostic invariants are **preserved**: per-save logical
isolation; save quotas (soft 10 / hard 50; states `active|archived|deleted`;
30-day grace before drop); integer-only numerics; UUIDv7 IDs everywhere;
SCHEMAFULL/SCHEMALESS split as a *governance* split (typed columns + CHECK
vs `jsonb` + Zod); per-relationship modelling rules; encrypted save envelope
([[ADR-0005-save-format]]); offline hard-reject contract
([[ADR-0011-server-authoritative-multiplayer]]); forward-additive
`gender_eligibility`; the transactional outbox pattern (now in
[[ADR-0028-postgres-transactional-outbox]]).

## Options Considered

For each major substrate question:

- **Per-save isolation**: schema-per-save vs database-per-save vs row-level
  tenancy (saveId column).
- **Schema generator**: keep a custom TS-first generator that emits SQL + Zod
  vs Drizzle as single source of truth + drizzle-zod + generated mirror.
- **Per-save migrations**: synchronous fan-out on deploy (A1) vs lazy on
  save-open (A2).
- **Cross-context references**: Postgres foreign keys vs opaque UUID + branded
  TypeScript types.
- **RELATE edges**: junction table with surrogate UUIDv7 PK vs composite PK.

## Decision

### 1. Storage topology — schema-per-save

- **Platform data lives in `public`**: `user`, `device`, `session`,
  `save_registry`, `mp_group`, `invite`, `consumer_event_offset`, `catalog_*`,
  the transactional outbox + its partitioned archive
  ([[ADR-0028-postgres-transactional-outbox]]).
- **Each save lives in its own `save_<uuidv7hex>` schema** (one PostgreSQL
  schema per save row in `save_registry`). Game-state tables (leagues, clubs,
  squads, fixtures, matches, transfers, finances, training, watch-parties,
  rivalries) are defined once in TypeScript and provisioned once per save.
- **Delete** = `DROP SCHEMA save_<…> CASCADE` after the 30-day grace window
  ([[ADR-0004-data-model]] §6.1 unchanged).
- **Archive / unarchive** = amended by ADR-0097 / FMX-170. `active` saves keep
  one live `save_<uuidv7hex>` schema. `archived` saves drop out of the live
  catalog only after the encrypted save blob or equivalent logical archive
  artifact has been written, checksummed and indexed; unarchive/re-activation
  re-provisions the schema before the save becomes active again.
- **Multiplayer session provisioning**
  ([[ADR-0011-server-authoritative-multiplayer]]) = server-created MP
  `save_<uuidv7hex>` schema from MP setup state only. Singleplayer, hotseat,
  portable-import and local-save payloads are not eligible as source state.

Rationale: only schema-per-save *mechanically* enforces the
[[ADR-0019-modular-monolith-ddd]] §6 strict isolation contract — a wrong
`search_path` yields **relation-not-found**, never a silent cross-tenant
read. Row-level tenancy fails this test (a missed `WHERE saveId=` predicate
silently leaks across saves). Database-per-save breaks single-node connection
economics and adds avoidable operational overhead on Hetzner. See [[../11-Risks]]
for the accepted-risk row.

### 2. Per-save migration model — lazy on save-open (A2)

- `save_registry.schema_version: integer not null`.
- `QueryGateway.withSave(saveId, fn)` checks `schema_version` against the
  current target; if behind, applies the pending migration set to that one
  schema **before** serving the handler. Failure of one save's migration
  fails *that* save's open, never the platform.
- Deploy stays O(1) regardless of save count; old saves migrate when reopened
  (consistent with the determinism/resim model).

Rejected: A1 synchronous fan-out (deploy-time grows O(saves), mid-fan-out
failure leaves mixed versions). Recorded as the trade-off in [[../11-Risks]].

### 3. Schema generator — Drizzle is the single source of truth

- `packages/db/src/schema/{platform,save}/**` are Drizzle `pgTable`
  declarations (TypeScript). End-to-end inferred types; no codegen step for
  the schema itself.
- `drizzle-kit generate` emits forward-only numbered SQL files into
  `packages/db/migrations/{platform,save}/`. Migrations are committed.
- `drizzle-zod` derives `createInsertSchema` / `createSelectSchema` from the
  Drizzle tables **inside `packages/db`** for server-boundary validation.
- A small `tsx` script `packages/db/scripts/emit-db-schema-mirror.ts` reads
  the Drizzle schema + drizzle-zod schemas and writes a **self-contained,
  dependency-free** Zod mirror into `packages/db-schema/src/generated/**`.
  This keeps `packages/db-schema` zero-cross-package-import (composite-build
  safe) and keeps the standalone validation mirror invariant from ADR-0004.
- **CI drift gate**: `pnpm db:generate` runs drizzle-kit generate + the
  mirror emitter; CI fails on `git diff --exit-code` (the ADR-0004/0013
  Compliance equivalent).

Rejected: keeping a custom TS-first generator emitting `.sql`. Drizzle
already provides the typed source; a second generator layer is duplication.

### 4. SCHEMAFULL / SCHEMALESS — typed columns + CHECK vs jsonb + Zod

The ADR-0004 governance split is preserved; only the Postgres expression
changes.

- **SCHEMAFULL tables** (`user`, `device`, `save_registry`, `mp_group`,
  `player`, `club`, `league`, `competition`, `fixture`, `match`,
  `transfer_offer`, `transfer`, `sponsor`, `sponsor_contract`,
  `training_plan`, `staff`, `league_week`, `watch_party`, `rivalry`,
  `injury`, `consumer_event_offset`): typed Drizzle columns + `NOT NULL` +
  `CHECK` constraints expressing the ASSERT rules. Example:
  `attribute: smallint('attribute').notNull(),` plus a table-level
  `check('attribute_bounds', sql\`attribute BETWEEN 0 AND 100\`)`.
- **SCHEMALESS tables** (`match_event`, `outbox_event`, archive partitions,
  `narrative_event_log`, `notification`, `finance_ledger`,
  `training_outcome`, `sync_status`): a single `payload jsonb not null`
  column validated by per-event Zod at producer **and** consumer
  boundaries. The producer cannot bypass Zod (lint rule: no raw
  `db.insert(…outbox_event).values({payload: …})` without going through the
  typed helper).

  `audit_log` is intentionally absent. ADR-0097 / FMX-170 drops the orphaned
  platform `audit_log` table; the outbox is the domain trail and ADR-0091's
  Audit & Security log is the security trail.

### 5. Identity model — UUIDv7, app-generated, opaque branded refs

- IDs are **UUIDv7** generated by the application (e.g.
  `uuid-v7-from-time`) — **not** PostgreSQL's `gen_random_uuid()`, which is
  v4 and breaks time-ordering. Drizzle column type is `uuid()`; defaults
  come from app code, never the database.
- Cross-context references are **opaque uuid columns + branded TypeScript
  types**:
  ```ts
  export type PlayerId = string & { readonly __brand: 'PlayerId' }
  // referenced as:
  playerId: uuid('player_id').$type<PlayerId>().notNull()
  ```
  **No Drizzle `references()` across context boundaries** —
  [[ADR-0019-modular-monolith-ddd]] §6 forbids cross-context FKs. Intra-
  context FKs are allowed and encouraged.
- A JSDoc convention `@opaqueRef <context>.<aggregate>` annotates every
  cross-context column for the schema generator and code review.

### 6. Relationship modelling — junction tables for edges with lifecycle

ADR-0004 §4's RELATE rules map onto Postgres as follows:

| ADR-0004 pattern | Postgres expression |
|---|---|
| Record link (one-to-many, e.g. `player.club`) | `uuid` column on the many side, branded type, intra-context FK if same context |
| Linked rows (e.g. `match → match_events`) | child table with parent `uuid`, indexed |
| Document table (e.g. `transfer`) | single Drizzle table, transactional all-or-nothing |
| RELATE edge with metadata (e.g. `watch_party_participant`) | **junction table with surrogate UUIDv7 PK** + `joined_at`, `role`, `left_at` columns + a partial-unique index for "active membership" |
| Embedded (small, immutable, read-together) | `jsonb` column (e.g. `club.stadium`, `player.traits`) |

Junction tables use a **surrogate PK** (not composite) so the edge has its
own identity, can be referenced by audit/outbox, and re-joining after
leaving creates a new row (history preserved).

### 7. Numeric mapping (the integer-only invariant in Postgres)

| Domain (ADR-0004 §5) | Drizzle pg-core | Zod |
|---|---|---|
| Money (cents, ≤2^53) | `bigint(name, { mode: 'number' })` | `z.number().int().safe()` |
| Probability (basis points 0–10000) | `integer()` + `CHECK 0..10000` | `z.number().int().min(0).max(10000)` |
| Player attribute / morale / form (0–100) | `smallint()` + `CHECK 0..100` | `z.number().int().min(0).max(100)` |
| Time (sim seconds) | `integer()` (or `bigint` for long careers) | `z.number().int().nonnegative()` |
| Coordinate (mm, 0–105000 / 0–68000) | `integer()` + per-axis `CHECK` | `z.number().int().min(0).max(…)` |
| RNG state (4×Uint32 per stream) | 4 cols `bigint(mode:'number')` **or** one `jsonb` for SCHEMALESS streams | per-stream Zod |
| ID (UUIDv7) | `uuid()` (app-generated; not `gen_random_uuid()`) | `z.string().uuid()` |
| Enum (additive, e.g. save state) | `text()` + `CHECK IN (…)` (prefer over native pg `enum` for ADR-0004 §9 forward-additivity) | `z.enum([…])` |
| SCHEMALESS payload | `jsonb()` | per-event Zod |
| `rejected_with_reason` (ADR-0011) | `text()` + `CHECK IN ('state_changed','resource_unavailable','deadline_passed','forbidden')` | `z.enum([…])` |

Determinism rule: no transcendental math in decision logic; branches use
integer comparisons (`if (rng.nextInt(10000) < chanceBasisPoints)`). The
schema enforces bounds; the application enforces "no floats in branches".

### 8. Cross-context isolation — typed `QueryGateway`, no raw pool

- One `pg.Pool` (node-postgres) constructed inside `packages/db`. Domain code
  never sees it.
- `QueryGateway` exposes:
  - `withPlatform(fn)` — runs `fn` on a connection with `search_path = public`.
  - `withSave(saveId, fn)` — opens a transaction, runs
    `SET LOCAL search_path = save_<hex>, public`, applies pending per-save
    migrations if `schema_version` is behind, then runs `fn`. `LOCAL` so the
    scope never leaks across pgbouncer transaction-mode checkouts.
- Drizzle is constructed *inside* the gateway scope; a domain handler
  physically cannot reach another save's tables (wrong schema = relation
  not found) or the pool directly.
- Lint rule (parallel to the `Math.random`/`Date.now` discipline): forbid
  importing the raw pool / `drizzle()` outside `packages/db` and the
  gateway.

### 9. Save quotas + lifecycle — unchanged

ADR-0004 §6.1 in full: soft 10, hard 50 per user, states
`active|archived|deleted`, 30-day grace before per-save schema is dropped.
Enforced in application code; the database participates only via
`save_registry.state` and the gateway's `dropSave(saveId)` =
`DROP SCHEMA save_<hex> CASCADE` after the grace window.

### 10. Encryption envelope + RNG state — boundary unchanged

[[ADR-0005-save-format]] still owns the client-side crypto (AES-GCM,
PBKDF2 for the save KDF, gzip, three version fields, RNG snapshot). The
database stores the encrypted blob: either a `bytea` column on `save_registry`
or a separate `save_blob` table. RNG state inside the SavePayload remains
the same — its on-disk Postgres representation is irrelevant to determinism
because it is opaque ciphertext until decrypted client-side.

### 11. Offline hard-reject contract — unchanged

ADR-0011's `rejected_with_reason` ∈ {state_changed, resource_unavailable,
deadline_passed, forbidden} is still the contract; in Postgres this becomes
a `text()` column + `CHECK IN (…)` on the rejection record and a `z.enum`
mirror.

### 12. Migration tooling

- `drizzle-kit generate` only (never `drizzle-kit push` in CI/prod).
- `drizzle-orm/node-postgres/migrator` replaces
  `scripts/db-migrate-placeholder.mjs`; `pnpm db:migrate` against
  `DATABASE_URL`.
- Forward-only / idempotent. Destructive changes follow the phased rename
  (add → backfill → switch → drop) over releases.
- Per-save migrations apply lazily via the gateway (§2). The per-schema
  `__drizzle_migrations` table tracks state.
- CI drift gate: `pnpm db:generate && git diff --exit-code`.

## Rationale

Every choice closes one of the redesign questions surfaced by the
SurrealDB-mechanic inventory. Schema-per-save is the only option that
preserves the strict-isolation contract mechanically (the most load-bearing
ADR-0019 §6 invariant). Lazy migration matches the resim-driven save model
without forcing deploy-time fan-out. Multiplayer provisioning stays inside the
server-owned MP path and does not import SP/hotseat schemas into MP. Drizzle-as-
source-of-truth + a generated standalone Zod mirror reconciles ADR-0021's "no
codegen of the schema itself" with ADR-0004's "validation mirror is a standalone
zero-dep package". The integer-only model is preserved in the type map.
Cross-context branded UUIDs preserve [[ADR-0019-modular-monolith-ddd]] §6.

## Consequences

Positive:

- Strict isolation enforced by Postgres, not by convention.
- `DROP SCHEMA … CASCADE` makes delete and verified archive cleanup simple.
- Server-created MP session provisioning is a same-cluster operation and never
  trusts SP/hotseat/imported save payloads as MP truth.
- Single connection pool + one whole-cluster backup/PITR posture on Hetzner;
  per-schema logical artifacts are archive/restore tools, not the only backup.
- Drizzle types flow end-to-end (no codegen drift).

Negative / follow-up:

- Per-save migration fan-out is now a real engineering concern (handled by
  A2 lazy + `schema_version`).
- Archive/restore is no longer a cheap state flip. It is a verified
  archive-artifact + schema re-provision lifecycle governed by ADR-0097's
  300/1000 live-schema SLO.
- Graph traversals use typed recursive CTEs (Drizzle `sql`/`.with()`); fine
  for our modest graph needs (scouting, relationships), not a property-graph
  workload.
- The full per-table Postgres schema for every domain entity is the next
  engineering wave; this ADR locks the **substrate decisions**, not the full
  table set.

## Supersedes

[[ADR-0004-data-model]] (the SurrealDB-specific mechanics; substrate-agnostic
invariants are preserved here).

## Related Docs

- [[ADR-0004-data-model]] — superseded predecessor
- [[ADR-0028-postgres-transactional-outbox]] — sibling rework
- [[ADR-0021-revised-tech-stack]] · [[ADR-0019-modular-monolith-ddd]] ·
  [[ADR-0011-server-authoritative-multiplayer]] · [[ADR-0005-save-format]]
- [[../../30-Implementation/postgres-drizzle-integration]] (next engineering wave)
