---
title: People / Persona & Skills bounded context — grounding + recommendation
status: draft
tags: [research, people, persona, player-skills, ddd, bounded-context, fmx-23]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[raw-perplexity/raw-people-persona-bounded-context-2026-06-07]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[eos-player-staff-skills-and-personas-2026-05-28]]
  - [[../10-Architecture/bounded-context-map]]
---

# People / Persona & Skills — grounding + recommendation

Closes the open decision on **ADR-0052** (drafted but never put to a Nico choice). Grounded
in [[raw-perplexity/raw-people-persona-bounded-context-2026-06-07]] (DDD literature + game-sim
precedent).

## Problem

Save-scope *personhood* — players, staff, board, journalists, agents, fan reps — plus a
**relationship graph**, a **personality substrate** (OCEAN → football labels, per GD-0027) and
**visible skill/perk profiles** cut across Squad & Player, Training, Match, Transfer, Club, Audience.
No existing context cleanly owns it. Two things are undecided: **(D1) granularity** — own bounded
context vs sub-aggregate of an existing one; **(D2) MVP scope** — full People context now vs a
minimal persona-card slice.

## What best practice says

- **Do not build a generic "Person god-context."** The Fowler/Arlow Party/Person archetype is an
  *analysis* abstraction; implemented literally it becomes an anemic, maximally-coupled model owned by
  no one. Keep **identity minimal** (`PersonId` + a few canonical facts) and keep football/economy
  facts in their current owners.
- **A personality + relationship-graph + scoring concern is a textbook dedicated context** — the same
  shape as credit-scoring / recommendation / affinity contexts: it *consumes* facts from many
  contexts, owns its **own invariants and fast-changing model** (trait vectors, graph edges, derived
  chemistry/trust/influence), and *exposes* read models + events, referencing persons by id only.
- **Split heuristics all fire for this concern:** distinct purpose; own invariants; **meaning drift**
  ("relationship" social vs contractual; "player" squad-eligibility vs persona); **high/independent
  rate of change** (persona/skill scoring iterates fast and shouldn't ripple into Match/Training);
  multiple consumers needing autonomy. Multiple "yes" ⇒ own context.
- **Sim precedent converges on the same architecture:** CK2/CK3 centralise an **Opinion System**
  (trait + history → directional pair value) that *drives* AI decisions; Talk-of-the-Town models
  Big-Five + a **relationship graph**; FM derives personalities from hidden attributes feeding
  mentoring/dressing-room. In every case the personality+relationship substrate is a **central
  decision-input layer**, not duplicated per subsystem.

## Recommendation

- **D1 = own bounded context** (ratify ADR-0052 as drafted), but with the **framing tightened to a
  "profile / relationship / scoring" context**, explicitly *not* an identity registry and *not* an
  owner of football facts. This is the best-practice landing and matches ADR-0052's existing "does not
  own" list. A sub-aggregate inside Squad & Player was the runner-up but fails the meaning-drift and
  rate-of-change tests and would overload Squad with media/board/journalist persona.
- **D2 = full context boundary now, MVP-thin slice behind it.** Ratify the *boundary + contracts*
  now (so Staff Operations/Narrative/Scouting can depend on stable People queries), but ship only the
  **persona substrate + player skill profile + `DialogueContextCard`** in MVP; staff skill depth, the
  full relationship graph and advanced scoring are reserved-stub behind `peopleModelVersion` (FMX-52
  calibration for magnitudes). This avoids a big-bang while locking the boundary the other contexts
  already assume.

Determinism/LLM rules already in ADR-0052 (snapshot at lineup-lock; OCEAN never surfaced raw; cards
are structured facts only; runtime LLM presentation-only per ADR-0030) stay as-is.

## Open follow-ups (not blockers)

- Staff skill/perk gameplay depth needs a follow-up GDDR before active use (already noted in 0052).
- Coordinates with GD-0027 (hidden-attribute substrate, Nico-decided 2026-06-05): People owns the
  OCEAN→label derivation truth; Scouting gates reveal; Training owns mentoring compute.
