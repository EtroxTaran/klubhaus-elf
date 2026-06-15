---
title: "Raw cosmetic identity game precedents (FMX-192)"
status: raw
tags: [research, raw, perplexity, cosmetics, monetization, no-p2w, football-manager, games, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-192
related:
  - [[../cosmetic-identity-catalog-2026-06-15]]
  - [[raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
---

# Raw cosmetic identity game precedents (FMX-192)

Perplexity-first discovery pass, captured 2026-06-15. This is raw research
input, not implementation authority.

## Prompt intent

Research comparable football-manager and live-service game precedents for
cosmetic identity catalogs, supporter memberships, no-pay-to-win boundaries,
paid cosmetics, battle/season cards and player trust risks.

## Perplexity capture

### Positive precedent: low-pressure football management

- Hattrick is the strongest direct football-manager precedent for FMX's desired
  trust posture: long-term management, no daily-currency pressure and a public
  no-in-game-advantage claim.
- Hattrick Supporter also shows that club identity tools can sit in a supporter
  product. However, its feature list includes analysis/statistics/convenience
  tools. FMX should be stricter than that if [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  is later approved, because paid information advantage is part of the proposed
  forbidden-power class.
- The useful precedent is therefore not "copy Hattrick's whole Supporter
  bundle"; it is "cosmetic club identity can be paid or member-enhanced if
  competitive opportunity and information parity remain intact."

### Negative precedent: pressure loops and paid randomness

- Football-manager mobile/live-service precedents show a common monetization
  pattern that FMX should avoid: random item packs, premium currency, season
  event pressure, boost-like player/team improvements and daily engagement
  loops.
- Paid random rewards are especially misaligned with FMX's PM-18 findings and
  draft responsible-gaming posture. Even where stores allow randomized virtual
  items with odds disclosure, FMX's recommended posture remains "do not ship
  them".
- Tradeability is a multiplier risk. If paid cosmetic items become tradable,
  scarcity can create market value and social pressure even when the original
  item is visually inert. FMX should keep cosmetic unlocks non-tradeable unless
  a future separate market/economy review exists.

### Cosmetics best practice

- Good cosmetic catalogs keep the base identity free and satisfying, then sell
  variety, expression, depth and collection goals without harming gameplay.
- Earned cosmetics should remain meaningful. If the same prestige item family
  is sold directly, achievement visibility can be diluted. FMX should split
  "achievement-marked" patterns/frames from generic cosmetic variants.
- Rarity should be metadata for organization and player excitement, not a
  gambling-like odds promise. Avoid "pack opening", wheel, chest, draw, mystery
  or reveal theatrics.
- Season cards are safest when they are deterministic, cosmetic-only,
  non-expiring or rerunnable, with no paid power, no paid information, no
  competitive attempt volume and no hard fear-of-missing-out pressure.

### FMX implications

- Free baseline identity is part of the core Create-a-Club fantasy and must not
  be gated.
- Paid or Supporter identity may be considered later for advanced variants,
  extra preset slots, profile decoration, stadium presentation skins or
  broader kit/crest editor options, but only after the monetization/legal
  packets are accepted.
- Achievement kit patterns from
  [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]] should
  stay feat-bound and light-badged. They should not become a public rank ladder
  or purchasable power signal.

## Raw recommendation from discovery

Use deterministic, non-tradeable, mechanically inert cosmetic unlocks only.
Keep the launch catalog built around free baseline identity plus earned
achievement cosmetics. Treat paid advanced cosmetics and any season card as
decision-pending later product layers, not MVP commitments.

## Source-check follow-up

Targeted source checks were captured in
[[raw-cosmetic-identity-source-checks-2026-06-15]].

## Related

- [[../cosmetic-identity-catalog-2026-06-15]]
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
- [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]

