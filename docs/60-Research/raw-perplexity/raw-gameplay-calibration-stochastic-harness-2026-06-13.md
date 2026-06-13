---
title: "Raw - gameplay calibration stochastic harness (FMX-141)"
status: raw
tags: [research, raw, perplexity, gameplay, calibration, determinism, monte-carlo, harness, fmx-141]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-141
related:
  - [[../gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../../60-Research/determinism-and-replay]]
---

# Raw - gameplay calibration stochastic harness (FMX-141)

## Research prompt

Perplexity was asked for stochastic simulation testing and calibration harness
best practices: deterministic seeds, Monte Carlo seed sweeps, golden baselines,
tolerance/envelope tests, KS/chi-square/KL-style distribution checks,
property/metamorphic tests, rebaseline policy and change review.

## Extracted findings

- Treat the simulator as **deterministic under a fixed seed** and **probabilistic
  over a seed population**.
- Keep two baseline classes:
  - exact golden replay/log fixtures for debugging and deterministic regression;
  - statistical baselines/envelopes for acceptance over seed sweeps.
- Multi-seed acceptance should report both statistical significance and
  practical effect size. Very large sweeps can make tiny irrelevant differences
  "significant".
- Goodness-of-fit checks are useful by output shape:
  - chi-square for categorical or binned outputs;
  - Kolmogorov-Smirnov / Anderson-Darling for ordered/continuous distributions;
  - KL/divergence-style measures for comparing probability mass functions, with
    care around zero buckets.
- Metamorphic tests matter where no single oracle exists:
  - cloned equal teams should be close to symmetric over many seeds;
  - increasing a relevant rating should not reduce the expected outcome it
    directly improves;
  - conservation identities must hold exactly.
- Rebaseline is a governance decision, not a developer convenience:
  - refactors should pass without rebaseline;
  - intentional tuning needs before/after evidence and approval;
  - structural model changes need extended sweeps and a new baseline version.

## Recommended harness structure extracted

| Layer | Purpose | FMX interpretation |
|---|---|---|
| Deterministic replay | Reproduce exact event/state output | T0 exact replay / invariant fixtures |
| Scenario smoke | Fast PR check across curated seeds | T1 slot smoke |
| Monte Carlo envelope | Compare output distributions | T2 calibration sweep |
| Long-horizon campaign | Detect dynasty/world drift | T3 30y/50y/100y soak |
| Playtest telemetry | Validate human feel once build exists | T4 post-build human validation |

## Source trail

- Perplexity research pass, 2026-06-13: stochastic simulation testing and
  calibration harness design.
- "A stochastic model for NFL games and point spread assessment" (sports
  simulation probability/distribution evaluation):
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10929675/>
- Kamran Aslam, "Monte Carlo Simulation and Modeling" (model validation and
  simulation output analysis):
  <https://bpb-us-w1.wpmucdn.com/sites.usc.edu/dist/5/476/files/2022/05/AslamPhD-2012.pdf>
- Metamorphic testing overview for oracle-problem systems:
  <https://en.wikipedia.org/wiki/Metamorphic_testing>
- Goodness-of-fit / KS / chi-square overview:
  <https://en.wikipedia.org/wiki/Goodness_of_fit>

## Notes for synthesis

The research supports GD-0043's core rule: deterministic replay is mandatory for
debugging, but acceptance should be multi-seed and envelope-based.

