---
title: Feature - Rivalry System
status: draft
tags: [feature, rivalry, fans, narrative]
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related:
  - [[README]]
  - [[../50-Game-Design/rivalry-system]]
  - [[../50-Game-Design/fan-ecology]]
  - [[../50-Game-Design/matchday-event-engine]]
---

# Feature - Rivalry System

> **REOPENED on 2026-05-27:** This feature note is `draft` planning context again. Any `approved`, `binding`, or implementation-ready wording below is historical pre-reopen context until Nico re-approves it.

## Goal

Rivalries emerge from geography, history, sport, fan incidents and
transfer conflicts. They are read by atmosphere, sanctions, watch-party
proposals and the match engine.

## User stories

- As a manager I see emerging rivalries surface as derby badges.
- As a manager I see why a fixture got high-security classification.
- As a watch-party organiser I see the system propose high-rivalry
  fixtures.

## Post-MVP depth scope

Rivalry systems are post-MVP depth unless a minimal derby/fan signal is needed
for the Roguelite first playable.

- 5 sub-scores (regional / historical / sporting / fan-incident /
  transfer-tension).
- `rivalry_score` aggregate with documented weights.
- Threshold tiers (none / mild / strong / high / volatile).
- Per-season decay logic.
- Integration with atmosphere + sanction chain.

## Out of first rivalry release

- Cross-country rivalries (Phase 2).
- Rivalry-driven media event campaigns (Phase 2).
- Named ultras-group rivalries.

## UI tiers

- Quick: derby badge on fixture card.
- Standard: rivalry card with sub-score breakdown.
- Expert: full rivalry graph view with incident timeline.

## Acceptance

- Sub-scores update correctly on documented triggers.
- Decay is applied deterministically per season.
- Volatile rivalries auto-classify as high-security.

## Dependencies

- [[../50-Game-Design/rivalry-system]]
- [[../50-Game-Design/matchday-event-engine]]
## Related

- [[README]]
- [[../50-Game-Design/rivalry-system]]
- [[../50-Game-Design/fan-ecology]]
- [[../50-Game-Design/matchday-event-engine]]
