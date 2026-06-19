---
title: Gameplay Calibration and Soak-Test Runbook - Draft
status: current
tags: [implementation, gameplay, calibration, soak-test, determinism, monte-carlo, gddr, fmx-141]
created: 2026-06-13
updated: 2026-06-19
type: implementation
binding: true
linear: FMX-141
related:
  - [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[economy-calibration-and-soak-test-runbook]]
---

# Gameplay Calibration and Soak-Test Runbook - Draft

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


Executable-intent companion to
[[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]] and
[[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]].
It defines the reusable method for non-economy gameplay calibration. It does
not set final numeric constants and is binding after Nico approved GD-0043.

## 1. Scope split

| Runbook | Owns |
|---|---|
| [[economy-calibration-and-soak-test-runbook]] | club economy, commercial, ledger, debt/runway, wage/revenue, country economy profiles |
| this runbook | match, live control, set pieces, tactical identity, weather/pitch, persona labels, dialogue trust, media, transfer pressure, dynasty, legacy, national-team calibration |

Economy-affecting side effects from gameplay slots are checked through both
runbooks. The slot owner calibrates the gameplay effect; the economy runbook
checks downstream economy invariants.

## 2. Determinism contract

- Every simulation-affecting slot declares its RNG stream/sub-label or states
  that it is RNG-free.
- Fixed seed + fixed parameter pack + fixed fixture must reproduce the same
  authoritative output.
- Determinism tests use exact equality for authoritative state, event order,
  RNG draw provenance and summary vectors.
- Presentation prose, UI timing and LLM text never become calibration truth.

## 3. Harness tiers

| Tier | Command intent | Cadence | Gate |
|---|---|---|---|
| T0 exact replay | replay one seeded fixture and compare event/log/state output | every relevant PR once implementation exists | hard fail |
| T1 slot smoke | run curated scenario seeds for one slot | every relevant PR | hard invariants + sanity bands |
| T2 Monte Carlo envelope | sweep hundreds/thousands of seeds for distribution acceptance | nightly / major tuning | envelope + effect-size gate |
| T3 long-horizon soak | 30y/50y/100y AI/player-world campaign drift check | release candidate / structural change | trend bands + anti-degeneracy gate |
| T4 playtest telemetry | consented human-perception validation | after playable build | review input, never sole acceptance |

## 4. Slot sheet

```yaml
calibrationSlot:
  id: match.liveControl
  owner: Match / Tactics design
  gddr: GD-0025
  parameterPackVersion: liveControlModelVersion
  primaryMetrics:
    - xgSwingAfterIntervention
    - fatigueDelta
    - shoutCooldownSeconds
    - effectDecayWindow
  harnessTier: T0-T2
  tolerancePolicy: envelope + hard invariants
  baselineAuthority: Nico until delegated
  evidencePath:
    - docs/60-Research/...
    - run-report/<future-artifact>
```

## 5. Parameter sheet

```yaml
parameter:
  id: <slot.parameter.key>
  slot: <calibrationSlot.id>
  definition: <what it controls>
  value: null
  band: [low, high]
  unit: <basis-points|seconds|matches|rating-points|probability-bp>
  source: <research|playtest|telemetry|expert-review>
  lastChanged: YYYY-MM-DD
  rationale: <why this value or band>
  sensitivity: verdict-stable | parameter-sensitive
  baselineVersion: <baseline-key>
```

## 6. Scenario sheet

```yaml
scenario:
  id: <slot.scenario.key>
  slot: <calibrationSlot.id>
  narrative: <one-line fixture/story>
  fixture: { fixtureListId: "<fixture>", seed: "<seed>" }
  parameterPackVersion: <version>
  severity: baseline | adverse | edge | exploit-search
  expect:
    invariants: [<hard-invariant>, ...]
    metricBands: { <metric>: inBand }
    verdict: pass | fail
  type: replay | smoke | monte-carlo | long-horizon | telemetry
```

## 7. Statistical checks

- Use exact equality only for deterministic fixtures.
- Use envelopes and effect sizes for stochastic acceptance.
- Use chi-square-style checks for categorical/binned outputs.
- Use KS/Anderson-Darling-style checks for ordered or continuous distributions.
- Use bootstrap confidence intervals for seed-sweep means, quantiles and ratios.
- Report practical effect size; do not fail solely on a tiny p-value in a huge
  seed sweep unless the effect is gameplay-material.

## 8. Baseline and rebaseline policy

| Change type | Expected outcome | Rebaseline rule |
|---|---|---|
| Refactor / performance | no gameplay drift | no rebaseline; failure is a bug until proven otherwise |
| Parameter tuning | targeted metric moves as expected | before/after report + slot owner rationale + approval |
| Structural model change | broader distribution shift | extended T2/T3 run + decision record + new baseline version |
| Realism-vs-fun override | documented deviation from source data | Nico approval required |

## 9. Initial slot register

| Slot | GDDR | Tier | Version key |
|---|---|---|---|
| `match.core` | GD-0042 | T0-T2 | `matchCoreModelVersion` |
| `match.liveControl` | GD-0025 | T0-T2 | `liveControlModelVersion` |
| `match.liveIntervention` | GD-0035 | T0-T2 | `interventionPolicyVersion` |
| `setPieces.readiness` | GD-0026 | T0-T2 | `readinessModelVersion` |
| `tactics.identity` | ADR-0074 / ADR-0082 | T1-T2 | `algorithmVersion` / `signalModelVersion` |
| `environment.weatherPitch` | GD-0029 | T1-T2 | `weatherModelVersion` |
| `people.personaLabels` | GD-0027 | T1-T2 | `personaLabelModelVersion` |
| `dialogue.trustMorale` | GD-0028 | T0-T2 | `dialogueEffectModelVersion` |
| `media.ecology` | GD-0034 | T1-T3 | `mediaEcologyModelVersion` |
| `transfer.escalation` | GD-0036 | T0-T2 | `escalationModelVersion` |
| `world.drift` | GD-0024 | T2-T3 | `worldDriftModelVersion` |
| `dynasty.ownershipBoard` | GD-0030 | T2-T3 | `dynastyModelVersion` |
| `legacy.hof` | GD-0032 | T2-T3 | `legacyScoreFormulaVersion` |
| `legacy.nationalTeam` | GD-0033 | T2-T3 | `nationalTeamModelVersion` |

## 10. Acceptance flow

1. Fill slot, parameter and scenario sheets.
2. Run T0 exact replay where the slot affects deterministic state.
3. Run T1 smoke for curated scenario coverage.
4. Run T2/T3 as required by the slot register.
5. Produce a drift report: changed metrics, effect sizes, failed envelopes and
   affected GDDRs.
6. Rebaseline only after explicit approval.
7. Nico sign-off promotes the affected draft/slot decision. No constant is
   "final" before that gate.

## Related

- [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
- [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]]
- [[economy-calibration-and-soak-test-runbook]]
