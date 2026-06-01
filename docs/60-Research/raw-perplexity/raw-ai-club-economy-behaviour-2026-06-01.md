---
title: Raw Perplexity - AI Club Economy Behaviour 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, ai, ai-clubs, world-simulation, debt, wages, fmx-51]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-51
sourceType: perplexity
related:
  - [[../ai-club-economy-behaviour-2026-06-01]]
  - [[../ai-manager-behaviour]]
  - [[../transfer-market-simulation]]
  - [[../top5-country-economy-profiles-2026-05-29]]
---

# Raw Perplexity - AI Club Economy Behaviour 2026-06-01

This note preserves the FMX-51 research prompts and condensed raw outputs. It is
**input only — not implementation authority**. The synthesis is
[[../ai-club-economy-behaviour-2026-06-01]]. Several upstream decisions are already
**locked** and are not re-opened here: the AI architecture (utility-AI + FSM +
heuristic constraints, no AI stat cheats) and out-of-match per-club budget in
[[../ai-manager-behaviour]]; the AI sell model + tier fidelity in
[[../transfer-market-simulation]]; RNG streams in [[../determinism-and-replay]];
the `CountryEconomyProfile` in [[../top5-country-economy-profiles-2026-05-29]].
All numbers/ratio bands are external benchmarks, not final FMX constants — final
calibration is FMX-52.

## Prompt 1 - how management/sim games model AI-club economic behaviour

Football Manager, OOTP, EA FC / FIFA Career Mode, Anstoss / We Are Football /
Football Chairman, and broader sims (Capitalism Lab, Civ, Cities): how AI-controlled
teams set wage/transfer budgets, tolerate debt, react to promotion/relegation/cup
windfalls, whether AI clubs can go insolvent or are protected, and how runaway
dominance / "zombie" broke clubs are prevented. Plus design patterns for AI economic
archetypes, rubber-banding vs simulationist fairness, explainability, and
MVP-bounded AI.

### Condensed raw answer

- Existing games model AI clubs as **budget-constrained decision-makers with
  simplified financial rules**, not full accounting firms: AI gets a season budget,
  estimates wage capacity from income + squad size, spends within guardrails, and is
  usually **protected from total collapse** so the league keeps functioning.
- **Football Manager** — board-assigned transfer + wage envelopes; manager
  reallocates within them. Debt is board-managed/constrained, not freely
  accumulated. Promotion expands, relegation shrinks budgets; cup/Euro money raises
  next-cycle room. Clubs can get into trouble but the sim preserves league
  continuity (budget cuts, transfer restrictions, board action) rather than mass
  disappearance.
- **OOTP** — deepest economy: category budgets (ML/MiL payroll, scouting, dev) tied
  to owner, revenue, **market size**, performance. Large- vs small-market behaviour
  is distinct; revenue sharing + owner constraints prevent monopolisation; collapse
  usually contained.
- **EA FC / FIFA Career Mode** — opaque board transfer + wage budgets; spend driven
  by squad-rating optimisation, prestige, player rating/age/value/affordability.
  Debt not a visible strategic mechanic; AI effectively protected from insolvency.
- **Anstoss / We Are Football** — management-sim budgeted orgs; debt as a pressure
  system, not free-for-all; promotion/relegation adjust budgets; insolvency bounded
  to preserve playability. **Football Chairman**-type — explicitly cash-flow and
  solvency focused (negotiate with banks), survival-oriented.
- **Capitalism Lab** — firms allocate capital; **bankruptcy is a real, natural
  outcome** (market-competition fantasy, no league to preserve). **Civ / Cities** —
  abstract/system-light AI economies; player is the economic subject.
- **Design patterns:** small set of **policy archetypes** (aggressive spender /
  balanced operator / youth-development / survivalist / speculator); **hybrid**
  rubber-banding (rich keep structural edge, soft dampers stop snowballing, avoid
  obvious catch-up cheats); make AI decisions **explainable/observable** ("Promoted;
  wage budget increased"; "Debt threshold hit; transfer budget frozen") — magical AI
  reads as unfair, legible AI reads as strategy; keep AI **bounded but credible**
  (track cash, wage commit, transfer commit, debt, revenue forecast, board
  tolerance; 1-2 yearly budget recalcs; simulate insolvency rarely or block it if
  continuity matters more); **asymmetry with constraints** (big clubs spend more,
  small leaner, bad management hurts, but no single windfall = permanent
  invincibility). Sources: FM finance guides (fmscout), MWM Football Club Management,
  game-AI economy comparative study (scitepress 102123).

## Prompt 2 - real football-club financial decision archetypes + event reactions

Real-world financial-strategy archetypes (selling/player-trading, sugar-daddy,
prudent self-sustaining, over-leveraged gambler, yo-yo/parachute) with wage-to-turnover
ratios, transfer reinvestment, debt tolerance; how clubs react to promotion,
relegation, cup runs, European qualification, revenue shocks; how owner ambition +
patience drive decisions; how wage inflation propagates.

### Condensed raw answer

- **Selling / player-trading** (Brighton, Brentford, Benfica, Porto, Atalanta, Ajax):
  wage/turnover **55-70%**; reinvest **~50-70%** of net sale proceeds, ~10-20% to
  infrastructure; **low-moderate** debt (≤0.5-0.8x revenue). Sells when bid exceeds
  internal value; replaces one star with 2-4 high-upside buys.
- **Sugar-daddy** (pre-FFP Chelsea, Man City post-2008, PSG): wage/turnover
  **70-100%+** in build phase; aggressive net spend every window; debt = soft owner
  loans (often → equity) or equity-funded; tolerant of losses **while owner is
  committed**; pays wage premiums (20-50% above market) → drives league wage
  inflation.
- **Prudent self-sustaining** (Arsenal post-stadium, FSG Liverpool, Freiburg, Union
  Berlin): wage/turnover **50-65%** (UEFA <70% sustainability benchmark); reinvest
  **60-100%** of net sales over medium term, gradually; moderate long-term
  infrastructure debt (<1x revenue); cuts wage bill if revenue drops.
- **Over-leveraged gambler** (Leeds early-2000s, Málaga, Parma, many Championship
  promotion-chasers, Barça TV-rights leverage): wage/turnover **80-120%+**; 100% of
  sales + borrowing; high debt tolerance (1-2x+, secured on TV/gate/stadium,
  instalment chains, factoring future income); on shock → fire sales, late payments,
  administration risk.
- **Yo-yo / parachute** (Norwich, WBA, Fulham, Watford): parachute payments stepped
  over ~3 years cushion relegation; wage/turnover 60-85% in PL, 70-100% in 2nd tier
  with parachutes; relegation **wage-cut clauses (40-50%)** + release clauses;
  targets promotion within 1-3 seasons.
- **Event reactions** (intensity varies by archetype): **Promotion** → 2-4x revenue
  jump, wage inflation, parachute safety net; **Relegation** → >50-60% revenue cliff,
  relegation wage-cut/release clauses, fire-sale risk for the over-leveraged;
  **Cup run** → windfall → infra/reserves/debt-service (prudent), bonus spend
  (sugar-daddy), volatile so rarely structural; **European qual/loss** → big UCL
  uplift; over-leveraged often *assume* qualification and enter crisis on failure;
  **Revenue shock** (COVID, sponsor loss, sanctions) → player sales, cost cuts, wage
  deferrals, or owner top-up.
- **Owner ambition + patience** as two sliders: high ambition → push budgets, resist
  selling stars, bid aggressively (inflation); low patience → manager churn, panic
  buys, deadline overpaying, drift toward over-leveraged/sugar-daddy.
- **Wage inflation** propagates as a network effect: top spenders set the ceiling →
  positional/status benchmarks → league TV-money effects → cascade down the pyramid
  (parachute clubs inject PL-level wages into 2nd tier) → **ratchet** (wages rarely
  fall without relegation clauses / non-renewals / sales). Sources: lawinsport
  football-financing, Deloitte Money League, tandfonline 2024 profit-vs-sporting,
  PMC 10704374 club financial distress.

## Prompt 3 - AI architecture + long-run stability + rubber-banding + explainability + soak-testing

AI architectures for economic agents (rule-based vs utility AI vs behaviour trees vs
heuristics vs light optimisation) for an offline deterministic performance-budgeted
PWA simulating hundreds of clubs; anti-runaway + anti-zombie + inflation control over
50-100 seasons; rubber-banding acceptability; explainable AI; balancing/soak-test
methods.

### Condensed raw answer

- **Architecture:** layered **heuristic + utility** with a few explicit policies is
  the best default; a comparative study found a **rule-based system outperformed more
  complex / ML approaches** for controlling a simulated economy (scitepress 102123).
  Pattern = **policy gating + utility ranking** (rules pick mode: normal / austerity /
  investment / emergency; utility scores choose actions within mode) +
  **hierarchical decision frequency** (cheap per-season strategic updates; detailed
  transfer/wage recompute only on event triggers). Reserve behaviour trees for
  visibly staged processes ("panic mode"); use light optimisation sparingly on coarse
  intervals.
- **Anti-runaway** (use several small negative feedbacks, not one big nerf):
  progressive costs (elite wages/fees/agent commissions rise nonlinearly with
  wealth/success), luxury spending sinks, **soft caps** (rising marginal cost as
  payroll/debt rises), revenue normalisation / solidarity pools, competitive-balance
  tax, ROI decay on spend, promotion/relegation churn.
- **Anti-zombie:** minimum-viable-survival logic — hard floor budgets, automatic
  austerity mode, debt restructuring rules, conditional/rare owner rescue, protected
  minimum competitive spending, parachute relief. Use **three financial states:
  Healthy / Stressed / Distressed**.
- **Inflation control over 50-100 seasons:** index wages to league revenue (not peak
  transfers), cap annual wage growth per band, add transaction friction (agent/loyalty/
  signing fees, transfer tax), increase marginal supply (youth, loans, expiries),
  **reference pricing** (bid from market median not the single highest transfer),
  anchor negotiation ceilings to sustainable wage ratio. **Budget-ratio governance**:
  wages/forecast-revenue, transfer-spend/discretionary-cash, debt-service/guaranteed-income.
- **Mean-reversion / homeostasis:** elastic target bands, regime switching, multi-season
  moving averages, decay of advantage, league balancing pools, exogenous-shock smoothing.
  A **PI-controller-like** finance correction works: `aggressiveness = base + kp*error +
  ki*cumulative_error` (conservative gains avoid oscillation).
- **Rubber-banding:** acceptable when **diegetic** (solidarity/parachute payments,
  homegrown advantage, prestige decay, market saturation/diminishing returns) and
  applied **identically to player and AI**; immersion-breaking when it's invisible
  stat boosts / unexplained market hostility / disguised match-fixing. Prefer **soft
  catch-up via public-facing policy rules**, not hidden help-the-weak.
- **Explainable AI:** compute decisions as structured data → attach a small set of
  **explanation tags** → render into narrative templates (news items, board messages,
  scouting notes). Surface decision reason / policy state / constraint / trade-off;
  don't reveal thresholds or raw utility scores; keep explanations consistent. For a
  star sale, public reason ∈ {wage pressure, replacing aging value, squad balance,
  debt reduction, strategic rebuild}.
- **Soak-testing:** fixed-seed regression (golden seed) + wide-seed Monte-Carlo stress +
  scenario sweeps + event injection. **KPIs:** league cash/debt, avg wage/revenue,
  transfer-fee inflation index, insolvency rate, zombie count, title concentration
  (Gini), points-finance correlation, promotion/relegation churn, median squad value.
  **Failure signatures:** runaway inflation, capital hoarding, zombie trap, collapse
  spiral, dominance freeze, oscillation. Workflow: golden seed baseline → nightly seed
  batch → flag KPI-envelope drift → inspect worst seeds. **Guardrails first
  (no impossible states), calibration second, AI aggression last.** Sources: scitepress
  102123, machinations.io economy-design, FSI multi-agent references.

## Prompt 4 - regulatory rails that constrain financing/distress per country

(Shared with FMX-49; relevant subset for AI distress behaviour and per-country
profiles.) UEFA FSR (squad-cost ratio 90→80→70%, no-overdue-payables, football
earnings rule biased to equity not debt); England PL PSR (~£105m/3yr, **in-season
points deductions**) + EFL P&S + football-creditor rule + **automatic administration
points deduction**; Germany DFL preventive licensing (liquidity proof) + **50+1**
(no leveraged buyouts); Spain LaLiga **revenue-linked squad-cost cap** (debt reduces
the cap → self-penalising); France **DNCG** interventionist (transfer bans, wage caps,
administrative relegation for finances alone); Italy Serie A licensing →
**bankruptcy → restart down the pyramid**.

### Condensed raw answer

- Regulators push **equity over debt**, enforce timely payment of football creditors,
  and impose sporting sanctions (embargoes, points deductions, relegation) escalating
  with distress. Generic staged path: **warning → transfer/registration embargo →
  wage controls → administration → points deduction → liquidation**, with
  per-country thresholds + "personality":
  - **England:** debt-tolerant + owner injections, but strong football-creditor
    protection + **automatic points deduction on administration** + cautious on
    secured stadium borrowing.
  - **Germany:** **preventive licensing** (clubs rarely reach formal insolvency while
    in the top two tiers); **50+1** blocks leveraged takeovers; licence refusal →
    relegation is the big stick.
  - **Spain:** hard **revenue-linked salary cap**; high debt → lower cap →
    self-penalising; over-spend simply blocks registration.
  - **France:** **DNCG** very interventionist — routine transfer bans, wage caps,
    administrative **relegation for finances alone**.
  - **Italy:** more chaotic history; **bankruptcy → phoenix restart** lower in the
    pyramid is a realistic outcome.
  Sources: UEFA CLFSR 2025, morgansl FFP 2.0, swissramble, ESPN/Kaufcan FSR. (Full
  detail also archived for FMX-49.)
