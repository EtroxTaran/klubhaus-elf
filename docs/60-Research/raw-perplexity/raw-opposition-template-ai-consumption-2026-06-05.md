---
title: "RAW Perplexity/Web - Opposition-template AI consumption contract (FMX-67)"
status: raw
tags: [research, raw, perplexity, web, tactics, opposition, match, determinism, replay, fmx-67]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../opposition-template-ai-consumption-contract-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../determinism-and-replay]]
---

# RAW - Opposition-template AI consumption contract (FMX-67)

Perplexity/Web capture for **FMX-67**. Status `raw`: this is source input only;
the synthesis is [[../opposition-template-ai-consumption-contract-2026-06-05]]
and the proposed decision is
[[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].

## Prompt 1 - Real-world football opposition preparation

**Prompt.** Research real-world football opposition preparation workflows in
professional clubs circa 2020-2026. Focus: who prepares opponent analysis, when
tactical plans are fixed before a match, how late changes are handled, and how
analysts/coaches hand off plans to matchday staff.

**Key captured findings.**

- Professional opposition analysis is a staged workflow: analyst/data teams
  produce recent-match, video and event-data reports; coaches turn those into a
  match plan; players receive condensed team/unit/individual delivery.
- The main plan is normally shaped through the training week and becomes stable
  by the last main tactical session. Late surprises are handled by pre-planned
  conditional branches, not by designing a new plan inside the match itself.
- Conditional plans commonly account for scoreline, substitutions, likely shape
  changes and coach tendencies. This maps directly to a match-prep planning
  event plus replay-safe in-match intervention events.

**Useful sources returned / checked.**

- Hudl, "High Performance Analysis Workflows: Pre-Match Opposition Analysis",
  2021-11-24:
  https://www.hudl.com/blog/workflows-pre-match-opposition-analysis
- Scott Martin, "How to effectively scout your opposition", 2023-12-24:
  https://scottmartinmedia.com/blogs/news/how-to-effectively-scout-your-opposition-2023-advent-calendar-series
- PFSA scouting material / opposition analysis resources:
  https://thepfsa.co.uk/scouting-material/

## Prompt 2 - Comparable games and sports-management precedents

**Prompt.** Research how football/club management games and adjacent sports
management sims handle opponent tactics, pre-match planning, scouting reports,
AI manager style and match lock/replay determinism. Include Football Manager,
OOTP Baseball, Football Coach: College Dynasty or similar, Motorsport Manager
if relevant.

**Key captured findings.**

- Football Manager's official manual exposes opposition instructions as
  position/player-specific tactical treatment applied ahead of every match and
  tweakable before kick-off based on the actual opponent lineup/shape; set
  pieces can be delegated to backroom staff and match plans can trigger on
  scenario criteria.
- OOTP exposes team strategy by time and score state; staff can generate
  strategy for a selected state combination. This is an adjacent-sim precedent
  for pre-authored conditional strategy rather than hidden continuous
  re-planning.
- Public game sources do not document exact internal replay architecture.
  Therefore the safe FMX inference is player-facing/genre-level only:
  management sims separate scouting/prep from match execution, then allow
  explicit in-match changes at known boundaries.

**Useful sources returned / checked.**

- Sports Interactive manual, Football Manager 2024 Tactics:
  https://community.sports-interactive.com/sigames-manual/football-manager-2024/tactics-r4960/
- FootballManager.com, "Using Opposition Instructions for marginal gains":
  https://www.footballmanager.com/node/508
- OOTP manual, Team Strategy:
  https://manuals.ootpdevelopments.com/index.php?man=ootp12&page=help_team_page.strategy
- OOTP manual, Scouting:
  https://manuals.ootpdevelopments.com/index.php?man=ootp16&page=scouting

## Prompt 3 - Deterministic simulation / replay architecture

**Prompt.** Research deterministic simulation/replay best practices relevant to
sports management sims: lockstep, input/event logs, seeded RNG substreams,
immutable snapshots at simulation start, and avoiding wall-clock or mutable
cross-context reads.

**Key captured findings.**

- Replay-safe games either make the simulation deterministic from initial
  conditions plus logged inputs, or they persist large state snapshots. The
  deterministic route is preferred for complex simulations because full-frame
  state grows too large.
- Random values must be reproduced by restoring deterministic seed material, and
  deterministic logic should not share RNG with non-deterministic presentation
  or effects.
- For FMX, opponent template selection is replay-relevant. Either the result
  must be frozen/logged before the match, or it must be recomputed from immutable
  match inputs and an isolated RNG stream. Logging the selected result is safer
  across future AI-model changes.

**Useful sources returned / checked.**

- Game Developer, "Developing Your Own Replay System":
  https://www.gamedeveloper.com/programming/developing-your-own-replay-system
- ZenGM, "So you want to write a sports simulation game":
  https://zengm.com/blog/2019/07/so-you-want-to-write-a-sports-sim-game/

## Decision input captured live

Nico selected the recommended FMX-67 options on 2026-06-05:

- split event model;
- final immutability at `lineup_locked`;
- dedicated `WorldAiMgmtRng` sub-label.

