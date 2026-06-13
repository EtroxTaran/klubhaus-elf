---
title: "Raw - no-P2W legal and store policy checks (FMX-190)"
status: raw
tags: [research, raw, perplexity, legal, store-policy, monetization, no-p2w, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-190
related:
  - [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
---

# Raw - no-P2W legal and store policy checks (FMX-190)

## Research prompt

Perplexity was asked for non-legal product guidance on legal/store/consumer
considerations for making and enforcing a no-pay-to-win claim in a football
manager game with in-app purchases. Firecrawl then checked current official
source pages for app-store and EU consumer-policy anchors.

This note is not legal advice. It is source capture for product/architecture
planning. Provider, refund, age-gate, tax and final legal wording remain FMX-194.

## Perplexity findings

- A no-P2W claim is a consumer-facing product promise. It should be objectively
  true, unambiguous and not contradicted by paid progression, paid performance,
  paid hidden information or pressure-driven purchase flows.
- Store copy should separate core competition from monetization and avoid
  over-promising before the enforcement gate exists.
- Paid random performance rewards are the worst fit for a strict no-P2W football
  manager because they combine fairness, odds disclosure, consumer-protection and
  rating concerns.
- Dark-pattern/FOMO mechanics undermine the credibility of a fairness promise,
  especially when tied to match-critical timing or post-loss offers.
- Detailed provider/legal decisions should remain centralized in FMX-194 so
  product-design notes do not become stale legal advice.

## Official source checks

Apple App Review Guidelines, checked 2026-06-13:

- Section 3.1.1 requires app features/functionality unlocked in-app to use
  in-app purchase where Apple's rules apply.
- Section 3.1.1(e) requires apps offering loot boxes or other purchased
  randomized virtual items to disclose odds before purchase.
- Section 3.1.2 covers auto-renewable subscriptions.
- Source: <https://developer.apple.com/app-store/review/guidelines/>

Google Play payments policy, checked 2026-06-13:

- Google Play-distributed apps must use Google Play Billing for in-app purchases
  of digital goods unless a listed exception or eligible alternative-billing
  program applies.
- The policy covers virtual currencies, subscriptions, app functionality and
  digital content.
- Pricing must be clearly disclosed and randomized-item/loot-box odds must be
  disclosed before purchase.
- Source: <https://support.google.com/googleplay/android-developer/answer/9858738?hl=en>

EUR-Lex Consumer Rights Directive summary, checked 2026-06-13:

- Traders must provide clear pre-contractual information, including main product
  characteristics, payment terms and termination conditions.
- Distance/digital contracts are in scope; withdrawal-right information matters.
- Additional paid services require consumer consent.
- Source:
  <https://eur-lex.europa.eu/EN/legal-content/summary/consumer-information-right-of-withdrawal-and-other-consumer-rights.html>

European Commission sweeps page, checked 2026-06-13:

- The Commission describes dark-pattern sweeps covering websites and apps.
- The 2022 sweep found pressure-selling techniques, drip pricing, hidden
  important information and subscription manipulation patterns.
- Source:
  <https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/sweeps_en>

## Notes for synthesis

FMX-190 should not decide provider, refund, withdrawal or age-gate details. It
should only say the no-P2W invariant is a factual promise that all future store,
SKU, telemetry and legal work must preserve; FMX-194 remains the legal-gates
home for implementation.

## Related

- [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
