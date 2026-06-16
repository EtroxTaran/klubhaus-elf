---
title: Raw Source Checks - Bounded-context merge-review gate
status: raw
tags: [research, raw, source-check, bounded-context, ddd, context-map, portfolio, merge-review, cognitive-load, fmx-160]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-160
related:
  - [[../bounded-context-merge-review-gate-2026-06-16]]
  - [[raw-bounded-context-merge-review-gate-2026-06-16]]
  - [[../../40-Execution/fmx-160-context-portfolio-gate-decision-record-2026-06-16]]
  - [[../../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
  - [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# Raw Source Checks - Bounded-context Merge-review Gate

## Checked Sources

| Source | Type | Useful evidence | Limits |
|---|---|---|---|
| Martin Fowler, "Bounded Context", `https://martinfowler.com/bliki/BoundedContext.html` | DDD primary/practitioner reference | Bounded Context is central to DDD for large models and teams; DDD divides large domains into explicit bounded contexts; context maps are worthwhile when contexts relate. | Does not prescribe a numeric context count or FMX-specific merge cadence. |
| Microsoft Azure Architecture Center, "Use domain analysis to model microservices", `https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis` | Official architecture guidance | Bounded contexts contain a domain model for a specific subdomain; context maps document interactions; team ownership should align to domain boundaries, and boundaries/team structure should be revisited if ownership becomes incoherent. | Written for microservices journeys; FMX uses modular-monolith logical contexts, so deployment advice is translated cautiously. |
| Vaadin, "DDD Part 1: Strategic Domain-Driven Design", `https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design` | Practitioner DDD guidance | A bounded context has a consistent language and clear boundary; context maps document relationships; shared-kernel growth can signal contexts should merge; guidance warns against finding contexts for their own sake. | Secondary source; useful for heuristics, not authority over FMX's portfolio. |
| DevIQ, "Bounded Context", `https://deviq.com/domain-driven-design/bounded-context/` | Practitioner glossary | A bounded context establishes a domain boundary and local ubiquitous language; context mapping explains relationships and team interactions. | Glossary-level detail only. |
| Existing FMX research, [[../bounded-context-portfolio-reconciliation-2026-06-07]] | Local synthesis | Already grounded the 28-context portfolio, clusters, coupling/cognitive-load framing and "merge contexts that always co-change" watch rule. | Older packet did not reconcile the later June 8 Option B body drift in GD-0038/ADR-0089. |
| [[../../40-Execution/decision-queue-2026-06-08-ratified]] | FMX decision record | Nico's ratified scope call for GD-0038 / ADR-0089 chose **B**: adopt the reconciled 28-context map as canonical count source, but keep the count under a standing merge-review gate. | Operational ledger; FMX-160 applies the existing decision and does not invent a new one. |

## Tool / Source-access Notes

- Perplexity was used first for discovery, per FMX workflow.
- Firecrawl search attempts returned plan-limit errors and were not used.
- Direct checks against Football Manager and OOTP public product pages were not
  promoted: one route returned access-denied material, and another returned
  noisy product/SEO HTML. They are acceptable as broad genre-color only, not
  as bounded-context evidence.
- Stack Overflow and Reddit surfaced as raw discussion links only; they are not
  used as authoritative support.

## Source-check Conclusions

1. **The June 8 ledger is decisive for FMX-160.** The active FMX choice is not
   "28 final"; it is "28 canonical catalog and ceiling under a standing
   merge-review gate."
2. **DDD supports explicit boundaries plus periodic re-evaluation.** Contexts
   should be separate where they protect distinct language, lifecycle,
   invariants or ownership; they should merge when separation adds integration
   and cognitive-load cost without corresponding model independence.
3. **Clusters are a review lens, not new boundaries.** The six ADR-0089
   clusters help ownership and cognitive load but must not become a hidden
   architecture layer.
4. **No numeric co-change threshold is source-proven for FMX today.** Use
   milestone/triggered review now; add metrics only when code and PR history
   exist.
5. **Comparable games do not settle the boundary question.** They justify broad
   product-domain coverage, while DDD evidence and FMX co-change evidence decide
   whether feature areas stay separate contexts.

## Related

- [[../bounded-context-merge-review-gate-2026-06-16]]
- [[raw-bounded-context-merge-review-gate-2026-06-16]]
- [[../../40-Execution/fmx-160-context-portfolio-gate-decision-record-2026-06-16]]
- [[../../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]
- [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]

