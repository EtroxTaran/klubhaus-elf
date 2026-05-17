---
title: Squad and Club Structure - Sporting Organisation and Squad Design
status: draft
tags: [game-design, squad, staff, organisation]
created: 2026-05-16
updated: 2026-05-16
type: game-design
binding: false
related: [[README]], [[../60-Research/systems-design-synthesis]], [[scouting-and-recruitment]], [[training-load-and-medicine]], [[tactics-system]]
---

# Squad and Club Structure - Sporting Organisation and Squad Design

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
| Data Analyst | Match + opposition data | Tactical depth, role-fit reports |
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
- **Attributes** in 4 groups (Technical / Mental / Physical / Hidden) -
  see [[tactics-system]] for category list. 1-10 scale by default, 1-20
  in expert mode.
- **CA (Current Ability)** and **PA (Potential Ability)** - PA stored as
  a range, not a single value.
- **Personality** (8-12 trait flags: professional, leader, mercenary,
  prankster, smoker, homesick, …).
- **Tendencies** (5-10 traits: drifts to centre, shoots from distance,
  tries first-time passes, …).
- **Contract**: length, wage, bonuses, clauses, agent.
- **Fitness / form / morale** state.
- **Injury history**.
- **Match minutes log** for development calculation.

## 6. Captain and leadership group

- Captain has match-day morale effect.
- Vice-captain takes over on absence.
- Leadership group (3-5) influences dressing-room dynamics + young player
  mentoring.
- Toxic personalities can drag the group; modelled with weekly mood ticks.

## 7. UI tiers

| Tier | Squad UI |
|---|---|
| Quick | Star-rating per player, "best 11" auto-pick |
| Standard | Position group view, role assignment, fitness/morale icons |
| Expert | Full attribute grid, traits, personality, contract liabilities |

## 8. Open questions

- How many position slots per player? Recommendation: 1 primary + up to 2
  secondaries; a "natural" badge for the primary.
- Multi-position roles in tactic editor? Yes - the player can declare a
  position-switch sub-pattern, but it consumes "tactical familiarity"
  budget.
- Reserve-team match modelling - full sim or abstract result? Abstract for
  MVP; full sim Phase 2+.
