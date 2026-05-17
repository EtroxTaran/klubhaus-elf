---
title: Architecture Map
status: current
tags: [architecture, meta]
created: 2026-05-16
updated: 2026-05-17
type: map
binding: false
related: [[Decision-Log]], [[Current-State]]
---

# Architecture Map

Use this map before architecture or cross-cutting implementation work.

## Arc42 Chapters

- [Introduction](../10-Architecture/01-Introduction.md)
- [Constraints](../10-Architecture/02-Constraints.md)
- [Context](../10-Architecture/03-Context.md)
- [Solution Strategy](../10-Architecture/04-Solution-Strategy.md)
- [Building Blocks](../10-Architecture/05-Building-Blocks.md)
- [Runtime](../10-Architecture/06-Runtime.md)
- [Deployment](../10-Architecture/07-Deployment.md)
- [Crosscutting](../10-Architecture/08-Crosscutting.md)
- [Quality](../10-Architecture/10-Quality.md)
- [Risks](../10-Architecture/11-Risks.md)

## DDD bounded context map (Wave 2)

- [[../10-Architecture/bounded-context-map]] - 11 contexts.
- [[../10-Architecture/transfer-market-architecture]] - Transfer context services, storage, RNG streams and tiered simulation.

## State machines (Wave 2)

- [[../10-Architecture/state-machines/README]] - index.
- [[../10-Architecture/state-machines/league-week]]
- [[../10-Architecture/state-machines/transfer]]
- [[../10-Architecture/state-machines/watch-party]]
- [[../10-Architecture/state-machines/match]]

## Decisions

- [Decision Log](Decision-Log.md)

### Accepted / drafted (Wave 1)

- [ADR-0001 Tech Stack](../10-Architecture/09-Decisions/ADR-0001-tech-stack.md)
- [ADR-0002 Offline-first](../10-Architecture/09-Decisions/ADR-0002-offline-first.md)
- [ADR-0003 Match Engine](../10-Architecture/09-Decisions/ADR-0003-match-engine.md)
- [ADR-0004 Data Model](../10-Architecture/09-Decisions/ADR-0004-data-model.md)
- [ADR-0005 Save Format](../10-Architecture/09-Decisions/ADR-0005-save-format.md)
- [ADR-0006 i18n](../10-Architecture/09-Decisions/ADR-0006-i18n.md)
- [ADR-0007 Naming Schema](../10-Architecture/09-Decisions/ADR-0007-naming-schema.md)
- [ADR-0008 Mobile-first UI](../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui.md)
- [ADR-0009 Cursor Orchestration](../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration.md)

### Accepted (Wave 2 → Wave 3 promotion track)

- [ADR-0004 Data Model](../10-Architecture/09-Decisions/ADR-0004-data-model.md) — **accepted 2026-05-16** (hybrid per-save isolation + hybrid schema + TS-first generator + per-relationship modelling + integer numeric model + save quotas + encrypted saves + Phase-2 hybrid cloud-sync + gender-eligibility additivity)
- [ADR-0005 Save Format](../10-Architecture/09-Decisions/ADR-0005-save-format.md) — **accepted 2026-05-16** (two export modes + AES-GCM 256 + PBKDF2-SHA256 @ 600k + gzip + three independent version fields + AAD-bound header + RNG snapshot)
- [ADR-0002 Offline-first](../10-Architecture/09-Decisions/ADR-0002-offline-first.md) — **accepted 2026-05-16** (offline capability matrix + injectManifest + hybrid smart updates + cross-browser replay triggers + Chromium accelerator + 300 MB soft cap + Sync/Activity view + hard-reject UX)
- [ADR-0003 Match Engine](../10-Architecture/09-Decisions/ADR-0003-match-engine.md) — **accepted 2026-05-16** (framework-agnostic packages/match-engine; hybrid Markov + attribute rolls; per-event tick; TS-literal formation zone weights + JSON community overrides; set-piece routine library + Phase-2 per-club editor; namespaced-slug IDs; Worker bridge; ≤ 50 ms perf gate; engine version pinning)
- [Match Engine Runtime Strategy](../60-Research/match-engine-runtime-strategy.md) — **current 2026-05-17** (TypeScript MVP engine remains binding; post-MVP Rust/polyglot extraction requires measured need, stable contract, golden/statistical/determinism parity and operational readiness; defines `competitive-full` / `interactive-standard` / `background-detailed` / `background-fast` profiles)
- [Performance Budgets](../60-Research/performance-budgets.md) — **locked 2026-05-17** (D9; four-tier device matrix, CWV product targets, JS / DOM / heap / storage / SW budgets, world-size presets, no-3D match policy, phased CI test-rig strategy; carried into [arc42 §Crosscutting](../10-Architecture/08-Crosscutting.md))
- [ADR-0007 IP-clean Naming Schema + Data Generators](../10-Architecture/09-Decisions/ADR-0007-naming-schema.md) — **accepted 2026-05-17** (D2; fully procedural worldgen from single seed; hybrid wordlist + phonotactic names across 7 Tier-1 locale buckets; Wikidata CC0 + national open-data + GeoNames CC-BY 4.0 corpora; living-person filter; real-region + fictional-city policy; grammar-based crest generation with lazy SVG render + IndexedDB cache; 5-tier × 10-country club finance matrix; 16+4+8 player attribute schema; hybrid archetype + CA-budget + lazy-expansion player gen; adds GeneratorRng as RNG stream #9)
- [Data Generators - Names, Crests, Cities, Clubs, Players](../60-Research/data-generators.md) — **locked 2026-05-17** (D2 binding research note; full implementation reference for ADR-0007)
- [AI Manager Behaviour](../60-Research/ai-manager-behaviour.md) — **locked 2026-05-17** (D4 binding research note; utility-AI + FSM + heuristics architecture; 8 personality traits + 10 archetypes; 4 difficulty modes; in-match trigger-based decisions; out-of-match weekly tick with ~7 ms/club budget; world drift mechanics; AI career arcs; phased late-game content)
- [Narrative Content Pipeline](../60-Research/narrative-content-pipeline.md) — **locked 2026-05-17** (D15 binding research note; Markdown + frontmatter authoring → compiled locale-split JSON + typed TS message IDs; FormatJS / intl-messageformat ICU; 106 event families across 10 groups; 6 story arc state machines; 5-tone press conferences; auto-generated newspaper; multi-layer voice consistency with CI lint rules; personal life events toggleable; build-time-only LLM assistance; Git + Markdown + custom preview workflow; deterministic seeded variant selection)
- [Late-Game Systems](../60-Research/late-game-systems.md) — **locked 2026-05-17** (D6 binding research note; 3-tier continental cup stack per continent + IFC Club World Masters with IP-safe naming; dual-role Bundestrainer with 3 engagement levels + tournament management UX; Make Your Career manager creator + 5-branch talent tree + region-based reputation; 6-archetype ownership transitions + bankruptcy/administration; 3-layer Hall of Fame; 3-option Legacy mode with 3-tier cross-save Legacy perks; full 50-year save longevity stack including newspaper archive + records book + career phases UI + generational regens + Year-X events + continental power shifts)
- [Onboarding Strategy](../60-Research/onboarding-strategy.md) — **locked 2026-05-17** (D5 binding research note; 60-second FTUE + 4-step flow with mode-picker upfront + Advanced-setup escape; 12-message first-season inbox tutorial arc + 10-sender cast + per-sender voice cards; configurable Assistant Manager "Alex" + per-difficulty intensity scaling + sticky "Ask Assistant" button; feed-card daily action queue as Home primary UI with Gmail-style swipe; tutorial overlay hierarchy; returning-user recap; veteran skip + safety net; WCAG 2.2 AA / BITV 2.0 accessibility; PWA install prompt timing; achievement celebrations; onboarding-state IndexedDB schema)
- [Tactics & Formations](../60-Research/tactics-and-formations.md) — **locked 2026-05-17** (D3 binding research note; 20 formations + 50 roles + per-tier exposure 0/6/18 player instructions + 1/5/8 team instructions; FM-style tactical familiarity with squad-continuity factor + new-manager Similarity; 3-layer opposition template system with manager-signature templates + emergent club character; 3 universal touchline shouts; URL-encoded tactic share codes; touch-first UI patterns)
- [Player Strength Presentation](../60-Research/player-strength-presentation.md) — **locked 2026-05-17** (Impact Lens; no global OVR / universal stars; Role Impact + category scores + status signals + scouting confidence; Squad-owned `ImpactLensProjection` via `queryGateway`, cacheable in Dexie, no cross-context JOINs)
- [ADR-0019 Service-ready Modular Monolith + DDD](../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd.md) — **accepted 2026-05-16**
- [ADR-0011 Server-Authoritative Multiplayer](../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md) — **accepted 2026-05-16** (with hotseat handoff + hybrid AI-match policy including quality-profile persistence + encrypted saves)
- [ADR-0013 Transactional Outbox](../10-Architecture/09-Decisions/ADR-0013-transactional-outbox.md) — **accepted 2026-05-16** (SurrealDB outbox + Redis Streams + UUIDv7 + tiered retention + Zod forward-compat)
- [ADR-0017 Observability and Logging](../10-Architecture/09-Decisions/ADR-0017-observability-logging.md) — **accepted 2026-05-17** (OpenTelemetry + Grafana Loki/Prometheus/Tempo/Alloy + GlitchTip, privacy-aware client diagnostics, capped offline crash queues)
- [ADR-0018 Systemic Events and Player Lifecycle Architecture](../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle.md) — **accepted 2026-05-17** (domain-owned policies for player development, mentoring, injuries, match-day events and venue operations; `WorldEventDirector` as orchestration over existing contexts, not a new bounded context; narrative remains deterministic projection over structured facts)

### Proposed (Wave 2, awaiting promotion)

- [ADR-0012 Async Cadence Models](../10-Architecture/09-Decisions/ADR-0012-async-cadence-models.md)
- [ADR-0014 State Machines](../10-Architecture/09-Decisions/ADR-0014-state-machines.md)
- [ADR-0015 Spectator Snapshot Streaming](../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming.md)
- [ADR-0016 Community Dataset Overrides](../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides.md)

## Rule

Implement from accepted ADRs. Draft or proposed ADRs are planning context
only. Superseded ADRs are historical only.
