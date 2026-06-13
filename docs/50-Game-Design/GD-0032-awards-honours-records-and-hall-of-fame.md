---
title: GD-0032 Awards, Honours, Records & Hall of Fame
status: accepted
tags: [game-design, gddr, awards, honours, records, hall-of-fame, legacy, prestige, dynasty, fmx-95]
created: 2026-06-06
updated: 2026-06-13
type: game-design
binding: false
linear: FMX-95
related:
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../60-Research/awards-honours-records-hof-owner-2026-06-06]]
  - [[GD-0019-manager-archetype-roguelite-progression]]
  - [[GD-0031-analytics-hub-and-statistics]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# GD-0032: Awards, Honours, Records & Hall of Fame

> **`draft` / `binding: false`.** Game-design model for FMX-95 (gap **G20**). Decisions
> D1–D4 were put to Nico live (2026-06-06, ask-first gate): D1=A extend Manager & Legacy ·
> D2=A per-save records + cross-save legends · D3=A raw facts + versioned formula · **D4=B
> full HoF in MVP** (Nico override of the recommended reserved-stub). All numeric magnitudes
> are **GD-0043 `legacy.hof` calibration debt**. Architecture in
> [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract|ADR-0083]];
> grounding in [[../60-Research/awards-honours-records-hof-owner-2026-06-06]]. **IP-safe
> naming applies** (GD-0015 / ADR-0007): every sample name below is fictional and illustrative.

## 1. Intent

Awards, honours, records and the Hall of Fame are the **payoff and memory layer** of a
long career and of the roguelite-dynasty arc (G2/G3). They answer "what did this manager,
this club, this player *achieve* — and does it last?" They feed manager prestige
(GD-0019), the late-game/dynasty arc, and cross-save legacy.

Design follows the prior-art **three-layer** model:

1. **Season awards** — yearly signals (cheap, frequent, motivating).
2. **Records book** — cumulative proof (per-save, factual).
3. **Legacy / Hall of Fame** — synthesis (who is a legend, in-world and across saves).

## 2. Layer 1 — Season awards (yearly signals)

Generated at season-end from the immutable `SeasonAnalyticsHandoffSnapshot` (FMX-94).
**Deterministic in-world.** Award *families* (IP-safe, fictional sample names):

| Scope | Award families (samples) |
|---|---|
| Club-internal | Player of the Season, Young Player of the Season, Goal of the Season, Most Improved, Academy Player of the Season |
| Domestic league | League Player of the Season, Young Player, Goalkeeper, positional (DEF/MID/FWD), **Gaffer of the Season**, Golden Boot (top scorer), Playmaker (assists), **Team of the Season (Best XI)**, Player/Manager of the Month |
| Continental | Continental Player / Young Player / Keeper / Coach of the Year, Continental Best XI, competition MVP |
| Global | World Player / Young Player / Keeper / Coach of the Year, Global Best XI, tournament Golden Boot / Golden Glove, Player of the Tournament |

Awards are **selection over ranked candidates** from the analytics snapshot (performance,
contribution, team success, reputation). MVP uses a **deterministic ranking → pick**;
optional "voting" presentation is deterministic flavour over that ranking (see §6 open
item). Awards are persisted as raw `AwardWin` facts and feed Layers 2 and 3.

## 3. Layer 2 — Records book (cumulative proof, per-save)

Per-save records, surfaced through the Analytics Hub (GD-0031), split **all-time / season /
match / streak** within the save's world. Categories (taxonomy from the real-world capture):

- **Club records:** most appearances; all-time & league top scorer; most clean sheets;
  biggest win / heaviest defeat; longest unbeaten / winning / winless / scoring /
  clean-sheet runs; most points / wins / goals in a season; record home / away / average
  attendance; record signing / sale; youngest & oldest player and scorer; fastest goal.
- **Competition / league records:** team season records (points, wins, goals, unbeaten
  run); team match records (biggest win, highest-scoring game); season & all-time individual
  (golden boot, assists, clean sheets, appearances); consecutive titles; consecutive seasons
  in the league.
- **Player career records:** career & per-competition apps, goals, assists, clean sheets;
  seasonal bests; international caps/goals/tournament goals (national-team inputs reserved —
  depend on FMX-84); career trophies; age milestones.
- **Manager records:** games managed; W/D/L; win %; trophies (major vs minor, club &
  competition breakdown); tenure (longest spell, multiple spells); season bests; career
  scope (clubs, years).

Records are derived from Statistics read-models + source facts; a `RecordSet` raw fact is
written when a record is broken. **No new authoritative truth** is created (Statistics and
source contexts remain authoritative).

## 4. Layer 3 — Legacy & Hall of Fame (synthesis)

### 4.1 Honours

Team and individual **honours lists**, tiered **Major / Secondary / Minor** across
**Domestic / Continental / Intercontinental** scope, presented as "Major Honours" then
"Other Honours", grouped by competition → count → seasons (real-world convention). Honours
derive from `TrophyWin` facts (League Orchestration competition outcomes).

### 4.2 In-world Hall of Fame (per-save, deterministic)

The save's own legends — club and league HoF. Eligibility uses a **waiting period** after
retirement (calibratable) + a **HoF-level score** combining:

- **Peak** (best-season quality) **and longevity** (career length / one-club service) —
  both, so "durable mediocrity" doesn't outrank "short brilliance".
- Championships / major honours, career totals + rate stats, individual awards & Best-XI
  selections, club-record milestones, signature achievements (invincible season, record
  points, decisive finals).
- **Era-normalization** (compare against league strength / parity / peer context, not raw
  totals) to resist dynasty distortion.
- **Scarcity / induction-quota caps** so the HoF stays selective over 50–100 seasons.

Inductee categories: **player**, **manager**, **contributor**. Induction reasons are
**inspectable** (why inducted / shortlisted / declined). "Legend" is a **narrative overlay**
on a HoF-level career, weighted by club loyalty, iconic events and fan sentiment.

### 4.3 Cross-save profile-global legacy (read-only-at-world-gen)

Limited (D2) to **manager prestige + a curated all-time Hall of Fame (manager + player
legends) + a cross-save legend ranking**. Built by exporting per-save raw facts to the
profile-global layer at run/season end; rescored freely by the current formula; **never read
by a running save after creation** (D8). This is the roguelite cross-run payoff and feeds
GD-0019 prestige.

## 5. MVP surfaces (D4 = full HoF in MVP)

- **Analytics Hub** records & leaders + season-summary "history seed" (GD-0031 surface 7).
- **Season awards** ceremony/readout at season-end.
- **Manager run-end honours & records readout** (extends ADR-0082's `PostRunReflection`
  context with an honours/records summary).
- **In-world Hall of Fame** browser (club / league legends, inductee reasons).
- **Cross-save Hall of Fame + legend ranking + manager prestige** on the profile/meta screen.
- **Induction** runs at the relevant watermark (season-end / career-end) via the
  formula-preselect model; voting is deterministic presentation flavour (§6).

## 6. Open ratification item

**In-world induction determinism / RNG.** Cross-save HoF is computed outside the sim (no
determinism constraint). In-world induction is deterministic sim state. **Recommended:** a
**pure deterministic formula** (no new `*Rng`); "voting" is deterministic flavour over the
formula. Genuinely stochastic in-world voting would need a new seeded `LegacyRng`/`HoFRng`
sub-label (ADR-0018 §3). ADR-0083 proposes the no-new-RNG path.

## 7. Calibration debt (`legacy.hof`, GD-0043)

Scoring weights; peak-vs-longevity balance; HoF thresholds + scarcity/quota caps;
era-normalization coefficients; voting weights; eligibility waiting period; major-vs-minor
honour tiering; record-category baselines; awards selection thresholds. All versioned behind
`legacyScoreFormulaVersion`; tuned at playtest, not locked from intuition.

Slot: `legacy.hof`; harness: T2/T3 awards/records/HoF scoring sweeps in
[[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].

## 8. Out of scope

Statistics metric definitions (GD-0031); archetype taxonomy + prestige-ladder shape (G3,
post-MVP, Nico-gated); national-team caps/tournament inputs (reserved — FMX-84); user-authored
formulas / export-share / similarity search / deep cross-save record books beyond the curated
legend ranking (post-MVP per ADR-0081).
