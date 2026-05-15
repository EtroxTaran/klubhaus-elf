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
