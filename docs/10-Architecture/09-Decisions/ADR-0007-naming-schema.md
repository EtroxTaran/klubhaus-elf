---
title: ADR-0007 IP-clean Naming Schema
status: accepted
tags: [adr, game-design, ip]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: true
supersedes:
superseded_by:
related: []
---

# ADR-0007: IP-clean Naming Schema

## Status

accepted

## Date

2026-05-15

## Context

The game evokes the Anstoß tradition but must avoid licensed football IP.
Research note `60-Research/ip-and-licensing.md` produced the hard-stop list and
fictional naming approach that this ADR ratifies.

## Options Considered

- Fully generated fictional names/assets, real league structure only (chosen).
- Licensed real club/player data.
- User-supplied data packs only.

## Decision

Generate fictional club names, crests, stadiums, and player names. Real league
structures may be mirrored, but real club/player brands are not copied.

## Rationale

Generated data removes licensing cost and legal risk while preserving the
manager fantasy. Mirroring league structure (divisions, promotion/relegation)
is not protected and keeps gameplay familiar.

## Consequences

Positive:

- No licensing exposure; safe to ship and open-source assets.

Negative:

- `packages/game-data` must avoid real Bundesliga, EPL, La Liga, Serie A, DFL,
  FIFPro, and similar protected names/assets. Bugbot enforces this.

## Supersedes

None

## Related Docs

- [[../../60-Research/ip-and-licensing]]
- [[../../60-Research/anstoss-series-deep-dive]]
