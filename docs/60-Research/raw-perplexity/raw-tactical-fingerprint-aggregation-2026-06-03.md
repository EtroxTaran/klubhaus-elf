---
title: "RAW — Rolling aggregation + exponential decay for a style identity index"
status: raw
tags: [research, raw, perplexity, match, tactics, ewma, decay, determinism, fmx-68]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../tactical-identity-fingerprint-2026-06-03]]
---

# RAW Perplexity capture — Aggregation window + decay (FMX-68)

> Unprocessed transcript. Synthesised into
> [[../tactical-identity-fingerprint-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar). Citations are the model's own.

## Prompt

System: sports-analytics + statistics research assistant; precise, formula-oriented;
methods simple, deterministic, reproducible.

User: Aggregate a per-match 0..1 style signal into a single rolling 'identity' value
emphasising recent matches but stable (~30–50 matches/season, multi-season dynasty).
Compare SMA-over-N, EWMA (recurrence, alpha-from-half-life `alpha = 1 - 0.5^(1/h)`,
typical half-lives for form vs true talent), per-season vs career aggregation (Elo/Glicko/
SPI). Must be deterministic/reproducible from an ordered match log. Recommend a half-life
in matches balancing 'current identity' vs 'stable legacy', explain EWMA initialisation/
burn-in and the first few matches.

## Response

### 1) Simple moving average (SMA)
`ŝ_t = (1/N) Σ_{i=0..N-1} x_{t-i}` (for t ≥ N). Deterministic, interpretable, bounded.
Cons for *identity*: hard cutoff at N (discontinuity when a match drops out), equal weights
(recent should matter more), arbitrary N, very unstable early-season. Football "form"
practice: last 5–10 (form tables), last 8–10 (some Elo-adjusted betting). Good for form,
not identity.

### 2) EWMA (recommended)
Recurrence: `ŝ_t = α·x_t + (1-α)·ŝ_{t-1}`. Closed form: weights `α(1-α)^k` on lag k.
Bounded in [0,1] for inputs in [0,1]. **Half-life:** `1-α = 0.5^(1/h)` ⇒ `α = 1 - 0.5^(1/h)`.
Examples: h=5 → α≈0.129; h=10 → α≈0.066; h=15 → α≈0.0452; h=20 → α≈0.034.
**Typical half-lives:** true talent ≈ 15–40 matches (Elo constant-K ⇒ long effective
half-life tens of games; Glicko tracks true strength; FiveThirtyEight SPI core changes over
~a season with pre-season regression). Pure form ≈ 3–8 matches. Managerial identity is
**in between**.
**Initialisation/burn-in:** set ŝ_0 = x_1 (no prior), or a neutral/league/club prior
(0.5 symmetric), or backfill full history. Initial-value influence decays as (1-α)^t:
halved after h matches, ~1/8 after 3h, ~1/32 after 5h. For h=15, after ~75 matches (~2
seasons) initialisation is irrelevant. Flag index "provisional" for first ~2h matches.

### 3) Per-season vs cross-season
Per-season average `x̄_s` interpretable but no in-season recency, hard seasonal boundary.
Career/cross-season patterns: (a) single long-memory EWMA across all seasons (no reset; like
Elo/Glicko/SPI carrying across seasons) → natural legacy; (b) two-component fast+slow:
`ŝ^fast` (h_form 4–6) + `ŝ^slow` (h_legacy 15–30), combine `w·fast + (1-w)·slow` (w≈0.3).
Mirrors SPI blend of recent + slow core.

### Concrete recommendation
**Single EWMA, half-life h = 15 matches** → `α = 1 - 0.5^(1/15) ≈ 0.0452`.
Reasoning: in a 34–38 match season, match 15 games ago = half weight of latest; 30 ago =
0.25; over ~3 seasons (~100 matches) a match 90 ago ≈ 0.5^6 ≈ 1/64 (faint footprint, not
dominant). Reacts within a half-season yet remembers prior season(s) — between pure form and
true talent. Manager changes: either keep ŝ (gradual visible transition) or re-init at first
match for "under this manager" identity — both deterministic, just document which.
Optional two-component enhancement: report "identity" = slow EWMA (h=20), "form" = fast
EWMA (h=5). First few matches: run recurrence from match 1 with ŝ_1 = x_1 (or documented
prior); index relatively reactive for first ~10 matches at h=15, stable by ~30 (~2 half-lives);
optionally mark t < 2h as warm-up.

Citations (model's own): [1] StatsPerform possession-value · [2] Sportmonks aggregated stats ·
[5] PMC8929629 · [6] StatsBomb "modelling team playing style".
