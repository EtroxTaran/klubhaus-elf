---
title: Feature - Async Week Loop
status: draft
tags: [feature, multiplayer, async]
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related:
  - [[README]]
  - [[../00-Index/MVP-Scope]]
  - [[../50-Game-Design/async-multiplayer-private-group]]
  - [[../10-Architecture/state-machines/league-week]]
  - [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]]
---

# Feature - Async Week Loop

> **REOPENED on 2026-05-27:** This feature note is `draft` planning context again. Any `approved`, `binding`, or implementation-ready wording below is historical pre-reopen context until Nico re-approves it.

## Goal

Drive a private async multiplayer league through its weekly lifecycle
under either Fixed or Dynamic cadence, using one shared state machine.

## User stories

- As a group admin I can pick Fixed or Dynamic cadence at group creation.
- As a manager I can finish my club week at my own pace and the system
  tells me when match-day opens.
- As an admin I can pause the league via a vote.
- As an inactive manager I do not block the group - my fall-back applies.

## Post-MVP scope

This feature is post-MVP per [[../00-Index/MVP-Scope]]. The MVP may keep
server-confirmed week/day commands for the Roguelite first playable, but async
private groups are not in the first playable.

- Fixed cadence with one match-day per week.
- Dynamic cadence with configurable quorum + countdown + max week.
- Pause vote with quorum.
- Inactivity fall-backs (last tactic, assistant).
- Notifications: transactional + digest.

## Out of first async release

- Dynamic cadence sub-variants (e.g. hybrid).
- Custom league calendars beyond the cadence.
- Manual day-by-day match scheduling.

## UI surfaces

- Group dashboard - week state, deadlines, member statuses.
- "Complete week" button with confirmation modal.
- Pause-vote modal.

## Acceptance

- League progresses through full state machine in both cadences.
- Quorum + countdown math is correct under timezone changes.
- Inactivity fall-back applies deterministically.
- Notifications fire reliably (transactional outbox).
- Admin season-boundary switch enforced.

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]]
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
- [[../10-Architecture/09-Decisions/ADR-0014-state-machines]]
## Related

- [[README]]
- [[../00-Index/MVP-Scope]]
- [[../50-Game-Design/async-multiplayer-private-group]]
- [[../10-Architecture/state-machines/league-week]]
- [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]]
