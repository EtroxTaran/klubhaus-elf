---
title: Monorepo Workspace Bootstrap Plan
status: draft
tags: [implementation, plan, monorepo, workspace, nx, pnpm, code-phase, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: implementation
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
  - [[code-phase-dod-transition-contract]]
  - [[mvp-implementation-roadmap]]
  - [[../10-Architecture/09-Design-System]]
  - [[../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
---

# Monorepo Workspace Bootstrap Plan

This is the exact follow-up scaffold plan proposed by FMX-179. It is
non-binding until Nico approves
[[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap|ADR-0114]]
and its decision queue.

No code, workspace config or dependency installation is performed by this note.

## Preconditions

- ADR-0114 decision queue approved or amended by Nico.
- `main` up to date.
- Linear issue for the scaffold follow-up claimed in `In Progress`.
- Current docs and npm registry versions re-checked for Nx, pnpm, TypeScript,
  Vitest, Playwright, Storybook and any package actually installed.
- FMX-195 status checked before touching the pnpm pin.

## Scaffold patch sequence

1. Add workspace root plumbing:
   - `pnpm-workspace.yaml` with `apps/*` and `packages/*`.
   - Root package metadata using exact package manager pin approved for the
     scaffold.
   - Root scripts as thin Nx entrypoints only when each script runs a real
     target.
2. Add Nx/TypeScript project infrastructure:
   - `nx.json` with `@nx/js/typescript` support.
   - Solution-style root `tsconfig.json`.
   - Shared compiler options in the accepted base config shape.
   - Project references generated/synchronized through Nx tooling.
3. Create only real initial project roots:
   - `apps/web` only if it contains a real app shell and runnable typecheck or
     build target.
   - `packages/ui` only if it contains real exported DS source; Storybook only
     if at least one story can build.
   - `packages/db` only if it contains real Drizzle/gateway source.
   - `packages/db-schema` only if the mirror generator/output contract exists.
   - `packages/game-data` only if it contains real schema/data validation
     source.
   - `packages/match-contract` only if it contains real contract types and
     contract tests.
4. Do not create:
   - `packages/match-engine` before the accepted match-engine runtime slice;
   - any of the 28 bounded-context package roots before that context has real
     source and tests/targets;
   - empty package shells to satisfy future path references.
5. Add boundary enforcement:
   - package root/public export import rule;
   - no deep imports into another package's `src/**`;
   - Nx tags for `type:app`, `type:ui`, `type:platform`, `type:contract`,
     `type:data`, `type:domain` and `scope:<context-or-module>`;
   - package-specific lint/test gates only where the package exists.
6. Add CI in phases:
   - docs checks stay required throughout;
   - workspace install/sync/typecheck becomes required only after green on the
     real scaffold PR;
   - Vitest runs only projects with real tests;
   - Storybook runs only when UI stories exist;
   - Playwright runs only against a real app/preview surface;
   - coverage thresholds activate per package after meaningful product logic
     and tests exist.
7. Update vault in the same PR:
   - flip ADR-0114 to `accepted` only if Nico approved the queue;
   - update ADR-0019 implementation convention from `src/domain/<context>` to
     workspace package facades;
   - apply the bounded-context-map package rule;
   - update module notes for every created app/package;
   - update AGENTS stale `@soccer-manager/*` examples if D6=A is approved;
   - update `code-phase-dod-transition-contract`, `ci-and-review-process`,
     `agent-workflow-pattern`, `09-Design-System` and roadmap wording to mark
     only the actually-created gates active.

## Proposed bounded-context-map patch

Do **not** apply this until ADR-0114 is accepted.

```md
## Workspace package rule

ADR-0114 maps every bounded context to a future `@klubhaus-elf/<context-slug>`
workspace package. A package root exists only once that context has real source,
real targets and a module note. Empty context packages are forbidden. ADR-0089
clusters remain cognitive/navigation aids and are not physical code boundaries.
```

Then add an appendix linking to the context package catalog in
[[../60-Research/monorepo-workspace-bootstrap-2026-06-14]].

## Done when the follow-up scaffold lands

- Workspace files exist and all root scripts named in the active DoD are real.
- `node scripts/docs-check.mjs` still passes.
- New code-phase scripts pass locally and in CI.
- No package root is empty or only a placeholder.
- Every created package/app has a module note and owner metadata.
- Required GitHub checks match only scripts that exist and pass.
- Linear and PR metadata follow ADR-0045/ADR-0044.

## Related

- [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
- [[code-phase-dod-transition-contract]]
- [[mvp-implementation-roadmap]]
- [[../10-Architecture/09-Design-System]]
- [[../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
