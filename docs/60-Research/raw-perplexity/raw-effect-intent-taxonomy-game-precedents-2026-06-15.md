---
title: "Raw Perplexity - Effect-intent taxonomy game precedents"
status: raw
tags: [research, raw, perplexity, effect-intent, media, press, football-manager, ea-fc, ootp, games, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-162
related:
  - [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
---

# Raw Perplexity - Effect-intent taxonomy game precedents

## Prompt

Research comparable games and simulations that model media/press/dialogue
actions feeding downstream effects: Football Manager, EA Sports FC / FIFA
Career Mode, OOTP/FHM, Crusader Kings, RimWorld, XCOM, or similar systemic
games. Identify patterns, UX pitfalls, and best practices for effect intent
taxonomies, player-readable cause/effect, spam control, hidden vs visible
modifiers, and deterministic replay. Include source URLs and call out weak
citations.

## Raw discovery synthesis

Perplexity found a useful pattern split:

- Good systems separate what the player meant, what the system did, and what
  the player can inspect later.
- Press/dialogue choices need an intent taxonomy because prose labels alone
  collapse into repeated safe choices.
- Progressive disclosure is useful: show the likely audience/effect family
  before choice, then show a result/audit view after application.
- Hidden modifiers are acceptable only if the symptom and directional influence
  are visible; hiding both the modifier and the consequence pushes players to
  external guides.
- Spam control needs context-sensitive availability, diminishing returns,
  cooldowns, and memory. If one neutral-positive answer is usually safe, the
  media system becomes rote.

## Useful cited leads

- Football Manager official development update:
  https://www.footballmanager.com/news/development-update-football-manager-25
- Football Manager official article:
  https://www.footballmanager.com/the-dugout/mastering-end-season-run-fm26
- EA Sports FC 25 Career Mode Deep Dive:
  https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-career-mode-deep-dive
- OOTP manual player popularity:
  https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=player_popularity

## Weak/community leads

Perplexity also returned community and creator sources. They are useful only as
player-behaviour signals, not as canonical game-system documentation:

- Reddit discussion on Football Manager media handling:
  https://www.reddit.com/r/footballmanagergames/comments/18j5jb6/media_handling/
- YouTube press-conference advice:
  https://www.youtube.com/watch?v=tSra8NmlxII
- FMScout personality/media-handling guide:
  https://www.fmscout.com/a-guide-to-player-personalities-football-manager.html
- Steam community guide:
  https://steamcommunity.com/sharedfiles/filedetails/?l=polish&id=3141707601
- FullerFM analysis:
  https://fullerfm.com/2025/05/22/fm-logic-media-press-interactions/

## Design takeaways before source check

- Use intent -> owner policy -> result events, not prose -> hidden effect.
- Show bounded primary effects and keep hidden trait/persona influence as
  inspectable explanation, not invisible surprise.
- Give every accepted or rejected effect a history/audit row so deterministic
  replay has player-facing value.
- Keep the v1 catalog narrow and memorable; broad catalog breadth without
  feedback is a spam risk.

## Related

- [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[raw-effect-intent-taxonomy-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
