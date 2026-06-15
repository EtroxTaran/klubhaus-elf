---
title: Raw Mutation Testing Gate Source Checks
status: raw
tags: [research, raw, source-check, testing, quality, mutation, stryker, vitest, npm, ci, fmx-172]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-172
related:
  - [[raw-mutation-testing-gate-2026-06-15]]
  - [[../mutation-testing-gate-2026-06-15]]
  - [[../../40-Quality/stryker-mutation-testing-gate]]
  - [[../../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
---

# Raw Mutation Testing Gate Source Checks

Source checks for FMX-172. Perplexity was used for discovery; this note records
the official or primary sources used for the proposal.

## Checked sources

### StrykerJS official documentation

Sources:

- Context7 official snapshot: `/stryker-mutator/stryker-js`.
- Ref read: <https://stryker-mutator.io/docs/stryker-js/configuration/>
- Ref read: <https://stryker-mutator.io/docs/stryker-js/incremental/>
- Ref read: <https://stryker-mutator.io/docs/stryker-js/vitest-runner/>

Checked facts:

- `thresholds` supports `high`, `low` and `break`; a score below `break`
  causes a failing exit code, while the documented default has no break value.
- `incremental` defaults to false and writes to
  `reports/stryker-incremental.json` by default when enabled.
- Incremental mode reuses prior results when the related mutant/test evidence
  is unchanged, but a dry run still happens.
- Incremental mode has known limits around files outside the mutated/test set,
  environment or dependency changes, snapshot/readme-like inputs and static
  mutants.
- Stryker runs in a temporary sandbox by default; in-place mutation is not the
  normal requirement.
- The official Vitest runner uses `testRunner: "vitest"` and a `vitest` config
  block with `configFile`, `dir` and `related`.
- `vitest.related` defaults to true and uses Vitest related-test discovery to
  narrow test execution.
- The Vitest runner plugin reports per-test coverage behavior and does not
  support Vitest Browser Mode.

FMX implication:

- Use Stryker's threshold model for the future gate.
- Use incremental mode as a speed aid, not as the only release proof.
- Do not commit the incremental cache as durable truth; cache/publish it as CI
  evidence and force full reruns for release/dependency/environment changes.
- Keep mutation testing in Node/Vitest domain projects, not Vitest Browser Mode.

### npm registry metadata

Sources:

- `https://registry.npmjs.org/@stryker-mutator%2Fcore/latest`
- `https://registry.npmjs.org/@stryker-mutator%2Fvitest-runner/latest`
- `https://registry.npmjs.org/vitest/latest`

Checked on 2026-06-15:

| Package | Latest observed | Key compatibility signal |
|---|---:|---|
| `@stryker-mutator/core` | `9.6.1` | Node engine `>=20.0.0`. |
| `@stryker-mutator/vitest-runner` | `9.6.1` | Peer-depends on exact `@stryker-mutator/core@9.6.1` and `vitest >=2.0.0`. |
| `vitest` | `4.1.9` | Node engine `^20.0.0 || ^22.0.0 || >=24.0.0`; Vite peer `^6.0.0 || ^7.0.0 || ^8.0.0`. |

FMX implication:

- At code bootstrap, pair Stryker core and Vitest runner exactly.
- Current source-checked target remains compatible with the draft
  [[../../30-Implementation/stack-currency-ledger]] row: Stryker `9.6.1` and
  Vitest `4.1.9`.
- No package file is changed in this docs-only beat.

### Vitest official docs snapshot

Source:

- Context7 official snapshot: `/vitest-dev/vitest/v4.1.6`.

Checked facts:

- Vitest projects are configured through `test.projects`; older workspace
  wording is no longer the preferred form.
- Coverage thresholds can be expressed for statements, functions, branches and
  lines, including per-glob/per-file style enforcement.

FMX implication:

- Mutation testing should run against explicit Vitest projects once the code
  workspace exists.
- ADR-0118's base coverage threshold and FMX-172's mutation threshold are
  complementary gates, not substitutes.

## Cross-check against existing vault records

Checked:

- [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[../../40-Quality/test-strategy]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/stack-currency-ledger]]
- [[../raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
- [[../raw-perplexity/raw-test-strategy-adr-2026-06-14]]
- [[../pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
- [[../pre-mortem/PM-2026-05-20-05-security-and-integrity]]

Findings:

- ADR-0118 already accepts scoped Stryker mutation testing, scheduled first,
  with a 70 break / 80 low / 90 high target after baseline.
- The current CI process already says `mutation` starts as
  reporting/nightly/release evidence, not a standalone required
  branch-protection context.
- The old pre-mortem recommended committing the incremental report. Official
  incremental limitations make that too strong for the new proposal: keep it as
  CI cache/artifact and force full reruns for release or source-of-truth
  changes.
- The security pre-mortem correctly treats determinism-surviving mutants as
  high signal, but the FMX-172 proposal should allow documented equivalent
  mutants rather than demanding every mutant be killed literally.

## Canonical interpretation for FMX-172

- Latest source-checked tool posture on 2026-06-15: Stryker core/runner
  `9.6.1`, Vitest `4.1.9`.
- Future gate: scoped, baseline-first, scheduled/release before PR-blocking.
- Threshold target after baseline: 70 break / 80 low / 90 high.
- Incremental mode: allowed and recommended for cost control, but never the
  only release proof.
- Deterministic/replay-critical surviving mutants: treat non-equivalent
  survivors as test-suite defects.

## Related

- [[raw-mutation-testing-gate-2026-06-15]]
- [[../mutation-testing-gate-2026-06-15]]
- [[../../40-Quality/stryker-mutation-testing-gate]]
- [[../../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
- [[../../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
