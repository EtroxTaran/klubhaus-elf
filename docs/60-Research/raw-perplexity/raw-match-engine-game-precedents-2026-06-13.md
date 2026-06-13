---
title: "Raw - match-engine game precedents and fidelity tiers (FMX-133)"
status: raw
tags: [research, raw, perplexity, match-engine, game-precedents, football-manager, ootp, quality-profile, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[../match-engine-core-model-2026-06-13]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../50-Game-Design/match-engine]]
---

# Raw - match-engine game precedents and fidelity tiers (FMX-133)

## Research prompt

Perplexity was asked for football/sports-management game precedents for rich
watched matches, quick/background simulation, event logs, highlights, statistics
and what those precedents imply for FMX match quality profiles.

## Source-quality note

The answer identified the right precedent families but cited several weak or
irrelevant URLs. This note preserves the design extraction only; stronger source
checks are in [[raw-match-engine-source-checks-2026-06-13]].

## Extracted findings

- Football Manager is the clearest genre precedent for a rich watched matchday:
  match events, movement, highlights, cameras, data cards and immersive
  presentation increase trust because the simulation becomes visible.
- OOTP Baseball is the strongest adjacent sports-management precedent for
  multiple consumption speeds over the same underlying game: pitch-by-pitch
  detail versus compressed game progression.
- Hattrick and mobile football-management games show that low-visual or
  report-led simulation can work when the result, event report and long-term
  management loop are trusted.
- The product lesson is to separate **simulation truth** from **presentation
  depth**. A low-visual tier can still be credible if it emits enough audit
  detail and statistics for the player to understand what happened.
- Background-fast cannot be allowed to become a separate universe. Its aggregate
  distributions must remain compatible with the high-fidelity profiles even if
  it emits fewer micro-events.

## Design implications

- Keep one canonical match semantics and four quality profiles:
  `competitive-full`, `interactive-standard`, `background-detailed`,
  `background-fast`.
- Renderability and replay detail belong only to the profiles that keep full
  event/spatial truth; background profiles are distributional/summary outputs.
- Quality-profile compatibility should be a statistical test, not a promise in
  prose.
- The explanation layer is as important as the visual layer: players must be able
  to connect tactics, attributes, chances and final stats.

## Source trail

- Perplexity research pass, 2026-06-13: game precedents and quality-profile
  design implications.
- Stronger source checks: [[raw-match-engine-source-checks-2026-06-13]].

## Related

- [[../match-engine-core-model-2026-06-13]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]

