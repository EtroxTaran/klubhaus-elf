---
title: FMX-132 Sporting Core Context Definitions Decision Queue
status: draft
tags: [execution, decision-queue, ddd, bounded-context, sporting-core, match, training, squad-player, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: false
linear: FMX-132
related:
  - [[../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-sporting-core-contexts-game-precedents-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-sporting-core-contexts-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0129-match-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0130-training-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0131-squad-and-player-context-definition]]
---

# FMX-132 Sporting Core Context Definitions Decision Queue

## Status

Awaiting Nico. This queue records recommendations only; no Match/Training/Squad
& Player context-definition ADR becomes binding until Nico answers.

## D1 - Documentation Shape

Options:

- **A. Three dedicated context-definition ADRs.** One draft ADR each for Match,
  Training and Squad & Player, each with boundary, aggregate inventory,
  published language and ACLs.
- **B. One Sporting Core umbrella ADR.** One larger ADR covers all three
  contexts together.
- **C. Keep fragmented map rows plus per-feature ADRs.** No new context
  definition ADRs.

Recommendation: **A.**

Reason: DDD source checks favor explicit bounded contexts and context maps.
FMX already has many accepted feature ADRs; three small definition ADRs give
implementation teams a canonical source without duplicating those feature
decisions.

## D2 - Fitness, Readiness and Availability Ownership

Options:

- **A. Squad & Player owns durable availability; Training and Match emit facts.**
  Training computes load/readiness/risk signals; Match emits match injury/card
  facts; Squad & Player applies durable availability/injury/discipline state.
- **B. Training owns fitness/availability.** Training is the canonical source
  for all physical player state.
- **C. Match owns matchday availability.** Match mutates availability directly
  during or after simulation.

Recommendation: **A.**

Reason: This matches ADR-0018 and ADR-0078, mirrors real-world separation of
load/medical signals from selection, and avoids embedding durable player state
inside the match engine.

## D3 - Development Progression Ownership

Options:

- **A. Training computes development signals; Squad & Player persists/applies
  player development state.** Match contributes participation/experience facts
  only where later accepted.
- **B. Training owns the full player development record.** Attribute state moves
  to Training.
- **C. Squad & Player computes all development itself.** Training becomes UI
  input only.

Recommendation: **A.**

Reason: Accepted ADR-0018 already uses `TrainingWeekProcessed` ->
`PlayerDevelopmentDeltaApplied`. It also keeps future balance/calibration
separate from durable player truth.

## D4 - Match Published Event Set

Options:

- **A. Canonicalize the current set from `match.md`, ADR-0018 and
  ADR-0087/FMX-140.** `Intervention*` and `MatchPaused/Resumed` are current,
  not draft; future event names remain proposal-only.
- **B. Treat all pause/intervention events as draft until a future code phase.**
- **C. Expand Match's event list now with training/player lifecycle events.**

Recommendation: **A.**

Reason: ADR-0087/FMX-140 already ratified pause/intervention semantics, while
ADR-0018 keeps durable player lifecycle events outside Match.

## D5 - GD-0005 R2-03 Tactics/Training Contract

Options:

- **A. Close R2-03 as a boundary contract.** Tactics owns
  `RoleProfileForPosition`, `TacticSnapshot` and persistent tactics; Training
  consumes role profiles and emits readiness/familiarity/development signals;
  Match consumes the locked snapshot. Numeric magnitudes remain calibration debt.
- **B. Keep R2-03 open until all tactical familiarity formulas are calibrated.**
- **C. Move tactical familiarity ownership into Match or Squad & Player.**

Recommendation: **A.**

Reason: ADR-0055, ADR-0067, ADR-0072, ADR-0080 and GD-0026 already define the
critical seams. Keeping R2-03 open for numeric tuning conflates boundary
definition with calibration.

## D6 - Squad & Player Aggregate Inventory

Options:

- **A. Record aggregate families now, with extraction seams.** Player record,
  player availability, injury record, contract lifecycle, discipline ledger,
  development profile and squad projection/cohesion families live in Squad &
  Player; future Contracts/CLM remains a reserved extraction seam per GD-0040.
- **B. Only record `Player` and leave sub-aggregates unstated.**
- **C. Split Medical and Contracts contexts now.**

Recommendation: **A.**

Reason: ADR-0073/0078 and current game-design notes already need these
consistency boundaries. C is premature portfolio growth; B leaves future
implementation too ambiguous.

## D7 - Approval Status

Options:

- **A. Keep ADR-0129/0130/0131 draft/non-binding in this PR; promote only after
  Nico approves D1-D6.**
- **B. Accept the ADRs in this PR based on agent recommendation.**
- **C. Do not create ADRs until after a separate decision-only issue.**

Recommendation: **A.**

Reason: It preserves the full artifact chain and lets Nico answer against
concrete text without letting an agent self-ratify architecture.

## Consolidated Recommendation

Approve **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

Operational interpretation:

- create three context-definition ADRs as the canonical non-binding proposal;
- keep durable availability/player truth in Squad & Player;
- keep Training as signal/calculation owner;
- keep Match as fixture-scoped simulation/event owner;
- close GD-0005 R2-03 as boundary-defined, not numerically calibrated;
- promote the ADRs only after Nico explicitly approves.

## Nico Decision Log

Pending.

