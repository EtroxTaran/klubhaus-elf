---
title: Research Summary
status: current
tags: [research, summary, contracts, ai, llm, narrative, newsworthiness, dialogue, intents, discipline, suspension, appeals, opposition, tactics, ai-world, statistics, analytics, standings, read-model, match-engine, gameplay, calibration, determinism, runtime, replay, snapshot, quality-profile, insolvency, ledger, chart-of-accounts, category-code, monetization, no-p2w, compliance, legal, fmx-67, fmx-80, fmx-81, fmx-83, fmx-87, fmx-88, fmx-94, fmx-131, fmx-133, fmx-135, fmx-136, fmx-141, fmx-146, fmx-147, fmx-150, fmx-191, fmx-194]
updated: 2026-06-14
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

## Opposition-template AI Consumption Contract (FMX-67 / FMX-136, 2026-06-05 / 2026-06-14)

[[opposition-template-ai-consumption-contract-2026-06-05]] closes the research
layer for G11: AI World Simulation supplies opponent-prep context, Tactics
selects and publishes the self-contained
`OppositionTemplateSelectedForMatchV1`, and Match consumes the embedded
`TacticSnapshot.oppositionTemplate` slice at `lineup_locked`. It feeds accepted
and binding
[[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]].
Raw Perplexity/Web capture:
[[raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]].

[[opposition-template-ai-consumption-ratification-2026-06-14]] preserves the
FMX-136 ratification cleanup: AI World canonical planning source, fail-fast
`opposition_template_selection_missing` and snapshot-in-Tactic replay payload.
Raw Perplexity/Web capture:
[[raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]].

## Statistics & Analytics Read-Model Owner (FMX-94, 2026-06-05)

[[statistics-analytics-read-model-owner-2026-06-05]] closes the research layer
for G19 and resolves the ADR-0068 `CompetitionStatus.standingsRef` dependency.
The selected planning line is a dedicated projection-only **Statistics &
Analytics** owner, per-save projections, immutable Manager & Legacy / HoF
handoff snapshots, and a full MVP Analytics Hub with core stats plus xG/xA/xGA,
PPDA, field tilt, shot/pass maps, heatmaps, zone control, per-90 leaderboards,
form and player/team comparisons. It feeds proposed
[[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]],
accepted [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] and draft
[[../20-Features/feature-statistics-analytics-hub-mvp]]. Raw Perplexity/Web
capture:
[[raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]].

## Standings Authority - League vs Statistics (FMX-131, 2026-06-12)

[[standings-authority-league-vs-statistics-2026-06-12]] closes the research layer
for the ADR-0066 / ADR-0068 / ADR-0081 standings-authority seam. The accepted
split is: League Orchestration owns tie-break rules, official current/final
ordering and structural outcomes (`CompetitionStandingsFinalizedV1`,
promotion/relegation, qualification and season rollover); Statistics & Analytics
owns display/history standings projections, league leaders and analytics
surfaces only. Raw Perplexity capture:
[[raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]].

## Match-Engine Contract Ratification (FMX-135, 2026-06-12)

[[match-engine-contract-ratification-2026-06-12]] refreshes the ADR-0096
runtime-fork and replay-profile evidence. Nico approved the recommended D1-D5
path live on 2026-06-12: ADR-0096 binds to a single Rust/WASM module everywhere
(server Wasmtime, browser WebAssembly API), mandatory integer/fixed-point
replay-bearing math, D2-A replay precedence, D3-A carry-forward/9-stream cleanup
and D4 single-WASM readiness spike before Match runtime implementation. D5 also
cleans ADR-0096/0072/0077/0078/0086/0087 to `accepted` / `binding: true`. Raw captures:
[[raw-perplexity/raw-match-engine-runtime-fork-2026-06-12]],
[[raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12]].
Decision record:
[[../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]].

## Match-Engine Core Model and Calibration (FMX-133, 2026-06-13)

[[match-engine-core-model-2026-06-13]] preserves the FMX-133 research layer for
GD-0002's match-model gates. It recommends a hybrid event-chain +
xT/EPV-style utility + shot xG + weighted/logistic attribute-contest model,
v1 statistical envelopes, profile-specific spatial sample density and a
calibration harness with golden replays, seed sweeps, goodness-of-fit tests and
background-fast compatibility checks. Decision remains pending Nico in
[[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]];
draft decision home is
[[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]. Raw captures:
[[raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]],
[[raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]],
[[raw-perplexity/raw-match-engine-game-precedents-2026-06-13]],
[[raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]],
[[raw-perplexity/raw-match-engine-source-checks-2026-06-13]].

## Gameplay Calibration Ownership and Harness (FMX-141, 2026-06-13)

[[gameplay-calibration-ownership-and-harness-2026-06-13]] preserves the
FMX-141 research layer for non-economy gameplay calibration ownership. It
recommends draft
[[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
and [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]] so
accepted GDDRs point to concrete slots instead of generic FMX-52 economy
calibration. Decision remains pending Nico in
[[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].
Recommended packet: gameplay-wide umbrella, 14-slot taxonomy, T0-T4 harness
tiers, Nico-owned rebaseline authority until delegated and realism-anchored
fun/perception overrides. Raw captures:
[[raw-perplexity/raw-gameplay-calibration-sim-precedents-2026-06-13]],
[[raw-perplexity/raw-gameplay-calibration-stochastic-harness-2026-06-13]],
[[raw-perplexity/raw-gameplay-calibration-domain-slots-2026-06-13]],
[[raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]].

## Insolvency Event-To-Ledger Posting Contract (FMX-146, 2026-06-12)

[[insolvency-ledger-posting-contract-2026-06-12]] closes the ADR-0101 D4
research layer for the ADR-0050 / ADR-0079 insolvency seam. The accepted line:
ADR-0079/GD-0030 own the shared `InsolvencyCaseStage`; administration,
points deductions, embargoes, wage-cap policy and fire-sale opening are
state/policy facts only; wage caps constrain future ADR-0105 wage blocks; completed
fire sales reuse ADR-0105 registration disposal/write-off postings; and creditor
haircut/forgiveness uses the one new balanced
`InsolvencyCreditorWriteOffPosted` posting. Raw captures:
[[raw-perplexity/raw-insolvency-ledger-real-world-2026-06-12]],
[[raw-perplexity/raw-insolvency-ledger-ddd-accounting-2026-06-12]],
[[raw-perplexity/raw-insolvency-ledger-games-2026-06-12]].

## Quality-Profile Enum and Settlement-Path Reconciliation (FMX-147, 2026-06-12)

[[quality-profile-enum-settlement-path-2026-06-12]] closes the research layer for
the ADR-0101 D3 quality-profile seam and records Nico's accepted outcome:
ADR-0070 `FixtureCommercialProfilesPublished.schemaVersion: 2` with the canonical
four-value match quality profile plus a derived `settlementPath`, replacing the
ambiguous v1 `qualityProfileClass` as a pre-1.0 docs-only correction because no
durable v1 payloads exist. Raw captures:
[[raw-perplexity/raw-quality-profile-enum-ddd-contract-2026-06-12]],
[[raw-perplexity/raw-quality-profile-real-world-football-2026-06-12]],
[[raw-perplexity/raw-quality-profile-sim-games-2026-06-12]],
[[raw-perplexity/raw-pre1-contract-replacement-2026-06-13]].

## Chart of Accounts and Category Catalog (FMX-150, 2026-06-13)

[[chart-of-accounts-and-category-catalog-2026-06-13]] preserves the FMX-150
research layer for ADR-0095 LI-9. It records Nico's accepted D1-D3: semantic
dotted account codes, a 40-account medium chart plus a versioned `categoryCode`
catalog, and an Expert finance surface based on statements plus account/category
drilldown and an audit drawer. Accepted ADR:
[[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]].
Raw captures:
[[raw-perplexity/raw-chart-of-accounts-game-ledger-2026-06-13]],
[[raw-perplexity/raw-football-club-accounting-families-2026-06-13]],
[[raw-perplexity/raw-sports-management-finance-ui-2026-06-13]],
[[raw-perplexity/raw-chart-of-accounts-versioning-2026-06-13]].

## Monetization Model and No-P2W Canon (FMX-191, 2026-06-13)

[[monetization-model-and-no-p2w-canon-2026-06-13]] preserves the FMX-191
research layer for the monetization pre-mortem finding
PM-2026-05-20-04-F-01. It recommends a free core, deterministic cosmetics,
optional non-power Supporter Club, later cosmetic-only season card and a strict
no-P2W entitlement taxonomy. The decision remains pending Nico in
[[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]; draft
decision homes are [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
and [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]].
Raw captures:
[[raw-perplexity/raw-monetization-model-market-precedents-2026-06-13]],
[[raw-perplexity/raw-monetization-legal-privacy-store-policy-2026-06-13]],
[[raw-perplexity/raw-no-pay-to-win-guardrails-2026-06-13]],
[[raw-perplexity/raw-monetization-source-checks-2026-06-13]].

## No-Pay-to-Win and MP-Fairness Invariant (FMX-190, 2026-06-13)

[[no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] preserves the FMX-190
research layer for the project-wide no-P2W / shared-state fairness invariant. It
recommends a dedicated draft ADR: real-money entitlements may unlock presentation,
identity, account service or isolated singleplayer assistance, but must have zero
effect on competitive shared state. It treats paid information advantage as
forbidden power, classifies mechanically inert visible cosmetics as non-competitive
and proposes a future Vitest/fast-check architecture gate. Decision remains pending
Nico in [[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]];
draft decision home is
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]].
Raw captures:
[[raw-perplexity/raw-no-p2w-mp-fairness-guardrails-2026-06-13]],
[[raw-perplexity/raw-football-manager-monetization-precedents-2026-06-13]],
[[raw-perplexity/raw-no-p2w-legal-store-policy-2026-06-13]],
[[raw-perplexity/raw-no-p2w-test-gate-tooling-2026-06-13]].

## Monetization Legal Gates (FMX-194, 2026-06-13)

[[monetization-legal-gates-2026-06-13]] preserves the FMX-194 research layer
for ADR-0063's open legal-sensitive gates. It recommends web MoR-first payment
provider posture with direct PSP fallback, Apple/Google IAP for native in-app
digital cash, immediate-delivery waiver plus unspent-only revocation and no
gameplay rollback, proportional age assurance and a paid activation compliance
gate. Decision remains pending Nico in
[[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]];
draft decision home is
[[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
and compliance evidence home is
[[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]].
Raw captures:
[[raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]],
[[raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]],
[[raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]],
[[raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]].

## Player Discipline Sub-Aggregate (FMX-80, 2026-06-05)

[[player-discipline-sub-aggregate-2026-06-05]] closes the research layer for
G18: Match owns card facts, Regulations owns discipline profiles and appeal
eligibility policies, Squad & Player owns card ledgers, suspension windows,
straight-red appeal state and the canonical `PlayerSuspended` contract. It feeds
proposed
[[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
and state machine [[../10-Architecture/state-machines/player-discipline]]. Raw
Perplexity/source capture:
[[raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]].

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
balance constants and Progressive UI. The original Investor line is amended by
FMX-41: if activated, Investor is clean singleplayer cash with no debt,
owner-control, fan-penalty or multiplayer effect.

This feeds draft [[../50-Game-Design/GD-0008-finance-economy]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], draft
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] and
draft [[../30-Implementation/club-economy-accounting-ledger]].

## Club Economy Impact Map and Commercial Contracts (2026-05-28)

[[club-economy-impact-map-and-commercial-contracts-2026-05-28]] extends the
FMX-13 economy draft into FMX-41's direct financial impact map. It documents
which domains cause ticketing, season-ticket, catering, merchandise,
sponsorship, cup, fan-event and Investor effects, and which contracts keep those
facts out of direct ledger writes.

Nico's current direction is: Top-5 country research at equal depth, Realistic
Rails, CommercialPortfolio as the accepted commercial policy/settlement owner
after FMX-32, Club Management as sole finance-ledger writer, fan segments as hard
economy inputs, season tickets as upfront-cash-versus-upside trade-off,
catering/merchandise as explicit contract families, cup games as full economy
events, fan-service campaigns as paid loyalty/atmosphere levers, and Investor as
clean singleplayer cash with no gameplay penalty beyond the unchanged weekly
economy.

This feeds draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], accepted
[[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
and draft [[../30-Implementation/club-economy-commercial-contracts]].

## Player Contract Lifecycle FSM (2026-06-03)

[[player-contract-lifecycle-fsm-2026-06-03]] is the FMX-81 synthesis for renewal,
expiry, Bosman/pre-contract and free-agent signing ownership. It records the
selected planning landing: Squad & Player owns contract lifecycle truth; Transfer
owns renewal, pre-contract and free-agent signing process cases; Regulations owns
pre-contract windows, free-agent registration policy and work-permit/GBE-like
verdicts; Notification owns self-contained expiry-warning delivery; Club
Management owns wage/signing-bonus/agent-fee ledger posting.

This feeds proposed
[[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]],
[[../10-Architecture/state-machines/player-contract-lifecycle]],
[[../50-Game-Design/GD-0006-transfers]] and
[[../50-Game-Design/transfer-market-and-contracts]].

## AI Narration Scope Freeze and Fallback Coverage (2026-06-04)

[[ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]] is the FMX-88
synthesis for Broad Full Dialogue runtime-LLM scope, the
`FallbackCoverageManifest`, Article 50 release-gate ownership and the MVP
no-export/share rule. Raw capture:
[[raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]].

## Newsworthiness Event-Publication Semantics (2026-06-04)

[[newsworthiness-event-publication-semantics-2026-06-04]] is the FMX-83
synthesis for G14. It proposes source-owned, self-contained event-publication
facets for `InjuryOccurred`, `ContractExpiring`, `BoardPressureChanged` and
`TransferRumourPublished`, plus projection requirements only for the
ADR-0078/Squad & Player-owned `PlayerSuspended` schema. Narrative consumes these
snapshots into `NarrativeNewsFactProjection`, renders storylets/articles/feed
surfaces and never joins source-domain state while rendering. Raw capture:
[[raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]].

This feeds proposed
[[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]],
draft [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]],
[[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
[[../20-Features/feature-ai-narration-mvp-pillar]] and
[[../30-Implementation/ai-narration-contract-testing-framework]].

## Dialogue Intent Taxonomy and Effect Matrix (2026-06-05)

[[dialogue-intent-taxonomy-effect-matrix-2026-06-05]] is the FMX-87 synthesis
for G13. It records Nico's selected planning defaults: Broad MVP dialogue
surfaces (player, staff, board, press/media, fan-rep, agent), banded mechanical
effects with exact values now mapped to the GD-0043 `dialogue.trustMorale`
calibration slot, and persona/relationship influence as explicit gates plus
bounded scaling. Raw capture:
[[raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]].

This feeds draft
[[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]],
draft [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]],
draft [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]],
[[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
[[../20-Features/feature-ai-narration-mvp-pillar]] and
[[../30-Implementation/ai-narration-contract-testing-framework]].

## Fan Demand and Price Elasticity (2026-05-28)

[[fan-demand-price-elasticity-2026-05-28]] is the FMX-42 research synthesis for
supporter demand, season-ticket renewal, price elasticity, top-match surcharges
and ticketing-trust backlash. The recommended draft model is segment-specific
latent demand before stadium capacity, then ticketing allocation and settlement.
It rejects one global elasticity constant, keeps numbers as tunable profile
ranges, and documents country-profile tendencies for Germany, England, Spain,
Italy and France.

This refines draft [[../50-Game-Design/audience-and-atmosphere]], draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]] and draft
[[../30-Implementation/club-economy-commercial-contracts]].

## Season-Ticket Lifecycle and Accounting (2026-05-28)

[[season-ticket-lifecycle-and-accounting-2026-05-28]] is the FMX-43 research
synthesis for season-ticket lifecycle and accounting. Nico's current direction
is full accrual accounting with fan-group / cohort policies, not individual fan
records and not a cash-only season-ticket shortcut.

Current draft direction:

- Model season tickets as `SeasonTicketCampaign` lifecycle states: planning,
  renewal, relocation, member presale, waitlist allocation, public sale,
  closed, in-season adjustment and renewal review.
- Allocate by seat class: standing, standard seating, family, premium/suites,
  accessibility, with away inventory excluded from home season-ticket stock.
- Track payment plans as upfront cash, internal instalment receivables,
  finance-partner net cash / fee and account-credit application.
- Post sale-time cash or receivables plus deferred revenue, then recognise
  revenue as included home matches are played.
- Keep no-show, seat release, transfer and compensation at aggregate cohort /
  fan-group level through utilisation, trust and credit/refund liability pools.
- Expose the same core through Quick / Standard / Expert: cash-now warning in
  Quick, 13-week cash/deferred schedule in Standard and match-by-match accrual
  plus sensitivity in Expert.

This refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]], draft
[[../50-Game-Design/audience-and-atmosphere]], draft
[[../50-Game-Design/stadium-and-campus]] and draft
[[../30-Implementation/club-economy-commercial-contracts]].

## Commercial Contract Lifecycle and Breach Model (2026-05-28)

[[commercial-contract-lifecycle-and-breach-model-2026-05-28]] is the FMX-44
research synthesis for sponsorship, catering, merchandise, hospitality,
supplier and venue-activation contracts. Nico's current direction is realistic
but game-adapted: a shared commercial contract lifecycle with family-specific
schedules, not flat annual income and not separate state machines per family.

Current draft direction:

- Use `CommercialContract` as the shared CommercialPortfolio shell for lifecycle
  state, version history, cash schedule, recognition schedule, obligations,
  exclusivity, breach policy, renewal policy and audit trail. Club Management
  remains the sole finance-ledger writer.
- Keep sponsorship, catering, merchandise, hospitality, supplier and
  venue-activation clauses in family-specific schedules.
- Model breaches as curable/material/critical with cure windows, make-goods,
  penalties, suspension and termination rights as profile data.
- Detect exclusivity conflicts structurally as category × territory × asset ×
  carve-outs before signature; active violations open breach cases.
- Preserve cash-versus-recognition accounting: upfront commercial cash improves
  runway but does not instantly become earned revenue.
- Expose Quick / Standard / Expert: contract presets and risk badges in Quick,
  offer comparison and 13-week schedule in Standard, contract register,
  obligation log, breach cases, renewal calendar and exclusivity graph in
  Expert.
- Keep AI club behaviour to read-only hooks for FMX-51.

This refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]], draft
[[../50-Game-Design/sponsorship-portfolio]], draft
[[../50-Game-Design/stadium-and-campus]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], accepted
[[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
and draft [[../30-Implementation/club-economy-commercial-contracts]].

## Cup and Competition Revenue Profiles (2026-05-28)

[[cup-and-competition-revenue-profiles-2026-05-28]] is the FMX-45 research
synthesis for domestic and continental competition revenue. It converts
Germany, England, Spain, Italy, France and UEFA-style patterns into IP-clean
draft `CompetitionRevenueProfile` templates without copying licensed
competition names or final real-world constants.

Current draft direction:

- Use profile families for central-round domestic cups, shared-gate underdog
  cups, federation-hosting cups, seeded elite-entry cups, solidarity/amateur
  cups and continental value-pillar cups.
- Separate prize schedules, gate-sharing rules, ticket allocation,
  media/facility cadence, travel/security obligations, neutral venue rules,
  replay/two-leg rules, sponsor triggers, merchandise spikes and fixture
  congestion.
- Keep cup cash, earned receivables and future-round EV separate. Elimination
  removes forecast upside and records a forecast shock; it is not a hidden cash
  penalty.
- Expose Quick / Standard / Expert: secured income and upside bands in Quick,
  per-fixture breakdown in Standard, probability/EV/payment-timing details in
  Expert.
- Keep season-ticket cup priority and material-right accounting hook-only for
  this beat; the full liability model remains an FMX-43 follow-up.

This refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]], draft
[[../50-Game-Design/regulations-and-compliance]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], accepted
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]],
accepted [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
and draft [[../30-Implementation/club-economy-commercial-contracts]].

## Matchday Operating Costs and Risk-Cost Settlement (2026-05-29)

[[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] is the FMX-46
research synthesis for the non-ticket cost side of matchday economics. It
translates UEFA, national safety, stewarding, policing, alcohol, supporter
travel, stadium operations and disciplinary patterns into an IP-clean
`MatchdayOperatingCostProfile`.

Current draft direction:

- CommercialPortfolio owns the per-fixture operating profile and settlement
  Saga; Club Management remains the ADR-0050 ledger writer.
- Stadium Operations, Audience & Atmosphere, Rivalry, Regulations,
  League/Competition and Matchday Event Engine provide causal facts.
- Risk tiers are `routine`, `guarded`, `elevated`, `highRisk`, `restricted`
  and `closedDoor`.
- Settlement separates stewarding, private security, policing contribution,
  medical, cleaning/waste, energy, temporary staff, officials, pitch recovery,
  insurance/compliance allocation, damage reserve, sanctions, sector closures,
  away-fan restrictions, alcohol restrictions and ghost-match effects.
- Quick / Standard / Expert show the same settlement at different depth:
  fixture cost band, family breakdown and full driver/audit trace.
- Fairness guardrails require forecast, warning and mitigation before material
  high-risk costs unless a cost is caused by an in-match or post-match event.

This refines current/draft
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

## Investor Compliance and Entitlement Boundary (2026-06-01)

[[investor-compliance-and-entitlement-boundary-2026-06-01]] is the FMX-50 research
synthesis for the compliance + entitlement boundary of the singleplayer real-money
Investor cash purchase. The gameplay rule is fixed (clean SP cash, no penalty/
debt/ownership/multiplayer advantage); this beat defines only the boundary around
it.

Current draft direction:

- Bill behind a `PaymentProviderPort`: Apple StoreKit 2 / Google Play consumable
  IAP in Capacitor app builds, a web PSP / Merchant-of-Record in the PWA.
  Entitlements bind to the account, not the save.
- Grant exactly-once via a server-authoritative state machine
  (`created → paid → entitled → refunded|revoked`), idempotent by provider
  transaction id, posting one `InvestorCashGrantPosted` (ADR-0050 sole writer).
- Reconcile refund/revocation via Apple ASSN / Google void + a reconciliation job,
  without changing simulation rules or multiplayer.
- Age rating is the plain "In-Game Purchases" descriptor (never random items);
  EU/DE/UK/US consumer law adds the pay-obligation button + VAT-inclusive price,
  immediate-delivery withdrawal-right waiver, price transparency and no dark
  patterns.
- Allow matrix: SP allowed, MP/leaderboard hard-denied, offline deferred, imported
  save re-bound from the account; abuse prevention + audit throughout.

This feeds new proposed
[[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
and refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
[[../30-Implementation/club-economy-commercial-contracts]], accepted
[[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
and accepted
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]].
Payment vendor (MoR vs Stripe-direct), refund-of-spent-cash policy, age-gate
strictness and activation timing remain HITL/legal gates.

## Catering and Merchandise Operations Depth (2026-06-01)

[[catering-and-merchandise-operations-2026-06-01]] is the FMX-47 research
synthesis for catering and merchandise operations beyond flat revenue
percentages. It deepens the two FMX-44 contract families with an explicit
cost/inventory side, keeping ownership inside CommercialPortfolio (ADR-0061) and
Club Management as sole ledger writer (ADR-0050).

Current draft direction:

- Each family carries an operating model that decides risk: catering in-house /
  concession lease / management fee / revenue-share / MAG-plus-share;
  merchandise own-store-and-e-commerce / licensed-partner / kit-supplier-
  guarantee / pure-licensing.
- Catering revenue is `attendance × per-capita`, capped by service capacity
  (queue/throughput) and stockouts; the ledger separates revenue, COGS,
  labour/opex, waste/spoilage, royalty/MAG true-up and guarantee shortfall.
- Merchandise plans a stock buy against a demand forecast with launch / icon /
  cup spike multipliers, then markdown, write-down-to-NRV and returns.
- Service quality (queue, stockout, hygiene) feeds Audience & Atmosphere
  satisfaction and sponsor fit; alcohol policy is an in-bowl / concourse-only /
  near-ban dial with a revenue↔safety trade-off (country-profile driven).
- Catering supplier pouring-rights/exclusivity reuse the FMX-44 category ×
  territory × asset × carve-out exclusivity graph; cash-vs-recognition follows
  IFRS 15 per operating model. All numbers are calibration ranges, IP-clean.

This refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]], binding
[[../50-Game-Design/stadium-and-campus]], draft
[[../30-Implementation/club-economy-commercial-contracts]], accepted
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] and
accepted [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]].

## Fan-Service Campaign Catalog and Effects (2026-06-01)

[[fan-service-campaign-catalog-and-effects-2026-06-01]] is the FMX-48 research
synthesis for turning fan-service campaigns into a concrete, fair economy
surface. It uses away travel, fan/family/community events, choreo and supporter
dialogue, beer/beverage rewards and sponsor activations as sourced patterns,
but keeps shipped content fictional and IP-clean.

Current draft direction:

- Model `FanEventCampaign` as a CommercialPortfolio-owned lifecycle:
  `draft -> scheduled -> active -> settled -> reviewed`, with `cancelled` and
  `breached` exits.
- Use a first catalog of at least eight, likely ten, campaign kinds:
  `away-train`, `bus-subsidy`, `flight-subsidy`, `family-day`, `summer-party` /
  `fan-festival`, `community-ticket-day`, `choreo-support`,
  `supporter-dialogue`, `beer-per-goal` / beverage reward and
  `digital-fan-challenge`.
- Separate direct settlement from fan effects: Club Management posts costs,
  sponsor contributions, refunds and make-goods; Audience & Atmosphere owns
  mood, trust, atmosphere, demand and cooldown memory.
- Track sponsor contribution beyond cash: prizes, transport support, media,
  staff, community grants and digital tooling, with KPI targets and make-good
  rules for low uptake or cancellation.
- Gate travel, alcohol, safety, child/family and digital/UGC risks through
  country/profile constraints. Non-alcoholic beverage variants are the safe
  fallback for strict alcohol profiles.
- Expose Quick / Standard / Expert from the same core: recommended campaign
  card, comparative campaign board and full lifecycle/provenance view.

This refines draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/economy-system]], binding
[[../50-Game-Design/audience-and-atmosphere]], binding
[[../50-Game-Design/stadium-and-campus]], binding
[[../50-Game-Design/matchday-event-engine]], draft
[[../50-Game-Design/sponsorship-portfolio]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], draft
[[../30-Implementation/club-economy-commercial-contracts]], accepted
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] and
accepted [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]].

## Fan-Ecology Persona Privacy and Creative IP-Safe Naming Review (2026-06-01)

[[fan-persona-privacy-and-naming-2026-06-01]] is the FMX-54 synthesis
for named fan groups, fan reps, persona privacy, IP-safe social-world naming and
community overlay import boundaries.

Current draft direction:

- MVP Community Overlay remains local file import / peer-to-peer sharing.
  Hosted pack distribution, discovery or marketplace functionality is a future
  DSA/UGC/privacy/AI-transparency gate.
- Fan groups are fictional aggregates over the six Audience & Atmosphere
  segments; fan reps are generated fictional People/Narrative actors and never
  real fans, handles, photos, membership lists or user profiles.
- Segment facts stay aggregate. Mood, attendance, protest, demand and trust
  effects come from Audience & Atmosphere deterministic rules, not generated
  prose.
- ADR-0007/GD-0015 naming policy now explicitly covers fan groups, fan reps,
  supporter slogans/chants, media outlets, journalists, sponsors, venues and
  community overlay names.
- Policy + tests are the accepted depth for this beat: denylist, normalisation,
  confusable/phonetic/similarity gates, protected abbreviation/city-descriptor
  blocks and manual review for high-salience samples.

This refines binding
[[../50-Game-Design/audience-and-atmosphere]], binding
[[../50-Game-Design/GD-0015-ip-clean-data]], accepted
[[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], draft
[[../50-Game-Design/community-editor-and-datasets]], proposed
[[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]],
binding [[../30-Implementation/privacy-and-consent]], current
[[data-generators]] and draft [[../50-Game-Design/sponsorship-portfolio]].

## AI Club Economy Behaviour (2026-06-01)

[[ai-club-economy-behaviour-2026-06-01]] is the FMX-51 synthesis for the economic
behaviour of AI-controlled clubs. It **composes** locked systems rather than adding
new machinery: the manager-AI architecture and archetypes
([[ai-manager-behaviour]]), the transfer sell model + Tier 0/1/2-3 fidelity
([[transfer-market-simulation]]), the weekly ledger + staged insolvency
([[../50-Game-Design/economy-system]]) and the `CountryEconomyProfile`
([[top5-country-economy-profiles-2026-05-29]]).

Proposed model:

- A thin **financial-policy layer** (five archetypes: selling / sugar-daddy /
  prudent / over-leveraged / yo-yo) on top of the manager archetype, modulated by
  board ambition + patience and the country profile.
- A **three-regime FSM** (`Healthy / Stressed / Distressed`) gating **utility-ranked**
  actions, on a hierarchical cadence (cheap weekly regime check; per-season / event
  re-budget) within the locked out-of-match per-club budget.
- **Soft, diegetic homeostasis only — no AI stat cheats**: progressive costs,
  revenue-indexed wage-growth caps, reference pricing, solidarity/parachute pools,
  ROI decay, a hard survival floor and PI-controller mean-reversion, applied
  identically to player and AI.
- **Staged distress with rare, bounded insolvency** down the existing insolvency FSM,
  with per-country distress personalities.
- **Tiered fidelity** (Tier 0 full + active commercial choices via FMX-44/47 reserved
  hooks; Tier 1 simplified; Tier 2-3 banded) and **structured rationale tags** for
  explainability (full narration deferred).

AI owner support is in-fiction (equity / soft loan), never the singleplayer Investor.
Feeds draft [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]] and resolves the
economy slice of [[../50-Game-Design/GD-0010-ai-world]] R2-04/R2-06. All ratio bands
and damper gains are IP-clean calibration inputs for the FMX-52 capstone. Raw passes:
[[raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01]].

## Club Financing Tools Separate from Investor (2026-06-01)

[[club-financing-tools-2026-06-01]] is the FMX-49 research synthesis for
in-world club financing tools that are distinct from the real-money
singleplayer Investor entitlement. It uses football finance, IFRS-lite
accounting and Top-5/UEFA-style control patterns to define playable liquidity
tools without turning Investor into debt, ownership or gameplay compliance.

Current draft direction:

- Club Management owns `FinancingFacility`, `CashflowRunwayForecast`,
  `OverduePayablesAging`, `DebtServiceSchedule`, `CovenantStatusBoard`,
  `FinancingOptionBoard` and `EmergencySaleMandate`.
- First playable tool set: overdraft/credit line, bank loan, sponsor advance,
  receivables factoring, debt restructuring/payment holiday, board owner-support
  grant/shareholder loan and emergency-sale mandate.
- CommercialPortfolio owns sponsor/media contract amendments, commercial
  receivable schedules, advance eligibility, contract liabilities and fair-value
  facts; Club Management decides the financing action and posts the ledger.
- Investor remains outside in-world financing: clean SP cash, no debt,
  ownership, board/fan penalty, compliance mutation or multiplayer advantage.
- Top-5 profiles stay "exact-ish": England-like PSR/overdue-payables,
  Germany-like licensing/liquidity, France-like budget-control intervention,
  Italy-like licence/tax-arrears pressure, Spain-like squad-cost registration
  cap and UEFA-style overlay.

This refines draft
[[../50-Game-Design/GD-0008-finance-economy]], draft
[[../50-Game-Design/economy-system]], draft
[[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]], draft
[[../50-Game-Design/regulations-and-compliance]], draft
[[../20-Features/feature-club-economy-mvp-pillar]], accepted
[[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] and
draft [[../30-Implementation/club-economy-accounting-ledger]]. Thresholds,
media-advance activation, board guarantees, emergency-sale hardness and supplier
arrears depth remain Nico-gated decisions.

## Economy Calibration and Soak-Test Scenarios (2026-06-01)

[[economy-calibration-and-soak-test-scenarios-2026-06-01]] is the FMX-52
calibration/soak-test capstone that consumes the FMX-13/41/49/51/53 economy work.
It defines **how** banded ranges become accepted constants, not the constants
themselves.

Current draft direction:

- **Evidence-acceptance gate:** a constant is accepted only when it sits in its
  evidence-justified band, soak KPIs stay healthy at the value and band edges, no
  scenario verdict flips under a ± sensitivity sweep, and a parameter sheet is filled
  — then Nico sign-off promotes the design note draft → approved.
- **KPI bands:** wage/revenue, UEFA-70 squad-cost, debt/revenue, runway and DSCR
  healthy/warning/critical, shifted per tier and `CountryEconomyProfile`.
- **Insolvency targets:** tier-scaled per decade (top ~2–5% / mid ~8–15% / lowest
  ~15–25% of clubs reaching administration) with a no-cascade invariant.
- **Anti-runaway:** title HHI + CR4 over rolling 10y/30y, max single-club title share
  <~25–30%/30y, revenue Gini 0.35–0.50 sanity bound.
- **Soak harness:** 32-seed PR smoke + 50-season nightly gate + 100-season deep soak,
  golden-baseline summary + statistical drift detection (control charts / Mahalanobis /
  KS).
- **Scenarios:** a deterministic forward matrix mapped to the scope list, plus reverse
  stress testing per archetype; Quick/Standard/Expert forecast-accuracy validation.

The executable contract (fixtures, seeds, invariants, parameter/scenario sheets) is in
[[../30-Implementation/economy-calibration-and-soak-test-runbook]]; it cross-links
draft [[../50-Game-Design/economy-system]] §12 and consumes
[[ai-club-economy-behaviour-2026-06-01]], [[top5-country-economy-profiles-2026-05-29]],
[[club-financing-tools-2026-06-01]], [[determinism-and-replay]] and
[[pre-mortem/PM-2026-05-20-16-test-strategy-depth]]. No ADR/GDDR changed; final
constants, exact insolvency %, homeostasis aggressiveness and forecast tolerances
remain Nico-gated.

## AI Narrative Runtime Integration (2026-05-27)

[[ai-narrative-runtime-integration]] synthesizes the two narrative/LLM reports
into a promotion path. It records Nico's product intent: the long-term goal is a
save that produces a personal, retellable football story, with recurring
players, journalists, board personalities, fan reps and media arcs.

Original 2026-05-27 draft direction:

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

## AI Narration, World and Dialogue MVP (2026-05-28)

[[ai-narration-world-and-dialogue-mvp-2026-05-28]] updates the FMX-3 direction
after Nico selected **Full Dialogue**, **All Active** actor context and **First
Exposure** disclosure for MVP planning. The draft target is now that AI
narration is an MVP emotional pillar, not only post-match flavour.

Current draft direction:

- Generate active narrative context for players, staff, board contacts, media
  outlets, journalists, fan segments, named fan groups, fan reps and agents.
- Keep all actor/world/fact generation deterministic and IP-clean; Runtime-LLM
  only phrases scenes from `NarrativeContextCard`.
- Add controlled dialogue surfaces for player one-to-one, staff advice, board
  meetings, press/journalist questions, fan-rep scenes and agent flavour.
- Preserve template fallback, fact validation, safety validation, cost caps,
  provider kill switch and machine-readable provenance.
- Use first-exposure AI disclosure plus a central info/settings surface as the
  draft product posture, with legal review still required.

This amends draft
[[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]], draft
[[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]],
draft [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]],
draft [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
and adds [[../20-Features/feature-ai-narration-mvp-pillar]].

## AI Narration Testing and Framework (2026-05-28)

[[ai-narration-testing-framework-2026-05-28]] promotes the follow-up research
on LLM evaluation, security testing and interactive-narrative QA into an FMX-3
draft framework. Nico selected **Narrative Context** as the architecture
boundary and **Playtest First** as the quality posture. The framework defines
contract-first context cards, deterministic fallback, eval corpus tiers,
Zod/Vitest/fast-check/Playwright test mapping, OWASP/NIST/EU AI Act safety
gates, season-simulation checks and a playtest rubric for emotional continuity.

This feeds draft
[[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
and draft [[../30-Implementation/ai-narration-contract-testing-framework]].

## EOS Player, Staff, Skills and Personas (2026-05-28)

[[eos-player-staff-skills-and-personas-2026-05-28]] promotes the player/staff
values raw report plus FMX-23 follow-up research into a draft path for clearer
player individuality, active player skills/perks, staff-skill target modeling,
mixed OCEAN + football-domain personas and relationship constellations.

Current draft direction:

- Keep the **16+4+8** player attribute basis from [[data-generators]].
- Add player skills/perks as separate visible specializations, not attributes.
- Plan staff skills as a target model, with MVP activation focused on players.
- Use OCEAN only as an internal substrate; expose football-domain labels.
- Propose a People / Persona & Skills context for actors, relationships,
  skill profiles and deterministic dialogue context cards.

This feeds draft
[[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]], draft
[[../20-Features/feature-eos-player-skills-and-people-context]] and draft
[[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]].

## Player, Staff Development and Decision Influence (2026-05-28)

[[player-staff-development-decision-model-2026-05-28]] promotes the FMX-38
follow-up into a draft decision-influence model. The vault already had the
pieces - 16+4+8 attributes, Impact Lens, weekly development, mentoring,
multifactor injury risk, transfer valuation, People/persona/skills and Staff
Operations - but lacked one owner/consumer matrix for how those factors affect
gameplay decisions.

Current draft direction:

- Treat attributes, tendencies, player skills/perks, hidden meta, OCEAN
  persona, relationship edges, staff attributes, staff skills and staff
  pipeline coverage as separate layers.
- Use factor matrices before formulas for player development, match/tactics,
  transfer/squad planning, staff pipeline effects and mentoring.
- Keep generated prose non-authoritative for relationships, transfers,
  injuries, promises, development deltas and match effects.
- Re-open staff-skill MVP activation as an explicit A/B/C decision. The
  recommendation is Option B: narrow staff pipeline modifiers, not full staff
  skill-card gameplay.

This feeds draft
[[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]],
amends draft [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
and informs the player lifecycle, training medicine and transfer-market feature
specs.

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
