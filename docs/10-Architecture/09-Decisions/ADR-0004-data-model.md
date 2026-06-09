---
title: ADR-0004 Data Model — Domain Entities, Schemas, Saves
status: superseded
tags: [adr, architecture, data, surrealdb, dexie, schema, saves]
created: 2026-05-15
updated: 2026-06-09
accepted_at: 2026-05-16
type: adr
binding: true
amended_by: [[ADR-0020-hybrid-online-mvp-offline-ready]]
superseded_by: ADR-0027-postgres-data-model
related: [[ADR-0019-modular-monolith-ddd]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0013-transactional-outbox]], [[ADR-0005-save-format]], [[ADR-0007-naming-schema]], [[ADR-0020-hybrid-online-mvp-offline-ready]], [[ADR-0021-revised-tech-stack]], [[ADR-0027-postgres-data-model]], [[../bounded-context-map]], [[../../60-Research/surrealdb-schema-patterns]], [[../../60-Research/determinism-and-replay]]
---

# ADR-0004: Data Model — Domain Entities, Schemas, Saves

> **Superseded — historical memory only.** This document is superseded by [[ADR-0027-postgres-data-model]] and must not be implemented. The current decision/spec lives there; see also [[../../00-Index/Decision-Log]] for the authoritative index. Retained for historical context per the vault's supersede discipline.

## Status

Superseded (2026-05-19 by [[ADR-0027-postgres-data-model]]).
Accepted historically on 2026-05-16, gap A4 of
[[../../95-Archive/gap-reports/wave-3-gap-analysis]].
MVP timing amended historically by
[[ADR-0020-hybrid-online-mvp-offline-ready]] (server-confirmed state is
authoritative in MVP; Dexie stores cache/drafts/staging).

## Context

**Klubhaus Elf** is an offline-first PWA with eleven DDD bounded
contexts (ADR-0019), server-authoritative multiplayer (ADR-0011),
deterministic match simulation (D8 research), a transactional outbox
(ADR-0013), encrypted saves (B2), and IP-clean fictional content
(ADR-0007). Wave-1 ADR-0004 was a 12-line stub. Wave-3 gap **D14**
([[../../60-Research/surrealdb-schema-patterns]]) locked the SurrealDB
schema strategy; Wave-3 gap **D8**
([[../../60-Research/determinism-and-replay]]) locked the RNG / replay
numeric model; Wave-3 gap **B2** locked encryption + AI-match storage.
This ADR consolidates those into the canonical Data Model decision
that every M2-M8 milestone reads.

Four additional questions were open before this ADR:

- How many saves per user, and how is that surfaced?
- Which library/approach to use for the TS-first schema generator
  (locked-medium in D14, library/strategy locked here).
- What is the wire format for the Phase-2 cloud-sync feature?
- How does the schema stay additive for women's football and other
  competition-rule expansions without a painful future migration?

Gap A4 Q&A (2026-05-16) settled all four after Perplexity research.

## Decision

The Data Model has six top-level rules. Detail goes into
[[../../60-Research/surrealdb-schema-patterns]] (schema sketches per
context) and [[../../30-Implementation/surrealdb-integration]]
(implementation guide, gap E1).

### 1. Storage topology — hybrid per-save isolation

MVP staging note: the platform/per-save SurrealDB topology below is the
authoritative MVP storage. Browser-side Dexie mirrors read caches, drafts and
future export/sync staging data; it does not own canonical domain progression
until a later selective-offline singleplayer adapter is explicitly added.

One namespace `klubhaus_elf` with two kinds of databases:

```text
namespace: klubhaus_elf
  database: platform        # shared across all saves
  database: save_<saveId>   # one per save (UUIDv7 saveId)
  database: save_<saveId>   # ...
  ...
```

The **platform DB** owns:

- `user`, `device`, `session` (Identity & Access).
- `save_registry`, `mp_group`, `invite` (cross-save coordination).
- `outbox_event`, `outbox_event_archive_YYYY_MM`,
  `consumer_event_offset` (transactional outbox + audit per ADR-0013).
- `audit_log`.
- `catalog_*` tables (IP-clean fictional player / region / competition
  catalog used by every save's procedural generation).

Each **per-save DB** owns the mutable game state for one save:
leagues, clubs, squads, training, transfers, matches, watch-parties,
notifications, fan-segment state, sponsor contracts.

Hotseat → MP promotion is a **snapshot-and-import** between two
per-save DBs orchestrated by the platform DB (per ADR-0011 §Hotseat
handoff + D14 §1).

### 2. Schema strategy — hybrid SCHEMAFULL/SCHEMALESS

- **SCHEMAFULL** for stable core entities: `user`, `device`,
  `save_registry`, `mp_group`, `player`, `club`, `league`,
  `competition`, `fixture`, `match`, `transfer_offer`, `transfer`,
  `sponsor`, `sponsor_contract`, `training_plan`, `staff`,
  `league_week`, `watch_party`, `rivalry`, `injury`,
  `consumer_event_offset`.
- **SCHEMALESS** for event/log/payload tables: `match_event`,
  `outbox_event`, `outbox_event_archive_YYYY_MM`, `audit_log`,
  `narrative_event_log`, `notification`, `finance_ledger`,
  `training_outcome`, `sync_status`.

SCHEMAFULL tables use `DEFINE TABLE ... SCHEMAFULL` with explicit
`DEFINE FIELD ... TYPE ... ASSERT ...` clauses. SCHEMALESS tables are
validated by Zod at the application layer at every producer + consumer
boundary.

### 3. Schema generator — custom TS-first mirror

A custom generator in `packages/db-schema` is the **single source of
truth**. From one TS schema declaration it emits:

- `.surql` migration files (forward-only, idempotent, `IF NOT EXISTS`).
- Zod schemas (consumed at every API + bus + UI boundary).
- TypeScript types.

CI gate: `pnpm db:generate && git diff --exit-code` fails the build if
the generated artefacts drift from the committed copy.

Rejected alternatives:

- `surrealist-codegen` — supply-chain risk; edge-case maintenance
  burden.
- Drizzle ORM Surreal driver — adds an ORM abstraction layer we don't
  need.
- Effect Schema — team migration cost off Zod is too high.
- Hand-written `.surql` + hand-written Zod — guaranteed drift over
  time.

### 4. Relationship modelling — per-relationship rules

The decision table from D14 §3 is binding:

| Relationship | Pattern |
|---|---|
| club → players | Record link on `player.club` |
| match → match_events | Linked rows |
| transfer_offer → counter-offers | Linked rows with `parent_offer` |
| transfer (clubA, player, clubB, fee, clauses) | Document table |
| watch_party → participants | RELATE edge with `joined_at`, `role`, `left_at` |
| scouting mission | Document + record links |
| sponsor_contract | Document with record links |
| rivalry | Document with record links |
| club → stadium | Embedded (small, immutable per-match, read-together) |
| player → traits / tendencies | Embedded array |
| training_plan → drills | Embedded array |
| user → mp_group memberships | RELATE edge with `joined_at`, `role` |
| player → injuries (history) | Linked rows |

General decision tree: embedded for small/read-together/bounded;
record links for refs and one-to-many; linked rows for unbounded or
paged; RELATE only for edges with their own lifecycle metadata;
document tables for transactional entities.

### 5. Numeric representation — integers throughout

Per D8 §4:

| Domain | Representation |
|---|---|
| Money (cash, fees, wages) | Integer cents (number, ≤ 2^53) |
| Probabilities (chances, odds) | Basis points: integer 0-10000 |
| Player attributes | Integer 0-100 (or 1-10 in Quick UI) |
| Time (simClock) | Integer seconds |
| Coordinates (x, y on pitch) | Integer millimetres (105 000 × 68 000 grid) |
| Atmosphere, morale, form | Integer 0-100 |
| RNG state (per stream) | Four `Uint32`: `stateLo`, `stateHi`, `incLo`, `incHi` |

No transcendental math in deterministic decision logic. Branches use
integer comparisons (`if (rng.nextInt(10000) < chanceBasisPoints)`),
not float-threshold compares. See D8 §5 for the 12 save-determinism
rules.

### 6. Save-level decisions

#### 6.1 Save quotas

Per user:

- **Soft UX limit**: 10 active saves. UI shows
  *"You have 10 active saves. Archive one to create a new save."*
- **Server-side hard cap**: 50 saves total per user (active +
  archived). Prevents disk runaway.
- States: `active` | `archived` | `deleted`. Archive is reversible;
  delete is one-way (with 30-day grace period before the per-save DB
  is dropped).
- No tiering at MVP. Phase 2 may introduce tiered slots tied to
  monetisation (gap G4).

#### 6.2 Save encryption (locked by B2)

- AES-GCM 256 via Web Crypto API.
- PBKDF2 KDF from account secret + device salt.
- AEAD tag = integrity.
- Tampering breaks the save entirely.
- Export envelope = encrypted payload + ciphertext-authenticated
  header `{engine_version, save_version, created_at}`.

Detail in ADR-0005 (gap A5).

#### 6.3 Save export / import format

Stable, versioned, encrypted:

```text
SaveExport {
  envelope: {
    schemaVersion: int             # the format itself
    saveVersion: int               # the save data version
    engineVersion: string          # for deterministic replay (D8)
    createdAt: datetime
    saveMode: 'singleplayer' | 'hotseat' | 'mp_member' | 'archive'
    aeadHeader: bytes              # ciphertext-authenticated metadata
  },
  ciphertext: bytes                # AES-GCM ciphertext + tag
}
```

The plaintext decrypts to a snapshot of the save DB: all SCHEMAFULL
entities + all SCHEMALESS event tables + every active RNG stream's
state + `simClock` + match clocks for in-progress matches.

Forward-only migration policy:

1. Add new field (migration N).
2. Backfill (migration N+1).
3. Switch reads and writes (code release).
4. Drop old field (migration N+M, several releases later).

#### 6.4 Phase-2 cloud sync — hybrid (deferred to Phase 2)

When cloud sync ships:

- **Initial sync per device**: upload encrypted full snapshot.
- **Steady-state sync**: encrypted incremental ops with monotonic
  sequence numbers, append-only on the server.
- **Periodic checkpoints**: every 100 deltas OR 5 MB (whichever first)
  the device uploads a fresh full snapshot; older deltas can then be
  compacted.
- **Shared MP saves**: save-level content key wrapped per member
  (membership change wraps the key for new members; payload is not
  re-encrypted).
- **Server stores**: append-only encrypted op log + latest checkpoint
  metadata per save per device.

This is the locked direction; the implementation lands as a Phase-2
ADR addendum or successor ADR. MVP does NOT ship cloud sync.

### 7. Identity model — keys and IDs

- All IDs are **UUIDv7** (per ADR-0013). Time-ordered, index-friendly,
  globally unique, mainstream library support.
- IDs are *opaque* outside their owning context. Cross-context refs
  use SurrealDB record links (`record<player>`), not raw strings.
- IP-clean fictional naming (per ADR-0007) is enforced at the
  generator layer (`catalog_*` tables in the platform DB).

### 8. Multi-context coordination

Per ADR-0019 §6 strict storage isolation: no JOIN across context
boundaries; no shared lookup tables that bypass the rule. Cross-context
reads happen via the public `queryGateway` (per D14 §6) of the owning
context, not by querying its tables directly.

The platform DB hosts cross-cutting tables (identity, save registry,
outbox, audit, catalog) that are public to every context's
queryGateway. Per-save DBs host context-owned tables; queryGateways
choose the right DB at request time based on `saveId`.

### 9. Forward additivity — women's football and beyond

To future-proof for women's football (not shipped at MVP per scope
W3.A) and similar regulatory expansions:

- `player` has `gender_eligibility: set<enum>` (e.g. `{'men','open'}`,
  `{'women','open'}`, `{'men','women','mixed','open'}`).
- `competition` has `gender_restriction: enum` (e.g. `'men_only'`,
  `'women_only'`, `'mixed'`, `'open'`) plus optional
  `eligibility_rule_object` for niche cases.
- Season calendars are properties of `competition`, not of gender. A
  women's-league competition simply has its own `season_start_month`
  and `transfer_window` (e.g. women's league offset by 3 months from
  the men's league in the same country).
- Transfer rules check the source + target competition's gender
  restriction against the player's gender eligibility; no special-case
  code per gender.

This avoids the binary-enum trap (which would force a migration for
non-binary or mixed-eligibility competitions later) and the separate-
table trap (which makes cross-pool queries painful).

## Consequences

### Positive

- Strict per-save isolation enables clone / archive / delete / export
  as DB-scoped operations.
- Schema stays consistent across DB, Zod, and TS via the single
  generator source.
- Service-extraction-ready: every context's storage is isolated from
  every other context (per ADR-0019).
- Deterministic match replay is straightforward: every save persists
  its full RNG state per D8.
- Encrypted at rest by default (per B2): tamper-resistant saves +
  trustworthy hotseat → MP handoff.
- Save format is forward-compatible (versioned envelope + phased
  migrations).
- Women's football, junior open, mixed-eligibility competitions are
  additive without schema rewrites.

### Negative

- One-DB-per-save adds operational accounting (DBA pattern: enumerate
  saves before applying migrations; track DB count vs disk).
- Server-side hard cap (50 saves / user) needs UI surfaces to convey
  the limit and provide easy archive / export flows.
- Custom schema generator is ~2 weeks of up-front work in
  `packages/db-schema` before any other context can land its
  schemas.
- Forward additivity (eligibility sets, restriction enums) is slightly
  more verbose than a binary `gender` enum at MVP.

### Future

- Phase 2 cloud-sync ADR addendum / successor ADR (already locked at
  decision level; needs implementation detail).
- Tiered save quotas when monetisation lands (gap G4).
- SurrealDB WASM in the browser is a deferred research track per
  D14 §5 (Dexie-only at MVP).

## Design source

Implements data needs from [[../../50-Game-Design/GD-0003-squad-players]], [[../../50-Game-Design/GD-0006-transfers]], [[../../50-Game-Design/GD-0007-youth]], [[../../50-Game-Design/GD-0008-finance-economy]], [[../../50-Game-Design/GD-0009-league-structure]], and current approved system notes in [[../../50-Game-Design/README]].

## Compliance

The following rules apply across `packages/db-schema`, `src/domain/*`,
and every command handler / projection updater:

- Every new entity MUST be declared in the TS schema source in
  `packages/db-schema`. Hand-written `.surql` is forbidden in
  production code.
- Migrations MUST be forward-only and idempotent (`IF NOT EXISTS`).
- Cross-context table access MUST go through the owning context's
  `queryGateway` (per ADR-0019 §6).
- Saves MUST be encrypted on disk and in export envelopes (per B2).
- Money / probabilities / attributes MUST use integers / basis-points
  (per D8 §4).
- RNG state MUST be persisted in every save snapshot for all active
  streams.
- Save quotas MUST be enforced server-side (hard cap = 50 per user);
  the client also enforces the soft limit (10 active) but does not
  trust client checks for the hard cap.
- IDs MUST be UUIDv7.
- The platform DB MUST be the single home of identity, save registry,
  outbox, audit, and catalog tables.
- Per-save DBs MUST NOT contain user identity or outbox rows
  (these are platform-DB-only).

CI enforcement:

- `pnpm db:generate && git diff --exit-code` blocks merges if the
  generated artefacts drift.
- Lint rule blocks `Math.random`, `Date.now`, raw float-threshold
  branching in `domain/*`.
- Test rule: every entity schema has a `roundtrip(entity)` test
  (encode → decode → encode = byte-identical) plus a schema-evolution
  test (v(n+1) schema parses v(n) payload).

## Sources

- [[../bounded-context-map]] — 11 bounded contexts, strict storage
  isolation rule.
- [[../../60-Research/surrealdb-schema-patterns]] — D14 locked schema
  + isolation + per-relationship modelling + migration workflow.
- [[../../60-Research/determinism-and-replay]] — D8 locked PRNG / RNG
  streams / replay format / numeric representation / 12
  save-determinism rules.
- [[ADR-0011-server-authoritative-multiplayer]] — B2 locked hotseat
  handoff (snapshot-and-import between per-save DBs); AI vs AI seed-
  only storage; encrypted saves.
- [[ADR-0013-transactional-outbox]] — B4 locked outbox table layout
  (lives in platform DB).
- Perplexity research, 2026-05-16 (gap A4). Four-question Q&A:
  multi-save quotas, schema-generator choice, Phase-2 cloud-sync
  format, women's football data-model additivity.
- Wave 3 gap A4 Q&A with Nico (2026-05-16): all four recommendations
  accepted as-is.
