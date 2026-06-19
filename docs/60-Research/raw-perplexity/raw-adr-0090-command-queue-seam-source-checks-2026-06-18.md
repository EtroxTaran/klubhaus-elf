---
title: Source Checks - ADR-0090 Command Queue Seam Propagation
status: raw
tags: [research, raw, source-checks, fmx-165, offline-sync, pwa, command-queue, event-sourcing, indexeddb, background-sync]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-165
related:
  - [[../adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[raw-adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
---

# Source Checks - ADR-0090 Command Queue Seam Propagation

These checks validate or downgrade the Perplexity discovery claims used for
FMX-165. They do not add a new architecture decision.

## Source Check Matrix

| Claim | Source checked | Finding | FMX use |
|---|---|---|---|
| Replicache-like sync is a good precedent for local mutation, server push and rebase. | Replicache docs, "How it works" (`https://doc.replicache.dev/concepts/how-it-works`) | Supports local mutations as pending client-side work, server as canonical state, replay/rebase of local changes over server state and optional SSE poke. | Use as conceptual precedent for `CommandQueue` + rehydration/rebase. Do not treat Replicache as a selected dependency. |
| Background Sync is not universally available and should not be the domain source of truth. | MDN Background Synchronization API (`https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API`) | MDN marks it limited availability, secure-context/browser-dependent and intended to defer work until stable network returns. Registration can fail. | PWA strategy must say Background Sync is optional best-effort only; foreground retry/resume remains required. |
| Dexie/IndexedDB can store local queues, caches and drafts, but browser storage is not authority. | Dexie transaction docs (`https://dexie.org/docs/Dexie/Dexie.transaction%28%29`) and Dexie StorageManager docs (`https://dexie.org/docs/StorageManager`) | Dexie supports IndexedDB transactions/versioned stores; browser storage is still subject to quota/eviction and persistence is not guaranteed. | Keep game progression authoritative on server; use Dexie for drafts, read-model cache and future queue metadata. |
| Event-sourcing supports command handlers, event streams, projections, rehydration and optimistic concurrency. | Microsoft Learn Event Sourcing pattern (`https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing`) | Source describes command handlers, append-only event streams, projections, replay/rehydration and optimistic concurrency via reject/reload/retry. | Supports command-oriented API returning new version/events and client rehydration from server events. |
| CRDTs are useful for collaborative shared data, not authoritative rules-strict game commands. | Yjs docs (`https://docs.yjs.dev/`) | Yjs describes network-agnostic CRDT shared types that merge updates without a central source of truth. | Keep CRDT only for future Watch Party collaborative overlays, matching ADR-0090. |
| Context maps should describe relationships between bounded contexts, not duplicate every schema. | Martin Fowler, "BoundedContext" (`https://martinfowler.com/bliki/BoundedContext.html`) | Fowler emphasizes explicit bounded contexts and relationships between them. | Put ownership and seams in `bounded-context-map`; keep full schema/contracts in future contract docs. |

## Extracted Evidence

### Replicache

Replicache documents the local-first flow in which a mutation is pending until a
push succeeds, the server remains canonical, and local changes are replayed or
rebased over newly pulled server state. This validates the ADR-0090 pattern of
optimistic local intent plus server-authoritative confirmation/rejection.

FMX consequence: name the pattern as "Replicache-like" only. FMX has not chosen
Replicache as a dependency.

### MDN Background Sync

MDN's Background Synchronization API page says the feature is limited
availability and is designed to defer tasks until the user has stable
connectivity. The registration path can fail and the feature depends on secure
context/browser support.

FMX consequence: the PWA strategy must require foreground/open/resume retry and
online-transition handling. Background Sync can be an optimization only.

### Dexie / IndexedDB

Dexie provides transaction helpers and versioned stores over IndexedDB. Its
StorageManager guidance points out browser quota and eviction concerns, and
that persistence is not guaranteed merely because data is in IndexedDB.

FMX consequence: Dexie can hold drafts/cache/future queue state, but no Dexie
record is authoritative game progression until server confirmation.

### Event Sourcing

Microsoft's Event Sourcing pattern describes command handlers that apply
business logic, append events, build projections and handle concurrency by
reject/reload/retry. The source also describes replay/rehydration and snapshots
as optimization for long streams.

FMX consequence: `lastSeenVersion`, returned emitted events, event rehydration
and typed conflict/rebase handling are coherent with ADR-0028 and ADR-0090.

### Yjs / CRDT

Yjs is explicit about collaborative shared data types that merge updates across
peers/providers without depending on a central source of truth.

FMX consequence: good fit for future Watch Party overlays; wrong default for
rules-strict core game commands where the server must reject invalid state
transitions.

### Fowler Bounded Context

Fowler's bounded-context guidance frames a context map as the place to describe
separate models and their relationships.

FMX consequence: `bounded-context-map` should show which context owns client
sync/rebase versus replay/dedup/domain validation. It should not inline a full
command schema.
