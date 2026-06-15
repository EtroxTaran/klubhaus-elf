---
title: "Raw responsible-gaming source checks (FMX-193)"
status: raw
tags: [research, raw, source-check, responsible-gaming, dark-patterns, dsa, usk, iarc, who, bzg, football-manager, fmx-193]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-193
related:
  - [[../responsible-gaming-binding-record-2026-06-15]]
  - [[raw-responsible-gaming-legal-regulatory-2026-06-15]]
  - [[raw-responsible-gaming-game-precedents-2026-06-15]]
  - [[../../40-Compliance/responsible-gaming]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
---

# Raw responsible-gaming source checks (FMX-193)

Access date for all web checks: 2026-06-15.

## Source-check table

| Source | Checked fact | Use in packet | Confidence |
|---|---|---|---|
| European Commission, DSA overview, <https://digital-strategy.ec.europa.eu/en/policies/digital-services-act> | Commission summary says the DSA strengthens protection of fundamental rights, adds enhanced protection for minors, bans targeted ads to children, requires ad transparency and prohibits deceptive design tactics/dark patterns. | Supports the dark-pattern ban and minors/ads/recommender caution. | high |
| EUR-Lex DSA text, CELEX 32022R2065, <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2065> | Direct page was not readable in the browser tool because EUR-Lex presented a JavaScript challenge, but the CELEX URL identifies Regulation (EU) 2022/2065. | Link only; operational wording is sourced from the official Commission DSA overview. | medium |
| USK, games and apps in the IARC system, <https://usk.de/en/home/age-classification-for-games-and-apps/games-and-apps-in-the-iarc-system/> | USK explains IARC questionnaire-based ratings, German USK classifications through the matrix, regular monitoring, and descriptors for gambling themes, pressure, in-game purchases and random objects. | Rating evidence must preserve absence/presence of paid random objects, pressure to play/buy, purchases, ads and online interaction. | high |
| IARC, how IARC works, <https://www.globalratings.com/how-iarc-works.aspx> | IARC says developers complete a questionnaire, regional age ratings and descriptors are assigned, and universal interactive elements include in-game purchases including randomized ones, user interaction, location sharing and internet access. | Supports the required evidence checklist and random-purchase absence proof. | high |
| WHO, gaming disorder FAQ, <https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder> | WHO defines gaming disorder by impaired control, increasing priority over other activities, continuation/escalation despite negative consequences, significant impairment and normally 12 months; it also says only a small proportion of players are affected but players should watch time/exclusion of other activities and health/social changes. | Supports optional session reminders, neutral wellbeing copy and avoiding compulsion loops. | high |
| Ins Netz gehen / BIOEG, healthy gaming, <https://www.ins-netz-gehen.de/jugendliche/videospiele-gaming/tipps-fuer-deine-mentale-und-koerperliche-gesundheit-beim-zocken/> | German youth-prevention site recommends keeping play time in view, limiting it, taking regular breaks and maintaining offline activities, sleep and movement. | Supports optional reminder/tooling rather than punitive or guilt-based mechanics. | high |
| Ins Netz gehen / BIOEG, loot boxes and hidden gambling, <https://www.ins-netz-gehen.de/jugendliche/videospiele-gaming/loot-box-und-gluecksspiel-elemente/> | German youth-prevention site explains loot boxes/random items, notes the player does not know what they will receive, and warns that the chance of valuable contents can drive repeated spending. It also notes Germany does not treat loot boxes as gambling per se. | Supports no paid random rewards as a trust/product/youth-protection choice even without a German gambling-law ban. | high |
| Ins Netz gehen / BIOEG, help page, <https://www.ins-netz-gehen.de/jugendliche/tipps/hilfe-bei-handysucht-computersucht-internetsucht/> | Site provides youth help options, online counseling, phone counseling and local counseling for changing media-use behavior. | Source for future public statement help-link policy if a public product page needs German support links. | high |
| DLA Piper, Austrian Supreme Court loot-box article, <https://www.dlapiper.com/en/insights/publications/2026/01/supreme-court-shifts-the-playing-field-lootboxes-fall-outside-the-austrian-gambling-act> | DLA Piper reports that the Austrian Supreme Court decision `6 Ob 228/24h` treated the specific FIFA packs in their overall game context, found skill predominance and no cash-out value, but did not hold that loot boxes can never be games of chance. | Supports "no safe harbor; keep no-loot-box posture." | high secondary |
| Hattrick homepage, <https://www.hattrick.org/en-us/> | Hattrick says managers can play at their own pace, need not log in daily for bonuses/currency, and cannot buy in-game advantages; Supporter gives features with no actual in-game advantages. | Positive comparable-game precedent for low-pressure football management. | high |
| Hattrick Supporter help, <https://www.hattrick.org/en-us/Help/Supporter/About.aspx> | Supporter features include identity tools, stats, reminders, training tools, match analysis and convenience functions. | Useful but not copied blindly: FMX should be stricter on paid information advantage than Hattrick if ADR-0108 remains the recommended posture. | high |
| Google Play, Top Eleven, <https://play.google.com/store/apps/details?id=eu.nordeus.topeleven.android&hl=en_US> | Listing shows ads, in-app purchases, PEGI 3, "In-Game Purchases (Includes Random Items)", battle-pass/sponsor rewards, events, packs and optional IAP including random items; updated 2026-06-10. | Negative precedent and rating-evidence comparison. | high |
| Apple App Store, Top Eleven, <https://apps.apple.com/us/app/top-eleven-be-a-soccer-manager/id459035295> | Listing shows free + in-app purchases, age 9+, "optional in-game purchases (including random items)", season/event/packs/player-card collection language. | Negative precedent and mobile-store copy comparison. | high |
| European Commission Digital Fairness Act initiative, <https://ec.europa.eu/info/law/better-regulation/have-your-say/initiatives/14622-Digital-Fairness-Act_en> | Page exists but was not readable in the browser tool. Secondary sources indicate a Digital Fairness Act policy process, but this packet does not treat it as binding law. | Policy-watch only, not used as a binding compliance statement. | weak |

## Source-check conclusions

- DSA and Commission guidance make dark-pattern avoidance a current, not merely
  reputational, design concern.
- USK/IARC make randomized purchases, in-game purchases, pressure and gambling
  themes explicit rating/evidence dimensions.
- WHO and German prevention guidance support reminders, breaks and balanced-use
  tools, but not guilt-based or punitive retention.
- The Austrian loot-box decision weakens a simple "all loot boxes are gambling"
  claim, but it strengthens the need for case-by-case evidence and does not
  justify opening paid random rewards for FMX.
- Hattrick proves a low-pressure football manager can message "no paid in-game
  advantages"; Top Eleven shows the opposite live-service direction and is the
  product pattern to avoid for FMX's intended trust posture.
