---
title: ADR-0089 Bounded-context portfolio reconciliation and final count
status: accepted
tags: [adr, architecture, ddd, bounded-context, modular-monolith, governance, fmx-105]
created: 2026-06-07
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[../bounded-context-map]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0059-community-overlay-pipeline-context]]
  - [[ADR-0060-youth-academy-context]]
  - [[ADR-0064-scouting-activity-context]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[ADR-0081-statistics-analytics-read-model-owner]]
  - [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0089: Bounded-context portfolio reconciliation and final count

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored 2026-06-07. Resolves the structural knot where **nine**
> parallel ADRs each propose a new bounded context and each defers its map-patch "to reconcile with the
> other parallel proposals" — several literally claiming to be "the 20th". This ADR is the single place
> that fixes the **final catalog, count, ordinal numbering and cluster grouping**, so the individual
> apply-PRs land coherently. It **does not edit `bounded-context-map.md`** (ratify gate); it supplies
> the canonical target the map adopts when Nico ratifies. Awaiting Nico ratify.

## Date

2026-06-07

## Context

The ratified map holds **19** bounded contexts. Nine ADRs propose additions, each with its own DDD
justification and most with a live Nico direction, but each says its `bounded-context-map` patch is
"proposed-not-applied … reconcile with the other parallel proposals" (e.g. ADR-0085 "the 20th";
ADR-0077, ADR-0081 also 19→20; ADR-0064 "20th or 21st/22nd depending on order"). Left unreconciled,
the count is ambiguous and the apply-PRs would collide on numbering.

The nine proposals:

| ADR | Proposed context | Verdict |
|---|---|---|
| 0052 | People / Persona & Skills | own BC |
| 0054 | Narrative | own BC |
| 0059 | Community Overlay Pipeline | own BC |
| 0060 | Youth Academy | own BC |
| 0064 | Scouting Activity | own BC |
| 0065 | Narrative Media/Press content | **not a new BC — Narrative subdomain** |
| 0071 | AI World Simulation | own BC |
| 0077 | Environment & Climate | own BC (pitch-state owner sub-point — see ADR-0077) |
| 0081 | Statistics & Analytics | own BC (projection-only) |
| 0085 | Media Ecology | own BC |

Nine become own bounded contexts (0065 folds into Narrative) ⇒ **19 → 28**.

## Options considered

- **D1 — Portfolio.** **A. Accept all nine as own-BCs (28 total) ← recommended** · B. Collapse some of
  the nine to sub-aggregates to keep the count lower · C. Defer additions / freeze at 19.
- **D2 — Numbering rule (resolves the multiply-claimed "20th").** **A. Canonical catalog + fixed ordinal
  key by ADR number; map re-derives positions 20–28 from the catalog at each apply-PR ← recommended** ·
  B. First-to-ratify takes the next free ordinal (path-dependent, churns prose) · C. Renumber the whole
  table on every apply.
- **D3 — Governance.** **A. Group the 28 into six subdomain clusters + a context catalog + the
  no-shared-tables architecture-test invariant ← recommended** · B. Flat list, no clusters.

## Decision

Propose, awaiting Nico: **D1 = A, D2 = A, D3 = A.**

### D1 — Accept the 28-context portfolio

Count is **not** the architectural cost in a modular monolith; coupling/integration-surface and
cognitive load are (Evans/Vernon/Team-Topologies). Each of the nine passed its own bounded-context test
(distinct ubiquitous language, invariants, lifecycle, consumers, data) and carries a Nico direction;
ADR-0065 correctly stays a Narrative subdomain (its invariants co-change with Narrative). They remain
in-process logical modules behind commands/queries/events with no shared tables (ADR-0019 §5, ADR-0027),
so extraction stays a deployment change. **The map's final ratified count is 28.**

### D2 — Canonical catalog + fixed ordinal key

There is **no single "20th"**. Positions **20–28** are the nine new contexts in a **stable order keyed
by ADR number** (an arbitrary-but-deterministic tiebreak), independent of ratification date:

| # | Context | ADR | Cluster |
|---|---|---|---|
| 20 | People / Persona & Skills | 0052 | Recruitment, People & Career |
| 21 | Narrative | 0054 | Engagement & Narrative |
| 22 | Community Overlay Pipeline | 0059 | Platform & Governance |
| 23 | Youth Academy | 0060 | Recruitment, People & Career |
| 24 | Scouting | 0064 | Recruitment, People & Career |
| 25 | AI World Simulation | 0071 | Competition & World Simulation |
| 26 | Environment & Climate | 0077 | Sporting Core |
| 27 | Statistics & Analytics | 0081 | Competition & World Simulation |
| 28 | Media Ecology | 0085 | Engagement & Narrative |

Each individual apply-PR, when its ADR ratifies, inserts its row and sets the table header to the
**highest ordinal ratified so far** — but the ordinal *assigned to each context is fixed by this
catalog*, so partial ratification never reshuffles already-applied rows. The individual ADRs' "19→20"
patch language is superseded by this catalog (their patches still apply mechanically; only the header
count + ordinal come from here).

### D3 — Six subdomain clusters + catalog + architecture-test invariant

Group all 28 into six clusters (a cognitive-load "map of importance"; clusters are organisational aids,
not new boundaries, and a context may relate across clusters):

1. **Sporting Core** — Match, Tactics, Training, Squad & Player, Stadium Operations, Environment &
   Climate.
2. **Competition & World Simulation** — League Orchestration, Regulations & Compliance, Rivalry System,
   AI World Simulation, Statistics & Analytics.
3. **Club, Finance & Commerce** — Club Management, CommercialPortfolio, Staff Operations, Audience &
   Atmosphere.
4. **Recruitment, People & Career** — Transfer, Scouting, Youth Academy, People / Persona & Skills,
   Manager & Legacy.
5. **Engagement & Narrative** — Narrative, Media Ecology, Notification, Watch Party.
6. **Platform & Governance** — Identity & Access, Offline Sync, Audit & Security, Community Overlay
   Pipeline.

Plus: keep an authoritative **context catalog** (the §1 table is it) and make the **no-cross-context
table joins / no shared tables** rule an explicit architecture-test invariant (already implied by
ADR-0019/0027), and adopt a standing review to **merge** any pair that always co-changes.

## Rationale

DDD authorities place no cap on context count and treat it as secondary to coupling and cognitive load.
A modular monolith with clear contracts and no shared tables absorbs a high count cheaply, and the
grounding (Perplexity 2026-06-07) confirms "~28 bounded contexts can be entirely reasonable for a
complex single-player + async game" given subdomain alignment, controlled coupling, a maintained
context map and cluster grouping. Each of the nine is independently justified and Nico-directed, so
collapsing them now would re-litigate settled decisions and create the coupling debt those ADRs
documented. The only real risk — cognitive load — is addressed by the cluster grouping and catalog, not
by suppressing genuine boundaries. The canonical ordinal key removes the "everyone is the 20th"
ambiguity without making numbering depend on ratification order.

## Consequences

Positive:

- One coherent target map; the nine apply-PRs stop colliding on "the 20th".
- Final count (28) and per-context ordinal are fixed and ratification-order-independent.
- Cluster grouping caps cognitive load and gives future service-extraction seams.
- No premature merging; settled per-context decisions are preserved.

Negative:

- 28 contexts is a large surface to learn; mitigated by clusters + catalog + onboarding docs.
- Requires the architecture-test invariant to stay enforced as contexts grow.
- If a later proposal adds a 29th, this catalog must be updated in the same PR (single source of count).
- Environment & Climate's internal pitch-state ownership sub-point (ADR-0077) is tracked separately as a
  mini ratification item; it does not change the count.

## Supersedes

None. Reconciles (does not replace) the map-patch sections of ADR-0052, 0054, 0059, 0060, 0064, 0071,
0077, 0081, 0085; their patches apply mechanically while the header count + ordinal derive from this
catalog. ADR-0065 is confirmed **not** to add a context.

## Map patch proposal (proposed-not-applied)

`bounded-context-map.md` is **not edited by this ADR** (ratify gate). On ratification the map adopts:
(1) the §1 table header "Twenty-eight bounded contexts" with the nine rows from the catalog above in
ordinal order; (2) a new "## Subdomain clusters" subsection listing the six clusters; (3) each
individual context ADR's own §1 row / §2 Mermaid / §4 folder patch continues to apply, sourcing its
ordinal from the catalog here. Partial ratification renders only the ratified subset; the catalog
guarantees stable ordinals so no re-applied row shifts.

## Related Docs

- [[../../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]] - grounding (count vs
  coupling/cognitive-load; modular-monolith tolerance; nano-context heuristics; portfolio governance).
- [[ADR-0019-modular-monolith-ddd]] - logical contexts, extraction = deployment change.
- [[ADR-0027-postgres-data-model]] - no shared tables / per-context storage isolation.
- [[../bounded-context-map]] - target of the proposed-not-applied catalog patch.
- ADR-0052 / 0054 / 0059 / 0060 / 0064 / 0071 / 0077 / 0081 / 0085 - the nine new-context proposals
  reconciled here; [[ADR-0065-narrative-media-press-content-ownership]] confirmed as a Narrative
  subdomain (not a context).
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A.
