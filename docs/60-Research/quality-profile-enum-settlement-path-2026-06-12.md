---
title: "Quality-profile enum and settlement-path reconciliation (FMX-147)"
status: current
tags: [research, synthesis, quality-profile, settlement, match-engine, commercial-portfolio, ddd, schema-versioning, fmx-147]
context: [commercial-portfolio, match]
created: 2026-06-12
updated: 2026-06-13
type: research
binding: false
linear: FMX-147
related:
  - [[raw-perplexity/raw-quality-profile-enum-ddd-contract-2026-06-12]]
  - [[raw-perplexity/raw-quality-profile-real-world-football-2026-06-12]]
  - [[raw-perplexity/raw-quality-profile-sim-games-2026-06-12]]
  - [[raw-perplexity/raw-pre1-contract-replacement-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../50-Game-Design/match-engine]]
  - [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
---

# Quality-profile enum and settlement-path reconciliation (FMX-147)

## Scope

FMX-147 closes the ADR-0101 D3 research and decision layer: ADR-0070 published a three-valued
`qualityProfileClass`, while the match-engine/ADR-0096 vocabulary has four canonical profiles:
`competitive-full`, `interactive-standard`, `background-detailed`, `background-fast`.

This note preserves the research chain and the Nico-approved decision. ADR-0101 can become
`binding: true` once the ADR-0070/ADR-0101 patches apply this D3 outcome.

## Current constraints

- [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface|ADR-0096]]
  already treats the four quality profiles as portfolio-wide determinism/replay vocabulary.
- [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract|ADR-0070]]
  is accepted/binding and its previous public sketch was `schemaVersion: 1` with
  `qualityProfileClass: 'backgroundFast' | 'standard' | 'expert'`.
- [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement|ADR-0086]]
  already has the reversal+repost path for background summaries that are later resimulated.
- ADR-0101 D2 and D4 are clause-binding through FMX-149 and FMX-146. Nico's FMX-147 decision closes
  D3 and lets ADR-0101 become fully binding.

## Evidence synthesis

DDD/event-contract research supports a versioned published language:

- old event meaning should not be changed in place;
- enum drift that routes business behavior should become explicit and typed;
- a canonical published enum is acceptable when the concept is already cross-portfolio and has a clear owner;
- if a consumer needs a business route, publish or derive a named route rather than overloading an enum name.

The 2026-06-13 supplemental refresh supports a narrow pre-1.0 exception: because FMX is still
docs-vault-only, with no implemented event store, persisted saves, external consumers or long-lived
v1 payloads, the old ADR-0070 sketch can be replaced now instead of carrying a legacy reader obligation
into the first implementation. This does not weaken the future rule: once fixture-commercial profile
events are persisted or published for integration, breaking changes require versioning/upcasters.

Real football supports multi-axis fixture treatment:

- match risk, crowd operations, security/stewarding and commercial category are event-specific;
- commercial match categories exist, but they are not the same as simulation output depth;
- high-risk/showpiece fixtures justify detailed operational settlement, while low-impact fixtures can use cheaper paths.

Comparable sports-management games support quality tiers:

- full/interactive modes expose granular event control;
- quick/background modes collapse detail for pace;
- mass simulation must be cheap, deterministic and explicit;
- upgradable detailed background simulation needs reconciliation rather than silent reinterpretation.

## Options considered

| Option | Shape | Pros | Cons | Recommendation |
|---|---|---|---|---|
| **A. Canonical v2 enum + derived settlement path** | Add `FixtureCommercialProfilesPublished.schemaVersion: 2`; replace the old v1 `qualityProfileClass` sketch with canonical `qualityProfile` plus typed `settlementPath` | Removes enum drift, makes routing deterministic and matches ADR-0096; accepted with the pre-1.0 no-live-payload exception | Future post-implementation breaking changes must be versioned/upcasted | **Accepted** |
| B. Keep both enums with ACL translation | Leave ADR-0070 published shape mostly intact; CommercialPortfolio translates `qualityProfileClass` to internal routes | Preserves BC-local language; smallest doc delta | Keeps duplicate vocabulary and drift risk in the published contract | Acceptable only if Nico wants maximum local autonomy |
| C. Keep the 3-value class and document a 4-to-3 mapping | Map four match profiles into existing `backgroundFast`/`standard`/`expert` values | Minimal schema churn | Still hides settlement routing behind an overloaded class and blurs `interactive-standard` vs `background-detailed` | Not recommended |

## Decision - Nico 2026-06-13

Nico selected:

1. **D3 shape = Option A** — ADR-0070 `FixtureCommercialProfilesPublished.schemaVersion: 2` with
   canonical `qualityProfile` plus derived `settlementPath`.
2. **Settlement mapping = foreground/summary/lightweight** — the table below.
3. **Compatibility = pre-1.0 replace** — replace the old ADR-0070 sketch now and record that this is
   safe only because there are no live v1 events, saves, external consumers or durable integration
   fixtures.

## Accepted D3 contract

Pin this D3 mapping:

| Canonical match quality profile | Settlement path |
|---|---|
| `competitive-full` | `foreground_per_event` |
| `interactive-standard` | `foreground_per_event` |
| `background-detailed` | `background_summary_then_reconcile` |
| `background-fast` | `lightweight_stateless` |

Semantics:

- `foreground_per_event`: event-level matchday settlement, compatible with FMX-46 foreground operating-cost paths.
- `background_summary_then_reconcile`: settle now through the ADR-0086 background summary; if later upgraded/resimulated, reverse and repost through ADR-0086 D3.
- `lightweight_stateless`: low-cost background settlement path with no event-log authority by default.

Minimum schema-v2 contract:

```ts
FixtureCommercialProfilesPublished = {
  schemaVersion: 2,
  profiles: ReadonlyArray<{
    fixtureCommercialProfileId: FixtureCommercialProfileId,
    fixtureCommercialProfileVersion: int,
    fixtureId: FixtureId,
    // ...unchanged ADR-0070 stable fixture/commercial rule facts...
    qualityProfile:
      | 'competitive-full'
      | 'interactive-standard'
      | 'background-detailed'
      | 'background-fast',
    settlementPath:
      | 'foreground_per_event'
      | 'background_summary_then_reconcile'
      | 'lightweight_stateless',
    provenance: ProfileProvenance
  }>
}
```

Compatibility rule:

- The old `schemaVersion: 1` / `qualityProfileClass` sketch is replaced in the accepted ADR because
  FMX is pre-implementation and has no durable v1 payloads.
- `schemaVersion: 2` is the first buildable fixture-commercial quality-profile contract.
- After implementation or any published-for-integration use, future breaking changes require a new
  version/upcaster path; persisted events are never reinterpreted in place.

## Source quality note

Perplexity was used as the exploratory layer and then cross-checked with targeted source passes:
SGSA risk/stewarding guidance, Arsenal match categories, OOTP quick-play controls, ZenGM mass-sim
positioning and event-sourcing documentation. Football Manager-specific claims from Perplexity were
kept as genre background only unless already supported by other vault notes. The 2026-06-13 pre-1.0
replacement refresh is supplemental only because its citation quality was weaker than the primary
event-sourcing and source-check trail.
