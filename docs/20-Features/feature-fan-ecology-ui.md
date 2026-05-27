---
title: Feature - Fan Ecology UI
status: draft
tags: [feature, fans, ux]
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related:
  - [[README]]
  - [[../50-Game-Design/fan-ecology]]
  - [[../60-Research/fan-culture-segmentation-research]]
---

# Feature - Fan Ecology UI

> **REOPENED on 2026-05-27:** This feature note is `draft` planning context again. Any `approved`, `binding`, or implementation-ready wording below is historical pre-reopen context until Nico re-approves it.

## Goal

Surface the 6-segment supporter ecology so the player can read fan
politics and see how their decisions move each segment.

## User stories

- As a manager I can see how Ultras, Core, Family, Fair Weather,
  Corporate and Casual feel about my last decision.
- As a manager I can forecast the fan impact of a sponsor deal before
  accepting.
- As a casual player I just need a single "mood" badge with one card.

## MVP foundation scope

For the Roguelite first playable, fan ecology appears as simple mood/atmosphere
feedback. Full segment UI can follow after MVP.

- Per-segment state (population, loyalty, mood, attendance probability).
- Atmosphere composite calculation.
- Fan-events feed (choreo, protest banner, ticket boycott).
- Quick / Standard / Expert tier views.

## Out of first playable scope

- Per-ultras-group naming.
- Fan-segment churn animations.
- Sponsor decision preview-impact simulator (Phase 2).

## UI tiers

- Quick: single mood badge + 1 event card.
- Standard: 6-segment bar chart with arrows.
- Expert: full grid with drivers + forecasts.

## Acceptance

- Segment moods react predictably to documented triggers.
- Atmosphere composite enters the match engine correctly.
- Fan events surface as inbox cards with Accept / Decline / Defer
  actions.

## Dependencies

- [[../50-Game-Design/fan-ecology]]
- [[../50-Game-Design/rivalry-system]] (atmosphere multiplier)
## Related

- [[README]]
- [[../50-Game-Design/fan-ecology]]
- [[../60-Research/fan-culture-segmentation-research]]
