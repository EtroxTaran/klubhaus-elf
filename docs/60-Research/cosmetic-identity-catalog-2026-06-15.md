---
title: "Cosmetic identity catalog (FMX-192)"
status: current
tags: [research, synthesis, cosmetics, identity, monetization, no-p2w, ip-clean, accessibility, fmx-192]
context: audit-security
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-192
related:
  - [[raw-perplexity/raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[raw-perplexity/raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[raw-perplexity/raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[raw-perplexity/raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../20-Features/feature-cosmetic-identity-catalog]]
  - [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../40-Compliance/responsible-gaming]]
---

# Cosmetic identity catalog (FMX-192)

## Scope

FMX-192 preserves the accepted cosmetic identity catalog for
Create-a-Club, roguelite achievement identity and later non-power monetization.
It does not ratify prices, SKUs, payment providers, commerce integrations,
season-card cadence or a paid store.

Draft decision homes:

- [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../20-Features/feature-cosmetic-identity-catalog]]
- [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]

## Evidence synthesis

### Real-world football identity

Real football identity is a bundle: crest, palette, kit silhouette, typography
voice, sponsor placement, stadium/fan visuals and social/profile display work
together. FMX should therefore define item families and equipped bundles rather
than treating the crest as the only identity object.

The IP-clean risk is also bundle-level. A single color or stripe pattern can be
generic, while a near-real combination of name, color blocking, crest shape,
sponsor position and kit layout can become confusingly similar. FMX should keep
the base catalog original/procedural and require denylist/similarity evidence
for public/shared identity display.

### Comparable games

Hattrick is the strongest direct precedent: it publicly presents a
no-in-game-advantage football-manager posture while offering optional Supporter
customization. The useful FMX lesson is narrow: paid/supporter identity can be
accepted by a long-running football-manager audience only when it does not
create power, information, opportunity or pressure advantage.

The counter-pattern is mobile/live-service sports management with premium
currencies, random packs, paid boosts, event pressure and scarcity loops. FMX's
recommended catalog should avoid those patterns entirely: no paid random
rewards, no tradeable cosmetics, no paid information and no paid extra attempts.

### Store, rating and accessibility posture

Apple and Google both route in-app digital unlocks through platform billing in
native app contexts and both call out randomized virtual items for odds
disclosure. IARC/USK evidence also needs purchase/randomness/pressure fields.
FMX-192 should prepare evidence hooks, not decide commerce.

WCAG contrast gives a concrete UI floor, but club identity also needs
football-specific clash checks: home/away recognizability, color-blind
redundancy, small crest legibility and safe text/badge overlays.

## Recommended packet

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 record shape | **A. Draft GD-0045 + draft feature note; no new ADR yet** | This is primarily product/game-design taxonomy. ADR-0107/0108/0122 already cover pricing/no-P2W/responsible-gaming boundaries. |
| D2 baseline identity | **A. Free baseline identity required** | Create-a-Club fantasy requires name, colors, crest and starter kit without payment. |
| D3 item families | **A. Narrow launch catalog plus later hooks** | Base identity, crest variants, palettes, kit patterns, generic sponsor layers, profile frames/banners, stadium/UI skins and later season-card sets cover the need without overcommitting. |
| D4 monetization guardrail | **A. Deterministic, non-tradeable, no paid power/no RNG** | Matches FMX-191/190/193 draft guardrails and avoids rating/trust risk. |
| D5 async visibility | **A. Light, inert, evidence-gated visibility** | Preserves GD-0044 achievement-kit allowance while preventing cosmetics from becoming ranking, power or privacy leaks. |
| D6 IP/accessibility evidence | **A. Item and bundle evidence required** | Real risk is confusing similarity and unreadable matches, not only exact asset copying. |
| D7 season-card timing | **A. Later only, cosmetic-only, deterministic and non-expiring/rerunnable by default** | Prevents launch scope creep and hard FOMO pressure. |

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

## Accepted catalog invariants

Nico accepted these invariants on 2026-06-19:

- Free baseline identity is part of Create-a-Club and cannot be paywalled.
- Every cosmetic item has `mechanicalEffect = none`.
- Cosmetics do not alter match results, economy, fan/media/board state,
  hidden information, scouting certainty, ranking, matchmaking, fixture
  eligibility, async group state or official comparison surfaces.
- Paid random rewards, loot boxes, mystery packs, draw/wheel/chest reveal UI,
  paid tradeability and premium currencies convertible to competitive value are
  forbidden for this catalog.
- Every public/shared cosmetic display needs IP-clean evidence,
  accessibility/readability evidence and a visibility scope.
- Achievement cosmetics remain feat-bound unless Nico explicitly approves a
  separate purchasable variant.
- Pricing hooks are categorical only; exact price/SKU/provider/refund decisions
  stay with ADR-0107/ADR-0109/future commerce work.

## Proposed item families

| Family | Examples | Default acquisition | Persistence | Visibility | Guardrails |
|---|---|---|---|---|---|
| `base_identity` | club name, base palette, starter crest, starter home/away kit | free core | per save plus account defaults where useful | private, screenshots, future shared display | must be available without payment; inherits GD-0015/ADR-0007 |
| `crest_variant` | generated shield shapes, symbols, trims, legacy marks | free base + earned; paid advanced only if approved later | account entitlement plus per-save equip | profile, tables, match overlays | no real marks; small-size legibility; bundle similarity check |
| `palette` | primary/secondary/accent color sets | free base + earned; paid advanced only if approved later | account entitlement plus per-save equip | all identity surfaces | UI contrast and kit-clash checks |
| `kit_pattern` | solid, stripes, hoops, halves, sash, shoulder/sleeve details | starter free; achievement patterns first; paid generic variants only if approved later | account entitlement plus per-save equip | match view, async/private groups if gated | mechanically inert; no protected lookalike bundles; GD-0044 for achievement visibility |
| `generic_sponsor_layer` | fictional sponsor panel, invented mark categories | earned/later only | per save plus generated sponsor contract context when relevant | kit/profile if enabled | no real brands; no sponsor effect; may be disabled in youth/rating contexts |
| `profile_frame_banner` | manager/club frame, banner, badge strip | earned/supporter/direct cosmetic if approved | account entitlement | profile/social/private group | no ranking implication; no paid power/status ladder |
| `stadium_visual_ui_theme` | stadium dressing, club page theme, UI accent skin | later/supporter/direct cosmetic if approved | account entitlement plus per-save equip | presentation only | no capacity/revenue/fan effect; contrast evidence required |
| `season_card_cosmetic_set` | themed kit/crest/frame set | later only after commerce/rating approval | account entitlement | presentation only | deterministic, non-tradeable, cosmetic-only, no hard FOMO by default |

## Pricing handoff fields

Future pricing/legal work can consume these non-numeric fields:

- `acquisitionClass`: `free_core`, `earned_gameplay`,
  `supporter_cosmetic`, `direct_cosmetic_iap`, `season_card_cosmetic`,
  `account_service`.
- `entitlementClass`: account entitlement, per-save equip, service action,
  archived/revoked/refunded.
- `visibilityScope`: private only, profile, match overlay, async private group,
  future public showcase.
- `evidence`: no-P2W, IP-clean, accessibility, store/rating, refund/revocation,
  localization/moderation.
- `seasonalPolicy`: evergreen, archived but owned, rerunnable, limited and
  dated, unavailable. Default recommendation is evergreen/rerunnable.

## Open risks

- Exact prices, SKUs, tax, refund, withdrawal and payment rails stay outside
  FMX-192.
- User-uploaded logos/kits remain future work because moderation, takedown,
  similarity and platform policy evidence are not solved by this catalog.
- Exact art volume, generation pipeline and schema names remain code-phase
  design work.
- Season-card cadence should not be decided until content cadence and
  responsible-gaming/store evidence exist.

## Related

- [[raw-perplexity/raw-cosmetic-identity-realworld-football-2026-06-15]]
- [[raw-perplexity/raw-cosmetic-identity-game-precedents-2026-06-15]]
- [[raw-perplexity/raw-cosmetic-identity-catalog-ux-2026-06-15]]
- [[raw-perplexity/raw-cosmetic-identity-source-checks-2026-06-15]]
- [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../20-Features/feature-cosmetic-identity-catalog]]
- [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
