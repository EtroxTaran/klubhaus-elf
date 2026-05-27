---
title: Feature - Systemic Event Director
status: draft
tags: [feature, events, world-events, scheduler, narrative]
created: 2026-05-17
updated: 2026-05-18
type: feature
binding: false
related:
  - [[README]]
  - [[../60-Research/systemic-events-player-development-venue-ops]]
  - [[../60-Research/narrative-content-pipeline]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[feature-matchday-event-engine]]
---

# Feature - Systemic Event Director

> **REOPENED on 2026-05-27:** This feature note is `draft` planning context again. Any `approved`, `binding`, or implementation-ready wording below is historical pre-reopen context until Nico re-approves it.

## Goal

Coordinate deterministic event evaluation across domains without creating a
generic random-event bounded context.

## User stories

- As a manager I experience believable events that follow from club state.
- As a returning player I see a digest of important events rather than spam.
- As a developer I can add event families without bypassing domain ownership.

## MVP foundation scope

For the Roguelite first playable, use only deterministic event orchestration
needed for run feedback and tutorial/narrative. Broader world-event depth can
follow after MVP.

- Week/day/match/season evaluation windows.
- Eligibility, weighting, priority and cooldown rules.
- Commands delegated to owning contexts.
- Domain event emission through the transactional outbox.
- Notification/narrative projection from structured facts.

## Out of first playable scope

- Runtime AI text generation.
- Events that mutate state without an owning context.
- Full background-world deep simulation for every club.

## Acceptance

- Same state + seed produces the same event selection.
- Every effect identifies the owning context.
- Narrative text never creates facts that are missing from event payloads.
- Frequency caps prevent repeated low-value events.

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
- [[../60-Research/narrative-content-pipeline]]
## Related

- [[README]]
- [[../60-Research/systemic-events-player-development-venue-ops]]
- [[../60-Research/narrative-content-pipeline]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
- [[feature-matchday-event-engine]]
