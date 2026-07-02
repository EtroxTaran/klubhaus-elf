---
title: ADR-0135 Tier-parity and assist-strength calibration contract
status: draft
tags: [adr, architecture, dual-mode, parity, calibration, assist, monte-carlo, fmx-212, fmx-218]
context: [tactics, match, statistics-analytics, ai-world-simulation]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: [FMX-212, FMX-218]
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
  - [[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02]]
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

FMX-218 (2026-07-02) hardens the calibration **methodology** this ADR left open —
anchor ownership/versioning (§2), harness cadence sizing (§6) and the shared
Auto-Coach↔opponent-AI evaluation boundary (§5) — grounded in
[[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02|the FMX-218 raw capture]].
Every parity **band number and per-cell seed count stays explicitly
OPEN/harness-gated**: FMX-218 fixes the method that will *produce* those values,
never the values themselves. Its additions are equally **recommendations, not
decisions**.

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
- **`R` is a ratio-of-differences estimator — low-denominator caveat** (★ FMX-218,
  recommendation, not a decision). Because
  `R = (easy_opt − random) / (pro_opt − random)`, its variance EXPLODES where the
  denominator (achievable decision value) is small — precisely the squad-dominated
  cells. Therefore the head-to-head co-primary is the **PRIMARY instrument in
  low-denominator cells**, acceptance is **WORST-CELL** (a per-cell CI bound), and
  **`R` is NEVER pooled or averaged across cells** — it is comparable only within a
  fixed cell, the UCI_Elo context-specificity rule
  ([[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02|FMX-218 raw capture]], Q2).
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

### 2. Anchor policy: versioned anchor agents in a shared registry, pinned by reference

- Every parity/strength slot depends on **versioned `ExpertReference` (E) and
  `NaiveBaseline` (N) anchor agents**. A strength number is only meaningful
  relative to a named, versioned reference and setting — the chess-precedent rule
  the Auto-Coach packet derives from UCI_Elo/CCRL anchoring (Finding 3). But the
  **anchor bytes live in a SEPARATE shared calibration/agent registry** —
  immutable, content-addressed artifacts, the MLflow/DVC/W&B registry pattern —
  **NOT inside the slot's parameter pack**; each slot's pack **version-pins** them
  via two NEW first-class slot fields: `anchorRefs: [<registryId@semver>]` and
  `evalSuiteVersion`. Bundling the anchor bytes into the pack welds a long-lived
  baseline lifecycle to fast config churn and blocks reproducible historical
  re-runs (★ FMX-218 Q1,
  [[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02|FMX-218 raw capture]];
  recommendation, not a decision).
- **Ownership split** (★ FMX-218, recommendation, not a decision): the
  **infra/eval-platform team owns the evaluation SYSTEM** — the registry, storage,
  access control, CI eval pipelines and the eval-suite build; **Nico/domain owns
  what "expert" and "naive" MEAN** and signs off on any anchor change. Change
  control: domain proposes an anchor change with its expected metric impact; infra
  rolls it out via the registry under code-review approval and a changelog.
- **Anchor SemVer discipline** (★ tier-parity packet **NEW-optimal-anchor-policy**
  as amended by FMX-218, recommendation, not a decision): **MAJOR** = a
  rules/reward/engine/kernel-comparability break OR anchor-quality-diagnostic
  degradation (below) — this **forces anchor re-derivation and re-banding** and is
  already coupled to a `match.core` rebaseline; **MINOR** = a compatible
  improvement keeping the eval protocol comparable; **PATCH** = a neutral bugfix
  that does not alter evaluated strength. **Never mutate an anchor in place** —
  always cut a new version and mark historical metrics with the suite + anchor
  versions they ran on.
- The gate anchor E is a **fixed-budget optimizer artifact (approximate best
  response), re-derived on every relevant patch** — but re-derived **matched in
  OUTCOME space (equal approximate-exploitability / self-play
  convergence-plateau), not merely equal compute budget**. An anchor is a BIASED
  estimator of the true optimum: if the pro surface is harder to optimize than the
  easy surface, a fixed budget under-estimates `P_pro_opt` MORE, which **INFLATES
  `R` and silently overstates parity**. Fixed scripted heuristics (`P_pro_ref`,
  `P_easy_naive`) run unchanged as smoke references; human benchmarks are
  post-launch T4 validation. Comparing against stale or under-converged optima
  silently overstates parity (tier-parity packet, Finding 2 and patch-stability
  rule 2).
- **Each anchor artifact carries an anchor-QUALITY diagnostic** (★ FMX-218,
  recommendation, not a decision) — an approximate-exploitability estimate or a
  self-play convergence-plateau check — stored with the artifact; its
  **degradation is a MAJOR SemVer trigger** forcing re-derivation, because a
  silently under-converged anchor is the single-direction error that
  fixed-compute matching cannot catch.
- **`anchorClass` remains a first-class slot field** (★ off-pitch packet
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
- **E is DERIVED from the shared evaluation kernel of §5** run at max/unthrottled
  budget as a pinned calibration config — **not separately authored** (see the §5
  joint change-control rider); N is a degenerate fixed config of the same kernel.

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

**Banding procedure (★ FMX-218; numbers stay OPEN).** Once the harness produces
per-cell distributions, set the fairness **CAP** from the UPPER CI bound of
head-to-head vs the perceived-unfairness threshold, and the depth **FLOOR** from
the LOWER CI bound of `R` vs the meaningful-edge threshold; the per-cell seed
count is the power analysis needed to resolve those edges at worst-case p (§6).
Because `R`'s variance explodes in low-denominator (squad-dominated) cells (§1),
both bounds are applied **per cell** — head-to-head is the primary instrument
there and `R` is never pooled into a mean. This fixes the *method* that produces
the bands; the values above remain harness-gated.

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
- **Hard invariants (confidence-bound form, ★ FMX-218):** the **UPPER CI bound
  of aggregate `S` < 1.0** — the Auto-Coach must never beat the expert-reference
  agent, otherwise pressing it becomes the optimum and the pro surface dies (the
  packet's "too strong" failure mode, Finding 6); and the **LOWER CI bound of
  per-decision-class `S` ≥ its floor**. Casting the point estimates as confidence
  bounds means a single unlucky seed draw cannot red the build: nightly
  evaluation of these invariants applies **FWER/FDR multiplicity control** across
  the cell family and a **replicate-before-gate** rule.
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
  - **No-domination distribution check (T3, confidence-bound form, ★ FMX-218):**
    the **LOWER CI bound** of `P_naive`-with-delegation's position-vs-AI-field
    must not sit below the domination threshold in **EVERY cell** — the measurable
    form of ratified "Easy is never a dominated strategy", testable v1 in every
    area because floors need only `P_random`/`P_naive` and distributions, not
    optimizers.
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
  shared evaluation KERNEL the AI-league managers use** (one kernel to maintain,
  one simulation core), generate top-N candidates, and select via a
  temperature/probability schedule tuned to hit the target `S`, deterministic
  under a seeded stream — the Stockfish `Skill Level`/`UCI_Elo` "throttle
  SELECTION, not understanding" precedent, one engine externally anchored to a
  fixed rating list (★ FMX-218 Q3,
  [[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02|FMX-218 raw capture]]).
  **Degraded evaluation (calibrated noise on beliefs) is rejected for
  explanation-bearing assistants**: it produces wrong beliefs that leak into the
  explanation UI and break the propose-only trust contract (packet Findings
  4/10). Separately authored assistant heuristics are rejected as the documented
  FM-style decay architecture (Findings 2/5).
- **One shared evaluation kernel, three thin adapters** (★ FMX-218,
  recommendation, not a decision): the kernel is a **stateless "Tactical
  Evaluation Core"** — a Shared-Kernel SUPPORTING subdomain — operating ONLY on
  the D4 compiled tactic contract (`TacticSnapshot` at `lineup_locked`) plus
  `match.core`, exposing a state→value function + candidate generation and
  **nothing else**. Three context-local adapters wrap it, each owning its OWN
  policy: (a) the **opponent-AI manager** (difficulty/personality, no
  explain-duty) in AI World Simulation; (b) the **Auto-Coach**
  (throttle-to-target-`S`, propose-only, explanation) in Tactics/Training; (c) the
  anchors — **E = the SAME kernel at max/unthrottled budget as a pinned
  calibration config, N = a degenerate fixed config** of the same action space.
  The word is **kernel, never "policy"** in the shared-eval sense: sharing a
  stateless kernel over the published tactic contract is safe, whereas sharing a
  *policy* would leak difficulty/personality/explain-duty across contexts
  (perceived-unfairness + entangled incentives, FMX-218 Q3).
- **The Auto-Coach adapter exposes the CHOSEN candidate's rationale only**, never
  the kernel's internal candidate RANKING — this preserves propose-only trust and
  prevents opponent-AI internals from leaking onto a player surface.
- **Joint change-control rider (binds §2↔§5):** a **MAJOR kernel bump forces
  re-derivation and re-banding of E**, and all `S`/`R` regressions are measured
  against the **RE-DERIVED E**. The shared kernel is adopted partly BECAUSE it
  enables **common-random-numbers (CRN) PAIRED estimation** of `S` and the
  head-to-head `E` (fix seed + kernel, vary only the selection temperature) — the
  primary sample-budget reducer, forfeited if the policies were separate. But that
  same sharing means a kernel heuristic change moves both E and the throttled
  Auto-Coach TOGETHER; without this re-derive-then-re-band rider and the
  anchor-quality diagnostic of §2, a kernel change could silently **mask a real
  `S` regression** (the CRN-entanglement failure).
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

**Cadence methodology (★ FMX-218, recommendation, not a decision).** The three
cadences — **per-merge smoke / nightly trend / per-release soak** — are governed
by a **SEQUENTIAL group-sequential/SPRT stopping rule per cell**, with a defined
indifference region around each band edge and versioned α/β error rates (the
Stockfish *fishtest* precedent). **The per-cell seed count is an OUTPUT of the
stopping rule and stays explicitly OPEN**, exactly as the band numbers do: SPRT
terminates clearly-inside and clearly-outside cells early and spends budget only
on borderline cells, so the research's worst-case Wilson bounds (~381 games at a
0.55 edge, ~2401 at 0.52, × the ~15x policy-pair cells) are a **BOUND, not the
operating cost**. Each cadence additionally carries a hard **WALL-CLOCK CEILING** —
the global governor and the hard n-cap for cells that never terminate.

- **Per-merge smoke** — a wide-indifference SPRT over the 2–3 sentinel combos,
  rejecting only on clearly-outside results or invariant breaks: a
  non-statistical fast-fail, not a parity measurement.
- **Nightly trend** — SPRT over a **pairwise / t-way COVERING-ARRAY subset that
  MUST be generated FROM the slot/policy-pair taxonomy** (so a new `assist.*` slot
  cannot silently escape coverage), measuring drift vs the last baseline,
  monitored-not-blocking, under the FWER/FDR + replicate-before-gate rules of §4.1.
- **Per-release soak** — SPRT run to full resolution or the hard n-cap: the **only
  HARD gate**, plus the T3 no-domination distribution check.

**Optimizer/anchor RE-DERIVATION is a separately-budgeted, versioned-compute
artifact pinned to the per-release/rebaseline cadence — NEVER nightly, never
per-merge.** All three cadences and both anchors MUST run the **SAME pinned kernel
build + `evalSuiteVersion`**, or the `S`/`R` numbers are incommensurable across
cadences; and the explain / propose-only / logging wrapper sits **OUTSIDE the
kernel hot loop** (cost boundary).

### Considered alternatives (rejected)

The genuine forks the FMX-218 methodology closes (recommendations, not decisions):

- **(i) Fixed Wilson-n cadence sizing** — rejected: a worst-case BOUND that
  over-spends decided cells and under-powers borderline ones, unaffordable at the
  ~15x cell multiplier; the SPRT sequential stopping rule (§6) is chosen instead.
- **(ii) Anchors bundled as bytes inside the parameter pack** (the earlier §2
  wording) — rejected: welds the baseline lifecycle to config churn and blocks
  reproducible historical re-runs; the registry-by-reference scheme (§2) is chosen.
- **(iii) Separate Auto-Coach and opponent-AI kernels (full separation)** —
  rejected: behavioral divergence, double maintenance, and loss of the self-play
  proxy and CRN paired estimation; one shared kernel + adapters (§5) is chosen.
- **(iv) A single undifferentiated shared POLICY** — rejected: leaks
  difficulty/personality/explain-duty across contexts (perceived-unfairness +
  entangled incentives); a shared stateless kernel wrapped by context-local
  adapters (§5) is chosen.
- **(v) A mean/pooled-`R` acceptance gate** — rejected: it passes coin-flip
  low-denominator cells; the worst-cell per-cell CI bound with head-to-head as the
  primary instrument (§1/§3) is chosen.

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
- **Trustworthy gate without inventing numbers (★ FMX-218).** Three refinements
  keep the gate honest while every band value stays harness-gated: anchors are
  registry-pinned, SemVer-versioned, and matched in outcome space with a
  quality diagnostic (§2), so a biased/stale anchor cannot silently inflate `R`;
  one shared *kernel* (not a shared policy) with context-local adapters (§5)
  buys CRN paired estimation and behavioral consistency without leaking
  difficulty/explain-duty across contexts, guarded by the re-derive-then-re-band
  rider against CRN entanglement; and the cadence is an SPRT stopping rule under
  a wall-clock ceiling (§6) with CI-bound invariants + FWER/FDR (§4), so the
  ~15x cell space is affordable and a single unlucky seed cannot red the build.
  The *method* (SPRT, CI-bound banding, power analysis) is specifiable now; the
  *values* are not — exactly as the D3 bands remain open.

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

1. **Parity band numbers — OPEN/harness-gated.** `R` floor/cap (★ placeholder
   0.85–0.95), head-to-head band (★ 52–57%), season-point cap (★ ~4–8 pts) — set
   only once the sim harness produces per-cell distributions.
2. **Parity normalization** — ★ `R` headline + head-to-head co-primary
   (NEW-parity-normalization Option b+c), with `R` a within-cell instrument only (§1).
3. **Anchor policy — RESOLVED-INTO-ONE-ARTIFACT pending Nico.** Anchors live in a
   separate shared registry, pinned by `anchorRefs`/`evalSuiteVersion`; **E is the
   shared §5 kernel at max/unthrottled budget (not separately authored)**, N a
   degenerate config; SemVer-versioned, re-derived matched in outcome space
   (NEW-optimal-anchor-policy Option b, amended by FMX-218).
4. **Per-area anchor class & claim wording** — ★ declared `anchorClass` per
   slot + two-class wording (NEW-offpitch-anchor-class C,
   NEW-d3-claim-strength-per-area B).
5. **Strength mechanism — RESOLVED-INTO-ONE-ARTIFACT pending Nico.** Throttled
   expert over **ONE shared evaluation kernel** (E = the same kernel at max
   budget); degraded evaluation rejected for explanation-bearing assistants
   (NEW-autocoach-strength-mechanism A).
6. **Strength granularity** — ★ per-decision-class vector with
   season-aggregate corridor gate (NEW-autocoach-strength-granularity).
7. **Per-area override sweep scope** — ★ whole-mode families + at most 2–3
   sentinel override combos; nightly runs the taxonomy-generated covering array
   (§6) (interacts with the open per-area-override fork).
8. **Delegation slot-family details** — ★ NEW-delegation-strength-spec shape
   incl. runbook ownership split.
9. **Extending GD-0043 itself** — this whole ADR; GD-0043 is binding and only
   Nico can extend its taxonomy. Includes ratifying the stateless **"Tactical
   Evaluation Core"** as a new Shared-Kernel SUPPORTING subdomain and the
   **infra-owns-system / Nico-owns-semantics** anchor ownership split (§2/§5) —
   an architecture/module-boundary call touching the AI/Match seam.

**FMX-218 sub-forks newly carried** (methodology fixed here; values OPEN):

10. **SPRT parameters** — the α/β error rates and the indifference half-width
    around each band edge (and the per-cadence hard n-cap): a Nico/domain
    calibration decision, un-settable until the engine exists.
11. **Per-cadence wall-clock ceilings** (smoke / nightly / release-soak) and the
    definition of "release" (RC-only vs every release) — an infra + Nico budget
    decision that gates whether the full sweep sits on the release critical path.
12. **Reduced-horizon soak proxies** — whether reduced-horizon proxies are
    acceptable for the most expensive off-pitch cells (e.g. a 50y
    transfers/scouting delegation soak) with an explicit fidelity caveat, or
    whether full-horizon is mandatory — a cost-vs-fidelity tradeoff for Nico.
13. **Residual higher-order interaction gap** — pairwise/t-way covering arrays
    miss faults living only in an untested >t-way override combo: accept the
    residual risk between full per-release sweeps, or mandate specific extra
    sentinel combos (e.g. Easy-everywhere + Expert-tactics) — a scope call for Nico.
14. **Anchor SemVer trigger threshold** — how much anchor-quality-diagnostic
    degradation (exploitability/plateau drift) constitutes a MAJOR bump forcing
    re-derivation — a domain-semantics threshold Nico signs off, un-quantifiable
    pre-harness.

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
- [[../../60-Research/raw-perplexity/raw-parity-calibration-methodology-2026-07-02]]
  — FMX-218 raw capture (anchor versioning, cadence sizing, shared-kernel
  boundary; grounds §2/§5/§6).
- [[../../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
- [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
