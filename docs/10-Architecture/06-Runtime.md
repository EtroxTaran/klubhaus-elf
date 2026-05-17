---
title: Runtime
status: draft
tags: [architecture]
updated: 2026-05-17
---

# Runtime

The runtime is an **offline-first PWA** for singleplayer, with a
**server-authoritative** backbone for async multiplayer. TanStack Start
handles SSR, server routes, and server functions; the match engine and
match-day workflows run as state-machine-driven server jobs.

> Authority: [[09-Decisions/ADR-0002-offline-first]],
> [[09-Decisions/ADR-0011-server-authoritative-multiplayer]],
> [[09-Decisions/ADR-0014-state-machines]].

## Async week progression

```mermaid
stateDiagram-v2
    [*] --> week_open
    week_open --> quorum_reached: Fixed timer OR Dynamic quorum
    quorum_reached --> pre_match_countdown: Countdown job created
    pre_match_countdown --> matchday_open: Timer expired
    matchday_open --> matchday_locked: Lock time
    matchday_locked --> matchday_resolving: Resolver started
    matchday_resolving --> post_match_reports: Results produced
    post_match_reports --> week_open: Next week opens
    week_open --> paused: Pause vote passed
    paused --> week_open: Resume
```

Detail: [[state-machines/league-week]].

## Transfer escalation

Drives the human-to-human transfer flow with timeouts + escalation. See
[[state-machines/transfer]] and [[09-Decisions/ADR-0011-server-authoritative-multiplayer]].

## Match-day

```mermaid
sequenceDiagram
    participant U as Client (manager)
    participant SF as Server Function
    participant Worker as Match Worker
    participant SP as Spectator Service
    U->>SF: Submit lineup + tactic
    SF->>Worker: Schedule simulation (server-auth)
    Worker-->>SF: Stream events (batches)
    SF-->>SP: Replicate snapshots
    SP-->>U: Live feed (manager) or delayed feed (spectator)
    Worker->>SF: Final result
    SF->>U: Match report
```

Detail: [[state-machines/match]] and
[[09-Decisions/ADR-0015-spectator-snapshot-streaming]].

## Match worker runtime modes

The same match contract supports four runtime modes:

| Mode | Runtime | Authority | Output depth |
|---|---|---|---|
| Singleplayer active match | Client Web Worker | Local client | `competitive-full` or `interactive-standard` by device/profile |
| Singleplayer background fixtures | Client Web Worker batch | Local client | `background-detailed` / `background-fast` |
| Async multiplayer human-involving match | Server Match Worker | Server | `competitive-full` |
| Async multiplayer AI-vs-AI fixture | Server Match Worker batch | Server | Summary by default; deterministic full replay on demand |

MVP uses the TypeScript `packages/match-engine` implementation everywhere.
Post-MVP extraction can move the server Match Worker into a separate process.
A Rust implementation is allowed only after
[[../60-Research/match-engine-runtime-strategy]]'s polyglot extraction gate
passes.

Interactive human matches are not required to know the full result at kickoff.
They may buffer deterministic event chunks and apply substitutions, tactics and
shouts at ordered intervention points. Batch/replay paths may still simulate to
completion before playback.

## Offline-first

Client writes commands to a **local IndexedDB outbox**. On reconnect,
commands replay against the server, which validates and confirms.
Multi-state conflicts are surfaced as `rejected_with_reason` and the
client rebases.

```mermaid
sequenceDiagram
    participant C as Client (offline)
    participant SW as Service Worker / Background Sync
    participant S as Server
    C->>C: Write command to IndexedDB outbox
    C->>C: UI shows "queued"
    Note over C: Network returns
    SW->>S: Replay outbox commands
    S-->>SW: Confirm OR rejected_with_reason
    SW-->>C: Update local projections
```

Detail: [[09-Decisions/ADR-0002-offline-first]] +
[[09-Decisions/ADR-0013-transactional-outbox]].

Multiplayer conflicts are hard-rejected at MVP per
[[09-Decisions/ADR-0011-server-authoritative-multiplayer]]. The client shows
the new state and a redo affordance; it does not auto-rebase gameplay actions.

## Storage

- **SurrealDB** (server) - canonical store, projections, live queries.
- **Dexie / IndexedDB** (client) - local game state, outbox, drafts.

Per [[09-Decisions/ADR-0004-data-model]] and
[[09-Decisions/ADR-0005-save-format]].

## Deployment

PWA installed via Workbox manifest. Future native packaging via Capacitor
(per [[09-Decisions/ADR-0008-mobile-first-ui]]).
