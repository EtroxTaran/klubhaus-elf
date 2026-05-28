---
title: Handoff FMX-34 Rivalry System Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-34]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-rivalry-system-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../../50-Game-Design/rivalry-system]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-34 Rivalry System Ownership (2026-05-28)

## Linear

- Issue: FMX-34
- Parent: FMX-24
- Unblocks: defined producer for `rivalry_score` consumed by Fan
  Ecology + Matchday-Event-Engine; clears the path for Watch Party
  auto-proposal logic, future Manager & Legacy "derby specialist"
  archetype signal, future Tactics derby-specific opposition
  awareness, future People + Narrative derby framing.

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via
  PR #83).
- Identified the residual question: 15-context map has no Rivalry
  owner despite `rivalry-system.md` designing concrete 5-sub-score
  emergent formula + threshold tiers + decay rules + named consumers.
- Ran three focused Perplexity queries:
  1. Genre - rivalry / derby modelling in football sims (FM, EA FC,
     OOTP, FIFA Manager, Anstoss). **Low confidence** - source-thin.
     FM has pre-authored rivalry DB but no documented formula;
     others not verifiable.
  2. DDD - canonical pattern for cross-cutting scoring / relationship
     systems (Vaughn Vernon, MS Learn DDD guidance, Vaadin DDD
     primer). **High confidence**. Real-world DDD analogues: credit
     rating + customer affinity + recommendation + supplier score.
  3. Real-world - 2023-2026 rivalry classification in football (UEFA
     Stadium and Security Regulations, Premier League SGSA Green
     Guide + Category A/B/C, Bundesliga DFL Rotspiel, academic
     derby pricing + attendance studies). **High confidence**.
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-rivalry-system-2026-05-28]].
- Synthesised
  [[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
  with six numbered findings F1-F6 (each with source + confidence).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]:
  `status: proposed`, `binding: false`. Three options (A Club sub-
  aggregate / B League sub-aggregate / C own context) + Option D
  (cross-cutting Policy Service / Domain Service called by each
  consumer) explicitly listed as Vernon anti-pattern and rejected,
  §Recommendation = Option C with three converging justifications,
  §Public contract direction (commands / events / read models /
  consumed facts), §Determinism and storage rules (per-save schema
  per ADR-0027 + legacy seeds at save creation per ADR-0051 +
  deterministic per-season decay batch from `SeasonAdvanced`), §Map
  patch proposal as four fenced ```diff``` blocks (order-tolerant
  with parallel ADR-0052 / ADR-0054 drafts).
- ADR number is **ADR-0057** (Narrative took ADR-0054, Tactics took
  ADR-0055, Regulations took ADR-0056; this is the next available).
- Updated [[../../00-Index/Decision-Log]] with new ADR-0057 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-34 anchor block to
  [[../../00-Index/Current-State]] before the FMX-30 / FMX-39 block.

## Open / next step

**Nico Accept Option C (recommended), choose A / B, or Defer call
on ADR-0057 is the next gate.**

- *Accept Option C (recommended)*: open a follow-up apply PR
  analogous to FMX-35 / FMX-36 / FMX-37 / FMX-39. Flip ADR-0057
  `status: proposed` → `accepted` and `binding: false` → `true`.
  Apply the §Map patch (four parts) to `bounded-context-map.md` in
  the same PR. Update Decision-Log status column. Update
  Architecture-Map / 05-Building-Blocks / Current-State "15 → 16
  bounded contexts" prose (or higher if ADR-0052 / ADR-0054 ratify
  in between - patch is order-tolerant).
- *Choose Option A (Club Management absorbs)*: edit ADR-0057 to
  record the choice; the synthesis names "rivalry is a between-club
  concern; Club owns single-club state" + "cross-context consumers
  don't all live inside Club's orbit" + ADR-0050 boundary already
  substantial as load-bearing arguments against.
- *Choose Option B (League Orchestration absorbs)*: edit ADR-0057;
  synthesis names ubiquitous-language conflict (orchestration vs
  scoring) + multi-input streams crossing context boundaries +
  "graph lives where its identity owner lives" Vernon anti-pattern
  as arguments against.
- *Defer*: leave ADR-0057 `proposed`; document deferral on FMX-34.
  Note: rivalry_score producer remains undefined; Fan Ecology +
  Matchday-Event-Engine consumers continue in design limbo.

The ten future-scope items in §Future-scope notes (Manager & Legacy
derby-specialist archetype signal, Tactics derby-specific opposition
awareness, People journalist derby framing, Narrative media derby
framing, Watch Party auto-propose, cross-country rivalries Phase 2,
rivalry-driven media event campaigns Phase 2, named ultras-group
rivalries, community-pack rivalry seed overrides, anti-fan-bias
safeguards) remain `future-scope` regardless of the ratification
call.

## Blockers

- No implementation authority for Rivalry System until ADR-0057 is
  `accepted` and `binding: true`.
- Fan Ecology atmosphere formula (`atmosphere = base + rivalry_score
  * 0.20 + ...`) and Matchday-Event-Engine Pyro-trigger formula both
  read `rivalry_score` from an undefined producer until ADR-0057
  accepted.
- Regulations & Compliance (ADR-0056 accepted) sanction-chain
  downstream of rivalry-driven Pyro events has a defined producer
  path via Matchday-Event-Engine (Club Management owns the event
  trigger); Rivalry would feed the trigger input.
- ADR-0052 (People) and ADR-0054 (Narrative) drafts are parallel;
  the §Map patch in ADR-0057 is order-tolerant.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-rivalry-system-2026-05-28.md` *(new)*
- `docs/60-Research/rivalry-system-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0057-rivalry-system-context.md` *(new)*
- `docs/00-Index/Decision-Log.md` *(ADR-0057 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-34 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-34-rivalry-system.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0057 can move to `accepted` / `binding: true` only after Nico
  accepts Option C (or chooses A / B).
- [[../../60-Research/rivalry-system-bounded-context-2026-05-28]]
  stays `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch applies only on ADR-0057
  acceptance.

## Ratify-ask

**Accept Option C (recommended), choose Option A / B, or Defer?**

§Recommendation in ADR-0057 names Option C (own bounded context) as
the call. Synthesis F4 + F5 are the load-bearing arguments: five-of-
six DDD split criteria fire affirmative; Vernon's canonical scoring-
context pattern (credit rating + customer affinity + recommendation +
supplier score) is the direct DDD analogue; real-world precedent
(UEFA risk-match classification + Premier League Category A/B/C +
Bundesliga Rotspiel) confirms rivalry is operationally distinct.

Caveat: scope is lighter than Tactics / Regulations - smallest carve
in the wave. Vernon literature supports smaller scoring contexts but
reasonable architects might prefer Option A or B. The cross-cutting
consumer count (10+ consumers across binding + draft + future-scope)
and the independent lifecycle tip it toward Option C.
