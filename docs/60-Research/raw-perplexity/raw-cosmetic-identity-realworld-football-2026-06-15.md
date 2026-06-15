---
title: "Raw cosmetic identity real-world football research (FMX-192)"
status: raw
tags: [research, raw, perplexity, cosmetics, identity, branding, football, ip, accessibility, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-192
related:
  - [[../cosmetic-identity-catalog-2026-06-15]]
  - [[raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
---

# Raw cosmetic identity real-world football research (FMX-192)

Perplexity-first discovery pass, captured 2026-06-15. This is raw research
input, not implementation authority.

## Prompt intent

Research how real football clubs construct safe, recognizable identity systems
without relying on protected club IP. Focus on crest/kits/colors, sponsor
layers, accessibility, store review/IP risk and how to translate that into a
fictional football-manager cosmetic catalog.

## Perplexity capture

### Real football identity components

- Football club identity usually works as a system, not one asset: crest,
  primary/secondary colors, home/away kit silhouettes, type/naming voice,
  sponsor placement, stadium/fan visuals and social/profile presentation.
- Color is often the strongest fast-recognition anchor. A fictional game can
  use this by requiring a free base palette and strong contrast guardrails,
  while still avoiding distinctive real-club color/blocking combinations.
- Crest legibility must work across many sizes: square app/profile avatars,
  small tables, match overlays, mobile list rows and printed-style cup/league
  visuals. Fine-line heraldry should be optional detail, not the only readable
  identity cue.
- Football kit identity has repeated generic archetypes: solid shirts,
  vertical stripes, hoops, halves/quarters, sash/diagonal, shoulder panels,
  sleeve accents, pinstripes, gradient/tonal patterns and goalkeeper variants.
  Generic archetypes are safer than reproducing famous club-specific pattern +
  color combinations.
- Sponsor presentation should be treated as a generic layer in a fictional
  world: placeholder marks, invented sponsor categories, placement rules and
  country/league policy flags. Real brands, federation marks, league marks and
  tournament marks should stay outside the base catalog.
- Fan/community identity can use banners, mottos, profile frames and stadium
  dressing, but should avoid political, hate, real tragedy, national-team,
  federation, league and protected-trophy symbols unless a later moderation and
  localization gate exists.

### IP-clean translation

- FMX should inherit [[../../50-Game-Design/GD-0015-ip-clean-data]] and
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  for every cosmetic item: no real club names, crests, player names, sponsor
  marks, federation marks, tournament logos or protected lookalikes.
- The catalog should carry an `ipCleanEvidence` field or equivalent release
  checklist for each family: source is procedural/original, denylist checked,
  similarity checked, no external trademark dependency, no real sponsor or
  league/federation mark.
- Distinctive protected combinations matter. A red shirt is generic; red shirt
  + exact white sleeve layout + nearby crest silhouette + similar name can
  become confusing similarity. Checks must evaluate bundles, not isolated
  colors.
- Community uploads and user-authored marks are a separate future path. MVP
  should use generated/original assets first because moderation, takedown,
  similarity checks and platform policy escalation are not solved by a catalog
  taxonomy alone.

### Accessibility and presentation

- Color-only semantics are unsafe. Kits and palettes need contrast and pattern
  redundancy so a team remains recognizable in match views, tables and mobile
  compact UI.
- WCAG contrast does not perfectly model all sports-kit use, but it gives a
  concrete floor for UI text/badges layered over club colors. Kit readability
  also needs design-system-level tests for home/away clash and color-blind
  distinctness.
- Each unlock should have a plain acquisition reason. If a badge/frame/pattern
  is earned, the catalog should show the achievement source. If it is paid in
  a future approved store, the exact entitlement and persistence should be
  visible before purchase.

## Raw recommendations from discovery

1. Define the catalog as item families plus evidence fields, not as ad hoc UI
   assets.
2. Keep a free baseline club identity in Create-a-Club: name, colors, crest and
   starter kit cannot be monetized.
3. Add IP-clean bundle checks at the family level and again at the generated
   item/bundle level.
4. Treat sponsor marks as fictional/generic presentation layers, not real-world
   licenses.
5. Gate all public/shared identity display through readability, IP-clean and
   moderation/privacy checks.

## Source-check follow-up

Targeted source checks were captured in
[[raw-cosmetic-identity-source-checks-2026-06-15]].

## Related

- [[../cosmetic-identity-catalog-2026-06-15]]
- [[raw-cosmetic-identity-source-checks-2026-06-15]]
- [[../../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../../20-Features/feature-cosmetic-identity-catalog]]
