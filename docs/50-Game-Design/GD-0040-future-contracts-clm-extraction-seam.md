---
title: GD-0040 Future Contracts/CLM Extraction-Seam Decision
status: draft
tags: [game-design, gddr, contracts, clm, bounded-context, extraction-seam, ddd, transfer, squad, staff, loan, commercial]
created: 2026-06-08
updated: 2026-06-08
type: gddr
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/state-machines/player-contract-lifecycle]]
  - [[../10-Architecture/state-machines/loan-orchestration]]
  - [[GD-0006-transfers]]
  - [[transfer-market-and-contracts]]
  - [[regulations-and-compliance]]
---

# GD-0040: Future Contracts/CLM Extraction-Seam Decision

> **Status `draft` — for Nico to ratify (decision gate, `docs/90-Meta/collaboration-and-decision-protocol.md`).**
> Nothing here is accepted. This GDDR does **not** create, move, or rename any bounded
> context, and does **not** touch [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
> or [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]] (read-only;
> supersession, if ever wanted, would be a new draft ADR with `Supersedes:` — not an edit here).
> Its only job is to give the **one shared open question** a single home so the two ADRs stop
> tracking it in parallel.

## Why this exists

Two ADRs each independently carry a footnote reserving a **future Contracts / Contract-Lifecycle-Management
(CLM) bounded context** as an extraction seam, in slightly different words:

- **ADR-0073 (Player Contract Lifecycle FSM)** — "A future Contracts context may still be needed if
  player/staff/commercial/loan contract complexity becomes a shared CLM platform" (Consequences), and
  in its HITL gate: "final decision whether a future Contracts bounded context is warranted after
  loans/staff/commercial contract work is complete." Its option **C. New Contracts context** was
  "rejected for this beat as premature map growth. Keep as a future extraction seam."
- **ADR-0075 (Loan-Orchestration Process Manager)** — open item: "whether a future **Contracts/CLM**
  bounded context absorbs loan + staff + commercial contracts once those land (kept as an extraction
  seam, mirroring ADR-0073)." Its rejected option **C. Standalone "Loan Lifecycle" context** is kept
  "as a future extraction seam ... mirrors ADR-0073's Contracts-context note."

So **one** question is recorded as **two** footnotes that explicitly cross-reference each other
("mirroring ADR-0073"). That is exactly the drift risk our single-source-of-truth rule exists to
prevent: a future beat (staff contracts, commercial/sponsor contracts) could re-answer it in one place
and leave the other stale, and neither ADR is the obvious owner of the verdict. This GDDR consolidates
the seam into one tracked decision without disturbing either ADR.

**The real question (one sentence):** *Does the combined player + staff + commercial + loan contract
complexity warrant a dedicated Contracts/CLM bounded context post-MVP — and until we know, where is that
question owned?*

This is a map-shape / scope question, so per the decision gate it is **presented, not decided**.

## Options considered

### Option A — Defer-and-keep-seam (one tracked open question) — recommended

Record **one** consolidated decision: *no Contracts/CLM context now*; keep it as a **single named
extraction seam** owned here in GD-0040 and re-evaluated only after loans / staff contracts /
commercial contracts actually land. The two ADR footnotes are not edited; instead this GDDR becomes the
**canonical home** they point at, so future re-evaluation happens in exactly one place.

- **Pros:** Stops the parallel-footnote drift (one fact, one home). Preserves the legitimate future
  extraction path without committing the map. Matches both ADRs' *already-chosen* landing (each rejected
  the dedicated context "for this beat" and kept the seam) — so it ratifies what is already implied,
  rather than inventing scope. Aligns with [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]:
  in a modular monolith you extract a context when a real seam *and* real complexity demand it, not
  speculatively. The trigger condition is concrete and observable (loan + staff + commercial contract
  work shipped) rather than a vague "someday".
- **Cons:** A third document now references the seam (mild indirection) — mitigated because GD-0040 is
  declared the single source and the ADRs already cross-reference each other anyway. Defers, rather than
  answers, the underlying architecture question (intentional: the evidence to answer it does not exist
  pre-MVP).
- **Net:** Lowest-regret. Removes a documented drift hazard, keeps the option open, commits nothing.

### Option B — Pre-commit to a Contracts/CLM context now

Decide today that a dedicated Contracts/CLM bounded context exists, and route player-contract lifecycle,
loan terms, staff contracts and commercial/sponsor contracts through it.

- **Pros:** Clean conceptual home for "all contract paperwork"; avoids a future migration if the context
  is ultimately built.
- **Cons:** **Premature map growth** — the exact reason *both* ADR-0073 (option C) and ADR-0075 (option C)
  rejected it for their beats. Staff and commercial contracts are not yet designed, so we would be
  drawing boundaries around capabilities that do not exist; high risk of carving the seam in the wrong
  place. Pulls contract truth out of its current rightful owners (Squad & Player owns player-contract
  lifecycle truth per ADR-0073; Transfer owns deal/loan cases per ADR-0075) with no offsetting benefit
  at MVP. **Rejected for MVP.**

### Option C — Drop the seam entirely

Delete the "future Contracts/CLM context" note from the live design and treat a dedicated context as a
non-goal.

- **Pros:** Maximally minimal map; one fewer open question to carry.
- **Cons:** Throws away a **legitimate future extraction path**. CLM consolidation is a recognised
  pattern once contract complexity spans multiple owners (player + staff + commercial + loan), and both
  ADRs independently identified it as plausible — discarding it would be deleting hard-won design memory,
  and we would likely re-derive the same seam later from scratch. Violates "supersede, don't silently
  drop." **Rejected.**

## Recommendation

**Option A — Defer-and-keep-seam, consolidated here.** Adopt **one** "defer, keep the seam" decision so
ADR-0073 and ADR-0075 stop tracking the identical question in parallel. Concretely, on ratification:

1. **GD-0040 becomes the single source of truth** for the future-Contracts/CLM extraction-seam question.
   No context is added to [[../10-Architecture/bounded-context-map]]; the map is unchanged.
2. The **re-evaluation trigger** is named and observable: revisit *only* once loan orchestration,
   **staff** contracts, and **commercial/sponsor** contracts have all shipped and we can measure whether
   contract logic genuinely spans owners enough to justify a context. Until then the answer is "no
   context — Squad & Player owns player-contract truth, Transfer owns deal/loan cases" (status quo per
   ADR-0073 / ADR-0075).
3. The two ADR footnotes are **left untouched** (read-only). If Nico later wants them to point at this
   GDDR explicitly, that is done via a *new* draft ADR or at the next time each ADR is legitimately
   revised — never by editing the accepted text here.

**Confidence: medium.** High that consolidating the duplicate footnotes is correct and low-risk; the
medium reflects the *future* architecture call itself, which genuinely cannot be answered until
staff/commercial/loan contract work exists — Option A deliberately keeps that open rather than guessing.

## Consequences if ratified

- One drift hazard removed: the future-CLM question has exactly one home (this file).
- Bounded-context map and both ADRs are unchanged; no migration, no new context, no new public contract.
- A clear, observable re-evaluation trigger replaces two vague "someday" footnotes.
- Future contract beats (staff, commercial) inherit a single place to record evidence for/against the
  extraction, rather than re-opening the question in whichever ADR they happen to touch.

## Open follow-ups (not decided here)

- Whether, at the eventual re-evaluation, the seam resolves to a **shared CLM context**, a **set of
  per-owner contract aggregates**, or stays distributed — explicitly out of scope until the prerequisite
  contract work lands.
- Whether ADR-0073 / ADR-0075 should be lightly amended (via new draft ADRs) to back-reference GD-0040,
  or simply left as historical footnotes — a documentation-hygiene call for Nico.
