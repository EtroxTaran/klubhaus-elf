---
title: DriftConsumerPolicyRef Contract
status: current
tags: [research, synthesis, ddd, event-sourcing, ai-world, world-drift, policy-catalog, determinism, fmx-139]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-139
related:
  - [[raw-perplexity/raw-drift-consumer-policy-ref-ddd-2026-06-17]]
  - [[raw-perplexity/raw-drift-consumer-policy-ref-realworld-2026-06-17]]
  - [[raw-perplexity/raw-drift-consumer-policy-ref-games-2026-06-17]]
  - [[raw-perplexity/raw-drift-consumer-policy-ref-source-checks-2026-06-17]]
  - [[../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/bounded-context-map]]
---

# DriftConsumerPolicyRef Contract

## Intent

FMX-139 closes the placeholder in ADR-0071/GD-0024 where world-drift events
carry `DriftConsumerPolicyRef` values but the ref shape and policy-catalog
ownership were undefined. The issue matters because `RisingRivalTriggered`,
`GiantCollapseTriggered` and `ContinentalEraShifted` are consumed by Club
Management, CommercialPortfolio, Transfer and future Youth/Data work.

This note is non-binding research and synthesis. The paired decision queue asks
Nico to approve the concrete contract shape before it becomes accepted
architecture/game-design truth.

## Evidence Summary

DDD/event-sourcing evidence supports a hybrid contract:

- Event-sourced projections must be rebuildable from historical events.
- Mutable external policy lookups during replay break deterministic long-save
  behavior.
- Cross-context events should use published language and explicit versions.
- Events should carry business intent and the data needed by consumers, while
  not leaking the producer's internal model.

Real-world football governance supports versioned policy concepts without
copying real-law detail:

- FIFA's transfer-system and legal pages separate transfer-system governance,
  football regulatory ownership, legal/compliance and training-reward surfaces.
- UEFA's official documents portal exposes versioned Club Licensing and
  Financial Sustainability Regulations, with the 2026 edition current in the
  source check.
- These are useful as pattern anchors: policies have owners, effective versions,
  compliance outcomes and sanction-like effects.

Comparable-game evidence supports player-facing explanations, not raw ids:

- Sports Interactive's official FM manual exposes finance/FFP, debt/loans,
  forecasts, competition rules and league-specific eligibility rules through UI
  pages and contextual information.
- For FMX, `DriftConsumerPolicyRef` should be an internal replay/audit contract;
  UI should resolve it to localized labels, threshold bands, warnings, news and
  "why" explanations.

## Local Baseline

Existing FMX decisions constrain the answer:

- ADR-0071 says AI World Simulation owns world-drift cadence, caps, profiles,
  RNG labels and event publication, but it never writes Club Management ledger
  rows or mutates Youth/Data internals.
- ADR-0071 invariant 4 already requires every event to be self-contained enough
  for consumers to store an ACL projection.
- GD-0024 requires world drift to be structural, legible and not a hidden
  catch-up buff.
- ADR-0079 consumes `GiantCollapseTriggered` and `RisingRivalTriggered` for
  ownership-transition and bankruptcy/administration FSMs.
- GD-0043/FMX-52 retains final numeric calibration authority for effect
  magnitudes.

## Recommendation

Use **Option C: hybrid `DriftConsumerPolicyRef`**.

Each world-drift event should carry:

- a stable policy ref id;
- the immutable policy catalog key and catalog version;
- the effect family and target context;
- player-facing label/explanation keys;
- a minimal resolved snapshot containing severity, duration bands, value-band
  refs and constraint tags required by consumers;
- provenance back to the world-drift event/profile/catalog version.

This balances deterministic replay, compact payloads and catalog traceability.

## Proposed Contract

`WorldDriftPolicyCatalog` is the proposed AI World Simulation catalog for
published drift-consumer policy refs. It is not a shared lookup table. Consumers
receive refs through published drift events and persist their own ACL
projections.

```ts
type DriftConsumerPolicyRef = {
  policyRefId: DriftPolicyRefId
  policyCatalog: 'world-drift-consumer-policy'
  policyCatalogVersion: int
  effectFamily:
    | 'forced-sale'
    | 'transfer-restriction'
    | 'board-crisis'
    | 'consumer-finance'
    | 'commercial-baseline'
    | 'youth-diffusion'
  ownerContext: 'AI World Simulation'
  targetContext:
    | 'Club Management'
    | 'CommercialPortfolio'
    | 'Transfer'
    | 'Youth Academy'
    | 'Data Generator'
  scope: 'club' | 'league' | 'region' | 'competition'
  activationStatus: 'active' | 'reserved'
  policyLabelKey: string
  explanationTagKeys: string[]
  resolvedSnapshot: {
    severity:
      | 'advisory'
      | 'soft-restriction'
      | 'hard-restriction'
      | 'existential'
    durationSeasonBand?: RangeInt
    valueBandRefs?: Record<string, RangeBp | RangeInt>
    constraintTags: string[]
  }
  provenance: {
    driftProfileVersion: int
    generatedByEventId: EventId
  }
}
```

Rules:

- `policyCatalogVersion` is immutable once published for a save/engine version.
- `policyRefId` without catalog version and resolved snapshot is invalid for a
  world-drift event.
- `resolvedSnapshot` carries bands, tags and consumer constraints only. It does
  not carry final cash amounts, ledger entries, exact transfer fees or youth
  generation values.
- Consumers may enrich UI from catalogs, but replay and ACL projection must not
  require current AI World Simulation table reads.
- New effect semantics require a new catalog version and, if the event payload
  changes meaningfully, a new event schema version.

## Ownership Split

Recommended owner split:

| Concern | Owner |
|---|---|
| Candidate scoring, drift profiles, cooldowns, RNG labels and drift event publication | AI World Simulation |
| `WorldDriftPolicyCatalog` identity, version, effect family taxonomy and label/explanation keys | AI World Simulation |
| Final numeric calibration bands and acceptance gates | GD-0043 `world.drift` / FMX-52 calibration |
| Finance ledger posting and board/ownership/insolvency application | Club Management / ADR-0079 |
| Commercial settlement and commercial projection application | CommercialPortfolio |
| Transfer restriction interpretation | Transfer plus Regulations where eligibility rules apply |
| Youth/data internal generation effects | Future Youth Academy / Data Generator issue |

The catalog is therefore a producer-side published-language catalog, not a
consumer-owned rules engine.

## Event-family Mapping

| Drift event | Policy refs | Consumer meaning |
|---|---|---|
| `RisingRivalTriggered` | `consumerPolicyRefs[]` with `consumer-finance` and/or `commercial-baseline` | Consumer contexts project the investment/reputation/commercial pressure bands. |
| `GiantCollapseTriggered` | `forcedSalePolicyRef` | Club Management/ADR-0079 can open ownership-transition or forced-sale policy state from the event snapshot. |
| `GiantCollapseTriggered` | `transferRestrictionPolicyRef` | Transfer/Regulations-facing consumers can project an embargo, registration cap or spending constraint without AI World joins. |
| `GiantCollapseTriggered` | `boardCrisisPolicyRef` | Club Management can project board/ownership crisis state and link to insolvency/administration FSMs. |
| `ContinentalEraShifted` | `youthDiffusionHint` | Reserved typed ref for future Youth/Data work; no active youth mutation in FMX-139. |

## Player-facing Rule

`DriftConsumerPolicyRef` is not shown raw. Player-facing surfaces resolve:

- `policyLabelKey` into localized rule/news labels;
- `explanationTagKeys` into "why" facts such as title vacuum, owner instability,
  financial stress, coefficient trend or regional commercial lift;
- `resolvedSnapshot.severity` and bands into compact/standard/expert
  explanations.

This preserves GD-0024's no-hidden-catch-up promise.

## Decision Status

Awaiting Nico in
[[../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]].

Until approved, the ADR/GDDR edits in this PR are a concrete proposed amendment,
not binding implementation authority.
