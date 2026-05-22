---
title: GD-0002 Match Engine & Simulation Model
status: draft
tags: [game-design, gddr, match-engine]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[GD-0004-tactics]], [[GD-0010-ai-world]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/modules/match-engine]]
---

# GD-0002: Match Engine & Simulation Model

## Status

draft

## Date

2026-05-17

## Player experience goal

A match that feels consequential and is reproducible — readable as a 30-second
text feed or a longer 2D ticker, on the same save, fully offline.

## Decided / strong

- Engine = **pure TypeScript, seedable RNG, minute-by-minute events, no React**;
  deterministic for tests and reproducible saves (ADR-0003 — *draft, intended*).
- Day-ticks in a 7-day cycle **plus a match-tick** (anstoss-series-deep-dive
  §7 rec. 1).
- Presentation tiers: **highlights + 2D ticker for MVP; defer 3D** (post-MVP,
  perf-flagged); three tiers, not four (anstoss-series-deep-dive §5 takeaway 2,
  §7 rec. 3).
- **Halftime is a 30-second modal** (formation, mentality, one-tap sub; deeper
  under "More") (anstoss-series-deep-dive §5 takeaway 5, §7 rec. 4).
- **Pre-match comparison view** (own vs opponent stat strips) manufactures
  stakes cheaply (club-boss-analysis takeaway 3).
- All match simulation runs **fully offline** (ADR-0002 accepted;
  pwa-offline-patterns §11).

## Open (Wave 2)

- **R2-01 (critical)** — event schema, tick granularity, formation/mentality
  effect curves, RNG choice, statistical envelope; ≤50 ms/match mid-range
  Android, ≤5 ms/AI match.
- **R2-08 (critical)** — seedable PRNG choice, separate world/match/AI RNG
  streams, replay format; no `Date.now()` in payloads.
- **R2-16 (high)** — rendering tech per tier; `prefers-reduced-motion`.
- **R2-09 (high)** — low-end device budgets. ADR-0003 itself defers all
  tuning/balancing to Wave 2.

## Rationale

A pure, seeded engine is unit/property-testable before any UI and keeps saves
reproducible (ADR-0003 Rationale).

## Consequences

Positive:

- Reproducible matches; testable in isolation; offline-safe.

Negative / constraints:

- No numbers exist yet — this GDDR cannot be implemented until R2-01/08 close.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (replay/determinism)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- Module: [[../10-Architecture/modules/match-engine]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0004-tactics]] · [[GD-0010-ai-world]]
