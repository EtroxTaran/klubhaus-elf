---
title: "RAW — Small-sample confidence model (empirical-Bayes shrinkage) for style signals"
status: raw
tags: [research, raw, perplexity, stats, bayes, shrinkage, confidence, fmx-68]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../tactical-identity-fingerprint-2026-06-03]]
---

# RAW Perplexity capture — Confidence / small-sample model (FMX-68)

> Unprocessed transcript. Synthesised into
> [[../tactical-identity-fingerprint-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar). Citations are the model's own.

## Prompt

System: statistics assistant, small-sample estimation + Bayesian methods for sports.
User: Confidence model for a style metric from a small, growing match sample (3–10 early,
200+ late). Continuous 0..1 score per dimension; want point estimate + 0..1 confidence that
is low with few matches, high with many, and reflects behavioural noise. Compare with exact
formulas: (1) sample-count `n/(n+k)` shrinkage; (2) variance-based (SE ∝ 1/√n → 0..1);
(3) Bayesian/empirical-Bayes shrinkage + credible intervals. Recommend the simplest
defensible one for a deterministic, explainable game; give exact formula combining sample
size AND behavioural variance into one confidence, plus a 'familiarity' factor that widens/
narrows confidence; worked example n=4 and n=40.

## Response

### 1) Sample-count shrinkage
`θ̂ = w_n·x̄ + (1-w_n)·μ0`, `w_n = n/(n+k)`; confidence = w_n. k = "equivalent prior
sample size" (matches of prior info μ0 is worth). For target confidence c at n0:
`k = n0·(1-c)/c` (e.g. 50% at n=10 ⇒ k=10). Simple/deterministic but **ignores variability**.

### 2) Variance-based (SE)
`s² = (1/(n-1))Σ(x_i-x̄)²`, `SE = s/√n`. Map to 0..1: `confidence_SE = exp(-SE²/σ_ref²)`
(SE=0→1; SE=σ_ref→≈0.37). Uses n AND noise; no regression to mean; σ_ref hand-chosen.

### 3) Bayesian / empirical-Bayes (normal–normal)
Prior θ ~ N(μ0, τ0²), likelihood x_i|θ ~ N(θ, σ²). Posterior:
`μ_n = w_n·x̄ + (1-w_n)·μ0`, `w_n = n/(n + σ²/τ0²)`, `τ_n² = (n/σ² + 1/τ0²)^-1`.
Same form as n/(n+k) with `k = σ²/τ0²`; posterior variance shrinks like 1/n. Estimating
σ²≈s² gives empirical-Bayes (shrinks more when noisy). Confidence = `exp(-τ_n²/τ_ref²)`.
Regression to prior + uses size & variability; needs μ0, τ0², σ² (global per dimension).

### Recommended hybrid (looks like n/(n+k), incorporates variance + familiarity)
Per manager & dimension from x_1..x_n ∈ [0,1]:
- x̄, sample sd s. Precompute league prior mean μ0 and reference sd s_ref (≈0.2) per dimension.
- Baseline prior strength k0 (e.g. confidence 0.5 at n=10 ⇒ k0=10).
- Variance inflation `v = s/s_ref`, clamp to [0.5, 2.0].
- Familiarity F ∈ [0,1] (1 = same tactic always; 0 = constant switching). Factor
  `f = 1 - α(1-F)`, α≈0.5 (F=1→f=1; F=0→f=0.5).
- `k_eff = k0 · v_clamped · (1/f)`.
- `w = n/(n + k_eff)`. **Point estimate** `θ̂ = w·x̄ + (1-w)·μ0`. **Confidence = w**.
Higher variability or lower familiarity → larger k_eff → more shrinkage, lower confidence,
pulled toward league average. Player-facing line: "More confident when more matches, more
consistent, and a familiar approach; low confidence shows closer to league average."

### Worked examples (μ0=0.5, k0=10, s_ref=0.2, α=0.5)
**n=4**, x={0.7,0.8,0.2,0.9}: x̄=0.65, s≈0.311, v≈1.555, F=0.7→f=0.85, k_eff≈18.3,
w=4/22.3≈0.18 (confidence ≈0.18), θ̂≈0.18·0.65+0.82·0.5≈0.527.
**n=40**, x̄=0.70, s=0.18, F=0.9: v=0.9, f=0.95, k_eff≈9.48, w=40/49.48≈0.81
(confidence ≈0.81), θ̂≈0.81·0.70+0.19·0.5≈0.662.

Citations (model's own): [3] statmills team strength · [4] r-bloggers soccer modelling ·
[6] measuringu sample sizes · [7] PMC12708546 · [8] arXiv 2508.05891.
