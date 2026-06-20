---
title: Dynasty flatline investigation + prestige/HoF metric inputs
status: current
tags: [research, dynasty, flatline, engagement, prestige, hall-of-fame, legacy, era-detection, kpi, soak-test, determinism, manager-legacy, fmx-90]
context: manager-legacy
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
related:
  - [[raw-perplexity/raw-dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[late-game-systems]]
  - [[club-boss-analysis]]
  - [[determinism-and-replay]]
  - [[ai-world-drift-algorithm-2026-06-03]]
  - [[economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../50-Game-Design/GD-0010-ai-world]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Dynasty flatline investigation + prestige/HoF metric inputs (FMX-90)

Grounds FMX-90 / audit gap **G2** (E5 epic FMX-61; E5-2c, after FMX-89 board/
ownership/bankruptcy). Raw capture:
[[raw-perplexity/raw-dynasty-flatline-and-prestige-metric-inputs-2026-06-05]].

This note produces two things and **nothing else**: (a) a **flatline-investigation
method** (KPI battery + instrumentation + soak horizon), realised as an appendix to
the soak-test runbook; and (b) a **prestige/HoF/era metric-input hand-off spec** for
**E6-3 / FMX-95** (the awards/honours/records/Hall-of-Fame owner). It **does not**
edit ADR-0051, define a scoring formula, add a bounded context, or declare any new
`*Rng` — measurement and metric-input definition are pure. All magnitudes
(thresholds, bands, weights) are **FMX-52 calibration debt**, never locked here.

## 1. Problem

Gap **G2** flags an un-investigated "season 4-6 engagement flatline" that must be
**located and measured before** any late-game numeric tuning — locking thresholds
first risks tuning the wrong lever. The concern is named in the vault:
`club-boss-analysis.md` ("end-game plateau: top of pyramid + huge cash pile +
nothing to spend on"; "plan an end-of-pyramid loop so dynasty saves do not flatline
at the top") and `late-game-systems.md §2.1` (competitor career modes "die ~season
5"). The prestige / 3-layer Hall-of-Fame model (`late-game-systems.md §7`) and its
determinism safeguard (§9.2) are richly designed but **research-tier**.

The named failure mode (external + genre prior art) is **late-game solved-state /
runaway-leader degeneracy**: dominance compounds into low outcome-uncertainty and
low decision-density, so most late actions are trivial or predictable. The
investigation must find *where on the season axis* that collapse begins for our
specific systems, using computable proxies validated against real abandonment data
once telemetry exists.

**Ownership boundary (the reason FMX-90 exists separately from E6-3).** E5-2c
(this issue) defines the *measurement method* and *supplies the metric inputs*;
**E6-3 / FMX-95** is the **sole owner** of the ADR-0051 Manager & Legacy amendment
that adds cross-save HoF/records/prestige scoring. This avoids the prior
double-ownership of the same ADR amendment. ADR-0051 already lists "prestige/
challenge profile" in scope but at **contract-hook level only**; FMX-90 stays
strictly inside the measurement + input-definition lane.

## 2. Decisions recorded for FMX-90

Nico selected these planning choices live on 2026-06-05. Nothing here is binding;
the runbook stays `draft` and ADR-0051 is untouched.

| # | Decision | Landing |
|---|---|---|
| D1 | Flatline KPI / instrumentation depth | **Full battery.** Instrument the complete KPI set — save-level structural proxies + league-balance indices + engagement-approximation composites — not a minimal proxy. Breadth before tuning so the locus is unambiguous. |
| D2 | Soak horizon | **Reuse the existing 50y + 100y tiers.** The flatline scenario is a Standard `soak:50y` run (captures the 4-6 window + tail) with a Deep `soak:100y` variant for late staleness; primary observation seasons 1-10 with mid- and late-season checkpoints. No new harness infra. |
| D3 | Prestige/HoF metric-input scope handed to E6-3 | **Full taxonomy, MVP subset flagged.** Hand E6-3 the complete input-category taxonomy (manager-prestige / HoF-legend / era-detection inputs); mark an MVP "captured-now" subset and the remainder as reserved-stub. |
| D4 | Determinism approach for the metric inputs | **Persist raw facts, version the formula.** Inputs are atomic per-save run-end facts + context snapshots, versioned behind `legacyMetricInputVersion`; E6-3 owns scoring and re-scores from raw facts; cross-save aggregation read-only-at-world-gen (D8 / §9.2). |

## 3. Real-world takeaways

- **Competitive-balance is a measured quantity.** Sports economics already
  quantifies "a league/dynasty losing tension": **title HHI** (Σ share² over a
  rolling window), **Gini** of titles or season points, and the **Noll-Scully**
  ratio (observed σ of win% ÷ the σ of an idealised coin-flip league). These map
  directly onto sim KPIs computed per season, **with and without** the human club —
  the delta isolates the human's distorting effect.
- **Dominance has canonical signatures.** Consecutive-title and top-4 streaks,
  points-spread between ranks, and the **fraction of "meaningful" run-in matches**
  (results that still move the club's title/qualification/relegation probability)
  are how real competitions read tension. A dynasty going stale shows long streaks +
  collapsing meaningful-match fraction.
- **Honours/records are categorical, not a single score.** Real football greatness
  is told through separate categories — club trophies, promotion/survival
  milestones, individual awards, national-team honours, longevity records,
  statistical milestones, club-history status, era framing. The input model must
  mirror that category separation rather than blend into one "greatness" number.

## 4. Game and genre takeaways

- **The flatline is a known, named, addressed problem.** FM/CM counter it with
  emergent long-horizon goals (club legends, rivalries, reputation shifts, board
  takeovers) + late-game friction (rising board expectations as you win, ego/
  playing-time conflict). OOTP uses long-term league evolution (aging, caps, market
  shocks). CK3's design thesis is *success breeds new failure* (succession crises,
  factions). Civ adds late threats + victory-sniping. Our FMX-89 board/ownership/
  bankruptcy FSMs and FMX-91 world-drift are exactly this anti-snowball toolkit —
  FMX-90 measures whether they actually keep the save volatile.
- **Headless proxies for "a human would get bored here."** Genre-validated
  computable signals: **Club-Dominance Index** (squad-strength percentile; ≥0.9 for
  3+ seasons = flag), **Early-Title-Lock-in Matchday** (earliest matchday title prob
  >95% and realised — shrinking over seasons = runaway), **Outcome-Uncertainty
  Index** (entropy of the club's outcome distribution), **Match Predictability /
  Upset Rate** (low Brier + tiny upset rate = auto-win), **Transfer-Market-Activity
  Index**, **Board-Objective-Difficulty Ratio** (→1.0 = trivial), **Financial-
  Runaway Index**, **Event-Diversity Index**.
- **Legacy/HoF best practice: persist raw facts, version the formula.** Every
  surveyed sim that keeps long-run legacy stable stores **atomic achievement facts +
  context snapshots** and versions the scoring separately, so a balance change
  re-scores history rather than breaking old saves. This is precisely our
  determinism need (D4) and aligns with D8.

## 5. FMX design conclusions

### 5.1 Flatline KPI battery (D1 = full battery)

All KPIs are computed in the **deterministic headless soak** from already-committed
facts / read-models — **no new RNG, no new event**. The human-facing target metric
is **Save-Age-at-Abandonment**; in the docs-only phase it cannot be measured, so the
structural proxies below are the instrument and SAA is the **validation anchor** they
must later be calibrated against (an explicit honest limitation, mirroring FMX-100's
on-device-fps caveat). Bands (healthy/warning/critical, flag thresholds) are
**FMX-52 calibration**, not set here.

**(A) Save-level structural proxies** (per season, for the player/bot club):

| KPI | Definition (computable) | Source facts |
|---|---|---|
| Club-Dominance Index (CDI) | percentile rank of club squad-strength (rating + depth + wage bill + value) within its league | Squad & Player ratings; Club Management finance read-models |
| Outcome-Uncertainty Index (OUI) | entropy of the club's {title, continental-qual, midtable, relegation} probability distribution at season checkpoints | League Orchestration standings/odds projection |
| Early-Title-Lock-in Matchday (ETL) | earliest matchday where title prob >95% and the title is realised; + tension span (first >20% → >95%) | League standings projection |
| Meaningful-Match Rate (MMR) | fraction of the club's matches whose result moves a key outcome prob by > delta | League standings projection + Match results |
| Transfer-Market-Activity Index (TMAI) | count of major transfers + key contract renewals per season | Transfer summaries; Squad & Player contract facts |
| Board-Objective-Difficulty Ratio (BODR) | median pre-season success probability of active board objectives (→1.0 = trivial) | FMX-89 `BoardExpectationSet`; board-objective read-model |
| Financial-Runaway Index (FRI) | (club wage bill ÷ league-median wage) × (club value ÷ league-median value) | Club Management finance read-models |
| Event-Diversity Index (EDI) | distinct event/news/storylet templates experienced per season ÷ total events | Narrative/Notification event stream (presentation facts) |

**(B) League-balance indices** (system health, rolling 10/30/50y, computed
with **and** without the human club to isolate human distortion):

| KPI | Definition |
|---|---|
| Title HHI | Σ (per-club title share)² over the rolling window |
| Gini of points | Gini coefficient of final season-points distribution |
| Noll-Scully | σ(actual win%) ÷ σ(ideal balanced-league win%) per season |
| Dynasty Streaks (HDS) | longest run of consecutive titles / consecutive top-4 finishes |

**(C) Engagement-approximation composites:**

| KPI | Definition |
|---|---|
| Dynasty Dominance Score (DDS) | normalised composite of CDI + FRI + HDS + title HHI over a sliding window; high = "solved dynasty" |
| Decision-Density Index (DDI) | Meaningful-Decision Rate normalised against early-save (S1-2) baseline |
| Meaningful-Objective Count (MOC) | number of active objectives with success prob in [0.2, 0.8] |

**Dynasty-volatility coupling (reuses FMX-89).** The board/ownership/bankruptcy
event surface from ADR-0079 / GD-0030 directly feeds the anti-flatline read:
`BoardConfidenceChanged` + `ManagerSacked` (board-pressure trajectory / sacking
clustering), `OwnershipTransitionTriggered` / `OwnershipTransitionResolved` +
`OwnerExpectationResetApplied` (ownership churn / expectation reset),
`AdministrationEntered` / `ClubRescued` / `ManagerAbandonedClub` (crisis incidence +
heroic-save / abandonment decision points). The runbook §10 "takeover density +
archetype diversity over 30/50/100 years" line is already tagged *anti-flatline KPI*;
this battery generalises it.

### 5.2 Prestige / HoF / era metric-input taxonomy (D3 = full taxonomy, MVP-flagged)

Hand-off to **E6-3 / FMX-95**, which owns the scoring formula + records book + the
ADR-0051 amendment. Each input is tagged **[MVP]** (captured now) or **[stub]**
(reserved-stub definition, captured post-MVP). MVP captures what FMX-89/FMX-91/Match/
League/Transfer already emit; stubs reserve the surface so E6-3 never re-derives the
category set.

**Manager-prestige inputs:** major trophies won **[MVP]**; minor trophies **[MVP]**;
promotion / relegation counts **[MVP]**; win% / points-per-game **[MVP]**; average +
peak league finish **[MVP]**; seasons managed / seasons at one club (longevity)
**[MVP]**; continental performance **[MVP]**; resource-adjusted overperformance
(success vs wage/value/expectation, using FMX-89 `BoardExpectationSet`) **[MVP]**;
board-confidence trajectory + sacking history (FMX-89 `BoardConfidenceChanged` /
`ManagerSacked`) **[MVP]**; head-to-head vs rivals **[stub]**; player-development
output / youth promotions **[stub]**; managerial awards (MotY-style) **[stub]**;
club reputation delta while in charge **[stub]**.

**HoF / legend inputs:** career longevity **[MVP]**; championships **[MVP]**; career
totals + rate stats **[MVP]**; peak-season quality **[MVP]**; one-club / long-service
status **[MVP]**; individual awards + best-XI selections **[stub]**; national-team
caps / tournament appearances **[stub]** (depends on FMX-84 national-team arc);
club-record milestones (most apps/goals/assists; `late-game-systems.md §7.4` legend
detection) **[stub]**; signature achievements (invincible season, record points,
decisive finals) **[stub]**; era-relative dominance **[stub]**; peer-recognition /
testimonial events **[stub]**; induction-eligibility flag **[stub]**.

**Era-detection inputs** (windowed + trend + context; `late-game-systems.md §7.3`
"Golden/Resurgence Era" + §11.4 continental power-shifts): rolling title share
**[MVP]**; rolling points share **[MVP]**; top-finish frequency **[MVP]**;
consecutive title / top-finish streaks **[MVP]**; reputation-growth slope **[stub]**;
resource-adjusted success (efficiency vs payroll rank) **[stub]**; quality-of-
competition faced **[stub]**; historical-baseline deviation **[stub]**; volatility /
collapse-after-peak (fallen-giant marker; couples to FMX-91 giant-collapse + FMX-89
ownership transitions) **[stub]**; rival-suppression / head-to-head dominance
**[stub]**; window length + continuity, with trend-break markers for rise/fall
boundaries **[stub]**.

### 5.3 Determinism approach (D4 = persist raw facts, version the formula)

- **Persist atomic per-save run-end facts, not derived scores.** Each input is
  stored as a raw fact plus a **context snapshot** (league strength, club resources,
  competition tier at the time the achievement occurred), keyed deterministically.
  E6-3's scoring formula consumes raw facts and is free to evolve; a formula change
  **re-scores history** rather than breaking old saves. Carry a
  `legacyMetricInputVersion` on the input contract (separate from E6-3's
  `formula_version`).
- **Cross-save aggregation is read-only-at-world-gen.** Per-save facts feed
  cross-save aggregates (all-time prestige, multi-save HoF ranking, cross-save era
  index) that the running sim **never reads after creation**. Restating
  `late-game-systems.md §9.2` verbatim: *"simulation reads **nothing** from this
  meta file once a save is created … Legacy perks as **parameters at world-gen
  only**, not runtime dynamic input … same seed + same legacy configuration at
  creation → byte-identical world."* This is determinism rule **D8**
  (`determinism-and-replay.md §5`): *"Saves persist all mutable state needed to
  resume deterministically … No 'derived from cache' shortcuts."*
- **No new RNG.** Measurement (KPIs) and metric-input capture are pure derivations
  of committed facts; FMX-90 **declares no new `*Rng` sub-label** (ADR-0018 §3). The
  only randomness in the dynasty arc remains FMX-89's `WorldAiMgmtRng` draws, which
  FMX-90 only reads the *effects* of.

### 5.4 Runbook realisation (D2 = 50y + 100y)

The flatline-investigation plan lands as a new section in
[[../30-Implementation/economy-calibration-and-soak-test-runbook]] (§11), mirroring
its §8 scenario-sheet format and §3 three-tier harness: KPI-catalogue extension
(full battery, bands left `null` for FMX-52), a `dynasty.flatline.*` Standard
`soak:50y` scenario (observation seasons 1-10 + checkpoints) and a Deep `soak:100y`
tail variant. Pass criterion: the flatline locus is **locatable** and the proxy set
**discriminates pre- vs post-collapse seasons** — not a tuned threshold.

## 6. Open follow-ups

- **E6-3 / FMX-95** owns the ADR-0051 amendment, the prestige/HoF **scoring
  formula**, the records book and cross-save HoF persistence — consuming this input
  taxonomy. The `late-game-systems.md §7` formula (trophy values, multipliers,
  bonuses, legend-detection thresholds) is its raw material, not FMX-90's to lock.
- **FMX-52 calibration** owns every magnitude: KPI healthy/warning/critical bands,
  CDI/DDS flag thresholds, the `delta` for "meaningful match", soak observation
  windows and the survival-model coefficients that will calibrate proxies against
  real Save-Age-at-Abandonment once telemetry exists.
- **Live-telemetry follow-up.** Save-Age-at-Abandonment, session-length-over-save-age
  and "reached season k" cohort retention require a running build + analytics
  consent; reserved as the human-validation layer for the soak proxies.
- **E6-2 / FMX-94** (statistics & analytics read-model) is the natural compute home
  for several of these KPIs/inputs once the read-model owner is assigned; FMX-90
  defines the inputs, not the plumbing.
- **National-team inputs** (caps/tournament honours) depend on **FMX-84** scope;
  flagged `[stub]` until that arc is ratified.

## Related

- [[raw-perplexity/raw-dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
- [[late-game-systems]] — §2.1 flatline, §7 HoF/era model, §9.2 determinism safeguard
- [[club-boss-analysis]] — end-game plateau / retention failure modes
- [[determinism-and-replay]] — D8 + RNG sub-label grammar
- [[../30-Implementation/economy-calibration-and-soak-test-runbook]] — §11 flatline plan lands here
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] — consumer (E6-3 amends; not edited here)
- [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] — FMX-93: prestige/HoF metric inputs reference manager **style signals** (`ManagerStyleSignals`), **not** a named archetype taxonomy; no fixed manager-archetype list exists yet (G3, post-MVP).
- [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]] · [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]] — FMX-89 volatility event surface feeding the KPIs
- [[../50-Game-Design/GD-0010-ai-world]] — R2-06 late-game arc
- [[domain-model-audit-and-backlog-2026-06-02]] — gap G2; E5-2c vs E6-3 boundary
