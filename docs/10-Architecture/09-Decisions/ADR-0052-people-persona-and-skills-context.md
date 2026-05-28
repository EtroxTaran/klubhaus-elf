---
title: ADR-0052 People, Persona and Skills Context
status: draft
tags: [adr, architecture, ddd, people, persona, player-skills, fmx-23]
created: 2026-05-28
updated: 2026-05-28
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../../60-Research/player-staff-development-decision-model-2026-05-28]]
  - [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
---

# ADR-0052: People, Persona and Skills Context

## Status

draft

## Date

2026-05-28

## Context

FMX-23 promotes the EOS player/staff/persona research into a draft planning
path. FMX-3 now expands the narrative target to Full Dialogue and All Active
actor classes for MVP. The design cuts across several existing contexts:

- Squad & Player owns player base data, attributes, contracts, injury state and
  squad projections.
- Training owns training plans, load and development outcomes.
- Match owns line-up locks, match simulation, match events and results.
- Notification owns durable messages and delivery.
- Fan Ecology owns fan segment facts and atmosphere/economy outputs.
- Club/Governance owns board KPIs, authority and decisions.
- Transfer/Contracts owns agent/deal facts.
- Manager & Legacy, if ADR-0051 is ratified, owns cross-save manager identity
  and run/legacy progression.

No existing context cleanly owns save-scope personhood across players, staff,
board contacts, journalists, fan reps, agents, relationship constellations,
persona context cards and visible player skill/perk profiles.

## Options considered

- **Keep everything in Squad & Player.** Simple for player records, but it
  overloads Squad with media, board, staff persona and dialogue context.
- **Put persona in Notification / Narrative.** Good for message rendering, but
  wrong owner for social facts and skill profiles; risks presentation owning
  domain state.
- **Extend Manager & Legacy.** Useful for the human manager's cross-run identity,
  but wrong owner for all save-scope people and relationships.
- **Create People / Persona & Skills.** Adds one proposed context that owns
  cross-actor personhood, relationship graph, player/staff skill profiles and
  deterministic context cards while leaving football/economy facts in their
  current owners.

## Decision

Propose a dedicated **People / Persona & Skills** bounded context.

If ratified, People owns:

- actor registry for save-scope people: players, staff, board contacts,
  journalists, fan reps, agents and other non-playing characters;
- internal persona substrate, including OCEAN vector and derived
  football-domain labels;
- role values, motivators, conflict style and stress triggers;
- relationship graph and relationship provenance;
- player skill/perk profile and staff skill/perk target profile;
- skill/perk catalog metadata;
- deterministic `PersonaContextCard` / `DialogueContextCard` read models;
- social interpretation policies for mentoring, trust, conflict and media
  framing.

People does **not** own:

- player numeric attributes, CA/PA, contracts, injuries or squad status;
- training plans or development deltas;
- match facts, ratings, goals, xG, fatigue or result events;
- club finances, board decisions or fan segment facts;
- media outlet publication cadence, article delivery or inbox persistence;
- fan group population/mood/economic outputs owned by Fan Ecology;
- agent negotiation state owned by Transfer/Contracts;
- message delivery, inbox persistence or notification provider state;
- cross-save manager legacy progression.

People may represent a generated media outlet or fan group as a non-person
`ActorRef` only for relationship/context addressing. The owning domain remains
the source of truth for outlet publication rules or fan segment facts.

## Public contract direction

Draft commands:

- `RegisterActor`
- `ImportManagerPersonaSnapshot`
- `RegisterNonPersonNarrativeActor`
- `RecordPersonaObservation`
- `RecordRelationshipSignal`
- `AssignPlayerSkillCandidate`
- `ConfirmPlayerSkillProfileChange`
- `RecordStaffSkillCandidate`
- `BuildPersonaContextCard`

Draft events:

- `ActorRegistered`
- `PersonaProjectionUpdated`
- `RelationshipEdgeChanged`
- `PlayerSkillCandidateDetected`
- `PlayerSkillProfileChanged`
- `StaffSkillCandidateDetected`
- `PersonaContextCardBuilt`
- `NarrativeActorRegistered`

Draft read models:

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

Draft consumed facts:

- player creation, transfer, contract, squad role and injury facts from Squad
  & Player;
- training attendance, focus and development facts from Training;
- match performance aggregates and line-up facts from Match;
- run/manager snapshot facts from Manager & Legacy if ADR-0051 is ratified;
- board KPI and governance facts from Club/Governance;
- fan segment/group facts from Fan Ecology;
- agent/deal facts from Transfer/Contracts;
- notification delivery outcomes from Notification only as social feedback
  inputs, not as message ownership.

## Snapshot and determinism rules

- Match consumes a `PlayerSkillProfileSnapshot` at line-up/tactic lock. A skill
  profile changing later does not alter the already locked match.
- Skill effects are deterministic bounded modifiers over existing match/training
  calculations. They do not create standalone match facts.
- People may store provenance for social and persona changes, but original
  football/economy facts remain in the owning context.
- Dialogue context cards contain only structured facts and allowed summaries.
  They include forbidden-claim lists for template/LLM consumers.
- Development and Transfer decision contexts expose only derived, provenance-
  backed slices needed by the consuming domain. Training, Squad and Transfer
  apply their own rules and never duplicate People-owned social truth.
- Runtime LLM output remains governed by ADR-0030: presentation only, no state
  mutation.
- Narrative context cards for media/fan/board scenes include opaque refs and
  summaries only. They do not expose internal IDs, raw user text or provider
  secrets.
- The manager-as-person inside a save is represented by an opaque actor ref.
  Cross-save manager identity remains with Manager & Legacy.

## Storage and context rules

- People owns its own tables/read models per ADR-0027 if implemented.
- Cross-context IDs are opaque branded refs. No cross-context foreign keys.
- No joins across Squad, Match, Training, Notification or Manager & Legacy
  internals.
- Skill catalog data must be versioned. Saved profiles store the catalog
  version used to compute their snapshot.
- OCEAN values are internal and never exposed directly in public UI or exported
  as user-facing labels without derivation.
- Media outlets and fan groups need stable generated identity, but their
  operational state is not stored in People unless it is relationship/context
  metadata.

## Rationale

People is a real domain, not a narrative cache. It answers questions such as:
"who is this person?", "who trusts whom?", "which skill identity does this
player currently have?", and "what structured facts are safe to tell a dialogue
renderer?" Those questions cut across players, staff, board, media and fans.
A dedicated context keeps that language coherent without giving a presentation
system authority over simulation facts.

## Consequences

Positive:

- Clear owner for player individuality, staff/persona depth and LLM-safe
  context cards.
- Keeps 16+4+8 attributes in Squad & Player while allowing visible skills.
- Makes relationship provenance explicit.
- Creates a clean boundary between deterministic context and optional prose.
- Gives the MVP Full Dialogue target a deterministic source for every active
  actor class.

Negative:

- Adds another proposed bounded context if accepted.
- Requires careful contract design so People does not duplicate Squad or Match
  truth.
- Needs catalog versioning and snapshot rules before implementation.
- Staff skills require follow-up GDDR depth before active gameplay use.

## Supersedes

None

## Related docs

- [[../../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
- [[../../60-Research/player-staff-development-decision-model-2026-05-28]]
- [[../../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../../20-Features/feature-eos-player-skills-and-people-context]]
- [[../../20-Features/feature-ai-narration-mvp-pillar]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0027-postgres-data-model]]
- [[ADR-0030-llm-out-of-authoritative-state]]
- [[ADR-0051-manager-and-legacy-context]]
