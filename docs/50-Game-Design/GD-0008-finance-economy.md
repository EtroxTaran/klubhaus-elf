---
title: GD-0008 Finance, Economy & Stadium
status: draft
tags: [game-design, gddr, finance, economy]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0011-career-progression]], [[GD-0012-onboarding]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../60-Research/competitor-matrix]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
---

# GD-0008: Finance, Economy & Stadium

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

Money as a strategic constraint the player learns to manage — operating budget
vs investment budget — never an opaque number that just goes down.

## Decided / strong

- **Two-layer finance (MVP-blocking)**: separate operating P&L (wages, gate,
  sponsor, federation levy) from investment budget (transfers, stadium)
  (anstoss-series-deep-dive §7 rec. 7, §3 "Finance").
- Anstoss model drawn from: operating revenue vs expenses incl. **federation
  levy ≈4% of monthly income**; **presidential spending freeze on negative
  balance** (anstoss-series-deep-dive §3 "Finance").
- Stadium economy: capacity + on-grounds buildings each with ROI;
  **per-match ticket pricing** by prestige; amenities affect mood. Attractions
  sub-economy is **post-MVP** (anstoss-series-deep-dive §3, §7 post-MVP 12).
- Player levers (adopt): ticket pricing, sponsor recurring revenue, transfer
  P&L, stadium upgrades, staff facility slots (club-boss-analysis "Finances").
- **Starting cash / starting team rating are tunable constants** and a pacing
  lever; **patch-note transparency** about such tuning is a trust mechanic
  (club-boss-analysis takeaway 11).
- **MVP must ship *some* stadium economy** (≥ an upgrade tree)
  (competitor-matrix "MVP-expectation risks").
- All finance actions work **fully offline** (anstoss-series-deep-dive §5
  takeaway 8; ADR-0002 accepted).

## Open (Wave 2)

- **R2-06 (high)** — board-ambition escalations, ownership transitions,
  prestige/legacy metrics, the "cash pile, nothing to spend" end-game plateau.
- **R2-02 (critical)** — budget/wage/attendance tier model parameterised by
  fictional-country macro indicators. Economy calibration is Weak in Wave-1.

## Rationale

The two-budget split is the core financial decision and the onboarding teaching
target (anstoss-series-deep-dive §7 rec. 7; club-boss-analysis takeaway 7).

## Consequences

Positive:

- Sustainable-club fantasy with a clear learnable model.

Negative / constraints:

- All economy numbers deferred to Wave 2 (R2-02/R2-06).

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (club/finance schema)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]] · [[../60-Research/competitor-matrix]]
- [[README]] — hub · siblings: [[GD-0011-career-progression]] · [[GD-0012-onboarding]] · [[GD-0009-league-structure]]
