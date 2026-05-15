---
title: ADR-0003 Match Engine Architecture
status: draft
tags: [adr, match-engine]
updated: 2026-05-15
---

# ADR-0003: Match Engine Architecture

## Decision

Implement the match engine as a pure TypeScript package with seedable RNG,
minute-by-minute events, and no React dependency.

## Consequences

Simulation is reproducible in tests and can be exercised with property-based
testing before UI integration.
