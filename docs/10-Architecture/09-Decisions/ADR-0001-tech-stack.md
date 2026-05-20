---
title: ADR-0001 Tech Stack
status: superseded
tags: [adr, architecture]
created: 2026-05-15
updated: 2026-05-19
accepted_at: 2026-05-15
type: adr
binding: true
superseded_by: ADR-0021-revised-tech-stack
related: [[ADR-0020-hybrid-online-mvp-offline-ready]], [[ADR-0021-revised-tech-stack]]
---

# ADR-0001: Tech Stack

> **SUPERSEDED on 2026-05-19 by [[ADR-0021-revised-tech-stack]].**
> Old way: SurrealDB authoritative for MVP progression; React Context for
> state; "minimal Tailwind keyframes" for animation; SurrealDB outbox is the
> realtime substrate. New way: PostgreSQL + Drizzle is the system of record
> (SurrealDB deferred to an optional additive realtime/graph engine behind an
> interface); TanStack Query + Zustand for state; Motion + GSAP for game-feel;
> SSE→Centrifugo realtime behind a transport interface. TanStack Start, React,
> Tailwind, Dexie, Biome, Vitest, Playwright, pnpm are **retained unchanged**.
> Kept for history — do not implement the SurrealDB-as-primary parts.

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

## Related Docs

- [[../01-Introduction]]
- [[../02-Constraints]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
