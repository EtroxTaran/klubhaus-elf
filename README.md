# soccer-manager

Offline-first football manager PWA in the style of the classic Anstoß series.

This repository is bootstrapped for Cursor Local/Cloud Agents with deterministic
safety hooks, pnpm, Biome, Vitest, Playwright, TanStack Start, shadcn/ui-ready
Tailwind foundations, Docker, and Dokploy deployment notes.

## Quick start

```bash
mise install
pnpm install --frozen-lockfile
pnpm check
pnpm typecheck
pnpm test
pnpm --filter @soccer-manager/web dev
```

See `AGENTS.md` for agent rules and `docs/00-Index/Home.md` for the Obsidian
Vault entry point.

## Docs vault preview

Open `docs/` as a vault in the Obsidian app, or preview it in a browser
(no Obsidian required):

```bash
pnpm docs:preview   # http://localhost:8080
```

## UI showcase (Storybook)

```bash
pnpm storybook      # http://localhost:6006
```

See `docs/90-Meta/obsidian-config.md` for vault details.
