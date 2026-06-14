---
title: "Code-phase DoD transition contract (FMX-180)"
status: current
tags: [research, synthesis, dod, monorepo, nx, ci, game-production, fmx-180]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-180
related:
  - [[raw-perplexity/raw-code-phase-dod-monorepo-gates-2026-06-14]]
  - [[raw-perplexity/raw-code-phase-dod-game-production-gates-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../30-Implementation/agent-workflow-pattern]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../10-Architecture/09-Design-System]]
  - [[../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
---

# Code-phase DoD transition contract (FMX-180)

## Scope

FMX-180 closes the mismatch between the post-reset docs-vault-only repository and
old code-phase Definition-of-Done wording. It defines what is executable now,
what is target-only until bootstrap, and which decisions must be carried into
the first code-phase foundation PR.

## Current repo facts

| Area | Current fact |
|---|---|
| Root package | `package.json` only exposes docs/design scripts: `docs:check`, `docs:status-check`, `docs:export:notebooklm`, `docs:preview`, `sync:design`. |
| Missing scripts | `check`, `typecheck`, `test`, `test:e2e`, Storybook/build code scripts. |
| Layout | No `pnpm-workspace.yaml`, no `apps/`, no `packages/`. |
| CI | `.github/workflows/` has docs-check/link/deploy workflows only. |
| Design system | [[../10-Architecture/09-Design-System]] correctly says `apps/web/src/*` is the intended build target and no app exists yet, but later story/showcase requirements needed an explicit activation guard. |
| Tool currency | Registry check on 2026-06-14 reported `nx@22.7.5` and `pnpm@11.6.0`; repo still pins `pnpm@11.1.2`, routed to FMX-195. |

## Evidence synthesis

| Research strand | Finding | FMX implication |
|---|---|---|
| Agile/DoD practice | A Definition of Done should be specific, measurable and objectively verifiable. | Active DoD cannot include commands or paths that do not exist. |
| Scrum/process improvement | Work the team cannot do every time should be visible as future/impediment work, not hidden inside the current DoD. | Code checks stay target-only until bootstrap makes them executable. |
| Game-production precedent | Pre-production/design docs, proof of concept, first playable and vertical slice are distinct gates. | Docs approval is not code readiness; first code phase needs tooling/pipeline first. |
| pnpm docs | Workspaces use `pnpm-workspace.yaml`; recursive scripts and `--if-present` are useful but script semantics matter. | A bare pnpm-only DoD can work briefly, but root scripts must be real and intentional. |
| TypeScript docs | Project references need `composite: true` and build mode handles dependent projects. | TypeScript project graph belongs in the bootstrap/foundation PR. |
| Nx/Turborepo docs | Monorepo runners model project/task graphs and cacheable/affected execution. | Nico selected Nx day one to avoid retrofitting the graph later. |

## Recommended and approved packet

Nico approved the recommended D1-D4 packet on 2026-06-14 by instructing
implementation of the selected plan.

| Axis | Decision | Rationale |
|---|---|---|
| D1 DoD mode | Phase split: docs-phase DoD active now, code-phase DoD target-only. | Keeps every active gate executable and preserves the future code contract. |
| D2 runner baseline | Nx day one for code phase; root `pnpm` scripts wrap Nx targets. | Supports bounded-context scale, affected checks and caching from the first scaffold. |
| D3 path gate | Keep `apps/web` / `packages/*` references as target-only until bootstrap. | Preserves design memory without making missing paths current requirements. |
| D4 pnpm mismatch | Route pnpm update separately to FMX-195. | Keeps FMX-180 focused and still tracks tooling currency. |

Accepted decision home: [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]].
Executable checklist: [[../30-Implementation/code-phase-dod-transition-contract]].
Decision record:
[[../40-Execution/fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]].

## Contract implications

- Docs-phase PRs run `node scripts/docs-check.mjs` and, when status/binding
  semantics change, `node scripts/status-consistency-check.mjs`.
- No docs-phase DoD requires `pnpm check`, `typecheck`, `test`, e2e, Storybook,
  `apps/web` or `packages/*`.
- The code-phase bootstrap must create workspace layout, Nx config, root scripts,
  CI mappings, code review routing and real design-system implementation paths
  before feature code can start.
- The first bootstrap beat must re-check latest stable tool versions before
  pinning. FMX-180 records 2026-06-14 facts only.

## Sources

- Raw captures:
  [[raw-perplexity/raw-code-phase-dod-monorepo-gates-2026-06-14]],
  [[raw-perplexity/raw-code-phase-dod-game-production-gates-2026-06-14]].
- Official tool docs:
  <https://pnpm.io/pnpm-workspace_yaml>,
  <https://pnpm.io/cli/run>,
  <https://www.typescriptlang.org/docs/handbook/project-references.html>,
  <https://nx.dev/docs/concepts/mental-model>,
  <https://turbo.build/repo/docs/core-concepts/package-and-task-graph>.

## Related

- [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[../30-Implementation/agent-workflow-pattern]]
- [[../30-Implementation/ci-and-review-process]]
- [[../10-Architecture/09-Design-System]]

