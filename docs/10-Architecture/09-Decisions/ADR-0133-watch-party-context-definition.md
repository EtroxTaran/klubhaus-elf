---
title: ADR-0133 Watch Party Context Definition
status: accepted
tags: [adr, architecture, ddd, bounded-context, watch-party, match, notification, offline-sync, crdt, fmx-159, accepted]
context: watch-party
created: 2026-06-17
updated: 2026-06-19
type: adr
binding: true
linear: FMX-159
amends:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]
  - [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/watch-party-context-ownership-2026-06-17]]
  - [[../../60-Research/raw-perplexity/raw-watch-party-context-ownership-ddd-2026-06-17]]
  - [[../../60-Research/raw-perplexity/raw-watch-party-context-ownership-realworld-2026-06-17]]
  - [[../../60-Research/raw-perplexity/raw-watch-party-context-ownership-games-2026-06-17]]
  - [[../../60-Research/raw-perplexity/raw-watch-party-context-ownership-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
  - [[../bounded-context-map]]
  - [[../state-machines/watch-party]]
  - [[../../50-Game-Design/watch-party-and-conference]]
---

# ADR-0133: Watch Party Context Definition

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-159 on 2026-06-17. Binding after Nico approved D1-D8 on 2026-06-19 in
[[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]].

## Date

2026-06-17

## Context

Watch Party is already one of ADR-0089's 28 bounded contexts, but its
canonical definition is still thin: the bounded-context map says "polls,
scheduling, broadcast, conference", while detailed behavior is spread across
`watch-party.md`, the draft game-design note, spectator streaming ADRs, pause
ADR/GDDR notes, Notification drafts and Offline Sync seams.

FMX-159 consolidates the boundary without making a new accepted architecture
decision.

## Proposed Decision

### 1. Scope

Watch Party owns party-scoped social and viewing truth:

- proposal, poll, schedule, setup-lock, live, completed and cancelled lifecycle;
- party participants, roles, membership lifecycle and local pause privileges;
- schedule polls, quorum handling and broadcast/session state;
- spectator delay policy, broadcast cursor and conference coordination;
- party chat, markers, timeline annotations and moderation logs;
- disconnect pause and deliberate/tactics pause-vote orchestration;
- notification intent for invites, reminders, mentions and party live-state
  alerts.

Watch Party does not own:

- Match simulation, committed event log, replay execution, intervention
  application, frame contract or result authority;
- Notification inbox records, delivery attempts, preferences, suppression,
  provider adapters, push/email/native delivery or delivery audit;
- Offline Sync client command queue, retry/backoff, `expectedVersion` rebase,
  CRDT merge mechanics or provider/storage selection;
- Identity & Access accounts, credentials, sessions, registered devices or
  global claims;
- persistent Tactics, Squad & Player, Training, League or Rivalry source facts.

### 2. Aggregate Inventory

| Aggregate / consistency boundary | Responsibility |
|---|---|
| `WatchParty` | Party lifecycle, target match refs, schedule state, setup/live/completed/cancelled transitions and current party policy version. |
| `WatchPartyParticipant` | Party membership, role, active-manager/passive-spectator status and local pause-trust tier. |
| `WatchPartySchedulePoll` | Slot suggestions, votes, quorum, poll deadline and selected broadcast time. |
| `WatchPartySession` | Live broadcast cursor, spectator delay policy, primary target match and conference feed coordination. |
| `WatchPartyPauseControlProcess` | Disconnect, deliberate and tactics pause orchestration, budgets, cooldowns, consent windows and audit handoff. |
| `WatchPartyChatThread` | Party-scoped append-only chat messages and mention intent. |
| `WatchPartyMarkerLayer` | Party-scoped timeline markers and future collaborative overlay anchors. |
| `WatchPartyModerationLog` | Party membership moderation, message/marker moderation and privilege revocation audit. |

These are draft names for the future code phase. They define boundaries, not
database tables. Existing state-machine storage concepts remain `watch_party`,
`watch_party_participant` and `watch_party_pause_event` until a code-phase
schema ADR or implementation PR replaces them.

### 3. Published Language

Current events already present in the state-machine note or accepted ADRs:

- `WatchPartyProposed`
- `WatchPartyPollOpened`
- `WatchPartyScheduled`
- `WatchPartySetupLocked`
- `WatchPartyLive`
- `WatchPartyCompleted`
- `WatchPartyCancelled`
- `PauseVoteOpened`
- `PauseVoteEnacted`
- `PauseResumed`
- `PauseRequestRejected`
- `PausePrivilegeChanged`

Future draft events:

- `WatchPartyParticipantJoined`
- `WatchPartyParticipantLeft`
- `WatchPartyRoleChanged`
- `WatchPartyChatMessagePosted`
- `WatchPartyMarkerAdded`
- `WatchPartyModerationActionRecorded`
- `WatchPartyPrimaryMatchChanged`

Commands, draft public language:

- `ProposeWatchParty`
- `OpenWatchPartyPoll`
- `ScheduleWatchParty`
- `CancelWatchParty`
- `JoinWatchParty`
- `LeaveWatchParty`
- `StartWatchPartyBroadcast`
- `CompleteWatchParty`
- `OpenPauseVote`
- `RecordPauseVote`
- `PostWatchPartyChatMessage`
- `AddWatchPartyMarker`
- `ModerateWatchPartyMember`
- `SetConferencePrimaryMatch`

Queries/read models, draft public language:

- `GetWatchPartyState`
- `GetUpcomingWatchParties`
- `GetWatchPartyParticipants`
- `GetWatchPartyTimeline`
- `GetWatchPartyChat`
- `GetWatchPartyMarkers`

### 4. Consumed Facts and ACLs

| Upstream | Watch Party consumes | Handling |
|---|---|---|
| Match | committed event-log/replay cursor, `MatchPaused`, `MatchResumed`, `MatchCompleted`, match report/replay availability facts | Consumes published facts only. Watch Party never mutates Match state directly; pause reaches Match only through `PauseMatch` / `ResumeMatch`. |
| League Orchestration | matchday/window state, fixture timing and schedule adoption feedback | Customer/Supplier relationship around `WatchPartyScheduled`; League owns matchday lifecycle and derives locks from `broadcast_at` where ADR-0088 is accepted. |
| Notification | optional delivery feedback, suppression/reachability status for party reminder projections | Notification consumes Watch Party notification intents; Watch Party consumes delivery result only for party UI, not as delivery authority. |
| Offline Sync | optional client sync status, draft/cache freshness and future collaboration-provider health | Infrastructure status only. Offline Sync owns queue/rebase mechanics; Watch Party owns social semantics and authorization. |
| Identity & Access | `PrincipalContext` and opaque account/member identifiers | Identity facts authorize platform identity; Watch Party still owns party membership and roles. |
| Rivalry System | rivalry/derby/highlight facts for auto-proposal | Rivalry facts may propose candidates; Watch Party owns accept/reject/schedule lifecycle. |

### 5. Notification Relationship

Watch Party owns notification intent. It decides that a party invite, reminder,
mention, poll deadline, setup lock or live-state change should notify specific
members.

Notification owns durable delivery. It stores notification records, inbox/read
state, user preference checks, suppression, schedules, provider attempts,
delivery failures and delivery/audit events.

### 6. CRDT and Social-overlay Policy

MVP Watch Party chat, markers and timeline annotations use server-ordered
append-only events owned by Watch Party. No CRDT dependency is required for
that surface.

Future editable collaborative overlay documents may use a Yjs/Automerge-like
CRDT behind Offline Sync or a collaboration infrastructure seam. In that future
case:

- Watch Party owns party semantics, authorization and the domain meaning of the
  overlay;
- Offline Sync/collaboration infrastructure owns queue/rebase/provider/storage
  mechanics;
- Notification never owns collaborative overlay state;
- CRDT documents never become authoritative game state.

### 7. Invariants

- Watch Party never owns the committed Match event log, result authority or
  deterministic replay execution.
- Match never imports party chat, markers, moderation, wall-clock votes,
  delivery status or social privileges into deterministic simulation.
- `MatchId`, `LeagueId`, `MemberId` and other cross-context identifiers remain
  opaque branded references; no cross-context foreign keys or joins.
- Notification stores and delivers messages; it does not own party membership,
  chat or social timeline state.
- Offline Sync may provide future collaboration mechanics, but it does not own
  party semantics.
- MVP Watch Party has one primary match; conference secondary feeds are
  additive coordination and never transfer Match authority.

## Options Considered

### D1 - Documentation Shape

| Option | Meaning | Assessment |
|---|---|---|
| A. Dedicated Watch Party ADR | Define the Watch Party context here and link feature ADRs/notes. | **Recommended, accepted by Nico 2026-06-19.** Canonical boundary without duplicating accepted feature detail. |
| B. State-machine-only cleanup | Keep ownership in `watch-party.md` plus the map. | Leaves future code teams to reconstruct boundary from scattered docs. |
| C. Fold into Match/Notification ADRs | Spread Watch Party ownership across adjacent contexts. | Blurs DDD language and risks Match/Notification scope creep. |

### D2 - Scope

| Option | Meaning | Assessment |
|---|---|---|
| A. Session/social orchestration | Watch Party owns lifecycle, participants, broadcast/session state, chat/markers/moderation and pause orchestration. | **Recommended, accepted by Nico 2026-06-19.** Matches product and architecture seams. |
| B. Scheduling only | Watch Party owns proposal/poll/schedule only. | Leaves social runtime ownerless. |
| C. Full live-match umbrella | Watch Party owns feed/replay authority too. | Conflicts with Match authority. |

### D3 - Match Boundary

| Option | Meaning | Assessment |
|---|---|---|
| A. Consume Match facts and command pause only through public seam | Match owns event log, replay, intervention application and result authority. | **Recommended, accepted by Nico 2026-06-19.** Aligns ADR-0099 and ADR-0087. |
| B. Persist spectator snapshots in Watch Party | Reopens superseded ADR-0015 behavior. | Not recommended. |
| C. Match owns Watch Party runtime when live | Puts social wall-clock state into Match. | Not recommended. |

### D4 - Notification Boundary

| Option | Meaning | Assessment |
|---|---|---|
| A. Watch Party intent, Notification delivery | Party decides what should notify; Notification owns records/preferences/providers/audit. | **Recommended, accepted by Nico 2026-06-19.** Clean published-language split. |
| B. Notification owns chat/reminders | Makes Notification a social context. | Not recommended. |
| C. Watch Party owns delivery attempts/preferences | Duplicates platform delivery authority. | Not recommended. |

### D5 - Collaborative Overlay / CRDT

| Option | Meaning | Assessment |
|---|---|---|
| A. MVP append-only; future CRDT for editable overlays only | Use simple server-ordered events now; reserve Yjs/Automerge-like CRDT for future local-first collaborative docs. | **Recommended, accepted by Nico 2026-06-19.** Minimizes MVP complexity while keeping future path open. |
| B. CRDT for all chat/markers now | Every social message becomes collaborative document state. | Overbuilt for MVP and harder to audit. |
| C. Offline Sync owns overlay semantics | Infrastructure context owns domain meaning. | Not recommended. |

### D6 - Aggregate Inventory

| Option | Meaning | Assessment |
|---|---|---|
| A. Record conceptual aggregate families | Name future consistency boundaries without mandating tables. | **Recommended, accepted by Nico 2026-06-19.** Gives implementation direction without premature schema design. |
| B. Existing `watch_party` table only | Keep only current state-machine storage sketch. | Too thin for social runtime. |
| C. Split Chat/Moderation contexts now | Separate party social subdomains immediately. | Premature portfolio growth. |

### D7 - Conference Scope

| Option | Meaning | Assessment |
|---|---|---|
| A. One primary match MVP, secondary feeds future | Conference stays a Watch Party variant and never owns Match facts. | **Recommended, accepted by Nico 2026-06-19.** Pragmatic and aligned with current notes. |
| B. Separate Conference context | New context for multi-feed coordination. | Premature. |
| C. Match feature | Multi-feed viewing belongs to Match. | Not recommended. |

### D8 - Approval Status

| Option | Meaning | Assessment |
|---|---|---|
| A. accepted/binding now; promote only after Nico approval | Keep the proposal concrete but gated. | **Recommended, accepted by Nico 2026-06-19.** Respects FMX decision protocol. |
| B. Accept now | Agent self-ratifies architecture. | Not allowed. |
| C. Delay ADR until later | Leaves the issue without a concrete review target. | Slower and less useful. |

## Consequences

Positive:

- Watch Party gets one canonical context-definition home.
- Match, Notification and Offline Sync avoid scope creep.
- Future code can implement chat, markers, reminders and pause orchestration
  without cross-context joins or hidden social state.
- CRDT/collaboration remains future-ready without forcing a dependency into
  MVP.

Negative / constraints:

- Adds another front-door ADR entry.
- Requires downstream docs to keep Watch Party social/runtime state separate
  from Notification delivery state.
- Future conference and collaborative overlay work still need follow-up
  design/calibration once Nico accepts the boundary.

## Related

- [[../../60-Research/watch-party-context-ownership-2026-06-17]]
- [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
- [[../bounded-context-map]]
- [[../state-machines/watch-party]]
- [[../../50-Game-Design/watch-party-and-conference]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
- [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
- [[ADR-0089-bounded-context-portfolio-reconciliation]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]
- [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
