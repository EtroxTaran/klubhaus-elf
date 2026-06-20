---
title: People / Persona & Skills module
status: draft
tags: [architecture, module, people, persona, player-skills]
context: people-persona-skills
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# People / Persona & Skills Boundary

## Purpose

Save-scope owner of personhood across all actor classes: persona substrate,
relationship graph, player/staff skill profiles and deterministic context cards,
while football/economy facts stay in their owning contexts (ADR-0052).

## Owns

- Actor registry for save-scope people: players, staff, board contacts,
  journalists, fan reps, agents and other non-playing characters.
- Internal persona substrate: OCEAN vector and derived football-domain labels;
  role values, motivators, conflict style and stress triggers.
- Relationship graph and relationship provenance.
- Player skill/perk profile and staff skill/perk target profile.
- Skill/perk catalog metadata (versioned).
- Deterministic `PersonaContextCard` / `DialogueContextCard` read models.
- Social interpretation policies for mentoring, trust, conflict and media
  framing.

Does **not** own: player numeric attributes / CA / PA / contracts / injuries /
squad status; training plans or development deltas; match facts; club finances /
board decisions / fan segment facts; media publication cadence or inbox
persistence; agent negotiation state; message delivery; cross-save manager
legacy.

## Public contract

Commands (draft, per ADR-0052):

- `RegisterActor`
- `ImportManagerPersonaSnapshot`
- `RegisterNonPersonNarrativeActor`
- `RecordPersonaObservation`
- `RecordRelationshipSignal`
- `AssignPlayerSkillCandidate`
- `ConfirmPlayerSkillProfileChange`
- `RecordStaffSkillCandidate`
- `BuildPersonaContextCard`

Domain events (draft, per ADR-0052):

- `ActorRegistered`
- `PersonaProjectionUpdated`
- `RelationshipEdgeChanged`
- `PlayerSkillCandidateDetected`
- `PlayerSkillProfileChanged`
- `StaffSkillCandidateDetected`
- `PersonaContextCardBuilt`
- `NarrativeActorRegistered`

Queries / read models (draft, per ADR-0052):

- `ActorPersona`
- `PlayerSkillProfileSnapshot`
- `StaffSkillProfileSnapshot`
- `RelationshipGraphSlice`
- `MentoringConstellation`
- `DialogueContextCard`
- `NarrativeActorDirectory`
- `PeopleImpactSummary`
- `DevelopmentDecisionContext` contribution slice
- `TransferDecisionContext` contribution slice

## Storage ownership

- People owns its own tables / read models per ADR-0027; no shared tables and no
  cross-context joins per ADR-0121.
- Cross-context IDs are opaque branded refs; no cross-context foreign keys; no
  joins across Squad, Match, Training, Notification or Manager & Legacy
  internals.
- Skill catalog data is versioned; saved profiles store the catalog version used
  to compute their snapshot.
- OCEAN values are internal and never exposed directly in public UI or exported
  as user-facing labels without derivation.
- Media outlets / fan groups may have stable generated identity, but their
  operational state is not stored in People unless it is relationship/context
  metadata.

## Consumers / Producers

Consumes facts from (producers):

- Squad & Player — player creation, transfer, contract, squad role, injury facts
  (BCM: "actor facts").
- Training — attendance, focus and development facts.
- Match — performance aggregates and line-up facts.
- Manager & Legacy — run/manager snapshot facts (if ADR-0051 ratified).
- Club / Governance — board KPI and governance facts ("board/fan facts").
- Fan Ecology — fan segment / group facts.
- Transfer / Contracts — agent / deal facts.
- Notification — delivery outcomes, only as social feedback inputs.

Outputs consumed by (consumers):

- Narrative — actor / persona / dialogue context cards.
- Staff Operations — actor identity and skill-profile snapshots (ADR-0053).
- Match — `PlayerSkillProfileSnapshot` at line-up/tactic lock.
- Training / Squad / Transfer — derived `DevelopmentDecisionContext` /
  `TransferDecisionContext` contribution slices.

## Invariants

- Match consumes a `PlayerSkillProfileSnapshot` at line-up/tactic lock; a later
  skill-profile change does not alter the already locked match.
- Skill effects are deterministic bounded modifiers over existing match/training
  calculations; they create no standalone match facts.
- People stores provenance for social/persona changes, but original
  football/economy facts remain in the owning context.
- Dialogue/narrative context cards expose only structured facts and allowed
  summaries, carry forbidden-claim lists, and never expose internal IDs, raw
  user text or provider secrets.
- Runtime LLM output is presentation only, no state mutation (ADR-0030).
- The manager-as-person inside a save is an opaque actor ref; cross-save manager
  identity stays with Manager & Legacy.

## Dependencies

- [[../09-Decisions/ADR-0052-people-persona-and-skills-context]] (context
  definition; draft — do not implement yet, `binding: false`)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (storage ownership)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins)
- [[../09-Decisions/ADR-0030-llm-out-of-authoritative-state]] (LLM presentation
  only)

## Open items

- ADR-0052 lists Commands, Events and read models as **draft** ("public contract
  direction"); none are ratified as final signatures.
- Concrete table / schema names are unspecified — ADR-0052 fixes ownership and
  storage rules only, not a physical schema.
- Staff-skill depth, full relationship graph and advanced scoring are
  reserved-stub behind `peopleModelVersion` (D2 = A thin MVP); not yet
  contract-pinned.
- Exact aggregate names/boundaries (beyond actor / persona substrate /
  relationship graph / skill profiles / context cards) are not enumerated in the
  source.
