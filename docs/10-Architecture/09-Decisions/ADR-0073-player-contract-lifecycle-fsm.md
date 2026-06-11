---
title: ADR-0073 Player Contract Lifecycle FSM
status: accepted
tags: [adr, architecture, ddd, squad, transfer, contracts, regulations, notification, fmx-81]
created: 2026-06-03
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0043-notification-and-messaging-platform]]
  - [[ADR-0014-state-machines]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[../state-machines/player-contract-lifecycle]]
  - [[../state-machines/transfer]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/transfer-market-and-contracts]]
  - [[../../50-Game-Design/regulations-and-compliance]]
  - [[../../60-Research/player-contract-lifecycle-fsm-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]]
---

# ADR-0073: Player Contract Lifecycle FSM

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** FMX-81 resolves an ownership ambiguity by
> recording Nico's selected landing: Squad & Player owns player-contract lifecycle
> truth; Transfer owns deal/negotiation cases; Regulations owns eligibility rules;
> Notification owns warning delivery; Club Management owns ledger consequences.
> This ADR does **not** add a new Contracts bounded context and does **not**
> ratify final legal constants. Exact profile values remain Regulations data and
> require re-check before implementation.

## Date

- Proposed: 2026-06-03

## Context

The current FMX map says Squad & Player owns player base data, fitness, morale,
contracts and injuries. ADR-0052 repeats that Squad & Player owns contracts while
Transfer/Contracts owns agent/deal facts. The transfer negotiation FSM, however,
is club-to-club: it persists `seller_club_id`, negotiates a club package, then
enters player terms. That is correct for paid transfers, but it cannot cleanly
represent:

- an internal renewal where no buying club exists;
- a pre-contract/Bosman agreement where the current club is not selling;
- a free-agent signing where there is no selling club;
- expiry warnings where no negotiation case exists yet.

GD-0006 already warns against thin one-shot renewals and values long contracts on
talents. Regulations & Compliance owns the rule catalog, transfer-window FSM and
work-permit catalog; Club Management is the sole finance-ledger writer; Notification
owns durable inbox/message delivery.

Research is filed in
[[../../60-Research/player-contract-lifecycle-fsm-2026-06-03]]. Official source
checks distinguish contract/pre-contract permission from registration/work
eligibility, and genre checks show that strong football managers surface expiring
contracts as recurring planning work rather than one pop-up.

## Decision options

| Option | Description | Trade-off |
|---|---|---|
| A. Transfer owns lifecycle | Put renewals, expiries, pre-contracts and free agents in Transfer because they are deal-shaped. | Rejected. Conflates transient negotiations with long-lived player obligations and breaks on `seller_club_id` for free agents. |
| **B. Squad & Player owns lifecycle** | Squad & Player owns contract state, expiry clock and free-agent transition; Transfer owns process cases that can change it. | **Chosen.** Matches existing FMX ownership, avoids a new context, keeps roster/contract truth together and lets Transfer stay a process owner. |
| C. New Contracts context | Create a dedicated CLM bounded context for all player contract lifecycle state. | Generic DDD best-practice when contract complexity becomes its own capability, but rejected for this beat as premature map growth. Keep as a future extraction seam. |

## Decision (chosen — Nico 2026-06-03)

### Ownership

**Squad & Player owns `PlayerContractLifecycle`.**

It owns:

- `PlayerContract` identity and version;
- current club attachment by contract;
- start/end dates, term summary and active clauses required by other contexts;
- lifecycle state and deterministic expiry tick;
- renewal accepted / released / expired / became-free-agent transition;
- pre-contract-with-other-club marker after a valid pre-contract is agreed.

Transfer owns:

- `RenewalNegotiationCase` for current-club extension talks;
- `PreContractCase` for approach-to-sign / Bosman-style future contracts;
- `FreeAgentSigningCase` for no-selling-club signings;
- player/agent terms negotiation, counter-offer rounds, cooling-off and market
  opportunity projections.

Regulations & Compliance owns:

- `ContractPermissionPolicy` (pre-contract windows and domestic overrides);
- `RegistrationPolicy` (window state and free-agent exceptions);
- work-permit / GBE-like profiles and `RegistrationEligibilityVerdict`;
- top-5 fictional policy profiles and rule-set versioning.

Notification owns expiry-warning scheduling and delivery. Transfer may consume
selected contract-risk facts as opportunities, but it does not own the warning
cadence or the contract clock.

Club Management owns wage/signing-bonus/agent-fee ledger posting. Squad & Player
and Transfer emit financial intent facts; Club Management posts ledger entries
through its ACL.

### Contract lifecycle states

Authoritative Squad & Player states:

| State | Meaning |
|---|---|
| `active` | Contract is in force and not yet in a warning band. |
| `monitor` | Contract is approaching a configurable planning band; no direct urgency. |
| `renewal_due` | Club should decide: extend, sell, release or defer. |
| `renewal_negotiating` | A Transfer-owned renewal case is active. |
| `pre_contract_eligible` | Regulations policy says other clubs may approach without transfer fee / selling-club agreement. |
| `pre_contract_agreed_elsewhere` | Player has agreed a future contract with another club; current contract remains active until expiry. |
| `expiring` | Final high-urgency band before end date. |
| `expired_free_agent` | Contract ended; player is unattached until a new contract activates. |
| `renewed` | Terminal event for old contract version; new version starts. |
| `released` | Terminal event when club/player agree non-renewal before expiry. |
| `left_on_expiry` | Terminal event for current club when the player exits at end date. |

The detailed state-machine note is
[[../state-machines/player-contract-lifecycle]].

### Transfer-owned cases

Transfer does **not** make the club-to-club transfer FSM nullable. It creates
separate process cases:

- `RenewalNegotiationCase`: current club + player/agent; no buyer/seller pair.
- `PreContractCase`: future club + player/agent; current club is a referenced
  fact, not a negotiating seller.
- `FreeAgentSigningCase`: target club + unattached player/agent; no seller.

All three cases can use the same compact player-terms language (wage, length,
role, signing bonus, agent fee, key clause), but they differ in registration
activation and lifecycle commands.

### Top-5 policy depth

FMX ships top-5-style profile dimensions at design level:

- `EnglandLike`: foreign six-month pre-contract, stricter domestic late-window
  profile, GBE-like work eligibility, conditional free-agent registration.
- `GermanyLike`: six-month baseline, strong registration-window discipline.
- `SpainLike`: registration/squad-cost capacity can block otherwise agreed deals.
- `ItalyLike`: audited-payables / eligibility flavour and normal window discipline.
- `FranceLike`: wage-control/regulator-review flavour can block finance fit.

These names are design handles, not user-facing league names. Exact values live in
Regulations data and stay fictional / IP-clean.

## Public contract direction

Draft Squad & Player commands:

- `OpenContractLifecycle`
- `RecordRenewalTermsAccepted`
- `RecordPreContractAgreedElsewhere`
- `ReleasePlayerOnExpiry`
- `AdvanceContractLifecycleClock`
- `AttachFreeAgentContract`

Draft Transfer commands:

- `OpenRenewalNegotiationCase`
- `OpenPreContractCase`
- `OpenFreeAgentSigningCase`
- `SubmitPlayerTermsOffer`
- `AcceptPlayerTerms`
- `CollapseContractCase`

Draft Regulations queries:

- `ContractPermissionPolicy(playerId, currentClubId, targetClubId, date)`
- `CurrentTransferWindow(competition, date)`
- `RegistrationEligibilityVerdict(playerId, targetClubId, contractStartDate)`
- `WorkPermitVerdict(playerId, targetClubId, date)`

Draft events:

- `ContractMonitorWindowOpened`
- `ContractRenewalDue`
- `RenewalNegotiationOpened`
- `ContractExpiryWarningScheduled`
- `ContractExpiring`
- `PreContractWindowOpened`
- `PreContractAgreed`
- `ContractRenewed`
- `PlayerReleasedOnExpiry`
- `PlayerBecameFreeAgent`
- `FreeAgentTermsAgreed`
- `FreeTransferEligibilityCheckRequested`
- `FreeTransferRegistrationBlocked`
- `FreeTransferCompleted`
- `PlayerContractLifecycleAdvanced`

Notification payloads must be self-contained:

```text
ContractExpiring =
  eventId
  playerId
  playerDisplayNameSnapshot
  clubId
  contractId
  expiryDate
  monthsRemaining
  importanceBand
  recommendedActions
  sourceRuleSetVersion
```

No Notification handler may join back into Squad, Transfer or Regulations to make
the warning intelligible.

Finance payloads are intents, not ledger writes:

```text
ContractFinancialIntent =
  playerId
  clubId
  contractId
  wageMinor
  signingBonusMinor?
  agentFeeMinor?
  effectiveDate
  sourceCaseId?
```

Club Management consumes the intent through an ACL and posts the ledger entries.

## Invariants

| # | Invariant |
|---|---|
| **PCL1** | Exactly one Squad & Player contract lifecycle state is authoritative for a player-club contract version. |
| **PCL2** | Transfer cases never mutate contract state directly; they emit commands/events consumed by Squad & Player. |
| **PCL3** | The club-to-club transfer FSM keeps `seller_club_id` non-null; free-agent/pre-contract paths use separate cases. |
| **PCL4** | Registration/work eligibility is a Regulations verdict, never embedded in Transfer or Squad rules. |
| **PCL5** | Expiry transitions are deterministic functions of save date, contract end date and rule-set snapshot. |
| **PCL6** | Notification warning payloads carry all display facts needed for the inbox card. |
| **PCL7** | Financial consequences flow to Club Management as intents; no other context writes ledger rows. |
| **PCL8** | Top-5 policy profiles are fictional/IP-clean abstractions and versioned by rule-set snapshot. |
| **PCL9** | A signed/pre-signed/free-agent contract may exist before match eligibility; registration can be pending or blocked. |

## Consequences

Positive:

- One contract truth for Squad, market, notifications and free-agent state.
- Transfer keeps a clean deal/process language without null-selling-club hacks.
- Bosman/free-agent realism is present in MVP planning without copying legal text.
- Notifications and finance follow existing DDD/ACL boundaries.

Negative / constraints:

- Transfer now has three contract-related process cases in addition to paid-transfer
  negotiation; implementers must not collapse them for convenience.
- Regulations data must carry profile dimensions before this can be implemented.
- A future Contracts context may still be needed if player/staff/commercial/loan
  contract complexity becomes a shared CLM platform.

## HITL gate

Authored as `proposed` after Nico selected the FMX-81 planning defaults:

- D1 owner = Squad & Player.
- D2 Bosman/pre-contract = full top-5 depth.
- D3 free-agent path = separate case.

Remaining ratification items before implementation:

- exact per-profile windows and exception policies;
- exact warning cadence values per importance band;
- final decision whether a future Contracts bounded context is warranted after
  loans/staff/commercial contract work is complete.

## Related

- [[../../60-Research/player-contract-lifecycle-fsm-2026-06-03]]
- [[../state-machines/player-contract-lifecycle]]
- [[../state-machines/transfer]]
- [[../../50-Game-Design/GD-0006-transfers]]
- [[../../50-Game-Design/transfer-market-and-contracts]]
