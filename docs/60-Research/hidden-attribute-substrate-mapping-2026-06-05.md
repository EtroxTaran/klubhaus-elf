---
title: Hidden-attribute substrate mapping (8-meta / OCEAN → labels) — synthesis (FMX-86)
status: draft
tags: [research, persona, ocean, player-skills, scouting, mentoring, determinism, game-design, ddd, fmx-86, gap-g22]
created: 2026-06-05
updated: 2026-06-05
type: research
related:
  - [[raw-perplexity/raw-hidden-attribute-substrate-mapping-2026-06-05]]
  - [[eos-player-staff-skills-and-personas-2026-05-28]]
  - [[player-strength-presentation]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
---

# Hidden-attribute substrate mapping (8-meta / OCEAN → labels) — synthesis (FMX-86, gap G22)

Grounds the FMX-86 GDDR ([[../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]):
the deterministic meta/OCEAN → football-label derivation, the reveal owner, the mentoring
owner, and OCEAN persistence. Raw capture:
[[raw-perplexity/raw-hidden-attribute-substrate-mapping-2026-06-05]] (4 prompts: OCEAN→label
+ FM personality system; scouting-gated reveal & bands; persist-vs-derive personality vector;
single-composite vs multi-tag labels).

## 1. What the vault already locks (the fixed frame)

- **GD-0020 (draft, binding direction):** "Keep 16+4+8" — 8 hidden meta on 1–20:
  **Potential, Consistency, Pressure, Professionalism, Determination, Adaptability,
  Injury-Proneness, Big-Matches**. **OCEAN is internal substrate** (O,C,E,A,N), "not shown
  directly". **Football-language labels are the surface** (professional, volatile, leader,
  mentor, loner, media-savvy, demanding, homesick, adaptable). Skill acquisition requires
  "hidden meta / persona fit does not contradict it". Open: OCEAN persisted-vs-derived (line
  ~239); meta/OCEAN→label derivation, reveal owner, mentoring owner.
- **ADR-0052 (draft) People context:** owns "internal persona substrate, including OCEAN
  vector and **derived football-domain labels**" + "social interpretation policies for
  mentoring, trust, conflict and media framing"; "OCEAN values are internal and never
  exposed directly … without derivation". Does NOT own numeric attributes/training/match.
- **ADR-0064 (proposed) Scouting Activity:** "Hidden flags = **Scouting gates the reveal,
  owners keep the truth**." `HiddenFlagRevealLedger` stores **reveal-state only** keyed to
  knowledge%; truth read from People/Squad via query/event, **no cross-context join**;
  emits `HiddenFlagSurfaced`. Flags: injury-proneness, big-match temperament, professionalism,
  adaptability, ambition.
- **GD-0021 (draft) factor matrix:** Mentoring relationship — Owner = **People (draft) +
  Training/Squad facts**, Consumer = **Squad & Player, Training**, influence = "slow
  hidden-meta/tendency influence", phase = MVP hook. Numeric model gated on Nico's
  staff-skill option.
- **GD-0006 (approved/binding):** "Risk surfaced as **ranges, not point estimates**" — the
  reveal UX must use bands.
- **GD-0018 / GD-0015:** dialogue is intent-based and consumes persona cards (labels, allowed
  intents, forbidden claims) but does not own persona; all label vocabulary must be IP-clean.

## 2. Evidence highlights (see raw for sources)

- **OCEAN → label is well-grounded** (sport-psych): professional ← ↑Conscientiousness+↓Neuroticism;
  volatile/temperamental ← ↑Neuroticism+↓Agreeableness; leader ← ↑Extraversion+↑Conscientiousness;
  mentor ← ↑Agreeableness+↑Conscientiousness; adaptable ← ↑Openness; homesick ← ↑Neuroticism+↓Openness+↓Extraversion;
  loner ← ↓Extraversion; media-savvy ← ↑Extraversion+↑Agreeableness; demanding/ambitious ← ↑Conscientiousness(±↓Agreeableness); loyal ← ↑Agreeableness.
- **FM's actual system** (reverse-engineered): one composite **Personality** word (elite
  high-value buckets checked first, then fall-through to neutral) + a separate **Media
  Handling Style** + coexisting **Player Traits**. Confirms "derive a few core axes from the
  substrate, then assign labels by pattern".
- **Scouting reveal** (FM/OOTP/NBA 2K): knowledge gate → attributes shown as **bands that
  narrow** (hidden → estimated range → effectively known); star ratings are opinion ranges;
  reports expire & re-scout. Bands beat point estimates for fairness, perceived-randomness
  reduction, meaningful scouting and easier balancing.
- **Persist vs derive** (deterministic sims + event-sourcing): **derive at creation, persist
  thereafter** (snapshot). Derive-only breaks replay once the formula evolves or the vector
  drifts (mentoring/aging); a 5-float vector is negligible save size; persisting decouples
  old saves from future formula changes. Pattern = derive-then-persist (eager, or lazy on
  first mutation).
- **Label model** (FM single-composite vs CK3/RimWorld multi-tag): multi-tag with
  **mutually-exclusive axes** is the only model that shows "leader AND volatile AND homesick"
  simultaneously while preventing contradictions (CK3 Brave↔Craven, RimWorld Volatile↔Steadfast).
  ≤1 tag per axis; orthogonal axes coexist; cap visible count.

## 3. Inputs for decisions (D1–D4)

- **D1 OCEAN persistence → Persist as state.** Best practice for replay-safe sims + drift via
  mentoring/aging + formula evolution all point to derive-at-gen → persist → mutate-in-place;
  keep seed+meta for provenance. (Lazy-on-first-mutation is an equivalent optimisation, not
  worth the per-actor state-machine complexity at design tier.)
- **D2 Reveal owner → Scouting gates, People derives.** ADR-0064 already owns the
  confidence-gated reveal; reusing its `HiddenFlagRevealLedger` for ALL hidden persona signals
  (flags + labels) avoids a second source of truth. People derives the label (truth);
  Squad & Player presents an estimated **band** read-model (GD-0006 binding). No join.
- **D3 Mentoring owner → Split (People policy + Training compute).** Matches ADR-0052 (People
  = social/mentoring policy) AND GD-0021 (Training/Squad = development). People owns the
  relationship + eligibility + persona-fit; Training owns the development-outcome computation;
  numeric model deferred to GD-0021. Proceed as draft now; do not block on ADR-0052 ratify.
- **D4 Label model → Multi-label + exclusion axes.** Faithful to GD-0020's coexisting surface
  set; CK3/RimWorld practice. ≤1 label per orthogonal axis + orthogonal flags; cap ~2–3 on
  list views; exact thresholds + visible-count = calibration.

## 4. Future-scope notes (classified future-scope / calibration)

- Numeric thresholds for every axis tier + flag, knowledge% reveal bands per signal, label
  visible-count cap, multi-label display priority → **calibration (FMX-52 style)**.
- Cross-cultural OCEAN→label validity (non-Top-5 leagues) → reserve for world-expansion.
- Mentoring numeric weights/decay → **GD-0021** (not this note).
- Neuroticism modulation during loss streaks / form (dynamic label shifts) → calibration.
