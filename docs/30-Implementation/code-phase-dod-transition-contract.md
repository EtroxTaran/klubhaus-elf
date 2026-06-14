---
title: Code-Phase Definition of Done Transition Contract
status: current
tags: [implementation, process, ci, dod, monorepo, nx, fmx-180]
created: 2026-06-14
updated: 2026-06-14
type: implementation
binding: true
related:
  - [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[agent-workflow-pattern]]
  - [[ci-and-review-process]]
  - [[mvp-implementation-roadmap]]
  - [[../10-Architecture/09-Design-System]]
  - [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]
  - [[../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
---

# Code-Phase Definition of Done Transition Contract

This note is the executable bridge between the current docs-vault-only repo and
the future code phase. ADR-0110 is the decision record; this note is the working
checklist agents use.

## Current repo inventory

As of 2026-06-14:

| Surface | Current fact | DoD consequence |
|---|---|---|
| Root scripts | `docs:check`, `docs:status-check`, `docs:export:notebooklm`, `docs:preview`, `sync:design` | Only docs/design-vault scripts can be active DoD today. |
| Missing root scripts | `check`, `typecheck`, `test`, `test:e2e`, Storybook/build scripts | These are target-only until bootstrap creates them. |
| Workspace layout | No `pnpm-workspace.yaml`, no `apps/`, no `packages/` | Package/app gates cannot be active today. |
| CI workflows | `docs-check`, `linear-link-check`, post-merge cleanup, docs redeploy | Required checks are docs-phase checks only. |
| Tool pins | Node 22, pnpm 11.1.2, PostgreSQL 17 | pnpm currency is tracked separately in FMX-195. |

## Active docs-phase DoD

A docs-phase beat is done when all of the following are true:

| Gate | Required check |
|---|---|
| Linear/branch traceability | Issue is in `In Progress`; branch/worktree name includes `codex/fmx-<n>-<slug>`; PR first line is `Closes FMX-<n>` and includes `Agent: Codex`. |
| Decision gate | Any architecture, technology, gameplay, data model, API, scope or security decision has Nico approval recorded in a vault decision queue or accepted ADR/GDDR. |
| Research preservation | Raw research capture and synthesis are saved when external or tool research informed the outcome. |
| Vault reflection | Canonical docs, front-door indexes and session handoff are updated in the same PR. |
| Validation | `node scripts/docs-check.mjs` passes. |
| Status validation | `node scripts/status-consistency-check.mjs` passes when the PR changes ADR/GDDR status or `binding:` semantics. |
| CI expectation | GitHub required checks are `docs-check` + `linear-id`; docs/low-risk PRs auto-merge when green per ADR-0044. |

The active docs-phase DoD must not require commands or paths that do not exist
in the repository.

## Target code-phase DoD

After the transition checklist below is green, code beats add these gates:

| Gate | Target check |
|---|---|
| Root quality entrypoint | `pnpm check` wraps the code-phase quality graph. |
| Type safety | `pnpm typecheck` runs TypeScript project references through Nx targets. |
| Unit/property/contract tests | `pnpm test` runs the Nx test graph for affected or required projects. |
| E2E/app checks | `pnpm test:e2e` or the accepted app-specific script runs for app/flow changes. |
| UI showcase | Storybook is built/checked for touched UI projects; every changed atom/composite/layout/screen has a colocated story. |
| Code CI | ADR-0044 code-phase checks are required and CODEOWNER review applies to code paths. |
| Vault delta | Behaviour, architecture, operations and user-facing changes still update the vault in the same PR. |

Root scripts remain the public contract for humans and CI. Internally, they use
Nx targets so the monorepo has a project graph, task graph, affected execution
and cacheable outputs from the first code-phase scaffold.

## Code-phase transition checklist

Code-phase work is inactive until a bootstrap/foundation PR completes this list:

- Workspace scaffold exists: `pnpm-workspace.yaml`, `nx.json`, real `apps/web`
  and initial `packages/*` roots.
- Nx is installed and pinned exactly at the current stable version verified at
  bootstrap time. The npm registry reported `nx@22.7.5` on 2026-06-14, but the
  bootstrap beat must re-check before pinning.
- Root scripts exist and are executable: `check`, `typecheck`, `test`, app e2e
  script, Storybook/build script and docs scripts. They cannot be placeholders
  that silently skip required targets.
- Each initial app/package has a declared owner/module note and the relevant Nx
  targets. Missing targets are explicit and justified by package type.
- TypeScript solution/project references are wired for packages that compile
  TypeScript.
- CI invokes repo scripts as thin triggers, not duplicated GitHub-only logic.
- ADR-0044 required checks are updated only after the corresponding scripts and
  workflows are green on a real PR.
- CODEOWNER/review routing for code paths is active before code PRs can merge.
- The design-system implementation paths named in
  [[../10-Architecture/09-Design-System]] exist and Storybook can run against
  them.
- `agent-workflow-pattern`, `ci-and-review-process`, this note and
  [[../10-Architecture/09-Design-System]] are updated in the same bootstrap PR
  to mark code-phase gates active.

## Related Linear routing

- FMX-179 owns the monorepo/workspace bootstrap shape.
- FMX-175 owns deeper code-CI cleanup and stale code-check narratives.
- FMX-176 owns lefthook/local-parity restoration.
- FMX-195 owns the pnpm 11.1.2 -> current stable pin update surfaced during
  FMX-180 research.

## Related

- [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[agent-workflow-pattern]]
- [[ci-and-review-process]]
- [[mvp-implementation-roadmap]]
- [[../10-Architecture/09-Design-System]]
- [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]

