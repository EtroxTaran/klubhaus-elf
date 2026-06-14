---
title: "Raw - football manager age rating precedents (FMX-185)"
status: raw
tags: [research, raw, perplexity, football-manager, ratings, monetization, games, fmx-185]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-185
related:
  - [[../age-assurance-and-iarc-rating-2026-06-14]]
  - [[raw-age-assurance-source-checks-2026-06-14]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]
---

# Raw - football manager age rating precedents (FMX-185)

## Query

2026-06-14 Perplexity/Sonar query: compare Football Manager, Top Eleven,
Online Soccer Manager, Hattrick, Soccer Manager and similar football-management
games for age ratings, account/age-gate posture, monetization descriptors,
parental-control posture and responsible-design implications.

No FMX private data, secrets or user data were sent.

## Captured answer

Perplexity framed football-management games as usually low age-rating products
when they avoid explicit violence, gambling and adult content. It also warned
that modern scrutiny is less about the sport-management premise and more about
monetization pressure, paid random items, ads, chat/UGC and data use.

## Targeted source checks

Official/app-store checks captured during the same beat:

- Apple App Store, Football Manager 26 Touch:
  <https://apps.apple.com/us/app/football-manager-26-touch/id1626267810>
  - Captured: age rating 4+, no ads, no in-app purchases, SEGA publisher.
- Google Play, Top Eleven:
  <https://play.google.com/store/apps/details?id=eu.nordeus.topeleven.android&hl=en_US>
  - Captured: Everyone rating, in-app purchases and includes random items,
    Nordeus publisher.
- Google Play, OSM 25/26:
  <https://play.google.com/store/apps/details?id=com.gamebasics.osm&hl=en_US>
  - Captured: Everyone rating, ads, in-app purchases, users interact and
    in-game purchases including random items.
- Google Play, Soccer Manager 2026:
  <https://play.google.com/store/apps/details?id=com.invinciblesstudioltd.soccermanager2025&hl=en_US>
  - Captured: Everyone rating, ads, in-app purchases, Invincibles Studio.
- Apple App Store, Soccer Manager 2026:
  <https://apps.apple.com/us/app/soccer-manager-2026-football/id6449935779>
  - Captured: age rating 4+, advertising, in-app purchases.
- Hattrick:
  <https://www.hattrick.org/en/football-manager-game.aspx>
  - Captured: free-to-play online football manager; Supporter subscription
    gives analysis, customisation and interaction tools. This page did not
    expose account age or parental-control details.

## Working interpretation for FMX-185

FMX should take the safer side of the genre precedent: aim for low-age-rating
content, keep fixed-price/non-random monetization only, avoid launch chat/UGC,
save exact store/rating descriptors and treat any paid random item, ads, free
text or UGC as a re-rating and age-assurance review trigger.
