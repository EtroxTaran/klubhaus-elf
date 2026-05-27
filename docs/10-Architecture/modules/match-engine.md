---
title: match-engine module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-27
type: module
binding: false
related: [[../05-Building-Blocks]], [[../09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
---

# Match Engine Boundary

## Purpose

Server-authoritative match simulation boundary: produces deterministic
event/spatial outputs and results from frozen team state, tactics, rules,
context and seed.

## Owns

- Match simulation port and concrete engine adapters.
- Event generation and spatial sample generation.
- Result and player-stat-change calculation.
- Seedable RNG.
- Engine capability descriptors and version metadata.

## Inputs

- Team/squad state and tactics (shapes from [[db-schema]]).
- A simulation seed.
- Match rules, quality profile, context and intervention schedule.

## Outputs

- Match event log.
- Spatial samples for 2D/replay/tactical analysis.
- Match summary and durable downstream effects.

## Invariants

- Consumers depend on `MatchEnginePort`, not on a concrete engine runtime.
- First authoritative runtime is decided by the ADR-0049 TS-vs-Rust spike;
  Rust native is the default production candidate if the spike does not show
  clear disadvantages.
- No React, DB client, UI concern, LLM SDK or renderer dependency inside the
  engine implementation.
- Deterministic: same seed + same state ⇒ identical output.
- Unit-, property-, golden-replay and statistical-regression testable in
  isolation before UI integration.

## Dependencies

- [[../09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] (draft — do not implement yet)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model; supersedes ADR-0004)
- Consumed by [[web]].
