---
title: Raw Perplexity Research Transcripts
status: raw
tags: [research, raw, perplexity, wave-2, player-strength]
created: 2026-05-16
updated: 2026-05-17
type: index
binding: false
related: [[../00-summary]], [[../../00-Index/Research-Map]]
---

# Raw Perplexity Research Transcripts (Wave 2)

This folder preserves the substantive content of private Perplexity-style
research transcripts and attached research reports (German source language).
They are
**not authoritative** for implementation — they are the lossless input feeding
the synthesised research notes one folder up.

## Source documents (private, not committed)

- `Football Manager Game – Vollständige Feature-Recherche & Konzeptbibliothek.md` (≈580 lines, feature catalogue)
- `ich möchte eine Art Fussballmanager als app _Entwi.md` (≈8 800 lines, iterative system design + architecture + emergent systems)
- `Für unsere Match Engine verwenden wir einen Mechan.md` (≈730 lines,
  runtime technology and match-engine scaling strategy)

The transcripts contain multiple parallel Perplexity answer iterations on the
same prompts; we preserve the distinct content per topic rather than per
iteration, because the iterations overlap heavily and the value is in the union
of points raised across runs.

## Files

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-feature-library]] | Competitor catalogue (Anstoss / FM / EA / Club Boss / ManagerZone / SOKKA / Soccer Manager 2026) | [[../feature-library-synthesis]] |
| [[raw-systems-design]] | 15 core club-simulation systems and their interplay | [[../systems-design-synthesis]] |
| [[raw-game-modes]] | Create-a-Club Roguelite, Manage-a-Club Career, Singleplayer, Async Private Group | [[../mode-design-research]] |
| [[raw-async-multiplayer]] | Fixed vs dynamic cadence, watch parties, conference mode, transfer escalation | [[../async-multiplayer-research]] |
| [[raw-architecture]] | DDD modular monolith, state machines, transactional outbox, offline-first, security | [[../../10-Architecture/bounded-context-map]] |
| [[raw-environment-events]] | Fan ecology, regulations, rivalries, sanctions, matchday events, progressive disclosure | [[../regulations-and-pyramids-research]], [[../fan-culture-segmentation-research]] |
| [[raw-transfer-market-research]] | Active transfer market, AI club selling, valuations, clauses, loans and player / agent pressure | [[../transfer-market-simulation]] |
| [[raw-player-strength-overview]] | Player strength presentation in squad overview; role/tactic-adaptive Impact, category scores, status icons | [[../player-strength-presentation]] |

## Rules

- Raw notes may quote competitor names and product features for analysis only.
- Implementation must follow [[../ip-and-licensing]] and
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].
- When a raw point is promoted into a synthesis, design, or ADR note, link both
  ways so future agents can trace the chain.
- Treat anything here as `status: raw`: not binding, never the only source.
