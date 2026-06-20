---
title: "Monetization model and no-P2W canon (FMX-191)"
status: current
tags: [research, synthesis, monetization, no-p2w, pricing, cosmetics, supporter, legal, fmx-191]
context: audit-security
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-191
addresses: [PM-2026-05-20-04-F-01]
related:
  - [[raw-perplexity/raw-monetization-model-market-precedents-2026-06-13]]
  - [[raw-perplexity/raw-monetization-legal-privacy-store-policy-2026-06-13]]
  - [[raw-perplexity/raw-no-pay-to-win-guardrails-2026-06-13]]
  - [[raw-perplexity/raw-monetization-source-checks-2026-06-13]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[pre-mortem/PM-2026-05-20-04-monetization]]
  - [[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]
---

# Monetization model and no-P2W canon (FMX-191)

## Scope

FMX-191 answers the model-level monetization question left by
[[pre-mortem/PM-2026-05-20-04-monetization|PM-2026-05-20-04-F-01]]: what FMX sells,
what it never sells, and how that promise stays compatible with future
multiplayer/private-group play.

This note is research synthesis only. The proposed game-design home is
[[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]];
the proposed architecture/payment-boundary home is
[[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]].
Both are accepted after Nico approved the decision packet on 2026-06-19 in
[[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]].

## Current constraints

- FMX is docs-vault-only and in research/architecture phase. No payment code,
  SKU catalog, provider selection or checkout design is being implemented here.
- [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary|ADR-0063]]
  already defines the singleplayer Investor entitlement and payment boundary. FMX-191
  does not reopen provider/refund/age-gate details.
- Future shared contexts exist in the design memory: async private groups,
  rankings/comparisons, watch-party/conference play and server-authoritative
  multiplayer. Monetization must not create power that can cross into those contexts.
- FMX-190 is the follow-up for broader MP-fairness CI/test enforcement. As of
  2026-06-13 it has produced draft
  [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]];
  Nico selected the scope split for this beat: FMX-191 is the **model-level canon**.

## Evidence synthesis

Market/game precedent:

- Premium/annual football-manager precedent gives a strong trust signal but is a
  poor default for PWA/mobile acquisition.
- Mobile sports-manager games that sell progression, boosts, premium currency or
  competitive convenience are common, but player perception frequently labels those
  models pay-to-win.
- Hattrick-style supporter membership is the best genre precedent for FMX: paid
  identity, history and convenience, while competitive outcomes stay earned.
- A light pass can work later only when it is cosmetic-only and content cadence is
  real. Launching it too early creates filler/FOMO pressure.

Legal/store/privacy:

- Deterministic cosmetic SKUs and supporter membership are materially simpler than
  paid randomness, paid power or ad-based monetization.
- EU/German consumer law, app-store policy, ratings and privacy all push toward
  transparent pricing, clear purchase obligations, no misleading scarcity, no hidden
  renewal/cancellation traps and minimal purchase telemetry.
- Paid random rewards are unnecessary for the game model and add avoidable policy,
  rating and consumer-protection complexity.

No-P2W taxonomy:

- "No pay-to-win" must cover indirect advantage, not just obvious stat boosts.
- Paid information advantage is power in a management game: hidden scouting certainty,
  stronger tactical analysis or better predictive models can be as unfair as a direct
  player-stat boost.
- Singleplayer-only paid value is acceptable only if it cannot cross into shared
  saves, rankings, exports, comparisons or future multiplayer contexts.

## Recommendation

Adopt the following FMX monetization promise:

> FMX is free to start and never sells competitive power. Revenue comes from
> cosmetic club identity, non-authoritative supporter membership features and,
> later if content cadence supports it, a cosmetic-only club season card.

Recommended decision packet:

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 launch model | **A. Free core + cosmetics + optional Supporter Club** | Best PWA acquisition/trust balance; preserves no-P2W future MP. |
| D2 pass/ads timing | **A. Supporter at launch, cosmetic season card later, no ads in MVP** | Avoids filler/FOMO and privacy overhead before cadence is proven. |
| D3 Investor handling | **A. Keep Investor as ADR-0063 singleplayer-only special case** | Preserves existing decision while preventing competitive spillover. |
| D4 entitlement taxonomy | **A. Strict allowed/forbidden model-level taxonomy now** | Gives all later SKU work a hard red/green gate. |
| D5 FMX-190 split | **A. Leave CI/test enforcement to FMX-190** | Keeps this issue product/architecture canon, not test-framework implementation. |

## Entitlement taxonomy

| Class | Status | Examples | Guardrail |
|---|---|---|---|
| Cosmetic identity | Allowed | Kits, badge variants, profile frames, UI themes, stadium skins, cosmetic trophies | No mechanical effect, readability advantage or hidden information. |
| Supporter QoL/history | Allowed with guardrails | Longer history views, replay archive, cosmetic preset slots, profile curation | Must not reveal hidden state, automate decisions or improve competitive opportunity volume. |
| Account services | Allowed with guardrails | Rename, cosmetic reset, non-ranked account-region service | No rank/MMR/reward/fixture/economy effect. |
| Singleplayer Investor cash | Restricted special case | ADR-0063 Investor grant | Only in isolated singleplayer saves; never in shared/ranked/MP/comparison surfaces. |
| Paid random cosmetics | Defer/reject by default | Cosmetic loot/random boxes | Not needed for FMX-191; creates legal/rating/trust overhead. |
| Paid power | Forbidden | Player/staff boosts, budget, morale/stamina/recovery, scouting certainty, tactical analysis edge, speed-ups | Violates no-P2W. |
| Tradeable paid items/currency | Forbidden | Paid item market, convertible paid currency | Creates laundering path into competitive advantage. |

## No-P2W operational test

Any future SKU or entitlement fails the canon if it can:

1. alter match, squad, staff, finance, transfer, training, fatigue, injury, morale,
   board, fan or scheduling outcomes in a shared context;
2. reveal hidden or probabilistic information earlier or more accurately than non-paying
   competitors;
3. increase competitive attempt volume, recovery pace or time-gate throughput;
4. be traded or converted into competitive resources;
5. move from a paid singleplayer state into shared rankings, async groups, watch-party
   states, exports or comparisons.

## Out of scope for FMX-191

- Payment provider, PSP/MoR, Apple/Google purchase integration and native shell policy.
- Concrete pricing, taxes, refund operations, chargeback handling and withdrawal-waiver copy.
- Product analytics vendor and consent implementation.
- SKU IDs, store copy, UI layout and checkout flow.
- CI/test enforcement implementation of the no-P2W taxonomy. FMX-190 now has
  accepted ADR-0108 as the proposed contract, accepted by Nico 2026-06-19.

## Open Nico decisions

The proposed answer is in
[[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]. Until Nico confirms
or changes D1-D5, [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]]
and [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]]
stay draft/non-binding.
