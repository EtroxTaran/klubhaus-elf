---
title: FMX-155 Loan Cap and Obligation Catalog Handoff
status: wrapped
tags: [meta, execution, handoff, transfer, loan, regulations, fmx-155]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
related:
  - [[../../60-Research/loan-cap-and-obligation-catalog-2026-06-16]]
  - [[../../40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/regulations-and-compliance]]
---

# Handoff: FMX-155 Loan Cap and Obligation Catalog (2026-06-16)

## Linear

- Issue: FMX-155
- Branch: `codex/fmx-155-loan-cap-obligation-catalog`

## Done this session

- Verified FMX-155 was unclaimed, moved Linear to `In Progress`, and created a
  clean worktree from current `origin/main`.
- Ran Perplexity-first research and targeted source checks for FIFA Article 10,
  domestic overlays, obligation triggers and comparable-game precedent.
- Recorded Nico's accepted D1-D5 decisions in a current decision queue.
- Added the Regulations-owned `LoanRegulationProfile` and focused
  `ObligationConditionCatalog` packet to research, ADR and game-design homes.
- Updated front-door indexes and this handoff.

## Open / next step

- Merge PR after docs checks are green.
- Future code-phase work must turn the documented profiles/catalog into Zod
  contracts and deterministic contract tests.

## Blockers

- None for FMX-155.

## Changed vault paths

- `docs/60-Research/loan-cap-and-obligation-catalog-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-loan-cap-obligation-catalog-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-loan-cap-obligation-source-checks-2026-06-16.md`
- `docs/40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16.md`
- `docs/10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager.md`
- `docs/50-Game-Design/GD-0006-transfers.md`
- `docs/50-Game-Design/regulations-and-compliance.md`
- front-door map/index updates.

## Needs promotion

- No FMX-155 decisions remain unpromoted. Calibration values remain in FMX-52 /
  GD-0043 and should not be promoted by this beat.

