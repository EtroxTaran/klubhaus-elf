---
title: match-engine module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-17
type: module
binding: false
related:
  - [[../05-Building-Blocks]]
---

# packages/match-engine (`@soccer-manager/match-engine`)

## Purpose

Deterministic match simulation: produces minute-by-minute events and results
from team state plus tactics.

## Owns

- Match simulation loop and event generation.
- Result and player-stat-change calculation.
- Seedable RNG.

## Inputs

- Team/squad state and tactics (shapes from [[db-schema]]).
- A simulation seed.

## Outputs

- Match events, final result, player stat changes.

## Invariants

- Pure TypeScript — no React, no DB client, no UI concerns.
- Deterministic: same seed + same state ⇒ identical output.
- Unit- and property-testable in isolation before UI integration.

## Dependencies

- [[../09-Decisions/ADR-0003-match-engine]] (draft — do not implement yet)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model; supersedes ADR-0004)
- Consumed by [[web]].
## Related

- [[../05-Building-Blocks]]
