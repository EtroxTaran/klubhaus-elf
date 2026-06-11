---
title: ADR-0095 Double-entry / balanced-transfer ledger posting invariant
status: accepted
tags: [adr, architecture, ddd, economy, accounting, ledger, double-entry, invariant, audit, event-sourcing, determinism, club-management, fmx-106]
created: 2026-06-08
updated: 2026-06-11
type: adr
binding: true
amends: [[ADR-0050-club-economy-accounting-ledger]]
superseded_by:
related:
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[ADR-0086-background-fast-matchday-cost-settlement]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0061-club-management-sub-aggregate-audit]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../60-Research/club-economy-blueprint-2026-05-27]]
  - [[../../60-Research/ledger-posting-shape-double-vs-single-entry-2026-06-11]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0095: Double-entry / balanced-transfer ledger posting invariant

## Status

accepted

> **D1 confirmed + `binding: true` 2026-06-11 (FMX-145).** The 2026-06-08 bulk ratification
> accepted this ADR on its ★-recommended disposition, but the queue card's recommendation
> explicitly read "A-vs-B is Nico's" — an accept-with-reservation, which is why the ADR stayed
> `binding: false`. Nico confirmed **D1 = A (balanced double-entry)** live on 2026-06-11
> (FMX-145), together with the chart-of-accounts granularity principle and the migration answer
> (see §Decision); grounded in
> [[../../60-Research/ledger-posting-shape-double-vs-single-entry-2026-06-11]].

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08 (FMX-106). This is a **superseding ADR** that
> **narrowly amends the posting *shape* and adds an accounting-identity invariant** to the
> [[ADR-0050-club-economy-accounting-ledger]] ledger. It **leaves the ADR-0050 *boundary* decision
> unchanged** — Club Management remains the sole finance-ledger writer; statements/KPIs remain
> projections; money stays integer minor units; the commercial/operational fact-event contracts
> stay exactly as ADR-0050/0058/0061/0086 define them. It **does not edit ADR-0050** (supersession is
> expressed only here, per [[../../90-Meta/vault-governance]]). It locks **no numeric constants** and
> mandates **no schema migration plan** — only the invariant table the cluster is missing. Awaiting
> Nico to ratify, and to pick **D1 = A (double-entry) vs B (single-entry + enforced identity)**.

## Date

- Drafted: 2026-06-08 (FMX-106)
- D1 confirmed + binding: 2026-06-11 (FMX-145)

## Context

[[ADR-0050-club-economy-accounting-ledger]] is **accepted and binding**, and it is the most
invariant-hungry aggregate in the Club, Finance & Commerce cluster — yet it is the only finance ADR in
the cluster **without an invariant table and without a machine-checkable accounting identity**.

The ledger is currently modelled as a **single signed-entry stream**: each `FinanceLedgerEntryPosted`
carries one `amountMinor` (integer minor units, ADR-0050 §Decision) with **no contra-account and no
balancing leg**. Statements (`AccountingStatement`, `WeeklyCashflowStatement`, `LiabilitySchedule`,
balance-sheet-like summaries) are projections derived by summing that stream.

The problem is that **every correction mechanism the cluster has since added assumes a balance sheet
that reconciles and reversals that *structurally* offset** — but nothing in the contract guarantees
either:

- **[[ADR-0058-club-economy-commercial-impact-boundary]]** — the **IFRS 15** accrual/recognition
  schedule (receivable recognised, then realised; guarantee shortfall / royalty true-up). Accrual
  accounting only "reconciles" if the receivable leg and the cash leg are two halves of the same
  identity; with single signed entries, "the receivable became cash" is two independent magnitudes
  that *should* net but are never checked to.
- **[[ADR-0086-background-fast-matchday-cost-settlement]]** — D3 = **reversal + compensating repost**
  (invariant BF8: a posted summary is immutable; an upgrade emits "a reversal of the old total + a
  fresh posting of the new"). The ADR's own rationale is "balance = `sum(amount)` (no version
  filtering)" — i.e. it *relies on* reversals exactly offsetting, but a single-signed reversal is just
  another magnitude with the opposite sign; nothing makes `reversal(C0) + repost(C1)` provably equal
  to a clean `delta`.
- **[[ADR-0079-dynasty-board-ownership-and-bankruptcy]]** — administration **creditor write-off**
  (`ClubRescued { creditorWriteoffBand }`), administrator fire-sale, points-deduction-adjacent
  postings. A write-off is the canonical case where a liability is extinguished against equity; with
  no liability/equity legs there is no structural place for the write-off to *land* — it is a bare
  negative number.

ADR-0050's headline benefit is a **"strong audit trail for economy balance, replays and future
multiplayer trust."** That claim is **not currently enforceable**: there is no invariant a test or
replay-check can assert to prove the books reconcile or that a reversal truly undid its original.

Production immutable / event-sourced ledgers solve exactly this with **double-entry**: postings are
balanced transfers whose legs net to zero, reversals are *new balanced offsetting entries* (never
mutations), and the accounting identity is machine-derivable from account types. Grounding
(Perplexity, 2026-06-08; TigerBeetle docs):

- **TigerBeetle** — native double-entry; "all transfers consist of two entries, a debit and a credit";
  the core kernel invariant is "every debit has an equal and opposite credit"; transfers are immutable
  and "reversals are implemented with separate transfers to provide a full and auditable log"; the
  docs teach the **`Assets − Liabilities = Equity`** identity and provide a **control-account** pattern
  for machine-checking balance invariants at a point in time.
- **Modern Treasury (Ledgers)** — every ledger transaction is a set of postings that **must sum to
  zero**; unbalanced transactions are rejected; corrections are **new offsetting transactions**, not
  mutations; A = L + E is enforced via account categories + reporting controls.
- **Square / Cash App internal ledgers** — append-only double-entry; corrections via reversing /
  compensating entries; account-type classification drives the books-balance check.

The consistent pattern: the **always-on kernel invariant is per-transaction balance (legs net to
zero)**; the fuller **assets = liabilities + equity** identity is then derivable from per-line account
codes and checked as a control / projection invariant. This ADR proposes adopting that shape, scoped to
an offline single-player ledger.

Pre-existing constraints this ADR must honour (unchanged):

- **Sole-ledger-writer** ([[ADR-0050-club-economy-accounting-ledger]]): Club Management is the only
  context that posts; other contexts emit fact events via Customer-Supplier + ACL and **never write
  finance tables**. This rule already prevents double-entry complexity from leaking outward.
- **No cross-context joins / no shared tables** ([[ADR-0019-modular-monolith-ddd]],
  [[ADR-0027-postgres-data-model]]).
- **Determinism & replay** ([[ADR-0028-postgres-transactional-outbox]]; ADR-0086 BF6): postings flow
  through the outbox; replay must be byte-identical. A balanced-pair reversal is *more* replay-friendly
  than a free-signed delta, not less.
- **No locked numbers**: this ADR adds structure, not magnitudes.

## Options considered

- **D1 — Posting shape & identity invariant** *(decided **A**, Nico live 2026-06-11, FMX-145)*
  - **A (CHOSEN) — Balanced double-entry postings.** Every `FinanceLedgerEntryPosted` carries
    **≥2 lines that sum to zero**, each line tagged with an `accountCode` (typed asset / liability /
    equity / income / expense). A **reversal is a balanced offsetting pair** (swap the legs of the
    original), never a mutation and never a bare negative. Add a **`LedgerEntry` invariant table** and
    an **`assets = liabilities + equity`** identity check derivable from the line account codes
    (control-account / projection check, à la TigerBeetle). The `amountMinor` band-style scalar is the
    *net* of the balanced lines — it collapses out as a derived convenience, not the source of truth.
  - **B — Single-entry + enforced-projection identity invariant.** Keep the single `amountMinor`
    signed entry, but make it **binding** that (i) every entry records a **contra-account** reference
    and (ii) the **balance sheet must reconcile** on a recurring cadence (e.g. weekly, at
    `AdvanceClubEconomyWeek`) as an enforced-projection invariant. Cheaper to model; the identity is
    checked *after the fact* on a projection rather than *structurally guaranteed* per posting.
  - **C — Status quo (single signed `amountMinor`, no identity invariant).** **Reject.** Leaves the
    cluster's reversal/accrual/write-off mechanisms unverifiable and the audit-trail/trust claim
    unenforceable — the gap this ADR exists to close.

## Decision

**D1 = A — balanced double-entry postings.** Confirmed live by Nico on 2026-06-11 (FMX-145),
closing the accept-with-reservation left by the 2026-06-08 bulk sweep. Grounding:
[[../../60-Research/ledger-posting-shape-double-vs-single-entry-2026-06-11]] — every surveyed
production immutable/event-sourced ledger (TigerBeetle, Modern Treasury, Stripe, Square/Cash App,
Uber) enforces per-transaction balance as a write-path kernel invariant and models corrections as
new offsetting entries; the documented failure modes of single-entry + periodic reconcile (late
error detection, no imbalance attribution, replay divergence in the projection pipeline) are
exactly what a byte-identical-replay engine cannot afford.

This ADR **amends** ADR-0050 (shape-only) such that it:

1. **Leaves the ADR-0050 boundary decision unchanged** (sole writer, projections-are-derived,
   integer-minor-units, the entire command/event/read-model contract list, the
   CommercialPortfolio/Stadium/Audience fact-event relationships). This ADR amends **only the posting
   *shape*** and **adds the missing invariant table + identity check**.
2. Makes every ledger posting a **balanced transfer**: `FinanceLedgerEntryPosted` carries `lines: [{
   accountCode, amountMinor }]` with `Σ amountMinor = 0` and `lines.length ≥ 2`. The legacy
   single-`amountMinor` field becomes the derived **net** of the lines (back-compatible projection),
   so existing consumers/read-models that read a net number keep working.
3. Models **reversal as a balanced offsetting pair** — the ADR-0086 BF8 "reversal + compensating
   repost" becomes "post the leg-swapped balanced pair of the original entry, then post the new
   balanced entry," under the same distinct upgrade idempotency key. The ADR-0079 **creditor write-off**
   becomes a balanced entry that debits the creditor *liability* leg against an *equity* leg.
4. Adds a **`LedgerEntry` invariant table** (below) and a derivable **`assets = liabilities + equity`**
   identity check, run as a control-account / projection invariant (per-transaction balance is the
   always-on kernel invariant; the full identity is the layered control check, matching TigerBeetle /
   Modern Treasury / Square practice).

**A vs B was Nico's call — decided A (2026-06-11, FMX-145).** A was recommended because the
corrections the cluster *already shipped* (reversal+repost, IFRS-15 accrual, creditor write-off) are
structurally double-entry in spirit; A makes them mechanically verifiable, whereas B verifies them
only on an after-the-fact projection sweep.

**Decided sub-answers (Nico live, 2026-06-11, FMX-145):**

- **Chart-of-accounts granularity = two-level.** Level 1: a **small fixed typed chart of
  ~30–40 accounts** (5 types — asset/liability/equity/income/expense — covering the real economic
  buckets: operating/restricted cash, receivable classes, inventory, deferred revenue, payable
  classes, financing principal, equity/retained earnings, revenue families, expense families).
  Level 2: fine-grained classification (e.g. the 15+ FMX-46 matchday cost families) lives in a
  **versioned `categoryCode` catalog carried as posting metadata**, never as extra accounts — the
  in-game "Expert accounting" P&L aggregates by category, the balance sheet by account. This is
  the embedded-ledger standard (Modern Treasury dimensions, TigerBeetle codes/`user_data`,
  Oracle GL tree-versioning) and keeps the chart proportionate. The **concrete account list +
  category catalog is FMX-150's deliverable**; this ADR pins the principle and extends LI-9 to
  cover both levels.
- **Migration = none (pre-1.0).** The repository was reset to docs-vault-only on 2026-05-27;
  no implementation and **no live saves exist**. The balanced posting shape **is the v1 save
  schema**; no single-signed→balanced migration path is specified. The FMX-145 data-loss risk
  only materialises if implementation starts before this ADR is binding — closed by this flip.
- **LI-4 terminology.** The standard industry term for the LI-4 mechanism is the **reversing
  entry** (same accounts, negated/flipped lines, linked via `originalEntryId`, own idempotency
  key); with signed per-line amounts this coincides with the "leg-swapped balanced pair" wording.
  Re-routing corrections are modeled as **reversal of the original + a new correct entry**
  (TigerBeetle "Always Add More Transfers"), matching ADR-0086 BF8's distinct-upgrade-key
  discipline. Semantics unchanged; LI-4 below carries the refined wording.

**Pairing.** This ADR should land **together with a settlement/insolvency follow-up** so three things
arrive coherently: (i) **reversal-as-balanced-pair** (the ADR-0086 BF8 mechanism), (ii) the
**`MoneyBand` → `amountMinor` collapse** (ADR-0086 settlement summaries carry coarse bands;
the ledger posting must collapse a band to an exact `amountMinor` pair before posting — the
band→exact-money boundary is currently implicit), and (iii) **insolvency → ledger postings** (the
ADR-0079 fire-sale / write-off / points-adjacent effects expressed as balanced entries inside Club
Management). Without the pairing, A fixes the posting shape but leaves the band-collapse and
insolvency-posting paths under-specified.

## Proposed `LedgerEntry` invariant table

The invariant table ADR-0050 never had (Option A shape; D1 = B would keep LI-3/LI-6/LI-7 and drop the
per-posting balance requirement LI-1/LI-2 in favour of a weekly reconcile):

| # | Invariant |
|---|---|
| **LI-1** | **Per-posting balance (kernel invariant):** every `FinanceLedgerEntryPosted` has `lines.length ≥ 2` and `Σ line.amountMinor = 0`. An unbalanced posting is rejected before it reaches the outbox. |
| **LI-2** | Every line carries a typed **`accountCode`** ∈ {asset, liability, equity, income, expense} from the club chart of accounts; no untyped lines. |
| **LI-3** | **Accounting identity (control check):** at any settled point, `Σ asset = Σ liability + Σ equity` over the club's ledger (derivable from line account codes; asserted in replay/soak checks). |
| **LI-4** | **Reversal = reversing entry (balanced offsetting pair):** a reversal posts the **leg-swapped** lines of the target entry (same accounts, negated/flipped amounts) under a distinct idempotency key, **linked to the original via `originalEntryId`** — it **never mutates** the original and is **never a bare signed number**; a re-routing correction is a reversing entry **plus** a new correct entry (supersedes the implicit single-signed reversal assumed by ADR-0086 BF8). |
| **LI-5** | **Append-only & immutable:** posted entries are never edited or deleted; all corrections are new balanced entries (consistent with ADR-0050 append-only + ADR-0028 outbox). |
| **LI-6** | **Sole writer preserved:** balanced postings are produced **only** by Club Management; other contexts emit fact events (ADR-0050/0058) — double-entry never leaks into a non-finance context. |
| **LI-7** | **Money type:** all `amountMinor` are integer minor units (ADR-0050); ratios in basis points; no floats; band→`amountMinor` collapse happens **before** posting (see pairing follow-up). |
| **LI-8** | **Determinism/replay:** identical inputs + `worldSeed` produce a byte-identical balanced posting sequence; the balanced-pair reversal is reproducible on replay (ADR-0086 BF6 extended to the pair). |
| **LI-9** | **Chart-of-accounts + category-catalog versioning (two-level):** the account-code set is versioned (`chartOfAccountsVersion`); adding accounts never renumbers or reuses existing codes (retire = inactive flag, never delete). The fine-grained **`categoryCode` catalog is a separate versioned dimension on postings** (effective-dated; old saves replay under their original catalog version) — category evolution never touches accounts or rewrites ledger history (future-proof, mirrors ADR-0086 `costProfileVersion` discipline). |

## Consequences

Positive:

- **Reversals and replay become mechanically verifiable:** LI-1/LI-4 make `reversal + repost`
  provably zero-sum, so [[ADR-0086-background-fast-matchday-cost-settlement]] D3 and
  [[ADR-0079-dynasty-board-ownership-and-bankruptcy]] creditor write-off become **audit-correct by
  construction** rather than by convention.
- **The IFRS-15 accrual** ([[ADR-0058-club-economy-commercial-impact-boundary]]) gets a structural home:
  "receivable → cash" is one balanced transfer, so accrual reconciliation is checkable, not assumed.
- **ADR-0050's audit-trail / future-multiplayer-trust claim is finally enforceable** — LI-3 is the
  identity a replay/soak test can assert; the strongest stated benefit of the whole ledger becomes
  real.
- Matches production ledger practice (TigerBeetle / Modern Treasury / Square), so future
  cloud-sync-narrow ([[ADR-0090-offline-sync-scope-and-conflict-strategy]]) reconciliation and any
  later multiplayer trust boundary rest on a standard, well-understood model.
- Back-compatible: the legacy net `amountMinor` survives as a derived projection, so existing
  read-models (`AccountingStatement`, `WeeklyCashflowStatement`, …) need no contract break.

Negative / constraints:

- **Double-entry adds modelling overhead to every posting path** — each of the many ADR-0050 posting
  events (matchday cost families, catering/merchandise lines, financing drawdown/interest, fan-event
  settlement, cup settlement) must now emit a balanced pair with explicit account codes rather than one
  signed number.
- A **chart of accounts** must be defined before postings can be coded; this is new design surface
  ADR-0050 deferred (granularity decided two-level 2026-06-11, FMX-145 — see §Decision; the
  concrete account list + category catalog is FMX-150).
- The accounting complexity **must not leak into non-finance contexts** — LI-6 + the existing
  sole-ledger-writer rule already protect this (other contexts keep emitting flat fact events; only
  Club Management's ACL turns a fact into a balanced pair), but it is a discipline to enforce in review.

## Risks

- **Over-modelling for a single-player offline game:** full corporate chart-of-accounts granularity
  would be gold-plating. **Mitigated by the decided two-level granularity** (small fixed ~30–40
  account chart; fine classification as versioned posting metadata — §Decision). The identity check
  stays a control/projection check, not a per-write global sweep, keeping the offline hot path cheap.
- **Migration ambiguity:** **resolved 2026-06-11 (FMX-145)** — pre-1.0, no live saves exist
  (docs-vault-only reset 2026-05-27); the balanced shape is the v1 save schema, no migration path.
- **Leak risk** if a future context is tempted to post its own balanced entry — mitigated by LI-6, not
  eliminated.

## Open questions

All three original open questions are **resolved or routed** (2026-06-11, FMX-145):

- **D1 — A vs B:** **decided A** (balanced double-entry) — Nico live 2026-06-11; see §Decision.
- **Chart-of-accounts granularity:** **decided** — two-level (small fixed typed chart ~30–40
  accounts + versioned `categoryCode` posting-metadata catalog); the concrete account list +
  category catalog is **FMX-150**'s deliverable.
- **Band → `amountMinor` collapse point:** **routed** — owned by
  [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] D2; the exact
  collapse rule (midpoint / deterministic representative / seeded-within-band) is **FMX-149**.
  With D1 = A decided, ADR-0101's D4 "balanced **iff** double-entry" clause resolves to
  **balanced, unconditionally** — the insolvency posting contract (**FMX-146**) sequences next.

## Supersedes

None — this ADR **amends** [[ADR-0050-club-economy-accounting-ledger]] **shape-only**, on the
amendment pattern (FMX-143 fork H1, Nico 2026-06-11: predecessor stays `accepted` with
`amended_by:`; no `superseded_by`). It replaces ADR-0050's **single-signed-`amountMinor` posting
shape** and adds the **invariant table + accounting-identity check** ADR-0050 lacked. It **does
not** touch ADR-0050's bounded-context boundary, sole-writer rule, projections-are-derived rule,
money type, or event/command/read-model contract list — those remain in force. With D1 confirmed
(2026-06-11, FMX-145), ADR-0050 carries a dated amendment note and the [[../bounded-context-map]]
Club Management row carries the one-line "balanced double-entry ledger postings" clause; the
**context count is unchanged (no new BC)**.

## Bounded-context-map impact

**None structural.** This is an internal posting-shape + invariant change inside the **existing** Club
Management context (sole ledger writer). No new context, no new cross-context relationship; the
CommercialPortfolio / Stadium Operations / Audience & Atmosphere fact-event relationships are unchanged.
The one-line Club Management clause was added with the D1 confirmation (2026-06-11, FMX-145).

## Related Docs

- [[ADR-0050-club-economy-accounting-ledger]] — amended (posting-shape only); boundary unchanged.
- [[ADR-0058-club-economy-commercial-impact-boundary]] — IFRS-15 accrual recognition that this
  invariant makes reconcilable.
- [[ADR-0086-background-fast-matchday-cost-settlement]] — BF8 reversal+repost becomes a balanced pair.
- [[ADR-0079-dynasty-board-ownership-and-bankruptcy]] — creditor write-off / fire-sale postings get a
  structural home (liability↔equity legs).
- [[ADR-0061-club-management-sub-aggregate-audit]] — `FixtureSettlement` / sub-aggregate audit context.
- [[ADR-0091-audit-security-context-definition]] — audit context that consumes the now-enforceable
  ledger trail.
- [[ADR-0019-modular-monolith-ddd]] / [[ADR-0027-postgres-data-model]] / [[ADR-0028-postgres-transactional-outbox]]
  — no shared tables; per-context storage; outbox-published postings.
- [[../../50-Game-Design/GD-0008-finance-economy]] / [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  / [[../../50-Game-Design/economy-system]] — economy design the ledger backs.
- [[../../60-Research/club-economy-blueprint-2026-05-27]] — original ledger blueprint.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
- Grounding (Perplexity, 2026-06-08): TigerBeetle (docs.tigerbeetle.com — debit/credit balance
  invariant, immutable reversals-as-transfers, control-account identity checks, `Assets − Liabilities =
  Equity`), Modern Treasury Ledgers (postings sum to zero; offsetting reversals), Square/Cash App
  internal ledgers (append-only double-entry; reversing entries). Pattern: per-transaction balance is
  the kernel invariant; A = L + E is the layered control/projection check.
- Decision grounding (2026-06-11, FMX-145):
  [[../../60-Research/ledger-posting-shape-double-vs-single-entry-2026-06-11]] (+ raw captures
  [[../../60-Research/raw-perplexity/raw-ledger-posting-shape-2026-06-11]],
  [[../../60-Research/raw-perplexity/raw-chart-of-accounts-granularity-2026-06-11]]) — primary
  sources verified: TigerBeetle *Correcting Transfers* recipe, Modern Treasury ledger-transaction
  balance rule; CoA granularity practice (Modern Treasury dimensions, Formance/Twisp metadata,
  Oracle GL tree versioning).
