---
title: Source Checks - FMX-157 Manager Legacy Scouting Youth Feed
status: raw
tags: [research, raw, source-checks, fmx-157, youth, scouting, ddd, events]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-157
sourceType: source-check
related:
  - [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[raw-fmx-157-academy-audit-retention-2026-06-19]]
  - [[raw-fmx-157-opposition-scouting-2026-06-19]]
  - [[raw-fmx-157-handoff-schemas-2026-06-19]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
---

# Source Checks - FMX-157 Manager Legacy Scouting Youth Feed

## Strong sources

| Source | Checked fact | FMX use |
|---|---|---|
| Premier League EPPP, `https://www.premierleague.com/en/footballandcommunity/youth-development/eppp` | The official page frames EPPP as a long-term youth-development strategy, names youth phases from U9 to U23, describes central tracking of academy data, independent academy audit, Category 1-4 status, and factors such as productivity, facilities, coaching, education and welfare. | Strong support for ADR-0060's academy category/productivity audit analogue. Use abstract FMX terminology, not real EPPP branding, per ADR-0007/GD-0015. |
| Microsoft Learn domain analysis, `https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis` | Bounded contexts should align to business capability, loose coupling, cohesion and ubiquitous language; each bounded context can have its own model/language. | Supports keeping Scouting report language, Youth Academy cohort language and Manager & Legacy summary language separate. |
| Martin Fowler Bounded Context, `https://martinfowler.com/bliki/BoundedContext.html` | Different contexts can contain different canonical models and should have explicit interrelationships. | Supports explicit producer-consumer seams instead of a shared youth/scouting kernel. |
| Microsoft domain events, `https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation` | Domain events separate side effects from domain logic; integration events propagate committed updates across bounded contexts. | Supports producer-owned events plus consumer ACL projections for the Scouting -> Youth Academy -> Transfer chain. |
| Microservices.io database per service, `https://microservices.io/patterns/data/database-per-service.html` | Service data should remain private; other services access it through APIs. CQRS/materialized views can maintain query views from events. | Supports no cross-context joins and consumer-owned projections for Manager & Legacy, Tactics and Transfer. |
| Martin Fowler Event Sourcing, `https://martinfowler.com/eaaDev/EventSourcing.html` | Event logs allow rebuild, temporal query and replay, often with snapshots for performance. | Supports reference-plus-snapshot handoffs and long-save youth/cohort summaries. |

## Weak or downgraded sources

| Source area | Result | FMX handling |
|---|---|---|
| DFB/NLZ primary audit cadence | This pass did not locate a strong official source for exact cadence/criteria good enough to quote as FMX-157 evidence. | Keep prior DFB/NLZ references as background only. Do not use them as the deciding source for FMX-157. |
| Two-season academy audit cadence | Perplexity surfaced the cadence from secondary material. | Treat as an FMX game-design option, not an external fact. |
| Football Manager opposition-report internals | Publicly available official/manual material and community sources were not strong enough to prove engine ownership. | Use only as player-expectation discovery. ADR-0080 and local DDD rules remain canonical. |
| Analyst workflow blogs | Useful to understand match-week opposition-prep flow. | Use for workflow intuition, not for authoritative architecture. |

## Source-check implications

- Academy category/audit is a credible real-world analogue, but exact FMX
  cadence, category effects and downgrade/upgrade thresholds are design
  decisions for Nico.
- DDD source checks support explicit bounded-context handoffs: producer-owned
  events, consumer-owned ACL projections, no shared kernel by default and no
  cross-context table joins.
- Opposition scouting should be kept as a split hook: Scouting owns report
  production and freshness; Tactics owns match-plan interpretation; Match
  consumes only frozen snapshots.
- Manager & Legacy should consume academy/scouting summaries at stable
  watermarks, not detailed current producer state.

## Related

- [[../manager-legacy-scouting-youth-feed-followups-2026-06-19]]
- [[raw-fmx-157-academy-audit-retention-2026-06-19]]
- [[raw-fmx-157-opposition-scouting-2026-06-19]]
- [[raw-fmx-157-handoff-schemas-2026-06-19]]
- [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
