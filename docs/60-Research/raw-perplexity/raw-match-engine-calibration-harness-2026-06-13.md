---
title: "Raw - match-engine calibration harness (FMX-133)"
status: raw
tags: [research, raw, perplexity, match-engine, calibration, monte-carlo, soak-test, goodness-of-fit, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[../match-engine-core-model-2026-06-13]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# Raw - match-engine calibration harness (FMX-133)

## Research prompt

Perplexity was asked for best practices in calibrating and testing a deterministic
probabilistic sports match simulator, including golden replay tests, Monte Carlo
seed sweeps, statistical envelopes, goodness-of-fit tests, slice/scenario tests,
tolerances, ownership and high-fidelity versus background-fast compatibility.

## Source-quality note

The answer was useful as testing design input, but several citations were weak.
Statistical-test sources are cross-checked in
[[raw-match-engine-source-checks-2026-06-13]].

## Extracted findings

- Treat the simulator as two things at once:
  - deterministic under a fixed seed;
  - probabilistic over many seeds.
- Therefore the harness needs two baseline types:
  - **golden replay baselines** for exact event/state output under fixed inputs;
  - **statistical baselines** for aggregate distributions over seed sweeps.
- Useful harness layers:
  - replay determinism;
  - Monte Carlo seed sweeps;
  - statistical envelopes;
  - goodness-of-fit tests;
  - targeted scenario/slice tests;
  - high-fidelity versus background-fast compatibility;
  - performance soak.
- Suggested statistical methods:
  - chi-square for categorical/histogram buckets such as W/D/L, scorelines,
    card-count buckets and injury-count buckets;
  - Kolmogorov-Smirnov for continuous/ordered distributions;
  - Anderson-Darling when tail drift matters;
  - bootstrap confidence intervals for seed-sweep means, quantiles and ratios.
- Test scenarios should include at least:
  - equal teams;
  - strong favourite versus underdog;
  - high press versus low block;
  - direct play versus possession;
  - tired squad / congested fixture;
  - strict referee / card-prone match;
  - set-piece-strong team;
  - weather/pitch stress once those systems feed the engine.

## Harness implication

The FMX match calibration harness should mirror the economy soak-test pattern:
named scenarios, versioned parameter packs, explicit owners, envelope tolerances,
baselines and a review workflow for intentional re-baselines.

## Source trail

- Perplexity research pass, 2026-06-13: deterministic probabilistic simulator
  calibration harness design.
- Stronger source checks: [[raw-match-engine-source-checks-2026-06-13]].

## Related

- [[../match-engine-core-model-2026-06-13]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]

