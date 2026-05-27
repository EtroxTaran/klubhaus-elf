---
title: Handoff FMX-10 Swappable Spatial-Event Engine
status: wrapped
tags: [meta, execution, handoff, match-engine, architecture, research]
created: 2026-05-27
updated: 2026-05-27
type: handoff
binding: false
related:
  - [[../../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
  - [[../../60-Research/raw-perplexity/raw-swappable-spatial-event-match-engine-runtime]]
  - [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../10-Architecture/modules/match-engine]]
  - [[../../00-Index/Current-State]]
---

# Handoff: FMX-10 Swappable Spatial-Event Engine (2026-05-27)

## Linear

- Issue: FMX-10 — Verankere Runtime-Recherche und austauschbare Spatial-Event
  Match Engine.

## Done this session

- Created raw and synthesized FMX-10 research for runtime strategy, spatial-event
  match model, OSS due diligence, deterministic replacement contracts, offline
  path, disconnect handling and LLM-supported key-event ticker.
- Drafted [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  as the proposed replacement for ADR-0003: swappable server-authoritative
  spatial-event engine, `MatchEnginePort`, TS-vs-Rust spike and Rust-native
  default if no clear disadvantage appears.
- Reframed [[../../50-Game-Design/match-engine]] and
  [[../../50-Game-Design/GD-0002-match-engine]] around event/spatial truth, 2D
  Canvas rendering, replay/ticker/report projections and visible star-player
  causality.
- Updated offline/PWA, runtime, building-block, frame-contract, multiplayer and
  state-machine docs so MVP match authority stays server-confirmed and future
  local/offline adapters must use the same versioned engine port.
- Added key-event-only match ticker wording to the Runtime-LLM boundary while
  keeping LLM output outside authoritative match state.
- Added disconnect handling defaults for singleplayer/live coaching and
  watch-party group rules.

## Open / next step

- Nico must decide whether ADR-0049 can move from draft to accepted.
- Run the TS-vs-Rust spike with the same DTOs, golden replay corpus,
  statistical envelope tests, profile-specific p95 budgets and adapter parity.
- Define exact `MatchEnginePort` DTOs, `SpatialSample` granularity and the
  key-event list/per-match budget for LLM ticker enhancement.
- Keep OSS candidates as study/spike input only; any code reuse needs a separate
  license/code ADR.

## Blockers

- No implementation is authorized until ADR-0049 and GD-0002 are ratified.
- Hardware sizing cannot be final beyond the planning range until the runtime
  spike produces p95 CPU/memory numbers for `competitive-full`,
  `interactive-standard`, `background-detailed` and `background-fast`.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-swappable-spatial-event-match-engine-runtime.md`
- `docs/60-Research/swappable-spatial-event-match-engine-2026-05-27.md`
- `docs/10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine.md`
- `docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md`
- `docs/10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md`
- `docs/10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready.md`
- `docs/10-Architecture/09-Decisions/ADR-0026-match-frame-contract.md`
- `docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md`
- `docs/10-Architecture/04-Solution-Strategy.md`
- `docs/10-Architecture/05-Building-Blocks.md`
- `docs/10-Architecture/06-Runtime.md`
- `docs/10-Architecture/modules/match-engine.md`
- `docs/10-Architecture/state-machines/match.md`
- `docs/10-Architecture/state-machines/watch-party.md`
- `docs/30-Implementation/hybrid-online-pwa-strategy.md`
- `docs/50-Game-Design/GD-0002-match-engine.md`
- `docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md`
- `docs/50-Game-Design/match-engine.md`
- `docs/50-Game-Design/watch-party-and-conference.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/ai-narrative-runtime-integration.md`
- `docs/60-Research/match-engine-runtime-strategy.md`
- `docs/60-Research/match-engine-simulation-model.md`
- `docs/60-Research/offline-mvp-scope-and-sync-strategy.md`
- `docs/60-Research/performance-budgets.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Documentation-V1.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Home.md`
- `docs/00-Index/Research-Map.md`

## Needs promotion

- ADR-0049: draft -> accepted after Nico approves the swappable spatial-event
  architecture and runtime-spike gate.
- GD-0002 / match-engine game-design docs: proposed FMX-10 changes need Nico's
  gameplay approval before implementation.
- ADR-0030 / GD-0018: key-event ticker scope needs the exact event list, provider
  budget and fallback/caching policy before implementation.
