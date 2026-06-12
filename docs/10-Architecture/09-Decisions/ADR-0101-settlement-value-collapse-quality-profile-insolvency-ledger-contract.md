---
title: ADR-0101 Settlement value-collapse + quality-profile enum reconciliation + insolvency-to-ledger posting contract
status: accepted
tags: [adr, architecture, ddd, economy, settlement, determinism, replay, money-band, quality-profile, match-engine, insolvency, ledger, commercial-portfolio, club-management, reconciliation, fmx-audit]
created: 2026-06-08
updated: 2026-06-12
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[ADR-0086-background-fast-matchday-cost-settlement]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../60-Research/moneyband-amountminor-collapse-rule-2026-06-12]]
  - [[../../60-Research/background-fast-cost-settlement-2026-06-07]]
  - [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0101: Settlement value-collapse + quality-profile enum reconciliation + insolvency-to-ledger posting contract

## Status

accepted

> **D2 collapse rule confirmed 2026-06-12 (FMX-149) — the D2 clause is binding.** Nico decided
> live: the pinned rule is **seeded-within-band** — `collapseBand(band, ctx) → amountMinor` draws
> one uniform integer on the closed band interval from an existing
> [[ADR-0018-systemic-events-and-player-lifecycle]] stream sub-label, with seed + draw indices
> persisted in `provenance` (ADR-0086 machinery), versioned behind the **shared
> `costProfileVersion`** (one key governs collapse policy + cost-model magnitudes, BF10/FMX-52).
> The minimal canonical `MoneyBand` type is pinned here (see §D2). Grounded in
> [[../../60-Research/moneyband-amountminor-collapse-rule-2026-06-12]] (floor/low-bound collapse
> was research-rejected: systematic −n·w/2 season drift; midpoint was the co-equal pure lead;
> seeded-within-band matches sim-game practice and the project's standing seeded-variance
> posture, ADR-0086 D4=C). Frontmatter stays `binding: false` until the remaining axis closes
> (**FMX-147** enum apply); the D2 clause itself is binding.

> **D4 insolvency contract confirmed 2026-06-12 (FMX-146) — the D4 clause is binding.** Nico
> approved the recommended plan line: ADR-0079/GD-0030 own the single shared
> `InsolvencyCaseStage` enum; ADR-0050 consumes that enum as its ledger-facing staged
> insolvency state instead of carrying a second finance FSM; administration, embargo, wage-cap,
> points-deduction and fire-sale-opening events are state/policy facts only; fire-sale settlement
> reuses ADR-0105 registration disposal/write-off postings; and the only new insolvency-specific
> posting is `InsolvencyCreditorWriteOffPosted`. Grounding:
> [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]]. Frontmatter still stays
> `binding: false` until FMX-147 closes D3; the D4 clause itself is binding.

> **D4 gate unlocked 2026-06-11 (FMX-145):** [[ADR-0095-balanced-transfer-ledger-posting-invariant]]
> D1 was confirmed **A — balanced double-entry** (Nico live, `binding: true`), so the D4 "balanced
> **iff** double-entry" clause resolves to **balanced, unconditionally** — every insolvency posting
> MUST balance. The sequencing constraint ("this ADR sequences after the ADR-0050 entry-model
> decision") is satisfied. The exact `MoneyBand → amountMinor` collapse rule (D2 — **FMX-149**)
> and the named insolvency posting contract + shared enum (D4 — **FMX-146**) are now applied;
> the quality-profile enum reconciliation is **FMX-147**.

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08 as an audit-driven reconciliation ADR. It
> **closes three contract gaps** discovered across the already-drafted settlement / match-engine /
> insolvency ADRs, none of which is individually wrong but which **do not currently compose
> deterministically**. This ADR **edits no existing file** (ratify gate). It **supersedes nothing**;
> it proposes a single follow-up contract that the three affected ADRs (or, for the band-collapse
> piece, the [[ADR-0086-background-fast-matchday-cost-settlement]] ratification amendment) adopt on
> ratification. The "balanced postings" clause is **conditional** on the still-open single-vs-double
> -entry decision in [[ADR-0050-club-economy-accounting-ledger]]. Awaiting Nico ratify.

## Date

2026-06-08

## Context

Three drafted-but-unreconciled contracts create a determinism / reconciliation hazard at the
settlement boundary. Each is internally consistent; the gap is **between** them.

### Gap 1 — Settlement envelopes carry both a `MoneyBand` and an exact `Money`, with no collapse rule

[[ADR-0070-fixture-commercial-revenue-profile-contract]] sketched `MatchdayOperatingCostSummary` with
`estimatedOperatingCostBand: MoneyBand` and `settlementReadiness`. [[ADR-0086-background-fast-matchday-cost-settlement]]
extended that same envelope to carry **both** a banded estimate (`estimatedOperatingCostBand: MoneyBand`,
`riskCostBand`, `attendanceBand`) **and** an exact `estimatedOperatingCostTotal: Money` (`= Σ costFamilies`,
fixed-point). The ledger, however, posts **one exact integer** — [[ADR-0050-club-economy-accounting-ledger]]
fixes "money values are integer minor units" (`amountMinor`), and the posting events
(`FinanceLedgerEntryPosted`, `LedgerEntryBooked` / `LedgerEntryReversal`) carry a single authoritative
amount.

There is today **no named, deterministic `MoneyBand → amountMinor` collapse rule**. Where a posting is
sourced from a banded field (or a band must be reduced to a representative value for forecast/accrual),
two replays or two projections could legitimately pick different representatives, breaking the
byte-identical-replay guarantee that [[ADR-0086-background-fast-matchday-cost-settlement]] BF6 and
[[../../60-Research/determinism-and-replay]] make load-bearing. Mixing a coarse bucket and an exact
total in one immutable envelope is exactly the event-sourcing reconciliation hazard called out in the
grounding below: downstream code can accidentally choose different sources on different replays.

### Gap 2 — Three-valued `qualityProfileClass` vs the match-engine's four quality profiles

`match-engine.md` §6.2 defines **four** match quality profiles:
`competitive-full`, `interactive-standard`, `background-detailed`, `background-fast`
([[../../50-Game-Design/match-engine]]; confirmed in [[ADR-0026-match-frame-contract]] and
[[ADR-0049-swappable-spatial-event-match-engine]]). But [[ADR-0070-fixture-commercial-revenue-profile-contract]]'s
published `FixtureCommercialProfile` carries a **three-valued**
`qualityProfileClass: 'backgroundFast' | 'standard' | 'expert'`. There is no explicit 4→3 mapping, so it
is undefined which of `interactive-standard` / `background-detailed` collapses to `standard` vs `expert`,
and whether `competitive-full` is `expert`. That ambiguity propagates into which settlement path a
fixture takes (background-fast lightweight path vs foreground per-event path) — a determinism-relevant
routing decision, not a cosmetic naming difference.

### Gap 3 — Insolvency events imply ledger effects with no named ADR-0050 postings; two insolvency models

[[ADR-0079-dynasty-board-ownership-and-bankruptcy]] draft events imply real ledger movements but name
**no** posting in the [[ADR-0050-club-economy-accounting-ledger]] vocabulary:

- `ClubRescued { creditorWriteoffBand, … }` — a **creditor write-off** (removes a liability).
- `AdministrationEntered { wageCapPct, … }` — a **wage-cap delta** (changes the wage expense run-rate).
- `AdministratorFireSaleOpened { valuationDiscountBand, … }` → fire-sale completions — a **fire-sale
  receipt** (cash in against an asset disposal/write-down).

ADR-0079 states "**emitted ledger effects stay inside Club Management** … no ledger write occurs outside
Club Management" (DB5), which is consistent with ADR-0050's sole-writer rule — but it never says *which*
ledger entry kinds these resolve to. ADR-0050's listed events
(`InsolvencyStageChanged`, `OverduePayableAged`, `DebtRestructuringAgreed`, …) describe **state**, not the
**postings** the three insolvency events above require. Separately, ADR-0050 carries a *staged insolvency
state* and ADR-0079 carries an `InsolvencyCase` FSM — **two insolvency models** sharing no named enum, so
nothing guarantees ADR-0079's FSM states map 1:1 onto ADR-0050's stages.

All three gaps share one root: **band-typed estimates and FSM facts that must become exact, audited,
deterministic ledger postings**, with the collapse, mapping and posting contracts currently implicit.

Grounding: [[../../60-Research/determinism-and-replay]]; [[../../60-Research/background-fast-cost-settlement-2026-06-07]];
event-sourcing reconciliation best-practice (Perplexity, 2026-06-08): store the band **for
classification** and the collapsed exact `amountMinor` **for accounting**; make the collapse a pure
deterministic function of persisted inputs; version the policy so old events replay with the old rule;
and expand a single business event into **balanced** double-entry postings in the accounting projection.

## Options considered

- **D1 — Where to fix the three gaps.**
  - **A (recommended).** One follow-up reconciliation ADR (this one; the band-collapse clause may
    instead land as an [[ADR-0086-background-fast-matchday-cost-settlement]] ratification amendment),
    pinning all three contracts together so the collapse function, the enum mapping and the insolvency
    postings land coherently **with** the single-vs-double-entry decision.
  - **B.** Address each piece inside its own ADR's ratification PR separately (band-collapse in
    ADR-0086's PR, enum in ADR-0070's PR, insolvency postings in ADR-0079's PR). More PRs; real risk of
    **partial reconciliation** (e.g. enum fixed but collapse rule still floating).
  - **C.** Defer all three to implementation tickets. **Rejected for the band-collapse rule** — it is
    determinism-load-bearing (replay byte-identity), so it cannot be an undocumented implementation
    choice; acceptable only for pure numeric magnitudes.

- **D2 — Band → `amountMinor` collapse function.** **A (recommended): a single pinned deterministic
  rule, versioned behind `costProfileVersion`** — the open sub-question is *which* rule (midpoint /
  deterministic representative / seeded-within-band). · B: leave per-field. The recommendation is to pin
  *that there is one rule and it is deterministic and versioned*; the exact rule is the open question
  below.

- **D3 — Quality-profile enum.** **A (recommended): one canonical 4-valued enum portfolio-wide + an
  explicit `4 → settlement-path` mapping** (`competitive-full` / `interactive-standard` →
  foreground per-event; `background-detailed` → foreground-equivalent-on-resim; `background-fast` →
  lightweight stateless path), replacing the 3-valued `qualityProfileClass` with a derived
  `settlementPath` field. · B: keep both enums and add a translation table only in ADR-0070's ACL.

- **D4 — Insolvency postings + insolvency enum.** **A (recommended): a named
  insolvency-event → ledger-posting contract** (each of the three insolvency events maps to a named
  ADR-0050 posting; **balanced** iff double-entry is adopted), **plus a single shared insolvency-stage
  enum** referenced by both ADR-0050 and ADR-0079 so the FSM and the staged state are one model. · B:
  add the postings without unifying the enum (leaves two insolvency models).

## Decision

Accepted decision line: **D1 = A, D2 = A, D3 = A, D4 = A.** Clause-level apply status:
D2 is binding via FMX-149, D4 is binding via FMX-146 and D3 remains the FMX-147 apply-work before
this ADR's frontmatter can flip to `binding: true`.

> D2's open sub-question (*which* rule) was decided 2026-06-12 (FMX-149): **seeded-within-band**
> — see §"D2 ratified rule" below. D4 was applied by FMX-146; D3 apply-work continues as FMX-147.

### D2 — Deterministic `MoneyBand → amountMinor` collapse

Pin a **single** pure, deterministic collapse function `collapse(MoneyBand, ctx) → amountMinor`,
versioned behind `costProfileVersion`, with these invariants:

- The envelope keeps the **band for classification/analytics/UI only**; the **exact `amountMinor` that
  reaches the ledger is the collapsed value** — never the band re-interpreted at post time.
- Where an exact `Money` already exists in the envelope (`estimatedOperatingCostTotal` in
  [[ADR-0086-background-fast-matchday-cost-settlement]]), the ledger posts **that exact value**; the
  band is redundant metadata and the collapse function is **not** invoked. The collapse function applies
  only where a banded estimate is the *sole* source for a posting/forecast/accrual.
- When the collapse policy changes, the version increments; old events replay under the old rule
  (no silent re-interpretation). This satisfies BF6/BF10 of ADR-0086 and the replay guarantee in
  [[../../60-Research/determinism-and-replay]].
- If the chosen rule is **seeded-within-band**, the draw MUST use an existing
  [[ADR-0018-systemic-events-and-player-lifecycle]] stream sub-label (e.g. the
  `WorldRng:venue:<clubId>:<week>:opcost:v1` family ADR-0086 already reserves — **no new top-level
  stream**), with seed + draw indices persisted in provenance exactly as ADR-0086 mandates for its
  variance term.

#### D2 ratified rule — `collapseBand` v-`costProfileVersion`, seeded-within-band (Nico live, 2026-06-12, FMX-149)

The pinned function is **`collapseBand(band: MoneyBand, ctx) → amountMinor`** with rule
**seeded-within-band**, grounded in
[[../../60-Research/moneyband-amountminor-collapse-rule-2026-06-12]]:

- **Canonical `MoneyBand` type (pinned here; previously used but untyped across
  ADR-0070/0086/0095/this ADR):** `{ lowMinor: int, highMinor: int }` — a **closed** interval,
  `lowMinor ≤ highMinor`, integer minor units in the ledger's currency discipline
  (ADR-0050 / ADR-0095 LI-7). Display/UI bands derive from it; the collapse consumes it.
- **The draw:** exactly **one uniform integer draw on `[lowMinor, highMinor]`** (inclusive),
  integer-mapped — **no floating-point** anywhere in the path (platform-divergence hazard).
  A degenerate band (`lowMinor == highMinor`) collapses to `lowMinor` **without consuming a
  draw**.
- **One draw per business amount:** the collapsed value is drawn once and then referenced by
  **every** leg of the resulting balanced posting (ADR-0095 LI-1, Σ lines = 0 holds *after*
  collapse) — never one draw per leg.
- **Stream discipline (BF7 / ADR-0018):** every band-context that collapses via draw has
  **exactly one documented sub-label on an existing stream** — no new top-level `*Rng` stream.
  Matchday/opcost bands use the reserved `WorldRng:venue:<clubId>:<week>:opcost:v1`; the
  insolvency band contexts (`creditorWriteoffBand`, `valuationDiscountBand`) get their sub-label
  pinned with the insolvency posting contract (**FMX-146**).
- **Provenance (BF6):** `rngSubLabel`, `rngSeed`, ordered `rngDrawIndices` and
  `modelVersion = costProfileVersion` are persisted in the envelope `provenance` exactly as
  ADR-0086 §summary-schema mandates — same inputs replay to a byte-identical `amountMinor`.
- **Version governance:** the collapse policy is versioned behind the **shared
  `costProfileVersion`** — one key governs both the band-collapse policy and the cost-model
  magnitudes (ADR-0086 BF10 / FMX-52). A policy change increments the version; old events
  replay under the old rule (no silent re-interpretation, no timestamp-keyed policy switches).
- **Unchanged guards:** the exact-`Money`-wins invariant above stands — `collapseBand` is only
  invoked where a band is the *sole* source of a posting/forecast/accrual; the band itself stays
  classification/analytics/UI metadata.

Rejected alternatives (research-graded): **floor/low-bound** — systematic understatement of half
the band width per posting, linear −n·w/2 drift across a season, distorts FMX-52 calibration;
**midpoint** — sound co-equal pure-deterministic lead (IAS 37 posture, zero provenance cost) but
foregoes the bounded designed variance that sim-game practice (FM/Hattrick/Anstoss exact-booking
with bounded ε) and this project's standing posture (ADR-0086 D4=C, FMX-92/FMX-102) favour;
**hybrid** (midpoint for forecasts, seeded for settlements) — conceptually clean but a second
code path against the simplest-proportional bar.

### D3 — One canonical quality-profile enum + explicit settlement-path mapping

Adopt the **four** match-engine profiles as the single canonical enum portfolio-wide. Replace
ADR-0070's `qualityProfileClass: 'backgroundFast' | 'standard' | 'expert'` with the four-valued profile
plus a **derived** `settlementPath` field, mapped explicitly:

| Match quality profile (`match-engine.md` §6.2) | Settlement path |
|---|---|
| `competitive-full` | foreground per-event settlement (FMX-46) |
| `interactive-standard` | foreground per-event settlement (FMX-46) |
| `background-detailed` | background-fast settle now → reconcile via reversal+repost on re-sim (ADR-0086 D3) |
| `background-fast` | lightweight stateless path (ADR-0086 D2) |

This removes the undefined 3→4 collapse and makes the settlement-path routing a **typed function of the
canonical profile**, not an ambiguous string.

### D4 — Insolvency-event → ledger-posting contract + shared insolvency enum

Name the ledger posting each ADR-0079 insolvency event resolves to inside Club Management
(ADR-0050 sole-writer; ADR-0079 DB5), and unify the insolvency state model:

#### Shared enum

ADR-0079 / GD-0030 own the canonical lifecycle enum. ADR-0050 references this enum for its
ledger-facing staged insolvency state; older finance labels remain UI/read-model aliases only.

```text
InsolvencyCaseStage =
  stable
  stressed
  cash_flow_crisis
  under_embargo
  administration
  rescued
  liquidated        # reserved post-MVP terminal hook
```

Alias mapping for legacy finance surfaces:

| Legacy finance label | Canonical stage |
|---|---|
| `healthy` | `stable` |
| `watch` | `stressed` |
| `overdraft` | `stressed` or `cash_flow_crisis`, depending on arrears trigger |
| `freeze` | `under_embargo` |
| `arrears` | `cash_flow_crisis` |
| `licence_review` | `under_embargo` |
| `recovery` | `rescued` |
| `run_end` | reserved control-loss/run outcome, not an MVP ledger stage |

#### Event-to-posting mapping

| Origin event / fact | Ledger posting? | Contract |
|---|---:|---|
| `InsolvencyStageChanged` | No | State/projection fact only. |
| `AdministrationEntered { pointsDeductionBand, embargoScope, wageCapPct }` | No | Opens policy state: League applies points deduction, Transfer/Squad apply restrictions, wage-cap policy constrains future wage blocks. |
| `InsolvencyWageCapPolicySet` | No immediate posting | Future `PlayerWageBlockPosted` / `StaffWageBlockPosted` limits use ADR-0105; posted wages are never rewritten. |
| `AdministratorFireSaleOpened { valuationDiscountBand }` | No | Creates administrator authority and valuation pressure only; the band uses the existing ADR-0079 fire-sale RNG sub-label as provenance if collapsed. |
| `RegistrationDisposalSettled` with `insolvencyCaseId` | Yes | Reuse ADR-0105 `RegistrationDisposalSettled`; provenance marks administrator fire-sale. |
| `RegistrationWriteOffPosted` with `insolvencyCaseId` | Yes | Reuse ADR-0105 `RegistrationWriteOffPosted`; provenance marks insolvency/write-off reason. |
| `OwnerSupportGranted` | Yes, if it is a cash/debt/equity support instrument | Reuse the ADR-0050 / FMX-49 financing-owner-support path; not an insolvency-only posting. |
| `ClubRescued { creditorWriteoffBand }` | Yes, for creditor haircut/forgiveness | New `InsolvencyCreditorWriteOffPosted`, with the amount collapsed under D2 before posting. |
| `ClubLiquidated` | Reserved | Post-MVP liquidation close-out only; no MVP posting contract. |

- ~~If [[ADR-0050-club-economy-accounting-ledger]] adopts **double-entry**, every such posting MUST
  **balance** (equal debits/credits) per the grounding; if it adopts a single-entry signed-amount
  ledger, each resolves to one signed `amountMinor` entry. This clause is therefore gated on the
  ADR-0050 single-vs-double-entry decision and sequences right after it.~~ **Gate resolved
  2026-06-11 (FMX-145):** double-entry was adopted ([[ADR-0095-balanced-transfer-ledger-posting-invariant]]
  D1 = A, binding) — every insolvency posting **MUST balance** (LI-1/LI-4 apply).
- `AdministrationEntered`, points deductions, transfer embargoes, wage caps and fire-sale openings
  are policy/state facts. They can change permissions, budgets, valuation pressure and league
  standings, but they do not by themselves move cash, liabilities or registration assets.
- A **single shared insolvency-stage enum** is referenced by both ADR-0050 (its staged insolvency
  state) and ADR-0079 (its `InsolvencyCase` FSM), so the FSM states and the ledger-facing stage are
  one model with one set of names.

#### New posting: `InsolvencyCreditorWriteOffPosted`

`InsolvencyCreditorWriteOffPosted` is the only new insolvency-specific ledger posting. It is emitted
inside Club Management after a rescue / settlement fact has selected a concrete creditor haircut.

Minimum payload:

```text
InsolvencyCreditorWriteOffPosted {
  clubId
  insolvencyCaseId
  originEventId
  creditorClass
  settlementRef
  amountMinor
  currency
  collapsePolicyRef?         # required when derived from creditorWriteoffBand
  postingRuleVersion
  contraClassification       # debt_restructuring_gain | owner_equity_contribution
  idempotencyKey
}
```

Balanced leg direction:

| Situation | Provisional leg shape |
|---|---|
| External creditor haircut / CVA-like settlement | Dr/reduce liability · Cr `income.debt_restructuring_gain` |
| Owner or related-party forgiveness in substance as capital support | Dr/reduce liability · Cr `equity.owner_contribution` |

Concrete account codes are FMX-150; FMX-146 pins the event and account-category intent only.
The deterministic idempotency pattern is:

```text
insolvency-creditor-writeoff:{clubId}:{insolvencyCaseId}:{originEventId}:{creditorClass}:{postingRuleVersion}
```

Band collapse / RNG provenance:

- `creditorWriteoffBand` collapses once per creditor-class business amount before posting, using
  `collapseBand` D2 and the existing `WorldAiMgmtRng` stream sub-label
  `worldAiMgmt:structural:year:<year>:insolvency:<clubId>:writeoff:<creditorClass>:v1`.
- `valuationDiscountBand` for administrator fire-sale pressure uses the existing ADR-0079 fire-sale
  slot label (`...:insolvency:<clubId>:firesale:<slot>`). It affects valuation/acceptance policy
  and provenance on the eventual sale, not a direct ledger posting.
- The collapsed `amountMinor`, `rngSubLabel`, seed/draw indices and `costProfileVersion` are
  persisted in provenance as required by D2.

## Rationale

The three gaps are not independent: they all turn an imprecise/banded/FSM fact into an exact, audited,
deterministic ledger posting. Fixing them in one ADR (D1=A) prevents partial reconciliation, where one
piece lands and another still floats. The collapse rule is the only piece that is strictly
**determinism-load-bearing**, so it cannot be deferred to implementation (D1 rejects C for it). The
canonical 4-profile enum (D3) removes a routing ambiguity that silently selects a settlement path. The
insolvency posting contract (D4) is the only thing that makes ADR-0079's "ledger effects stay inside
Club Management" actually *postable*, and unifying the two insolvency models removes a latent
double-source-of-truth. The grounding confirms the canonical posture: **band for classification, exact
collapsed `amountMinor` for accounting, pure-deterministic versioned collapse, balanced double-entry
postings in the accounting projection.**

## Consequences

Positive:

- Closes the determinism / reconciliation hazard at settlement: every posting has one exact, replay
  -reproducible `amountMinor`, with the band kept only as classification metadata.
- One quality-profile enum portfolio-wide; settlement-path routing becomes a typed function instead of
  an undefined 3↔4 collapse.
- Insolvency ledger effects become **explicit and audit-correct**: most insolvency events are
  policy/state facts, fire-sale settlements reuse existing registration postings, creditor haircuts
  use one named balanced posting, and there is a **single** insolvency-stage model shared by
  ADR-0050 and ADR-0079.

Negative / constraints:

- The "balanced postings" clause **depended on** the single-vs-double-entry decision in
  [[ADR-0050-club-economy-accounting-ledger]] — **resolved 2026-06-11 (FMX-145): double-entry
  adopted (ADR-0095 D1 = A, binding)**; the sequencing constraint is satisfied.
- ~~The exact band→`amountMinor` collapse function is left open (below) and must be ratified before the
  collapse clause is binding.~~ **Resolved 2026-06-12 (FMX-149):** seeded-within-band ratified —
  the D2 collapse clause is **binding** (see §"D2 ratified rule").
- Replacing `qualityProfileClass` changes the published `FixtureCommercialProfile` shape — a schema
  version bump on the ADR-0070 contract (its P4 immutable-version rule applies).

## Risks

- **Sequencing risk.** ~~The balanced-postings clause cannot be finalised until the ADR-0050 single-vs
  -double-entry decision is made; landing this ADR first would leave D4 partially specified.~~
  **Closed 2026-06-11 (FMX-145)** — ADR-0095 D1 = A is binding. D4's posting contract was then
  applied by FMX-146 on 2026-06-12.
- **Cross-ADR churn.** Three accepted/proposed contracts (ADR-0070 accepted; ADR-0086, ADR-0079
  proposed) are touched on ratification; the changes are additive/clarifying but require coordinated
  apply-PRs (mirrors the reconciliation pattern in [[ADR-0089-bounded-context-portfolio-reconciliation]]).

## Open questions

- ~~**Exact `MoneyBand → amountMinor` collapse function:** midpoint of the band, a documented
  deterministic representative/floor, or a **seeded-within-band** draw on the existing
  `WorldRng:venue:…:opcost:v1` sub-label (with persisted seed + draw indices)? Pure-deterministic
  (midpoint/floor) is the simplest replay-safe option; seeded-within-band adds designed variance but
  must reuse an existing stream and persist provenance. This was the D2 collapse axis; the rest of
  the ADR is structurally determined once Nico picks the rule and the ADR-0050 entry model.~~
  **Resolved 2026-06-12 (FMX-149, Nico live): seeded-within-band** — one uniform integer draw per
  business amount on a documented existing-stream sub-label, seed + draw indices persisted in
  `provenance`, versioned behind the shared `costProfileVersion`; canonical `MoneyBand` type pinned.
  See §"D2 ratified rule" and [[../../60-Research/moneyband-amountminor-collapse-rule-2026-06-12]].
- **Insolvency posting contract / shared enum:** **Resolved 2026-06-12 (FMX-146):** D4 is applied as
  the shared ADR-0079/GD-0030 `InsolvencyCaseStage` enum plus the event-to-posting mapping above.
- **Remaining axis:** FMX-147 still applies D3's quality-profile enum reconciliation. Frontmatter
  stays `binding: false` until that axis closes.

## Supersedes

None.

## Related Docs

- [[ADR-0070-fixture-commercial-revenue-profile-contract]] — source of the `MoneyBand`/exact-`Money`
  envelope and the 3-valued `qualityProfileClass`.
- [[ADR-0086-background-fast-matchday-cost-settlement]] — the settlement envelope carrying both band and
  exact total; candidate host for the band-collapse clause as a ratification amendment.
- [[ADR-0050-club-economy-accounting-ledger]] — sole ledger writer; `amountMinor` posting; the
  single-vs-double-entry decision this ADR's D4 depends on; staged insolvency state.
- [[ADR-0079-dynasty-board-ownership-and-bankruptcy]] — insolvency events implying creditor write-off /
  wage-cap delta / fire-sale receipt; the `InsolvencyCase` FSM unified with ADR-0050's stages here.
- [[ADR-0026-match-frame-contract]] / [[ADR-0049-swappable-spatial-event-match-engine]] /
  [[../../50-Game-Design/match-engine]] — the canonical four quality profiles.
- [[../../60-Research/determinism-and-replay]] — replay byte-identity requirement the collapse rule must
  satisfy.
- [[../../60-Research/background-fast-cost-settlement-2026-06-07]] /
  [[../../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] /
  [[../../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]] /
  [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]] — settlement and insolvency grounding.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
