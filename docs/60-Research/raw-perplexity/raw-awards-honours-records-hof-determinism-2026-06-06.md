---
title: "Raw — Determinism-safe cross-save records/HoF architecture (FMX-95)"
status: raw
tags: [research, raw, perplexity, hall-of-fame, determinism, event-sourcing, versioning, fmx-95]
created: 2026-06-06
updated: 2026-06-06
type: research
binding: false
linear: FMX-95
related:
  - [[../awards-honours-records-hof-owner-2026-06-06]]
---

# Raw capture — Determinism architecture (Perplexity, 2026-06-06)

Verbatim capture of the Perplexity strand on best practices for an
Awards/Honours/Records/HoF layer in a deterministic, offline-first, byte-replayable
sim with a per-save tier (deterministic) and a cross-save/profile-global tier
(read-only-at-world-gen). Synthesis in [[../awards-honours-records-hof-owner-2026-06-06]].

## Response (captured)

### 1. Derived scores vs raw facts + versioned formula
**Recommendation:** persist **raw facts in saves**; persist **derived scores only in
cross-save / profile-global storage, tagged with a scoring-version**; ship a
**versioned scoring formula** and rescore from raw facts.
- Raw facts (trophies, season stat lines, manager run results) are true historical
  events — they don't change as design changes; only their *interpretation* (prestige
  points) does.
- In-save derived fields that depend on a formula must either never change or be
  recomputable under the **original** formula with a stable layout — so treat in-save
  scores as a cache with a recorded `scoring_version`, **never recomputed in place**.
- Cross-save layer stores aggregated derived scores with per-entry `scoring_version_used`;
  it's outside the determinism guarantee and may be rescored lazily or via migration.
- Formula = **versioned pure function over raw facts** (`prestige_v1`, `prestige_v2`, …);
  dispatch by version; in-save version written once at creation and never changed.

### 2. Forward-additive reserved-stub schema
Pattern: **"sparse, keyed, forward-compatible blob behind a stable shell."**
- Stable core struct with `schema_version`, `scoring_version`, **reserved primitive
  arrays** (`reserved_u32[4]`), plus **keyed FactBuckets** (`fact_id → int64 value`) and
  a generic `KeyValueMeta` for ad-hoc fields.
- Adding a category later = add a new `fact_id`; old builds ignore unknown ids, new
  builds understand them — no migration, no save-format break.
- Good reserved stubs: reserve arrays of primitive numeric fields + extensibility
  containers (key/value lists, sparse keyed fact maps); always key by explicit id, never
  by field order. Don't reserve complicated nested structures you only *might* use.

### 3. Snapshot timing
**Recommendation:** event-sourced facts + **immutable snapshots at natural watermarks**
(season-end, competition-end, run-end). Avoid in-place continuously-mutated aggregates
inside deterministic sim state.
- Determinism property wanted: replaying the same events in the same order yields the
  same snapshot bytes. Continuous mutation multiplies the points where non-determinism/
  bugs can slip in.
- Source of truth = event log; at season-end compute a **summary snapshot** (pure
  function over past events) and freeze it. Within a save: `SeasonStats[season][player]`,
  `CompetitionResult[comp][season]` finalised at end and never modified; in-season
  running aggregates may be ephemeral UI caches, excluded from the determinism contract.
  This is the event-sourcing **events vs projections** split.

### 4. How comparable games handle it
- **FM:** seasonal records appended each season (not rewritten); long-term HoF appears
  profile/global; relies on seeded RNG + stable data-driven structures.
- **OOTP / franchise modes:** yearly leaderboards + career totals computed from season
  stats; long saves stay manageable by storing **coarse season-level history** (not every
  per-game event forever) and trimming old detailed logs while keeping high-level records;
  HoF tables small vs full player DB.
- **Paradox GSG ledgers:** world is a big snapshot; ledgers recomputed or compactly
  versioned; per-save append-only history.
- Translation to stricter determinism: per-season/per-competition snapshots not rolling
  aggregates; keep HoF/cross-save data **outside** the save so it can evolve
  independently; store coarse facts not every micro-event long-term.

### 5. Pitfalls + mitigations
- **Float non-determinism:** use **integers / fixed-point** for all persisted scores,
  weights, prestige, rankings; never persist floats as canonical state; deterministic
  operation order. (`type Prestige = int64` scaled by 1000.)
- **Formula-version drift:** persist `scoring_version` per save (and per record set);
  never recompute in-save scores after first write; cross-save carries
  `cross_save_scoring_version` per entry with migration tooling, or always recompute from
  raw facts with the latest formula.
- **Cross-save leakage into a running sim:** at new-save creation read global meta once →
  snapshot relevant config into the save (`WorldConfig`); sim **never reads global/profile
  state again**; split code into `SimCore` (save-local only) and `MetaService`; only
  interaction is `CreateNewSave(profile_meta_snapshot)`; add a **determinism harness**
  (same seed + different global meta → identical save bytes).
- **Record/HoF table bloat:** store per-season/per-competition aggregates only; reference
  match logs via a history index instead of duplicating stats; integer keys + ID tables
  (no repeated names); sparse structures (only entities that played); pruning policy
  (full detail for last N seasons, HoF-relevant aggregates for older); cross-save = a
  **top-N index**, not full history for everyone.

### Recommended overall pattern
- **Raw facts** live inside each save (event-sourced / append-only, immutable once
  written; per-match facts for replay, per-season `SeasonStats`, `TrophyWin`/`AwardWin`/
  `RecordSet`). Profile-global keeps optional summaries; canonical per-save facts stay in
  the save.
- **Derived scores:** in-save either not stored (computed lazily for UI) or stored
  immutably with `scoring_version`, never recomputed; cross-save HoF entries reference
  `profile_id / save_id / entity_id / fact_summary / prestige_score / scoring_version` and
  may be recalculated/pruned/evolved freely.
- **Versioning:** each struct has `schema_version` (new fields via reserved primitives or
  keyed FactBuckets); scoring formula version mapping `version → fn(Facts) → Prestige`;
  each save carries its `scoring_version`; cross-save entries carry theirs.
- **Cross-save stays read-only-at-world-gen:** world-gen reads profile meta once → copies
  needed knobs into a `WorldConfig` block (incl. `scoring_version_snapshot`); after that
  `SimCore` uses only `WorldConfig`; on season/run end the save **exports** facts to the
  cross-save layer, which may recompute HoF standings without feeding back into the sim.

(Citations returned were general reproducible-build / determinism web links; substantive
value is the pattern above, which aligns with FMX's ADR-0051 §Determinism + FMX-90 D4 +
FMX-94 SA7.)
