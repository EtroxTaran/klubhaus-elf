---
title: GD-0026 Set-Piece-Coach Effect-Readiness Multiplier Curve
status: draft
tags: [game-design, gddr, set-pieces, staff, training, tactics, match, determinism, fmx-69, gap-g12]
created: 2026-06-04
updated: 2026-06-04
type: game-design
binding: false
related: [[README]], [[set-pieces]], [[GD-0005-training]], [[training-load-and-medicine]], [[GD-0021-player-staff-development-and-decision-influence]], [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]], [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]], [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[../60-Research/setpiece-coach-readiness-2026-06-04]]
---

# GD-0026: Set-Piece-Coach Effect-Readiness Multiplier Curve

## Status

draft

> **Draft / `binding: false`.** Closes audit gap **G12** (FMX-69, E2 epic FMX-58).
> Decisions **D1–D4** were put to Nico live on 2026-06-04 (ask-first gate) and chosen
> **A/A/A/A**. The document as a whole awaits ratification; named constants flagged
> **(FMX-52 calibration)** are not locked. Implement gameplay only once `approved`.
> Builds on accepted ADR-0067 (FMX-70); the readiness gate is an **additive** field on
> the frozen snapshot, proposed as an ADR-0067/ADR-0055 amendment (§7) — the accepted
> selection rule is not rewritten.

## Date

2026-06-04

## Player experience goal

A **Set-Piece Coach** is a tangible, legible investment lever: hire a specialist and
your rehearsed routines become match-usable **sooner** and execute **better**, but a
brand-new routine still has to be drilled over several weeks and **decays** if you stop
training it. The player reads one thing — a per-routine readiness bar that fills with
training and fades with neglect — and never micromanages drills. This mirrors the
real-world "first specialist is worth ~+5–10 set-piece goals/season with diminishing
returns" finding and the Football-Manager familiarity-bar UX precedent
([[../60-Research/setpiece-coach-readiness-2026-06-04]]).

## The fixed frame (binding inputs this GDDR must obey)

- **ADR-0053 (accepted/binding)** — Staff Operations owns the Set-Piece Coach **role**
  and the **specialisation-score** metadata, and emits `StaffSpecialisationUpdated`.
  *"Concrete gameplay effects remain in the consuming contexts"*; its pipeline read
  model consumes *"the consuming contexts' published effect-readiness signals"*. → the
  score is an **input**; a consumer computes readiness.
- **training-load-and-medicine.md §9 / §1 (binding)** — **Training** owns the
  Set-Piece Sessions block and applies set-piece effects via the GD-0021 factor matrix.
  → **Training computes readiness** (D4).
- **ADR-0067 (accepted/binding)** — set-piece variant selection is a **pure function**
  over the `TacticSnapshot` frozen at `lineup_locked`; `defaultVariantId` is always
  eligible. → the readiness gate restricts the **eligible set** and must be **frozen
  into the snapshot**, never read live (§7); the default variant is the always-ready
  floor.
- **ADR-0018 §3 (binding)** — readiness is a deterministic accumulation → it declares
  **no `*Rng` sub-label**.

## Decisions (D1–D4, chosen live by Nico 2026-06-04 = A/A/A/A)

| # | Decision | Chosen | Rationale |
|---|---|---|---|
| **D1** | Readiness progression curve | **A — bounded exponential** | Bounded in `[0,L]`, tunable by half-life / "weeks-to-X%"; fast-early-then-plateau matches the real embedding ramp. (vs logistic S / power law.) |
| **D2** | How the coach score enters | **A — scale the learning RATE** (ceiling fixed) | Better coach = faster maturity, same ceiling. Balance-safe, no "zero-week" edge, no runaway dominance. (vs raise ceiling / both.) |
| **D3** | Readiness granularity | **A — two-layer: category + variant** | Per-module **category familiarity** (transfers partially) + per-**variant** readiness (gates selectability). Depth + legibility; matches FM. |
| **D4** | Emitting context | **A — Training** | Training owns the learning progression and consumes the ADR-0053 score read-only; honours "effects live in the consumer". |

## The readiness model

### Inputs (read-only facts; no cross-context joins)

| Symbol | Range | Source | Meaning |
|---|---|---|---|
| `s` specialisationScore | `[0,1]` | Staff Operations `StaffSpecialisationUpdated` (`0` when no specialist assigned) | set-piece specialisation of the assigned coach |
| `τ` trainingShare | `[0,1]` | Training (weekly plan) | fraction of a full Set-Piece Sessions block-week spent on this category (`0` = not trained this week) |
| `c_cat` categoryFamiliarity | `[0,1]` | this projection (per module) | module-level familiarity |
| `r` readiness | `[0,1]` | this projection (per variant) | prior readiness of the variant |

### Per-variant readiness (weekly tick)

When the variant's category is trained that week (`τ > 0`):

```text
k  = k0 · (1 + κ·s) · (1 + λ·c_cat) · τ          # coach (D2) + category-transfer (D3) scale the RATE
r' = L − (L − r) · e^(−k)                          # bounded exponential (D1); ceiling L independent of s
```

When not trained that week (`τ = 0`) — exponential decay toward a retained floor:

```text
d  = (r ≥ r_embed) ? d_embedded : d_fresh          # embedded routines decay slower (motor-skill retention)
r' = r_floor + (r − r_floor) · e^(−d)              # r_floor = ρ·c_cat (category leaves residual memory)
```

### Category familiarity (per module)

`c_cat` advances by the same bounded-exponential whenever **any** variant in the module
is trained (rate `k0_cat ≪ k0`) and decays slowly when the module is idle. It (a)
contributes the `(1 + λ·c_cat)` rate bonus above so a club that already drills corners
learns a *new* corner routine faster, and (b) sets the retained decay floor `ρ·c_cat`.

### Selectability gate (hysteresis — no flapping)

```text
selectable: false → true  when r ≥ θ_on            # default θ_on = 0.85
selectable: true  → false when r ≤ θ_off           # default θ_off = 0.75
module.defaultVariantId is ALWAYS selectable        # the always-ready floor (ADR-0067 S3 totality)
```

### Match-day efficiency multiplier

Readiness also feeds a **bounded** efficiency multiplier into ADR-0067's
`resolve_attribute_math` step (it scales execution quality, **not** selection):

```text
effMult = m_min + (1 − m_min) · r                  # default m_min = 0.6 ; effMult ∈ [m_min, 1]
```

This is the dial the real-world "+5–10 set-piece goals/season" effect size calibrates,
**downstream of** the curve shape.

### Named constants (all **FMX-52 calibration**, behind `readinessModelVersion`)

`k0` (base rate; default `ln 10 / 5 ≈ 0.461`/wk → ~5 weeks to 90% with no coach) ·
`κ ≈ 0.75` (coach-rate; `s=1` ⇒ ~1.75× faster) · `λ` (category-transfer bonus) ·
`k0_cat` · `L = 0.98` · `d_fresh ≈ 0.15`/wk · `d_embedded ≈ 0.06`/wk · `r_embed = 0.8`
· `ρ` (residual-memory fraction) · `θ_on = 0.85` · `θ_off = 0.75` · `m_min = 0.6`.

## `SetPieceCoachReadinessUpdated` event (emitted by Training)

Emitted on the weekly training tick and whenever a variant's `selectable` flips.
**Self-contained** — it carries the `specialisationScore` snapshot it used, so consumers
never join back to Staff Operations (ADR-0053 ACL rule).

```ts
import { z } from "zod";

export const SetPieceType = z.enum([
  "offensive-corner", "defensive-corner", "direct-fk",
  "indirect-fk", "long-throw", "penalty",
]);

export const SetPieceCoachReadinessUpdated = z.object({
  schemaVersion: z.literal("1.0"),
  readinessModelVersion: z.string(),          // calibration/version gate (FMX-52)
  saveId: z.string().uuid(),
  clubId: z.string().uuid(),
  effectiveFrom: z.string(),                  // game-week boundary (ISO game-date)
  setPieceCoachAssigned: z.boolean(),
  specialisationScore: z.number().min(0).max(1),   // the ADR-0053 score this update consumed (snapshot)
  categories: z.array(z.object({
    module: SetPieceType,
    categoryFamiliarity: z.number().min(0).max(1),
  })),
  variants: z.array(z.object({
    variantId: z.string(),                    // matches ADR-0067 VariantId (immutable)
    module: SetPieceType,
    readiness: z.number().min(0).max(1),      // continuous
    selectable: z.boolean(),                  // hysteresis state; default variant always true
    efficiencyMultiplier: z.number().min(0).max(1),  // [m_min,1], feeds ADR-0067 resolve step
    trainedThisWeek: z.boolean(),
  })),
}).strict();

export type SetPieceCoachReadinessUpdated = z.infer<typeof SetPieceCoachReadinessUpdated>;
```

## Ownership & event flow

```text
Staff Operations  ──StaffSpecialisationUpdated(score s)──▶  Training        (read-only fact, ADR-0053)
Training          ── computes readiness curve (this GDDR) ─▶  emits SetPieceCoachReadinessUpdated
Tactics           ── at lineup_locked: reads latest projection, FREEZES per-variant
                     {selectable, efficiencyMultiplier} into TacticSnapshot
Match engine      ── reads the snapshot READ-ONLY (ADR-0067): un-selectable variants are
                     excluded from the eligible set; efficiencyMultiplier scales resolution
Club Management   ── coach wage/cost stays a Staff Ops → ledger fact; this GDDR writes NO ledger
```

## §7 — Integration with ADR-0067 (additive, proposed)

The accepted ADR-0067 selection rule is **not** rewritten. Two **additive** fields are
proposed on `SetPieceModuleSnapshot.variants[]` (frozen at `lineup_locked`):
`selectable: boolean` and `efficiencyMultiplier: number`. ADR-0067 §2 eligibility step 1
gains one predicate:

```text
1. eligible = module.variants.filter(v => v.selectable && triggerMatches(v.trigger, ctx))
2. if eligible is empty → module.defaultVariantId        # always selectable ⇒ selection stays TOTAL
3. ordered = eligible.sort(priority DESC, variantId ASC)  # unchanged
```

Because `selectable`/`efficiencyMultiplier` are **frozen pre-match**, `selectSetPieceVariant`
stays a pure function of its arguments (ADR-0067 S1/S7 preserved) and no readiness is read
live. This is recorded as a **proposed additive amendment** to ADR-0067 §2/§6 and the
ADR-0055 `TacticSnapshot` fields — Nico-gated, not self-accepted.

## Worked example (defaults; `c_cat = 0`, `τ = 1`, new variant `r₀ = 0`)

`r_n = L·(1 − e^(−k·n))`, `L = 0.98`.

| Week | No coach (`s=0`, `k=0.461`) | Elite coach (`s=1`, `k=0.806`) |
|---|---|---|
| 1 | 0.36 | 0.54 |
| 2 | 0.59 | 0.78 |
| 3 | 0.73 | **0.89 ✅ selectable** (≥ θ_on 0.85) |
| 4 | 0.82 | 0.94 |
| 5 | **0.88 ✅ selectable** | 0.96 |

Elite specialist → routine match-ready in **~3 weeks**; no specialist → **~5 weeks**
(≈1.7×), reproducing the calibration target. If the variant is then untrained, an
*embedded* routine (`r ≥ 0.8`) decays at `d_embedded ≈ 0.06`/wk (loses ~0.05 over a
fortnight) — slow drift, not collapse — while a *fresh* routine fades roughly 2.5× faster.

## Invariants (each a checkable policy)

| # | Invariant | Where enforced |
|---|---|---|
| **R1** | Readiness is a **pure deterministic** Training projection of `(r, τ, s, c_cat)`; **no RNG, no `*Rng` sub-label** (ADR-0018 §3). | Training readiness reducer |
| **R2** | Coach score scales the **rate only**; ceiling `L` is independent of `s` (no runaway long-run advantage). | reducer |
| **R3** | `readiness ∈ [0,1]`, `efficiencyMultiplier ∈ [m_min,1]`, `categoryFamiliarity ∈ [0,1]` — all bounded. | reducer + Zod schema |
| **R4** | `module.defaultVariantId` is **always selectable** regardless of readiness (ADR-0067 totality S3 preserved). | snapshot build + resolver |
| **R5** | Selectability uses **hysteresis** `θ_on > θ_off`; no per-week flapping. | gate function |
| **R6** | The event is **self-contained**: carries the `specialisationScore` it used; consumers never join back to Staff Operations. | event contract + ACL |
| **R7** | `selectable` + `efficiencyMultiplier` are **frozen into `TacticSnapshot` at `lineup_locked`**; the engine reads them read-only; no live readiness read (ADR-0067 S1/S7). | Tactics snapshot build |
| **R8** | Any coach cost/wage is emitted as a **fact to Club Management** (Staff Ops → ledger); this GDDR writes no ledger row. | ownership boundary |

## Acceptance-criteria mapping (FMX-69)

- [x] Multiplier model pinned with named parameters + worked example → §model + §worked.
- [x] `SetPieceCoachReadinessUpdated` fully specified, self-contained → §event (R6).
- [x] Emitting (Training) + consuming (Tactics/Match) contexts named; readiness
      deterministically gates ADR-0067 selectable variants → §flow + §7 (R4, R7).
- [x] Model references the **ADR-0053 specialisation score** as input, not a duplicate → §inputs.
- [x] Cost/wage impact emitted as facts to Club Management, not written directly → R8.

## Consequences

**Positive** — closes G12; set-piece coaching is a legible, season-scale investment lever
with realistic diminishing returns; gate is replay-safe (frozen pre-match, ADR-0067
purity intact); single source for the score (no duplication); decay creates a genuine
keep-it-drilled tradeoff without rote weekly micromanagement.

**Negative / constraints** — adds two additive fields to the accepted `TacticSnapshot`
(proposed amendment, Nico-gated); all magnitudes are FMX-52 calibration debt behind
`readinessModelVersion`; the two-layer model adds per-module + per-variant state to the
Training projection (bounded; no new RNG, no new persisted match state).

## Open / next

- **Nico ratify** GD-0026 (`draft` → `approved`) + approve the additive ADR-0067/ADR-0055
  snapshot-field amendment (never self-accepted).
- FMX-52 calibration: all named constants + the `effMult` mapping against the +5–10
  goals/season target.
