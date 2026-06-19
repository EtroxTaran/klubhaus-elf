---
title: CI & Review Process
status: draft
tags: [implementation, ci, process, quality, architecture-fitness, mutation, stryker, rulesets, branch-protection, codeowners, lefthook, local-parity, fmx-167, fmx-172, fmx-176, fmx-181]
created: 2026-05-16
updated: 2026-06-17
type: implementation
related: [[../10-Architecture/10-Quality]], [[agent-workflow-pattern]], [[code-phase-dod-transition-contract]], [[../40-Quality/test-strategy]], [[../40-Quality/architecture-fitness-function]], [[../40-Quality/stryker-mutation-testing-gate]], [[../60-Research/local-parity-lefthook-2026-06-17]], [[../40-Execution/fmx-176-local-parity-decision-record-2026-06-17]], [[../60-Research/branch-protection-codeowner-activation-2026-06-16]], [[../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]], [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]], [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]], [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]], [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]], [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]], [[../00-Index/Current-State]]
---

# CI & Review Process

> **2026-06-14 — FMX-180 phase contract.** ADR-0110 and
> [[code-phase-dod-transition-contract]] are the executable source for the
> docs-phase -> code-phase Definition of Done. Today the repo is docs-vault-only:
> required checks are `docs-check` + `linear-id`, and green docs PRs auto-merge
> without review per ADR-0044. Code-phase checks and CODEOWNER review return only
> after the bootstrap PR creates the workspace, scripts, CI and real app/package
> paths.
>
> **2026-06-15 — FMX-177 test strategy accepted.** Accepted
> [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
> and current [[../40-Quality/test-strategy]] define the future code-phase
> Vitest/Playwright/property/mutation/determinism/a11y/perf/security gate
> ladder. They do not change today's docs-phase DoD and stay target-only until
> bootstrap creates real scripts, workflows and app/package paths.
>
> **2026-06-15 - FMX-175 code-CI context contract accepted.** Future
> code-phase branch protection uses script/domain-aligned contexts after real
> scripts, workflows and burn-in exist: `quality`, `e2e` and `security`.
> `lighthouse`, `a11y`, `storybook`, `game-smoke`, `mutation` and soak gates
> start as reporting/nightly/release evidence unless later promoted. The
> D-002-era `cursor-smoke` and `configured` names are historical incident
> vocabulary only, not future required contexts.
>
> **2026-06-16 - FMX-181 ruleset mirror active.** GitHub ruleset
> [`17748728`](https://github.com/EtroxTaran/klubhaus-elf/rules/17748728)
> now mirrors the docs-phase `main` protection: PR required, `linear-id` and
> `docs-check` required, deletion/force-push blocked and linear history
> required. Classic branch protection remains active until the mirror is proven
> over real PRs. Nico has PR-bypass only. One approval plus CODEOWNER review is
> deferred until real code paths and green `quality`/`e2e`/`security` evidence
> exist.
>
> **2026-06-15 - FMX-167 architecture fitness accepted.** Accepted
> [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
> and [[../40-Quality/architecture-fitness-function]] add no-shared-tables /
> no-cross-context-joins enforcement as an internal future `quality` subgate.
> It is not a new branch-protection context and it is inactive until real
> scanner scripts, violation fixtures, workflows and burn-in exist.
>
> **2026-06-15 - FMX-172 Stryker mutation gate pending.** Draft
> [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
> and [[../40-Quality/stryker-mutation-testing-gate]] refine the future
> mutation-testing subgate, but they are non-binding until Nico accepts D1-D6.
> The active docs-phase DoD is unchanged; mutation stays reporting/nightly/release
> before any PR-blocking promotion and remains inside `quality` if promoted.
>
> **2026-06-17 - FMX-176 docs-phase local hook active.** Lefthook is restored
> for the active docs gate only: exact-pinned `lefthook@2.1.9`, `pre-push`
> runs `pnpm docs:check`, and `pnpm hooks:install` /
> `pnpm hooks:run:pre-push` expose the workflow. `docs:status-check` remains a
> manual conditional check for ADR/GDDR `status:` or `binding:` semantics.
> Biome, Nx, lint-staged and code hooks remain target-only until real
> app/package paths and scripts exist.

**Principle: `main` and `develop` are always green.** A red required check
is an incident, not a backlog item. Overruling a red check is reserved for
an *utmost unusual* situation and is gated by the override policy below.

## Why this exists (historical D-002 lessons)

Before the docs-vault reset, CI had been red on `main` across multiple merges.
This is historical context, not today's repo state. The current repository has
no app code, Storybook, E2E app, Lighthouse target, `apps/` or `packages/`.
FMX-176 adds a root `pnpm-workspace.yaml` only for pnpm v11
`allowBuilds.lefthook: true`; it is not the app/package workspace scaffold.

D-002 still preserves four durable lessons:

1. **Merging red was tolerated.** PR #13 merged with `lighthouse` failing
   (the hydrated Office Hub blew the Total Blocking Time budget — see
   [[../90-Meta/github-issue-suite/issues/D-002-home-route-lighthouse-tbt]]).
   Once `main` is red, every subsequent PR inherits red and "red is normal"
   sets in — the exact failure mode this policy kills.
2. **A structurally broken job went unnoticed.** `cursor-smoke` ran
   `pnpm test:cloud-env` without `pnpm/action-setup@v4` → `pnpm: command
   not found` on every run, green never required so nobody noticed.
3. **Flake tolerated.** The offline e2e raced un-hydrated content and
   intermittently failed; treated as noise instead of fixed at source.
4. **Local ≠ CI.** `lefthook`'s Biome step errored on commits touching only
   Biome-unsupported files (YAML/MD), so docs/CI commits couldn't pass the
   local gate — discouraging the small green-keeping fixes.

All four are preserved as guardrails. They are not active required checks in
the docs-only repo. Future code-CI must not reintroduce placeholder contexts or
branch-protection entries before real scripts and workflows exist.

## Definition of done

### Current docs-phase DoD

A docs-phase PR is mergeable only when all active checks are green and the vault
contract is satisfied:

- `node scripts/docs-check.mjs` passes.
- `pnpm hooks:run:pre-push` passes, or the same `pnpm docs:check` command is
  run directly when hook execution is unavailable.
- `node scripts/status-consistency-check.mjs` passes when the PR changes
  ADR/GDDR `status:` or `binding:` semantics.
- GitHub required checks are `docs-check` + `linear-id`.
- GitHub ruleset `17748728` and classic branch protection both enforce the
  current docs-phase `main` guardrails.
- Research, decisions, process changes and handoff notes are saved in the vault
  when the beat changes durable knowledge.
- The three workflow gates in [[agent-workflow-pattern]] hold: design-system
  compliance for any UI/design work, vault delta in the same PR and
  knowledge-base alignment.

The current docs-phase DoD does **not** require `pnpm check`,
`pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, Storybook, `apps/web` or
`packages/*`; those commands and paths do not exist in the post-reset repo.

### Target code-phase DoD

After [[code-phase-dod-transition-contract]] marks code phase active, code PRs
also require the accepted code scripts and CI checks. Root `pnpm` scripts are
the human/CI entrypoints and wrap Nx targets per ADR-0110. Code-phase checks
must exist and pass before they can be made required.

FMX-177's accepted ADR-0118 is the target source for the detailed gate ladder:
Vitest projects, Playwright E2E/PWA, fast-check replay evidence, scoped
Stryker mutation testing, base coverage threshold, deterministic replay,
save-forward-compatibility, soak/calibration, a11y/performance/security and CI
cost posture with a future local `xAi` runner gate. Do not treat these details
as required checks until real workspace targets exist.

FMX-167's accepted ADR-0121 adds the architecture-fitness subgate to future
`quality`: `dependency-cruiser` for import/path/cycle rules plus custom
TypeScript/SQL scanners for Drizzle schema, relation/FK, query join and
migration checks. It does not add a standalone required status context.

FMX-175 packages those target checks into future required branch-protection
contexts:

| Future context | Backing root entrypoint | Activation |
|---|---|---|
| `quality` | `pnpm check` or the accepted successor root script. It wraps Biome/format, typecheck, unit/domain/component/property smoke, contract checks and FMX-167 architecture-fitness checks through Nx affected targets. | Required only after the script, workflow and real targets exist and burn in green. |
| `e2e` | `pnpm test:e2e` or the accepted app-specific E2E root script. It runs Playwright critical journey/offline/PWA smoke with deterministic fixtures and traces. | Required only after the app exists and smoke flows are stable. |
| `security` | Future root security/SBOM script. It runs secret/dependency/SBOM/license evidence and emits release-grade artifacts when applicable. | Required only after the security script is real and fast enough for PR use. |

Non-core gates start as non-required/reporting, scheduled or release evidence:
`storybook`, `a11y`, `lighthouse`, `game-smoke`, `mutation`, `soak`,
save-forward compatibility and full browser/device matrices. A later PR may
promote one only after it satisfies the same burn-in rule. FMX-172's draft
mutation packet narrows that rule for Stryker: baseline first, release/nightly
proof before PR blocking and no standalone `mutation` branch-protection context.

## Flake policy

- Transient failures are retried in CI (`playwright.config.ts`
  `retries: 2`; Lighthouse CI collects multiple runs, default 3, and uses the
  configured assertion aggregation). This reduces noise; it does **not** lower
  any threshold or budget.
- A test that flakes is **fixed at its source** (stabilise the wait, remove
  the race) — never deleted, `.skip`-ed, or its assertion weakened to go
  green. Weakening a gate to pass CI is explicitly forbidden
  (`.cursor/rules/99-safety.mdc`).

## Local ↔ CI parity

- Docs-phase local parity is the active Lefthook `pre-push` job
  `pnpm docs:check` plus manual `node scripts/status-consistency-check.mjs`
  when ADR/GDDR status or binding semantics change.
- Code-phase local parity remains target-only until bootstrap creates real
  app/package paths and code scripts. Do not describe nonexistent Biome, Nx,
  lint-staged or code-test hooks as active.
- Use the pinned toolchain in the repo. As of FMX-198, active docs-phase
  tooling still pins pnpm 11.7.0, but source checks observe 11.8.0 as current
  stable; update is pending Nico D1 in
  [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]].
  Future code bootstrap still re-checks tool versions before adding workspace
  dependencies.

## Override policy (utmost unusual only)

Merging with a red required check is allowed **only** when *all* hold:

1. The failure is **provably not caused by the PR** and is **not fixable
   within it** (e.g. an inherited `main`-wide regression in unrelated code).
2. A tracked issue exists for the real fix with an owner and a target, and
   is linked in the PR.
3. Written justification in the PR description under a **`Risk / rollout`**
   heading, plus the **`override:ci`** label.
4. **Nico signs off** in the PR (architecture/branch-protection trade-offs
   escalate to Nico per `.cursor/rules/99-safety.mdc`).
5. Follow-up to restore green is the **next** prioritised work, not "later".

Routine reds (your bug, flake, broken job, lint) are **never** overridden —
they are fixed.

## Branch protection

Docs-phase branch protection requires docs checks only:

- `docs-check`
- `linear-id`

FMX-181 adds an active repository ruleset mirror for the default branch:

- ruleset ID `17748728`, `FMX-181 main docs-phase protection mirror`;
- pull request required before updating `main`;
- branch deletion and non-fast-forward pushes blocked;
- linear history required;
- required checks `linear-id` + `docs-check`;
- 0 required reviews and no CODEOWNER review during docs phase;
- Nico / `EtroxTaran` is the only bypass actor, and bypass mode is
  pull-request-only.

The older classic `main` branch protection intentionally remains active during
the migration. Until a later issue retires it, agents must inspect both the
ruleset and classic protection when diagnosing a blocked merge.

Code-phase protection is target-only until the bootstrap creates and proves the
scripts/workflows. When activated, required contexts must map to real repo
scripts and ADR-0044's CODEOWNER-review rule for code paths.

FMX-175 fixes the target required context package as `quality`, `e2e` and
`security`. Bootstrap must first create the backing scripts/workflows as
non-required checks, prove them green on real PR evidence and only then update
branch protection. Do not list `cursor-smoke`, `configured` or standalone
`lighthouse` as required contexts.

## Current state

The repo is docs-vault-only. Code-CI, app e2e, Storybook, Biome/Nx code hooks
and app/package workspace gates are target-only until the code-phase transition
checklist is green. FMX-176 has restored docs-phase local parity with a
Lefthook `pre-push` docs gate. FMX-181 has activated the docs-phase ruleset
mirror; FMX-175 defines the future code-CI required context contract; FMX-179
tracks workspace bootstrap; FMX-167 defines the future architecture-fitness
subgate inside `quality`; FMX-172 prepares the decision-pending Stryker
mutation subgate; FMX-195 refreshed the active pnpm pin to 11.7.0.

## Related

- [[../10-Architecture/10-Quality]] — arc42 quality view this enforces
- [[agent-workflow-pattern]] — review phases · [[code-phase-dod-transition-contract]] — phase gate · [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] — toolchain
- [[../60-Research/code-ci-pipeline-2026-06-15]] — FMX-175 code-CI context
  research · [[../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
  — accepted D1-D4 packet
- [[../60-Research/branch-protection-codeowner-activation-2026-06-16]] —
  FMX-181 ruleset/CODEOWNER activation research ·
  [[../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
  — accepted Stage 0 ruleset mirror packet
- [[../40-Quality/architecture-fitness-function]] — FMX-167 future `quality`
  subgate · [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  — accepted architecture-fitness ADR
- [[../40-Quality/stryker-mutation-testing-gate]] — FMX-172 future mutation
  subgate proposal · [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]]
  — draft Stryker mutation ADR
- [[../00-Index/Current-State]] — live status · [[deployment-dokploy]] — gate before deploy
