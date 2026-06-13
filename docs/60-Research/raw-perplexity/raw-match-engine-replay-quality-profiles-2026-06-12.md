---
title: "Raw - Match-engine replay quality profiles (FMX-135)"
status: raw
tags: [research, raw, perplexity, match-engine, replay, quality-profile, simulation, football-manager, ootp, fmx-135]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-135
related:
  - [[../match-engine-contract-ratification-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
---

# Raw capture - Match-engine replay quality profiles (Perplexity, 2026-06-12)

Perplexity capture for **FMX-135**. Status `raw`: this is source input only; the
synthesis is [[../match-engine-contract-ratification-2026-06-12]].

No FMX private data, secrets or user data were sent. The prompt was a generic
game-design and simulation-fidelity research prompt.

## Prompt - replay guarantees and simulation fidelity tiers

**Prompt.** Research replay guarantees and simulation fidelity tiers in
real-world sports management games and simulation-heavy games. Focus on what
should be byte-identical replay versus statistical-envelope replay for a
football manager: human-viewed competitive matches, standard interactive
matches, background detailed AI-vs-AI matches, and fast background season
simulation. Include real-game examples such as Football Manager, OOTP Baseball,
EHM, Paradox/4X grand-strategy fast simulation if relevant, and real-world
sports/statistical-simulation practice. Finish with best-practice
quality-profile recommendations and source URLs.

## Key captured findings

- The answer recommended two replay tiers: byte-identical replays for anything
  human-viewed, competitive, contestable, broadcast or likely to be used for bug
  reports; statistical-envelope replay for bulk AI-vs-AI and fast background
  simulation.
- `competitive-full` and `interactive-standard` should share the strict engine
  guarantee: committed event log and replay from the same initial snapshot,
  seed and engine version must produce the same football events.
- `background-detailed` should persist the final result, lineups, goals, cards,
  substitutions and aggregate stats. Byte parity is useful where cheap, but the
  binding gate should be statistical and summary-consistency based.
- `background-fast` should be statistical-envelope only: no claim of exact
  micro-event replay, no use as a byte-exact replay source, and no requirement
  to store full event/spatial timelines.
- Comparable sports-management examples support the product split, but public
  evidence is stronger for visible play-by-play/log modes than for engine
  determinism internals. OOTP's official manual distinguishes auto-play from
  Play-by-Play Mode where the player manages or watches selected games.
- Real-world sports simulation and forecasting practice optimizes
  distributional fidelity for season/contest projections, not exact recreation
  of every simulated micro-event.

## Source quality note

Perplexity's returned public sources for game-specific determinism were weak
and included YouTube/Facebook links. The synthesis therefore treats game
determinism claims as genre inference unless supported by official docs. The
usable official source found during cross-checking is:

- OOTP manual, "Playing out Games" / Play-by-Play Mode:
  <https://manuals.ootpdevelopments.com/index.php?man=ootp19&page=play_by_play_mode_playing_out_games>

