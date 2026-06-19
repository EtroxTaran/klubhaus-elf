---
title: GD-0043 Gameplay calibration ownership and acceptance gate
status: accepted
tags: [game-design, gddr, gameplay, calibration, determinism, monte-carlo, fmx-141, accepted]
created: 2026-06-13
updated: 2026-06-19
type: gddr
binding: true
linear: FMX-141
related:
  - [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-gameplay-calibration-sim-precedents-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-gameplay-calibration-stochastic-harness-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-gameplay-calibration-domain-slots-2026-06-13]]
  - [[../60-Research/raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]]
---

# GD-0043: Gameplay calibration ownership and acceptance gate

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this game-design record is now
> binding according to its approved scope.


## Status

accepted

> **Decision gate.** This GDDR is a non-binding FMX-141 accepted record until Nico
> approves D1-D5 in
> [[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].
> It replaces the generic non-economy "FMX-52 calibration" pointer only if
> ratified.

## Context

Many accepted GDDRs defer effect magnitudes, thresholds and balance constants.
Historically those deferrals often pointed to "FMX-52", because the economy
calibration runbook was the first concrete soak-test method. That created an
ownership bug: economy calibration cannot be the canonical owner for match
interventions, weather/pitch, dialogue trust, persona labels, media ecology,
transfer pressure, tactical identity, dynasty drift, Hall-of-Fame scoring or
national-team unlocks.

## Proposed decision if ratified

FMX uses a **gameplay-wide calibration layer**:

- Economy calibration stays under the economy runbook.
- Non-economy gameplay magnitudes point to this GDDR and the gameplay
  calibration runbook.
- Every GDDR with deferred magnitudes declares at least one **Calibration Slot**.
- A slot defines owner role, source-of-truth metrics, harness tier, tolerance
  policy, baseline/rebaseline authority and evidence required before acceptance.
- All core simulation-affecting slots require deterministic replay for debugging
  and multi-seed statistical acceptance for tuning.

## Calibration slot contract

```yaml
calibrationSlot:
  id: <stable.dot.path>
  owner: <role/context>
  sourceRecord: <GD-####|ADR-####>
  parameterPackVersion: <version-key>
  primaryMetrics: [<metric>, ...]
  harnessTier: T0|T1|T2|T3|T4
  tolerancePolicy: <envelope|effect-size|hard-invariant>
  baselineAuthority: <who can approve/rebaseline>
  evidencePath: <raw research + synthesis + run report>
```

No slot may silently rebaseline itself. Refactors should pass without baseline
changes. Intentional tuning needs before/after evidence and explicit approval.

## Proposed slot taxonomy

| Slot | Covers | Source record |
|---|---|---|
| `match.core` | match-model outcomes, xG, shots, cards, injuries, possession and pressing envelopes | [[GD-0042-match-engine-core-model-and-calibration]] |
| `match.liveControl` | in-match shouts, control effect windows, cooldowns and decay | [[GD-0025-in-match-controls]] |
| `match.liveIntervention` | intervention buffer policy, typed rejection and deliberate pause policy | [[GD-0035-live-coaching-intervention-and-pause-rules]] |
| `setPieces.readiness` | set-piece readiness curve, decay, hysteresis and conversion uplift | [[GD-0026-set-piece-coach-readiness]] |
| `tactics.identity` | tactical fingerprint baselines, EWMA/confidence constants and manager-style signal bands | [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]; [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] |
| `environment.weatherPitch` | weather/pitch effect magnitudes, forecast error and postponement thresholds | [[GD-0029-weather-and-pitch-design-model]] |
| `people.personaLabels` | hidden-substrate thresholds, reveal bands and visible-label caps | [[GD-0027-hidden-attribute-substrate-mapping]] |
| `dialogue.trustMorale` | dialogue intent effect bands, trust/morale movement, decay and stack caps | [[GD-0028-dialogue-intent-taxonomy-effect-matrix]] |
| `media.ecology` | outlet drift, news gravity, cadence and advisory effect-intent magnitudes | [[GD-0034-media-outlet-ecology-model]] |
| `transfer.escalation` | transfer-pressure increments, stage thresholds, decay and edge variance | [[GD-0036-transfer-escalation-and-inactivity-pressure]] |
| `world.drift` | Rising Rival, Giant Collapse and Continental Era Shift thresholds, caps, event density and effect bands | [[GD-0024-ai-world-drift-algorithm]] |
| `dynasty.ownershipBoard` | board confidence, ownership transition, insolvency rates and anti-flatline KPIs | [[GD-0030-dynasty-board-and-ownership]] |
| `legacy.hof` | awards, records, Hall-of-Fame and legacy scoring weights | [[GD-0032-awards-honours-records-and-hall-of-fame]] |
| `legacy.nationalTeam` | national-team unlock gates, offer cadence and dual-role workload bands | [[GD-0033-national-team-dual-role]] |

## Harness tiers

| Tier | Meaning | Typical slots |
|---|---|---|
| T0 deterministic replay | Exact seeded event/log/state replay and invariants | match, dialogue, transfer, intervention |
| T1 scenario smoke | Fast curated scenario checks | every slot |
| T2 Monte Carlo envelope | Multi-seed distribution acceptance with effect-size review | match, set pieces, weather, dialogue, media, transfer |
| T3 long-horizon campaign soak | 30y/50y/100y drift, density and anti-flatline checks | dynasty, media, legacy, national team |
| T4 playtest telemetry | Consented human validation once a build exists | player-facing feel, perceived fairness |

## Acceptance rule

- **Debugging:** a fixed seed must reproduce the same authoritative output.
- **Acceptance:** a single seed is never enough. Calibration changes pass only
  by staying inside agreed multi-seed envelopes and hard invariants.
- **Rebaseline:** intentional baseline changes require source/evidence, affected
  slot list, before/after reports and Nico approval or an explicitly delegated
  calibration authority.
- **Realism vs fun:** external data anchors the target, but player-facing
  feel can override strict realism only when the deviation is documented in the
  slot rationale and accepted by Nico.

## Open Nico decisions

Approve or change D1-D5 in
[[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].
Approved packet: **A/A/A/A/A**.
