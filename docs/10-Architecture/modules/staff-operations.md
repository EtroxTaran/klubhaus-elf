---
title: Staff Operations module
status: draft
tags: [architecture, module, staff, backroom, lifecycle]
context: staff-operations
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0053-staff-operations-context]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
---

# Staff Operations Boundary

## Purpose

Owns the operational layer of backroom staff: contract lifecycle, role
assignment, pipeline-coverage, wage scheduling and specialisation
metadata. Hangs operations on top of People identity facts and emits wage
+ effect-readiness events that downstream contexts consume (per
[[../09-Decisions/ADR-0053-staff-operations-context]]).

## Owns

- `StaffContract` aggregate — contract-lifecycle FSM
  (Offered → Signed → Active → Expiring → Expired / Terminated / Renewed).
- `StaffRoleAssignment` aggregate — slot model (Sport Director, Chief
  Scout, Set-Piece Coach, Head of Youth, etc.) plus free-role overflow for
  ad-hoc specialists.
- Pipeline-coverage read model spanning the six default pipelines
  (Recruitment, Development, Training, Medical, Tactics, Match-Day).
- Wage schedule — weekly cost projection per active contract.
- Staff specialisation as effect-modifier metadata (coach Attacking vs
  Defensive; medical / fitness specialisations). Concrete gameplay effects
  remain in the consuming contexts.

Does **not** own: staff identity / persona substrate / OCEAN labels /
skill-perk profile (People, ADR-0052); wage ledger entries themselves
(Club Management, ADR-0050 — Staff Operations emits, Club Management
posts); player contracts / wages / transfers (Squad & Player, Transfer);
cross-save manager identity / legacy (Manager & Legacy, ADR-0051).

## Public contract

Commands:

- `OfferStaffContract`
- `SignStaffContract`
- `RenewStaffContract`
- `TerminateStaffContract`
- `AssignStaffRole`
- `ReassignStaffRole`
- `UpdateStaffSpecialisation`

Domain events:

- `StaffContractOffered`
- `StaffContractSigned`
- `StaffContractRenewed`
- `StaffContractExpiring`
- `StaffContractExpired`
- `StaffContractTerminated`
- `StaffRoleAssigned`
- `StaffRoleReassigned`
- `StaffWagePosted` — consumed by Club Management's ledger; posted weekly
  as the aggregated `StaffWageBlockPosted` counterpart per
  [[../09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]].
- `PipelineCoverageRecalculated`
- `StaffSpecialisationUpdated`

Queries / read models:

- `StaffRoster` — active contracts plus role assignments per club.
- `RoleAssignmentBoard` — all configured slots with assigned actors and
  free slots.
- `PipelineCoverageSnapshot` — six-pipeline coverage view plus quality
  multipliers and staff-skill-aware explanation bands for the UI
  bottleneck visualiser.
- `WageScheduleProjection` — weekly + monthly + annual projected wage cost
  per club, broken down by role.

Consumed facts (read-only inputs):

- `ActorRegistered`, `StaffSkillProfileSnapshot` from People (ADR-0052,
  draft).
- `EconomyWeekAdvanced` from Club Management (weekly tick).
- `RogueliteRunEnded` from League Orchestration (run end — Manager & Legacy
  cross-run reset hook on new save creation, ADR-0051).
- `TrainingPlanSubmitted`, `MatchKickedOff` — pipeline-coverage
  recalculation triggers; no state mutation.

## Storage ownership

- Per-save tables only, in the `save_<uuidv7hex>` schema per
  [[../09-Decisions/ADR-0027-postgres-data-model]]. No platform-scope
  cross-save state.
- Owns its own schema for staff contracts, role assignments and the
  denormalised pipeline-coverage read model. No shared tables and no
  cross-context joins per
  [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]].
- Wage facts leave only as `StaffWagePosted` domain events through the
  ADR-0028 transactional outbox; Club Management consumes via ACL and posts
  its own ledger. No shared transactions.

## Dependencies

Producers it consumes facts from:

- People / Persona & Skills (actor identity + skill-profile snapshots,
  ADR-0052 draft).
- Club Management (`EconomyWeekAdvanced` weekly tick).
- League Orchestration (`RogueliteRunEnded`).
- Training, Match (read-only recalculation signals).

Consumers of its outputs:

- Club Management — `StaffWagePosted` → ledger.
- Training — coach effects.
- Transfer — chief-scout / data-analyst effects.
- Squad & Player — medical effects.
- Match — set-piece coach effects.
- Notification — staff-related inbox events.

ADRs:

- [[../09-Decisions/ADR-0053-staff-operations-context]] (context
  definition; accepted/binding).
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema).
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins).
- [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]] (wage-ledger
  boundary it emits into).
- [[../09-Decisions/ADR-0052-people-persona-and-skills-context]] (upstream
  actor identity + skill profile).
- [[../09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
  (aggregated wage-block posting counterpart).

## Invariants

- References staff by `ActorId`; never stores persona traits or
  skill-profile data (that stays in People, ADR-0052).
- Cross-context inputs arrive through public events / queries only; Staff
  Operations does not join across context tables.
- Wage facts are emitted, never written to Club Management tables directly
  (Customer-Supplier + ACL, eventually consistent).
- Pipeline-coverage read model is denormalised using only its own storage
  plus published events from People and the consuming contexts'
  effect-readiness signals (read-only).
- A legacy-configured staff seed (post-MVP) is copied into the save
  snapshot at creation and never re-read during a running save.

## Open items

- **`SetPieceCoachReadinessUpdated` emitter conflict.** The BCM prose and
  [[../05-Building-Blocks]] attribute publishing
  `SetPieceCoachReadinessUpdated` to Staff Operations, but ADR-0053's own
  contract lists do **not** include it, and the later Training
  context-definition (ADR-0130) assigns its emission to Training. This note
  follows the ADR-0053 contract; the ownership of that event is
  unresolved across sources.
- Pipeline-coverage read-model schema is provisional until playtest
  (ADR-0053 §Consequences).
- Exact consumer-side modifier formulas / bands for staff-skill effects
  remain follow-up design/balance work in the consuming contexts (ADR-0053
  + FMX-152); not pinned here.
