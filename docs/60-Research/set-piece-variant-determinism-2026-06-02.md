---
title: Set-piece variant selection determinism (FMX-70)
status: current
tags: [research, match-engine, determinism, set-pieces, tactics, rng, replay, gap-g9, fmx-70]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-70
sourceType: external
related:
  - [[raw-perplexity/raw-set-piece-variant-determinism-2026-06-02]]
  - [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../50-Game-Design/GD-0002-match-engine]]
  - [[../50-Game-Design/set-pieces]]
  - [[determinism-and-replay]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Set-piece variant selection determinism (FMX-70)

## Question

`set-pieces.md` §7 pins the match-engine hook as
`variant = tactic.set_pieces[type].select(context)` — but `.select(context)` is
**undefined**. When multiple authored set-piece variants satisfy their `Trigger`
preconditions at a dead-ball moment, no rule says which one the engine picks.
ADR-0026 (accepted, binding) makes the engine event log the determinism boundary
with **resim-from-kickoff** as the only replay model, and ADR-0018 §3 governs RNG
streams. What is the **deterministic, replay-safe variant-selection rule**,
captured in the immutable lock-time `TacticSnapshot`, such that two replays of the
same seed never diverge (audit gap **G9**, `weak-domain` / `unclear-invariants`)?

## Summary

Decision-ready recommendation, grounded in deterministic-engine practice and our
own architecture:

- **Selection is a pure function** `selectSetPieceVariant(snapshot,
  deadBallContext, deadBallIndex, rng?) → variantId` with **no mutable side
  state** — exactly the AC the issue requires.
- **Canonical total order:** filter eligible variants by trigger, then sort by
  **`(priority DESC, variantId ASC)`** — a stable, declaration-order-independent
  total order (tie-break resolved by immutable `variantId`).
- **Per-module selection mode (the key choice):** `priority` (pick the top of the
  sorted list — fully deterministic, no RNG, no state; the "use my A-plan corner"
  default that suits casual UX) **or** `seeded-mix` (a seeded pick over the
  eligible set — unpredictable to the opponent, still replay-safe). **[rec.:
  `priority` default + opt-in `seeded-mix` per module]** — matches set-pieces.md's
  "deep tactic + shallow casual UX".
- **`deadBallIndex` is derived, never persisted:** it is the count of prior
  dead-balls of that `(teamSide, type)` since kickoff, recovered by folding the
  event log forward during resim. This is free under ADR-0026's
  resim-from-kickoff model and satisfies "rotation state replay-reconstructable
  from snapshot + clock + seed, no hidden engine state".
- **RNG only in `seeded-mix`, via a labelled sub-label** under the existing
  `MatchCoreRng(matchId)` stream: `setpiece:<teamSide>:<type>:<deadBallIndex>`
  (splitmix-derived). Own sub-label (not the generic match-event one) for
  isolation + auditability — consistent with ADR-0018 §3 (adding sub-labels
  allowed; never draw from another subsystem's stream).
- **`TacticSnapshot` carries**, frozen at `lineup_locked`: per module, the ordered
  variant list (`variantId`, `priority`, trigger predicate) + a `selectionMode`.

Three shaping questions are **escalated to Nico** (§Open questions), carried as
option sets in ADR-0067 (`Status: proposed`, `needs:nico-decision`).

## Inputs (vault, binding/relevant)

- **ADR-0026 Match Frame Contract** (`accepted`, `binding: true`): engine emits
  **events only**; `MatchFrame` is derived, **never persisted**;
  **resim-from-kickoff (~50 ms) is the only replay model** (no periodic
  snapshots); same seeds → byte-identical event log. Has a "Human-decision forks
  (flagged, not silently decided)" discipline this work follows.
- **ADR-0055 Tactics context** (`accepted`, `binding: true`): owns `SetPieceRoutine`
  aggregate (FSM drafted→published→retired) + the persistent library; produces
  `TacticSnapshot` via `TacticLockSnapshotProduced` consumed by Match at
  `lineup_locked`. Set-piece variants are frozen inside the snapshot.
- **ADR-0018 §3** (`binding: true`): RNG streams — `MatchCoreRng(matchId)` for
  match events; sub-labels keyed like `venue:<clubId>:<week>`; "adding future
  sub-labels is allowed; drawing from another subsystem's RNG is forbidden".
- **set-pieces.md** §1–2, §7: five modules, each variant has a **Trigger** (when to
  use); engine hook `variant = …select(context)` (the undefined behaviour).
- **GD-0002** (`draft`): spatial-event engine; event log is the single source;
  "reproducible matches" is a Decided/strong goal.
- **determinism-and-replay.md**: integer coordinates, seeded streams,
  resim-from-kickoff (§3.4/§3.5).

## Findings

### F1 — `.select(context)` is the exact undefined seam (gap G9)
set-pieces.md §7's `.select(context)` has no tie-break/rotation rule. Two replays
of the same seed could pick different variants when ≥2 triggers match → a corner
that scores in one replay but not another, breaking watch-party shared viewing,
replay bug-reports and the audit trail. This is the entire scope of FMX-70.

### F2 — Selection must be a pure function (no hidden state)
Per ADR-0026, the engine holds no persisted intermediate state; everything is
recovered by resim-from-kickoff. So variant selection must be a pure function of
`(frozen snapshot, dead-ball match-state, deadBallIndex, optional seeded draw)` —
any mutable "last variant used" counter living outside the event log would be
hidden state and is forbidden.

### F3 — `deadBallIndex` is free under resim-from-kickoff
The replay model already folds the event log forward from kickoff. The count of
prior dead-balls of a `(teamSide, type)` is therefore reconstructable at any
point with zero extra persistence — exactly the "stateless functional rotation
counter" the external research recommends. No `cornerIndex` field needs to be
stored; it is derived during the same fold ADR-0026's `MatchWorldStateTracker`
already performs.

### F4 — Three deterministic models; pick by *desired predictability*
External research confirms priority / rotation / seeded are all replay-safe; the
real axis is opponent-predictability vs transparency. For a management sim:
**priority** is the legible default ("our A-plan"), **seeded-mix** is the opt-in
that stops opponents reading your priority list. Pure rotation (A,B,C…) is
deterministic but becomes equally readable long-term and adds the most
versioning fragility, so it is the weakest standalone choice. Recommended:
priority default + per-module `seeded-mix` opt-in (priority still defines
eligibility/ordering in both).

### F5 — Tie-break = `(priority DESC, variantId ASC)`
A stable total order keyed on immutable `variantId` (not declaration/file order)
is the recommended deterministic tie-break — refactor-safe and visible in logs.
This same sorted list feeds all three models (priority picks index 0; seeded-mix
draws an index over it).

### F6 — RNG isolation via an own sub-label under `MatchCoreRng`
A seeded set-piece draw must not perturb other match draws. ADR-0018's sub-label
model already provides this: derive `setpiece:<teamSide>:<type>:<deadBallIndex>`
under `MatchCoreRng(matchId)` (splitmix64 mixing). A dedicated `setpiece:*`
sub-label keeps draws independently auditable and future-proof; reusing the
generic match-event sub-label would couple set-piece selection to unrelated draw
counts. This is `MatchCoreRng`, **not** a new top-level stream — minimal and
within the existing scheme.

## Options matrix (carried into ADR-0067 for Nico)

### D1 — Selection model
| Option | Verdict |
|---|---|
| **A. Priority default + per-module opt-in `seeded-mix`** | **Recommended.** Casual = predictable best routine; expert = unpredictability; both replay-safe. |
| B. Pure seeded pick always | Strong determinism + unpredictability (external rec.), but removes the legible "always use my A-plan" guarantee casual users expect. |
| C. Priority-only | Simplest + most auditable, but fully predictable to opponents; variant starvation. |
| D. Pure rotation | Deterministic variety but long-term readable + highest versioning fragility. Weakest standalone. |

### D2 — Rotation/sequence-state location
| Option | Verdict |
|---|---|
| **A. Derive `deadBallIndex` from the event log during resim** | **Recommended.** Zero persistence; native to ADR-0026 resim-from-kickoff; no hidden state. |
| B. Persist a `cornerIndex`/`freeKickIndex` counter in match state | Works if serialized, but adds mutable state ADR-0026 deliberately avoids. |

### D3 — RNG sub-label
| Option | Verdict |
|---|---|
| **A. Own `setpiece:<side>:<type>:<deadBallIndex>` sub-label under `MatchCoreRng(matchId)`** | **Recommended.** Isolated, auditable, within ADR-0018's scheme. |
| B. Reuse the generic match-event sub-label | Couples set-piece draws to unrelated draw ordering; harder to audit. |

## Open questions for Nico (HITL — not self-decided)

1. **Selection model** (D1): priority default + opt-in seeded-mix **[rec. A]** vs
   pure-seeded vs priority-only vs pure-rotation.
2. **Sequence-state location** (D2): derived from event log **[rec. A]** vs
   persisted counter.
3. **RNG sub-label** (D3): own `setpiece:*` sub-label under `MatchCoreRng`
   **[rec. A]** vs reuse the match-event sub-label.

(Out of scope per the issue: variant *content/balance*; set-piece-coach effect
curves (FMX-69 / E2-4); opposition-AI variant selection (FMX-67 / E2-2); live
in-match overrides (G24).)

## Sources

- Internal: ADR-0026, ADR-0055, ADR-0018 §3, GD-0002, set-pieces.md,
  determinism-and-replay.md.
- External (raw at [[raw-perplexity/raw-set-piece-variant-determinism-2026-06-02]]):
  deterministic/lockstep replay practice (ruoyusun game-networking; jfgeyelin
  deterministic-game gotchas — splitmix64 / PCG sub-streams); tie-breaker design
  (leagueofgamemakers). Principles: pure-function selection, labelled per-decision
  RNG sub-streams, stable-id tie-break, counters derived-or-in-sim-state.
