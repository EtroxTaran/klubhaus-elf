---
title: GD-0002 Match Engine & Simulation Model
status: draft
tags: [game-design, gddr, match-engine, spatial-event]
created: 2026-05-17
updated: 2026-05-27
type: game-design
binding: false
related: [[README]], [[match-engine]], [[GD-0004-tactics]], [[GD-0010-ai-world]], [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/modules/match-engine]]
---

# GD-0002: Match Engine & Simulation Model

## Status

draft

## Date

2026-05-17

## Player experience goal

A match that feels consequential, tactically legible and reproducible: readable
as a 30-second text feed, a 2D top-down match, a live ticker or a replay, all
from the same committed event/spatial truth.

## Decided / strong

- Engine model = **server-authoritative spatial-event**, not outcome-first and
  not full 22-agent continuous simulation at MVP.
- Engine implementation is **replaceable** behind the ADR-0049 port. TypeScript
  is allowed as a reference/spike adapter; Rust native is the default
  production candidate if the TS-vs-Rust spike shows no clear disadvantage.
- Event log + spatial samples are the single source for 2D Canvas, ticker,
  replay, reports and LLM commentary inputs.
- Star players must be visible through action selection, involvement and
  outcome quality, not only ratings.
- Local match runs are non-binding in the hybrid-online MVP unless a later
  ADR/GDDR grants selective offline authority.
- Day-ticks in a 7-day cycle **plus a match-tick** (anstoss-series-deep-dive
  §7 rec. 1).
- Presentation tiers: **highlights + 2D ticker for MVP; defer 3D** (post-MVP,
  perf-flagged); three tiers, not four (anstoss-series-deep-dive §5 takeaway 2,
  §7 rec. 3).
- **Halftime is a 30-second modal** (formation, mentality, one-tap sub; deeper
  under "More") (anstoss-series-deep-dive §5 takeaway 5, §7 rec. 4).
- **Pre-match comparison view** (own vs opponent stat strips) manufactures
  stakes cheaply (club-boss-analysis takeaway 3).
- Offline manager-week remains A -> C: drafts and command-first contracts now;
  local-authoritative match resolution only after future approval.

## Open / spike gates

- TS-vs-Rust contract spike: same input fixtures, seeds, event log and spatial
  samples.
- Numeric representation: fixed-point vs quantized floats.
- Minimum spatial sample density per quality profile.
- Statistical envelopes for tactics, star-player involvement, xG, pressing,
  cards, injuries and background-fast compatibility.
- Exact disconnect timers and pause budgets must stay aligned with the
  architecture state machines.

## Rationale

Spatial-event is the smallest model that can make tactical decisions, star
players and the 2D view feel causally connected. A swappable engine boundary
prevents early runtime choices from trapping future scale or realism work.

## Consequences

Positive:

- Reproducible matches; testable in isolation; offline-safe.
- 2D, ticker, replay and reports remain consistent.
- Runtime can move from prototype to Rust service without changing gameplay
  consumers.

Negative / constraints:

- Requires contract work before engine implementation.
- Requires statistical validation, not only unit tests.
- Runtime-LLM ticker remains cosmetic and cannot influence gameplay.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (historical planning target)
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (replay/determinism)

## Related

- Research: [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]] ·
  [[../60-Research/anstoss-series-deep-dive]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- Module: [[../10-Architecture/modules/match-engine]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0004-tactics]] · [[GD-0010-ai-world]]
