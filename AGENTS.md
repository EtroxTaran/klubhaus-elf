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

Offline-ready PWA football manager game in the style of the Anstoß series. The
current MVP is hybrid-online and Create-a-Club Roguelite first; selective
offline-first singleplayer, Manage-a-Club Career, export/import and
server-authoritative multiplayer are planned future capabilities.

TanStack Start (file-based routing, server functions, SSR) + React + shadcn/ui +
Tailwind + the TanStack data layer (Query, Table, Virtual, Form) + Zustand v5
(client/sim state) + Zod 4 + **PostgreSQL 17 + Drizzle ORM** (system of record) +
Dexie/IndexedDB (client cache/drafts) + TypeScript strict + Vitest + Playwright +
fast-check + Stryker + Biome + pnpm + mise + sops+age+direnv + Docker + Dokploy on
Hetzner. Match rendering is **Canvas 2D** (Three.js/React Three Fiber is a
post-MVP presentation layer, never match-authoritative); realtime is **SSE for the
MVP → Centrifugo at scale**, behind a transport interface. **SurrealDB is deferred
— it is not the database** — and may return post-launch only as an additive
realtime/graph engine behind that interface (see ADR-0021).

## Workflow Pattern

**Authoritative:** `docs/30-Implementation/agent-workflow-pattern.md` (vault doc,
also bound via `.cursor/rules/80-workflow-vault.mdc`). Read it before any beat.

Every beat follows one loop: pick a small Linear beat → confirm understanding
(ask the human if anything is unclear — never guess or work around) → plan →
implement using the **design system only** (no agent-invented style/layout) →
reflect the change in the Obsidian vault in the **same PR** → check it against
the knowledge base (contradiction → escalate; extension → update docs) → draft
PR → review → merge green. Tasks stay small, modular, and future-proof; no
decision may foreclose evolution. Knowledge-base drift or unclear architecture
is a **stop condition**: open a Linear issue tagged for Nico, mark the beat
Blocked, and halt — do not paper over it.

## Vault Memory

The `docs/` directory is the Obsidian vault and durable project memory. This file
is only an orchestrator; keep durable project context in vault notes.

Agent entry chain:

1. `docs/00-Index/Agent-Onboarding.md`
2. `docs/00-Index/Current-State.md`
3. `docs/00-Index/Home.md`
4. `docs/90-Meta/agent-memory-protocol.md`
5. `docs/90-Meta/vault-governance.md`

Decision layers (research → game design → architecture → implementation):

- Game design: `docs/50-Game-Design/README.md` (GDDRs — how the game works)
- Architecture: `docs/00-Index/Decision-Log.md` (ADRs — how it is built)

Use `current`, `accepted`, and `approved` vault notes for implementation. Never
implement from `draft`/`superseded`/`archived` notes. Implement gameplay only
from `approved` GDDRs; an ADR must not contradict one; a gameplay/system change
updates its GDDR in the same PR. Player-facing docs are output docs, not
implementation specifications.

Use the project skill `.cursor/skills/vault-memory/SKILL.md` for the repeatable
vault start/update/wrap-up workflow when available.
Use `.cursor/skills/linear-issue-creation/SKILL.md` when creating, triaging, or
closing Linear tickets.

## Setup

```bash
mise install
direnv allow
pnpm install --frozen-lockfile
docker compose -f docker-compose.dev.yml up -d   # postgres:17 on :5432
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
- All database access flows through the typed `QueryGateway` exported from
  `@soccer-manager/db` (`gateway.withPlatform` / `gateway.withSave`). Domain code
  never imports the raw `pg.Pool` or `drizzle()` (lint-enforced). Queries are
  parameterized through Drizzle; never string-concatenate SQL.
- Drizzle is the single source of truth: `pgTable` declarations in
  `packages/db/src/schema/{platform,save}/**`. Each save lives in its own
  `save_<uuidv7hex>` Postgres schema (schema-per-save isolation, ADR-0027).
- Cross-context references are opaque `uuid` columns + branded TS types — never
  `references()` across bounded-context folders (ADR-0019 §6). IDs are
  app-generated UUIDv7, never the database's `gen_random_uuid()`.
- Service worker lives in `src/workers/`; the bootstrap shell registers it through `apps/web/public/sw-register.js` until interactive client hydration is introduced.
- shadcn primitives in `src/components/ui/**` are generated; update them with shadcn tooling.
- UI uses the design system only: tokens in `apps/web/src/styles/app.css`, `cn()`
  from `apps/web/src/lib/utils.ts`, theme in `apps/web/src/theme/*`, and atoms/
  composites in `apps/web/src/components/`. No raw hex, arbitrary Tailwind values,
  or inline `style=` for visual design. Missing primitive → propose it + update
  `docs/10-Architecture/09-Design-System.md` first; never improvise in a feature PR.
- Every atom/composite/layout/screen ships a colocated `*.stories.tsx`; a
  new or changed primitive/screen must add or update its story in the same PR
  so the Storybook showcase stays a complete mirror of the design system.
- Before any UI work, **read `docs/10-Architecture/09-Design-System.md`**
  (§1–12 = how it works; §13 = using the Storybook showcase as the reference
  + the story-authoring convention) and use the showcase to see components
  rendered: `pnpm --filter @soccer-manager/web storybook` (local :6006) or the
  deployed `SHOWCASE_DOMAIN`. The showcase is the canonical *visual* reference;
  the code in `apps/web/src` is authoritative on any conflict.
- **New design export** (claude.ai/design, e.g. an
  `https://api.anthropic.com/v1/design/h/<code>` link): do not eyeball or
  reimplement it. Run `pnpm sync:design <url>` (or `--dry-run` first), review
  the generated `design/handoff/<date>/CHANGES.md`, map deltas onto the §5
  layers, update the affected components **and their stories** plus
  `09-Design-System.md` (§13 if structure changes), and land one small
  dedicated PR. The script never edits app code. Full procedure:
  `docs/30-Implementation/design-sync-workflow.md`.
- Unclear architecture/feature/ADR gap is a stop condition: escalate via Linear
  (tag Nico, mark Blocked) — never scaffold a workaround or guess.
- Behaviour changes ship with their vault delta in the same PR; a change that
  contradicts a documented ADR/architecture decision is escalated, not merged.

## Database & Migrations

- Drizzle `pgTable` schema lives in `packages/db/src/schema/**`; the standalone,
  zero-dependency Zod validation mirror is generated into
  `packages/db-schema/src/generated/**`.
- `drizzle-kit generate` emits forward-only numbered SQL into
  `packages/db/migrations/{platform,save}/` (committed). Never `drizzle-kit push`
  against shared envs. `pnpm db:migrate` runs the node-postgres migrator against
  `DATABASE_URL`.
- Per-save migrations apply lazily on save-open via `QueryGateway.withSave`
  (A2 lazy, ADR-0027 §2); the `__drizzle_migrations` table is per-schema.
- CI drift gate: `pnpm db:generate && git diff --exit-code`. Never commit stale
  generated schema/types.

## PWA Rules

- Workbox generates the production service worker via `apps/web/scripts/build-pwa.mjs`: stale-while-revalidate for assets, network-first for routes, never cache POST/PUT/DELETE. Background Sync for offline mutations is future work. vite-plugin-pwa is deferred until TanStack Start SSR build compatibility is resolved.
- Browser-side game caches, drafts, local UI state and future local saves live
  in IndexedDB via Dexie.js - never localStorage.
- Test offline with `await context.setOffline(true)`. Install-prompt testing is unsupported
  in Playwright; use Lighthouse `installable-manifest` audit in CI.

## Task Tracking

Linear is the operational task tracker. Use project `soccer-manager — Research & Architecture` for Phase 1 research, Phase 2 ADRs, and seed backlog work.

Linear ticket operating system:

- Follow `docs/30-Implementation/linear-task-tracking.md` for issue quality, workflow, labels, dependencies, and closure rules.
- Create issue bodies from `docs/90-Meta/templates/linear-issue.md` and adapt from `docs/90-Meta/templates/linear-issue-examples.md`.
- Include user story, Gherkin scenarios, acceptance criteria, dependencies, and verification notes on substantial tickets.
- Agents must comment progress, blockers, PR links, and final vault paths on the Linear issue before marking it done.

The docs vault remains the durable knowledge base.

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
- Do not bypass the `QueryGateway` (`@soccer-manager/db`) or import the raw pg pool / `drizzle()` outside `packages/db`.
- Do not use class components, default exports for React components, or enums.
- Do not use real Bundesliga/EPL club names/logos/player names; see ADR-0007.
- Do not invent styling/layout or add one-off styled components when a
  design-system primitive exists.
- Do not work around an unclear spec/architecture; do not merge a change whose
  vault delta is missing or that diverges from the knowledge base.
- Do not make one-way-door decisions without an ADR + Nico sign-off.

## Cursor Cloud specific instructions

### Services overview

| Service | How to start | Port |
|---|---|---|
| TanStack Start dev server | `pnpm dev` | 3000 |
| PostgreSQL 17 | `sudo dockerd &>/dev/null & sleep 2 && sudo docker compose -f docker-compose.dev.yml up -d` | 5432 |

### Gotchas

- **Docker requires sudo** in the Cloud VM. The daemon isn't auto-started; run `sudo dockerd` before any `docker compose` commands. The dev compose file starts `postgres:17-alpine` on `:5432`.
- **`pnpm typecheck` builds `apps/web` first** (via `pnpm --filter @soccer-manager/web build && tsc --build`). This is intentional—TanStack Start generates route types during build.
- **E2e tests build and preview automatically.** Playwright's `webServer` config runs `pnpm build && vite preview --port 3000`. Stop any running dev server on port 3000 before `pnpm test:e2e`.
- **`db:migrate` is currently a placeholder.** It only prints a message; the real `drizzle-orm/node-postgres` migrator (ADR-0027 §12) lands with the data-layer engineering wave.
- **`.env` file** is needed at root. Copy from `.env.example` (`cp .env.example .env`). Default dev Postgres credentials: `soccer_manager`/`soccer_manager`, database `soccer_manager` on `localhost:5432`; the app reads `DATABASE_URL`.
- **Playwright browsers:** Install with `npx playwright install --with-deps chromium webkit` (both chromium and mobile-safari/webkit are tested).
- Standard lint/test/build commands are documented in the Setup and Build & Test sections above.
