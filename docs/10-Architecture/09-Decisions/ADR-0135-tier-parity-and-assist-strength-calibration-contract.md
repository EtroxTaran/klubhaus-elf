---
title: ADR-0135 Tier-parity and assist-strength calibration contract
status: draft
tags: [adr, architecture, dual-mode, parity, calibration, assist, monte-carlo, fmx-212]
context: [tactics, match, statistics-analytics, ai-world-simulation]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: FMX-212
supersedes:
superseded_by:
related:
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[ADR-0136-delegation-to-staff-contract]]
  - [[ADR-0137-stadium-construction-and-expansion-contract]]
  - [[ADR-0138-mode-state-placement-and-integrity]]
  - [[../../60-Research/tier-parity-measurement-calibration-2026-07-01]]
  - [[../../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
  - [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[../../60-Research/in-match-controls-tier-gating-2026-07-01]]
  - [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# ADR-0135: Tier-parity and assist-strength calibration contract

## Status

draft

Proposed. Prepared for FMX-212 Stage 2 on 2026-07-02. This ADR **proposes an extension of
the binding [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]
slot taxonomy** (new metric definitions, two new slot families, one new slot
field). Touching GD-0043 is a decision reserved to Nico; nothing in this note
is binding until he ratifies it. Marked items are the research corpus's
★-recommendations — **recommendations, not decisions**.

## Date

2026-07-02

## Context

The ratified dual-mode directions (D1 2026-07-01: three internal tiers
Quick/Standard/Expert branded as two worlds; D2 2026-07-01: switch anytime;
D3 2026-07-02: bounded pro edge via a floor+cap envelope, pro edge confined to
adaptation decision classes, Easy never a dominated strategy; D4 2026-07-01:
full sweep across every decision-bearing management area) create a product
promise that must be **measured and kept true over balance patches**, not
asserted. GD-0043 (binding) already owns gameplay calibration — slot contract,
harness tiers T0–T4, envelope/invariant tolerance policies, rebaseline
authority — but its slot taxonomy predates the dual-mode split: it has no slot
for tier parity and none for assistant/delegation strength.

The FMX-211/212 research corpus grounds the missing machinery:

- [[../../60-Research/tier-parity-measurement-calibration-2026-07-01|Tier-parity measurement packet]]
  — restricted-play framing, the policy ladder (`P_random` … `P_pro_opt`),
  floor-normalized parity ratio, patch-stability rules, draft
  `tactics.tierParity` slot.
- [[../../60-Research/assisted-play-parity-auto-coach-2026-07-01|Auto-Coach strength packet]]
  — two-anchor normalized strength `S`, throttled-expert mechanism precedent,
  per-decision-class degradation evidence, draft `assist.autoCoach` slot.
- [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02|Off-pitch parity packet]]
  — per-area anchor feasibility matrix, two-class anchor scheme
  (`anchorClass`), T3 outcome-distribution gates, no-domination invariant,
  draft `assist.delegation.<area>` slot family.
- [[../../60-Research/in-match-controls-tier-gating-2026-07-01|Live-controls packet]]
  — evidence that the live kit can stay mode-invariant and that the match area
  is the cheapest, already-instrumented place to define the parity metric
  first.

Without a single contract, each area would invent its own parity metric and
the D3 promise would fragment into incomparable numbers — the exact
"one truth per fact" failure GD-0043 exists to prevent.

## Options Considered

- **A — Per-area ad-hoc gates:** each domain GDDR defines its own parity
  metric and envelope. Rejected: incomparable claims, no shared anchor
  governance, silent staleness (the tier-parity packet shows anchors must be
  re-derived per patch or parity is overstated).
- **B — One uniform match-style gate everywhere:** apply the match-slice
  envelope (parity ratio vs an optimizer anchor) to every area. Rejected: the
  off-pitch packet shows optimizer anchors are infeasible v1 for
  transfers/scouting; a uniform gate would be dishonest exactly where the easy
  floor is most at risk (its NEW-d3-claim-strength-per-area Option A).
- **C — One shared metric grammar + declared per-area anchor class (this
  ADR):** a single parity/strength metric family and envelope shape, with the
  anchor's epistemic class (`optimizer` vs `scriptedReference`) declared per
  slot and the claim wording downgraded where only a reference anchor exists.

## Proposed Decision (pending Nico's ratification)

Adopt **Option C** as the tier-parity and assist-strength calibration
contract, as a proposed extension of GD-0043. All slots below follow the
GD-0043 calibration-slot contract verbatim (owner, `parameterPackVersion`,
tolerance policy, baseline authority = Nico, no silent rebaseline); this ADR
adds only the dual-mode-specific content.

### 1. Parity metric family (one grammar for every area)

Per the tier-parity packet's **NEW-parity-normalization** ★-recommendation
(recommendation, not a decision):

- **Headline gate — floor-normalized parity ratio**
  `R = (xPts(P_easy_opt) − xPts(P_random)) / (xPts(P_pro_opt) − xPts(P_random))`,
  measured per scenario cell. Normalizing above the random floor makes `R`
  measure the easy surface's share of *achievable decision value*, not raw
  output — a raw easy/pro ratio would be trivially high in a squad-dominated
  engine ([[../../60-Research/tier-parity-measurement-calibration-2026-07-01|tier-parity packet]],
  Findings 5–6).
- **Co-primary gate — head-to-head win-probability band** of `P_pro_opt` vs
  `P_easy_opt` over the sweep (the direct restricted-vs-unrestricted
  measurement, Finding 1 of the same packet).
- **Assistant strength — two-anchor normalized score**
  `S = (Assist − Naive) / (Expert − Naive)` on mean season points over
  Monte-Carlo season sims with identical starting state, where `Naive` (N) and
  `Expert` (E) are the versioned anchor agents of §2
  ([[../../60-Research/assisted-play-parity-auto-coach-2026-07-01|Auto-Coach packet]],
  "Inputs For Decisions / D3"). `S` and `R` share the same normalization idea;
  `S` is the per-assistant instrument, `R` the per-surface one.
- Supporting metrics (naive-viability band `V`, season league-position
  distributions, tail-cell checks) as defined in the tier-parity packet's
  measurement machinery; they are referenced here, not redefined.

The **match area defines the metric first**; every other area reuses the
definition rather than inventing a sibling — the match/live-control slice is
already instrumented via `match.core`/`match.liveControl` and is the cheapest
place to make the metric real
([[../../60-Research/in-match-controls-tier-gating-2026-07-01|live-controls packet]], D4 input).

### 2. Anchor policy: versioned agents inside the parameter pack

- Every parity/strength slot carries **versioned `ExpertReference` (E) and
  `NaiveBaseline` (N) agents as artifacts inside its parameter pack**. A
  strength number is only meaningful relative to a named, versioned reference
  and setting — the chess-precedent rule the Auto-Coach packet derives from
  UCI_Elo/CCRL anchoring (Finding 3).
- **Anchor policy** (★ tier-parity packet **NEW-optimal-anchor-policy**,
  recommendation, not a decision): the gate anchor is a **fixed-budget
  optimizer artifact (approximate best response), re-derived with the same
  versioned budget on every relevant patch**; fixed scripted heuristics
  (`P_pro_ref`, `P_easy_naive`) run unchanged as smoke references; human
  benchmarks are post-launch T4 validation. Comparing against stale optima
  silently overstates parity (tier-parity packet, Finding 2 and
  patch-stability rule 2).
- **`anchorClass` becomes a first-class slot field** (★ off-pitch packet
  **NEW-offpitch-anchor-class** Option C, recommendation, not a decision):
  `anchorClass: optimizer | scriptedReference`, declared per slot/area.
  Optimizer where the decision structure is compact (match/tactics, training,
  stadium & financing timing); scripted reference where a best response is
  intractable v1 (transfers, scouting) — per the off-pitch packet's
  feasibility matrix.
- **Per-area claim-strength rule** (★ off-pitch packet
  **NEW-d3-claim-strength-per-area** Option B, recommendation, not a
  decision): **optimum-relative envelope wording is allowed only where an
  optimizer anchor exists**; everywhere else the gate is a
  reference-relative corridor plus hard invariants, and any stated envelope
  number is marked `confidence: reference-relative` instead of borrowing the
  match-slice placeholders. An under-budgeted "optimizer" masquerading as an
  optimum would overstate parity — worse than an honest reference.

### 3. The D3 envelope (shape ratified; numbers OPEN)

The envelope shape follows ratified D3 (2026-07-02): **floor + cap**, per the
tier-parity packet's Option B machinery:

| Gate | Placeholder band | Status |
|---|---|---|
| Floor-normalized parity ratio `R` per cell | 0.85 ≤ R ≤ 0.95 | **OPEN — evidence-shaped placeholder** |
| Head-to-head win-prob `P_pro_opt` vs `P_easy_opt` | 52–57% | **OPEN — evidence-shaped placeholder** |
| Season-scale pro edge, equal squads, 34 matchdays | ~4–8 league points | **OPEN — evidence-shaped placeholder** |

The **exact numbers are explicitly open** until the simulation harness exists
and produces distributions to band against; ratifying this ADR ratifies the
*contract shape*, never these values. The cap is the fairness gate; the floor
keeps pro depth meaningful. Two ratified constraints bound any future numbers:
the **pro edge is confined to adaptation decision classes** (in-match
reaction, opponent-specific pivots, plan evolution) and must **never come from
degrading an assistant's static picks**
([[../../60-Research/assisted-play-parity-auto-coach-2026-07-01|Auto-Coach packet]],
Findings 2/5 and its D3-b rationale); and **Easy is never a dominated
strategy** (hard invariant, §4.2).

### 4. New slot families (proposed additions to GD-0043's taxonomy)

#### 4.0 `tactics.tierParity`

Adopted as drafted in the
[[../../60-Research/tier-parity-measurement-calibration-2026-07-01|tier-parity packet]]
("Calibration slot proposal"): owner tactics (with match; metrics surface via
statistics-analytics), policy-ladder parameter pack, primary metrics
`[R, head-to-head E, naive-viability V, xPts delta per cell, season position
distribution]`, harness T2 + T3, tolerance policy envelope (floor+cap per §3),
baseline authority Nico. Its patch-stability rules (re-run on any
`match.core`/`match.liveControl`/tactics parameter change; re-derive optimizer
anchors before gating; envelope breach fails the build; rebaseline is a
Nico-level decision) apply to **all** slots in this contract.

#### 4.1 `assist.autoCoach`

Adopted as drafted in the
[[../../60-Research/assisted-play-parity-auto-coach-2026-07-01|Auto-Coach packet]]
("GD-0043 calibration-slot proposal"):

- **Owner:** tactics (with training for the training-plan decision class).
- **Primary metrics:** normalized strength `S` per decision class (vs
  versioned N/E anchors); season-aggregate `S` corridor (the player-facing D3
  promise); **oracle agreement rate** and **mean regret** per decision class
  vs E; **proposal-diversity index** (guard against one-preset meta collapse).
- **Harness tiers:** T2 Monte-Carlo envelope + T3 multi-season soak (an
  Auto-Coach-managed club must not drift into FM-holiday-style decay).
- **Hard invariants:** `S` never below a per-decision-class floor; **aggregate
  `S` < 1.0** — the Auto-Coach must never beat the expert-reference agent,
  otherwise pressing it becomes the optimum and the pro surface dies (the
  packet's "too strong" failure mode, Finding 6).
- **Rebaseline coupling:** any `match.core` rebaseline invalidates the
  calibration; `assist.autoCoach` must re-run (and re-derive its anchors)
  before the gate passes again.

#### 4.2 `assist.delegation.<area>` (training | scouting | transfers | financeStadium)

Adopted per the delegation digest's **NEW-delegation-strength-spec**
★-recommendation as qualified by the
[[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02|off-pitch packet]]
(recommendation, not a decision). The delegation contract these slots gate is
[[ADR-0136-delegation-to-staff-contract|ADR-0136]] (same FMX-212 wave; its
invariant DL4 rides on this slot family):

- **Shared N/E methodology:** the same two-anchor `S` grammar as
  `assist.autoCoach`, with **per-area parameter packs** (own policy ladder,
  own `E_ref`/optimizer artifacts) — the anchor grammar transfers, the
  anchor's epistemic class does not, hence the per-slot `anchorClass` field
  (§2): `optimizer` for training and financeStadium, `scriptedReference` v1
  for transfers and scouting.
- **Gate-bearing observable:** T3 outcome distributions (league-position
  distribution, squad-value trajectory, wage-efficiency band), banded per
  squad-strength/table-region cell because both metrics are nonlinear at the
  table extremes; per-window metrics (fee vs value, hit rates, growth curves)
  are diagnostics, never gate-bearing alone (off-pitch packet, Findings 4/10
  and the slot-family draft).
- **Hard invariants (all areas, independent of anchor class):**
  - **No-domination distribution check (T3):** `P_naive`-with-delegation must
    not sit below the AI-field squad-expected band in league-position
    distribution — this is the measurable form of ratified "Easy is never a
    dominated strategy", and it is testable v1 in every area because floors
    need only `P_random`/`P_naive` and distributions, not optimizers.
  - **Worst-staff-band-above-easy-floor:** the weakest hireable staff band
    executing a delegated area must still keep the save above the easy floor —
    delegation quality may scale with staff, the parity floor may not.
- **Runbook ownership:** transfer and financeStadium bands owned by the
  [[../../30-Implementation/economy-calibration-and-soak-test-runbook|economy runbook]]
  (run on its `soak:50y` machinery), training and scouting by the
  [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook|gameplay runbook]]
  with an economy join view for scouting's downstream value — per the
  off-pitch packet's ownership table (recommendation, not a decision).

#### 4.3 Live-control constant

The delegated live-assistant effectiveness value (auto-shout/sub-timing
quality relative to optimal manual play) is **not** a new slot: it becomes a
named calibration value inside the existing `match.liveControl` slot, per the
live-controls packet's **NEW-live-assist-parity-number** input. Its target
sits inside the §3 envelope; ADR-0072/ADR-0087 contracts are untouched — mode
selects UI affordances and delegation policy only.

### 5. Strength mechanism and granularity (★-recommendations, not decisions)

- **Mechanism — throttled expert** (★ Auto-Coach packet
  **NEW-autocoach-strength-mechanism** Option A): assistants run the **same
  evaluation the AI-league managers use** (one policy to maintain, one
  simulation core), generate top-N candidates, and select via a
  temperature/probability schedule tuned to hit the target `S`, deterministic
  under a seeded stream. **Degraded evaluation (calibrated noise on beliefs)
  is rejected for explanation-bearing assistants**: it produces wrong beliefs
  that leak into the explanation UI and break the propose-only trust contract
  (packet Findings 4/10). Separately authored assistant heuristics are
  rejected as the documented FM-style decay architecture (Findings 2/5).
- **Granularity — per-decision-class vector, season-aggregate corridor as the
  gate** (★ **NEW-autocoach-strength-granularity**): engineering tunes an
  internal `S` vector per decision class (lineup, tactic preset, in-match
  triggers, training plan, per-area delegation classes) because assistants
  degrade non-uniformly; the **player-facing acceptance gate is the
  season-aggregate corridor** — the aggregate is what D3 promises, the vector
  is where the ratified "pro edge lives only in adaptation classes" constraint
  is actually enforced and audited.

### 6. Harness mapping — existing GD-0043 tiers only

No new harness tier is created; the contract maps onto GD-0043's T0–T4:

| Tier | Parity duty |
|---|---|
| T2 Monte-Carlo envelope | Parity sweep: policy ladder × squad-strength profiles × opponent policies × style cells, multi-seed; triggered by any `match.core`/tactics/relevant-economy parameter change. Sweeps gate **whole-mode policy families plus at most 2–3 sentinel override combos** (e.g. "Easy everywhere + Expert tactics", the highest-leverage combo since tactics is where the optimizer edge lives); an **ungated combinatorial override space cannot carry a parity promise** ([[../../60-Research/tier-parity-measurement-calibration-2026-07-01|tier-parity packet]], D1 input — sizing input to the open per-area-override fork, not a decision on it). |
| T3 season/campaign soak | Gate-bearing outcome distributions per release: league-position distributions per policy (match slice) and the §4.2 off-pitch trajectories on soak-scale horizons, including the no-domination hard invariant. |
| T4 playtest telemetry | Post-launch, consent-gated mode-split outcome telemetry validating the simulated gates against real players; also the eventual human-benchmark upgrade path for anchors. |

The match area is the reference implementation (§1); off-pitch areas reuse the
metric definitions and add their own scenario cells and packs.

## Rationale

- **One grammar, honest per-area claims.** Option C keeps every parity number
  comparable (same `R`/`S` definitions, same envelope shape) while the
  `anchorClass` field and claim-strength rule prevent the contract from
  promising optimum-relative parity where no optimizer exists — the corpus's
  strongest warning (off-pitch packet, Findings 1–5).
- **Rides binding machinery.** Everything runs under GD-0043's existing slot
  contract, tiers and rebaseline rule and the two existing runbooks; the
  extension is taxonomy + metrics, not new infrastructure.
- **Encodes the ratified D3 shape without freezing unripe numbers.** Floor+cap
  is ratified; the bands stay explicitly open until the harness can produce
  the distributions to band against — envelopes can tighten later without
  redesign, while a system tuned to exact parity cannot cheaply re-grow a pro
  edge (tier-parity packet, D3 recommendation).
- **Makes "Easy never dominated" testable now.** The no-domination T3
  distribution check needs only naive/random policies, so the hardest promise
  is enforceable v1 in every area, including the anchor-weak ones.

## Consequences

Positive:

- The D3 product promise becomes a regression-tested invariant with named
  owners, versioned anchors and Nico-only rebaselining — parity cannot silently
  rot across balance patches.
- Assistant strength stops being a vibe: `S`, oracle agreement, regret and
  diversity make Auto-Coach and delegation quality auditable per decision
  class, and the `S < 1.0` aggregate invariant structurally protects the pro
  surface.
- Per-area epistemic honesty (`anchorClass`, claim-strength rule) gives any
  future competitive labeling copy a defensible basis (open fork; the
  off-pitch packet ★-recommends promising the no-domination invariant globally
  and reserving percent-of-optimal language for optimizer-anchored areas).

Negative / follow-up:

- Two claim grammars (optimum-relative vs reference-relative) must be
  maintained and communicated; upgrading transfers/scouting to optimizer
  anchors is post-launch research with a re-wording step.
- Optimizer anchors are compute-costly and must be re-derived per patch; the
  fixed budget itself becomes a versioned artifact to govern.
- Scripted `E_ref` agents and the sentinel-combo list decay and need a
  re-validation cadence once live tuning starts (future-scope in both the
  tier-parity and off-pitch packets).
- GD-0043's taxonomy table, the two runbooks and the affected domain GDDRs
  need follow-up edits once ratified (index/backfill stage, not this note).

### Open forks carried (Nico decides; ★ = research recommendation, not a decision)

1. **Parity band numbers** — R floor/cap, head-to-head band, season point cap
   (★ placeholders 0.85–0.95 / 52–57% / ~4–8 pts, pending harness evidence).
2. **Parity normalization** — ★ `R` headline + head-to-head co-primary
   (NEW-parity-normalization Option b+c).
3. **Anchor policy** — ★ versioned fixed-budget optimizer re-derived per
   patch, scripted heuristics as smoke references (NEW-optimal-anchor-policy
   Option b).
4. **Per-area anchor class & claim wording** — ★ declared `anchorClass` per
   slot + two-class wording (NEW-offpitch-anchor-class C,
   NEW-d3-claim-strength-per-area B).
5. **Strength mechanism** — ★ throttled expert; degraded evaluation rejected
   for explanation-bearing assistants (NEW-autocoach-strength-mechanism A).
6. **Strength granularity** — ★ per-decision-class vector with
   season-aggregate corridor gate (NEW-autocoach-strength-granularity).
7. **Per-area override sweep scope** — ★ whole-mode families + at most 2–3
   sentinel override combos (interacts with the open per-area-override fork).
8. **Delegation slot-family details** — ★ NEW-delegation-strength-spec shape
   incl. runbook ownership split.
9. **Extending GD-0043 itself** — this whole ADR; GD-0043 is binding and only
   Nico can extend its taxonomy.

## Supersedes

None

## Related Docs

Same FMX-212 wave:

- [[../../50-Game-Design/GD-0046-two-worlds-mode-model]] — two-worlds cover
  (D1–D4 record; player-facing framing of the D3 envelope and the
  parity-band-numbers fork).
- [[ADR-0136-delegation-to-staff-contract]] — delegation contract gated by the
  `assist.delegation.<area>` slot family (§4.2, its DL4).
- [[ADR-0137-stadium-construction-and-expansion-contract]] — stadium parity
  cell (enumerable decision space; `anchorClass: optimizer`).
- [[ADR-0138-mode-state-placement-and-integrity]] — mode-state substrate; its
  future ADR-0108 amendment is fed by this ADR's D3 numbers-finalization pass.

Corpus and machinery:

- [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
- [[../../60-Research/tier-parity-measurement-calibration-2026-07-01]]
- [[../../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
- [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
- [[../../60-Research/in-match-controls-tier-gating-2026-07-01]]
- [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
- [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
- [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
