---
title: "Raw - monetization official source checks (FMX-191)"
status: raw
tags: [research, raw, source-check, monetization, legal, app-store, consumer-law, ratings, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-191
related:
  - [[../monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[raw-monetization-legal-privacy-store-policy-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
---

# Raw - monetization official source checks (FMX-191)

## Scope

This note preserves the targeted source checks run after the Perplexity research.
The goal was not to complete legal implementation, but to verify that FMX-191's
model-level recommendations avoid obvious store, ratings and consumer-law traps.

## Checked sources

| Source | Result for FMX-191 |
|---|---|
| Apple App Review Guidelines, official developer page: <https://developer.apple.com/app-store/review/guidelines/> | Digital-goods app builds need current App Store policy review before implementation. Apple guidance explicitly covers in-app purchase families and paid random-item disclosure. FMX-191 should avoid paid random rewards and defer provider mechanics to FMX-194. |
| EU consumer-rights summary, official EUR-Lex page: <https://eur-lex.europa.eu/EN/legal-content/summary/consumer-information-right-of-withdrawal-and-other-consumer-rights.html> | Confirms consumer-information / withdrawal-right surface for distance contracts and digital content. FMX-191 should require legal review for price display, withdrawal waiver and pay-button copy. |
| USK age ratings, official USK page: <https://usk.de/en/the-usk-age-ratings/> | Confirms USK as a relevant German age-rating surface. FMX-191 should assume in-game-purchase descriptors and avoid paid random items to keep rating/store disclosure simpler. |
| Hattrick Supporter wiki: <https://wiki.hattrick.org/wiki/The_New_Hattrick_Supporter> | Useful genre precedent for supporter-style non-power membership: presentation, history, identity and convenience rather than paid match power. |

## Weak or incomplete checks

- Google Play source-check search returned mostly secondary pages in this beat. Before
  any Android/native shell or Play Billing implementation, FMX-194 must verify the
  current Google Play Developer Policy Center and Play Billing requirements directly.
- DSA/dark-pattern checks surfaced EU policy-analysis material, but not a complete
  implementation-ready source trail. FMX-191 can still encode "avoid deceptive/FOMO
  monetization patterns" as a product principle; legal copy and compliance controls
  remain FMX-194/legal review.

## Notes for synthesis

The official checks support a conservative canon:

- deterministic paid cosmetics and supporter QoL are lower risk than paid random
  rewards, paid power or ad-driven monetization;
- legal/provider implementation details stay out of FMX-191;
- the no-P2W claim needs contract tests later, not just marketing copy.
