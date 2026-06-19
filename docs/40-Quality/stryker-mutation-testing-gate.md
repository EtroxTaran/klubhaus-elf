---
title: Stryker Mutation Testing Gate
status: current
tags: [quality, testing, mutation, stryker, vitest, determinism, ci, fmx-172]
created: 2026-06-15
updated: 2026-06-19
type: quality
binding: true
linear: FMX-172
related:
  - [[../60-Research/mutation-testing-gate-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[test-strategy]]
---

# Stryker Mutation Testing Gate

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


This is the non-binding FMX-172 draft runbook. It becomes binding only if Nico
accepts draft
[[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
or promotes this note directly.

Current phase: docs-vault-only. No script, dependency, Stryker config or CI
workflow exists today.

## Initial scope

| Scope | Include | Exclude by default |
|---|---|---|
| Match engine and replay helpers | deterministic match-state transforms, replay hash helpers, RNG stream guards | renderer presentation, UI animation, non-authoritative visual helpers |
| Save/parser/migration/envelope | schema acceptance, lossy migration guards, corrupt input rejection | generated schema mirror if generated from source of truth |
| Ledger/accounting settlement | posting balance, idempotent settlement, amortisation/write-off logic | presentation-only finance charts |
| Regulations/eligibility | squad rules, competition eligibility, work-permit/regulation predicates | localized copy around rule messages |
| Replay/idempotency validators | canonical hash, duplicate command handling, proof/replay validators | network retry UI |

Generated files, framework bootstrap, route scaffolds, empty package shells,
test utilities and broad UI glue are out of scope unless a future owner adds a
targeted rationale.

## Thresholds

After a scoped baseline is accepted:

| Stryker threshold | Value | Behavior |
|---|---:|---|
| `break` | 70 | Future failing floor. |
| `low` | 80 | Warning/low band. |
| `high` | 90 | Desired quality target. |

Before the baseline is accepted, mutation runs are advisory/reporting only.

## Cadence

| Stage | Cadence | Blocking policy |
|---|---|---|
| Docs phase | None | Inactive. |
| Code bootstrap | Targeted manual/advisory runs | Non-required. |
| Burn-in | Nightly scoped mutation | Non-required until runtime/flake/survivor quality is measured. |
| Release | Full scoped mutation | Blocks release after Nico accepts the baseline. |
| PR | Affected-scope incremental mutation | Blocks only after burn-in proves the gate is stable and useful. |

If PR-blocking is later activated, mutation runs inside the future `quality`
context rather than creating a standalone branch-protection context.

## Future config sketch

Final config belongs to the code-bootstrap PR. The intended shape is:

```js
export default {
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.ts',
    dir: '.',
    related: true,
  },
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  reporters: ['clear-text', 'progress', 'html', 'json'],
  thresholds: {
    break: 70,
    low: 80,
    high: 90,
  },
}
```

Bootstrap must re-check current versions before installing. On 2026-06-15, the
source-checked target set is Stryker core/runner `9.6.1` and Vitest `4.1.9`.

## Artifact policy

| Artifact | Retention |
|---|---|
| HTML report | CI artifact for PR/nightly/release run. |
| JSON report | CI artifact and trend input. |
| Incremental cache | CI cache/artifact only; not committed. |
| Release summary | Stored with release evidence once code phase exists. |
| Equivalent-mutant waiver | Stored in a narrow tracked waiver list with owner and review date. |

Force a full run instead of relying on incremental cache when:

- dependencies, Node version, Stryker/Vitest version or test environment changes;
- mutated scope changes structurally;
- snapshot/content/config inputs affect the tested behavior;
- release evidence is being produced;
- mutation score moves suspiciously.

## Survivor triage

| Survivor class | Handling |
|---|---|
| Equivalent | Document narrow rationale, owner and review date. |
| Actionable domain survivor | Add or strengthen property, replay, contract or fixture invariant. |
| Timeout/performance | Investigate test isolation and mutation scope before waiving. |
| No coverage | Add coverage or remove the file from scope with reason. |
| Invalid mutant | Track separately; do not let invalids hide actionable survivors. |

For deterministic/replay-critical code, any non-equivalent surviving mutant
that can change match replay, save validity, ledger balance, eligibility or
idempotent command outcome is a test-suite defect.

## Activation checklist

The gate is not active until all are true:

- code workspace and Vitest projects exist;
- mutation scope paths map to real packages;
- Stryker core/runner/Vitest versions are re-checked and pinned exactly;
- baseline report is captured and reviewed;
- equivalent-mutant waiver format exists;
- CI publishes HTML/JSON reports;
- incremental cache is CI-only and has forced-rerun triggers;
- nightly/release runs prove acceptable runtime and flake behavior;
- Nico accepts promotion from reporting to blocking.

## Related

- [[../60-Research/mutation-testing-gate-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
- [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[test-strategy]]
