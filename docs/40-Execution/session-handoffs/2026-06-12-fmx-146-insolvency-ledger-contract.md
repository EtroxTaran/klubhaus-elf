---
title: FMX-146 Insolvency ledger posting contract handoff
status: wrapped
tags: [meta, execution, handoff, fmx-146, insolvency, ledger]
created: 2026-06-12
updated: 2026-06-12
type: handoff
binding: false
related:
  - [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# Handoff: FMX-146 insolvency ledger posting contract (2026-06-12)

## Goals

- Close ADR-0101 D4 by defining one shared insolvency stage enum and a named
  insolvency event-to-ledger posting contract.
- Preserve raw Perplexity/Web research plus synthesis and reflect the decision in
  the canonical vault surfaces.

## Completed

- Confirmed branch `codex/fmx-146-insolvency-ledger-contract` was aligned with
  `origin/main` before edits.
- Saved FMX-146 research synthesis plus three raw notes for real-world football,
  DDD/accounting ledger practice and sports-management game precedent.
- Applied ADR-0101 D4: shared ADR-0079/GD-0030 `InsolvencyCaseStage`; policy/state
  insolvency events do not post ledger entries; fire-sale completions reuse
  ADR-0105 registration postings; creditor haircut/forgiveness uses
  `InsolvencyCreditorWriteOffPosted`.
- Propagated the decision into ADR-0050, ADR-0079, ADR-0105, GD-0008, GD-0030,
  the dynasty state machine, the draft implementation ledger note, Current-State,
  Decision-Log, Open-Decisions-Dossier and research indexes.

## Open Tasks

- FMX-147 remains the only ADR-0101 apply-work axis: quality-profile enum and
  settlement-path mapping.
- FMX-150 still owns concrete chart-of-accounts account codes for the provisional
  categories named by FMX-146.

## Decisions Made

- Shared stage enum: `stable`, `stressed`, `cash_flow_crisis`, `under_embargo`,
  `administration`, `rescued`, reserved `liquidated`.
- Legacy finance labels are aliases/read models, not a second ledger FSM.
- Administration entry, points deduction, embargo, wage-cap policy and fire-sale
  opening are state/policy facts only.
- `InsolvencyCreditorWriteOffPosted` is the only new insolvency-specific posting.

## Blockers

- None for FMX-146 after validation/PR.

## Durable Notes Updated

- [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-insolvency-ledger-real-world-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-insolvency-ledger-ddd-accounting-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-insolvency-ledger-games-2026-06-12]]
- [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
- [[../../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]]
- [[../../50-Game-Design/GD-0008-finance-economy]]
- [[../../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
- [[../../10-Architecture/state-machines/dynasty-board-and-ownership]]
- [[../../30-Implementation/club-economy-accounting-ledger]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Open-Decisions-Dossier]]

## Promotion Needed

- None for FMX-146. ADR-0101 frontmatter should stay `binding: false` until
  FMX-147 closes D3.
