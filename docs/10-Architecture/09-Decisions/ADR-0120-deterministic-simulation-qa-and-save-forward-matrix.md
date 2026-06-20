---
title: ADR-0120 Deterministic Simulation QA and Save-Forward Matrix
status: accepted
tags: [adr, architecture, determinism, replay, soak-test, save-forward, match-engine, quality, fmx-196, accepted]
context: match
created: 2026-06-15
updated: 2026-06-19
type: adr
binding: true
linear: FMX-196
amends:
  - [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[ADR-0118-test-strategy-and-quality-gates]]
  - [[../../60-Research/determinism-and-replay]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
  - [[../../40-Quality/deterministic-simulation-qa-harness]]
  - [[../../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
  - [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[ADR-0118-test-strategy-and-quality-gates]]
---

# ADR-0120: Deterministic Simulation QA and Save-Forward Matrix

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-196 on 2026-06-15. Binding after Nico approved D1-D7 on 2026-06-19 in
[[../../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]].

## Date

2026-06-15

## Context

ADR-0096 already decides the authoritative match runtime: one Rust-authored
WASM module, executed in Wasmtime server-side and supported browsers
client-side, with replay-bearing logic on integer/fixed-point surfaces. It also
defines profile precedence: `competitive-full` and `interactive-standard` are
byte-exact; `background-detailed` is byte parity where cheap with statistical
envelope as the binding gate; `background-fast` is statistical-only.

ADR-0118 accepts the general quality ladder, including deterministic replay,
save-forward compatibility and soak/calibration. FMX-196 defines the missing
simulation-specific harness contract: what artifacts exist, which seed tiers
run at which cadence, what statistics are meaningful, and how career saves
differ from match replays.

The existing [[../../60-Research/determinism-and-replay]] note says no periodic
match snapshots are persisted. That remains the production default. This draft
ADR proposes a narrower amendment: QA/failure artifacts may store sparse
canonical snapshots for divergence bisection.

## Proposed decision

### D1 - Replay artifact levels

FMX should define one `SimulationReplayEvidence` family with three levels:

| Level | Contents | Use |
|---|---|---|
| L1 compact | versions, WASM hash, quality profile, fixture ID, RNG seeds/stream labels, canonical initial-state hash, input log, final hash, summary vector | Production/player report and PR smoke |
| L2 checkpointed | L1 plus checkpoint hashes and sparse canonical snapshots | QA, nightly, release and divergence bisection |
| L3 full trace | L2 plus RNG draw counts, branch trace and optional browser/UI trace | Targeted debugging only |

Production replay does not persist periodic snapshots by default. QA artifacts
may use sparse snapshots only for harness/failure evidence.

### D2 - Seed fixture tiers

FMX should use five harness tiers:

| Tier | Cadence | Gate |
|---|---|---|
| T0 exact replay | relevant PR | byte hash for gold seeds in byte-exact profiles |
| T1 profile smoke | relevant PR | hard invariants and profile coverage |
| T2 Monte Carlo | nightly | envelope drift and effect-size report |
| T3 release soak | release / structural model change | 30y/50y career plus save/economy/world-health checks |
| T4 playtest telemetry | playable build | human perception review, not sole acceptance |

### D3 - Profile gate policy

ADR-0096 profile precedence stays authoritative:

- `competitive-full` and `interactive-standard`: byte-exact replay gates;
- `background-detailed`: byte parity where cheap, statistical envelope binding;
- `background-fast`: statistical envelope only and never a byte replay source.

FMX-196 adds the artifact rule: byte-exact profiles need L1 in PR and L2 on
failure/nightly; statistical profiles need summary vector and baseline
evidence, not byte replay claims.

### D4 - Soak metrics and statistical policy

Hard invariants fail immediately. Football realism and economy/career health
use versioned envelopes:

- match realism: goals, shots, xG if modeled, cards/fouls, home advantage and
  scoreline distribution;
- player/team realism: injuries, development curves, fatigue and squad
  utilization;
- economy/career health: wage/revenue ratio, transfer/wage inflation,
  debt/runway, insolvency incidence, competitive balance and youth funnel.

Statistical gates must report baseline version, seed-set version, effect size
and practical materiality. Huge seed sweeps must not block solely on a tiny
p-value when the gameplay effect is immaterial.

### D5 - Save-forward compatibility boundary

Career saves and match replays receive different guarantees:

| Artifact | Guarantee |
|---|---|
| Career save | Forward migration inside a supported compatibility window; explicit unsupported/converter path outside it. |
| Match replay | Byte replay only when engine/rules/content/WASM hash matches or a compatibility manifest retains the old runtime. |
| QA artifact | Diagnostic compatibility only; historical evidence if old runtime is unavailable. |
| Re-simulated display | Allowed only when clearly labeled non-authoritative under a newer engine. |

FMX must never silently present a re-simulated newer-engine result as the
original canonical result.

### D6 - Runtime parity matrix

Byte-profile parity is tested across:

- the same WASM module in Wasmtime;
- supported browser engines;
- deterministic host-import configuration.

Native Rust builds may exist for diagnostics/performance comparison only. They
are not part of the authoritative parity matrix unless a future ADR reopens
ADR-0096.

### D7 - Retention and rebaseline

Keep:

- gold seed manifests under version control;
- failed-property seed/path/counterexample artifacts;
- L1 compact replay evidence for PR/release seeds;
- L2/L3 artifacts for failures, nightly sampled divergence and release
  evidence;
- baseline and rebaseline decision records.

Rebaseline requires a before/after report and Nico approval until ownership is
delegated. Deleting a failing gold seed is not an accepted fix.

## Options considered

### D1 - replay artifact levels

| Option | Meaning | Assessment |
|---|---|---|
| A. Tiered L1/L2/L3 artifact family | Compact default, checkpointed QA, full trace only on targeted failures. | **Recommended.** Aligns Factorio-style desync evidence and Playwright failure-only traces with storage discipline. |
| B. Minimal only | Seeds/input/final hash only. | Too weak for divergence diagnosis. |
| C. Full trace always | Everything stores snapshots and branch traces. | Too large and noisy for routine use. |

### D2 - fixture tiers

| Option | Meaning | Assessment |
|---|---|---|
| A. T0-T4 tier ladder | PR exact/profile smoke, nightly Monte Carlo, release soak, playtest telemetry. | **Recommended.** Mirrors ADR-0118 cadence and simulation risk. |
| B. PR + nightly only | Simpler two-tier plan. | Misses explicit release soak/rebaseline contract. |
| C. Release-only deep testing | Cheap PR path. | Catches deterministic bugs too late. |

### D3 - profile gate policy

| Option | Meaning | Assessment |
|---|---|---|
| A. ADR-0096-aligned split | Byte-exact only where profile requires it; statistical where profile permits. | **Recommended.** Does not reopen accepted profile precedence. |
| B. Byte-exact all profiles | Strongest reproducibility. | Defeats `background-fast` cost purpose. |
| C. Statistical all profiles | Cheap. | Breaks anti-cheat/watch-party replay goals. |

### D4 - soak metrics

| Option | Meaning | Assessment |
|---|---|---|
| A. Hard invariants + realism/economy envelopes | Immediate failure for impossible state, statistical drift for realism/economy. | **Recommended.** Best balance of correctness and tuning flexibility. |
| B. Hard invariants only | Simple and deterministic. | Misses long-horizon bad-but-valid worlds. |
| C. Broad statistical blockers | Fail many statistical deviations. | High false-blocking risk before baselines mature. |

### D5 - compatibility boundary

| Option | Meaning | Assessment |
|---|---|---|
| A. Career-save forward window, replay version-pinned | Saves migrate forward; byte replays require matching retained runtime. | **Recommended.** Matches management-sim user trust and engineering burden. |
| B. Strong compatibility for saves and replays | Retain every old runtime/replay path. | Expensive binary, test and support burden. |
| C. Best effort for both | Lowest cost. | Poor trust for serious long careers. |

### D6 - runtime parity matrix

| Option | Meaning | Assessment |
|---|---|---|
| A. Same-WASM Wasmtime + browser parity | Test the accepted runtime shape only. | **Recommended.** Aligns ADR-0096. |
| B. Wasmtime only | Fast server proof. | Misses verify-locally/browser replay risk. |
| C. Native Rust vs WASM parity | Broad comparison. | Reopens ADR-0096 unless diagnostic-only. |

### D7 - retention and rebaseline

| Option | Meaning | Assessment |
|---|---|---|
| A. Versioned manifests + artifacts + approval-gated rebaseline | Preserve evidence and require explicit model-change rationale. | **Recommended.** Prevents silent seed deletion and baseline drift. |
| B. CI summaries only | Minimal storage. | Too little forensic evidence. |
| C. Store all artifacts indefinitely | Maximum history. | Storage/noise burden without clear benefit. |

## Consequences if accepted

Positive:

- Gives deterministic simulation QA a concrete artifact and cadence contract.
- Keeps production replays compact while making failures debuggable.
- Separates career-save migration promises from match replay promises.
- Preserves ADR-0096 profile rules instead of re-litigating them.
- Makes rebaseline and seed deletion explicit governance events.

Costs:

- Requires future code-phase tooling to produce manifests, hashes and reports.
- QA sparse snapshots introduce schema/version handling for diagnostic
  artifacts.
- Long soaks need scheduled runner capacity and baseline review ownership.

## Related

- [[../../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
- [[../../40-Quality/deterministic-simulation-qa-harness]]
- [[../../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
- [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
- [[ADR-0118-test-strategy-and-quality-gates]]
