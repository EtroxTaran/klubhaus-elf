---
title: ADR-0110 Code-Phase Definition of Done Transition Contract
status: accepted
tags: [adr, architecture, process, ci, dod, monorepo, nx, fmx-180, accepted]
created: 2026-06-14
updated: 2026-06-14
type: adr
binding: true
amends:
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0045-issue-first-worktree-workflow]]
supersedes:
superseded_by:
related:
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
  - [[../../30-Implementation/agent-workflow-pattern]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/mvp-implementation-roadmap]]
  - [[../../10-Architecture/09-Design-System]]
  - [[../../60-Research/code-phase-dod-transition-contract-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-code-phase-dod-monorepo-gates-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-code-phase-dod-game-production-gates-2026-06-14]]
  - [[../../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
---

# ADR-0110: Code-Phase Definition of Done Transition Contract

## Status

accepted

> **Decided live 2026-06-14 (FMX-180).** Nico approved the recommended D1-D4
> packet: phase-split Definition of Done, Nx as the day-one code-phase task
> runner, existing `apps/web` and `packages/*` references kept as target-only
> until a bootstrap PR creates them, and the pnpm currency mismatch routed to
> separate Backlog issue FMX-195. This ADR amends ADR-0044/ADR-0045 by making
> the post-reset docs-phase and future code-phase gates explicit and executable.

## Date

- Drafted: 2026-06-14 (FMX-180)
- D1-D4 confirmed + binding: 2026-06-14 (FMX-180)

## Context

The repository is currently docs-vault-only after the 2026-05-27 reset. The real
root `package.json` exposes `docs:check`, `docs:status-check`,
`docs:export:notebooklm`, `docs:preview` and `sync:design`. It does not expose
`check`, `typecheck`, `test`, `test:e2e`, `build-storybook` or any code-phase
script. The tree also has no `apps/`, no `packages/` and no `pnpm-workspace.yaml`.

ADR-0044 already says docs-phase requires `docs-check` + `linear-id`, while
code-phase later adds code checks and CODEOWNER review. However,
[[../../30-Implementation/agent-workflow-pattern]] and
[[../../30-Implementation/ci-and-review-process]] still described old code-phase
checks as if they were active today. The result was a non-executable Definition
of Done: the first code beat would be required to run commands and inspect paths
that do not exist.

FMX-180 closes that contract gap. It does not bootstrap the app or install code
tooling; it defines the executable transition rule that later bootstrap work must
satisfy.

## Options considered

### D1 - Definition-of-Done mode

| Option | Shape | Assessment |
|---|---|---|
| A. Single DoD now | Require code-phase checks immediately. | Rejected: would keep non-existent commands in the active DoD. |
| **B. Phase split** | Docs-phase DoD is active now; code-phase DoD is target-only until a transition checklist is green. | **Accepted.** Keeps current work executable and makes the code-phase activation gate visible. |
| C. Code-only deferral | Remove code-phase DoD until app bootstrap. | Rejected: loses the contract for the first code beat. |

### D2 - Code-phase task runner baseline

| Option | Shape | Assessment |
|---|---|---|
| A. pnpm-only root scripts | Root scripts use `pnpm -r` / `--if-present` as the long-term orchestrator. | Simple, but weaker once FMX has many apps/packages, affected checks and cacheable targets. |
| **B. Nx day one** | Bootstrap code phase with Nx project graph/task graph/affected/caching; root pnpm scripts wrap Nx targets. | **Accepted.** Best fit for many bounded contexts and future CI speed. |
| C. Turborepo day one | Similar task graph/caching posture with Turborepo. | Viable alternative, but Nico selected Nx. |

### D3 - Target path gate

| Option | Shape | Assessment |
|---|---|---|
| A. Rewrite design/process docs to remove app paths | Avoid mentioning `apps/web` / `packages/*` until code exists. | Rejected: these paths are still the intended build target. |
| **B. Mark target-only** | Keep target paths, but explicitly inactive until bootstrap creates them. | **Accepted.** Preserves design memory without making missing paths an active gate. |
| C. Scaffold paths inside FMX-180 | Create placeholder app/package paths now. | Rejected: FMX-180 is a docs/process contract, not the monorepo bootstrap. |

### D4 - pnpm currency mismatch

| Option | Shape | Assessment |
|---|---|---|
| A. Bundle pnpm update into FMX-180 | Update `pnpm@11.1.2` to the current stable pin here. | Rejected for scope: this issue is the DoD contract. |
| **B. Separate issue** | Create a narrow Backlog issue for the pin update and keep FMX-180 focused. | **Accepted.** FMX-195 tracks the pnpm 11.6.0 update check. |
| C. Leave stale pin untracked | Do nothing. | Rejected by the tooling-currency policy. |

## Decision

Nico approved the recommended packet live on 2026-06-14:

- **D1 = B:** active Definition of Done is phase-split. Docs-phase work is done
  only against commands and checks that exist today. Code-phase requirements are
  target-only until the transition checklist in
  [[../../30-Implementation/code-phase-dod-transition-contract]] is satisfied.
- **D2 = B:** code-phase bootstrap uses **Nx day one** as the package/app task
  runner. Root `pnpm` scripts are still the human/CI entrypoints, but they wrap
  Nx targets rather than becoming an ad hoc long-term orchestrator.
- **D3 = B:** existing `apps/web`, `packages/*`, Storybook and design-system
  references remain the intended build target but are **inactive gates** until
  bootstrap creates the paths and scripts.
- **D4 = B:** the current pnpm pin mismatch is routed to FMX-195. FMX-180 does
  not change `package.json`, `.mise.toml` or toolchain pins.

## Active docs-phase DoD

Until the code-phase transition gate is green, docs/process/research beats use
this active DoD:

- Linear issue is claimed in `In Progress` before edits, with one issue, one
  worktree and one branch per ADR-0045.
- Durable research, decisions and process changes are saved in the vault in the
  same PR.
- `node scripts/docs-check.mjs` passes.
- `node scripts/status-consistency-check.mjs` also passes whenever a beat changes
  ADR/GDDR `status:` or `binding:` semantics.
- PR uses `Closes FMX-<n>`, has an `Agent:` line, and relies on docs-phase
  required checks `docs-check` + `linear-id`.

No docs-phase PR may require `pnpm check`, `pnpm typecheck`, `pnpm test`,
`pnpm test:e2e`, Storybook, `apps/web` paths or `packages/*` paths unless that
same PR is the accepted bootstrap that creates them and updates this contract.

## Code-phase activation gate

Code beats can start only after a dedicated bootstrap/foundation PR lands the
items listed in [[../../30-Implementation/code-phase-dod-transition-contract]]:

- `pnpm-workspace.yaml`, `nx.json` and exact pinned Nx packages;
- root scripts for `check`, `typecheck`, `test`, app e2e and Storybook/build
  targets, all runnable locally and in CI;
- real `apps/web` and `packages/*` project roots with module notes/ownership;
- code CI required checks mapped to ADR-0044's code-phase policy;
- design-system Storybook path and package names reconciled with real code.

The bootstrap PR must verify current stable tool versions again at the time of
implementation and pin exact versions. The npm registry reported
`nx@22.7.5` and `pnpm@11.6.0` on 2026-06-14; FMX-195 owned the pnpm update to
11.7.0. FMX-198 later observed `nx@23.0.0` and `pnpm@11.8.0` on
2026-06-19, so bootstrap must use the refreshed stack ledger and treat the Nx
major as HITL.

## Consequences

Positive:

- The active DoD no longer contains commands or paths that fail by construction.
- The future code-phase contract remains visible and testable before feature
  work starts.
- Nx is chosen early enough that package boundaries, affected checks and cache
  keys can shape the first workspace scaffold rather than being retrofitted.
- The design-system path memory is preserved without confusing target paths for
  current repository facts.

Costs / constraints:

- FMX-179 / code bootstrap must do real tool installation and script wiring
  before any feature code beat can claim code-phase DoD.
- FMX-175 and FMX-176 still own deeper code-CI and lefthook/local-parity cleanup.
- The pnpm pin remains unchanged in this PR by design; FMX-195 must refresh and
  apply that currency update separately.

## Related docs

- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../30-Implementation/agent-workflow-pattern]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../10-Architecture/09-Design-System]]
- [[../../60-Research/code-phase-dod-transition-contract-2026-06-14]]
- [[../../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
