---
title: FMX-212 ratification agenda — two-worlds decision queue
status: draft
tags: [execution, decision-queue, ratification, dual-mode, two-worlds, fmx-212, fmx-223]
created: 2026-07-02
updated: 2026-07-02
type: execution
binding: false
linear: FMX-223
context: [tactics, match, staff-operations, stadium-operations, league-orchestration]
related:
  - [[fmx-212-fmx-143-re-approval-packet-two-worlds-2026-07-02]]
  - [[../00-Index/Open-Decisions-Dossier]]
  - [[../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[../50-Game-Design/GD-0047-easy-tactic-preset-library]]
  - [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity]]
---

# FMX-212 ratification agenda — two-worlds decision queue

## Purpose

Every open decision from the two-worlds effort (FMX-212 and its sub-issues
FMX-213…FMX-222), consolidated into one ordered accept/override checklist so
Nico can ratify in a single pass. **This note decides nothing** — each item
carries the agent recommendation; ratification is Nico's act. Once an item is
marked, an agent flips the owning note's `status: draft → accepted` and
`binding: false → true`, logs a supersede/decision-log entry, and applies any
enacting edit (e.g. the binding bounded-context-map amendments in A16/A17).

**Legend:** each item = the decision · the note that carries it · the ★
recommendation · what ratifying *enacts*. Alternatives live under
"Considered alternatives" in each owning note.

---

## Bucket A — actionable now (Nico ratification / taste)

### Group 1 — Product identity & switching (GD-0046, ADR-0138)

- [ ] **A1 · World names** — [[../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]]
  - ★ Top placeholder pair **Spieltag** (Easy) / **Taktiktafel** (Pro). Riders:
    prefer *Taktiktafel* over *Taktikzentrale* (prestige-neutral); resolve the
    *Spieltag* fixture-round homonym (reserve the word for the world label +
    rename the fixture screen, e.g. *Spielwoche/Ligarunde*) **or** fall back to
    the collision-free **Bauchgefühl / Spielidee**.
  - Enacts: fixes the world labels across onboarding/settings/marketing copy.
    *Still needs the GD-0015/ADR-0007 IP-clean + confusable/edit-distance +
    competitor-mark gate before the name is final — this is a taste pick, not a
    verified name.*
- [ ] **A2 · Middle onboarding answer copy** — GD-0046 — ★ frame the Standard-depth
  answer as "Spieltag mit mehr Details", never "Normal/Standard/Empfohlen". Taste confirm.
- [ ] **A3 · Competitive labeling + MP treatment** — [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity|ADR-0138]]
  - ★ One **mode-blind competitive primitive**: a single performance-sorted board
    for SP + async MP; world shown only as an evidence-grade, prestige-neutral
    badge on outcome-explaining surfaces (never a sort/partition key); any
    Pro-pure prestige is a read-time filtered view over the same board.
  - Enacts: the MP-fairness model + the GD-0046 player-promise copy.
- [ ] **A4 · Per-area override** — GD-0046/ADR-0138 — ★ confirm **deferred**, gated on
  A3 (protects the scalar→per-area-vector simplification). Enacts: records the deferral.

### Group 2 — Delegation contract (ADR-0136) — *items A6 & A8 are entangled balance levers*

- [ ] **A5 · GD-0021 staff-skill scope** — [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract|ADR-0136]]
  - ★ **Fixed staff-independent competence floor** at MVP for transfer-negotiation,
    finance-routine, stadium-maintenance (keeps binding GD-0021 scope closed);
    extend GD-0021 with real bands post-MVP only if wanted. Floor pinned at the
    resource-relative competent-median, gated on employing+paying the role seat.
  - Enacts: closes/keeps GD-0021 scope; if "extend", opens a GD-0021 amendment.
- [ ] **A6 · Tick resource-arbitration order** *(balance lever)* — ADR-0136
  - ★ **Obligation-first**: settle pre-committed Finance obligations (wages/debt)
    **before** arbitration → Training → Scouting → Transfer → Stadium-maintenance
    last. (Corrects the first-wave default, which risked a delegated-Easy
    insolvency.) The exact permutation is your call; the mechanism invariants
    (total order, stable tie-break, sequential fold, versioned) hold regardless.
- [ ] **A7 · Feed-salience thresholds** *(calibration owner)* — ADR-0136 — ★ sign off the
  three-axis taxonomy (irreversibility / club-resource-relative materiality /
  fan-emotional salience); the exact fractions are your calibration numbers.
- [ ] **A8 · Determinism vs bounded seeded variance at v1** *(direction)* — ADR-0136
  - Co-equal options recorded: **pure at v1** (determinism lens — variance adds
    zero replay-safety, addable later as a declared-now/armed-later drop-in) vs
    **bounded variance at v1** (your standing preference — de-exploits min-maxing).
    Mechanism invariants (counter/hash per-label RNG, confined to routine class,
    percentile-not-mean floor/cap) are pinned either way.

### Group 3 — Stadium contract (ADR-0137)

- [ ] **A9 · Construction-FSM (Option B) + Tier-1 corrections** — [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]]
  - ★ Ratify the deterministic construction-project FSM as the single contract,
    with the Quick wizard as its compile-down, after the Tier-1 corrections
    (single construction front door superseding ADR-0050's command; explicit
    PendingCommitment/solvency state; ledger-honesty statements).
- [ ] **A10 · ScheduleFacilityProject disposition** — ADR-0137 — ★ **scope to non-venue**
  (training/youth/medical) via one capitalisation-truth path, not full-retire.
  *Touches the binding bounded-context map (non-venue lifecycle ownership) — enact via A16.*
- [ ] **A11 · Facility depreciation** — ADR-0137 — ★ **IFRS-lite non-depreciation** at MVP
  (held at cost, ageing = maintenance OPEX), named as an explicit simplification;
  vs a real FacilityDepreciationPosted line.
- [ ] **A12 · Cancel-from-Commissioning ledger semantics** — ADR-0137 — ★ Commissioning →
  force-complete-and-capitalise; pre-Commissioning → sunk-cost write-off.
- [ ] **A13 · Expert-MVP joy affordance** — ADR-0137 — ★ decide in/out of MVP (phased
  authorship + growth visualisation + financial-lifecycle legibility), without a
  detached tycoon minigame.

### Group 4 — Easy tactics / presets (GD-0047, ADR-0135, tactics-system)

- [ ] **A14 · tactics-system §13 SSOT edit** — [[../50-Game-Design/GD-0047-easy-tactic-preset-library|GD-0047]]
  - ★ Bump Quick to **7 presets** via **supersede-by-reference** — §13 stops
    carrying a hard count and references GD-0047 §1 as sole owner (reject the
    "5 shown / 7 available" split). *Enacts a change to a binding SSOT statement.*
- [ ] **A15 · Final preset count 7 vs 6** — GD-0047 — ★ keep **7** as the authored default;
  the P3/P7 (Direct/Aerial) merge-to-6 stays a harness-gated fallback.
- [ ] **A16 · No-hard-counter clause + invariant blessing** — [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  - ★ Confirm the cross-mode no-hard-counter clause now lives in ADR-0135 as a
    harness assertion, and bless the GD-0047 preset invariants as
    `tactics.tierParity` assertions (thresholds stay open).

### Group 5 — Parity architecture (ADR-0135) + binding-map amendments

- [ ] **A17 · Tactical Evaluation Core subdomain** *(binding map change)* — ADR-0135
  - ★ Ratify the stateless eval kernel as a **Shared-Kernel supporting subdomain**
    (a `packages/tactical-eval/` sibling), consumed by AI-World and Auto-Coach
    adapters, with infra-owns-system / Nico+domain-owns-semantics anchor ownership.
  - Enacts: an amendment to the binding `bounded-context-map.md` (flagged, not
    yet applied). **Bundle with A10's non-venue ownership amendment into one map edit.**
- [ ] **A18 · Reduced-horizon soak proxies** — ADR-0135 — ★ accept reduced-horizon proxies
  for the most expensive off-pitch cells with an explicit fidelity caveat.
- [ ] **A19 · Higher-order interaction residual risk** — ADR-0135 — ★ accept the residual
  >t-way override-combo risk with a named change-detection monitor, vs mandating
  periodic higher-strength sweeps.
- [ ] **A20 · assist.delegation.<area> slot split** — ADR-0135/ADR-0136 — ★ keep finance +
  stadium sharing the `financeStadium` calibration slot (neither has an
  independent optimizer anchor); a split is an open calibration sub-fork.

### Group 6 — Umbrella flip

- [ ] **A21 · Ratify the note set** — once Groups 1–5 are settled, flip
  GD-0046, GD-0047 and ADR-0135/0136/0137/0138 from `status: draft` → `accepted`
  and `binding: false` → `true`, apply the two bounded-context-map amendments
  (A10 + A17), enact the §13 SSOT edit (A14), and log the Decision-Log +
  supersede entries. *Agent-executable once your calls above are recorded.*

---

## Bucket B — deferred (engine-gated; not actionable until the sim harness exists)

These are **not** blocked on Nico — they are blocked on the simulation engine.
The methodology to produce them is already ratified-in-proposal; only the values
wait.

- [ ] **B1 · Parity band numbers** — R floor/cap (placeholder 0.85–0.95),
  head-to-head win-prob band (52–57%), season-point cap (~4–8 pts). Set from
  per-cell distributions once the harness runs. (ADR-0135)
- [ ] **B2 · SPRT / cadence parameters** — α/β error rates, indifference
  half-width per band edge, per-cadence hard n-cap and wall-clock ceilings,
  "release" definition. (ADR-0135)
- [ ] **B3 · Calibration threshold numbers** — feed-salience materiality
  fractions (A7), preset-floor Y% and the ~20% squad-fit penalty / ≥4/7
  robustness bar (A16), delegation floor/cap percentiles (A8). Owned by the
  GD-0043 calibration process. (ADR-0136, GD-0047, ADR-0135)

---

## How to run the pass

1. For each Bucket-A item: **accept** the ★, or **override** with your call
   (a note is enough — "A6: Training first, not Finance-obligations" etc.).
2. Flag any item you want to **discuss live** before deciding.
3. Hand the marked list back; an agent enacts A21 (status/binding flips, the two
   map amendments, the §13 edit, Decision-Log entries) in one ratification PR.
4. Bucket B stays parked until the engine exists — revisit when the harness lands.

*Provenance: FMX-212 (Stage-1 research + Stage-2 drafts, PR #239) → FMX-213…218
fork resolution (PR #240) → FMX-219…222 hardening (PR #241). Full catalogue in
[[../00-Index/Open-Decisions-Dossier]].*
