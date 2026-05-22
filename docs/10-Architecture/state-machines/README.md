---
title: State Machines Index
status: current
tags: [architecture, state-machine, ddd]
created: 2026-05-16
updated: 2026-05-22
type: index
binding: false
related: [[../bounded-context-map]], [[../09-Decisions/ADR-0014-state-machines]]
---

# State Machines Index

Explicit state machines power every time-critical, multiplayer-relevant
workflow. Each is owned by exactly one bounded context.

## List

| Name | Owning context | File |
|---|---|---|
| League / Week | League Orchestration | [[league-week]] |
| Transfer Negotiation | Transfer | [[transfer]] |
| Watch Party | Watch Party | [[watch-party]] |
| Match (overview) | Match | [[match]] |

## Authority

Decision: [[../09-Decisions/ADR-0014-state-machines]].

Each state machine note has:

- Mermaid diagram of states + transitions.
- Trigger sources (commands, timers, external events).
- Effect on other contexts.
- Persistence model (PostgreSQL + Drizzle tables per
  [[../09-Decisions/ADR-0027-postgres-data-model]]).
- Failure / recovery cases.
- Test strategy.
