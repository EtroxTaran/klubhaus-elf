---
title: Feature - Player Lifecycle and Development
status: draft
tags: [feature, player-development, youth, mentoring]
context: squad-player
created: 2026-05-17
updated: 2026-05-28
type: feature
binding: false
related: [[README]], [[../50-Game-Design/youth-academy-and-development]], [[../50-Game-Design/squad-and-club-structure]], [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Feature - Player Lifecycle and Development

## Goal

Model player growth as a causal weekly system driven by age phase, training,
minutes, role fit, morale, health and mentoring.

## User stories

- As a manager I can see why a player improved, stalled or declined.
- As a manager I can assign mentors and understand likely influence.
- As a manager I can use loans to improve a player through fit, not just
  raw minutes.

## MVP foundation scope

Applies to the Roguelite first playable only where it supports the opening
squad/run loop; deeper lifecycle depth can follow after MVP.

- Weekly development tick for active club players.
- PA uncertainty ranges from scout/coach knowledge.
- Explanation tags for development reports.
- Mentoring groups with influence score, caps and conflict risk.
- Loan-environment modifiers for development.
- `DevelopmentDecisionContext` planning hook from
  [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  so top causes come from the shared factor matrix instead of ad-hoc feature
  logic.

## Out of first playable scope

- Full social graph / clique simulator.
- More than the locked 8 hidden meta attributes.
- Manual per-attribute training micro-schedules beyond existing UI tiers.

## Acceptance

- Same save state + same seed produces identical development deltas.
- UI can explain the top 1-3 causes of a significant delta, mapped to the
  GD-0021 development factor matrix.
- Mentoring never applies instant direct attribute boosts.
- PA true value is never exposed directly outside Expert/debug tooling.

## Dependencies

- [[../50-Game-Design/youth-academy-and-development]]
- [[../50-Game-Design/squad-and-club-structure]]
- [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
