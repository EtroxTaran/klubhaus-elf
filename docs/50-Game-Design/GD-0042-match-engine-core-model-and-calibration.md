---
title: GD-0042 Match-engine core model and calibration
status: draft
tags: [game-design, gddr, match-engine, xg, xt, epv, calibration, quality-profile, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: gddr
binding: false
linear: FMX-133
related:
  - [[../60-Research/match-engine-core-model-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-match-engine-game-precedents-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]]
  - [[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[GD-0002-match-engine]]
  - [[match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
---

# GD-0042: Match-engine core model and calibration

## Status

draft

> **Decision gate.** This GDDR is a non-binding FMX-133 proposal until Nico approves
> the D1-D6 packet in
> [[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]]. It is
> written in "if ratified" language and must not be treated as implementation
> authority yet.

## Context

[[GD-0002-match-engine]] accepts the spatial-event match-engine direction but
keeps Wave-2 gates open for numeric representation, minimum spatial sample
density, statistical envelopes and background-fast compatibility. FMX-135 closed
the runtime/numeric part through
[[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface|ADR-0096]].
FMX-133 prepares the remaining game-model and calibration closure packet.

## Proposed decision if ratified

FMX's match engine uses one game semantics across profiles:

- a discrete spatial-event possession chain;
- xT/EPV-style possession value for action choice;
- shot xG for shot-to-goal probability;
- weighted/logistic attribute contests for action outcome probability;
- structured reason codes for analytics, commentary and debugging;
- calibration by statistical envelopes and seed-sweep harnesses.

## Action selection

For every decision point, the engine:

1. observes field state: phase, zone, ball-carrier, pressure, compactness, role
   positions, fatigue, score context and tactical settings;
2. proposes plausible actions from tactic, player role, traits and field state;
3. scores each action by expected possession value:

   ```text
   utility(action) =
     sum(outcome_probability(action, state, actor, opponent) *
         possession_value(resulting_state(outcome)))
     + tactical_style_bias
     + player_trait_bias
     - risk_penalty
     - fatigue_or_pressure_penalty
   ```

4. lets Decisions, Composure and tactical familiarity determine how often the
   top action is chosen versus a near-best plausible alternative;
5. resolves outcome through fixed deterministic RNG streams and replay-bearing
   integer/fixed-point math per ADR-0096.

## Attribute-to-probability mapping

Use logistic or logistic-like fixed-point functions fed by weighted contests.
The exact coefficients are calibration data, but the v1 feature classes are:

| Action | Attacker inputs | Defender/context inputs | Output |
|---|---|---|---|
| Pass | Passing, Technique, Vision, Decisions, role fit, fatigue | Pressure, lane congestion, receiver separation, opponent Anticipation/Positioning | success, partial, interception, out |
| Dribble | Dribbling, Technique, Balance, Agility, Acceleration, Flair, Decisions | Tackling, Positioning, Strength, pressure count, zone congestion | beat defender, retained, tackled, foul |
| Duel/press | Work Rate, Aggression, Anticipation, Stamina, Bravery | Opponent Technique/Composure, support, pitch control | turnover, foul, bypassed, loose ball |
| Aerial | Heading, Jumping, Strength, Bravery, Positioning | Opponent same, delivery quality, crowding | won, lost, flick-on, foul |
| Shot | Finishing, Technique, Composure, Weak Foot, fatigue | xG features, pressure, keeper position/reflexes, block angle | goal, save, block, miss |
| Foul/card | Aggression, Tackling risk, fatigue, frustration | Referee profile, tackle angle, tactical foul context | no foul, foul, yellow, red |

Every event logs reason codes, not prose authority. LLM or template commentary
may only consume the committed event and reason codes.

## xG and possession value

- xG is a shot-quality probability surface. Required v1 features:
  distance/angle, body part, shot type, assist type, pressure/defender context,
  keeper context, fatigue and composure.
- Possession value is an xT/EPV-like grid over ball zone plus pressure and pitch
  control proxies. It evaluates passes, carries, dribbles and shots by expected
  state value, not by immediate goal probability alone.
- Full tracking-grade EPV is future refinement; v1 uses transparent grid/value
  tables so players can understand tactical causality.

## Statistical envelopes

If ratified, these are the v1 calibration targets:

| Metric | V1 target |
|---|---|
| Goals, both teams | 2.6-3.0 mean; 2.4-3.2 preset band |
| Shots, both teams | 22-30 |
| Total xG | 2.4-3.2 |
| xG per shot | 0.08-0.12 |
| Yellow cards | 3.5-7.5 |
| Red cards | 0.08-0.35 |
| Possession styles | 35-65% season-average team range |
| PPDA styles | 6-20+ |
| Time-loss injuries | 0.2-0.4 per match equivalent, checked at squad-season level |

These are aggregate envelope gates, not hard clamps on individual matches.

## Spatial sample density

| Profile | Required event/spatial output |
|---|---|
| `competitive-full` | Full event log; event anchors; 1 Hz state samples; phase-boundary samples; intervention support; byte-exact replay. |
| `interactive-standard` | Full event log; event anchors; 0.33 Hz state samples; phase-boundary samples; byte-exact replay; less precise heatmaps/running-distance estimates. |
| `background-detailed` | Summary plus selected key events/stats; seed and parameter provenance; no renderable spatial track by default. |
| `background-fast` | Outcome/stat summary only; no renderable event/spatial source; aggregate compatibility required. |

## Calibration harness

The future implementation must provide:

- golden replay fixtures for byte-exact profiles;
- seed sweeps over named scenarios;
- statistical envelope checks for goals, shots, xG, possession, PPDA, cards,
  injuries and profile-specific outputs;
- goodness-of-fit checks for categorical and distributional outputs;
- background-fast compatibility against `competitive-full` reference
  distributions;
- versioned baselines and review gates for intentional re-baselines.

Minimum scenario pack:

- equal teams;
- favourite versus underdog;
- high press versus low block;
- direct play versus possession;
- tired/congested squad;
- strict referee;
- set-piece advantage;
- weather/pitch stress when those systems feed the engine.

## Calibration slot (FMX-141)

If ratified, this GDDR is the source GDDR for slot `match.core` under
[[GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]].

- Parameter pack: `matchCoreModelVersion`
- Harness: T0 golden replay + T1/T2 match scenario sweeps in
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: W/D/L, goals, shots, xG, xG/shot, cards, injuries, possession,
  PPDA, profile compatibility and background-fast aggregate drift.

## Supersedes / closes if ratified

If Nico approves D1-D6, this GDDR closes/supersedes these GD-0002 open gates:

- Numeric representation: closed by ADR-0096, referenced here.
- Minimum spatial sample density per quality profile: closed by this GDDR.
- Statistical envelopes for tactics, star-player involvement, xG, pressing,
  cards, injuries and background-fast compatibility: closed by this GDDR.

The TS-vs-Rust runtime spike is already superseded by ADR-0096. Disconnect timers
and pause budgets stay owned by the live-control/watch-party records, not FMX-133.

## Open Nico decisions

Approve or change D1-D6 in
[[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]].
Recommended packet: **A/A/A/A/A/A**.
