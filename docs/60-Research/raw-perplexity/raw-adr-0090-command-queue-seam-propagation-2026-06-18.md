---
title: Raw Perplexity - ADR-0090 Command Queue Seam Propagation
status: raw
tags: [research, raw, perplexity, fmx-165, offline-sync, pwa, command-queue, conflict-resolution]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-165
related:
  - [[../adr-0090-command-queue-seam-propagation-2026-06-18]]
  - [[raw-adr-0090-command-queue-seam-source-checks-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../../30-Implementation/hybrid-online-pwa-strategy]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Raw Perplexity - ADR-0090 Command Queue Seam Propagation

Private Perplexity discovery capture for FMX-165. This is discovery input, not
implementation authority. Weak citations were source-checked separately in
[[raw-adr-0090-command-queue-seam-source-checks-2026-06-18]] before promotion.

## Prompt

FMX has an accepted ADR-0090 for Offline Sync: thin hybrid-online MVP now, but
mandate a `CommandQueue` seam with `commandId`, `expectedVersion`, projection
`lastSeenVersion`, command-oriented API returning new version and emitted events,
client event rehydration, and server-authoritative re-validation + rebase. ADR-0119
separates Offline Sync client queue/retry/rebase UX from Audit & Security
Command Reception replay/dedup. How should we propagate this into a DDD bounded
context map and a PWA implementation strategy without duplicating schemas in
three places? Include current best practices for Replicache-like local-first
sync, Dexie/IndexedDB, Background Sync limitations, event rehydration,
optimistic concurrency and bounded-context ownership. Return concrete wording
options, source leads and open decision questions.

## Perplexity Discovery Summary

### Documentation layering

The response recommended keeping three separate documentation duties:

| Document | Duty |
|---|---|
| ADR-0090 | Why the seam exists and which invariants are accepted: `CommandQueue`, `commandId`, `expectedVersion`, `lastSeenVersion`, command-oriented API, event rehydration, server-authoritative rebase, CRDT/LWW exclusions. |
| Bounded context map | Ownership and integration: Offline Sync owns client queue/retry/rebase UX and local projection mechanics; domain contexts own command meaning, validation and emitted events; Audit & Security owns replay/dedup acceptance. |
| PWA implementation strategy | How the browser shell implements the accepted seam: a `CommandQueue` facade, Dexie-backed drafts/cache, local projection metadata, foreground sync/retry, Background Sync as optional wake helper only, event rehydration and conflict copy. |

The discovery pass explicitly warned against copying a full JSON command
envelope into every document. The stable envelope should be owned by the future
contract/schema home; ADR/map/PWA notes should name only the required fields and
responsibilities.

### Replicache-like pattern

Perplexity described Replicache-style sync as a useful mental model:

- local mutation executes immediately for optimistic UI;
- mutation is recorded as pending;
- server remains canonical;
- after server state changes, the client rebases pending local mutations over
  the latest server truth;
- the UI is speculative until the server confirms or rejects.

The discovery pass recommended using this as a precedent, not adopting
Replicache as a decided dependency.

### PWA queue posture

The PWA strategy should say that every game-state write goes through
`CommandQueue` even while MVP sends synchronously. This keeps direct
UI-to-transport submissions from bypassing the later durable queue. Future
IndexedDB persistence and retry/backoff become an implementation detail behind
the same interface.

The response recommended a small browser-side component vocabulary:

- `CommandQueue`: accepts command intents, attaches `commandId` and
  `expectedVersion`, submits immediately in MVP, persists/retries later.
- `LocalProjectionStore`: stores confirmed read models plus `lastSeenVersion`.
- `SyncEngine`: on reconnect/open/resume, rehydrates events from
  `lastSeenVersion`, then re-validates pending intents.
- `ConflictPresenter`: renders typed rejection/rebase copy for the user.

### Background Sync

Perplexity treated browser Background Sync as unreliable enough that it should
not be the authoritative domain source of truth. It can trigger best-effort
retries after connectivity returns, but the app must still handle foreground
resume, explicit retry and online-transition sync.

### Event rehydration

The response recommended phrasing event rehydration as:

- incremental events from `lastSeenVersion` when possible;
- future snapshots plus events when streams get large;
- typed rejection if a client is too stale to rebase automatically;
- never derive authority from the IndexedDB cache alone.

### Bounded context wording

Suggested context-map wording:

> Offline Sync owns client-side queue/retry/rebase UX, cached projection
> freshness and local draft state. It does not own domain validation, event
> publication or authoritative replay/dedup acceptance. Domain contexts validate
> commands and emit events; Audit & Security Command Reception owns replay/dedup
> policy and processed-command state.

## Perplexity-Suggested Open Questions

The discovery pass listed potential questions. FMX-165 resolves them by applying
already accepted ADR-0090/ADR-0119, not by opening new gates:

| Question | FMX-165 handling |
|---|---|
| Where does the command envelope schema live? | Future contract/schema home; this issue names required fields only and does not define a full schema. |
| Must all game-state writes go through the queue interface? | Yes. ADR-0090 already mandates the seam; MVP implementation sends immediately behind the interface. |
| Should rehydration be event-only or snapshot + events? | ADR-0090 requires clients can rehydrate from server events; FMX-165 allows future snapshot optimization without changing authority. |
| Should Background Sync be required? | No. Source checks show limited availability; it stays optional best-effort. |
| Can CRDT/LWW be used for core game state? | No. ADR-0090 already confines CRDT to Watch Party overlays and LWW to cosmetic local prefs. |
