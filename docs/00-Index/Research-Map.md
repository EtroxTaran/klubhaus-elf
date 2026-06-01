---
title: Research Map
status: current
tags: [research, meta]
created: 2026-05-16
updated: 2026-06-01
type: map
binding: false
related: [[Current-State]]
---

# Research Map

Research notes preserve sources and options. They are inputs to decisions, not
binding implementation guidance unless promoted into ADRs, feature specs, or game
design notes.

## Summary

- [Research Summary](../60-Research/00-summary.md)
- [Documentation Baseline 2026-05-22](Documentation-V1.md) - current
  temporal/structural closure baseline for vault gaps.
- [Wave 3 Gap Analysis](../95-Archive/gap-reports/wave-3-gap-analysis.md) - superseded
  planning backlog; kept for traceability of W3 IDs.
- [Research Wave 2 Gaps](../95-Archive/gap-reports/research-wave-2-gaps.md) - superseded
  by Wave 3; kept for traceability of R2-01..R2-19 IDs.

## Pre-Mortem 2026-05-20 (Cluster, 3 Iterationen)

Antizipiert Failure-Modes für 10.000 Spieler in 6 Monaten über zwei Szenarien
(single-node Hetzner vs Cloud-Autoscaling).

**Iteration 1** (2026-05-20, commit `014b95b`): 4 Original-Reports
(Architecture, Tech-Ops, Gameplay, Monetization), 40 Findings.

**Iteration 2** (2026-05-20, commit `5db998f`): + Security & Integrity,
BYOC Future-Scope, Threat-Model, Iter-2-Addenda in Original-Reports.
+22 Findings.

**Iteration 3** (2026-05-20, commits `6267a3e`–`2366982`): 12 neue Deep-Dive-
Reports (Live-Ops, Legal/Tax, i18n, Accessibility, AI/LLM, Long-Term-Balance,
Community/UGC, Brand/PR, Browser/Storage, Test-Strategy, Vendor/ESG,
Responsible-Gaming/OSS). +129 Findings mit Quellen-Verifikation.

Total: **~191 Findings** mit stabilen IDs `PM-2026-05-20-XX-F-NN` zur Verkettung
mit Fixes (`Addresses PM-…` in Commits, PRs, ADR-Frontmatter). **P0–P4-Prioritäts-
Tagging** in `findings-registry.md`.

- [[../60-Research/pre-mortem/00-index]] — Cluster-Index, Heatmap, Cross-Cutting, Decision-Log
- [[../60-Research/pre-mortem/threat-model]] — Trust-Boundaries Z0–Z5, STRIDE-Matrix, Crypto-Bausteine
- [[../60-Research/pre-mortem/findings-registry]] — **~191 Findings mit P0–P4-Priorität**
- [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] - **Konzept-Closure fuer alle ehemals offenen Pre-Mortem-Findings**; 15 Solution Tracks, externe Best-Practice-Quellen, Wettbewerbsdifferenzierung, Statusregel `mitigated` vs `verified`
- [[../60-Research/pre-mortem/prioritization-matrix]] — P×I-Heatmap, Score×Effort-Hebel, Cross-Cutting-Cluster A–G, Regulatorische Deadlines, Sprint-Belegung
- [[../60-Research/pre-mortem/execution-index]] — **15 Expertise-Kategorien** (SEC/BACKEND/PLATFORM/FRONTEND/DETERMINISM/GAMEDESIGN/TEST/A11Y/LEGAL/PRODUCT/AI/COMM/BRAND/FOUNDER/SUSTAIN) mit Briefings + Findings + Output-Artefakten für frische Agenten

**Iteration 1 + Addenda:**
- [[../60-Research/pre-mortem/PM-2026-05-20-01-architecture]] — 10 Findings + Iter-2-Addendum, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-02-tech-and-ops]] — 10 Findings + Iter-2-Addendum, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-03-gameplay]] — 10 Findings + Iter-2-Addendum, max Score 20
- [[../60-Research/pre-mortem/PM-2026-05-20-04-monetization]] — 10 Findings + Iter-2-Addendum, max Score 25

**Iteration 2:**
- [[../60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity]] — 12 Findings, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-06-distributed-match-compute]] — 10 Findings, accepted-risk (Future-Scope)

**Iteration 3:**
- [[../60-Research/pre-mortem/PM-2026-05-20-07-live-ops-and-client-telemetry]] — 10 Findings, max Score 20
- [[../60-Research/pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax]] — 13 Findings, max Score 20
- [[../60-Research/pre-mortem/PM-2026-05-20-09-i18n-and-localization]] — 10 Findings, max Score 15
- [[../60-Research/pre-mortem/PM-2026-05-20-10-accessibility-and-inclusion]] — 11 Findings, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]] — 12 Findings, max Score 12
- [[../60-Research/pre-mortem/PM-2026-05-20-12-long-term-balance-and-meta]] — 10 Findings, max Score 20
- [[../60-Research/pre-mortem/PM-2026-05-20-13-community-moderation-and-ugc]] — 11 Findings, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-14-brand-pr-and-crisis-comms]] — 9 Findings + 12 Re-Branding-Candidates, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-15-browser-device-storage-matrix]] — 9 Findings, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]] — 10 Findings + 16-Layer-Test-Pyramid, max Score 20
- [[../60-Research/pre-mortem/PM-2026-05-20-17-vendor-lifecycle-and-sustainability]] — 12 Findings + Vendor-Risk-Matrix, max Score 25
- [[../60-Research/pre-mortem/PM-2026-05-20-18-responsible-gaming-and-open-source]] — 12 Findings + License-Decision-Matrix, max Score 20

## Wave 1 Research Notes

- [Anstoss Series Deep Dive](../60-Research/anstoss-series-deep-dive.md)
- [Club Boss Analysis](../60-Research/club-boss-analysis.md)
- [Competitor Matrix](../60-Research/competitor-matrix.md)
- [Feature Gap Analysis](../95-Archive/gap-reports/feature-gap-analysis.md)
- [IP And Licensing](../60-Research/ip-and-licensing.md)
- [PWA Offline Patterns](../60-Research/pwa-offline-patterns.md)

## Wave 2 Research Syntheses (2026-05-16)

- [Feature Library Synthesis](../60-Research/feature-library-synthesis.md)
- [Systems Design Synthesis](../60-Research/systems-design-synthesis.md)
- [Mode Design Research](../60-Research/mode-design-research.md)
- [Async Multiplayer Research](../60-Research/async-multiplayer-research.md)
- [Regulations and Pyramids Research](../60-Research/regulations-and-pyramids-research.md)
- [Fan Culture Segmentation Research](../60-Research/fan-culture-segmentation-research.md)
- [Progressive Disclosure Research](../60-Research/progressive-disclosure-research.md)

## Wave 3 Locked Research Notes (binding)

- [Offline MVP Scope and Future Sync Strategy](../60-Research/offline-mvp-scope-and-sync-strategy.md) — 2026-05-18. Locks hybrid-online MVP posture: app shell + safe read caches + local drafts; server-confirmed authoritative progression; selective offline-first singleplayer and export/import post-MVP but reserved by contracts.
- [Transfer Market Simulation - Valuation, AI Selling, Clauses and Negotiation](../60-Research/transfer-market-simulation.md) — ad-hoc locked synthesis (2026-05-17). Market value is a reference range, not final price; AI selling uses `sellPressure` vs `protectionScore`; offer packages are priced via cash-equivalent clause pricing; player / agent agency is separate from club agreement; full negotiation depth is tiered by world proximity for D9 budgets; plugs into D4 AI, D15 Transfer Saga and the Transfer bounded context.
- [Determinism, RNG and Replay - Locked Decisions](../60-Research/determinism-and-replay.md) — D8 (2026-05-16). PCG32, 8 RNG streams, hybrid replay format, integers/basis-points, 12 save-determinism rules, Chromium-only CI gate.
- [SurrealDB Schema Patterns](../60-Research/surrealdb-schema-patterns.md) — D14 (2026-05-16), **superseded** by [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]. Historical SurrealDB-substrate research; its substrate-agnostic invariants (per-save isolation, typed-vs-jsonb governance split, per-relationship modelling, standalone `packages/db-schema` Zod mirror, Dexie-only browser at MVP, query-gateway abstraction) were carried forward into the PostgreSQL + Drizzle model. Do not implement from this note.
- [Match Engine Simulation Model - Historical Input](../60-Research/match-engine-simulation-model.md) — D1 (2026-05-16, reopened by FMX-10 on 2026-05-27). Hybrid Markov + attribute rolls; per-event tick with integer-second simClock; event schema with typed payloads; hybrid zone+role formation influence; MatchCoreRng/MatchAiRng strict separation; old Web Worker/runtime assumptions superseded by the swappable spatial-event engine research.
- [Match Engine Runtime Strategy - TypeScript MVP with Polyglot Extraction Gate](../60-Research/match-engine-runtime-strategy.md) — 2026-05-17. Challenges the attached runtime technology report against accepted ADRs. Locks TypeScript as MVP authority, defines the post-MVP Rust/polyglot extraction gate, match quality profiles, interactive chunking and AI-adapter boundaries.
- [Telemetry, Privacy and GDPR - Locked Decisions](../60-Research/telemetry-privacy.md) — D11 (2026-05-17). Self-hosted diagnostics, consent categories, PII redaction, capped offline telemetry queues, retention, DSAR impact and ADR-0017 inputs.
- [GDPR Compliance — RoPA, lawful basis, retention, DPIA, DPO](../60-Research/gdpr-compliance.md) — F6 (2026-05-18, `current binding`). Full Article 30 Record of Processing Activities (8 activities × 6 data categories); lawful basis per activity (Art. 6(1)(b) contract for the core service + Art. 6(1)(f) legitimate interest for security + observability with two formal LIAs); confirmed **no Art. 9 special categories** (passkey credentials are public-key material, not biometric); 16+ self-declaration age gate (no parental-consent flow at MVP, no DOB collected); **no third-country transfers** (sidesteps Chapter V SCC / TIA / DPF paperwork entirely; GitHub explicitly assessed as non-processor for user data); processor Art. 28 DPA list (Hetzner + transactional email vendor only); full per-category retention schedule with permanent-audit-but-pseudonymised-on-Art.17 policy and cryptographic erasure via F5 envelope burn; **voluntary DPIA** with three-part legitimate-interest assessments (security anomaly + observability); **DPO not required** (Art. 37 + § 38 BDSG thresholds both below — founder designated as Privacy Lead); compliance overhead estimate (~7-15 founder days launch + ~3-5 days/year ongoing); legal-landscape framing (GDPR yes / ePrivacy yes / DSA de minimis / DMA no / AI Act low-risk / NIS2 no); future-proof triggers documented (payments / analytics / external IdP / scaling). Companion to [[../30-Implementation/privacy-and-consent]]. Anchors on D11 telemetry-privacy + F1 threat-model + F2 / F3 / F5; closes F2 FU-6 + F2 FU-7 + F3 FU-8 + F5 FU-8 + F5 FU-9.
- [Performance Budgets - Device Matrix, CWV Targets, CI Strategy](../60-Research/performance-budgets.md) — D9 (2026-05-17).
- [Presentation Renderer Strategy - Canvas 2D plus Three/R3F](../60-Research/presentation-renderer-strategy.md) — 2026-05-22. Promotes the attached renderer report and follow-up review into the decision basis for ADR-0041: MVP match remains Canvas 2D; optional post-MVP 3D/2.5D scenes are presentation-only, lazy-loaded, device-gated and fallback-safe; Three/R3F is the only planned optional 3D stack.
- [Data Generators - Names, Crests, Cities, Clubs, Players - Locked Decisions](../60-Research/data-generators.md) — D2 (2026-05-17).
- [AI Manager Behaviour - Architecture, Personalities, Difficulty, World Drift](../60-Research/ai-manager-behaviour.md) — D4 (2026-05-17).
- [Tactics & Formations - Mobile-first Manager Game Tactics Depth](../60-Research/tactics-and-formations.md) — D3 (2026-05-17).
- [Player Strength Presentation - Impact Lens](../60-Research/player-strength-presentation.md) — locked 2026-05-17. No global OVR / universal stars; role/tactic-contextual Impact Lens; category bars from D2 1-20 attributes; separate availability status; scouting uncertainty ranges; Squad-owned `ImpactLensProjection` via `queryGateway`.
- [Onboarding Strategy - FTUE, Inbox Tutorial, Feed-Cards, Accessibility](../60-Research/onboarding-strategy.md) — D5 (2026-05-17).
- [Late-Game Systems - Continental Cups, Bundestrainer, Ownership, Hall of Fame, Legacy](../60-Research/late-game-systems.md) — D6 (2026-05-17).
- [Narrative Content & Authoring Pipeline - Events, Story Arcs, Voice, Press, Newspaper](../60-Research/narrative-content-pipeline.md) — D15 (2026-05-17). Markdown + frontmatter source → compiled locale JSON + typed TS message IDs; FormatJS / intl-messageformat ICU MessageFormat. **106 event family IDs** across 10 groups (Match 18 / Squad-Player 20 / Board-Finance 16 / Tactical-Training 6 / Career 9 / Competition 9 / National Team 6 / Personal Life 6 / Rumours-Press 9 / Records-World 7). 3-7 reactive variants per family with context flags (storylet quality-gate model from Failbetter Games). Priority + frequency caps + spam guard. 6 story arc state machines (Transfer Saga / Takeover / Player Crisis / Bankruptcy / Rivalry / National Tournament). 5-tone press conferences (Calm / Critical / Defiant / Self-Deprecating / Ambitious) × 4 contexts with cumulative season effects. Auto-generated Anstoss-style newspaper (weekly + monthly + end-of-season + decade per D6). Multi-layer voice consistency: per-sender voice cards (D5 10 senders) + per-AI-archetype reactions (D4 10 archetypes × event families × tones = ~1500 slots) + CI lint rules. Personal life events layer (Anstoss flavour; toggleable On/Reduced/Off). Build-time-only LLM assistance (never runtime per D8). Git + Markdown + custom React preview app at MVP; Inlang/Tolgee evaluated post-MVP. Deterministic seeded variant selection via D8 RNG stream extensions. Content scale: MVP 80-120 templates → Phase 2 ~250 → Phase 3 ~500. First PWA manager to combine FM tagged event system + Anstoss Zeitung templating + Club Boss inbox cast + Failbetter storylet quality-gates + Disco Elysium voice consistency + Ink-style state-machine arcs. Comparative analysis vs FM PC story engine FM23+ / FM Mobile / Anstoss 3 Zeitung / Club Boss / EA SPORTS FC Career / 80 Days inkle / Failbetter Games / Disco Elysium / NBA 2K / MLB The Show. 3-tier continental cup stack per continent (Champions Cup / Continental League / Challenge Trophy) + global IFC Club World Masters; IP-safe fictional governing bodies (IFC / EFC / AFU / APFC / AFA). Classic 32-team groups + knockout MVP (Swiss model deferred). Country coefficient with biennial slot adjustment. National team mode dual-role with 3 engagement levels (Full Control / Match-Only / Light Touch); unlock at rep ≥ 75 + (5 seasons OR 3 trophies); 23-player squads; eligibility via birth + heritage; IFC Nations Championship every 4y + Continental Championships offset 2y; full tournament management UX. Make Your Career creator (Background + Coaching Badge + Tactical Specialisation + Nationality + Languages). 5-branch manager talent tree (Tactician / Motivator / Youth Developer / Transfer Guru / International Specialist). Region-based reputation per country + continent + global. **6 owner archetypes** (Sugar Daddy / Asset Stripper / Foundation-Community / Petrol-State / Murky / Foreign Business) with full Owner Profile schema + user decision points + FFP/regulatory risk hooks. Bankruptcy/administration system with heroic-save HoF credit. **3-layer Hall of Fame**: Manager per-save (top 20) + Manager cross-save global (top 10-20; deterministic-safe) + Club per-save (trophy cabinet + era detection + XI-of-decade + record signings) + Player Legends (Icon/Legend/Favourite tiers). 3-option Legacy mode (Chairman / new manager / hard retire). **3-tier cross-save Legacy perks** (meta-only, world-gen-time only; deterministic-safe per D8). Full 50-year save longevity stack: career phases UI + generational regens ("Son of X") + Year-X events (anniversaries / league reforms / stadium expansions) + cross-decade continental power shifts (era labels) + Anstoss-style newspaper archive + records book. First PWA manager to ship this stack — combines Anstoss-3 Bundestrainer + FM-PC long-save depth + CK3 cross-save HoF + Civ era system + Hattrick record books. Comparative analysis vs FM PC / FM Mobile / EA FC Career / PES / Top Eleven / OSM / Hattrick / Anstoss 3 / SM24 / Football Manager Online (Korea) / CK3 / Civ. 60-second FTUE: single experience question → silent tier+difficulty+club tier mapping → mode picker upfront (both Career + Roguelite day 0) → recommended club + Advanced setup escape → Home dashboard with first inbox tutorial card. 12-message first-season inbox tutorial arc over 4 in-game weeks (Assistant ~50% / Chairman 15% / DoF 20% / Head Scout 10% + 6 supporting senders); per-sender voice cards; pacing 4-6/wk arc → 3-4/wk → 2-3/wk; localised DE + EN templates ~7-10k words. Configurable Assistant Manager character ("Alex" default + 3-5 portraits); per-difficulty intensity (Easy proactive → Sim silent); user override toggle. Feed-card daily action queue as Home primary UI; 3-5 cards/day; Gmail-style swipe semantics (right=complete/open, left=snooze+undo); priority algorithm time-pressure + impact + player-behaviour. Tutorial overlay hierarchy (spotlight 3-4 max / coach marks 2-3 per screen / hint chips / modal full-screen). Returning-user "While you were away" recap auto-card after 7+ in-game days. Veteran skip with safety net (micro-tooltips + settings reset + struggle auto-detection). PWA install prompt per D9 budget. WCAG 2.2 AA / BITV 2.0 (linear semantic onboarding pages, focus-trapped coach marks, prefers-reduced-motion, redundant encodings, Read-aloud Web Speech API, one-handed mode, voice-control labels). Onboarding-state IndexedDB schema. Target D1 ≥ 30 % / D7 ≥ 12 % / D30 ≥ 5 % (between Top Eleven and FM Mobile). Comparative analysis vs FM PC / FM Mobile / Top Eleven / OSM / Hattrick / Anstoss 1-3 / Club Boss / SM24 / EA FC Career / PES. 20 formations (8 core + 12 advanced) approaching FM PC depth on mobile; 50 roles across 8 position groups; 0/6/18 player instructions per Quick/Standard/Expert tier; 1/5/8 team instructions per tier; 5-band visible mentality + 7 internal steps; light Expert per-phase overrides (4 phases); full FM-style tactical familiarity (single bar 0-100 + growth/decay/SwitchModifier/penalty curve + ContinuityMatchFactor + new-manager Similarity); tactic slots 2/3/3 + saved presets 0/10/50 per tier; 3-layer opposition template system (8 archetypes + ~25-30 sub-archetypes + manager-signature templates + emergent club character); 3 universal touchline shouts; tactical predictability penalty up to 5%; URL-encoded share codes per ADR-0016; touch-first UI (tap-to-place primary, drag in Expert only; bottom-sheet role pickers; segmented controls; accordion player instructions; 44×44 px touch targets); attribute schema reconciled with D2 (16 visible + 4 GK + 8 hidden on 1-20 scale). Comparative analysis vs FM PC / FM Mobile / SM24 / EA FC Mobile / PES Mobile / Anstoss / OSM / Top Eleven / Hattrick / Champ Man Mobile. Three-layer architecture: utility AI core + light FSM situation classifier + heuristic constraints. 8 primary personality traits + 3 derived; 10 archetypes (Park-the-Bus / Counter-Attacking / High-Pressing / Possession Maestro / Youth Developer / Galáctico / Moneyball / Tinkerman / Stabilizer / Chaos Motivator). Personality drifts ±0.2 over career. 4 difficulty modes (Easy / Normal / Hard / Sim) - FM-style constraints + AI optimisation, no AI stat cheats. Out-of-match: weekly per-club tick (transfers / contracts / squad / tactics / board / loans / youth / sponsors / facilities) within ~7 ms / club. In-match: 15-25 trigger-based decision passes per match within 30-50 ms budget. World drift: wage inflation, progressive FFP, talent diffusion (40 % elite regens off-top), tactical arms race, board expectation escalation. Structural events: Rising Rival (~5y) + Giant Collapse (~10y). Full AI career arcs at MVP: job churn, retirement at 60-70, legendary detection, rival tracking. Phased late-game content: 12 dynasty achievements + arms race + expectation escalation at MVP; national team / Hall of Fame / legacy mode post-MVP. Uses pre-allocated `WorldAiMgmtRng` (#2) + `MatchAiRng` (#4) with hierarchical sub-labels (D8 future-proof). Comparative analysis vs FM / FM Mobile / Anstoss 3 / EA FC Career / PES / OSM / Hattrick / SM24 / Champ Man. Hybrid wordlist + phonotactic name generation; 7-locale Tier-1 MVP rollout (DACH / British Isles / FR / ES / IT / Low Countries / Lusophone); Wikidata CC0 + UK ONS + INSEE + GeoNames CC-BY 4.0 corpora; living-person filter on Wikidata; "real-region + fictional-city" location policy with Bloom-filter rejection of real cities; grammar-based crest generation (7 shields × 8 divisions × 10 region-biased palettes × 40-50 charges) with lazy SVG render; 5-tier × 10-country club finance matrix (DE / EN / ES / IT / FR / PT / NL / BR / AR / JP); 16+4+8 player attribute schema on 1-20 scale; hybrid archetype-first + CA budget Dirichlet allocator across ~50 archetypes; **lazy expansion** for Tier C players (compact 12-byte profile; full attrs on demand); adds RNG stream #9 `GeneratorRng` with hierarchical sub-labels; ≤ 8 s world genesis on Snapdragon 695 for Large world (~62 500 players); comparative analysis vs FM / FM Mobile / Anstoss / Hattrick / Top Eleven / OSM / SM24 / EA FC / Champ Man. Four-tier device matrix (Premium / Standard / Floor / Off-target); CWV product targets (LCP <= 2.0 s mobile, INP <= 120 ms primary flows, CLS <= 0.05); Lighthouse mobile >= 90; JS bundle budgets (initial <= 200 KB / total <= 700 KB); virtualised tables + DOM-node caps; world-size presets (Small / Medium / Large); match render policy (Text & Stats + 2D canvas; no interactive/authoritative browser 3D match view); phased CI test rig (emulated MVP -> LambdaTest post-MVP -> hardware rig only if needed); comparative analysis vs FM Mobile / Top Eleven / OSM / Soccer Manager / Hattrick / EA FC Mobile / others.
- [Systemic Events, Player Development, Injuries and Venue Operations](../60-Research/systemic-events-player-development-venue-ops.md) — Locks the reconciled May 2026 research synthesis for player development, mentoring, training injuries, world events, narrative text and multi-use arenas. Decision: domain-owned policies coordinated by deterministic event orchestration, not one random-event system. Reconciles PA as true underlying potential plus scouting uncertainty range; keeps the 16+4+8 player attribute schema; makes injury risk multifactor rather than a single workload threshold; keeps narrative template-first and deterministic; treats runtime AI text as a separate research track; maps venue operations to weekly/event-based Club Management rules.
- [Threat Model - STRIDE × Bounded Context, Attacker Tiers, Trust Boundaries, Controls](../60-Research/threat-model.md) — F1 (2026-05-18). Binding security reference for the project. STRIDE per asset × bounded context (41 threats across 11 contexts); attacker scope T0-T4 in / T5-T6 partial / T7-T9 out with explicit cost-benefit rationale; trust-boundary diagram (Client / Edge / App / Match Worker / DB / Redis / Observability); crypto refinements to ADR-0005 (PBKDF2 stays MVP, Argon2id when portable-export UI ships; 1M-encryption soft cap; compress-then-encrypt safe at rest; no XChaCha20-Poly1305 at MVP); 9 residual risks accepted with re-evaluation triggers; 9 follow-up tasks anchored to F5/F6/F10/F11/E10/E11; 7 product Q&A surfaced for Nico. Anchors all of F2 / F3 / F5 / F6 / F10 / F11 / F12 / F13 / C6 / C8 / D18.

## Incoming Design Research (2026-05-27, draft inputs)

Six external research reports Nico provided on 2026-05-27, filed verbatim as
`status: raw` copies with a single triage note above them. **Inputs only — not
binding.** The triage note flags four divergences from locked decisions
(attribute count, runtime LLM ×2, realtime transport) that need owner decisions
before any promotion.

- [[../60-Research/incoming-design-research-2026-05-27]] — triage + vault mapping
  + divergence flags for all six reports. Raw copies:
  [[../60-Research/raw-perplexity/raw-player-and-staff-values]] (vs 16+4+8 schema),
  [[../60-Research/raw-perplexity/raw-character-personality-and-dialogue]] (runtime-LLM divergence),
  [[../60-Research/raw-perplexity/raw-ai-llm-usage]] (calc-first principle confirms; runtime scope-gated),
  [[../60-Research/raw-perplexity/raw-roguelite-meta-progression]] (additive to Roguelite/late-game),
  [[../60-Research/raw-perplexity/raw-club-economy-simulation]] (economy detail),
  [[../60-Research/raw-perplexity/raw-match-engine-offline-and-disconnect]] (confirms ADR-0011/0020/0024/0026).

## Manager Archetype Roguelite Progression (2026-05-27)

- [[../60-Research/manager-archetype-roguelite-2026-05-27]] — FMX-16
  synthesis of the Roguelite meta-progression raw report into the draft
  Manager-Archetype path: MVP hooks only, emergent-hybrid identity, proposed
  Manager & Legacy context, balance-corridor perks, mandatory prestige
  counterweight and playtest-tunable taxonomy/thresholds. Feeds draft
  [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]],
  [[../20-Features/feature-roguelite-mvp-first-playable]] and
  [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]].

## Club Economy Blueprint (2026-05-27)

- [[../60-Research/club-economy-blueprint-2026-05-27]] — FMX-13 synthesis of the
  club-economy raw report into the draft Economy MVP pillar: weekly ledger, full
  accounting, staged insolvency, Top-5 country profiles + abstract fallback and
  the original SP-only investor planning line. Feeds draft
  [[../50-Game-Design/GD-0008-finance-economy]],
  [[../20-Features/feature-club-economy-mvp-pillar]] and
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]].

## Club Economy Impact Map and Commercial Contracts (2026-05-28)

- [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  — FMX-41 synthesis for direct financial-success domains: fan demand,
  season tickets, single-ticket/top-match pricing, catering, merchandise,
  sponsorship, cup revenue, fan-service campaigns and Investor clean
  singleplayer cash. Feeds draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  and [[../30-Implementation/club-economy-commercial-contracts]].

## Fan Demand and Price Elasticity (2026-05-28)

- [[../60-Research/fan-demand-price-elasticity-2026-05-28]] — FMX-42 synthesis
  for supporter segments, latent demand, season-ticket renewal, price
  elasticity, top-match surcharges, capacity pressure and ticketing-trust
  backlash. Recommends segment-specific latent demand plus trust guardrails,
  not one global elasticity constant. Refines draft [[../50-Game-Design/audience-and-atmosphere]],
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]] and
  [[../30-Implementation/club-economy-commercial-contracts]].

## Season-Ticket Lifecycle and Accounting (2026-05-28)

- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]] —
  FMX-43 synthesis for season-ticket campaign lifecycle, seat-class quotas,
  renewal / relocation / waitlist / public-sale states, group-level
  no-show/release/compensation policy and full accrual accounting. Recommends
  fan-group cohorts plus `SeasonTicketCampaign` and
  `SeasonTicketAccountingSchedule`, not individual supporter records or a
  cash-only slider. Refines draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]], [[../50-Game-Design/audience-and-atmosphere]],
  [[../50-Game-Design/stadium-and-campus]] and
  [[../30-Implementation/club-economy-commercial-contracts]].

## Commercial Contract Lifecycle and Breach Model (2026-05-28)

- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  — FMX-44 synthesis for a shared commercial-contract lifecycle and breach
  model across sponsorship, catering, merchandise, hospitality, supplier and
  venue-activation deals. Recommends a shared `CommercialContract` shell with
  family-specific schedules, cash/recognition separation,
  category/territory/asset exclusivity, curable/material/critical breach
  severity, renewal windows, Quick / Standard / Expert surfaces and AI-club
  hooks reserved for FMX-51. Refines draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/sponsorship-portfolio]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../20-Features/feature-club-economy-mvp-pillar]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  and [[../30-Implementation/club-economy-commercial-contracts]].

## Cup and Competition Revenue Profiles (2026-05-28)

- [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]] —
  FMX-45 synthesis for domestic cup and continental competition revenue. Covers
  Germany, England, Spain, Italy, France and UEFA-style patterns; translates
  prize ladders, gate sharing, ticket allocation, media/facility fees,
  travel/security, neutral finals, solidarity, fixture congestion and
  expected-value / elimination-shock logic into IP-clean
  `CompetitionRevenueProfile` templates. Refines draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/regulations-and-compliance]],
  [[../20-Features/feature-club-economy-mvp-pillar]],
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  and [[../30-Implementation/club-economy-commercial-contracts]].

## Matchday Operating Costs and Risk-Cost Settlement (2026-05-29)

- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  — FMX-46 synthesis for realistic but fair matchday operating-cost and risk
  settlement. Covers stewarding, private security, policing contribution,
  medical, cleaning/waste, energy, temporary staff, officials, pitch recovery,
  damage reserve, sanctions, sector closures, away-fan restrictions, alcohol
  restrictions and ghost matches. Recommends a CommercialPortfolio-owned
  `MatchdayOperatingCostProfile` plus ADR-0050 ledger postings by Club
  Management. Refines
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/regulations-and-compliance]],
  [[../50-Game-Design/matchday-event-engine]],
  [[../50-Game-Design/rivalry-system]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../50-Game-Design/audience-and-atmosphere]],
  [[../20-Features/feature-club-economy-mvp-pillar]],
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  and [[../30-Implementation/club-economy-commercial-contracts]].

## Catering and Merchandise Operations Depth (2026-06-01)

- [[../60-Research/catering-and-merchandise-operations-2026-06-01]] —
  FMX-47 synthesis for catering and merchandise operations beyond flat revenue
  percentages. Adds the operating-model dial (in-house / concession / management-
  fee / revenue-share / MAG for catering; own-store / licensed-partner / kit-
  supplier-guarantee / pure-licensing for merchandise), an explicit cost/inventory
  side (COGS, labour, waste, stockout, markdown, write-down, returns), merchandise
  demand spikes, service-quality → Audience & Atmosphere coupling, alcohol-policy
  revenue↔safety dial, supplier pouring-rights/exclusivity carve-outs and IFRS 15
  cash-vs-recognition. Stays inside CommercialPortfolio (ADR-0061) with Club
  Management as sole ledger writer. Refines draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../30-Implementation/club-economy-commercial-contracts]],
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  and [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]].

## AI Narrative Runtime Integration (2026-05-27)

- [[../60-Research/ai-narrative-runtime-integration]] — synthesized follow-up
  for the two narrative/LLM raw reports. Captures Nico's current preferences:
  OpenRouter as the experimental provider path, no clear user data / PII / raw
  free text in prompts, Runtime-LLM outside authoritative state, and the
  original async-flavour re-evaluation path. Superseded for current MVP scope by
  the 2026-05-28 Full Dialogue synthesis. Feeds draft
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] and draft
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## AI Narration, World and Dialogue MVP (2026-05-28)

- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]] — FMX-3
  synthesis after Nico selected **Full Dialogue**, **All Active** actor context
  and **First Exposure** disclosure as the draft MVP direction. Captures
  deterministic world/persona generation for players, staff, board, media,
  journalists, fan groups, fan reps and agents; `NarrativeContextCard`;
  OpenRouter provider gates; AI Act/GDPR/OWASP/NIST safety gates; and the
  test/evaluation matrix. Feeds draft
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]], draft
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]],
  draft [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]],
  draft [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  and [[../20-Features/feature-ai-narration-mvp-pillar]].

## AI Narration Testing and Framework (2026-05-28)

- [[../60-Research/ai-narration-testing-framework-2026-05-28]] — FMX-3
  synthesis after Nico asked for remaining research, testing and clear
  framework structures. Captures the chosen **Narrative Context** boundary and
  **Playtest First** posture: contract-first `NarrativeContextCard`, storylet
  and template fallback framework, eval corpus, Zod/Vitest/fast-check/
  Playwright test tiers, OWASP/NIST/EU AI Act safety gates, season simulation,
  and human playtest rubric. Feeds draft
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  and [[../30-Implementation/ai-narration-contract-testing-framework]].

## EOS Player, Staff, Skills and Personas (2026-05-28)

- [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]] — FMX-23
  synthesis of the Player & Staff Values report plus follow-up Perplexity/Web
  research into a draft path: retain 16+4+8 attributes, add player skills/perks
  as a separate visible layer, model staff skills as target system, use hidden
  OCEAN as persona substrate and propose People / Persona & Skills as a new
  bounded context. Feeds draft
  [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]],
  [[../20-Features/feature-eos-player-skills-and-people-context]] and
  [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]].

## Player, Staff Development and Decision Influence (2026-05-28)

- [[../60-Research/player-staff-development-decision-model-2026-05-28]] —
  FMX-38 synthesis for how player attributes, hidden meta, skills, persona,
  relationships, staff roles and staff pipelines influence development, match,
  scouting and transfer decisions. Defines factor matrices, identifies the
  People-to-Training/Transfer bridge gaps and keeps staff-skill MVP activation
  as a Nico-gated A/B/C decision. Feeds draft
  [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]],
  [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]],
  [[../20-Features/feature-player-lifecycle]],
  [[../20-Features/feature-training-medicine]],
  [[../20-Features/feature-transfer-market-ai-and-contracts]] and
  [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]].

## Swappable Spatial-Event Match Engine (2026-05-27)

- [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]] —
  synthesized FMX-10 follow-up for match-engine exchangeability, spatial-event
  model, runtime strategy, OSS due diligence, disconnect handling, offline
  staging and LLM ticker boundary. Captures Nico's current direction:
  swappable engine boundary, **Spike, Rust-default**, study/spike-only OSS
  usage, server-authoritative canonical matches and 2D/ticker/replay from
  committed event/spatial facts. Feeds draft
  [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  and amends draft [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## Raw Perplexity transcripts (Wave 2)

- [[../60-Research/raw-perplexity/README]] - lossless input preservation; not authoritative. Includes [[../60-Research/raw-perplexity/raw-player-strength-overview]] as the source input for the Impact Lens synthesis.
- [[../60-Research/raw-perplexity/raw-transfer-market-research]] - Nico's attached transfer-market research prompt; promoted into [[../60-Research/transfer-market-simulation]].
- [[../60-Research/raw-perplexity/raw-ai-narration-mvp-research-2026-05-28]] -
  Runtime LLM narration/dialogue best practices, fallback, validation,
  cache/cost/latency and season memory.
- [[../60-Research/raw-perplexity/raw-ai-narration-compliance-safety-2026-05-28]] -
  EU AI Act, GDPR, OWASP, monitoring, kill switch and release gates.
- [[../60-Research/raw-perplexity/raw-ai-world-persona-generation-2026-05-28]] -
  generated players, staff, board, media, fan groups, fan reps, values and
  relationship graph.
- [[../60-Research/raw-perplexity/raw-ai-narration-evaluation-testing-2026-05-28]] -
  eval corpus, structured output validation, fact grounding, CI tiers and
  telemetry.
- [[../60-Research/raw-perplexity/raw-ai-narration-security-testing-2026-05-28]] -
  prompt injection, PII minimization, unsafe output, provider outage and
  disclosure tests.
- [[../60-Research/raw-perplexity/raw-ai-narration-interactive-narrative-qa-2026-05-28]] -
  storylets, persona cards, relationship memory, deterministic fallbacks and
  long-season narrative QA.

## Research Rules

- Use Ref for library, framework, API, and SDK documentation.
- Use Perplexity for broader external research; wired automatically via
  `.cursor/mcp.json`, see [[../90-Meta/mcp-memory-integration]].
- Keep citations and assumptions in the research note.
- Promote final choices into accepted ADRs or approved product/game notes.
