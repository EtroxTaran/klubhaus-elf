---
title: GD-0047 Easy-World Tactic Preset Library & Aggressiveness Dial
status: draft
tags: [game-design, gddr, tactics, dual-mode, two-worlds, presets, fmx-217]
context: [tactics, match]
created: 2026-07-02
updated: 2026-07-02
type: gddr
binding: false
linear: [FMX-217]
supersedes:
superseded_by:
related:
  - [[README]]
  - [[GD-0004-tactics]]
  - [[GD-0046-two-worlds-mode-model]]
  - [[tactics-system]]
  - [[progressive-disclosure-ui]]
  - [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
  - [[../60-Research/in-match-controls-tier-gating-2026-07-01]]
  - [[../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
  - [[../60-Research/tier-parity-measurement-calibration-2026-07-01]]
  - [[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
---

# GD-0047: Easy-World Tactic Preset Library & Aggressiveness Dial

> **This is a recommendation, not a decision.** The record is `status: draft`
> / `binding: false` per the current phase (all GDDRs reopened). It proposes a
> single converged preset set and one aggressiveness dial for Nico's live
> ratification; it becomes binding only when Nico ratifies it. **Every numeric
> value in this note (parity ratio R, head-to-head band, preset floor Y%, the
> squad-fit penalty, the top-band stamina cost) is harness-gated / OPEN** and
> owned by
> [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
> §3 — no number here is decided, and none may be cited as final until the
> calibration harness sets it.

## Status

draft

## Date

2026-07-02

## Player experience goal

In the Easy world a player picks a plainly-named plan ("High Press", "Keep the
Ball", "Sit & Counter"), nudges one Aggressiveness slider, and gets a tactic
that is legible, causal, and never a losing choice against the right opponent —
while under the hood every preset writes the exact same tactic the Pro editor
writes, so nothing about the Easy surface is a lesser simulation.

## Scope & ratified frame

This GDDR authors the Easy-world tactic surface named — but not specified — in
[[GD-0046-two-worlds-mode-model]] ("Easy tactic surface — native coarse dials,
one contract"). It restates the ratified frame it inherits and does **not**
re-open it:

- **D1** — three internal tiers Quick / Standard / Expert, branded as two
  worlds (Easy = Quick + Standard, Pro = Expert).
- **D2** — worlds/tiers switch anytime, everywhere; the save never embeds tier.
- **D3** — the Pro edge is a bounded floor+cap envelope on the floor-normalized
  parity ratio R (evidence-shaped placeholders R ≈ 0.85–0.95, head-to-head
  ≈ 52–57 % pro win probability; **exact numbers OPEN** until the sim harness),
  the edge confined to adaptation decision classes, and **Easy is never a
  dominated strategy**.
- **D4** — the two-worlds model sweeps every decision-bearing area.
- **Ratified easy-tactics decision** — the Easy surface is a native coarse
  vocabulary (curated presets + one aggressiveness dial, Anstoss pattern) that
  **compiles deterministically into the SAME tactic contract** the Pro editor
  writes (the ADR-0055 `TacticSnapshot`). Delegation is reserved for non-tactic
  areas — the Easy player still *authors* their tactic, they do not hand it to
  staff.

The preset library and the Aggressiveness dial are **two orthogonal axes**:
the presets are a **shape choice** (which plan), the dial is a **single
aggression knob** (how hard to run that plan). Neither is a difficulty setting.

## 1. The preset library — one converged set of 7

*Recommendation, not a decision.* Seven authored preset parameter-bundles.
Each row is a bundle of engine parameters (formation, roles, team
instructions) that compiles deterministically into one ADR-0055
`TacticSnapshot`; the "strong-vs / weak-vs" columns are **calibration-only
metadata** (§6 fences them out of the Easy UI) that state the **design
hypothesis** the ADR-0135 round-robin must *measure* — they are not authored
matchup multipliers (§4 states the ban).

| # | Player-facing name | Pro / technical identity | Formation / shape | Intended style | Primary strong-vs (§14 archetype) | Weak-vs (§14 archetype) | Squad-fit requirement |
|---|---|---|---|---|---|---|---|
| **P1** | High Press | Gegenpress | 4-3-3 | Win the ball high, suffocate build-up, quick vertical finish | vs Deep Block · vs Playmaker 10 | vs Counter-Attacking · vs 3-5-2 | High-stamina midfield + mobile front line; pace to defend a high line |
| **P2** | Keep the Ball | Possession / Positional | 4-2-3-1 | Patient build-up, control tempo, break a low block down | vs Counter-Attacking · vs 4-2-3-1 | vs High Press | Technical/composed midfield; press-resistant passers |
| **P3** | Hit Them Fast | Direct / Vertical Transition | 4-4-2 | Fast, direct, get behind an aggressive line | vs High Press | vs Deep Block | Pace up front; ball-winners to regain quickly |
| **P4** | Sit & Counter | Low-Block Counter | 5-3-2 | Deep block, absorb, spring on the turnover | vs Wide Overloads · vs Playmaker 10 | vs Deep Block | Disciplined defenders; ≥1 fast outlet striker |
| **P5** | Attack the Wings | Wing-Overload | 3-4-3 | Overload the flanks, cross and cut back | vs 3-5-2 · vs 4-2-3-1 | vs Counter-Attacking · vs Wide Overloads | Genuine wingers / attacking wing-backs; aerial or arriving finishers |
| **P6** | Balanced | Mid-Block (4-4-2 flat / 4-1-4-1) | 4-4-2 flat | No pronounced bias — solid mid-block, react to the game | (best-fit to none by design; soft-viable vs all) | (never hard-countered by design) | **ZERO** — always available |
| **P7** | Aim for the Big Man | Aerial-Direct | 3-5-2 | Long/direct to a target man, win the second ball | vs High Press · vs Wide Overloads | vs Deep Block | A genuine target-man forward + runners onto knock-downs |

**P6 note.** Balanced carries a **zero squad requirement** and is the
always-available floor. It is **deliberately soft** — viable, never optimal —
and by construction **never dominated**: at good fit the correct specialist
always beats it, so it is the safe net, not the meta default. This is the
explicit counter to the Anstoss "normal → offensiv" collapse where a neutral
default became the dominant pick (Anstoss RNG-tested "normal" band,
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] Finding 3).

*Grounding:* the 6–8 style-cycle set is the ★-recommended Option B of
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
(NEW-preset-count), inside the shipped-game 4–8 band (Finding 7) and modelled
on Hattrick's non-dominated redistribute-don't-add tactic web (Finding 2). The
**7-authored** count (not the merge-to-6) is chosen because a
defensive↔attacking spectrum is a *total order* and cannot be intransitive
(Finding 1 / Sirlin: a cycle needs ≥3 mutually-countering, style-differentiated
options); the P3/P7 near-duplicate risk both the research and the design review
flag is handled as a harness acceptance gate in §4, not a pre-emptive cut.

## 2. Zero-dead-options guarantee — design hypothesis + harness invariants

The soft-counter cycle is **not** an authored 7-row matchup table. It is a
**design hypothesis** that the ADR-0135 equal-squad round-robin must
**measure** and that six harness-asserted invariants must hold for. Authoring
sets preset *parameters*; the engine produces the counters; the harness
verifies them.

**Intransitivity by construction — two disjoint loops.** So that no global
strength order can exist, the set is authored around at least two disjoint
counter loops:

- **Primary triangle:** **P1 High Press ▸ P2 Keep the Ball ▸ P3 Hit Them Fast
  ▸ P1** (press beats possession-build; possession-build beats direct;
  direct beats press — Hattrick's AoW/Pressing/Counter trade-off web).
- **Second disjoint loop:** **P2 Keep the Ball ▸ P4 Sit & Counter ▸ P3/P7
  Direct ▸ P2** (possession breaks a low block; the low block springs on the
  direct/aerial side; direct/aerial bypasses possession's pressing trigger).

Because the two loops share no single dominating node, **no total order over
the seven presets can exist** — the definition of an intransitive set.

**The six harness-asserted invariants** (all thresholds harness-gated / OPEN,
owned by ADR-0135 §3):

- **I1 — Intransitivity by construction.** The primary triangle P1▸P2▸P3▸P1
  and the second disjoint loop P2▸P4▸P3/P7▸P2 must both hold in the measured
  round-robin, so no global strength order exists.
- **I2 — No-hard-counter preset floor.** Every preset scores **≥ Y%** of the
  preset-pool mean expected points in **every** cell of the matrix (Y
  harness-gated). No preset may be shut out anywhere — the "soft counter, not
  shut-out" rule (Finding 1).
- **I3 — Full 8-archetype coverage.** Every one of the tactics-system §14
  Layer-1 archetypes (vs Deep Block, vs High Press, vs Wide Overloads, vs
  Target Man, vs Playmaker 10, vs Counter-Attacking, vs 3-5-2, vs 4-2-3-1) has
  **≥1 preset as a primary authored strong-vs target**. The research preset
  list **orphaned two archetypes**; this note closes them **by authoring, not
  by adding a preset**: **vs Counter-Attacking → P2 / P6** and **vs 4-2-3-1 →
  P1 / P6** (see §1 table; vs Target Man is covered soft by P4/P6's aerial
  discipline). Closing the orphans is a coverage promise, not a claim they are
  the sharpest counter.
- **I4 — Per-preset non-dominance + home matchup.** Every preset is the
  strict best-fit to ≥1 archetype (its "home" matchup) **and** is
  Pareto-non-dominated (no other preset is ≥ it in every cell). No dead
  options — the Anstoss dead-option failure (Finding 3).
- **I5 — Squad-robustness.** For **every** plausible squad shape: ≥ **4/7**
  presets stay above the ~20% squad-fit penalty (Anstoss's up-to-20% wrong-
  shape penalty, Finding 3), **≥1 full intransitive triangle survives**, and
  **every archetype is soft-countered by ≥2 presets of *different* squad-fit**
  so a squad missing (say) pace or wingers is not stranded. Equal-squad
  intransitivity is not enough: P1/P3/P5/P7 share correlated athletic/target
  requirements, so a slow, technical squad could collapse into a 2–3-preset
  corner — I5 plus the zero-requirement P6 floor prevent that.
- **P6 net.** P6 is the guaranteed **never-dominated** universal floor that
  makes I5 satisfiable for any squad — the deliberately-soft safety net, never
  the optimum.

**The ban (load-bearing).** **No authored preset-vs-preset multiplier or
matchup table may ever be written.** Counters must **emerge** from engine
parameters measured by the ADR-0135 equal-squad round-robin — the Hattrick
"numeric engine, no rule-based RPS" pattern
([[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] Finding 2;
NEW-counter-matrix-authoring ★ Option C). If any invariant fails the
round-robin, the fix is **re-authoring preset PARAMETERS, never a matchup
adjustment** — matrix ownership stays ADR-0135 §3. Authoring a weighted-RPS
table that decides the match at pick time is exactly the failure Sirlin warns
against (Finding 1).

**P3/P7 merge gate (harness-conditional, not a pre-emptive cut).** If the
measured strong-vs / weak-vs vectors of P3 (Hit Them Fast) and P7 (Aim for the
Big Man) correlate above a harness-set threshold, they collapse to a **single
Direct/Vertical node** with pace-vs-aerial as a **squad-fit sub-variant** — a
harness acceptance gate, held OPEN in §9, not decided here.

## 3. The Aggressiveness dial (★ Option B)

*Recommendation, not a decision.* One macro **Aggressiveness** dial with **5
fixed visible bands**, mapping each band per-preset to a **(mentality band,
pressing step)** pair looked up into the **existing** team instructions. The
**7 internal mentality bands are preserved** (5 visible / 7 internal,
tactics-system §6.3 / [[../60-Research/tactics-and-formations]] §6.3); the dial
is a **per-preset lookup table into existing team instructions — zero engine
change**. This is the ★-recommended Option B of
[[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]
(NEW-aggressiveness-mapping). The two-dial mentality+intensity **Option C is
explicitly rejected** — a second knob doubles the Easy decision surface and the
calibration matrix and breaks the coarse-dial fantasy.

The 5 fixed bands: **Very Cautious · Cautious · Balanced · Aggressive · Very
Aggressive**.

**Worked example** (the same band means different engine settings per preset,
because the preset defines the character the dial modulates):

| Band | On P1 High Press (Gegenpress) | On P4 Sit & Counter (Low-Block) |
|---|---|---|
| 3 — Balanced | Balanced mentality + Medium-High press | Cautious mentality + Low-Medium press |
| 4 — Aggressive | Attacking mentality + High press | Balanced mentality + Medium press |

**Dial invariants** (numbers harness-gated / OPEN):

- **DI1 — Fixed monotonic labels.** The five plain-language band labels are
  fixed and monotonic and are **never re-labelled per preset**. The band means
  "more aggressive within this plan"; it never renames itself to the preset's
  identity.
- **DI2 — Anti-band-collapse / character-preserving.** The mapping is bounded
  so a preset's line-vs-press signature is preserved: the **max band on P2
  Keep the Ball or P4 Sit & Counter never becomes P1's gegenpress**. Pressing
  step and defensive line **move together** per the Assistant-Manager pairing
  (Anstoss Einsatz coupling). This directly guards against reproducing the
  Anstoss "normal → offensiv" band-collapse meta if the dial were authored
  loosely — the dial is the sleeper hazard, not the presets.
- **DI3 — Real trade-off surfaced.** The **harness-calibrated top-band stamina
  cost** (pressing drains stamina per §8 shout mechanics) is surfaced as a
  **one-line trade-off hint**, and availability warnings are
  **dial-band-aware** (e.g. "Very Aggressive will tire your midfield by the
  70th minute"). This is what makes high aggression **non-dominant**
  (Hattrick-Pressing / Anstoss-Einsatz evidence, Finding 3).

## 4. Contract compile-down

Every preset in §1 and every dial position in §3 compiles **deterministically**
into the shared **ADR-0055 `TacticSnapshot`** — the identical frozen contract
the Pro editor writes and the Match context consumes at `lineup_locked`. There
is no Easy-only tactic representation and no parallel engine path: the Easy
surface is a coarse *authoring* vocabulary over the one contract, per the
ratified easy-tactics decision and GD-0046. The `CoarseTacticInput` →
`TacticSnapshot` compile seam is the additive ADR-0055 amendment that GD-0046
already flags under "Feeds ADRs".

## 5. UI legibility & the calibration/UI fence

**Hard fence.** The strong-vs / weak-vs pairs (§1) and the whole matchup matrix
are **calibration-only metadata**; they **never reach the Easy-world UI**.
There is **no player-facing counter table** (that is the Pro world's opposition
library). This is the ratified anti-min-max stance —
[[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]] and
[[../60-Research/in-match-controls-tier-gating-2026-07-01]] — and keeps counter
legibility from becoming a spreadsheet.

Player-facing counter legibility lives only in:

- **Plain preset names + one identity line each** — "High Press", "Keep the
  Ball", "Sit & Counter" carry the intent; the name *is* the legibility.
- **~4 identity families in the picker** — the seven presets group into roughly
  four visually-distinct identity families (press / possess / direct / defend-
  and-spring) so the picker respects Hick's-law choice-overload guidance
  (Finding 7).
- **One-tap Recommended Counter** — the ADR-0080 selector at
  `candidateScope: 'quick'`, which deterministically applies the
  archetype-correct counter and **emits exactly one reason sentence** ("They
  press high — this plays direct behind it", Finding 6). It must **actively
  steer players OFF P6 Balanced** when a specialist is the right answer, so the
  safe floor never silently becomes the default.

The Pro edge over this button is *information depth* (the sharper Layer-2 sub-
archetype), not a bigger multiplier — exactly the D3 adaptation-class edge,
delivered through knowledge, not raw strength
([[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]],
"Recommended Counter across modes").

## 6. Calibration ownership

- All matrix **values** — R (0.85–0.95), head-to-head (52–57 %), the preset
  floor Y% (I2), the ~20% squad-fit penalty threshold and ≥4/7 robustness bar
  (I5), the top-band stamina cost (DI3) — are **harness-gated / OPEN** and
  owned by
  [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  §3. This note authors the *shape and the invariants*; ADR-0135 sets the
  numbers via the equal-squad round-robin.
- The only explicit anti-super-tactic levers remain the **tactical
  predictability penalty** (tactics-system §16, up to 5% offensive penalty for
  >50% single-tactic use; counter-templates cancel half) and the **familiarity
  model** (§6.5). No new matchup multiplier is introduced by this note.

## Open (Wave 2) — OPEN forks for Nico

All ★ marks are **recommendations, not decisions**; each fork stays open until
Nico rules.

1. **SSOT delta (surface, do not enact).** tactics-system §13 currently
   canonises Quick tier = **"5 starter presets"**, but this note proposes
   **7**. This must not silently diverge from binding SSOT. Nico to ratify
   **either** bumping §13 Quick to 7 presets, **or** a "**5 shown / 7
   available**" progressive-reveal split. ★ Stated here as a *proposed* delta
   only — GD-0047 does not edit tactics-system.
2. **Final preset count — 7 vs 6.** ★ Accept the harness-gated P3 (Hit Them
   Fast) / P7 (Aim for the Big Man) merge into a single **Direct/Vertical
   node** (pace-vs-aerial as a squad-fit sub-variant) **iff** the measured
   strong-vs / weak-vs vectors correlate above a set threshold. Nico to confirm
   this conditional-merge policy and who owns the correlation threshold.
3. **Cross-mode per-matchup no-hard-counter clause — belongs in ADR-0135, not
   here.** A Pro hand-tuned tactic that **hard-counters** an Easy preset in a
   single cell makes Easy non-viable there even at a legal *average* edge
   inside the D3 envelope. ★ Confirm adding a **per-matchup no-hard-counter
   clause** to the ADR-0135 D3 floor+cap envelope (a scope question for the
   calibration ADR, raised here for completeness).
4. **Blessing on the new invariant set as ADR-0135 harness assertions.** ★
   Confirm that the preset floor Y% (I2), the ~20% squad-fit penalty threshold
   and ≥4/7 squad-robustness bar (I5), and the top-band stamina cost (DI3) —
   all placeholder / OPEN — become **standing round-robin assertions keyed to
   the §14 archetype list**, with Nico + the harness setting the final numbers.

## Rationale

Three analysis lenses (invariants, coverage, UI-fence) converge on **7 presets
+ Option B**; the value of this note is resolving where they pull apart and
catching what they missed:

- **Count.** 7-authored, not merge-to-6, because a defensive↔attacking spectrum
  is a total order and *mathematically cannot* be intransitive (Finding 1 /
  Sirlin: a cycle needs ≥3 mutually-countering, style-differentiated options).
  The P3/P7 near-duplicate risk is handled as a harness acceptance gate (§2,
  fork 2), not a pre-emptive authoring cut — so both the coverage need and the
  trim escape-hatch survive.
- **Matrix framing.** The invariant set, the coverage requirement, and the
  UI-fence are complementary and consolidate into one six-invariant set the
  ADR-0135 harness asserts, with the Hattrick point locked as the load-bearing
  rule: counters must **emerge** from measured engine parameters, never be
  authored as a tactic-vs-tactic table.
- **Coverage is the decisive unique catch.** The research preset list
  **orphans** vs Counter-Attacking and vs 4-2-3-1 as primary strong-vs targets,
  and the correlated athletic requirements of P1/P3/P5/P7 mean slow squads
  collapse into a small corner — so equal-squad intransitivity is not enough.
  I3 (coverage, closing both orphans by authoring) and I5 (squad-robustness)
  plus the zero-requirement P6 floor are the load-bearing additions.
- **P6.** Resolved the same way on every tension: a zero-requirement universal
  floor that is deliberately soft/never-dominant, with Recommended Counter
  steering players *off* it — otherwise it becomes the Anstoss "normal"
  dominant default.
- **Dial.** Option B over C, because the *second knob* (not the engine) breaks
  the coarse-dial fantasy; the character-preserving (DI2), fixed-label (DI1)
  and squad/stamina-aware (DI3) constraints are merged into three dial
  invariants because a loosely-authored dial reproduces the exact Anstoss
  normal→offensiv band-collapse meta.

## Consequences

Positive:

- The Easy world gets a complete, genre-proven tactic surface (curated presets
  + one dial + Recommended Counter) that is competitively honest by
  construction — presets write the same contract the Pro editor writes.
- Zero-dead-options and the soft-counter cycle become **regression-testable
  invariants** in the ADR-0135 harness, not a vibe; a failing cell has a
  defined fix (re-author parameters) that never touches a matchup multiplier.
- No new engine architecture: the dial is a lookup into existing team
  instructions, the counter button is the existing ADR-0080 selector at
  `candidateScope: 'quick'`, and both surfaces compile to the one
  `TacticSnapshot`.

Negative / constraints:

- The preset set is only as good as the harness that verifies it — the ADR-0135
  round-robin becomes load-bearing infrastructure before Easy-world competitive
  parity can be claimed.
- Two authoring surfaces (coarse presets, full Pro editor) over one contract
  must be kept balanced forever, and the SSOT §13 "5 presets" delta (fork 1)
  must be resolved before this note can bind, or one-current-truth governance
  is violated.
- The correlated squad requirements across the athletic presets mean I5 must be
  actively re-checked whenever a new preset or role is added.

## Supersedes

None.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] — the
  `CoarseTacticInput` → `TacticSnapshot` deterministic compile seam that the
  presets and the dial write through (additive amendment, never a rewrite).
- [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  — the six preset invariants (I1–I5 + P6 net) and three dial invariants
  (DI1–DI3) as standing equal-squad round-robin assertions; owns every number
  in this note.
- [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  — the one-tap Recommended Counter at `candidateScope: 'quick'` (reason
  sentence + steer-off-P6 behaviour).

## Related

- Research:
  [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]] ·
  [[../60-Research/in-match-controls-tier-gating-2026-07-01]] ·
  [[../60-Research/assisted-play-parity-auto-coach-2026-07-01]] ·
  [[../60-Research/tier-parity-measurement-calibration-2026-07-01]] ·
  [[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]] ·
  [[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
- Decisions / cover:
  [[GD-0046-two-worlds-mode-model]] (D1–D4 + ratified easy-tactics decision) ·
  [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]] ·
  [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
- Systems: [[tactics-system]] (§13 UI tiers, §14 archetypes, §16 predictability
  penalty — referenced, not edited) · [[progressive-disclosure-ui]]
- [[README]] — Game Design Log (hub) · siblings: [[GD-0004-tactics]] ·
  [[GD-0046-two-worlds-mode-model]]
