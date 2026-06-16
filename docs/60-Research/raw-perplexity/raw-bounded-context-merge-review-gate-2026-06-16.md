---
title: Raw - Bounded-context merge-review gate
status: raw
tags: [research, raw, perplexity, bounded-context, ddd, context-map, portfolio, merge-review, cognitive-load, fmx-160]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-160
related:
  - [[../bounded-context-merge-review-gate-2026-06-16]]
  - [[raw-bounded-context-merge-review-gate-source-checks-2026-06-16]]
  - [[../../40-Execution/fmx-160-context-portfolio-gate-decision-record-2026-06-16]]
  - [[../../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
  - [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# Raw - Bounded-context Merge-review Gate

Perplexity discovery pass for FMX-160. This raw capture is preserved as the
initial research input. Provider/source claims are checked in
[[raw-bounded-context-merge-review-gate-source-checks-2026-06-16]] before being
promoted into the synthesis.

## Prompt

For a docs-first football-manager PWA in DDD/modular-monolith planning, evaluate
whether a 28 bounded-context catalog should be treated as a final fixed target
or as a canonical current catalog/ceiling under a standing merge-review gate.
Use Domain-Driven Design bounded-context and context-map best practices,
cognitive-load/team-boundary practice, real-world software architecture
precedent and comparable sports-management/game product precedent. Include
recommendations for when to merge or keep separate contexts, ownership/cadence
of the gate, and how to avoid premature merges.

## Captured Answer

Perplexity recommended treating the 28-context map as the canonical current
catalog, but not as an immutable final target:

- keep the context map as the source of truth for current names, ordinals,
  clusters and relationships;
- treat the count as a ceiling that is actively managed through co-change and
  cognitive-load evidence;
- merge only where two candidate contexts repeatedly change together, share the
  same ubiquitous language, lack independent lifecycle/invariants and create
  more integration cost than separation value;
- keep contexts separate where they have distinct decision rights, lifecycle,
  consumers, model language or replay/compliance/data-retention reasons;
- use clusters as an ownership and review lens, not as new bounded contexts;
- require any merge to be recorded as a new decision rather than silently
  editing the catalog;
- keep the watch-list illustrative until real co-change exists.

## Recommended Gate Shape Captured

The answer proposed a lightweight portfolio review:

| Element | Captured recommendation |
|---|---|
| Catalog truth | The 28 map remains the current canonical catalog and ordinal source. |
| Count posture | The count is a ceiling under review, not a success metric. |
| Merge trigger | Repeated co-change, shared language, no distinct lifecycle and high integration/cognitive-load cost. |
| Keep-separate trigger | Distinct invariants, owners, lifecycle, public contract, compliance, replay or consumer responsibility. |
| Review unit | Review inside subdomain clusters first; cross-cluster merges require stronger evidence. |
| Decision mechanism | "Still distinct" or "merge proposal" must be written down; merge requires a new draft ADR/GDDR amendment. |
| Cadence | Milestone review plus triggered review when repeated co-change becomes visible. |

## Real-world DDD / Architecture Patterns Cited

- DDD sources frame bounded contexts as explicit model boundaries with local
  ubiquitous language and documented relationships.
- Context maps are the normal way to preserve boundaries while showing
  upstream/downstream and integration relationships.
- Teams should align ownership to domain boundaries, but boundaries must be
  revisited if one team owns many unrelated contexts or one context requires
  coordination across many teams.
- Practitioner guidance warns against finding bounded contexts for their own
  sake; additional contexts should be earned by revealed model and lifecycle
  differences.

## Comparable Game / Product Pattern Captured

The answer treated other sports-management games as breadth precedent rather
than architecture authority: large sports sims expose many feature areas, but
public product material rarely proves bounded-context seams. For FMX, comparable
games support the need for a broad domain catalog, while DDD evidence should
govern whether those features become separate contexts or sub-aggregates.

## Captured Citation List

- Martin Fowler, "Bounded Context", `https://martinfowler.com/bliki/BoundedContext.html`
- Microsoft Azure Architecture Center, "Use domain analysis to model microservices", `https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis`
- Vaadin, "DDD Part 1: Strategic Domain-Driven Design", `https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design`
- DevIQ, "Bounded Context", `https://deviq.com/domain-driven-design/bounded-context/`
- Philippe Bourgau, "Identify your core functional areas with Event Storming and DDD", `https://philippe.bourgau.net/build-or-buy-software-identify-your-core-functional-areas-with-event-storming-and-ddd/`
- Stack Overflow / Reddit discussion links appeared in the raw answer but are
  not promoted as authority for FMX decisions.

## Raw-use Limit

This file is discovery only. FMX-160 promotes only the parts corroborated by
the source-check note and the existing FMX ratification ledger.

