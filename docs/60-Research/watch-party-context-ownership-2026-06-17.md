---
title: Watch Party Context Ownership
status: current
tags: [research, synthesis, ddd, bounded-context, watch-party, match, notification, offline-sync, crdt, fmx-159]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-159
related:
  - [[raw-perplexity/raw-watch-party-context-ownership-ddd-2026-06-17]]
  - [[raw-perplexity/raw-watch-party-context-ownership-realworld-2026-06-17]]
  - [[raw-perplexity/raw-watch-party-context-ownership-games-2026-06-17]]
  - [[raw-perplexity/raw-watch-party-context-ownership-source-checks-2026-06-17]]
  - [[../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../50-Game-Design/watch-party-and-conference]]
---

# Watch Party Context Ownership

## Intent

FMX-159 asks whether Watch Party is only a thin scheduling row, or a full
Engagement & Narrative bounded context with clear ownership for session
lifecycle, participants, viewing overlays, chat/markers, pause-vote
orchestration and seams to Match, Notification and Offline Sync.

This note preserves the Perplexity-first research, source checks and local
analysis. It is non-binding. The paired decision queue asks Nico to approve or
reject the proposed Watch Party context-definition direction.

## Evidence Summary

DDD evidence supports an explicit context-definition ADR:

- Fowler treats bounded contexts as the main boundary for a model and stresses
  explicit relationships between contexts.
- Microsoft Learn separates domain analysis from implementation detail and
  recommends context maps plus relationship patterns such as Published Language
  and Anti-Corruption Layer.
- The current FMX portfolio already uses context-definition ADRs for Identity &
  Access and the Sporting Core drafts. Watch Party is currently much thinner
  than those mature context entries despite already owning lifecycle, scheduling
  and pause orchestration in local notes.

Real-world and co-viewing evidence supports Watch Party as a social/session
orchestrator, not as the match simulation owner:

- sports watch parties and live co-viewing are organized around schedule,
  admission, participants, moderation, social moments and synchronized viewing;
- the actual sporting event remains the external source of truth;
- delay, chat and moderation policy are social-experience concerns layered on
  top of the event feed.

Comparable game/platform evidence points the same way:

- Discord Activities model a room/session surface with participants, launch,
  commands, activity events and embedded application lifecycle. It is useful
  precedent for party-scoped social runtime, not for match authority.
- Football Manager Versus Mode is a synchronous multiplayer manager-session
  precedent. The official page also highlights spectator delay as an explicit
  fairness concern for watched competitive matches.
- Perplexity surfaced additional consumer-game and forum examples, but several
  were weakly sourced. Those remain pattern input only and are not canonical
  evidence.

Technical source checks keep CRDTs as future collaboration infrastructure, not
MVP ownership:

- Yjs and Automerge both support local-first collaborative document patterns
  with provider/storage layers.
- That fits future editable annotation boards or shared tactical overlays, but
  it is overbuilt for MVP append-only chat, markers and party timeline events.
- CRDT engine choice is a future dependency/architecture decision and is not
  selected by FMX-159.

## Local Baseline

Accepted local decisions constrain the proposal:

- ADR-0019: bounded contexts own data and publish contracts; no cross-context
  joins.
- ADR-0089: Watch Party is one of the 28 canonical contexts in Engagement &
  Narrative.
- ADR-0099 supersedes ADR-0015: spectator/watch-party streaming consumes the
  committed Match event log/replay stream instead of persisted spectator
  snapshots.
- ADR-0087/GD-0035/FMX-140: deliberate and tactics pause behavior is Watch
  Party process-manager state that commands Match only through `PauseMatch` and
  `ResumeMatch`.
- ADR-0088 draft: `WatchPartyScheduled` carries `broadcast_at` plus derived
  locks to League Orchestration as the matchday timing anchor.
- ADR-0102 draft successor to ADR-0043 keeps Notification as durable inbox,
  preference, provider and delivery owner.
- ADR-0090 keeps Offline Sync responsible for client command queues, retry,
  rebase UX and future conflict handling.

## Options

| Option | Meaning | Assessment |
|---|---|---|
| A. Dedicated Watch Party context ADR | Draft one ADR that defines Watch Party scope, aggregate inventory, published language and ACLs to Match, Notification, Offline Sync, Identity and Rivalry. | **Recommended.** Best fit with DDD evidence and FMX's context-definition pattern. |
| B. Keep Watch Party as thin state-machine doc only | Update `watch-party.md` and the bounded-context map, no ADR. | Cheap now, but leaves chat/markers/CRDT/notification ownership ambiguous. |
| C. Move social surfaces to Notification or Match | Let Match or Notification own more of the party runtime. | Conflicts with existing owner boundaries: Match must stay deterministic and Notification must stay delivery-focused. |

Recommendation: **A**, with ADR-0133 draft until Nico approves D1-D8 in the
decision queue.

## Proposed Context Shape

Watch Party owns party-scoped social and viewing truth:

- proposal, poll, schedule, setup-lock, live, completed and cancelled lifecycle;
- participants, roles, local pause-trust tiers and group-scoped privileges;
- schedule polls and derived broadcast/session state;
- spectator delay policy, broadcast cursor and conference coordination;
- party chat, markers, timeline annotations and moderation logs;
- disconnect pause and deliberate/tactics pause-vote orchestration;
- notification intent for party invites, reminders, mentions and live-state
  alerts.

Watch Party does not own:

- Match simulation, committed event log, replay execution, frame contract,
  intervention application or result authority;
- Notification inbox records, delivery attempts, user preferences, provider
  adapters, push/email/native channel behavior or delivery audit;
- Offline Sync client command queue, retry/backoff, `expectedVersion` rebase,
  CRDT merge mechanics or storage provider choice;
- Identity & Access account/session/global claim truth;
- Tactics, Squad & Player, Training, League or Rivalry source facts.

## Boundary Recommendations

### Match

Watch Party consumes Match committed event-log/replay facts and publishes social
state around the feed. It may command `PauseMatch` / `ResumeMatch` only through
the accepted pause seam. Match never imports Watch Party wall-clock timers,
chat, votes, moderation or participant social state into deterministic
simulation.

### Notification

Watch Party owns notification intent: who should be reminded or alerted, why,
and for which party/session. Notification owns durable message records, inbox
projection, user preferences, suppression, provider adapters, delivery attempts
and delivery/audit events.

### Offline Sync and CRDTs

MVP should use server-ordered append-only events for chat, markers and party
timeline state. A Yjs/Automerge-like CRDT is reserved for future editable,
local-first collaborative overlay documents. If added later, Watch Party owns
the overlay semantics and authorization, while Offline Sync/collaboration
infrastructure owns queue/rebase/provider mechanics.

### Conference Mode

MVP should keep one primary match per Watch Party. Conference mode can add
secondary feed subscriptions and `SetConferencePrimaryMatch` later without
making Watch Party own Match facts.

## Source Quality

High-confidence canonical sources:

- Fowler bounded context;
- Microsoft Learn domain analysis and Anti-Corruption Layer;
- official Discord Activities docs;
- official Football Manager Versus Mode page;
- official/source docs for Yjs and Automerge.

Medium/low-confidence inputs:

- Perplexity real-world watch-party and comparable-game scans that cite blogs,
  marketing pages or community/forum material. These are useful as pattern
  discovery, but not used as sole authority for canonical FMX decisions.

## Decision Status

Awaiting Nico in
[[../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]].

Until then:

- ADR-0133 is draft/non-binding;
- bounded-context map and state-machine edits are descriptive proposal hooks
  where they touch pending choices;
- no implementation may use the draft ADR as accepted authority.

