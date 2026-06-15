---
title: "Raw cosmetic identity source checks (FMX-192)"
status: raw
tags: [research, raw, source-check, cosmetics, identity, monetization, no-p2w, ip, wcag, iarc, usk, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-192
related:
  - [[../cosmetic-identity-catalog-2026-06-15]]
  - [[raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../../20-Features/feature-cosmetic-identity-catalog]]
  - [[../../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
---

# Raw cosmetic identity source checks (FMX-192)

Access date for all web checks: 2026-06-15.

## Source-check table

| Source | Checked fact | Use in packet | Confidence |
|---|---|---|---|
| Hattrick homepage, <https://www.hattrick.org/en-us/> | Hattrick positions itself as a long-term football manager that can be played at the player's pace and states that there is no way to buy in-game advantages. | Positive football-manager precedent for no-P2W, low-pressure management and optional non-power support. | high |
| Hattrick Supporter help, <https://www.hattrick.org/en-us/Help/Supporter/About.aspx> | Supporter includes team designer tools such as kit and logo design, plus profile/theme/stadium and stats/convenience features. | Supports cosmetic identity as a supporter/product layer, but FMX should be stricter than Hattrick on paid information advantage if ADR-0108 is accepted. | high |
| Hattrick Gears help, <https://www.hattrick.org/en-us/Help/Gears.aspx> | Gears exists as a Hattrick customization/identity-related help area, but the page was less useful than the Supporter feature list for concrete product taxonomy. | Link only; not used as a strong source for a decision. | medium |
| Apple App Review Guidelines 3.1.1 and 4.1, <https://developer.apple.com/app-store/review/guidelines/> | Digital feature/content unlocks must use in-app purchase in app-store contexts; loot boxes/randomized virtual items for purchase require odds disclosure; copycats/brand impersonation are prohibited. | Supports store/pricing hook separation, no paid randomness and IP-clean/copycat checks. | high |
| Google Play payments policy, <https://support.google.com/googleplay/android-developer/answer/9858738> | In-app digital goods must generally use Google Play billing; randomized virtual items from purchase require odds disclosure; pricing terms must be clear. | Supports future store/legal handoff fields and no paid random rewards. | high |
| IARC ratings definitions, <https://www.globalratings.com/ratings-definitions/> | IARC definitions include regional rating implications for in-game purchases linked to chance and simulated gambling; interactive elements/descriptors matter. | Supports rating-evidence fields for purchases, random purchases and gambling/pressure absence. | high |
| USK age ratings, <https://usk.de/en/the-usk-age-ratings/> | USK age-rating process and criteria are official German rating context; exact store questionnaire evidence is handled in the existing age/rating packet. | Supports routing store/rating evidence to the existing compliance home. | high |
| WCAG 2.2 contrast minimum, <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html> | WCAG defines text contrast expectations; it is not a sports-kit clash solver but is a concrete UI floor for text/badges over club colors. | Supports catalog `accessibilityEvidence` for UI contrast plus separate kit-clash checks. | high |
| Red Dot, football branding, <https://www.red-dot.org/magazine/branding-in-football> | Football branding is discussed as a broader identity system around crest, colors, emotional recognition and club/community meaning. | Supports the item-family catalog approach rather than treating crests as the only identity asset. | medium |
| GameDeveloper, classifying pay-to-win, <https://www.gamedeveloper.com/business/classifying-pay-to-win-design-in-today-s-market> | Industry article classifies paid advantages and player perception risks; it is secondary, not a binding authority. | Supports "paid information/opportunity can be power" as a product-trust lens, but ADR-0108 remains the FMX decision home. | medium secondary |
| GameMakers, cosmetics monetization interview, <https://www.gamemakers.com/p/mastering-f2p-cosmetics-monetization> | Secondary product article about cosmetics monetization and player expression. | Used only as market-discovery input; not used for legal or platform claims. | low secondary |

## Source-check conclusions

- Hattrick confirms that a football-manager game can publicly promise no paid
  in-game advantage while still offering paid/supporter identity features.
- Hattrick's own Supporter list includes stats/analysis/convenience features,
  so FMX should not treat it as a direct bundle blueprint. FMX's stricter line
  should keep paid information advantage out of shared/competitive surfaces if
  [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  is accepted.
- Apple and Google allow digital purchases through their store systems but both
  surface randomized virtual items as a special disclosure/risk category. FMX
  should avoid paid random rewards entirely rather than merely disclosing odds.
- Store/rating evidence should be prepared now, but prices, SKUs, payment
  rails, refunds and regional commerce remain outside FMX-192.
- IP risk is not limited to exact asset copying; bundles can create confusing
  similarity. The catalog therefore needs IP-clean evidence at both item and
  equipped-bundle level.
- Accessibility needs a dual layer: UI contrast/badge readability plus
  football-specific home/away kit clash checks.

## Related

- [[../cosmetic-identity-catalog-2026-06-15]]
- [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../../20-Features/feature-cosmetic-identity-catalog]]
- [[../../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]

