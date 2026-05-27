---
title: ADR-0001 Tech Stack
status: superseded
tags: [adr, architecture]
created: 2026-05-15
updated: 2026-05-19
type: adr
binding: false
accepted_at: 2026-05-15
superseded_by: ADR-0021-revised-tech-stack
related:
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0021-revised-tech-stack]]
---

# ADR-0001: Tech Stack

> **Superseded — historical memory only.** This document is superseded by [[ADR-0021-revised-tech-stack]] and must not be implemented. The current decision/spec lives there; see also [[../../00-Index/Decision-Log]] for the authoritative index. Retained for historical context per the vault's supersede discipline.

## Status

Superseded (2026-05-19 by [[ADR-0021-revised-tech-stack]]).
Accepted historically on 2026-05-15.

## Date

2026-05-15

## Context

`soccer-manager` is an offline-ready football management PWA built largely by
AI coding agents. The stack must support SSR + file-based routing, a
hybrid-online MVP, future selective offline-first singleplayer, a deterministic
simulation core, strict typing, and an agent-friendly CI gate.

## Options Considered

- TanStack Start + SurrealDB + Dexie (chosen).
- Next.js + Postgres + IndexedDB wrapper.
- SvelteKit + SQLite/WASM.

## Decision

Use TanStack Start, React, Tailwind/shadcn, SurrealDB, Dexie, pnpm, Biome,
Vitest, Playwright, Docker, Dokploy, and Cursor Cloud Agent workflows.
SurrealDB is authoritative for MVP progression; Dexie is the browser
persistence layer for caches, drafts, onboarding state and the future
selective-offline/export substrate.

## Rationale

TanStack Start gives SSR + typed file routing + server functions in one
framework. SurrealDB covers document/graph/relational needs for league data;
Dexie covers browser persistence for caches, drafts and future local saves.
Biome replaces ESLint+Prettier with one fast tool, which keeps the agent CI
gate simple and deterministic.

## Consequences

Positive:

- Single coherent toolchain optimized for hybrid-online MVP, future
  offline-first PWA capabilities and agent CI.
- Strict TypeScript + Zod narrowing across the codebase.

Negative:

- TanStack Start beta volatility is an active risk (tracked in `11-Risks.md`);
  it currently blocks vite-plugin-pwa (see `conventions.md`).

## Supersedes

None
## Related

- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[ADR-0021-revised-tech-stack]]
