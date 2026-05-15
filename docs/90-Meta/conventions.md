---
title: Conventions
status: draft
tags: [meta]
updated: 2026-05-15
---

# Conventions

## Bootstrap deviation

The requested `https://github.com/EtroxTaran/ai-engineering-stack` repository is
not visible from this Cloud Agent. `git clone` returned `Repository not found`,
and `gh repo view EtroxTaran/ai-engineering-stack` could not resolve it.

Until access is available, this repository applies the conventions stated in the
project briefing directly:

- pnpm workspaces.
- TypeScript strict.
- Biome instead of ESLint/Prettier.
- Vitest and Playwright quality gates.
- Cursor rules/hooks/BUGBOT setup.
- Docker Compose for Dokploy.

## Additional bootstrap notes

- The SurrealDB repository cloned successfully, but the requested `public/integrations/agent-rules/*.mdc` path was not present. Project-specific SurrealDB rules were created in `.cursor/rules/40-surrealdb.mdc` instead.
- TanStack Start currently prevents vite-plugin-pwa from emitting a production service worker in this setup. The app uses direct Workbox generation in `apps/web/scripts/build-pwa.mjs`, creates `dist/client/service-worker.js` after `vite build`, and registers it via `navigator.serviceWorker.register`.
- shadcn CLI initialization prompted for interactive component-library choices. The repository therefore includes `apps/web/components.json` and shadcn-compatible aliases; generated primitives should be added with explicit future commands.

- Bootstrap shell deliberately avoids TanStack client hydration on the static landing page so Lighthouse mobile budgets stay meaningful on GitHub-hosted runners. Future interactive routes should reintroduce client scripts only where needed and keep Lighthouse budgets green.
