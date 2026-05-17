---
title: ADR-0003 Match Engine Architecture
status: draft
tags: [adr, match-engine]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: false
supersedes:
superseded_by:
related: [[../../60-Research/research-wave-2-gaps]]
---

> **DRAFT — do not implement from this ADR.** Blocked on Research Wave 2
> ([[../../60-Research/research-wave-2-gaps]]). The direction below is the
> current intent, not an accepted decision.

# ADR-0003: Match Engine Architecture

## Status

draft

## Date

2026-05-15

## Context

The simulation core must be deterministic for testing and reproducible saves,
and decoupled from UI. Detailed event model and tuning depend on Wave 2
research (match-engine gap).

## Options Considered

- Pure TypeScript package, seedable RNG, minute-by-minute events (intended).
- React-coupled simulation hook.
- Statistical (Poisson-style) result-only model.

## Decision

(Intended, pending Wave 2) Implement the match engine as a pure TypeScript
package with seedable RNG, minute-by-minute events, and no React dependency.

## Rationale

A pure package is unit- and property-testable in isolation before any UI
exists, and a seedable RNG makes matches reproducible across saves and tests.

## Consequences

Positive:

- Simulation reproducible in tests; property-based testing before UI.

Negative:

- Event granularity, tuning, and balancing remain open until Wave 2 closes.

## Supersedes

None

## Design source

This ADR **implements** game-design decisions — it must not contradict them:

- [[../../50-Game-Design/GD-0002-match-engine]] (primary) · [[../../50-Game-Design/GD-0001-core-loop]] (match-tick) · [[../../50-Game-Design/GD-0004-tactics]] (tactics contract) · [[../../50-Game-Design/GD-0010-ai-world]] (AI inputs)

## Related Docs

- [[../../50-Game-Design/README]] — Game Design Log
- [[../../60-Research/research-wave-2-gaps]]
- [[ADR-0001-tech-stack]]
