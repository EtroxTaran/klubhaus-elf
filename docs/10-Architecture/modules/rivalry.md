---
title: Rivalry System module
status: draft
tags: [architecture, module, rivalry, derby]
context: rivalry
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0057-rivalry-system-context]], [[../09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
---

# Rivalry System Boundary

## Purpose

Owns the between-club rivalry graph: a canonical scoring context that
computes a 5-sub-score emergent rivalry value per club pair, classifies
it into threshold tiers, applies deterministic per-season decay, and
publishes rivalry/derby facts as external read models + events for
other contexts to apply their own policies (per ADR-0057, Vernon
canonical scoring-context pattern).

## Owns

- `RivalryEdge` aggregate (per club pair ClubA × ClubB → sub-score
  graph + history; threshold-tier FSM with 5 states None / Mild /
  Strong / High / Volatile).
- `RivalrySubScoreHistory` (per `RivalryEdge`: timeline of sub-score
  updates with source-event references).
- `RivalryGraphSlice` projection (per club: top-N rivals snapshot for
  UI + read-model queries).
- Decay policy (deterministic per-season application).
- Threshold-tier classification rules (tier derived from current
  `rivalry_score`, not stored independently).
- `RivalryScoringService` domain service (the formula) +
  `RivalryEventAggregator` process manager (consumes upstream events,
  updates aggregates).

Does **not** own: single-club state (Club Management), match results
(Match), transfer events (Transfer), fan-incident classification (Fan
Ecology / Audience & Atmosphere), Pyro-incident trigger logic
(Matchday-Event-Engine), sanction escalation (Regulations), atmosphere
computation + fan-side `derby_factor` (Audience & Atmosphere), or
commercial interpretation (CommercialPortfolio — see Invariants).

## Public contract

Commands (draft, ADR-0057 §Public contract direction):

- `RegisterRivalryPairCandidate` (lazy on first fixture between two
  clubs)
- `RecordIncidentSignal`
- `RecordTransferTensionSignal`
- `ApplyEndOfSeasonDecay`
- `ReclassifyTierBoundary` (admin / community-overlay override)
- `ImportRivalrySeedFromOverlay` (Community Overlay Pipeline surface)

Domain events (draft):

- `RivalrySubScoreUpdated`
- `RivalryTierTransitioned` (None → Mild → Strong → High → Volatile,
  deterministic cause)
- `RivalrySnapshotTakenForFixture`
- `RivalryDecayApplied`
- `RivalryOverrideValidated`
- `RivalryOverrideRejected`

Queries / read models (draft):

- `RivalryScore(clubA, clubB, date)` — composite score + tier + sub-
  score breakdown.
- `IsDerbyFixture(matchId)` — boolean + tier label + supporting reasons.
- `TopRivalsForClub(clubId, limit)` — ranked rival list for UI.
- `RivalryIncidentTimeline(rivalryEdgeId)` — Expert-tier UI consumer.
- `RivalryGraphSnapshot(saveDate)` — full graph for analyst / Manager
  & Legacy retrospective consumption.
- `DerbyContext(matchId)` — composite read model (tier + supporting
  reasons + historical highlights) for Tactics + Match + Narrative.

Rivalry does **not** publish `RivalryCommercialSignal` (removed by
ADR-0111). Published language stays rivalry-native: the tier-
transition event, `DerbyContext` and score/tier queries above.

## Storage ownership

- Per-save tables only, in the save's `save_<uuidv7hex>` schema (per
  ADR-0027). No platform-scope cross-save rivalry state.
- Rivalry owns its own schema (`RivalryEdge` + sub-score history +
  graph slice). Per ADR-0121 no shared tables and no cross-context
  joins; all cross-context input arrives through public events /
  queries only.
- Sub-score updates fire via the ADR-0028 transactional outbox.
- A legacy/overlay-configured rivalry seed (ADR-0051 / ADR-0016) is
  copied into the save snapshot at creation and never re-read during a
  running save.

## Consumers / Producers

Consumes facts (producers → Rivalry):

- Match — `MatchResolved` (sporting sub-score).
- Transfer — `TransferCompleted` (transfer-tension sub-score).
- Fan Ecology / Audience & Atmosphere — `FanIncidentLogged` (fan-
  incident sub-score).
- Club Management — `ClubFoundedInLocation` / `ClubRelocatedToLocation`
  (regional base).
- League Orchestration — `SeasonAdvanced` (triggers decay batch).

Produces facts (Rivalry → consumers, via read models +
`RivalryTierTransitioned`):

- Audience & Atmosphere (atmosphere multiplier, fan-side `derby_factor`)
- Matchday-Event-Engine via Club Management (Pyro-incident trigger)
- Watch Party (auto-proposal)
- Manager & Legacy (future archetype signal)
- Notification (derby copy)
- Match (derby classification at `lineup_locked`)
- Tactics (future derby-specific opposition awareness)
- Regulations & Compliance (downstream sanction chain via matchday-
  event-engine)
- CommercialPortfolio (consumes `RivalryTierTransitioned` /
  `DerbyContext` through a local ACL/projection — ADR-0111)

## Invariants

- Open Host Service + Published Language: consumers treat rivalry tier
  + score + derby classification as external facts and apply their own
  policies in their own contexts; they do not reach into Rivalry state.
- Rivalry stores the relationship graph but not the club nodes; Club
  Management owns `ClubId` identity.
- Threshold-tier FSM is derived from current `rivalry_score`;
  transition events emit when the score crosses a tier boundary in
  either direction.
- Deterministic per-season decay batch only, triggered by
  `SeasonAdvanced`; decay rates per sub-score per the GDDR (regional
  has no decay).
- No cross-context table joins (ADR-0121); inputs arrive only through
  public events / queries.
- CommercialPortfolio (not Rivalry) owns commercial interpretation, and
  Audience & Atmosphere (not Rivalry) owns fan-side `derby_factor`
  (ADR-0111).

## Dependencies

- [[../09-Decisions/ADR-0057-rivalry-system-context]] (context
  definition; draft — do not implement yet)
- [[../09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]]
  (commercial-signal removal + ACL boundary)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema
  convention)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins)

## Open items

- The ADR lists commands, events, read models and consumed facts at
  **draft** precision only ("Public contract direction"). Exact
  payload shapes, field names and versioning are not yet pinned.
- ADR-0057 names `RivalryGraphSlice` (projection) while the GDDR /
  read-model list use `RivalryGraphSnapshot(saveDate)`; the source
  does not reconcile aggregate-name vs read-model-name. Transcribed
  both as written.
- Concrete per-save table names / DDL are not specified beyond the
  `save_<uuidv7hex>` schema rule.
