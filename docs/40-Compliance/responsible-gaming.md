---
title: "Responsible gaming"
status: current
tags: [compliance, responsible-gaming, dark-patterns, monetization, loot-boxes, iarc, usk, fmx-193]
created: 2026-06-15
updated: 2026-06-19
type: compliance
binding: true
linear: FMX-193
related:
  - [[README]]
  - [[../60-Research/responsible-gaming-binding-record-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
  - [[age-assurance-and-rating-evidence]]
  - [[monetization-legal-gates-evidence-2026-06-13]]
---

# Responsible gaming

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this implementation or quality note is now
> binding according to its approved scope.


## Status

Draft compliance home for FMX-193. **Not legal advice and not legally
approved.** This note becomes binding only if Nico accepts ADR-0122 or a later
legal/product review promotes it.

## Draft public statement

Klubhaus Elf is designed for measured football-management sessions, not
compulsion loops.

We do not use loot boxes, paid random rewards, paid player packs, paid trading,
daily login streak rewards, punitive absence mechanics, false urgency or paid
power. Future paid scope, if accepted, is limited to fixed-price cosmetics,
supporter/account-service features or isolated singleplayer assistance that does
not affect competitive shared state.

Session reminders are optional, local and configurable. We update this statement
when product mechanics, monetization or rating-relevant features change.

Last updated: 2026-06-15.

## Product guardrails

| Surface | Rule | Status |
|---|---|---|
| Paid random rewards | No paid random rewards, loot boxes, paid packs, paid mystery awards, paid prize draws or paid trading path. | proposed |
| Premium currency | No bundle mismatch, obfuscated real-price conversion or paid currency that buys competitive power. | proposed |
| Competitive state | Paid entitlements must not affect shared, ranked, async, watch-party, export or future multiplayer state. | proposed |
| Paid information | No paid scouting, forecasts, hidden-state reveal, analytics or certainty advantage for competitive decisions. | proposed |
| Daily streaks | No daily login streak rewards, streak-loss penalties or paid streak recovery. | proposed |
| Urgency/scarcity | No false urgency, fake scarcity, countdown pressure or "last chance" monetization pressure. | proposed |
| Absence/guilt | No "your club misses you", loss-shaming, guilt notifications or paid comeback relief. | proposed |
| Exit/cancel | Neutral copy, symmetrical button emphasis, no confirmshaming and no roach-motel friction. | proposed |
| Notifications | Opt-in per channel, informational copy, frequency caps and easy disable path. | proposed |
| Session reminders | Optional local timer; neutral prompt; no required telemetry; user can dismiss or disable. | proposed |
| Age/rating evidence | Save IARC/USK evidence for purchases, random-item absence, gambling theme absence/presence, pressure descriptors, ads, online interaction and change log. | proposed |
| Public statement | Version/date update when paid scope, retention loops, notifications or rating-relevant mechanics change. | proposed |

## Release evidence to save

| Bucket | Required evidence |
|---|---|
| Statement version | Responsible-gaming statement text, date, product route/version and reviewer. |
| Monetization inventory | All SKUs, prices, entitlement classes, refund/revocation behavior and no-random-reward proof. |
| Dark-pattern audit | Completed self-audit table for urgency, defaults, exits, notifications, streaks, absence and paid pressure relief. |
| Rating descriptors | IARC/USK evidence for in-game purchases, random objects, gambling themes, pressure to play/buy, ads and online interaction. |
| UI/copy screenshots | Storefront, purchase, settings, notification and session-reminder copy. |
| Legal/product review | Named reviewer, date, scope, known residual risks and next re-check trigger. |

## Re-check triggers

- Any real-money flow, paid currency, subscription, supporter pack or native app
  IAP.
- Any random reward, item pack, collection, mystery award, paid event pack,
  trading path, auction shortcut, recovery item or booster.
- Any notification, daily/weekly return reward, event timer, streak, limited
  offer or comeback mechanic.
- Any rating-relevant change to gambling themes, purchases, random objects,
  pressure descriptors, ads, chat/UGC or online interaction.
- Any public claim about no-P2W, no loot boxes, wellness or responsible gaming.

## Related

- [[../60-Research/responsible-gaming-binding-record-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
- [[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
- [[age-assurance-and-rating-evidence]]
- [[monetization-legal-gates-evidence-2026-06-13]]

