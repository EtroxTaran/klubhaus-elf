---
title: ADR-0090 Offline Sync — MVP scope and conflict-resolution strategy
status: accepted
tags: [adr, architecture, offline, sync, pwa, crdt, conflict-resolution, determinism, fmx-103]
created: 2026-06-07
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0008-mobile-first-ui]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[../bounded-context-map]]
  - [[../../60-Research/offline-sync-scope-and-conflict-strategy-2026-06-07]]
  - [[../../30-Implementation/pwa-offline-strategy]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0090: Offline Sync — MVP scope and conflict-resolution strategy

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored 2026-06-07 to close the Offline Sync "thin/undefined"
> gap surfaced in the open-decisions sweep. Defines what the ratified **Offline Sync** bounded context
> owns at MVP and the post-MVP conflict-resolution strategy, so the narrow MVP does not foreclose the
> full sync engine. Awaiting Nico ratify. No bounded-context-map change (Offline Sync already exists in
> the ratified table; this ADR only fixes its internal scope + contracts).

## Date

2026-06-07

## Context

The bounded-context map lists **Offline Sync** as "MVP: cache/draft status and freshness metadata.
Future: local outbox, command replay, conflict logic." ADR-0020 ratified the *hybrid-online MVP,
offline-ready* posture; ADR-0008 (FMX-98) set the client-state contract (Dexie draft lifecycle
`draft → staged → submitting → confirmed | rejected`, `expected-version` preconditions, "offline
replay-queue + P2P optimistic deferred behind the same seam"). What is **not** ratified anywhere is
**(a)** confirmation that Offline Sync stays a thin cache+draft context at MVP, and **(b)** the
**conflict-resolution strategy** for queued offline commands once the full engine lands. That gap is
the last undefined piece of the Offline Sync context.

The simulation is deterministic and event-sourced with a transactional outbox (ADR-0028); the server
is the single source of truth; clients use optimistic local UI. Async P2P "watch party" features add
collaborative, non-authoritative surfaces (chat/overlays).

## Options considered

### D2 — conflict-resolution strategy for queued commands

- **A. Server-authoritative re-validation + rebase.** Client enqueues commands with a `commandId`
  (idempotency key) + `expectedVersion`; server re-validates against current aggregate state + rules,
  emits canonical events via the outbox; client treats server events as truth and rebases still-valid
  queued commands on conflict. **← recommended.**
- **B. Last-write-wins.** Simple, but accepts rule-violating later writes; only safe for cosmetic local
  preferences.
- **C. Operational transforms.** Real-time collaborative-editing pattern; overkill — the server event
  stream already provides canonical ordering.
- **D. CRDTs (Automerge/Yjs) for core state.** Convergence-without-authority; **wrong** for
  rules-strict game commands (would structurally merge invalid actions). Appropriate **only** for
  collaborative non-authoritative surfaces.

### D1 — MVP scope of the Offline Sync context

- **A. Thin MVP (cache + draft + synchronous commands) behind a migration seam.** **← recommended.**
- **B. Build the full durable-outbox + replay engine up front.** Higher cost/risk before the core game
  loop is proven.

## Decision

Propose, awaiting Nico:

- **D1 = A.** Offline Sync stays a **thin context at MVP** — Service-Worker cache (stale-while-revalidate
  for read models: fixtures, tables) + **Dexie drafts** + synchronous commands. **Mandate the migration
  seam now** so the full engine is purely additive: (1) a `CommandQueue` interface between UI and
  transport (MVP impl sends immediately); (2) every command carries `commandId` + `expectedVersion` and
  every client projection carries `lastSeenVersion`; (3) the server API is command-oriented
  (`POST .../commands/{type}` → returns new version + emitted events); (4) clients can always rehydrate
  projections from server events.
- **D2 = A.** **Server-authoritative re-validation + rebase** for all core game commands. CRDTs are
  **confined to watch-party collaborative overlays** (chat, shared notes/markers) as an isolated module
  with its own sync channel; **last-write-wins is allowed only for cosmetic local preferences** (theme,
  notification toggles), never for game state.

If ratified, the **Offline Sync** context owns: cache-freshness + draft status metadata (MVP); and
post-MVP the durable command outbox (IndexedDB), background-sync flush + exponential backoff, the
idempotency/expected-version reconciliation loop, and the offline UX states. It does **not** own:
domain validation (each owning context re-validates its own commands), the canonical event store /
outbox (ADR-0028), or the watch-party CRDT overlay module (separate sync channel).

## Rationale

A rules-strict, deterministic, event-sourced game with one authoritative server matches the
**command-sourcing + server-replay** pattern (conceptually the Replicache "local mutators → server
replay → patch back" model), not the CRDT/OT collaborative-document pattern. Server-authoritative
rebase keeps rule enforcement and a simple "server always wins" mental model, and reuses the existing
ADR-0028 outbox as the canonical event channel. CRDTs deliberately ignore domain rules, so they are
reserved for the genuinely multi-writer, no-authority watch-party overlays. A thin MVP avoids building
a full sync engine before the core loop is proven, while the mandated seam (command queue interface +
versioning + command-oriented API + event rehydration) means phase 2 (durable outbox) and phase 3
(CRDT overlays) are additive and never touch the server contract. This is fully consistent with
ADR-0008's client-state contract and ADR-0020's hybrid-online posture.

## Consequences

Positive:

- Closes the Offline Sync "undefined" gap with a ratifiable scope + conflict semantics.
- Reuses ADR-0028 outbox + ADR-0008 client-state seam; no new infrastructure at MVP.
- Migration path is additive: MVP → durable outbox → CRDT overlays, no server-contract churn.
- Determinism preserved: server re-validation is the only authority; replay is byte-reproducible.

Negative:

- Requires discipline now (versioning + command-oriented API + command-queue interface) even though
  MVP sends synchronously — small upfront cost to avoid a later rewrite.
- Watch-party CRDT overlay module is a distinct sync stack to build post-MVP.
- Full durable-outbox conflict-UX (user-facing resolution for rare high-value clashes) is post-MVP.

## Supersedes

None. Extends ADR-0020 (offline-ready posture) and ADR-0008 (client-state seam) additively.

## Related Docs

- [[../../60-Research/offline-sync-scope-and-conflict-strategy-2026-06-07]] - grounding (server-auth
  rebase vs CRDT/OT/LWW; PWA outbox; local-first frameworks; migration path).
- [[ADR-0020-hybrid-online-mvp-offline-ready]] - hybrid-online MVP, offline-ready posture.
- [[ADR-0008-mobile-first-ui]] - client-state contract (Dexie drafts, expected-version, replay-queue
  seam) ratified via FMX-98.
- [[ADR-0028-postgres-transactional-outbox]] - canonical event delivery channel.
- [[ADR-0027-postgres-data-model]] - per-save / platform schema convention.
- [[ADR-0019-modular-monolith-ddd]] - modular-monolith ground rules.
- [[../bounded-context-map]] - Offline Sync context (scope fixed by this ADR; no map row change).
- [[../../30-Implementation/pwa-offline-strategy]] - PWA caching/offline implementation note.
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A.
