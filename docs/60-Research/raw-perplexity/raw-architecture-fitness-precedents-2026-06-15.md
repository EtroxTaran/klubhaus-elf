---
title: Raw Architecture Fitness Precedent Research
status: raw
tags: [research, raw, perplexity, architecture-fitness, ddd, modular-monolith, games, simulation, football, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-167
related:
  - [[../architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../../40-Quality/architecture-fitness-function]]
---

# Raw Architecture Fitness Precedent Research

This note preserves the Perplexity-first discovery pass for real-world,
simulation and game precedents. It is raw research input, not a binding
implementation instruction.

## Prompt

Find real-world, modular-monolith, sports-management-game and simulation-game
precedents that support enforcing bounded-context boundaries and storage
ownership through architecture tests/fitness functions. Include football-domain
analogies where useful, but do not assume private Football Manager internals are
publicly known.

## Discovery Summary

Perplexity found strong general software precedent and weaker public
football-game-specific evidence.

Useful general precedent:

- DDD bounded contexts are meant to protect model ownership and language
  integrity. They lose value when teams bypass public contracts and read/write
  another context's internal model.
- Modular monolith literature commonly recommends architecture tests to stop a
  monolith from degrading into a tangled shared database with hidden
  dependencies.
- Event or public-query handoffs are the normal alternative to direct table
  coupling when one module needs another module's facts.

Football-domain analogy:

- Clubs, leagues, regulators and media do not share one operational ledger.
  They exchange filings, reports, verdicts, transfer registrations and public
  facts through defined channels. FMX's contexts should mirror that ownership
  line: Club Management can consume published commercial or regulatory facts,
  but it should not join into another context's private tables.

Game/simulation precedent:

- Public details of Football Manager's internal data architecture are scarce.
  The safe conclusion is not "FM does X", but "long-running sports-management
  simulations need stable save compatibility, reproducible simulations and
  maintainable domain ownership."
- Simulation games that expose replay/desync or save-forward concerns tend to
  benefit from structural gates: deterministic surfaces are hard to debug if
  unrelated modules can bypass ownership boundaries.
- Management games have many cross-cutting screens, but that UI need should be
  fed by projections/read models, not by making every module's storage global.

## Recommendation Signal

The discovery supports a hard architecture-fitness gate for core invariants:

- import boundaries protect code ownership;
- storage boundaries protect data ownership;
- read models and public queries preserve UX richness without coupling modules;
- exceptions should be explicit, temporary and visible.

## Source-Check Caveat

Perplexity was used for discovery and comparison. Official/current facts are
checked in [[raw-architecture-fitness-source-checks-2026-06-15]] before the
synthesis and ADR consume them. Public game-specific evidence is treated as
indirect precedent, not as proof of Football Manager internals.

