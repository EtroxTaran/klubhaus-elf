---
title: ADR-0071 AI World Simulation context and drift contract
status: accepted
tags: [adr, architecture, ai-world, world-drift, ddd, determinism, rng, published-language, fmx-91]
created: 2026-06-03
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../../50-Game-Design/GD-0010-ai-world]]
  - [[../../60-Research/ai-world-drift-algorithm-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]]
  - [[../../60-Research/ai-manager-behaviour]]
  - [[../../60-Research/late-game-systems]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# ADR-0071: AI World Simulation context and drift contract

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> FMX-91 draft. Nico selected the proposed direction on 2026-06-03, but this ADR
> remains `proposed` / `binding: false` until ratified through the normal
> architecture gate.

## Date

- Proposed: 2026-06-03

## Context

`GD-0010` names a living dynamic-rival world as a central long-save goal, and
[[../../60-Research/ai-manager-behaviour]] sketches Rising Rival and Giant
Collapse events. [[../../60-Research/late-game-systems]] adds owner
archetypes, `instability_score`, bankruptcy/administration and continental era
labels. The current bounded-context map says AI manager decisions sit across
League, Club and Transfer, but FMX-91 requires a single owner for cross-domain
world-drift orchestration, event cadence, caps/cooldowns, RNG sub-labels and
calibration handoff.

The drift owner must not blur existing authority:

- League Orchestration owns season/fixture/competition lifecycle.
- Club Management owns the finance ledger and board/finance state.
- CommercialPortfolio owns commercial settlement and interpretation.
- Regulations owns rule catalogs and eligibility surfaces.
- Youth Academy / Data Generator own regen and youth internals.

Grounding: [[../../60-Research/ai-world-drift-algorithm-2026-06-03]] and raw
Perplexity capture
[[../../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]].

## Decision options

### D1 - World-drift owner

| Option | Description | Trade-off |
|---|---|---|
| A. League Orchestration process manager | Keep world drift inside League because it runs at season/competition cadence. | Smallest boundary change, but overloads League with owner/region/AI-management policy. |
| **B. AI World Simulation bounded context** | New proposed BC owns drift candidate scoring, caps/cooldowns, event publication and calibration sheets. | **Selected by Nico.** Clean language and ownership; larger architecture decision. |
| C. Split ownership | League, Club, Transfer and Youth own their own drift slices. | Avoids a new BC, but duplicates cadence, caps and candidate truth. |

### D2 - RNG allocation

| Option | Description | Trade-off |
|---|---|---|
| **A. Hybrid** | `WorldAiMgmtRng` for club/owner/AI-management drift; `WorldRng` for impersonal macro shifts. | **Selected by Nico.** Best segmentation and replay hygiene. |
| B. WorldAi only | All drift uses `WorldAiMgmtRng`. | Simpler for AI-club events, but macro world shifts become AI-management draws. |
| C. World only | All drift uses `WorldRng`. | Clean for structure, but weakens AI-management isolation. |

### D3 - Rising-nations scope

| Option | Description | Trade-off |
|---|---|---|
| **A. Reputation first** | Affect coefficients, league reputation, transfer pull and finance bands now; expose youth/regen diffusion as a follow-up hint. | **Selected by Nico.** Good living-world effect without crossing Youth/Data ownership. |
| B. Coefficients only | Limit to continental coefficient/slot pressure. | Safest, but under-serves the living-world goal. |
| C. Full talent diffusion | Also define regen/youth distribution effects now. | Richer, but crosses Youth Academy and Data Generator boundaries. |

### D4 - Caps and cooldowns

| Option | Description | Trade-off |
|---|---|---|
| **A. Two-level** | Strict global MVP caps plus reserved per-confederation caps for later multi-continent saves. | **Selected by Nico.** Legible MVP pacing and future scale. |
| B. Global only | One global cap/cooldown set. | Simplest; may under-drive future multi-continent worlds. |
| C. Per-confederation now | Activate caps per region immediately. | Scales earlier, but risks too many dramatic events. |

## Decision (proposed - selected by Nico 2026-06-03)

The proposed landing is **D1 = B, D2 = A, D3 = A, D4 = A**:

1. Introduce **AI World Simulation** as a proposed bounded context.
2. Use hybrid RNG allocation.
3. Keep rising nations reputation-first for FMX-91.
4. Use global MVP caps and reserved per-confederation caps.

## Proposed context contract

AI World Simulation owns:

- `WorldDriftCandidateSet`
- `WorldDriftProfile`
- `WorldDriftCooldownLedger`
- `WorldDriftParameterSheet`
- `WorldDriftEventLog`
- `ContinentalEraState`

Public outputs:

- `RisingRivalTriggered`
- `GiantCollapseTriggered`
- `ContinentalEraShifted`
- `WorldDriftParameterSheetPublished`

Public queries:

- `WorldDriftForecast(clubId | leagueId | regionId)`
- `WorldDriftEventHistory(scope, seasons)`
- `WorldDriftHealthSnapshot(seedRunId)`

## Event contract sketch

```ts
type WorldDriftEventBase = {
  eventId: EventId
  schemaVersion: 1
  idempotencyKey: string
  worldId: SaveId
  seasonId: SeasonId
  simulationYear: int
  driftProfileVersion: int
  rngLabel: string
  candidateScoreSnapshot: Record<string, int>
  provenance: {
    source: 'ai-world-simulation'
    generatedBy: 'season-end-structural-pass'
    inputHash: string
    engineVersion: string
  }
}

type RisingRivalTriggered = WorldDriftEventBase & {
  type: 'RisingRivalTriggered'
  targetClubId: ClubId
  regionId: RegionId
  leagueId: LeagueId
  investmentProjectProfileId: WorldDriftProfileId
  durationSeasonBand: RangeInt
  wageBudgetBandDelta: RangeBp
  reputationDeltaBand: RangeBp
  transferPullDeltaBand: RangeBp
  commercialBandDelta: RangeBp
  consumerPolicyRefs: DriftConsumerPolicyRef[]
}

type GiantCollapseTriggered = WorldDriftEventBase & {
  type: 'GiantCollapseTriggered'
  targetClubId: ClubId
  leagueId: LeagueId
  crisisProfileId: WorldDriftProfileId
  forcedSalePolicyRef: DriftConsumerPolicyRef
  wageBudgetBandDelta: RangeBp
  transferRestrictionPolicyRef: DriftConsumerPolicyRef | null
  boardCrisisPolicyRef: DriftConsumerPolicyRef
  aftermathReviewSeason: SeasonId
}

type ContinentalEraShifted = WorldDriftEventBase & {
  type: 'ContinentalEraShifted'
  regionId: RegionId
  eraLabelKey: string
  rollingWindowSeasons: int
  coefficientDeltaBand: RangeBp
  leagueReputationDeltaBand: RangeBp
  transferPullDeltaBand: RangeBp
  commercialBaselineDeltaBand: RangeBp
  youthDiffusionHint: DriftConsumerPolicyRef | null
}
```

All ranges are calibrated through FMX-52. No event carries final cash amounts or
direct ledger entries.

## RNG labels

Proposed sub-labels:

```text
worldAiMgmt:drift:season:<seasonId>:rising-rival:candidates
worldAiMgmt:drift:season:<seasonId>:rising-rival:shape:<clubId>
worldAiMgmt:drift:season:<seasonId>:giant-collapse:candidates
worldAiMgmt:drift:season:<seasonId>:giant-collapse:shape:<clubId>
worldAiMgmt:drift:season:<seasonId>:owner-resistance:<clubId>
world:drift:season:<seasonId>:continental-era:candidates
world:drift:season:<seasonId>:continental-era:shape:<regionId>
```

Adding a new drift mechanism later must add a new label, never draw from an
existing sequence.

## Invariants

1. Same `worldSeed`, engine version and input facts produce byte-identical
   `WorldDrift*` event sequences.
2. AI World Simulation never writes Club Management ledger rows.
3. AI World Simulation never queries another context's tables directly.
4. Every event is self-contained enough for consumers to store an ACL projection.
5. All final numeric constants live in FMX-52 calibration sheets, not this ADR.
6. Youth/Data Generator internals are not mutated by FMX-91; only a follow-up
   `youthDiffusionHint` may be published.
7. MVP drama caps are global; per-confederation caps are reserved and inactive
   until ratified.

## Consequences

Positive:

- One owner for world-drift cadence, caps and event history.
- Drift becomes explainable and soak-testable.
- Long-save dynamism no longer lives as scattered research prose.

Negative / constraints:

- Adds a proposed bounded context to the target model and requires ratification
  before implementation.
- Requires careful ACL discipline so AI World does not become a hidden god
  service.
- Requires FMX-52 calibration before any final values can be accepted.

## Follow-ups

- FMX-89 consumes `GiantCollapseTriggered` and `RisingRivalTriggered` for
  ownership-transition and bankruptcy FSMs.
- FMX-84 consumes `ContinentalEraShifted` for late-game/national-team arcs.
- Youth/Data Generator follow-up decides how `youthDiffusionHint` affects regen
  or youth distribution, if at all.
