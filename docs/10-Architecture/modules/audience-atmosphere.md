---
title: Audience & Atmosphere module
status: draft
tags: [architecture, module, audience-atmosphere, fan-ecology, scoring-context]
context: audience-atmosphere
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0062-audience-and-atmosphere-context]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Audience & Atmosphere Boundary

## Purpose

Supporting scoring-subdomain boundary for the supporter base: owns the
per-segment cohort/mood model, the weekly atmosphere loop, persistent
ticketing-trust state, fan-politics incidents and the opt-in named-group
overlay, and publishes fan demand / atmosphere / incident signals to its
consumers (ADR-0062).

## Owns

Aggregates (per-save, per-club):

- `SupporterSegment` — per-segment population, loyalty floor, mood,
  volatility, attendance probability, season-ticket renewal probability,
  price sensitivity, propensity (catering / merch / hospitality /
  sponsor-fit), reference-price memory. Six default segments
  (Ultras/Hardcore, Core, Family, Fair-weather, Corporate, Casual).
- `AtmosphereSnapshot` — per-fixture atmosphere multiplier derived from
  rivalry × table × utilisation × form × weather × security × choreo
  participation.
- `FanIncident` — threshold-triggered FSM for choreo / protest banner /
  ticket boycott / ouster-call / scarf-down (triggered → active → decay
  → resolved).
- `TicketingTrustLedger` — persistent per-segment trust state with
  three-season shock memory.
- `NamedSupporterGroup` — opt-in / default-off fictional supporter-group
  overlay attached to a segment (identity archetype, red lines,
  mobilisation style, influence band, visibility tier, policy version,
  optional opaque People actor ref).
- Process Manager / Saga for the weekly atmosphere loop, season-ticket
  cohort feedback, politics-event escalation and trust-shock evaluation.

## Inputs

Consumed facts (public events / queries only, per ADR-0062 §Determinism
and storage rules):

- `RivalryTierTransitioned` from Rivalry System (ADR-0057) — atmosphere
  multiplier + fan-incident probability uplift.
- `MatchResolved` from Match — segment mood update + attendance feedback.
- `SeasonAdvanced` from League Orchestration — weekly tick scheduling +
  segment population evolution.
- `StadiumCapacitySnapshot` from Club Management StadiumOperations (or
  Stadium BC) — utilisation computation.
- `SeasonTicketCampaignClosed` from CommercialPortfolio (ADR-0061) —
  renewal-cohort feedback.
- `CommercialContractActivated` / `CommercialBreachOpened` from
  CommercialPortfolio — sponsor-misalignment / trust-shock evaluation.
- `EffectiveRuleSet` from Regulations & Compliance (ADR-0056) — UEFA SLO
  + GDPR Art. 6 / 9 + DSA Art. 16 obligations.
- `SaveSnapshotInitialised` from Save creation (ADR-0027 + ADR-0051) —
  cross-save legacy seeds + community-overlay segment customisation at
  save creation only.
- `SegmentNameOverridePack` / `AtmosphereMultiplierOverridePack` /
  `NamedSupporterGroupArchetypePack` from Community Overlay Pipeline
  (ADR-0059 proposed) — pack overrides at save creation only; A&A owns
  semantic validation.

## Outputs

Commands (draft, ADR-0062):

- `RecordFanIncident`, `RegisterChoreoCampaign`, `ConfirmBoycottThreshold`,
  `EscalateOusterCall`, `ResetTicketingTrustShock`,
  `OnboardNamedSupporterGroup`, `UpdateSegmentDemand` (internal weekly
  tick), `ApplyAtmosphereSnapshot` (internal per-fixture).

Domain events (draft, ADR-0062; consumers in parentheses):

- `FanDemandForecasted` (CommercialPortfolio)
- `FanIncidentLogged` (Rivalry System; Notification)
- `AtmosphereSnapshotPublished` (Matchday-Event-Engine; Match; Notification)
- `SegmentRenewalProbabilityUpdated` (CommercialPortfolio)
- `TicketingTrustStateChanged` (CommercialPortfolio)
- `OusterCallEscalated` (Club Management; Manager & Legacy; Notification)
- `BoycottThresholdConfirmed`
- `ChoreoCampaignRegistered`
- `FanPipelineQualityUpdated` (Manager & Legacy)
- `NamedSupporterGroupOnboarded` (opt-in / default-off)
- `SegmentMoodUpdated` (internal projection event)

Queries / read models (draft, ADR-0062):

- `FanDemandForecast` (CommercialPortfolio)
- `AtmosphereSnapshot` (Matchday-Event-Engine; Match)
- `SegmentMoodBoard` (Notification; Narrative)
- `TicketingTrustStateSnapshot` (CommercialPortfolio)
- `FanIncidentTimeline` (Notification; Narrative; Audit)
- `NamedSupporterGroupRoster`
- `OusterCallEscalationBoard` (Club Management; Manager & Legacy)
- `FanPipelineQualitySnapshot` (Manager & Legacy)
- `SLOLiaisonContact` — per-club liaison/contact identity as an opaque
  Person reference (Regulations & Compliance).

## Storage ownership

- Owns per-save tables only (`save_<uuidv7hex>` schema per ADR-0027);
  no platform-scope cross-save state.
- No cross-context joins: cross-context inputs arrive through public
  events / queries only and A&A does not join across context tables
  (ADR-0121 no-shared-tables fitness function; ADR-0062 §Determinism
  and storage rules).
- Schema holds per-segment state, atmosphere snapshots, fan-incident log,
  ticketing-trust ledger and the named-group overlay.
- GDPR posture: segment-level aggregate state only; no individual fan
  records. `NamedSupporterGroup` stores fictional group facts only; any
  representative is an optional opaque People actor/persona ref. A&A
  stores no People internals, real fan/member records, handles, photos,
  profiles or special-category labels.

## Consumers / Producers

- **Consumers of A&A outputs:** CommercialPortfolio, Rivalry System,
  Matchday-Event-Engine, Match, Notification, Manager & Legacy,
  Narrative, Regulations & Compliance, Club Management, Audit.
- **Producers A&A consumes from:** Rivalry System, Match, League
  Orchestration, Club Management (StadiumOperations / Stadium BC),
  CommercialPortfolio, Regulations & Compliance, Save creation,
  Community Overlay Pipeline (proposed).

## Invariants

- Does not own ticketing policy / price grid / season-ticket campaign FSM
  (CommercialPortfolio), stadium capacity / hospitality inventory
  (Club Management StadiumOperations / Stadium BC), rivalry-edge graph or
  rivalry sub-score formula (Rivalry System), People / Person identity
  (People), narrative storylet generation (Narrative), manager identity /
  archetype taxonomy (Manager & Legacy), finance ledger entries
  (Club Management), or the regulatory rule catalog (Regulations).
- Consumers couple via published events / queries through the ACL +
  transactional outbox (ADR-0028); no direct table access.
- `NamedSupporterGroup` overlay is opt-in / default-off and fictional by
  default; enabled only via explicit save/scenario setup or local/P2P
  Community Overlay import. Hosted UGC is future-scope behind a
  DSA/privacy/moderation/legal gate.
- Deterministic: weekly tick uses `AtmosphereRng(saveId, clubId, week)`,
  politics triggers `PoliticsRng(...)`, trust-shock `TrustRng(...)`
  (ADR-0018 sub-labels); no cross-RNG draws, no `Math.random` /
  `Date.now` in simulation paths.
- Cross-save legacy seeds and community-overlay packs are copied into the
  save snapshot at creation only and never re-read during a running save;
  A&A owns their semantic validation.
- IP-clean: no real club / supporter-group / fan-incident / person names
  embedded as samples (GD-0015 + ADR-0007).

## Open items

- The ADR labels commands, events and read models as **draft** ("Public
  contract direction"); exact payload schemas, field types and versioning
  are not yet pinned and must be fixed at contracts-first implementation.
- Concrete table / schema DDL within the `save_<uuidv7hex>` schema is not
  enumerated by the source.
- `SLOLiaisonContact` appears in the ADR storage/posture section as a read
  model but is not listed in the ADR's "Draft read models" list nor the
  BCM exposed-outputs row; surfaced here under storage posture, flagged as
  unconfirmed in the formal query contract.
- `NamedSupporterGroupOnboarded` and `SegmentMoodUpdated` events appear in
  the ADR contract list but not in the BCM §1 exposed-outputs row; the BCM
  row also omits the `NamedSupporterGroupRoster` / `OusterCallEscalationBoard`
  / `FanPipelineQualitySnapshot` query naming differences — BCM vs ADR
  list reconciliation is unresolved in source.

## Dependencies

- [[../09-Decisions/ADR-0062-audience-and-atmosphere-context]] (context definition; draft — do not implement yet)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables / no cross-context joins)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema convention)
- [[../09-Decisions/ADR-0028-postgres-transactional-outbox]] (event delivery)
- [[../09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] (RNG sub-label discipline)
- [[../09-Decisions/ADR-0057-rivalry-system-context]] (`FanIncidentLogged` consumer)
- [[../09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] (`FanDemandForecast` / `ticketingTrustState` contract origin)
- [[../09-Decisions/ADR-0061-club-management-sub-aggregate-audit]] (parent audit ADR)
- [[../09-Decisions/ADR-0052-people-persona-and-skills-context]] (opaque People actor ref)
- [[../09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] (storylet consumer)
- [[../09-Decisions/ADR-0056-regulations-compliance-context]] (`EffectiveRuleSet` consumer)
- [[../09-Decisions/ADR-0051-manager-and-legacy-context]] (cross-save legacy seeds)
- [[../09-Decisions/ADR-0059-community-overlay-pipeline-context]] (community-overlay packs; proposed)
