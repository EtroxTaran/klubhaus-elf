---
title: GD-0005 Training & Development
status: accepted
tags: [game-design, gddr, training]
created: 2026-05-17
updated: 2026-06-08
type: game-design
binding: true
related: [[README]], [[GD-0003-squad-players]], [[GD-0001-core-loop]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
---

# GD-0005: Training & Development

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

A weekly plan you can set once and forget, or micro-manage — with regeneration
as a real, punishing trade-off against injuries.

## Decided / strong

- **Weekly plan with daily slots**; condition vs freshness as distinct axes;
  **individual training of one player per week**; team chemistry
  ("Eingespielt"); training camps with location effects; **mandatory
  regeneration to avoid injuries** (anstoss-series-deep-dive §3 "Training", §6).
- Baked into the week: Tue light training + individual focus, Wed tactical
  training + injury check, Sun regen (anstoss-series-deep-dive §4).
- ~7-week pre-season conditioning; winter break = mini camp
  (anstoss-series-deep-dive §4).
- Development scales with training-centre upgrades; **hard cap of 5 trainers**
  as a scarcity lever (club-boss-analysis "Staff"); caps should be
  **upgradeable** via infrastructure so they stop feeling punitive late game
  (club-boss-analysis takeaway 9).

## Open (Wave 2)

- No dedicated Wave-2 item; intersects **R2-03** (tactics/training contract)
  and **R2-19** glossary terms (`condition`, `freshness`, `Eingespielt`).
  Numeric calibration of training/youth investment is implicitly R2-02/R2-06.

## Rationale

Condition/freshness/regen as opposing pressures create the core weekly
decision; upgradeable caps avoid late-game punishment (club-boss-analysis 9).

## Consequences

Positive:

- A recurring meaningful weekly choice with long-run payoff.

Negative / constraints:

- Effect magnitudes undefined until Wave 2 numeric calibration.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (training → attribute deltas)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]]
- [[README]] — hub · siblings: [[GD-0003-squad-players]] · [[GD-0001-core-loop]] · [[GD-0007-youth]]
