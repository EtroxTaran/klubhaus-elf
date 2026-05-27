---
title: Research Summary
status: current
tags: [research, summary]
updated: 2026-05-27
---

# Research Summary

## Phase 1 — Research Wave 1 (Milestone M1.1, 100 %)

| # | Doc | Status |
|---|---|---|
| 1 | [[anstoss-series-deep-dive]] — Anstoss design DNA, weekly heartbeat, mechanics map, IP boundaries, 17 MVP/post-MVP recommendations | Done |
| 2 | [[club-boss-analysis]] — Mobile chairman loop, inbox-as-narrative, 14 product takeaways, IP risk notes | Done |
| 3 | [[competitor-matrix]] — 8 products, feature coverage, differentiation quadrant, MVP-expectation risks | Done (extended in Wave 2) |
| 4 | [[ip-and-licensing]] — License matrix, hard-stop list, fictional naming schema, ADR-0007 direct input, 5 needs-decision items | Done |
| 5 | [[pwa-offline-patterns]] — Dexie 4 architecture, migrations, SW update strategy, outbox, iOS/Android quotas, ADR-0002 + ADR-0005 inputs | Done |

## Phase 1 — Research Synthesis (Milestone M1.2)

- [[../95-Archive/gap-reports/feature-gap-analysis]] — MoSCoW scope MVP → M8, **populated by Wave 2**.
- Phase 1 consolidation rewrite of this file - this version covers Wave 2.

## Phase 2 — Research Wave 2 (2026-05-16)

Raw Perplexity transcripts preserved in [[raw-perplexity/README|raw-perplexity/]];
synthesised research outputs:

| # | Doc | Topic |
|---|---|---|
| 6 | [[feature-library-synthesis]] | Consolidated competitor inventory (8+3 products) |
| 7 | [[systems-design-synthesis]] | 7-pillar club model + 5 feedback loops |
| 8 | [[mode-design-research]] | 2x2 mode matrix, roguelite + career patterns |
| 9 | [[async-multiplayer-research]] | Fixed/Dynamic cadence + watch-party + escalation |
| 10 | [[regulations-and-pyramids-research]] | DFB / FA / LFP / FIGC / LaLiga regulation map |
| 11 | [[fan-culture-segmentation-research]] | 6-segment supporter ecology + atmosphere engine |
| 12 | [[progressive-disclosure-research]] | Quick / Standard / Expert UI tiers |

Wave 2 unblocks ADR-0003 (match engine via systems-design-synthesis),
ADR-0004 (data model via Bounded Context Map), ADR-0008 (mobile-first UI via
progressive-disclosure), and the M2-M8 seed epics. It also proposes new ADRs
ADR-0010..ADR-0016 - see [[../00-Index/Decision-Log]].

## Phase 1 — Identified Wave 2 gaps

See [[../95-Archive/gap-reports/research-wave-2-gaps]] for the historical
prioritised list of deeper research that Wave 1 surfaced but did not cover.
Most items resolved in Wave 2; the archived note is traceability only.

## Phase 3 - Documentation baseline (2026-05-22)

[[../00-Index/Documentation-V1]] supersedes
[[../95-Archive/gap-reports/wave-3-gap-analysis]] as the active
documentation/architecture gap baseline.
Wave 3 remains a historical planning backlog with stable W3 IDs and is no longer active.

The current state is:

- No known undocumented or unclassified vault gaps as of 2026-05-22.
- All formerly open pre-mortem findings are concept-closed as `mitigated`, or
  explicitly `accepted-risk` for BYOC.
- Draft/proposed ADRs, GDDRs and feature stubs are future-scope or optional
  cleanup unless promoted by owner decision.
- Evidence gates remain tracked through implementation: tests, drills, legal
  sign-off, release artifacts and production telemetry.
## Ad-hoc Transfer Market Synthesis (2026-05-17)

[[transfer-market-simulation]] promotes Nico's attached transfer-market
research into a current binding synthesis. It reconciles the new ideas with D4
AI Manager Behaviour, D8 Determinism, D9 Performance Budgets, D15 Narrative
Content and the Transfer bounded context.

## MVP Offline Scope Synthesis (2026-05-18)

[[offline-mvp-scope-and-sync-strategy]] supersedes the old MVP assumption that
full offline-first singleplayer must ship immediately. The new binding direction
is a hybrid-online, offline-ready MVP: app shell, safe read caches and local
drafts now; server-confirmed authoritative progression; selective offline-first
singleplayer and export/import after MVP with contracts reserved from day one.

## Presentation Renderer Strategy (2026-05-22)

[[presentation-renderer-strategy]] promotes the attached renderer report and
follow-up architecture review into durable research and feeds
[[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]].
The conclusion: keep MVP match presentation Text & Stats + Canvas 2D; permit
optional post-MVP 2.5D/3D presentation scenes only as non-authoritative,
lazy-loaded, device-gated modules with fallback. **Babylon.js** is the planned
optional 3D engine ([[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]);
Three.js/R3F (the earlier choice), PixiJS and PlayCanvas are not planned.

## Pre-Mortem Cluster (2026-05-20, 3 Iterationen)

[[pre-mortem/00-index]] is the entry point to the pre-mortem cluster
covering all major domains across **3 iterations** for the
6-month / 10.000-player horizon (single-node Hetzner vs. cloud autoscaling).

- **Iteration 1**: 4 original reports — architecture, tech & ops, gameplay,
  monetization (40 findings).
- **Iteration 2**: [[pre-mortem/PM-2026-05-20-05-security-and-integrity|Security
  & Integrity]], future-scope [[pre-mortem/PM-2026-05-20-06-distributed-match-compute|BYOC]],
  cross-cutting [[pre-mortem/threat-model|threat-model]], Single-Player-
  Foundation-Addenda in original reports (+22 findings).
- **Iteration 3**: 12 deep-dive reports —
  [[pre-mortem/PM-2026-05-20-07-live-ops-and-client-telemetry|Live-Ops]],
  [[pre-mortem/PM-2026-05-20-08-legal-consumer-law-and-tax|Legal/Tax (beyond DSGVO)]],
  [[pre-mortem/PM-2026-05-20-09-i18n-and-localization|i18n]],
  [[pre-mortem/PM-2026-05-20-10-accessibility-and-inclusion|Accessibility]],
  [[pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks|AI/LLM]],
  [[pre-mortem/PM-2026-05-20-12-long-term-balance-and-meta|Long-Term Balance]],
  [[pre-mortem/PM-2026-05-20-13-community-moderation-and-ugc|Community/UGC]],
  [[pre-mortem/PM-2026-05-20-14-brand-pr-and-crisis-comms|Brand/PR + Re-Branding]],
  [[pre-mortem/PM-2026-05-20-15-browser-device-storage-matrix|Browser/Storage]],
  [[pre-mortem/PM-2026-05-20-16-test-strategy-depth|Test-Strategy]],
  [[pre-mortem/PM-2026-05-20-17-vendor-lifecycle-and-sustainability|Vendor/ESG]],
  [[pre-mortem/PM-2026-05-20-18-responsible-gaming-and-open-source|Responsible-Gaming/OSS]]
  (+129 findings, each with verified sources + accessed-dates).

**~191 findings total** with stable IDs (`PM-2026-05-20-XX-F-NN`) + **P0–P4
priority tagging**. Cite via `Addresses PM-…` in commits, PRs, ADR-Frontmatter.
Aggregated status sorted by priority lives in [[pre-mortem/findings-registry]].

**Gap Closure (2026-05-22).** [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
closes the research/concept layer for every formerly open Pre-Mortem finding
through 15 Solution Tracks, external best-practice sources and explicit market
differentiation. `mitigated` means concept closure; `verified` still requires
downstream implementation evidence.

**Fresh-agent navigation:** [[pre-mortem/execution-index]] organises every
finding into 15 expertise categories (SEC, BACKEND, PLATFORM, FRONTEND,
DETERMINISM, GAMEDESIGN, TEST, A11Y, LEGAL, PRODUCT, AI, COMM, BRAND, FOUNDER,
SUSTAIN), each with self-contained briefing + finding list + expected output
artefacts. [[pre-mortem/prioritization-matrix]] gives P×I-heatmap,
Score×Effort-lever, Cross-Cutting-Cluster A–G, regulatory deadlines and the
T-90 → T-0 sprint allocation.

## Incoming Design Research Triage (2026-05-27)

[[incoming-design-research-2026-05-27]] files six external research reports
(Perplexity-style, German) Nico provided on 2026-05-27 and maps each to the
decision layer. Verbatim `status: raw` copies live in
[[raw-perplexity/README|raw-perplexity/]]. The reports cover player & staff
value systems ("EOS" attributes), an actor-personality + player-dialogue layer,
an AI/LLM use-case matrix, Roguelite meta-progression, a club economy model, and
match-engine offline/disconnect handling.

The triage records four **divergences from locked decisions** that need owner
decisions before any promotion — none are implemented by being filed:

1. **Attribute count** — report #1's 20–24 visible vs. the locked **16+4+8**
   schema (D2 [[data-generators]] / ADR-0007 / ADR-0018). Locked schema stands.
2. **Runtime LLM (dialogue)** — report #2's runtime dialogue service vs. the
   **no-runtime-LLM** MVP line (D8/D15). Build the intent/persona/template
   skeleton LLM-free; runtime phrasing is Future-Scope-Gate.
3. **Runtime LLM (narrative)** — report #3's runtime OpenRouter calls; same
   gate. Its calc-first / deterministic-fallback *principle* confirms D8/D15.
4. **Realtime transport** — report #6's Colyseus/Nakama vs. the locked
   **SSE → Centrifugo** (ADR-0023). Tooling illustrative only.

Reports #4 (Roguelite meta) and #5 (economy) are additive enrichment for
[[../50-Game-Design/mode-create-a-club-roguelite]] / [[late-game-systems]] and
[[../50-Game-Design/economy-system]]; report #6 otherwise **confirms**
ADR-0011/0020/0024/0026 and [[match-engine-runtime-strategy]].

## Manager Archetype Roguelite Progression (2026-05-27)

[[manager-archetype-roguelite-2026-05-27]] promotes report #4 into a sourced
FMX-16 draft path. Nico's current direction is: MVP-relevant hooks only,
emergent-hybrid manager identity, proposed Manager & Legacy context ownership,
balance-corridor perks with a mandatory prestige counterweight, no in-run grind
checklists, and explicit playtest tunability for thresholds, taxonomy, perk
strength and UI emphasis.

This feeds draft
[[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]], amends
[[../20-Features/feature-roguelite-mvp-first-playable]] and
[[../50-Game-Design/mode-create-a-club-roguelite]], and creates draft
[[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]].

## Club Economy Blueprint (2026-05-27)

[[club-economy-blueprint-2026-05-27]] promotes report #5 into a sourced FMX-13
draft path. Nico's current direction is: Economy as an MVP pillar, weekly
ledger, full accounting, staged insolvency, Germany/England/France/Italy/Spain
country profiles plus abstract fallback, ranges/formulas instead of final
balance constants, Progressive UI, and Investor rescue as SP-only future-scope.

This feeds draft [[../50-Game-Design/GD-0008-finance-economy]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], draft
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] and
draft [[../30-Implementation/club-economy-accounting-ledger]].

## AI Narrative Runtime Integration (2026-05-27)

[[ai-narrative-runtime-integration]] synthesizes the two narrative/LLM reports
into a promotion path. It records Nico's product intent: the long-term goal is a
save that produces a personal, retellable football story, with recurring
players, journalists, board personalities, fan reps and media arcs.

Current draft direction:

- MVP Runtime-LLM may be re-evaluated for async flavour only (post-match
  newspaper, injury/event reports, weekly summaries, fixed transfer-result
  flavour).
- Press conferences and player one-to-one talks are important future tracks,
  not the first Runtime-LLM candidate.
- Actor traits and selected intents may affect mechanics deterministically;
  generated prose never creates facts or changes state.
- OpenRouter is the preferred experimental provider path, behind an adapter.
- Clear user data, PII, secrets and raw free text are not sent to LLMs.
- Nico prefers central info/settings disclosure; legal sufficiency remains
  unresolved until the Article 50 release gate.

This feeds draft [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
and draft [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## Swappable Spatial-Event Match Engine (2026-05-27)

[[swappable-spatial-event-match-engine-2026-05-27]] synthesizes the FMX-10
follow-up research on match-engine runtime, exchangeability, spatial-event
simulation, open-source candidates, offline/disconnect handling and LLM ticker
boundaries.

Current draft direction:

- Match engine is planned as a **swappable spatial-event component**, not a
  concrete TypeScript package.
- Runtime posture is **Spike, Rust-default**: compare a small TS and Rust native
  contract slice; choose Rust native as first authority if it shows no clear
  disadvantage.
- OpenFootball / OpenFootManager / RoboCup / Google Research Football and
  physics/ECS libraries are **study + spike inputs only**; no code reuse without
  separate license/code ADR.
- 2D Canvas, ticker, replay and LLM commentary consume committed event/spatial
  facts, never engine internals.
- Offline remains A -> C: hybrid-online MVP now, command-first offline
  manager-week later.

This feeds draft
[[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
and amends draft [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
for key-event match ticker commentary.

## Isometric Stadium & Campus Presentation (2026-05-27)

[[isometric-stadium-campus-research]] grounds the interactive styleguide's
isometric club-campus 3D scene (Anstoss-style stadium + infrastructure): what such
a view shows — mapped to [[../50-Game-Design/stadium-and-campus]] and
[[anstoss-series-deep-dive]] — Babylon.js isometric best-practices, an asset / AI
text-to-3D appendix (with prompt templates) for an optional future pass, and the
decision to build the demo scene **procedurally** under
[[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]] /
[[presentation-renderer-strategy]].
