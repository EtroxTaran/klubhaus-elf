---
title: Awards, Honours, Records & Hall-of-Fame Owner (FMX-95)
status: current
tags: [research, awards, honours, records, hall-of-fame, manager-legacy, prestige, determinism, ddd, fmx-95]
context: manager-legacy
created: 2026-06-06
updated: 2026-06-06
type: research
binding: false
linear: FMX-95
related:
  - [[raw-perplexity/raw-awards-honours-records-hof-games-2026-06-06]]
  - [[raw-perplexity/raw-awards-honours-records-hof-realworld-2026-06-06]]
  - [[raw-perplexity/raw-awards-honours-records-hof-determinism-2026-06-06]]
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[statistics-analytics-read-model-owner-2026-06-05]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../10-Architecture/bounded-context-map]]
---

# Awards, Honours, Records & Hall-of-Fame Owner (FMX-95)

FMX-95 closes domain-audit gap **G20**: no bounded context owns awards, honours,
club/player records or a cross-save Hall of Fame. It is the **E6-3** consumer of two
deliverables that just merged — [[dynasty-flatline-and-prestige-metric-inputs-2026-06-05|FMX-90]]
(the prestige/HoF/era **metric-input taxonomy** + the persist-raw-facts/version-the-formula
determinism rule, explicitly handed off "to E6-3 / FMX-95, which owns the scoring formula +
records book + the ADR-0051 amendment") and
[[statistics-analytics-read-model-owner-2026-06-05|FMX-94]] (the immutable
`SeasonAnalyticsHandoffSnapshot`; FMX-94 itself notes "Manager & Legacy scoring formula and
HoF/prestige weights remain FMX-95 / E6-3 territory").

This note grounds the decision in real-world football structure, comparable-game prior art
and deterministic-sim architecture, then records the four decisions Nico took live
(2026-06-06). It feeds proposed
[[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract|ADR-0083]]
and draft [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame|GD-0032]].

Raw captures: [[raw-perplexity/raw-awards-honours-records-hof-games-2026-06-06|games]] ·
[[raw-perplexity/raw-awards-honours-records-hof-realworld-2026-06-06|real-world]] ·
[[raw-perplexity/raw-awards-honours-records-hof-determinism-2026-06-06|determinism]].

## Pre-existing constraints (what the vault already fixes)

- **ADR-0051 §Determinism, line 205 (binding):** *"A running save must never read mutable
  cross-save meta after creation."* New-save creation may receive a selected legacy/prestige
  configuration as an explicit generation parameter, copied into the save snapshot; replay
  and reload use the copied value, not the current global meta. **No cross-context joins** —
  Manager & Legacy stores analysis snapshots, not alternate truth. Its §Decision scope lists
  manager profile, run-analysis snapshots, style signals, archetype candidates, legacy unlock
  catalog, prestige profile — **not records/HoF** (the gap FMX-95 fills).
- **FMX-90 D4 (handoff):** persist atomic per-save run-end facts + context snapshots (league
  strength, club resources, competition tier at the time), keyed deterministically. E6-3's
  formula consumes raw facts and may evolve; **a formula change re-scores history rather than
  breaking old saves**. Carry `legacyMetricInputVersion` on the input contract (separate from
  E6-3's `formula_version`). Cross-save aggregation is **read-only-at-world-gen** (rule **D8**).
- **FMX-94 / ADR-0081 (handoff):** Statistics & Analytics owns per-save standings,
  match/player/team stat lines, league leaders, records & leaders, versioned metric
  definitions, and the **immutable `SeasonAnalyticsHandoffSnapshot`** (SA7: *"Manager & Legacy
  consumes immutable `SeasonAnalyticsHandoffSnapshot` records, not live mutable analytics
  joins."*). It explicitly does **not** own Manager & Legacy scoring formulas, prestige
  decisions or HoF induction rules. Deep HoF voting + cross-save record books were deferred
  there to E6-3/FMX-95.
- **ADR-0082 (proposed):** Manager & Legacy assembles the `RunAnalysisSnapshot` at
  `RogueliteRunEnded` from published facts only; M10 names "E5-2/E6-3 prestige/HoF" as a
  **downstream consumer** that references **signals, not a taxonomy**.
- **ADR-0027 (binding):** platform/global data in `public`; per-save game state in a
  `save_<uuidv7hex>` schema; forward-additive invariants; lazy per-save migration at open.
- **GD-0015 / ADR-0007:** IP-safe naming — no real club/competition/award/HoF names.

## Real-world grounding (taxonomy)

Football separates **honours** (trophies, tiered major/secondary/minor × domestic/
continental/intercontinental), **records** (club / competition / player-career / manager,
split all-time / season / match / streak), **awards** (club-internal → domestic → continental
→ global; performance / positional / statistical / selection / manager / tournament; annual /
monthly / per-match), and **Hall of Fame / legend** recognition (eligibility waiting period;
inductee categories player/manager/contributor; panel-vote vs automatic-threshold vs hybrid
induction; "legend" as a narrative overlay over a HoF-level career). Manager legacy =
trophies + longevity/loyalty + overperformance-vs-resources + club-building + era-defining
dominance + signature achievements. Full taxonomy in the
[[raw-perplexity/raw-awards-honours-records-hof-realworld-2026-06-06|real-world raw capture]].

## Comparable games

- The genre keeps **per-save history** plus, at most, a **thin profile-global Hall of Fame**;
  a true cross-save legacy ledger is **uncommon and risky**. FM has rich per-save records +
  a dedicated manager-history screen but no formal HoF chamber. **OOTP** is the richest:
  hybrid **formula-preselect + simulated voting**, era-adjusted, with small HoF tables vs the
  full player DB. NBA 2K / Madden are milestone/legacy-driven, save-bound.
- Three induction shapes: hard formula, simulated voting, **hybrid** (formula shortlists →
  voting finalises). Lesson: if predictability matters, keep induction **deterministic and
  inspectable**; voting is optional flavour over a formula.
- Pitfalls to design against: **record inflation**, **HoF dilution** over 50–100 seasons,
  **dynasty distortion** of era detection, stat-compression (durability beating brilliance),
  voting-bias drift, save-local historical collapse.
- Design lessons applied here: **three layers** (season awards → career records →
  legacy/HoF induction); use **both peak and longevity**; **era-normalize**; **cap dilution**
  with induction quotas/scarcity; treat club vs competition vs individual records separately;
  make induction reasons inspectable; keep any cross-save layer clearly distinct.
  ([[raw-perplexity/raw-awards-honours-records-hof-games-2026-06-06|games raw capture]].)

## Architecture grounding (determinism)

The determinism strand converges exactly on FMX's existing rules: **persist raw facts
in-save, derived scores cross-save with a versioned pure-function formula; rescore history
from raw facts on formula change; immutable snapshots at watermarks (season/run-end), never
continuously-mutated aggregates; forward-additive keyed reserved-stub schema; integer/
fixed-point scoring; world-gen-only read of meta + a determinism harness (same seed +
different global meta → identical save bytes); cross-save = a top-N index, not full
history.** Bloat mitigations: per-season/per-competition aggregates only, integer-keyed ID
tables, sparse rows, pruning of old detailed logs while keeping HoF-relevant aggregates.
([[raw-perplexity/raw-awards-honours-records-hof-determinism-2026-06-06|determinism raw capture]].)

## Decisions (Nico, live, 2026-06-06)

| # | Question | Options | Choice | Rationale |
|---|---|---|---|---|
| **D1** | Owner of awards/honours/records/HoF | A extend ADR-0051 · B new BC · C defer w/ stub | **A** | Manager & Legacy is the only context with the cross-save snapshot-at-creation determinism machinery; HoF/records are structurally identical (cross-save aggregates of per-save facts). A new BC duplicates that machinery; records/HoF tables are small (prior art) so a BC isn't warranted. FMX-90 named "the ADR-0051 amendment" as FMX-95's deliverable. **No new bounded context.** |
| **D2** | Record scope & per-save vs cross-save split | A per-save records + cross-save legends · B full cross-save aggregation · C per-save only | **A** | Club/competition/player/manager records live **per-save** (Statistics read-models in the save world); the cross-save profile-global layer is limited to **manager prestige + a curated all-time HoF (manager + player legends)**. Matches FM (per-save history, thin global HoF); minimal cross-save surface → low leak risk; club/competition records are world-specific, so cross-save mixing is semantically odd. |
| **D3** | Snapshot timing & scoring determinism | A raw facts + versioned formula · B continuous aggregates · C freeze derived scores in-save | **A** | Persist raw facts + context snapshots at immutable watermarks; version `legacyScoreFormulaVersion` separately from `legacyMetricInputVersion`; cross-save aggregates read-only-at-world-gen (D8); integer/fixed-point scoring; rescore history on formula change. Confirms FMX-90 D4 + FMX-94 SA7 + ADR-0051; unanimous across research. |
| **D4** | How much ships in MVP | A contract + reserved stub *(recommended)* · B full HoF in MVP · C pure deferral | **B** (Nico override) | Induction logic + simulated voting + cross-save legend ranking are **MVP-active in the design**. **Consequence:** all magnitudes — scarcity/induction-quota caps, thresholds, era-normalization coefficients, voting weights, eligibility waiting period — are **FMX-52 calibration debt** behind `legacyScoreFormulaVersion`; designed now, tuned at playtest, not locked from intuition. |

**On the D4 override (honest note):** the recommendation was the reserved-stub (A) because
the genre's main HoF pitfalls — dilution and dynasty distortion — are tuning problems that
can't be validated in a docs-only phase. Nico chose **full HoF in MVP (B)**. We honour it by
designing the full system (records book + honours + season awards + in-world HoF + cross-save
legend ranking + induction) as MVP-active **contracts**, while explicitly routing every
magnitude to FMX-52 so nothing is hard-set from intuition. Era-normalization and scarcity
caps are built into the design as first-class knobs precisely so the dilution/distortion
risks are tunable rather than baked in.

## Three-layer model (carried into ADR-0083 / GD-0032)

1. **Season awards** — yearly signals (PotS, Best XI, golden boot, manager of the season, at
   club/league/continental/global scope). Generated at season-end from the
   `SeasonAnalyticsHandoffSnapshot`. Deterministic in-world.
2. **Records book** — cumulative proof (club / competition / player-career / manager records;
   all-time / season / match / streak). **Per-save**, owned as Statistics read-models inside
   the save world.
3. **Legacy / HoF induction** — synthesis. **In-world HoF** (per-save, deterministic) for the
   save's own legends; **cross-save profile-global HoF + legend ranking + manager prestige**
   (read-only-at-world-gen). Induction = formula-preselect (+ deterministic voting flavour),
   era-normalized, scarcity-capped, with inspectable reasons.

## Determinism contract for FMX-95

- **Raw facts in-save**, immutable, written at watermarks (`TrophyWin`, `AwardWin`,
  `RecordSet`, season summaries, manager run-end facts) with a `legacyMetricInputVersion`.
- **Derived prestige/HoF scores**: in-world computed by a pure deterministic formula over raw
  facts (integer/fixed-point), versioned `legacyScoreFormulaVersion`; cross-save scores live
  in the profile-global layer and may be rescored freely without touching save bytes.
- **Cross-save read-only-at-world-gen (D8)**: a running save never reads mutable cross-save
  HoF/records meta; cross-save config is snapshot-at-creation only.
- **Forward-additive reserved-stub schema** so new record/award categories add a new keyed
  `fact_id` with no save-format break (ADR-0027 forward-additive invariant).

## Open ratification item

**In-world induction determinism / RNG.** The cross-save HoF is computed in the meta layer
(outside the sim, recomputable — no determinism constraint). The **in-world** (per-save)
HoF/legend induction is deterministic sim state. **Recommendation:** keep in-world induction a
**pure deterministic formula** (no new `*Rng`), with simulated "voting" rendered as
deterministic flavour over the formula output. If genuinely stochastic in-world voting is
wanted, it requires a new seeded `LegacyRng`/`HoFRng` sub-label (ADR-0018 §3). ADR-0083
proposes the **no-new-RNG** path and flags this as the one open determinism choice.

## FMX-52 calibration debt (magnitudes, not contract shape)

- Prestige/HoF scoring weights and the peak-vs-longevity balance.
- HoF induction thresholds + **scarcity/induction-quota caps** (anti-dilution).
- **Era-normalization** coefficients (league-strength / parity / peer-comparison).
- Voting weights (if deterministic voting flavour is ratified) and eligibility waiting period.
- Major-vs-minor honour tiering boundaries; record-category baselines.

## Out of scope

- Statistics view/metric definitions themselves (FMX-94 / ADR-0081).
- The archetype taxonomy + prestige-ladder shape (G3 / GD-0019, post-MVP, Nico-gated).
- National-team caps/tournament inputs that depend on FMX-84 (national-team arc) — reserved
  stub only here.
- Final numeric constants (FMX-52).
