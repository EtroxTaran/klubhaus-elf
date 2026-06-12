---
title: Wage + Transfer-Fee/Amortisation Ledger Posting Contracts (FMX-144)
status: current
tags: [research, economy, accounting, ledger, wages, transfer-fees, amortisation, ias38, loans, double-entry, determinism, fmx-144]
created: 2026-06-11
updated: 2026-06-12
type: research
binding: false
linear: FMX-144
related:
  - [[raw-perplexity/raw-wage-transfer-fee-accounting-2026-06-11]]
  - [[raw-perplexity/raw-wage-posting-sim-practice-2026-06-11]]
  - [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[ledger-posting-shape-double-vs-single-entry-2026-06-11]]
  - [[club-economy-blueprint-2026-05-27]]
---

# Wage + Transfer-Fee/Amortisation Posting Contracts (FMX-144)

FMX-144 closes the largest semantic hole left open by
[[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]]
(D1=A balanced double-entry, binding since 2026-06-11):
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger|ADR-0050]] has a rich
posting-event vocabulary (matchday, catering/merch, financing, cup, fan-event, investor) but **no
named posting event** for the game's two biggest cashflows — the **wage block** (player + staff)
and the **transfer fee** incl. instalments and registration-cost amortisation. `StaffWagePosted`
([[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context|ADR-0053]]) is declared
"consumed by Club Management ledger" with no counterpart posting event.

Two Perplexity strands ground this note:
[[raw-perplexity/raw-wage-transfer-fee-accounting-2026-06-11]] (real-world club accounting,
IAS 38 / IAS 19 / IFRS 9 / IAS 36 + Manchester United / Juventus / Borussia Dortmund annual-report
practice) and [[raw-perplexity/raw-wage-posting-sim-practice-2026-06-11]] (Football-Manager-style
simplification, aggregated payroll postings, integer rounding patterns).

## What is already decided (constraints, not re-opened)

- **ADR-0095 (accepted/binding)** — LI-1 every posting balanced (≥2 lines, Σ=0); LI-2 typed
  `accountCode` ∈ {asset, liability, equity, income, expense}; LI-4 corrections = reversing
  entries; LI-6 Club Management sole writer; LI-7 integer minor units; LI-8 deterministic replay;
  LI-9 two-level chart (fixed typed accounts + versioned `categoryCode` metadata). Concrete
  account list = **FMX-150** → every account handle in this thread is **provisional**.
- **ADR-0050 (accepted/binding)** — weekly authoritative tick (`AdvanceClubEconomyWeek`);
  projections derived, never stored as truth; receivable→cash two-posting precedent
  (`CompetitionPrizeReceivableRecorded` → `CompetitionPrizeCashReceived`).
- **ADR-0073 (accepted)** — player wage/signing-bonus/agent-fee facts arrive as
  `ContractFinancialIntent`; Club Management owns the posting.
- **ADR-0075 (accepted)** — loan money flows arrive as
  `LoanFinancialIntent { kind: loan_fee | wage_contribution | breach_penalty | obligation_buy_fee }`
  through the Club Management ACL (LO8); FMX-144 must bind these to the same wage/transfer
  contracts, **no fourth ledger path**.
- **Insolvency wage-cap interaction** — seam only; owned by ADR-0101 D4 / FMX-146.

## Research question 1 — what does real football accounting do?

Full capture: [[raw-perplexity/raw-wage-transfer-fee-accounting-2026-06-11]].

1. **Transfer fee = intangible asset** ("player registrations") at cost, **straight-line
   amortisation over the contract term** (IAS 38; uniform practice at Manchester United,
   Juventus, Borussia Dortmund). Capitalised: fee + transfer-linked levies + directly
   attributable intermediary fees. Expensed (IAS 19): wages, signing-on bonus, salary-side
   agent fees.
2. **Instalments**: full cost recognised at registration date; unpaid instalments =
   **"amounts due to/from football clubs"** payable/receivable with current/non-current split.
   Discounting exists but is commonly immaterial → nominal amounts are defensible.
3. **Disposal**: gain/loss = proceeds − net book value, presented as the separate
   **"profit on disposal of players' registrations"** line — the football P&L line.
4. **Extension**: change of estimate (IAS 8) → remaining book value re-amortised
   **prospectively** over the new term; no retro adjustment, no gain/loss.
5. **Termination/release**: derecognise remaining book value as loss; career-ending injury =
   impairment to (usually) nil.
6. **Wages**: periodic operating expense ("staff costs"), players/staff split in the notes;
   weekly-quoted, monthly-paid in reality; accrual basis makes cadence an internal choice.
7. **Loans**: registration stays on the parent's books, **amortisation continues during the
   loan**; loan fee recognised over the loan period in IFRS practice; wage contribution =
   gross wage expense at the employer + recharge income/expense between clubs.
8. **UEFA squad-cost ratio / FFP inputs = accrual figures**: wages + **amortisation** (+ agent
   fees), *not* cash transfer fees — i.e. a sim that wants believable FFP pressure needs the
   amortisation model, not cash-basis expensing.

## Research question 2 — how do sims simplify, and how should the ledger post it?

Full capture: [[raw-perplexity/raw-wage-posting-sim-practice-2026-06-11]].

- **Football Manager already does IAS-38-style amortisation** (fee/contract-years per year on
  the P&L), models instalments as separate "transfer debt" cash schedules, and aggregates wages
  into monthly/season category buckets against a weekly wage budget — **no per-payslip
  simulation**. Its visible categories (Player Wages, Staff Wages, …) match a two-level
  account/category design.
- **Aggregated periodic payroll posting** (one journal per period with category-tagged lines,
  per-source detail in payload/provenance, not in extra ledger entries) is the recommended
  pattern for game ledgers: bounded entry volume (~50 wage entries/season/club vs hundreds),
  auditability preserved because totals are deterministically recomputable from contract state.
  Per-employee postings are a fintech-throughput pattern, not a game need.
- **Integer straight-line remainders**: `base = floor(total/n)`, **last period absorbs the
  remainder** ("balancing adjustment in final period") — the common, simple, deterministic
  pattern; Σ periods ≡ original cost (LI-7-safe, replay-safe).

## Synthesis — option space for the decision forks

> **All six forks decided live by Nico on 2026-06-12 (FMX-144), see
> [[#Decided 2026-06-12 (live HITL, FMX-144)]] below.** The "Research lean"
> column records what the research recommended; D1 and D6 were decided
> against the lean.

| Fork | Options | Research lean |
|---|---|---|
| D1 wage consolidation | one combined weekly `WageBlockPosted` w/ category legs vs separate player/staff events vs per-fact pass-through | **combined block** (FM practice + aggregated-posting pattern; categories give the player/staff split) |
| D2 transfer-fee shape | full IAS 38 (intangible + payable/receivable + amortisation + disposal gain/loss) vs cash-basis vs hybrid | **full IAS 38** (uniform club practice; FM does it; FFP/squad-cost read-models need amortisation; only option satisfying LI-3 over time) |
| D3 amortisation cadence | weekly in `AdvanceClubEconomyWeek` vs season-boundary vs monthly | **weekly** (single authoritative cadence; pro-rata automatic; floor + last-period remainder) |
| D4 loan-intent mapping | ride the new families vs parallel loan events | **ride** (issue requirement); sub-fork: loan fee at schedule/effectiveDate vs spread over loan period — real IFRS spreads it, a third accrual engine is over-modelling |
| D5 idempotency keys | natural keys (`wage-block:{clubId}:{seasonYear}:{weekIndex}`, `{feeAgreementId}:{instalmentIndex}:{direction}`, upstream eventId for fact-driven) vs content-hash | **natural keys** (content-hash is replay-fragile across catalog version bumps) |
| D6 signing bonus / agent fee / free transfer | IAS-38-lite (agent fee capitalised, signing bonus expensed at signing, free = no intangible) vs strict IAS 38 (accrue bonus over contract) vs expense-all | **IAS-38-lite** (proportionality; strict bonus accrual = third schedule for little gameplay signal) |

## Decided 2026-06-12 (live HITL, FMX-144)

Nico decided all six forks live on 2026-06-12:

| Fork | Decision | vs. lean |
|---|---|---|
| D1 wage consolidation | **B — separate events**: `PlayerWageBlockPosted` + `StaffWageBlockPosted`, both weekly | **Override** of the combined-block lean — the player/staff split lives in the event vocabulary itself; `categoryCode` still tags the legs |
| D2 transfer-fee shape | **A — full IAS 38**: registration intangible + instalment receivable/payable + straight-line amortisation + disposal gain/loss | = lean |
| D3 amortisation cadence | **A — weekly** inside `AdvanceClubEconomyWeek`; `floor(total/n)` with last-period remainder | = lean |
| D4 loan-intent mapping | **A — ride** the wage/transfer posting families (no fourth ledger path); loan fee recognised at `effectiveDate`, not spread over the loan period | = lean |
| D5 idempotency keys | **A — natural keys**; fact-driven postings reuse the upstream `eventId` | = lean |
| D6 bonus/agent/free | **C — expense everything**: the registration intangible carries the **bare transfer fee only**; signing bonus + agent fees post as immediate expense; free transfer = no intangible | **Override** of the IAS-38-lite lean — deliberate simplification; consequence: slightly lower amortisation base, and the FFP/squad-cost read-model carries no capitalised agent fees |

Decision home: [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts|ADR-0105]]
(accepted/binding, decided live 2026-06-12).
