---
title: Raw Perplexity - AI World Persona Generation 2026-05-28
status: raw
tags: [research, raw, perplexity, worldgen, persona, media, fans, staff, players]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../data-generators]]
  - [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
---

# Raw Perplexity - AI World Persona Generation 2026-05-28

## Prompt

Research how to generate a complete fictional football manager world for MVP
narration: players, staff, board, journalists/media outlets, fan groups/fan
reps, psychological/persona profiles, values, relationship graph, and
season-long story context. Focus on patterns that are deterministic, IP-clean,
testable, and LLM-ready without letting the LLM invent facts. Return
recommended fields/taxonomies, gaps needing more research, and sources.

## Raw findings

- Model the world as a closed, schema-first system. Every entity, relationship
  and season event should come from deterministic generators or authoritative
  domain events, not free-form LLM invention.
- Use a common actor/entity layer with type-specific profiles for `player`,
  `staff`, `board_contact`, `journalist`, `media_outlet`, `fan_group`,
  `fan_rep`, `agent`, `club`, `competition` and `event`.
- Recommended actor fields: stable opaque ID, entity type, generated canonical
  name, aliases/nicknames, region/nationality, role subtype, availability/status,
  tenure/contract, generated-version provenance and lock flag.
- Player narrative profile should add style tags, personality labels,
  development state, risk flags, career arc and narrative hooks on top of the
  existing football attribute model.
- Staff profile should separate numeric capability, function, expertise domain,
  working style, authority level and football philosophy.
- Board profile should represent policy and tolerance: ownership model,
  objective priority weights, risk tolerance, manager-evaluation thresholds and
  intervention style.
- Media should be a network, not a single sender. Separate outlet fields
  (scope, reach, cadence, reliability, sensationalism, audience) from journalist
  fields (beat, tone, stance, fairness, agenda, relationship to club/manager).
- Fan groups should be structured actor overlays on top of fan segments: group
  type, size band, intensity, identity, red lines, mobilization style,
  representative role and sentiment state.
- Persona can combine stable scores, football-domain labels, values,
  motivators, conflict style, stress response and behavioral triggers.
- The relationship graph should be typed, directed and provenance-backed.
  Examples: `trusts`, `criticizes`, `mentors`, `rivals`, `backs`, `represents`,
  `reported_by`, `supports`, `aligned_with`.
- Season-long context should be state-machine based: preseason expectations,
  early-season reaction, turning points, winter window, run-in and postseason
  appraisal.
- The strongest pattern remains two-layer: deterministic simulation/world
  generation first; narration engine consumes only structured state and cannot
  create entities or facts.

## Evidence quality

This Perplexity run returned useful patterns but weak source grounding for
football-manager-specific internals. Treat the taxonomy as design input, not
external proof. The synthesis cross-checks it against existing FMX research,
official OpenRouter docs, EU/OWASP/NIST sources, and the Generative Agents paper.

## Source links returned

- Football Manager feature overview:
  <https://www.footballmanager.com/features/more-gameplay-deep-dives>
- ESPN on Football Manager cult-player narratives:
  <https://www.espn.com/soccer/story/_/id/37579117/who-makes-all-football-manager-cult-xi>
- Generative Agents paper used in synthesis:
  <https://arxiv.org/abs/2304.03442>

## Handling

This raw note is not authoritative. Promoted conclusions live in
[[../ai-narration-world-and-dialogue-mvp-2026-05-28]],
[[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
[[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] and
[[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]].

## Related

- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../eos-player-staff-skills-and-personas-2026-05-28]]
- [[../data-generators]]
- [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
