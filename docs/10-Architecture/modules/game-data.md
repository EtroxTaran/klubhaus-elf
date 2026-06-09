---
title: game-data module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-06-09
type: module
binding: true
related: [[../05-Building-Blocks]]
---

# packages/game-data (`@klubhaus-elf/game-data`)

## Purpose

IP-clean generated game content: fictional clubs, players, stadiums, crests,
and league structures.

## Owns

- Fictional name/asset generation and seed data.
- League/competition structure definitions.

## Inputs

- Generation seeds / config.

## Outputs

- Generated, validated game data via `src/index.ts`.

## Invariants

- No real Bundesliga/EPL/La Liga/Serie A/DFL/FIFPro names or assets
  ([[../09-Decisions/ADR-0007-naming-schema]]). Bugbot enforces this.
- Pure data/generation — no React, no DB client.

## Dependencies

- [[../09-Decisions/ADR-0007-naming-schema]]
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model; supersedes ADR-0004)
- Consumed by [[web]]; shares shapes with [[db-schema]].
