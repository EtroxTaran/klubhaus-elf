---
title: Solution Strategy
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-06-08
type: arch
related: [[01-Introduction]], [[02-Constraints]], [[05-Building-Blocks]], [[09-Decisions/ADR-0019-modular-monolith-ddd]], [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]], [[09-Decisions/ADR-0021-revised-tech-stack]], [[09-Decisions/ADR-0027-postgres-data-model]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]], [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0024-match-renderer-abstraction]], [[09-Decisions/ADR-0023-realtime-transport]], [[09-Decisions/ADR-0041-presentation-renderer-strategy]], [[bounded-context-map]], [[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]], [[../00-Index/MVP-Scope]]
---

# Solution Strategy

This chapter records *how* the binding decisions combine into one coherent
approach. It cites the ratified ADRs/GDDRs; it does not restate or change them.

## 1. Service-ready modular monolith with DDD bounded contexts

Build a modular pnpm workspace as a **single deployable** that is internally
partitioned into **DDD bounded contexts**
([[09-Decisions/ADR-0019-modular-monolith-ddd]]). Each context owns its domain
logic and exposes a versioned, contract-first public surface, so individual
systems can be re-developed or split out to their own process later without
rewriting the rest. The ratified portfolio and its cluster grouping are the
single source of truth in [[bounded-context-map]]
([[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]) — refer
there for the canonical context count and the six subdomain clusters rather
than duplicating a number that can drift.

- `apps/web`: TanStack Start PWA and server functions
  ([[09-Decisions/ADR-0021-revised-tech-stack]]).
- Match engine adapter: deterministic simulation behind `MatchEnginePort`,
  isolated from React, DB, UI rendering and LLM code. The concrete runtime
  stance (Rust-native + WASM-replay vs WASM-everywhere vs TS-first MVP) is the
  open spike carried by
  [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]];
  the port and the numeric-surface contract hold regardless of which runtime wins.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: standalone, zero-dependency Zod validation mirror
  generated from the Drizzle schema ([[09-Decisions/ADR-0027-postgres-data-model]]).
- `packages/ui`: shared UI primitives/components.

## 2. Deterministic-first simulation

The match engine and all replay-bearing game logic are **deterministic first**
([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]):

- Every committed event, statistic, RNG draw or replay branch is computed on an
  **integer / fixed-point numeric surface**; floats are confined to throwaway
  render/interpolation downstream of the committed log.
- Randomness flows through the **9 named RNG streams** (canonical in
  `determinism-and-replay` §2.2), seeded per save, so a run is reproducible.
- The committed event log is the truth; replay is **resim-from-log** rather than
  persisted frame snapshots, which is what lets a server and a client re-derive
  identical state and underpins server-authoritative confirmation.

## 3. PostgreSQL as system of record + transactional outbox

PostgreSQL 18.x is the authoritative store
([[09-Decisions/ADR-0021-revised-tech-stack]],
[[09-Decisions/ADR-0027-postgres-data-model]]): per-save schema isolation with
the Drizzle schema as source of truth, operating within a documented
schema-per-save **scale ceiling** plus a cold/archive fallback
([[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]).
Domain events are published via a **transactional outbox** written in the same
transaction as the state change
([[09-Decisions/ADR-0028-postgres-transactional-outbox]]); the outbox is the
committed domain-event publication path and domain mutation trail, while
command-reception replay/dedup and security audit facts are owned separately by
Audit & Security per [[09-Decisions/ADR-0119-command-reception-dedup-seam]].
**SurrealDB is reserved** as a non-authoritative projection only and must not
hold authoritative state.

## 4. LLM strictly out of authoritative state

The LLM never writes authoritative game state
([[09-Decisions/ADR-0030-llm-out-of-authoritative-state]]): generated prose is
presentation only and is derived from already-committed deterministic facts. A
**deterministic-template narration floor** is the guaranteed, CI-enforced
fallback for every prose point
([[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]]), so the
game stays fully playable and narrated when offline or when the LLM is
unavailable.

## 5. Offline-first PWA with a command-queue / sync seam

The MVP runtime is **hybrid-online**
([[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]) over an offline-first
foundation, kept reachable behind a stable seam so selective offline-first
singleplayer can be added later without redesign:

- Server-confirmed commands own authoritative progression; match results are
  server-confirmed in MVP, with the determinism contract above making a future
  local-authoritative client adapter a port swap rather than a rewrite.
- Dexie / IndexedDB stores cached read models, drafts and local UI state.
- The **Offline Sync** context owns a narrow MVP command-queue / sync scope with
  a defined post-MVP conflict-resolution strategy
  ([[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]), so the
  thin MVP does not foreclose the full sync engine.
- Authoritative command replay/dedup is a server-side Command Reception
  capability owned by Audit & Security, not the client queue and not an outbox
  consumer ([[09-Decisions/ADR-0119-command-reception-dedup-seam]]).
- Contracts remain versioned and storage-adapter-friendly.

## 6. Swappable renderer and transport interfaces

Presentation and transport sit behind swappable interfaces so they evolve
without touching domain logic:

- The match renderer draws an ephemeral `MatchFrame` projected from the engine
  event log, behind a renderer abstraction
  ([[09-Decisions/ADR-0024-match-renderer-abstraction]]) under the two-renderer
  presentation strategy ([[09-Decisions/ADR-0041-presentation-renderer-strategy]]).
- Realtime delivery is a decoupled, swappable transport
  ([[09-Decisions/ADR-0023-realtime-transport]]) — a wake-up/update channel only;
  durable truth stays in PostgreSQL and can be projected onward.

## MVP runtime strategy

- Create-a-Club Roguelite first playable.
- Server-confirmed commands own authoritative progression.
- Club economy is an MVP pillar: weekly economy advancement, finance ledger
  updates and insolvency-stage changes are server-confirmed Club Management
  commands/read models.
- AI narration is an MVP-relevant emotional world layer; generated prose is
  presentation only over the deterministic narration floor (see §4).
- Match results are server-confirmed in MVP; local client adapters are preview
  or future selective-offline surfaces unless a later ADR/GDDR promotes them.

## Related

- [[05-Building-Blocks]] — module map (hub) · [[bounded-context-map]] — canonical context portfolio · [[09-Decisions/ADR-0019-modular-monolith-ddd]] — modular-monolith + DDD · [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]] — context catalog & count
- [[09-Decisions/ADR-0021-revised-tech-stack]] — stack decision · [[09-Decisions/ADR-0027-postgres-data-model]] — Postgres data model · [[09-Decisions/ADR-0028-postgres-transactional-outbox]] — outbox · [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] — scale envelope + audit
- [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] — determinism & numeric surface · [[09-Decisions/ADR-0030-llm-out-of-authoritative-state]] — LLM boundary · [[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]] — narration floor
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — MVP runtime staging · [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] — offline sync scope · [[09-Decisions/ADR-0024-match-renderer-abstraction]] — renderer seam · [[09-Decisions/ADR-0023-realtime-transport]] — transport seam · [[09-Decisions/ADR-0041-presentation-renderer-strategy]] — two-renderer strategy · [[../00-Index/MVP-Scope]] — scope
- Modules: [[modules/web]] · [[modules/match-engine]] · [[modules/game-data]] · [[modules/db-schema]] · [[modules/ui]]
- [[01-Introduction]] · [[02-Constraints]] — arc42 siblings
