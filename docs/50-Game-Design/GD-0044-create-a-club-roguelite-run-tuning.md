---
title: GD-0044 Create-a-Club Roguelite run tuning
status: accepted
tags: [game-design, gddr, roguelite, run-end, insolvency, board, carry-slots, meta-progression, fmx-137]
context: manager-legacy
created: 2026-06-14
updated: 2026-06-14
type: gddr
binding: false
linear: FMX-137
related:
  - [[README]]
  - [[mode-create-a-club-roguelite]]
  - [[GD-0019-manager-archetype-roguelite-progression]]
  - [[GD-0030-dynasty-board-and-ownership]]
  - [[GD-0008-finance-economy]]
  - [[economy-system]]
  - [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-comparable-games-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]]
  - [[../40-Execution/fmx-137-roguelite-tuning-decision-queue-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
---

# GD-0044: Create-a-Club Roguelite run tuning

## Status

accepted

> FMX-137 decision packet accepted 2026-06-14. Nico approved the recommended
> D1-D6 packet by instructing implementation of the proposed plan. This GDDR is
> the binding tuning record for the resolved Create-a-Club Roguelite run-end,
> carry-slot, async cosmetic and archetype-taxonomy questions. The detailed
> mode note [[mode-create-a-club-roguelite]] remains `draft` and must not
> contradict this record.

## Date

2026-06-14

## Player experience goal

A Create-a-Club Roguelite run should feel fair, tense and inspectable. The
player can see the club sliding toward insolvency or board control loss and can
fight back with meaningful levers. When the run ends, it ends because control
was lost, not because an invisible counter fired. The next run starts with a
small, interesting choice advantage, not raw power that erases the joy of
building the club again.

## Decided / strong

### 1. Run-end model: staged failure, not instant liquidity death

The hard run-end model is a **staged ladder**:

1. warning / forecast breach;
2. negative liquidity or overdraft pressure;
3. restrictions, arrears or licence-review pressure;
4. recovery or rescue actions;
5. licence loss, administration/liquidation route or board control loss;
6. run end.

Liquidity below zero is therefore a danger state and recovery gate, not an
instant run-ending switch. This keeps football-domain realism and supports
roguelite clarity.

### 2. Liquidity grace default: two unresolved month-end failures

The MVP product default is:

> After buffers and rescue levers are exhausted, **two consecutive unresolved
> month-end liquidity/licence failures** trigger licence loss / run-end.

"Unresolved" means the player has no accepted recovery path left for that
check: overdraft/credit line, financing, restructuring, board support, emergency
sale or licence remedy is unavailable, exhausted, rejected or missed. Exact
cash bands, licence bands, tier/country modifiers and rescue magnitudes remain
calibration/regulations-profile data.

### 3. Board control loss: two failed seasons through GD-0030 last chance

Board loss uses [[GD-0030-dynasty-board-and-ownership]]:

`confident -> concerned -> under_review -> vote_of_confidence -> last_chance -> sacked`.

The default is **two consecutive failed season-level expectation cycles**, but
only after the GD-0030 confidence ladder reaches `last_chance` and the
last-chance objective fails. A raw two-season counter cannot bypass board
expectations, owner patience, recovery meetings or visible top factors.

`sacked` ends the roguelite run and feeds Manager & Legacy run analysis.

### 4. Carry-slot economy: capped logarithmic functional growth

The carry economy is:

- a new run starts with **1 functional carry slot**;
- completed-season milestones across prior runs grow this to **2** and then
  **3** functional slots;
- **3 functional slots is the cap** until a fresh Nico decision changes it;
- after the cap, progression unlocks founding-option pools, challenge variants,
  narrative/legacy echoes and cosmetics, not more raw mechanical carry slots.

Functional carries must be small, optional and structural. They may shape the
founding package; they must not preserve squad value, cash balance, stadium
build-out, sponsor contracts, league reputation or squad attribute floors.

Per [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]],
no MVP carry or perk may increase starting finance. Any future start-finance
perk requires prestige gating, hard cap, challenge counterweight and a fresh
Nico decision.

### 5. Async kit/cosmetic visibility: yes, light and inert

Achievement kit patterns may be visible to other managers in private async
groups when all of these are true:

- mechanically inert: no gameplay, economy, scouting, fixture or reputation
  effect;
- feat-bound: awarded by in-game achievements, not paid power;
- fiction-safe: no real club marks, sponsors or protected patterns;
- light-badged: readable as a small identity signal, not a public ranking
  system;
- privacy-safe: future profile/showcase surfaces need their own gate.

### 6. Manager archetype taxonomy remains deferred

FMX-137 does **not** name final archetypes or lock thresholds. The accepted
policy remains:

- save run-end facts and coarse style signals;
- show minimal post-run reflection;
- avoid visible grind checklists;
- author a small candidate taxonomy later, then validate/rename by playtest
  clustering;
- keep final names, perk caps and prestige ladders post-MVP and Nico-gated.

This confirms [[GD-0019-manager-archetype-roguelite-progression]] and
[[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]].

## Open / calibration

- Monetary bands, licence thresholds, country/tier differences, rescue
  magnitudes and detailed board-confidence weights remain calibration/profile
  work.
- Carry-slot milestone values are playtest-tunable, but the accepted shape is
  capped and logarithmic with max three functional slots.
- Full async profile showcase, public comparison and privacy controls remain
  future work.
- Final archetype names, thresholds, perks and prestige ladder remain post-MVP
  and require Nico approval.

## Rationale

Real football insolvency and regulation practice supports a staged distress
process rather than instant club death. Football-manager genre precedent
supports visible board and finance pressure, but FMX's roguelite mode needs a
clearer end state than a traditional endless career save. Roguelite
meta-progression precedent points away from permanent raw power and toward
choice variety, cosmetics, post-run learning and capped/diminishing functional
carries. The accepted packet follows those lessons while preserving FMX's
existing GD-0008/GD-0030/GD-0019/ADR-0082 constraints.

## Sources

- [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-roguelite-comparable-games-2026-06-14]]
- [[../60-Research/raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]]

