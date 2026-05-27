---
title: Core Club-Simulation Systems and Feedback Loops
status: in-review
tags: [research, systems, gameplay, synthesis, wave-2]
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related:
  - [[raw-perplexity/raw-systems-design]]
  - [[../50-Game-Design/system-interplay]]
  - [[../50-Game-Design/club-dna-and-governance]]
  - [[../50-Game-Design/economy-system]]
  - [[fan-culture-segmentation-research]]
---

# Core Club-Simulation Systems and Feedback Loops

This note distils ~1 200 lines of Perplexity output (Doc 2 §1082-2282, raw at
[[raw-perplexity/raw-systems-design]]) into the seven club-simulation pillars
that all of `50-Game-Design/` is built on. Each pillar links to the per-system
game-design note that owns its detail.

## 1. Seven pillars

1. **[[../50-Game-Design/club-dna-and-governance|Club Identity & Governance]]**
   - board, mission, philosophy, club size, expectation profile.
2. **[[../50-Game-Design/economy-system|Finance & Economy]]** - cash-flow,
   budget pots, sponsoring, match-day, debt, liquidity.
3. **[[../50-Game-Design/stadium-and-campus|Infrastructure & Stadium]]** -
   capacity, hospitality, catering, training and academy buildings.
4. **[[../50-Game-Design/fan-ecology|Fan & Brand Ecosystem]]** - core fans,
   ultras, families, away fans, image, atmosphere.
5. **[[../50-Game-Design/squad-and-club-structure|Sporting Core]]** - squad,
   staff, scouting, medicine, training, youth, transfers.
6. **[[../50-Game-Design/tactics-system|Tactics & Match System]]** -
   formation, roles, pressing, set pieces, morale, match events.
7. **[[../50-Game-Design/core-loop|Time & Competition Structure]]** - weekly
   rhythm, transfer window, match-days, injuries, development.

## 2. Cascade principle

> Every decision produces state in other systems.

Pressing tactic → fatigue ↑ → injuries ↑ → rotation forced → morale drops →
results worsen → board pressure ↑.

Design implication: **No system may be implemented in isolation.** Every
mechanic that changes a stat must declare which other systems read that
stat.

## 3. Five master feedback loops

### Loop 1: Fans → Atmosphere → Sport → Marketing

Better mood ↑ home advantage + match-day appeal. Success ↑ bonding,
utilisation, merch. Those ↑ sponsor value + match-day revenue. Money funds
squad + infrastructure.

### Loop 2: Infrastructure → Development → Squad Value → Finance

Better academy / training / medicine ↑ player quality + availability.
Lower external transfer cost. Home-grown values ↑, sales fund growth.

### Loop 3: Sponsors → Stadium → Experience → Sponsors

More hospitality / fan-zone / digital surfaces ↑ sponsor inventory.
Strong partners fund further expansion. Better experience ↑ dwell time
and per-visitor revenue.

### Loop 4: Tactics → Squad Need → Recruitment → Tactics

Play model defines roles. Scouting targets sharper. Right profiles ↑
familiarity speed. Execution ↑ performance, validating the model.

### Loop 5: Risk → Debt → Pressure → Decisions

Over-aggressive investment ↓ liquidity + wage ratio. Sporting failure ↑
pressure. Manager makes panic transfers / sells icons. Fans + board
react. Drama emerges. **This loop is the engine of the roguelite mode.**

## 4. Differentiators against FM and Anstoss

Three concepts the research flags as "no other genre product really has it":

1. **Club-DNA system** - measurable identity on 5-7 axes (size, tradition,
   region, board profile, philosophy, debt, brand). Drives board + fans
   + sponsors weighting, so each club rates the same manager differently.
2. **Stadium atmosphere as a match-engine parameter** - standing-room mix,
   beer stands, fan-sector composition affect home advantage and morale
   curves directly, not as cosmetics.
3. **Roguelite carries** - permanent small unlocks across runs make
   permadeath motivating instead of punitive. See [[mode-design-research]].

## 5. Version detail ladder (verbatim)

| Version | Adds |
|---|---|
| V1 - Singleplayer Core | Cash-flow finance, stadium + catering + VIP + fan zone, fan segments + atmosphere + home advantage, squad + scouting + youth + training + injuries, tactics with roles + phases + set pieces, 2D event-based match engine with clear stats |
| V2 - Deeper club sim | Governance + board dynamics + media image, sponsor inventory at asset level, expanded staff inter-dependency, non-match-day revenue + museum + tours, refined personality + mentoring |
| V3 - Async multiplayer | Private leagues with fixed match-day windows, async management phases, sync transfer negotiations between managers, group-internal market + rivalry dynamics, social layer (messages, provocation, deals, prestige) |

## 6. Source citations (new URLs)

All retrieved 2026-05-16 via Perplexity.

- Deloitte Football Money League - [deloitte.com/uk football money league](https://www.deloitte.com/uk/en/services/consulting-financial/analysis/deloitte-football-money-league.html)
- FCB Innovation Hub on stadium revenue - [barcainnovationhub stadium revenue](https://barcainnovationhub.fcbarcelona.com/blog/the-income-generation-lines-of-a-stadium/)
- European Leagues financial landscape - [europeanleagues.com financial-landscape report](https://europeanleagues.com/wp-content/uploads/REPORT-THE-FINANCIAL-LANDSCAPE-OF-EUROPEAN-FOOTBALL.pdf)
- Pioneer Group on fan zones - [pioneergroup.co.uk fan-zones article](https://pioneergroup.co.uk/the-rise-of-fan-zones-a-winning-strategy-for-football-clubs/)
- Stadium Business Strategies (social football summit) - [socialfootballsummit.com matchday](https://www.socialfootballsummit.com/en/stadium-business-strategies-to-optimize-matchday-revenues/)
- football-benchmark match-day differentiator - [Facebook footballbenchmark](https://www.facebook.com/footballbenchmark/posts/matchday-revenue-remains-a-key-differentiator-at-the-top-end-of-european-footbal/1324614669707119/)
- FM Scout confidence reference - [fmscout.com/confidence](https://www.fmscout.com/confidence.htm)
- footballmanager.com supporter confidence feature - [footballmanager.com features/supporter-confidence](https://www.footballmanager.com/features/supporter-confidence)
- Sport science: home-advantage atmospherics - [sage 1527002516665794](https://journals.sagepub.com/doi/10.1177/1527002516665794)
- Set pieces analytics - [expectinggoals.com set-piece prediction](https://www.expectinggoals.com/p/predicting-set-piece-goals-and-assists)
- Match-engine event-based explanation - [Reddit how-does-match-engine-work](https://www.reddit.com/r/footballmanagergames/comments/1bpdest/how_does_the_match_engine_work_what_is_the/)
## Related

- [[raw-perplexity/raw-systems-design]]
- [[../50-Game-Design/system-interplay]]
- [[../50-Game-Design/club-dna-and-governance]]
- [[../50-Game-Design/economy-system]]
- [[fan-culture-segmentation-research]]
