---
title: "Raw responsible-gaming game precedents (FMX-193)"
status: raw
tags: [research, raw, perplexity, responsible-gaming, football-manager, monetization, dark-patterns, game-precedents, fmx-193]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-193
related:
  - [[../responsible-gaming-binding-record-2026-06-15]]
  - [[raw-responsible-gaming-source-checks-2026-06-15]]
  - [[../../40-Compliance/responsible-gaming]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
---

# Raw responsible-gaming game precedents (FMX-193)

## Prompt

Perplexity research requested game and real-world product precedents for
responsible-gaming guardrails in management games, especially football managers,
live-service sports managers, long-session games and no-pay-to-win monetization.

## Raw capture

Perplexity recommended using "trust-first monetization" as the product posture:
fixed-price cosmetics, supporter/account-service perks and transparent
singleplayer-only assistance are safer than paid randomness, paid progression,
paid scouting certainty or paid time pressure.

It identified two positive patterns:

- Low-pressure asynchronous management where players can log in once a week and
  still compete if they make good strategic choices.
- Supporter-style features that emphasize identity, convenience and community
  rather than squad power, hidden information or accelerated progression.

It also identified negative patterns common in live-service sports managers:

- Tokens/premium currencies that buy player acquisition, recovery, morale,
  construction, auction attempts or event advantages.
- Random-item packs or collections with limited-time event pressure.
- Event calendars, daily streaks, sponsor tracks and "last chance" copy that
  convert ordinary retention into coercive pressure.

The answer recommended a hard rule: no paid random rewards, no paid player packs,
no paid trading/skin gambling, no daily login streak rewards, no paid recovery
from absence, and no "your club/team misses you" guilt messaging.

## Source-check status

The first Perplexity pass included several inferred examples. The following
examples were source-checked before use in the synthesis:

| Example | Source-check result |
|---|---|
| Hattrick | Official homepage says players can log in daily or weekly, have the same chance if they make the right calls, need not log in daily for bonuses/currency, and cannot buy in-game advantages. |
| Hattrick Supporter | Official help page lists supporter tools, visual identity, statistics, reminders and convenience features; this is useful as a supporter precedent but also shows FMX should avoid paid information advantage if it wants a stricter no-P2W posture. |
| Top Eleven | Google Play and App Store pages show optional in-app purchases including random items; the current listing also emphasizes seasons, battle-pass-like sponsor rewards, events, packs and player-card collection. This is a counterexample, not the recommended FMX posture. |
| IARC/USK descriptors | USK/IARC explicitly surface randomized purchases, pressure to play and pressure to buy as rating/descriptor evidence. |

## Immediate synthesis from discovery

- The clean FMX precedent is "Hattrick pressure profile, stricter than Hattrick
  on paid information advantage."
- The avoid list is "Top Eleven-style random items, event pressure, premium
  currency, auctions/boosts/recovery and recurring season reward pressure."
- FMX should document this as a product invariant now, before monetization copy,
  UI and rating questionnaires drift into higher-risk patterns.

## Limitations

Perplexity's game examples are not legal evidence. They are product-design
precedents only and are source-checked separately in
[[raw-responsible-gaming-source-checks-2026-06-15]].

