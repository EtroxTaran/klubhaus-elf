---
title: FMX-189 Investor MP Separation Decision Record
status: current
tags: [execution, decision-record, investor, multiplayer, singleplayer, no-p2w, accepted, fmx-189]
created: 2026-06-16
updated: 2026-06-16
type: decision-record
binding: false
linear: FMX-189
related:
  - [[../60-Research/investor-mp-transition-neutralization-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
---

# FMX-189 Investor MP Separation Decision Record

## Context

FMX-189 originally asked for `InvestorAllowState=MP-denied` transition
semantics: should a singleplayer Investor grant be blocked at purchase,
neutralized on transition or excluded from shared standings?

During planning, Nico clarified the product rule more broadly:

- Singleplayer and multiplayer are absolutely separate.
- Singleplayer is for oneself; real-money Investor/player-buy/time-saving is
  allowed only there.
- Multiplayer starts together with friends and is authenticated, managed and
  validated by the server.
- A singleplayer save must not be used to join or seed multiplayer.
- MP -> SP might be conceivable later, but SP -> MP is explicitly not desired.

## Decisions Recorded

| ID | Question | Options considered | Nico decision |
|---|---|---|---|
| D1 | What is the SP -> MP transition rule? | Neutralize on transition; exclude from shared standings; hard separation. | **Hard separation.** There is no SP/Hotseat/imported-save -> MP transition path. |
| D2 | What state counts as separated? | Investor-only; all paid entitlement state; all shared competitive state. | **All shared competitive state.** SP progress, cash, players, squads, schedules, standings, ledger and entitlements cannot seed MP. |
| D3 | Who enforces it? | UI-only; CommercialPortfolio-only; split server/domain contract. | **Split server/domain contract.** MP server/lobby refuses SP saves; CommercialPortfolio scopes Investor to SP; Club Management posts only SP ledger effects. |
| D4 | How should imported/local saves behave? | Rebind and neutralize; allow if no Investor; hard block. | **Hard block.** Local/hotseat/imported saves are SP-class data and not multiplayer-eligible. |
| D5 | Is MP -> SP in scope? | Decide now; forbid forever; defer. | **Defer.** MP -> SP export may be a separate future decision and cannot weaken SP -> MP prohibition. |

## Accepted Contract

- Multiplayer sessions are server-created, server-authoritative and never
  created from SP/hotseat/imported/local-save payloads.
- SP and hotseat exports carry no authority to seed MP. Any import flow is
  singleplayer-only unless a future ADR explicitly defines a different,
  non-competitive target.
- `InvestorAllowState=MP_DENIED` means no MP offer, no MP grant, no MP ledger
  posting, no MP read-model effect and no save-transition path.
- Account-bound Investor history can remain in account audit/history, but the
  cash/economy payload is `singleplayer_only`.
- Refund/revocation may reconcile SP entitlement state and SP ledger policy, but
  cannot mutate MP facts, standings, squads, matches or shared history.

## Evidence

- Synthesis:
  [[../60-Research/investor-mp-transition-neutralization-2026-06-16]]
- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-2026-06-16]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-investor-mp-transition-neutralization-source-checks-2026-06-16]]

## Follow-up

- MP -> SP export remains open/future and requires a dedicated decision packet.
- Implementation-time contract tests must prove MP creation/join APIs reject
  SP/hotseat/imported save payloads and that SP Investor entitlements have no MP
  read/write effect.
