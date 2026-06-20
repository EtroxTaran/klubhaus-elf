---
title: Deterministic Simulation QA Harness
status: current
tags: [research, synthesis, determinism, replay, soak-test, save-forward, match-engine, quality, fmx-196]
context: match
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-196
related:
  - [[raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
  - [[raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
  - [[../40-Quality/deterministic-simulation-qa-harness]]
  - [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[determinism-and-replay]]
---

# Deterministic Simulation QA Harness

## Scope

FMX-196 prepares the decision packet for deterministic simulation QA:
replay artifacts, seed fixture tiers, statistical soak metrics and
save-forward compatibility. It does not ratify new architecture by itself.

Binding sources that remain intact until Nico decides:

- accepted
  [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  for single Rust/WASM authoritative runtime, integer/fixed-point replay
  surface and quality-profile determinism precedence;
- accepted
  [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  plus [[../40-Quality/test-strategy]] for the general quality ladder;
- current binding [[determinism-and-replay]] for existing replay/RNG rules,
  noting that its "no periodic snapshots" rule would need explicit amendment
  if QA sparse snapshots are approved.

## Evidence synthesis

### Deterministic game precedent

Gaffer on Games and Factorio both support the same core harness shape:
simulation inputs and initial state are the reproducible truth, while hashes
and state dumps diagnose divergence. Factorio's public desync documentation is
especially useful because it separates normal play from failure reports: a
desync report is large and includes state copies plus logs.

FMX implication:

- normal match replay artifacts stay compact;
- mismatch/failure artifacts can be much heavier;
- a replay hash failure should produce a debuggable artifact, not only a red CI
  line.

### WASM and numeric surface

ADR-0096 already removes the native-vs-WASM runtime fork by choosing one
Rust-authored WASM module for Wasmtime and browser execution, with replay
logic on an integer/fixed-point surface. WebAssembly numeric rules still make
NaN payloads and relaxed numeric behavior a determinism hazard.

FMX implication:

- byte-profile parity tests should compare the same WASM module in Wasmtime
  and supported browsers;
- native Rust builds are diagnostic only unless a future ADR reopens the
  runtime decision;
- NaN/Infinity/subnormal leakage is a hard engine failure.

### Tooling precedent

fast-check supports replaying generated failures with `seed` and `path`.
Playwright traces are useful CI failure diagnostics but heavy when always on.

FMX implication:

- generated seed failures become stable fixtures;
- browser traces stay failure-only or targeted;
- deterministic match replays should not depend on browser UI trace archives.

### Football and management-sim precedent

StatsBomb Open Data offers public event/lineup football data for calibration
research. Football Manager's official FM26 FAQ documents save import/forward
compatibility behavior with explicit restrictions and no backwards
compatibility for FM26 progress. It does not disclose SI's internal QA harness.

FMX implication:

- realism envelopes should be calibrated against versioned football data and
  FMX baselines, not one permanent magic number;
- career save compatibility and match replay compatibility need separate
  promises;
- claims about Football Manager internal determinism remain uncited and should
  not be canonized.

## Recommended FMX packet

### Replay evidence envelope

Use one `SimulationReplayEvidence` family with three retention levels:

| Level | Contents | Intended use |
|---|---|---|
| L1 compact | engine/rules/content versions, WASM hash, quality profile, fixture ID, seeds/RNG streams, canonical initial state hash, command/input log, final hash, summary vector | Production/player report and PR smoke. |
| L2 checkpointed | L1 plus periodic or semantic checkpoint hashes and sparse canonical snapshots | QA, nightly, release and divergence bisection. |
| L3 full trace | L2 plus decision trace, RNG draw counts, branch trace and optional Playwright/browser trace when UI is involved | Targeted investigation only. |

This is intentionally narrower than "store snapshots for every replay". If
approved, FMX should amend the old [[determinism-and-replay]] "no periodic
snapshots" rule to: no production periodic snapshots by default; QA sparse
snapshots are allowed for harness and failure artifacts.

### Seed fixture tiers

| Tier | Cadence | Purpose | Gate |
|---|---|---|---|
| T0 exact replay | relevant PR | byte-exact replay for a small gold set in `competitive-full` and `interactive-standard` | hard fail |
| T1 profile smoke | relevant PR | at least one curated fixture per quality profile and scenario family | hard invariants + hash/profile rule |
| T2 Monte Carlo | nightly | hundreds/thousands of generated seeds for match/core metrics and background profiles | envelope drift + effect-size review |
| T3 release soak | release candidate / structural model change | multi-season and 30y/50y career runs across save/economy/gameplay surfaces | hard invariants + calibrated realism/economy gates |
| T4 playtest telemetry | playable build | consented human perception and fun/realism checks | review input, not sole acceptance |

Gold seed failures are never "fixed" by deleting the seed. They either expose a
bug, document an intentional model change or are rebaselined through Nico's
accepted rebaseline gate.

### Metrics model

Hard failures:

- NaN/Infinity/subnormal in replay-bearing state;
- impossible pitch/ball/player coordinates;
- negative stamina, match clock regression or duplicate entity IDs;
- invalid league calendar, missing fixture resolution or table total mismatch;
- ledger imbalance, impossible cash/debt state without an explicit insolvency
  stage or broken save migration;
- byte-profile replay hash mismatch;
- save migration data loss or backwards-compatibility false claim.

Football realism envelopes:

- goals, shots, shots on target, xG if modeled, cards, fouls, home advantage
  and scoreline distribution;
- injury frequency/severity, player development by age band, squad utilization
  and fatigue;
- league/tournament distribution, promotion/relegation churn and competitive
  balance.

Economy/career health:

- wage/revenue ratio, debt/runway, wage and transfer inflation, insolvency
  incidence, sponsorship/ticketing sanity, youth intake funnel and title
  concentration.

Statistical policy:

- hard invariants fail immediately;
- realism/economy envelopes report practical effect size, baseline version and
  confidence range;
- large seed sweeps must not fail solely on tiny p-values when the effect is
  not gameplay-material;
- intentionally changed distributions require before/after reports and
  approval.

### Save-forward compatibility matrix

| Artifact | Same build | Patch/minor update | Major engine/rules change |
|---|---|---|---|
| Career save | Load and migrate, no data loss | Forward migration required within supported window | Explicitly supported converter or clear unsupported message |
| Compact match replay | Byte replay if engine/rules/content/WASM hash match | May replay only if compatibility manifest names the old version as retained | Unsupported unless old engine module is retained |
| QA checkpointed artifact | Same as compact plus checkpoint/snapshot schema compatibility | Internal harness may migrate diagnostics, but canonical result still version-pinned | Historical evidence only unless old harness runtime retained |
| Re-simulated display | Allowed only when clearly labeled as re-simulated under newer engine | Allowed with warning; original result remains the old canonical result | Allowed only as non-authoritative curiosity |

## Decision queue summary

The decision queue
[[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
asks Nico to decide:

- D1 replay artifact levels;
- D2 seed fixture tiers;
- D3 byte-exact versus statistical gates per quality profile;
- D4 soak metrics and statistical policy;
- D5 save-forward compatibility boundary;
- D6 runtime parity matrix;
- D7 retention and rebaseline policy.

Recommended packet: D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A.

## Related

- [[raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
- [[raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
- [[../40-Quality/deterministic-simulation-qa-harness]]
- [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
- [[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
