---
title: Raw monorepo workspace tooling bootstrap
status: raw
tags: [research, raw, perplexity, monorepo, workspace, nx, pnpm, typescript, vitest, playwright, storybook, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../monorepo-workspace-bootstrap-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
  - [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
---

# Raw monorepo workspace tooling bootstrap

## Prompt

Research current practical guidance for scaffolding a new pnpm + Nx +
TypeScript project-references workspace with Vitest, Playwright and Storybook
targets for a docs-only repo transitioning into code. Include first foundation
PR contents, avoiding placeholder green checks, workspace linking vs TypeScript
path aliases, root scripts wrapping Nx, coverage gates for initially empty
packages, CI activation order and exact-version/currency cautions.

## Perplexity capture

The answer recommended establishing workspace plumbing and TypeScript
project-reference/Nx synchronization first, then activating code/test/coverage
gates only when real non-placeholder projects exist.

Key points preserved from the answer:

- Use package-manager workspaces and TypeScript project references as the
  foundation; avoid deep relative imports and avoid root `paths` as the primary
  linking strategy.
- Register Nx TypeScript support so typecheck/build targets can be inferred and
  project references can be kept synchronized.
- Root scripts should stay human/CI entrypoints but wrap Nx targets instead of
  embedding duplicated shell logic.
- Do not create no-op test, e2e or Storybook checks that pass against empty
  packages.
- Do not enforce coverage thresholds for packages with no meaningful source and
  test code.
- Activate CI in phases: install/sync/typecheck, then unit tests for real code,
  then Storybook for real UI, then Playwright for a real app surface, then
  coverage thresholds once the codebase has measurable surface.
- Re-check exact stable versions during the scaffold PR before pinning.

## Recommended scaffold sequence from capture

1. Add `pnpm-workspace.yaml` and workspace package declarations.
2. Add Nx and TypeScript project-reference plumbing.
3. Add `@nx/js/typescript` inference/sync support.
4. Create only real app/package roots with real source and targets.
5. Wire root scripts to Nx targets.
6. Add Vitest/Storybook/Playwright only where there is a target surface.
7. Activate CI required checks only after the matching script is green on a real
   PR.

## Source URLs returned

- https://nx.dev/docs/concepts/typescript-project-linking
- https://github.com/nrwl/nx/discussions/29099
- https://nx.dev/blog/new-nx-experience-for-typescript-monorepos
- https://www.npmjs.com/package/@monorepo-utils/workspaces-to-typescript-project-references
- https://youtrack.jetbrains.com/projects/WEB/issues/WEB-74252/Numerous-issues-with-Nx-monorepo-using-TypeScript-project-references

## Handling in synthesis

The source set is good for Nx/TypeScript direction but weak for Vitest,
Playwright and Storybook specifics. The companion source-check note adds
official Context7/Ref and npm-registry evidence before the recommendation uses
those tool names.

## Related

- [[../monorepo-workspace-bootstrap-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
