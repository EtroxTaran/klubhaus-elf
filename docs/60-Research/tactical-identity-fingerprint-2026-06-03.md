---
title: Tactical-Identity Fingerprint Aggregation — synthesis (FMX-68)
status: draft
tags: [research, match, tactics, meta, fingerprint, ewma, bayes, determinism, fmx-68]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-68
sourceType: external
related:
  - [[raw-perplexity/raw-tactical-fingerprint-signals-2026-06-03]]
  - [[raw-perplexity/raw-tactical-fingerprint-aggregation-2026-06-03]]
  - [[raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03]]
  - [[raw-perplexity/raw-tactical-fingerprint-games-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/match-engine]]
  - [[../50-Game-Design/tactics-system]]
  - [[../10-Architecture/state-machines/match]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Tactical-Identity Fingerprint Aggregation — synthesis (FMX-68)

Grounds FMX-68 (Gap **G10**). Four raw Perplexity captures (2026-06-03):
[[raw-perplexity/raw-tactical-fingerprint-signals-2026-06-03|signal metrics]] ·
[[raw-perplexity/raw-tactical-fingerprint-aggregation-2026-06-03|aggregation/decay]] ·
[[raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03|confidence model]] ·
[[raw-perplexity/raw-tactical-fingerprint-games-2026-06-03|comparable games]].

## Question

Define the **aggregation algorithm** for the `TacticalIdentityFingerprint` already owned by
Tactics ([[../10-Architecture/09-Decisions/ADR-0055-tactics-context|ADR-0055]]) and consumed by
Manager & Legacy ([[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context|ADR-0051]]):
five signals (possession, pressing, risk, adaptation, set-piece), an aggregation window + decay,
and a confidence model — **raw signals + confidence only, no archetype names** (G3 deferral;
FMX-68 blocks FMX-93). Must be a deterministic projection from committed match facts + the locked
`TacticSnapshot` so replays reproduce identical fingerprints.

## Already locked (do not re-decide — from binding decisions)

- **Owner** = Tactics; **consumer** = Manager & Legacy at run-end into a `RunAnalysisSnapshot`;
  carrier names `TacticalIdentityFingerprint` (projection) + `TacticalStyleSignalEmitted` (event)
  already exist in ADR-0055; never re-read after legacy config for next save (ADR-0051).
- **Determinism**: pure function of published match events + locked snapshot; ADR-0018 §3 RNG
  sub-label discipline; ADR-0072 tactics are immutable snapshots (signals read the snapshot, not
  live edits; **shouts are NOT tactical signals** — GD-0025).
- **MVP scope**: coarse style signals + confidence; **no archetype names** (GD-0019 defers the
  taxonomy and explicitly leaves "exact signal schema and confidence model" open → this issue).

## Findings

### F1 — The five signals have standard, fact-derivable definitions (high confidence)
Each maps to established analytics metrics computable from our event log + snapshot, normalisable
to 0..1 via clipped linear transforms against league baselines:
- **Possession**: possession% (action-based `Passes_A/(Passes_A+Passes_B)`), optional field-tilt.
  Baselines 35/50/65%. Stabilises ~8–10 matches.
- **Pressing**: **PPDA** `= oppPassesInPressZone / ownDefensiveActionsInZone` (opp half), inverted
  (lower = more intense; ~7–9 high, 11–13 avg, 13–18 low). Optional high-turnovers/90. ~8–10 matches.
- **Risk/directness**: directness index / vertical gain per pass, progressive-pass share (8–18%),
  long-ball share (5–25%), optional shot-risk (xG/shot). ~8–10 matches.
- **Adaptation**: **least standardised** — proxies only (proactive-sub timing, in-match formation/
  tactic changes via the ADR-0072 intervention-command log, ΔPPDA/Δdirectness by game-state). Noisy;
  needs 20–30 matches → lowest-confidence axis; lean on the confidence model rather than over-trust it.
- **Set-piece reliance**: prefer **xG-based** (SP xG share `xG_SP/xG_TOT`, ~20–40%) over goal share
  (sparse, 20–25 matches). ~10–12 matches.
*Source: [[raw-perplexity/raw-tactical-fingerprint-signals-2026-06-03]]. Confidence: high (well-
established metrics); medium for adaptation (no canonical metric).*

### F2 — EWMA with half-life ≈ 15 matches is the right aggregation (high confidence)
EWMA `ŝ_t = α·x_t + (1-α)·ŝ_{t-1}`, `α = 1 - 0.5^(1/h)`. SMA-over-N rejected (hard-cutoff
discontinuity, equal weights, unstable early-season). Pure per-season average rejected (no recency,
hard boundary). **h=15** sits between "form" (3–8) and "true talent" (15–40): reacts within a
half-season, remembers prior season(s) (match 90 ago ≈ 1/64 weight over ~3 seasons) — fits a
"managerial identity with legacy". Deterministic & reproducible from an ordered match log; init
ŝ_1 = x_1 (or documented prior); initial-value influence decays (1-α)^t (irrelevant after ~2
seasons); mark first ~2h matches provisional. Optional two-component (slow h≈20 "identity" + fast
h≈5 "form") if we later want both. *Source:
[[raw-perplexity/raw-tactical-fingerprint-aggregation-2026-06-03]]. Confidence: high.*

### F3 — Empirical-Bayes shrinkage gives a deterministic, explainable confidence (high confidence)
`k_eff = k0 · clamp(s/s_ref) · (1/f)`, `f = 1 - α(1-F)`, `w = n/(n + k_eff)`;
point estimate `θ̂ = w·x̄ + (1-w)·μ0`; **confidence = w** ∈ [0,1]. Rises with matches, falls with
behavioural variance and with low tactical **familiarity** F (which Tactics already tracks — single
0–100 bar per tactic, see [[../50-Game-Design/tactics-system]] §10). Pulls sparse/noisy estimates
toward the league prior μ0. Worked: n=4 noisy → conf ≈0.18, θ̂≈0.53; n=40 consistent → conf ≈0.81,
θ̂≈0.66. Reuse the EWMA value as x̄ (recency-weighted mean) and an EWMA of squared deviations for s,
so the whole model stays a single-pass deterministic recurrence. *Source:
[[raw-perplexity/raw-tactical-fingerprint-confidence-2026-06-03]]. Confidence: high.*

### F4 — Comparable games: keep it few-axis, label-fronted, fact-anchored, era-aware (high confidence)
FM stores **no explicit style vector** (style implicit in instructions + hidden tendencies, surfaced
as text); familiarity bars ≈ an execution-confidence concept. EA FC = labels/sliders. **OOTP/EHM/
basketball GM** are closest: explicit tendency sliders + statistical identity, *authored* not learned
— our fact-derived fingerprint is differentiating. Radars/DNA charts (NBA sims, Motorsport/F1
Manager) feel **earned** only when each axis has a visible mechanical consequence and matches the
match-stats screen; **gimmicky** otherwise. Lessons: few axes tied to visible stats; show tiers/labels
over raw numbers; confidence as first-class (opacity/outline); compute vs **league z-scores** for
context; gate display until ~10 matches; track **eras** for HoF so experimentation isn't punished;
derive archetype labels from the vector later (G3) but keep per-axis data the core. *Source:
[[raw-perplexity/raw-tactical-fingerprint-games-2026-06-03]]. Confidence: high.*

### F5 — Determinism: the fingerprint is pure-deterministic; NO new RNG sub-label needed (high confidence)
All five signals are counts/ratios derived from the already-seeded match event log (`MatchCoreRng`
resolves the match itself; the fingerprint only *reads* committed facts) + the locked `TacticSnapshot`.
EWMA and the shrinkage formula are pure arithmetic over an ordered sequence. So per ADR-0018 §3 the
fingerprint **declares no `*Rng` sub-label** (it draws from none) — it is a deterministic projection.
Only fixed point: pin float determinism (same accumulation order; the match log is already ordered).
*Source: cross-check vs ADR-0018 + [[../10-Architecture/state-machines/match]]. Confidence: high.*

## Inputs for decisions (maps findings → the Nico decision options)

- **D1 — Window/decay** → F2. Options: per-match rolling SMA / per-season average / **hybrid EWMA
  half-life≈15** (recommended). Optional fast+slow two-component.
- **D2 — Confidence model** → F3. Options: sample-count `n/(n+k)` / variance-based SE / **empirical-
  Bayes shrinkage with familiarity** (recommended, subsumes sample-count as a special case).
- **D3 — Carrier/cadence** → F1+F4 + ADR-0055/0051. ADR-0055 already lists *both* a projection and a
  `TacticalStyleSignalEmitted` event. Options: emit per-match event (Manager & Legacy folds) /
  **projection updated per-match, single authoritative read at run-end** (recommended; matches
  ADR-0051 "snapshot at run-end, never re-read") / both with the run-end snapshot authoritative.
- **D4 — Deliverable home** → process. Options: **new ADR-0074 extending ADR-0055** (recommended;
  avoids rewriting an accepted/binding ADR — add only a one-line additive "Related" pointer in
  ADR-0055) / inline appendix section inside ADR-0055.

## Future-scope (NOT this issue)
- Archetype taxonomy/naming + clustering from the vector (G3 / FMX-93, post-MVP playtest).
- Fingerprint UI (radar, league-z-score bars, "why this value?" drill-down, era timeline, HoF).
- Opposition-AI scouting consuming the fingerprint; media/board narrative lines.
- Calibration of baselines (μ0, s_ref) and weights → FMX-52 playtest tuning.
