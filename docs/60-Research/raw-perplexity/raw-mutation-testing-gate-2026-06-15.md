---
title: Raw Mutation Testing Gate Research
status: raw
tags: [research, raw, perplexity, testing, quality, mutation, stryker, vitest, determinism, ci, fmx-172]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-172
related:
  - [[raw-mutation-testing-gate-source-checks-2026-06-15]]
  - [[../mutation-testing-gate-2026-06-15]]
  - [[../../40-Quality/stryker-mutation-testing-gate]]
  - [[../../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
---

# Raw Mutation Testing Gate Research

Private Perplexity-first capture for FMX-172. This note preserves the
substantive discovery pass; it is not authoritative. Source-checked claims used
for the synthesis live in
[[raw-mutation-testing-gate-source-checks-2026-06-15]].

## Prompt

Research best practices for defining a StrykerJS mutation-testing gate in a
TypeScript/Vitest football-manager simulation project. Cover threshold policy,
PR/nightly/release cadence, incremental mode and artifact handling, Vitest
runner configuration, deterministic/replay-critical game code, equivalent
mutants, CI cost control and comparable game/simulation QA practice.

## Perplexity answer capture

### Strategy

The answer recommended making mutation testing a targeted quality gate, not a
blanket repo-wide gate. High-value scope should start with deterministic and
domain-critical code where coverage can be misleading:

- match-engine and replay helpers;
- save parsing, migrations and envelope validation;
- ledger/accounting settlement;
- regulations and eligibility policies;
- replay-protection/idempotency validators.

Broad UI glue, generated files, route bootstrap and cosmetic rendering code were
identified as poor first targets because mutation runtime and equivalent-mutant
noise can outweigh signal.

### Thresholds

The answer identified Stryker's threshold model as the right primitive:

- `high` marks the desired score;
- `low` marks warning/low-quality output;
- `break` is the build-failure threshold.

It recommended a baseline-driven gate for FMX:

- measure a first scoped baseline before making PRs fail;
- keep the accepted ADR-0118 target shape of 70 break / 80 low / 90 high after
  baseline;
- treat default thresholds as a starting point only, not the final FMX policy;
- document equivalent mutants and non-actionable survivors instead of forcing
  brittle tests.

### Cadence

The answer recommended a staged cadence:

- PR: advisory/reporting first, then narrow affected-scope mutation only after
  runtime and flake evidence are measured;
- nightly: broader scoped mutation with published HTML/JSON artifacts and trend
  report;
- release: full scoped mutation as release evidence once the baseline is
  trusted.

It explicitly warned against making mutation a branch-protection context before
the real code workspace, scripts and CI burn-in exist.

### Incremental mode and artifacts

The answer recommended using Stryker incremental mode for cost control, but not
treating the cache as proof of correctness. The cache should accelerate
scheduled and advisory runs; periodic full reruns should still happen for
nightly/release, dependency changes, test-runner changes or suspicious score
drift.

The answer suggested publishing mutation reports as CI artifacts and trending
mutation score over time. It also suggested not committing generated mutation
reports unless a later repository convention explicitly requires that artifact.

### Vitest runner

The answer recommended the official Stryker Vitest runner:

```json
{
  "testRunner": "vitest",
  "vitest": {
    "configFile": "vitest.config.ts",
    "dir": ".",
    "related": true
  },
  "incremental": true,
  "thresholds": {
    "break": 70,
    "low": 80,
    "high": 90
  }
}
```

It recommended pairing exact Stryker core/runner versions and checking the
Vitest peer range during code bootstrap.

### Deterministic game code

For replay-critical or authoritative deterministic code, the answer recommended
a stricter interpretation than generic web code:

- a non-equivalent survivor that can change final match, replay, ledger,
  eligibility or save-validation output is a test-suite defect;
- the expected fix is usually a domain/property/replay invariant, not a
  brittle line-level assertion;
- equivalent mutants are allowed only with a documented rationale;
- mutation testing should complement deterministic replay and property tests,
  not replace them.

### Comparable games and simulations

The answer did not find strong public evidence that football-manager or sports
management games publish Stryker-specific mutation gates. It treated public game
QA evidence as indirect:

- deterministic simulation games use replay/desync tests and seed-based
  regression because small logic changes can corrupt long-running worlds;
- management games have long-save trust and release-quality pressure, so
  mutation testing is most useful where it protects stable rules and
  persistence contracts rather than visual polish;
- sports-management logic should connect mutation tests to domain invariants:
  no impossible table states, no invalid eligibility, no imbalanced ledger, no
  replay divergence and no silent save parsing acceptance.

### Perplexity source list and citation quality

The answer cited a mix of primary and secondary sources. Source quality was
therefore split before synthesis:

- high-signal primary/official: StrykerJS configuration docs, StrykerJS
  incremental docs, StrykerJS Vitest runner docs, npm registry metadata,
  official Vitest docs snapshot;
- secondary/context only: OneUptime mutation-testing blog, TypeScript.TV,
  FOSDEM material, GitHub issues, community Q&A and Reddit-like discussion.

Only source-checked official/primary claims are carried into the proposal as
canonical evidence.

## Related

- [[raw-mutation-testing-gate-source-checks-2026-06-15]]
- [[../mutation-testing-gate-2026-06-15]]
- [[../../40-Quality/stryker-mutation-testing-gate]]
- [[../../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
- [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
