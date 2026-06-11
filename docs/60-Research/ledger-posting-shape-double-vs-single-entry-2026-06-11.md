---
title: Ledger Posting Shape — Double- vs Single-Entry + Chart-of-Accounts Granularity (FMX-145)
status: current
tags: [research, economy, accounting, ledger, double-entry, chart-of-accounts, determinism, replay, ddd, event-sourcing, fmx-145]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-145
related:
  - [[raw-perplexity/raw-ledger-posting-shape-2026-06-11]]
  - [[raw-perplexity/raw-chart-of-accounts-granularity-2026-06-11]]
  - [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[determinism-and-replay]]
---

# Ledger Posting Shape — Double- vs Single-Entry + CoA Granularity (FMX-145)

FMX-145 closes the **keystone decision of the Club/Finance/Commerce accounting cluster**:
[[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant|ADR-0095]]
**D1** — balanced double-entry postings (A) vs single-entry + enforced-projection identity (B) —
plus the two open sub-questions that gate making ADR-0095 `binding: true`: **chart-of-accounts
granularity** and the **save-migration question**. Until D1 is confirmed, the posting shape of
every ledger path (matchday cost families, catering/merchandise, financing, fan-event, cup,
insolvency write-offs) is undefined and
[[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract|ADR-0101]]
**D4** ("balanced **iff** double-entry") cannot be finalised.

> **Provenance note.** The 2026-06-08 ratification sweep bulk-accepted ADR-0095 on its
> ★-recommended disposition, but the queue card's recommendation explicitly reads "A-vs-B is
> Nico's" — i.e. accepted-with-reservation. That is why ADR-0095 sits at `accepted` /
> `binding: false` with D1 still listed open in its body. This note grounds the explicit
> confirmation. (The Linear issue named this file `…-2026-06-10.md` after its creation date; the
> research ran 2026-06-11.)

## What is already decided (constraints, not re-opened)

- **ADR-0050** (accepted/binding) — Club Management is the **sole finance-ledger writer**; ledger
  is **append-only**; money is **integer minor units**; statements/KPIs are projections.
  ADR-0095 amends only the posting **shape** (amendment pattern per FMX-143 fork H1 — ADR-0050
  stays `accepted` with `amended_by`).
- **ADR-0086** (accepted) — BF8 reversal + compensating repost under a distinct upgrade
  idempotency key; BF6 byte-identical replay.
- **ADR-0079** (accepted) — insolvency events (`ClubRescued` creditor write-off, fire-sale,
  wage cap) whose ledger effects stay inside Club Management.
- **ADR-0058** (accepted) — IFRS-15 accrual recognition (receivable → cash).
- **ADR-0101** (accepted/`binding: false`) — D4 insolvency-posting contract sequences **after**
  this D1 decision.

## Research question 1 — posting shape (D1: A vs B)

Full capture: [[raw-perplexity/raw-ledger-posting-shape-2026-06-11]].

**Production practice is uniformly Option A.** Every surveyed production immutable/event-sourced
ledger enforces **per-transaction balance as a kernel/write-path invariant** and models
corrections as **new offsetting entries**:

| System | Posting shape | Corrections |
|---|---|---|
| TigerBeetle | double-entry transfers; "every debit has an equal and opposite credit" | immutable; "Always Add More Transfers" — corrections are additional opposite-direction transfers, optionally typed via `Transfer.code` and linked via `user_data_128` (primary source: TigerBeetle docs, *Correcting Transfers* recipe) |
| Modern Treasury Ledgers | journal entry balanced iff Σ debits = Σ credits; ≥1 debit + ≥1 credit entry required; whole ledger nets to zero (primary source: MT Ledger Transactions / Debits-and-Credits docs) | immutable; reversal/adjusting journal entries |
| Stripe (Balance Platform) | double-entry between internal accounts | adjustment entries, never overwrites |
| Square / Cash App | append-only double-entry | separate reversal/adjustment journal entries |
| Uber finance platform | double-entry GL, balanced entries per trip | adjustment entries after the fact |

**Documented failure modes of B (single-entry + periodic reconcile):** the accounting identity
cannot be enforced per transaction; errors surface only at the periodic check (**late
detection**) and the failed aggregate does not attribute **which** posting broke
(**attribution problem**); correctness lives in a projection pipeline, which is exactly where
**replay divergence** creeps in. For a byte-identical-replay engine, A's per-event invariant is
checkable at every append and at every replay step; B's invariant is only as strong as the weekly
sweep.

**Game-economy precedent + overhead:** double-entry appears in game/sim economies where
correctness matters (EVE Online wallet/ledger systems, virtual-economy frameworks). Overhead is
O(1) per posting (most paths = 2 lines; transfer-with-agent-fee style paths 3–4 lines, matching
economic reality). At our scale (~5k postings/season × 100-season soak × 2 lines ≈ 1M lines,
≤~128 MB worst case) storage/runtime cost is negligible for IndexedDB and Postgres.

**Reversal semantics refinement for LI-4:** the industry-standard term is the **reversing
entry** — a new entry on the **same accounts** with **negated/flipped lines**, linked to the
original entry id, under its own idempotency key. With signed per-line amounts (our model) this
is exactly ADR-0095's "leg-swapped balanced pair"; LI-4 should adopt the standard term and pin
the `originalEntryId` link + "reversal-then-correct-entry" for re-routing corrections (matches
ADR-0086 BF8's distinct-upgrade-key discipline).

## Research question 2 — chart-of-accounts granularity

Full capture: [[raw-perplexity/raw-chart-of-accounts-granularity-2026-06-11]].

Embedded/product-ledger practice (Modern Treasury, TigerBeetle, Formance, Twisp) converges on
**small stable account set + entry-level metadata dimensions**:

- **~30–40 typed accounts** (5 types) covering the real economic buckets: cash (operating/
  restricted), receivables (ticketing/sponsorship/transfers/prize), inventory (merchandise/
  catering), prepaid/deferred, payables (trade/wages/tax-social), financing principal, equity +
  retained earnings, revenue families (ticketing, catering, merchandise, sponsorship,
  broadcast/prize, transfer, other), expense families (matchday opex, catering COGS+labour,
  merchandise COGS, wages players/staff, interest, player-registration amortisation,
  sanctions/fines, other).
- **Fine-grained classification lives in posting metadata**, not the account tree: each posting
  carries a `categoryCode` from a **versioned category catalog** (level 2) plus refs
  (`matchId`, `competitionId`, `campaignId`, `contractId`). The 15+ FMX-46 matchday cost families
  map to **one** matchday-opex account + 15 category codes — the in-game "Expert accounting"
  P&L-by-category view aggregates on `categoryCode`, the balance sheet on accounts.
- **Versioning discipline:** never reuse/renumber account codes; additive evolution only
  (retire = inactive flag); category catalog versioned with effective dates so old saves replay
  under their original catalog. This is the same discipline ADR-0095 LI-9
  (`chartOfAccountsVersion`) already sketches, extended with the two-level split.

This keeps ADR-0095's "small fixed chart, not GAAP-complete" proportionality goal while giving
the Expert-accounting UI full category depth — and it future-proofs patch-time category splits
without ledger rewrites.

## Research question 3 — migration / live saves

No research needed, only repo facts: the repository was **reset to docs-vault-only on
2026-05-27**; there is no implementation and there are **no live saves**. The phase is
research/architecture (no development). The ledger shape is therefore a **pre-1.0,
greenfield-target decision**: no save-migration path is required; ADR-0095's migration risk
reduces to a one-line statement ("no live saves exist; the balanced shape is the v1 schema").
The data-loss risk flagged in FMX-145 only materialises if implementation starts **before**
ADR-0095 is binding — which this issue closes off.

## Recommended decision line (for Nico — ask-first gate)

- **D1 = A (balanced double-entry postings).** Unanimous production practice; the cluster's
  already-ratified mechanisms (BF8 reversal+repost, IFRS-15 accrual, creditor write-off) are
  double-entry in spirit and become machine-checkable; per-event invariants are strictly stronger
  for byte-identical replay than B's weekly sweep. Confirms the ratification-sweep lean
  explicitly.
- **CoA granularity = small fixed typed chart (~30–40 accounts) + versioned category-code
  catalog on postings** (two-level). The full account list + category catalog is **FMX-150**'s
  deliverable; FMX-145 pins the granularity principle + LI-9 extension only.
- **Migration = none** (pre-1.0, no live saves; v1 schema ships balanced).
- **LI-4 wording**: adopt the standard "reversing entry" formulation (same accounts, negated
  lines, `originalEntryId` link); semantics unchanged.

## Sources

Primary (verified 2026-06-11 via Ref/web):

- TigerBeetle docs — *Correcting Transfers* recipe (immutability; "Always Add More Transfers";
  correction `code` + `user_data_128` linking):
  <https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/coding/recipes/correcting-transfers.md>
- TigerBeetle docs — *Debit / Credit: The Schema for OLTP* + *Financial accounting* (double-entry
  model, immutability essential):
  <https://github.com/tigerbeetle/tigerbeetle/blob/main/docs/concepts/debit-credit.md>
- Modern Treasury docs — Ledger Transactions (credits must equal debits; ≥1 debit + ≥1 credit):
  <https://docs.moderntreasury.com/platform/reference/ledger-transaction-object>
- Modern Treasury docs — Debits and Credits guide (ledger nets to zero):
  <https://docs.moderntreasury.com/docs/guide-to-debits-and-credits>

Secondary (Perplexity 2026-06-11, full lists in the raw captures): Pilot / Investopedia /
HighRadius on single- vs double-entry failure modes; Twisp ledger-database docs; Oracle GL
chart-of-accounts tree versioning; Microsoft SQL Server append-only ledger tables; DualEntry
GL-vs-CoA primer.
