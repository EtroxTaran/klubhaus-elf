---
title: Tactics Persistence Bounded Context - Ownership Synthesis 2026-05-28
status: draft
tags: [research, tactics, set-pieces, bounded-context, fmx-28]
context: tactics
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-28
sourceType: external
related:
  - [[raw-perplexity/raw-tactics-persistence-2026-05-28]]
  - [[tactics-and-formations]]
  - [[../50-Game-Design/tactics-system]]
  - [[../50-Game-Design/set-pieces]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../20-Features/feature-tactics-progressive-disclosure]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/bounded-context-map]]
---

# Tactics Persistence Bounded Context - Ownership Synthesis 2026-05-28

## Question

Match owns the per-match `tactic lock` (snapshot at kickoff). Who owns
the **persistent tactics library**: tactic templates, saved presets,
set-piece routine variants, opposition templates, role/duty
configurations? And how does that owner relate to Manager & Legacy's
"Tactical identity" signal and Staff Operations' Set-Piece-Coach role?

## Status

This is a sourced ownership dossier for FMX-28. It does not change the
bounded-context map. The recommendation feeds a new draft ADR-0055
(`status: proposed`, `binding: false`) that Nico ratifies separately.

`raw research -> this synthesis -> ADR-0055 §Options + §Recommendation -> Nico decision`

> ADR-0054 was assigned to FMX-3 Narrative Context (PR #88) during this
> beat. This synthesis therefore targets ADR-0055 for Tactics.

## Summary

**Recommendation: Option C (Tactics as own bounded context).** Five of
six DDD split criteria fire (own ubiquitous language, own light FSM,
own storage boundary, multiple consumers, cross-cutting role). The
template-vs-instance / catalog-vs-snapshot pattern is canonical DDD
(Vernon's Product Catalog vs Ordering analogue). Genre precedent (FM
explicitly separates tactic catalog and set-piece library from the
match snapshot; OOTP separates strategy profiles from per-game state).
Real-world clubs (2023-2026) treat the playbook as club-owned,
data-platform-managed, analyst-curated - Brentford / Arsenal / Brighton
maintain seasonal set-piece libraries of 15-40 routines. The carve
also closes the Set-Piece-Coach effect-readiness pipeline from Staff
Operations cleanly. Adds a 14th-or-higher context candidate; map growth
acknowledged in §Why this is worth one more context.

## Findings

### Finding F1: Match owns the snapshot only, library is unassigned

- **Source:**
  [[../10-Architecture/bounded-context-map]] §1 Match row; `match.md`
  state machine; ADR-0049 §MatchInput contract.
- **Confidence:** High (direct quotation).
- **Finding:** `bounded-context-map.md §1`: Match owns "Line-up, **tactic
  lock**, simulation, results". `match.md` shows `lineup_locked` state
  freezes tactic for the match; `home_tactic` / `away_tactic` stored as
  `jsonb`. ADR-0049's MatchInput contract treats tactics as "frozen
  teams, roles, tactics, set pieces, rules, context, seed, quality
  profile, dataset/rules versions and intervention schedule" - the
  engine consumes the snapshot, does not load from a live library.
- **Impact on FMX-28:** Match is unambiguously the *instance* side. The
  question is who owns the *catalog* side. The synthesis must name that
  owner; ADR-0019 §Decision context-isolation rules require it.

### Finding F2: The library is real, sized and explicitly designed - just unattributed

- **Source:** [[../50-Game-Design/tactics-system]] §10, §11, §15;
  [[../20-Features/feature-tactics-progressive-disclosure]];
  [[../50-Game-Design/GD-0004-tactics]] §Open (Wave 2).
- **Confidence:** High.
- **Finding:** `tactics-system.md §10` explicitly designs tier-based
  slots: **2 / 3 / 3 active slots Quick / Standard / Expert plus saved
  presets 0 / 10 / 50**. §15 sets preset-sharing as Local-only at MVP
  (per ADR-0016). Progressive-disclosure feature design references the
  same library structure. GD-0004 §Open lists the underlying numerical
  contract feeding the match engine as a Wave-2 open item. The library
  is concrete; no context claims it.
- **Impact on FMX-28:** This is not a theoretical concern. The library
  has concrete sizing (up to 156 tactic objects per Expert save: 3
  active + 50 saved + 50 opposition + auxiliary) plus set-piece routine
  variants (per `set-pieces.md`: 5 modules × N variants per module).
  Naming the owner is necessary for MVP storage, schema, and contract
  design.

### Finding F3: Set-piece routines are embedded in tactic objects, library-like in practice

- **Source:** [[../50-Game-Design/set-pieces]] §1-2;
  [[raw-perplexity/raw-tactics-persistence-2026-05-28]] Query 1 (FM
  set-piece library pattern).
- **Confidence:** High.
- **Finding:** `set-pieces.md §1-2`: Five modules (offensive corners,
  defensive corners, direct/indirect free kicks, long throw-ins,
  penalties + second balls). Routines stored as
  `tactic.set_pieces[type].variants[]` with 3 defaults + N user-defined.
  Selection at match time: `variant = tactic.set_pieces[type].select(context)`.
  FM precedent in Query 1 shows set-piece routines as **separately
  saveable / shareable** independently of whole tactics - the routine
  library has its own addressability even when referenced from tactics.
- **Impact on FMX-28:** Set-piece routines are not separable into a
  distinct context, but they ARE a distinct sub-aggregate within Tactics
  with their own lifecycle (drafted → published → retired). Tactics
  context owns the routines as a sub-aggregate; Set-Piece-Coach
  effect-readiness from Staff Operations modifies routine variety /
  quality (signal channel, not state ownership).

### Finding F4: DDD canonical pattern strongly supports separate bounded context

- **Source:** [[raw-perplexity/raw-tactics-persistence-2026-05-28]]
  Query 2; Martin Fowler bounded-context page; Vaughn Vernon strategic
  design (Product Catalog vs Ordering example); Context Mapper.
- **Confidence:** High.
- **Finding:** Six canonical split criteria:
  1. **Own ubiquitous language** - formation, role, duty, instruction,
     preset, routine, opposition template, archetype, family. ✓
  2. **Own lifecycle / state machine** - preset (saved → active →
     archived); routine (drafted → published → retired); template
     versioning (FM `.ftc` precedent). ✓
  3. **Own storage boundary** - presets + routines in own schema; Match
     copies fields at tactic-lock-time (canonical
     reference-plus-snapshot pattern). ✓
  4. **Multiple consumers / cross-cutting role** - Match (instance
     side), Training (role profiles for training plans), Transfer
     (target-role profiles for scouting/recruitment),
     Manager & Legacy (tactical-identity signal aggregation),
     Staff Operations (Set-Piece-Coach effect-readiness consumer side).
     Watch Party (live tactical commentary in spectator stream).
     ✓
  5. **Distinct teams / cadence** - in larger orgs, tactical UI iterates
     on different cadence than match engine; architectural coupling
     argument applies. ✓
  6. **Co-change counterargument** - does tactic library always change
     with another aggregate's transaction? No. Editing a preset is
     independent of any match, transfer, training session or staff
     contract. ✗ (split is justified)
- **Impact on FMX-28:** Five of six criteria fire affirmative. Vernon's
  Product Catalog vs Ordering is the direct analogue: catalog is its
  own bounded context, instances copy descriptive information at
  creation time and are immutable thereafter.

### Finding F5: Genre precedent confirms catalog-as-separate (FM is the strongest)

- **Source:** [[raw-perplexity/raw-tactics-persistence-2026-05-28]]
  Query 1; FM `.ftc` file format; FMScout community.
- **Confidence:** Medium-high.
- **Finding:** Universal pattern across FM / EA FC / OOTP / FIFA Manager
  / Anstoss: persistent template catalog separate from per-match state.
  FM is the closest precedent for the FMX design: explicit catalog
  files (`.ftc`) plus in-save slots; separate set-piece library
  saveable independently. EA FC and Anstoss have lighter persistence
  (per-save only, no cross-save) but still separate the catalog from
  per-match state. UI tier complexity (FM beginner/intermediate/expert,
  EA FC Basic/Advanced) is universally a UI-layer concern, not a data
  schema concern. No surveyed game unlocks formations or roles
  progressively across saves - all systems available from start.
- **Impact on FMX-28:** Reinforces the carve. Confirms the
  UI-tier-as-UI-layer rule (Tactics context exposes one schema;
  progressive-disclosure tiers are user-preference filters in the
  presentation layer). Confirms that cross-save unlock mechanics for
  formations / roles are NOT genre-standard - aligning with GD-0019
  "MVP ships hooks, not full meta system" and ADR-0051 determinism rule.

### Finding F6: Real-world clubs treat the playbook as club-owned data-platform asset

- **Source:** [[raw-perplexity/raw-tactics-persistence-2026-05-28]]
  Query 3; FSI 2026 tactical analysis material; Premier League
  2025/26 data; totalfootballanalysis.com case studies.
- **Confidence:** High.
- **Finding:** Modern elite clubs (2023-2026) treat the tactical
  playbook as **club-owned** (not coach IP). Three-layer ownership:
  Sporting Director / Tech Director defines club game model; Head Coach
  brings his own game model that must fit; Performance Analysis
  Department maintains the digital archive (video tags, training data,
  set pieces, opposition reports). Coach IP is methodology / language;
  club IP is recorded material. Brentford / Arsenal / Brighton maintain
  seasonal set-piece libraries of 15-40 offensive routines + 10-20
  defensive structures, refined over seasons. Premier League 2025/26
  long-throw xG more than doubled vs prior seasons - reflects
  systematic set-piece-coach work on library iteration. Club-led
  governance models (Brentford, Brighton, Red Bull, City Group) carry
  the playbook across coach changes; coach-centric models reboot on
  identity but archives persist.
- **Impact on FMX-28:** Real-world mirrors Option C exactly. Tactics
  Operations as a distinct context that survives coach changes (i.e.,
  Manager & Legacy run resets) matches industry practice. The Tactics
  context owns the library; specific run-context filters / playstyle
  selections live in Manager & Legacy's run snapshot.

## Inputs For Decisions

If Option C is accepted, the following items encode in ADR-0055:

- **Context owner:** Tactics as the next bounded context (14th if
  accepted before ADR-0052 People and ADR-0054 Narrative; 15th / 16th
  depending on acceptance order of those parallel drafts).
- **Owned aggregates:**
  - `TacticPreset` (saved → active → archived FSM; per save).
  - `SetPieceRoutine` (drafted → published → retired FSM; per save,
    referenced by TacticPreset).
  - `RoleDutyTemplate` (5-layer model: position + role + duty + player
    instructions + traits).
  - `OppositionTemplate` (three-layer model: archetype + sub-archetype
    + manager-signature, sourced from research and AI-manager hints).
  - `TacticTier` configuration (Quick / Standard / Expert slot sizing,
    per ADR-0048 design-update policy).
- **Public contract direction:**
  - Commands: `SaveTacticPreset`, `ActivateTacticPreset`,
    `ArchiveTacticPreset`, `SaveSetPieceRoutine`,
    `PublishSetPieceRoutine`, `RetireSetPieceRoutine`,
    `AssignTacticToSlot`, `ImportSharedTactic` (deferred, per ADR-0016
    sharing surface).
  - Events: `TacticPresetSaved`, `TacticPresetActivated`,
    `TacticPresetArchived`, `SetPieceRoutinePublished`,
    `TacticLockSnapshotProduced`, `TacticalStyleSignalEmitted`.
  - Queries (read models): `TacticLibrarySnapshot`,
    `ActiveTacticForSlot`, `RoleProfileForPosition`,
    `OppositionTemplateForArchetype`, `SetPieceRoutineCatalog`,
    `TacticalIdentityFingerprint` (aggregation for Manager & Legacy).
- **Consumed facts:**
  - `MatchScheduled`, `MatchLineupOpening` from Match (signals to
    prepare tactic candidates for the upcoming match).
  - `RogueliteRunStarted`, `RogueliteRunEnded` from League Orchestration
    (run boundary triggers preset reset / archival per ADR-0051
    determinism rule).
  - `StaffRoleAssigned` where role = Set-Piece Coach, plus
    `StaffSpecialisationUpdated` from Staff Operations (set-piece
    effect-readiness signal feeding routine quality multiplier).
  - `PlayerSkillProfileUpdated` from People (ADR-0052 draft) when
    ratified - feeds role-fit projections; until then, Tactics sources
    role-fit from squad attributes directly.
- **Storage scope:** per-save schema (`save_<uuidv7hex>`) per ADR-0027.
  No platform-scope cross-save tactic store. (Cross-save sharing is
  ADR-0016's Community-Dataset-Overrides surface, owned by FMX-33's
  forthcoming Community Overlay Pipeline beat.)
- **Determinism:** Tactics state is per-save. Match `tactic_lock`
  produces an immutable `TacticSnapshot` value object copied into
  `home_tactic` / `away_tactic` jsonb columns at lock time. After lock,
  the live tactic preset may be edited freely without affecting the
  in-flight match - canonical Reference + Snapshot pattern (Vernon
  Product Catalog vs Ordering).
- **Map patch proposal:** insert "Tactics" as the next bounded context
  row in §1; add `Tactics` node + edges in §2 Mermaid; add `tactics/`
  folder in §4 source mapping. Insert position depends on acceptance
  order of parallel drafts (ADR-0052 People, ADR-0054 Narrative); the
  patch is order-tolerant.

## Future-scope notes (classified future-scope)

Not ratification blockers; resolve in follow-up GDDR / ADR work:

1. **Progressive-disclosure unlock mechanics for formations / roles /
   set-pieces.** Per GD-0019 §Decided, post-MVP. ADR-0051 determinism
   rule applies: cross-save unlocks injected only at save creation, not
   during a running save. No surveyed sim does this; FMX would lead the
   genre. Deferred.
2. **Set-Piece Coach effect-readiness curves.** Staff Operations role
   slot exists; specialisation metadata exists. Concrete gameplay
   effects on routine variety / quality (e.g., +N routine slots, +M
   routine quality) come from playtest GDDR. FMX-28 names the contract
   channel `SetPieceCoachReadinessUpdated`; curves are future-scope.
3. **Opposition-template AI consumption.** Three-layer model (8
   archetypes + 25-30 sub-archetypes + 10 manager-signature) is
   designed. FMX-28 owns the template catalog schema; how AI-manager
   logic (ADR-0019 §AI manager note) selects templates per opponent is
   a separate beat (AI behaviour research, post-MVP planning).
4. **Tactic-preset cross-save sharing (ADR-0016 community overlays).**
   FMX-33 Community Overlay Pipeline will define the sharing surface.
   FMX-28 explicitly excludes sharing from the Tactics context's MVP
   contract; an `ImportSharedTactic` command is listed as deferred.
5. **Tactic schema versioning + migration.** Saved presets must remain
   compatible with save format (ADR-0005). Versioning and migration is
   future-scope implementation detail.
6. **Numerical-depth validation.** `tactics-and-formations.md` contains
   numerical depth (mentality bands, pressing intensity, risk curves).
   FMX-28 references the document as input; numerical-validation comes
   from Match Engine playtests.

## Why not Option A (Match sub-aggregate)?

Match absorbs the library AND the snapshot.

- **Locality argument:** wage-posting analogue - everything tactic-
  related in one context.
- **Against:** Match's ubiquitous language is kickoff / simulation /
  results - run-time concerns. Library is editorial / curation - design-
  time concerns. Different language collapses meaning (Evans warning).
  Tactical-identity signal aggregation for Manager & Legacy would
  require Match to publish editorial events alongside match events -
  ubiquitous-language conflict. Set-Piece-Coach effect-readiness from
  Staff Operations would have no clean consumer (Match doesn't own
  preset-library quality; Match consumes a frozen snapshot).

## Why not Option B (Squad & Player sub-aggregate)?

Squad owns Tactics because formations need players.

- **Locality argument:** role assignments map to player slots.
- **Against:** Squad & Player's existing scope is player base data,
  fitness, morale, contracts, injuries. Adding tactic templates +
  set-piece routines + opposition templates would balloon Squad into a
  multi-domain context. The role-fit query is a real coupling but it's
  one query channel (Squad → Tactics for `PlayerSkillsForRole`), not a
  reason to merge. Set-piece routines have nothing to do with
  Squad-language. Opposition templates have nothing to do with Squad
  at all - they describe theoretical opponents.

## Why not Option D (Defer to post-MVP)?

Leave the library unattributed; decide later when implementation starts.

- **Argument for:** cheapest action now; less map growth.
- **Against:** FMX-29 (Youth Academy) ownership beat depends partly on
  role-profile queries (which roles produce which youth-academy outputs);
  FMX-31 (Media / Narrative) depends on tactical-identity-signal
  channel; Manager & Legacy already references "Tactical identity"
  signal without a defined source. Three open dependencies + the
  library is concrete in design (Finding F2). Deferring trades a small
  action now for a larger reconciliation cost later.

## What the ratification PR includes

Per the FMX-28 plan and
[[../30-Implementation/domain-research-workflow]] Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-tactics-persistence-2026-05-28]].
- A new draft ADR-0055 with four options, §Recommendation = Option C,
  Public-contract sketch, determinism + storage rules, §Map patch
  proposal as fenced diff.
- Decision-Log row for ADR-0055 (`proposed`).
- Current-State FMX-28 anchor block.
- Session handoff naming the ratify-ask:
  *"Accept Option C (recommended), choose A / B / D, or Defer?"*

The bounded-context map is **not** modified by this PR. The §Map patch
applies only on Nico's acceptance via a follow-up apply PR (analog
FMX-35 / FMX-36).

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular monolith ground rules.
- [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]] -
  match frame contract surface.
- [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - MatchInput contract (tactics consumed as frozen snapshot).
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - tactical-identity signal consumer + determinism rule.
- [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - Set-Piece Coach role slot; effect-readiness producer.
- [[../50-Game-Design/tactics-system]] - 5-layer model + tier-based
  slots + saved presets sizing.
- [[../50-Game-Design/set-pieces]] - 5 modules + routine variants.
- [[../50-Game-Design/GD-0004-tactics]] - binding GDDR; halftime
  controls; open Wave-2 items.
- [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - tactical-identity signal category; MVP hooks only.
- [[../20-Features/feature-tactics-progressive-disclosure]] - UI tier
  Foundation.
- [[../30-Implementation/domain-research-workflow]] - the workflow this
  dossier follows.
- [[tactics-and-formations]] - prior numerical-depth research.
