---
title: Economy Calibration and Soak-Test Runbook - Draft
status: draft
tags: [implementation, economy, calibration, soak-test, stress-test, determinism, testing, kpi, fmx-52]
created: 2026-06-01
updated: 2026-06-05
type: implementation
binding: false
linear: FMX-52
related:
  - [[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[../60-Research/ai-world-drift-algorithm-2026-06-03]]
  - [[../60-Research/ai-club-economy-behaviour-2026-06-01]]
  - [[../60-Research/top5-country-economy-profiles-2026-05-29]]
  - [[../60-Research/determinism-and-replay]]
  - [[../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
  - [[../50-Game-Design/economy-system]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[club-economy-accounting-ledger]]
  - [[club-economy-commercial-contracts]]
---

# Economy Calibration and Soak-Test Runbook - Draft

Executable-intent companion to the research synthesis
[[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]]. It specifies
**how** the economy is calibrated and soak-tested: fixtures, seeds, the harness contract,
invariants, the golden baseline + drift detection, and the parameter/scenario sheets that
feed the evidence gate. **No final constants here** — this is the method and the schema;
values live in data and pass the gate before acceptance. Phase note: this is a `draft`
runbook in the research phase, not a build instruction yet.

## 1. Determinism contract (inherited, do not re-litigate)

- All randomness draws through named **PCG32** streams (`pure-rand`) with deterministic
  seed derivation; **no `Math.random` / `Date.now()`** in logic
  ([[../60-Research/determinism-and-replay]]).
- Economy/world streams: `WorldRng`, `WorldAiMgmtRng` (AI club finance via
  `worldAiMgmt:club:<id>:finance:*`), plus the match/weather/injury/transfer streams.
- Money = integer minor units; ratios/probabilities = basis points (ADR-0050).
- Weekly ledger tick is the authoritative unit; monthly/season are aggregations
  ([[../50-Game-Design/economy-system]] §2).
- **Soak runs are deterministic:** same engine version + same seed + same config ⇒
  byte-identical summary. This is what makes golden-baseline diffing meaningful.

## 2. Deterministic fixtures

A **fixture** = a canonical club + a fixed fixture list (league + cups) + a fixed seed (or
no RNG) + an explicit scenario-variable override set. **All shocks are explicit scenario
variables, never random draws** — that is what keeps stress tests reproducible.

Canonical club archetypes (from the research synthesis §8):

| Archetype | Net debt | Wage/turnover | Profile notes |
|---|---|---|---|
| Healthy low-debt mid-table | ~0–0.2× | ~55–60% | strong ST base, moderate fair-weather |
| High-debt ambitious | ~1.0–1.5× | ~75–90% | relies on league position / promotion to service debt |
| Parachute-dependent recently-relegated | high yr1 (parachute) | near top-tier, partly restructured | very sensitive to failure to promote in 2–3y |
| Small matchday-dependent | low | moderate | matchday 40–50% of turnover; attendance-shock fragile |

Each archetype × `CountryEconomyProfile` (terrace-volume / premium-broadcast /
bimodal-giant-tail / municipal-constrained / ex-ante-policed / neutral-baseline) × scenario
(baseline / adverse / severely-adverse) yields a fixture. Scenario variables include:
league outcome (promo/survive/relegate), attendance shock %, sponsor shock + replacement
lag, parachute schedule, cup progression, wage-stickiness, injury load.

## 3. Soak-test harness contract

Three tiers (research synthesis §7), extending the existing `soak:50y`
([[../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]]):

| Command (intent) | Horizon | Cadence | Budget | Gate |
|---|---|---|---|---|
| economy smoke | short | every PR | ≤2 min | 32 curated smoke seeds; invariants + determinism hard-fail |
| `soak:50y` (economy gate) | 50 seasons | nightly / CI | ≤15 min (4 vCPU) | golden-baseline drift check |
| `soak:100y` (deep) | 100 seasons | release candidate / major economy change | extended | drift + concentration-trend check |

Each run emits a **summary vector** (not raw state) per season and aggregate:

- club finances by season (cash, wage bill, transfer spend, debt, DSCR, runway);
- KPI distributions (wage/revenue, squad-cost, debt/revenue) — median + 95th pct;
- attendance distribution; promotion/relegation counts; insolvency/administration events;
- inflation indices (wage, transfer-fee); prize/commercial totals;
- concentration indices (title HHI, CR4, revenue Gini), rolling 10y/30y.

Strip incidental noise (timestamps, ordering, UUIDs, float formatting) before diffing.

## 4. Invariants & metamorphic relations (hard-fail)

**Property invariants** (must always hold, exact where deterministic):

- **Accounting identity** — cash deltas reconcile exactly across all transactions; balance
  identity holds; period total = Σ weekly facts.
- **No money creation** — total money changes only via explicit modelled injections/sinks
  (Investor grant, prize, owner support); no leak.
- **Non-negativity & capacity** — attendance/revenue/wages ≥ 0; cash < 0 only where
  overdraft is modelled; `0 ≤ attendance ≤ capacity`.
- **Determinism under seed** — same seed + config ⇒ identical summary.
- **Aggregation consistency** — Σ club revenue = league revenue; ticket revenue =
  attendance × effective price (less discounts, capped by capacity).

**Metamorphic relations** (output changes predictably under input transform):

- scale-up: ×k all monetary state ⇒ totals ×k (scale-invariant logic);
- attendance uplift: ↑attendance ⇒ matchday revenue does not fall;
- capacity ceiling: demand > capacity ⇒ attendance not above capacity;
- price–demand: ↑ticket price ⇒ attendance weakly ↓ (elasticity ~−0.2…−0.8);
- performance shock: ↑form ⇒ demand weakly ↑ (stronger for marginal fans);
- promotion/relegation: revenue base & schedule move in the expected direction.

## 5. Golden baseline & drift detection

- Commit a **golden baseline summary** per smoke seed + a baseline distribution per sweep
  (e.g. `goldens/soak-baseline-v<engine>.json`).
- **Compare:** exact-match deterministic integers/identities; abs+rel **numeric tolerance**
  for floats; **distributional** tests for stochastic aggregates.
- **Drift detection:** per-metric **control charts** across CI runs; **Mahalanobis
  distance** on the correlated summary vector (revenue, attendance, wage/revenue, debt,
  concentration) with a >3σ fail; **KS test** across large seed sweeps. Drift report as a
  PR artifact.
- **Policy:** fail hard on invariant violation; **warn** on numeric drift beyond tolerance;
  **baseline updates require explicit approval** (so intentional balance changes are caught,
  not silently absorbed). No silent caps — `log()` anything a bounded run drops.

## 6. Seed strategy

| Seed set | Size | When | Purpose |
|---|---|---|---|
| smoke | 32 | every PR | fast determinism + invariant coverage |
| regression | grows | every PR | seeds that previously exposed a bug/balance regression |
| sweep | hundreds–thousands | nightly / release | distributional drift detection |
| stratified | curated | nightly / release | high-scoring / low-attendance / promotion-heavy / debt-prone regimes |

## 7. Parameter sheet (per constant)

Every calibrated constant carries a sheet; the evidence gate
([[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] §3) reads it.

```yaml
parameter:
  id: <stable-key>                     # e.g. wageRatio.warningBp
  definition: <what it controls>
  value: <current>                     # integer minor units / basis points
  band: [low, high]                    # evidence-justified range
  source: <data | literature | expert> # with reference
  lastChanged: YYYY-MM-DD
  rationale: <why this value>
  sensitivity: <verdict-stable | parameter-sensitive>
  profileOverrides: { <countryProfileId>: <value>, ... }   # optional
```

## 8. Scenario sheet (per stress scenario)

```yaml
scenario:
  id: <stable-key>                     # e.g. relegation.fairWeather.severe
  narrative: <one-line>                # "relegation yr1, parachute, failed promotion,
                                       #  fair-weather attendance 95%->65%, no cup run"
  archetype: <canonical club>
  countryProfileId: <profile>
  severity: <baseline | adverse | severelyAdverse>   # ~percentile intent
  overrides: { attendanceShockPct: ..., sponsorShockPct: ..., parachute: ... }
  fixture: { fixtureListId: ..., seed: ... }
  expect:
    kpiBands: { wageRatio: healthy|warning|critical, runwayWeeks: >=8, dscr: >=1.0, ... }
    verdict: pass | fail
  type: forward | reverse
```

For **reverse** scenarios, `overrides` is the **frontier shock combination** the backward
search found (the minimum combo that tips survival → failure); these become regression
scenarios and inform damper tuning.

## 9. World-drift extension (FMX-91)

FMX-91 adds the AI World Simulation parameter families from
[[../60-Research/ai-world-drift-algorithm-2026-06-03]] and draft
[[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]. This runbook owns final
values; FMX-91 only defines the shape.

Additional parameter-sheet families:

```yaml
parameter:
  id: worldDrift.risingRival.titleVacuumSeasons
  definition: Seasons without a serious regional top-tier title challenger before a Rising Rival candidate can enter pending state.
  value: null
  band: [low, high]
  source: real-world competitive-balance evidence + 50y soak target
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: worldDrift.giantCollapse.instabilityThreshold
  definition: Candidate score threshold combining wage burden, owner fatigue, age profile, missed continental revenue and instability_score.
  value: null
  band: [low, high]
  source: FMX-91 + late-game-systems takeover model
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: worldDrift.continentalEra.reputationDeltaBp
  definition: League/region reputation-band delta applied by a ContinentalEraShifted event.
  value: null
  band: [low, high]
  source: coefficient and league-strength drift evidence
  sensitivity: parameter-sensitive
```

Additional scenario sheets:

```yaml
scenario:
  id: worldDrift.risingRival.longTitleVacuum
  narrative: "A region has no serious challenger for a decade; AI World may seed one rising-rival project inside global MVP caps."
  archetype: healthy low-debt mid-table
  countryProfileId: neutral-baseline
  severity: baseline
  overrides: { titleVacuumSeasons: "<band-edge>", marketSizeBand: "mediumPlus" }
  fixture: { fixtureListId: "<ai-only-50y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { titleConcentration: inBand, eventDensity: inBand, wageRevenueGini: inBand }
    verdict: pass
  type: forward
```

```yaml
scenario:
  id: worldDrift.giantCollapse.overextendedDynasty
  narrative: "A successful high-wage club misses revenue and enters visible crisis rather than staying permanently dominant."
  archetype: high-debt ambitious
  countryProfileId: premium-broadcast
  severity: adverse
  overrides: { wageBurden: "<high-band>", ownerFatigue: "<high-band>", squadAge: "<high-band>" }
  fixture: { fixtureListId: "<ai-only-50y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { eventDensity: inBand, titleChurn: inBand, administrationRate: inBand }
    verdict: pass
  type: reverse
```

Additional health metrics:

- byte-identical `WorldDrift*` event sequence for same seed + config;
- event density and diversity by mechanism;
- title concentration and new-champion frequency over 30/50/100 years;
- league/revenue/wage Gini before and after drift events;
- continental-era volatility by 10-year rolling window;
- no ledger mutation by AI World Simulation events.

## 10. Dynasty board & ownership extension (FMX-89)

Banded parameters + soak scenarios for the dynasty board-ambition, ownership-
transition and bankruptcy/administration FSMs
([[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]] /
[[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]). All values `null` here;
the evidence gate sets them behind `dynastyModelVersion`. Determinism: board ladder
is RNG-free; ownership/insolvency draws use `WorldAiMgmtRng` (ADR-0079 §D3).

```yaml
parameter:
  id: dynasty.board.expectationRatchetTiers
  definition: Max tier change to next-season board expectation after over/under-performance (8-tier ladder).
  value: null
  band: [1, 1]                         # locked direction: ±1 tier/season (DB8); band confirms invariant, not tuned
  source: ai-manager-behaviour §10.5
  sensitivity: verdict-stable
```

```yaml
parameter:
  id: dynasty.board.confidenceDecayPerWinlessRun
  definition: Confidence decrement per match in a winless run while below the expectation band.
  value: null
  band: [low, high]
  source: ai-manager-behaviour §9.1 + real-world board-ladder research (FMX-89)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.board.voteOfConfidenceWindowMatches
  definition: Length of the override-objective window granted at the board-confidence meeting before a hard cutoff.
  value: null
  band: [low, high]
  source: FM 2-phase sacking precedent (FMX-89 games research)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.ownership.instabilityTakeoverThreshold
  definition: instability_score (financial_stress + performance + ownership tenure/satisfaction) at/above which a club becomes a takeover candidate.
  value: null
  band: [low, high]                    # late-game-systems §6.3 sketch: >=3
  source: late-game-systems §6.3 + FMX-89 real-world research
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.ownership.takeoverCapPerLeagueSeasons
  definition: Minimum seasons between meaningful takeovers within one league (cooldown cap).
  value: null
  band: [5, 7]                         # late-game-systems §6.3 baseline
  source: late-game-systems §6.3
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.ownership.globalTakeoverCapPerSeason
  definition: Max meaningful takeovers worldwide per season (anti-chaos global cap).
  value: null
  band: [low, high]                    # late-game-systems §6.3 baseline ~2
  source: late-game-systems §6.3
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.ownership.archetypeBudgetMultiplierBp
  definition: Per-archetype wage/transfer budget multiplier bands applied on ownership change (Foundation..Petrol-State).
  value: null
  band: [low, high]
  source: late-game-systems §6.2 archetype tables
  sensitivity: parameter-sensitive
  profileOverrides: {}
```

```yaml
parameter:
  id: dynasty.bankruptcy.administrationPointsDeduction
  definition: League points deducted on entering administration.
  value: null
  band: [-15, -9]                      # EFL real anchor -12; magnitude = calibration
  source: FMX-89 real-world administration research (EFL/PL)
  sensitivity: verdict-stable
```

```yaml
parameter:
  id: dynasty.bankruptcy.embargoWageCapPct
  definition: Wage-cap (% of revenue) enforced under transfer embargo / administration.
  value: null
  band: [low, high]                    # late-game-systems §6.4 ~40-50%
  source: late-game-systems §6.4 + EFL SCMP research
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.bankruptcy.fireSaleValuationDiscountBp
  definition: Valuation discount AI buyers receive on administrator fire-sale players.
  value: null
  band: [low, high]
  source: FM administration behaviour (FMX-89 games research)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: dynasty.owner.resistanceModifierBp
  definition: Continuous archetype-resistance modifier on structural-event probability from the owner trait vector (suppress for stable, amplify for reckless).
  value: null
  band: [low, high]                    # generalises ai-manager-behaviour §4.3 drift caps (±0.2/±0.25)
  source: ai-manager-behaviour §4.3 + FMX-89 determinism research
  sensitivity: parameter-sensitive
```

Soak scenarios (board/ownership/bankruptcy cadence + diversity KPIs):

```yaml
scenario:
  id: dynasty.ownership.takeoverCadenceDiversity
  narrative: "Over a 50y AI-only run, takeovers respect caps/cooldowns and span a diverse archetype mix (no single-archetype monoculture)."
  archetype: mixed-league
  countryProfileId: neutral-baseline
  severity: baseline
  overrides: { takeoverCapPerLeagueSeasons: "<band-edge>", globalTakeoverCapPerSeason: "<band-edge>" }
  fixture: { fixtureListId: "<ai-only-50y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { takeoverDensity: inBand, archetypeDiversity: inBand, takeoverCapBreaches: 0 }
    verdict: pass
  type: forward
```

```yaml
scenario:
  id: dynasty.bankruptcy.administrationRecoveryArc
  narrative: "An overextended club enters administration (points hit + embargo + fire-sale) and either is rescued or survives — never silently disappears (liquidation reserved)."
  archetype: high-debt ambitious
  countryProfileId: premium-broadcast
  severity: adverse
  overrides: { wageRevenueRatio: "<high-band>", cashRunway: "<low-band>" }
  fixture: { fixtureListId: "<ai-only-50y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { administrationRate: inBand, rescueVsLiquidationSplit: inBand, ledgerWritesOutsideClubMgmt: 0 }
    verdict: pass
  type: reverse
```

Additional health metrics:

- byte-identical board/ownership/insolvency event sequence for same seed + config;
- board-confidence escalation/sacking transitions reproduce with **no** RNG draw;
- expectation ratchet never exceeds ±1 tier/season;
- takeover density + archetype diversity over 30/50/100 years (anti-flatline KPI);
- administration rate + rescue-vs-(reserved)liquidation split;
- no ledger mutation outside Club Management; no `WorldAiMgmtRng` draw outside declared labels.

## 11. Flatline-investigation extension (FMX-90)

The dynasty engagement-flatline investigation (gap **G2**, E5-2c) instruments where a
long save collapses into **late-game solved-state / runaway-leader degeneracy**
*before* any late-game threshold is treated as final. Method + metric-input rationale:
[[../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]. Decisions
(Nico, 2026-06-05): **full KPI battery**, **reuse 50y + 100y tiers**, persist raw
prestige-input facts + version the formula. All KPIs are pure derivations of committed
facts/read-models — **no new RNG, no new event**. The human-facing target metric is
**Save-Age-at-Abandonment** (live telemetry); until a build exists the structural
proxies below are the instrument and SAA is the **validation anchor** they are later
calibrated against. All bands `null` here — magnitudes are FMX-52 calibration.

KPI-catalogue extension (per season, computed for the player/bot club in the headless
soak; league-balance indices computed **with and without** the human club):

```yaml
parameter:
  id: flatline.kpi.clubDominanceIndexFlagBand
  definition: CDI = percentile of club squad-strength (rating+depth+wage+value) in its league; sustained-dominance flag band.
  value: null
  band: [low, high]                    # e.g. CDI>=~0.9 sustained N seasons = flag
  source: competitive-balance + sim prior art (FMX-90 research)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: flatline.kpi.earlyTitleLockinMatchdayBand
  definition: ETL = earliest matchday with realised title prob >95%; shrinking ETL over seasons marks runaway dominance. Band defines the flag.
  value: null
  band: [low, high]
  source: FMX-90 research (title-probability concentration)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: flatline.kpi.meaningfulMatchRateDelta
  definition: delta by which a result must move a key outcome probability to count a match as "meaningful" (drives MMR).
  value: null
  band: [low, high]
  source: FMX-90 research (meaningful-match fraction)
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: flatline.kpi.boardObjectiveDifficultyTrivialBand
  definition: BODR = median pre-season success prob of active board objectives (FMX-89 BoardExpectationSet); ->1.0 = trivial board pressure.
  value: null
  band: [low, high]
  source: FMX-90 research + FMX-89 board ladder
  sensitivity: parameter-sensitive
```

```yaml
parameter:
  id: flatline.kpi.dynastyDominanceScoreBand
  definition: DDS = normalised composite of CDI + FinancialRunawayIndex + dynasty streaks + title HHI over a sliding window; high = solved dynasty.
  value: null
  band: [low, high]
  source: FMX-90 research (composite anti-flatline indicator)
  sensitivity: parameter-sensitive
```

> Full battery (also instrumented, bands per FMX-52): **save-level** —
> Outcome-Uncertainty Index, Meaningful-Match Rate, Transfer-Market-Activity Index,
> Financial-Runaway Index, Event-Diversity Index; **league-balance** — title HHI,
> Gini of points, Noll-Scully, dynasty streaks; **composites** — Decision-Density
> Index, Meaningful-Objective Count. Dynasty-volatility inputs reuse the §10 FMX-89
> event surface (`BoardConfidenceChanged`, `ManagerSacked`, `OwnershipTransition*`,
> `AdministrationEntered`, `ClubRescued`, `ManagerAbandonedClub`).

Flatline scenarios (Standard `soak:50y` + Deep `soak:100y` tail; observation
seasons 1-10 with mid/late-season checkpoints):

```yaml
scenario:
  id: dynasty.flatline.dominanceRunaway
  narrative: "A user-strength club is tracked over a 50y dynasty; the KPI battery locates where outcome-uncertainty and decision-density collapse (the season 4-6 flatline) so it is measured before any late-game tuning."
  archetype: healthy low-debt mid-table
  countryProfileId: neutral-baseline
  severity: baseline
  overrides: { botPlaystyle: minMaxer, observationSeasons: "1..10", checkpoints: "preseason|midseason|runIn" }
  fixture: { fixtureListId: "<player-club-50y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { flatlineLocusLocatable: true, proxyDiscriminatesPrePost: true, cdi: tracked, oui: tracked, etl: tracked, dds: tracked }
    verdict: pass
  type: forward
```

```yaml
scenario:
  id: dynasty.flatline.tailStaleness
  narrative: "Deep 100y tail run checks whether FMX-89 board/ownership/bankruptcy + FMX-91 world-drift keep the save volatile, or whether DDS saturates and event-diversity decays into long-run staleness."
  archetype: high-debt ambitious
  countryProfileId: premium-broadcast
  severity: baseline
  overrides: { botPlaystyle: minMaxer, observationSeasons: "1..100" }
  fixture: { fixtureListId: "<player-club-100y>", seed: "<worldSeed>" }
  expect:
    kpiBands: { ddsSaturation: inBand, eventDiversityDecay: inBand, titleChurn: inBand }
    verdict: pass
  type: reverse
```

Additional health metrics:

- byte-identical KPI summary vector for same seed + config (KPIs are pure derivations);
- the flatline **locus** (season where OUI/MMR/DDI collapse while CDI/DDS stay high)
  is reproducibly locatable across the seed sweep;
- the proxy set **discriminates** pre- vs post-collapse seasons (separation, not a
  tuned threshold);
- DDS / title-HHI computed with vs without the human club isolates human distortion;
- no new `*Rng` draw; no ledger mutation by the investigation harness.

> **Honest limitation (docs-only phase).** Save-Age-at-Abandonment, session-length-
> over-save-age and "reached season k" cohort retention need a running build +
> analytics consent. They are the human-validation layer the soak proxies are later
> calibrated against (FMX-52); the soak instrument is what ships now.

## 12. Acceptance flow (how a calibration set ships)

1. Fill parameter sheets (§7) and scenario sheets (§8).
2. Run economy smoke (PR) → invariants + determinism pass.
3. Run `soak:50y` (gate) and `soak:100y` (deep) → all KPI bands + failure signatures
   ([[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] §4–§6) in band
   at the value **and** at both band edges.
4. Run the ± sensitivity sweep → no scenario verdict flips (else flag parameter-sensitive).
5. Run forward + reverse scenario matrix (§8) and forecast validation
   ([[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] §9).
6. Drift report attached; baseline update (if intentional) explicitly approved.
7. **Nico sign-off** promotes the affected design-note draft → approved. No constant is
   "final" before this.

## Related

- [[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] — research synthesis (KPI bands, scenarios, gate)
- [[../60-Research/ai-club-economy-behaviour-2026-06-01]] — dampers/archetypes calibrated here
- [[../60-Research/top5-country-economy-profiles-2026-05-29]] — profile bands per fixture
- [[../60-Research/determinism-and-replay]] — RNG streams + save-determinism rules
- [[../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]] — existing soak harness extended
- [[../50-Game-Design/economy-system]] — KPIs / insolvency / calibration rules
- [[club-economy-accounting-ledger]] · [[club-economy-commercial-contracts]] — ledger/commercial contracts under test
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] · [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — ownership boundaries
