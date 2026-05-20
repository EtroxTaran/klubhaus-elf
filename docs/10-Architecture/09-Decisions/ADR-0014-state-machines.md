---
title: ADR-0014 Explicit State Machines for Time-critical Workflows
status: proposed
tags: [adr, architecture, state-machine, workflow]
created: 2026-05-16
updated: 2026-05-19
type: adr
binding: false
related: [[../state-machines/README]], [[../../60-Research/raw-perplexity/raw-architecture]], [[ADR-0021-revised-tech-stack]], [[ADR-0013-transactional-outbox]]
---

# ADR-0014: Explicit State Machines for Time-critical Workflows

> **STACK-REVISION IMPACT 2026-05-19 ([[ADR-0021-revised-tech-stack]] + ADR-0023/0024/0025).**
> Informational only — status (`proposed`) and decision are **unchanged**; do not
> implement. On promotion the substrate amendment below applies: *state-machine
> pattern unchanged; **persistence substrate → PostgreSQL** per
> [[ADR-0021-revised-tech-stack]]; event emission via the Postgres-backed
> transactional outbox per [[ADR-0013-transactional-outbox]] (amended 2026-05-19).*
> Disposition: **keep parked** (owner directive 2026-05-19; gate is owner
> review, currently paused — not the stack).

## Status

Proposed (2026-05-16). Needs Nico's review before acceptance.

## Context

Async multiplayer is full of *zeit-kritische* lifecycles: weeks open and
close, transfers escalate, watch parties get scheduled, matches lock
their line-ups. Modelling these with ad-hoc booleans (`hasLineupLocked
`, `isResolved`) is the fastest way to land in undefined states.

The research
([[../../60-Research/raw-perplexity/raw-architecture]] §5) recommends
**explicit state machines** for every time-critical or
multiplayer-relevant workflow. State machines also map well onto the
*serverautoritativ* requirement
([[ADR-0011-server-authoritative-multiplayer]]).

## Decision

Every time-critical, multiplayer-relevant workflow is implemented as an
**explicit, typed state machine** in its bounded context.

State machines in scope:

- **League / Week** ([[../state-machines/league-week]]).
- **Transfer** ([[../state-machines/transfer]]).
- **Watch Party** ([[../state-machines/watch-party]]).
- **Match** ([[../state-machines/match]]).

Each state machine declares:

- Exhaustive state set.
- Exhaustive transition table.
- Trigger sources.
- Effects.
- Persistence row.
- Test cases.

## Consequences

### Positive

- Every transition is explicit, type-checked and tested.
- State is debuggable (one field, finite set).
- Bug class "we forgot to update this flag" disappears.
- Replays + audit are straightforward.

### Negative

- Each new state needs the diagram + table + tests to be updated, not
  just an `if` branch.
- Initial development is slower than ad-hoc booleans.

### Future

- Visual state-machine viewers in admin UI become trivial.
- Cross-state-machine choreography (e.g. Watch Party deadlines feeding
  Match `lineup_lock_at`) is explicit, not implicit.

## Implementation

- TypeScript discriminated union types for state.
- Transition handler functions are pure (state + event → new state +
  effects).
- All transitions write domain events through the outbox
  ([[ADR-0013-transactional-outbox]]).
- Property-based tests verify no undefined state is reachable.

## Compliance

- New time-critical workflows MUST define a state machine before
  implementation begins.
- No multi-flag booleans for state; the state field is enum or
  discriminated union only.
- Transition logic MUST live in one place per state machine, not spread
  across UI / loaders / commands.

## Sources

- refactoring.guru state pattern TypeScript.
- gameprogrammingpatterns.com state.
- oneuptime.com TypeScript type-safe state machines.
- [[../../60-Research/raw-perplexity/raw-architecture]] §5.
