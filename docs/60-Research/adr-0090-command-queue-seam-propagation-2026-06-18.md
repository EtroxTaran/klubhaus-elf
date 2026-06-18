---
title: ADR-0090 Command Queue Seam Propagation
status: current
tags: [research, fmx-165, offline-sync, pwa, command-queue, conflict-resolution, event-sourcing, bounded-context]
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-165
related:
  - [[raw-perplexity/raw-adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[raw-perplexity/raw-adr-0090-command-queue-seam-source-checks-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../30-Implementation/hybrid-online-pwa-strategy]]
  - [[../40-Execution/fmx-165-command-queue-seam-decision-record-2026-06-18]]
---

# ADR-0090 Command Queue Seam Propagation

FMX-165 propagates an accepted decision. It does not reopen ADR-0090's D1/D2
or ADR-0119's replay/dedup ownership split.

## Accepted Baseline

ADR-0090 already ratifies:

- thin hybrid-online MVP: Service Worker cache, Dexie drafts and synchronous
  commands;
- a mandatory `CommandQueue` seam between UI and transport, even while the MVP
  implementation sends immediately;
- every command carries `commandId` and `expectedVersion`;
- every client projection carries `lastSeenVersion`;
- command-oriented API shape returning the accepted new version and emitted
  events, or a typed rejection;
- client projections can rehydrate from server events;
- server-authoritative re-validation and rebase for core game commands;
- CRDT only for future Watch Party collaborative overlays;
- last-write-wins only for cosmetic local preferences.

ADR-0119 already ratifies the ownership split:

| Responsibility | Owner |
|---|---|
| Client queue, retry/backoff, offline UX, rebase presentation and local projection freshness | Offline Sync |
| Authoritative replay/dedup policy and processed-command state | Audit & Security Command Reception |
| Domain command validation, rule enforcement and emitted events | Owning domain context |
| Committed event publication | ADR-0028 transactional outbox |

## Propagation Problem

Downstream notes still lag the accepted ADR:

| Note | Drift before FMX-165 | Required correction |
|---|---|---|
| [[../30-Implementation/hybrid-online-pwa-strategy]] | Generic server-function command flow, stale DB wording, no `CommandQueue`, no `lastSeenVersion`, no event rehydration, no conflict strategy. | Make the accepted seam visible in the PWA implementation strategy without selecting a new library. |
| [[../10-Architecture/bounded-context-map]] | Offline Sync row describes local command queue/retry/rebase as future only. | Show the interface seam as current, while durable queue persistence remains future. |
| [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] | Historical banner and Decision Log say no map-row change; body still says "Propose, awaiting Nico" / "If ratified". | Reconcile body wording to accepted status and clarify that FMX-165 changes wording, not context count or boundary. |

## Source-Checked Findings

| Source family | Finding | FMX consequence |
|---|---|---|
| Replicache docs | Local mutations can be pending, server state remains canonical, and clients rebase local work over server truth. | Use Replicache as conceptual support for a `CommandQueue` seam; no dependency decision. |
| MDN Background Sync | Browser Background Sync is limited availability and best-effort. | Do not depend on Background Sync for correctness; foreground/open/resume retry is required. |
| Dexie/IndexedDB | Dexie is suitable for local stores/transactions, but browser storage has quota/eviction limits. | Dexie holds drafts, cache and future queue state only; server confirmation owns progression. |
| Event-sourcing guidance | Commands, events, projections, replay/rehydration and optimistic concurrency are a coherent model. | `expectedVersion`, `lastSeenVersion`, emitted events and typed rebase/rejection copy are first-class PWA concerns. |
| Yjs / CRDT docs | CRDTs merge collaborative data without a central authority. | Keep CRDT for Watch Party overlays only, not core game commands. |
| Fowler bounded context | Context maps describe model boundaries and relationships. | The map names ownership/seams, while schema lives in later contract docs. |

## Recommended Wording Model

### ADR-0090

Keep ADR-0090 as the decision authority. Correct body-status wording from
pre-ratification language to accepted language and replace "no map row change"
with "no context count/boundary change; downstream wording updated by FMX-165."

### Bounded Context Map

The Offline Sync row should say:

- MVP owns cache/draft status and freshness metadata.
- The `CommandQueue` interface seam is already mandatory.
- MVP sends synchronously through that interface.
- Future work persists a durable IndexedDB queue and retry/backoff engine.
- Offline Sync owns client queue/retry/rebase UX and local projection metadata.
- Audit & Security owns authoritative replay/dedup acceptance.
- Domain contexts own validation and emitted domain events.

### PWA Strategy

The current PWA strategy should make the browser contract explicit:

- all game-state writes go through `CommandQueue`;
- command envelope includes `commandId`, `expectedVersion`, serializable payload
  and typed rejection surface;
- confirmed projections store `lastSeenVersion`;
- command responses return new aggregate/save version plus emitted events, or a
  typed rejection;
- reconnect/open/resume rehydrates events from `lastSeenVersion` before replaying
  or revalidating pending intents;
- conflict UX follows ADR-0090: rehydrate, revalidate, rebase if still legal,
  otherwise show a typed rejection;
- Background Sync is optional wake/retry support only.

## No New HITL Decision

FMX-165 applies accepted ADR-0090 and ADR-0119. It does not decide:

- the final TypeScript/Zod command-envelope schema;
- whether FMX adopts Replicache or any other sync library;
- queue caps, retry timing, storage quotas or conflict-copy exact strings;
- whether any local-authoritative match flow is allowed.

Those remain future implementation/calibration or separate Nico-gated decisions.
