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
