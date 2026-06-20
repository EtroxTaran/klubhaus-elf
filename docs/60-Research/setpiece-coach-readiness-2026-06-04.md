---
title: Set-piece-coach effect-readiness multiplier curve — synthesis (FMX-69)
status: draft
tags: [research, set-pieces, staff, training, tactics, match, determinism, fmx-69]
context: [training, staff-operations]
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[raw-perplexity/raw-setpiece-coach-readiness-2026-06-04]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../50-Game-Design/set-pieces]]
  - [[../50-Game-Design/GD-0005-training]]
  - [[../50-Game-Design/training-load-and-medicine]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
---

# Set-piece-coach effect-readiness multiplier curve — synthesis (FMX-69, gap G12)

Grounds the FMX-69 GDDR: the `SetPieceCoachReadinessUpdated` contract + the
readiness multiplier model. Raw capture:
[[raw-perplexity/raw-setpiece-coach-readiness-2026-06-04]] (4 prompts: real-world
effect, learning-curve math, comparable games, calibration ranges).

## 1. What the vault already locks (the fixed frame)

- **ADR-0053 (accepted/binding)** — Staff Operations owns the **Set-Piece Coach
  role** + **specialisation-score metadata** (an effect-modifier), emits
  `StaffSpecialisationUpdated`. Crucially: *"concrete gameplay effects remain in the
  consuming contexts (Training, Squad, Transfer, Match)"*, and its pipeline read-model
  consumes *"the consuming contexts' published effect-readiness signals (read-only)"*.
  → Staff Ops supplies the **score**; a **consumer computes readiness**.
- **training-load-and-medicine.md §9 (binding)** — *"Staff Operations owns
  specialisation metadata. **Training** consumes those facts through the GD-0021
  factor matrix and applies bounded effects."* §1 has a **Set-Piece Sessions** block →
  set-piece efficiency. → **Training is the natural readiness computer.**
- **set-pieces.md §4** — *"A Set-Piece Coach multiplies the training-block
  effectiveness. Without one, variants take more weeks to learn."* = the
  `base_weeks_to_learn` seed.
- **ADR-0067 (accepted/binding)** — set-piece variant selection is a **pure function**
  over the frozen `TacticSnapshot`: eligibility filter → `(priority DESC, variantId
  ASC)` order → `priority`/`seeded-mix`. `defaultVariantId` is the always-eligible
  fallback. → A readiness gate must restrict the **eligible set**, and to keep
  selection pure it must be **frozen into the snapshot at `lineup_locked`**, never read
  live. The default variant must be the always-ready floor.
- **ADR-0018 §3** — pure-deterministic projections declare **no `*Rng` sub-label**;
  readiness is a deterministic accumulation, so no RNG.

## 2. Evidence highlights (see raw for sources)

- **Real-world**: a first dedicated specialist ≈ **+5–10 set-piece goals/season**;
  **strong diminishing returns** (no→avg ≈ +4–5, avg→elite ≈ +2–3; first specialist
  captures ~60–80%). New complex routine embeds in **~2–3 weeks / 5–8 sessions**; team
  maturity over **~1 season** (30–50% by ~10 games, 70–100% by season end). Coach moves
  chance volume + quality; players are ~60–70% of the ceiling.
- **Learning curve**: **bounded exponential** `p(t)=L−(L−p₀)·e^(−k·t)` is the
  best-tunable default (half-life / "weeks-to-X%" interpretation). Heathcote et al.
  (2000): aggregate power-law can mask exponential individuals → no universal winner;
  pick by gameplay semantics. **Coach quality should scale the rate k, not the
  ceiling** (balance-safe; ceiling-scaling = runaway advantage).
- **Games**: FM = dedicated set-piece coach role (Set Pieces attribute dominant) +
  routine creator; **familiarity/fluidity bar** is the canonical readiness UX
  (accumulates with use, decays on change). EA FC = practice, not coaching. Lesson:
  *specialist raises the ceiling, rehearsal raises the floor, UI shows state + cost of
  change*; gated usability; no per-drill micromanagement.
- **Calibration**: base **~5 weeks** to 90% (3–8 range); top coach **~2×** (1.5–2.5,
  cap 3); bounded reciprocal `weeks=base/(1+k·score)`, **k≈0.75** → ~1.75×; decay
  **1–3 pp/wk**, embedded ~half; **two-layer** category+variant granularity.

## 3. Proposed model (to confirm with Nico)

Per-variant readiness `r∈[0,1]` advances weekly while a Set-Piece Sessions block is
allocated, via a **bounded exponential** whose rate is scaled by the coach
specialisation score `s∈[0,1]` (ADR-0053) and the category familiarity:

```
rate            k = k0 · (1 + kappa·s) · categoryFamiliarityBonus     # coach scales RATE, not ceiling
weekly update   r_{t+1} = L − (L − r_t)·e^(−k·trainingShare)          # L≈0.98 ceiling
no-train decay  r_{t+1} = r_floor + (r_t − r_floor)·e^(−d·1)          # d smaller when r_t high (retention)
selectable gate hysteresis: ready-on at θ_on≈0.85, ready-off at θ_off≈0.75
```

- **Two layers**: module/category familiarity (transfers partially, speeds new
  variants in that category) + per-variant readiness (sets match-day selectability +
  an efficiency multiplier into ADR-0067 resolution).
- **Determinism**: readiness is a deterministic Training-owned projection; the
  **selectable set is frozen into `TacticSnapshot` at `lineup_locked`** so ADR-0067
  stays a pure function. No `*Rng` sub-label. `defaultVariantId` always ready (floor).
- **Calibration debt → FMX-52**: `k0, kappa, L, d_fresh, d_embedded, θ_on, θ_off,
  base_weeks, categoryBonus`, behind a `readinessModelVersion`. Real-world effect size
  (+5–10 goals) calibrates the downstream efficiency multiplier, not the curve shape.

## 4. Decisions put to Nico (live, with recommendations)

- **D1 — Readiness progression curve**: **A. bounded exponential** (rec; bounded,
  half-life-tunable) · B. logistic S-curve (slow-start "click") · C. power law.
- **D2 — How the coach score enters**: **A. scale the learning RATE** via reciprocal
  `1/(1+kappa·s)`, ceiling fixed (rec; balance-safe, no zero-week) · B. raise the
  ceiling L(s) · C. both (compounding; risky).
- **D3 — Readiness granularity**: **A. two-layer category + per-variant** (rec) ·
  B. per-variant only · C. per-module only · D. single team-wide value.
- **D4 — Emitting context**: **A. Training computes & emits
  `SetPieceCoachReadinessUpdated`** consuming the ADR-0053 score (rec; matches binding
  §9) · B. Staff Operations emits it.
- **Carried as recommendation (derived from binding ADRs, not a free choice)**:
  readiness gate **frozen into `TacticSnapshot` at lineup_locked** (ADR-0067 purity);
  deliverable = a **GDDR** with the model + `SetPieceCoachReadinessUpdated` Zod schema,
  cross-linked to ADR-0053/0055/0067; calibration constants = FMX-52.
