---
title: Raw Perplexity Research Transcripts
status: raw
tags: [research, raw, perplexity, wave-2, player-strength, matchday, operations, financing, debt, calibration, soak-test, privacy, gdpr, ip, naming, narrative, newsworthiness, dialogue, intents, effects, media, press, fixture, competition, commercial, discipline, suspension, appeals, opposition, tactics, statistics, analytics, standings, read-model, insolvency, ledger, chart-of-accounts, category-code, match-engine, determinism, runtime, replay, quality-profile, monetization, no-p2w, compliance, legal, ai-world, world-drift, onboarding, ftue, contract-lifecycle, ai, llm, fallback, fmx-31, fmx-52, fmx-54, fmx-67, fmx-78, fmx-80, fmx-81, fmx-83, fmx-87, fmx-88, fmx-91, fmx-94, fmx-99, fmx-131, fmx-133, fmx-135, fmx-146, fmx-147, fmx-150, fmx-191, fmx-194]
created: 2026-05-16
updated: 2026-06-13
type: index
binding: false
related: [[../00-summary]], [[../../00-Index/Research-Map]], [[../chart-of-accounts-and-category-catalog-2026-06-13]], [[../incoming-design-research-2026-05-27]], [[../manager-archetype-roguelite-2026-05-27]], [[../swappable-spatial-event-match-engine-2026-05-27]], [[../eos-player-staff-skills-and-personas-2026-05-28]], [[../ai-narration-world-and-dialogue-mvp-2026-05-28]], [[../ai-narration-testing-framework-2026-05-28]], [[../ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]], [[../newsworthiness-event-publication-semantics-2026-06-04]], [[../dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../player-discipline-sub-aggregate-2026-06-05]], [[../opposition-template-ai-consumption-contract-2026-06-05]], [[../statistics-analytics-read-model-owner-2026-06-05]], [[../standings-authority-league-vs-statistics-2026-06-12]], [[../insolvency-ledger-posting-contract-2026-06-12]], [[../quality-profile-enum-settlement-path-2026-06-12]], [[../narrative-content-bounded-context-2026-06-02]], [[../commercial-contract-lifecycle-and-breach-model-2026-05-28]], [[../cup-and-competition-revenue-profiles-2026-05-28]], [[../fixture-commercial-revenue-profiles-2026-06-03]], [[../ai-world-drift-algorithm-2026-06-03]], [[../onboarding-guided-first-season-2026-06-03]], [[../player-contract-lifecycle-fsm-2026-06-03]], [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../catering-and-merchandise-operations-2026-06-01]], [[../investor-compliance-and-entitlement-boundary-2026-06-01]], [[../fan-service-campaign-catalog-and-effects-2026-06-01]], [[../club-financing-tools-2026-06-01]], [[../economy-calibration-and-soak-test-scenarios-2026-06-01]], [[../fan-persona-privacy-and-naming-2026-06-01]]
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

## Ad-hoc report imports (2026-05-27)

Six external research reports (Perplexity-style, German) Nico provided on
2026-05-27. Unlike the Wave-2 transcripts above, these are **committed** to the
vault as verbatim copies (each carries `status: raw` frontmatter + a
provenance banner). Their analysis, vault mapping and divergence flags live in
the triage note [[../incoming-design-research-2026-05-27]].

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-player-and-staff-values]] | Player/staff value systems competitor sweep + "EOS" attribute proposal | [[../data-generators]] · [[../incoming-design-research-2026-05-27]] |
| [[raw-character-personality-and-dialogue]] | Personality model for all actors + intent-based player dialogue layer | [[../narrative-content-pipeline]] · [[../incoming-design-research-2026-05-27]] · [[../ai-narrative-runtime-integration]] |
| [[raw-ai-llm-usage]] | LLM use-case matrix, cost model, offline fallback architecture | [[../narrative-content-pipeline]] · [[../incoming-design-research-2026-05-27]] · [[../ai-narrative-runtime-integration]] |
| [[raw-roguelite-meta-progression]] | Run/meta split, behaviour-based perk unlocks, legacy world-carry | [[../late-game-systems]] · [[../incoming-design-research-2026-05-27]] · [[../manager-archetype-roguelite-2026-05-27]] |
| [[raw-club-economy-simulation]] | Full club economy model: cashflow, revenue/cost, insolvency, infrastructure | [[../../50-Game-Design/economy-system]] · [[../incoming-design-research-2026-05-27]] |
| [[raw-match-engine-offline-and-disconnect]] | Where match computes, offline PWA scope, disconnect/reconnect handling | [[../match-engine-runtime-strategy]] · [[../incoming-design-research-2026-05-27]] |

## FMX-10 follow-up Perplexity research (2026-05-27)

Additional Perplexity research was run during FMX-10 after Nico re-questioned
the match-engine runtime and exchangeability posture.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-swappable-spatial-event-match-engine-runtime]] | Runtime strategy, spatial-event model, OSS candidates and replacement/determinism contracts | [[../swappable-spatial-event-match-engine-2026-05-27]] · [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] |

## FMX-23 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-23 after Nico asked for
player/staff skills, perks and clearer people/persona constellations.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ea-fc26-fm-skills-persona-perplexity-2026-05-28]] | EA FC 26 / Football Manager skills, perks, staff and mixed OCEAN + football-domain persona model | [[../eos-player-staff-skills-and-personas-2026-05-28]] · [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] · [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] |

## FMX-31 follow-up Perplexity research (2026-06-02)

Additional Perplexity research was run during FMX-31 after Nico asked for full
planning on Media / Press / Narrative-Content ownership.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-narrative-content-bounded-context-2026-06-02]] | Genre press/media patterns, DDD ownership, storylet authoring, LLM fallback/provenance controls and newsroom/CMS publish-vs-distribute workflow | [[../narrative-content-bounded-context-2026-06-02]] · [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]] |

## FMX-44 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-44 after Nico asked for the
next economy issue to go deep on commercial contract lifecycle and breach
patterns.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-commercial-contract-lifecycle-2026-05-28]] | Sports sponsorship, venue catering/concession/retail/hospitality/supplier contracts and CLM lifecycle best practices | [[../commercial-contract-lifecycle-and-breach-model-2026-05-28]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] |

## FMX-45 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run during FMX-45 after Nico asked for full
research and planning on cup and competition revenue profiles.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-cup-competition-revenue-profiles-2026-05-28]] | Domestic cup and continental competition revenue, gate sharing, prize/media cadence, EV forecasting and elimination shock | [[../cup-and-competition-revenue-profiles-2026-05-28]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-78 follow-up Perplexity research (2026-06-03)

Additional Perplexity research was run during FMX-78 after Nico picked the
League Orchestration -> CommercialPortfolio profile-publication issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-fixture-commercial-revenue-profiles-2026-06-03]] | Real-world fixture/competition revenue mechanics, DDD event-plus-query publication, and management-game finance presentation for `FixtureCommercialProfile` + `CompetitionRevenueProfile` | [[../fixture-commercial-revenue-profiles-2026-06-03]] · [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]] · [[../../30-Implementation/club-economy-commercial-contracts]] |
| [[raw-mobile-route-map-ia-and-client-state-2026-06-03]] | 2026 mobile-PWA navigation IA (bottom-nav vs drawer vs hub-and-spoke) + football-manager-game nav survey (Top Eleven/OSM/FM Mobile/Hattrick/Club Soccer Director/New Star Manager/We Are Football); React + TanStack client-state layering + optimistic/draft lifecycle; Comlink-vs-`postMessage` worker bridge + worker topology | [[../mobile-route-map-ia-and-client-state-2026-06-03]] · [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] |

## FMX-91 follow-up Perplexity research (2026-06-03)

Two Perplexity passes were run during FMX-91 after Nico selected the AI
world-drift issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ai-world-drift-algorithm-2026-06-03]] | Real-world football competitive-balance drift and long-running game anti-staleness patterns for deterministic Rising Rival / Giant Collapse / Continental Era Shift design | [[../ai-world-drift-algorithm-2026-06-03]] · [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]] · [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]] |

## FMX-99 follow-up Perplexity research (2026-06-03)

Three Perplexity passes were run during FMX-99 after Nico selected the onboarding issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-onboarding-guided-first-season-2026-06-03]] | Mobile FTUE best practices, football/sports-manager first-session patterns, real lower/mid-tier first-season manager priorities and official WCAG 2.2 cross-check for the current FTUE path, Season-1 objective roadmap and wage-runway first economy lesson | [[../onboarding-guided-first-season-2026-06-03]] · [[../../50-Game-Design/GD-0012-onboarding]] · [[../../50-Game-Design/onboarding-and-tutorial]] |

## FMX-81 follow-up Perplexity research (2026-06-03)

Three Perplexity passes and targeted source checks were run during FMX-81 after
Nico selected the player contract lifecycle / Bosman ownership issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-player-contract-lifecycle-fsm-2026-06-03]] | Real-world contract expiry / pre-contract / free-agent registration / GBE rules; Football Manager / Anstoss-style renewal UX; DDD ownership options for contract lifecycle truth | [[../player-contract-lifecycle-fsm-2026-06-03]] · [[../../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]] · [[../../10-Architecture/state-machines/player-contract-lifecycle]] |

## FMX-80 follow-up Perplexity research (2026-06-05)

Perplexity and targeted official-source checks were run during FMX-80 after
Nico selected the player discipline sub-aggregate issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-player-discipline-sub-aggregate-2026-06-05]] | Real-world yellow accumulation, red-card suspensions, competition/domestic/all scope, straight-red appeal patterns, football-manager genre surfacing and FMX DDD ownership trade-offs for player discipline | [[../player-discipline-sub-aggregate-2026-06-05]] · [[../../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]] · [[../../10-Architecture/state-machines/player-discipline]] |

## FMX-146 follow-up Perplexity/Web research (2026-06-12)

Perplexity was refreshed during FMX-146, but returned an insufficient source set for the
legal/accounting validation. The committed raw notes preserve that result and add verified
source trails for real-world football insolvency, DDD/accounting ledger practice and
sports-management game precedent.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-insolvency-ledger-real-world-2026-06-12]] | EFL/DFL/Bury-style football insolvency stages, administration, points deductions, embargoes, creditor treatment and fire-sale/rescue implications | [[../insolvency-ledger-posting-contract-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] |
| [[raw-insolvency-ledger-ddd-accounting-2026-06-12]] | Event-sourced double-entry mapping, immutable postings, idempotency and policy-vs-posting separation | [[../insolvency-ledger-posting-contract-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] |
| [[raw-insolvency-ledger-games-2026-06-12]] | Football Manager and OOTP administration/budget-pressure precedent for readable crisis constraints | [[../insolvency-ledger-posting-contract-2026-06-12]] · [[../../50-Game-Design/GD-0030-dynasty-board-and-ownership]] |

## FMX-147 follow-up Perplexity/Web research (2026-06-12/13)

Perplexity, a supplemental Perplexity refresh and targeted source checks were run during FMX-147
after Nico selected the ADR-0101 D3 quality-profile enum issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-quality-profile-enum-ddd-contract-2026-06-12]] | DDD published-language, ACL and event-schema versioning options for reconciling the four match profiles with ADR-0070's three-value class | [[../quality-profile-enum-settlement-path-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] |
| [[raw-quality-profile-real-world-football-2026-06-12]] | Real-world fixture risk, stewarding, commercial match-category and match-importance evidence for per-fixture routing | [[../quality-profile-enum-settlement-path-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]] |
| [[raw-quality-profile-sim-games-2026-06-12]] | Sports-management simulation quality tiers, full play-by-play vs quick/background simulation and mass-sim pacing | [[../quality-profile-enum-settlement-path-2026-06-12]] · [[../../50-Game-Design/match-engine]] |
| [[raw-pre1-contract-replacement-2026-06-13]] | Supplemental pre-1.0 event/data-contract replacement exception for FMX-147's no-live-v1-payload state | [[../quality-profile-enum-settlement-path-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]] |

## FMX-150 follow-up Perplexity research (2026-06-13)

Perplexity research was run during FMX-150 after Nico selected the chart-of-accounts issue.
The committed captures preserve the account-catalog, real-world football accounting, sports-manager
UI and append-only versioning strands.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-chart-of-accounts-game-ledger-2026-06-13]] | Small fixed chart of accounts for an offline deterministic football-manager ledger | [[../chart-of-accounts-and-category-catalog-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]] |
| [[raw-football-club-accounting-families-2026-06-13]] | Real-world football club accounting families: player registrations, wages, receivables/payables, revenue, debt and write-offs | [[../chart-of-accounts-and-category-catalog-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]] |
| [[raw-sports-management-finance-ui-2026-06-13]] | Football/sports-management finance UI precedent for Quick / Standard / Expert accounting | [[../chart-of-accounts-and-category-catalog-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]] |
| [[raw-chart-of-accounts-versioning-2026-06-13]] | Additive chart/versioning, inactive-not-deleted codes and category-catalog replay rules | [[../chart-of-accounts-and-category-catalog-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]] |

## FMX-191 follow-up Perplexity/Web research (2026-06-13)

Perplexity research and targeted official-source checks were run during FMX-191 after
Nico selected the monetization model / no-P2W canon issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-monetization-model-market-precedents-2026-06-13]] | 2026 game monetization model comparison, football-manager genre precedents, Hattrick-style supporter model and paid-power risk | [[../monetization-model-and-no-p2w-canon-2026-06-13]] · [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]] |
| [[raw-monetization-legal-privacy-store-policy-2026-06-13]] | EU/German consumer-law, GDPR/ePrivacy, app-store policy, ratings and legal-review constraints for paid digital goods | [[../monetization-model-and-no-p2w-canon-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]] |
| [[raw-no-pay-to-win-guardrails-2026-06-13]] | Allowed/forbidden entitlement taxonomy and operational no-P2W test for shared competitive contexts | [[../monetization-model-and-no-p2w-canon-2026-06-13]] · [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]] |
| [[raw-monetization-source-checks-2026-06-13]] | Targeted official source checks for Apple, EU consumer rights, USK and Hattrick Supporter precedent | [[../monetization-model-and-no-p2w-canon-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]] |

## FMX-190 follow-up Perplexity/Web research (2026-06-13)

Perplexity research plus targeted official/tooling source checks were run during
FMX-190 after Nico selected the no-P2W / MP-fairness invariant issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-no-p2w-mp-fairness-guardrails-2026-06-13]] | No-P2W definitions, soft P2W, paid information advantage, speed-ups, attempt volume, tradeability and paid randomness guardrails | [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]] |
| [[raw-football-manager-monetization-precedents-2026-06-13]] | Hattrick/supporter-style positive precedent and Top Eleven/OSM token-booster/scouting P2W perception | [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]] |
| [[raw-no-p2w-legal-store-policy-2026-06-13]] | Apple, Google, EUR-Lex and European Commission source checks for IAP, random item disclosure, consumer information and dark-pattern risks | [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]] |
| [[raw-no-p2w-test-gate-tooling-2026-06-13]] | DDD/modular-monolith invariant testing plus current Vitest Test Projects and fast-check property/model testing docs | [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]] |

## FMX-194 follow-up Perplexity/Web research (2026-06-13)

Perplexity research plus targeted official/source checks were run during FMX-194
after Nico selected the monetization legal gates issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-payment-provider-mor-vs-direct-2026-06-13]] | Web Merchant-of-Record vs Stripe-direct/Stripe Tax, app-shell IAP boundary, VAT/OSS/invoice/dispute tradeoffs and provider adapter posture | [[../monetization-legal-gates-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]] |
| [[raw-refund-spent-cash-policy-2026-06-13]] | Immediate-delivery withdrawal waiver, already-spent consumable cash refund handling, Apple/Google/MoR reconciliation and no-P2W/shared-state constraints | [[../monetization-legal-gates-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]] |
| [[raw-age-gate-and-soft-launch-gates-2026-06-13]] | Proportional age assurance, GDPR/minors, German youth-protection, DSA/dark-pattern and paid soft-launch artifact gates | [[../monetization-legal-gates-2026-06-13]] · [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]] |
| [[raw-monetization-legal-source-checks-2026-06-13]] | Targeted official/provider source checks for Apple, Google, Paddle, Stripe, EU/DE consumer law, imprint, ratings and Capacitor purchase-integration constraints | [[../monetization-legal-gates-2026-06-13]] · [[../../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]] |

## FMX-67 follow-up Perplexity research (2026-06-05)

Perplexity/Web research was run during FMX-67 after Nico selected the
opposition-template AI consumption issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-opposition-template-ai-consumption-2026-06-05]] | Real-world opposition-analysis workflows, Football Manager/OOTP pre-match strategy precedents and deterministic replay constraints for `OppositionTemplateSelectedForMatchV1` | [[../opposition-template-ai-consumption-contract-2026-06-05]] · [[../../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]] · [[../../10-Architecture/09-Decisions/ADR-0055-tactics-context]] |

## FMX-94 follow-up Perplexity research (2026-06-05)

Perplexity/Web research was run during FMX-94 after Nico selected the
statistics and analytics read-model owner issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-statistics-analytics-read-model-owner-2026-06-05]] | Real-world football official-vs-derived statistics, Football Manager/OOTP analytics and history surfaces, and DDD/CQRS projection ownership trade-offs for a dedicated Statistics & Analytics owner | [[../statistics-analytics-read-model-owner-2026-06-05]] · [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] · [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]] |

## FMX-131 follow-up Perplexity research (2026-06-12)

Perplexity research was run during FMX-131 after Nico selected the standings
authority issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-standings-authority-league-vs-statistics-2026-06-12]] | DDD/CQRS command authority vs projection risk, real-world league tiebreaker authority and game/platform precedent for official standings vs analytics/history projections | [[../standings-authority-league-vs-statistics-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]] · [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]] · [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] |

## FMX-135 follow-up Perplexity research (2026-06-12)

Perplexity research was refreshed during FMX-135 before Nico resolved the
ADR-0096 runtime fork and status/binding inconsistency. Perplexity's
game/runtime citations were not strong enough to stand alone, so the synthesis
cross-checks library and runtime facts against primary docs and registries.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-match-engine-runtime-fork-2026-06-12]] | Runtime fork trade-off: Rust-native + WASM replay vs single WASM everywhere vs TS-first MVP, with FMA/libm/NaN/relaxed-SIMD/import/interruption risks | [[../match-engine-contract-ratification-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] |
| [[raw-match-engine-replay-quality-profiles-2026-06-12]] | Replay guarantee tiers for human-viewed matches, detailed background matches and fast background simulation | [[../match-engine-contract-ratification-2026-06-12]] · [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] |

## FMX-133 follow-up Perplexity/Web research (2026-06-13)

Perplexity research and targeted source checks were run during FMX-133 after
Nico selected the match-engine core model issue. Perplexity returned useful
directional synthesis but uneven citations, so the source-check note records the
stronger source trail.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-match-engine-real-world-envelopes-2026-06-13]] | Real-world match statistical envelopes: goals, shots, xG, cards, possession, PPDA and injuries | [[../match-engine-core-model-2026-06-13]] · [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] |
| [[raw-match-engine-action-utility-models-2026-06-13]] | Event-chain, logistic/weighted attribute contests, xG, xT/EPV possession value and reason-code modelling | [[../match-engine-core-model-2026-06-13]] · [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] |
| [[raw-match-engine-game-precedents-2026-06-13]] | Football Manager, OOTP and lower-visual football-manager precedent for watched, quick and background simulation tiers | [[../match-engine-core-model-2026-06-13]] · [[../../50-Game-Design/match-engine]] |
| [[raw-match-engine-calibration-harness-2026-06-13]] | Golden replay, seed-sweep, statistical-envelope, goodness-of-fit and background-fast compatibility harness patterns | [[../match-engine-core-model-2026-06-13]] · [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] |
| [[raw-match-engine-source-checks-2026-06-13]] | Targeted source checks for xG, xT/EPV, game precedents, statistical tests and injuries | [[../match-engine-core-model-2026-06-13]] · [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] |

## FMX-88 follow-up Perplexity research (2026-06-04)

Three Perplexity passes and targeted source checks were run during FMX-88 after
Nico selected the AI narration scope freeze / fallback coverage issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]] | EU AI Act Article 50 transparency gate, optional-LLM fallback/CI patterns, and football-manager / narrative-game precedents for a Broad Full Dialogue scope freeze | [[../ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]] · [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] · [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] · [[../../30-Implementation/ai-narration-contract-testing-framework]] |

## FMX-83 follow-up Perplexity research (2026-06-04)

Three Perplexity passes and targeted source checks were run during FMX-83 after
Nico selected the newsworthiness / event-publication issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-newsworthiness-event-publication-semantics-2026-06-04]] | Real football media/newsworthiness facts, comparable game/storylet event-surface patterns, DDD integration-event payload rules and Zod 4 contract guidance for self-contained Narrative facts | [[../newsworthiness-event-publication-semantics-2026-06-04]] · [[../../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]] · [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] |

## FMX-87 follow-up Perplexity research (2026-06-05)

Three Perplexity passes and targeted source checks were run during FMX-87 after
Nico selected the dialogue-intent taxonomy issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]] | Comparable sports-manager dialogue systems, real-world football communication surfaces, storylet/dialogue-system design and DDD command/event boundaries for finite `DialogueIntent` effects | [[../dialogue-intent-taxonomy-effect-matrix-2026-06-05]] · [[../../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]] · [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] · [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] |

## FMX-46 follow-up Perplexity research (2026-05-29)

Additional Perplexity research was run during FMX-46 after Nico asked for full
research and planning on matchday operating costs and risk-cost settlement.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-matchday-operating-costs-risk-settlement-2026-05-29]] | UEFA/national safety, stewarding, policing, supporter travel, alcohol restrictions, sanctions, sector closures, ghost matches and stadium operating-cost patterns | [[../matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-47 follow-up Perplexity research (2026-06-01)

Additional Perplexity research was run during FMX-47 after Nico picked the next
economy issue: catering and merchandise operations depth beyond flat revenue
percentages.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-catering-and-merchandise-operations-2026-06-01]] | Stadium catering/concession & football merchandise commercial models, COGS/inventory/waste, demand spikes, service-quality & SLA breach, supplier exclusivity, IFRS 15 recognition | [[../catering-and-merchandise-operations-2026-06-01]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-50 follow-up Perplexity research (2026-06-01)

Additional Perplexity research was run during FMX-50 after Nico picked the
High-priority `risk:legal` Investor compliance & entitlement boundary issue.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-investor-compliance-and-entitlement-boundary-2026-06-01]] | Apple/Google consumable-IAP rules, web PSP, refund/revocation, IARC/PEGI/USK age rating, EU/DE/UK/US consumer law, Merchant-of-Record vs Stripe + OSS tax, idempotency/webhooks, fraud, PII-free analytics | [[../investor-compliance-and-entitlement-boundary-2026-06-01]] · [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] |

## FMX-48 follow-up Perplexity research (2026-06-01)

Additional Perplexity and targeted source research was run during FMX-48 after
Nico asked for full research and planning on fan-service campaign catalog and
effects.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-fan-service-campaign-catalog-and-effects-2026-06-01]] | Away travel, fan/family/community events, choreo and supporter dialogue, alcohol/beverage campaigns, sponsor activation measurement, low uptake and cooldowns | [[../fan-service-campaign-catalog-and-effects-2026-06-01]] · [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] · [[../../30-Implementation/club-economy-commercial-contracts]] |

## FMX-49 follow-up Perplexity research (2026-06-01)

Additional Perplexity and targeted source research was run during FMX-49 after
Nico asked for the next issue: club financing tools separate from Investor.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-club-financing-tools-2026-06-01]] | Club financing instruments, bank debt, credit lines, sponsor/media advances, receivable factoring, restructurings, overdue payables, Top-5/UEFA-style controls and Investor separation | [[../club-financing-tools-2026-06-01]] · [[../../50-Game-Design/GD-0008-finance-economy]] · [[../../30-Implementation/club-economy-accounting-ledger]] |

## FMX-51 follow-up Perplexity research (2026-06-01)

Four Perplexity passes were run during FMX-51 after Nico asked for the next
economy beat — how AI-controlled clubs behave economically.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ai-club-economy-behaviour-2026-06-01]] | Genre AI-club economy mechanics (FM/OOTP/EA FC/Anstoss/Capitalism Lab); real-club financial archetypes + wage/turnover/debt bands + event reactions; AI architecture (rule/utility) + anti-runaway/anti-zombie/inflation control + soak-test KPIs; per-country regulatory rails | [[../ai-club-economy-behaviour-2026-06-01]] · [[../../50-Game-Design/GD-0023-ai-club-economy-behaviour]] · [[../ai-manager-behaviour]] · [[../transfer-market-simulation]] |

## FMX-52 follow-up Perplexity research (2026-06-01)

Three Perplexity passes were run during FMX-52, the economy calibration/soak-test
capstone.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-economy-calibration-and-soak-test-scenarios-2026-06-01]] | Simulation balancing & long-run economy testing (Monte-Carlo sweeps, golden baselines, drift detection, concentration metrics, homeostasis tuning, KPI bands, soak duration, insolvency base rates); financial stress-testing & reverse-stress / scenario analysis (Basel/CCAR patterns, failure definitions, shock magnitudes, IFRS 15 season tickets, parachutes, evidence standards); deterministic-sim testing techniques (golden-master/property/metamorphic, invariants, drift tolerances, seeds) + attendance/fan-demand elasticity | [[../economy-calibration-and-soak-test-scenarios-2026-06-01]] · [[../../30-Implementation/economy-calibration-and-soak-test-runbook]] · [[../../50-Game-Design/economy-system]] |

## FMX-54 follow-up Perplexity research (2026-06-01)

Three Perplexity passes and targeted source checks were run during FMX-54 after
Nico asked for a fan-persona privacy and creative IP-safe naming review.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-fan-persona-privacy-and-naming-2026-06-01]] | GDPR boundary for fictional fan groups/reps, IP-safe naming for social/commercial football worlds, and Community Overlay DSA/AI/UGC future gate | [[../fan-persona-privacy-and-naming-2026-06-01]] · [[../../50-Game-Design/audience-and-atmosphere]] · [[../../50-Game-Design/GD-0015-ip-clean-data]] · [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]] |

## FMX-3 follow-up Perplexity research (2026-05-28)

Additional Perplexity research was run after Nico expanded the Runtime-LLM
narration target from async flavour to Full Dialogue and All Active actor
context.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-ai-narration-mvp-research-2026-05-28]] | Runtime LLM narration/dialogue best practices, fallback, validation, cache/cost/latency and season memory | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-narration-compliance-safety-2026-05-28]] | EU AI Act, GDPR, OWASP, monitoring, kill switch and release gates | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-world-persona-generation-2026-05-28]] | Generated players, staff, board, media, fan groups, fan reps, values and relationship graph | [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] |
| [[raw-ai-narration-evaluation-testing-2026-05-28]] | Eval corpus, structured output validation, fact grounding, CI tiers and telemetry | [[../ai-narration-testing-framework-2026-05-28]] |
| [[raw-ai-narration-security-testing-2026-05-28]] | Prompt injection, PII minimization, unsafe output, provider outage and disclosure tests | [[../ai-narration-testing-framework-2026-05-28]] |
| [[raw-ai-narration-interactive-narrative-qa-2026-05-28]] | Storylets, persona cards, relationship memory, deterministic fallbacks and long-season narrative QA | [[../ai-narration-testing-framework-2026-05-28]] |

## FMX-86 follow-up Perplexity research (2026-06-05)

Research grounding the hidden-attribute substrate mapping GDDR (G22): how the
internal OCEAN substrate derives player-facing football labels, how scouting gates
their reveal, whether to persist or re-derive the personality vector, and the
single-composite-vs-multi-tag label model.

| File | Topic | Synthesis target |
|---|---|---|
| [[raw-hidden-attribute-substrate-mapping-2026-06-05]] | OCEAN→football-label mapping + FM personality/media/trait derivation; FM/OOTP/NBA 2K scouting-gated reveal & attribute bands; persist-vs-derive a personality vector in deterministic/event-sourced sims; single-composite vs multi-tag labels (FM/CK3/RimWorld) with exclusion axes | [[../hidden-attribute-substrate-mapping-2026-06-05]] · [[../../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]] · [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] · [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] |

## Rules

- Raw notes may quote competitor names and product features for analysis only.
- Implementation must follow [[../ip-and-licensing]] and
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].
- When a raw point is promoted into a synthesis, design, or ADR note, link both
  ways so future agents can trace the chain.
- Treat anything here as `status: raw`: not binding, never the only source.
