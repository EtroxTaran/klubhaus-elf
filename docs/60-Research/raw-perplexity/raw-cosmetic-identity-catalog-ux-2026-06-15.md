---
title: "Raw cosmetic identity catalog UX and data model research (FMX-192)"
status: raw
tags: [research, raw, perplexity, cosmetics, catalog, ux, entitlement, accessibility, no-p2w, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-192
related:
  - [[../cosmetic-identity-catalog-2026-06-15]]
  - [[raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../../20-Features/feature-cosmetic-identity-catalog]]
  - [[../../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
---

# Raw cosmetic identity catalog UX and data model research (FMX-192)

Perplexity-first discovery pass, captured 2026-06-15. This is raw research
input, not implementation authority.

## Prompt intent

Research best practices for structuring a cosmetic identity catalog in a
football-manager game: item taxonomy, entitlement metadata, UX states,
accessibility, transparent acquisition, pricing hooks and future SKU readiness
without making pricing decisions.

## Perplexity capture

### Catalog shape

- The catalog should distinguish **item family** from **acquisition class**.
  Example: a kit pattern can be base/free, achievement-earned, supporter,
  direct purchase or later season-card content. The item family stays the same;
  acquisition rules and evidence differ.
- Catalog rows should be small and auditable. Recommended fields:
  `itemFamily`, `displayNameKey`, `assetOrGeneratorRef`, `acquisitionClass`,
  `entitlementClass`, `visibilityScope`, `mechanicalEffect`, `tradeability`,
  `ipCleanEvidence`, `accessibilityEvidence`, `ratingEvidence`,
  `pricingHook`, `seasonalPolicy`, `ageStoreReviewNotes`.
- `mechanicalEffect` should be constrained to `none` for every cosmetic item.
  If a future item needs a gameplay effect, it is no longer a cosmetic item and
  must go through a different decision path.
- `tradeability` should default to `not_tradeable`. Gifting, resale, market
  listings and scarcity pricing need separate legal/economy review.
- Rarity labels, if used, should not imply hidden odds. Favor neutral labels
  like `base`, `earned`, `premium`, `legacy`, `seasonal` over gacha-like
  rarity classes in the MVP.

### UX states

- The catalog needs clear states: available, equipped, locked-earned,
  locked-purchasable-later, unsupported-by-current-save, revoked/refunded,
  unavailable-due-to-age/store region and archived.
- The player should always be able to inspect the exact acquisition route
  before taking action.
- No paid item should be presented as required to create a club, continue a
  save, participate in an async group or make progress.
- Identity selection should handle home/away clash, color-blind readability,
  small-size crest legibility and UI text contrast before a look can be saved
  or shown publicly.

### Pricing and entitlement hooks

- FMX-192 should not decide prices, SKUs, payment provider, tax, refund logic or
  store implementation. It should prepare clean fields that future pricing/legal
  records can consume.
- Pricing hooks should be categorical, not numeric: `free_core`,
  `earned_gameplay`, `supporter_cosmetic`, `direct_cosmetic_iap`,
  `season_card_cosmetic`, `account_service`.
- Entitlements should persist at account level only where appropriate. Per-save
  identity choices need save-level application records so future exports,
  async groups and public displays can prove what is actually equipped without
  turning cosmetics into authoritative match state.

### Compliance and trust

- Store policies generally permit paid digital cosmetics through the platform's
  billing system for native app distribution, but pricing, refund, withdrawal
  and rating evidence are separate decisions.
- Apple and Google both require odds disclosure if randomized virtual items are
  sold. FMX should not rely on odds disclosure because the recommended product
  posture is no paid random rewards.
- IARC/USK evidence should record: in-game purchases, randomized purchases
  absent/present, online interaction, user-generated content/upload absence or
  moderation path, pressure to buy/play and paid content descriptors.

## Raw recommendation from discovery

Create a draft GDDR with a narrow item-family taxonomy plus acquisition/entitle-
ment evidence hooks. Do not create a pricing table. Require a free baseline
identity and force every cosmetic row to prove `mechanicalEffect = none`,
`tradeability = none`, IP-clean evidence and accessibility evidence.

## Related

- [[../cosmetic-identity-catalog-2026-06-15]]
- [[raw-cosmetic-identity-source-checks-2026-06-15]]
- [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../../20-Features/feature-cosmetic-identity-catalog]]

