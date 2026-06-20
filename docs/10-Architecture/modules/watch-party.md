---
title: Watch Party module
status: draft
tags: [architecture, module, watch-party, match, notification]
context: watch-party
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0133-watch-party-context-definition]], [[../09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]], [[../09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]], [[../09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
---

# Watch Party Boundary

## Purpose

Party-scoped social and viewing orchestration boundary: owns the watch-party
lifecycle, participants/roles, schedule polls, broadcast/session state, pause
orchestration and party-scoped chat/markers/moderation — never the Match
event log, result authority or notification delivery (per ADR-0133).

## Owns

Aggregates / consistency boundaries (draft names; boundaries, not tables):

- `WatchParty` — party lifecycle, target match refs, schedule state,
  setup/live/completed/cancelled transitions and current party policy version.
- `WatchPartyParticipant` — membership, role, active-manager/passive-spectator
  status and local pause-trust tier.
- `WatchPartySchedulePoll` — slot suggestions, votes, quorum, poll deadline and
  selected broadcast time.
- `WatchPartySession` — live broadcast cursor, spectator delay policy, primary
  target match and conference feed coordination.
- `WatchPartyPauseControlProcess` — disconnect, deliberate and tactics pause
  orchestration, budgets, cooldowns, consent windows and audit handoff.
- `WatchPartyChatThread` — party-scoped append-only chat messages and mention
  intent.
- `WatchPartyMarkerLayer` — party-scoped timeline markers and future
  collaborative overlay anchors.
- `WatchPartyModerationLog` — membership/message/marker moderation and
  privilege-revocation audit.

## Public contract

Commands (draft public language):

- `ProposeWatchParty`, `OpenWatchPartyPoll`, `ScheduleWatchParty`,
  `CancelWatchParty`
- `JoinWatchParty`, `LeaveWatchParty`
- `StartWatchPartyBroadcast`, `CompleteWatchParty`
- `OpenPauseVote`, `RecordPauseVote`
- `PostWatchPartyChatMessage`, `AddWatchPartyMarker`, `ModerateWatchPartyMember`
- `SetConferencePrimaryMatch`

Issued to Match (cross-context commands via public seam):

- `PauseMatch`, `ResumeMatch` (the only way pause reaches Match; Watch Party
  never mutates Match state directly).

Queries / read models (draft public language):

- `GetWatchPartyState`, `GetUpcomingWatchParties`, `GetWatchPartyParticipants`
- `GetWatchPartyTimeline`, `GetWatchPartyChat`, `GetWatchPartyMarkers`

Domain events — already present in the state-machine note or accepted ADRs:

- `WatchPartyProposed`, `WatchPartyPollOpened`, `WatchPartyScheduled`,
  `WatchPartySetupLocked`, `WatchPartyLive`, `WatchPartyCompleted`,
  `WatchPartyCancelled`
- `PauseVoteOpened`, `PauseVoteEnacted`, `PauseResumed`,
  `PauseRequestRejected`, `PausePrivilegeChanged`

Domain events — future draft:

- `WatchPartyParticipantJoined`, `WatchPartyParticipantLeft`,
  `WatchPartyRoleChanged`, `WatchPartyChatMessagePosted`,
  `WatchPartyMarkerAdded`, `WatchPartyModerationActionRecorded`,
  `WatchPartyPrimaryMatchChanged`

## Storage ownership

- Watch Party owns its own party-scoped social/runtime tables; no cross-context
  foreign keys or joins (ADR-0121 no-shared-tables, ADR-0027 data model).
- `MatchId`, `LeagueId`, `MemberId` and other cross-context identifiers are held
  as opaque branded references only.
- Existing state-machine storage concepts remain `watch_party`,
  `watch_party_participant` and `watch_party_pause_event` until a code-phase
  schema ADR or implementation PR replaces them.
- The aggregate names above define boundaries, not database tables.

## Consumers / Producers

Consumes facts from (upstream, via ACLs):

- Match — committed event-log/replay cursor, `MatchPaused`, `MatchResumed`,
  `MatchCompleted`, match report/replay availability (published facts only).
- League Orchestration — matchday/window state, fixture timing and schedule
  adoption feedback (Customer/Supplier around `WatchPartyScheduled`).
- Notification — optional delivery feedback, suppression/reachability for party
  reminder projections (delivery result consumed for UI only, not authority).
- Offline Sync — optional client sync status, draft/cache freshness, future
  collaboration-provider health (infrastructure status only).
- Identity & Access — `PrincipalContext` and opaque account/member identifiers.
- Rivalry System — rivalry/derby/highlight facts for auto-proposal candidates.

Produces for (downstream consumers of Watch Party outputs):

- Match — `PauseMatch` / `ResumeMatch` commands.
- League Orchestration — `WatchPartyScheduled` (derives matchday locks where
  ADR-0088 applies).
- Notification — notification intents for invites, reminders, mentions, poll
  deadlines, setup locks and live-state changes.
- Party UI / spectators — watch-party status, schedule/deadline events,
  participant/role facts and party timeline/chat/marker projections.

## Invariants

- Watch Party never owns the committed Match event log, result authority or
  deterministic replay execution.
- Match never imports party chat, markers, moderation, wall-clock votes,
  delivery status or social privileges into deterministic simulation.
- Cross-context identifiers remain opaque branded references; no cross-context
  foreign keys or joins (ADR-0121).
- Watch Party owns notification *intent*; Notification owns durable delivery,
  inbox/read state, preferences, suppression, provider attempts and audit.
- Offline Sync owns queue/rebase/provider/storage mechanics; Watch Party owns
  party semantics, authorization and social meaning.
- MVP chat, markers and timeline annotations are server-ordered append-only
  events owned by Watch Party — no CRDT dependency; CRDT documents never become
  authoritative game state.
- MVP Watch Party has exactly one primary match; conference secondary feeds are
  additive coordination and never transfer Match authority.

## Dependencies

- [[../09-Decisions/ADR-0133-watch-party-context-definition]] (context
  definition; accepted/binding per FMX-159)
- [[../09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]
- [[../09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
- [[../09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model)
- [[../state-machines/watch-party]] (lifecycle FSM)

## Open items

- Concrete code-phase schema / table layout for the social runtime aggregates
  (chat, markers, moderation, session) is not yet pinned; ADR-0133 keeps only
  `watch_party`, `watch_party_participant` and `watch_party_pause_event` as
  current storage concepts pending a code-phase schema ADR.
- Conference secondary-feed coordination and the future editable collaborative
  overlay (Yjs/Automerge-like CRDT behind Offline Sync) need follow-up
  design/calibration; their commands, events and read models are not yet
  specified.
- Quorum thresholds, pause budgets/cooldowns/consent-window values and
  spectator-delay policy parameters are not defined in the source.
