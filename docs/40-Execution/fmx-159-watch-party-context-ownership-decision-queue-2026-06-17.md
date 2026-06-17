---
title: FMX-159 Watch Party Context Ownership Decision Queue
status: draft
tags: [execution, decision-queue, ddd, bounded-context, watch-party, match, notification, offline-sync, crdt, fmx-159]
created: 2026-06-17
updated: 2026-06-17
type: decision-queue
binding: false
linear: FMX-159
related:
  - [[../60-Research/watch-party-context-ownership-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-watch-party-context-ownership-ddd-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-watch-party-context-ownership-realworld-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-watch-party-context-ownership-games-2026-06-17]]
  - [[../60-Research/raw-perplexity/raw-watch-party-context-ownership-source-checks-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../50-Game-Design/watch-party-and-conference]]
---

# FMX-159 Watch Party Context Ownership Decision Queue

## Status

Awaiting Nico. This queue records recommendations only; no Watch Party
context-definition ADR becomes binding until Nico answers.

## D1 - Documentation Shape

Options:

- **A. Dedicated Watch Party context-definition ADR.** One draft ADR records
  scope, aggregate inventory, published language, consumed facts and ACLs.
- **B. State-machine-only cleanup.** Patch `watch-party.md` and the
  bounded-context map without a canonical ADR.
- **C. Fold ownership into Match/Notification ADRs.** Avoid a Watch Party ADR
  and spread details across adjacent contexts.

Recommendation: **A.**

Reason: DDD source checks favor explicit bounded contexts and context maps.
Watch Party already exists as a canonical context in ADR-0089, but its social
runtime boundary is scattered across state-machine, game-design and spectator
streaming notes.

## D2 - Watch Party Scope

Options:

- **A. Session/social orchestration context.** Watch Party owns lifecycle,
  polls/scheduling, participants/roles, broadcast/session state, spectator
  delay, conference coordination, pause-vote orchestration, chat, markers and
  moderation logs.
- **B. Scheduling-only context.** Watch Party owns proposal/poll/schedule only;
  chat/markers/moderation stay undefined or in Notification.
- **C. Full live-match umbrella.** Watch Party owns the viewing runtime plus
  match feed/replay authority.

Recommendation: **A.**

Reason: A matches the existing lifecycle/pause notes and real-world co-viewing
model. B leaves core social features ownerless; C violates Match authority.

## D3 - Match Boundary

Options:

- **A. Watch Party consumes Match facts and commands pause only through the
  public seam.** Match owns simulation, event log, replay execution,
  intervention application and result authority.
- **B. Watch Party owns a persisted spectator stream derived from Match.**
- **C. Match owns Watch Party runtime while live.**

Recommendation: **A.**

Reason: ADR-0099 supersedes the persisted-snapshot idea from ADR-0015 and
keeps replay streaming over the committed Match event log. ADR-0087 already
keeps wall-clock pause voting outside the deterministic engine.

## D4 - Notification Boundary

Options:

- **A. Watch Party owns notification intent; Notification owns delivery.**
  Watch Party emits reminder/invite/mention/live-alert intents. Notification
  stores inbox records, preferences, suppression, provider attempts and audit.
- **B. Notification owns party reminders plus party chat.**
- **C. Watch Party owns delivery attempts and notification preferences for its
  own reminders.**

Recommendation: **A.**

Reason: Notification remains a delivery platform. Moving chat into
Notification would make it a social domain; moving preferences/provider
attempts into Watch Party would duplicate platform delivery state.

## D5 - Collaborative Overlay and CRDT Posture

Options:

- **A. MVP server-ordered append-only events; future CRDT only for editable
  collaborative overlay documents.** Watch Party owns semantics and
  authorization; Offline Sync/collaboration infrastructure owns queue/rebase
  and provider mechanics.
- **B. Adopt a CRDT for all Watch Party chat/markers now.**
- **C. Put collaborative overlay ownership in Offline Sync.**

Recommendation: **A.**

Reason: Yjs/Automerge-style CRDTs fit future local-first editable documents,
but MVP chat and marker timelines can stay simpler, auditable and
server-ordered. Offline Sync should not own domain semantics.

## D6 - Aggregate Inventory

Options:

- **A. Record conceptual aggregate families now.** `WatchParty`,
  `WatchPartyParticipant`, `WatchPartySchedulePoll`, `WatchPartySession`,
  `WatchPartyPauseControlProcess`, `WatchPartyChatThread`,
  `WatchPartyMarkerLayer` and `WatchPartyModerationLog` are draft future code
  names, not table mandates.
- **B. Record only the existing `watch_party` table shape.**
- **C. Split Chat/Moderation into separate contexts now.**

Recommendation: **A.**

Reason: A gives future implementation teams consistency boundaries without
premature schema design. B hides expected social state; C fragments the product
before there is scale evidence.

## D7 - Conference Scope

Options:

- **A. MVP one primary match per Watch Party; conference is additive future
  feed coordination.** A later conference can hold secondary feeds and primary
  match switches without owning Match facts.
- **B. Make conference a separate context now.**
- **C. Treat conference as a Match feature.**

Recommendation: **A.**

Reason: Current game-design notes keep conference as a Watch Party variant.
One primary feed lowers MVP ambiguity while preserving future multi-feed
coordination.

## D8 - Approval Status and Stale-reference Cleanup

Options:

- **A. Keep ADR-0133 draft/non-binding in this PR and patch stale ADR-0015
  spectator references to ADR-0099 plus the draft ADR-0133 hook.**
- **B. Accept ADR-0133 in this PR based on agent recommendation.**
- **C. Avoid source cleanup until after approval.**

Recommendation: **A.**

Reason: It preserves the full artifact chain and lets Nico answer against
concrete text without letting an agent self-ratify architecture. The stale
ADR-0015 references are factual cleanup because ADR-0099 already supersedes it.

## Consolidated Recommendation

Approve **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A, D8=A**.

Operational interpretation:

- create ADR-0133 as the canonical non-binding Watch Party context proposal;
- keep Watch Party as the social/session owner;
- keep Match as simulation/event-log/replay authority;
- keep Notification as delivery/inbox/preference owner;
- keep Offline Sync as sync/rebase/collaboration infrastructure, not social
  semantics owner;
- reserve CRDTs for future editable collaborative overlay documents;
- promote ADR-0133 only after Nico explicitly approves.

## Nico Decision Log

Pending.

