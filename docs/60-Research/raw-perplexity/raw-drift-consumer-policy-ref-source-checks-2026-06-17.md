---
title: "Raw - DriftConsumerPolicyRef source checks"
status: raw
tags: [research, raw, source-checks, ddd, event-sourcing, fifa, uefa, football-manager, governance, world-drift, fmx-139]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-139
related:
  - [[../drift-consumer-policy-ref-contract-2026-06-17]]
  - [[raw-drift-consumer-policy-ref-ddd-2026-06-17]]
  - [[raw-drift-consumer-policy-ref-realworld-2026-06-17]]
  - [[raw-drift-consumer-policy-ref-games-2026-06-17]]
  - [[../../40-Execution/fmx-139-drift-consumer-policy-ref-decision-queue-2026-06-17]]
---

# Raw - DriftConsumerPolicyRef source checks

## Scope

Targeted source checks after the Perplexity discovery passes. This note is raw
research; the synthesized recommendation lives in
[[../drift-consumer-policy-ref-contract-2026-06-17]].

## DDD / event sourcing

### Microsoft Learn - Event Sourcing pattern

Source:
<https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>

Checked facts:

- Event sourcing stores the series of actions in an append-only store and uses
  it as the system of record.
- Event handlers can update read-only projections/materialized views.
- Events should capture business intent, not only low-level state changes.
- Events are immutable; schema evolution should use tolerant deserialization,
  event versioning, upcasting or new event types.
- Idempotent handlers are required because consumers can receive duplicate
  deliveries.

FMX-139 implication:

- `DriftConsumerPolicyRef` cannot be only a mutable lookup key. A replay-safe
  drift event needs the policy catalog version and the resolved effect snapshot
  required by consumer projections.

### Martin Fowler - Event Sourcing

Source: <https://martinfowler.com/eaaDev/EventSourcing.html>

Checked facts:

- Event sourcing captures every change as an event and can rebuild application
  state by replaying the event log.
- Rebuild/replay is a core reason to store events.
- External interactions must be handled carefully because replaying current
  external calls is not equivalent to replaying historical facts.

FMX-139 implication:

- Consumer contexts should be able to rebuild their ACL projections from the
  drift events they received, without querying AI World Simulation's current
  catalog tables during replay.

### Marten event-sourcing documentation

Source: <https://martendb.io/events/learning>

Checked facts:

- Marten documents event streams, projections/read models and event-sourcing
  learning material around replayable event histories.

FMX-139 implication:

- The recommended pattern remains event log -> projection, not live cross-context
  joins.

## Football governance sources

### FIFA Transfer system

Source: <https://inside.fifa.com/transfer-system>

Checked facts:

- FIFA's official transfer-system page places the football transfer system under
  the Football Regulatory Subdivision.
- FIFA presents the Clearing House as operational since November 2022 and tied
  to training rewards and financial integrity in the international transfer
  system.
- FIFA exposes transfer reports, clearing-house and agent/education material as
  public transfer-system surfaces.

FMX-139 implication:

- Real football governance separates regulatory ownership, transfer operations,
  training rewards and financial integrity. A drift event may reference those
  themes, but FMX should keep fictional policy refs abstract and route concrete
  consumer application to the owning FMX contexts.

### FIFA Legal

Source: <https://inside.fifa.com/legal>

Checked facts:

- FIFA's official legal page groups rules/reports, legal portal, Football
  Tribunal, decisions, CAS, anti-doping, compliance, integrity and education.
- FIFA states its Legal & Compliance Division is responsible for legal,
  governance, compliance and regulatory matters involving FIFA.

FMX-139 implication:

- Legal/regulatory causes can exist as source tags and explanation tags, but
  `DriftConsumerPolicyRef` should not copy real-world legal clauses or expose
  real federation names as game contracts.

### UEFA documents portal

Sources:

- <https://documents.uefa.com/>
- <https://documents.uefa.com/api/opensearch?query=club%20licensing%20financial%20sustainability&limit=10&startIndex=1&content-lang=en>
- <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2026-Online>

Checked facts:

- The official UEFA documents portal search returned "UEFA Club Licensing and
  Financial Sustainability Regulations" as the top result for 2026, updated
  2026-05-29.
- The same search returned the 2025 edition as the next major result and chapter
  entries for club licensing criteria.

FMX-139 implication:

- Licensing/financial-sustainability logic is versioned in real-world football
  governance. FMX should mirror that as versioned fictional policy catalogs,
  not as unversioned refs.

## Comparable-game sources

### Sports Interactive manual - Football Manager 2024

Sources:

- <https://community.sports-interactive.com/sigames-manual/football-manager-2024/>
- <https://community.sports-interactive.com/sigames-manual/football-manager-2024/finances-r4964/>
- <https://community.sports-interactive.com/sigames-manual/football-manager-2024/league-information-r4954/>

Checked facts:

- The official manual has dedicated pages for finances, competitions/fixtures,
  league information and other manager systems.
- The Finances page says financial management is board-relevant, finance screens
  expose income/expenditure, wages, FFP breakdowns, debt/loans, sponsorship and
  forecasts, and rule failures can trigger heavy punishments.
- The League Information page says specific league rules are available from the
  competition-screen Rules sub-tab and gives visible examples of squad/player
  eligibility rules, salary caps, foreign-player limits and transfer-window
  dates.

FMX-139 implication:

- Player-facing drift effects should resolve policy refs into visible rule,
  finance, board and news explanations. Internal policy ids are not the UI.

## Rejected or downgraded sources

- Perplexity's NFL forced-sale material is only a governance-process analogy,
  not football-domain authority.
- Reddit, YouTube, Facebook, design galleries, Unity forum discussions and
  personal blog posts remain discovery inputs only.
- OOTP/Paradox claims from the Perplexity answer were not source-checked deeply
  enough for canonical FMX wording in this packet.
- Premier League publication-page scraping did not yield stable extracted
  handbook/OADT content in this pass; no PL-specific rule is canonized here.

