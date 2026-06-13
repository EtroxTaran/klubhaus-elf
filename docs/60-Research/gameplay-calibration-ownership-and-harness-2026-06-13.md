---
title: "Gameplay calibration ownership and harness (FMX-141)"
status: current
tags: [research, synthesis, gameplay, calibration, determinism, monte-carlo, gddr, fmx-141]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-141
related:
  - [[raw-perplexity/raw-gameplay-calibration-sim-precedents-2026-06-13]]
  - [[raw-perplexity/raw-gameplay-calibration-stochastic-harness-2026-06-13]]
  - [[raw-perplexity/raw-gameplay-calibration-domain-slots-2026-06-13]]
  - [[raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]]
---

# Gameplay calibration ownership and harness (FMX-141)

## Scope

FMX-141 closes the docs-level ambiguity created by multiple accepted GDDRs
pointing generic non-economy magnitudes to "FMX-52 calibration". FMX-52 remains
the economy calibration and soak-test home; it should not be the implicit owner
for match controls, weather/pitch, dialogue trust, media ecology, transfer
pressure, tactical identity, dynasty drift, legacy scoring or national-team
gates.

This synthesis proposes a gameplay-wide calibration umbrella:
[[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]
plus [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]. It is
non-binding until Nico approves the decision packet in
[[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].

## Evidence synthesis

| Evidence | What it supports | Strength |
|---|---|---|
| OOTP league totals/modifiers | Sports sims need explicit target/modifier surfaces and historical adjustment. | Direct game precedent |
| Paradox observation/history logging and QA balance diaries | Long-run complex simulations need hands-off observation and balance review. | Strong analogue |
| Football analytics xG / score models | Match outputs should be validated against real distribution families, not intuition. | Direct real-world analogue |
| Stochastic simulation testing | Seeded replay plus Monte Carlo envelopes is the right acceptance split. | Strong technical precedent |
| FMX governance | Architecture/gameplay/tuning authority must remain with Nico until approved. | Project-binding |

The exact FMX slot taxonomy is **not** externally sourced. It is a product
governance proposal shaped by existing FMX GDDRs and must stay draft until Nico
approves it.

## Recommended decision

Adopt gameplay calibration as a first-class GDDR concern:

1. Each gameplay GDDR that defers magnitudes declares a **Calibration Slot**.
2. Each slot has an owner role, metric set, harness tier, tolerance policy,
   baseline/rebaseline authority and evidence path.
3. Deterministic replay is mandatory for debugging, but acceptance relies on
   multi-seed envelopes.
4. Economy calibration stays under the economy runbook; non-economy gameplay
   calibration points to the gameplay runbook.
5. Nico explicitly approves the canonical taxonomy, harness tiers, metric
   authority and realism-vs-fun tolerance philosophy.

## Proposed calibration slots

| Slot | Source records | Primary metrics | Harness tier |
|---|---|---|---|
| `match.core` | [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] | goals, shots, xG, cards, injuries, W/D/L, possession, PPDA | T0-T2 |
| `match.liveControl` | [[../50-Game-Design/GD-0025-in-match-controls]] | effect latency, xG swing, fatigue, shout decay/cooldown | T0-T2 |
| `match.liveIntervention` | [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]] | buffer caps, rejection reasons, pause budget/duration, intervention fairness | T0-T2 |
| `setPieces.readiness` | [[../50-Game-Design/GD-0026-set-piece-coach-readiness]] | readiness curve, decay/hysteresis, conversion uplift, injury/load side-effects | T0-T2 |
| `tactics.identity` | [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]; [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] | tactical fingerprint baselines, EWMA/confidence constants, coarse-style signal thresholds, confidence bands | T1-T2 |
| `environment.weatherPitch` | [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]] | pass error, control error, injury/load, postponement and forecast error bands | T1-T2 |
| `people.personaLabels` | [[../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]] | label thresholds, reveal bands, visible-label cap, mentoring/personality modifiers | T1-T2 |
| `dialogue.trustMorale` | [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]] | trust/morale delta bands, decay, stack caps, promise-debt outcomes | T0-T2 |
| `media.ecology` | [[../50-Game-Design/GD-0034-media-outlet-ecology-model]] | news gravity, stance drift, outlet cadence, fan/board/morale effect intents | T1-T3 |
| `transfer.escalation` | [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]] | pressure increments, decay, hysteresis, stage dwell, seeded edge variance | T0-T2 |
| `world.drift` | [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]] | rising-rival/collapse/era-shift event density, caps, reputation deltas, title concentration | T2-T3 |
| `dynasty.ownershipBoard` | [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]] | board confidence, takeover density, administration rate, title churn, anti-flatline KPIs | T2-T3 |
| `legacy.hof` | [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]] | award weights, era-normalized score, scarcity/quota caps, cross-save ranking stability | T2-T3 |
| `legacy.nationalTeam` | [[../50-Game-Design/GD-0033-national-team-dual-role]] | reputation gates, offer cadence, clash frequency, dual-role workload | T2-T3 |

## Harness tiers

| Tier | Purpose | Acceptance shape |
|---|---|---|
| T0 deterministic replay | Reproduce exact event/log/state for a fixed seed | exact equality and hard invariants |
| T1 scenario smoke | Fast curated slot scenario matrix | invariants + broad metric sanity |
| T2 Monte Carlo envelope | Multi-seed distribution acceptance | envelopes, effect sizes, goodness-of-fit checks |
| T3 long-horizon campaign soak | 30y/50y/100y drift and anti-flatline evidence | trend bands, event density, diversity, no runaway degeneracy |
| T4 playtest telemetry | Human validation after a build exists | consented telemetry + qualitative review; never replaces T0-T3 |

## Open decisions

The proposed queue is:

- D1: confirm gameplay-wide calibration ownership vs economy-only ownership.
- D2: approve or merge the proposed slot taxonomy.
- D3: approve the harness-tier model.
- D4: approve baseline/rebaseline authority.
- D5: approve the realism-vs-fun tolerance philosophy.

Recommendation: **A/A/A/A/A** in
[[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].

## Sources

- Raw captures:
  [[raw-perplexity/raw-gameplay-calibration-sim-precedents-2026-06-13]],
  [[raw-perplexity/raw-gameplay-calibration-stochastic-harness-2026-06-13]],
  [[raw-perplexity/raw-gameplay-calibration-domain-slots-2026-06-13]],
  [[raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]].
- Direct source-check URLs are preserved in
  [[raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]].
