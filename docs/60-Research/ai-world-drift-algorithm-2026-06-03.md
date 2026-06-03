---
title: AI world-drift algorithm spec (FMX-91)
status: current
tags: [research, ai-world, world-drift, dynasty, determinism, game-design, ddd, fmx-91]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-91
sourceType: external
related:
  - [[raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]]
  - [[ai-manager-behaviour]]
  - [[late-game-systems]]
  - [[determinism-and-replay]]
  - [[club-boss-analysis]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
  - [[ai-club-economy-behaviour-2026-06-01]]
  - [[../50-Game-Design/GD-0010-ai-world]]
  - [[../50-Game-Design/GD-0011-career-progression]]
  - [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# AI world-drift algorithm spec (FMX-91)

## Question

FMX-91 closes gap G8: `GD-0010` and [[ai-manager-behaviour]] describe
Rising Rival, Giant Collapse and rising-nations / continental power-shift
concepts, but no canonical trigger predicates, cadence, RNG labels, owner/trait
resistance or calibration handoff exists. The issue also asks to reconcile the
older structural-event sketch with the takeover/administration model in
[[late-game-systems]].

## Summary

The recommended landing, selected by Nico during FMX-91 planning on
2026-06-03, is:

- **AI World Simulation as proposed bounded context.** World drift is not a
  hidden League helper. AI World Simulation orchestrates structural drift and
  publishes world-drift events; existing contexts keep their own authority.
- **Hybrid RNG allocation.** `WorldAiMgmtRng` covers club/owner/AI-management
  drift. `WorldRng` covers impersonal macro region/league shifts.
- **Rising nations reputation-first.** FMX-91 affects coefficients, league
  reputation, transfer pull and finance bands. Regen/youth diffusion is exposed
  as a follow-up parameter interface, not owned here.
- **Two-level caps.** MVP has strict global drama caps; per-confederation caps
  are reserved for future multi-continent saves.

The spec should not lock final probabilities or constants. It defines banded
parameters and health KPIs that flow into FMX-52 calibration.

## Inputs

- [[ai-manager-behaviour]] §10 and §12: existing Rising Rival / Giant Collapse
  sketch plus `WorldAiMgmtRng` labels.
- [[late-game-systems]] §6.3 and §11.4: `instability_score`, ownership
  archetypes, bankruptcy/administration and continental era labels.
- [[determinism-and-replay]]: named RNG streams, `WorldRng`,
  `WorldAiMgmtRng`, stream-isolation and same-seed replay requirements.
- [[../30-Implementation/economy-calibration-and-soak-test-runbook]]:
  parameter sheets, scenario sheets, golden baselines and 50/100-year soak
  metrics.
- [[raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]]: real football
  competitive-balance patterns plus long-running game anti-staleness patterns.

## Findings

### F1 - Real football drift is structural, not random flavour

Durable drift mechanisms are wage/revenue feedback, owner changes, financial
stress, promotion/relegation shocks, continental money/coefficients and talent
pull. These are strong enough to become trigger families. Exact elasticities,
probabilities and frequency targets stay calibration inputs.

### F2 - Games avoid runaway dominance through visible pressure

The best pattern is not hidden rubber-banding. Dominant clubs should face
legible pressure: wages, expectations, fixture congestion, rivals countering
them, agent/player playing-time concerns, financial controls and board/fan
pressure. Every drift event needs an in-fiction explanation and a future-facing
signal before it becomes a shock.

### F3 - Staged events are safer than one-shot dice

Rising Rival and Giant Collapse should be staged. A candidate enters a pending
state when metrics cross thresholds; a seeded draw chooses timing/shape inside a
cooldown; later events apply profile deltas through owning contexts. This keeps
determinism, debugging and player trust intact.

### F4 - AI World Simulation is the cleanest proposed owner

The old map put league-wide structural AI decisions in League Orchestration and
per-club behaviour in Club/Transfer. FMX-91 adds enough cross-domain policy to
justify a proposed AI World Simulation bounded context:

- it has its own language (`WorldDriftProfile`, `WorldDriftEvent`,
  `ContinentalEra`, `DriftParameterSheet`);
- it coordinates long-running process state across clubs, leagues and regions;
- it should publish facts, not write ledgers or mutate other contexts.

League Orchestration remains owner of seasons, fixtures and competition
registries. Club Management remains ledger writer. Regulations owns rule
catalogs. Youth/Data Generator own regen internals.

### F5 - Hybrid RNG matches intent and replay segmentation

Club/owner/manager drift is AI-management behaviour and should use
`WorldAiMgmtRng`. Macro league/continent shifts are impersonal world structure
and should use `WorldRng`. The sub-labels must include season/year and entity id
so adding a new mechanism later does not perturb existing streams.

### F6 - Rising nations should start with reputation and pull

Rising-nations drift should first affect league/region reputation, coefficient
state, continental pull, transfer attractiveness and finance-band modifiers.
Direct regen distribution would cross Youth Academy and Data Generator
ownership; FMX-91 should only publish a `youthDiffusionHint` / parameter hook for
later Youth/Data work.

## Proposed world-drift mechanisms

### Mechanism overview

| Mechanism | Candidate state | Draw stream | Cadence | Effects | Cap model |
|---|---|---|---|---|---|
| Rising Rival | Region/division title vacuum + eligible club pool | `WorldAiMgmtRng` | Seasonal structural pass | owner/investment project, wage-budget band, reputation lift, transfer pull, news arc | Global MVP cap; per-confed reserved |
| Giant Collapse | high-success club with age/wage/debt/instability pressure | `WorldAiMgmtRng` | Seasonal structural pass after financial audit | fire-sale mandate, wage-band reduction, transfer restriction, board/ownership crisis event | Global cooldown |
| Continental Era Shift | 10-year rolling region/league performance | `WorldRng` | Season end / coefficient update | league/region reputation, coefficient/slot pressure, commercial multiplier band, transfer-pull band | Global MVP cap; per-confed reserved |

### Canonical trigger shape

Each mechanism uses the same deterministic shell:

```text
candidateSet = pure query of current save state
score = deterministic weighted metric using published facts
pending = score crosses banded threshold and cooldown allows
draw = labelled RNG decides timing/shape within the allowed band
event = self-contained WorldDrift*Published event
effect = owning contexts consume event and apply their own policy
```

The event itself never writes Club Management ledger rows and never changes Youth
or Data Generator internals.

### Archetype resistance

Archetype resistance modifies candidate score and event shape, not stream choice:

- Foundation/community owner dampens collapse and takeover pressure.
- Sugar-daddy / benefactor profile increases rising-rival project likelihood and
  spending horizon.
- Asset-stripper / murky owner profile increases collapse severity and forced
  sale shape.
- Legendary or strongly typed managers may resist tactical/personality drift,
  but owner/finance drift still follows club/board facts.

All modifiers are banded parameters for FMX-52.

## Event contracts to promote

AI World Simulation should publish self-contained events:

- `RisingRivalTriggered`
- `GiantCollapseTriggered`
- `ContinentalEraShifted`

Each event carries: identity/version, source season/year, RNG label, candidate
score snapshot, selected effect profile id, affected club/league/region ids,
duration band, consumer instructions as opaque policy references, and provenance.

Consumers:

- Club Management consumes only through Customer-Supplier + ACL facts and writes
  any ledger results itself.
- CommercialPortfolio consumes commercial/reputation hints and interprets
  settlement/accrual through its own policies.
- League Orchestration consumes region/competition effects only where they
  change league/competition metadata after approved gates.
- Notification/Narrative consume public facts for player-facing explanation.
- Youth/Data Generator consume only reserved follow-up hints, not binding
  mutation commands.

## Calibration handoff to FMX-52

FMX-91 adds parameter sheets, not constants:

| Parameter family | Examples | FMX-52 health metric |
|---|---|---|
| Candidate thresholds | title-vacuum seasons, instability score, coefficient trend window | candidate count per 50y save |
| Event probabilities | pending-to-trigger probability, shape weight, owner-profile weight | event frequency and diversity |
| Effect magnitudes | wage-budget band, reputation delta, finance multiplier, transfer-pull delta | title churn, wage/revenue Gini, revenue Gini |
| Cooldowns/caps | global MVP cap, mechanism cooldown, reserved per-confed cap | drama density, non-chaotic pacing |
| Resistance modifiers | owner profile, manager archetype, club age/squad profile | collapse/rise fairness by archetype |

Minimum soak additions:

- Same `worldSeed` + config -> byte-identical drift-event sequence.
- Across 50 years, at least one non-incumbent serious challenger emerges in
  long-running top-tier saves unless the calibration profile explicitly disables
  structural shocks.
- No one club wins beyond the configured title-concentration band without
  visible pressure events firing.
- Giant Collapse and Rising Rival events do not exceed configured drama density.
- Continental Era Shift frequency stays within configured region-volatility
  bands.

## Nico decisions captured

- D1 owner: **New AI World Simulation bounded context**.
- D2 RNG: **Hybrid** (`WorldAiMgmtRng` for club/AI-management drift,
  `WorldRng` for macro world shifts).
- D3 rising-nations scope: **reputation-first**.
- D4 caps: **two-level global MVP + reserved per-confederation**.

These decisions are recorded in draft/proposed artifacts. Binding ratification
still follows the normal ADR/GDDR gate.
