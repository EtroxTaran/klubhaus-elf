---
title: ADR-0020 Hybrid-online MVP, Offline-ready Architecture
status: accepted
tags: [adr, pwa, mvp, offline-ready, indexeddb, sync]
created: 2026-05-18
updated: 2026-06-11
accepted_at: 2026-05-18
type: adr
binding: true
supersedes: ADR-0002-offline-first
amends: [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0011-server-authoritative-multiplayer]]
related: [[../../00-Index/MVP-Scope]], [[../../60-Research/offline-mvp-scope-and-sync-strategy]], [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0049-swappable-spatial-event-match-engine]]
---

# ADR-0020: Hybrid-online MVP, Offline-ready Architecture

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read "Accepted
> (2026-05-18). Supersedes [[ADR-0002-offline-first]] for MVP scope. Amends the timing of local
> save/export implementation in [[ADR-0005-save-format]] without discarding its
> envelope/versioning direction.". Body status reconciled to the frontmatter SSOT (ADR-0092) on
> 2026-06-11 (FMX-143).

## Context

The previous accepted offline strategy required fully playable offline
singleplayer in the MVP. New product research and Nico's scope decision change
the staging:

- MVP should prove the **Create-a-Club Roguelite** first playable.
- Full offline-first adds sync, storage, auth, retry, conflict and UX
  complexity before the core loop is validated.
- Future multiplayer remains server-authoritative, so no multiplayer effect may
  ever be finalised by the client while offline.
- Export/import is post-MVP, but the save envelope and version boundaries must
  be designed from the beginning.

The new goal is not "online-only forever". It is the least irreversible path:
ship a hybrid-online MVP while preserving the contracts needed for selective
offline-first singleplayer later.

FMX-10 reaffirms this as an **A -> C** path: keep the MVP hybrid-online, but
shape commands now so a later offline manager-week command outbox can be added.
Do not use local match simulation as an MVP authority shortcut.

## Decision

### 1. MVP authority is server-confirmed

In the MVP, persisted game progression is authoritative only after a server
command succeeds.

Postgres-backed server functions / command handlers ([[ADR-0027-postgres-data-model]]) own authoritative state for:

- save/run creation;
- day/week advancement;
- match resolution;
- finance/economy mutations;
- transfers/contracts;
- club/run lifecycle; and
- any effect that changes competitive or durable domain state.

The client may prepare and validate drafts locally, but it must not present a
draft/cache write as final until confirmation returns.

### 2. Offline scope is app shell, read cache and drafts

MVP offline capability includes:

| Capability | MVP behavior |
|---|---|
| App shell and static assets | Cached by the service worker. |
| Static rules/help/copy | Cached where safe. |
| Last confirmed read models | May be shown with stale/freshness labels. |
| Tactics/training/lineup/setup drafts | Stored locally in Dexie with draft status. |
| Authoritative mutations | Require connection and server confirmation. |

MVP offline capability explicitly excludes:

- local-authoritative save progression;
- queued domain mutations that claim final success;
- automatic conflict resolution;
- full export/import UI; and
- multiplayer effects of any kind.

### 3. Dexie remains mandatory local persistence

Dexie / IndexedDB remains part of the stack and is not a throwaway cache. In MVP
it stores:

- service-worker/install/storage metadata;
- last confirmed read-model caches with freshness metadata;
- local drafts and setup forms;
- UI assistance/onboarding state;
- staged data needed by future export/import and sync; and
- future local-save adapter state when selective offline lands.

`localStorage` remains forbidden for game state, caches and drafts.

### 4. Future selective offline is preserved

The first future offline-first candidate is **singleplayer**. Multiplayer
remains server-authoritative; offline multiplayer is limited to drafts/intents
that are server-validated on reconnect.

To preserve the future path, all bounded contexts must keep:

- JSON-serialisable command, query, event and snapshot contracts;
- schema/version fields on payloads that may be cached or exported;
- idempotency keys and command preconditions;
- repository/query-gateway boundaries that can support a local singleplayer
  adapter later; and
- deterministic match inputs and engine versions.

For match resolution specifically, future offline support must go through the
same `MatchEnginePort`, `MatchInput`, replay and version contracts as the
server engine. Local runs are non-binding previews until a future ADR/GDDR
explicitly grants local-authoritative singleplayer.

### 5. Export/import is post-MVP but designed now

User-facing export/import moves after MVP. However, [[ADR-0005-save-format]]
continues to define the future save envelope direction:

- `envelopeVersion`;
- `saveVersion`;
- `engineVersion`;
- authenticated headers;
- encrypted/compressed payload;
- migration expectations; and
- deterministic snapshot boundaries.

MVP implementation must avoid storage or schema decisions that make that
envelope impossible. Save-management UI may show export/import as "comes later"
where appropriate.

### 6. UX must distinguish local from confirmed

The product copy and UI states must use four distinct meanings:

- **Available offline** — can be used without network.
- **Cached/offline-readable** — last confirmed data, possibly stale.
- **Draft saved on this device** — local only, not authoritative.
- **Requires connection** — cannot be finalised offline.

## Consequences

### Positive

- MVP scope focuses on the roguelite loop instead of a premature sync engine.
- Architecture still prepares for selective offline-first and export/import.
- User trust improves because the UI does not call queued local drafts final.
- Multiplayer fairness remains aligned with server-authoritative ADR-0011.
- Dexie, save envelopes and deterministic engine contracts remain useful
  future infrastructure.

### Negative

- MVP requires a connection for durable progression.
- The "offline-first" promise moves from MVP to roadmap and must be explained
  consistently.
- Later selective offline still needs dedicated implementation work: local
  authority, migrations, replay, conflict UX and export/import tooling.

### Future

Phase 2+ can add selective offline in this order:

1. richer read-model caches and offline help;
2. local drafts with server revalidation;
3. command-first manager-week intents with idempotency keys, base versions and
   explicit rejection/conflict UX;
4. user-facing export/import using the reserved envelope;
5. local-authoritative singleplayer adapter for safe flows only after a
   separate authority decision; and
6. multiplayer drafts/intents only, with hard server validation.

## Compliance

- MVP command handlers MUST treat server-confirmed state as authoritative.
- Client code MUST NOT mark a domain mutation final before server confirmation.
- Dexie records for drafts MUST carry status and timestamps.
- Cached read models MUST carry freshness metadata where stale data could
  mislead users.
- Domain commands MUST be idempotent and precondition-aware.
- New storage/repository code MUST keep a future local singleplayer adapter
  possible.
- Export/import implementation MAY be deferred, but save-envelope assumptions
  MUST NOT be broken.
- Multiplayer effects MUST remain server-confirmed only.
- Local match simulation MUST NOT become authoritative in MVP.

## Design source

Implements [[../../00-Index/MVP-Scope]] and
[[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]].

## Sources

- [[../../60-Research/offline-mvp-scope-and-sync-strategy]] — binding synthesis
  for the MVP offline/sync staging decision.
- [[ADR-0019-modular-monolith-ddd]] — service-ready bounded context contracts.
- [[ADR-0011-server-authoritative-multiplayer]] — multiplayer authority and
  hard-reject conflict stance.
- [[ADR-0005-save-format]] — future save/export envelope.

## Related

- [[../../00-Index/MVP-Scope]]
- [[../../60-Research/offline-mvp-scope-and-sync-strategy]]
- [[ADR-0004-data-model]]
- [[ADR-0005-save-format]]
- [[ADR-0011-server-authoritative-multiplayer]]
