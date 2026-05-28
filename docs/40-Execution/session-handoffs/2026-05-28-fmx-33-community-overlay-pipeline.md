---
title: Handoff FMX-33 Community Overlay Pipeline Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-33]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-community-overlay-pipeline-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - [[../../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../../50-Game-Design/community-editor-and-datasets]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-33 Community Overlay Pipeline Ownership (2026-05-28)

## Linear

- Issue: FMX-33
- Parent: FMX-24
- Unblocks: ADR-0056 + ADR-0057 dangling "FMX-33 Community Overlay
  Pipeline" references resolve cleanly; ADR-0016 (proposed) gets a
  concrete implementer; clears path for community-content MVP.

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via
  PR #83).
- Identified the residual question: ADR-0056 (Regulations, accepted)
  and ADR-0057 (Rivalry, accepted) already explicitly delegated
  semantic validation to themselves per Vernon canonical pattern,
  and the bounded-context-map explanatory paragraphs (lines 106 +
  129) explicitly reference "FMX-33 Community Overlay Pipeline" as
  the upstream orchestrator. Two ratified binding ADRs name a
  missing context - this beat must define it.
- Ran three focused Perplexity queries:
  1. Genre - football management sim community pack import (FM
     `.fmf`, EA FC squad files, OOTP, FIFA Manager, Anstoss).
     **Medium-high confidence**. FM is the closest direct precedent
     (save-creation-only + multiple-pack selection + version-strict
     + internal merge). Universal pattern: save-creation activation +
     no in-game IP gates anywhere.
  2. DDD - import / ingestion / ETL as own bounded context vs
     platform service (Vaughn Vernon strategic design, MS Learn DDD
     guidance, Vaadin DDD primer, Fowler canonical). **High
     confidence**. Six canonical criteria for import-as-own-bounded-
     context. Real-world DDD analogues: Stripe Connect onboarding +
     Avalara data sync + Salesforce Data Import Wizard + GitHub
     Actions workflow ingestion + OpenStreetMap changeset workflow.
     Pattern: Process Manager / Saga in application layer of Import
     BC. Save-creation-only activation = versioned aggregates +
     Published Language.
  3. Real-world - IP-safe community modding precedents (Bethesda
     Creation Kit + Bethesda.net Mods, Steam Workshop, CurseForge /
     Modrinth, FM Editor + community DBs, football-data licensing,
     EU DSA 2023-2026). **Medium confidence**. Bethesda CK = upload +
     technical validation + creator IP disclaimer + post-publication
     takedowns. Steam Workshop = notice-and-takedown. CurseForge =
     manifest-driven compliance + dependency resolution. Pattern:
     upload gate + provenance metadata + complaint-driven enforcement
     + audit trail.
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28]].
- Synthesised
  [[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
  with six numbered findings F1-F6 (each with source + confidence).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0058-community-overlay-pipeline-context]]:
  `status: proposed`, `binding: false`. Four options (A platform
  service / B Identity sub-aggregate / C Offline Sync sub-aggregate
  / D own context) + Option E (cross-cutting policy service)
  explicitly listed as Vernon anti-pattern and rejected.
  §Recommendation = Option D with three converging justifications
  (DDD canonical + existing FMX delegation pattern + real-world
  platform precedent). §Public contract direction (commands /
  events / read models / consumed facts including
  `RuleOverrideValidated` from Regulations + `RivalryOverrideValidated`
  from Rivalry). §Determinism and storage rules (mixed platform +
  per-save schema per ADR-0027 + save-creation-only activation per
  ADR-0051 + immutable per-save snapshot). §Map patch proposal as
  four fenced ```diff``` blocks (order-tolerant with parallel
  ADR-0052 / ADR-0054 drafts).
- ADR number is **ADR-0058** (Narrative took ADR-0054, Tactics took
  ADR-0055, Regulations took ADR-0056, Rivalry took ADR-0057; this
  is next available).
- **`risk:legal` label set** — IP-clean rule terminology + denylist +
  living-person filter + manifest IP disclaimer + audit trail all
  live inside Community Overlay BC.
- Updated [[../../00-Index/Decision-Log]] with new ADR-0058 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-33 anchor block to
  [[../../00-Index/Current-State]] before the FMX-34 / FMX-40 block.

## Open / next step

**Nico Accept Option D (recommended), choose A / B / C, or Defer
call on ADR-0058 is the next gate.**

- *Accept Option D (recommended)*: open a follow-up apply PR
  analogous to FMX-35 / FMX-36 / FMX-37 / FMX-39 / FMX-40. Flip
  ADR-0058 `status: proposed` → `accepted` and `binding: false` →
  `true`. Apply the §Map patch (four parts) to
  `bounded-context-map.md` in the same PR. Update Decision-Log status
  column. Update Architecture-Map / 05-Building-Blocks / Current-
  State "16 → 17 bounded contexts" prose. Optional editorial update
  to ADR-0016 cross-reference (mark "implemented by ADR-0058").
- *Choose Option A (platform service outside the map)*: edit
  ADR-0058 to record the choice; synthesis names "substantial domain
  logic + own ubiquitous language + lifecycle + IP-safety governance
  + ADR-0056/0057 dangling references" as load-bearing arguments
  against.
- *Choose Option B (Identity sub-aggregate)*: edit ADR-0058;
  synthesis names "Identity's existing scope is account + auth, not
  content policy + multi-BC orchestration".
- *Choose Option C (Offline Sync sub-aggregate)*: edit ADR-0058;
  synthesis names "Offline Sync owns storage hygiene + sync state,
  not orchestration of game-state BCs".
- *Defer*: leave ADR-0058 `proposed`; document deferral on FMX-33.
  Note: ADR-0056 + ADR-0057 dangling "FMX-33 Community Overlay
  Pipeline" references remain unresolved.

The ten future-scope items in §Future-scope notes (community editor
UI, Tactics preset sharing, economy profile overrides, name corpus
overrides, hosting / marketplace, pack migration logic, repeat-
infringer governance, compliance reporting + audit trail
externalisation, dependency resolution algorithm tuning, in-game
pack discovery UI) remain `future-scope` regardless of the
ratification call.

## Blockers

- No implementation authority for Community Overlay Pipeline until
  ADR-0058 is `accepted` and `binding: true`.
- ADR-0056 + ADR-0057 dangling "FMX-33 Community Overlay Pipeline"
  references stay unresolved until decision lands.
- ADR-0016 (proposed) stays in proposed-but-not-implemented limbo
  until ADR-0058 lands.
- Community editor UI work (post-MVP per
  community-editor-and-datasets.md) gated on Community Overlay BC
  contract surface.
- FMX-27 / FMX-29 / FMX-31 do not have direct dependencies on
  FMX-33 / ADR-0058.
- ADR-0052 (People) and ADR-0054 (Narrative) drafts are parallel;
  the §Map patch in ADR-0058 is order-tolerant.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28.md` *(new)*
- `docs/60-Research/community-overlay-pipeline-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0058-community-overlay-pipeline-context.md` *(new)*
- `docs/00-Index/Decision-Log.md` *(ADR-0058 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-33 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-33-community-overlay-pipeline.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0058 can move to `accepted` / `binding: true` only after Nico
  accepts Option D (or chooses A / B / C).
- [[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
  stays `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch applies only on ADR-0058 acceptance.
- ADR-0016 may optionally be marked "implemented by ADR-0058" in
  the apply-PR; not status-changing.

## Ratify-ask

**Accept Option D (recommended), choose Option A / B / C, or Defer?**

§Recommendation in ADR-0058 names Option D (own bounded context) as
the call. Synthesis F2 + F4 + F5 are the load-bearing arguments:

- **F2 (strongest)**: ADR-0056 + ADR-0057 (both accepted, binding)
  explicitly reference "FMX-33 Community Overlay Pipeline" as the
  upstream orchestrator they delegate semantic validation to. Two
  ratified ADRs name a missing context.
- **F4**: six-of-six DDD split criteria fire (stronger than
  FMX-26/28/30/34 where five-of-six fired). Vernon's canonical
  ingestion-as-bounded-context pattern (Stripe Connect + Avalara +
  Salesforce + GitHub Actions + OpenStreetMap) is the direct
  analogue.
- **F5**: real-world platform precedent (Bethesda Creation Kit +
  Bethesda.net + Steam Workshop + CurseForge / Modrinth + EU DSA
  2023-2026 governance trends) confirms ingestion as distinct
  subsystem with upload gate + provenance + audit trail + complaint-
  driven enforcement.

IP-safety surface contained in one bounded context per GD-0015 +
ADR-0007. `risk:legal` label set.
