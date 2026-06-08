---
title: ADR re-audit — Cluster C2 (Data / Persistence / Save / Sync)
status: draft
tags: [research, audit, adr, data, persistence, save, sync, postgres, surrealdb, outbox, offline, crdt, fmx-105]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[surrealdb-schema-patterns]]
  - [[determinism-and-replay]]
  - [[offline-sync-scope-and-conflict-strategy-2026-06-07]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../00-Index/Decision-Log]]
---

# ADR re-audit — Cluster C2 (Data / Persistence / Save / Sync)

Read-only audit of the data/persistence/save/sync decision cluster against the
current vault and 2026 external best practice. **Propose only — Nico ratifies.**
Every recommendation is 2–3 sourced options + a recommendation + confidence;
nothing here accepts or supersedes anything. Supersession, where warranted, is
flagged as a *new draft ADR* only.

Ground-truth constraints respected: offline-first PWA ([[../10-Architecture/09-Decisions/ADR-0002-offline-first]]),
LLM out of authoritative state, Dokploy deploy, narrow cloud-sync scope. The
Postgres-vs-SurrealDB axis is treated as the one genuinely live data-layer
tension (per [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]] hybrid clause +
[[surrealdb-schema-patterns]]), not a generic "modern DB" question.

## Per-ADR verdicts

### ADR-0004 — Data Model (SurrealDB-era) — `silently-superseded`/historical (sound supersession)

Frontmatter `status: superseded`, `superseded_by: ADR-0027`, with the standard
"historical memory only" banner. Supersession discipline is **correctly
applied** — substrate-agnostic invariants (per-save isolation, integer-only
numerics, UUIDv7, soft-10/hard-50 quota, forward-additive `gender_eligibility`)
are explicitly carried into [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] §Context.
Verdict is **sound** as a historical record. One residual: ADR-0004 §1 still
lists `audit_log` as a platform-DB table and §2 lists it SCHEMALESS; ADR-0028 §7
later *removes* the separate audit_log ("the outbox IS the audit trail"). That
drift is now an ADR-0027/0028 concern, not ADR-0004's (see cross-ADR §1).

### ADR-0027 — PostgreSQL Data Model (schema-per-save, Drizzle SoT) — `weak` (status drift + two open risks)

The decision itself is well-reasoned: schema-per-save *mechanically* enforces
the [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] §6 isolation contract (wrong
`search_path` → relation-not-found, not a silent cross-tenant read), lazy A2
migration keeps deploy O(1), Drizzle-as-source-of-truth + a generated standalone
Zod mirror reconciles the "no schema codegen" goal with ADR-0004's standalone
validation-package invariant. These are defensible. But three issues:

1. **Status drift (contradictory metadata).** Frontmatter `status: draft`
   (the 2026-05-27 global reopen, [[../00-Index/Current-State]] line 21) but the
   body still reads `## Status` → `accepted` and the §Supersedes block asserts
   ADR-0004 *is* superseded. So the doc simultaneously claims draft and accepted.
   Low-severity but exactly the kind of "single current truth per fact" the vault
   governance forbids.
2. **Schema-per-save scaling is asserted, not bounded.** §1 picks schema-per-save
   over row-level/db-per-save on isolation grounds and parks the cost in
   [[../11-Risks]], but never states the *tenant-count envelope*. External
   research (Perplexity Sonar, 2026-06-08) confirms there is no hard Postgres
   schema-count limit, but at low-thousands of schemas the real costs are
   **migration fan-out, `pg_dump` enumeration time, `pg_class`/`pg_attribute`
   catalog bloat + planner overhead, and `search_path` leakage on pooled
   connections**. With soft-10/hard-50 saves per user, even 10k users ≈ up to
   500k schemas — well past the "low-thousands still viable" comfort band the
   research flags. The ADR's own §8 mitigates the leakage axis (`SET LOCAL
   search_path`, gateway-only pool), and lazy migration mitigates fan-out, but
   the catalog-bloat / `pg_dump`-at-scale axis is unmodelled.
3. **`audit_log` table listed but later deleted by ADR-0028** (see cross-ADR §1).

Recommendation — keep schema-per-save (the isolation argument is strong and
genre-appropriate) but add an explicit scale envelope + escape hatch:
- **Option A (recommended, medium):** keep schema-per-save; add a documented
  ceiling (e.g. "viable to N active schemas/node; beyond that, shard saves
  across DB instances or fall back to row-level for archived saves") + a
  `pg_dump`/PITR-at-scale operational note. Cheapest; preserves the isolation
  win.
- **Option B (medium-low):** hybrid — schema-per-*active*-save, row-level (or
  cold blob) for archived saves, so the live catalog stays bounded while
  archives (the bulk of the 50-cap) don't inflate `pg_class`.
- **Option C (low):** row-level tenancy with a `saveId` predicate + RLS. Simpler
  ops at very high tenant counts but loses the "wrong path = error not leak"
  mechanical guarantee ADR-0027 explicitly chose. Not recommended given the
  isolation priority.

### ADR-0028 — PostgreSQL Transactional Outbox — `weak` (status drift + audit-table contradiction)

Substrate rework is sound and current: same-Postgres-transaction insert is
strictly stronger than the old SurrealDB→Redis "atomic in DB, at-least-once to
Redis"; **polling-floor + LISTEN/NOTIFY with polling as the correctness floor**
is exactly the 2026 best practice (NOTIFY is non-durable / pgbouncer-stripped,
so it must be a latency optimisation only — the ADR states this correctly);
native declarative range partitioning by month is well-trodden. Two issues:

1. **Status drift** identical to ADR-0027: frontmatter `draft`, body `accepted`.
2. **Audit-trail contradiction with ADR-0027** (cross-ADR §1): §7 declares "no
   separate `audit_log` table at MVP; the outbox IS the audit trail," yet
   ADR-0027 §1 + §4 still enumerate `audit_log` as a platform-DB SCHEMALESS
   table, and the newer [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
   (proposed) wants a *separate, hash-chained, signed* security audit log. Three
   docs, three different positions on whether an audit_log table exists.

Recommendation: a small superseding/clarifying ADR (or a coordinated amendment
pair) that fixes one canonical answer:
- **Option A (recommended, medium):** outbox = *business/domain* event trail;
  ADR-0091's hash-chained log = *security/tamper-evidence* trail; **drop
  `audit_log` from ADR-0027's table list** since neither successor uses it.
  Cleanest; matches both successors.
- **Option B (low):** keep a thin `audit_log` projection fed from the outbox for
  query convenience; document it as derived, not source-of-truth.
Confidence medium — both successors already lean toward Option A.

### ADR-0013 — Transactional Outbox (SurrealDB + Redis Streams) — `silently-superseded`/historical (sound supersession)

Frontmatter `status: superseded`, `superseded_by: ADR-0028`, banner present. The
pattern (idempotency by UUIDv7, hot/cold retention, `consumer_event_offset`
UNIQUE, lag SLOs) is preserved into ADR-0028; only the substrate (Redis Streams
→ `RealtimeTransport`/SSE) changed. **Sound** as history. No action.

### ADR-0005 — Save Format and Versioning — `weak` (KDF guidance has moved on)

Strong on structure: compress-then-encrypt, AEAD AAD binds header to ciphertext,
three independent version fields (`envelopeVersion`/`saveVersion`/`engineVersion`),
two-mode export (device-key vs passphrase), Web-Worker pipeline, RNG snapshot per
D8, native `CompressionStream('gzip')` for zero bundle cost. All defensible and
current. The weak point is the **KDF choice**:

- ADR-0005 §3 mandates **PBKDF2-SHA256 at 600k iterations** and explicitly
  rejects Argon2id ("marginal gain… ~30-50 KB WASM"). External research
  (Perplexity Sonar, 2026-06-08; OWASP Password Storage trend) finds that for
  **new designs**, memory-hard **Argon2id is now the preferred default** for
  user-entered passphrases (GPU/ASIC resistance); PBKDF2-SHA256 is the
  *compatibility fallback* because Web Crypto exposes it natively while Argon2id
  needs WASM. So the ADR's *reasoning* (PBKDF2 sufficient, Argon2 not worth the
  bundle) is now the minority position for the **portable-export passphrase**
  path specifically (a user-chosen passphrase is the weak, brute-forceable
  secret; the device-backup key derives from a high-entropy account secret and
  is far less PBKDF2-sensitive).

Recommendation (the envelope already anticipates this — §Future notes "Argon2id
can replace PBKDF2 in a later envelope-v2"):
- **Option A (recommended, medium):** keep PBKDF2 for the *device-backup* key
  (high-entropy input, native Web Crypto), but move the *portable-export
  passphrase* path to **Argon2id** via a small WASM module, gated behind the
  existing `kdfAlgo` envelope field so old saves still load. Targets the only
  brute-forceable secret without WASM cost on the hot device path.
- **Option B (medium-low):** keep PBKDF2 everywhere but raise iterations on the
  passphrase path toward the current OWASP figure and re-check at implementation
  time. Cheapest; stays "fine" but not best-practice.
- **Option C (low):** Argon2id everywhere. Cleanest cryptographically; pays the
  WASM cost on every at-rest decrypt — overkill for the device-key path.
Note: PWA bundle/MVP-timing is amended by ADR-0020, so this is a future-contract
fix, not an MVP blocker — but the envelope field should be designed now.

### ADR-0090 — Offline Sync scope + conflict strategy — `sound` (with one stale citation)

The decision is **well-grounded and current**: for a rules-strict, deterministic,
event-sourced game with one authoritative server, **server-authoritative
re-validation + rebase** (command + `commandId` idempotency + `expectedVersion`)
is the correct pattern; CRDTs are correctly *confined* to non-authoritative
watch-party overlays; LWW only for cosmetic prefs; thin MVP behind a mandated
command-queue migration seam. External research (Perplexity Sonar, 2026-06-08;
PowerSync write-validation docs) **confirms** this exact split. One staleness
issue:

- §Rationale anchors the model on **Replicache** ("the Replicache local-mutators
  → server-replay → patch-back model"). As of 2025–2026 **Replicache was sunset
  / open-sourced; Rocicorp's successor is Zero**. The *conceptual* reference is
  still valid (command-replay), but citing Replicache as a live exemplar is
  stale and the conclusion it supports (don't adopt the library, borrow the
  model) actually strengthens once you note the sunset.

Recommendation — **no superseding ADR needed**; a one-line citation refresh when
ADR-0090 is ratified (note Replicache→Zero; the borrowed pattern is unchanged).
Verdict sound, confidence high.

### ADR-0016 — Community Datasets via Override Packs — `stale`/parked (sound but pending)

Status `proposed`, `binding: false`, explicitly **parked** by owner directive
(2026-05-19 banner) with a substrate amendment (pack storage → PostgreSQL, not
SurrealDB). The versioned-override-pack model (manifest + schema validation +
stable IDs + priority conflict resolution + P2P-only distribution) is sound and
genre-standard. It is **stale only in the sense that ADR-0059 has overtaken it**
as the implementing context (see cross-ADR §2). No independent fix needed beyond
the cross-reference ADR-0059 already proposes (Patch 4). Verdict: sound content,
parked status correct, confidence high.

### ADR-0059 — Community Overlay Pipeline Context — `gap`/`sound-proposal` (data-substrate questions under-specified)

As a *bounded-context placement* decision it is thorough and well-argued
(six-of-six DDD split criteria, Vernon ingestion-as-context pattern, two ratified
ADRs 0056/0057 already name "FMX-33 Community Overlay Pipeline" as their
orchestrator → dangling-reference resolution is the strongest single argument).
For **this cluster's lens (data/persistence/save/sync)** the relevant content —
mixed platform-scope `PackRegistry`/`IPSafetyAuditLog` + per-save immutable
`ActivePacksSnapshot` copied at save creation (ADR-0051 determinism rule),
activation via ADR-0028 outbox — is consistent with ADR-0027/0028. Two data-side
gaps worth flagging:

1. **Pack data inside the save envelope is unaddressed.** ADR-0059 says
   `ActivePacksSnapshot` is per-save and immutable, but neither it nor
   [[../10-Architecture/09-Decisions/ADR-0005-save-format]] §6 (SavePayload) lists active-pack
   data/refs as part of the encrypted export. A save exported to a friend who
   lacks the (P2P-distributed) packs is a determinism/loadability hole. ADR-0016
   §Compliance ("save records active packs; load-time mismatch surfaced") implies
   it, but the save-format contract doesn't encode it.
2. **Override-pack content validation vs the integer-only / Zod invariants
   (ADR-0027 §4/§7) is not spelled out** — imported pack attributes must pass the
   same CHECK/Zod bounds; ADR-0059 delegates *semantic* validation to owning BCs
   but the *structural* (integer/bounds) gate against the data model is implicit.

Recommendation: when ADR-0059 is ratified, add (a) an explicit ADR-0005
SavePayload field for `activePacks` refs + a missing-pack import path, and (b) a
one-line tie of `ManifestSchema` validation to the ADR-0027 Zod/CHECK bounds.
Confidence medium. The BC placement itself is sound (D1=A, D2=A as proposed).

## Cross-ADR issues within C2

1. **`audit_log` table — three conflicting positions.** ADR-0004 §1/§2 (historical)
   list a platform-DB SCHEMALESS `audit_log`; ADR-0027 §1+§4 (current substrate)
   *still* list `audit_log` as a platform table; ADR-0028 §7 *removes* it ("outbox
   IS the audit trail"); [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
   (proposed) wants a *separate* hash-chained signed security log. No single
   current truth on whether `audit_log` exists. → proposed clarifying ADR.

2. **ADR-0016 vs ADR-0059 ownership overlap.** ADR-0016 defines the pack
   model/scope; ADR-0059 defines the BC that implements it but ADR-0016 is not yet
   cross-linked as "implemented by ADR-0059" (ADR-0059 Patch 4 proposes the edit
   but it can't land until both ratify). Until then the relationship is implicit.
   Editorial, low severity.

3. **Save-format ↔ community-pack coupling gap.** ADR-0005 SavePayload (§6) does
   not encode active-pack references, but ADR-0016/0059 make pack activation a
   save-creation-immutable determinant of game state. Cross-cutting invariant
   (saves must record their active packs for deterministic reload/import) is
   stated in ADR-0016 prose but not in the ADR-0005 contract. → fold into the
   ADR-0005 KDF/contract refresh.

4. **Status-drift pattern (metadata vs body).** ADR-0027 and ADR-0028 both carry
   frontmatter `status: draft` (post-2026-05-27 reopen) while their bodies say
   `## Status: accepted`. Mechanical but violates single-current-truth; worth a
   sweep across all reopened ADRs, not just C2.

5. **Live data-layer tension (Postgres vs SurrealDB) is coherently resolved, not
   contradictory.** ADR-0021 keeps Postgres as system-of-record and SurrealDB as
   a *deferred additive* engine behind interfaces; ADR-0043 admits SurrealDB as a
   notification/inbox *projection* store only. ADR-0027/0028 build squarely on
   Postgres. No contradiction inside C2 — this is a clean, reversible posture and
   should **not** be relitigated. (Flagged because the task names it an open axis:
   it is open at the *future-additive* level, settled at the *system-of-record*
   level.)

## External research (2026-06-08, targeted)

- **Perplexity Sonar (2026-06-08)** — schema-per-tenant: no hard Postgres limit;
  real costs at thousands of schemas = migration fan-out, `pg_dump` enumeration,
  `pg_class`/`pg_attribute` catalog bloat + planner overhead, `search_path`
  leakage on pooled connections; viable at low-hundreds→low-thousands with
  discipline, row-level preferred beyond. → ADR-0027 §1 scale envelope.
- **Perplexity Sonar (2026-06-08)** — browser KDF: Argon2id is the preferred
  default for new designs / user passphrases; PBKDF2-SHA256 remains the native
  Web-Crypto compatibility fallback. → ADR-0005 §3.
- **Perplexity Sonar (2026-06-08)** + PowerSync write-validation docs — offline
  game sync: server-authoritative command re-validation + rebase is correct for
  rules-strict commands; CRDT row-sync only for collaborative low-stakes fields;
  **Replicache sunset/open-sourced, Rocicorp Zero is successor**. → confirms
  ADR-0090; refresh its Replicache citation.

## Proposed decisions (working titles; numbers assigned centrally)

1. **(superseding-ADR)** *PostgreSQL data-model scale envelope + audit-table
   canonicalisation* — supersedes/amends ADR-0027 (+ coordinates ADR-0028 §7):
   document the schema-per-save tenant-count ceiling + cold/archive fallback,
   and fix the single canonical answer on `audit_log` (drop it; outbox = domain
   trail, ADR-0091 = security trail). Confidence medium.
2. **(new-ADR or ADR-0005 amendment)** *Save-format KDF upgrade + active-pack
   refs* — Argon2id for the portable-export passphrase path behind the existing
   `kdfAlgo` envelope field; add `activePacks` refs + missing-pack import path to
   SavePayload. Confidence medium.
3. **(editorial, no new ADR)** *Status-drift + citation sweep* — reconcile
   frontmatter-vs-body `status` on reopened ADRs (0027/0028) and refresh
   ADR-0090's Replicache→Zero citation on ratification. Confidence high.
</content>
</invoke>
