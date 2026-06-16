---
title: FMX-189 Investor MP Separation Plan
status: current
tags: [plan, fmx-189, multiplayer, singleplayer, investor, no-p2w]
created: 2026-06-16
updated: 2026-06-16
type: plan
binding: false
related:
  - [[../../docs/60-Research/investor-mp-transition-neutralization-2026-06-16]]
  - [[../../docs/40-Execution/fmx-189-investor-mp-separation-decision-record-2026-06-16]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../../docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
---

# FMX-189 Investor MP Separation Plan

## Goal

Close FMX-189 by replacing the older "neutralize on transition" framing with
Nico's global product rule: singleplayer, hotseat and imported/local saves never
seed, enter or mutate server-authoritative multiplayer state.

## Steps

1. Claim Linear FMX-189 and work in a clean `codex/fmx-189-*` worktree from
   current `origin/main`.
2. Preserve Perplexity-first discovery and source-checked research under
   `docs/60-Research/raw-perplexity/`.
3. Synthesize a dated research note and record Nico's decision as the accepted
   FMX-189 outcome.
4. Patch canonical vault homes:
   - ADR-0011 for global mode separation and removal of SP/Hotseat -> MP
     promotion.
   - ADR-0027 / ADR-0005 for save/export authority semantics.
   - ADR-0063, GD-0022 and `club-economy-commercial-contracts` for Investor
     SP-only entitlement scope.
   - Front-door maps, summary and session handoff.
5. Run docs validation and status consistency checks, then open a PR linked to
   FMX-189.

## HITL Decisions Already Resolved

Nico resolved the core design on 2026-06-16:

- Singleplayer and multiplayer are absolutely separated.
- Multiplayer starts with friends as a server-authenticated, server-managed and
  server-validated session.
- No singleplayer, hotseat or imported save can be used to enter multiplayer.
- Real-money Investor / player-buy / time-saving effects are allowed only in
  singleplayer and are never available in multiplayer.
- MP -> SP export remains conceivable future scope; SP -> MP is explicitly not
  desired.
