---
title: Bounded-context portfolio reconciliation — grounding 2026-06-07
status: draft
tags: [research, ddd, bounded-context, modular-monolith, governance, fmx-105]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
---

# Bounded-context portfolio reconciliation — grounding (2026-06-07)

The map sits at **19 ratified** contexts, but **nine** parallel proposals each describe themselves as
"the 20th" with a map-patch "proposed-not-applied". If all ratify the map grows to **~28** contexts.
This note grounds the portfolio-level call: is 28 too many, and how to keep it coherent.

## The contention

Nine proposals, each independently justified + most with a Nico direction, all claim a new context and
defer their map-patch "to reconcile with the other parallel proposals":

| ADR | Proposed context | Own BC? | Nico direction |
|---|---|---|---|
| 0052 | People / Persona & Skills | yes | recommended A (this sweep) |
| 0054 | Narrative | yes | chosen (FMX-3) |
| 0059 | Community Overlay Pipeline | yes | recommended D (this sweep) |
| 0060 | Youth Academy | yes | recommended C (this sweep) |
| 0064 | Scouting Activity | yes | chosen Option C 2026-06-02 |
| 0065 | Narrative Media/Press | **no — extends Narrative** | chosen 2026-06-02 |
| 0071 | AI World Simulation | yes | chosen D1=B 2026-06-03 |
| 0077 | Environment & Climate | yes | chosen D1=C 2026-06-05 (pitch-state owner open) |
| 0081 | Statistics & Analytics | yes | chosen 2026-06-05 |
| 0085 | Media Ecology | yes | chosen D1=B 2026-06-07 |

⇒ 9 new own-BCs (0065 folds into Narrative) ⇒ **19 → 28**.

## What best practice says (Perplexity Sonar, 2026-06-07)

- **There is no hard upper limit on context count.** Evans/Vernon/Context-Mapper/Team-Topologies focus
  on **boundaries, cohesion, coupling and cognitive load**, never a number. **Count is not the primary
  cost — coupling/integration-surface and cognitive load are.**
- **In a modular monolith, a high count is tolerable** when contexts stay in-process behind clear
  contracts (commands/queries/events) with **no shared tables** — exactly ADR-0019's design. No network
  tax; merge/split is cheap; architecture tests can enforce boundaries. "~28 bounded contexts can be
  entirely reasonable for a complex single-player+async game" given the conditions below.
- **Avoid nano-contexts.** A genuine BC has its own ubiquitous language, own invariants/transaction
  boundary, own change cadence, distinct consumers, own data. If invariants must be enforced *together*
  with a neighbour, or it always changes with its host, it's a **sub-aggregate/module/policy**, not a
  context. (This is exactly why 0065 Media/Press correctly stays inside Narrative.)
- **Govern the portfolio with:** (1) a maintained **context map** with edge types/frequency; (2)
  grouping contexts into **Core/Supporting/Generic subdomain clusters** (a "map of importance") to cap
  cognitive load — own each *cluster*, not all 28 equally; (3) an **authoritative catalog** (name,
  responsibility, subdomain, owned aggregates, integration points) giving a **canonical count** and
  preventing hidden proliferation; (4) **architecture tests** asserting no cross-context table joins /
  internal calls; (5) willingness to **merge** contexts that always co-change.

## Recommendation

1. **Accept the 28-context portfolio** (all nine as own-BCs except 0065, which stays a Narrative
   subdomain). Each passed its own DDD analysis + has a Nico direction; count is not the cost and the
   modular monolith absorbs it as logical modules (ADR-0019 §5: extraction is a deployment change).
2. **Resolve the "20th" contention with a canonical catalog + fixed ordinal key.** There is no single
   "20th" — positions **20–28** are the nine new contexts in a stable order (by ADR number). The map's
   numbered table is re-derived from this catalog at each apply-PR, regardless of ratification order.
3. **Introduce six subdomain clusters** so cognitive load is owned per-cluster, not per-context:
   Sporting Core · Competition & World Simulation · Club/Finance & Commerce · Recruitment/People &
   Career · Engagement & Narrative · Platform & Governance.
4. **Add architecture-test + catalog governance** (already implied by ADR-0019/0027 no-shared-tables;
   make it an explicit invariant) and a standing "merge if they always co-change" review.

## Sources

Perplexity Sonar 2026-06-07 (context count vs coupling/cognitive-load; modular-monolith tolerance for
high count; nano-context heuristics; portfolio governance — context maps, Core/Supporting/Generic
clustering, architecture tests; Milan Jovanović "refactoring overgrown bounded contexts"; Team
Topologies cognitive load). Internal: [[../10-Architecture/bounded-context-map]],
[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]].
