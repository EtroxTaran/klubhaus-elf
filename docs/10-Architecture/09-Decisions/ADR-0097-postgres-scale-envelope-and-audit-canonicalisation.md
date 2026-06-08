---
title: ADR-0097 PostgreSQL data-model scale envelope + audit-table canonicalisation
status: draft
tags: [adr, architecture, data, postgresql, schema-per-save, scaling, audit, fmx-105]
created: 2026-06-08
updated: 2026-06-08
type: adr
binding: false
supersedes: ADR-0027-postgres-data-model
superseded_by:
related:
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0004-data-model]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0044-deployment-dokploy]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../60-Research/surrealdb-schema-patterns]]
  - [[../../60-Research/audit-security-context-definition-2026-06-07]]
  - [[../bounded-context-map]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0097: PostgreSQL data-model scale envelope + audit-table canonicalisation

## Status

draft

> **`draft` / `binding: false`.** Authored 2026-06-08. Builds on and **supersedes the unbounded
> tenant-count aspect of ADR-0027** (schema-per-save) and **amends ADR-0028** (the audit-trail
> placement). It does **not** edit ADR-0027 or ADR-0028 (supersession is by this new draft only); the
> isolation topology, lazy-migration model, Drizzle-source-of-truth and outbox pattern of those ADRs are
> preserved unchanged. This ADR (1) makes the schema-per-save **scale envelope operationally honest** by
> documenting a ceiling + cold/archive fallback, and (2) fixes a **single canonical answer** for the
> audit-table question that currently exists in three conflicting positions. Awaiting Nico ratify.

## Date

2026-06-08

## Context

Two unresolved tensions sit on top of the otherwise-settled Postgres data model.

**(1) Unbounded tenant-count.** [[ADR-0027-postgres-data-model]] §1 chooses **schema-per-save** because
only it *mechanically* enforces the [[ADR-0019-modular-monolith-ddd]] §6 strict-isolation contract — a
wrong `search_path` yields *relation-not-found*, never a silent cross-tenant read. That argument is
sound and is **not relitigated here**. What ADR-0027 never bounds is the **tenant-count envelope**. With
save quotas of **soft 10 / hard 50 per user** ([[ADR-0027-postgres-data-model]] §9,
[[ADR-0004-data-model]] §6.1), one PostgreSQL database accumulates **one live schema per non-deleted
save**. At even modest user counts this reaches the **hundreds of thousands** of live schemas — far
outside the band practitioners report as comfortable.

Targeted grounding (Perplexity, 2026-06-08) puts the schema-per-tenant comfort band at **≈100–300
schemas** per database, with **noticeable pain in the high-hundreds-to-low-thousands (≈500–2,000)** and
**expert-only territory above several thousand (≈5,000–10,000+)**. The pain modes are concrete and all
scale with live-schema count: **migration fan-out** (the lazy A2 model defers this per-save, but
deploy-wide DDL and global maintenance still touch every live schema), **`pg_dump` enumeration time**
(dumps must enumerate every schema/relation), **`pg_class`/`pg_attribute` catalog bloat** (each save
adds a full table/index set, growing the catalog roughly linearly), and **planner overhead** on
catalog-heavy operations. There is no hard documented cutover — these are order-of-magnitude practitioner
bands — but a single [[ADR-0044-deployment-dokploy]] node cannot sit at hundreds of thousands of live
schemas without a deliberate strategy.

**PostgreSQL 18.4** is the current stable major as of authoring (Perplexity 2026-06-08; 18 GA, 18.4 the
latest minor; 19 in beta). The no-floating-`latest` rule applies — pin the concrete 18.x at
implementation.

**(2) Audit table in three conflicting positions.** The "where does audit live" answer is currently
self-contradictory across four ratified/proposed ADRs:

| Source | Position on audit |
|---|---|
| [[ADR-0004-data-model]] §§ (table list) | a platform **`audit_log`** table exists in `public`/shared |
| [[ADR-0027-postgres-data-model]] §4 | lists **`audit_log`** as a SCHEMALESS `jsonb` table |
| [[ADR-0028-postgres-transactional-outbox]] §7 | "**the outbox IS the audit trail** — no separate `audit_log` at MVP" |
| [[ADR-0091-audit-security-context-definition]] D2 | a **separate security audit log** owned by the Audit & Security context, distinct from the domain event store |

So the same name `audit_log` is simultaneously: a platform table (0004/0027), explicitly **absent**
(0028), and **superseded by a context-owned security log** (0091). An implementer reading the vault today
cannot tell which is canonical. This ADR fixes one answer.

## Options considered

### D1 — Schema-per-save scale envelope

- **A (RECOMMENDED).** **Keep schema-per-save; make it operationally honest.** Document a **schema
  ceiling per Dokploy node** (concrete number an open question, see below) plus a **cold/archive
  fallback**: *schema-per-active-save* stays the live model, but **archived** saves
  ([[ADR-0027-postgres-data-model]] §9 `state=archived`) drop out of the live catalog into
  **row-level / blob storage** (the encrypted save envelope of [[ADR-0005-save-format]] is already an
  opaque blob, so archived saves need no live game-state tables). Add a **`pg_dump`/PITR-at-scale
  operational note** (per-schema or filtered dumps, parallel `--jobs`, partition-aware restore). This
  preserves the wrong-`search_path`-is-an-error isolation guarantee for every *active* save while
  bounding the live catalog to the active-save population.
- **B.** **Hybrid storage only.** Schema-per-active-save + row-level for archived saves to bound the live
  catalog (same storage split as A) **but** without committing to a documented ceiling — bound the
  catalog by construction and skip the explicit per-node number. Loses the operational-honesty target
  (no stated ceiling to alert on).
- **C.** **Row-level tenancy with RLS for all saves.** Simplest ops at very high counts (one schema,
  catalog flat regardless of save count) **but loses the mechanical isolation guarantee**
  [[ADR-0027-postgres-data-model]] deliberately chose — a missed `WHERE save_id=` (or an RLS-policy gap)
  silently leaks across saves rather than erroring. **Not recommended** — it relitigates the most
  load-bearing isolation decision in the data model.

### D2 — Canonical audit-table answer

- **A (RECOMMENDED, paired with D1-A).** **Two trails, no platform `audit_log`.** The **outbox**
  ([[ADR-0028-postgres-transactional-outbox]] §7) is the **domain trail** ("how did game state
  change?"); the **Audit & Security context's separate security audit log**
  ([[ADR-0091-audit-security-context-definition]]) is the **security trail** ("who attempted what under
  which decision?"). **Drop the platform `audit_log` table** named in
  [[ADR-0004-data-model]]/[[ADR-0027-postgres-data-model]] — it is the orphaned third position with no
  remaining owner. This is the single canonical answer.
- **B.** **Keep `audit_log` as a derived outbox projection.** A read-model/materialised view over the
  outbox archive, owned by no domain context, for convenience querying. Adds a third artefact the system
  must keep consistent; risks re-introducing the "audit lives in three places" drift this ADR exists to
  remove.

## Decision

Propose, awaiting Nico: **D1 = A, D2 = A.**

### D1 — Keep schema-per-save; document a ceiling + cold/archive fallback

**Schema-per-active-save** is the live topology (unchanged from ADR-0027 §1). Add:

1. **A documented schema ceiling per node** — a soft-warn / hard-stop count of live schemas on a single
   [[ADR-0044-deployment-dokploy]] Postgres node, sitting inside the practitioner comfort/pain bands
   (the concrete number is an open question below; it is a per-node operational SLO, alerted like the
   outbox lag SLOs of ADR-0028 §6, **not** a hard DB limit).
2. **Cold/archive fallback** — when a save flips to `state=archived` (ADR-0027 §9), its per-save schema
   is **dropped from the live catalog** and the save persists as its **encrypted blob**
   ([[ADR-0005-save-format]]) in row-level/blob storage. Re-activation re-provisions the schema and
   restores game-state tables (a lazy, resim-consistent operation, in the spirit of ADR-0027 §2). This
   bounds the live catalog to *active* saves, not *all non-deleted* saves.
3. **`pg_dump` / PITR-at-scale operational note** — backups use per-schema or filtered dumps with
   parallel `--jobs`; PITR/WAL covers the whole cluster; archived-save blobs back up as ordinary rows.
   Documented so the backup window does not degrade silently as the active-save catalog grows.

The strong-isolation argument of ADR-0027 is **preserved in full** for every active save. This ADR only
makes the *count* the model can sustain explicit and adds the overflow path.

### D2 — One canonical audit answer: outbox = domain trail, ADR-0091 log = security trail; drop platform `audit_log`

There is **no platform `audit_log` table**. The two trails are:

- **Domain trail** = the transactional outbox + its partitioned archive
  ([[ADR-0028-postgres-transactional-outbox]] §4, §7).
- **Security trail** = the Audit & Security context's append-only, hash-chained security audit log
  ([[ADR-0091-audit-security-context-definition]]), which *consumes* the outbox and never joins other
  contexts' tables.

The `audit_log` table named in [[ADR-0004-data-model]] and listed in
[[ADR-0027-postgres-data-model]] §4 is **dropped** — it is the orphaned position superseded jointly by
ADR-0028 (outbox-is-audit) and ADR-0091 (context-owned security log). GDPR Art. 17 erasure follows the
existing mechanics (ADR-0028 §7 HMAC pseudonymisation; ADR-0091 retain-fact-sever-identifier).

## Rationale

DDD and the isolation contract are not the open question — *scale honesty* is. Schema-per-tenant is a
well-trodden pattern that is comfortable in the low hundreds and becomes an engineering problem in the
thousands (grounding 2026-06-08); the failure of ADR-0027 was leaving the soft-10/hard-50 quota to imply
an unbounded live-schema count with no stated ceiling or overflow path. Bounding the catalog to *active*
saves (archived saves are already opaque blobs, so they need no live tables) keeps the mechanical
isolation guarantee — the single most load-bearing data-model invariant — for everything a player is
actually using, while removing the unbounded-growth landmine. Row-level-for-all (C) would buy flat
catalogs at the cost of that guarantee, relitigating a settled decision; it is rejected for the same
reason ADR-0027 rejected it originally.

On audit, three sources cannot all be canonical. ADR-0028 (outbox-is-audit) and ADR-0091 (separate
security log) are the two *deliberate, recent* positions and they are complementary (domain vs security
trail); the bare `audit_log` table in ADR-0004/0027 is the *vestigial* one with no owner under that
two-trail model. Dropping it — rather than keeping a derived projection (B) — removes the drift surface
permanently and leaves exactly one answer per question.

PostgreSQL 18.4 is current stable; pin the concrete 18.x at implementation (no-floating-`latest` rule).

## Consequences

Positive:

- Schema-per-save scaling becomes **operationally honest**: a stated per-node ceiling to alert on and a
  defined overflow path, instead of an implicit unbounded count.
- **One canonical audit answer** (outbox = domain trail, ADR-0091 log = security trail); the `audit_log`
  three-way contradiction is closed.
- The **mechanical isolation guarantee** of ADR-0027 is preserved for every active save.
- Archived saves stop consuming catalog/`pg_dump`/planner budget while remaining restorable.

Negative / follow-up:

- Archive/unarchive is now a **schema drop/re-provision** (not the cheap ADR-0027 §1 state-flip);
  re-activation latency must be acceptable (lazy, resim-consistent — acceptable, but a new code path).
- The per-node schema ceiling is an **operational SLO** that must be monitored and enforced; reaching it
  triggers the multi-node-sharding revisit below.
- Dropping `audit_log` requires confirming **no consumer** depends on a platform-level table of that name
  (none should under ADR-0028/0091, but the implementing wave must verify).

## Risks

- If the **active-save population on a single Dokploy node ever exceeds the ceiling**, the cold/archive
  fallback (D1-A point 2) **must already exist and be exercised** — it cannot be a paper fallback.
  Mitigation: build and test archive→blob→restore before active-save counts approach the soft-warn
  threshold.
- If single-node active counts grow past even the archived-aware ceiling, **multi-node sharding** of
  saves across Postgres instances becomes necessary — explicitly **out of scope** here and a revisit
  trigger, not a silent assumption.

## Open questions

1. **Concrete schema ceiling per node and archive trigger** — the soft-warn / hard-stop live-schema
   count for a single Dokploy Postgres node (inside the ≈100–300 comfort / ≈500–2,000 pain bands), and
   whether the archive trigger is purely `state=archived` or also a least-recently-used eviction under
   ceiling pressure.
2. **Drop `audit_log` entirely (D2-A) vs keep it as a derived outbox projection (D2-B)** — confirm no
   query path wants a platform-level audit table for convenience before fully removing the name.

## Supersedes

[[ADR-0027-postgres-data-model]] — **only the unbounded tenant-count aspect** (§1 schema-per-save now
carries a documented ceiling + cold/archive fallback; §4's `audit_log` table is dropped). All other
ADR-0027 decisions (isolation topology, lazy A2 migration, Drizzle source of truth, integer-only model,
branded UUID refs, quotas) are **preserved unchanged**. **Amends** [[ADR-0028-postgres-transactional-outbox]]
§7 by confirming its "outbox IS the audit trail" as the canonical *domain* trail alongside ADR-0091's
*security* trail (no change to ADR-0028's mechanics). The superseded/amended files are **not edited**.

## Related Docs

- [[ADR-0027-postgres-data-model]] — superseded for the scale-envelope + `audit_log` aspects; isolation
  topology preserved.
- [[ADR-0028-postgres-transactional-outbox]] — amended (outbox = canonical domain audit trail).
- [[ADR-0004-data-model]] — original `audit_log` table named here is dropped.
- [[ADR-0091-audit-security-context-definition]] — the canonical *security* audit log (context-owned).
- [[ADR-0019-modular-monolith-ddd]] — §6 strict-isolation contract this ADR preserves.
- [[ADR-0044-deployment-dokploy]] — single-node deployment target the per-node ceiling is scoped to.
- [[../../60-Research/surrealdb-schema-patterns]] — the alternative data substrate (live Postgres-vs-SurrealDB
  axis); this ADR stays within the ratified Postgres choice.
- [[../../60-Research/audit-security-context-definition-2026-06-07]] — grounding for the security-trail half.
- [[../bounded-context-map]] — Audit & Security context (security trail) + Offline Sync context.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
