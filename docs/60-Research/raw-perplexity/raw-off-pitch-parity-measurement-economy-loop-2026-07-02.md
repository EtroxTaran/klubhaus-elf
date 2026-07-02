---
title: Raw - Off-Pitch Parity Measurement and Economy-Loop Anchors
status: raw
tags: [research, raw, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
sourceType: external
---

# Raw capture - Off-pitch parity measurement (transfers, finance/stadium, training, scouting)

Queries run 2026-07-02 (Perplexity Sonar + Exa web search) for
[[../off-pitch-parity-measurement-economy-loop-2026-07-02]]. Substantive
answers condensed; every load-bearing claim keeps its URL. Perplexity answers
explicitly marked their own unsourced inferences; those markers are preserved.

## Q1 - FM long-horizon delegation benchmarks (holiday / DoF experiments)

Asked: documented multi-season holiday/delegation experiments and the metrics
used (league position, squad value, net transfer spend, wage bill); documented
DoF-vs-human transfer-window comparisons; community squad-building metrics.

Substantive answer (Perplexity):

- Holiday-based season simulation is an established community *tactic-testing*
  method: "Evidence Based Football Manager" video describes full-manual /
  one-side-holiday / both-sides-holiday test modes used by FM fan sites
  (https://www.youtube.com/watch?v=cD1P9ayAWkQ).
- Multi-season holiday experiment formats exist: "Bottom at Christmas" series
  (https://footballmanageraddict.com/category/fm-experiments/fm24-experiments/bottom-at-christmas-iii/),
  "Holiday Journeyman" save
  (https://fmoverload.home.blog/2019/06/26/holiday-journeyman-save-introduction-and-season-one/),
  festive experiment video (https://www.youtube.com/watch?v=dwnggHjEFyg).
  Measured outcomes in all of these: **league position / survival only**.
- **Explicit not-found result:** "I cannot currently source a documented
  community experiment that cleanly compares DoF-run transfer windows vs
  human-run windows using fees, squad value delta, or wage efficiency."
- **Explicit not-found result:** net transfer value, Transfermarkt-style value
  delta, and wage-to-position efficiency were *not* found as documented FM
  community benchmarks (marked unsourced by Perplexity).
- Anecdotal delegation discussion: r/footballmanagergames thread
  (https://www.reddit.com/r/footballmanagergames/comments/qkahd5/do_you_play_every_game_or_do_you_go_on_holiday/);
  "holiday team overperforms" anomaly thread
  (https://fm-base.co.uk/threads/team-sucks-when-play-with-them-but-on-holiday-they-are-world-beaters.89766/).

## Q2 - Hattrick economy/training ROI models + OOTP GM evaluation

Asked: Hattrick training-ROI/wage-efficiency/economy models, bot studies,
academic papers; OOTP multi-season GM/AI-quality evaluation and developer
statements.

Substantive answer (Perplexity):

- Hattrick community models are **heuristic pipelines, not formal optimizers**:
  skill-trading (buy near-pop players by salary signal, train 1-2 weeks, sell)
  explained in "Hattrick - Skill Trade Guide"
  (https://www.youtube.com/watch?v=DiFUqJFmeMM); train-and-sell cycle claiming
  ~3M in 3 months using Transfer Compare + Player Training Estimation tools
  (https://www.youtube.com/watch?v=hTlypBcTodM); community training-strategies
  guide framing training vs buying vs day-trading as capital allocation
  (https://www.scribd.com/document/962681529/Training-Guide-in-Hattrick);
  in-game press example of 5-week training arbitrage
  (https://www.hattrick.org/en/Community/Press/?ArticleID=22869).
- Wage used as a noisy skill proxy for near-pop detection (salary updates on
  birthdays, "defined by skill") — same skill-trade guide.
- **Explicit not-found results:** no formalized closed-form ROI models with
  large-sample data; no published bot/scripted-agent studies of the Hattrick
  economy; all OOTP claims about owner-goal-based AI evaluation and
  decades-long AI-only test sims were marked **[unsourced inference]** by
  Perplexity — no citable developer methodology statement found.

## Q3 - Economy soak-testing / automated economy-balance regression practice

Asked: documented economy soak-testing/regression practice (Machinations, EVE,
Riot/Supercell, idle-game math); scripted player-archetype agents over long
horizons; standard long-horizon economy-health metrics.

Substantive answer (Perplexity):

- General game regression automation documented (KEPS/ICAPS 2024 paper on
  automated regression via logs + planning:
  https://icaps24.icaps-conference.org/program/workshops/keps-papers/KEPS-24_paper_10.pdf);
  soak testing recognised as a QA category
  (https://testomat.io/blog/game-testing-management/).
- **Explicit not-found results:** Machinations-as-regression-gate in production,
  EVE MER as *regression* tooling, Riot/Supercell economy dashboards, Kongregate
  idle-math talks, and pre-launch spender/hoarder/optimizer archetype-agent
  simulation were all marked **unverifiable from provided sources**. The
  economy-health metric list (sinks/sources ratio, inflation, Gini, pacing
  percentiles) was likewise flagged as industry-standard-but-not-cited.

Follow-up source pinning (Exa, direct primary sources):

- **EVE Online Monthly Economic Report** (production long-horizon economy
  monitoring, by the "EVE Online Economic Council"): named metrics include ISK
  faucets/sinks by category, **velocity of ISK**, Mineral/Ship/Module **price
  indices**, mining/production/destruction value, with raw data downloads.
  E.g. https://www.eveonline.com/news/view/monthly-economic-report-may-2026 ,
  https://www.eveonline.com/news/view/monthly-economic-report-february-2026
  ("Velocity of ISK continues to decrease. The Mineral Price Index ... down
  ~52% over the past year").
- **Machinations docs**: "Predict" = Monte-Carlo multi-run simulation of
  economy diagrams producing outcome distributions/histograms for balance
  decisions (https://machinations.io/articles/the-difference-between-play-and-predict ,
  https://machinations.io/docs/level-progression-6 ,
  https://machinations.io/docs/charts).
- **Anthony Pecorella (Kongregate), "Quest for Progress: The Math and Design of
  Idle Games"** (GDC 2016 / GDC Europe 2016): closed-form growth curves
  (exponential cost, linear production), **purchase optimization models**,
  prestige-timing rules of thumb — analytic optimality for compact
  buy-order/timing decision structures.
  (https://media.gdcvault.com/gdceurope2016/presentations/Pecorella_Anthony_Quest%20for%20Progress.pdf ,
  https://www.gdcvault.com/play/1023876/Quest-for-Progress-The-Math ,
  https://www.kongregate.com/pages/quest-for-progress-the-math-of-idle-games).

## Q4 - Academic evaluation of long-horizon resource-management agents

Asked: build-order/macro decision-quality evaluation (Churchill & Buro,
AlphaStar); baselines in resource-management RL benchmarks; infeasibility of
best-response/exploitability in long-horizon stochastic games; proxy value
metrics.

Substantive answer (Perplexity):

- **Churchill & Buro, "Build Order Optimization in StarCraft", AIIDE 2011**:
  macro decision quality = makespan/time-to-target-state + resource efficiency,
  validated by win rate vs scripted openings/built-in AI.
- **Justesen et al., "Continual Online Evolutionary Planning for In-Game Build
  Order Adaptation in StarCraft", GECCO 2017**
  (https://sebastianrisi.com/wp-content/uploads/justesen_gecco17.pdf):
  evaluation = win rate vs built-in AI at multiple difficulties + scripted
  opening books; baselines are scripted experts, not optimizers.
- AlphaStar: evaluated by **match win rate / ladder placement only**; no
  published separate macro-quality index (Perplexity: "cannot fully source ...
  detailed internal evaluation criteria are not public").
- COMA (Foerster et al., AAMAS 2018) / QMIX (Rashid et al., ICML 2018): SC2
  micro tasks use **supply difference as dense proxy reward**
  (https://yobibyte.github.io/starcraft_research.html).
- Long-horizon agent benchmarks grade by **mean task success / outcome
  distributions + milestone checks**, never exploitability
  (https://arize.com/blog/long-horizon-agent-benchmarks-field-guide/).
- **Explicit caveats:** Lux AI / OpenTTD-style evaluation details (net-worth
  curves, company value baselines) were marked partly **unsourced** (consistent
  with practice, no named paper in results); no formal theorem on
  exploitability infeasibility in long-horizon stochastic games surfaced —
  reliance on scripted baselines + outcome distributions is *observed practice*.

## Q5 - Real-football econometric value-metric anchors (Exa)

- **Szymanski (OpenLearn, Open University)**: relative wage spending vs average
  league position over a decade, top two English divisions — "R2 ... a value of
  90%"; revenue similarly ~90%
  (https://www.open.edu/openlearn/money-management/management/business-studies/stefan-szymanski-on-the-business-football).
- **Szymanski, London Evening Standard 2010** (on Kuper & Szymanski, *Why
  England Lose*/Soccernomics, and Tomkins/Riley/Fulcher, *Pay as You Play*):
  relative wages (RW) explain ~90% of league-performance variation; the £XI
  transfer-fee squad valuation correlates just under 90% with wages and
  explains position "almost equally as well"; **both measures overstate the
  resources required for top positions and understate those required to avoid
  relegation**
  (https://www.standard.co.uk/business/markets/totting-up-true-price-of-success-on-the-football-field-6548259.html).
- Hall, Szymanski & Zimbalist, *Testing Causality Between Team Performance and
  Payroll*, Journal of Sports Economics 3(2), 2002
  (https://ideas.repec.org/a/sae/jospec/v3y2002i2p149-168.html).

## Q6 - Hattrick academic market studies (Exa)

- **Englmaier, Schmöller & Stowasser, "Determinants and Effects of Reserve
  Prices in Auctions"** (SFB/TR 15 discussion paper 326; VfS 2016 version):
  6,258 hand-collected Hattrick auctions; sellers show "both very sophisticated
  and suboptimal behavior"; reserve prices cluster irrationally at 0 and
  multiples of 50,000; simulated expected-revenue loss from suboptimal reserves;
  **sunk-cost fallacy** evidence
  (https://sfbtr15.de/uploads/media/326.pdf ,
  https://ideas.repec.org/p/zbw/vfsc16/145540.html).
- **Trautmann & Traxler, "Reserve prices as reference points - Evidence from
  auctions for football players at Hattrick.org"**, Journal of Economic
  Psychology 31(2), 2010
  (https://www.sciencedirect.com/science/article/abs/pii/S0167487009000853 ,
  https://ideas.repec.org/a/eee/joepsy/v31y2010i2p230-240.html).
- Schmöller dissertation on Hattrick bidding behaviour: Hattrick's transfer
  market has **no information asymmetry** (full attribute vector public at
  sale), making it a controlled auction environment
  (https://edoc.ub.uni-muenchen.de/11175/1/Schmoeller_Arno.pdf).
