---
title: "Raw - monetization legal privacy and store policy constraints (FMX-191)"
status: raw
tags: [research, raw, perplexity, monetization, legal, privacy, gdpr, consumer-law, app-store, google-play, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-191
related:
  - [[../monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[raw-monetization-source-checks-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../gdpr-compliance]]
---

# Raw - monetization legal privacy and store policy constraints (FMX-191)

## Research prompt

Perplexity was asked to identify legal, privacy and store-policy constraints for
monetizing a Germany/EU-rooted football-manager PWA/game with possible app-store
shells later. The prompt focused on deterministic cosmetics, memberships, season
passes, paid digital goods, subscriptions, virtual currency, loot/random rewards,
consumer-law withdrawal rights, GDPR/ePrivacy, App Store / Google Play policy
families and age-rating descriptors.

## Key findings

- EU/German consumer law creates strong disclosure requirements for digital purchases:
  total price, payment obligation wording, subscription duration/renewal/cancellation,
  and the conditions for digital-content delivery before the withdrawal period ends.
- Instant digital delivery should not rely on informal copy. It needs an explicit
  consent/acknowledgement flow and durable proof if the legal team wants waiver of
  withdrawal rights.
- Paid random rewards/loot boxes add avoidable risk: odds disclosures, store
  descriptors, youth-protection sensitivity, consumer-protection review and possible
  country-specific treatment. Deterministic cosmetic SKUs are much safer.
- Apple and Google generally require platform in-app purchase for digital goods in
  native app builds. A browser PWA can use a PSP/MoR pattern, but vendor selection and
  checkout design are outside FMX-191 and should be handled in FMX-194.
- Ratings and storefront disclosure should expect an "in-game purchases" descriptor.
  A "random items" descriptor should be avoidable if FMX bans paid random rewards.
- GDPR/ePrivacy posture should minimize purchase and telemetry data. Required purchase
  records can use contract/legal-obligation bases; non-essential analytics,
  advertising identifiers and marketing need consent where applicable.
- Store only what is needed for entitlement and audit: account/user id, SKU,
  transaction/provider reference, price/currency/tax fields where required, status,
  timestamps, refund/revocation references and legal-consent evidence. Do not store
  card details.
- Dark-pattern risk is a product-design issue, not just legal copy. Avoid misleading
  scarcity, hidden subscription renewal, opt-out consent, manipulative countdowns,
  hard-to-cancel flows and pressure loops.

## Legal-review gates named by the raw answer

- Terms/EULA and store listing claims for "no pay-to-win".
- Withdrawal waiver / immediate-digital-delivery wording and proof.
- Pay button copy and price display, including taxes where required.
- Subscription/membership renewal and cancellation mechanics.
- Battle/season-pass timing, expiry and refund wording if selected.
- Privacy notice, consent model, retention policy and processor/data-transfer review.
- Age-rating/IARC/USK descriptor choices.
- Any future virtual currency, loot/random reward or advertising model.

## Source trail

- Perplexity research pass, 2026-06-13: legal/privacy/store policy constraints
  for game monetization in EU/Germany plus app-store shells.
- Your Europe, online data protection and privacy:
  <https://europa.eu/youreurope/citizens/consumers/internet-telecoms/data-protection-online-privacy/index_en.htm>
- GDPR.eu, GDPR overview:
  <https://gdpr.eu/what-is-gdpr/>
- Game Developer, digital games and European consumer-protection laws:
  <https://www.gamedeveloper.com/business/apps-and-digital-games-complying-with-the-new-consumer-protection-laws-in-europe>
- DLA Piper Data Protection Laws of the World, Germany:
  <https://www.dlapiperdataprotection.com/index.html?t=law&c=DE>
- Pandectes, GDPR in Germany overview:
  <https://pandectes.io/blog/gdpr-in-germany-what-you-need-to-know-in-2022/>
- European Law Blog, consumer/digital market law discussion:
  <https://www.europeanlawblog.eu/pub/x99vfpdg>

## Source-quality note

This note is not legal advice. FMX-191 should only set the product/game-design
boundary. FMX-194 or a legal/vendor beat must verify the current policy text and
country requirements before implementation.
