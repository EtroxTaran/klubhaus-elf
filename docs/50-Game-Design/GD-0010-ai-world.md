---
title: GD-0010 AI Managers & World Simulation
status: draft
tags: [game-design, gddr, ai]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[GD-0006-transfers]], [[GD-0011-career-progression]], [[../60-Research/club-boss-analysis]], [[../60-Research/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]]
---

# GD-0010: AI Managers & World Simulation

## Status

draft

## Date

2026-05-17

## Player experience goal

A living league that rises and falls around the player across decades — never a
world that freezes once you reach the top.

## Decided / strong

- A **dynamic rival world** is an explicit design goal: fallen-giant and
  rising-rival cycles baked into world sim via periodic stochastic rating
  drift ("cheap to implement") (club-boss-analysis takeaway 13;
  competitor-matrix differentiation).
- Explicitly **avoid the "Club Boss late-game flatline"** where the world stops
  mattering at the top (club-boss-analysis "Retention failure modes").
- AI bidding pressure on the transfer market is part of the intended model
  (anstoss-series-deep-dive §3 "Transfers").

## Open (Wave 2) — almost entirely open; Wave 1 explicitly parked this

- **R2-04 (high)** — AI archetypes (4–6: rich, youth-focused, fire-sale,
  established); heuristic vs utility-AI vs simple ML for transfers/scouting/
  rotation; fairness & difficulty curve; deterministic seeds.
- **R2-06 (high)** — the world-drift algorithm itself (rival drift,
  fallen-giant cycles, rising youth nations).
- **R2-08 (critical)** — isolate a separate "AI RNG" stream from world/match.

## Rationale

Long-term retention depends on a world that keeps generating rivals and stories
(club-boss-analysis "Retention drivers", takeaway 13).

## Consequences

Positive:

- Decades-long saves stay interesting.

Negative / constraints:

- Mostly undesigned (R2-04/06/08) → blocks ADR-0003 / ADR-0009 input blocks.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (AI inputs, RNG streams)
- [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] (AI behaviour epics)

## Related

- Research: [[../60-Research/club-boss-analysis]] · [[../60-Research/research-wave-2-gaps]]
- [[README]] — hub · siblings: [[GD-0006-transfers]] · [[GD-0011-career-progression]] · [[GD-0002-match-engine]]
