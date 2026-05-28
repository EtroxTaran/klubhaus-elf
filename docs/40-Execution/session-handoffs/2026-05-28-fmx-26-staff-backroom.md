---
title: Handoff FMX-26 Staff & Backroom Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-26]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/staff-backroom-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-staff-backroom-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../50-Game-Design/squad-and-club-structure]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-26 Staff & Backroom Ownership (2026-05-28)

## Linear

- Issue: FMX-26
- Parent: FMX-24
- Related: FMX-23 / ADR-0052 (upstream identity owner)

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via PR
  #83).
- Re-confirmed boundary lines for the residual scope after ADR-0052
  (FMX-23, draft): identity + persona + skill profile owned upstream;
  hire/fire/contract/wage/role/pipeline-coverage explicitly excluded.
- Ran three focused Perplexity queries:
  1. Football-management-sim staff lifecycle (FM, EA FC, OOTP, FIFA
     Manager, Anstoss) - medium-low confidence, source-thin.
  2. DDD authority for operational sub-aggregate vs own context, and
     ops → finance integration pattern - high confidence, multiple
     authorities (Fowler/Evans canonical, Vaughn Vernon, MS Learn,
     Context Mapper SummerSoC paper).
  3. Real-world 2024-2026 club structure: Sporting Director model,
     dual-key approvals, salary-cap allocation, modern backroom
     composition, contract patterns - high confidence (FIFA Diploma,
     UEFA Club Licensing, Sage academic).
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-staff-backroom-2026-05-28]].
- Synthesised
  [[../../60-Research/staff-backroom-bounded-context-2026-05-28]] with
  six numbered findings F1-F6 (each with source + confidence).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]:
  `status: proposed`, `binding: false`. Three options (A Club sub-
  aggregate / B own context / C distributed), §Recommendation = Option
  B with three justifications, §Public contract direction, §Determinism
  and storage rules, §Map patch proposal as four fenced ```diff```
  blocks.
- Updated [[../../00-Index/Decision-Log]] with new ADR-0053 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-26 anchor block to
  [[../../00-Index/Current-State]] before the FMX-25 + FMX-35 block.

## Open / next step

**Nico Accept Option B (recommended), choose A / C, or Defer call on
ADR-0053 is the next gate.**

- *Accept Option B (recommended)*: open a follow-up apply PR analogous
  to FMX-35. Flip ADR-0053 `status: proposed` → `accepted` and
  `binding: false` → `true`. Apply the §Map patch (four parts) to
  `bounded-context-map.md` in the same PR. Update Decision-Log status
  column. Update Architecture-Map / 05-Building-Blocks / Current-State
  "12 → 13 bounded contexts" prose.
- *Choose Option A (Club Management absorbs)*: edit ADR-0053 to record
  the choice; the synthesis explicitly lists arguments against; reject
  the §Map patch.
- *Choose Option C (distributed)*: edit ADR-0053; synthesis names the
  cross-cutting-role + pipeline-coverage gaps Option C leaves open.
- *Defer*: leave ADR-0053 `proposed`; document the deferral reason on
  FMX-26.

The five future-scope items in the synthesis §Future-scope notes (staff-
skill effect activation, salary-cap mathematics, sport-director-approval
workflow, contract-renewal negotiation, pipeline-coverage read-model
schema, coach-turnover staff cascade) remain `future-scope` regardless
of the ratification call and are addressed by follow-up GDDR/ADR work.

## Blockers

- No implementation authority for Staff Operations until ADR-0053 is
  `accepted` and `binding: true`.
- FMX-27 (Scouting & Recruitment activity, residual scope after
  ADR-0052) and FMX-29 (Youth Academy lifecycle) explicitly depend on
  the FMX-26 outcome for the Staff-as-People-Identity boundary - they
  consume Chief Scout / Head of Youth as persons (ADR-0052) and now
  consume Staff Operations role-assignment events (ADR-0053 if
  ratified).
- FMX-28 (Tactics persistence) and FMX-31 (Media/Narrative) are
  already unblocked by FMX-25 + FMX-35 acceptance of ADR-0051; no FMX-26
  dependency.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-staff-backroom-2026-05-28.md` *(new)*
- `docs/60-Research/staff-backroom-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0053-staff-operations-context.md` *(new)*
- `docs/00-Index/Decision-Log.md` *(ADR-0053 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-26 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-26-staff-backroom.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0053 can move to `accepted` / `binding: true` only after Nico
  accepts Option B (or chooses A / C).
- [[../../60-Research/staff-backroom-bounded-context-2026-05-28]] can
  stay `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch (12 → 13 contexts) applies only on
  ADR-0053 acceptance, in a same-PR FMX-XX apply commit analogous to
  FMX-35.

## Ratify-ask

**Accept Option B (recommended), choose Option A / C, or Defer?**

§Recommendation in ADR-0053 names Option B (own context) as the call.
Synthesis F4 + F5 are the load-bearing arguments: five-of-six DDD split
criteria fire affirmative; real-world Sporting Director precedent
mirrors the same carve. The wage-event boundary follows the canonical
ops → finance pattern (Customer-Supplier + ACL + eventually
consistent), so no ADR-0050 amendment is needed.
