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
- Service worker lives in `src/workers/`; the bootstrap shell registers it through `apps/web/public/sw-register.js` until interactive client hydration is introduced.
- shadcn primitives in `src/components/ui/**` are generated; update them with shadcn tooling.

## Database & Migrations

- Schemas in `db/schema.surql` and package mirrors in `packages/db-schema`.
- Migrations are forward-only and idempotent (`DEFINE ... IF NOT EXISTS`).
- Type generation runs in CI; never commit stale generated types.

## PWA Rules

- Workbox generates the production service worker via `apps/web/scripts/build-pwa.mjs`: stale-while-revalidate for assets, network-first for routes, never cache POST/PUT/DELETE. Background Sync for offline mutations is future work. vite-plugin-pwa is deferred until TanStack Start SSR build compatibility is resolved.
- Game state lives in IndexedDB via Dexie.js - never localStorage.
- Test offline with `await context.setOffline(true)`. Install-prompt testing is unsupported
  in Playwright; use Lighthouse `installable-manifest` audit in CI.

## Task Tracking

Linear is the operational task tracker. Use project `soccer-manager — Research & Architecture` for Phase 1 research, Phase 2 ADRs, and seed backlog work. Agents must comment progress, blockers, PR links, and final Vault paths on the Linear issue before marking it done. The docs vault remains the durable knowledge base.

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

## Cursor Cloud specific instructions

### Services overview

| Service | How to start | Port |
|---|---|---|
| TanStack Start dev server | `pnpm dev` | 3000 |
| SurrealDB (in-memory) | `sudo dockerd &>/dev/null & sleep 2 && sudo docker compose -f docker-compose.dev.yml up -d surrealdb` | 8000 |

### Gotchas

- **Docker requires sudo** in the Cloud VM. The daemon isn't auto-started; run `sudo dockerd` before any `docker compose` commands.
- **`pnpm typecheck` builds `apps/web` first** (via `pnpm --filter @soccer-manager/web build && tsc --build`). This is intentional—TanStack Start generates route types during build.
- **E2e tests build and preview automatically.** Playwright's `webServer` config runs `pnpm build && vite preview --port 3000`. Stop any running dev server on port 3000 before `pnpm test:e2e`.
- **`db:migrate` is a placeholder.** It only prints a message; no actual migration runs yet.
- **`.env` file** is needed at root. Copy from `.env.example` (`cp .env.example .env`). Default credentials: `root`/`root` for SurrealDB on localhost:8000.
- **Playwright browsers:** Install with `npx playwright install --with-deps chromium webkit` (both chromium and mobile-safari/webkit are tested).
- Standard lint/test/build commands are documented in the Setup and Build & Test sections above.
