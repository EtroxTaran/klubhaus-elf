---
title: Source Checks - Investor MP Transition Neutralization
status: raw
tags: [research, source-check, raw, investor, multiplayer, singleplayer, no-p2w, apple, google-play, fmx-189]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-189
related:
  - [[raw-investor-mp-transition-neutralization-2026-06-16]]
  - [[../investor-mp-transition-neutralization-2026-06-16]]
---

# Source Checks - Investor MP Transition Neutralization

## Official / Strong Sources

- Apple App Review Guidelines:
  <https://developer.apple.com/app-store/review/guidelines/#in-app-purchase>
  - In-app purchase items must be complete, visible/reviewable and functional.
  - Metadata must accurately reflect the app experience.
  - Digital features, in-game currency and premium content unlocked in the app
    use IAP on Apple platforms; purchased in-game currencies may not expire.
  - FMX implication: SP-only Investor/time-saving products need explicit
    SP-only wording in store metadata, review notes and in-game purchase copy.
- Google Play Payments:
  <https://support.google.com/googleplay/android-developer/answer/9858738>
  - In-app digital goods, virtual currencies, extra playtime and add-on items
    require Play Billing unless a policy exception applies.
  - Developers must clearly and accurately inform users about terms and pricing.
  - In-app virtual currencies are limited to the app/game title where purchased.
  - FMX implication: product descriptions must not imply MP benefit for an
    SP-only cash/time-saving entitlement.
- Google Play Voided Purchases API:
  <https://developers.google.com/android-publisher/voided-purchases>
  - Voided purchases support revocation systems for refunds, cancellations,
    chargebacks and developer/Google cancellations.
  - Google explicitly recommends fair and transparent revocation policy.
  - FMX implication: refund/revocation can change entitlement state in SP, but
    must never rewrite MP facts because SP entitlements never enter MP.
- Hattrick official soccer-manager page:
  <https://www.hattrick.org/en-us/soccer-manager-game.aspx>
  - Hattrick positions itself as an online manager game with human managers and
    states that paid Supporter tools do not charge for gameplay advantages.
  - FMX implication: online football manager precedent supports fair
    competition monetized through analysis/customization/social tooling rather
    than gameplay power.
- Last Epoch official multiplayer FAQ:
  <https://forum.lastepoch.com/t/official-last-epoch-multiplayer-faq/42036>
  - Multiplayer is server authoritative.
  - Offline characters cannot be played online; offline characters are not
    transferable into the online multiplayer environment.
  - FMX implication: a hard offline/SP vs online/MP state wall is an established
    anti-cheat and fairness pattern.
- Minecraft official add-ons / achievements policy:
  <https://www.minecraft.net/en-us/article/achievements-now-work-with-add-ons>
  - Only Marketplace add-ons qualify for achievements; Mojang cites unfair
    achievement gain as the reason to exclude non-Marketplace mods.
  - FMX implication: official competitive/achievement surfaces can require
    provenance-qualified content and exclude untrusted local modifications.

## Weaker / Pattern-only Inputs

- Football Manager tutorial videos and community posts were not used as source
  authority. They remain pattern-only support for the existence of separate
  online career flows.
- General cosmetic/no-P2W claims from LoL/Dota/Rocket League were not promoted
  because this pass did not source official policy pages. Hattrick is the
  stronger football-manager precedent for the synthesis.

## Canonical Takeaway

FMX should avoid "neutralize imported advantage" as the primary contract. The
cleaner, source-backed rule is:

- multiplayer is a server-created, server-owned state space;
- singleplayer/hotseat/imported/local saves are not eligible as multiplayer
  seeds;
- SP-only paid assistance must be disclosed as SP-only and blocked outside SP;
- refunds/revocations affect SP entitlement state only and cannot mutate MP
  history or standings.
