---
title: Squad and Club Structure - Sporting Organisation and Squad Design
status: approved
tags: [game-design, squad, staff, organisation]
created: 2026-05-16
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[../60-Research/systems-design-synthesis]], [[../60-Research/player-strength-presentation]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../60-Research/transfer-market-simulation]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[scouting-and-recruitment]], [[transfer-market-and-contracts]], [[training-load-and-medicine]], [[tactics-system]]
---

# Squad and Club Structure - Sporting Organisation and Squad Design

> Approved by the systemic events / player lifecycle pass (2026-05-17).
> The player record must stay aligned with [[../60-Research/data-generators]]
> and [[tactics-system]].

A club is more than 25 players. It is a sporting organisation with roles,
pipelines and quality multipliers across recruitment, development and
match-day. Modelling this explicitly is how a good manager who picks great
staff outperforms one who hoards transfers.

## 1. Sporting organisation roles

| Role | Owns | Quality effect |
|---|---|---|
| Manager / Head Coach | Tactics, line-up, in-game calls | Direct match performance |
| Sport Director | Strategy across windows, contract policy | Long-term squad balance |
| Chief Scout | Scout network, regional priorities | Coverage breadth |
| Data Analyst | Match + opposition data | Tactical depth, Impact Lens reports |
| Head of Youth | Academy strategy, intake calendar | Youth pipeline yield |
| U-team Coaches | U-21 / U-19 development | Per-player growth |
| Fitness Coach | Load + conditioning | Injury reduction, peak windows |
| Medical / Rehab Team | Treatment + rehab | Downtime reduction |
| Set-Piece Coach | Routines + variants | Set-piece efficiency |
| Goalkeeping Coach | GK-specific training | GK growth + match input |

## 2. Roles as pipelines

Each role is part of a pipeline. Isolated buffs underdeliver:

- Strong chief scout without analyst → many names, poor comparability.
- Strong medical without fitness coach → shorter rehab, no peak-load
  prevention.
- Strong head of youth without U-team coaches → great intake, poor
  progression.

The game shows pipeline coverage explicitly so the player can see *where*
they are bottlenecked.

## 3. Squad design dimensions

The squad has eight balance dimensions, not just "good vs bad":

| Dimension | What it means |
|---|---|
| **Immediate performance** | Sum of starting-XI quality |
| **Tactical fit** | How well roles match the play model |
| **Age profile** | Distribution of ages (peak / pre-peak / post-peak) |
| **Personality** | Leadership / professionalism / ambition mix |
| **Wage structure** | Top-end vs bottom-end ratio |
| **Resale value** | Sellable assets pipeline |
| **Home-grown share** | Academy share of senior minutes |
| **Injury risk** | Aggregate fragility |

A 29-year-old star instantly upgrades performance and tactical fit but can
destroy wage structure, age profile and post-29 resale value. The game
surfaces all eight so the player can see the trade-off.

## 4. Squad-size targets per league tier

| Tier | First team | U-21 | U-19 | Total cap |
|---|---|---|---|---|
| Top tier | 23-25 | 10 | 10 | ~45 |
| Pro mid | 22-24 | 8 | 10 | ~42 |
| Pro entry | 20-22 | 8 | 8 | ~38 |
| Lower semi-pro | 18-20 | 6 | 6 | ~32 |
| Amateur | 16-18 | 4 | 4 | ~24 |

Compliance: some leagues mandate home-grown minimums (e.g. 8 of 25) - see
[[regulations-and-compliance]].

## 5. Player record

Each player carries:

- **Identity**: name, nationality, dob, region.
- **Position primary + secondaries** (3 max).
- **Attributes**: 16 visible outfield + 4 GK-only extras + 8 hidden meta
  attributes. See [[tactics-system]] and [[../60-Research/data-generators]]
  for the canonical category list. The canonical scale is 1-20 across all
  tiers; lower tiers change presentation, not stored values.
- **CA (Current Ability)** and **PA (Potential Ability)**. PA has a
  deterministic underlying value/curve seed. The player sees scouting and
  coaching **uncertainty ranges**, not the hidden true value. CA/PA are
  internal development and generation concepts, not a squad-list OVR.
- **Personality labels** (professional, leader, mercenary, prankster,
  homesick, etc.) derived from the hidden meta attributes, squad context
  and event history. They are not a second hidden-attribute schema.
- **Tendencies** (5-10 traits: drifts to centre, shoots from distance,
  tries first-time passes, …).
- **Contract**: length, wage, bonuses, clauses, agent.
- **Fitness / form / morale** state.
- **Injury profile and history** owned by Squad & Player; load and match
  signals come from Training and Match via domain events.
- **Match minutes log** for development calculation.

## 6. Player Market Profile

Each senior player also has a market profile consumed by
[[transfer-market-and-contracts]]:

- sport value: ability, potential band, role scarcity and tactical fit;
- contract value: remaining months, wage level, clauses and renewal risk;
- player agency: ambition, loyalty, professionalism, morale and role happiness;
- agent profile: fee expectation, leak tendency and openness to intermediaries;
- risk: injury proneness, form volatility, adaptation and family stability;
- public value: reputation, shirt sales, fan attachment and leadership.

The market profile produces ranges and pressure flags, not one public exact
price. UI exposure depends on scouting confidence and progressive-disclosure
tier.

## 7. Captain and leadership group

- Captain has match-day morale effect.
- Vice-captain takes over on absence.
- Leadership group (3-5) influences dressing-room dynamics + young player
  mentoring.
- Toxic personalities can drag the group; modelled with weekly mood ticks.

## 8. UI tiers

| Tier | Squad UI |
|---|---|
| Quick | Assistant-ranked "best 11", qualitative Impact bands, availability warnings |
| Standard | Position group view, role assignment, Role Impact, category bars, fitness/form/morale icons |
| Expert | Full attribute grid, Impact formula breakdown, traits, personality, contract liabilities |

## 9. Impact Lens

Player strength presentation follows
[[../60-Research/player-strength-presentation]]:

- No global OVR or universal star rating is shown in squad lists.
- Every ranked recommendation is tied to a role / duty / tactic context.
- Category scores summarise Technical / Mental / Physical / GK attributes for
  scanability.
- Fitness, form, morale, injury / suspension and sharpness stay visible as
  separate availability signals.
- Unscouted external players show ranges, labels and trust levels rather than
  false precision.

## 10. Future-scope notes (classified future-scope)

- How many position slots per player? Recommendation: 1 primary + up to 2
  secondaries; a "natural" badge for the primary.
- Multi-position roles in tactic editor? Yes - the player can declare a
  position-switch sub-pattern, but it consumes "tactical familiarity"
  budget.
- Reserve-team match modelling - full sim or abstract result? Abstract for
  MVP; full sim Phase 2+.
