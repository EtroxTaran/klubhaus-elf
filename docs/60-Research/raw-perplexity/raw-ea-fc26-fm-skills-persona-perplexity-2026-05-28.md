---
title: Raw - EA FC 26 / FM Skills, Perks and Persona Research
status: raw
tags: [research, raw, perplexity, player-skills, perks, persona, fmx-23]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-23
sourceType: perplexity
related:
  - [[../eos-player-staff-skills-and-personas-2026-05-28]]
  - [[raw-player-and-staff-values]]
  - [[raw-character-personality-and-dialogue]]
---

# Raw - EA FC 26 / FM Skills, Perks and Persona Research

> Perplexity follow-up run during FMX-23. This is raw input, not
> implementation authority. The synthesis in
> [[../eos-player-staff-skills-and-personas-2026-05-28]] verifies the claims
> against official EA / SI pages where possible and reconciles them with the
> FMX vault.

## Prompt

Research current public information about player skills/perks/playstyles and
persona/trait systems in EA Sports FC 26 Career/Gameplay and Football
Manager/Sports Interactive. Provide a design synthesis for a fictional
offline-ready football manager: how to model player skills/perks separately
from numeric attributes, how staff skills fit, and whether a mixed Big
Five/OCEAN plus football-domain trait model is more future-proof than a pure
football trait model. Include official EA/SI links where possible and mark
recommendations.

## Perplexity output summary

The answer framed EA FC and Football Manager as two related but different
patterns:

- EA FC 26 separates numeric attributes from discrete abilities: PlayStyles,
  PlayStyles+, Archetypes, Specializations and Signature Perks.
- Football Manager separates visible numeric attributes from traits, preferred
  moves, positional suitability, staff attributes and personality labels.
- Recommended player model: numeric attributes as base capability; discrete
  player skills/perks as situational modifiers; behavioral traits/tendencies as
  decision-probability modifiers.
- Recommended staff model: staff attributes plus role specializations plus
  staff perks that work as bounded coaching, scouting, medical or mentoring
  effects.
- Recommended persona model: hidden OCEAN substrate with football-domain traits
  derived for UI, dialogue and simulation language.
- Recommended future-proofing: keep attributes, skills/perks and persona
  separate so each can evolve without rescaling the others.

## Source-quality note

The Perplexity answer mixed official EA pages with community/game-data pages and
video links. FMX should treat the answer as idea input only. The synthesis note
uses official EA and Sports Interactive pages as the primary source layer:

- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- EA SPORTS FC 26 Clubs Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-clubs-deep-dive>
- EA SPORTS FC 26 Gameplay Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive>
- EA SPORTS FC 26 Career feature page:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/features/fc-26-career-mode>
- Football Manager 2024 Touch and Console manual - Players:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/players-r4981/>
- Football Manager 2024 Touch and Console manual - Staff:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/staff-r4982/>

## Related

- [[../eos-player-staff-skills-and-personas-2026-05-28]]
- [[raw-player-and-staff-values]]
- [[raw-character-personality-and-dialogue]]
