---
title: "raw: People / persona-skills bounded context — DDD + sim precedent"
status: draft
tags: [research, raw, perplexity, exa, people, persona, ddd, bounded-context, fmx-23]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[../people-persona-skills-bounded-context-2026-06-07]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
---

# raw: People / Persona & Skills — DDD bounded-context + game-sim precedent

Raw capture (Perplexity Sonar + Exa web search), 2026-06-07. Distilled in
[[../people-persona-skills-bounded-context-2026-06-07]].

## Perplexity — DDD: own context vs entity-per-context for cross-cutting personhood

Key claims (paraphrased):

- **Avoid a single generic "Person god-context."** Fowler's *Analysis Patterns* / Arlow &
  Neustadt *Enterprise Patterns* **Party/Person archetype** is an *analysis-level* abstraction
  (shared vocabulary), **not** an implementation context. Implemented literally it accretes every
  attribute used anywhere → highly coupled, **anemic** model owned by no one.
- **Evans/Vernon options** for a concept referenced everywhere: (a) **separate contexts** referencing
  by id + **published language**; (b) a **tiny shared kernel** of *identity only* (`PersonId`, legal
  name, DOB) under joint governance; (c) **published-language/conformist**. Never put
  *behaviour/personality/skill* in a shared kernel — it differs in meaning per context and changes
  fast.
- **A relationship graph + personality substrate (OCEAN) that feeds dialogue/mentoring strongly
  resembles a dedicated "profile/scoring/affinity context"** — the same pattern as credit-scoring,
  recommendation, matchmaking. It **consumes events** from many contexts, owns its **own model**
  (graph edges, trait profiles, derived scores: chemistry, trust, influence), and **exposes
  queries/events**. It references persons by `PersonId`; it does **not** own Player/Coach/Journalist
  as domain objects.
- **OCEAN lives *inside* that profile context** as its domain language; other contexts consume
  derived results ("MotivationStyle", "PreferredTone"), not the mechanism.
- **Split heuristics (multiple "yes" ⇒ own context):** distinct purpose/value; own invariants that
  must hold together; **language/meaning drift** of the same word across contexts ("relationship" =
  social tie vs legal contract); **high/independent rate of change** (scoring algorithms iterate
  fast); **multiple teams depend but need autonomy**; integrate via **ids + published language**, not
  shared objects.

Sources: reintech.io cross-cutting-concerns-in-DDD; virtualddd.com/ddd-heuristics; milanjovanovic.tech
clean-architecture cross-cutting; jamesmichaelhickey.com "I see users everywhere"; no-kill-switch DDD
critique; "bounded context design" talk (youtube FKnblOiUc5M).

## Exa — game-sim precedent for centralized personality + relationship graph

- **Talk of the Town / "Social Physics" (ICIDS'22, kmjn.org):** Big-Five personality drives character
  decision-making; **relationships are best represented as a graph** (characters = nodes, relationships
  = edges holding objective facts + subjective feelings + valence). Relationships computed over time as
  a function of **personality compatibility**.
- **Crusader Kings II/III (Paradox wikis + Middle-Ages-in-Modern-Games):** the **Opinion System** —
  one directional value per character pair derived from **traits + past social exchanges** — is "at the
  core of how characters make decisions." CK3 **AI Personality** = Boldness/Greed/Rationality/Compassion/
  Sociability (a Big-Five-shaped vector) driving behaviour; relations have types×levels with large
  behavioural impact.
- **Football Manager (SteinkelssonFM):** every player has a **generated personality** derived from
  Determination + Leadership + 7 hidden attributes (Professionalism, Pressure, Ambition, Sportsmanship,
  Temperament, Loyalty, Controversy), gauged via scouting/interactions; **mentoring** depends on a mix
  of strong personalities across squad + backroom — i.e. a relationship/influence model.

## Takeaway for ADR-0052

The evidence **supports a dedicated People context, but explicitly framed as a profile/relationship/
scoring context, not an identity registry** — which is exactly how ADR-0052 already scopes it (identity
stays minimal; football/economy facts stay with their owners). The remaining open calls are
**granularity** (own BC vs sub-aggregate of an existing context) and **MVP scope** (full vs minimal
persona-card slice).
