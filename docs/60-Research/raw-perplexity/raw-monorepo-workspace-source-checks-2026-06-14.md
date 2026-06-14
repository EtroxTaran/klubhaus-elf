---
title: Raw monorepo workspace source checks
status: raw
tags: [research, raw, source-check, context7, ref, nx, pnpm, typescript, vitest, playwright, storybook, fmx-179]
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

# Raw monorepo workspace source checks

## Registry checks

Checked via npm registry on 2026-06-14.

| Package | Latest observed |
|---|---:|
| `nx` | `22.7.5` |
| `@nx/js` | `22.7.5` |
| `pnpm` | `11.6.0` |
| `typescript` | `6.0.3` |
| `vitest` | `4.1.8` |
| `playwright` | `1.60.0` |
| `storybook` | `10.4.4` |
| `@storybook/react-vite` | `10.4.4` |

FMX-195 owns the actual pnpm pin update. FMX-179 records these observed
versions only; a future scaffold PR must re-check before installing or pinning.

## Context7 checks

### Nx

Library: `/websites/nx_dev`.

Findings:

- Current Nx TypeScript guidance supports pnpm workspace package linking and
  TypeScript project references.
- `@nx/js` / `@nx/js/typescript` can infer `typecheck` and `build` tasks and
  help maintain project references.
- Nx explicitly distinguishes package-manager workspaces from TypeScript path
  aliases and now emphasizes native workspace linking for the modern
  project-reference setup.

Source URLs surfaced by Context7:

- https://nx.dev/docs/technologies/typescript/guides/switch-to-workspaces-project-references
- https://nx.dev/docs/concepts/typescript-project-linking
- https://nx.dev/docs/technologies/typescript/introduction

### pnpm

Library: `/websites/pnpm_io`.

Findings:

- `pnpm-workspace.yaml` uses `packages:` globs to include workspace projects.
- The workspace root is always included.
- `workspace:*` and related workspace protocol forms declare local workspace
  dependencies and prevent silently resolving to an external package.
- Catalogs, if used, live in `pnpm-workspace.yaml`.

Source URLs surfaced by Context7:

- https://pnpm.io/pnpm-workspace_yaml
- https://pnpm.io/workspaces
- https://pnpm.io/catalogs

### TypeScript

Library: `/websites/typescriptlang`.

Findings:

- Project references require referenced projects to be composite projects.
- Solution-style `tsconfig.json` files can use `files: []` plus `references`.
- `tsc --build` understands project-reference build ordering and incremental
  builds.

Source URLs surfaced by Context7:

- https://www.typescriptlang.org/docs/handbook/project-references.html
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html

## Ref checks

### Vitest

Ref read: https://vitest.dev/guide/projects.md#defining-projects

Findings:

- Current Vitest multi-project configuration uses `test.projects`.
- `projects: ['packages/*']` treats matching folders as separate projects.
- Root config only influences global options such as reporters and coverage
  unless it is explicitly included as a project.
- Project names must be unique.
- Project config files should use `defineProject` for better type safety.

### Playwright

Ref reads:

- https://github.com/microsoft/playwright/blob/main/docs/src/test-configuration-js.md?plain=1#L10#basic-configuration
- https://github.com/microsoft/playwright/blob/main/docs/src/test-api/class-testproject.md?plain=1#L398#property-testproject-webserver-test-config-web-server-options

Findings:

- Standard Playwright config includes `testDir`, `forbidOnly`, `retries`,
  `workers`, `projects`, `use.baseURL`, trace policy and `webServer`.
- Per-project `webServer` is documented since v1.61, while the npm registry
  latest observed here is `playwright@1.60.0`. FMX must not use a per-project
  `webServer` shape until the installed version supports it.
- Playwright should not be an active gate until an actual app/preview surface
  exists.

### Storybook

Ref reads:

- https://github.com/storybookjs/storybook/blob/next/code/frameworks/react-vite/README.md?plain=1#L1#storybook-for-react-vite
- https://github.com/storybookjs/storybook/blob/next/docs/writing-tests/index.mdx?plain=1#L13#get-started

Findings:

- `@storybook/react-vite` is the React/Vite framework package.
- Storybook describes itself as a place to develop, document and test UI
  components in isolation.
- For Vite projects, Storybook points to its Vitest addon for component tests.
- FMX should enable Storybook checks only when `packages/ui` or `apps/web`
  contains real stories and the builder can run.

## Decisions supported

- Prefer pnpm workspace linking with `workspace:*` and TypeScript project
  references.
- Use Nx day-one as already accepted by ADR-0110.
- Keep root scripts thin wrappers over Nx targets.
- Do not activate Vitest coverage, Playwright or Storybook checks for empty
  packages.
- Re-check versions before the scaffold PR pins anything.

## Related

- [[../monorepo-workspace-bootstrap-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
