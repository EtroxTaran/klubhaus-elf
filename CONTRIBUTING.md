# Contributing

## Workspace layout

pnpm monorepo (Node 22, pnpm 11.1.2). TypeScript strict everywhere.

- `apps/web` — React + TanStack Start + Vite + Tailwind v4 PWA
- `packages/ui` — shared shadcn/ui component library
- `packages/match-engine` — pure-TS match simulation (no deps)
- `packages/game-data` — game data & constants
- `packages/db-schema` — Zod schemas for SurrealDB

## TDD policy

Red → green → refactor. Any new logic in `match-engine`, `db-schema`, or
`game-data` starts with a **failing test** before implementation. Pure
functions should get `fast-check` property tests in addition to
example-based tests. UI behaviour is covered with React Testing Library;
end-to-end flows with Playwright in `tests/e2e`.

## Coverage contract

Enforced per-file by `vitest.config.ts` (`perFile: true`, `autoUpdate: false`):

| Scope                     | Lines | Functions | Branches |
| ------------------------- | ----- | --------- | -------- |
| default (incl. apps/web)  | 85%   | 85%       | 75%      |
| `packages/match-engine`   | 100%  | 100%      | 100%     |
| `packages/db-schema`      | 100%  | 100%      | 100%     |
| `packages/game-data`      | 95%   | 95%       | 90%      |

Excluded from thresholds (framework wiring, no unit-testable logic):
TanStack routes, `apps/web/src/server.ts`, `sw/**`, `workers/**`,
`scripts/**`, route tree, configs, `*.d.ts`, test files. These are
intentional — coverage there would measure boilerplate, not behaviour.

Line coverage proves code ran, not that assertions are meaningful.
`match-engine` and `db-schema` are additionally guarded by **mutation
testing** (Stryker) — see below.

## Mutation testing

`stryker.config.json` mutates `packages/match-engine` and
`packages/db-schema`. Break threshold starts at 70 and is raised to 80
once the first nightly baseline is established. Run locally with
`pnpm mutation` (or `pnpm mutation:incremental` for fast re-runs).

## Static analysis

- **Biome** (maximal ruleset) is the single linter + formatter authority.
  `.editorconfig` only mirrors it for editor UX.
- Suppress a Biome rule only via a scoped `overrides` entry in
  `biome.jsonc`, and every override **must** carry a `// reason:` comment.
  Never disable a rule globally.
- **knip** — no unused files/exports/dependencies.
- **madge** + Biome `noImportCycles` — no circular imports.
- **Semgrep OSS** — security SAST (accountless, CI only).

## Local gate commands

```bash
pnpm lint            # biome check
pnpm lint:fix        # biome check --write
pnpm format:check    # biome format (no write)
pnpm typecheck       # full TS project build
pnpm test            # vitest + coverage (enforces thresholds)
pnpm test:watch      # vitest watch mode (TDD loop)
pnpm knip            # unused code/deps
pnpm madge           # circular dependency check
pnpm mutation        # Stryker mutation testing
pnpm semgrep         # security SAST (requires semgrep installed)
```

Per-package: `pnpm --filter @soccer-manager/match-engine test`.

## Commits

Conventional Commits, enforced by commitlint on `commit-msg`. Lefthook
runs Biome + typecheck on `pre-commit` and knip + madge on `pre-push`.
