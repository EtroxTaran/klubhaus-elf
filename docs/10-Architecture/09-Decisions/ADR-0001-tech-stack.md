---
title: ADR-0001 Tech Stack
status: accepted
tags: [adr, architecture]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0002-offline-first]]
---

# ADR-0001: Tech Stack

## Status

accepted

## Date

2026-05-15

## Context

`soccer-manager` is an offline-first single-player football management PWA built
largely by AI coding agents. The stack must support SSR + file-based routing,
offline gameplay, a deterministic simulation core, strict typing, and an
agent-friendly CI gate.

## Options Considered

- TanStack Start + SurrealDB + Dexie (chosen).
- Next.js + Postgres + IndexedDB wrapper.
- SvelteKit + SQLite/WASM.

## Decision

Use TanStack Start, React, Tailwind/shadcn, SurrealDB, Dexie, pnpm, Biome,
Vitest, Playwright, Docker, Dokploy, and Cursor Cloud Agent workflows.

## Rationale

TanStack Start gives SSR + typed file routing + server functions in one
framework. SurrealDB covers document/graph/relational needs for league data;
Dexie covers offline saves. Biome replaces ESLint+Prettier with one fast tool,
which keeps the agent CI gate simple and deterministic.

## Consequences

Positive:

- Single coherent toolchain optimized for offline-first PWA and agent CI.
- Strict TypeScript + Zod narrowing across the codebase.

Negative:

- TanStack Start beta volatility is an active risk (tracked in `11-Risks.md`);
  it currently blocks vite-plugin-pwa (see `conventions.md`).

## Supersedes

None

## Related Docs

- [[../01-Introduction]]
- [[../02-Constraints]]
- [[ADR-0002-offline-first]]
