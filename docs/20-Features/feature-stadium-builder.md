---
title: Feature - Stadium Builder
status: draft
tags: [feature, stadium, infrastructure]
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related: [[README]], [[../50-Game-Design/stadium-and-campus]], [[../50-Game-Design/regulations-and-compliance]], [[feature-venue-operations]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Feature - Stadium Builder

## Goal

Let the player upgrade the stadium and club campus through capacity
tiers + Anstoss-style on-grounds attractions, with build cost, time and
trade-offs.

## User stories

- As a manager I can grow my stadium from 5 k to 30 k as the club rises.
- As a manager I can add a Würstchenbude / Bierstand / Fanzone to lift
  match-day revenue and atmosphere.
- As a manager I can see which compliance requirements I will need on
  promotion.

## MVP foundation scope

For the Roguelite first playable, stadium scope is limited to capacity/run-cost
signals and a simple upgrade path if needed. Full builder depth can follow.

- 5 capacity tiers.
- Seat-mix trade-offs (standing / seating / premium / suites).
- ≥ 8 on-grounds attraction modules.
- Construction queue with cost + time.
- Ageing + renovation cycle.
- Compliance check on promotion.
- Venue readiness fields used by [[feature-venue-operations]].

## Out of first playable scope

- Plot-by-plot SimCity layout (Expert tier; Phase 2).
- Multi-stadium ownership.

## Presentation layer (Phase 2)

A 3D isometric stadium / campus view is on the post-MVP roadmap as
part of the **3D Presentation Layer**, accepted 2026-05-20 in
[[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]] and
detailed in [[feature-3d-presentation-layer]]. Capacity-tier upgrades
and module placements defined here drive the
`iso-stadium` `SceneDescriptor` consumed by the renderer. The existing
2D composite family under
`apps/web/src/components/composites/stadium/**` is preserved as the
mandatory floor-tier / reduced-motion / Save-Data fallback. Live match
render remains 2D-only.

## UI tiers

- Quick: build wizard with recommended next upgrades.
- Standard: tile map + module list.
- Expert: full grid + per-plot pricing + queue (Phase 2).

## Acceptance

- Capacity tier transitions produce the correct revenue + atmosphere
  changes.
- Compliance check fires correctly on promotion event.
- Construction queue holds across save/load.
- Renovation reset reverses ageing decay.

## Dependencies

- [[../50-Game-Design/stadium-and-campus]]
- [[../50-Game-Design/regulations-and-compliance]]
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
