---
title: GD-0020 EOS Player Skills, Personas and People
status: accepted
tags: [game-design, gddr, player-skills, persona, people, fmx-23]
created: 2026-05-28
updated: 2026-06-08
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[GD-0003-squad-players]]
  - [[GD-0018-ai-narrative-personas-and-dialogue]]
  - [[GD-0021-player-staff-development-and-decision-influence]]
  - [[tactics-system]]
  - [[squad-and-club-structure]]
  - [[youth-academy-and-development]]
  - [[training-load-and-medicine]]
  - [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../60-Research/player-staff-development-decision-model-2026-05-28]]
  - [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
---

# GD-0020: EOS Player Skills, Personas and People

## Status

draft

> Draft only. This record captures the FMX-23 design direction for EOS player
> skills/perks, staff-skill planning, persona substrate and relationship
> constellations. It is not implementable until Nico approves it and the linked
> ADR is accepted.

## Date

2026-05-28

## Player experience goal

Players and staff should feel like distinct people, not only rows of numbers:
a defender can be reliable but limited, a young striker can be talented but
volatile, a veteran can change a dressing room, and dialogues can reference
real relationship history without inventing facts.

## Decided / strong

- **Keep 16+4+8.** The existing player attribute basis remains: 16 visible
  outfield attributes, 4 GK-only extras and 8 hidden meta attributes on the
  current 1-20 scale. The raw report's 20-24 visible recommendation is not
  promoted.
- **Player skills/perks are separate from attributes.** A skill/perk is a
  visible, sparse specialization over existing football calculations. It is
  never a new numeric attribute, never a global OVR and never a hidden stat.
- **MVP activates player skills first for gameplay effects.** Player
  skills/perks are the first active mechanical slice. Staff skills remain target
  gameplay unless separately ratified.
- **MVP activates all actor classes for persona context.** Players, staff,
  board contacts, journalists, media outlets, fan segments, named fan groups,
  fan reps and agents need generated persona/context-card inputs for narration
  from the first playable.
- **Behavioral tendencies stay distinct.** Tendencies such as shoots from
  distance or cuts inside affect decision probabilities. Skills/perks affect
  bounded outcome quality or temporary context effects when a declared trigger
  fires.
- **OCEAN is internal substrate.** The mixed OCEAN model is used for
  personhood, dialogue and social consistency. It does not replace the 8 hidden
  player meta attributes and is not shown directly to the player.
- **Football-language labels are the surface.** UI, reports and dialogue use
  football labels: professional, volatile, leader, mentor, loner, media-savvy,
  demanding, homesick, adaptable.
- **Relationship constellations matter.** People are connected by trust,
  influence, mentorship, rivalry, role competition, respect, media pressure and
  fan/board alignment. The graph provides context, not free-form invented
  narrative.
- **Generated prose is presentation only.** Dialogue and LLM context cards may
  use traits, relationships and recent facts, but generated prose never changes
  simulation state.
- **Media and fan groups are first-class story surfaces.** Media outlets and fan
  groups are generated entities with stable identity. Journalists and fan reps
  are People actors that can appear in recurring dialogue scenes.

## MVP player skill model

Minimum viable skill profile:

```text
PlayerSkillProfile
  playerId
  skillIds[]
  tier per skill
  acquisitionEvidence
  effectSnapshotVersion
```

Minimum skill-definition fields:

| Field | Meaning |
|---|---|
| Skill id + label | IP-clean canonical identifier and player-facing name |
| Category | Scoring, passing, ball-control, defending, physical, GK, leadership, mentoring |
| Tier | Draft default: skill / mastery |
| Allowed role groups | Positions and tactical roles where it can appear |
| Prerequisites | Attribute band, hidden-meta fit, age, training, match evidence or mentoring |
| Trigger | Match event, training event, social event or dialogue context |
| Effect envelope | Bounded modifier to existing deterministic calculation |
| Downside | Risk, stamina cost, foul risk, morale cost or context limitation |
| UI tier | Quick / Standard / Expert exposure |
| MP rule | Normalization/cap rule for future async multiplayer |

MVP should start with a small player-only catalog across the major football
surfaces:

- finishing / chance conversion;
- creative passing;
- pressing / ball winning;
- aerial defending and heading;
- stamina / repeated effort;
- leadership / mentoring.

Exact names, counts and values are not approved by this GDDR.

## Skill acquisition

Player skills are earned slowly through converging evidence:

- role-relevant attributes reach the prerequisite band;
- training focus and match usage fit the skill;
- match events prove the behavior under pressure;
- mentor or staff influence supports the pattern;
- hidden meta / persona fit does not contradict it.

Skill learning must not be grind checklist UI. The player may see coach
suggestions and progress signals, but not an exact "perform 30 actions for
perk X" counter unless Nico explicitly approves that UX.

## Staff target model

Staff uses the same conceptual split:

- staff attributes: numeric capability, e.g. tactical, technical, youth,
  motivating, people management, physiotherapy, sports science, scouting;
- staff skills/perks: discrete specializations such as set-piece teaching,
  role conversion, youth identification, rehab planning, conflict mediation;
- staff persona: internal OCEAN substrate plus football labels like
  disciplinarian, player coach, analyst, mentor, recruiter.

Staff skills apply through the owning domain. People may own the staff persona
and relationship profile, but Training, Squad, Transfer/Scouting and Medical
rules apply their own gameplay effects.

Cross-system staff and player effects are governed by
[[GD-0021-player-staff-development-and-decision-influence]]. Staff-skill MVP
activation remains an explicit option gate there; this GDDR alone does not make
staff skill profiles active gameplay.

## Persona and dialogue model

Each active actor can expose a deterministic context card:

```text
PersonaContextCard
  actorRef
  actorType
  visibleFootballLabels
  valuesAndMotivators
  currentMoodOrPressureState
  relationshipEdgesRelevantToScene
  recentAuthoritativeFacts
  allowedIntents
  forbiddenClaims
  templateFallbackKey
```

The context card is the bridge into
[[GD-0018-ai-narrative-personas-and-dialogue]]. Templates and optional LLM
phrasing consume the card; mechanics consume the selected intent and
authoritative facts.

MVP actor classes:

- player;
- staff;
- board contact;
- journalist;
- media outlet;
- fan segment;
- fan group;
- fan rep;
- agent.

## Relationship constellations

The design target is not "one personality tag per player"; it is a small social
simulation:

- a captain can stabilize young players but clash with another leader;
- a strict mentor can improve professionalism while hurting morale;
- role competitors can respect each other, resent each other or both;
- a journalist can repeatedly frame a manager through a hostile or admiring
  lens;
- a named fan group can attach to a local academy graduate and pressure transfer
  decisions through its fan rep;
- a staff member can support a manager in public but challenge training or
  selection in a private scene.

All relationship changes need provenance from authoritative events. No
relationship edge may be changed because generated prose sounded plausible.

## Change policy

Can change without a new GDDR:

- exact skill names and flavor labels;
- skill thresholds and modifier caps;
- UI copy;
- relationship decay values;
- which labels appear in Quick / Standard / Expert;
- size of the first player skill catalog.

Needs Nico decision and GDDR/ADR update:

- expanding the 16+4+8 attribute schema;
- making staff skills active MVP gameplay;
- removing staff/board/media/fan actor context from the MVP narration target;
- allowing OCEAN to directly modify match/economy results;
- allowing generated prose to create or change facts;
- moving People ownership into another context;
- granting competitive multiplayer advantages through persistent perks.

## Open

- Final MVP player skill catalog.
- Tier names: skill/mastery vs another IP-clean wording.
- Exact OCEAN scale and whether it is persisted or derived/cached.
- Final actor counts per world size for media outlets, journalists, named fan
  groups, fan reps and agents.
- Relationship graph decay, caps and anti-spam rules.
- Exact balance caps for match effects.
- Exact split between People-owned actor identity and Narrative-owned media
  publication/outlet state.
- Staff-skill MVP activation option: target-only, narrow pipeline modifiers or
  full staff skill-card gameplay. See
  [[GD-0021-player-staff-development-and-decision-influence]].

## Rationale

EA FC 26 demonstrates the market value of visible identity layers beyond raw
attributes, but also shows why attributes must remain meaningful. Football
Manager demonstrates the durability of attributes plus traits, personality and
staff capability. FMX should combine those lessons without copying taxonomy or
breaking its mobile-readable 16+4+8 model.

## Consequences

Positive:

- Creates more memorable players and staff without spreadsheet bloat.
- Gives deterministic player talks and narrative a structured context source.
- Preserves Impact Lens and attribute clarity.
- Allows future staff and media depth without a model rewrite.

Negative / constraints:

- Requires careful terminology so skills, tendencies, hidden meta and persona
  do not blur together.
- Adds balancing work for skill effects and acquisition.
- Needs a clean People context boundary before implementation.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]

## Related

- Research: [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]] ·
  [[../60-Research/player-staff-development-decision-model-2026-05-28]] ·
  [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]] ·
  [[../60-Research/raw-perplexity/raw-player-and-staff-values]]
- Gameplay: [[GD-0003-squad-players]] ·
  [[GD-0018-ai-narrative-personas-and-dialogue]] ·
  [[GD-0021-player-staff-development-and-decision-influence]] · [[tactics-system]] ·
  [[squad-and-club-structure]] · [[youth-academy-and-development]]
- Feature: [[../20-Features/feature-eos-player-skills-and-people-context]]
- [[README]] - Game Design Log
