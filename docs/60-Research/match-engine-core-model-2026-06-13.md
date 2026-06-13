---
title: "Match-engine core model and calibration (FMX-133)"
status: current
tags: [research, synthesis, match-engine, xg, xt, epv, calibration, quality-profile, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]]
  - [[raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]]
  - [[raw-perplexity/raw-match-engine-game-precedents-2026-06-13]]
  - [[raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]]
  - [[raw-perplexity/raw-match-engine-source-checks-2026-06-13]]
  - [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../50-Game-Design/GD-0002-match-engine]]
  - [[../50-Game-Design/match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]]
---

# Match-engine core model and calibration (FMX-133)

## Scope

FMX-133 answers the open game-design/model gates in
[[../50-Game-Design/GD-0002-match-engine]] and the draft detailed system note
[[../50-Game-Design/match-engine]]: statistical envelopes, xG/EPV, attribute
math, minimum spatial sample density and a calibration harness.

It does **not** reopen [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface|ADR-0096]].
The runtime/numeric substrate is already accepted: one Rust-authored WASM module
everywhere with mandatory integer/fixed-point replay-bearing math. FMX-133 uses
that as an input.

This synthesis is non-binding until Nico approves the decision packet in
[[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]].

## Evidence synthesis

Real-world envelopes:

- First calibration should use broad top-tier bands, not one league table:
  **2.6-3.0 goals**, **22-30 shots**, **2.4-3.2 total xG**, **3.5-7.5 yellows**,
  **0.08-0.35 reds** per match.
- Possession and pressing must be style distributions. Dominant teams average
  roughly **58-65% possession**; balanced teams **47-53%**; reactive teams
  **40-46%**. Useful PPDA bands run from **6-8** for relentless press to
  **16-20+** for passive low block.
- Injury data is less precise for game tuning. Use season/squad envelopes and
  fatigue/congestion modifiers rather than forcing one injury cadence per match.

Action/value model:

- xG belongs to shots: probability that a shot becomes a goal, driven by
  location, angle/body part, pressure/defender context and keeper context.
- xT/EPV/possession value belongs to action selection: a pass, carry, dribble or
  shot should be selected because its expected post-action state value, risk and
  tactical fit make sense.
- Weighted attribute contests are still required because FMX is a management
  game: players must see Passing, Decisions, Technique, Positioning, Pressure,
  Fatigue and Composure matter.

Game precedent:

- Football Manager shows the trust value of rich watched matches and coherent
  matchday presentation.
- OOTP shows the value of multiple game-consumption speeds over a detailed sim
  substrate.
- Lower-visual football manager precedents are design evidence for event-log and
  report trust, not a reason to let background profiles diverge.

Calibration:

- A deterministic probabilistic engine needs exact replay tests and statistical
  seed sweeps. One fixed-seed match proves determinism, not realism.
- Background-fast compatibility must be tested against aggregate distributions,
  not event-by-event equality.

## Recommended model

Adopt a hybrid model:

1. Represent possession as a discrete event-chain over phase, zone, pressure and
   ball-carrier state.
2. Enumerate plausible candidate actions from field state, tactic, role and
   player traits.
3. Score each action with expected possession value:

   ```text
   utility(action) =
     sum(outcome_probability(action, state, actor, opponent) *
         possession_value(resulting_state(outcome)))
     + tactical_style_bias
     + player_trait_bias
     - risk_penalty
     - fatigue_or_pressure_penalty
   ```

4. Use attribute math to produce action outcome probabilities and reason codes.
5. Use xG for shot outcome probability.
6. Resolve the chosen action and outcome through the ADR-0096 deterministic RNG
   and fixed-point/integer numeric surface.

## Proposed envelope targets

These are v1 calibration targets, not hard per-match clamps.

| Metric | Standard envelope | Notes |
|---|---:|---|
| Goals, both teams | 2.6-3.0 mean, 2.4-3.2 allowed preset band | League presets may move lower/higher. |
| Shots, both teams | 22-30 | Track on-target share and xG/shot too. |
| Total xG | 2.4-3.2 | Shot quality must agree with goals and shots. |
| xG per shot | 0.08-0.12 | Sanity check, not a clamped output. |
| Yellow cards | 3.5-7.5 | Referee/league profile controls variance. |
| Red cards | 0.08-0.35 | Low-frequency; include second-yellow dependency. |
| Possession | 35-65% season-average team range | Distribution by tactical identity. |
| PPDA | 6-20+ | High-press and low-block presets must separate. |
| Time-loss injuries | 0.2-0.4 per match equivalent | Prefer squad-season calibration. |

## Quality-profile compatibility

Proposed v1:

| Profile | Event truth | Spatial density | Compatibility rule |
|---|---|---|---|
| `competitive-full` | Full committed event log | Event anchors + 1 Hz state samples + phase-boundary samples | Byte-exact replay required. |
| `interactive-standard` | Full committed event log | Event anchors + 0.33 Hz state samples + phase-boundary samples | Byte-exact replay required; less heatmap precision. |
| `background-detailed` | Summary + selected key events/stats | No renderable spatial track by default | Must match aggregate envelopes and key-event counts. |
| `background-fast` | Outcome/stat summary only | None | Must match aggregate distributions against reference scenarios. |

This aligns with [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract|ADR-0026]]:
renderable frames are derived from event/spatial data only where those data exist.

## Calibration harness

Minimum harness:

- **Golden replay:** exact event log, RNG draw indices and summary output for
  `competitive-full` and `interactive-standard` fixtures.
- **PR smoke sweep:** 256 seeds per core scenario, cheap enough for routine docs/code
  review once implementation exists.
- **Nightly/core sweep:** 1,000+ seeds per scenario; metrics compared to envelopes.
- **Release calibration soak:** 10,000+ seeds per scenario pack before changing
  match-model versions.
- **Compatibility sweep:** same scenario pack through `competitive-full` reference
  and `background-fast`; compare W/D/L, goal means, scoreline buckets, cards,
  injuries and top-line economy/standing effects.

Recommended methods:

- chi-square for categorical buckets;
- Kolmogorov-Smirnov or Anderson-Darling for ordered/continuous distributions;
- bootstrap confidence intervals for means, proportions and quantiles;
- hard fail on replay mismatch; hard fail on core metric outside tolerance; review
  on isolated secondary drift; hard fail on repeated same-slice drift.

Owner proposal: future Match implementation owner produces the harness evidence;
Nico owns approval of target envelopes and intentional re-baselines. FMX-52 remains
the larger cross-system calibration home for final magnitudes.

## Recommended decision packet

Approve D1-D6 as **A/A/A/A/A/A** in
[[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]].

## Sources

- Perplexity raw captures:
  [[raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]],
  [[raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]],
  [[raw-perplexity/raw-match-engine-game-precedents-2026-06-13]],
  [[raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]].
- Stronger source checks:
  [[raw-perplexity/raw-match-engine-source-checks-2026-06-13]].

