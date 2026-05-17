---
title: db-schema module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-17
type: module
binding: true
related: [[../05-Building-Blocks]]
---

# packages/db-schema (`@soccer-manager/db-schema`)

## Purpose

Canonical schema and Zod validation mirrors for clubs, players, leagues,
competitions, fixtures, and saves.

## Owns

- Zod schemas / TypeScript types for domain entities.
- The package mirror of `db/schema.surql`.

## Inputs

- Domain model decisions (ADR-0004).

## Outputs

- Validated types via `src/index.ts`; the contract used by `web` and
  `match-engine`.

## Invariants

- Schema changes are forward-only and idempotent (`DEFINE ... IF NOT EXISTS`).
- Package mirror must stay in sync with `db/schema.surql`; never commit stale
  generated types.
- No `any` — `unknown` + Zod narrowing.

## Dependencies

- [[../09-Decisions/ADR-0004-data-model]] (draft)
- [[../09-Decisions/ADR-0005-save-format]]
- Consumed by [[web]] and [[match-engine]].
