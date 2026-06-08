---
title: ADR-0095 Double-entry / balanced-transfer ledger posting invariant
status: accepted
tags: [adr, architecture, ddd, economy, accounting, ledger, double-entry, invariant, audit, event-sourcing, determinism, club-management, fmx-106]
created: 2026-06-08
updated: 2026-06-08
type: adr
binding: false
supersedes: ADR-0050-club-economy-accounting-ledger
  - [[ADR-0050-club-economy-accounting-ledger]]
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
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0095: Double-entry / balanced-transfer ledger posting invariant

## Status

draft

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

- **D1 — Posting shape & identity invariant**
  - **A (RECOMMENDED) — Balanced double-entry postings.** Every `FinanceLedgerEntryPosted` carries
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

## Decision (draft — awaiting Nico)

Propose **D1 = A** as a **new superseding ADR** that:

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

**A vs B is Nico's call.** A is recommended because the corrections the cluster *already shipped*
(reversal+repost, IFRS-15 accrual, creditor write-off) are structurally double-entry in spirit; A makes
them mechanically verifiable, whereas B verifies them only on an after-the-fact projection sweep.

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
| **LI-4** | **Reversal = balanced offsetting pair:** a reversal posts the **leg-swapped** lines of the target entry (same magnitudes, swapped debit/credit) under a distinct idempotency key — it **never mutates** the original and is **never a bare signed number** (supersedes the implicit single-signed reversal assumed by ADR-0086 BF8). |
| **LI-5** | **Append-only & immutable:** posted entries are never edited or deleted; all corrections are new balanced entries (consistent with ADR-0050 append-only + ADR-0028 outbox). |
| **LI-6** | **Sole writer preserved:** balanced postings are produced **only** by Club Management; other contexts emit fact events (ADR-0050/0058) — double-entry never leaks into a non-finance context. |
| **LI-7** | **Money type:** all `amountMinor` are integer minor units (ADR-0050); ratios in basis points; no floats; band→`amountMinor` collapse happens **before** posting (see pairing follow-up). |
| **LI-8** | **Determinism/replay:** identical inputs + `worldSeed` produce a byte-identical balanced posting sequence; the balanced-pair reversal is reproducible on replay (ADR-0086 BF6 extended to the pair). |
| **LI-9** | **Chart-of-accounts versioning:** the account-code set is versioned (e.g. `chartOfAccountsVersion`); adding accounts never renumbers existing codes (future-proof, mirrors ADR-0086 `costProfileVersion` discipline). |

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
- A **chart of accounts** must be defined (granularity = open question) before postings can be coded;
  this is new design surface ADR-0050 deferred.
- The accounting complexity **must not leak into non-finance contexts** — LI-6 + the existing
  sole-ledger-writer rule already protect this (other contexts keep emitting flat fact events; only
  Club Management's ACL turns a fact into a balanced pair), but it is a discipline to enforce in review.

## Risks

- **Over-modelling for a single-player offline game:** full corporate chart-of-accounts granularity
  would be gold-plating; the D1-open-question on granularity must keep this proportionate (a small
  fixed chart, not GAAP-complete). The recommendation deliberately scopes the identity check as a
  control/projection check, not a per-write global sweep, to keep the offline hot path cheap.
- **Migration ambiguity:** this ADR fixes the target shape but does **not** prescribe a save-migration
  path; a follow-up must define how/whether existing single-signed saves project into balanced legs (or
  whether this is pre-1.0 with no live saves). Treated as the pairing follow-up's responsibility.
- **Leak risk** if a future context is tempted to post its own balanced entry — mitigated by LI-6, not
  eliminated.

## Open questions

- **D1 — A (balanced double-entry) vs B (single-entry `amountMinor` + a binding enforced-projection
  identity invariant)?** A guarantees the identity *structurally per posting*; B guarantees it
  *periodically on a projection*. Nico's call.
- **Chart-of-accounts granularity for an offline single-player ledger** — how many accounts, and how
  fine? (e.g. one liability account per creditor class vs a single "creditors" account; per-cost-family
  expense accounts vs a single "matchday operating expense"). This drives how legible the in-game
  "expert accounting" view can be vs modelling cost.
- **Band → `amountMinor` collapse point** — ADR-0086 summaries carry `MoneyBand`; where exactly does a
  band become the exact balanced pair the ledger posts? (Pairing follow-up.)

## Supersedes

[[ADR-0050-club-economy-accounting-ledger]] — **partially / shape-only.** This ADR supersedes ADR-0050's
**single-signed-`amountMinor` posting shape** and adds the **invariant table + accounting-identity
check** ADR-0050 lacked. It **does not** supersede ADR-0050's bounded-context boundary, sole-writer
rule, projections-are-derived rule, money type, or event/command/read-model contract list — those
remain in force. ADR-0050 is **not edited**; its supersession is recorded only here (ratify gate,
[[../../90-Meta/vault-governance]]). On ratification, ADR-0050's `superseded_by` is updated and the
[[../bounded-context-map]] Club Management row gains a one-line "balanced double-entry ledger postings"
clause; the **context count is unchanged (no new BC)**.

## Bounded-context-map impact

**None structural.** This is an internal posting-shape + invariant change inside the **existing** Club
Management context (sole ledger writer). No new context, no new cross-context relationship; the
CommercialPortfolio / Stadium Operations / Audience & Atmosphere fact-event relationships are unchanged.
A one-line Club Management clause may be added on ratify.

## Related Docs

- [[ADR-0050-club-economy-accounting-ledger]] — superseded (posting-shape only); boundary unchanged.
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
