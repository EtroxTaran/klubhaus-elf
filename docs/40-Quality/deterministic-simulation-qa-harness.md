---
title: Deterministic Simulation QA Harness
status: current
tags: [quality, determinism, replay, soak-test, save-forward, match-engine, fmx-196]
created: 2026-06-15
updated: 2026-06-19
type: quality
binding: true
linear: FMX-196
related:
  - [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# Deterministic Simulation QA Harness

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


This is the non-binding FMX-196 draft runbook for deterministic simulation QA.
It becomes binding only if Nico accepts draft
[[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
or promotes this note directly.

## Harness tiers

| Tier | Cadence | Scope | Fail policy |
|---|---|---|---|
| T0 exact replay | relevant PR | gold fixtures for `competitive-full` and `interactive-standard` | byte hash mismatch fails |
| T1 profile smoke | relevant PR | curated scenario set across all quality profiles | hard invariant failure fails; statistical bands warn unless profile says hard |
| T2 Monte Carlo | nightly | generated seed sweeps for match, background and gameplay slots | drift report, hard invariant failure fails |
| T3 release soak | release / structural changes | 30y/50y career, economy, save and world-health runs | hard invariant failure fails; material envelope breach blocks rebaseline |
| T4 playtest telemetry | playable build | consented perception and fun checks | review input only |

## Replay artifact levels

| Level | Required contents | Retention intent |
|---|---|---|
| L1 compact | artifact version, engine/rules/content versions, WASM hash, quality profile, fixture ID, seeds/RNG stream labels, canonical initial-state hash, input log, final hash, summary vector | PR/release artifact, player report |
| L2 checkpointed | L1 plus checkpoint hashes and sparse canonical snapshots at semantic/keyframe intervals | QA divergence bisection, nightly/release evidence |
| L3 full trace | L2 plus RNG draw counts, branch/decision trace and optional browser/UI trace | targeted debugging only |

Production replay does not store periodic snapshots by default. QA artifacts may
store sparse snapshots if ADR-0120 is accepted.

## Fixture schema sketch

```yaml
simulationFixture:
  id: match.gold.highPressVsLowBlock.001
  tier: T0
  qualityProfile: interactive-standard
  engineVersion: null
  rulesetVersion: null
  contentVersion: null
  fixtureStateRef: null
  seeds:
    matchCore: null
    matchAi: null
    weather: null
    injury: null
  inputs:
    - tick: 0
      command: lineupLocked
  expected:
    initialHash: null
    finalHash: null
    summaryVector: {}
```

## Soak report schema sketch

```yaml
soakReport:
  id: release.50y.001
  baselineVersion: null
  engineVersion: null
  contentVersion: null
  seedSetVersion: null
  careerYears: 50
  hardInvariantFailures: []
  footballEnvelope:
    goalsPerMatch: { value: null, band: null, verdict: pass }
    cardsPerMatch: { value: null, band: null, verdict: pass }
    homeAdvantage: { value: null, band: null, verdict: pass }
  economyEnvelope:
    wageRevenueRatio: { value: null, band: null, verdict: pass }
    insolvencyIncidence: { value: null, band: null, verdict: pass }
  drift:
    materialChanges: []
    requiresNicoRebaseline: false
```

## Save-forward matrix draft

| Artifact | Same build | Patch/minor | Major |
|---|---|---|---|
| Career save | load + migrate | forward migration required inside supported window | converter or explicit unsupported message |
| Match replay | byte replay only with matching engine/rules/content/WASM hash | only if compatibility manifest retains old runtime | unsupported unless old runtime retained |
| QA artifact | internal diagnostic compatibility only | may migrate diagnostics; canonical result remains version-pinned | historical evidence only |
| Re-sim display | allowed when labeled | allowed with warning | non-authoritative only |

## Hard invariants

- No NaN/Infinity/subnormal in replay-bearing state.
- No impossible pitch/ball/player coordinates.
- No negative stamina, duplicate entity IDs or match-clock regression.
- No fixture-calendar dead ends, duplicate standings rows or table total
  mismatches.
- No ledger imbalance or impossible cash/debt state unless an explicit
  insolvency stage owns it.
- No silent save migration data loss.

## Statistical envelopes

Statistical envelopes are versioned baselines, not immutable truth. They should
include source, baseline version, seed set, effect size and rebaseline owner.
FMX should prefer football-realism and economy-health families over isolated
vanity metrics:

- goals, shots, xG, cards/fouls, home advantage and scoreline distribution;
- injuries, player development, fatigue and squad utilization;
- wage/revenue ratio, transfer inflation, debt/runway and insolvency incidence;
- title concentration, promotion/relegation churn and youth funnel health.

## Related

- [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
- [[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
