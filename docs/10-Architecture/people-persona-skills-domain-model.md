---
title: People / Persona & Skills Domain Model (Proposal)
status: draft
tags: [architecture, ddd, domain-model, aggregate, people, persona, player-skills, proposal, people-persona-skills]
context: people-persona-skills
created: 2026-06-20
updated: 2026-06-20
type: arch
binding: false
related: [[modules/people-persona-skills]], [[09-Decisions/ADR-0052-people-persona-and-skills-context]], [[bounded-context-map]], [[05-Building-Blocks]], [[09-Decisions/ADR-0027-postgres-data-model]], [[09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[09-Decisions/ADR-0053-staff-operations-context]], [[09-Decisions/ADR-0051-manager-and-legacy-context]], [[../20-Features/feature-eos-player-skills-and-people-context]], [[../20-Features/feature-ai-narration-mvp-pillar]]]
---

# People / Persona & Skills Domain Model (Proposal)

> **Status: draft / proposed — NOT ratified.** This note proposes an internal
> aggregate decomposition for the People / Persona & Skills context. It is a
> **planning artifact**, not a binding boundary decision. Aggregate boundaries
> are an architecture decision and **require Nico's ratification** before they
> become authoritative. Nothing here ratifies a boundary, formula, policy or
> numeric threshold. Every such item is surfaced under
> [Open decisions](#open-decisions).

## Scope and grounding

This proposal decomposes the **internal** domain model for the concepts that
ADR-0052 places under People / Persona & Skills ownership:

- Actor registry (save-scope people + non-person narrative actors)
- Persona / OCEAN substrate and hidden-attribute → label derivation
- Relationship graph and relationship provenance
- Player skill/perk profile and staff skill/perk target profile
- Skill/perk catalog metadata (versioned)
- Deterministic `PersonaContextCard` / `DialogueContextCard` read models

It is grounded in [[09-Decisions/ADR-0052-people-persona-and-skills-context]]
(accepted boundary, `binding: false` implementation posture) and the module
note [[modules/people-persona-skills]]. It does **not** restate ownership
boundaries already fixed by ADR-0052 (those are SSOT there); it only proposes
how the owned concepts decompose into aggregates, entities, value objects and
transactional boundaries.

Inherited hard constraints (from ADR-0052, [[09-Decisions/ADR-0027-postgres-data-model]],
[[09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]],
[[09-Decisions/ADR-0030-llm-out-of-authoritative-state]]):

- People owns its own tables/read models; no shared tables, no cross-context
  joins; cross-context IDs are opaque branded refs (no cross-context FKs).
- Skill catalog is versioned; saved profiles store the catalog version used.
- OCEAN values are internal; labels are derived and never exposed raw.
- Context cards are presentation-only read models; runtime LLM output mutates
  no state.
- Match consumes a `PlayerSkillProfileSnapshot` at line-up/tactic lock; later
  profile changes do not alter the locked match.

These constraints shape the decomposition but do **not** by themselves fix
aggregate boundaries — that is the proposal below.

## DDD method notes for this context

- An **aggregate** is the consistency boundary: one transaction mutates exactly
  one aggregate instance; cross-aggregate effects are reached via events /
  eventual consistency, never a single multi-aggregate write.
- Aggregates reference each other and external contexts **by ID only**
  (`ActorRef` is the universal internal id; external refs are opaque branded).
- **Snapshot-at-creation** value objects are immutable once written and carry
  the catalog version / provenance used to compute them. **Mutable** entities
  evolve in place under their root's invariants.
- A context card is a **derived read model** (projection), not an aggregate; it
  is rebuilt from authoritative aggregates and is replaceable/regenerable.

## Recommended decomposition (PROPOSED)

Six aggregates plus a set of pure read-model projections. The proposed split
follows the four ADR-0052 rate-of-change clusters: identity (slow), persona
(medium), relationships (high-fanout/high-churn), and skill profiles
(event-driven, snapshot-bearing).

### A1 — `Actor` aggregate  *(root: `Actor`)*

The identity/registry anchor for every save-scope person and non-person
narrative actor.

- **Root entity:** `Actor` — holds `ActorRef` (internal stable id), `actorKind`
  (player / staff / board-contact / journalist / fan-rep / agent /
  non-person-narrative / manager-as-person), lifecycle status, and the opaque
  external refs that bind this actor to its owning context (e.g. Squad player
  ref) **by id only**.
- **Value objects:**
  - `ActorRef` — internal branded id (mutable: no; created once).
  - `ExternalContextRef` — opaque branded ref into another context
    (snapshot-at-link; replaced, not mutated, if rebound).
  - `ActorKind`, `ActorDisplayHandle` (non-identifying internal label).
- **Transactional boundary:** registration, kind classification, lifecycle
  flag changes, and (re)binding of external refs. Does **not** transactionally
  own persona, relationships or skills — those are separate aggregates keyed by
  `ActorRef`.
- **Why separate:** identity changes slowly and is referenced by every other
  aggregate; making it the smallest stable root keeps high-churn persona and
  relationship writes off the identity transaction. (Sizing is a recommendation,
  see Open decisions OD-1.)

### A2 — `PersonaProfile` aggregate  *(root: `PersonaProfile`, keyed by `ActorRef`)*

The persona/OCEAN substrate plus the hidden-attribute → label derivation for one
actor.

- **Root entity:** `PersonaProfile` — one per persona-bearing actor.
- **Value objects:**
  - `OceanVector` — internal Big-Five vector (**mutable** via observation
    folding, but never exposed raw). Internal only.
  - `DerivedLabelSet` — football-domain labels derived from OCEAN + role values
    (**snapshot-at-derivation**: each label set carries the derivation ruleset
    version; recomputed → new snapshot, not in-place edit).
  - `RoleValues`, `MotivatorSet`, `ConflictStyle`, `StressTriggerSet`.
  - `PersonaProvenanceEntry` — append-only provenance for each observation that
    moved the substrate (immutable entries).
- **Mutable vs snapshot:** the `OceanVector` substrate is mutable (it folds
  `RecordPersonaObservation`); the **published** `DerivedLabelSet` is a
  snapshot carrying its derivation-ruleset version so consumers and cards see a
  stable, versioned projection.
- **Transactional boundary:** fold an observation, recompute labels, append
  provenance — all in one write against one persona. Emits
  `PersonaProjectionUpdated`.
- **Open:** whether `ImportManagerPersonaSnapshot` writes a frozen
  snapshot-only persona (no further folding) vs a normal mutable substrate is
  OD-5.

### A3 — `RelationshipGraph` aggregate(s)  *(root: `RelationshipNode`, keyed by source `ActorRef`)*

The relationship graph and its provenance.

- **Proposed root:** **per-source-actor `RelationshipNode`** — i.e. the
  aggregate boundary is "one actor's outgoing edges", not one global graph.
  - **Entities:** `RelationshipEdge` (directed, source→target `ActorRef`,
    relationship dimension, strength).
  - **Value objects:** `RelationshipStrength` (mutable, bounded — bounds are
    OD-2), `RelationshipProvenanceEntry` (append-only, immutable),
    `RelationshipDimension`.
- **Transactional boundary:** `RecordRelationshipSignal` updates the source
  node's edges + provenance in one write; the reciprocal/target side is reached
  by event (`RelationshipEdgeChanged`), not co-mutated in the same transaction.
  This keeps each write to a single aggregate and avoids whole-graph locks.
- **Why per-source rather than one graph aggregate:** a single global-graph
  aggregate would serialize all relationship writes and violate the
  "one small consistency boundary per transaction" heuristic; a per-edge
  aggregate would lose the "all of one actor's relationships" invariant useful
  for `MentoringConstellation`. Per-source is the recommended middle ground.
  (Alternatives in the section below; final granularity is OD-2.)

### A4 — `PlayerSkillProfile` aggregate  *(root: `PlayerSkillProfile`, keyed by player `ActorRef`)*

Visible player skill/perk identity.

- **Root entity:** `PlayerSkillProfile`.
- **Entities:** `SkillSlot` / `PerkSlot` (confirmed, active skills/perks).
- **Value objects:**
  - `SkillCandidate` — a detected-but-unconfirmed candidate (**mutable** pending
    state; lives until confirmed or expired).
  - `ConfirmedSkillEntry` — **snapshot-at-confirmation**, carries the catalog
    version used.
  - `CatalogVersionRef` — the skill/perk catalog version pinned to this profile.
- **State flow (two-step, per ADR-0052 contract):**
  `AssignPlayerSkillCandidate` → candidate (`PlayerSkillCandidateDetected`) →
  `ConfirmPlayerSkillProfileChange` → confirmed entry
  (`PlayerSkillProfileChanged`).
- **Snapshot rule:** the externally consumed `PlayerSkillProfileSnapshot`
  (read model, see projections) is immutable once Match reads it at
  line-up/tactic lock. Confirmation history is append-only and versioned.
- **Transactional boundary:** candidate detection and confirmation each mutate
  one player's profile only.

### A5 — `StaffSkillProfile` aggregate  *(root: `StaffSkillProfile`, keyed by staff `ActorRef`)*

Staff skill/perk **target** profile. Structurally parallel to A4 but kept a
**separate aggregate** because staff skills are "target profile" semantics, a
different lifecycle, and ADR-0052/module note flag staff-skill depth as
reserved-stub behind `peopleModelVersion` (thin MVP, D2 = A).

- **Root entity:** `StaffSkillProfile`.
- **Value objects:** `StaffSkillCandidate` (mutable pending),
  `StaffSkillTargetEntry` (snapshot, catalog-versioned), `CatalogVersionRef`.
- **Command:** `RecordStaffSkillCandidate` → `StaffSkillCandidateDetected`.
- **Why not merged with A4:** different invariants and rate of change; merging
  would couple a frozen MVP-thin surface to the active player pipeline. Merge is
  an explicit alternative (see below), final call is OD-3.

### A6 — `SkillCatalog` aggregate  *(root: `SkillCatalog`, keyed by catalog version)*

Versioned skill/perk catalog metadata — the reference data A4/A5 pin against.

- **Root entity:** `SkillCatalog` (one per published version; effectively
  immutable once published).
- **Entities/VOs:** `SkillDefinition`, `PerkDefinition`,
  `CatalogVersionRef` (the value profiles store).
- **Transactional boundary:** publishing a new catalog version is its own write;
  existing versions are immutable so old profile snapshots stay reproducible.
- **Note:** this is reference/master data, not per-actor state. Whether it lives
  as an aggregate inside People vs seeded game-data is OD-4.

### Read-model projections (NOT aggregates)

Derived, regenerable, presentation-only. Rebuilt from A1–A6; carry forbidden-
claim lists and opaque refs only; never expose internal ids, OCEAN, raw user
text or provider secrets (ADR-0052, [[09-Decisions/ADR-0030-llm-out-of-authoritative-state]]).

- `PersonaContextCard` / `DialogueContextCard` (built by `BuildPersonaContextCard`,
  emits `PersonaContextCardBuilt`) — **snapshot-at-build** read models.
- `PlayerSkillProfileSnapshot` — immutable snapshot consumed by Match at lock.
- `StaffSkillProfileSnapshot`, `ActorPersona`, `RelationshipGraphSlice`,
  `MentoringConstellation`, `NarrativeActorDirectory`, `PeopleImpactSummary`.
- `DevelopmentDecisionContext` / `TransferDecisionContext` contribution slices —
  derived, provenance-backed slices only.

### Aggregate / boundary summary

| # | Aggregate | Root | Keyed by | Primary mutation | Snapshot-at-creation parts | Mutable parts |
|---|-----------|------|----------|------------------|----------------------------|---------------|
| A1 | Actor registry | `Actor` | `ActorRef` | register / rebind | `ActorRef`, `ExternalContextRef` | lifecycle status |
| A2 | Persona substrate | `PersonaProfile` | `ActorRef` | fold observation, derive labels | `DerivedLabelSet`, provenance entries | `OceanVector`, role/motivator VOs |
| A3 | Relationship graph | `RelationshipNode` (per source) | source `ActorRef` | record signal | provenance entries | `RelationshipEdge` strengths |
| A4 | Player skills | `PlayerSkillProfile` | player `ActorRef` | detect/confirm | `ConfirmedSkillEntry`, snapshot | `SkillCandidate` |
| A5 | Staff skills | `StaffSkillProfile` | staff `ActorRef` | detect candidate | `StaffSkillTargetEntry` | `StaffSkillCandidate` |
| A6 | Skill catalog | `SkillCatalog` | catalog version | publish version | whole version (immutable) | none post-publish |

**Transactional rule across all six:** one command = one aggregate write.
Cross-aggregate consequences (e.g. a relationship signal that should refresh a
context card, or a confirmed skill that should refresh a snapshot) propagate via
the ADR-0052 domain events and projection rebuilds, never via a multi-aggregate
transaction.

## Alternatives considered

1. **One coarse `Person` aggregate** (actor + persona + relationships + skills
   under a single root). Simplest mental model and matches the "one person"
   intuition, but it makes every persona observation, relationship signal and
   skill change contend on one root, breaks the single-small-consistency-boundary
   heuristic, and couples the frozen staff-skill stub to live pipelines.
   Rejected as default; recorded as the fallback if event plumbing proves too
   heavy for MVP.

2. **Single global `RelationshipGraph` aggregate** (one root owning all edges).
   Cleanest place to enforce whole-graph invariants and reciprocity in one
   transaction, but serializes all relationship writes and scales poorly with
   fan-out. The recommended per-source `RelationshipNode` split trades global
   atomic reciprocity for write concurrency (reciprocity becomes event-driven).

3. **Per-edge relationship aggregate.** Maximum write concurrency, but loses the
   "all of one actor's relationships" cluster needed by `MentoringConstellation`
   and complicates provenance grouping. Considered too granular.

4. **Merge `PlayerSkillProfile` and `StaffSkillProfile` into one
   `SkillProfile` aggregate** parameterized by actor kind. Less duplication, but
   couples two different lifecycles/rates of change and links the MVP-thin staff
   stub to the active player surface. Kept separate by recommendation.

5. **Persona substrate as a value object hung off the `Actor` aggregate**
   (no separate root). Fewer aggregates, but persona has its own append-only
   provenance, its own update cadence and the OCEAN→label derivation lifecycle,
   which argues for an independent consistency boundary.

6. **Skill catalog as game-data outside People** rather than an in-context
   aggregate. Reasonable given it is versioned reference data; the tension is
   ADR-0027/ADR-0121 ownership vs avoiding duplicated master data. Left open
   (OD-4).

## Open decisions

> None of the items below are decided here. They require Nico's ratification.
> They are also mirrored in this note's `openDecisions`.

- **OD-1 — Actor aggregate sizing.** Is identity its own aggregate (A1) or the
  root of a larger person aggregate that also holds persona? Recommended:
  separate. Not ratified.
- **OD-2 — Relationship graph granularity + strength bounds.** Per-source node
  (recommended) vs global-graph vs per-edge; and the numeric bounds / decay /
  reciprocity rule for `RelationshipStrength`. No numbers are proposed here —
  bounds, decay curves and reciprocity policy are unspecified and must be set by
  ratified design.
- **OD-3 — Player/Staff skill aggregate unification.** Keep A4 and A5 separate
  (recommended) vs one parameterized `SkillProfile`. Tied to whether staff
  depth stays reserved-stub behind `peopleModelVersion`.
- **OD-4 — Skill catalog placement.** In-context aggregate (A6) vs shared
  game-data seed; plus the exact catalog-versioning scheme. Unspecified.
- **OD-5 — Manager persona import semantics.** Does
  `ImportManagerPersonaSnapshot` create a frozen snapshot-only persona or a
  normal mutable substrate? Interacts with ADR-0051 if ratified.
- **OD-6 — Hidden-attribute → label derivation ruleset.** The actual OCEAN →
  football-label mapping, its versioning identifier, and the thresholds/formulae
  are **not defined**. No formula is invented here; this is a ratified-design
  input.
- **OD-7 — Snapshot trigger points.** Beyond the Match line-up/tactic lock fixed
  by ADR-0052, the exact moments other snapshots (persona card, decision-context
  slices) freeze vs recompute are unspecified.
- **OD-8 — Physical schema / table names.** ADR-0052 fixes ownership and storage
  rules only, not table names; concrete schema is out of scope and unratified.
- **OD-9 — Concrete persona/relationship/skill numeric ranges and scoring.**
  Any vector ranges, candidate-detection thresholds and scoring weights are
  undefined and must come from ratified design, not this note.

## Determinism & safety (inherited, restated for the model)

- Context-card projections are deterministic and presentation-only; LLM use is
  downstream and mutates nothing (ADR-0030).
- Snapshots (`PlayerSkillProfileSnapshot` at lock, confirmed skill entries,
  derived label sets, persona cards) are immutable once created and carry the
  ruleset/catalog version used, so reads are reproducible.
- All aggregate roots reference external contexts by opaque branded ref only; no
  cross-context joins (ADR-0121).

## Next steps

1. Nico review of OD-1..OD-9 and ratification (or revision) of the recommended
   six-aggregate split.
2. On ratification, fold the agreed boundaries into a binding section of
   [[modules/people-persona-skills]] and (if a physical model is wanted) a
   schema note under ADR-0027.
3. Pin command/event signatures only after boundaries are ratified (ADR-0052
   lists them as draft).
