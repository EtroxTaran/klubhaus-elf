---
title: "Raw - football-manager monetization precedents (FMX-190)"
status: raw
tags: [research, raw, perplexity, monetization, football-manager, no-p2w, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-190
related:
  - [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
---

# Raw - football-manager monetization precedents (FMX-190)

## Research prompt

Perplexity was asked to compare football-manager and sports-management game
monetization precedents for a strict no-P2W football-manager PWA, including
Hattrick-style supporter subscriptions, Top Eleven, OSM, Football Manager and
similar games.

## Key findings

- Supporter-style subscriptions are the strongest genre precedent when they fund
  identity, history, community and UI value without affecting team strength.
- Top Eleven-style tokens and boosters are a warning case: paid auction leverage,
  condition recovery, injury healing, morale support, training frequency or
  progression acceleration are read by players as pay-advantaged or pay-to-win.
- OSM-style premium currency around scout usage, timer acceleration or repeated
  preparation actions creates the same problem in a football-manager shape:
  recruitment knowledge and opportunity volume are competitive power.
- Premium Football Manager products are perceived as fair because competitive
  mechanics are included in the paid product and not sold again as power boosts.
- For FMX, cosmetics and supporter identity/status are safe only when they do not
  become match readability, fan/media pressure, reputation, ranking, economy,
  scouting or tactical advantage.

## Accepted vs rejected patterns

Generally safe if guarded:

- club identity cosmetics: kits, crests, banners, profile frames, stadium looks;
- supporter badges and profile/social presentation;
- history/replay/archive convenience that does not reveal hidden state;
- non-ranked sandbox/editor-style extras that cannot enter shared comparisons.

High-risk / reject for strict no-P2W:

- premium currency for transfers, scouting, training, youth draws or squad quality;
- purchasable energy, morale, injury or fatigue recovery in competitive contexts;
- paid extra attempts, faster timers or more daily competitive actions;
- paid analytics, scouting certainty or hidden-attribute reveal;
- paid rewards whose value can be traded into squad/economy advantage.

## Source trail

- Perplexity research pass, 2026-06-13: football-manager monetization precedent
  and player-perception comparison.
- Football Legacy press release describing optional supporter subscription and
  cosmetic add-ons as the monetization model:
  <https://www.gamespress.com/Launch-of-Football-Legacy-New-Online-Football-Manager-Focuses-on-Fair->
- Top Eleven forum perception thread:
  <https://forum.topeleven.com/top-eleven-general-discussion/83824-worst-pay-win-game-ever-4.html>
- OSM official community thread on Boss Coins / P2W perception:
  <https://forum.onlinesoccermanager.com/topic/69233/osm-how-to-turn-a-great-game-in-a-p2w-game>
- Top Eleven Google Play listing, used as an IAP/store-surface example:
  <https://play.google.com/store/apps/details?id=eu.nordeus.topeleven.android>
- Steam Football Manager 2024 discussion returned by Perplexity as a premium
  product / revenue perception surface:
  <https://steamcommunity.com/app/2252570/discussions/0/4029095281639728401/>

## Notes for synthesis

FMX-190 should treat the Hattrick/supporter line as the positive model and
Top Eleven/OSM token-booster/scout patterns as explicit negative tests. "Can this
paid feature improve squad strength, preparation quality, transfer access or
competitive opportunity volume?" should be a hard gate.

## Related

- [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
