---
title: ADR-0055 Tactics Context
status: accepted
tags: [adr, architecture, ddd, tactics, set-pieces, fmx-28, fmx-37, accepted]
created: 2026-05-28
updated: 2026-05-28
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0016-community-dataset-overrides]]
  - [[../../50-Game-Design/tactics-system]]
  - [[../../50-Game-Design/set-pieces]]
  - [[../../50-Game-Design/GD-0004-tactics]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../20-Features/feature-tactics-progressive-disclosure]]
  - [[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-tactics-persistence-2026-05-28]]
  - [[../../60-Research/tactics-and-formations]]
---

# ADR-0055: Tactics Context

## Status

accepted

## Date

2026-05-28 (proposed) · 2026-05-28 (FMX-37 accepted by Nico, Option C)

## Ratification

Nico accepted Option C on 2026-05-28 after reviewing the FMX-28 dossier
(PR [#90](https://github.com/EtroxTaran/football-manager-x/pull/90)).
The §Recommendation below names Option C; the synthesis at
[[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
documents the three converging arguments (DDD canonical split criteria,
real-world Sporting-Director-controlled-playbook precedent, FM `.ftc` +
separately-saveable set-piece library genre precedent).

Application:

- Status flipped `proposed` → `accepted`; `binding: false` → `true`.
- The §Map patch proposal that lived in this ADR was applied to
  [[../bounded-context-map]] in the same PR (FMX-37). Tactics is now
  the **fourteenth bounded context** in the live map.
- The §Map patch proposal section is removed from this ADR as a result -
  its content lives in the map. Future amendments to the map go through
  normal ADR supersession ([[../../90-Meta/vault-governance]]).

## Context

After ADR-0051 ratification (Manager & Legacy = 12th, 2026-05-28) and
ADR-0053 ratification (Staff Operations = 13th, 2026-05-28), the
bounded-context map has thirteen ratified contexts plus drafts
ADR-0052 (People) and ADR-0054 (Narrative). FMX-28 closes the
**tactics-persistence gap** that none of those addresses.

Match owns the per-match tactic *snapshot* per `bounded-context-map.md`
§1: "Line-up, **tactic lock**, simulation, results". The `match.md`
state machine freezes the tactic at `lineup_locked`; `home_tactic` /
`away_tactic` are stored as `jsonb` in the match table. ADR-0049's
`MatchInput` contract consumes the snapshot.

The **persistent tactics library** is unattributed:

- Tactic-tier sizing per `tactics-system.md` §10: **2 / 3 / 3 active
  slots Quick / Standard / Expert plus saved presets 0 / 10 / 50**.
- Set-piece routine variants per `set-pieces.md` §1-2: five modules
  (offensive / defensive corners, free kicks, long throw-ins, penalties)
  with 3 defaults + N user-defined variants stored inside the tactic
  object.
- Opposition templates per `tactics-system.md` Layer 1-3: 8 archetypes
  + 25-30 sub-archetypes + 10 manager-signature opposition templates.
- Role / duty configurations per the 5-layer tactical model (position +
  role + duty + player instructions + traits).

Cross-cutting consumers exist:

- **Match** locks a snapshot at kickoff.
- **Manager & Legacy** ratified its "Tactical identity" signal category
  (GD-0019 §MVP hook model) but has no defined source channel.
- **Staff Operations** owns Set-Piece Coach as a role slot (ADR-0053)
  with specialisation metadata but no effect-readiness consumer.
- **Training** needs role / duty profiles to schedule appropriate
  drills.
- **Transfer** needs target-role profiles to scout / shortlist
  candidates.
- **Watch Party** (post-MVP) consumes tactical commentary for spectator
  stream.

The
[[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
synthesis evaluates four options against DDD criteria, genre precedent
(FM `.ftc` library + separately-saveable set-piece library; OOTP
manager strategy profiles; EA FC Custom Tactics; FIFA Manager tactic
files; Anstoss team defaults) and real-world precedent (modern clubs
2023-2026 treat playbooks as club-owned data-platform assets
maintained by analysts; set-piece coaches at Brentford / Arsenal /
Brighton maintain seasonal libraries of 15-40 offensive routines).

## Options considered

### Option A - Sub-aggregate inside Match

Match owns the persistent library AND the per-match snapshot.

- **Coupling:** wage-posting analogue: everything tactic-related local
  to Match.
- **Test isolation:** weak - Match's match-day FSM and the library's
  editorial FSM share one context.
- **Service extractability:** weak - extraction would require carving
  the sub-aggregate later (Option C done after the fact).
- **Data sovereignty:** weak - Match's ubiquitous language is
  kickoff / simulation / results / replay-stream; library language is
  editorial / curation / preset-lifecycle / opposition-archetype.
  Meaning drift inside one context.
- **Trade-off:** tactical-identity-signal for Manager & Legacy and
  Set-Piece-Coach-effect for Staff Operations would have to route
  through Match - putting an editorial-curation concern inside a
  match-day-runtime concern.

### Option B - Sub-aggregate inside Squad & Player

Squad & Player owns Tactics because formations need players.

- **Coupling:** locality for role-fit queries (player attributes ↔
  role profile).
- **Test isolation:** medium - Squad's player-state FSM and tactical
  library FSM coexist.
- **Service extractability:** weak - same as Option A but for Squad.
- **Data sovereignty:** weak - Squad's existing scope is player base
  data, fitness, morale, contracts, injuries. Adding tactical
  templates + set-piece routines + opposition templates balloons Squad
  into a multi-domain context.
- **Trade-off:** role-fit query is real and one-directional; that's
  one consumer relationship, not a reason to merge. Set-piece routines
  and opposition templates do not belong to Squad's language at all.

### Option C - New "Tactics" bounded context

Carve a dedicated context owning the tactic library (presets,
templates, role / duty configurations), set-piece routine variants,
opposition templates and tactical-style signal aggregation. Match
consumes via `TacticSnapshot` query at lock-time (canonical
Reference + Snapshot pattern from Vernon's Product Catalog vs Ordering
analogue). Manager & Legacy consumes
`TacticalIdentityFingerprint` events for archetype-style signal
aggregation. Staff Operations publishes `SetPieceCoachReadinessUpdated`
that Tactics consumes for routine-quality multipliers. Training reads
`RoleProfileForPosition`; Transfer reads `RoleProfileForPosition` for
target shortlisting; Watch Party (post-MVP) reads tactical commentary
projections.

- **Coupling:** clean. Each consumer has its own published-language
  channel; no shared tables.
- **Test isolation:** strong. Tactics owns its own storage (per-save
  schema per ADR-0027); deterministic event fixtures drive tests.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. `save_<uuidv7hex>` schema for
  presets + routines + opposition templates. No platform-scope
  cross-save tactic store; cross-save sharing goes through ADR-0016
  Community Overlay (FMX-33's surface).
- **Trade-off:** adds another bounded context to the map. The map is
  already at 13 ratified + 2 drafts; adding Tactics is a fourth draft
  candidate. Marginal cost is small because the modular monolith stays
  one process and contracts are already JSON-serialisable.

### Option D - Defer to post-MVP

Leave the library unattributed; revisit when implementation starts.

- **Coupling:** none defined yet.
- **Test isolation:** N/A.
- **Service extractability:** N/A.
- **Data sovereignty:** unowned facts will end up in whichever context
  starts implementing first - reactive carve rather than proactive
  design.
- **Trade-off:** cheapest now. FMX-29 (Youth Academy) and FMX-31
  (Media / Narrative) have pending dependencies on tactical-identity
  signal channel and role-profile queries respectively. Deferral
  leaves these unresolved.

## Recommendation

**Option C (Tactics as own bounded context).** Three converging
arguments:

1. **DDD canonical criteria fire (synthesis F4).** Five of six split
   criteria fire affirmative (own ubiquitous language: formation /
   role / duty / preset / routine / opposition template; own light
   FSM: preset saved → active → archived, routine drafted → published
   → retired; own storage boundary; multiple consumers; cross-cutting
   role). The co-change counterargument criterion does not apply -
   editing a preset is independent of any match / transfer / training /
   staff transaction. Multiple authorities (Fowler canonical
   bounded-context page, Vaughn Vernon strategic design, Context Mapper
   service-design paper) converge on the pattern when this many
   criteria align. Direct analogue: Vernon's Product Catalog vs
   Ordering.

2. **Real-world structural precedent (synthesis F6).** Modern elite
   clubs (2023-2026) treat the tactical playbook as **club-owned,
   data-platform-managed, analyst-curated**, not coach IP. The
   tactical archive carries across head-coach changes specifically
   because the club, not the coach, owns it. Brentford / Arsenal /
   Brighton set-piece coaches maintain seasonal libraries of 15-40
   offensive routines + 10-20 defensive structures tagged by patterns.
   Premier League 2025/26 long-throw xG more than doubled - reflects
   systematic set-piece-coach work on library iteration. Option C
   mirrors this; Options A and B fight it.

3. **Genre precedent (synthesis F5).** Football management sims
   universally separate persistent template catalog from per-match
   state. FM `.ftc` files + separately-saveable set-piece library are
   the closest precedent for the FMX design. OOTP, EA FC, FIFA
   Manager, Anstoss all confirm the catalog-vs-instance carve. No
   surveyed sim conflates the two. No surveyed sim unlocks
   formations / roles progressively across saves - reinforcing
   GD-0019 "MVP ships hooks, not full meta system" and ADR-0051
   determinism rule.

### Named risks

- **Map growth.** The map was 11 contexts on 2026-05-16; with FMX-25 +
  FMX-26 ratified it is 13; with this ADR plus ADR-0052 (People draft)
  and ADR-0054 (Narrative draft) it could grow to 16 if all four
  drafts are accepted. Modular-monolith stays one process per
  ADR-0019; service extraction is a deployment change per ADR-0019
  §5. Mitigation: `domain-research-workflow.md` Phase 6 enforces
  docs:check + map-patch-applied-in-same-PR discipline.
- **Set-Piece-Coach effect-readiness curves are post-MVP.** ADR-0053
  owns the role; FMX-28 names the contract channel
  (`SetPieceCoachReadinessUpdated`); concrete gameplay-effect curves
  come from playtest GDDR. Not blocking ratification.
- **Progressive-disclosure-unlock mechanics for formations / roles /
  set-pieces are post-MVP** (GD-0019 §Decided). FMX-28 plans the
  library structure; cross-save unlock activation comes later under
  ADR-0051 determinism constraint. Not blocking.
- **ADR-0016 Community-Dataset-Overrides sharing surface** is the
  FMX-33 Community Overlay Pipeline's territory. FMX-28 explicitly
  excludes sharing from Tactics' MVP contract; an `ImportSharedTactic`
  command is listed as deferred.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Tactics** bounded context.

If ratified, Tactics owns:

- `TacticPreset` aggregate with FSM (saved → active → archived); per
  save.
- `SetPieceRoutine` aggregate with FSM (drafted → published → retired);
  per save, referenced from TacticPreset slots.
- `RoleDutyTemplate` aggregate (5-layer tactical model: position +
  role + duty + player instructions + traits + tendencies); per save.
- `OppositionTemplate` aggregate (three-layer model: 8 archetypes +
  ~25-30 sub-archetypes + ~10 manager-signature opposition templates);
  per save.
- `TacticTier` configuration (Quick / Standard / Expert slot sizing
  per `tactics-system.md` §10).
- `TacticalIdentityFingerprint` projection aggregating style signals
  (possession, pressing, risk, adaptation, set-piece use) for
  Manager & Legacy consumption per GD-0019 §MVP hook model.

Tactics does **not** own:

- The per-match snapshot itself (owned by Match per
  `bounded-context-map.md §1`; `home_tactic` / `away_tactic` jsonb
  produced via the `TacticLockSnapshotProduced` event at
  `lineup_locked`).
- Player base data, attributes, fitness, morale, injuries (owned by
  Squad & Player; consumed via query for role-fit and target-role
  projections).
- Match-engine numerical execution (owned by Match per ADR-0049
  swappable spatial-event engine; consumes the frozen snapshot).
- Cross-save preset sharing (deferred to FMX-33 Community Overlay
  Pipeline per ADR-0016).
- Cross-save tactical-unlock mechanics (post-MVP per GD-0019; if built,
  follows ADR-0051 determinism rule and Manager & Legacy controls the
  configuration).
- Set-Piece-Coach role lifecycle (owned by Staff Operations per
  ADR-0053; Tactics consumes `SetPieceCoachReadinessUpdated`).
- AI-manager opposition selection logic (owned by League / Club /
  Transfer per `bounded-context-map.md §7` AI-manager note; Tactics
  publishes the catalog, AI consumes the catalog and the per-opponent
  context).

## Public contract direction

Draft commands:

- `SaveTacticPreset`
- `ActivateTacticPreset`
- `ArchiveTacticPreset`
- `RenameTacticPreset`
- `SaveSetPieceRoutine`
- `PublishSetPieceRoutine`
- `RetireSetPieceRoutine`
- `AssignTacticToSlot`
- `UpdateRoleDutyTemplate`
- `SaveOppositionTemplate`
- `ImportSharedTactic` (deferred, per ADR-0016 / FMX-33 surface)

Draft events:

- `TacticPresetSaved`
- `TacticPresetActivated`
- `TacticPresetArchived`
- `SetPieceRoutinePublished`
- `SetPieceRoutineRetired`
- `RoleDutyTemplateUpdated`
- `OppositionTemplateSaved`
- `TacticLockSnapshotProduced` (consumed by Match at lock-time)
- `TacticalStyleSignalEmitted` (consumed by Manager & Legacy)

Draft read models:

- `TacticLibrarySnapshot` - all active + saved presets per save.
- `ActiveTacticForSlot` - currently-assigned preset per Quick /
  Standard / Expert slot.
- `RoleProfileForPosition` - role / duty configuration for a position
  (consumed by Training for drill scheduling and by Transfer for
  target shortlisting).
- `OppositionTemplateForArchetype` - opposition template lookup by
  archetype / sub-archetype / manager-signature key.
- `SetPieceRoutineCatalog` - published routines per save, per module.
- `TacticalIdentityFingerprint` - aggregated style-signal projection
  feeding Manager & Legacy's archetype-detection per GD-0019.

Draft consumed facts:

- `MatchScheduled`, `MatchLineupOpening` from Match (signals to prepare
  candidate tactics for the upcoming match).
- `RogueliteRunStarted`, `RogueliteRunEnded` from League Orchestration
  (run-boundary triggers preset reset / archival per ADR-0051
  determinism rule).
- `StaffRoleAssigned` (when role = Set-Piece Coach),
  `StaffSpecialisationUpdated` from Staff Operations (set-piece
  effect-readiness signal feeding routine quality multipliers).
- `PlayerSkillProfileUpdated` from People (ADR-0052 draft) when
  ratified - feeds role-fit projections; until ratified, Tactics reads
  role-fit from Squad attributes directly.
- `MatchResolved` from Match (run-end signal contributes to
  TacticalIdentityFingerprint aggregation).

## Determinism and storage rules

- Tactics owns per-save tables only (`save_<uuidv7hex>` schema per
  ADR-0027). No platform-scope cross-save state.
- New save creation may receive a legacy-configured tactical-style
  seed as an explicit generation parameter when ADR-0051 Manager &
  Legacy supplies one (post-MVP); the seed is copied into the save
  snapshot at creation and never re-read during a running save.
- Cross-context inputs arrive through public events / queries only.
  Tactics does not join across context tables.
- Match `tactic_lock` produces an immutable `TacticSnapshot` value
  object copied into Match's `home_tactic` / `away_tactic` jsonb
  columns at lock-time. After lock, the live tactic preset may be
  edited freely without affecting the in-flight match - canonical
  Reference + Snapshot pattern (Vernon Product Catalog vs Ordering
  analogue confirmed by synthesis F4).
- Style-signal aggregation runs as a deterministic projection from
  published match events plus the locked TacticSnapshot. The
  `TacticalIdentityFingerprint` is consumed by Manager & Legacy at
  run-end; per ADR-0051 determinism rule, the projection is read-only
  to Manager & Legacy and is never re-read after the legacy
  configuration is generated for the next save.

## Rationale

The tactic library is a first-class gameplay asset (synthesis F2):
concrete sizing of 2 / 3 / 3 active slots plus 0 / 10 / 50 saved
presets per tier, five-module set-piece routines, three-layer
opposition templates, role / duty configurations. Hiding it inside
Match's match-day runtime (Option A) collapses editorial language
into runtime language; distributing it inside Squad (Option B) buries
opposition templates and set-piece routines in a player-centric
context where they don't belong; deferring (Option D) leaves three
downstream beats (Manager & Legacy tactical-identity, FMX-29 Youth
Academy role profiles, FMX-31 Media-narrative tactical-commentary)
without a defined source.

DDD authorities, genre precedent (FM `.ftc` + set-piece library) and
real-world precedent (club-owned data-platform tactical archives)
converge on the same answer: catalog-as-own-bounded-context with
Reference + Snapshot semantics at the instance side. The marginal
cost (one more context in the modular monolith, with extraction as a
deployment change per ADR-0019 §5) is small compared with the
coupling debt the alternatives accumulate.

## Consequences

Positive:

- Clear owner for the tactic library, set-piece routines, opposition
  templates and tactical-identity signal aggregation.
- Contracts-first path: commands, events, read models, consumed facts
  all named at draft precision.
- Match's `tactic_lock` snapshot semantics formalised as the canonical
  Reference + Snapshot pattern; ADR-0026 / ADR-0049 contract surfaces
  unchanged.
- Manager & Legacy's "Tactical identity" signal category gets a
  defined source channel.
- Staff Operations' Set-Piece Coach role gets a defined effect-
  readiness consumer.
- Training and Transfer get a clean `RoleProfileForPosition` query
  channel.
- Mirrors real-world Sporting-Director-controlled-playbook structure -
  playtesters recognise the model.

Negative:

- Adds another bounded context to the map. Map growth post-FMX-25 /
  FMX-26 + ADR-0052 / ADR-0054 drafts is acknowledged; modular-monolith
  stays one process per ADR-0019.
- Requires event consumption across Match, Training, Transfer,
  Manager & Legacy, Staff Operations, and (post-MVP) Watch Party.
  Coordination grows but follows the established Customer-Supplier +
  Anti-Corruption Layer pattern from FMX-26 / ADR-0053 wage events.
- Set-piece-coach effect-readiness curves remain post-MVP
  (Staff Operations specialisation metadata + playtest GDDR).
- Opposition-template AI consumption (which AI-manager logic uses
  which templates) is a separate beat.
- Cross-save preset sharing (ADR-0016) is FMX-33 Community Overlay's
  territory; explicit boundary.

## Supersedes

None

## Related Docs

- [[../../60-Research/tactics-persistence-bounded-context-2026-05-28]]
  - FMX-28 ratification synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-tactics-persistence-2026-05-28]]
  - FMX-28 raw research (genre / DDD / real-world surveys).
- [[../../50-Game-Design/tactics-system]] - 5-layer tactical model,
  tier-based slot sizing, saved presets, opposition templates.
- [[../../50-Game-Design/set-pieces]] - five set-piece modules, routine
  variant structure.
- [[../../50-Game-Design/GD-0004-tactics]] - binding GDDR; halftime
  controls; Wave-2 open items.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - tactical-identity signal category; "MVP ships hooks, not full meta
  system"; progressive-disclosure unlock mechanics post-MVP.
- [[../../20-Features/feature-tactics-progressive-disclosure]] - UI
  tier disclosure (Quick / Standard / Expert).
- [[../../60-Research/tactics-and-formations]] - prior numerical-depth
  research (mentality bands, pressing intensity, risk curves).
- [[ADR-0019-modular-monolith-ddd]] - bounded-context discipline.
- [[ADR-0027-postgres-data-model]] - per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery
  mechanism.
- [[ADR-0026-match-frame-contract]] - match frame contract surface
  (renderer / engine separation).
- [[ADR-0049-swappable-spatial-event-match-engine]] - MatchInput
  contract; tactics consumed as frozen snapshot.
- [[ADR-0051-manager-and-legacy-context]] - tactical-identity-signal
  consumer; determinism rule for cross-save legacy seeds.
- [[ADR-0053-staff-operations-context]] - Set-Piece-Coach role slot;
  effect-readiness producer.
- [[ADR-0052-people-persona-and-skills-context]] - skill-profile
  upstream consumer (when ratified).
- [[ADR-0054-narrative-context-and-ai-narration-framework]] - parallel
  draft; no direct boundary requirement.
- [[ADR-0016-community-dataset-overrides]] - cross-save preset sharing
  surface (FMX-33 Community Overlay Pipeline territory).
- [[ADR-0067-set-piece-variant-selection-determinism]] - proposed; pins the
  deterministic set-piece variant-selection rule + `TacticSnapshot` set-piece
  fields (see appendix).

## Appendix: `TacticSnapshot` set-piece selection fields (proposed, FMX-70)

> **Status: proposed** (not part of the accepted decision above). Canonical spec
> + invariants + open questions in
> [[ADR-0067-set-piece-variant-selection-determinism]]; a ratification PR folds
> this in once Nico answers ADR-0067's D1–D3.

ADR-0055 establishes that Match consumes a frozen `TacticSnapshot` at
`lineup_locked` with set-piece variants inside, but does not pin the *fields* the
Match engine needs to select a variant deterministically (gap G9). ADR-0067
adds, per set-piece module, the fields the frozen snapshot must carry:

```ts
SetPieceModuleSnapshot = {
  type: SetPieceType,
  selectionMode: 'priority' | 'seeded-mix',   // per-module; default 'priority'
  defaultVariantId: VariantId,                 // always-eligible fallback
  variants: ReadonlyArray<{
    variantId: VariantId,                      // immutable; stable total-order key
    priority: int,                             // higher = preferred
    trigger: TriggerPredicate                  // pure precondition over DeadBallContext
  }>
}
TacticSnapshot.setPieces: Readonly<Record<SetPieceType, SetPieceModuleSnapshot>>
```

The engine selects via the pure ordering `(priority DESC, variantId ASC)` and
the module's `selectionMode`; deeply `readonly` per ADR-0026 rule 8. These fields
are produced through the existing `TacticLockSnapshotProduced` event; no new
command/event is required.
