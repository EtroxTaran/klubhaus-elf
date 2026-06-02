---
title: ADR-0067 Set-piece variant selection determinism
status: proposed
tags: [adr, architecture, match-engine, determinism, set-pieces, tactics, rng, replay, gap-g9, fmx-70]
created: 2026-06-02
updated: 2026-06-02
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0003-match-engine]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[../../50-Game-Design/set-pieces]]
  - [[../../60-Research/set-piece-variant-determinism-2026-06-02]]
  - [[../../60-Research/raw-perplexity/raw-set-piece-variant-determinism-2026-06-02]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# ADR-0067: Set-piece variant selection determinism

## Status

proposed

> **Proposed — not self-accepted.** Closes audit gap **G9** (set-piece variant
> selection determinism, `weak-domain`/`unclear-invariants`). Carries three
> **open questions for Nico** (§Open questions) as option sets with
> recommendations. This ADR is the **single canonical spec**; the proposed
> amendments to the accepted/binding ADR-0026 and ADR-0055 are recorded as
> clearly-marked `proposed` appendices in those files and applied in full only by
> a ratification PR (ratify gate; `needs:nico-decision`). Until then
> `binding: false`.

## Date

- Proposed: 2026-06-02

## Context

FMX-70 (E2 epic FMX-58, Match Determinism & Tactical Contracts) resolves audit
gap **G9**. `set-pieces.md` §7 pins the engine hook as
`variant = tactic.set_pieces[type].select(context)` — but `.select(context)` has
**no defined tie-break or rotation behaviour**. When two or more authored
variants satisfy their `Trigger` preconditions at a dead-ball moment, nothing
says which the Match engine picks.

This is a determinism hole. ADR-0026 (`accepted`, `binding`) makes the engine
**event log** the determinism boundary, with **resim-from-kickoff** as the only
replay model (no persisted intermediate snapshots) and "same seeds →
byte-identical event log" as the guarantee. ADR-0055 (`accepted`, `binding`) has
Match freeze a `TacticSnapshot` at `lineup_locked` (with set-piece variants
inside). ADR-0018 §3 (`binding`) defines the `MatchCoreRng(matchId)` stream and
the sub-label convention. A set-piece variant chosen non-deterministically would
make a corner score in one replay but not another — breaking watch-party shared
viewing, replay-based bug reports, and the audit trail.

Grounding: synthesis
[[../../60-Research/set-piece-variant-determinism-2026-06-02]] (deterministic /
lockstep replay practice + RNG sub-stream hygiene + tie-break design; raw at
[[../../60-Research/raw-perplexity/raw-set-piece-variant-determinism-2026-06-02]]).

## Open questions for Nico (HITL — not yet answered)

The proposal documents the model under the recommended options and does **not**
self-decide:

1. **D1 — Selection model.** **[rec. A]** **priority default + per-module opt-in
   `seeded-mix`** — vs B. pure seeded pick always; C. priority-only; D. pure
   rotation. (A = casual users get a predictable "use my A-plan corner"; expert
   users opt a module into unpredictability; both replay-safe.)
2. **D2 — Sequence-state location.** **[rec. A]** derive `deadBallIndex` from the
   event log during resim (zero persistence) — vs B. persist a per-team per-type
   counter in match state.
3. **D3 — RNG sub-label.** **[rec. A]** an own `setpiece:<side>:<type>:<deadBallIndex>`
   sub-label under `MatchCoreRng(matchId)` — vs B. reuse the generic match-event
   sub-label.

## Decision (proposed, under recommended options)

### 1. Selection is a pure function (the core invariant)

```ts
// Pure: no mutable side state, no I/O, no wall clock. Deterministic given inputs.
selectSetPieceVariant(
  module: SetPieceModuleSnapshot,   // frozen in TacticSnapshot at lineup_locked
  ctx:    DeadBallContext,          // dead-ball facts: zone, score, minute, personnel available
  deadBallIndex: int,               // count of prior dead-balls of (teamSide, type) since kickoff
  rng?:   Rng                       // present only when module.selectionMode === 'seeded-mix'
): VariantId
```

The Match engine consumes the snapshot **read-only** and never mutates variant
choice mid-match (ADR-0026 rule 8). Selection touches no state outside its
arguments.

### 2. Eligibility + canonical total order

```text
1. eligible = module.variants.filter(v => triggerMatches(v.trigger, ctx))
2. if eligible is empty → fall back to module.defaultVariantId (always eligible)
3. ordered = eligible.sort(by priority DESC, then variantId ASC)   // stable, total
```

`variantId` is an immutable, declaration-order-independent id (refactor-safe).
The `(priority DESC, variantId ASC)` order is the single tie-break for all modes.

### 3. Per-module selection mode

`module.selectionMode ∈ { 'priority', 'seeded-mix' }`, frozen in the snapshot:

- **`priority`** (default): `chosen = ordered[0]`. Fully deterministic; **no RNG,
  no `deadBallIndex` dependence**. The legible "always use my best matching
  routine" behaviour.
- **`seeded-mix`** (opt-in per module): a seeded uniform pick over `ordered`:
  ```text
  seed   = splitmix64( matchSeed ^ H("SETPIECE_VARIANT") ^ teamSideTag ^ setPieceTypeTag ^ deadBallIndex )
  i      = Rng(seed).uniformInt(0, ordered.length - 1)
  chosen = ordered[i]
  ```
  Unpredictable to the opponent, fully replay-safe (pure function of immutable
  inputs). Priority still defines eligibility + ordering; seeded-mix only chooses
  *within* the eligible, ordered set.

### 4. `deadBallIndex` is derived, never persisted

`deadBallIndex` = the number of prior dead-ball events of the same `(teamSide,
type)` since kickoff. It is recovered by **folding the event log forward** — the
same forward fold ADR-0026's `MatchWorldStateTracker` already performs — so it
needs **no stored counter** and introduces **no hidden engine state**. Replay
reconstructs it identically (AC: rotation state replay-reconstructable from
snapshot + clock + seed).

### 5. RNG sub-label (only used by `seeded-mix`)

Draws come from the existing `MatchCoreRng(matchId)` stream (ADR-0018 §3) under a
new, dedicated sub-label:

```
MatchCoreRng(matchId) · sub-label: setpiece:<teamSide>:<type>:<deadBallIndex>
```

This isolates set-piece draws from all other match draws (adding draws elsewhere
never shifts set-piece selection), keeps them independently auditable, and stays
within ADR-0018's "adding sub-labels is allowed; never draw from another
subsystem's RNG" rule. No new top-level RNG stream is introduced.

### 6. `TacticSnapshot` set-piece fields (frozen at `lineup_locked`)

```ts
SetPieceModuleSnapshot = {
  type: SetPieceType,                 // offensive-corner | defensive-corner | direct-fk | indirect-fk | long-throw | penalty
  selectionMode: 'priority' | 'seeded-mix',
  defaultVariantId: VariantId,        // always-eligible fallback (step 2.2)
  variants: ReadonlyArray<{
    variantId: VariantId,             // immutable, stable total-order key
    priority: int,                    // higher = preferred
    trigger: TriggerPredicate         // pure precondition over DeadBallContext
  }>
}
TacticSnapshot.setPieces: Readonly<Record<SetPieceType, SetPieceModuleSnapshot>>
```

Deeply `readonly` (ADR-0026 rule 8). `TriggerPredicate` evaluates purely over
`DeadBallContext`; it must not read engine-external or mutable state.

## Invariants (each a checkable policy)

| # | Invariant | Where enforced |
|---|---|---|
| **S1** | `selectSetPieceVariant` is pure: output depends only on `(module, ctx, deadBallIndex, rng?)`; no mutable side state, I/O, or wall-clock. | engine set-piece resolver |
| **S2** | Variant ordering is the **total** order `(priority DESC, variantId ASC)`; `variantId` is immutable and unique within a module. | snapshot build + resolver |
| **S3** | If no variant's trigger matches, `defaultVariantId` is selected (selection is **total** — never undefined). | resolver step 2 |
| **S4** | `priority` mode performs **no RNG draw** and is independent of `deadBallIndex`. | resolver |
| **S5** | `seeded-mix` draws **only** from `MatchCoreRng(matchId)` sub-label `setpiece:<side>:<type>:<deadBallIndex>`; never another stream. | resolver + ADR-0018 audit |
| **S6** | `deadBallIndex` is **derived** by folding the event log from kickoff; no persisted counter, no hidden state. | resim / `MatchWorldStateTracker` |
| **S7** | The `TacticSnapshot` set-piece fields are deeply `readonly`; the engine never mutates variant choice mid-match. | ADR-0026 rule 8 |
| **S8** | Same `(seed, inputs)` → same selected `variantId` on every replay (golden-replay byte-stability extends to set-piece selection). | golden-replay test |

## Verification

Extends the ADR-0026 golden-replay → deterministic-frame-sequence suite:

- A golden replay containing ≥2 dead-balls per `(side, type)` with overlapping
  triggers asserts the **same `variantId` sequence** on re-sim (S8).
- A `seeded-mix` fixture asserts the chosen index is reproducible from
  `(matchSeed, side, type, deadBallIndex)` alone, and that perturbing an
  *unrelated* match draw count does **not** change set-piece selection (S5/S6
  isolation).
- A pure-unit suite covers: eligibility filter, `(priority DESC, variantId ASC)`
  total order + tie-break (S2), empty-eligible fallback (S3), and `priority` mode
  taking no RNG draw (S4).

## Consequences

**Positive**

- Closes gap G9; set-piece selection is replay-safe end-to-end (watch-party,
  bug-replays, audit trail intact). Unblocks FMX-67 (opposition-template AI) and
  FMX-69 (set-piece-coach readiness), which both build on a stable selection
  contract.
- No new persisted state and no new top-level RNG stream — minimal surface on the
  accepted ADR-0026 / ADR-0018 architecture.
- Casual-friendly default (`priority`) with an expert unpredictability opt-in
  (`seeded-mix`) — matches set-pieces.md "deep tactic + shallow casual UX".

**Negative / constraints**

- Adds a `setpiece:*` sub-label whose key semantics (incl. `deadBallIndex`
  derivation) must be **versioned**: a future change to what counts as a
  dead-ball event of a type would shift old `seeded-mix` replays unless gated by a
  replay/engine version. Noted as a governance constraint.
- `seeded-mix` selection is only as auditable as the sub-label log; tooling must
  surface `(sub-label, seed, draw → variantId)`.

## HITL gate

`proposed` / `binding: false`. The amendments to **ADR-0026** (determinism
contract) and **ADR-0055** (`TacticSnapshot` fields) are recorded as
clearly-marked `proposed` appendices in those binding ADRs and the worked example
lands in **GD-0002** (draft); none of the accepted decisions are altered in place.
A ratification PR folds the appendices into the contracts once Nico answers
D1–D3. If a non-recommended option is chosen, §Decision is revised before apply.
