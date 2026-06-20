---
title: ADR-0083 Awards, Honours, Records & Hall-of-Fame Contract
status: accepted
tags: [adr, architecture, manager, legacy, awards, honours, records, hall-of-fame, prestige, determinism, fmx-95]
context: manager-legacy
created: 2026-06-06
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0081-statistics-analytics-read-model-owner]]
  - [[ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0007-naming-schema]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../../60-Research/awards-honours-records-hof-owner-2026-06-06]]
  - [[../../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05]]
  - [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-games-2026-06-06]]
  - [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-realworld-2026-06-06]]
  - [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-determinism-2026-06-06]]
  - [[../../60-Research/hof-induction-voting-reconciliation-2026-06-16]]
  - [[../../40-Execution/fmx-151-hof-induction-reconciliation-decision-record-2026-06-16]]
---

# ADR-0083: Awards, Honours, Records & Hall-of-Fame Contract

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Decisions D1–D4 were put to Nico live on 2026-06-06
> (ask-first gate) and chosen below; authored `proposed` per the never-self-accept rule —
> Nico ratifies (merge). This ADR **extends** the accepted
> [[ADR-0051-manager-and-legacy-context]] **additively** (a new ADR + a one-line "Related"
> pointer in ADR-0051; **no rewrite** of the binding ADR — vault-governance supersession
> discipline, same pattern as ADR-0074→ADR-0055 and ADR-0082). It resolves gap **G20**
> (FMX-95, epic E6 / E6-3). It **introduces no new bounded context** and **consumes**
> ADR-0081 (Statistics) and ADR-0082 (run-analysis) rather than re-opening them.

## Date

- Proposed: 2026-06-06 (FMX-95; D1–D4 chosen live by Nico)

## Context

No bounded context owns awards, honours, club/player records or a cross-save Hall of Fame
(gap **G20**). [[ADR-0051-manager-and-legacy-context]] (accepted/binding) is the only context
with the cross-save snapshot-at-creation determinism machinery — *"A running save must never
read mutable cross-save meta after creation"* (§Determinism, line 205) — but its §Decision
scope lists manager profile, run-analysis snapshots, style signals, archetype candidates,
legacy unlock catalog and prestige profile, **not records/HoF**.

Two upstream deliverables hand FMX-95 its inputs:

- [[../../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05|FMX-90]] defined
  the **prestige/HoF/era metric-input taxonomy** (MVP vs reserved-stub flagged) and the
  determinism rule **D4**: persist atomic per-save run-end facts + context snapshots; the
  scoring formula consumes raw facts and may evolve; **a formula change re-scores history,
  never breaks old saves**; carry `legacyMetricInputVersion` (separate from the
  `formula_version`); cross-save aggregation is **read-only-at-world-gen** (rule **D8**). It
  explicitly handed off "to **E6-3 / FMX-95**, which owns the **scoring formula + records book
  + the ADR-0051 amendment**."
- [[ADR-0081-statistics-analytics-read-model-owner|FMX-94]] owns the per-save standings,
  match/player/team stat lines, league leaders, records & leaders, versioned metric
  definitions, and the **immutable `SeasonAnalyticsHandoffSnapshot`** (SA7). It does **not**
  own Manager & Legacy scoring formulas, prestige decisions or HoF induction rules — those
  were deferred to **FMX-95 / E6-3**.

Grounded in [[../../60-Research/awards-honours-records-hof-owner-2026-06-06]] (+ three raw
captures: comparable games, real-world football taxonomy, determinism architecture). Prior
art is unanimous: keep **per-save history** + a **thin cross-save HoF**; persist raw facts +
version the formula; immutable snapshots at watermarks; era-normalize + scarcity-cap to fight
HoF dilution and dynasty distortion.

**Scope (this ADR):** the owner decision; the records/honours/HoF aggregate + consumed-fact
map; the per-save vs cross-save split; the versioning + re-score-from-raw determinism contract;
the forward-additive reserved-stub schema; the induction model; invariants. **Out of scope:**
Statistics metric definitions (ADR-0081); the archetype taxonomy + prestige-ladder shape
(G3, GD-0019, post-MVP); national-team inputs (FMX-84, reserved); all numeric magnitudes
(GD-0043 `legacy.hof` calibration).

## Decision options

### D1 — Owner of awards/honours/records/HoF

| Option | Description | Trade-off |
|---|---|---|
| **A. Extend ADR-0051 (Manager & Legacy)** | Manager & Legacy owns the cross-save HoF/legend/prestige-scoring layer under its existing determinism rule; per-save records stay Statistics-owned. No new BC. | **Chosen by Nico.** Only context with the cross-save determinism machinery; HoF/records are structurally identical; FMX-90 named the ADR-0051 amendment as the deliverable. |
| B. New "Honours & Records" bounded context | A dedicated context. | Duplicates ADR-0051's cross-save machinery; records/HoF tables are small (prior art) — a BC isn't warranted; grows the map. |
| C. Defer post-MVP, reserved stub only | No owner; only a reserved data-model stub. | Leaves the headline dynasty/legacy payoff unowned & undesigned. |

### D2 — Record scope & per-save vs cross-save split

| Option | Description | Trade-off |
|---|---|---|
| **A. Per-save records + cross-save legends** | Club/competition/player/manager records live per-save (Statistics read-models); cross-save layer limited to manager prestige + a curated all-time HoF (manager + player legends) + a legend ranking. | **Chosen by Nico.** FM-like; minimal cross-save surface → low leak risk; club/competition records are world-specific so cross-save mixing is semantically odd. |
| B. Full cross-save aggregation | Aggregate all subjects across all saves. | Bloat + leak risk; semantically odd across distinct generated worlds. |
| C. Per-save only, no cross-save HoF | No profile-global layer. | Removes the roguelite cross-run payoff Manager & Legacy exists for. |

### D3 — Snapshot timing & scoring determinism

| Option | Description | Trade-off |
|---|---|---|
| **A. Raw facts + versioned formula** | Persist raw facts + context snapshots at immutable watermarks; version `legacyScoreFormulaVersion` separately from `legacyMetricInputVersion`; cross-save aggregates read-only-at-world-gen (D8); integer/fixed-point scoring; re-score history on formula change. | **Chosen by Nico.** Confirms FMX-90 D4 + FMX-94 SA7 + ADR-0051; unanimous across research; saves never break on formula evolution. |
| B. Continuous running aggregates | Mutate all-time counters live. | More mutation points; higher non-determinism risk; harder to replay-verify. |
| C. Freeze derived scores in-save | Store computed prestige/HoF points in the save. | Save-format / byte-replay breakage when the formula evolves. |

### D4 — How much ships in MVP

| Option | Description | Trade-off |
|---|---|---|
| A. Contract + reserved stub *(recommended)* | Per-save honours/records + season awards + run-end readout; cross-save HoF = forward-additive reserved stub (no induction UI/voting) populated post-MVP. | Lowest balance risk; dilution/era tuning deferred. |
| **B. Full HoF in MVP** | Induction logic + simulated voting + cross-save legend ranking MVP-active in design. | **Chosen by Nico (override).** Maximal payoff now; **consequence:** all magnitudes are GD-0043 `legacy.hof` calibration behind `legacyScoreFormulaVersion`, and era-normalization + scarcity caps are built in as first-class knobs so dilution/distortion stay tunable, not baked. |
| C. Pure deferral, no awards | Only a reserved stub. | Too thin — yearly awards are cheap signals worth shipping. |

## Decision (chosen — Nico 2026-06-06)

**D1 = A, D2 = A, D3 = A, D4 = B.** Manager & Legacy owns the cross-save legacy/HoF/prestige
layer; per-save records stay Statistics-owned; raw-facts-plus-versioned-formula determinism;
the full HoF (records book + honours + season awards + in-world HoF + cross-save legend
ranking + induction) is MVP-active in design, with magnitudes as GD-0043
`legacy.hof` debt.

### 1. Three layers & ownership

| Layer | What | Owner | Tier |
|---|---|---|---|
| **Season awards** | PotS, Best XI, golden boot, gaffer of the season, etc. (IP-safe) | Manager & Legacy generates from the Statistics snapshot; persists `AwardWin` facts | per-save (in-world) |
| **Records book** | club / competition / player-career / manager records (all-time / season / match / streak) | **Statistics & Analytics** read-models + source facts; Manager & Legacy only consumes | per-save (in-world) |
| **Legacy / HoF** | honours lists; in-world HoF; cross-save HoF + legend ranking + manager prestige | **Manager & Legacy** | in-world (per-save) **and** cross-save (profile-global) |

### 2. Consumed facts (events / read-models only — no cross-context joins)

| Source context | Fact consumed |
|---|---|
| Statistics & Analytics (ADR-0081) | immutable `SeasonAnalyticsHandoffSnapshot` (season stat lines, standings, league leaders, records & leaders) |
| League Orchestration | competition outcomes → `TrophyWin` (honours), promotions, season/era context |
| Match | results / streaks feeding records (via Statistics) |
| Transfer | transfer value/profit facts (record signing/sale; manager prestige inputs) |
| Squad & Player / Training | player milestones, longevity, youth-promotion facts |
| Manager & Legacy (self, ADR-0082) | `RunAnalysisSnapshot` outcome + style signals (prestige context) |
| FMX-90 metric-input taxonomy | the MVP-tagged prestige/HoF/era inputs (national-team inputs reserved — FMX-84, now contracted as a forward-additive `factId` in [[ADR-0084-national-team-dual-role-and-international-window-contract]] §4) |

### 3. Determinism & versioning contract

- **Raw facts persisted in-save**, immutable, written at watermarks; each carries
  `legacyMetricInputVersion` + a **context snapshot** (league strength, club resources,
  competition tier at the time).
- **Scoring formula** = a **versioned pure function over raw facts**, integer/fixed-point,
  tagged `legacyScoreFormulaVersion`. In-world derived scores are recomputable under their
  recorded version and **never recomputed in place**; a formula change **re-scores history**
  from raw facts.
- **Cross-save aggregates are read-only-at-world-gen (D8):** a running save never reads
  mutable cross-save HoF/records meta after creation; cross-save config is snapshot into the
  save at creation only. The cross-save layer (top-N legend index + manager prestige) may be
  rescored/pruned freely without touching save bytes.
- **No cross-context joins.** Manager & Legacy stores analysis/legacy snapshots, not alternate
  truth (ADR-0051).

### 4. Forward-additive reserved-stub schema

New record/award/HoF categories add a new keyed `factId` — old builds ignore unknown ids, new
builds read them; no migration, no save-format break (ADR-0027 forward-additive invariant). A
stable core shell carries `schemaVersion` + reserved primitives + keyed fact buckets.

### 5. Contract appendix (TS/Zod-describable; illustrative)

```ts
type RecordTier   = 'all_time' | 'season' | 'match' | 'streak';
type HonourTier   = 'major' | 'secondary' | 'minor';
type HonourScope  = 'domestic' | 'continental' | 'intercontinental';
type InducteeKind = 'player' | 'manager' | 'contributor';

// Raw in-save facts (immutable, written at watermarks; integer/fixed-point values).
TrophyWin  = { saveId, competitionId, seasonId, clubId, honourTier: HonourTier, honourScope: HonourScope, wonAtSeq: number, legacyMetricInputVersion: string };
AwardWin   = { saveId, awardFamilyId: string, scope: HonourScope | 'club', seasonId, subjectRef: EntityRef, wonAtSeq: number, legacyMetricInputVersion: string };
RecordSet  = { saveId, recordCategoryId: string, tier: RecordTier, subjectRef: EntityRef, valueFixed: number /* int/fixed-point */, contextSnapshot: AchievementContext, setAtSeq: number, legacyMetricInputVersion: string };

AchievementContext = { leagueStrengthFixed: number, clubResourceTier: number, competitionTier: number };

// Forward-additive keyed fact bucket (reserved-stub).
LegacyFact  = { factId: number, valueFixed: number };          // unknown factId ignored by old builds
LegacyFactBucket = { schemaVersion: number, reserved: number[], facts: LegacyFact[] };

// Derived prestige/HoF score (pure function over raw facts; versioned; integer/fixed-point).
LegacyScore = { subjectRef: EntityRef, scoreFixed: number, legacyScoreFormulaVersion: string, eraNormalized: boolean, reasons: string[] /* inspectable */ };

// In-world Hall of Fame entry (per-save, deterministic).
HallOfFameEntry = { saveId, subjectRef: EntityRef, inducteeKind: InducteeKind, inductedAtSeq: number, score: LegacyScore, legendOverlay?: { clubLoyalty: number, iconicEvents: string[] } };

// Cross-save profile-global legacy (read-only-at-world-gen; top-N index, not full history).
ProfileLegacyEntry = { profileId, saveId, subjectRef: EntityRef, inducteeKind: InducteeKind, prestigeFixed: number, legacyScoreFormulaVersion: string };
```

### 6. Induction model

**Formula-preselect** over era-normalized, integer/fixed-point `LegacyScore` (peak **and**
longevity), gated by an eligibility waiting period and a **scarcity / induction-quota cap**;
**inspectable reasons** per induction/shortlist/decline. Simulated "voting" is **deterministic
presentation flavour** over the formula output (see HITL gate). Cross-save induction is
computed in the meta layer and never feeds back into a running sim.

## Invariants

| # | Invariant |
|---|---|
| **HF1** | Manager & Legacy owns the cross-save legacy/HoF/prestige layer + in-world HoF + season-award generation; **per-save records stay Statistics-owned** (ADR-0081). **No new bounded context.** |
| **HF2** | All inputs arrive via **events / read-models** (incl. the immutable `SeasonAnalyticsHandoffSnapshot`); **no cross-context table joins**; sources remain authoritative (no alternate truth). |
| **HF3** | A running save **never reads mutable cross-save HoF/records meta** after creation; cross-save config is snapshot-at-creation only (ADR-0051 §Determinism / rule D8). |
| **HF4** | Raw facts are **persisted in-save, immutable, written at watermarks**, each carrying `legacyMetricInputVersion` + an achievement `contextSnapshot`. |
| **HF5** | The scoring formula is a **versioned pure function over raw facts**, **integer/fixed-point**; a formula change **re-scores history** rather than breaking saves; in-save derived scores are never recomputed in place. |
| **HF6** | New record/award/HoF categories are **forward-additive** (new `factId`); adding one needs **no migration / no save-format break** (ADR-0027). |
| **HF7** | Cross-save legacy is a **top-N index** (manager + player legends + manager prestige), not full per-entity history — bloat-bounded over 50–100 seasons. |
| **HF8** | HoF induction is **era-normalized** and **scarcity/quota-capped**, with **inspectable reasons**, to resist dilution and dynasty distortion. |
| **HF9** | In-world induction is a **pure deterministic formula** and **declares no new `*Rng`** (ADR-0018 §3); any genuinely stochastic in-world voting would require a new seeded sub-label + a fresh Nico decision (open item). |
| **HF10** | All sample names are **IP-safe / fictional** (GD-0015 / ADR-0007); all magnitudes (weights, thresholds, scarcity caps, era coefficients, voting weights, eligibility window) are **GD-0043 `legacy.hof` calibration debt** versioned behind `legacyScoreFormulaVersion`. |

## Consequences

**Positive:** closes G20 with a single owner that reuses ADR-0051's determinism machinery (no
duplicate machinery, no new context); consumes the FMX-90 taxonomy + FMX-94 snapshot exactly
as handed off; the raw-facts/versioned-formula rule lets the HoF/prestige formula evolve
without breaking saves; era-normalization + scarcity caps are first-class knobs so the genre's
dilution/distortion pitfalls stay tunable; the forward-additive schema keeps the save format
stable as categories grow.

**Negative / constraints:** D4=B means the full HoF ships in design with **all magnitudes
unvalidated** until GD-0043 `legacy.hof` playtest — the dilution/era risks are *mitigated by design* (knobs)
but not *resolved* until tuning; some inputs depend on still-`proposed` upstreams (Statistics
ADR-0081) and on FMX-84 for national-team inputs (reserved stub); the in-world voting
determinism question is left open for ratification.

## Proposed bounded-context-map patch (NOT applied — ratify gate)

Manager & Legacy row, **Owns** column — append:
`…, prestige profile, awards/honours generation, in-world Hall of Fame, cross-save legacy/HoF
& legend ranking (read-only-at-world-gen)`.
**Consumes** — append: `Statistics SeasonAnalyticsHandoffSnapshot; League TrophyWin/competition
outcomes`. **No context-count change** (no new BC). The map is **not** edited in this PR
(ratify gate); the patch lands when Nico accepts.

## Amendment to ADR-0051 (additive cross-reference only)

[[ADR-0051-manager-and-legacy-context]] gains a one-line "Related Docs" pointer to this ADR
(the awards/honours/records/HoF contract that extends its scope). ADR-0051's decision,
ownership, contract direction and determinism rules are **unchanged** — no rewrite
(vault-governance: never silently rewrite an accepted ADR; same additive pattern as
ADR-0082 and ADR-0074).

## Supersedes

None

## HITL gate

D1–D4 were chosen live by Nico on 2026-06-06 (D4=B is Nico's override of the
recommended reserved-stub) and ratified on 2026-06-08 (#153). **Resolved
ratification item:** in-world HoF induction stays a **pure deterministic
formula** for MVP and declares no new `*Rng`. "Voting" is deterministic
presentation flavour over the formula output. If genuinely stochastic voting is
wanted later, it requires a fresh Nico decision and must add a *sub-label of an
existing owner stream* per ADR-0018 §3, **not** a new top-level
`LegacyRng`/`HoFRng`. All numeric magnitudes remain **GD-0043 `legacy.hof`
calibration debt** and do not block the contract shape. Archetype taxonomy +
prestige-ladder shape remain post-MVP / Nico-gated (GD-0019); national-team
inputs are contracted as a forward-additive reserved `factId` via ADR-0084.

FMX-151 (2026-06-16) reconciles stale Linear/open-question wording to the
2026-06-08 ratified choice. See
[[../../60-Research/hof-induction-voting-reconciliation-2026-06-16]] and
[[../../40-Execution/fmx-151-hof-induction-reconciliation-decision-record-2026-06-16]].

## Related Docs

- [[../../60-Research/awards-honours-records-hof-owner-2026-06-06]] — FMX-95 synthesis (decision basis).
- [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-games-2026-06-06]] — comparable-games prior art.
- [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-realworld-2026-06-06]] — real-world football taxonomy.
- [[../../60-Research/raw-perplexity/raw-awards-honours-records-hof-determinism-2026-06-06]] — determinism architecture.
- [[../../60-Research/hof-induction-voting-reconciliation-2026-06-16]] — FMX-151 reconciliation/source-check confirming the pure deterministic MVP induction decision.
- [[../../40-Execution/fmx-151-hof-induction-reconciliation-decision-record-2026-06-16]] — decision record for closing FMX-151.
- [[ADR-0051-manager-and-legacy-context]] — **owner**; this ADR extends its scope additively.
- [[ADR-0081-statistics-analytics-read-model-owner]] — Statistics owns per-save records; supplies `SeasonAnalyticsHandoffSnapshot`.
- [[ADR-0082-manager-style-signal-and-run-analysis-contract]] — run-analysis envelope (prestige context; consumed, not re-opened).
- [[ADR-0027-postgres-data-model]] — cross-save `public` vs per-save schema; forward-additive invariant.
- [[ADR-0018-systemic-events-and-player-lifecycle]] — §3 RNG/determinism discipline (this projection declares no new `*Rng`).
- [[../../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]] — the game-design model this contract serves.
- [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] — prestige/legacy; archetype taxonomy deferred (G3).
- [[../../60-Research/dynasty-flatline-and-prestige-metric-inputs-2026-06-05]] — FMX-90 metric-input taxonomy + D4/D8 hand-off.
- [[ADR-0084-national-team-dual-role-and-international-window-contract]] — fills the reserved national-team caps/honours input as a forward-additive `factId`.
