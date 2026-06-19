---
title: Code-Phase Definition of Done Transition Contract
status: current
tags: [implementation, process, ci, dod, monorepo, nx, architecture-fitness, rulesets, branch-protection, codeowners, lefthook, local-parity, fmx-167, fmx-176, fmx-180, fmx-181, fmx-198]
created: 2026-06-14
updated: 2026-06-19
type: implementation
binding: true
related:
  - [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[agent-workflow-pattern]]
  - [[ci-and-review-process]]
  - [[../40-Quality/architecture-fitness-function]]
  - [[mvp-implementation-roadmap]]
  - [[monorepo-workspace-bootstrap-plan]]
  - [[../10-Architecture/09-Design-System]]
  - [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]
  - [[../60-Research/pnpm-tooling-currency-2026-06-15]]
  - [[../60-Research/tooling-currency-sweep-2026-06-15]]
  - [[../60-Research/local-parity-lefthook-2026-06-17]]
  - [[../60-Research/code-ci-pipeline-2026-06-15]]
  - [[../60-Research/branch-protection-codeowner-activation-2026-06-16]]
  - [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
  - [[../60-Research/version-pin-audit-2026-06-19]]
  - [[../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
  - [[../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
  - [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]]
  - [[../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
  - [[../40-Execution/fmx-176-local-parity-decision-record-2026-06-17]]
  - [[../40-Execution/fmx-181-branch-protection-ruleset-activation-decision-record-2026-06-16]]
  - [[../40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
  - [[../40-Execution/fmx-198-version-pin-audit-decision-queue-2026-06-19]]
---

# Code-Phase Definition of Done Transition Contract

This note is the executable bridge between the current docs-vault-only repo and
the future code phase. ADR-0110 is the decision record; this note is the working
checklist agents use.

## Current repo inventory

As of 2026-06-17:

| Surface | Current fact | DoD consequence |
|---|---|---|
| Root scripts | `docs:check`, `docs:status-check`, `docs:export:notebooklm`, `docs:preview`, `sync:design`, `hooks:install`, `hooks:run:pre-push` | Only docs/design-vault scripts and the docs-phase hook wrapper can be active DoD today. |
| Missing root scripts | `check`, `typecheck`, `test`, `test:e2e`, Storybook/build scripts | These are target-only until bootstrap creates them. |
| Workspace layout | `pnpm-workspace.yaml` exists only for `allowBuilds.lefthook: true`; no `apps/`, no `packages/`, no package globs, no `nx.json` | Package/app gates cannot be active today. FMX-179 still owns the real workspace scaffold. |
| CI workflows | `docs-check`, `linear-link-check`, post-merge cleanup, docs redeploy | Required checks are docs-phase checks only. |
| Tool pins | Node 22, pnpm 11.7.0, Lefthook 2.1.9, PostgreSQL 17 | FMX-198 found pnpm 11.7.0 stale vs 11.8.0, Node 22 supported but not current LTS, PostgreSQL 17 supported but not latest stable, and Lefthook 2.1.9 current. D1-D3 remain Nico-owned before active pin mutation. |

## Active docs-phase DoD

A docs-phase beat is done when all of the following are true:

| Gate | Required check |
|---|---|
| Linear/branch traceability | Issue is in `In Progress`; branch/worktree name includes `codex/fmx-<n>-<slug>`; PR first line is `Closes FMX-<n>` and includes `Agent: Codex`. |
| Decision gate | Any architecture, technology, gameplay, data model, API, scope or security decision has Nico approval recorded in a vault decision queue or accepted ADR/GDDR. |
| Research preservation | Raw research capture and synthesis are saved when external or tool research informed the outcome. |
| Vault reflection | Canonical docs, front-door indexes and session handoff are updated in the same PR. |
| Validation | `node scripts/docs-check.mjs` passes. |
| Local hook parity | `pnpm hooks:run:pre-push` passes, or the same `pnpm docs:check` command is run directly when hook execution is unavailable. |
| Status validation | `node scripts/status-consistency-check.mjs` passes when the PR changes ADR/GDDR status or `binding:` semantics. |
| CI expectation | GitHub required checks are `docs-check` + `linear-id`; ruleset `17748728` mirrors the docs-phase `main` protection while classic protection remains active; docs/low-risk PRs auto-merge when green per ADR-0044. |

The active docs-phase DoD must not require commands or paths that do not exist
in the repository.

## Target code-phase DoD

After the transition checklist below is green, code beats add these gates:

| Gate | Target check |
|---|---|
| Root quality entrypoint | `pnpm check` wraps the code-phase quality graph. |
| Type safety | `pnpm typecheck` runs TypeScript project references through Nx targets. |
| Unit/property/contract tests | `pnpm test` runs the Nx test graph for affected or required projects. |
| Architecture fitness | Future `quality` includes `dependency-cruiser` import/path/cycle checks plus custom TypeScript/SQL scanner checks for Drizzle schema, relation/FK, query join and migration boundary violations. |
| E2E/app checks | `pnpm test:e2e` or the accepted app-specific script runs for app/flow changes. |
| UI showcase | Storybook is built/checked for touched UI projects; every changed atom/composite/layout/screen has a colocated story. |
| Code CI | ADR-0044/FMX-175/FMX-181 code-phase contexts `quality`, `e2e` and `security` are required only after real scripts/workflows exist, burn in green and CODEOWNER review applies to code paths. |
| Vault delta | Behaviour, architecture, operations and user-facing changes still update the vault in the same PR. |

Root scripts remain the public contract for humans and CI. Internally, they use
Nx targets so the monorepo has a project graph, task graph, affected execution
and cacheable outputs from the first code-phase scaffold.

## Code-phase transition checklist

Code-phase work is inactive until a bootstrap/foundation PR completes this list:

- Workspace scaffold exists: `pnpm-workspace.yaml` declares real package globs,
  `nx.json`, real `apps/web` and initial `packages/*` roots. The FMX-176
  `allowBuilds.lefthook` policy file alone is not enough.
- Nx is installed and pinned exactly at the current stable version verified at
  bootstrap time. FMX-198 observed `nx@23.0.0` as latest stable on
  2026-06-19, which is a major bump from the June 14 `22.7.5` observation; the
  bootstrap beat must re-check and treat adoption/migration as HITL.
- Root scripts exist and are executable: `check`, `typecheck`, `test`, app e2e
  script, Storybook/build script and docs scripts. They cannot be placeholders
  that silently skip required targets.
- Each initial app/package has a declared owner/module note and the relevant Nx
  targets. Missing targets are explicit and justified by package type.
- TypeScript solution/project references are wired for packages that compile
  TypeScript.
- CI invokes repo scripts as thin triggers, not duplicated GitHub-only logic.
- ADR-0044/FMX-175 required contexts (`quality`, `e2e`, `security`) are updated
  only after the corresponding scripts and workflows are green on real PR
  evidence.
- FMX-181 Stage 0 ruleset mirror accumulates real PR evidence before a later
  tracked issue retires redundant classic branch protection settings before or
  alongside code-phase hardening.
- One required approval plus CODEOWNER review is activated only after real code
  paths exist, CODEOWNERS patterns are validated and the backing
  `quality`/`e2e`/`security` checks have green evidence.
- FMX-167 architecture-fitness prerequisites exist before the gate is made
  hard: context owner metadata, public-entrypoint metadata, table ownership
  metadata, real scanner scripts and violation fixtures for imports, joins,
  FKs and ownerless shared tables.
- CODEOWNER/review routing for code paths is active before code PRs can merge.
- The design-system implementation paths named in
  [[../10-Architecture/09-Design-System]] exist and Storybook can run against
  them.
- `agent-workflow-pattern`, `ci-and-review-process`, this note and
  [[../10-Architecture/09-Design-System]] are updated in the same bootstrap PR
  to mark code-phase gates active.

## Related Linear routing

- FMX-179 owns the monorepo/workspace bootstrap shape; accepted
  [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  and [[monorepo-workspace-bootstrap-plan]] are the binding scaffold contract
  after Nico approved D1-D7 on 2026-06-19.
- FMX-175 owns the accepted future code-CI context package and stale D-002
  cleanup: active docs checks stay `docs-check` + `linear-id`; future code
  required contexts are `quality`, `e2e` and `security` after bootstrap and
  burn-in.
- FMX-181 owns the accepted GitHub ruleset migration posture: Stage 0 active
  ruleset mirror now, classic branch protection retained until verified, Nico
  PR-bypass only and CODEOWNER/review enforcement deferred to code evidence.
- FMX-176 owns the accepted docs-phase Lefthook/local-parity restoration:
  `pre-push` -> `pnpm docs:check`, manual `docs:status-check`, and no
  Biome/Nx/lint-staged/code hooks until real paths and scripts exist.
- FMX-167 owns the accepted future architecture-fitness quality subgate:
  no cross-context internal imports, no shared tables, no cross-context joins
  and no cross-context relations/FKs after scanner implementation and burn-in.
- FMX-195 refreshed the active pnpm pin from 11.1.2 to 11.7.0 after June 15
  source checks. Future code bootstrap still re-checks current tool versions
  before adding workspace dependencies.
- FMX-168 owns the accepted Stack Currency Ledger and wider tooling-currency
  decision packet. It records the PostgreSQL 17 active pin vs PostgreSQL 18.x
  current-stable drift, TanStack/React/TypeScript/build-tool compatibility
  checks and future automation boundary. Ledger policy and PostgreSQL target
  changes are binding after Nico approved D1-D5 on 2026-06-19 in
  [[../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15]].

## Related

- [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[agent-workflow-pattern]]
- [[ci-and-review-process]]
- [[../40-Quality/architecture-fitness-function]]
- [[mvp-implementation-roadmap]]
- [[monorepo-workspace-bootstrap-plan]]
- [[../10-Architecture/09-Design-System]]
- [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]
- [[../60-Research/pnpm-tooling-currency-2026-06-15]]
- [[../60-Research/tooling-currency-sweep-2026-06-15]]
- [[../60-Research/code-ci-pipeline-2026-06-15]]
- [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
- [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
