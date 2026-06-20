---
title: Economy Calibration and Soak-Test Scenarios - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, calibration, soak-test, stress-test, balancing, kpi, insolvency, determinism, fmx-52]
context: club-management-economy
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-52
sourceType: external
related:
  - [[raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[ai-club-economy-behaviour-2026-06-01]]
  - [[top5-country-economy-profiles-2026-05-29]]
  - [[club-financing-tools-2026-06-01]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[cup-and-competition-revenue-profiles-2026-05-28]]
  - [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[determinism-and-replay]]
  - [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Economy Calibration and Soak-Test Scenarios - Research Synthesis 2026-06-01

## 1. Question & scope

The club economy is fully designed but **not yet calibrated**. FMX-13 set the weekly
ledger + staged insolvency spine; FMX-41 the commercial impact graph + contracts; FMX-42–48
the demand, season-ticket, contract, cup, matchday-cost, catering/merch and fan-campaign
layers; FMX-49 the financing tools; FMX-50 the Investor boundary; FMX-51 the AI-club
financial archetypes + anti-runaway dampers; FMX-53 the Top-5 + abstract
`CountryEconomyProfile`. **Every one of those notes deliberately left its numeric
thresholds, damper gains and balance targets open**, marked "FMX-52 calibration".

FMX-52 is the **calibration / soak-test capstone**. It does **not** invent final
constants. It defines:

- the **calibration workflow** and **evidence-acceptance gate** that turns banded ranges
  into accepted constants;
- the **KPI success/warning/critical bands** and **failure signatures** the soak tests
  assert;
- the **minimum deterministic scenario set** (forward) plus **reverse stress tests**;
- the **soak-test horizons & gating** (50-season gate + 100-season deep soak);
- the **Quick/Standard/Expert forecast-validation** method;
- the explicit **Open (Nico-gated)** residuals.

This beat is **synthesis**: it wires simulation-balancing, financial-stress-testing and
deterministic-testing best practice (grounded in
[[raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01]]) onto the
systems the vault already locked. The executable contract (fixtures, seeds, harness,
golden baseline, parameter sheet) lives in the companion runbook
[[../30-Implementation/economy-calibration-and-soak-test-runbook]].

## 2. Nico decisions carried in (confirmed this session)

1. **Deliverables** = this research note + the runbook + an economy-system §12 cross-link +
   a Current-State block. **No** new ADR/GDDR (fits accepted ADR-0050/0058; constants stay
   in data per economy-system §12).
2. **Soak horizons** = 32-seed PR smoke + **50-season** nightly/CI gate + **100-season**
   release-candidate deep soak (builds on the existing `soak:50y` in
   [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]).
3. **Insolvency target** = **tier-scaled** per-decade band (top ~2–5%, mid ~8–15%, lowest
   ~15–25% of clubs reaching administration) with a **no-cascade** invariant.
4. **Anti-runaway metric** = title **HHI + CR4** over rolling 10y/30y, max single-club
   title share <~25–30%/30y, **revenue Gini 0.35–0.50** secondary sanity bound.
5. **KPI bands** = research-anchored baseline (table in §4), shifted per tier/country
   profile.
6. **Constant-acceptance** = banded ranges + conservative defaults, accepted only via the
   **evidence gate** (§3).
7. **Stress method** = forward scenario matrix **+** reverse stress testing.
8. **Forecast validation** = tiered accuracy tolerance vs realized deterministic ledger
   (§9), with a "false-comfort" failure signature.

## 3. Calibration philosophy & evidence-acceptance gate

Calibrate to **target distributions, not single values** (e.g. "top-tier wage/revenue
median 55–65%, 95th pct < 85%, insolvency rare but nonzero"). All constants live in
**data** (economy-system §12), not in docs or code. A candidate constant is **accepted**
only when it clears the evidence gate — a direct port of regulated stress-test acceptance:

```
Accept constant θ only when:
 1. θ sits inside its evidence-justified band [θ_low, θ_high]
    (external data / literature, or conservative when data is sparse);
 2. soak KPIs stay in their healthy/target bands at θ AND at both band edges;
 3. no scenario pass/fail flips under a ± sensitivity sweep around θ
    — if it flips, label the scenario "parameter-sensitive" and gather more data;
 4. θ interacts consistently with related params (no knife-edge, no implausible combo,
    e.g. high wage-stickiness ⇒ no instant large wage cuts as a "management action");
 5. a parameter sheet is filled: definition · value · source · last-change date+rationale
    · sensitivity bounds.
 Nico sign-off then promotes the affected design note draft → approved.
```

Backtesting, sensitivity bounds, documented expert judgment, independent validation and
accounting-identity checks are the four evidence types. Recalibrate periodically as the
country-profile source data is refreshed. The **parameter sheet** and **scenario sheet**
templates are in the runbook.

## 4. KPI catalogue & success bands

These extend the KPI list in economy-system §7 with **healthy / warning / critical** bands.
They are the soak-test **pass/fail signatures**; tier and `CountryEconomyProfile` shift
them (e.g. England-like premium-broadcast tolerates higher wage ratios than a
municipal-constrained tail club; Championship-analogue tiers run hotter than the top tier).

| KPI | Healthy | Warning | Critical | Anchor |
|---|---|---|---|---|
| Wage / revenue | <60% | 60–75% | >75–80% | PL ~55–65%; >70–80% high risk |
| Squad-cost ratio | <70% | 70–85% | >85% | UEFA 70% squad-cost line |
| Debt / annual revenue | <0.6× | 0.6–1.0× | >1.0–1.5× | net debt/turnover peer bands |
| Cash runway | >26 wk | 8–26 wk | <8 wk | 6–12+ mo / 3–6 mo / <3 mo |
| Debt-service coverage (DSCR) | >1.25 | 1.0–1.25 | <1.0 | DSCR<1 = economic insolvency |
| Operating margin | ≈break-even+ | volatile | structurally negative | distress predictor |
| Overdue payables (tax/social, football-creditor) | none | curable | sustained arrears | licence-relevant |

Distress prediction ties failure to **low liquidity + high leverage + poor sporting
performance** simultaneously — warning logic must watch all three, not wage burden alone.
Bands are calibration inputs; final per-profile values pass through the §3 gate.

## 5. Failure signatures

The soak tests are not "does it run through" — they assert the **absence** of these
long-horizon failure modes, each with a measurable signal:

| Failure signature | Signal / assertion |
|---|---|
| Insolvency **cascade** | administration rate exceeds the §6 tier band, or correlated multi-club collapse in one division/decade |
| Runaway **wage/transfer inflation** | wage or fee index grows faster than league revenue over a rolling window; ratchet never relaxes |
| **Title / revenue monopoly** | title HHI rising decade-on-decade; CR4 climbing; one club >~25–30% titles/30y (§6) |
| Cash **hoarding / deflation** | AI clubs accumulate cash + freeze spending; transfer volume collapses; reserves grow without investment |
| **Narrative exhaustion** | too few distinct champions / promoted clubs; tactic-diversity entropy falls (ties to existing `templateBurnRate` & tactic-entropy soak asserts) |
| **False-comfort forecast** | a forecast tier shows "safe" while the club hits a critical KPI inside the forecast horizon (§9) |
| Memory / save drift | reuse the existing soak asserts: heap steady-state, save-size growth ≤3×, narrative burn ≤0.4, tactic entropy ≥1.8 bits |

## 6. Insolvency frequency & competitive-balance targets

**Insolvency (tier-scaled, per decade, share of clubs reaching administration):**

| Tier | Target band | Notes |
|---|---|---|
| Top tier | ~2–5% | rare, not impossible |
| Mid tiers | ~8–15% | several× top-tier |
| Lowest tier | ~15–25% | highest; fragile archetypes (over-leveraged, small matchday-dependent) most exposed |

Real anchors: ~20% of top-tier vs ~62.5% of bottom-tier clubs had an insolvency event
historically; distress tracks relative decline + leverage + liquidity. **No-cascade
invariant:** the anti-zombie hard survival floor + automatic austerity + conditional
rescue (FMX-51) prevent correlated collapse; a `Distressed` club must return to `Healthy`
within a bounded window (recovery over multiple seasons, not instantly).

**Competitive balance / anti-runaway (rolling 10-season and 30-season windows):**

- **Title HHI** — moderate, **not rising decade-on-decade** (HHI bands: <0.15 / 0.15–0.25
  / >0.25 from competition policy, repurposed for titles).
- **CR4 title share** — bounded; no permanent top-4 lock-in.
- **Max single-club title share / 30y** — < ~25–30% (no permanent dynasty from one
  windfall — the FMX-51 invariant).
- **Revenue Gini** — secondary sanity bound **0.35–0.50** (elite clubs exist, but neither
  a flat league nor a monopoly).

## 7. Soak-test method

Three tiers, layered on the existing harness ([[pre-mortem/PM-2026-05-20-16-test-strategy-depth]],
RNG/determinism from [[determinism-and-replay]]):

| Tier | Horizon | Cadence | Purpose | Gate |
|---|---|---|---|---|
| PR smoke | short | every PR | determinism + invariants hard-fail | 32 curated smoke seeds, fast |
| Standard soak | **50 seasons** | nightly / CI | obvious failures: inflation, insolvency cascade, broken promotion/relegation economics, oscillation | golden-baseline drift check |
| Deep soak | **100 seasons** | release candidate / major economy change | slow-burn: distribution drift, hoarding, title monopoly, narrative exhaustion | golden-baseline drift + concentration trend |

- **Calibrate to distributions** across **fixed seeds**; compare every build to a committed
  **golden baseline summary vector** (league/club finances, attendance distribution,
  wage/transfer/cash, promotion/relegation counts, inflation/prize totals, concentration
  indices). Strip incidental noise before diffing.
- **Drift detection:** exact-compare deterministic integers/identities; numeric tolerance
  for floats; **control charts** per metric across CI runs; **Mahalanobis distance** on the
  correlated summary vector; **KS test** across large seed sweeps. Fail hard on invariant
  violation; warn on numeric drift beyond tolerance; **baseline updates require explicit
  approval** so intentional balance changes are caught, not noise.
- **Seed strategy:** smoke (curated, fast) · regression (previously caught bugs) · large
  sweeps (hundreds–thousands, nightly/release) · stratified (high-scoring / low-attendance /
  promotion-heavy / debt-prone regimes). No silent caps — `log()` what a bounded run drops.

## 8. Deterministic scenario matrix (forward + reverse)

### 8.1 Forward scenarios (baseline / adverse / severely-adverse per archetype × profile)

Each scenario is a deterministic fixture (fixed fixture list + fixed seed/no-RNG; all
shocks are **explicit scenario variables**, not random draws), with a target KPI band and
pass/fail per §4–§6. The minimum set maps the FMX-52 scope list:

| # | Scenario | What it tests | Key KPI / assertion |
|---|---|---|---|
| 1 | Healthy mid-table club | baseline stability over 50y | KPIs stay healthy; no drift |
| 2 | Poor / small matchday-dependent club | matchday-shock fragility | survives baseline; runway never <8wk unprovoked |
| 3 | Promoted club | revenue jump (2–4× top step) + envelope growth | prudent keeps ratio; sugar-daddy escalates (per FMX-51) |
| 4 | Relegated club | revenue cliff (−50–60% top step); wage-cut clauses fire | England-like parachute cushions; over-leveraged risks distress |
| 5 | High-debt ambitious club | leverage + DSCR under stress | DSCR ≥1.0 unless shocked; no cascade |
| 6 | High-wage club | wage/revenue + squad-cost discipline | austerity triggers within bands |
| 7 | Loyal fan bad season | core-fan stickiness | attendance −10–15%; runway holds |
| 8 | Fair-weather collapse | marginal-fan elasticity | attendance −20–40% over two bad seasons; recovery on form |
| 9 | Derby / top-match spike | matchday upside | +20–50% matchday revenue; fixture multipliers 1.3–1.5× |
| 10 | Cup miracle | windfall reinvest by archetype | small club +10–20% turnover; routed per archetype, no hidden loss on exit |
| 11 | Early cup exit | forecast-shock handling | removes forecast upside, **not** a cash loss (FMX-45) |
| 12 | Catering/merch upside & downside | contract-margin swing | margin within band; stockout/markdown modelled |
| 13 | Sponsor breach & renewal risk | commercial-revenue shock | −10–15% turnover short-run, −5–10% steady-state; breach severity distribution |
| 14 | Debt recovery | restructure → return to Healthy | recovery within bounded window (non-zombie) |
| 15 | Insolvency frequency | tier-band realism | administration rate within §6 band; no cascade |
| 16 | Investor cash grant (SP only) | clean liquidity, no rule change | grant posts clean cash; negative weekly loop still burns it; never AI-held |
| 17 | AI wage inflation & debt behaviour | league-wide propagation | inflation & concentration stay bounded over 50–100y (FMX-51 dampers) |

### 8.2 Reverse stress tests (per archetype)

For each canonical archetype (healthy low-debt; high-debt ambitious; parachute-dependent
recently-relegated; small matchday-dependent), start from the **failure endpoint**
(`cash + committed credit < 0`, or DSCR < 1 for X periods, or sustained arrears) and
**search backward** (parameter grid) for the shock combination that just tips survival →
failure. Apply realistic frictions: **wage-stickiness** (only ~30–40% of wages auto-reduce
on relegation), **sponsor replacement lag** (1–2 seasons), **parachute decay** (≈55/45/20–25%
of prior top-tier share, stops on promotion). Output = the **frontier shock combinations**
per archetype → these become regression scenarios and inform damper tuning.

### 8.3 Shock-magnitude parameter bands (priors, gate-checked)

| Shock | Band |
|---|---|
| Relegation broadcast/central | −50–70% (absent parachute); total revenue −35–60% top step |
| Parachute cushion (England-like only) | ≈55% / 45% / 20–25% of prior top-tier central share, yrs 1–3 |
| Main sponsor loss | −10–15% turnover short-run; −5–10% steady-state after re-sign |
| Fair-weather attendance | −20–30% (relegation), → −30–40% after 2nd poor season |
| Loyal/core attendance | −10–15% on relegation |
| Cup dream run | small club +10–20% turnover; mid top-tier +3–7% |
| Derby / top-match matchday | +20–50% (fixture multiplier 1.3–1.5×; low-profile midweek 0.5–0.7×) |
| Matchday variable opex | ≈20–40% of matchday revenue + fixed floor; high-risk derby +10–20% security |

Fan-demand priors (from [[fan-demand-price-elasticity-2026-05-28]] + elasticity research):
price elasticity ~**−0.2…−0.8** (inelastic), income elasticity small positive, form effect
moderate (stronger for marginal fans), strong habit/season-ticket persistence; model
attendance as **sticky base (core/ST) + variable marginal (casual)**.

## 9. Quick / Standard / Expert forecast validation

The forecast surfaces (runway badge, 13-week `CashflowRunwayForecast`, Expert projections —
economy-system §8.1/§11) are validated against the **realized deterministic ledger** with a
tolerance that **tightens by tier**:

| Tier | Validated against realized ledger | Tolerance |
|---|---|---|
| Quick | runway **band** + weekly cash-delta **sign** correct | qualitative band/direction |
| Standard | 13-week net cash | within ~±10–15% |
| Expert | statement / projection / sensitivity | within ~±5% |

**Failure signature ("false comfort"):** any tier shows "safe" while the club hits a
critical KPI (§4) inside the forecast horizon. The tolerances are calibration inputs (gate
per §3); the *invariant* — no tier may give actively misleading guidance — is firm.

## 10. Anti-runaway / homeostasis tuning targets

Calibrate the FMX-51 dampers (progressive costs, revenue-indexed wage-growth caps,
reference pricing, solidarity/parachute pools, ROI decay, hard survival floor,
PI-controller mean-reversion) to these stability criteria:

- **Soft & lagged, state-dependent:** low proportional gain, small **capped** integral,
  long observation windows; stronger intervention for low-runway clubs.
- **Stability:** no persistent oscillation in wage/revenue or cash after the transient;
  shock recovery over **multiple seasons**; intervention **rare in normal play** (if the
  player "feels the hand", gains are too high); league returns toward target bands without
  erasing consequences; **liquidity protected first**, nominal profit second.
- **No-cheat invariant (regression):** disabling the dampers must change player and AI
  **identically** — no AI-only boost. Success = bounded concentration (§6) + bounded
  inflation (§5) over 50–100 seasons.

## 11. Evidence requirements (acceptance summary)

A calibration set is acceptable for Nico sign-off when, for every key constant: the
parameter sheet is complete (§3); the 50-season gate and 100-season deep soak pass with all
§4–§6 KPIs/signatures in band at the value **and** at the band edges; the ± sensitivity
sweep flips no scenario verdict (or flags it parameter-sensitive); and the forward +
reverse scenario set (§8) and forecast validation (§9) pass. Real external numbers
calibrate **scale only**; shipped content stays IP-clean and fictional
([[../50-Game-Design/economy-system]] §12, ADR-0007).

## 12. Open questions / Nico decisions (defaults applied; flag for review)

1. **Final constants** — by design accepted later via the §3 evidence gate + sign-off, not
   set here.
2. **Exact per-tier insolvency percentages** — start from the §6 ranges; confirm/adjust
   after first soak evidence.
3. **Homeostasis aggressiveness** — PI gains, soft-cap slopes, wage-growth caps remain
   tunables (carried from FMX-51); final numbers via the gate.
4. **Forecast tolerance exact %** — start from ±10–15% (Standard) / ±5% (Expert); confirm.
5. **Concentration window & threshold** — rolling 10y/30y and the ~25–30% max-title-share
   line are proposed; confirm the exact window/threshold.
6. **FMX-53 country profiles → draft ADR?** — carried from FMX-53 (whether the profiles get
   promoted to an ADR or stay research backing economy-system §9); out of FMX-52 scope,
   flagged here.

## Related

- [[raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01]] — raw transcript (3 passes)
- [[../30-Implementation/economy-calibration-and-soak-test-runbook]] — executable calibration/soak runbook
- [[ai-club-economy-behaviour-2026-06-01]] — archetypes + dampers being calibrated
- [[top5-country-economy-profiles-2026-05-29]] — `CountryEconomyProfile` bands that shift KPI bands
- [[club-financing-tools-2026-06-01]] — financing tools + runway/insolvency surfaces
- [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] — commercial cause layer being stress-tested
- [[club-economy-blueprint-2026-05-27]] — weekly-ledger + insolvency spine
- [[fan-demand-price-elasticity-2026-05-28]] — demand model the elasticity priors refine
- [[season-ticket-lifecycle-and-accounting-2026-05-28]] — IFRS 15 deferred-revenue scenarios
- [[cup-and-competition-revenue-profiles-2026-05-28]] — cup windfall / early-exit forecast shock
- [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] — matchday cost structure for scenarios
- [[determinism-and-replay]] — RNG streams / determinism rules for reproducible fixtures
- [[pre-mortem/PM-2026-05-20-16-test-strategy-depth]] — existing 50y soak harness this extends
- [[../50-Game-Design/economy-system]] — KPIs (§7), insolvency (§8), calibration rules (§12)
- [[../50-Game-Design/GD-0008-finance-economy]] · [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]] — design decisions calibrated
- [[../20-Features/feature-club-economy-mvp-pillar]] — economy MVP pillar
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] · [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — locked ownership boundaries
