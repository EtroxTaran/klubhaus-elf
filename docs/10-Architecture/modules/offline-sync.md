---
title: offline-sync module
status: draft
tags: [architecture, module, offline, sync, pwa]
context: offline-sync
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[../09-Decisions/ADR-0119-command-reception-dedup-seam]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Offline Sync Boundary

## Purpose

Client-side offline/online seam (Platform & Governance cluster): owns the
`CommandQueue` interface between UI and transport, cache/draft freshness state
and the `expectedVersion` conflict-presentation/rebase flow — so MVP submits
synchronously while the durable queue is a purely additive future evolution
(ADR-0090).

## Owns

- The ADR-0090 `CommandQueue` interface (UI ↔ transport). MVP impl sends
  commands synchronously through this seam.
- Cache-freshness + draft-status metadata; projection freshness via
  `lastSeenVersion`.
- Client-side draft lifecycle (`draft → staged → submitting → confirmed |
  rejected`, per ADR-0008).
- Service-Worker stale-while-revalidate caching of read models (fixtures,
  tables).
- Client retry/backoff state and the `expectedVersion` conflict presentation /
  rebase flow.
- "Requires connection" / offline UX states.
- Future (post-MVP): durable IndexedDB command outbox, background-sync flush +
  exponential backoff, queue caps.

## Public contract

The migration seam is mandated; the discrete command/query/event vocabulary
that Offline Sync *itself* exposes is not yet enumerated in the sources. What
the ADRs/BCM pin down:

- **Seam (interface):** `CommandQueue` (UI → transport). Every command carries
  `commandId` (idempotency key) + `expectedVersion`; every client projection
  carries `lastSeenVersion`. Clients can always rehydrate projections from
  server events (ADR-0090 D1).
- **Server contract it submits to (owned elsewhere):** command-oriented API
  `POST .../commands/{type}` → returns new version + emitted events. Dedup /
  replay acceptance is the synchronous **Command Reception** capability owned by
  Audit & Security (ADR-0119), not by Offline Sync.
- **Conflict semantics it consumes:** a different `commandId` with a stale
  `expectedVersion` returns a domain/concurrency result that Offline Sync
  presents or rebases; same-`commandId` retries are resolved by the Command
  Reception dedup gate, not by Offline Sync (ADR-0119 D2/D3).
- **Conflict-resolution strategy (D2):** server-authoritative re-validation +
  rebase for all core game commands. CRDTs confined to future Watch Party
  collaborative overlays (separate sync channel); last-write-wins only for
  cosmetic local preferences (theme, notification toggles), never game state.

See **## Open items** for the contract elements the sources leave unspecified.

## Storage ownership

- Owns **client-side** storage only: Service-Worker cache + Dexie/IndexedDB
  drafts and (future) the durable IndexedDB command queue.
- Does **not** own any server-side schema/table. The authoritative
  processed-command store, the canonical event store / transactional outbox
  (ADR-0028) and domain tables belong to other contexts.
- No cross-context joins: per ADR-0121 each context owns its own tables and no
  shared tables / cross-schema joins are permitted; client projections rehydrate
  from server events, not from foreign reads. Server schema convention per
  ADR-0027.

## Consumers / Producers

- **Consumes facts from (produces queued commands for):** Identity & Access,
  Club Management, Squad & Player, Transfer, Match — Offline Sync wraps their
  commands behind the queue and caches/rehydrates their read models (BCM map
  edges `Offline → Identity / Club / Squad / Transfer / Match`).
- **Cooperates with:** Audit & Security (synchronous Command Reception
  dedup/replay gate, ADR-0119) and Identity & Access (auth/session binding on
  the command path).
- **Hands authority to:** owning domain contexts (command legality + aggregate
  invariants) and ADR-0028 outbox (post-commit event publication). Offline Sync
  is never authoritative.

## Invariants

- The client is **never authoritative**: server-authoritative re-validation +
  rebase is the only conflict authority (ADR-0090 D2; ADR-0119 D1 rejects client
  dedup ownership).
- Every mutating command carries `commandId` + `expectedVersion`; every
  projection carries `lastSeenVersion`.
- `expectedVersion` (concurrency / rebase) is distinct from `commandId`
  idempotency (replay/dedup); Offline Sync owns only the former's UX, not the
  authoritative dedup decision (ADR-0119 D2).
- Offline Sync does **not** own: domain validation, the canonical event store /
  outbox (ADR-0028), server-side replay/dedup acceptance + processed-command
  state (Audit & Security, ADR-0119), or the Watch Party CRDT overlay module.
- MVP sends synchronously behind the seam; durable queue, retry/backoff and
  queue caps are additive and must not change the server command contract.
- No shared tables / cross-context joins (ADR-0121); client-only storage.

## Open items

Source-unspecified — flagged, not invented:

- No discrete **Command / Query / Domain Event vocabulary** for Offline Sync is
  enumerated in ADR-0090, ADR-0119 or the BCM row; only the `CommandQueue`
  interface seam and the `commandId` / `expectedVersion` / `lastSeenVersion`
  envelope fields are fixed.
- The **processed-command table/schema** and the **response replay envelope**
  are explicit code-phase follow-ups in ADR-0119 (and are owned by Audit &
  Security, not Offline Sync).
- The concrete **durable IndexedDB queue schema**, queue caps and
  backoff/retry-state shape are future implementation responsibilities (ADR-0090
  / BCM future-scope), not yet specified.
