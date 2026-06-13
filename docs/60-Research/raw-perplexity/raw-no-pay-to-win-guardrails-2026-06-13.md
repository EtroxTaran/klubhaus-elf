---
title: "Raw - no pay-to-win guardrails and entitlement taxonomy (FMX-191)"
status: raw
tags: [research, raw, perplexity, monetization, no-p2w, entitlement, multiplayer, fairness, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-191
related:
  - [[../monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
---

# Raw - no pay-to-win guardrails and entitlement taxonomy (FMX-191)

## Research prompt

Perplexity was asked to turn "no pay-to-win" into testable design guardrails for
FMX. The prompt asked for a taxonomy of allowed and forbidden real-money
entitlements in a football-manager game with singleplayer, async private groups,
shared rankings/watch-party futures and a previously documented singleplayer
Investor entitlement.

## Key findings

- A real-money entitlement is pay-to-win if it directly or indirectly improves a
  player's probability of competitive success in a shared context.
- The guardrail must cover both direct power and indirect competitive advantage:
  faster progression, more competitive attempts, better hidden information, reduced
  recovery time, paid tactical systems, paid scouting certainty or paid access to
  stronger staff/players.
- Pure club identity cosmetics are safe if they do not change readability,
  gameplay state, opponent information, match outcomes, economy, scheduling or
  matchmaking.
- QoL/supporter features are safe only when they do not reveal hidden state, automate
  decisions, accelerate simulation in ranked/shared contexts, expand competitive
  opportunity volume or create better scouting/tactical knowledge.
- Singleplayer-only paid value can be safe only if it is physically and contractually
  isolated from shared state and never exports into multiplayer/rankings/comparisons.
- Tradeability turns cosmetic or paid items into economy risk. Paid items that can be
  traded, converted or sold into competitive resources should be forbidden.
- Paid randomness is avoidable and high risk. Paid random rewards that can produce
  power are forbidden; paid random cosmetics still create legal/store complexity and
  should not be in the FMX-191 canon.

## Allowed classes from the raw answer

- Cosmetic club identity: kits, badges, crest variants, UI themes, stadium skins,
  cosmetic trophies, profile frames, cosmetic supporter banners and non-mechanical
  presentation variants.
- Supporter QoL: extra cosmetic preset slots, longer history views, richer replay
  archive, exportable cosmetic snapshots, club profile decorations, social/profile
  curation and non-authoritative convenience views.
- Account services: club/manager rename, cosmetic reset, optional region/account
  service where it has no rank/MMR/reward effect.
- Singleplayer-only Investor cash already bounded by ADR-0063 if it remains isolated
  and unavailable in shared/competitive saves.

## Forbidden classes from the raw answer

- Player, staff, tactic, morale, stamina, training, injury-recovery or match-result
  boosts.
- Paid scouting certainty, hidden-attribute reveals, tactical-analysis advantages or
  model outputs that help a shared competitive player make better decisions.
- Paid transfer budget, wage budget, fixture rerolls, draw rerolls, schedule relief,
  opponent weakening or board-confidence changes in shared saves.
- Paid speed-ups or time-gate skips where the skipped delay affects competitive
  progression or opportunity volume.
- Paid season-pass rewards that affect rank, squad, economy, training, scouting or
  competitive resources.
- Paid random rewards with competitive output.
- Tradeable paid items or paid currencies that can be converted into competitive
  resources.

## Operational no-P2W test

For each monetized SKU or entitlement, ask:

1. Can it affect a match result, player/staff development, scouting certainty,
   finance/economy, transfer capability, morale/confidence, scheduling, fatigue,
   injury, board/fan pressure or competitive attempt volume?
2. Can it reveal hidden or probabilistic information earlier, more accurately or more
   cheaply than non-paying competitors?
3. Can it be traded, converted, refunded, sold or laundered into competitive value?
4. Can it cross from a singleplayer save into shared rankings, async groups, watch-party
   states or comparison surfaces?

If any answer is yes, the entitlement is P2W or P2W-risk and requires a separate
Nico decision. FMX-191's recommended canon forbids it by default.

## Source trail

- Perplexity research pass, 2026-06-13: no-P2W taxonomy for sports/manager games.
- Game Wisdom, classifying pay-to-win design:
  <https://game-wisdom.com/critical/classifying-pay-to-win-design>
- Community sentiment surfaces returned by Perplexity included Steam discussions,
  game forums and videos. These were useful for player-perception examples only and
  are not treated as authoritative source material.

## Notes for synthesis

FMX-191 should set the model-level red/green taxonomy. CI/test enforcement and
SKU contract tests remain the planned FMX-190 follow-up after Nico chose the
"model-level canon" split for this issue.
