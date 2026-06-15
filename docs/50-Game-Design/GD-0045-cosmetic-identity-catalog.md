---
title: GD-0045 Cosmetic Identity Catalog
status: draft
tags: [game-design, gddr, cosmetics, identity, monetization, no-p2w, create-a-club, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: gddr
binding: false
linear: FMX-192
related:
  - [[README]]
  - [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../20-Features/feature-cosmetic-identity-catalog]]
  - [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]]
  - [[GD-0015-ip-clean-data]]
  - [[GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
---

# GD-0045: Cosmetic Identity Catalog

## Status

draft

> **Decision gate.** This GDDR is a non-binding FMX-192 proposal until Nico
> accepts or changes D1-D7 in
> [[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]].
> It must not be treated as implementation authority.

## Context

Create-a-Club needs a satisfying free club identity: fictional name, colors,
crest and starter kit. FMX-191, FMX-190 and FMX-193 also need a concrete
cosmetic catalog boundary so later monetization cannot drift into paid power,
paid information or coercive pressure.

This GDDR defines the proposed product/game-design catalog. It does not decide
prices, SKUs, payment provider, refund/withdrawal logic, commerce routing or
final season-card cadence.

## Proposed decision if ratified

FMX's cosmetic identity promise is:

> Club identity can express who you are. It never helps you win.

If ratified:

- Create-a-Club always includes a free baseline identity.
- Cosmetics are deterministic, non-tradeable and mechanically inert.
- Every cosmetic item and equipped identity bundle carries IP-clean and
  accessibility/readability evidence.
- Paid/supporter/season-card cosmetics, if later approved, are advanced visual
  variants only.
- Achievement cosmetics remain earned markers, not purchasable power or public
  ranking systems.

## Proposed item taxonomy

| Family | Examples | Default acquisition | Persistence | Visibility | Guardrails |
|---|---|---|---|---|---|
| `base_identity` | club name, base palette, starter crest, starter home/away kit | free core | per save; optional account defaults | private/shared display where allowed | cannot be paywalled; GD-0015/ADR-0007 |
| `crest_variant` | shapes, trims, symbols, legacy marks | free base + earned; advanced paid only after approval | account entitlement + per-save equip | profile, lists, overlays | no real/protected marks; small-size legibility |
| `palette` | primary, secondary and accent sets | free base + earned; advanced paid only after approval | account entitlement + per-save equip | all identity surfaces | contrast, color-blind and kit-clash checks |
| `kit_pattern` | solid, stripes, hoops, halves, sash, shoulders, sleeves | starter free; achievement first | account entitlement + per-save equip | match view and gated async display | mechanically inert; no protected lookalike bundles |
| `generic_sponsor_layer` | fictional sponsor marks, panel placements | earned/later only | per save | optional kit/profile display | no real brands; no sponsor/economy effect |
| `profile_frame_banner` | club profile frame, banner, badge strip | earned/supporter/direct cosmetic if approved | account entitlement | profile/social/private groups | no rank or status-power implication |
| `stadium_visual_ui_theme` | stadium dressing, club page theme, UI accent skin | later/supporter/direct cosmetic if approved | account entitlement + per-save equip | presentation only | no stadium/fan/economy effect |
| `season_card_cosmetic_set` | themed crest/kit/frame set | later only | account entitlement | presentation only | deterministic, cosmetic-only, non-tradeable, no hard FOMO by default |

## Proposed acquisition classes

| Class | Meaning | Rule |
|---|---|---|
| `free_core` | Required for Create-a-Club and core play | Must be sufficient and satisfying without payment. |
| `earned_gameplay` | Unlocked by achievements, run milestones or challenges | Must be deterministic and inspectable. |
| `supporter_cosmetic` | Optional supporter/member expression | Must not include paid information, automation or opportunity advantage. |
| `direct_cosmetic_iap` | Optional direct cosmetic purchase after commerce approval | Exact entitlement visible before purchase; no random outcome. |
| `season_card_cosmetic` | Later deterministic cosmetic set | No paid power, no paid information, no hard FOMO by default. |
| `account_service` | Rename/reset/service action | No rank, reward, fixture, economy, squad or matchmaking effect. |

## Proposed hard constraints

- `mechanicalEffect` is always `none` for catalog cosmetics.
- Cosmetics do not affect match outcomes, economy, board confidence, fan mood,
  media sentiment, hidden information, scouting certainty, rankings,
  matchmaking, fixture eligibility, async group state or official comparisons.
- Paid random rewards, mystery packs, loot boxes, draw/wheel/chest UI, paid
  tradeability and paid currencies convertible into competitive resources are
  outside this catalog.
- Every shared/visible item needs `visibilityScope`, IP-clean evidence and
  accessibility/readability evidence.
- Real club names, player names, sponsors, league/federation marks, trophies,
  protected kit combinations and confusingly similar identity bundles remain
  forbidden under [[GD-0015-ip-clean-data]] and
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]].
- Achievement kit patterns visible in async private groups must follow
  [[GD-0044-create-a-club-roguelite-run-tuning]]: mechanically inert,
  feat-bound, fiction-safe, light-badged and privacy-safe.

## Pricing and legal handoff

FMX-192 only prepares categorical hooks:

- acquisition class;
- entitlement class;
- item family;
- visibility scope;
- seasonal policy;
- IP/accessibility/no-P2W/rating evidence.

Exact price, SKU, payment method, store billing, tax, refund, withdrawal,
revocation, entitlement sync and region rules remain out of scope and must be
handled by accepted commerce/legal records.

## Open Nico decisions

Approve or change D1-D7 in
[[../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15]].
Recommended packet: **A/A/A/A/A/A/A**.

## Related

- [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
- [[../20-Features/feature-cosmetic-identity-catalog]]
- [[GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[GD-0044-create-a-club-roguelite-run-tuning]]
- [[GD-0015-ip-clean-data]]
- [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
