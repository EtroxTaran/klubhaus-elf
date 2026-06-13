---
title: "Raw - monetization model market and game precedents (FMX-191)"
status: raw
tags: [research, raw, perplexity, monetization, pricing, cosmetics, subscription, season-pass, no-p2w, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-191
related:
  - [[../monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
---

# Raw - monetization model market and game precedents (FMX-191)

## Research prompt

Perplexity was asked to compare 2026 game monetization models for an offline-ready
football-manager PWA with future multiplayer/private-group play. The prompt asked for
real-world and game precedents, specifically: one-time premium, free-to-play plus
cosmetics, optional supporter/membership subscription, season/battle pass, ads, and
hybrids. The research was asked to classify fit for a no-pay-to-win football-manager
game and to highlight precedents from Football Manager, Hattrick, Top Eleven, Online
Soccer Manager and related sports-manager games.

## Key findings

- The strongest no-P2W fit is a **restrained hybrid**: free core access, cosmetics-only
  IAP, and an optional "Supporter Club" membership for non-power quality-of-life,
  social, history and presentation features.
- A later light season card can work only if it is cosmetic-only and the project has
  enough content cadence to avoid filler rewards or grind pressure.
- A one-time premium model has high trust with the PC football-manager audience, but it
  creates a barrier for an unknown PWA/mobile-first product and does not solve recurring
  service costs.
- F2P with paid power, paid speed-ups or paid squad resources is common in mobile sports
  managers, but the genre community often reads it as pay-to-win and unfair in shared
  competition.
- Supporter-style memberships are the best genre precedent: Hattrick's Supporter model
  is built around appearance, history, convenience and club identity, while the core
  competitive game remains free.
- Football Manager's trust pattern is premium/annual, not microtransaction-driven. That
  is useful as a trust benchmark even if FMX selects a PWA-friendly business model.
- Ads are a poor MVP fit for a serious football-manager UX. If ever considered, they
  should be explicit, optional, reward only cosmetic/convenience value and require a
  separate decision because privacy, ratings and UX costs are high.

## Option comparison from the raw answer

| Model | Strength | Main risk | FMX fit |
|---|---|---|---|
| One-time premium | Clear trust promise; no IAP suspicion | Weak PWA/mobile acquisition; no recurring revenue for service costs | Possible later bundle, not recommended as launch default |
| F2P + cosmetics | Low entry barrier; strongest fairness stance | Needs constant visual/content pipeline | Strong launch fit |
| Supporter subscription | Predictable recurring revenue; good Hattrick-style precedent | Can become pay-to-win if analytics/info is too strong | Strong if QoL/history/presentation only |
| Season/battle pass | Retention and content cadence | FOMO, grind, power rewards, dark-pattern risk | Later-only, cosmetic-only |
| Ads | Monetizes non-payers | Disruptive; privacy and ratings overhead | Avoid for MVP |
| F2P + paid power | High short-term ARPU | Community backlash and unfair MP | Reject |

## Source trail

- Perplexity research pass, 2026-06-13: game monetization models and sports-manager
  precedent for FMX.
- OpenForge, mobile game monetization strategies:
  <https://openforge.io/mobile-game-monetization-strategies/>
- Adapty, mobile game monetization overview:
  <https://adapty.io/blog/mobile-game-monetization/>
- HubApps, mobile game monetization:
  <https://hubapps.team/blog/mobile-game-monetization>
- Hitem3D, game monetization strategies:
  <https://www.hitem3d.ai/blog/Game-Monetization-Strategies-How-to-Make-Money-from-Your-Game-in-2026/>
- WiseGuyReports, online football games market overview:
  <https://www.wiseguyreports.com/reports/online-football-games-market>
- Hattrick Wiki, Hattrick Supporter:
  <https://wiki.hattrick.org/wiki/The_New_Hattrick_Supporter>

## Source-quality note

The Perplexity answer also surfaced weak/community sources such as videos, social
posts and forum fragments. Those are useful for sentiment only, not for binding
FMX policy. The synthesis therefore treats official stores/legal pages and visible
genre models as stronger evidence than community claims.

## Notes for synthesis

The market answer supports a no-P2W **model-level canon** rather than provider or
checkout details. Vendor, refund workflow, age gate and tax handling remain separate
FMX-194/legal work.
