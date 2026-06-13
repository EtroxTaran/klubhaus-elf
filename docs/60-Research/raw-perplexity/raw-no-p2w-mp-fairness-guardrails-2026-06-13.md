---
title: "Raw - no-P2W and MP-fairness guardrails (FMX-190)"
status: raw
tags: [research, raw, perplexity, monetization, no-p2w, multiplayer, fairness, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-190
related:
  - [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
---

# Raw - no-P2W and MP-fairness guardrails (FMX-190)

## Research prompt

Perplexity was asked for current best practices and community/industry definitions
of no-pay-to-win in competitive and management games, including soft P2W,
paid information advantage, speed-ups, attempt volume, paid randomness, tradeable
paid items and enforceable guardrails.

## Key findings

- "No pay-to-win" needs to mean no purchasable direct or indirect competitive
  advantage, not merely "no button that guarantees a win".
- Soft P2W is the critical gray zone: time compression, grind reduction,
  recovery shortcuts, extra retries, better odds, paid hidden information or
  paid opportunity volume can change competitive standing even without a direct
  stat boost.
- In a management game, paid information advantage is power. Hidden-attribute
  certainty, tactical analysis, stronger predictive models, scouting priority or
  earlier probabilistic knowledge can be as consequential as a direct player boost.
- Visible cosmetics are generally acceptable if they are only presentation:
  they must not change readability, fan pressure, match logic, matchmaking,
  rankings, rewards or official comparisons.
- Paid randomness is high risk. Paid random cosmetics can be lower risk but still
  add legal/store complexity; paid random performance rewards are incompatible
  with a strict no-P2W promise.
- Tradeable paid items or paid currencies are unsafe when they can become economy
  leverage or competitive resources.

## Operational tests from the raw answer

For every real-money entitlement or SKU, fail the no-P2W gate if it can:

1. alter match, squad, staff, finance, transfer, training, injury, fatigue, morale,
   board, fan, scheduling, ranking or reward outcomes in a shared surface;
2. reveal hidden or probabilistic information earlier or more accurately than a
   non-paying competitor can obtain under the same rules;
3. increase competitive attempt volume, recovery pace or time-gate throughput;
4. be traded, converted, refunded or laundered into competitive resources;
5. cross from a paid singleplayer state into shared rankings, async groups,
   watch-party state, exports, official comparisons or future multiplayer.

## Source trail

- Perplexity research pass, 2026-06-13: no-P2W definitions, soft P2W and
  entitlement guardrails.
- Game Wisdom, "Classifying Pay to Win Design":
  <https://www.gamedeveloper.com/business/classifying-pay-to-win-design-in-today-s-market>
- Last Epoch forum discussion on where communities draw the P2W line:
  <https://forum.lastepoch.com/t/pay-to-win-what-does-that-mean-and-where-do-you-draw-the-line-discussion/48519>
- Blizzard/Hearthstone forum sentiment surface on paid advantage:
  <https://us.forums.blizzard.com/en/hearthstone/t/please-stop-pay-to-win/86939>
- ACM source returned by Perplexity for dark-pattern / monetization perception context:
  <https://dl.acm.org/doi/10.1145/3549510>

Community/forum sources are used as player-perception evidence, not as legal or
architectural authority.

## Notes for synthesis

FMX-190 should convert the FMX-191 product promise into a project-wide invariant:
paid entitlements must be zero-effect on competitive shared state, with paid
information advantage treated as forbidden power unless the same knowledge is
available to all competitors.

## Related

- [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
