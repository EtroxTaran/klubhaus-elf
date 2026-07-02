---
title: "Raw - tier parity measurement and calibration (dual-mode easy vs pro)"
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
sourceType: external
related:
  - [[../tier-parity-measurement-calibration-2026-07-01]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
---

# Raw - tier parity measurement and calibration (dual-mode easy vs pro)

Raw capture for the FMX dual-mode parity packet: how industry and research
define, measure and regression-test "a restricted/simple input surface reaches
X% of the optimal input surface's output". Queries ran on 2026-07-01 via
Perplexity (Sonar) and Exa web search. Substantive answers and quotes below;
each claim carries its source URL. Perplexity's aim-assist answer had weak
citations, so the aim-assist and xPts facts were re-verified with targeted Exa
searches against primary/secondary reporting.

## Query 1 (Perplexity): industry bot-vs-bot / self-play balance pipelines

Prompt asked for named, citable industry work on automated-playtesting balance
pipelines (King, Ubisoft La Forge, Riot/Valve/Blizzard, Jaffe restricted play,
EA SEED, curiosity-driven RL playtesting), what each measures, and how balance
is regression-tested across patches.

Substantive extractions:

- **King - Human-Like Playtesting with Deep Learning** (Gudmundsson, Silva,
  Togelius, Yannakakis et al., IEEE CIG 2018). Deep-learning agents imitate
  human play to playtest Candy Crush levels; measured **level completion
  rate**, **moves used**, and compared **AI vs human performance curves** to
  predict difficulty of changed levels. Single-player difficulty calibration,
  not PvP balance; no public CI-gate pipeline description.
- **Ubisoft La Forge automated playtesting**: public material describes
  re-running standard bot suites per candidate build and tracking
  **completion-rate / coverage / failure-mode time series** with deviation
  alerts; content robustness rather than competitive balance. Only
  qualitatively documented.
- **Alexander Jaffe - restricted play** (see Query 2 for primary sources):
  balance measured as **win rate of a restricted agent vs a standard agent**;
  gives a repeatable per-patch experiment design (re-run restricted-play
  simulations, compare win-rate matrices and dominance relations).
- **EA SEED / self-play balance talks** (qualitative): thousands of self-play
  matches per candidate patch, **win-rate deltas per loadout/map vs a baseline
  build**, and **fairness envelopes** ("each loadout should stay ~45-55% WR vs
  the aggregate field") with automatic out-of-envelope flags. Not formally
  archived; treat as low-confidence industry folklore unless a specific talk is
  located.
- **Card games (Hearthstone/Legends of Runeterra)**: public balance discussion
  is telemetry-driven (per-deck/per-card win rate, play rate, mulligan WR,
  matchup tables, meta-diversity/entropy), recomputed per patch as
  dashboard-driven regression; explicit bot-pipeline details are not public.
- **OpenAI Five (Dota 2)**: massive self-play surfaced overly strong
  hero/item synergies; agents were re-evaluated on new patches — conceptually a
  balance regression test, not a production pipeline.
  https://openai.com/research/openai-five (blog; not re-fetched in this pass —
  medium confidence).
- Perplexity's overall synthesis (consistent across its sources): almost
  everyone measures **win rate, pick/play rate, outcome distributions**, and
  keeps **baseline distributions from the last accepted patch**, comparing new
  builds via **deltas with confidence intervals** and **distribution distances
  (KS / earth-mover)**; explicit build-gating pipelines are rarely documented
  publicly.
- Survey-level source it cited: Khatiwada, "Robotics Agent for Automated
  Gameplay Testing and Balancing", thesis 2025,
  https://www.theseus.fi/bitstream/10024/903910/2/Khatiwada_Deshul.pdf —
  proposes repeatable scenario tests with cross-build metric comparison as the
  regression mechanism.

## Query 2 (Exa): restricted play and agent-based balance measurement

- **Jaffe et al., "Evaluating Competitive Game Balance with Restricted Play",
  AIIDE 2012.** https://ojs.aaai.org/index.php/AIIDE/article/view/12513 ; PDF:
  https://grail.cs.washington.edu/wp-content/uploads/2015/08/jaffe2012ecg.pdf
  Key quote: "To do so, we may measure the win rate of an agent who is
  restricted from ever (or often) taking that action, against an agent who
  exploits this restriction." Framework: many balance questions reduce to the
  **fairness of games with restricted players**, evaluated by simulating
  restricted vs standard agents.
- **Jaffe PhD thesis, "Understanding Game Balance with Quantitative Methods"
  (UW 2013).** http://hdl.handle.net/1773/22797 — "This formulation, called
  'restricted play', reveals the connection between balancing concerns, by
  effectively reducing them to the fairness of games with restricted players";
  shows balance can be estimated **without players** using simulated agents
  under algorithmic restrictions.
- **Politowski et al., "Assessing Video Game Balance using Autonomous Agents",
  2023.** https://doi.org/10.48550/arxiv.2304.08699 — semi-automated balance
  assessment with agents; balance types measured: **Challenge vs Success**
  (difficulty deltas between game versions) and **Skill vs Chance** (comparing
  a **random agent** against trained agents — the random-vs-skilled spread
  measures how much decisions matter).

## Query 3 (Exa): RL / simulation-driven balancing for asymmetric archetypes

- **Rupp, Eberhardinger, Eckert, "Simulation-Driven Balancing of Competitive
  Game Levels with Reinforcement Learning" (IEEE CoG 2023 / journal
  extension).** https://arxiv.org/html/2503.18748 — balance of a level is
  estimated by **repeated simulation with two identical heuristic agents**;
  balance metric on [0,1] where **0.5 = equal win rates**, 0/1 = one side
  always wins; stochastic games require many simulation runs per estimate;
  discusses applying fairness metrics to game balancing and non-equal balancing
  objectives. Code: https://github.com/FlorianRupp/pcgrl-simulation-driven-balancing
- **Rupp & Eckert, "Level the Level: Balancing Game Levels for Asymmetric
  Player Archetypes With Reinforcement Learning" (2025).**
  https://doi.org/10.1145/3723498.3723747 / https://arxiv.org/html/2503.24099v1
  — balances levels so **asymmetric archetypes** ("one archetype may have an
  advantage over another, both should have an equal chance of winning") reach
  equal win rates; result: "as the disparity between player archetypes
  increases, the required number of training steps grows, while the model's
  accuracy in achieving balance decreases". A human-playtester study found the
  agent-simulated balance "actually improves the perceived balance for humans
  in most cases".
- **Rupp, "Game Balancing via Procedural Content Generation and Simulations"
  (AIIDE 2025 doctoral consortium).** https://doi.org/10.1609/aiide.v21i1.36856
  — derives the game-independent numeric balance metric in [0,1] (0.5 =
  balance) and notes the compute cost of estimating it by simulation.
- **Hernández, Gbadamosi, Goodman, Walker, "Metagame Autobalancing for
  Competitive Multiplayer Games" (IEEE CoG 2020).**
  https://doi.org/10.1109/cog47356.2020.9231762 — designer specifies a **target
  win-rate graph** between high-level strategies ("more sophisticated balance
  targets ... beyond a simple requirement of equal win chances", e.g. "Torch
  bot should have a 70% win-rate against Nail bot"); simulation-based
  optimization then finds game parameters minimizing distance to the target.
  Precedent that a **deliberate non-50/50 target** (bounded edge) is a
  first-class calibration objective.

## Query 4 (Perplexity + Exa): asymmetric-input fairness, handicaps, xPts

Perplexity's answer here carried weak/irrelevant citations, so the concrete
facts below were re-verified via Exa against reporting of primary statements.

- **Apex Legends aim assist constants (asymmetric-input fairness in
  production):** internal aim-assist strength is an explicit numeric constant —
  **0.6 on console, 0.4 for controller on PC** (confirmed by an official
  Respawn statement when a patch accidentally equalized them:
  https://dotesports.com/apex-legends/news/respawn-rolls-back-aim-assist-values-after-accidental-escape-change
  citing https://twitter.com/Respawn/status/1456019263802601473 ).
- **Apex Season 22 (Aug 2024) re-tuning:** Respawn published per-context
  reductions — "Console crossplay into PC lobbies: aim assist strength reduced
  18%; console performance mode crossplay into PC lobbies: reduced 22%;
  controller on PC: reduced 25%". Designer Eric Canavese: "Simply put, aim
  assist is just too strong in these PC lobbies ... we are going to reduce Aim
  Assist's strength by about 25%", and aim assist "will never be removed"
  because it bridges the input gap (accessibility floor).
  https://gamerant.com/apex-legends-aim-assist-nerf-season-22/ ;
  https://esports.gg/news/apex-legends/apex-legends-aim-assist-getting-nerfed-on-pc-in-season-22/ ;
  https://beebom.com/apex-legends-aim-assist-nerfed/ (0.4 → 0.3 framing).
  Pattern: the input-fairness bridge is a **versioned numeric parameter**,
  tuned per patch against input-split outcome telemetry, with a public
  commitment that it exists and stays.
- **Input-based matchmaking** (Halo Infinite, Call of Duty crossplay pools):
  separating or partially separating matchmaking pools by input is the
  complementary lever when parameter tuning cannot close the gap; public
  documentation is patch-note/dev-blog level (medium confidence; no single
  authoritative URL captured in this pass).
- **Golf World Handicap System (USGA/The R&A):** converts raw ability into a
  handicap index so players of different abilities compete on **net-score
  parity**; authoritative source family: https://www.usga.org/handicapping.html
  (not fetched; well-established — medium-high confidence).
- **Go handicap stones / Elo expected score:** stones chosen empirically to
  roughly equalize win chances across rank gaps; Elo maps rating difference to
  expected score, so a handicap can target a chosen win probability (standard
  rating-system literature; medium confidence, no single URL captured).
- **Opta expected points (xPts) model** (verified, multiple Opta Analyst
  articles): "Our expected points model simulates the number of goals scored by
  each side in each match based on the expected goals (xG) value of every shot
  taken. It then uses the simulated number of goals to determine the match
  outcome (win/draw/loss). Each match is simulated 10,000 times. The expected
  points for each team in each match can then be calculated based on the
  proportion of simulations they win/draw/lose."
  https://theanalyst.com/articles/championship-table-expected-points ;
  https://theanalyst.com/articles/opta-premier-league-expected-points-table-arsenal-chelsea ;
  https://theanalyst.com/articles/premier-league-table-2025-26-expected-points-underlying-data
  Known caveats stated by Opta: ignores game state and non-shot dominance.
- **American-football EPA** (expected points added): play-level change in
  expected points relative to game situation — a per-decision value metric
  rather than a per-match results metric (Perplexity summary; standard
  analytics concept — medium confidence without a captured primary URL).

## Query 5 (Exa): exploitability / NashConv as "distance from optimal"

- **NashConv/exploitability definition** (Lanctot et al. 2017,
  https://arxiv.org/pdf/1711.00832.pdf ; implemented in DeepMind OpenSpiel:
  https://github.com/deepmind/open_spiel/blob/master/open_spiel/python/algorithms/exploitability.py ):
  per-player improvement = value of deviating to a **best response** minus
  on-policy value; NashConv = sum of improvements; zero exactly at Nash
  equilibrium.
- **Lockhart et al., "Computing Approximate Equilibria in Sequential
  Adversarial Games by Exploitability Descent" (IJCAI 2019).**
  https://www.ijcai.org/proceedings/2019/0066.pdf — formal definition of
  exploitability δ_i(π) = max over deviations of value gain.
- **Timbers et al., "Approximate Exploitability: Learning a Best Response"
  (IJCAI 2022).** https://www.ijcai.org/proceedings/2022/0484.pdf —
  "Exploitability measures how well a strategy profile approximates a Nash
  equilibrium — the closer it is to zero, the closer the policy is to optimal";
  in large games the true best response is intractable, so a **learned/search
  approximate best response** is used as the practical optimal anchor.

## Cross-source observations

- Convergent: win-rate (or expected-value) delta between a **constrained
  policy** and a **reference/optimal policy**, estimated by repeated
  simulation, is the standard measurable form of "balance between unequal
  input surfaces" (Jaffe; Rupp; Hernández; exploitability literature).
- Convergent: acceptance is by **envelopes over multi-seed distributions**,
  compared per patch against versioned baselines (Perplexity synthesis; matches
  GD-0043's existing acceptance rule).
- Conflict/gap: fully automated **build-gating** balance pipelines are almost
  never documented publicly in engineering detail; envelope numbers like
  "45-55% WR" are industry folklore rather than citable policy. Flagged low
  confidence wherever used.
- Not verifiable in this pass: EA SEED self-play balance specifics; Halo/CoD
  input-matchmaking internals; exact go-handicap win-rate equalization data.
