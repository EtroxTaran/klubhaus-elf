---
title: Mutation Testing Gate
status: current
tags: [research, synthesis, testing, quality, mutation, stryker, vitest, determinism, ci, fmx-172]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-172
related:
  - [[raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
  - [[raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
  - [[../40-Quality/stryker-mutation-testing-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  - [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/stack-currency-ledger]]
---

# Mutation Testing Gate

## Scope

FMX-172 closes the ADR-0118 follow-up for exact Stryker mutation-gate policy:
scope, thresholds, CI placement, incremental artifacts and deterministic
game-code handling.

This packet does not add code, dependencies or CI workflows. It stays
binding after Nico approved D1-D6 on 2026-06-19 in
[[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]].

## Current authority

Accepted
[[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
already defines the high-level strategy:

- mutation testing is scoped to deterministic/domain code;
- scheduled/nightly/release cadence comes before PR blocking;
- 70 break / 80 low / 90 high is the target after baseline;
- broad UI glue is not an initial mutation target.

Accepted FMX-175 CI guidance in
[[../30-Implementation/ci-and-review-process]] also keeps `mutation` outside the
future required branch-protection context list. If mutation becomes PR-blocking
later, it should be an internal `quality` subgate, not a new required context.

FMX-172 therefore refines activation and evidence; it does not reopen the
general test strategy.

## Evidence synthesis

### Mutation score protects against shallow coverage

Line/branch coverage can show that code executed, but not that assertions catch
semantic damage. Mutation testing is valuable where business rules have strong
invariants and long-lived consequences. For FMX that means:

- match and replay determinism;
- save parsing and migration acceptance;
- accounting/ledger settlement;
- regulations and eligibility;
- replay/dedup/idempotency validators.

Mutation testing is lower-value as a first gate for generated files, pure
styling, route scaffolds and broad UI glue, where equivalent mutants and runtime
cost are likely to dominate.

### Stryker supports the gate shape FMX needs

Official Stryker docs provide the needed primitives:

- threshold bands with `high`, `low` and `break`;
- incremental result reuse;
- a Vitest runner with `testRunner: "vitest"`;
- HTML/JSON style reporting;
- temporary sandbox execution by default.

The source-checked package posture on 2026-06-15 is:

- `@stryker-mutator/core@9.6.1`;
- `@stryker-mutator/vitest-runner@9.6.1`;
- `vitest@4.1.9`.

No dependency is changed by this docs-only beat. The future code bootstrap must
re-check versions and peer ranges before pinning.

### Incremental mode is useful but not proof

Stryker incremental mode can reduce runtime by reusing previous results.
However, official limitations mean it can miss changes outside the mutated/test
files and environment/dependency-like inputs. FMX should therefore:

- use incremental mode for cost control and advisory/PR scoped runs;
- cache and publish reports in CI;
- avoid committing the incremental cache as durable truth;
- force full reruns for release, dependency/test-runner/environment changes and
  suspicious mutation-score drift.

### Deterministic game code needs stricter survivor triage

For generic application code, a surviving mutant is often a test-improvement
signal. For replay-critical FMX code, a non-equivalent survivor that can change
authoritative output is stronger: it means the test suite is missing a domain
invariant.

Examples:

- a mutant changes match replay output without a replay/property failure;
- a save parser accepts invalid or lossy input;
- a ledger/accounting mutation preserves test coverage but breaks balance;
- an eligibility mutation allows an invalid squad or competition outcome;
- an idempotency mutation allows duplicate command effect.

The preferred fix is usually a property, replay, contract or fixture invariant,
not brittle line-level assertions.

Equivalent mutants remain real. FMX should allow documented equivalent-mutant
waivers with a narrow scope, owner and review date.

### Real-world and game-world precedent

Public sport-management games rarely publish mutation-testing internals, so the
game precedent is indirect. The relevant lesson from deterministic simulation
and long-save games is that small rule changes can corrupt persistent worlds or
replays long after the immediate test path passed.

FMX should therefore connect mutation tests to player-trust outcomes:

- stable saves;
- valid tables and eligibility;
- balanced finance facts;
- reproducible replay;
- no silent acceptance of corrupt content or commands.

This is more valuable than maximizing a repo-wide mutation number.

## Recommended FMX packet

### Scope

Initial mutation scope should be the ADR-0118 high-risk set:

| Scope | Reason |
|---|---|
| Match engine and replay helpers | Small logic changes can change authoritative replay. |
| Save parser, migration and envelope validation | Silent acceptance/loss corrupts long saves. |
| Ledger/accounting settlement | Coverage can miss semantic balance errors. |
| Regulations and eligibility | Rules are branch-heavy and player-visible. |
| Replay-protection/idempotency validators | Security/integrity defects can hide behind shallow assertions. |

Explicitly exclude generated files, framework bootstrap, route scaffolds, pure
UI layout, visual stories, test utilities and non-authoritative presentation
code unless a future owner adds a targeted reason.

### Thresholds

Use the accepted ADR-0118 target after baseline:

| Threshold | Proposed value | Meaning |
|---|---:|---|
| `break` | 70 | Future fail threshold after baseline activation. |
| `low` | 80 | Low/warning band. |
| `high` | 90 | Desired quality band. |

Before activation, collect a scoped baseline and preserve survivor categories:
killed, survived-actionable, equivalent, timeout, no-coverage and invalid.

### CI placement

| Phase | Mutation behavior |
|---|---|
| Docs phase | Inactive; no scripts/workflows/dependencies. |
| Code bootstrap | Reporting/non-required only after real packages and Vitest projects exist. |
| Burn-in | Scheduled/nightly scoped mutation with trend artifacts. |
| Release | Full scoped mutation blocks release once baseline is accepted. |
| PR | Only affected-scope PR blocking after runtime, flake and false-positive evidence are acceptable. |

Mutation remains inside future `quality` if it is promoted to PR-blocking; it
does not become a standalone required branch-protection context.

### Artifact policy

- Publish HTML and JSON mutation reports from CI.
- Cache `reports/stryker-incremental.json` as CI cache/artifact only.
- Do not commit mutation reports or incremental cache unless a later accepted
  repository evidence policy requires it.
- Keep release mutation summaries with score, scope, tool versions, engine/hash
  context where relevant, survivor counts and waiver list.

### Deterministic survivor policy

For deterministic/replay-critical scope, a non-equivalent surviving mutant that
can change authoritative output is a test-suite defect. Equivalent mutants must
be documented narrowly.

## Decision queue summary

The decision queue
[[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
asks Nico to decide:

- D1 mutation scope;
- D2 threshold and baseline model;
- D3 CI placement and blocking cadence;
- D4 Stryker/Vitest config and version posture;
- D5 incremental cache/artifact policy;
- D6 deterministic survivor policy.

Recommended packet: D1=A, D2=A, D3=A, D4=A, D5=A, D6=A.

## Related

- [[raw-perplexity/raw-mutation-testing-gate-2026-06-15]]
- [[raw-perplexity/raw-mutation-testing-gate-source-checks-2026-06-15]]
- [[../40-Quality/stryker-mutation-testing-gate]]
- [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
- [[../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
