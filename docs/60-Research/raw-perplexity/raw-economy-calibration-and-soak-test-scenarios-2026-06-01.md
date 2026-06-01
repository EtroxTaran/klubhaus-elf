---
title: Raw Perplexity - Economy Calibration and Soak-Test Scenarios 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, calibration, soak-test, stress-test, balancing, fmx-52]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-52
sourceType: perplexity
related:
  - [[../economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[../ai-club-economy-behaviour-2026-06-01]]
  - [[../top5-country-economy-profiles-2026-05-29]]
  - [[../club-financing-tools-2026-06-01]]
  - [[../fan-demand-price-elasticity-2026-05-28]]
  - [[../determinism-and-replay]]
  - [[../pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
---

# Raw Perplexity - Economy Calibration and Soak-Test Scenarios 2026-06-01

This note preserves the FMX-52 research prompts and condensed raw outputs. It is
**input only — not implementation authority**. The synthesis is
[[../economy-calibration-and-soak-test-scenarios-2026-06-01]]. Upstream decisions are
already locked or drafted and not re-opened here: the weekly-ledger/insolvency spine
([[../../50-Game-Design/economy-system]]), the five AI financial archetypes + dampers
([[../ai-club-economy-behaviour-2026-06-01]]), the `CountryEconomyProfile`
([[../top5-country-economy-profiles-2026-05-29]]), determinism/RNG streams
([[../determinism-and-replay]]) and the 50-year soak harness
([[../pre-mortem/PM-2026-05-20-16-test-strategy-depth]]). All numbers/ratio bands are
external benchmarks, not final FMX constants — final calibration is FMX-52's evidence
gate plus Nico sign-off.

## Prompt 1 — Simulation balancing & long-run economy testing in management games

*Asked:* best practices for calibrating economy constants (Monte Carlo sweeps, headless
batch sims, golden baselines, statistical drift detection); detecting/preventing runaway
dynamics (rich-get-richer, wage/transfer inflation, title concentration) and the metrics
that quantify them (Gini, HHI, concentration ratios) with healthy bands; mean-reversion /
homeostasis controller tuning (PI, soft caps, progressive costs) and stability criteria;
KPI success-band design (wage/revenue, debt/revenue, runway) with football-finance
benchmarks (UEFA 70% squad-cost); soak-test duration (50 vs 100 seasons) and the failure
signatures each reveals; realistic insolvency/administration base rate per decade per
division and how to translate it to a sim target band.

### Condensed output 1

- **Calibrate to target distributions, not single values.** Run headless batch sims
  across many fixed seeds, vary constants in controlled Monte-Carlo sweeps, compare every
  build to a locked **golden reference** so balance changes are detectable and
  reproducible. Tune against bands like "top-division wage/revenue median 55–65%, 95th
  pct < 85%, insolvency rare but nonzero" rather than one annual number. Use control
  charts / distribution tests on rolling per-season metrics (league cash, leverage,
  concentration) because football finances "can look stable short-term while drifting
  badly long-term" (relative-decline dynamics) [1][3][5].
- **Runaway failure modes:** rich-get-richer loops (prize/Europe/reputation compound),
  wage-inflation spirals, title/revenue concentration (dynasty lock-in), asset/cash
  hoarding. Metrics & heuristic bands:
  - **Gini** — <0.35 low / 0.35–0.50 moderate / >0.50 high concentration (heuristic).
  - **HHI** — <0.15 unconcentrated / 0.15–0.25 moderate / >0.25 highly concentrated
    (competition-policy benchmark, repurposed for league/title concentration).
  - **CR4 / CR8** — rising top-4 share over time = early dynasty signal.
  - **Theil/entropy**, **championship concentration** — distribution shape & "fun" metric.
  - Healthy target: leagues have elite clubs but **not permanent one-club dominance**; if
    HHI keeps rising across decades the system is too sticky. Distress is tied to small
    market + high debt + low liquidity, so runaway dominance can coexist with lower-end
    insolvency [1][3][5].
- **Homeostasis controllers should be soft & lagged, not hard clamps.** PI control for
  league aggregates (inflation, wage/revenue, reserves); soft caps for wages/debt-service/
  spending authority; progressive costs for luxury spend; income-linked budgets. Tuning:
  start with **low proportional gain**, add a **small capped integral** only for
  persistent drift, use **long observation windows**, prefer **state-dependent** response
  (2-weeks-runway club gets stronger intervention than a 2-years-runway club). Stability
  criteria: no persistent oscillation after the transient; recovery over **multiple
  seasons** not instantly; intervention rare in normal play (if the player "feels the
  hand" the gains are too high); league returns toward target bands after shocks without
  erasing consequences. Protect **liquidity** first, nominal profit second [3].
- **KPI bands (healthy/warning/critical):** wage/revenue ~50–65 / 65–75 / >75–80;
  debt/revenue low-moderate / rising / sustained high; cash runway 6–12+ mo / 3–6 mo /
  <3 mo; operating margin ≈break-even / volatile / structurally negative; liquidity above
  distress / declining / distress zone. UEFA squad-cost **70%** is the widely used
  sustainability line (industry benchmark, not in the cited result set). Football distress
  prediction studies tie distress to **low liquidity + high leverage + poor sporting
  performance**, so warning bands must watch all three [2][3].
- **Soak duration — use both.** 50 seasons finds obvious issues (runaway inflation,
  insolvency cascades, broken promotion/relegation economics, short-cycle oscillation);
  100 seasons finds slow-burn failures (distribution drift, gradual hoarding, title
  monopoly, declining competitiveness, narrative exhaustion). Keep a **50-season standard
  gate** for daily CI and a **deep 100-season soak** for release candidates / major
  economy changes [1][5].
- **Insolvency base rate is tier-sensitive, not a single number.** Anchors from the
  sources: insolvency is tied to relative decline [1][5]; one English-football sample had
  **62.5% of League Two clubs** vs **20% of Premier League clubs** suffering an insolvency
  event [7]; high indebtedness + low liquidity are the core predictors [3]. Engineering
  translation: top tier low single-digit %/decade, mid tiers several× higher, lowest tiers
  highest (esp. fragile archetypes), high enough to keep financial strategy relevant but
  low enough that the league is not a failure cascade [1][3][7].

*Citations 1:* [1] college.holycross.edu/hcs/RePEc/spe/Szymanski_Insolvency.pdf ·
[2] efsupit.ro/images/stories/april2024/Art%20104.pdf ·
[3] pmc.ncbi.nlm.nih.gov/articles/PMC6932787 ·
[4] footballbenchmark.com/w/football-clubs-valuation-the-european-elite-2025 ·
[5] onlinelibrary.wiley.com/doi/10.1111/sjpe.12134 ·
[6] pureportal.coventry.ac.uk/files/3963489/CIBS%20paper%204.pdf ·
[7] cabidigitallibrary.org/do/10.5555/collection-news-20830/abs ·
[8] playthegame.org/news/handball-clubs-on-the-brink-of-insolvency

## Prompt 2 — Financial stress-testing & scenario-analysis patterns for a club

*Asked:* how to map Basel/CCAR-style stress testing, reverse stress testing, and scenario
vs sensitivity analysis to a simulated club economy; realistic shock magnitudes
(relegation revenue drop, sponsor loss, fair-weather attendance collapse, cup windfall,
derby spike); football-finance specifics (IFRS 15 season-ticket deferral, wage/turnover
thresholds, English parachute structure, promotion/relegation revenue base shift, matchday
cost structure); deterministic fixture design for reproducible stress tests with pass/fail
KPIs; and the evidence standard for accepting a calibration/assumption.

### Condensed output 2

- **Framework:** borrow the *structure* of Basel/EBA/BoE/Fed-CCAR — a fixed **horizon**,
  a set of **baseline / adverse / severely-adverse** scenarios, focus on capital +
  liquidity adequacy, and conservatism/plausibility/internal-consistency/transparency in
  scenario design [2][6]. "Severe but plausible" = low-quantile (5th/10th pct) paths
  (Growth-at-Risk idea) [2]. For a club: horizon **2–3 seasons**; baseline = central case;
  adverse = relegation/no-Europe + attendance drop + one sponsor default; severely adverse
  = multiple simultaneous tail shocks.
- **Scenario vs sensitivity:** scenario analysis = multi-factor internally-consistent
  narrative paths (use for pass/fail); sensitivity analysis = isolated parameter shocks
  (use to find which levers matter & test model robustness) [4][6].
- **Failure definitions (port from regulatory minima):**
  - *Liquidity:* `cash + committed credit < 0` at any week; or
    `(cash + committed credit) / next-4-weeks net outflow < 1`.
  - *Solvency:* **DSCR** = EBITDA / (interest + scheduled principal) < 1 for X consecutive
    periods = economic insolvency even if cash positive; net debt/turnover > 1.0–1.5×
    trigger; wage/turnover above sustainability **and** unable to cut quickly.
  - *Regulatory:* breach of league FFP-style rules → fines/points feeding back into
    revenue. A scenario **fails** if, under only *credible* management actions, the club
    breaches ≥1 solvency/liquidity constraint within the horizon [6][7].
- **Reverse stress testing:** start from the failure endpoint and search **backward** for
  the shock combination that causes it. Steps: (1) define failure condition; (2) enumerate
  key drivers (league position/prize, attendance↔performance↔loyalty, sponsor
  default/non-renewal, broadcast/parachute, player-trading, wage/staff/stadium/policing
  costs); (3) parameter-grid or optimisation search for the **frontier combinations** that
  just tip survival → failure [3][4][6][9]. Apply with **wage-stickiness** (only ~30–40%
  of wages auto-reduce on relegation) and **replacement lags** for sponsors.
- **Shock magnitudes (English-football guide):**
  - *Relegation:* broadcast/central −50–70% absent parachute; total revenue −35–60% for a
    mid-table PL club; parachute softens to effective −30–40% yr1 rising to −50–60% by yr3.
  - *Sponsor loss:* main shirt sponsor ≈10–30% of commercial, commercial ≈20–40% of total
    → −10–15% of turnover short-run if unreplaced, −5–10% steady-state after re-sign.
  - *Fair-weather attendance:* robust base −10–15% on relegation; fair-weather base
    −20–30%, rising to −30–40% after a second poor season.
  - *Cup windfall:* small club +10–20% of turnover in a dream run; mid PL club +3–7%.
  - *Derby/top-6 matchday:* +20–50% vs an average home league match (encode fixture
    multipliers: regular 1.0×, derby/top-6 1.3–1.5×, low-profile midweek cup 0.5–0.7×).
- **Football-finance specifics:**
  - *IFRS 15 season tickets:* cash up front → **contract liability / deferred revenue**;
    recognise **pro-rata as home matches are played** (e.g. 1/19 per home league game);
    cancellations → refund liability / contract modification. Cash ledger and accrual P&L
    diverge in timing by design.
  - *Wage/turnover:* PL avg ~55–65%, Championship often >100% (unsustainable); >70–80%
    without external capital = high risk. Green <60, warning 60–70, red >70–75. Reject a
    stress "solution" that needs wage/turnover to fall 95%→55% in one season (not credible).
  - *Parachute (EPL pattern):* up to 3 seasons post-relegation (stops on promotion);
    ≈55% / 45% / 20–25% of prior PL central share by year. Time-decaying cushion = explicit
    reverse-stress variable.
  - *Promotion/relegation revenue base:* define per-tier revenue vectors
    (media/matchday/commercial %); jump base on movement with a **lag** in commercial
    adaptation. Illustrative: PL 60/15/25, Championship 40/25/35, League One 20/35/45.
  - *Matchday cost:* `Cost_match = Fixed_per_match + k × Attendance`; variable matchday
    opex ≈20–40% of matchday revenue + fixed floor; high-risk derby adds +10–20% security.
- **Deterministic fixtures:** fixed fixture list + fixed seed (or no RNG) per canonical
  club scenario; represent all exogenous shocks as **explicit scenario variables**, not
  random draws. Canonical archetypes: healthy low-debt mid-table; high-debt ambitious;
  parachute-dependent recently-relegated; small matchday-dependent. Pass/fail hurdles:
  no week with `cash + undrawn < 0`; net debt/turnover ≤ threshold; DSCR ≥ ~1.2; wage/
  turnover ≤ 70% (or reducing with credible plan); no tax/social arrears accumulation;
  management actions must be realistic.
- **Evidence standard (port directly):** (1) historical backtesting/benchmarking vs club
  data; (2) sensitivity/uncertainty analysis — results change monotonically & plausibly,
  no unjustified discontinuity; (3) external data + documented expert judgment; (4)
  independent model validation + accounting-identity checks. **Parameter sheet** per
  constant: definition, current value, source, last-change date+rationale, sensitivity
  bounds. **Scenario sheet:** narrative + exact overrides + intended severity (≈percentile).
  Periodic recalibration. A constant is **acceptable** if it sits in an evidence-justified
  range (or is conservative when data is sparse), small variations within the band don't
  reverse major conclusions (else flag **parameter-sensitive**), and it interacts
  consistently with other params [2][4][6][7][9].

*Citations 2:* [2] eib.org/en/publications/20250384-economics-working-paper-2026-01 ·
[3] imf.org/.../wpiea2020165 · [4] unepfi.org/.../Good-Practice-Guide-to-Climate-Stress-Testing ·
[6] brookings.edu/.../WP92_Tarullo-stress-testing · [7] federalregister.gov 2025-20211 ·
[9] katalysys.com/insights/how-severe-should-a-liquidity-stress-test-be

## Prompt 3 — Deterministic-sim testing techniques + attendance/fan-demand elasticity

*Asked (A):* golden-master/characterization, property-based and metamorphic testing for
game/economy sims — appropriate invariants & metamorphic relations, tolerance bands /
statistical drift detection (control charts, Mahalanobis, KS) on a committed golden
baseline, and seed-selection best practice (smoke vs sweeps). *(B):* empirical football
attendance demand — price elasticity (inelastic?), income elasticity, recent-form effect,
loyal/core vs fair-weather split, habit/season-ticket stickiness, and derby/big-match
uplift magnitude, with numbers.

### Condensed output 3A — testing techniques

- **Golden-master / characterization:** capture current behaviour for fixed inputs and
  diff future runs; compare a **normalized summary** (league aggregates, club finances by
  season, wage/transfer/cash, attendance distributions, promotion/relegation counts,
  inflation/prize totals, revenue splits) — strip incidental noise (timestamps, ordering,
  UUIDs, float formatting) before comparison [1][2][3][4][7].
- **Property-based invariants:** accounting identity (assets = liabilities + equity, or
  cash deltas reconcile exactly); **no money creation** except explicit injections/sinks;
  non-negativity (attendance/revenue/wages, cash unless overdraft modelled); capacity
  `0 ≤ attendance ≤ capacity`; **monotonicity** (↑attendance ⇒ not-↓matchday revenue;
  ↑price ⇒ not-↑quantity); order consistency (better performance ⇒ not systematically
  lower demand); **determinism under seed**. Target both local and global invariants —
  global ones catch emergent accounting failures after many seasons [6].
- **Metamorphic relations:** scale-up (×k all money ⇒ totals ×k if scale-invariant);
  attendance uplift (↑attendance weakly ↑matchday revenue); capacity ceiling (demand >
  capacity doesn't raise attendance past capacity); price-demand (↑price weakly
  ↓attendance); performance shock (↑form weakly ↑demand); promotion/relegation changes
  schedule/revenue mix in the expected direction. Plus aggregation consistency (Σ club
  revenue = league revenue) and period consistency (season total = Σ matchday periods) [6].
- **Tolerance & drift on a committed golden baseline:** exact-compare accounting
  identities/counts/deterministic integers; numeric tolerance (abs+rel) for floats;
  distributional tests for stochastic aggregates. For drift detection: **control charts**
  per season metric across CI runs; **Mahalanobis distance** on a correlated multivariate
  summary vector (revenue, attendance, wage/revenue, balance); **KS test** across large
  seed sweeps. Policy: fail hard on invariant violation, warn/investigate on numeric drift
  beyond tolerance, require **explicit approval to update the baseline** for intentional
  balance changes [1][4][5].
- **Seeds:** fixed seeds for replay; **smoke seeds** (small curated set, fast CI),
  **regression seeds** (previously caught bugs), **large sweeps** (hundreds–thousands,
  nightly/release), **stratified seeds** (high-scoring / low-attendance / promotion-heavy /
  debt-prone regimes). Separate deterministic smoke (per commit) from broad stochastic
  sweeps (nightly/release); update baseline only after reviewing the changed distribution
  [1][4][5].

### Condensed output 3B — attendance / fan-demand elasticity

- **Price elasticity: generally inelastic.** Negative, |ε| < 1, commonly ~**−0.2 to
  −0.8**, occasionally near unit-elastic in price-sensitive segments. Aggregate is a blend
  of a very inelastic core and a more elastic fringe.
- **Income elasticity:** positive but **small/modest**; weaker than performance or
  derby/star effects; hard to identify cleanly.
- **Recent performance/form:** positive (home wins, points-per-game, league position,
  promotion/relegation pressure); larger effect for **marginal/fair-weather** fans.
- **Core vs fair-weather:** core = lower price elasticity, stronger habit persistence,
  less form-sensitive, stronger season-ticket attachment; fair-weather = sensitive to
  big-match quality, rivalry, standings, winning streaks, stars.
- **Habit / season-ticket stickiness:** prior attendance predicts future attendance after
  controlling for price/performance; season-ticket holders far less responsive to
  short-run shocks than walk-ups. Model attendance as **sticky base (core/ST) + variable
  marginal (casual)**.
- **Derby / big-match uplift:** positive, often substantial; attendance uplift single
  digits to several tens of %; revenue uplift typically larger than attendance uplift when
  dynamic pricing / premium / hospitality stack on top. League- & dataset-specific.
- **Calibration priors table:** price −0.2…−0.8 (inelastic); income small positive;
  recent performance moderate (stronger for marginal fans); habit/prior-attendance strong
  persistence; derby/big-match large event premium. Treat as priors, not universal
  constants (vary by country/league/division/pricing regime).
- **Test asserts:** ↑price ⇒ ≤ attendance; ↑attendance ⇒ ↑revenue; ↑form ⇒ ≥ demand;
  derbies > comparable non-derbies; long-run repeat attendance more stable than walk-up;
  core segment less elastic than casual.

*Citations 3:* [1] codurance.com/.../testing-legacy-code-with-golden-master ·
[2] sitepoint.com/golden-master-testing-refactor-complicated-views ·
[3] en.wikipedia.org/wiki/Characterization_test ·
[4] blog.thecodewhisperer.com/.../surviving-legacy-code-with-golden-master-and-sampling ·
[5] stevenschwenke.de/whatIsTheGoldenMasterTechnique ·
[6] fabrizioduroni.it/.../golden-master-test-characterization-test-legacy-code ·
[7] understandlegacycode.com/blog/characterization-tests-or-approval-tests ·
[8] github.com/chicio/Golden-Master-Testing-Characterization-Test

## How this feeds the synthesis

- Calibration-to-distributions + golden baseline + drift detection → soak-test method
  and the **evidence-acceptance gate** (§ synthesis).
- Concentration metrics (HHI/CR4/Gini) → anti-runaway KPI & healthy band.
- KPI bands + UEFA 70% line → the KPI healthy/warning/critical table.
- Stress framework + reverse stress + shock magnitudes → the forward + reverse scenario
  matrix and shock parameter bands.
- Attendance elasticity → fan-demand scenario priors (loyal vs fair-weather, derby spike)
  and the monotonicity invariants for the runbook.

## Related

- [[../economy-calibration-and-soak-test-scenarios-2026-06-01]] — synthesis this backs
- [[../ai-club-economy-behaviour-2026-06-01]] — archetypes/dampers being calibrated
- [[../top5-country-economy-profiles-2026-05-29]] — country profile bands
- [[../club-financing-tools-2026-06-01]] — financing/insolvency surfaces
- [[../fan-demand-price-elasticity-2026-05-28]] — demand model the elasticity priors refine
- [[../determinism-and-replay]] — RNG streams / determinism rules for fixtures
- [[../pre-mortem/PM-2026-05-20-16-test-strategy-depth]] — existing soak harness
