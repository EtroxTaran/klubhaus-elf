---
title: Feature - Venue Operations
status: draft
tags: [feature, stadium, venue, events, club-management]
created: 2026-05-17
updated: 2026-05-18
type: feature
binding: false
related: [[README]], [[feature-stadium-builder]], [[../50-Game-Design/stadium-and-campus]], [[../50-Game-Design/matchday-event-engine]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Feature - Venue Operations

## Goal

Turn the stadium into a 365-day club asset with non-matchday revenue,
pitch/logistics trade-offs and fan/sponsor effects.

## User stories

- As a manager I can accept or reject a major concert booking before a
  critical home match.
- As a manager I can invest in facilities that reduce event conflicts.
- As a manager I can understand how venue events affect revenue, pitch and
  supporter mood.

## Post-MVP depth scope

Venue operations are post-MVP depth. MVP may keep only simple stadium/run-cost
signals needed by the Roguelite first playable.

- Venue event rules for concerts, conferences, fan festivals, museum
  specials and community days.
- Setup/teardown windows and pitch impact.
- Revenue, operating cost, security cost and sponsor-affinity effects.
- Weekly/event-boundary evaluation.
- Integration with match-day event risk and stadium modules.

## Out of first venue release

- Visitor-level operations simulation.
- Manual booking calendar for every date.
- Multiple stadium ownership.

## Acceptance

- Venue events are deterministic for the same state + seed.
- Every venue event produces a structured domain fact before narrative copy.
- Pitch impact can influence match-day events and injury risk only through
  owned domain contracts.
- Quick/Standard/Expert tiers vary UI depth, not simulation rules.

## Dependencies

- [[../50-Game-Design/stadium-and-campus]]
- [[feature-stadium-builder]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
