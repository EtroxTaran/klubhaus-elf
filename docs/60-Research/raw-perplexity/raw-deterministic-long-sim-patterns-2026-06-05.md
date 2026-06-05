---
title: "RAW Perplexity — Deterministic long-sim volatility & RNG patterns (FMX-89)"
status: raw
tags: [research, raw, perplexity, determinism, rng, long-sim, dynasty, fsm, fmx-89]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../determinism-and-replay]]
---

# RAW — Deterministic, replay-safe long-sim volatility patterns

Verbatim Perplexity (Sonar) capture. Prompt: best practices for keeping a 50-year
save volatile without runaway/stagnation, deterministic structural-event RNG &
replay, event cadence/caps, and archetype-resistance modifiers — from CK3 / Civ /
FM / OOTP / EU and lockstep/replay engines. Captured 2026-06-05 for FMX-89.
**Status: raw** — not implementation authority; the synthesis is
[[../dynasty-board-ownership-bankruptcy-2026-06-05]].

---

The strongest pattern is a **deterministic layered simulation**: separate the **club state machine** from a **slow-moving structural-economy layer** that advances on fixed ticks, uses named RNG streams, and enforces hard cadence caps. Best long-sim games avoid flatline by combining *limited* randomness, *state-dependent pressure*, and *cooldowns/caps*.

## 1) Keeping multi-decade saves alive
**Common anti-stagnation pattern:** don't let success self-reinforce forever; add **structural churn** (succession changes, AI resets, rival emergence, economy shocks, board pressure, management turnover) — *external transition drivers* that periodically perturb otherwise stable entities.
- **Crusader Kings 3:** main anti-snowball = **dynastic fragmentation** via succession/inheritance, breaking up accumulated power in a mostly rule-driven (not pure-random) way; hierarchical/layered rules make the sim resilient over long timelines. Lesson: use **mandatory structural turnover** as a pressure valve, not just probability.
- **Civilization:** counters snowballing with **AI catch-up**, escalating costs, era transitions. Lesson: **progressive friction** — as a club gets richer/more successful, some pathways get harder/slower/more constrained, so success isn't linearly compounding.
- **Football Manager / OOTP:** board pressure, morale, finances, ownership shifts, contract churn, AI club rebuilding keep leagues from ossifying. Even if the same clubs stay elite, the *way* they do changes (different owners/board ambitions/constraints). **Club identity can persist while governance state changes.**
- **Europa Universalis:** limits snowball with coalitions, overextension friction, escalating costs, internal instability — **opposition scales with power**.

**Best-practice catch-up / rubber-band (measured):** power-scaled resistance (stronger clubs face higher instability/scrutiny/takeover risk); dynamic rivals (repeated failers get favourable rebound conditions); structural turnover events (owner changes, board coups, administration, sponsor collapse, stadium debt); **soft catch-up not hard rubber-banding**; constraint resetters (inject a few bounded high-impact events rather than broad stat inflation).
**Volatile vs chaotic guardrails:** **Locality** (shocks mostly affect one club/league/finance network); **Attribution** (events explainable from visible conditions — debt, unrest, poor results); **Bounded severity** (floors/ceilings + recovery paths).

## 2) Determinism & replay
**Named RNG streams:** separate sub-streams per system (`club_perf`, `injuries`, `transfers`, `ownership_events`, `bankruptcy`, `board_ambition`, `narrative_flavor`) so a new event type can't change unrelated sequences; never a single global RNG. **Stable ordering guarantees:** fixed evaluation order — iterate clubs in stable key order; deterministic phase order; never depend on hash-map iteration order or thread timing. Safe loop: 1) advance calendar tick 2) compute candidate events 3) sort candidates by stable keys 4) draw RNG from the relevant named stream 5) apply accepted events in deterministic order. **Seasonal-tick vs continuous:** continuous (cheap) for finances/form/fatigue; **seasonal or monthly** for structural decisions (owners, boards, bankruptcies, ambition) — ownership/admin changes shouldn't feel like per-tick noise and seasonal cadence reduces replay fragility. **Replay-safe scheduling:** generate a candidate schedule from stable state at season start; store *decision inputs + event seed*, not just the outcome; replay recomputes with the same inputs and stream. Strong key pattern: `world_seed`, `save_uuid`, `season_index`, `event_kind`, `entity_id`, `substream_index`. **Adding new event types without desync:** partition streams by **semantic domain, not event count** (ownership draws only from the ownership stream; bankruptcy only from bankruptcy); reserve versioned event tables; include event schema version in the save; avoid order-dependent "draw until success" unless the attempt count is itself deterministic and bounded. Key rule for lockstep/replay: **randomness must be a function of state, tick, and stream name — not incidental execution order**.

## 3) Event cadence & caps
**Hard caps + probabilistic selection:** e.g. one major takeover per club per year; one administration event per club per X months; a global cap on major structural disruptions per league per season. Deterministic structure: check eligibility on a fixed cadence → if eligible compute probability → if RNG passes schedule event → apply cooldown immediately (so even a probability spike can't spam). **Cooldown pattern:** state fields `last_major_owner_change_date`, `last_board_restructure_date`, `last_admin_event_date`; event chance = base × modifiers; cooldown active → chance 0; firing resets cooldown deterministically. **Deterministic "budget" pattern:** assign each club a yearly **instability budget**; one high-severity event consumes most/all of it, minor events less, refills on schedule — volatility without overlapping shocks.

## 4) Archetype-resistance / modifiers
Model archetypes as **modifiers, not exceptions** (no bespoke code path per "stable foundation owner"). Attributes: risk tolerance, capital reserve, patience, competence, intervention frequency, identity rigidity → derive event weights. Example: stable owner → lower takeover probability, lower sacking frequency, lower board volatility, slower ambition escalation; reckless owner → higher debt growth, higher administration risk, higher ambition spikes, higher manager turnover. **Avoid binary archetypes** — use continuous scores (smoother sim, less threshold abuse, more replay-stable tuning). **Interaction modifiers:** event chance depends on combinations — poor results × high impatience; debt × low capital reserve; long underperformance × high ambition; fan unrest × weak legitimacy.

## Concrete FSM pattern
**Two-layer FSM.** Layer 1 club operational state: stable / rebuilding / underperforming / promoted / relegation-threatened / crisis / administration. Layer 2 structural governance state: privately held / activist board / takeover candidate / sale in progress / leveraged ownership / insolvency watch / administration. Each layer: transition on a fixed cadence; read from its own RNG stream; expose cooldowns + eligibility flags; emit events into a deterministic queue. Rule: **state determines which events are possible; events determine how state changes.**

### Citations
[1] https://jessewarden.com/2012/07/finite-state-machines-in-game-development.html
[2] https://shaggydev.com/2021/11/01/state-machines-intro/
[3] https://gameprogrammingpatterns.com/state.html
[4] https://www.youtube.com/watch?v=-ZP2Xm-mY4E
[5] https://blog.littlepolygon.com/posts/fsm/
[6] https://www.youtube.com/watch?v=qzC6ubOYwLQ
[7] https://patricktcoakley.com/tutorials/intro-state-pattern-in-games/
[8] https://discussions.unity.com/t/is-the-state-machine-pattern-suitable-for-every-game-genre/596054
