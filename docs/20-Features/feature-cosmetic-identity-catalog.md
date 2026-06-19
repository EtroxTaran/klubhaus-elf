---
title: Feature - Cosmetic Identity Catalog
status: current
tags: [feature, cosmetics, identity, create-a-club, monetization, no-p2w, fmx-192]
created: 2026-06-15
updated: 2026-06-19
type: feature
binding: true
linear: FMX-192
related:
  - [[README]]
  - [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
---

# Feature - Cosmetic Identity Catalog

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


## Status

current

> Non-binding FMX-192 feature slice. It becomes implementation guidance only if
> Nico accepts or changes the FMX-192 decision queue and promotes the relevant
> scope.

## User story

As a manager creating a fictional club, I want a clear identity catalog for
colors, crest, kits and presentation cosmetics so that my club feels personal
without using real football IP or buying competitive advantage.

## Proposed scope if ratified

In scope:

- Free Create-a-Club baseline identity: generated name suggestion, colors,
  crest and starter home/away kit.
- Item-family catalog for base identity, crest variants, palettes, kit
  patterns, generic sponsor layers, profile frames/banners and later stadium/UI
  presentation skins.
- Acquisition classes for free, earned, supporter/direct cosmetic, season-card
  cosmetic and account service hooks.
- Evidence fields for no-P2W, IP-clean, accessibility/readability,
  visibility scope and store/rating handoff.
- Achievement kit-pattern visibility from
  [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]] as a light,
  mechanically inert async/private-group signal.
- Clear locked/equipped/unavailable/revoked states in future UI planning.

Out of scope:

- Prices, SKUs, payment provider, tax, refunds, withdrawal, native IAP setup,
  commerce UI and entitlement-sync implementation.
- User-uploaded crests/logos/kits.
- Paid random rewards, loot boxes, mystery packs, tradable cosmetics and
  premium currencies.
- Any item that affects match results, economy, fan/media/board state,
  hidden information, scouting certainty, rankings, matchmaking or fixtures.
- Final art volume, generator implementation and code schema names.

## Proposed acceptance criteria

- A new Create-a-Club flow can offer a complete fictional club identity without
  payment.
- The catalog separates item family from acquisition class.
- Every catalog item can declare `mechanicalEffect = none`.
- Every public/shared item has IP-clean and accessibility/readability evidence.
- No paid item is required to create a club, continue a save, join an async
  group or make gameplay progress.
- Achievement patterns remain visibly earned and do not imply a public ranking
  ladder.
- Pricing/legal work can consume categorical hooks without this feature
  deciding prices or commerce rails.

## Proposed Gherkin scenarios

```gherkin
Feature: Cosmetic identity catalog

  Scenario: Create a club with free identity
    Given I start a Create-a-Club Roguelite run
    When I choose a generated club name, colors, crest and starter kit
    Then I can create the club without payment
    And the selected bundle contains no real club, sponsor, player or league marks

  Scenario: Equip an earned kit pattern
    Given I have unlocked an achievement kit pattern
    When I equip it for my club
    Then it has no gameplay, economy or information effect
    And its acquisition source is visible as an earned achievement

  Scenario: Inspect a future paid cosmetic hook
    Given a cosmetic item is tagged as future direct purchase
    When I inspect the catalog row
    Then the item shows its family, visual scope and entitlement class
    But no price or SKU is implied by this current feature

  Scenario: Reject unreadable or unsafe identity display
    Given a kit or crest bundle fails a contrast, kit-clash or IP-clean check
    When the player tries to use it in a shared display
    Then the system blocks shared visibility until the bundle is corrected
```

## Related

- [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
- [[../20-Features/feature-roguelite-mvp-first-playable]]
- [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]

