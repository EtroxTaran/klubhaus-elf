---
title: Raw narrative replay game precedents
status: raw
tags: [research, raw, perplexity, games, narrative, replay, commentary, football-manager, fmx-153]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-153
related:
  - [[../llm-prose-replay-determinism-floor-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
---

# Raw narrative replay game precedents

## Prompt

Research real-world and game precedent for player expectations around match
replays, inbox/news archives, commentary logs and generated narrative text in
football-management and adjacent management games. Focus on what should remain
exact when reopening a save or replaying a match.

## Perplexity capture

Perplexity separated the problem by surface:

- **News/inbox/story archives:** players expect stable historic artifacts. If a
  game told the player a specific article, inbox message, board warning or
  press quote, reopening the save should show the same content, not a newly
  paraphrased version.
- **Match play-by-play/commentary:** if the commentary is the primary replay
  artifact, exact lines matter. If commentary is only a live ambience layer over
  a visual replay, a deterministic template variation may be acceptable, but it
  must not change facts or analytics.
- **Simulation truth:** match result, goals, cards, injuries, substitutions and
  ratings are the authoritative replay facts. Commentary is presentation over
  those facts.
- **Player trust:** management-game archives work as memory. Changing old
  narrative prose after a reopen can make the save feel untrustworthy even if
  the underlying facts did not change.

The recommended FMX interpretation was:

- Persist exact snapshots for all revisitable text: inbox, article, report,
  weekly summary, dialogue transcript and any replay-visible commentary line.
- Keep match replay truth in the committed event log and derived frame builder.
- Allow future "resimulate" or "regenerate article" commands only as explicit
  new artifacts, never silent replacement of player-visible history.

## Source list returned by Perplexity

Perplexity cited a mix of game, simulation and UX sources. Several were useful
for direction but weak as authority. The stronger source-checks were:

- Football Manager official FM26 feature note, which presents match day as a
  storytelling/presentation surface that helps the player understand and feel
  the match:
  https://www.footballmanager.com/fm26/features/where-storytelling-evolves-fm26s-match-day-experience
- Existing FMX vault note [[../determinism-and-replay]], which already forbids
  presentation RNG from driving simulation logic.
- Existing ADR-0026, which makes `MatchFrame` derived on demand and never
  persisted.

## FMX inference

The game precedent is not a hard external law; it is a product expectation. FMX
should distinguish:

- **replay/reopen:** show what happened and what was displayed;
- **resimulate:** deliberately create a new simulated timeline;
- **regenerate/proofread:** deliberately create a new presentation artifact,
  with a new snapshot/version and provenance.

For FMX-153, Nico selected the exact-snapshot floor for visible Template/LLM
lines. That is stricter than the minimum for ambience-only commentary, but it
is easier to explain, test and trust.

## Claim confidence

| Claim | Confidence | Handling in FMX-153 |
|---|---|---|
| News/inbox/story archives should be stable on reopen. | High | Binding ADR rule. |
| Match replay facts should stay in event logs, not prose. | High | Clarify ADR-0026/0030/0054. |
| Commentary exactness is product-dependent. | Medium | FMX chooses exact snapshots for replay-visible commentary. |
| Regeneration can exist only as explicit new artifact/version. | Medium-high | Binding ADR rule. |
