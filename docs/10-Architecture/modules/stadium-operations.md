---
title: Stadium Operations module
status: draft
tags: [architecture, module, stadium-operations, venue, matchday]
context: stadium-operations
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0061-club-management-sub-aggregate-audit]], [[../09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../state-machines/stadium-operations]]
---

# Stadium Operations Boundary

## Purpose

Owns the physical-venue operational surface of a club: the matchday timeline,
facility condition/maintenance, the non-matchday venue calendar and the
seat-class / hospitality capacity reality. Ratified as its own bounded context
(Option C) by [[../09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
(FMX-32); read its ADR body's Option-B "inside Club Management" wording through
the ratified Option C lens.

## Owns

- `MatchdayTimeline` (per-fixture matchday FSM:
  `Preparing → DoorsOpen → InPlay/Kickoff → Halftime → SettlementPending → Reset`).
- `FacilityCondition` (per-facility: age + decay sub-FSM + maintenance-project
  lifecycle).
- `VenueEventCalendar` (per-club non-matchday event bookings).
- `SeatClassInventory` (capacity by class: standing, seating, family, premium,
  suites, accessibility, away allocation) and `HospitalityInventory`
  (suite + box physical inventory).
- Pitch-condition state (drainage, undersoil heating, maintenance, accumulated
  usage/wear) — FSM in [[../state-machines/pitch-condition]] (ADR-0077); this
  context remains the `PitchConditionChanged` emitter.
- Process Manager / Saga for the weekly facility-decay + maintenance lifecycle.

## Public contract

Transcribed from ADR-0061 §Public contract direction and the
[[../bounded-context-map]] Stadium Operations row (exposed outputs).

**Commands**

- `ScheduleMatchdayTimeline`, `AdvanceMatchdayTimeline`, `TriggerMatchdayEvent`
- `BookVenueEvent`, `CompleteVenueEvent`
- `ScheduleMaintenanceProject`, `CompleteMaintenanceProject`
- `RecordPitchCondition`, `RegisterFacilityComplianceCheck`
- `RebalanceSeatClassInventory`

**Queries (published read models)**

- `StadiumCommercialSnapshot`, `StadiumCapacitySnapshot`, `MatchdayTimelineBoard`,
  `FacilityComplianceSnapshot`, `VenueEventCalendarBoard`, `PitchQualitySnapshot`,
  `HospitalityInventorySnapshot`

**Domain events**

- `MatchdayTimelineScheduled` *(note: BCM exposed-outputs lists the
  `MatchdayTimelineAdvanced` / `MatchdayEventTriggered` pair; `…Scheduled` is
  named in the ADR §Public contract direction)*,
  `MatchdayTimelineAdvanced`, `MatchdayEventTriggered`
- `VenueEventBooked`, `VenueEventCompleted`
- `MaintenanceProjectScheduled`, `MaintenanceProjectCompleted`
- `PitchConditionChanged`, `FacilityComplianceChecked`
- `SeatClassInventoryRebalanced`
- `StadiumCommercialSnapshotPublished` (consumed by CommercialPortfolio +
  Club Management ledger via ACL per ADR-0050)

## Storage ownership

- State lives in a **per-save schema** (`save_<uuidv7hex>`) per
  [[../09-Decisions/ADR-0027-postgres-data-model]]; this context owns its own
  tables exclusively.
- **No shared tables / no cross-context joins** per
  [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]];
  other contexts read via published Snapshots/Reference + ACL, never by reading
  these tables.
- Domain events are emitted through the ADR-0028 transactional outbox.
- The concrete Drizzle table layout for the matchday-timeline / facility /
  venue-event / inventory aggregates is **not** given by the ADR (see
  [§ Open items](#open-items)).

## Consumers / Producers

**Consumers** (read its outputs):

- **Match** — `StadiumCapacitySnapshot` + `PitchConditionChanged` at
  `lineup_locked` (Reference + Snapshot).
- **Matchday-Event-Engine** — `MatchdayEventTriggered`.
- **Regulations & Compliance** — `FacilityComplianceChecked` +
  `StadiumCapacitySnapshot` for stadium-infrastructure compliance.
- **CommercialPortfolio** — `StadiumCommercialSnapshot` +
  `HospitalityInventorySnapshot` (matchday + hospitality + venue-event revenue).
- **Club Management** — facility-cost / matchday-OPEX events via
  Customer-Supplier + ACL for ledger posting (ADR-0050).
- **Audience & Atmosphere** — `StadiumCapacitySnapshot` for utilisation.

**Producers** (facts it consumes via ACL):

- **Match** — `MatchResolved` (final attendance + pitch-wear inputs).
- **League Orchestration** — `SeasonAdvanced` (facility-decay weekly trigger).
- **Regulations & Compliance** — `EffectiveRuleSet`.
- **Rivalry System** — `RivalryTierTransitioned` (atmosphere + security-risk).
- **Club Management** — `EconomyWeekAdvanced` (facility-cost calculation).
- **Environment & Climate** — weather/forecast facts + pitch-weather derivation
  rules (ADR-0077).

## Invariants

- This context owns the physical capacity / inventory reality only; hospitality
  **revenue accounting** and **ticketing settlement** belong to
  CommercialPortfolio (Option D), not here.
- Matchday FSM transitions use **deterministic clocks; no `Date.now`**.
- The weekly facility-decay tick uses `StadiumRng(saveId, clubId, week)`, a
  sub-label of `WorldRng` per ADR-0018 §3.
- `Reset` is the terminal state of a fixture's matchday timeline.
- Cross-context access is contract-only (Snapshots / published events + ACL); no
  shared tables or cross-context joins (ADR-0121).
- Phase is research / analysis / architecture: this note is `binding: false`
  and transcribes only what the source defines.

## Open items

Public-contract elements ADR-0061 / the BCM leave unspecified (must not be
invented; see [[../state-machines/stadium-operations]] §Open decisions for the
full FSM-level gap list):

- **Per-edge matchday triggers/guards** — one `AdvanceMatchdayTimeline` command
  covers all transitions; the actor/clock and guard per edge are undefined.
- **`SettlementPending` exit semantics** — which settlement (matchday OPEX per
  ADR-0050 / commercial per CommercialPortfolio Option D) gates `→ Reset`.
- **Facility-decay sub-FSM** — named but no states, condition bands or decay
  constants; maintenance-project intermediate states beyond `Scheduled →
  Completed` undefined.
- **VenueEvent lifecycle** beyond `Booked → Completed` (no cancel / clash /
  overlap-with-matchday states).
- **SeatClass / Hospitality inventory** — whether these carry a lifecycle FSM
  beyond a `Rebalanced` operation is not stated.
- **Persistence schema** — no Drizzle table layout, PK/FK shape or indexes given.
- **Standalone context ADR ordinal** — no `ADR-0061-stadium-operations-context`
  file exists; a dedicated Option-C context ADR would carry a new ordinal.
