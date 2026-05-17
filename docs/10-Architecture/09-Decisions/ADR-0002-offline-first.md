---
title: ADR-0002 Offline-first Strategy
status: accepted
tags: [adr, pwa]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0005-save-format]]
---

# ADR-0002: Offline-first Strategy

## Status

accepted

## Date

2026-05-15

## Context

The game targets long single-player careers that must remain fully playable
with no network. Cloud sync is desirable but not an MVP requirement. Research
note `60-Research/pwa-offline-patterns.md` informed this decision.

## Options Considered

- IndexedDB via Dexie as primary store, SurrealDB sync post-MVP (chosen).
- SurrealDB-first with offline cache layer.
- localStorage / file export only.

## Decision

Use IndexedDB via Dexie as the primary MVP save store. SurrealDB sync is
optional and post-MVP.

## Rationale

Dexie gives transactional, migratable, large-quota local storage that works
offline on iOS and Android. Deferring SurrealDB sync keeps the MVP scope small
and avoids conflict-resolution complexity before it is needed.

## Consequences

Positive:

- Gameplay continues with zero network access.
- Clear separation between local save store and future sync.

Negative:

- Save migrations must be forward-compatible and tested before cloud sync is
  introduced (see [[ADR-0005-save-format]]).

## Supersedes

None

## Design source

Implements the ratified game-design decision [[../../50-Game-Design/GD-0014-save-career-model]] (approved).

## Related Docs

- [[../../50-Game-Design/README]] — Game Design Log
- [[../../60-Research/pwa-offline-patterns]]
- [[ADR-0005-save-format]]
- [[../../30-Implementation/pwa-offline-strategy]]
