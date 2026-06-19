---
title: ADR-0125 Stryker Mutation Testing Gate
status: accepted
tags: [adr, architecture, testing, quality, mutation, stryker, vitest, determinism, ci, fmx-172, accepted]
created: 2026-06-15
updated: 2026-06-19
type: adr
binding: true
linear: FMX-172
amends:
  - [[ADR-0118-test-strategy-and-quality-gates]]
  - [[ADR-0044-cicd-and-merge-policy]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/mutation-testing-gate-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
  - [[../../40-Quality/stryker-mutation-testing-gate]]
  - [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
  - [[../../40-Quality/test-strategy]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[ADR-0021-revised-tech-stack]]
---

# ADR-0125: Stryker Mutation Testing Gate

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-172 on 2026-06-15. Binding after Nico approved D1-D6 on 2026-06-19 in
[[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]].

## Date

2026-06-15

## Context

ADR-0118 accepts a broad future code-phase quality strategy and explicitly
includes scoped Stryker mutation testing. It leaves exact activation details to
follow-up work: which files are in scope, how the 70/80/90 target becomes
binding, where mutation sits in CI, how incremental mode is handled and how
survivors in deterministic game code are interpreted.

The repo is still docs-vault-only. No app/package workspace, Stryker config,
Vitest project, mutation report or CI mutation workflow exists today.

## Proposed decision

If accepted, FMX uses a scoped, baseline-first Stryker mutation gate:

### D1 - scope

Initial mutation scope is limited to high-risk deterministic/domain surfaces:

- match engine and replay helpers;
- save parser, migration and envelope validation;
- ledger/accounting settlement;
- regulations and eligibility policies;
- replay-protection/idempotency validators.

Generated files, route/bootstrap glue, empty scaffolds, test utilities,
presentation-only renderer code and broad UI layout are excluded unless a
future owner adds a targeted rationale.

### D2 - thresholds

After baseline approval, the Stryker threshold target is:

- `break: 70`;
- `low: 80`;
- `high: 90`.

Before baseline approval, runs are reporting-only and must classify survivors.

### D3 - CI placement

Mutation is inactive in docs phase. In code phase:

- bootstrap begins as reporting/non-required;
- nightly scoped mutation produces trend artifacts;
- release scoped mutation becomes blocking after baseline approval;
- affected-scope PR blocking may be promoted only after runtime, flake and
  false-positive evidence are acceptable.

If PR-blocking is later enabled, mutation is an internal `quality` subgate, not
a standalone required branch-protection context.

### D4 - tool posture

Use the official Stryker Vitest runner and re-check latest stable versions at
code bootstrap. On 2026-06-15, the source-checked target set is:

- `@stryker-mutator/core@9.6.1`;
- `@stryker-mutator/vitest-runner@9.6.1`;
- `vitest@4.1.9`.

No dependency is added by this ADR while the repository is docs-only.

### D5 - incremental and artifacts

Use incremental mode for cost control, but never as the only release proof:

- cache/publish `reports/stryker-incremental.json` through CI only;
- publish HTML and JSON mutation reports;
- do not commit mutation reports or incremental caches by default;
- force full reruns for release, dependency/test-runner/environment changes,
  major scope changes and suspicious score drift.

### D6 - deterministic survivor policy

For deterministic/replay-critical code, a non-equivalent surviving mutant that
can change match replay, save validity, ledger balance, eligibility or
idempotent command outcome is a test-suite defect. The expected remedy is a
property, replay, contract or fixture invariant. Equivalent mutants are allowed
only with narrow documentation, owner and review date.

## Options considered

### D1 - mutation scope

| Option | Meaning | Assessment |
|---|---|---|
| A. ADR-0118 high-risk deterministic/domain scope | Match/replay, save, ledger, regulations and idempotency surfaces. | **Recommended.** Highest signal for player-trust failures. |
| B. Engine-only | Match-engine packages first. | Useful but misses save/ledger/rule defects. |
| C. Whole repo | All first-party code. | Too noisy and expensive before baselines. |

### D2 - threshold model

| Option | Meaning | Assessment |
|---|---|---|
| A. Baseline first, then 70/80/90 | Advisory until survivor/runtime baseline is reviewed. | **Recommended.** Matches ADR-0118 without premature hard failure. |
| B. Immediate hard 70/80/90 | Fail from first config. | Too brittle. |
| C. Stryker defaults | Use defaults. | Easier but weaker than ADR-0118's target. |

### D3 - CI cadence

| Option | Meaning | Assessment |
|---|---|---|
| A. Reporting -> nightly/release -> possible PR subgate | Promote only after evidence. | **Recommended.** Aligns FMX-175 and controls CI cost. |
| B. Immediate PR blocking | Fail relevant PRs day one. | Too risky before burn-in. |
| C. Release-only forever | Never affect PR/nightly. | Too weak for high-risk code. |

### D4 - tool posture

| Option | Meaning | Assessment |
|---|---|---|
| A. Source-checked latest stable pair at adoption | Re-check and pin exact Stryker/Vitest versions. | **Recommended.** Matches dependency-currency policy. |
| B. Freeze old Stryker 8.x assumptions | Keep historical pre-mortem version. | Outdated. |
| C. Defer version guidance | No version posture. | Too vague. |

### D5 - incremental artifacts

| Option | Meaning | Assessment |
|---|---|---|
| A. CI cache/artifacts with forced full reruns | Incremental for speed, full runs for evidence. | **Recommended.** Fits official limitations. |
| B. Commit incremental report | Put cache in git. | Churn and weak proof. |
| C. No incremental | Always full run. | Simple but likely too slow. |

### D6 - survivor handling

| Option | Meaning | Assessment |
|---|---|---|
| A. Non-equivalent deterministic survivors are test defects | Strong invariant expectation with equivalent-mutant waivers. | **Recommended.** Best fit for replay/save trust. |
| B. Kill every deterministic mutant literally | No waivers. | Unrealistic because equivalent mutants exist. |
| C. Mutation-score-only policy | No deterministic special handling. | Too weak. |

## Consequences if accepted

Positive:

- Converts ADR-0118's mutation-testing direction into an executable future
  gate contract.
- Keeps mutation focused on high-value deterministic and long-save logic.
- Avoids docs-phase fake scripts and premature branch protection.
- Preserves latest-stable dependency posture without changing package files.
- Gives deterministic survivor triage a clear test-quality meaning.

Costs:

- Code phase must build Stryker config, reports, CI cache and survivor triage
  workflow.
- Baseline review and equivalent-mutant waivers require human attention.
- PR blocking remains delayed until runtime and stability are measured.

## Related

- [[../../60-Research/mutation-testing-gate-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
- [[../../40-Quality/stryker-mutation-testing-gate]]
- [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
- [[ADR-0118-test-strategy-and-quality-gates]]
- [[ADR-0044-cicd-and-merge-policy]]
