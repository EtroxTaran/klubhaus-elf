---
title: "Raw - DDD/event-sourced double-entry mapping for insolvency (FMX-146)"
status: raw
tags: [research, raw, perplexity, ddd, event-sourcing, double-entry, accounting-ledger, fmx-146]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-146
related:
  - [[../insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# Raw - DDD/event-sourced double-entry mapping for insolvency (FMX-146)

## Research prompt

Perplexity was asked for best practices in DDD/event-sourced financial systems that map domain events into immutable double-entry ledger postings. The prompt focused on named event-to-posting contracts, idempotency, reversals, account/version handling, and how to avoid a ledger FSM diverging from the domain FSM.

## Key findings

- Keep one canonical business state machine. The ledger records journal entries and balances; it should not own a duplicate lifecycle with parallel stages.
- Non-finance contexts should emit business events. A finance/ledger boundary translates only approved economic events into balanced journal entries.
- Event-to-ledger mapping should be explicit and versioned:
  - origin event type and id;
  - origin aggregate/case id;
  - posting rule id/version;
  - idempotency key;
  - account category/account code version.
- Every journal entry is immutable. Corrections use reversing entries and new corrected entries, not edits in place.
- Reversals should preserve provenance and mechanically invert the prior entry:
  - same accounts;
  - opposite signs/debit-credit direction;
  - `originalEntryId` or equivalent reference.
- Idempotency is mandatory. A deterministic idempotency key should normally include the source event id and posting rule version so replay cannot double-post.
- Account catalogs and posting-rule catalogs need versioning. Do not delete historical accounts; close their validity and add replacements.
- Estimates and bands should normally collapse before ledger posting. If a system must book estimates, use accrual/reserve accounts with a future reversal and actual settlement entry.
- Bounded contexts can own domain facts without owning ledger writes. For FMX, Club Management can remain the sole ledger writer while other sub-aggregates publish state/policy events inside the same bounded context.

## FMX-specific extraction

| Best practice | FMX implication |
|---|---|
| One canonical lifecycle | Use the ADR-0079/GD-0030 insolvency stage model as the shared enum; do not keep a finance-ledger-only stage list |
| Immutable journals | ADR-0095 reversal rules remain sufficient for insolvency postings |
| Explicit posting rules | Name exactly which insolvency event creates a ledger entry |
| Posting rule versioning | Include a posting rule reference on insolvency-derived entries |
| Idempotent projections | Derive idempotency keys from insolvency case id, origin event id and rule version |
| Estimates collapse before posting | Apply FMX-149/MoneyBand collapse before any creditor-writeoff amount is posted |
| Policy events are not postings | Stage changes, embargoes, wage caps and fire-sale openings should not emit ledger lines by themselves |

## Source trail

- Perplexity refresh (2026-06-12) was insufficient for validation: it returned mostly generic
  Football Manager support/community URLs and explicitly could not validate the legal/accounting
  claims. Kept as negative evidence and not used as the authority for the contract.
- Formance ledger guide — double-entry ledger invariants, immutability, idempotency, consistency and
  atomicity:
  <https://www.formance.com/blog/financial-operations/what-is-a-ledger>
- Formance idempotency documentation — stable idempotency keys, cached same-request retries and
  validation errors when the same key is reused with different parameters:
  <https://docs.formance.com/modules/ledger/working-with/idempotency>
- Modern Treasury — immutable double-entry ledgers, correcting by new entries rather than changing
  business history:
  <https://www.moderntreasury.com/journal/enforcing-immutability-in-your-double-entry-ledger>
- TigerBeetle documentation — financial transactions as double-entry transfers and equality of debit
  and credit totals as a core invariant:
  <https://docs.tigerbeetle.com/single-page/>
- Accounting-standard secondary references used for classification direction only: debt
  extinguishment/derecognition produces gain/loss for external concessions; owner/related-party
  forgiveness needs substance-based equity-vs-income classification. Concrete account codes remain
  FMX-150.

## Notes for synthesis

The research strongly supports a small contract: `InsolvencyCaseStage` is the business enum; only a creditor write-off/rescue settlement creates a new insolvency-specific posting; wage caps and fire-sale openings are constraints that shape future wage/transfer postings.
