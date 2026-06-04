---
title: Handoff fmx-69-set-piece-coach-readiness (2026-06-04)
status: open
tags: [meta, execution, handoff, fmx-69, set-pieces, staff, training, tactics]
created: 2026-06-04
updated: 2026-06-04
type: handoff
binding: false
related:
  - [[../../50-Game-Design/GD-0026-set-piece-coach-readiness]]
  - [[../../60-Research/setpiece-coach-readiness-2026-06-04]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
---

# Handoff: fmx-69-set-piece-coach-readiness (2026-06-04)

## Linear

- Issue: **FMX-69** — Set-piece-coach effect-readiness multiplier curve GDDR
  (E2 / FMX-58, gap **G12**). Set **In Progress** this session.
- Blocker **FMX-70** (E2-1, set-piece variant selection determinism / ADR-0067)
  confirmed **Done** (PR #120) → FMX-69 genuinely unblocked.
- Branch: `claude/fmx-69-set-piece-coach-effect-readiness-multiplier-curve-gddr`.

## Done this session

- Pre-flight: committed + PR'd the previously-orphaned **FMX-68** deliverable (it was
  uncommitted on its branch). Hit an **ADR number collision** — FMX-81 (merged #129)
  had taken ADR-0073 — so renumbered FMX-68's ADR **0073 → 0074**, rebased onto main,
  reopened PR **#130** (ADR-0074, `proposed`, awaiting Nico ratify+merge).
- Read the fixed frame: ADR-0053 (Staff Ops owns the score; effects live in consumers),
  training-load-and-medicine §9 (Training applies set-piece effects), set-pieces.md §4
  (coach × base_weeks_to_learn seed), ADR-0067 (pure selection over frozen snapshot),
  ADR-0018 §3 (no `*Rng` for pure projections).
- Ran **four grounded Perplexity researches**; saved 1 raw 4-prompt capture + 1 synthesis
  ([[../../60-Research/setpiece-coach-readiness-2026-06-04]]): real-world coach effect
  size, learning-curve math, comparable games (FM familiarity-bar precedent), calibration.
- Put **D1–D4** to Nico live; chosen **A/A/A/A**: bounded exponential · coach scales the
  RATE (reciprocal, ceiling fixed) · two-layer category+variant · Training emits.
- Authored **GD-0026** (`draft`): readiness model, `SetPieceCoachReadinessUpdated` Zod
  schema, ownership/flow, ADR-0067 §7 additive integration, worked example, 8 invariants
  (R1–R8), AC mapping. Pure-deterministic projection, **no `*Rng`**, default variant =
  always-ready floor.
- Wiring: README (GDDR table + tactics/match listing + range bump), set-pieces.md §4
  pointer, Current-State snapshot row.

## Open / next step

- **Nico ratify GD-0026** (`draft` → `approved`) + approve the **additive
  ADR-0067/ADR-0055** `TacticSnapshot` field amendment (`selectable` +
  `efficiencyMultiplier`). Then open/merge stays Nico's (never self-accept).
- Calibration (`k0, κ, λ, k0_cat, L, d_fresh, d_embedded, r_embed, ρ, θ_on, θ_off,
  m_min` + the `effMult` mapping vs the +5–10 goals/season target) = **FMX-52** debt
  behind `readinessModelVersion`.

## Blockers

- None. Ratification is Nico's gate.

## Changed vault paths

- `docs/50-Game-Design/GD-0026-set-piece-coach-readiness.md` (new)
- `docs/60-Research/setpiece-coach-readiness-2026-06-04.md` (new)
- `docs/60-Research/raw-perplexity/raw-setpiece-coach-readiness-2026-06-04.md` (new)
- `docs/50-Game-Design/README.md`, `docs/50-Game-Design/set-pieces.md`,
  `docs/00-Index/Current-State.md` (wiring)
