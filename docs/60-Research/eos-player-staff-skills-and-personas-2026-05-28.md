---
title: EOS Player, Staff, Skills and Personas - Research Synthesis 2026-05-28
status: draft
tags: [research, player-skills, staff, persona, people, fmx-23]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-23
sourceType: external
related:
  - [[raw-perplexity/raw-player-and-staff-values]]
  - [[raw-perplexity/raw-character-personality-and-dialogue]]
  - [[raw-perplexity/raw-ea-fc26-fm-skills-persona-perplexity-2026-05-28]]
  - [[incoming-design-research-2026-05-27]]
  - [[data-generators]]
  - [[systemic-events-player-development-venue-ops]]
  - [[player-strength-presentation]]
  - [[ai-narrative-runtime-integration]]
  - [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
---

# EOS Player, Staff, Skills and Personas - Research Synthesis 2026-05-28

## Question

How should the raw Player & Staff Values report be promoted into FMX planning
without expanding the already-reconciled 16+4+8 player attribute schema, while
still creating clearer player individuality, perks, staff depth and LLM-ready
persona context?

## Status

This note is the FMX-23 synthesis between raw research and the draft decision
layer:

`raw reports + follow-up research -> this synthesis -> GD-0020 -> ADR-0052 -> future implementation`

It is **not binding**. It records Nico's direction for planning and creates a
traceable draft path for ratification.

## Nico direction captured

- Create a new EOS beat and Linear issue.
- Keep the current **16 visible outfield + 4 GK-only + 8 hidden meta**
  attribute basis.
- Plan the full player/staff/persona system, but make MVP activation
  player-focused: active player skills/perks first, staff skills as target
  model.
- Propose a new **People / Persona & Skills** bounded context instead of
  hiding the model inside Squad, Notification or Manager & Legacy.
- Use a mixed model: OCEAN as hidden internal substrate, football-domain labels
  and relationship states as the visible/usable language.
- Use the model to create clearer individual players and people, especially for
  deterministic dialogue context and later LLM phrasing.
- FMX-3 now expands the MVP narration target to **All Active** actor context:
  staff, board contacts, journalists/media outlets, fan groups/fan reps and
  agents need generated persona/context cards in MVP, even where their skill
  gameplay remains target-model only.

## External source check

| Source | Relevant public pattern | FMX implication |
|---|---|---|
| EA SPORTS FC 26 Career Mode Deep Dive | Player Career uses Archetypes; player identity is shaped through archetype progression and player development. | Market expectation supports visible identity layers beyond raw attributes. |
| EA SPORTS FC 26 Clubs Deep Dive | Archetypes have attribute min/max values, Signature PlayStyles, Specializations and Signature Perks; perks can be action-based, mechanic-based or team-focused. | Keep base attributes and discrete skills/perks separate; allow position/archetype guards and effect hooks. |
| EA SPORTS FC 26 Gameplay Deep Dive | EA explicitly rebalanced attributes vs PlayStyles so high attributes remain meaningful and PlayStyles are an addition, not a requirement. | FMX skills/perks must not become mandatory replacements for attributes. They should be rare situational modifiers with caps. |
| Football Manager / SI Players manual | FM uses 1-20 attributes, attribute combinations, positional competence, scouting ranges and player traits that can be trained. | FMX already follows the 1-20 attribute pattern; traits/tendencies remain separate from skills/perks. |
| Football Manager / SI Staff manual | Staff attributes affect coaching, tactical advice, youth work, scouting, medical reliability and people management. | Staff skills should be modeled as future bounded effects on training/scouting/medical/mentoring, not MVP match powers. |
| Existing FMX D2 / systemic research | FMX has 16+4+8, Impact Lens, mentoring, development formula and hidden-meta reconciliation. | Do not promote the raw report's 20-24 visible attribute recommendation. Promote semantics into skills/persona only. |

## Promotion decision

The raw report's attribute expansion is **not** promoted. The useful promotion
is a separate EOS personhood layer:

```text
Numeric attributes
  -> base football capability, owned by Squad & Player / Training

Player skills and perks
  -> visible, sparse, situational specializations over the attribute contests

Behavioral tendencies
  -> decision tendencies such as shoots from distance or cuts inside

Persona and relationships
  -> hidden OCEAN substrate, football labels, trust/conflict/mentoring graph
     and LLM/template context cards
```

This preserves the existing data model and gives FMX clearer characters.

## Player skills / perks model

Player skills/perks are not attributes, not OVR, and not free bonuses. They are
named, IP-clean specializations that modify existing calculations only inside a
declared context.

Each skill definition should carry:

- `skillId` and IP-clean display label;
- category: scoring, passing, ball-control, defending, physical, goalkeeper,
  leadership, mentoring or utility;
- tier: candidate default is `skill` and `mastery`;
- allowed role/position groups;
- unlock prerequisites: attributes, age band, training path, match evidence,
  mentoring evidence and hidden-meta fit;
- activation context: event/action, pitch zone, phase, pressure state and role;
- effect envelope: bounded multiplier/range over an existing calculation;
- downside or risk where appropriate;
- UI tier exposure: Quick / Standard / Expert;
- multiplayer normalization rule;
- source/inspiration note to avoid copying competitor names or iconography.

MVP design should include a small player-only catalog, enough to validate:

- match snapshot consumption;
- training/mentoring acquisition;
- player-card readability;
- narrative/context effects.

Exact catalog names and effect values remain playtest-tunable and require Nico
approval before implementation.

## Staff skills target model

Staff skills are modeled now so the domain language does not need to be
rewritten later, but they are not active MVP match gameplay unless Nico expands
scope.

Target staff skill categories:

- coaching specialization: technical, tactical, set-piece, goalkeeping,
  fitness, mental;
- development specialization: youth, late bloomer, role conversion, skill
  acquisition;
- scouting specialization: current ability, potential, data, region, role fit;
- medical specialization: diagnosis, rehab, sports science, risk prevention;
- people specialization: motivation, discipline, conflict, mentoring,
  adaptation.

Staff skills must apply through the owning domain:

- Training applies training and development effects.
- Squad & Player applies player state and mentorship outcomes.
- Transfer/Scouting applies scouting confidence and recommendation quality.
- Medical/training notes apply injury and rehab effects.
- People owns persona and relationship interpretation.

## Mixed OCEAN + football-domain trait model

The best future-proof setup is mixed, not pure football traits.

OCEAN is internal infrastructure:

- openness;
- conscientiousness;
- extraversion;
- agreeableness;
- neuroticism / emotional stability.

It is **not** shown directly and does **not** replace the 8 hidden player meta
attributes. It is a substrate for personhood, dialogue, relationship behavior
and long-term consistency. Player-facing and designer-facing language stays
football-specific:

- professional, ambitious, volatile, loyal, demanding, relaxed;
- leader, mentor, loner, clique-builder, media-friendly, conflict-prone;
- adapts quickly, needs trust, performs under pressure, rejects criticism.

For players, OCEAN should be initialized from the existing hidden meta and
generation archetype. For staff, board, journalists and fan reps it can be
generated from role archetypes. This gives all people consistent behavior while
keeping football mechanics grounded in current domain facts.

## Relationship constellations

The People model should create constellations, not just isolated labels.

Core relationship edges:

- trust / distrust;
- influence;
- mentorship;
- rivalry;
- respect;
- role competition;
- cultural/language affinity;
- media pressure;
- board alignment;
- fan affinity.

Edges have provenance: which event, conversation, match, training block or
club decision changed them. This lets dialogue cards explain why a player is
angry, why a mentor relationship matters, or why a journalist frames a story
aggressively without letting prose invent facts.

## LLM / template context

FMX should generate structured context cards before any optional runtime LLM:

- actor identity and visible label;
- stable persona vector summary;
- current emotional/social state;
- relationship edges relevant to the scene;
- recent authoritative facts;
- allowed intents;
- forbidden claims;
- template fallback key.

The context card is deterministic simulation output. Generated prose is
presentation only and remains governed by
[[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## FMX-3 narration expansion

The original FMX-23 synthesis kept MVP activation player-focused for mechanical
skills. That still holds for skill gameplay. The FMX-3 narration expansion
changes the context-card activation target:

- player skill/perk gameplay remains the first active mechanical slice;
- staff skills remain target gameplay unless separately ratified;
- staff, board, journalist, media, fan-group, fan-rep and agent personas are
  active MVP narration inputs;
- People may own persona and relationship interpretation for those actors, but
  owning domains keep the facts: Fan Ecology for fan state, Club/Governance for
  board decisions, Transfer/Contracts for agents and Narrative/Notification for
  message delivery.

## Open decisions

- Final player skill catalog and MVP subset.
- Exact `skill` / `mastery` tier names and UI wording.
- Whether staff skills have visible cards in MVP or remain internal research.
- Exact OCEAN scale and storage shape.
- Whether OCEAN may ever directly affect mechanics, or only derived football
  labels and relationship policies.
- Relationship graph thresholds and decay rules.
- Actor counts per world size for media outlets, journalists, fan groups, fan
  reps and agents.

## Source links

- EA SPORTS FC 26 Career feature page:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/features/fc-26-career-mode>
- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- EA SPORTS FC 26 Clubs Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-clubs-deep-dive>
- EA SPORTS FC 26 Gameplay Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive>
- EA SPORTS FC 26 Gameplay feature page:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/features/fc-26-gameplay>
- Football Manager 2024 Touch and Console manual - Players:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/players-r4981/>
- Football Manager 2024 Touch and Console manual - Staff:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/staff-r4982/>

## Related

- Raw inputs: [[raw-perplexity/raw-player-and-staff-values]] ·
  [[raw-perplexity/raw-character-personality-and-dialogue]] ·
  [[raw-perplexity/raw-ea-fc26-fm-skills-persona-perplexity-2026-05-28]]
- Existing foundations: [[data-generators]] ·
  [[systemic-events-player-development-venue-ops]] ·
  [[player-strength-presentation]] · [[ai-narrative-runtime-integration]] ·
  [[ai-narration-world-and-dialogue-mvp-2026-05-28]]
- Game design: [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] ·
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- Feature: [[../20-Features/feature-eos-player-skills-and-people-context]] ·
  [[../20-Features/feature-ai-narration-mvp-pillar]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
