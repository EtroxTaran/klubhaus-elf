---
title: "Raw Perplexity - Effect-intent taxonomy real-world football/media"
status: raw
tags: [research, raw, perplexity, effect-intent, media, press, football, board-pressure, morale, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-162
related:
  - [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15]]
---

# Raw Perplexity - Effect-intent taxonomy real-world football/media

## Prompt

Research real-world football and sports-management evidence for how press/media
coverage, press conferences, transfer rumours, fan sentiment, board pressure,
player confidence, squad morale, and manager reputation influence each other.
Focus on realistic causal pathways that can become small deterministic game
mechanics. Include source URLs and call out weak citations.

## Raw discovery synthesis

Perplexity's useful discovery line was:

- Realistic mechanics should treat media exposure as an amplifier of existing
  tension, not as direct magic state mutation.
- Stronger design candidates are short feedback loops:
  result -> press tone -> morale/confidence; press conference -> narrative
  control -> reputation/fan sentiment; transfer rumour -> uncertainty ->
  player morale/commitment; fan sentiment -> board pressure -> manager risk.
- Board pressure and squad morale are the clearest systemic levers; media
  effects should usually be small, bounded, and context-amplified.
- Transfer-rumour effects should be strongest when a player is already unhappy,
  underused, a fan favourite, contract-uncertain, or linked to a higher-status
  club.
- Reputation should dampen or amplify future media/fan reaction rather than
  produce large one-shot effects.

## Perplexity weak-source warning

The first search result set confused "press/media coverage" with American
football defensive press coverage. Perplexity correctly flagged those URLs as
non-applicable. They are preserved here as a weak-discovery caution and must
not be canonized:

- https://www.viqtorysports.com/explained-press-coverage/
- https://alleyesdbcamp.com/3-key-things-to-remember-in-press-coverage/
- https://youthfootballonline.com/press-coverage-technique-bump-and-run-coverage/
- https://www.youtube.com/watch?v=XdPVKR_fEf0
- https://www.reddit.com/r/footballstrategy/comments/edo35m/what_are_the_best_methods_to_playing_press_man/

## Design takeaways before source check

- Model direct player effects as confidence/trust/morale nudges, not ability
  changes.
- Model indirect effects as fan sentiment and board-pressure amplification.
- Keep media and press effects owner-validated and replayable.
- Use context gates so the same intent may be accepted, clamped, or rejected
  depending on current facts.

## Related

- [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[raw-effect-intent-taxonomy-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
