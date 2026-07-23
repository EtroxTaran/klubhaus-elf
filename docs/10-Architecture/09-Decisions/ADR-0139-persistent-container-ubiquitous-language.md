---
title: ADR-0139 Persistent-container ubiquitous language (Continuum)
status: proposed
tags: [adr, architecture, domain-language, ubiquitous-language, world-lifecycle, fmx-241, fmx-228]
context: [league-orchestration]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-241, FMX-228]
supersedes:
superseded_by:
related:
  - [[../../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0005-save-format]]
  - [[ADR-0007-naming-schema]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../00-Index/Glossary]]
---

# ADR-0139: Persistent-container ubiquitous language (Continuum)

## Status

proposed

Authored `proposed` per the never-self-accept rule
([[../../90-Meta/collaboration-and-decision-protocol|ask-first gate]]). The term
below is the **recommendation** carried for Nico's ratification, not a settled
decision. `binding: false`. First beat of the FMX-228 decision-record review,
run through the Research / Decision loop
([[../../30-Implementation/agent-workflow-pattern]]).

## Context

Nico's decision-record review (FMX-228, thought T31) proposed adopting **"World"**
as new top-level ubiquitous language for a **persistent, continuous container**
that survives across roguelite runs and careers. Grounding (FMX-241, dynamic
research workflow + vault collision scan) found the word **"World" is already taken
twice**, so it cannot be reused without ambiguity:

- **GD-0046** — "two worlds" = the Easy/Pro difficulty **branding** over the
  Quick/Standard/Expert tiers.
- **ADR-0071** — "world" = the **AI-club simulation** context (living in-fiction
  football world + drift).

The scan also found **"universe" is already overloaded ~25× across `docs/`** in two
distinct senses: the **IP-clean fictional CONTENT dataset** (players/clubs) and,
informally, the **save CONTAINER** ("same save universe", late-game-systems.md).

External precedent points at "Universe" for exactly this concept — OOTP (the closest
genre sibling) calls a saved game "one *universe* of baseball"; MMOs call a shard "an
instance of the game universe". So "Universe" is genre-native but, **in this vault**,
adopting it as the formal container forces a rename of the ~10 content-dataset usages
and sits awkwardly in the taken "World" family (a universe *contains* worlds → clashes
with GD-0046's "two worlds"). "Continuum/Kontinuum" and "Chronicle/Chronik" have
**zero** occurrences anywhere in `docs/`.

We therefore need a distinct, unambiguous term for the persistent container, plus a
glossary rule separating it from (a) the Easy/Pro "worlds", (b) the AI-sim "world",
and (c) the fictional-content "universe".

## Decision

Adopt **`Continuum`** (English UI: *Continuum*; German: *Kontinuum*) as the ubiquitous
term for the persistent container.

Rationale: it is the only lead that is **collision-free** in the vault *and*
**semantically exact** — the concept's defining property is that a continuous Season
timeline **persists** when an ephemeral Run/Career ends; `Continuum` names that essence
directly (*Runs come and go on top of one enduring Continuum*). As a bonus it lets
"universe" be cleanly demoted to mean **only** the fictional content dataset, retiring
today's overload instead of deepening it.

### Concept model — a `Continuum` is

1. **Created once** at "new game" as a snapshot of the active master data (rule set,
   club/player baseline) at that moment.
2. **Immutably typed Singleplayer or Multiplayer** — the type is an attribute of the
   container and cannot convert (detailed decision deferred to **FMX-242**).
3. A **continuous timeline of Seasons**; rule/content updates may enter only at season
   boundaries, never mid-season (deferred to **FMX-243 / FMX-244**).
4. Host of **one or many Runs/Careers** (a Run = one manager-and-club lifecycle,
   roguelite or career). A Run ending does **not** end the Continuum (deferred to
   **FMX-245**; player-role identity to **FMX-262**).
5. The **top-level persistence & isolation boundary** — one Continuum ≈ one save
   (aligns with ADR-0027 schema-per-save; this ADR names the seam, it does not change
   ADR-0027).

### Glossary disambiguation rule

- **Continuum** = the persistent container / save-universe (this ADR).
- **fictional dataset** = the IP-clean content of players/clubs (GD-0015 / ADR-0016) —
  *not* a Continuum; the word "universe" is reserved for this content sense only.
- **AI-world simulation** = ADR-0071's in-fiction world dynamics that run *inside* a
  Continuum.
- **Easy/Pro worlds** = GD-0046 difficulty branding — an orthogonal presentation layer.

## Consequences

- New [[../../00-Index/Glossary]] entry for **Continuum** + the disambiguation rule;
  the bounded-context-map is annotated when ownership is assigned (FMX-242).
- Downstream A-cluster issues (FMX-242/243/244/245) and player-role (FMX-262) adopt
  `Continuum` as ubiquitous language.
- Existing informal "same save universe" usages are re-termed **Continuum**; the
  content-dataset "universe" usages stay as-is (now unambiguous).
- No code/data impact in the planning phase — this fixes vocabulary only.

## Alternatives considered

- **Universe / Universum** — genre-native (OOTP) and Nico's instinct. Rejected as the
  default *only* because of the ~25× vault overload + the World-family hierarchy
  tension. **Remains a legitimate Lead-Architect election:** if Nico prefers it, the
  cost is a deliberate rename of the ~10 content-dataset "universe" usages so the term
  is unambiguous.
- **Chronicle / Chronik** — collision-free and evocative, but connotes a backward-looking
  history **log** more than a live container, and risks overlap with the
  Hall-of-Fame/records + narrative domains.
- **Reuse "World"** — rejected: the collision that motivates this ADR.
- **Realm / Saga / Timeline** — Realm reads as a world/place (World-family clash); Saga
  is narrative-skewed; Timeline is generic/technical.

## Open follow-ups (separate issues)

- **FMX-242** — SP/MP Continuum-type immutability & lifecycle/late-join.
- **FMX-243** — emergent season-boundary rule evolution (ADR-0056 tension).
- **FMX-244** — update-routing + season-boundary approval governance.
- **FMX-245** — roguelite club/player persistence within a Continuum.
- **FMX-262** — player-role identity across modes.
