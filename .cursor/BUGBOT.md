# Bugbot Configuration

## What to flag (always)

- Raw `process.env.*` access in TanStack route loaders or components.
- String-concatenated SurrealQL (use `$params`).
- Missing `await` on `db.query` or Dexie operations.
- `localStorage` usage for game state (must be IndexedDB via Dexie).
- Hand-edited `src/components/ui/**` (shadcn primitives are generated).
- New ESLint/Prettier dependencies (Biome only).
- New npm/yarn lockfiles.
- Real club names from Bundesliga/EPL/La Liga/Serie A in `packages/game-data/`.
- Service worker registrations outside `src/sw/register.ts`.
- POST/PUT/DELETE responses being cached.
- `it.skip`, `it.todo`, `it.only` in committed test files.
- Lowering coverage thresholds in `vitest.config.ts`.
- Missing migration file for schema changes in `db/schema.surql`.

## What to leave alone

- Test files (`**/*.test.ts`, `**/*.spec.ts`) - focus on production code.
- Generated files: `routeTree.gen.ts`, `src/components/ui/**`, generated types.
- Docs in `docs/**`.
- Translation files in `src/locales/**`.
- Stylistic preferences already covered by Biome.

## Custom effort routing

Use HIGH effort when PR touches any of:

- `packages/match-engine/**`
- `db/migrations/**`
- `db/schema.surql`
- `src/server/auth/**`
- `docker-compose.prod.yml`

Use DEFAULT effort otherwise.

## Tone

- Inline comments only, cite specific line numbers.
- No summary review unless explicitly requested.
- Reference rule sources: `AGENTS.md`, ADR-0007, etc.
- Do not flag style - Biome owns that.
