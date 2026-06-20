---
title: Youth Academy module
status: draft
tags: [architecture, module, youth, academy]
context: youth-academy
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0060-youth-academy-context]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Youth Academy Boundary

## Purpose

Owns the annual academy lifecycle: youth intake generation, academy
facility + coaching development, and the promotion-to-senior lifecycle.
Runs an annual-cadence Process Manager (intake-calendar trigger → HoY
opinion → cohort generation → Squad snapshot → ledger posting) and
maintains the cross-cutting productivity + home-grown share signals.

## Owns

- **`AcademySeason` aggregate** (per-club, per-year) — season FSM
  (planning → intake-active → review → promotion-window → archived);
  intake-window + post-season promotion-window timing; investment-level
  and productivity-window snapshots copied at season start.
- **`YouthCohort` aggregate** (per-club, per-intake-year) — cohort FSM
  (scouted → invited → intake-event → review-decided → promoted /
  loaned / released), with a `CohortMember` subaggregate per prospect
  (HoY opinion, attribute ranges, archetype label, promote / loan /
  release decision).
- **`AcademyInvestmentLevel` aggregate** (per-club) — per-season slider
  (Junior Coaching / Youth Recruitment / Youth Facilities), facilities
  tier, scout-coverage handle; slider-change FSM (pending-budget →
  approved → effective → superseded).
- **`ProductivityCounter` projection** (per-club) — rolling EPPP-analogue
  audit score per audit window.
- **`HomeGrownShareCounter` projection** (per-club, per-save-scope
  competition) — rolling UEFA-HGP-analogue counter (derived projection;
  no standalone "is home-grown" truth stored — eligibility
  interpretation stays in Regulations & Compliance per ADR-0060 D2=A).
- **Annual Process Manager / Saga** orchestrating the academy cycle and
  the `AcademyCategoryAuditCycle` (per FMX-157 follow-up).

Does **not** own: player base data / attributes / contracts / injuries /
fitness / morale / match-minutes (Squad & Player); weekly per-player
development calc (Training); HoY + U-team-coach hire/fire/contract/wage
(Staff Operations); scout assignments / regional-coverage source
(Scouting / Transfer); wage ledger entries (Club Management); transfer-
window FSM (Regulations & Compliance); cross-save manager identity /
legacy / prestige (Manager & Legacy).

## Public contract

Commands:

- `ScheduleYouthIntake`
- `GenerateYouthCohort`
- `DecidePromoteCohortMember`
- `DecideLoanCohortMember`
- `DecideReleaseCohortMember`
- `SetAcademyInvestmentLevel`
- `OpenAcademyPromotionWindow`
- `CloseAcademyPromotionWindow`
- `ArchiveAcademySeason`

Queries (read models):

- `AcademyCohortBoard` — intake-event UI (HoY opinion, prospect cards,
  promote / release choice).
- `AcademySeasonOverview` — Development-Centre-style aggregate area.
- `AcademyInvestmentDashboard` — slider state + facilities tier + scout
  coverage.
- `ProductivitySnapshot` — rolling productivity score.
- `HomeGrownShareSnapshot` — per-competition home-grown share.
- `YouthCohortHistory` — long-tail cohort archive per club.

Domain events:

- `YouthIntakeScheduled`
- `YouthCohortGenerated`
- `YouthIntakeEventTriggered`
- `YouthCohortPublished` *(Snapshot → Squad & Player)*
- `YouthPromoted`
- `YouthLoaned`
- `YouthReleased`
- `AcademyInvestmentChanged`
- `AcademyInvestmentExpensePosted` *(→ Club Management ledger,
  ADR-0050)*
- `HomeGrownShareRecalculated` *(→ Regulations & Compliance ACL,
  ADR-0056 Tax-catalog pattern)*
- `YouthPipelineQualityUpdated` *(→ Manager & Legacy GD-0019 archetype
  hook; also a Fan Ecology / Notification consumer per BCM row)*
- `AcademySeasonArchived`

(FMX-157 follow-up additionally names an `AcademyPipelineSummaryUpdated`
producer surface for Manager & Legacy long-save summaries — see Open
items for its exact contract shape.)

## Storage ownership

- Owns per-save tables only (`save_<uuidv7hex>` schema per ADR-0027):
  cohort tables, intake events, promotion decisions, investment levels,
  productivity metrics, home-grown share rolling counter. No platform-
  scope cross-save state.
- No cross-context joins / no shared tables (ADR-0121 fitness function);
  cross-context inputs arrive through public events / queries only.
- Domain events emitted through the ADR-0028 transactional outbox.

## Consumers / Producers

Consumes (facts in):

- `StaffEffectReadinessUpdated` from Staff Operations (HoY + U-team-coach
  effect readiness, ADR-0053).
- `ScoutRegionalCoverageUpdated` from Scouting / Transfer.
- `CurrentTransferWindow` from Regulations & Compliance (ADR-0056;
  promotion-window gating).
- `SaveSnapshotInitialised` at save creation (ADR-0027 + ADR-0051;
  legacy + community-overlay seeds, copied once, never re-read).
- `EconomyWeekAdvanced` from Club Management (investment-cost tick).
- `RegionalYieldOverridePack` from Community Overlay Pipeline (ADR-0059,
  proposed; save-creation only).

Produces (consumed by): Squad & Player (`YouthCohortPublished`
Snapshot → materialises player records); Club Management
(`AcademyInvestmentExpensePosted` → ledger); Regulations & Compliance
(`HomeGrownShareRecalculated`); Manager & Legacy
(`YouthPipelineQualityUpdated`); plus Notification + Fan Ecology /
Audience & Atmosphere consumers per the BCM row.

## Invariants

- Per-save schema only; no cross-save state; no cross-context table
  joins (ADR-0121).
- All cohort generation draws use `IntakeRng(saveId, clubId, year)`, a
  sub-label of `WorldRng` (ADR-0018 §3). No cross-RNG draws, no
  `Math.random` / `Date.now` in simulation paths.
- `YouthCohortPublished` is a Snapshot: it carries composition +
  per-prospect attribute ranges + HoY opinion + archetype label +
  decision; subsequent academy edits do not retro-affect senior
  records.
- Home-grown share is a derived projection only; Regulations &
  Compliance owns the eligibility *interpretation*
  (`SquadRegistrationCheck` / `IsHomeGrownForCompetition`) — Academy
  stores training-history facts, not an "is home-grown" boolean
  (ADR-0060 D2=A).
- Post-season promotion window opens only when gated by
  `CurrentTransferWindow` (Regulations & Compliance, ADR-0056).
- `risk:legal` hardline (GD-0015 + ADR-0007): no real EPPP / NLZ / UEFA
  naming on gameplay-facing surfaces; abstract category-tier model only.

## Dependencies

- [[../09-Decisions/ADR-0060-youth-academy-context]] (context
  definition; accepted / binding).
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema).
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables).
- [[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (event
  delivery).
- [[../09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  (`IntakeRng` sub-label discipline).
- [[../09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  (investment-expense Customer-Supplier with Club Management).
- [[../09-Decisions/ADR-0053-staff-operations-context]] (HoY + U-team-
  coach role ownership; consumed by reference).
- [[../09-Decisions/ADR-0056-regulations-compliance-context]] (transfer-
  window + home-grown share ACL).
- [[../09-Decisions/ADR-0051-manager-and-legacy-context]] (cross-save
  legacy seeds; pipeline-quality consumer).

## Open items

- `AcademyPipelineSummaryUpdated` producer surface (FMX-157 follow-up)
  is named but its full command/event/payload contract is not pinned in
  ADR-0060.
- Loan-orchestration Process Manager (multi-BC: Youth Academy +
  Transfer + Squad & Player + Match) is named as future scope; its
  command/event contract is deferred to a follow-up ADR.
- EPPP-analogue category-audit-cycle Process Manager (audit-window FSM,
  downgrade-trigger policy, central-funding bonus posting) is named as
  future scope; not yet contract-specified.
- Cohort-history retention policy across 20+ in-game seasons is an open
  question tied to Manager & Legacy archive.
- All commands / events / read models above are at **draft** precision
  in ADR-0060 ("Public contract direction"); final field-level schemas
  are not yet defined.
