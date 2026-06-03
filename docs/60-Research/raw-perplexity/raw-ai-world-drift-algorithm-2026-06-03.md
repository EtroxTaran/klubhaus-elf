---
title: "Raw Perplexity - AI world-drift algorithm (FMX-91)"
status: current
tags: [research, raw, perplexity, ai-world, world-drift, dynasty, competitive-balance, deterministic-sim, fmx-91]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-91
sourceType: external
related:
  - [[../ai-world-drift-algorithm-2026-06-03]]
  - [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../ai-manager-behaviour]]
  - [[../late-game-systems]]
  - [[../determinism-and-replay]]
---

# Raw Perplexity capture - FMX-91

Raw capture of the Perplexity research used for FMX-91. Synthesis lives in
[[../ai-world-drift-algorithm-2026-06-03]].

## Query 1 - real-world long-term football drift

**Prompt:** Research real-world football long-term competitive balance and club
rise/fall dynamics for a football manager simulation. Focus on mechanisms
relevant to deterministic world-drift design: wage/revenue escalation, owner
takeovers, financial distress/administration, promotion/relegation shocks,
youth-talent diffusion, continental coefficient or league-strength drift. Include
concrete examples from European football and note which patterns are robust
enough to turn into game-model triggers vs only calibration inputs. Current date:
2026-06-03.

**Captured answer:**

European football shows persistent inequality with occasional shocks. Big-club
dominance is structurally reinforced by revenue, wage and talent concentration,
but owner takeovers, financial crises, promotion/relegation, and continental
money/coefficients periodically reorder tiers.

### Competitive balance

- Long-run performance persistence is common: the same few clubs repeatedly
  occupy title, top-four and continental slots.
- Structural break-ins normally follow a material change: new capital, stadium
  expansion, repeated continental revenue, or a league-level commercial lift.
- Macro competitive-balance metrics are best used as calibration targets:
  champions concentration, top-four churn, wage/revenue Gini, revenue
  concentration and new-champion frequency.

### Wage and revenue escalation

- Higher revenue -> higher wage bill -> better talent -> better results -> more
  revenue is a durable feedback loop.
- Continental prize/media money and domestic broadcast/commercial deals create
  step changes in budgets.
- Game-model trigger: repeated continental qualification should increase club
  reputation, commercial pull and wage-pressure bands.
- Calibration-only: exact points-per-wage or revenue-to-performance elasticity.

### Owner takeovers and investment surges

- New capital is one of the clearest drivers of abrupt club rise. Public
  examples include early-2000s English benefactor investment, late-2000s
  state-backed English investment and early-2010s French state-backed
  investment.
- Takeovers are rare, high impact and persistent; not every takeover succeeds.
- Game-model trigger: underperforming large-market clubs, historic clubs in
  lower tiers and financially stressed clubs should enter takeover-candidate
  pools. Owner profile then sets spending tolerance, investment horizon and
  patience.

### Financial distress, regulation and administration

- Overspending relative to revenue can cause forced selling, administration,
  points deductions, relegation, liquidation or reform.
- Financial rules and licensing regimes are explicit institutional brakes.
- Game-model trigger: debt/loss/wage-burden thresholds plus owner willingness
  decide whether a club enters distress, administration, forced fire-sale or
  restructuring.
- Regulation changes are slower world events and should be visible to the
  player, not hidden rubber-banding.

### Promotion and relegation shocks

- Promotion/relegation changes revenue, wage pressure, squad quality and
  visibility.
- Parachute-style support can create yo-yo clubs and persistence for relegated
  large clubs.
- Game-model trigger: tier change drives revenue steps, wage renegotiation,
  poaching pressure, parachute support and contract-clause activation.

### Youth-talent diffusion

- Raw talent can be geographically distributed, but realized high-end talent
  concentrates around richer clubs and leagues through facilities, visibility
  and wages.
- Game-model trigger: league reputation and club facilities affect retention and
  acquisition of high-potential players.
- Calibration-only: exact potential distribution by country/league and
  value-to-points links.

### Continental coefficients and league-strength drift

- Continental coefficients and prize-money systems reward sustained
  performance and reinforce strong leagues.
- Game-model trigger: annual or periodic league-strength score affects
  continental spots, entry rounds, league reputation, transfer pull and
  commercial baseline.
- This is a strong macro world-drift engine, but exact speed of league rise/fall
  belongs in calibration.

### Source links returned by Perplexity

- https://footballperspectives.org/competitive-balance-european-football-leagues/
- https://winningwithanalytics.com/2024/02/05/competitive-balance-part-2-european-football/
- https://thesis.dial.uclouvain.be/bitstreams/b8d28687-fcbc-4e79-bd65-f11a4c7372ce/download
- https://shura.shu.ac.uk/18757/1/PDF_Proof.pdf
- https://football-observatory.com/Evolution-of-competitive-balance-in-the-Champions
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10097894/
- https://www.emerald.com/sbm/article/12/4/382/339355/The-multi-dimensionality-of-competitive-balance
- https://onlinelibrary.wiley.com/doi/full/10.1002/mde.3745
- https://sonar.ch/rerodoc/258577/files/TDEE_Cretton_Emilien.pdf

## Query 2 - comparable game-world drift patterns

**Prompt:** Research how long-running simulation/strategy games keep worlds from
going stale and avoid runaway dominance. Compare football/sports manager games
where possible (Football Manager, Hattrick, Top Eleven, OSM, EA FC Career,
Anstoss) plus adjacent games (Crusader Kings, Civilization, grand strategy/4X).
Extract best-practice patterns relevant to deterministic structural world events:
rival emergence, giant collapse, league/region power shifts, caps/cooldowns,
player-facing legibility, parameter calibration and soak testing. Current date:
2026-06-03.

**Captured answer:**

Long-running games fight staleness by combining structural checks on compounding
advantages, exogenous shocks, systemic drift and legible feedback. Football
manager games mostly rely on finance/talent constraints and generational churn;
grand-strategy and 4X games make more of the rise/fall systems explicit.

### Anti-runaway tools

- Use concavity and maintenance burden: extra money, fame, facilities and stars
  should not scale linearly forever. Dominant clubs face higher wages, squad
  conflict, playing-time pressure, congestion and expectation escalation.
- Use visible institutions instead of invisible rubber-banding: rules,
  licensing, registration limits, financial controls, agent preferences, rival
  refusal-to-sell, fan/board pressure.
- Apply dynamic rival and coalition patterns in football language:
  high-performing clubs face tactical counters, transfer-market resistance and
  higher price quotes from direct rivals.

### Rival emergence

- Rival emergence is stronger when it follows structural opportunity:
  repeated close finishes, regional proximity, transfer conflict, strong youth
  intake, new owner capital, or repeated title vacuum in a region.
- Best-practice pattern: event enters pending state when metrics cross a
  threshold, then a seeded draw decides timing/shape inside cooldown rules.

### Giant collapse

- Adjacent grand-strategy games make big entities fragile through overextension,
  factions, bad succession and maintenance pressure. Football analogues are
  wage overreach, owner withdrawal, old squads, missed continental revenue,
  regulation and poor recruitment.
- Best-practice pattern: staged collapse, not a single hidden dice roll:
  warning -> crisis -> aftermath. Each stage should be visible through news,
  board reports and financial indicators.

### League and region power shifts

- 4X/strategy games use eras, institutions and technology waves; football can
  use coefficient trends, TV/commercial shifts, investor interest, transfer pull
  and youth-development waves.
- Rising-region effects should be announced and graphed over decades so they
  read as history, not arbitrary balance.

### Caps, cooldowns and pacing

- Use global caps for MVP readability and reserve per-confederation caps once the
  world includes several continents.
- Cooldowns avoid drama spam: once a major owner event, collapse, reform or
  region shift fires, similar events should wait a defined number of seasons.
- Pacing controls are part of the design contract and should feed soak tests.

### Player-facing legibility

- Every structural mechanic that checks dominance needs an in-fiction name,
  forecast and post-hoc explanation.
- Strategy precedent suggests tooltips and breakdowns matter: players tolerate
  pressure when they can see "why", but distrust hidden catch-up buffs.

### Calibration and soak testing

- Define healthy-world metrics before tuning: title concentration, new champion
  rate, wage/revenue Gini, league-strength volatility, count of owner events,
  count of administrations, and frequency of dramatic shocks.
- Run AI-only fast-forward worlds and compare distribution shifts through golden
  baselines and drift reports.
- Record shock-event logs and inspect champion heatmaps, club-cycle clusters and
  region-strength curves.

### Source links returned by Perplexity

- https://www.youtube.com/watch?v=p4kfGo9bdrk
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9470634/
- https://journals.sagepub.com/doi/10.1177/1046878119848138
- https://www.youtube.com/watch?v=_3rqy7Lhlkw
- https://www.cesim.com/blog/webinar-for-educators-how-to-teach-with-business-simulation-games
- https://quanticfoundry.com/2024/05/21/strategy-decline/

## Promotion notes

- Robust real-world triggers: owner/takeover candidates, financial distress,
  promotion/relegation shocks, league-strength/coefficients and talent-pull
  feedback loops.
- Robust game-design patterns: staged events, visible institutions,
  cooldowns/caps, medium-term forecasts, no hidden catch-up buffs, and soak-test
  health metrics.
- Calibration-only: exact trigger thresholds, event probabilities, elasticity
  constants and final frequency targets.
