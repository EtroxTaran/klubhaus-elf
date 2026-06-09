---
title: db-schema module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-06-09
type: module
binding: true
related: [[../05-Building-Blocks]], [[db]], [[../09-Decisions/ADR-0021-revised-tech-stack]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# packages/db-schema (`@klubhaus-elf/db-schema`)

## Purpose

Standalone, dependency-light Zod validation mirror of the domain schema.
Consumed at server-function boundaries and the PWA's bundle-critical client
path (Zod Mini target — see [[../09-Decisions/ADR-0021-revised-tech-stack]] §4).

Single source of truth is **`@klubhaus-elf/db`**'s Drizzle schema; this
mirror is **generated** by `packages/db/scripts/emit-db-schema-mirror.ts`
(reads the Drizzle schema + drizzle-zod and writes self-contained `.ts`
files into `src/generated/`). The mirror has **zero runtime dependency** on
`@klubhaus-elf/db` — the package stays a composite-build-safe leaf
(per the [[../09-Decisions/ADR-0027-postgres-data-model]] §3 generator rule).

## Owns

- Self-contained Zod schemas + inferred TypeScript types for domain entities.
- Generated artifacts under `src/generated/`; `src/index.ts` re-exports them.

## Inputs

- The Drizzle schema in `@klubhaus-elf/db`
  ([[../09-Decisions/ADR-0027-postgres-data-model]]).
- The mirror emitter script in `packages/db/scripts/emit-db-schema-mirror.ts`.

## Outputs

- Validated types via `src/index.ts`; the contract used by `apps/web`
  (server-function boundaries + bundle-critical client validation) and other
  packages that need standalone validation without pulling Drizzle.

## Invariants

- **Zero cross-package imports** — must stay composite-build safe.
- Files under `src/generated/` are **not hand-edited**; CI drift gate
  (`pnpm db:generate && git diff --exit-code`) enforces this.
- Schema changes flow Drizzle → drizzle-kit SQL migrations → mirror emitter
  (forward-only). No reverse path.
- No `any` — `unknown` + Zod narrowing.

## Dependencies

- [[../09-Decisions/ADR-0027-postgres-data-model]] — the substrate decision
  (supersedes ADR-0004).
- [[../09-Decisions/ADR-0005-save-format]] — save-envelope contracts.
- Consumed by [[web]] and (planned) [[match-engine]] /
  `@klubhaus-elf/match-contract`.
