---
title: Feature - Fan Ecology UI
status: draft
tags: [feature, fans, ux]
created: 2026-05-16
updated: 2026-05-28
type: feature
binding: false
related: [[README]], [[../50-Game-Design/fan-ecology]], [[../60-Research/fan-culture-segmentation-research]], [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]], [[feature-ai-narration-mvp-pillar]]
---

# Feature - Fan Ecology UI

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
feedback in UI, but it must also expose enough structured context for MVP
AI narration and fan-rep scenes.

- Per-segment state (population, loyalty, mood, attendance probability).
- Named fan-group overlay for narrative context: group name, represented
  segment, identity, red lines, mobilization style and influence.
- Fan-rep context card for controlled dialogue; People owns persona, Fan
  Ecology owns segment facts.
- Atmosphere composite calculation.
- Fan-events feed (choreo, protest banner, ticket boycott).
- Quick / Standard / Expert tier views.

## Out of first playable scope

- Fan-segment churn animations.
- Sponsor decision preview-impact simulator (Phase 2).

## UI tiers

- Quick: single mood badge + 1 event card.
- Standard: 6-segment bar chart with arrows.
- Expert: full grid with drivers + forecasts.

## Acceptance

- Segment moods react predictably to documented triggers.
- Named fan groups and fan reps never create segment facts; they reference Fan
  Ecology facts through context cards.
- Atmosphere composite enters the match engine correctly.
- Fan events surface as inbox cards with Accept / Decline / Defer
  actions.

## Dependencies

- [[../50-Game-Design/fan-ecology]]
- [[../50-Game-Design/rivalry-system]] (atmosphere multiplier)
