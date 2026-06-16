---
title: Investor MP Transition Neutralization
status: current
tags: [research, synthesis, investor, multiplayer, singleplayer, no-p2w, monetization, fmx-189]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-189
related:
  - [[raw-perplexity/raw-investor-mp-transition-neutralization-2026-06-16]]
  - [[raw-perplexity/raw-investor-mp-transition-neutralization-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-189-investor-mp-separation-decision-record-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
---

# Investor MP Transition Neutralization

## Scope

FMX-189 started as a request to define what `InvestorAllowState=MP-denied`
means when an account with a singleplayer Investor grant enters multiplayer.
Nico's 2026-06-16 decision makes the rule broader and simpler:

> Singleplayer and multiplayer are absolutely separated. Singleplayer,
> hotseat and imported/local saves are never allowed to seed or enter a
> server-authoritative multiplayer session.

This closes the issue by removing the transition path. Investor money does not
need neutralization on multiplayer entry because a paid-assisted singleplayer
save cannot become multiplayer state.

## Source-backed Synthesis

Platform policy pushes toward clear scope disclosure. Apple requires IAP-backed
digital unlocks/in-game currency to be complete and accurately represented in
metadata and review notes. Google Play similarly requires Play Billing for
digital goods such as virtual currency, extra playtime and add-on items, and
requires clear, accurate user-facing terms and pricing. For FMX, an Investor or
time-saving purchase that affects only singleplayer must say so everywhere it is
offered.

Refund/revocation systems also need clean mode scope. Google Play's Voided
Purchases API exists to support revocation after refunds, cancellations and
chargebacks. That should update SP entitlement state and audit records, but it
must not rewrite multiplayer facts because those facts never consumed the SP
entitlement.

Comparable-game precedent supports a hard authority wall:

- Last Epoch states that multiplayer is server authoritative and that offline
  characters cannot be used online or transferred into the online environment.
- Hattrick is an online football manager where human managers compete, and its
  paid Supporter package is positioned as analysis/customization/social tooling
  rather than gameplay advantage.
- Minecraft limits official achievement eligibility to provenance-qualified
  Marketplace add-ons to avoid unfair achievement gain from untrusted mods.

The FMX design consequence is a hard wall, not a laundering filter. Multiplayer
state is born on the server and can only be advanced by validated multiplayer
commands. Singleplayer exports, local hotseat saves, portable imports and
SP-only entitlements are outside that trust boundary.

## Accepted FMX-189 Outcome

Nico accepted the global separation rule on 2026-06-16:

| ID | Decision | FMX consequence |
|---|---|---|
| D1 | SP and MP are absolutely separate | No singleplayer, hotseat, local or imported save can seed or enter server MP. |
| D2 | MP starts together with friends under server authority | MP sessions are created by the MP lobby/server and start from MP-owned setup state. |
| D3 | Real-money time-saving is SP-only | Investor cash, player-buy/time-saving and similar paid assistance are allowed only in singleplayer. |
| D4 | MP never accepts SP-earned advantage | MP ignores/denies SP progress, cash, roster, entitlement and local-save data. |
| D5 | MP -> SP may be future scope | No MP -> SP export rule is decided here; SP -> MP remains explicitly forbidden. |

## Contract Recommendation

Use this wording across ADRs/specs:

- `singleplayer` / `hotseat` / `portable_import` saves are
  `multiplayerEligible=false`.
- Multiplayer sessions are `server_created`, `server_authoritative` and
  `spImportPolicy=forbidden`.
- `InvestorAllowState=SP_ALLOWED` only inside isolated singleplayer saves.
- `InvestorAllowState=MP_DENIED` means no MP offer, no MP grant, no MP ledger
  effect, no MP read-model effect and no SP-save import path.
- Account-bound entitlements may remain visible in account history, but their
  gameplay/economy payload is scoped to SP saves only.
- Refund/revocation changes SP entitlement lifecycle/audit state only and never
  mutates multiplayer history, standings, squads, fixtures or economy.

## Acceptance Scenarios

- Given an account owns an SP Investor grant, when the player joins or creates
  an MP league, then the MP server creates fresh MP state and receives no SP
  cash, roster, player, standings, schedule, ledger or entitlement payload.
- Given a user exports a singleplayer or hotseat save, when that export is
  uploaded to an MP join/create flow, then the server rejects it with a typed
  policy reason such as `sp_save_not_multiplayer_eligible`.
- Given a refund/void/chargeback arrives for an Investor purchase, when
  CommercialPortfolio reconciles the entitlement, then only SP entitlement/audit
  and any SP ledger policy are affected; no MP state changes.
- Given a cosmetic/supporter entitlement is account-bound, when shown in MP, it
  may affect only presentation/profile/social surfaces and never match,
  training, transfer, economy, ranking, reward or hidden-information state.

## Open Follow-up

MP -> SP export remains deliberately undecided. If it becomes product scope, it
needs a separate ADR/GDDR because it raises shared-history, attribution,
privacy, replay and content-portability questions. This follow-up cannot
weaken the accepted SP -> MP prohibition.
