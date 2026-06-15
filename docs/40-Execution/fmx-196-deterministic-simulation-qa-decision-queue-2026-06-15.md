---
title: FMX-196 Deterministic simulation QA decision queue
status: current
tags: [execution, decision-queue, determinism, replay, soak-test, save-forward, match-engine, quality, fmx-196]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-196
related:
  - [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
  - [[../40-Quality/deterministic-simulation-qa-harness]]
  - [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
---

# FMX-196 Deterministic simulation QA decision queue

This is the HITL decision packet for FMX-196. No option below is accepted until
Nico decides.

## D1 - replay artifact levels

| Option | Meaning | Assessment |
|---|---|---|
| **A. Tiered L1/L2/L3 evidence** | L1 compact replay; L2 checkpointed QA artifact; L3 full trace only for targeted failures. | **Recommended.** Keeps normal artifacts small while making failures debuggable. |
| B. Minimal only | Seed, inputs and final hash only. | Too weak for divergence bisection. |
| C. Full trace always | Store snapshots and branch traces everywhere. | Too large/noisy for routine PR/nightly use. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - seed fixture tiers

| Option | Meaning | Assessment |
|---|---|---|
| **A. T0-T4 ladder** | PR exact/profile smoke, nightly Monte Carlo, release soak, playtest telemetry. | **Recommended.** Matches ADR-0118 quality cadence and long-horizon simulation risk. |
| B. PR + nightly only | Simpler two-tier coverage. | Release rebaseline and long-career guarantees stay vague. |
| C. Release-only deep tests | Cheapest PR path. | Deterministic regressions surface too late. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - byte-exact vs statistical gates

| Option | Meaning | Assessment |
|---|---|---|
| **A. ADR-0096-aligned split** | Byte-exact for `competitive-full`/`interactive-standard`; statistical binding for background profiles as accepted. | **Recommended.** Does not reopen the accepted profile rule. |
| B. Byte-exact all profiles | Every quality profile replays byte-identically. | Strong but undermines background-fast's cost purpose. |
| C. Statistical all profiles | Only distribution gates. | Breaks anti-cheat/watch-party replay expectations. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - soak metric policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hard invariants + realism/economy envelopes** | Impossible state fails; football/economy drift uses baselines, effect sizes and materiality. | **Recommended.** Catches broken worlds without making tuning statistically brittle. |
| B. Hard invariants only | Fail only impossible states. | Misses plausible-but-bad long careers. |
| C. Broad statistical blockers | Many distribution deviations block. | High false-blocking risk before baselines mature. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - save-forward compatibility boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. Career-save forward window, replay version-pinned** | Saves migrate forward inside supported windows; match replays require matching retained engine/rules/content/WASM hash. | **Recommended.** Honest and affordable. |
| B. Strong compatibility for saves and replays | Retain every old runtime/replay path. | High maintenance, binary and QA cost. |
| C. Best effort for both | Few promises. | Poor trust for long careers and reports. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D6 - runtime parity matrix

| Option | Meaning | Assessment |
|---|---|---|
| **A. Same-WASM Wasmtime + supported browsers** | Byte-profile parity tests use the accepted ADR-0096 runtime shape. | **Recommended.** Tests real authority and local verification without reopening native runtime authority. |
| B. Wasmtime only | Server proof only. | Misses browser replay/verify-locally risk. |
| C. Native Rust vs WASM as required gate | Compare native and WASM builds. | Reopens ADR-0096 unless limited to diagnostics. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D7 - retention and rebaseline

| Option | Meaning | Assessment |
|---|---|---|
| **A. Versioned manifests + artifacts + approval-gated rebaseline** | Keep seed manifests, failure artifacts and baseline decision records; rebaseline by report/approval. | **Recommended.** Prevents silent seed deletion and accidental drift. |
| B. CI summaries only | Keep only run summaries. | Too weak for deterministic forensics. |
| C. Store everything indefinitely | Maximal trace retention. | Storage/noise burden without clear value. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-196 selected from live Linear after FMX-177 split this follow-up.
- 2026-06-15: FMX-196 moved from `Backlog` to `In Progress`.
- 2026-06-15: clean worktree/branch created:
  `codex/fmx-196-deterministic-simulation-qa`.
- 2026-06-15: Perplexity-first research saved and weak citations separated
  from source-checked evidence.
- 2026-06-15: Decision-pending synthesis, draft ADR-0120 and draft quality
  runbook prepared.

## Proposed packet

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

If accepted, promote
[[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
to `accepted` / `binding: true` and
[[../40-Quality/deterministic-simulation-qa-harness]] to `current` /
`binding: true`. Patch [[../60-Research/determinism-and-replay]] so its
no-snapshot rule explicitly allows QA sparse snapshots while keeping compact
production replay as the default.

## Related

- [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]]
- [[../40-Quality/deterministic-simulation-qa-harness]]
- [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
