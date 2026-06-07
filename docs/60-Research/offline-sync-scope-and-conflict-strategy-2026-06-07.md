---
title: Offline Sync — MVP scope + conflict-resolution strategy (grounding)
status: draft
tags: [research, offline, sync, pwa, crdt, conflict-resolution, determinism, fmx-66b]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../30-Implementation/pwa-offline-strategy]]
---

# Offline Sync — MVP scope + conflict-resolution strategy

Grounds the (currently undefined) post-MVP Offline Sync path. The bounded-context map lists Offline
Sync as "MVP: cache/draft status + freshness; future: local outbox, command replay, conflict logic" —
but no ADR fixes the conflict strategy or confirms the narrow MVP scope. ADR-0090 does.

## Open calls

- **D1 — MVP scope:** ratify Offline Sync as a thin cache+draft context now, or build the full sync
  engine up front?
- **D2 — conflict-resolution strategy** for queued offline commands against the authoritative server:
  last-write-wins vs **server-authoritative re-validation/rebase** vs operational transforms vs CRDTs.

## What best practice says (Perplexity Sonar, 2026-06-07)

- **D2 → server-authoritative re-validation + rebase.** For a rules-strict, deterministic,
  event-sourced game with a single authoritative server, the robust pattern is: client enqueues
  **commands** with a `commandId` (idempotency key) + `expectedVersion`; server loads the aggregate,
  checks the version (optimistic concurrency), **re-validates against current state + rules**, emits
  events (published via the transactional outbox), and the **client treats server events as canonical**
  and rebuilds its projection. On conflict the client refetches events and **re-applies (rebases) still-
  valid queued commands**, prompting the user only for rare high-value clashes.
- **CRDTs (Automerge/Yjs) are overkill — and wrong — for core game commands.** CRDTs give
  convergence-without-coordination for *multi-writer, no-authority* document state; using them for game
  commands would merge rule-violating actions structurally (e.g. two clubs "buying" the same player).
  **CRDTs are appropriate only for collaborative, non-authoritative features** — exactly the watch-party
  overlays/chat/shared-notes, which should be an isolated module with its own sync channel.
- **Last-write-wins** is acceptable only for cosmetic/local preferences (UI theme, notification
  settings), never for core game state. **Operational transforms** are overkill (real-time doc editing
  pattern; the server event stream already gives canonical ordering).
- **Local-first framework fit:** the **Replicache** model (local mutators → server replay → patch back)
  is conceptually closest to a server-authoritative command-replay design and can be *borrowed* without
  adopting the library. **ElectricSQL/PowerSync** are DB-row-replication/CRDT-leaning (good for
  collaborative relational data, weaker when the game engine — not DB merge rules — must validate).
- **D1 → thin MVP is fine if the seam is right.** MVP = Service-Worker cache (stale-while-revalidate
  for fixtures/tables) + **Dexie drafts** + synchronous commands. To not foreclose the full engine:
  (a) put a **`CommandQueue` interface** between UI and transport now (MVP impl sends immediately);
  (b) carry **`expectedVersion` + `commandId`** on commands and a `lastSeenVersion` on projections from
  day one; (c) keep the server API **command-oriented** (`POST …/commands/{type}` returning new
  version + emitted events); (d) ensure clients can always **rehydrate from server events**. Phase 2
  swaps in a durable IndexedDB outbox + background-sync + backoff behind the same interface; phase 3
  adds CRDT overlays as a separate module — none of it changes the event-sourced server.

## Recommendation

- **D1 = ratify the thin MVP scope** (cache + draft + synchronous commands) with the migration seam
  above mandated so the full engine is additive.
- **D2 = server-authoritative re-validation + rebase** for all core game commands (idempotency key +
  expected-version + outbox-published canonical events); **CRDT confined to watch-party collaborative
  overlays only**; LWW only for cosmetic local prefs. This is fully consistent with ADR-0008 (FMX-98)
  which already set the Dexie draft lifecycle (`draft→staged→submitting→confirmed|rejected`),
  expected-version preconditions and the "offline replay-queue + P2P optimistic deferred behind the
  same seam" contract — ADR-0090 names the Offline-Sync-context owner and fixes the conflict semantics.

## Sources

Perplexity Sonar 2026-06-07 (server-authoritative command revalidation vs LWW/OT/CRDT; PWA durable
outbox — IndexedDB/Dexie, Background Sync, idempotency, optimistic concurrency, backoff; Replicache /
ElectricSQL / PowerSync / Automerge / Yjs models; MVN→full-engine migration). MDN PWA offline guide;
Replicache/ElectricSQL/PowerSync docs.
