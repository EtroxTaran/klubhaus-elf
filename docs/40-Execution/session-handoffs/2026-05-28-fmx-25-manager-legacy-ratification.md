---
title: Handoff FMX-25 Manager & Legacy Ratification
status: wrapped
tags: [meta, execution, handoff, fmx-25]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/manager-legacy-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-25 Manager & Legacy Ratification (2026-05-28)

## Linear

- Issue: FMX-25
- Parent: FMX-24

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (now binding, merged
  via PR #83 / FMX-24).
- Ran three focused Perplexity queries covering:
  1. Roguelite cross-run meta architecture (Hades, Slay the Spire, Risk of
     Rain 2, Darkest Dungeon II, Against the Storm).
  2. DDD canonical pattern for cross-instance meta state.
  3. Football-management-sim manager identity precedent (FM, EA FC Career
     24/25/26, OOTP, FIFA Manager, Anstoss).
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-manager-legacy-ratification-2026-05-28]].
- Synthesised decision-ready brief at
  [[../../60-Research/manager-legacy-bounded-context-2026-05-28]] with 6
  numbered findings (F1-F6), each with source + confidence.
- Updated
  [[../../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  in place:
  - Frontmatter `updated:` 2026-05-28, new related entries.
  - Added §FMX-25 Ratification Pass header note.
  - Expanded §Options considered into three concrete options (A Accept / B
    Defer with scope adjustment / C Reject and fold).
  - Added §Recommendation: **Accept (Option A)** with three converging
    justifications.
  - Added §Map patch proposal as fenced ```diff``` blocks covering §1 table
    row, §2 Mermaid edges, §4 source mapping. Map itself is not modified.
- Updated [[../../00-Index/Decision-Log]] ADR-0051 row Lineage column to
  reflect the FMX-25 ratification pass; added the synthesis under "Current
  Binding Non-ADR Inputs".
- Added FMX-25 anchor block to
  [[../../00-Index/Current-State]] before the FMX-23 block.

## Open / next step

**Nico Accept / Reject / Defer call on ADR-0051 is the next gate.**

Specifically:

- *Accept (Option A, recommended)*: change ADR-0051 `status: draft` →
  `accepted` and `binding: false` → `true` in a follow-up PR. Apply the §Map
  patch proposal to `bounded-context-map.md` in the same PR. Update
  [[../../00-Index/Decision-Log]] status column.
- *Defer (Option B)*: leave ADR-0051 `draft`; document the deferral reason
  in a comment on FMX-25; open a follow-up ticket to revisit after the first
  playable.
- *Reject (Option C)*: change ADR-0051 `status: rejected`, add
  `superseded_by:` or a rationale paragraph, and open a same-beat ticket to
  patch
  [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  removing the three "if ADR-0051 is ratified" references.

The five open questions in
[[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
§Open (taxonomy, signal schema, post-run UI depth, prestige ladder shape,
snapshot timing) remain `future-scope` regardless of the ratification call
and are addressed by playtest-driven GDDR amendments, not by this beat.

## Blockers

- No implementation authority for Manager & Legacy until ADR-0051 is
  `accepted` and `binding: true` (per
  [[../../30-Implementation/domain-research-workflow]] ratification rules).
- ADR-0052's three conditional references stay pending until ADR-0051 is
  ratified; a Reject outcome requires a same-beat ADR-0052 patch.
- FMX-26 (Staff & Backroom narrowed scope), FMX-28 (Tactics persistence)
  and FMX-31 (Media/Narrative content) remain `Backlog` per the FMX-24
  prioritisation comment; FMX-28 and FMX-31 explicitly depend on the
  ADR-0051 outcome.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-manager-legacy-ratification-2026-05-28.md` *(new)*
- `docs/60-Research/manager-legacy-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md` *(in-place update)*
- `docs/00-Index/Decision-Log.md` *(ADR-0051 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-25 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-25-manager-legacy-ratification.md` *(this file, new)*

## Needs promotion

- ADR-0051 can move to `accepted` and `binding: true` only after Nico
  accepts the §Recommendation (Option A) or chooses Option B / C.
- [[../../60-Research/manager-legacy-bounded-context-2026-05-28]] can stay
  `draft` as a synthesis; promotion is not required for the ratification
  decision.
- `bounded-context-map.md` updates apply only when ADR-0051 is accepted
  (same-PR §Map patch).

## Ratify-ask

**Accept Option A (recommended), Defer (Option B) or Reject (Option C)?**

The §Recommendation section in ADR-0051 names Accept as the call. The
synthesis at
[[../../60-Research/manager-legacy-bounded-context-2026-05-28]] §Why not
Defer / §Why not Reject explains why the alternatives carry higher cost.
The risk of acceptance is bounded (hooks-only MVP scope already locked by
GD-0019).
