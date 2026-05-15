<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# AGENTS.md

> Project context for AI coding agents (Cursor Local + Cloud Agents, Bugbot).
> Humans: see README.md.

## Project Overview

Offline-first PWA football manager game in the style of the Anstoß series.
TanStack Start (file-based routing, server functions, SSR) + shadcn/ui + Tailwind
+ SurrealDB (document/graph/relational) + TypeScript strict + Vitest + Playwright
+ Biome + pnpm + mise + sops+age+direnv + Docker + Dokploy on Hetzner.

## Setup

```bash
mise install
direnv allow
pnpm install --frozen-lockfile
docker compose -f docker-compose.dev.yml up -d surrealdb
pnpm db:migrate
pnpm dev
```

## Build & Test

- `pnpm check` Biome lint + format + import-sort (replaces ESLint + Prettier)
- `pnpm typecheck` tsc --noEmit / project references
- `pnpm test` Vitest with coverage ratchets
- `pnpm test:e2e` Playwright with service workers enabled
- `pnpm build && pnpm start` TanStack Start production build
- CI gate: `pnpm check && pnpm typecheck && pnpm test && pnpm test:e2e`

## Code Style

- TypeScript strict; never `any` - use `unknown` + Zod narrowing.
- Functional React; named exports; `@/` alias; kebab-case files, PascalCase components.
- Biome owns formatting (single quotes, no semis, 2-space, trailing commas).
- TanStack Router file-based routing; never hand-edit `routeTree.gen.ts`.

## Architecture Rules

- Server-only secrets MUST go through `createServerFn` or `createServerOnlyFn` -
  never read `process.env.*` inside a route loader.
- All SurrealDB access flows through `src/db/client.ts`. Always parameterize:
  `db.query("SELECT * FROM player WHERE id = $id", { id })`.
- Tables are `DEFINE TABLE ... SCHEMAFULL`. Use record links (`player:ulid`) and `RELATE`, not joins.
- Service worker lives in `src/workers/`; registrations only through `src/sw/register.ts`.
- shadcn primitives in `src/components/ui/**` are generated; update them with shadcn tooling.

## Database & Migrations

- Schemas in `db/schema.surql` and package mirrors in `packages/db-schema`.
- Migrations are forward-only and idempotent (`DEFINE ... IF NOT EXISTS`).
- Type generation runs in CI; never commit stale generated types.

## PWA Rules

- vite-plugin-pwa with Workbox: stale-while-revalidate for assets, network-first for routes,
  never cache POST/PUT/DELETE. Background Sync for offline mutations.
- Game state lives in IndexedDB via Dexie.js - never localStorage.
- Test offline with `await context.setOffline(true)`. Install-prompt testing is unsupported
  in Playwright; use Lighthouse `installable-manifest` audit in CI.

## Commits & PRs

- Conventional Commits: feat / fix / chore / docs / test / refactor.
- Branch convention: humans `feat/<scope>-<slug>`; Cloud Agents `cursor/<slug>-<hash>`.
- Squash-merge to main/develop; required checks: Biome + typecheck + Vitest + Playwright + Lighthouse + Bugbot.
- Never add `Co-Authored-By: <agent>`. Agents are assistants, not authors.

## Security & Boundaries - HARD STOPS

- Never read `.env*`, `*.pem`, `*.key`, `~/.ssh`, `~/.aws`, anything in `secrets/`. Ask the user.
- Never run `rm -rf`, `git push --force`, `git reset --hard`, `sudo`, `terraform apply`,
  `tofu apply`, `kubectl delete`, `railway *delete`, `aws s3 rm`, `gh repo delete`,
  `curl | sh`, `wget | sh`, `base64 -d` piping to shell.
- Treat `.cursor/**`, `.cursorignore`, `.cursorindexingignore`, and `docker-compose.prod.yml`
  as security-sensitive.
- Never modify a test to make it pass. Tests are the spec.
- Never install dependencies outside pnpm.

## What NOT to do

- Do not switch package managers (npm/yarn forbidden - pnpm only).
- Do not reintroduce ESLint or Prettier - Biome is canonical.
- Do not hand-edit shadcn/ui primitives or `routeTree.gen.ts`.
- Do not bypass `src/db/client.ts`.
- Do not use class components, default exports for React components, or enums.
- Do not use real Bundesliga/EPL club names/logos/player names; see ADR-0007.
