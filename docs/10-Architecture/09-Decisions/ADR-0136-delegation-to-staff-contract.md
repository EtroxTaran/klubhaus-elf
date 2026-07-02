---
title: ADR-0136 Delegation-to-Staff Contract (non-tactic areas, consent ladder, deterministic execution)
status: draft
tags: [adr, architecture, dual-mode, delegation, staff-operations, consent, determinism, fmx-212]
context: [staff-operations, training, scouting, transfer, club-management-economy]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: FMX-212
supersedes:
superseded_by:
related:
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[ADR-0137-stadium-construction-and-expansion-contract]]
  - [[ADR-0138-mode-state-placement-and-integrity]]
  - [[../../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../../50-Game-Design/progressive-disclosure-ui]]
  - [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02]]
  - [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[../../60-Research/stadium-construction-expansion-models-2026-07-02]]
  - [[../../60-Research/assisted-play-parity-auto-coach-2026-07-01]]
---

# ADR-0136: Delegation-to-Staff Contract (non-tactic areas, consent ladder, deterministic execution)

## Status

draft

Proposed for Nico's ratification. The delegation **model shape** and
the **consent ladder** are OPEN forks; this ADR presents the options with a
★-marked recommendation (recommendation, not a decision). Authored under the
never-self-accept rule; `binding: false` until Nico ratifies.

## Date

2026-07-02 (FMX-212 Stage-2)

## Context

The ratified dual-mode directions (D1 three tiers branded as two worlds, D2
switch anytime, D3 bounded pro edge via a floor+cap envelope, D4 full sweep
across every decision-bearing area — 2026-07-01/02) require that the Easy
world "just runs" acceptably in every non-tactic management area without
pro-level input. Two ratified boundaries fix this ADR's scope:

- **Tactics is out of delegation scope.** The 2026-07-02 easy-tactics
  decision ships native coarse dials/presets that compile deterministically
  into the same tactic contract Pro writes; the match-side Auto-Coach and its
  assist-strength envelope are covered by
  [[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]
  (same FMX-212 wave). Delegation is reserved for
  the **non-tactic** areas: training, scouting, transfers/contracts,
  finance-routine, and the stadium maintenance class. Genre evidence
  independently endorses exactly this split
  ([[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02|delegation packet]],
  Inputs § delegation model shape).
- **The vault has no general delegation system today.** The only existing
  contracts are the national-team dual-role's Full Control / Match-Only /
  Light Touch engagement levels
  ([[ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]] D4,
  [[../../50-Game-Design/GD-0033-national-team-dual-role|GD-0033]]) and the
  lone `staff.delegate_topic` dialogue intent, which already routes a
  "delegation preference fact" to Staff Operations/Notification
  ([[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix|GD-0028]],
  [[ADR-0126-cross-producer-effect-intent-taxonomy|ADR-0126]]).

The research corpus for this contract is the
[[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02|delegation packet]]
(genre survey: FM Staff Responsibilities, OOTP Team Control Settings, NBA 2K
implicit automation, the Anstoss Co-Trainer), the
[[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02|mode-state packet]]
(contract placement, fact family C), the
[[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02|off-pitch parity packet]]
(per-area measurement feasibility and floor risk) and the
[[../../60-Research/stadium-construction-expansion-models-2026-07-02|stadium packet]]
(stadium-specific delegation evidence). Key tensions the contract must
resolve:

- The Auto-Coach rule "proposes only, never overwrites"
  ([[../../50-Game-Design/progressive-disclosure-ui|progressive-disclosure-ui]] §4)
  cannot by itself deliver a "just runs" Easy world — a proposal queue is
  still a queue (delegation packet, NEW-delegation-consent-model).
- FM's documented delegated-quality collapse concentrates in value-sensitive
  and adaptive decisions — above all transfers ("never delegate selling") —
  which is exactly where the D3 floor is most at risk (delegation packet
  Finding 2; off-pitch packet Finding 9).
- Delegation assignments change *who may mutate game state*, so they are
  ordinary signed game-state commands, never cosmetic last-write-wins
  preferences (mode-state packet Finding 8).

## Options Considered

### O1 — Delegation model shape (OPEN fork, primary)

**Option A — OOTP-pattern per-area responsibility assignment (standing
autopilot, act-and-report). ★ recommended.** Each non-tactic area carries a
responsibility fact naming the responsible staff role (Chief Scout for
scouting, a Sport-Director-class role for transfers, coach roles for
training, a board/CFO-class surface for finance-routine, a
facilities-manager role for stadium maintenance). The executing agent is the
**owning domain context's own policy**, issuing its **own existing commands**
on its normal triggers; Staff Operations owns only the assignment facts and
the staff-skill inputs, never the domain commands.
*Pros:* the genre's most-praised, best-documented model (delegation packet
Findings 3–4: official OOTP per-area responsibility table, "automate
everything, then gradually take areas back" learning ramp — the exact
two-worlds bridge D1/D2 need); per-area granularity makes D2 switch-anytime
real (take one area back without leaving the world); clean fit with
[[ADR-0053-staff-operations-context|ADR-0053]]'s accepted boundary
("concrete gameplay effects remain in the consuming contexts").
*Cons:* needs a per-area policy of acceptable quality in five-plus domains —
a real calibration surface (mitigated by the strength-spec slot family
below); the toggle matrix must be bundled into tier presets or it becomes
pro-mode UI inside the Easy world.

**Option B — FM-pattern role-first delegation with an advice layer.**
Delegate by staff role via a responsibilities screen; staff surface
advice/reports the player may act on.
*Pros:* familiar to genre players; strong backroom-team fantasy.
*Cons:* FM's documented weakness profile lives precisely here — separately
authored assistant heuristics drift from the engine and fail in
value-sensitive areas (delegation packet Finding 2); the advice layer still
demands attention, so the Easy world does not "just run".

**Option C — Anstoss-pattern per-action proposals only (no standing
autopilot).** Everything stays manual; assistants generate one-tap proposals
per decision (the current Auto-Coach rule extended everywhere).
*Pros:* maximally consistent with the existing "proposes only" guarantee; no
delegated-quality liability.
*Cons:* fails the requirement — a Quick-tier player still must touch every
area every week; Anstoss made this work only because its *surfaces* were
coarse (delegation packet Finding 7), which FMX replicates for tactics and
stadium but cannot replicate for, e.g., contract-renewal queues.

### O2 — Consent ladder (OPEN sub-fork, NEW-delegation-consent-model)

**Option A — three consent levels per area: `manual` / `propose` /
`delegate`. ★ recommended.** `manual` = silence; `propose` = assistant
proposes, player confirms (today's Auto-Coach contract); `delegate` = staff
acts, player gets an act-and-report feed with review (and undo where the
domain allows). This **generalizes ADR-0084's accepted Full Control /
Match-Only / Light Touch ladder** — the national-team engagement levels
become a specialisation of one vault-wide consent grammar instead of a
snowflake (GD-0033's Match-Only level shows the middle setting is
load-bearing).
*Cons:* three states × ~6 areas needs careful bundling into tier presets.

**Option B — propose-only everywhere; Quick auto-confirms proposals after a
timeout.** *Pros:* no new authority contract. *Cons:* auto-confirm *is*
delegation with worse legibility; timeout mechanics feel arbitrary.

**Option C — binary `manual` / `delegate`.** *Pros:* simplest. *Cons:* loses
the propose middle that Standard tier and graduating players need
(delegation packet Finding 4's learning ramp).

### O3 — Execution character (sub-input, resolved by internal precedent)

**Deterministic policy function ★ recommended** — delegated execution is a
deterministic function of (domain state, staff-skill band, policy version),
replay-safe exactly like ADR-0084 invariant NT5 (unattended side
auto-managed, no RNG, byte-replay-safe), with at most **bounded seeded
variance drawn from an existing domain stream** if Nico wants texture (his
standing seeded-variance preference; no new `*Rng`). Staff **persona**
influences only narration and advice tone through GD-0028 surfaces — never
the mechanical outcome (GD-0028 D3 already confines persona to "gate plus
bounded scale" with owning domains authoritative). The alternative —
persona-driven mechanical delegation — couples save outcomes to an opaque
personality layer; no external doctrine supports it (delegation packet
Finding 9), and it is deferred to the future-scope flavour item below.

### O4 — Assignment-fact placement (settled by existing boundaries)

The mode-state packet's fact-family-C analysis (Options C1/C2/C3) applies;
**C1 ★ recommended**: Staff Operations owns the assignment facts (per save,
`save_<uuidv7hex>` tables per ADR-0053), the owning domain contexts execute,
and the binding [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause|ADR-0102]]
notification platform carries the act-and-report feed. Per-domain ownership
(C2) yields six divergent grammars and no single read model for tier presets
or the mode profile; a new "Delegation" bounded context (C3) would own only
a table, since the policies must live in the owning domains anyway.

## Recommendation (★ — recommendation, not a decision)

**O1 = A, O2 = A, O3 = deterministic, O4 = C1**, composed as follows.

### 1. Ownership map

| Concern | Owner | Note |
|---|---|---|
| Per-area responsibility + consent assignment facts | **Staff Operations** | extends the `staff.delegate_topic` seam (GD-0028 / ADR-0126); save-scoped per ADR-0053 |
| Staff-skill quality inputs | **Staff Operations** (bands) over **People** (profiles) | reuse GD-0021's accepted chain unchanged: `StaffSkillProfileSnapshot` → staff-skill-aware `PipelineCoverageSnapshot` bands; no new stat, no new ownership |
| Delegated **execution** (issuing domain commands) | **Owning domain context** per area (Training, Scouting, Transfer, Club Management, Stadium Operations) | the domain's own throttled-expert policy on its normal triggers; Staff Operations never issues domain commands |
| Act-and-report feed | **Notification** (ADR-0102 platform) | a "Delegated actions" category rendering digests with GD-0028-style explanations |
| Per-run/per-season mode profile consuming these facts | League Orchestration | fact family B, [[ADR-0138-mode-state-placement-and-integrity|ADR-0138]] (mode-state placement & integrity, same FMX-212 wave) |

**No new bounded context.**

### 2. Contract direction (draft precision; names illustrative)

Per the mode-state packet's C1 deltas:

- Aggregate (per save): `AreaResponsibilityAssignment { area, consentLevel:
  manual | propose | delegate, responsibleStaffRoleSlot, policyVersion }`.
- Commands: `SetAreaConsentLevel`, `AssignAreaResponsibility` — ordinary
  signed game-state commands (`commandId` + `expectedVersion`), **never**
  cosmetic-LWW preferences: they change who may mutate game state
  (mode-state packet Finding 8, ADR-0090 partition).
- Events: `AreaConsentLevelChangedV1`, `AreaResponsibilityAssignedV1` —
  consumed by the owning domain to arm/disarm its delegated policy, and by
  League Orchestration's mode profile.
- Read models: `ConsentLevelForArea` (read by every domain policy before
  acting; event-carried/cached so Staff Operations is not a polling hub),
  `DelegationOverview` (settings + switch-preview surface).
- Execution: each owning domain evaluates with the **same expert-policy
  family that drives AI clubs and Auto-Coach proposals**, throttled by its
  GD-0021 pipeline band instead of a global temperature — one policy family,
  three consumers (delegation packet Finding 10).

### 3. Consent ladder defaults per tier

| Tier | Default (identical toggle set in every tier) |
|---|---|
| Quick | all non-tactic areas `delegate` (act-and-report) |
| Standard | mixed: chores + training `delegate`, transfers + finance `propose` |
| Expert | all `manual` |

Defaults are presentation-level bundles; D1's two-worlds branding stays a
label and D2 switching never migrates state (delegation packet, sub-input
easy-default-on). Whether a **per-area override** is exposed inside the Easy
world's settings without reading as pro UI is an open fork below.

### 4. Stadium and finance nuance (from the stadium packet)

- **Construction-class decisions** (new project commissioning): delegation is
  `propose`-shaped even at Quick — the facilities delegate proposes
  `CommissionConstructionProject`, the player confirms (stadium packet, open
  fork input; consistent with the proposes-never-overwrites guarantee; the
  command shape is
  [[ADR-0137-stadium-construction-and-expansion-contract|ADR-0137]]'s).
- **Maintenance-class decisions**: full-auto `delegate` is allowed **only
  inside an explicit budget envelope set by the player**; outside the
  envelope the policy falls back to `propose`.
- **Financing instruments** (loans, factoring — FMX-49) stay
  **player-confirmed in every tier**: run-ending stakes are never delegated
  (delegation packet, stadium-fork input; off-pitch packet Finding 9's risk
  ordering puts value-sensitive finance decisions near the top).

### 5. Hard invariants (apply under every option Nico may pick)

| # | Invariant |
|---|---|
| **DL1** | Delegated staff **never overwrite manual pins**: the player can pin any individual item (a shortlist target, a protected player, a training block) and delegation routes around it — the [[../../50-Game-Design/progressive-disclosure-ui|progressive-disclosure-ui]] §4/§7 tier-switch guarantee, generalized. |
| **DL2** | Every delegated action lands in the **act-and-report feed** (ADR-0102 platform) with a GD-0028-style explanation; silent delegation is forbidden. |
| **DL3** | Explanations and the feed **survive mode/tier switches** (D2): switching worlds never discards delegation history or pending reports. |
| **DL4** | Delegated quality couples **only** to GD-0021 staff-skill bands (`PipelineCoverageSnapshot`), and the **worst legal staff band positions the delegated agent low *inside* the D3 corridor, never below the easy floor** — the no-domination invariant of every `assist.delegation.<area>` slot (off-pitch packet, delegation-fork input); envelope methodology per [[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]. |
| **DL5** | Delegated execution is **deterministic and replay-safe** (ADR-0084 NT5 pattern): a pure function of domain state, staff-skill band and `policyVersion`; any variance is bounded and drawn from an **existing** seeded domain stream (no new `*Rng`). |
| **DL6** | Staff **persona** affects narration/advice tone only (GD-0028 surfaces); it never changes a delegated mechanical outcome. |
| **DL7** | All consent/assignment facts are **command-derived**: they exist as signed game-state commands re-derivable from the command history, per the mode-log integrity contract ([[ADR-0138-mode-state-placement-and-integrity|ADR-0138]], same FMX-212 wave) — never client-asserted flags. |
| **DL8** | Financing instruments are player-confirmed in **every** tier (see §4). |

### 6. Strength spec and calibration

Each delegated area gets a slot in the `assist.delegation.<area>` calibration
slot family (delegation packet NEW-delegation-strength-spec; off-pitch packet
slot-family proposal): shared anchor grammar, per-area parameter packs, and a
declared per-area `anchorClass` (optimizer for training and stadium/financing
timing; scripted reference for transfers and scouting at v1). The
gate-bearing observable is the T3 outcome distribution plus the DL4
no-domination check; exact numbers are calibration debt owned by the GD-0043
process. The parity-band numbers themselves remain an **explicitly open**
part of D3 until the sim harness exists.

### 7. Competitive / MP note

Because delegated execution is a deterministic, versioned policy function
(DL5), each area's delegated strength is **measurable and disclosable**
against the same anchors as the Auto-Coach — so competitive labeling reduces
to *disclosure* of what autopilot does and how well, rather than to locks
(delegation packet, labeling input). MP treatment (group mode composition,
Easy-only/Pro-only rules) stays an **open fork**, handled by
[[ADR-0138-mode-state-placement-and-integrity|ADR-0138]]'s fact family D and
the competitive-labeling fork of
[[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]] (both drafted
in this FMX-212 wave); nothing in this contract blocks either direction.

## Decision

**Open — no decision is taken here.** This ADR fixes the ratified scope
boundaries (non-tactic areas only; tactics = native dials; D1–D4 encoded as
constraints) and puts the delegation model shape (O1), the consent ladder
(O2) and the dependent open forks to Nico with the ★ recommendations above.
On ratification, the chosen options become the binding delegation contract
and the bounded-context-map row updates land in the ratifying PR.

## Rationale

The ★ composition is the only option set that satisfies all four ratified
directions at once: OOTP-pattern per-area assignment (O1=A) is the
best-documented genre model and the only one whose granularity makes D2
switch-anytime real per area; the three-level consent ladder (O2=A) reuses
an **accepted** FMX contract (ADR-0084 D4) instead of inventing a second
grammar, and resolves the proposal-queue tension that Option C cannot;
deterministic execution (O3) follows the vault's strongest internal precedent
(ADR-0084 NT5) where external doctrine is silent, keeps replays safe, and is
what makes per-area strength measurable — the precondition for D3's envelope
and for honest competitive labeling; C1 placement (O4) matches ADR-0053's
accepted boundary and the GD-0028/ADR-0126 `staff.delegate_topic` seam
verbatim, so the contract is an extension, not a boundary move. FM's
role-first alternative (O1=B) is rejected as the documented source of exactly
the adaptation-gap and value-decision failures D3 forbids; per D3's ratified
wording, the pro edge lives in adaptation decision classes and is never
manufactured by degrading the assistant's static picks — DL4 pins the
delegated floor accordingly.

## Consequences

Positive:

- The Easy world "just runs" in every non-tactic area with one consent
  grammar, one staff-skill coupling and one explanation surface — while
  Expert players keep byte-identical state and can take any area over at any
  time (D1/D2).
- The NT dual-role's engagement levels become a specialisation of the
  general ladder — one grammar, no snowflake (post-MVP re-expression noted
  in GD-0033's future scope).
- Deterministic, versioned delegated policies make the D3 envelope testable
  per area and reduce competitive labeling to disclosure.
- "Hire good people" becomes the Easy world's meaningful lever: staff-skill
  bands are the only quality dial (GD-0021 chain, unchanged).

Negative / follow-up:

- Five-plus per-area policies of acceptable quality are a real calibration
  surface; each needs an `assist.delegation.<area>` slot, a versioned
  `E_ref`/optimizer anchor and re-validation on economy/market tuning
  changes.
- Staff Operations becomes a fact hub every domain reads — mitigated by
  event-carried `ConsentLevelForArea`, but the coordination surface grows.
- The three-level ladder × ~6 areas must be bundled into legible tier
  presets, or the Easy settings screen becomes pro UI.
- Transfers/scouting delegated-strength claims are reference-relative at v1
  (no optimizer anchor exists); the D3 wording per area must say so
  (off-pitch packet, NEW-d3-claim-strength-per-area).

## Open forks for Nico (carried, not decided here)

1. **Delegation model shape (O1)** — ★ Option A.
2. **Consent ladder (O2)** — ★ Option A (three levels), incl. the stadium
   construction-vs-maintenance nuance and DL8.
3. **Per-area override exposure** — may Easy-world players toggle individual
   areas, or only tier-preset bundles? ★ expose per-area toggles behind a
   single "Fein-Tuning" disclosure, since per-area granularity is what makes
   D2 real (recommendation, not a decision).
4. **Bounded seeded variance on delegated execution** — pure-deterministic
   vs bounded variance via an existing domain stream; ★ bounded seeded
   variance, matching Nico's standing preference (recommendation, not a
   decision).
5. **Strength-spec slot granularity** — single slot vs per-area family; ★
   one slot family with per-area parameter packs and declared `anchorClass`
   (recommendation, not a decision).
6. **MP treatment and competitive labeling** — open; owned by
   [[ADR-0138-mode-state-placement-and-integrity|ADR-0138]] /
   [[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]] (same
   wave), constrained here only by DL5/DL7 disclosability.

## Future-scope notes (classified future-scope)

- **Delegation persona flavour:** persona colouring *which* of several
  equal-scoring candidate actions is taken (seeded, bounded) — post-MVP,
  own HITL gate; explicitly outside this contract (DL6 stands until then).
- **NT dual-role re-expression:** when the playable Bundestrainer role ships
  (GD-0033 post-MVP), re-express its engagement levels as this consent
  ladder.
- **Staff continuity wobble:** once GD-0021's post-MVP staff-turnover
  effects activate, a delegated area should visibly wobble when its
  responsible staff member leaves.
- **Delegation telemetry:** the act-and-report feed doubles as the data
  source for re-tuning tier defaults; design the notification category
  queryable, not fire-and-forget.

## Supersedes

None. Extends ADR-0053 (assignment facts, bands) and generalizes ADR-0084 D4
(consent ladder) additively — no rewrite of either accepted ADR; one-line
"Related" pointers land in the ratifying PR per vault-governance additive
discipline.

## Related Docs

- [[../../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]] — primary research packet (options, genre evidence, consent-model fork).
- [[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02]] — fact-family C placement evidence (C1) + command-derived integrity rule.
- [[../../60-Research/off-pitch-parity-measurement-economy-loop-2026-07-02]] — per-area anchor classes, no-domination invariant, risk ordering.
- [[../../60-Research/stadium-construction-expansion-models-2026-07-02]] — stadium construction/maintenance delegation nuance + budget envelope.
- [[../../60-Research/assisted-play-parity-auto-coach-2026-07-01]] — throttled-expert policy mechanism this contract generalizes.
- [[ADR-0053-staff-operations-context]] — Staff Operations boundary this contract extends.
- [[ADR-0084-national-team-dual-role-and-international-window-contract]] — accepted consent-ladder + deterministic auto-management precedent (NT5).
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]] — state-class partition (assignments are game-state commands, never LWW).
- [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause]] — binding home of the act-and-report feed.
- [[ADR-0126-cross-producer-effect-intent-taxonomy]] — `staff.delegate_topic` intent this contract generalizes.
- [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]] — staff-skill band chain (quality coupling).
- [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]] — persona confinement + explanation style.
- [[../../50-Game-Design/GD-0033-national-team-dual-role]] — engagement levels to be re-expressed post-MVP.
- [[../../50-Game-Design/progressive-disclosure-ui]] — proposes-never-overwrites guarantee (DL1) and tier-switch rules.
- [[ADR-0135-tier-parity-and-assist-strength-calibration-contract]] — Auto-Coach / assist-strength envelope this contract's DL4 rides on (same wave).
- [[ADR-0137-stadium-construction-and-expansion-contract]] — stadium project commands the facilities delegate proposes (same wave).
- [[ADR-0138-mode-state-placement-and-integrity]] — mode-state placement & integrity: fact-family-C projection dependency, DL7 command-derivation rule (same FMX-212 wave).
- [[../../50-Game-Design/GD-0046-two-worlds-mode-model]] — two-worlds cover carrying the competitive-labeling / MP forks and the tier-preset defaults framing (same FMX-212 wave).
