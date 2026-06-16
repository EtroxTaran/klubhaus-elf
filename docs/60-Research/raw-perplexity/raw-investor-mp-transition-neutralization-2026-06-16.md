---
title: Raw Perplexity - Investor MP Transition Neutralization
status: raw
tags: [research, raw, perplexity, investor, multiplayer, singleplayer, no-p2w, monetization, fmx-189]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-189
related:
  - [[../investor-mp-transition-neutralization-2026-06-16]]
  - [[raw-investor-mp-transition-neutralization-source-checks-2026-06-16]]
---

# Raw Perplexity - Investor MP Transition Neutralization

Perplexity was used as the discovery pass for FMX-189. The output is preserved
as directional research only; weak citations were not promoted into canonical
wording without the source-check note.

## Prompt

Research best practices for a football manager / strategy game with strict
separation between singleplayer saves and server-authoritative multiplayer
sessions. Requirements: singleplayer progress, premium cash-grant entitlements,
local/hotseat/imported saves must never enter multiplayer or create multiplayer
advantage; real-money time-saving is allowed only in singleplayer; multiplayer
starts as a fresh server-authenticated shared state. Include comparable game
precedents, platform policy implications and recommended product/architecture
contract wording.

## Discovery Findings

Perplexity's strongest directional findings:

- Treat singleplayer, local hotseat and imported saves as one non-competitive
  authority class. They may be flexible, editable, portable or paid-assisted,
  but they must never be accepted as multiplayer truth.
- Treat online multiplayer as a separate server-authoritative product surface:
  server creates the league/session, validates all commands and owns every
  competitive fact.
- Real-money stat/economy/time-saving benefits should carry an explicit
  `SP_ONLY` scope. Entitlements that are visible in both modes must be cosmetic,
  profile, social or UX-only and must not change competitive state.
- The architecture recommendation was a hard wall rather than a filter:
  multiplayer services never deserialize SP saves, never read SP cash-grant
  payloads and never use SP progress as seed state.
- Product copy should state that singleplayer purchases and progress stay in
  singleplayer, while online leagues are fair, server-hosted competitions.

## Comparable Patterns Returned

Perplexity proposed these patterns for later source-checking:

- Offline-vs-online character separation in online action RPGs.
- Hattrick-style online football manager fairness: monetization avoids gameplay
  advantage.
- Minecraft-style policy gates around when modified/local content can count for
  official achievements.
- Cosmetic-only/no-P2W competitive monetization in established multiplayer
  titles.

## Weak Or Non-promoted Claims

The generated source list included YouTube tutorials, Reddit/Facebook/TikTok and
generic game-store links. These were not promoted. Football Manager online-save
claims remain useful product intuition but were not used as official evidence in
the synthesis because the pass did not return stable primary documentation.

## Raw Recommendation

Perplexity recommended:

- define explicit mode taxonomy (`singleplayer`, local/hotseat/imported,
  multiplayer);
- add entitlement `mode_scope` / `SP_ONLY` semantics;
- make `MP services never accept SP save data` an engineering invariant;
- label SP time-saving purchases clearly in store and in-game copy;
- test that SP boosts, cash and imported saves have zero multiplayer effect.

FMX-189 applies a stricter version after Nico's decision: there is no
SP/Hotseat/imported-save transition into multiplayer at all, so no neutralized
entry path needs to exist.
