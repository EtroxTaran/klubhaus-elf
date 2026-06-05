---
title: "RAW - Dynasty flatline + prestige/HoF metric inputs"
status: raw
tags: [research, raw, perplexity, dynasty, flatline, engagement, prestige, hall-of-fame, legacy, kpi, soak-test, determinism, fmx-90]
created: 2026-06-05
updated: 2026-06-05
type: research
related:
  - [[../dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[../late-game-systems]]
  - [[../club-boss-analysis]]
  - [[../determinism-and-replay]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# RAW Perplexity capture - dynasty flatline + prestige/HoF metric inputs (FMX-90)

> Unprocessed research capture and source notes. Synthesised into
> [[../dynasty-flatline-and-prestige-metric-inputs-2026-06-05]].
> Do not implement from raw. Captured 2026-06-05 via Perplexity Sonar plus
> targeted vault review (late-game-systems, determinism-and-replay, the
> economy-calibration runbook, ADR-0051 and the FMX-89 ADR-0079/GD-0030 outputs).

## Prompt 1 - Locating a late-game engagement flatline (measurement method)

System: senior game-systems researcher. Be specific, cite concrete examples,
distinguish well-established practice from speculation; prefer concrete metrics,
named games and real analytics methods.

User: designing the measurement method for a "late-game engagement flatline" in
a long-save football management sim (FM/OOTP style, deterministic, replay-safe).
Players report saves get boring around season 4-6. Need to SPECIFY how to detect
and locate WHERE engagement collapses BEFORE tuning late-game numbers. Asked for:
(1) how long-save sims characterise + combat mid/late decay and the pattern name;
(2) measurable KPIs/instrumentation used to locate where a long session loses
engagement; (3) for a deterministic headless soak, computable proxies that
correlate with "a human would get bored here" and a credible soak horizon;
(4) real-world competitive-balance metrics (HHI/Gini/Noll-Scully) that translate
to sim KPIs. Asked for a citable shortlist of KPI definitions.

## Captured answer 1 - Summary

- **Pattern name.** The recurring failure is **runaway-leader / snowballing**
  into a **solved-state / decision-density collapse**: early advantage compounds
  into near-certain dominance, late game becomes low-uncertainty cleanup with few
  meaningful risky choices. Related framings: win-more / king-of-the-hill,
  diminishing novelty / event fatigue, trivialised constraints (money, depth,
  board objectives all "beaten"). Recommended explicit label for the spec:
  **late-game solved-state / runaway-leader degeneracy** — a phase of low
  outcome-uncertainty and low decision-density where most actions are trivial or
  highly predictable.
- **Prior-art design responses.** FM/CM: emergent long-horizon goals (club
  legends, dynamic rivalries, reputation shifts, board takeovers) + late-game
  friction (stricter board expectations as you win, ego/playing-time conflicts).
  OOTP: long-term league evolution (aging curves, caps, market shocks) prevents
  permanent superiority. CK3: success breeds NEW failure (succession crises,
  faction revolts, stress) — explicit anti-snowball. Civ: later-game threats +
  victory-sniping so the leader must actively defend.
- **KPIs to locate the collapse (real telemetry).** Save-Age-at-Abandonment
  (median season number at final match before N-day inactivity); session length /
  sessions-per-week vs save age; "reached season k" cohort retention (S1/S3/S5/S10
  instead of D1/D7/D30). These locate WHEN real players quit and anchor the soak
  proxies.
- **Intra-save structural KPIs.** Meaningful-Decision Rate (count of
  resource/probability-material decisions per period); Open/Meaningful-Objective
  Count (active goals with success prob in [0.2,0.8] — "in doubt"); Outcome-
  Uncertainty Index (entropy of the club's title/qualify/midtable/relegation
  distribution); Club-Dominance Index (squad-strength percentile in league);
  Title-Probability Concentration; Upset Rate / Brier of the human club's matches;
  Event-Novelty Rate; Feature-Adoption over save age.
- **Headless soak proxies (deterministic).** Run scripted bot playstyles
  (min-maxer / roleplayer / churner), compute per season: Club-Dominance Index
  (CDI>=0.9 for 3+ seasons = flag); Early-Title-Lock-in Matchday (earliest
  matchday title prob >95% and realised) + tension span; Outcome-Uncertainty Index
  (entropy); Match Predictability / Upset Rate (low Brier + tiny upset rate =
  auto-win territory); Transfer-Market-Activity Index (major transfers + key
  renewals/season); Board-Objective-Difficulty Ratio (median pre-season success
  prob → 1.0 = trivial); Financial-Runaway Index (wage-ratio × value-ratio vs
  league median); Event-Diversity Index. Calibrate proxies to real abandonment via
  survival/logistic models once telemetry exists.
- **Soak horizon.** At least ~10 seasons to see the 4-6 window plus a couple
  beyond; 30-50 seasons on a sample to catch late structural drift (finance
  inflation, super-regens, AI-balance collapse). Not every config needs 50y, but
  some must.
- **Real-world competitive-balance metrics → sim KPIs.** Title HHI (Σ share² over
  a rolling window, with and without the human club); Gini of titles or season
  points; Noll-Scully (σ_actual / σ_ideal-coin-flip) per season; points-spread /
  fraction-of-meaningful-matches in the run-in; consecutive-title / top-4 streaks.
  Composite **Dynasty Dominance Score** (CDI + FRI + streaks + HHI) flags a
  "solved dynasty"; **Decision-Density Index** (MDR normalised vs early seasons) +
  Meaningful-Objective-Count flag the classic strong-but-low-decision flatline.

## Prompt 2 - Prestige / HoF / legacy / era metric INPUTS

System: senior game-systems researcher specialising in sports-sim
meta-progression and legacy systems. Be specific; cite named games and real-world
award/record structures.

User: defining the METRIC INPUTS for a prestige / Hall-of-Fame / legacy system in
a long-save football sim (deterministic, 50-year dynasties, cross-save meta
read-only at world-gen). NOT locking numbers — need the INPUT SET feeding manager
prestige, HoF, club/player legend detection and "era" detection across and within
saves. Asked: (1) how FM / OOTP / CM / EA FC / NBA 2K MyNBA / EHM structure HoF +
reputation and what inputs feed each; (2) real-world football honours/records
input categories to mirror; (3) algorithmic "era detection" inputs (golden era,
dynasty, fallen giant, rising power); (4) which inputs are per-save run-end facts
vs cross-save aggregates, and best practice for keeping scoring stable as the
formula evolves.

## Captured answer 2 - Summary

- **Headline best practice.** Persist **raw atomic achievement facts** (trophies,
  seasons, caps, awards, longevity, dominance windows, resource-adjusted
  overperformance), **NOT** a pre-scored reputation number. Version the scoring
  formula separately so old saves can be deterministically re-evaluated when the
  model changes. Store context snapshots (league strength, club resources,
  competition tier at the time the achievement occurred). Separate immutable event
  logs from the mutable scoring layer; deterministic tie-breakers (season number,
  competition tier, chronological order).
- **Genre prior art (input families).** FM (manager reputation, club-legend
  status: trophies, league level, continental success, tenure, promotions/
  relegations, consistency, recognition); OOTP (HoF-style multi-factor: peak,
  career totals, awards, championships, longevity, rate stats); CM (results,
  league position, trophies, tenure); EA FC career (outcome/objective-driven);
  NBA 2K MyNBA (championships, playoff runs, MVP/All-NBA/All-Star, records,
  longevity, franchise milestones, explicit era framing); EHM (wins, trophies,
  league strength, longevity, development). Common families: trophies/titles;
  longevity; peak achievement; consistency (win%/PPG/top-k frequency); big-stage
  performance; development impact; club affinity (one-club/decades); relative
  overachievement (success vs budget/wage/value/expectation); recognition
  (MotY/MVP/best-XI/induction); historical records (most wins/goals/caps/streaks).
- **Real-world football honour/record categories.** Club trophies (league/cup/
  super/continental/world); promotion/survival milestones; individual awards
  (Ballon d'Or-style, MotY, top scorer, best XI); national-team honours
  (caps/captaincy/tournament medals); longevity records (most apps/seasons/
  longest-serving); statistical milestones (goals/assists/clean sheets/unbeaten
  runs); club-history status (legend/retired shirt/statue); era framing
  (golden generation / dominant era / rebuild / fallen giant / new power). Key
  design point: each is a SEPARATE input, never one blended "greatness" stat.
- **Era-detection inputs (windowed + trend + context).** Rolling title share;
  rolling points share; top-finish frequency; consecutive-title/top-4 streaks;
  quality-of-competition faced; resource-adjusted overperformance; reputation
  trajectory/slope; baseline-relative improvement; resource-to-success conversion;
  head-to-head/rival suppression. Labels: golden era (sustained high share +
  reputation growth); dynasty (repeated consecutive titles + rival suppression);
  dominant period (high points share + honours); fallen giant (high historical
  prestige + current underperformance vs baseline); rising power (sharp upward
  slope in results/reputation/resource-conversion). An era is a PERIOD
  classification (rolling window + trend break), not a lifetime rank.
- **Determinism split.** Per-save raw facts: season results, W/D/L, titles/awards,
  promotions/relegations, caps/goals/assists/clean-sheets, seasons managed/at-club,
  budget/wage/value/payroll-rank, per-season reputation snapshots, rival strength
  faced, head-to-head, trophy counts by tier. Cross-save aggregates (computed from
  raw): all-time manager prestige, multi-save HoF ranking, cross-save club-legend
  score, cross-save era index, greatest-seasons / record books. Best practice:
  persist raw not derived; `formula_version` on every scoring formula; keep old
  outputs if comparability needed; recompute on demand.

## Targeted source / vault checks

- Vault `late-game-systems.md` §2.1 (competitor career modes "die ~season 5"),
  §7 (3-layer Hall of Fame scoring formula + era detection + club/player-legend
  detection), §9.2 (determinism safeguard: sim reads nothing from the cross-save
  meta file once a save is created); used as the in-vault prior design this issue
  measures + supplies inputs for.
- Vault `club-boss-analysis.md` (retention failure modes: "end-game plateau —
  top of pyramid + huge cash pile + nothing to spend on"; product takeaway:
  ship end-game systems before launch so dynasty saves do not flatline).
- Vault `determinism-and-replay.md` §5 rule D8 (saves persist all mutable state
  needed to resume deterministically; no "derived from cache" shortcuts) and the
  RNG sub-label grammar (ADR-0018 §3; adding future sub-labels allowed, drawing
  from another subsystem's RNG forbidden).
- Vault ADR-0079 / GD-0030 (FMX-89): the board/ownership/bankruptcy event surface
  (`BoardConfidenceChanged`, `ManagerSacked`, `OwnershipTransitionTriggered/
  Resolved`, `OwnerExpectationResetApplied`, `AdministrationEntered`,
  `ClubRescued`, `ManagerAbandonedClub`) that feeds the dynasty-volatility KPIs.
- Perplexity also returned general game-analytics blog/industry sources for the
  KPI framing; these are used only as corroboration of standard practice, not as
  authoritative balance numbers (all magnitudes remain FMX-52 calibration).

## Nico decisions captured before synthesis (FMX-90, 2026-06-05)

| # | Decision | Selected |
|---|---|---|
| D1 | Flatline KPI / instrumentation depth | **Full battery** — instrument the complete KPI set (structural proxies + league-balance + composites), not a minimal proxy. |
| D2 | Soak horizon for the flatline scenario | **Reuse 50y + 100y tiers** — Standard 50-season soak (captures the 4-6 window + tail) + a Deep 100-season variant; primary observation seasons 1-10 with mid/late-season checkpoints. |
| D3 | Prestige/HoF metric-input scope handed to E6-3 | **Full taxonomy, MVP subset flagged** — hand E6-3 the complete input-category taxonomy; mark an MVP "captured-now" subset and the rest reserved-stub. |
| D4 | Determinism approach for the metric inputs | **Persist raw facts, version the formula** — atomic per-save run-end facts + context snapshots, versioned; E6-3 re-scores from raw; cross-save aggregation read-only-at-world-gen (D8 / §9.2). |
