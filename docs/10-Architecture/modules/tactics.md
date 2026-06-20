---
title: Tactics module
status: draft
tags: [architecture, module, tactics, set-pieces]
context: tactics
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0055-tactics-context]], [[../09-Decisions/ADR-0067-set-piece-variant-selection-determinism]], [[../09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]], [[../09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Tactics Boundary

## Purpose

Owns the persistent tactics library — tactic presets, set-piece routine
variants, opposition templates and role/duty configurations — and aggregates
tactical-style signals. Match consumes a frozen `TacticSnapshot` at
`lineup_locked` via the canonical Reference + Snapshot pattern; the live
library may be edited freely afterwards without affecting an in-flight match.

## Owns

- `TacticPreset` aggregate with FSM (saved → active → archived); per save.
- `SetPieceRoutine` aggregate with FSM (drafted → published → retired); per
  save, referenced from `TacticPreset` slots.
- `RoleDutyTemplate` aggregate (5-layer tactical model: position + role + duty
  + player instructions + traits + tendencies); per save.
- `OppositionTemplate` aggregate (three-layer model: 8 archetypes +
  ~25-30 sub-archetypes + ~10 manager-signature templates); per save.
- `TacticTier` configuration (Quick / Standard / Expert slot sizing).
- `TacticalIdentityFingerprint` projection aggregating style signals
  (possession, pressing, risk, adaptation, set-piece use) for Manager & Legacy.

## Public contract

Commands (draft):

- `SaveTacticPreset`, `ActivateTacticPreset`, `ArchiveTacticPreset`,
  `RenameTacticPreset`
- `SaveSetPieceRoutine`, `PublishSetPieceRoutine`, `RetireSetPieceRoutine`
- `AssignTacticToSlot`
- `UpdateRoleDutyTemplate`
- `SaveOppositionTemplate`
- `ImportSharedTactic` (deferred — FMX-33 Community Overlay / ADR-0016 surface)

Domain events (draft):

- `TacticPresetSaved`, `TacticPresetActivated`, `TacticPresetArchived`
- `SetPieceRoutinePublished`, `SetPieceRoutineRetired`
- `RoleDutyTemplateUpdated`
- `OppositionTemplateSaved`
- `TacticLockSnapshotProduced` (carries the frozen `TacticSnapshot`, incl.
  per-module set-piece selection fields per ADR-0067 and the
  `oppositionTemplate` slice per ADR-0080; consumed by Match at `lineup_locked`)
- `OppositionTemplateSelectedForMatchV1` (deterministic selected-template
  event per ADR-0080; consumed by Match)
- `TacticalStyleSignalEmitted` (consumed by Manager & Legacy)

Queries / read models (draft):

- `TacticLibrarySnapshot` — all active + saved presets per save.
- `ActiveTacticForSlot` — currently-assigned preset per Quick / Standard /
  Expert slot.
- `RoleProfileForPosition` — role/duty configuration for a position (consumed
  by Training and Transfer).
- `OppositionTemplateForArchetype` — lookup by archetype / sub-archetype /
  manager-signature key.
- `SetPieceRoutineCatalog` — published routines per save, per module.
- `TacticalIdentityFingerprint` — aggregated style-signal projection for
  Manager & Legacy (aggregation algorithm per ADR-0074).

## Storage ownership

- Per-save tables only, under the `save_<uuidv7hex>` schema (ADR-0027). No
  platform-scope cross-save tactic store.
- Cross-context inputs arrive through public events / queries only; Tactics
  does not join across other contexts' tables (ADR-0121 no-shared-tables).
- Cross-save preset sharing is excluded from MVP (deferred to FMX-33 Community
  Overlay Pipeline per ADR-0016).

## Consumers / Producers

Consumers of Tactics outputs:

- **Match** — `TacticSnapshot` at lock-time (via `TacticLockSnapshotProduced`)
  and `OppositionTemplateSelectedForMatchV1`.
- **Manager & Legacy** — `TacticalIdentityFingerprint` /
  `TacticalStyleSignalEmitted` for archetype-style signal aggregation.
- **Training** — `RoleProfileForPosition` for drill scheduling.
- **Transfer** — `RoleProfileForPosition` for target shortlisting.
- **Watch Party** (post-MVP) — tactical-commentary projections.

Facts Tactics consumes (producers):

- **Match** — `MatchScheduled`, `MatchLineupOpening`, `MatchResolved`.
- **League Orchestration** — `RogueliteRunStarted`, `RogueliteRunEnded`.
- **Staff Operations** — `StaffRoleAssigned` (Set-Piece Coach),
  `StaffSpecialisationUpdated` (effect-readiness feeding routine-quality
  multipliers).
- **People** — `PlayerSkillProfileUpdated` (ADR-0052, when ratified); until
  then role-fit is read from Squad & Player attributes directly.
- **AI World Simulation** — supplies the opposition-template planning context
  (ADR-0080); Tactics runs the deterministic selector over its own catalog.

## Invariants

- Match owns the per-match snapshot; Tactics owns the library. After
  `lineup_locked`, editing the live preset does not affect the in-flight match
  (Reference + Snapshot).
- Tactics never joins another context's tables; cross-context data flows only
  through published events / queries (ADR-0121).
- Set-piece variant selection from the snapshot is the pure ordering
  `(priority DESC, variantId ASC)` under the module's `selectionMode`; fields
  are deeply readonly per ADR-0067 / ADR-0026.
- Opposition-template selection is immutable at `lineup_locked`; a missing
  valid selection fails fast (`opposition_template_selection_missing`) — no
  silent Match-side fallback (ADR-0080).
- Style-signal aggregation is a deterministic projection from published match
  events plus the locked `TacticSnapshot`; read-only to Manager & Legacy and
  never re-read after the next-save legacy configuration is generated
  (ADR-0051 determinism rule).
- Per-save storage only; new-save tactical-style seed (if supplied) is copied
  in at creation and never re-read during a running save.

## Open items

The source ADR lists the contract at **draft** precision; the following are
not yet pinned and are flagged here rather than invented:

- Concrete command / event / query payload schemas and field shapes (only the
  set-piece snapshot fields in ADR-0067 and the `OppositionTemplateSelectedForMatchV1`
  payload in ADR-0080 are pinned).
- Set-Piece-Coach effect-readiness curves (post-MVP; Staff Operations
  specialisation metadata + playtest GDDR).
- Progressive-disclosure unlock mechanics for formations / roles / set-pieces
  (post-MVP per GD-0019; ADR-0051 determinism constraint).
- `ImportSharedTactic` command / cross-save sharing surface (deferred to
  FMX-33 Community Overlay per ADR-0016).
