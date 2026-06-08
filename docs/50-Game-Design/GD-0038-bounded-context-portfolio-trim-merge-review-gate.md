---
title: GD-0038 Bounded-context portfolio trim / merge-review gate
status: accepted
tags: [game-design, gddr, bounded-context, ddd, portfolio, governance, scope, merge-review, cognitive-load, fmx-105]
created: 2026-06-08
updated: 2026-06-08
type: gddr
binding: false
linear: FMX-105
related:
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]]
  - [[../60-Research/scouting-activity-bounded-context-2026-06-02]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# GD-0038: Bounded-context portfolio trim / merge-review gate

> **Status `draft` · `binding: false`.** A scope / portfolio-governance companion to **ADR-0089**.
> ADR-0089 proposes **D1 = A** (accept all nine new contexts ⇒ **19 → 28**, as written) and is itself
> still `proposed` / awaiting Nico's ratify. This GDDR does **not** touch ADR-0089 — it argues that the
> ADR's own **D1 A-vs-B** axis is worth keeping *genuinely open* as a standing, first-class
> **merge-review gate**, rather than treating 28 as final the moment ADR-0089 lands. Per the decision
> gate (`docs/90-Meta/collaboration-and-decision-protocol.md`) this is **options + a recommendation +
> a confidence level for Nico to ratify** — nothing here is accepted, and it does not supersede or
> re-open ADR-0089's other axes (D2 numbering, D3 clusters), which it explicitly leans on.

## Why this exists

ADR-0089 fixes the catalog, count, ordinal key and cluster grouping so nine parallel apply-PRs stop
colliding. That reconciliation work is **good and should land** — the framing problem (every ADR
claiming to be "the 20th") is real. The narrow question this note opens is downstream of that: **is
28 the right *standing* portfolio for a pre-MVP, small-team, offline-first product, or is it the
correct *ceiling* with an active gate to trim back toward?**

Three things make the question live rather than academic:

1. **ADR-0089 concedes the cost itself.** Its own *Negative* section leads with "28 contexts is a
   large surface to learn", and its D3 governance already adopts "a standing review to **merge** any
   pair that always co-changes." The merge-review is therefore *already in the decision* — it is just
   filed as a footnote under "accept all nine" rather than as a first-class gate. This GDDR promotes
   it, and keeps **D1 = B** ("collapse some of the nine to sub-aggregates") alive as the lever that
   review pulls.
2. **The grounding it cites points the same way.** The reconciliation research
   ([[../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]]) lists, as portfolio
   governance, both "own each *cluster*, not all 28 equally" and "willingness to **merge** contexts
   that always co-change", citing Jovanović "refactoring overgrown bounded contexts" and Team
   Topologies cognitive load. "~28 can be reasonable" is a *tolerance* statement, not a target.
3. **There are textbook merge candidates already visible in the catalog** (see §2). Naming them now
   — as *candidates under a gate*, not as forced merges — is cheaper than discovering co-change the
   hard way after the modules exist.

A secondary clean-up: ADR-0089 also **re-bases the stale "11-context" and "19-context" framings** that
ADR-0046, ADR-0077 and ADR-0084 still reason against onto the new 28-catalog. That re-basing is part of
why the catalog is valuable and is a reason to land ADR-0089 — this GDDR simply asks that the *count*
half stay actively managed afterwards.

## 1. What this note is **not** asking for

To stay inside the decision gate and avoid re-litigating settled ADRs:

- It is **not** asking to reject any of the nine per-context ADRs (0052/0054/0059/0060/0064/0071/0077/
  0081/0085). Each passed its own bounded-context test and carries a Nico direction; collapsing them
  *by fiat now* would re-open settled decisions — exactly the debt ADR-0089's rationale warns against.
- It is **not** asking to freeze the map or block the nine apply-PRs.
- It **accepts** ADR-0089's D2 (canonical ordinal key) and D3 (six clusters + no-shared-tables
  architecture-test invariant) as the right scaffolding — indeed Option B *depends* on the cluster
  grouping as the unit of ownership.

It asks one scoped thing: **should "28" be ratified as final, or as a ceiling with a live merge-review
gate that can trim back to a smaller standing count before MVP?**

## 2. Merge candidates the gate would watch (illustrative, not pre-decided)

Per the "always co-change ⇒ merge" heuristic, the catalog already shows pairs worth *watching*. These
are **candidates the gate evaluates**, each only collapsed if it demonstrably co-changes — never an
upfront merge:

| Candidate pairing (catalog #) | Why it is a watch-item | Counter-pressure (why it might stay split) |
|---|---|---|
| **Scouting (24) ↔ Transfer** (both Recruitment cluster) | Scouting output feeds transfer targeting; a scouting change often lands beside a transfer change. ADR-0064 itself notes the "20th-or-21st/22nd-depending-on-order" ambiguity. | ADR-0064 argues a distinct scouting lifecycle/ubiquitous language; if scouting evolves independently (knowledge fog, scout assignments) the split earns its keep. |
| **Statistics & Analytics (27)** as projection-only | ADR-0081 already fixes it as **read-model / projection-only**, never command authority (SA1). A projection family is the classic "is this a context or a read side of others?" case. | ADR-0081's case: one canonical owner for standings/leaders/handoff snapshots with its own rebuild/version lifecycle — that lifecycle is a genuine boundary even as a pure read model. The gate watches whether it ever needs its own *commands*; if not, "context vs cluster-level read side" is the live question. |
| **Media Ecology (28) ↔ Narrative (21)** (both Engagement cluster) | ADR-0065 already folded press-content into Narrative as a subdomain on co-change grounds; Media Ecology sits one step away on the same axis. | If outlet operational behaviour (ADR-0085) has its own simulation lifecycle distinct from narration, it stands alone. |
| **Environment & Climate (26)** (Sporting Core) | A small context whose pitch-state sub-point (ADR-0077) is already tracked as a *mini* ratification item — a hint it may be an aggregate inside Match/Stadium rather than a peer context. | If weather/pitch genuinely co-changes with neither Match nor Stadium and has its own model, it is a real (if small) BC; ADR-0077 makes that case. |

The gate's **deliverable** is not "merge these four" — it is a recurring, written **co-change check**
(e.g. per milestone, or when two modules' apply-PRs keep touching each other) that either ratifies
"still distinct" or proposes a merge **as a new draft ADR** (never a silent edit). The natural ownership
unit at scale is **the cluster** (ADR-0089 D3), so a merge inside a cluster is low-cost and reversible.

## 3. Options considered

- **A — Accept 28 as final (ADR-0089 D1 = A, as written).** Ratify the full catalog; treat the
  merge-review as the existing D3 footnote ("standing review to merge co-changing pairs") with no
  elevated status or named candidates. *Pro:* simplest; preserves every settled per-context decision;
  matches the ADR exactly. *Con:* the count is then "decided", and the well-documented cognitive-load
  cost of 28 contexts on a small pre-MVP team is carried in full with only a soft, unscheduled review
  to relieve it; the merge lever tends to atrophy once "28 = final" is the published number.
- **B — Keep D1 A-vs-B genuinely open as a standing merge-review gate (recommended).** Land ADR-0089's
  catalog/ordinal/cluster work *and* its re-basing of the stale 11/19 framings, but ratify the count as
  a **ceiling under an active gate**, not as final. Promote the merge-review to a first-class, scheduled
  governance step with the §2 watch-list as its starting agenda; trim any candidate that demonstrably
  always co-changes via a new draft ADR. *Pro:* matches both DDD authorities and ADR-0089's *own* cited
  grounding; actively manages cognitive load for a small team; loses nothing — every context still
  exists unless co-change is *proven*. *Con:* slightly more process; needs an owner and a cadence; risk
  of premature merges if the gate is run too eagerly (mitigated by "only on demonstrated co-change").
- **C — Defer / freeze additions at 19 until a real scaling signal.** Don't apply the nine new contexts
  yet; hold at the ratified 19 and add contexts only when a concrete pressure (a module that won't fit,
  a team that needs an independent seam) forces it. *Pro:* smallest standing surface now; maximal
  "so small as possible". *Con:* directly contradicts nine settled, Nico-directed ADRs and ADR-0089's
  reconciliation; re-opens decisions the project already paid for; the per-context modeling work
  (invariants, contracts) still has to live *somewhere*, so freezing the count can hide coupling inside
  over-large modules rather than removing it. This is the option ADR-0046/0077/0084's older framings
  implicitly reasoned against.

## 4. Recommendation

**Option B — treat the merge-review as a first-class ongoing gate rather than accepting 28 as final.**
ADR-0089's structural reconciliation (catalog, ordinal key, clusters, no-shared-tables invariant,
re-basing the stale 11/19 framings) is sound and should land; nothing in B blocks it. B differs only in
how the *count* is framed: a **ceiling actively managed down by co-change evidence**, not a finished
number. This is the reading most faithful to ADR-0089's own *Negative* section and its own cited
grounding (Jovanović "refactoring overgrown bounded contexts"; Team Topologies cognitive load;
"merge contexts that always co-change"). The **cluster** (ADR-0089 D3) is the natural ownership and
merge unit at scale, so the gate operates cheaply within cluster boundaries.

This is fundamentally a **scope judgement for Nico**: pursue B only if he wants the context count
**actively managed** rather than fixed. If he prefers to bank 28 and revisit opportunistically, A is a
legitimate and lower-process choice — the cost is purely the soft, unscheduled review. **B is not a
reason to delay ratifying ADR-0089**; it is a rider on *how* its D1 is ratified (final vs ceiling-with-
gate) plus the §2 starting agenda.

**Confidence: medium.** The DDD direction (count is secondary to coupling/cognitive load; merge on
co-change) is well-grounded and is ADR-0089's own position. The *medium* (not high) reflects that
whether 28 is "too many for now" is genuinely scope/taste-dependent and that the named §2 candidates
are illustrative — their co-change is plausible but unproven until modules exist. No external lookup
changes this; the relevant best-practice is already captured in the reconciliation research.

## 5. If Option B is ratified — shape of the gate (sketch, not binding)

Indicative only; concrete cadence/owner is Nico's to set:

- **Owner:** portfolio/architecture lead (today Nico per ADR-0046); the gate is a standing agenda item,
  not a new role.
- **Cadence:** per milestone, or triggered whenever two modules' apply-PRs touch each other N times.
- **Input:** the §2 watch-list plus any newly observed co-change pair; the cluster catalog (ADR-0089 D3)
  as the grouping lens.
- **Decision per candidate:** "still distinct" (record why) **or** "merge" → emit a **new draft ADR**
  with `Supersedes:` the relevant per-context ADR — never a silent edit to the catalog or map.
- **Invariant preserved:** merges only ever happen *inside* a cluster and only on **demonstrated**
  co-change; no upfront/forced merges, so no settled decision is re-opened speculatively.

## 6. Reserved for later (post-MVP)

- A lightweight **co-change metric** (how often two contexts' files change in the same PR) to make the
  gate evidence-driven rather than judgement-driven.
- Re-examining whether any **cluster** has grown into the real ownership/extraction seam (ADR-0089 D3
  anticipates clusters as future service-extraction boundaries).
- A symmetric **split** review (the gate's inverse) if any single context grows past its own cognitive
  load — the same Jovanović "overgrown bounded context" heuristic, run the other direction.

## Related

- [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]] — the parent
  decision; this GDDR keeps its **D1 = B** alive as a standing gate and accepts its D2/D3.
- [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] — projection-only
  owner; a primary §2 merge-watch candidate.
- [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] — scouting/transfer co-change
  watch candidate.
- [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]] /
  [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  / [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]] — older notes whose stale
  11/19-context framing ADR-0089 re-bases onto the 28-catalog.
- [[../60-Research/bounded-context-portfolio-reconciliation-2026-06-07]] — grounding: count vs
  coupling/cognitive load; clusters; "merge contexts that always co-change".
- [[../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
