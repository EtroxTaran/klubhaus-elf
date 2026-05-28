---
title: Raw Perplexity - Cup and Competition Revenue Profiles 2026-05-28
status: raw
tags: [research, raw, perplexity, economy, cup, competition, revenue, fmx-45]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-45
sourceType: perplexity
related:
  - [[../cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Perplexity - Cup and Competition Revenue Profiles 2026-05-28

This note preserves the FMX-45 research prompts and condensed raw outputs. It
is not implementation authority. The synthesis is
[[../cup-and-competition-revenue-profiles-2026-05-28]].

## Prompt 1 - domestic cups

Research current official cup and competition revenue structures for Germany,
England, Spain, Italy and France. Focus on domestic cup prize money/payment
cadence, gate-sharing/home-away settlement, replays/neutral finals where
applicable, media payments, travel/security costs, and how lower-tier clubs
experience cup windfalls. Return a Top-5 comparison matrix and source URLs.

### Condensed raw answer

- Domestic cups differ more by **profile structure** than by one universal
  rule. Prize ladders, gate shares, replay rules, neutral finals, live-TV fees,
  solidarity and travel support must therefore be profile data.
- Germany/DFB-Pokal pattern: central knockout prize ladder, participation fee,
  TV/live-game bonuses, no replays, final at a neutral prestige venue, home
  matchday operations/security and lower-tier windfalls from major home draws.
- England/FA Cup pattern: published round-by-round prize fund, gate sharing
  after deductions, live-TV/facility fee style, replay rules changing by season,
  neutral semi/final profile and very strong small-club windfall from away
  gate share plus TV selection.
- Spain/Copa pattern: RFEF competition rules, federation participation/aid
  hooks, lower-tier home advantage in earlier rounds, no-replay default,
  late-round two-leg option and neutral final.
- Italy/Coppa pattern: Lega Serie A organised, elite clubs enter later,
  central media package, single-leg early rounds, two-legged semifinal option
  and neutral final. Official PDF extraction should be retried before final
  numeric calibration.
- France/Coupe pattern: FFF prize/aid ladder, strong amateur support, travel
  and referee support hooks, TV bonuses and neutral final. Useful as the
  solidarity/amateur-support template.
- Game abstraction: define gate-sharing models as profile families:
  home-majority, shared-net-gate, central/solidarity pool and neutral-central.
  Keep real amounts as calibration references only.

## Prompt 2 - continental competitions

Research current UEFA/European club competition revenue distribution patterns
for 2025/26 or the current 2024-27 cycle. Focus on Champions League, Europa
League, Conference League: equal shares/participation, performance payments,
league-phase ranking, knockout progression, value pillar/market/coefficient,
qualifying-round and non-participant solidarity, final ticket/hospitality
centralization, and payment timing/circulars. Then translate this into IP-clean
game profile parameters for a fictional continental competition stack. Include
official source URLs.

### Condensed raw answer

- UEFA's 2024-27 model distributes central men's club competition revenue
  through three main pillars: equal share/participation, performance and value
  pillar.
- The value pillar replaces older market/coefficient concepts with a combined
  ranking/value mechanism. FMX should translate this into a fictional
  `legacyValuePillar` based on generated club reputation, continental history,
  league strength and market/fanbase scale.
- The same profile also needs qualifying-round payments and non-participant
  solidarity, separate from league-phase revenue.
- Performance payments should be separated into match result, league-phase
  ranking, knockout qualification/progression, finalist and winner bands.
- Finals and super-cup style events should be neutral/central events with
  central ticket/hospitality handling, not home-match settlement.
- Payment timing should be explicit: qualification advance, matchday
  performance, league-phase reconciliation, knockout progression, post-season
  surplus/final settlement.

## Prompt 3 - expected value and elimination shock

Research best practices and patterns for modeling tournament/cup expected
value and elimination shock in a sports management/economy simulation. Focus on
how to forecast future-round prize/gate/media/sponsor value, how to avoid
punishing randomness unfairly, how to represent cash vs forecast changes, and
how to expose simple vs expert dashboard views. Include useful source URLs if
available, but the main output should be game-design patterns and acceptance
scenarios.

### Condensed raw answer

- Model cup value as expected value: probability of future states multiplied
  by their net value, summed over future rounds.
- Separate cash, guaranteed receivables and expected future value. Forecast EV
  is not spendable bank balance.
- Elimination should mostly remove future upside. It should not create an
  immediate cash penalty unless an already-booked receivable needs reversal.
- Avoid unfair randomness by warning the player before high-risk ties,
  limiting Quick-mode spending against uncertain cup EV and using board
  personality/difficulty to decide how aggressive budgets may be.
- Quick UI should use bands and plain labels: secured income, guaranteed
  receivables, future upside and risk. Expert UI can show probability tables,
  round-by-round EV, formulas and sensitivity.
- Acceptance scenarios should include early exit, underdog windfall, calculated
  gamble, cash-vs-forecast clarity and AI clubs using the same conservative
  planning model later.

## Official source URLs captured

- The FA Cup prize fund 2025-26:
  <https://www.thefa.com/competitions/thefacup/prize-fund>
- FA Cup rules 2025-26:
  <https://www.thefa.com/-/media/thefacom-new/files/competitions/2025-26/rules/rules-of-the-fa-challenge-cup-2025-26.ashx>
- DFB-Pokal information:
  <https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/wettbewerbsinformationen>
- RFEF tournament rules PDF:
  <https://rfef.es/sites/default/files/2025-12/5._Torneos_Federacion.pdf>
- RFEF aid call:
  <https://rfef.es/sites/default/files/pdf/Convocatoria_Ayudas_Clubes_Tercera_Federacion_T._25-26.pdf>
- Lega Serie A regulations:
  <https://www.legaseriea.it/it/lega-serie-a/documentazione/regolamenti>
- FFF Coupe de France article:
  <https://www.fff.fr/article/16649-les-chiffres-des-demi-finales.html>
- FFF amateur-club support article:
  <https://www.fff.fr/article/15810-une-dotation-record-pour-un-projet-inedit.html>
- UEFA Circular 32/2025:
  <https://editorial.uefa.com/resources/029a-1e0b5460b86d-31e6cad26358-1000/20250616_circular_2025_32_en.pdf>
- UEFA men's competitions distribution explainer:
  <https://www.uefa.com/news-media/news/028c-1a963496826a-bf40705cb183-1000--men-s-competitions/>

## Related

- [[../cup-and-competition-revenue-profiles-2026-05-28]]
- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../../30-Implementation/club-economy-commercial-contracts]]
