---
title: "RAW — Surfacing statistical confidence to players + starting-resource perk balance risk"
status: raw
tags: [research, raw, perplexity, ui-ux, confidence, uncertainty, perks, balance, fmx-93]
created: 2026-06-05
updated: 2026-06-05
type: research
related: [[../manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]]
---

# RAW Perplexity capture — Confidence surfacing + start-perk balance (FMX-93)

> Unprocessed transcript. Synthesised into
> [[../manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]]. Do not implement from raw.
> Captured 2026-06-05 (Sonar). Citations are the model's own.

## Prompt

Two game-UX/design questions. (1) Best practice for surfacing STATISTICAL CONFIDENCE or uncertainty of
a derived metric to players without overwhelming them: raw numeric scalar vs qualitative banded labels
vs star ratings? How do games like Football Manager (scout knowledge/confidence ranges, attribute star
ratings with uncertainty) communicate small-sample unreliability? Cover progressive disclosure across
simple-vs-expert UI tiers. (2) In management and roguelite games, what is the balance risk of
META-PROGRESSION PERKS that grant STARTING RESOURCES (money, stronger squad, prebuilt infrastructure)
versus variety/options or challenge perks? Why are direct starting-economy boosts dangerous to
early-game tension, and what caps/counterweights (prestige, harder difficulty) do designers use?

## Response (key points)

### 1. Communicating uncertainty of derived metrics

- **Raw numeric confidence is usually a poor PRIMARY surface.** People misinterpret confidence
  levels/intervals; the value is "how much weight to give a metric", not the exact %. "63% confidence"
  doesn't convey *which way* it's wrong or the spread, and invites false precision. Most players think
  "probably right / might be off / total guess". Numeric confidence is a useful **expert-tier detail**,
  not the primary surface. [2][4][5]
- **Football Manager patterns:** **visible ranges** when knowledge is low (attribute shows "10–14" or
  "5–15"; *width = uncertainty*); **scout knowledge bars / familiarity icons**; **textual descriptors**
  ("our knowledge of this player is limited"); **star ratings with fuzziness** (ghost stars that
  stabilise as knowledge rises). All **qualitative indicators tied to gameplay concepts**, not stats
  jargon.
- **Other sim patterns:** unknown/hidden stats that unlock over time ("?"); confidence adjectives
  ("Estimated value £4–6M (low confidence)"); color-coded reliability (green/yellow/red); explicit
  sample-size cues ("stats from last 3 matches only").
- **Comparison:** numeric scalar (0–1, %) → good for expert/analytics views as **secondary detail**;
  qualitative **banded labels** ("Speculative/Emerging/Reliable/Established", **3–4 bands max**) → low
  cognitive load, maps to "do I trust this enough to act?"; star ratings → familiar, compress
  quality+uncertainty but can hide direction of error.
- **Progressive disclosure:**
  - **Tier 1 (default/simple):** best-guess value + clear uncertainty affordance; **bands/labels not
    numbers** ("Limited data" / "Well-scouted" / "Projection"); lightweight hints ("based on few games").
  - **Tier 2 (advanced tooltip):** displayed range, sample-size proxy, qualitative band; tiny spread bar.
  - **Tier 3 (expert/analytics):** explicit intervals, technical wording, optional numeric confidence
    score — presented as "expected range" not raw jargon. [4][5]

### 2. Meta-progression: starting resources vs variety/challenge

- **Why starting-economy boosts are risky:** early tension comes from **scarcity and tight
  constraints** (interesting trade-offs, forced exploration, skill expressed via navigating scarcity).
  Starting money/squad/infrastructure perks risk: (1) **collapsing early tension** (skip the "can I
  survive the first hump?" drama; runs go on rails); (2) **skewing the difficulty curve** (trivial
  first act); (3) **runaway snowballing** (extra early capital compounds over the whole run → strictly
  dominant upgrades); (4) **undermining procedural variety** (same opening every run). They attack the
  foundational pressure that gives each run drama and learning.
- **Safer meta-progression types:** new options/build paths; **sidegrades/trade-offs** ("extra money
  but lower reputation"); **challenge modifiers** (heat/ascension/prestige); QoL/information (better
  tooltips, foresight). These preserve early friction while adding depth.
- **Caps/counterweights for resource perks:** (1) **hard caps + diminishing returns** (only 1–2 tiers
  above baseline; nonlinear stacking); (2) **pair boosts with increased difficulty** (treat as
  self-selected difficulty sliders — more start money ⇒ tougher opponents/upkeep/fewer rewards);
  (3) **make them conditional/fragile** (high-upkeep building; strong but ageing/unhappy squad);
  (4) **time-limited / non-compounding** ("free wages first 5 matches"; non-stackable, one per run);
  (5) **tie strong boosts to prestige loops** (gated behind a completion/ascension rank that also
  exposes higher difficulty layers).
- **Practical recommendation:** use starting-resource boosts **sparingly**, capped, stackable-limited,
  and counterweighted; prefer **variety/challenge** meta over pure early power; gate any strong boost
  behind **prestige + harder difficulty** so trivialising early difficulty comes bundled with new
  tension.

Citations:
[1] https://goleansixsigma.com/win-confidence-game/
[2] https://ixdf.org/literature/article/confidence-intervals-and-ux-research
[3] https://measuringu.com/ux-lite-sample-sizes-for-confidence-intervals/
[4] https://www.nngroup.com/articles/confidence-interval/
[5] https://www.youtube.com/watch?v=WDPPT6HrO0Q
[6] https://uxplanet.org/game-design-ux-best-practices-the-ultimate-guide-4a3078c32099
