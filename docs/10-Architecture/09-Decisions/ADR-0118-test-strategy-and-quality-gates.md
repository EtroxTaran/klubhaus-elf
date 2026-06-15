---
title: ADR-0118 Test Strategy and Quality Gates
status: accepted
tags: [adr, architecture, testing, quality, ci, vitest, playwright, fast-check, stryker, determinism, accessibility, performance, security, fmx-177]
created: 2026-06-14
updated: 2026-06-15
type: adr
binding: true
linear: FMX-177
supersedes:
superseded_by:
related:
  - [[../../60-Research/test-strategy-adr-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
  - [[../../40-Quality/test-strategy]]
  - [[../../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
  - [[../10-Quality]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[ADR-0110-code-phase-dod-transition-contract]]
---

# ADR-0118: Test Strategy and Quality Gates

## Status

accepted

Accepted for FMX-177 on 2026-06-15 after Nico approved D1-D4=A, D5=A
(`85/85/85/75`) and the D6 portable CI posture with a future local `xAi`
runner verification gate in
[[../../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]].

This ADR intentionally uses the next live number after ADR-0117. It does not
reuse the dead pre-mortem-era `ADR-0040` placeholder.

## Date

2026-06-14

## Context

The post-reset repository is docs-vault-only. ADR-0110 keeps current validation
to docs checks until code phase starts. Still, the future code-phase quality
strategy needs one canonical decision before workspace/bootstrap work makes
tooling active.

The older pre-mortem note
[[../../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]] named a
useful risk set: property tests, mutation tests, deterministic CI, save-forward
compatibility, 50-year soak, visual/a11y/perf/security and CI cost. But it also
names stale tool assumptions (`Vitest 3`) and a dead ADR target (`ADR-0040`).

FMX needs a current source of truth that:

- preserves the old research as historical input;
- defines what each tool is responsible for;
- keeps PR feedback fast enough to stay enabled;
- protects deterministic simulation, offline/PWA, save and low-end mobile risk;
- consolidates coverage-threshold language across the vault;
- preserves a portable path for Nico's future local AI-server runner while
  requiring a later security/compatibility gate before activation.

## Decision

### 1. Adopt a tiered quality strategy of record

FMX code phase should use a 16-layer quality strategy, but not every layer is a
per-PR blocker.

| Layer | Main cadence | Evidence |
|---|---|---|
| Unit/domain tests | PR | Vitest node projects. |
| Component/DOM tests | PR | Vitest DOM/browser projects, Storybook tests where useful. |
| Property/invariant tests | PR + nightly deepening | fast-check with replayable counterexample evidence. |
| Integration/contract tests | PR | Context contracts, persistence boundaries, API/schema contracts. |
| E2E/PWA/offline tests | PR smoke + nightly matrix | Playwright. |
| Accessibility | PR automated smoke + release manual | axe/Lighthouse/Storybook where applicable plus manual evidence. |
| Determinism/golden replay | PR smoke + nightly/release deepening | Byte-identical replay and lint/architecture guards. |
| Save-forward compatibility | Nightly + release | Version matrix and migration fixtures. |
| Soak/calibration | Nightly + release | 50-year and statistical envelopes. |
| Mutation testing | Nightly + release first | Stryker scoped to high-value domain code. |
| Visual regression | Curated PR/release | Storybook/visual provider when accepted. |
| Performance/Web Vitals | PR smoke + release device floor | Lighthouse CI/Web Vitals/device-budget evidence. |
| Security/dependency/SBOM | PR + release | secret scan/dependency audit/SBOM artifacts. |
| Load/chaos/DAST | Release/manual target | Only after real services exist. |

The current docs-phase remains unchanged: `node scripts/docs-check.mjs` and
status consistency checks when status/binding semantics change.

### 2. Split Vitest and Playwright by responsibility

Vitest should own fast code-level tests:

- node/domain projects;
- DOM/component projects;
- selective Browser Mode projects using the Playwright provider;
- property tests through fast-check integration;
- coverage reporting.

Playwright Test should own browser/application behavior:

- route and workflow E2E;
- offline/PWA/IndexedDB/service-worker smoke;
- mobile viewport/device profiles;
- cross-browser smoke;
- accessibility scans in browser context;
- trace/video/screenshot evidence when a browser journey fails.

### 3. Treat property failures as replay artifacts

Every property-test failure on deterministic/domain surfaces should preserve:

- property ID;
- `seed`;
- fast-check `path` when present;
- minimized counterexample;
- engine/content/config hash where relevant;
- command to replay locally;
- PR/build/nightly run identity.

This is mandatory for match-engine, save/migration, league/rules, finance
settlement, transfer eligibility and security/idempotency properties once those
surfaces exist.

### 4. Scope mutation testing before making it blocking

Mutation testing should start with the highest-risk deterministic/domain code:

- match engine and replay-bearing helpers;
- save parser/migration/envelope validation;
- ledger/accounting settlement;
- regulatory/eligibility policies;
- replay-protection and idempotency validators.

The first binding cadence should be nightly/release. PR blocking can be added
later only after measured wall time and false-positive rate are acceptable.

### 5. Consolidate coverage threshold language

The proposed code-phase base threshold of record is:

> **85/85/85/75 per-file for meaningful first-party product logic**:
> 85 statements, 85 lines, 85 functions and 75 branches.

This is not a substitute for domain gates. Deterministic simulation still needs
properties, golden replay, mutation and soak. Accessibility and performance
still need their own evidence. Framework glue, generated files, route trees,
test utilities and bootstrap-only scaffolding may be excluded by documented
policy; exclusions are not threshold relaxations.

During the first code scaffold, thresholds activate only for packages with real
product logic and tests. Empty package roots must not be made green with
placeholder coverage.

### 6. Keep CI cost explicit and portable

Code-phase CI must stay portable across the active GitHub-hosted path and
Nico's future local AI-server runner environment. In this ADR, `xAi` means
Nico's own local stack, not xAI/Grok.

The PR hot path remains on the active GitHub-hosted/docs-phase path until a
later runner activation gate verifies the local path. Heavy nightly/release
gates may use local/self-hosted runners only after separate approval of:

- `xAi` stack compatibility with the accepted workflow/scripts;
- security boundary;
- runner isolation, including ephemeral/JIT-equivalent behavior or an accepted
  compensating control;
- secret exposure posture;
- maintenance owner;
- runner update cadence;
- failure triage expectations;
- cost budget.

## Options considered

### D1 - strategy shape

| Option | Meaning | Assessment |
|---|---|---|
| A. Tiered 16-layer strategy | Keep the full risk map, but split PR/nightly/release/manual cadence. | **Recommended.** Best balance of signal, cost and simulation depth. |
| B. Lean 8-layer strategy | Unit, integration, E2E, a11y, perf, security, determinism and release smoke only. | Simpler but likely under-tests save/mutation/soak risk. |
| C. All layers per PR | Run everything always. | Strong in theory, likely slow enough that gates get disabled. |

### D2 - runner/tool ownership

| Option | Meaning | Assessment |
|---|---|---|
| A. Vitest projects + Playwright E2E split | Vitest for unit/domain/component/property; Playwright for app/browser/PWA journeys. | **Recommended.** Matches official tool strengths and keeps fast feedback. |
| B. Vitest-first only | Use Playwright only for rare smoke. | Under-tests real browser/PWA/mobile behavior. |
| C. Playwright-heavy | Drive most tests through Playwright. | Too slow/noisy for domain and property-heavy simulation code. |

### D3 - property/replay evidence

| Option | Meaning | Assessment |
|---|---|---|
| A. Replayable property evidence | Persist seed/path/counterexample/hash/run identity. | **Recommended.** Turns random failures into debuggable artifacts. |
| B. Print seed only | Easier but loses shrunk replay path and artifact context. | Too weak for deterministic simulation triage. |
| C. Random exploratory only | Properties run but failures are not stable artifacts. | Rejected; not compatible with FMX replay/debug standards. |

### D4 - mutation testing

| Option | Meaning | Assessment |
|---|---|---|
| A. Scoped nightly/release first | Stryker over high-risk deterministic/domain packages; later PR gate only after measured stability. | **Recommended.** High signal without wrecking PR loop. |
| B. PR-blocking immediately | Mutation threshold blocks every PR from first code phase. | Risky wall time and false-positive burden. |
| C. Defer mutation entirely | No mutation testing until late beta. | Misses weak assertions in critical simulation code. |

### D5 - coverage threshold

| Option | Meaning | Assessment |
|---|---|---|
| A. One base threshold: 85/85/85/75 per-file | Statements/lines/functions 85, branches 75 for meaningful product logic; documented exclusions only. | **Recommended.** Reconciles existing design-system wording with one canonical threshold. |
| B. Risk-tiered thresholds | Higher for engine/domain, lower for UI/app glue. | Nuanced but easy to misread and harder to enforce early. |
| C. Coverage advisory only | No blocking threshold; rely on review and other gates. | Too weak for greenfield drift. |

### D6 - CI runner/cost posture

| Option | Meaning | Assessment |
|---|---|---|
| A. Portable GitHub-hosted PR path plus approved local/self-hosted heavy gates | Keep PR checks simple and portable; preserve future `xAi` local-runner capability, but activate local/self-hosted gates only after compatibility/security/maintenance approval. | **Accepted.** Balances velocity, cost, runner risk and Nico's future local stack. |
| B. All GitHub-hosted | Simple, but cost/runtime may rise with soak/mutation. | Acceptable early but may need revisit. |
| C. Immediate self-hosted for all gates | Maximum control. | Too much operational/security surface before code exists. |

## Consequences if accepted

Positive:

- One current test-strategy source replaces stale `ADR-0040` references.
- PR loop remains intentionally small while nightly/release gates protect
  long-horizon simulation risk.
- Tool responsibilities are explicit.
- Property, replay and mutation evidence support deterministic debugging.
- Coverage threshold language is consolidated.
- The future local AI-server runner path stays open without treating it as
  already secure or compatible.

Negative:

- The strategy requires CI orchestration discipline when code phase starts.
- Nightly/release gates add operational ownership.
- Some quality evidence remains scheduled/manual instead of always per PR.
- Mutation and visual baselines need initial calibration before blocking.
- The `xAi` local-runner path still needs a later proof gate before it can host
  trusted PR or scheduled checks.

## Verification requirements

When code phase starts and this ADR is accepted, the scaffold/implementation
PRs must add real scripts/workflows only for real targets. No placeholder green
jobs.

Minimum future verification:

- root scripts wrapping Nx/package targets per ADR-0110;
- Vitest project config for unit/domain/component/property surfaces, including
  the current Browser Mode provider package check;
- Playwright config for E2E/offline/mobile/cross-browser smoke;
- property-test failure artifact convention;
- deterministic replay smoke gate;
- coverage config matching the accepted D5 threshold;
- mutation testing config scoped to accepted D4 packages;
- a11y/performance evidence hooks;
- SBOM/dependency evidence for release path;
- CI cost/run-time reporting;
- runner portability evidence for the GitHub-hosted path and, before any local
  activation, explicit `xAi` stack compatibility, isolation, secret and
  maintenance evidence.

## Source notes

The supporting source checks are preserved in
[[../../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]] and
synthesised in [[../../60-Research/test-strategy-adr-2026-06-14]].

Key source families:

- Vitest official docs for Browser Mode/projects/coverage.
- Playwright official docs for sharding/reporters/configuration.
- fast-check official docs for seed/path/counterexample replay.
- StrykerJS official docs for Vitest runner and incremental mode.
- Playwright/axe and Storybook docs for a11y automation boundaries.
- Lighthouse CI docs for budgets/assertions.
- GitHub Actions billing and hardening docs for hosted/self-hosted runner cost
  and security posture.
- CycloneDX cdxgen docs for SBOM artifact generation.

## Related Docs

- [[../../60-Research/test-strategy-adr-2026-06-14]]
- [[../../40-Quality/test-strategy]]
- [[../../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../10-Quality]]
- [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
- [[ADR-0110-code-phase-dod-transition-contract]]
