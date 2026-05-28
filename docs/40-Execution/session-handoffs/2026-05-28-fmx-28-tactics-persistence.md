---
title: Handoff FMX-28 Tactics Persistence Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-28]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-tactics-persistence-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../../50-Game-Design/tactics-system]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-28 Tactics Persistence Ownership (2026-05-28)

## Linear

- Issue: FMX-28
- Parent: FMX-24
- Unblocks: FMX-29 (Youth Academy role profiles), FMX-31
  (Media/Narrative tactical commentary)

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via
  PR #83).
- Identified the residual question: Match owns per-match `tactic lock`
  snapshot per `bounded-context-map.md §1`; persistent tactics library
  (presets, set-piece routines, opposition templates, role/duty
  configurations) explicitly unattributed despite concrete sizing in
  `tactics-system.md §10` (2/3/3 active slots + 0/10/50 saved presets).
- Ran three focused Perplexity queries:
  1. Genre - football management sim tactic library vs match snapshot
     (FM, EA FC, OOTP, FIFA Manager, Anstoss). Medium-high confidence;
     universal pattern of catalog separated from per-match state; FM is
     the strongest direct precedent.
  2. DDD - canonical pattern for template/library vs instance/snapshot
     (Fowler/Evans canonical, Vaughn Vernon, Context Mapper). High
     confidence; Vernon's Product Catalog vs Ordering is the direct
     analogue.
  3. Real-world - 2023-2026 club tactical playbook ownership (FSI 2026
     analysis material, Premier League 2025/26 long-throw data, Brighton
     / Brentford / Arsenal case studies). High confidence; clubs treat
     playbook as club-owned, data-platform-managed, analyst-curated.
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-tactics-persistence-2026-05-28]].
- Synthesised
  [[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
  with six numbered findings F1-F6 (each with source + confidence).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]]:
  `status: proposed`, `binding: false`. Four options (A Match
  sub-aggregate / B Squad sub-aggregate / C own context / D Defer),
  §Recommendation = Option C with three converging justifications,
  §Public contract direction (commands / events / read models /
  consumed facts), §Determinism and storage rules, §Map patch proposal
  as four fenced ```diff``` blocks.
- ADR number is **ADR-0055** because ADR-0054 was assigned to FMX-3
  Narrative Context (PR #88 landed during this beat).
- Updated [[../../00-Index/Decision-Log]] with new ADR-0055 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-28 anchor block to
  [[../../00-Index/Current-State]] before the FMX-26 / FMX-36 block.

## Open / next step

**Nico Accept Option C (recommended), choose A / B / D, or Defer call
on ADR-0055 is the next gate.**

- *Accept Option C (recommended)*: open a follow-up apply PR analogous
  to FMX-35 / FMX-36. Flip ADR-0055 `status: proposed` → `accepted`
  and `binding: false` → `true`. Apply the §Map patch (four parts) to
  `bounded-context-map.md` in the same PR. Update Decision-Log status
  column. Update Architecture-Map / 05-Building-Blocks / Current-State
  "13 → 14 bounded contexts" prose. (Or higher count if ADR-0052
  People / ADR-0054 Narrative also accepted in between - patch is
  order-tolerant.)
- *Choose Option A (Match absorbs)*: edit ADR-0055 to record the
  choice; the synthesis explicitly lists arguments against (ubiquitous-
  language conflict + tactical-identity-signal routing through
  match-day runtime).
- *Choose Option B (Squad absorbs)*: edit ADR-0055; synthesis names
  the set-piece-routine / opposition-template language conflict and
  the multi-domain-context balloon argument.
- *Choose Option D (Defer)*: leave ADR-0055 `proposed`; document the
  deferral reason on FMX-28. Note: FMX-29 (Youth Academy) and FMX-31
  (Media / Narrative) pending dependencies on role-profile queries and
  tactical-identity signal channel remain unresolved.

The six future-scope items in §Future-scope notes
(progressive-disclosure unlock mechanics, set-piece-coach
effect-readiness curves, opposition-template AI consumption, tactic
preset cross-save sharing via ADR-0016, tactic schema versioning,
numerical-depth validation) remain `future-scope` regardless of the
ratification call.

## Blockers

- No implementation authority for Tactics until ADR-0055 is `accepted`
  and `binding: true`.
- FMX-29 (Youth Academy) and FMX-31 (Media / Narrative) downstream
  Welle-2 beats reference the Tactics context for role-profile queries
  and tactical-identity signal channel; FMX-28 acceptance unblocks
  both.
- ADR-0052 (People) and ADR-0054 (Narrative) drafts are parallel; the
  §Map patch in ADR-0055 is order-tolerant - apply regardless of how
  many parallel drafts have landed at apply-time.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-tactics-persistence-2026-05-28.md` *(new)*
- `docs/60-Research/tactics-persistence-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0055-tactics-context.md` *(new)*
- `docs/00-Index/Decision-Log.md` *(ADR-0055 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-28 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-28-tactics-persistence.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0055 can move to `accepted` / `binding: true` only after Nico
  accepts Option C (or chooses A / B / D).
- [[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
  stays `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch applies only on ADR-0055 acceptance.

## Ratify-ask

**Accept Option C (recommended), choose Option A / B / D, or Defer?**

§Recommendation in ADR-0055 names Option C (own bounded context) as
the call. Synthesis F4 + F5 + F6 are the load-bearing arguments:
five-of-six DDD split criteria fire affirmative; FM `.ftc` library +
separately-saveable set-piece library is the closest genre precedent;
real-world clubs 2023-2026 treat the playbook as club-owned
data-platform asset with seasonal set-piece libraries (Brentford /
Arsenal / Brighton). Vernon's Product Catalog vs Ordering is the
canonical DDD analogue.
