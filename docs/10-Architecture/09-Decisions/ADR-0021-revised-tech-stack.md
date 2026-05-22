---
title: ADR-0021 Revised Tech Stack
status: accepted
tags: [adr, architecture, database, state, validation]
created: 2026-05-19
updated: 2026-05-22
accepted_at: 2026-05-19
type: adr
binding: true
supersedes: ADR-0001-tech-stack
superseded_by:
related: [[ADR-0001-tech-stack]], [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0013-transactional-outbox]], [[ADR-0020-hybrid-online-mvp-offline-ready]], [[ADR-0022-animation-game-feel]], [[ADR-0023-realtime-transport]], [[ADR-0024-match-renderer-abstraction]], [[ADR-0025-mobile-delivery]], [[ADR-0043-notification-and-messaging-platform]], [[../11-Risks]]
---

# ADR-0021: Revised Tech Stack

## Status

accepted

## Date

2026-05-19

## Context

ADR-0001 locked the stack early. A deeply-researched mid-2026 re-evaluation
(commissioned to keep risky pre-1.0 bets only where they create real advantage,
and to drop them where the risk lands on irreversible, money-critical state)
surfaced that some original bets no longer hold:

- The data layer is **greenfield** (`db/schema.surql` was 5 lines; the data
  model was one Zod `RecordId`). Changing the database now is nearly free;
  later it is not.
- SurrealDB's documented weak spots (Enterprise-gated PITR, single-node OSS,
  unresolved fsync/durability debate, forced breaking migrations every major,
  no official TS codegen, tiny hiring pool) align almost exactly with this
  project's situation: a small team self-hosting on Hetzner, storing players'
  paid money/contract/progression state.
- React Context as the only state mechanism does not serve a state-heavy game
  (match simulation, large tables, server-mirrored data).
- "Minimal Tailwind keyframes only" is insufficient for the stated
  game-feel goal.

The frontend is **not** greenfield (~7.5k LOC of React/TanStack Start, 99 test
files, Storybook, design system) — foundational frontend choices are retained.

This ADR records the revised foundational stack. Animation, realtime transport,
the match renderer, and mobile delivery are peer ADRs (0022–0025); the
password-hash correction is recorded in the F2 [[../../30-Implementation/auth-flows]] spec.

## Options Considered

- **Keep SurrealDB as primary** (original ADR-0001): velocity/feature elegance
  (multi-model + Live Queries) at the cost of durability/ops risk on the money
  core.
- **Postgres + Drizzle as the system of record; SurrealDB fully dropped**:
  safest, but discards the genuine Live-Query/graph upside permanently.
- **Hybrid (chosen)**: Postgres + Drizzle is the system of record now;
  realtime/graph are decoupled behind interfaces so SurrealDB can return
  post-launch as an *additive, swappable* engine iff the graph/live experience
  proves to be the product differentiator.

## Decision

**Retained from ADR-0001, unchanged:** TanStack Start (now GA), React,
TanStack Router, Tailwind, the Aurelia Premier design system + Storybook,
Dexie/IndexedDB (client cache/drafts), Biome, Vitest, Playwright, fast-check,
Stryker, pnpm, Docker. Deployment stays Dokploy with a mandatory mitigations +
Kamal-2 escape-hatch note (see [[../11-Risks]] and
[[../../30-Implementation/deployment-dokploy]]).

**Changed / added:**

1. **Database — hybrid.** PostgreSQL + Drizzle ORM is the system of record from
   day one (ACID for money/contracts/progression; trivial Hetzner
   `pg_dump`/PITR; Drizzle v1 best-in-class TS inference). Graph-ish needs
   (scouting, relationships) use typed recursive CTEs. **SurrealDB is deferred,
   not adopted**: it may be introduced post-launch as an additive engine for
   realtime/graph behind the [[ADR-0023-realtime-transport]] interface iff it
   proves to be the differentiator.

   2026-05-22 amendment: [[ADR-0043-notification-and-messaging-platform]]
   selects SurrealDB as an allowed additive projection/live-graph store for
   notification and inbox read models. PostgreSQL remains the durable system of
   record; SurrealDB does not own money/progression/notification truth.
2. **State — split.** TanStack Query (+ persist-client over IndexedDB) for all
   server-mirrored state; **Zustand v5** for client/UI/match-simulation state
   (replaces ad-hoc React Context for app/game state). **Not TanStack Store** —
   not production-ready as a primary store in 2026 (still used transitively
   inside Query/Form/Table, which is fine).
3. **TanStack data layer — all-in.** Add TanStack Query, Table, Virtual, Form
   (league tables / squad lists / transfer browsers / game forms). Decisive
   strengths of the chosen ecosystem, not just safe bets.
4. **Validation — Zod 4** as the type-safety spine; **Zod Mini** on the PWA
   bundle-critical client path. Decisively better than Valibot *for us*
   (ecosystem, DX, TS compile speed, TanStack integration).
5. **Reproducibility.** No `"latest"` dependency specifiers anywhere; all deps
   pinned, Renovate manages upgrades (TanStack grouped; frontier deps
   never auto-merged).

## Rationale

The through-line: **keep risky bets where the upside compounds and the blast
   radius is contained behind an interface (the TanStack ecosystem; Canvas 2D
   match renderer; SSE→Centrifugo; SurrealDB-as-additive-later); refuse the risk
   only where it
lands on irreversible, money-critical state (the relational core → Postgres).**
Velocity gained in the graph/realtime corner does not outweigh risk taken on
the financial/relational core for a small self-hosting team. Zustand and Zod 4
were validated as the correct picks over their alternatives; TanStack Start is
retained because the router/query core is mature, it is now GA, it aligns with
the all-in ecosystem direction, and ~7.5k LOC is sunk.

## Consequences

Positive:

- Money/contract/progression data sits on a rock-solid ACID core with a deep
  hiring pool and trivial backup/PITR on Hetzner.
- The TanStack ecosystem carries the data-heavy UI (typed routes/search,
  cached server state, virtualized 50k-row tables, typed forms).
- The SurrealDB upside is preserved as a reversible, additive future bet, not
  discarded.
- Reproducible builds (pinning) directly serve the reliability goal.

Negative / follow-up:

- Drizzle's relational query builder does not abstract recursive CTEs; the
  graph parts are typed raw SQL (`sql`/`.with()`). Acceptable — graph needs are
  modest, not a property-graph workload.
- TanStack Start is young GA — pin versions, first-class deploy adapter, budget
  for minor-version migrations, no RSC dependency.
- ADR-0004 (data model), ADR-0013 (outbox substrate), and the
  [[../../30-Implementation/surrealdb-integration]] spec must be reworked for
  Postgres/Drizzle — tracked as the next engineering wave; this ADR records the
  decision (the repo operates doc-ahead-of-code by design).

## Supersedes

[[ADR-0001-tech-stack]]

## Related Docs

- [[ADR-0001-tech-stack]] — superseded predecessor
- [[ADR-0004-data-model]] · [[ADR-0013-transactional-outbox]] — substrate rework follows
- [[ADR-0022-animation-game-feel]] · [[ADR-0023-realtime-transport]] · [[ADR-0024-match-renderer-abstraction]] · [[ADR-0025-mobile-delivery]]
- [[../11-Risks]] — accepted-risk register
- [[../../30-Implementation/auth-flows]] — Argon2id correction (F2)
