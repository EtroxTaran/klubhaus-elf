---
title: GD-0011 Career Progression, Board & Objectives
status: draft
tags: [game-design, gddr, progression]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0001-core-loop]], [[GD-0010-ai-world]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
---

# GD-0011: Career Progression, Board & Objectives

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

A decades-long arc — club legend rising toward national-team coach — with a
single, transparent board-trust pressure each match.

## Decided / strong

- **Board trust = a single 0–100% stat** (not multi-axis), transparent deltas
  after each match (MVP-blocking). Modeled on Anstoss (wins ≈ +3%, losses
  −1…−5%; "win-or-fired") (anstoss-series-deep-dive §7 rec. 6, §3 "Board").
- Board levers: bank balance > threshold; presidential palace +10%; one formal
  board meeting/season +5–10%; **do not negotiate season goals** (cost, no
  payoff) (anstoss-series-deep-dive §3 "Board").
- **Long arc: club legend → national-team coach** is the intended narrative
  spine; saves roll across many seasons (anstoss-series-deep-dive §3, §6, §7
  post-MVP 14; competitor-matrix).
- Retention drivers: "numbers go up", persistent legend lists, dynamic rivals
  across decades (club-boss-analysis "Retention drivers").
- **End-game systems must exist before launch** (club-boss-analysis takeaway 12).

## Open (Wave 2)

- **R2-06 (high)** — board-ambition escalations, ownership transitions, the
  national-team arc, prestige/hall-of-fame/legacy metrics, numeric tuning.
  Dynasty saves currently flatline ~season 4–6.

## Rationale

One transparent trust stat keeps stakes legible on mobile; the legend→nation
arc is the long-term goal competitors lack (anstoss-series-deep-dive §7 rec. 6).

## Consequences

Positive:

- Legible per-match stakes + a multi-decade goal.

Negative / constraints:

- The late-game arc itself is undesigned (R2-06).

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] / [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] (R2-06 input blocks)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0010-ai-world]] · [[GD-0008-finance-economy]]
