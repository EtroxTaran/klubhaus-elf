# Bootstrap Phase 0 Plan

## Context

The repository is a greenfield `soccer-manager` project. The requested external
`EtroxTaran/ai-engineering-stack` repository is not visible to this Cloud Agent
(`Repository not found` via both `git clone` and `gh repo view`), so the initial
bootstrap will apply the conventions from the project briefing directly and
document the deviation in `docs/90-Meta/conventions.md`.

## Steps

1. Add Day-1 Cursor substrate: `AGENTS.md`, symlink-compatible `CLAUDE.md`,
   `.cursor/environment.json`, rules, deterministic hooks, Bugbot config,
   ignore files, and CODEOWNERS.
2. Add workspace/tooling skeleton: pnpm workspace, mise, Biome, TypeScript,
   Vitest, Playwright, commitlint, lefthook, sops/direnv placeholders.
3. Add Obsidian Vault skeleton and product docs with front matter.
4. Add CI, Lighthouse budgets, Docker/Dokploy-compatible compose files, and
   deployment documentation.
5. Add a minimal mobile-first PWA web app under `apps/web` with German default
   copy, health endpoint, manifest, service worker registration, i18n resources,
   and smoke tests.
6. Install dependencies with pnpm, run available quality gates, then commit,
   push, and open a draft PR.

## Known blockers / escalations

- Stack repo access is missing.
- Dokploy, branch protection, Bugbot GitHub App, and Cursor Automation require
  external account/UI access and can only be documented from this agent.
- Context7 documentation lookup is configured but the environment quota is
  exhausted, so library setup uses repository conventions and package metadata.
