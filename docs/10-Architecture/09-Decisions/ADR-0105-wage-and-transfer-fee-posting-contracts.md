---
title: ADR-0105 Wage + transfer-fee/amortisation ledger posting contracts
status: accepted
tags: [adr, architecture, economy, accounting, ledger, wages, staff, transfer-fees, amortisation, ias38, loans, club-management, determinism, fmx-144, accepted]
created: 2026-06-12
updated: 2026-06-12
type: adr
binding: true
amends: [[ADR-0050-club-economy-accounting-ledger]]
superseded_by:
related:
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0073-player-contract-lifecycle-fsm]]
  - [[ADR-0075-loan-orchestration-process-manager]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../60-Research/wage-and-transfer-fee-posting-contracts-2026-06-11]]
  - [[../../60-Research/ledger-posting-shape-double-vs-single-entry-2026-06-11]]
  - [[../../60-Research/club-economy-blueprint-2026-05-27]]
---

# ADR-0105: Wage + transfer-fee/amortisation ledger posting contracts

## Status

accepted

> **Decided live 2026-06-12 (FMX-144).** All six decision forks (D1–D6) were put to Nico
> live and decided on 2026-06-12; D1 and D6 are deliberate overrides of the research lean
> (see §Decision). Grounded in
> [[../../60-Research/wage-and-transfer-fee-posting-contracts-2026-06-11]]
> (IAS 38 / IAS 19 club practice + Football-Manager-style sim simplification).

## Context

[[ADR-0050-club-economy-accounting-ledger|ADR-0050]] names Club Management as the sole
ledger writer and carries a rich posting-event vocabulary (commercial, cup,
matchday-operating, financing, investor) — but **no named posting event** for the game's
two largest cashflows: the **wage block** (player + staff) and the **transfer fee**
(instalments, receivable/payable, registration-cost amortisation).
[[ADR-0053-staff-operations-context|ADR-0053]] declares `StaffWagePosted` "consumed by
Club Management ledger" with no counterpart posting event on the Club Management side;
[[ADR-0073-player-contract-lifecycle-fsm|ADR-0073]] delivers player wage / signing-bonus /
agent-fee facts as `ContractFinancialIntent`; [[ADR-0075-loan-orchestration-process-manager|ADR-0075]]
delivers loan money flows as `LoanFinancialIntent`. All three stop at the ACL.
[[ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]] (accepted/binding)
mandates balanced postings (LI-1/LI-2) but leaves exactly these two flows unnamed.

This ADR closes that hole. It **amends ADR-0050** by adding the named posting events
below to its public contract. Account handles used here are **provisional** — the
concrete chart of accounts is FMX-150 (ADR-0095 LI-9 two-level design).

## Decision

Decided live 2026-06-12 (FMX-144):

- **D1 = B — separate wage events.** `PlayerWageBlockPosted` and `StaffWageBlockPosted`
  (not one combined block). Override of the research lean: the player/staff split is part
  of the event vocabulary itself; `categoryCode` still tags the legs. Both are aggregated
  periodic postings (one journal per club per week with category-tagged lines; per-source
  detail in payload/provenance, never as extra ledger entries).
- **D2 = A — full IAS 38 transfer-fee shape.** Fee capitalised as a registration
  intangible, unpaid instalments as receivable/payable ("amounts due to/from football
  clubs"), straight-line amortisation over the contract term, disposal gain/loss as the
  separate "profit on disposal of registrations" line. Matches uniform real-club practice
  and gives FFP/squad-cost read-models the accrual figures they need.
- **D3 = A — weekly amortisation cadence** inside `AdvanceClubEconomyWeek` (the single
  authoritative cadence of ADR-0050). Integer pattern per LI-7:
  `base = floor(totalMinor / nWeeks)`, the **final week absorbs the remainder**, so
  Σ(periods) ≡ capitalised cost — deterministic and replay-safe.
- **D4 = A — loan intents ride these contracts** (no fourth ledger path, per ADR-0075
  LO8); the loan fee is recognised at `effectiveDate`, **not** spread over the loan
  period (a third accrual engine is over-modelling).
- **D5 = A — natural idempotency keys** (see table); fact-driven postings reuse the
  upstream `eventId`. Content-hash keys rejected as replay-fragile across catalog
  version bumps.
- **D6 = C — expense everything beyond the bare fee.** The registration intangible
  carries the **bare transfer fee only**; signing bonuses and agent/intermediary fees
  post as immediate expense at `effectiveDate`; a free transfer creates **no
  intangible**. Override of the IAS-38-lite lean (real clubs capitalise transfer-linked
  agent fees): a deliberate simplification — consequence recorded in §Consequences.

### Named posting events (amend ADR-0050 §Public contract direction)

All events are Club-Management-posted, ADR-0095-conform (≥2 typed `accountCode` legs,
Σ = 0, integer minor units), and idempotent under the listed key.

| Event | Cadence / trigger | Legs (provisional accounts) | Idempotency key |
|---|---|---|---|
| `PlayerWageBlockPosted` | weekly, in `AdvanceClubEconomyWeek`; aggregates all active player contracts (`ContractFinancialIntent.wageMinor`) | Dr `expense.player_wages` (category-tagged) / Cr `liability.wages_payable` → cash leg on payment in the same tick | `player-wage-block:{clubId}:{seasonYear}:{weekIndex}` |
| `StaffWageBlockPosted` | weekly, same tick; aggregates `StaffWagePosted` facts (ADR-0053) — this is the **named counterpart** to the `StaffWagePosted` ACL | Dr `expense.staff_wages` / Cr `liability.wages_payable` → cash leg on payment | `staff-wage-block:{clubId}:{seasonYear}:{weekIndex}` |
| `ContractSigningCostPosted` | on `ContractFinancialIntent` with `signingBonusMinor`/`agentFeeMinor`, at `effectiveDate` (D6: immediate expense, never capitalised) | Dr `expense.signing_bonuses` + Dr `expense.agent_fees` / Cr `liability.contract_costs_payable` or cash | upstream `ContractFinancialIntent` eventId |
| `TransferFeeCapitalised` | buying club, at registration date; full fee recognised regardless of instalment schedule (IAS 38) | Dr `asset.player_registrations` / Cr `liability.transfer_payables` (per-instalment maturity in payload) | `transfer-fee-cap:{feeAgreementId}` |
| `TransferInstalmentSettled` | per instalment due date; both directions; carries `kind: fee_instalment \| loan_fee \| breach_penalty` | payable side: Dr `liability.transfer_payables` / Cr `asset.cash`; receivable side: Dr `asset.cash` / Cr `asset.transfer_receivables` | `{feeAgreementId\|loanAgreementId}:{instalmentIndex}:{direction}` |
| `RegistrationAmortisationPosted` | weekly, in `AdvanceClubEconomyWeek`, over remaining contract weeks (D3 floor + last-week remainder) | Dr `expense.registration_amortisation` / Cr `asset.player_registrations` (accumulated-amortisation contra) | `registration-amort:{registrationAssetId}:{seasonYear}:{weekIndex}` |
| `RegistrationDisposalSettled` | selling club, on completed outgoing transfer: proceeds − net book value → the "profit on disposal of registrations" line | Dr `asset.transfer_receivables` (proceeds) + Cr `asset.player_registrations` (NBV) / balancing leg `income.registration_disposal_gains` or `expense.registration_disposal_losses` | upstream transfer-completed eventId |
| `RegistrationWriteOffPosted` | termination/release or career-ending injury: derecognise remaining NBV as loss (impairment to nil) | Dr `expense.registration_write_offs` / Cr `asset.player_registrations` | upstream termination/injury eventId |

Non-posting schedule fact (traceability, no ledger entry — like `CupForecastUpdated`):

- `RegistrationAmortisationRescheduled` — on contract **extension**: change of estimate
  (IAS 8), remaining NBV re-amortised **prospectively** over the new remaining term with
  the same floor/remainder rule; no retro adjustment, no gain/loss, no posting at the
  extension date itself.

### Loan-intent mapping (D4 — ADR-0075 `LoanFinancialIntent`, no fourth path)

| `kind` | Posting contract |
|---|---|
| `wage_contribution` | Dedicated recharge legs riding the wage blocks: payer club posts Dr `expense.loan_wage_contribution` / Cr cash-payable inside its `PlayerWageBlockPosted`; payee (parent) club posts the mirrored Dr cash-receivable / Cr `income.loan_wage_recharge` leg in its block. Gross wage stays on the employing club's wage expense. |
| `loan_fee` | `TransferInstalmentSettled` with `kind: loan_fee`; recognised in full at `effectiveDate` (D4 sub-fork) — expense at payer, income at payee; never capitalised (the registration stays on the parent's books and **keeps amortising during the loan**). |
| `breach_penalty` | `TransferInstalmentSettled` with `kind: breach_penalty`; immediate expense/income at the breach settlement date. |
| `obligation_buy_fee` | On trigger the obligation becomes a normal permanent transfer: `TransferFeeCapitalised` + instalment schedule, keyed by the new `feeAgreementId` (LO3 hand-off). |

### Free transfers (D6)

No selling club, no fee → **no intangible, no amortisation schedule**. Only
`ContractSigningCostPosted` (bonus/agent fee) and the weekly `PlayerWageBlockPosted`
legs apply.

## Consequences

- ADR-0050's missing wage/transfer vocabulary is closed; the `StaffWagePosted` →
  Club Management seam now has a named counterpart (`StaffWageBlockPosted`), mirrored in
  the [[../bounded-context-map|bounded-context-map]] Club Management row.
- Ledger volume stays bounded: ~2 wage journals/club/week plus per-registration
  amortisation legs — the aggregated-payroll pattern, not per-payslip simulation.
- FFP/squad-cost read-models can consume accrual figures (wages + amortisation), the
  real UEFA squad-cost-ratio inputs — believable FFP pressure without cash-basis
  distortion.
- **D6 trade-off (recorded):** the amortisation base is slightly lower than real-club
  practice (agent fees not capitalised) and the FFP read-model carries no capitalised
  agent fees. Accepted as a deliberate simplification; revisiting it later only changes
  the capitalisation rule, not the event vocabulary.
- **D1 trade-off (recorded):** two wage events instead of one combined block doubles the
  weekly wage-journal count but keeps player vs staff cost streams independently
  consumable without filtering on `categoryCode`.
- Insolvency wage-cap interaction remains a **seam only** — owned by ADR-0101 D4 /
  FMX-146; this ADR's wage blocks expose the weekly totals it needs.
- All account handles are provisional pending the FMX-150 chart of accounts; renaming an
  account is a catalog-metadata change (LI-9), not a posting-contract change.
- Idempotency keys are natural keys, so deterministic replay (LI-8) re-derives identical
  postings; corrections use reversing entries (LI-4), never edits.

## Options considered

| Fork | Options | Outcome |
|---|---|---|
| D1 | combined `WageBlockPosted` / **separate player+staff events** / per-fact pass-through | **B** (Nico override; research leaned combined) |
| D2 | **full IAS 38** / cash-basis / hybrid read-model | **A** (= lean) |
| D3 | **weekly tick** / monthly / season-boundary | **A** (= lean) |
| D4 | **ride wage/transfer families, fee at effectiveDate** / ride + fee spread / parallel loan events | **A** (= lean) |
| D5 | **natural keys** / content-hash | **A** (= lean) |
| D6 | IAS-38-lite / strict IAS 38 / **expense everything** | **C** (Nico override; research leaned IAS-38-lite) |
