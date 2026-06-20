---
title: Feature - Match-day Event Engine
status: draft
tags: [feature, events, matchday, weather, sanctions]
context: match
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related: [[README]], [[../50-Game-Design/matchday-event-engine]], [[../50-Game-Design/regulations-and-compliance]], [[../50-Game-Design/rivalry-system]], [[feature-systemic-event-director]], [[feature-venue-operations]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Feature - Match-day Event Engine

## Goal

Drive flavour and management depth from rule-based match-day events
(weather, infrastructure, security, medical, catering, media).

## User stories

- As a manager I see a "frozen beer line" event at a winter match
  because I underinvested in maintenance.
- As a manager I see a heat-incident event in a sold-out summer match
  because I have no water station.
- As a manager I prevent fan-incident events by investing in security +
  fan-project budget.

## Post-MVP depth scope

Matchday events are post-MVP depth unless a minimal deterministic event is
needed for the first match tutorial or staged economy-crisis feedback.

- YAML-authored event schema (trigger / probability / effect /
  prevention).
- Engine evaluation phases (pre-match / live / post-match).
- ≥ 20 events across the 6 categories.
- Inbox cards + per-match effect surfacing.
- Sanction chain feeding from security events.
- Venue/pitch conflict inputs from [[feature-venue-operations]].

## Out of first matchday-event release

- Recurring multi-match parent events (Phase 2).
- Region-specific weather generators (Phase 2).
- Match-day live commentary integration (Phase 3).

## UI tiers

- Quick: 1-2 event cards with one preventive action.
- Standard: per-match event log + suggested investments.
- Expert: full rule view + prevention coverage map.

## Acceptance

- Triggers fire deterministically given the documented inputs.
- Probability calibration produces sane frequencies in golden-trace
  matches.
- Sanction chain progresses correctly across multiple incidents.
- Community-authored events load through schema validation.

## Dependencies

- [[../50-Game-Design/matchday-event-engine]]
- [[../50-Game-Design/regulations-and-compliance]]
- [[../50-Game-Design/community-editor-and-datasets]]
- [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
