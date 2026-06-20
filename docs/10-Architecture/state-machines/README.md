---
title: State Machines Index
status: current
tags: [architecture, state-machine, ddd, discipline, dynasty, board, ownership, fmx-89]
created: 2026-05-16
updated: 2026-06-20
type: index
binding: false
related: [[../bounded-context-map]], [[../09-Decisions/ADR-0014-state-machines]], [[../09-Decisions/ADR-0073-player-contract-lifecycle-fsm]], [[../09-Decisions/ADR-0078-player-discipline-suspension-contracts]], [[player-discipline]], [[../09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]], [[dynasty-board-and-ownership]]
---

# State Machines Index

Explicit state machines power every time-critical, multiplayer-relevant
workflow. Each is owned by exactly one bounded context.

## List

| Name | Owning context | File |
|---|---|---|
| League / Week | League Orchestration | [[league-week]] |
| Transfer Negotiation | Transfer | [[transfer]] |
| Player Contract Lifecycle | Squad & Player | [[player-contract-lifecycle]] |
| Player Discipline (proposed) | Squad & Player (proposed via ADR-0078) | [[player-discipline]] |
| Watch Party | Watch Party | [[watch-party]] |
| Match (overview) | Match | [[match]] |
| Youth Academy (proposed) | Youth Academy (proposed via ADR-0060) | [[youth-academy]] |
| Loan Orchestration (proposed) | Transfer (saga; proposed via ADR-0075) | [[loan-orchestration]] |
| Dynasty Board & Ownership (proposed) | Club Management (Board & Ownership sub-aggregates; proposed via ADR-0079) | [[dynasty-board-and-ownership]] |
| Pitch Condition | Stadium Operations / Match | [[pitch-condition]] |
| Identity & Access (draft) | Identity & Access | [[identity-access]] |
| Audience & Atmosphere (draft) | Audience & Atmosphere | [[audience-atmosphere]] |
| Staff Operations (draft) | Staff Operations | [[staff-operations]] |
| Training (draft) | Training | [[training]] |
| Rivalry (draft) | Rivalry System | [[rivalry]] |
| Stadium Operations / Matchday (draft) | Stadium Operations | [[stadium-operations]] |
| Commercial Contract & Season-Ticket (draft) | CommercialPortfolio | [[commercial-portfolio]] |
| Transfer Window & Sanctions (draft) | Regulations & Compliance | [[regulations-compliance]] |
| Command Queue (draft) | Offline Sync | [[offline-sync]] |
| Command Reception (draft) | Audit & Security | [[audit-security]] |
| Manager Run & Legacy (draft) | Manager & Legacy | [[manager-legacy]] |
| Scouting Assignment (draft) | Scouting | [[scouting]] |

> Rows marked **(draft)** are FMX-202 consolidations from each context's ADR; they
> carry `status: draft` and an **Open decisions** section for guards/thresholds the
> source ADR has not yet pinned down. They become binding when the development phase begins.

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
