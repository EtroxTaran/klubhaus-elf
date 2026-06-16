---
title: FMX-189 Investor MP Separation Handoff
status: wrapped
tags: [execution, handoff, fmx-189, investor, multiplayer, singleplayer, no-p2w]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
related:
  - [[../../60-Research/investor-mp-transition-neutralization-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-source-checks-2026-06-16]]
  - [[../fmx-189-investor-mp-separation-decision-record-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
---

# Handoff: FMX-189 Investor MP Separation (2026-06-16)

## Linear

- Issue: FMX-189
- Branch: `codex/fmx-189-investor-mp-separation`

## Done this session

- Claimed FMX-189 in Linear by moving `Backlog` -> `In Progress`.
- Created a clean `/tmp/fmx-189-investor-mp-separation` worktree from current
  `origin/main`.
- Preserved Perplexity discovery and targeted source checks.
- Recorded Nico's accepted global rule: SP, hotseat, local and imported saves
  are never multiplayer-eligible; MP starts from server-owned setup state.
- Reconciled ADR-0011, ADR-0027, ADR-0005, ADR-0063, GD-0022 and
  `club-economy-commercial-contracts` around the hard SP/MP wall and Investor
  `singleplayer_only` payload.
- Updated Research-Map, Research Summary, raw Perplexity README, Decision-Log
  and Current-State.

## Open / next step

- Open PR and move Linear to `In Review` once validation is green.
- MP -> SP export remains future/open and needs a separate decision packet if
  Nico later wants it.

## Blockers

- None for FMX-189. Paid activation still depends on existing monetization/legal
  gates outside this issue.

## Changed vault paths

- `docs/60-Research/investor-mp-transition-neutralization-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-source-checks-2026-06-16.md`
- `docs/40-Execution/fmx-189-investor-mp-separation-decision-record-2026-06-16.md`
- `docs/10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md`
- `docs/10-Architecture/09-Decisions/ADR-0027-postgres-data-model.md`
- `docs/10-Architecture/09-Decisions/ADR-0005-save-format.md`
- `docs/10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`

## Needs promotion

- No further promotion is needed for the SP -> MP prohibition; it is already
  reflected in accepted/current vault homes.
- Future MP -> SP export, if desired, needs a new ADR/GDDR.
