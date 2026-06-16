---
title: Research Map
status: current
tags: [research, meta]
created: 2026-05-16
updated: 2026-06-16
type: map
binding: false
related: [[Current-State]], [[../60-Research/breach-notification-runbook-2026-06-15]], [[../60-Research/raw-perplexity/raw-breach-notification-runbook-2026-06-15]], [[../60-Research/raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]], [[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]], [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]], [[../60-Research/fixture-commercial-revenue-profiles-2026-06-03]], [[../60-Research/ai-world-drift-algorithm-2026-06-03]], [[../60-Research/onboarding-guided-first-season-2026-06-03]], [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]], [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]], [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]], [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../60-Research/player-discipline-sub-aggregate-2026-06-05]], [[../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]], [[../60-Research/opposition-template-ai-consumption-contract-2026-06-05]], [[../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]], [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]], [[../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]], [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]], [[../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]], [[../60-Research/match-engine-core-model-2026-06-13]], [[../60-Research/raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]], [[../60-Research/raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]], [[../60-Research/raw-perplexity/raw-match-engine-game-precedents-2026-06-13]], [[../60-Research/raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]], [[../60-Research/raw-perplexity/raw-match-engine-source-checks-2026-06-13]], [[../60-Research/insolvency-ledger-posting-contract-2026-06-12]], [[../60-Research/raw-perplexity/raw-insolvency-ledger-real-world-2026-06-12]], [[../60-Research/raw-perplexity/raw-insolvency-ledger-ddd-accounting-2026-06-12]], [[../60-Research/raw-perplexity/raw-insolvency-ledger-games-2026-06-12]], [[../60-Research/quality-profile-enum-settlement-path-2026-06-12]], [[../60-Research/raw-perplexity/raw-quality-profile-enum-ddd-contract-2026-06-12]], [[../60-Research/raw-perplexity/raw-quality-profile-real-world-football-2026-06-12]], [[../60-Research/raw-perplexity/raw-quality-profile-sim-games-2026-06-12]], [[../60-Research/raw-perplexity/raw-pre1-contract-replacement-2026-06-13]], [[../60-Research/chart-of-accounts-and-category-catalog-2026-06-13]], [[../60-Research/raw-perplexity/raw-chart-of-accounts-game-ledger-2026-06-13]], [[../60-Research/raw-perplexity/raw-football-club-accounting-families-2026-06-13]], [[../60-Research/raw-perplexity/raw-sports-management-finance-ui-2026-06-13]], [[../60-Research/raw-perplexity/raw-chart-of-accounts-versioning-2026-06-13]], [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]], [[../60-Research/raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]], [[../60-Research/raw-perplexity/raw-roguelite-comparable-games-2026-06-14]], [[../60-Research/raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]]
---

# Research Map

Research notes preserve sources and options. They are inputs to decisions, not
binding implementation guidance unless promoted into ADRs, feature specs, or game
design notes.

## Summary

- [Research Summary](../60-Research/00-summary.md)
- [Erasure vs HGB Retention Partition](../60-Research/erasure-vs-hgb-retention-partition-2026-06-16.md) -
  FMX-186 Perplexity-first and source-checked packet for draft
  [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]:
  GDPR Art. 17 account erasure vs HGB/AO payment/receipt/shared-history
  retention, current 10/8/6 buckets, field-level
  `erase_now` / `pseudonymize` / `retain_as_fact` / `do_not_store` table,
  separate finance key domain, erased account-to-finance mapping after final
  purge, hybrid shared-history anonymization and deterministic DSAR partitioner.
  Nico decision D1-D7 is pending in
  [FMX-186 decision queue](../40-Execution/fmx-186-erasure-hgb-retention-decision-queue-2026-06-16.md);
  legal/accounting review remains a paid-activation gate.
- [Live Match Pause Ratification](../60-Research/live-match-pause-ratification-2026-06-16.md) -
  FMX-140 Perplexity-first and source-checked cleanup of accepted
  ADR-0087/GD-0035: Design 1 active-manager pause semantics, one longer MVP
  tactics pause per managed side per half, local pause-trust tier, small Head
  Coach/host + trusted-tier additive ordinary-pause privileges and audit-gated
  revocation. Nico's D1-D6 choices are recorded in
  [FMX-140 decision queue](../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16.md).
- [Career Bundestrainer Reconciliation](../60-Research/career-bundestrainer-reconciliation-2026-06-15.md) -
  FMX-130 Perplexity-first and source-checked reconciliation of
  Manage-a-Club Career's older Bundestrainer copy with GD-0033/ADR-0084:
  unlock stays `manager rep >= 75 AND 5 seasons`, trophies feed reputation
  instead of bypassing tenure, hard board-confidence values remain calibration
  debt, and reputation uses per-region values plus a global aggregate. Nico's
  D1-D3 choices are recorded in
  [FMX-130 decision queue](../40-Execution/fmx-130-career-bundestrainer-reconciliation-decision-queue-2026-06-15.md).
- [Identity & Access Context Definition](../60-Research/identity-access-context-definition-2026-06-15.md) -
  FMX-163 Perplexity-first and source-checked context-definition packet for
  accepted
  [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]:
  core Identity & Access only, passkey-first plus password fallback, explicit
  `PrincipalContext` public contract and clear cuts away from domain
  memberships, payments/entitlements, age policy, Offline Sync queues,
  Community Overlay pack lifecycle and Audit & Security retention. Decision
  accepted in [FMX-163 decision queue](../40-Execution/fmx-163-identity-access-decision-queue-2026-06-15.md).
- [Staff Skill MVP Scope](../60-Research/staff-skill-mvp-scope-2026-06-15.md) -
  FMX-152 Perplexity-first and source-checked packet for the GD-0021
  staff-skill MVP activation gate. Nico accepted narrow Staff Operations
  pipeline modifiers, GD-0021-only promotion, banded pipeline explanations
  rather than full cards and the People -> Staff Operations -> consumer-context
  contract boundary on 2026-06-16. Decision record:
  [FMX-152 decision queue](../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15.md).
- [BfDI Breach Notification Playbook](../60-Research/breach-notification-runbook-2026-06-15.md) -
  FMX-183 Perplexity-first and source-checked packet for GDPR Art. 33/34
  operational response: [[../30-Implementation/privacy-and-consent]] §9 remains
  the legal decision tree/template, while [[../30-Implementation/incident-response]]
  owns `T0`, 72-hour checkpoints, BfDI/national-authority route checks,
  severity mapping, RACI and drill cadence. Decision remains pending Nico in
  [FMX-183 decision queue](../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15.md).
- [Effect-intent Taxonomy Across Narrative and Media Ecology](../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15.md) -
  FMX-162 Perplexity-first and source-checked packet for draft
  [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]:
  one advisory published-language catalog across Narrative dialogue/press and
  Media Ecology coverage, owner-context validation and a future exhaustive
  mapping conformance test. Decisions remain pending in
  [FMX-162 decision queue](../40-Execution/fmx-162-effect-intent-taxonomy-decision-queue-2026-06-15.md).
- [Responsible Gaming Binding Record](../60-Research/responsible-gaming-binding-record-2026-06-15.md) -
  FMX-193 Perplexity-first and source-checked packet for the draft
  responsible-gaming invariant: no paid random rewards, no coercive retention
  loops, dark-pattern release self-audit, optional local session reminders,
  versioned public statement and compliance evidence home. Decisions remain
  pending in
  [FMX-193 decision queue](../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15.md).
- [Cosmetic Identity Catalog](../60-Research/cosmetic-identity-catalog-2026-06-15.md) -
  FMX-192 Perplexity-first and source-checked packet for draft
  [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]] and
  [[../20-Features/feature-cosmetic-identity-catalog]]: free Create-a-Club
  baseline identity, eight-family cosmetic taxonomy, deterministic
  non-tradeable/no-RNG acquisition classes, IP/accessibility evidence and
  pricing/legal handoff hooks. Decisions remain pending in
  [FMX-192 decision queue](../40-Execution/fmx-192-cosmetic-identity-catalog-decision-queue-2026-06-15.md).
- [PWA Offline Mobile Release Content QA Gates](../60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15.md) -
  FMX-197 Perplexity-first and source-checked packet for the ADR-0118
  follow-up: hybrid-online offline degradation, storage/quota/eviction UX,
  service-worker rollback, staged release evidence, content-pack validation,
  pseudo-loc/generated-content safety and versioned rebaseline records.
  Decisions remain pending in
  [FMX-197 decision queue](../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15.md).
- [Mutation Testing Gate](../60-Research/mutation-testing-gate-2026-06-15.md) -
  FMX-172 Perplexity-first and source-checked packet for the ADR-0118
  follow-up: scoped Stryker mutation testing, baseline-first 70/80/90
  thresholds, reporting/nightly/release cadence before any PR subgate,
  CI-only incremental artifacts and deterministic survivor triage. Decisions
  remain pending in
  [FMX-172 decision queue](../40-Execution/fmx-172-stryker-mutation-gate-decision-queue-2026-06-15.md).
- [Babylon Renderer Stack Cleanup](../60-Research/babylon-vs-three-floor-tier-budget-2026-06-15.md) -
  FMX-158 Perplexity-first and source-checked cleanup for the ADR-0047 renderer
  amendment: Babylon.js is the only planned optional 3D presentation stack,
  Canvas 2D remains match-authoritative and exact floor-tier thresholds stay a
  future implementation measurement gate.
- [Notification Offline Delivery and Ratification Packet](../60-Research/notification-offline-delivery-2026-06-15.md) -
  FMX-156 Perplexity-first and source-checked packet for ADR-0043 -> ADR-0102:
  inbox-first offline replay, Web Push/native push as best-effort
  wake/attention, conservative cross-device suppression and dependency-version
  routing. Decision remains pending Nico in
  [FMX-156 decision queue](../40-Execution/fmx-156-notification-platform-decision-queue-2026-06-15.md).
- [Code-CI Pipeline Contract](../60-Research/code-ci-pipeline-2026-06-15.md) -
  FMX-175 Perplexity-first and source-checked packet for future code-CI
  branch-protection contexts: active `docs-check` / `linear-id`, future
  `quality` / `e2e` / `security` after real scripts, workflows and burn-in, and
  D-002 cleanup as historical lessons only.
- [Architecture Fitness Function for No Shared Tables](../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15.md) -
  FMX-167 Perplexity-first and source-checked packet for the future code-phase
  no-shared-tables / no-cross-context-joins enforcement: `dependency-cruiser`
  for import boundaries, custom TypeScript/SQL scanners for Drizzle/schema/query
  and migration boundaries, and hard failure for core violations after real
  `quality` scripts/workflows burn in.
- [pnpm Tooling Currency](../60-Research/pnpm-tooling-currency-2026-06-15.md) -
  FMX-195 source-checked update of the active pnpm pin to 11.7.0, preserving the
  npm dist-tag vs published-release caveat and the future bootstrap re-check
  guardrail.
- [Tooling Currency Sweep](../60-Research/tooling-currency-sweep-2026-06-15.md) -
  FMX-168 Perplexity-first and source-checked stack-currency packet for the
  future code bootstrap: draft
  [Stack Currency Ledger](../30-Implementation/stack-currency-ledger.md),
  source-conflict policy, PostgreSQL 17 vs 18.x drift, latest-stable
  compatibility bundle and automation timing. Decisions remain pending in
  [FMX-168 decision queue](../40-Execution/fmx-168-tooling-currency-decision-queue-2026-06-15.md).
- [Replay/dedup ownership seam](../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15.md) -
  FMX-164 Perplexity-first and source-checked packet for ADR-0119: Offline Sync
  owns client queue/retry/rebase UX; Audit & Security owns authoritative
  replay/dedup policy and processed-command state through Command Reception;
  ADR-0028 remains post-commit event publication/domain mutation trail.
- [Deterministic Simulation QA Harness](../60-Research/deterministic-simulation-qa-harness-2026-06-15.md) -
  FMX-196 Perplexity-first and source-checked packet for draft ADR-0120:
  replay evidence levels, seed tiers, statistical soak metrics, runtime parity
  and save-forward/replay compatibility boundaries. Decisions remain pending in
  [FMX-196 decision queue](../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15.md).
- [Documentation Baseline 2026-05-22](Documentation-V1.md) - current
  temporal/structural closure baseline for vault gaps.
- [Wave 3 Gap Analysis](../95-Archive/gap-reports/wave-3-gap-analysis.md) - superseded
  planning backlog; kept for traceability of W3 IDs.
- [Research Wave 2 Gaps](../95-Archive/gap-reports/research-wave-2-gaps.md) - superseded
  by Wave 3; kept for traceability of R2-01..R2-19 IDs.

## Domain-Model Audit & Backlog (2026-06-02)

- [[../60-Research/domain-model-audit-and-backlog-2026-06-02]] — full read-only DDD +
  gameplay documentation audit of the vault (368 docs classified, 11 domain-audit lanes,
  14 adversarial gap-challenges) plus a **platform-tier follow-up audit** (5 lanes:
  Identity, Offline Sync, Audit & Security, Save/Persistence, IP). Produces an executive
  audit, current-state inventory, proposed **target domain model** (keep 19 ratified, ratify
  5 proposed, add 3 net-new: Competition & Fixtures, Discipline, Loan Lifecycle), a
  **26-entry gap register** (1 critical G1 Competition & Fixtures + 13 high), Obsidian
  **vault-design deltas**, a reusable **planning-agent blueprint**, and adversarial
  consistency + platform-tier follow-up reviews. Backlog staged as Linear team FMX epics
  **FMX-56..FMX-65** (37 children FMX-66..FMX-102) + platform-tier epic **E10/FMX-103**
  (14 children FMX-104..FMX-117) + dependency links. `status: draft` proposal — all items
  pending Nico's ask-first gate.

## Mobile Route Map, IA & Client-State (FMX-98, 2026-06-03)

- [[../60-Research/mobile-route-map-ia-and-client-state-2026-06-03]] — FMX-98. 2026
  mobile-PWA navigation IA + football-manager-game nav survey, React/TanStack client-state
  layering (server=Query · drafts=Dexie · route=Router · ephemeral=React · narrow Zustand
  slice), optimistic/draft lifecycle, and the Comlink + `postMessage` worker bridge +
  separate-worker topology. Grounds the ratified
  [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (D1–D3 = A,A,A, Nico
  2026-06-03); resolves GD-0016 R2-07/R2-17 + the GD-0016↔ADR-0021 Zustand contradiction.

## Onboarding 60-second flow & guided first season (FMX-99, 2026-06-03)

- [[../60-Research/onboarding-guided-first-season-2026-06-03]] — FMX-99 synthesis
  for GD-0012 R2-05. Grounds Nico's selected options: current FTUE path,
  Season-1 objective roadmap and wage runway as the first economy lesson.
  Defines the stopwatch target (<60s to first meaningful tactical choice, <3min
  to first match), guided-season phase table, deterministic feed-card scoring,
  per-save-only behaviour adjustment, assistant auto-handling boundary and
  keyboard-first / WCAG 2.2 AA onboarding-route requirements. Feeds approved
  [[../50-Game-Design/GD-0012-onboarding]] and
  [[../50-Game-Design/onboarding-and-tutorial]]; raw capture:
  [[../60-Research/raw-perplexity/raw-onboarding-guided-first-season-2026-06-03]].

## Player Contract Lifecycle FSM (FMX-81, 2026-06-03)

- [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]] — FMX-81 synthesis
  for contract renewal, expiry, Bosman/pre-contract and free-agent signing
  ownership. Grounds Nico's selected options: Squad & Player owns lifecycle
  truth, top-5 profile depth is included, and free-agent/pre-contract flows use
  separate Transfer-owned cases. Feeds proposed
  [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]],
  state machine [[../10-Architecture/state-machines/player-contract-lifecycle]],
  [[../50-Game-Design/GD-0006-transfers]] and
  [[../50-Game-Design/transfer-market-and-contracts]]; raw capture:
  [[../60-Research/raw-perplexity/raw-player-contract-lifecycle-fsm-2026-06-03]].

## Player Discipline Sub-Aggregate (FMX-80, 2026-06-05)

- [[../60-Research/player-discipline-sub-aggregate-2026-06-05]] - FMX-80
  synthesis for G18. Grounds the proposed
  [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  and state machine [[../10-Architecture/state-machines/player-discipline]] with
  official discipline-rule source checks, football-manager genre precedent and
  Klubhaus Elf-specific DDD ownership trade-offs. Records Nico's selected defaults:
  Squad & Player process manager/sub-aggregate, straight-red appeals only,
  profile-driven suspension scopes and appeal resolution before the next
  relevant fixture; raw capture:
  [[../60-Research/raw-perplexity/raw-player-discipline-sub-aggregate-2026-06-05]].

## Opposition-template AI Consumption Contract (FMX-67, 2026-06-05)

- [[../60-Research/opposition-template-ai-consumption-contract-2026-06-05]] -
  FMX-67 synthesis for G11. Grounds accepted
  [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  with real-world opposition analysis workflows, Football Manager/OOTP
  pre-match strategy precedents and deterministic replay constraints. Records
  Nico's selected defaults: split event model, final immutability at
  `lineup_locked` and dedicated `WorldAiMgmtRng` sub-label; raw capture:
  [[../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-2026-06-05]].

- [[../60-Research/opposition-template-ai-consumption-ratification-2026-06-14]] -
  FMX-136 ratification cleanup for accepted/binding ADR-0080. Grounds the AI
  World Simulation planning-source owner, fail-fast
  `opposition_template_selection_missing` behavior and embedded
  `TacticSnapshot.oppositionTemplate` replay payload; raw capture:
  [[../60-Research/raw-perplexity/raw-opposition-template-ai-consumption-ratification-2026-06-14]].

## Pitch-Condition State Ownership Reconciliation (FMX-142, 2026-06-14)

- [[../60-Research/pitch-condition-state-ownership-2026-06-14]] -
  FMX-142 synthesis for the ADR-0077 / bounded-context-map pitch-state
  ambiguity. Confirms the accepted split: Stadium Operations owns
  pitch-condition state and `PitchConditionChanged`; Environment & Climate
  owns weather facts, forecasts and pitch-weather derivation rules. Raw
  captures:
  [[../60-Research/raw-perplexity/raw-pitch-condition-state-ownership-ddd-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-pitch-condition-realworld-operations-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-pitch-condition-game-precedents-2026-06-14]].

## Rivalry Commercial Signal Contract Reconciliation (FMX-134, 2026-06-14)

- [[../60-Research/rivalry-commercial-signal-contract-2026-06-14]] -
  FMX-134 synthesis for the orphan `RivalryCommercialSignal` seam between
  ADR-0057, ADR-0058 and the bounded-context map. Recommends the non-binding
  ADR-0111 packet: delete the orphan signal, let CommercialPortfolio derive
  commercial interpretation from `RivalryTierTransitioned` /
  `DerbyContext(matchId)` through a local ACL/projection, and keep fan-side
  `derby_factor` with Audience & Atmosphere. Raw captures:
  [[../60-Research/raw-perplexity/raw-rivalry-commercial-signal-ddd-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-rivalry-commercial-signal-realworld-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-rivalry-commercial-signal-games-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-rivalry-commercial-signal-source-checks-2026-06-14]].

## Age Assurance and IARC/USK Rating Evidence (FMX-185, 2026-06-14)

- [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]] -
  FMX-185 synthesis for the MVP age-gate and rating-evidence contract.
  Recommends draft
  [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  plus [[../40-Compliance/age-assurance-and-rating-evidence]]: a 16+
  self-declaration before account fields/optional telemetry, no under-16
  account/refusal persistence/optional telemetry trail, no DOB at MVP, and a
  store/rating evidence packet for IARC/USK. Decision remains pending Nico in
  [[../40-Execution/fmx-185-age-assurance-decision-queue-2026-06-14]]. Raw
  captures:
  [[../60-Research/raw-perplexity/raw-age-assurance-legal-posture-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-age-rating-iarc-usk-evidence-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-football-manager-age-rating-precedents-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-age-assurance-source-checks-2026-06-14]].

## Determinism Portfolio Principle (FMX-138, 2026-06-14)

- [[../60-Research/determinism-portfolio-principle-2026-06-14]] -
  FMX-138 synthesis for the cross-cutting deterministic-vs-seeded-variance
  question across ADR-0018/0083/0086/0088 and GD-0024/GD-0036. Recommends
  draft
  [[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  with a three-surface classification: audit/replay surfaces and
  projection/measurement surfaces stay pure deterministic; variety/drama
  surfaces may use bounded seeded variance through existing owner-context RNG
  streams. Decision remains pending Nico in
  [[../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-determinism-portfolio-simulation-architecture-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-determinism-portfolio-game-precedents-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-determinism-portfolio-realworld-football-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-determinism-portfolio-source-checks-2026-06-14]].

## Command Signing and Save Trust (FMX-184, 2026-06-14)

- [[../60-Research/command-signing-save-trust-2026-06-14]] -
  FMX-184 synthesis for the dead pre-mortem ADR-0026/0028 command-signing and
  save-trust concepts. Grounds accepted
  [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  and accepted
  [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]:
  server-authoritative command validation plus mandatory app-managed/device
  Ed25519 evidence from the first code phase, WebAuthn/passkeys only for
  login/high-value ceremonies, derived save trust plus public eligibility, and
  public save eligibility based on server/internal HMAC proof, command root,
  engine/content hash and import/debug downgrade flags. Decision record:
  [[../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-command-integrity-and-replay-protection-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-save-trust-provenance-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-command-save-trust-source-checks-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-hybrid-ed25519-command-evidence-2026-06-14]].

## Replay/Dedup Ownership Seam (FMX-164, 2026-06-15)

- [[../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]] -
  FMX-164 synthesis for the ownership seam between Offline Sync, Audit &
  Security, command validation and the transactional outbox. Grounds accepted
  [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]:
  authoritative replay/dedup policy and processed-command state live in
  Audit & Security's synchronous Command Reception capability; Offline Sync owns
  client queue/retry/rebase UX; ADR-0028 remains post-commit publication/domain
  mutation trail. Decision record:
  [[../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]],
  [[../60-Research/raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]].

## Deterministic Simulation QA Harness (FMX-196, 2026-06-15)

- [[../60-Research/deterministic-simulation-qa-harness-2026-06-15]] -
  FMX-196 synthesis for deterministic simulation QA, replay artifact tiers,
  seed fixture cadence, soak statistics, same-WASM parity and save-forward vs
  version-pinned replay compatibility. Grounds draft
  [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  plus draft [[../40-Quality/deterministic-simulation-qa-harness]]. No decision
  is binding until Nico answers D1-D7 in
  [[../40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15]],
  [[../60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15]].

## LLM Prose Replay Determinism Floor (FMX-153, 2026-06-14)

- [[../60-Research/llm-prose-replay-determinism-floor-2026-06-14]] -
  FMX-153 synthesis for the minimum deterministic replay/reopen contract for
  generated Narrative prose. Grounds accepted
  [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]]
  with the binding floor: persist exact display snapshots for player-visible
  revisitable Template/LLM prose, render snapshots verbatim on reopen/replay,
  treat provider/cache metadata as provenance only and keep match commentary as
  Narrative display over committed match events. Decision record:
  [[../40-Execution/fmx-153-llm-prose-replay-determinism-decision-queue-2026-06-14]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-llm-prose-replay-determinism-floor-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-narrative-replay-game-precedents-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-llm-display-snapshot-source-checks-2026-06-14]].

## Test Strategy and Quality Gates (FMX-177, 2026-06-14)

- [[../60-Research/test-strategy-adr-2026-06-14]] -
  FMX-177 synthesis for replacing the stale pre-mortem `ADR-0040`
  test-strategy target with accepted
  [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  and current [[../40-Quality/test-strategy]]. Records Nico's accepted D1-D6
  packet: tiered 16-layer quality strategy, Vitest projects + Playwright
  E2E/PWA split, replayable fast-check property evidence, scoped Stryker
  nightly/release first, 85/85/85/75 per-file base threshold and portable CI
  with future local `xAi` runner capability gated by later compatibility,
  isolation, secret, maintenance and cost proof. Decision record:
  [[../40-Execution/fmx-177-test-strategy-decision-queue-2026-06-14]]. Raw
  capture:
  [[../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]].

## Hidden-Attribute Reveal Owner Reconciliation (FMX-154, 2026-06-14)

- [[../60-Research/hidden-attribute-reveal-owner-reconciliation-2026-06-14]] -
  FMX-154 synthesis for the GD-0027/GD-0021 ownership/status cleanup. Confirms
  the accepted split: People owns hidden persona-label truth and derivation,
  Scouting owns only confidence/reveal state via `HiddenFlagRevealLedger`, and
  Squad & Player / UI presents banded read models. Raw capture:
  [[../60-Research/raw-perplexity/raw-hidden-attribute-reveal-owner-reconciliation-2026-06-14]].

## Statistics & Analytics Read-Model Owner (FMX-94, 2026-06-05)

- [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]] -
  FMX-94 synthesis for G19 and the ADR-0068 `standingsRef` dependency.
  Grounds proposed
  [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]],
  accepted [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] and draft
  [[../20-Features/feature-statistics-analytics-hub-mvp]] with real-world
  official-vs-derived football analytics practice, Football Manager/OOTP
  analytics/history surfaces and DDD/CQRS projection ownership trade-offs.
  Records Nico's selected defaults: dedicated projection-only Statistics &
  Analytics owner, per-save projections plus immutable Manager & Legacy / HoF
  handoff snapshots, full MVP Analytics Hub and core-plus-model metric set; raw
  capture:
  [[../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]].

## Standings Authority - League vs Statistics (FMX-131, 2026-06-12)

- [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]] -
  FMX-131 synthesis for the ADR-0066 / ADR-0068 / ADR-0081 seam. Grounds the
  accepted split: League Orchestration owns tie-break rules, official
  current/final ordering and promotion/relegation/season rollover; Statistics &
  Analytics owns standings history/display projections, leaders and analytics
  views only. Raw capture:
  [[../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]].

## Insolvency Event-To-Ledger Posting Contract (FMX-146, 2026-06-12)

- [[../60-Research/insolvency-ledger-posting-contract-2026-06-12]] -
  FMX-146 synthesis for the ADR-0101 D4 seam. Grounds the accepted split:
  ADR-0079/GD-0030 own the shared `InsolvencyCaseStage`; administration,
  points deductions, embargoes, wage-cap policy and fire-sale opening are
  state/policy facts only; wage caps constrain future ADR-0105 wage blocks;
  completed fire sales reuse ADR-0105 registration disposal/write-off postings;
  and creditor haircut/forgiveness uses `InsolvencyCreditorWriteOffPosted`.
  Raw captures:
  [[../60-Research/raw-perplexity/raw-insolvency-ledger-real-world-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-insolvency-ledger-ddd-accounting-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-insolvency-ledger-games-2026-06-12]].

## Match-Engine Contract Ratification (FMX-135, 2026-06-12)

- [[../60-Research/match-engine-contract-ratification-2026-06-12]] -
  FMX-135 synthesis for the ADR-0096 runtime fork and status/binding seam.
  Grounds the accepted decision record with Perplexity refresh plus primary
  Wasmtime/libm/pure-rand/OOTP checks. Nico approved D1=B single Rust/WASM
  module everywhere, mandatory integer/fixed-point replay-bearing math, D2-A
  quality-profile precedence, D3-A carry-forward / 9-stream cleanup, D4
  single-WASM readiness spike and D5 cleanup of ADR-0096/0072/0077/0078/0086/
  0087 to `accepted` / `binding: true`. Raw captures:
  [[../60-Research/raw-perplexity/raw-match-engine-runtime-fork-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-match-engine-replay-quality-profiles-2026-06-12]].
  Decision record:
  [[../40-Execution/fmx-135-match-engine-contract-decision-queue-2026-06-12]].

## Match-Engine Core Model and Calibration (FMX-133, 2026-06-13)

- [[../60-Research/match-engine-core-model-2026-06-13]] -
  FMX-133 synthesis for GD-0002's statistical envelopes, xG/EPV/action utility,
  attribute probability mapping, spatial sample-density and calibration-harness
  gates. Recommends draft
  [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] and keeps
  numeric representation closed by ADR-0096. Decision remains pending Nico in
  [[../40-Execution/fmx-133-match-engine-core-model-decision-queue-2026-06-13]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-match-engine-real-world-envelopes-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-match-engine-action-utility-models-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-match-engine-game-precedents-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-match-engine-calibration-harness-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-match-engine-source-checks-2026-06-13]].

## Gameplay Calibration Ownership and Harness (FMX-141, 2026-06-13)

- [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]] -
  FMX-141 synthesis for non-economy gameplay calibration ownership. Recommends
  draft
  [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  plus
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]] so older
  GDDRs point to named slots (`match.liveControl`, `setPieces.readiness`,
  `environment.weatherPitch`, `dialogue.trustMorale`, `media.ecology`,
  `transfer.escalation`, `dynasty.ownershipBoard`, `legacy.hof`,
  `world.drift`, `legacy.nationalTeam`, etc.) instead of generic FMX-52 economy
  calibration.
  Decision remains pending Nico in
  [[../40-Execution/fmx-141-gameplay-calibration-decision-queue-2026-06-13]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-gameplay-calibration-sim-precedents-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-gameplay-calibration-stochastic-harness-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-gameplay-calibration-domain-slots-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-gameplay-calibration-source-checks-2026-06-13]].

## Roguelite Run-End and Carry Economy Tuning (FMX-137, 2026-06-14)

- [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]] -
  FMX-137 synthesis for Create-a-Club Roguelite run-end, carry-slot, async
  cosmetic and archetype-taxonomy tuning. Records Nico's approved D1-D6:
  staged run-end ladder, two unresolved month-end liquidity/licence failures
  after rescue exhaustion, board loss through GD-0030 `last_chance`, capped
  logarithmic carry slots to max 3, light async kit-pattern visibility and
  deferred archetype taxonomy. Accepted decision home:
  [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]. Raw captures:
  [[../60-Research/raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-roguelite-comparable-games-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]].

## Code-Phase DoD Transition Contract (FMX-180, 2026-06-14)

- [[../60-Research/code-phase-dod-transition-contract-2026-06-14]] -
  FMX-180 synthesis for the post-reset executable Definition-of-Done gap.
  Records Nico's approved D1-D4: phase-split DoD, Nx day one, target-only
  `apps/web`/`packages/*` paths until bootstrap and separate pnpm-currency issue
  FMX-195. Accepted ADR:
  [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]];
  executable checklist:
  [[../30-Implementation/code-phase-dod-transition-contract]]. Raw captures:
  [[../60-Research/raw-perplexity/raw-code-phase-dod-monorepo-gates-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-code-phase-dod-game-production-gates-2026-06-14]].

## Monorepo Workspace Bootstrap (FMX-179, 2026-06-14)

- [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]] -
  FMX-179 synthesis for the first real `apps/web` + `packages/*` workspace
  bootstrap shape after ADR-0110. Recommends draft
  [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  and scaffold plan [[../30-Implementation/monorepo-workspace-bootstrap-plan]]:
  progressive one-context package catalog, real foundation packages only,
  workspace package facades, pnpm workspace linking + TypeScript project
  references + Nx TypeScript plugin, no placeholder green gates and
  `@klubhaus-elf/*` namespace pending Nico D1-D8. Raw captures:
  [[../60-Research/raw-perplexity/raw-monorepo-workspace-ddd-package-granularity-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]],
  [[../60-Research/raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]].

## Quality-Profile Enum and Settlement-Path Reconciliation (FMX-147, 2026-06-12)

- [[../60-Research/quality-profile-enum-settlement-path-2026-06-12]] -
  FMX-147 synthesis for the ADR-0101 D3 seam. Records Nico's accepted
  ADR-0070 `FixtureCommercialProfilesPublished.schemaVersion: 2` with canonical
  `qualityProfile` (`competitive-full`, `interactive-standard`,
  `background-detailed`, `background-fast`) plus derived `settlementPath`.
  The old `qualityProfileClass` sketch is replaced as a pre-1.0 docs-only
  correction; ADR-0101 is now `binding: true`. Raw captures:
  [[../60-Research/raw-perplexity/raw-quality-profile-enum-ddd-contract-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-quality-profile-real-world-football-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-quality-profile-sim-games-2026-06-12]],
  [[../60-Research/raw-perplexity/raw-pre1-contract-replacement-2026-06-13]].

## Chart of Accounts and Category Catalog (FMX-150, 2026-06-13)

- [[../60-Research/chart-of-accounts-and-category-catalog-2026-06-13]] -
  FMX-150 synthesis for ADR-0095 LI-9 and the provisional account handles in
  ADR-0105 / ADR-0101. Records Nico's accepted D1-D3: semantic dotted account
  codes, a 40-account medium chart, a separate versioned `categoryCode` catalog
  and an Expert finance surface based on statements plus drilldown/audit
  provenance. Accepted ADR:
  [[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-chart-of-accounts-game-ledger-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-football-club-accounting-families-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-sports-management-finance-ui-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-chart-of-accounts-versioning-2026-06-13]].

## Monetization Model and No-P2W Canon (FMX-191, 2026-06-13)

- [[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]] -
  FMX-191 synthesis for PM-2026-05-20-04-F-01. Recommends the model-level canon:
  free core, deterministic cosmetics, optional non-power Supporter Club, later
  cosmetic-only season card, no ads in MVP, no paid random rewards, strict
  no-P2W entitlement taxonomy and ADR-0063 Investor isolation to singleplayer
  only. Decision remains pending Nico in
  [[../40-Execution/fmx-191-monetization-decision-queue-2026-06-13]]; draft homes:
  [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]] and
  [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-monetization-model-market-precedents-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-monetization-legal-privacy-store-policy-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-no-pay-to-win-guardrails-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-monetization-source-checks-2026-06-13]].

## No-Pay-to-Win and MP-Fairness Invariant (FMX-190, 2026-06-13)

- [[../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] -
  FMX-190 synthesis for the project-wide no-P2W / shared-state fairness invariant.
  Recommends draft
  [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  as a dedicated zero-effect rule for real-money entitlements across shared saves,
  rankings, async groups, watch-party state, exports, official comparisons and future
  multiplayer. Decision remains pending Nico in
  [[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-no-p2w-mp-fairness-guardrails-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-football-manager-monetization-precedents-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-no-p2w-legal-store-policy-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-no-p2w-test-gate-tooling-2026-06-13]].

## Monetization Legal Gates (FMX-194, 2026-06-13)

- [[../60-Research/monetization-legal-gates-2026-06-13]] -
  FMX-194 synthesis for ADR-0063's open provider, refund, age-gate and paid
  soft-launch legal gates. Recommends draft
  [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]]
  as the non-binding decision home: web MoR-first payment posture, native IAP
  boundary, immediate-delivery waiver plus unspent-only revocation/no gameplay
  rollback, proportional age assurance and a paid activation compliance gate.
  Decision remains pending Nico in
  [[../40-Execution/fmx-194-monetization-legal-gates-decision-queue-2026-06-13]].
  Compliance evidence:
  [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]].
  Raw captures:
  [[../60-Research/raw-perplexity/raw-payment-provider-mor-vs-direct-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-refund-spent-cash-policy-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-age-gate-and-soft-launch-gates-2026-06-13]],
  [[../60-Research/raw-perplexity/raw-monetization-legal-source-checks-2026-06-13]].

## AI Narration Scope Freeze and Fallback Coverage (FMX-88, 2026-06-04)

- [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - FMX-88 synthesis freezing Broad Full Dialogue runtime-LLM scope, the
  CI-verifiable `FallbackCoverageManifest`, Article 50 release gate ownership
  and MVP no-export/share rule. Feeds draft
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]],
  draft
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]],
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
  [[../20-Features/feature-ai-narration-mvp-pillar]] and
  [[../30-Implementation/ai-narration-contract-testing-framework]]; raw capture:
  [[../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]].

## Newsworthiness Event-Publication Semantics (FMX-83, 2026-06-04)

- [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - FMX-83 synthesis for G14. Defines the source-owned publication contract
  pattern for `InjuryOccurred`, `ContractExpiring`, `BoardPressureChanged` and
  `TransferRumourPublished`, plus `PlayerSuspended` projection requirements
  only. Feeds proposed
  [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]],
  draft
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]],
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
  [[../20-Features/feature-ai-narration-mvp-pillar]] and
  [[../30-Implementation/ai-narration-contract-testing-framework]]; raw
  capture:
  [[../60-Research/raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]].

## Dialogue Intent Taxonomy and Effect Matrix (FMX-87, 2026-06-05)

- [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
  - FMX-87 synthesis for G13. Grounds the draft
  [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  with comparable sports-manager dialogue systems, real football communication
  surfaces, storylet/dialogue-system design and DDD command/event boundaries.
  Records Nico's selected defaults: Broad MVP surfaces, banded effects and
  persona gate plus bounded scaling. Feeds draft
  [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]],
  draft
  [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]],
  [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]],
  [[../20-Features/feature-ai-narration-mvp-pillar]] and
  [[../30-Implementation/ai-narration-contract-testing-framework]]; raw
  capture:
  [[../60-Research/raw-perplexity/raw-dialogue-intent-taxonomy-effect-matrix-2026-06-05]].

## Fixture Commercial / Competition Revenue Profile Contract (2026-06-03)

- [[../60-Research/fixture-commercial-revenue-profiles-2026-06-03]] - FMX-78
  synthesis for the League Orchestration -> CommercialPortfolio publication
  contract. Recommends event-plus-query, League-owned stable fixture/commercial
  rule facts only, and League-owned competition rule/cadence profiles consumed
  through CommercialPortfolio ACL/projections. Feeds accepted
  [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  and raw capture
  [[../60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]].
  Nico ratified D1-D3 as A/A/A on 2026-06-03; ADR-0070 is accepted/binding.

## AI World-Drift Algorithm (2026-06-03)

- [[../60-Research/ai-world-drift-algorithm-2026-06-03]] - FMX-91 synthesis for
  deterministic long-save world drift: Rising Rival, Giant Collapse and
  Continental Era Shift / rising nations. Records Nico's selected planning
  options: proposed AI World Simulation bounded context, hybrid RNG allocation,
  reputation-first rising-nations scope and two-level global/per-confederation
  caps. Feeds draft [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]],
  proposed
  [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]],
  raw capture
  [[../60-Research/raw-perplexity/raw-ai-world-drift-algorithm-2026-06-03]] and
  the GD-0043 `world.drift` calibration slot. Economy downstream checks remain
  in the FMX-52 economy runbook.

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
- [[../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]] — 10 Findings + 16-Layer-Test-Pyramid, max Score 20; superseded as current instruction source by FMX-177 [[../60-Research/test-strategy-adr-2026-06-14]]
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
- [Presentation Renderer Strategy - Canvas 2D plus Babylon.js](../60-Research/presentation-renderer-strategy.md) — 2026-05-22, amended by ADR-0047 and cleaned up by FMX-158 on 2026-06-15. Promotes the attached renderer report and follow-up review into the decision basis for ADR-0041: MVP match remains Canvas 2D; optional post-MVP 3D/2.5D scenes are presentation-only, lazy-loaded, device-gated and fallback-safe; Babylon.js is the only planned optional 3D stack.
- [Data Generators - Names, Crests, Cities, Clubs, Players - Locked Decisions](../60-Research/data-generators.md) — D2 (2026-05-17).
- [AI Manager Behaviour - Architecture, Personalities, Difficulty, World Drift](../60-Research/ai-manager-behaviour.md) — D4 (2026-05-17).
- [Tactics & Formations - Mobile-first Manager Game Tactics Depth](../60-Research/tactics-and-formations.md) — D3 (2026-05-17).
- [Player Strength Presentation - Impact Lens](../60-Research/player-strength-presentation.md) — locked 2026-05-17. No global OVR / universal stars; role/tactic-contextual Impact Lens; category bars from D2 1-20 attributes; separate availability status; scouting uncertainty ranges; Squad-owned `ImpactLensProjection` via `queryGateway`.
- [Onboarding Strategy - FTUE, Inbox Tutorial, Feed-Cards, Accessibility](../60-Research/onboarding-strategy.md) — D5 (2026-05-17).
- [Late-Game Systems - Continental Cups, Bundestrainer, Ownership, Hall of Fame, Legacy](../60-Research/late-game-systems.md) — D6 (2026-05-17), preserved as historical research for the Bundestrainer arc; FMX-130 reconciles the current Career-mode unlock to GD-0033/ADR-0084 (`rep >= 75 AND 5 seasons`, no trophy shortcut).
- [Narrative Content & Authoring Pipeline - Events, Story Arcs, Voice, Press, Newspaper](../60-Research/narrative-content-pipeline.md) — D15 (2026-05-17). Markdown + frontmatter source → compiled locale JSON + typed TS message IDs; FormatJS / intl-messageformat ICU MessageFormat. **106 event family IDs** across 10 groups (Match 18 / Squad-Player 20 / Board-Finance 16 / Tactical-Training 6 / Career 9 / Competition 9 / National Team 6 / Personal Life 6 / Rumours-Press 9 / Records-World 7). 3-7 reactive variants per family with context flags (storylet quality-gate model from Failbetter Games). Priority + frequency caps + spam guard. 6 story arc state machines (Transfer Saga / Takeover / Player Crisis / Bankruptcy / Rivalry / National Tournament). 5-tone press conferences (Calm / Critical / Defiant / Self-Deprecating / Ambitious) × 4 contexts with cumulative season effects. Auto-generated Anstoss-style newspaper (weekly + monthly + end-of-season + decade per D6). Multi-layer voice consistency: per-sender voice cards (D5 10 senders) + per-AI-archetype reactions (D4 10 archetypes × event families × tones = ~1500 slots) + CI lint rules. Personal life events layer (Anstoss flavour; toggleable On/Reduced/Off). Build-time-only LLM assistance (never runtime per D8). Git + Markdown + custom React preview app at MVP; Inlang/Tolgee evaluated post-MVP. Deterministic seeded variant selection via D8 RNG stream extensions. Content scale: MVP 80-120 templates → Phase 2 ~250 → Phase 3 ~500. First PWA manager to combine FM tagged event system + Anstoss Zeitung templating + Club Boss inbox cast + Failbetter storylet quality-gates + Disco Elysium voice consistency + Ink-style state-machine arcs. Comparative analysis vs FM PC story engine FM23+ / FM Mobile / Anstoss 3 Zeitung / Club Boss / EA SPORTS FC Career / 80 Days inkle / Failbetter Games / Disco Elysium / NBA 2K / MLB The Show. 3-tier continental cup stack per continent (Champions Cup / Continental League / Challenge Trophy) + global IFC Club World Masters; IP-safe fictional governing bodies (IFC / EFC / AFU / APFC / AFA). Classic 32-team groups + knockout MVP (Swiss model deferred). Country coefficient with biennial slot adjustment. National team mode dual-role with 3 engagement levels (Full Control / Match-Only / Light Touch); historic D6 unlock sketch now superseded for Bundestrainer by FMX-130/GD-0033: rep >= 75 AND 5 seasons, no trophy shortcut; 23-player squads; eligibility via birth + heritage; IFC Nations Championship every 4y + Continental Championships offset 2y; full tournament management UX. Make Your Career creator (Background + Coaching Badge + Tactical Specialisation + Nationality + Languages). 5-branch manager talent tree (Tactician / Motivator / Youth Developer / Transfer Guru / International Specialist). Region-based reputation per country + continent + global. **6 owner archetypes** (Sugar Daddy / Asset Stripper / Foundation-Community / Petrol-State / Murky / Foreign Business) with full Owner Profile schema + user decision points + FFP/regulatory risk hooks. Bankruptcy/administration system with heroic-save HoF credit. **3-layer Hall of Fame**: Manager per-save (top 20) + Manager cross-save global (top 10-20; deterministic-safe) + Club per-save (trophy cabinet + era detection + XI-of-decade + record signings) + Player Legends (Icon/Legend/Favourite tiers). 3-option Legacy mode (Chairman / new manager / hard retire). **3-tier cross-save Legacy perks** (meta-only, world-gen-time only; deterministic-safe per D8). Full 50-year save longevity stack: career phases UI + generational regens ("Son of X") + Year-X events (anniversaries / league reforms / stadium expansions) + cross-decade continental power shifts (era labels) + Anstoss-style newspaper archive + records book. First PWA manager to ship this stack — combines Anstoss-3 Bundestrainer + FM-PC long-save depth + CK3 cross-save HoF + Civ era system + Hattrick record books. Comparative analysis vs FM PC / FM Mobile / EA FC Career / PES / Top Eleven / OSM / Hattrick / Anstoss 3 / SM24 / Football Manager Online (Korea) / CK3 / Civ. 60-second FTUE: single experience question → silent tier+difficulty+club tier mapping → mode picker upfront (both Career + Roguelite day 0) → recommended club + Advanced setup escape → Home dashboard with first inbox tutorial card. 12-message first-season inbox tutorial arc over 4 in-game weeks (Assistant ~50% / Chairman 15% / DoF 20% / Head Scout 10% + 6 supporting senders); per-sender voice cards; pacing 4-6/wk arc → 3-4/wk → 2-3/wk; localised DE + EN templates ~7-10k words. Configurable Assistant Manager character ("Alex" default + 3-5 portraits); per-difficulty intensity (Easy proactive → Sim silent); user override toggle. Feed-card daily action queue as Home primary UI; 3-5 cards/day; Gmail-style swipe semantics (right=complete/open, left=snooze+undo); priority algorithm time-pressure + impact + player-behaviour. Tutorial overlay hierarchy (spotlight 3-4 max / coach marks 2-3 per screen / hint chips / modal full-screen). Returning-user "While you were away" recap auto-card after 7+ in-game days. Veteran skip with safety net (micro-tooltips + settings reset + struggle auto-detection). PWA install prompt per D9 budget. WCAG 2.2 AA / BITV 2.0 (linear semantic onboarding pages, focus-trapped coach marks, prefers-reduced-motion, redundant encodings, Read-aloud Web Speech API, one-handed mode, voice-control labels). Onboarding-state IndexedDB schema. Target D1 ≥ 30 % / D7 ≥ 12 % / D30 ≥ 5 % (between Top Eleven and FM Mobile). Comparative analysis vs FM PC / FM Mobile / Top Eleven / OSM / Hattrick / Anstoss 1-3 / Club Boss / SM24 / EA FC Career / PES. 20 formations (8 core + 12 advanced) approaching FM PC depth on mobile; 50 roles across 8 position groups; 0/6/18 player instructions per Quick/Standard/Expert tier; 1/5/8 team instructions per tier; 5-band visible mentality + 7 internal steps; light Expert per-phase overrides (4 phases); full FM-style tactical familiarity (single bar 0-100 + growth/decay/SwitchModifier/penalty curve + ContinuityMatchFactor + new-manager Similarity); tactic slots 2/3/3 + saved presets 0/10/50 per tier; 3-layer opposition template system (8 archetypes + ~25-30 sub-archetypes + manager-signature templates + emergent club character); 3 universal touchline shouts; tactical predictability penalty up to 5%; URL-encoded share codes per ADR-0016; touch-first UI (tap-to-place primary, drag in Expert only; bottom-sheet role pickers; segmented controls; accordion player instructions; 44×44 px touch targets); attribute schema reconciled with D2 (16 visible + 4 GK + 8 hidden on 1-20 scale). Comparative analysis vs FM PC / FM Mobile / SM24 / EA FC Mobile / PES Mobile / Anstoss / OSM / Top Eleven / Hattrick / Champ Man Mobile. Three-layer architecture: utility AI core + light FSM situation classifier + heuristic constraints. 8 primary personality traits + 3 derived; 10 archetypes (Park-the-Bus / Counter-Attacking / High-Pressing / Possession Maestro / Youth Developer / Galáctico / Moneyball / Tinkerman / Stabilizer / Chaos Motivator). Personality drifts ±0.2 over career. 4 difficulty modes (Easy / Normal / Hard / Sim) - FM-style constraints + AI optimisation, no AI stat cheats. Out-of-match: weekly per-club tick (transfers / contracts / squad / tactics / board / loans / youth / sponsors / facilities) within ~7 ms / club. In-match: 15-25 trigger-based decision passes per match within 30-50 ms budget. World drift: wage inflation, progressive FFP, talent diffusion (40 % elite regens off-top), tactical arms race, board expectation escalation. Structural events: Rising Rival (~5y) + Giant Collapse (~10y). Full AI career arcs at MVP: job churn, retirement at 60-70, legendary detection, rival tracking. Phased late-game content: 12 dynasty achievements + arms race + expectation escalation at MVP; national team / Hall of Fame / legacy mode post-MVP. Uses pre-allocated `WorldAiMgmtRng` (#2) + `MatchAiRng` (#4) with hierarchical sub-labels (D8 future-proof). Comparative analysis vs FM / FM Mobile / Anstoss 3 / EA FC Career / PES / OSM / Hattrick / SM24 / Champ Man. Hybrid wordlist + phonotactic name generation; 7-locale Tier-1 MVP rollout (DACH / British Isles / FR / ES / IT / Low Countries / Lusophone); Wikidata CC0 + UK ONS + INSEE + GeoNames CC-BY 4.0 corpora; living-person filter on Wikidata; "real-region + fictional-city" location policy with Bloom-filter rejection of real cities; grammar-based crest generation (7 shields × 8 divisions × 10 region-biased palettes × 40-50 charges) with lazy SVG render; 5-tier × 10-country club finance matrix (DE / EN / ES / IT / FR / PT / NL / BR / AR / JP); 16+4+8 player attribute schema on 1-20 scale; hybrid archetype-first + CA budget Dirichlet allocator across ~50 archetypes; **lazy expansion** for Tier C players (compact 12-byte profile; full attrs on demand); adds RNG stream #9 `GeneratorRng` with hierarchical sub-labels; ≤ 8 s world genesis on Snapdragon 695 for Large world (~62 500 players); comparative analysis vs FM / FM Mobile / Anstoss / Hattrick / Top Eleven / OSM / SM24 / EA FC / Champ Man. Four-tier device matrix (Premium / Standard / Floor / Off-target); CWV product targets (LCP <= 2.0 s mobile, INP <= 120 ms primary flows, CLS <= 0.05); Lighthouse mobile >= 90; JS bundle budgets (initial <= 200 KB / total <= 700 KB); virtualised tables + DOM-node caps; world-size presets (Small / Medium / Large); match render policy (Text & Stats + 2D canvas; no interactive/authoritative browser 3D match view); phased CI test rig (emulated MVP -> LambdaTest post-MVP -> hardware rig only if needed); comparative analysis vs FM Mobile / Top Eleven / OSM / Soccer Manager / Hattrick / EA FC Mobile / others.
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

## Top-5 Country Economy Calibration Profiles (2026-05-29)

- [[../60-Research/top5-country-economy-profiles-2026-05-29]] — FMX-53 synthesis
  for per-country economic calibration profiles (Germany / England / Spain /
  Italy / France + abstract). Translates revenue mix, media distribution &
  cadence, attendance/utilisation, season-ticket culture, stadium ownership,
  commercial scale, financial-control regime (PSR / DFL licensing / LCPD cap /
  DNCG / FIGC), relegation/parachute support and tax/levy abstraction into an
  IP-clean `CountryEconomyProfile` with banded calibration ranges (not final
  constants). Fills out [[../50-Game-Design/economy-system]] §9, supplies the
  `countryProfileId` referenced by `CompetitionRevenueProfile`, and recommends a
  first calibration baseline. Refines draft
  [[../50-Game-Design/GD-0008-finance-economy]],
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] and
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]].

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

## Investor Compliance and Entitlement Boundary (2026-06-01)

- [[../60-Research/investor-compliance-and-entitlement-boundary-2026-06-01]] —
  FMX-50 synthesis for the singleplayer real-money Investor purchase compliance +
  entitlement boundary (gameplay rule unchanged: clean SP cash, no penalty/debt/
  ownership/MP advantage). Defines a `PaymentProviderPort` (Apple/Google consumable
  IAP in app builds, web PSP / Merchant-of-Record in the PWA), a server-
  authoritative idempotent entitlement state machine bound to the account, refund/
  revocation via Apple ASSN / Google void, plain "In-Game Purchases" age rating,
  EU/DE/UK/US consumer-law disclosure, abuse prevention, audit and a SP-allowed /
  MP-denied allow matrix. Grounded in official Apple/Google policy + EU/DE/UK/US
  consumer law + PM-04/PM-08 pre-mortems. Feeds new proposed
  [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  and refines
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../30-Implementation/club-economy-commercial-contracts]],
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  and [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]].
  Payment vendor, refund policy, age-gate and activation timing are HITL/legal gates.

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

## Fan-Service Campaign Catalog and Effects (2026-06-01)

- [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]] —
  FMX-48 synthesis for paid fan-service campaigns as a concrete
  CommercialPortfolio object instead of example-only flavour. Adds a
  `FanEventCampaign` lifecycle, IP-clean catalog for away travel, family /
  community events, choreo/supporter dialogue, beverage rewards and digital fan
  challenges, segment-specific effects, sponsor contribution/make-good fields,
  cooldown/anti-spam policy and legal/risk hooks for travel, alcohol, safety,
  children and digital UGC. Refines draft
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]],
  [[../50-Game-Design/economy-system]],
  [[../50-Game-Design/audience-and-atmosphere]],
  [[../50-Game-Design/stadium-and-campus]],
  [[../50-Game-Design/matchday-event-engine]],
  [[../50-Game-Design/sponsorship-portfolio]],
  [[../20-Features/feature-club-economy-mvp-pillar]],
  [[../30-Implementation/club-economy-commercial-contracts]],
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  and [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]].

## AI Club Economy Behaviour (2026-06-01)

- [[../60-Research/ai-club-economy-behaviour-2026-06-01]] — FMX-51 synthesis for how
  AI-controlled clubs behave economically (ticketing, wages, transfers, debt,
  sponsors, promotion/relegation/cup/shock reactions, insolvency). Composes the locked
  AI architecture ([[../60-Research/ai-manager-behaviour]]) + transfer tiering
  ([[../60-Research/transfer-market-simulation]]) + `CountryEconomyProfile`
  ([[../60-Research/top5-country-economy-profiles-2026-05-29]]) with a thin
  financial-policy layer (five archetypes), three financial regimes, soft diegetic
  homeostasis (no AI stat cheats), staged distress with rare bounded insolvency,
  tiered fidelity and structured rationale tags. Feeds draft
  [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]] and resolves the economy
  slice of [[../50-Game-Design/GD-0010-ai-world]] R2-04/R2-06. AI owner support is
  in-fiction, never the singleplayer Investor. Bands/dampers are calibration inputs
  for FMX-52.

## Economy Calibration and Soak-Test Scenarios (2026-06-01)

- [[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] — FMX-52
  calibration/soak-test capstone consuming FMX-13/41/49/51/53. Defines the calibration
  workflow + evidence-acceptance gate (banded value, soak in band at value & edges, ±
  sensitivity sweep, parameter sheet, Nico sign-off), KPI healthy/warning/critical bands
  (wage/revenue, UEFA-70 squad-cost, debt/revenue, runway, DSCR), tier-scaled
  insolvency-frequency targets with a no-cascade invariant, anti-runaway metrics (title
  HHI/CR4, revenue Gini), failure signatures, a 32-seed PR smoke + 50-season gate +
  100-season deep soak with golden-baseline drift detection, a deterministic forward +
  reverse stress-test scenario matrix, and Quick/Standard/Expert forecast-accuracy
  validation. No final constants (they stay in data behind the gate). Executable contract
  in [[../30-Implementation/economy-calibration-and-soak-test-runbook]]; cross-linked from
  [[../50-Game-Design/economy-system]] §12.

## Fan Persona Privacy and Creative IP-Safe Naming (2026-06-01)

- [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]] —
  FMX-54 synthesis for Audience & Atmosphere named fan groups/reps, persona
  privacy, creative IP-safe social-world naming and Community Overlay import
  boundaries. Locks the planning direction to local/P2P community packs for MVP,
  fictional aggregate fan personas, and policy+test naming guardrails across fan
  groups, reps, slogans/chants, media, sponsors, venues and community overlays.
  Refines [[../50-Game-Design/audience-and-atmosphere]],
  [[../50-Game-Design/GD-0015-ip-clean-data]],
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]],
  [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]],
  [[../30-Implementation/privacy-and-consent]],
  [[../60-Research/data-generators]],
  [[../60-Research/ip-and-licensing]] and
  [[../50-Game-Design/sponsorship-portfolio]].

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

## Narrative Media and Press Content Ownership (2026-06-02)

- [[../60-Research/narrative-content-bounded-context-2026-06-02]] — FMX-31
  synthesis for Press/Media content authoring ownership after ADR-0052 People
  and ADR-0054 Narrative. Recommends extending **Narrative** with
  `PressStorylet`, `ConferenceResponseTree`, `PressArticle`, `ToneProfileLibrary`,
  `PressPublicationPolicy`, deterministic ICU fallback templates, content
  validation, provenance and optional schema-validated LLM paraphrase controls.
  Notification remains delivery/inbox/provider owner, People supplies
  `PersonaContextCard` / `DialogueContextCard`, and owning domains keep
  authoritative state. Feeds proposed
  [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  and raw
  [[../60-Research/raw-perplexity/raw-narrative-content-bounded-context-2026-06-02]].

## EOS Player, Staff, Skills and Personas (2026-05-28)

- [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]] — FMX-23
  synthesis of the Player & Staff Values report plus follow-up Perplexity/Web
  research into a draft path: retain 16+4+8 attributes, add player skills/perks
  as a separate visible layer, model staff skills as narrow GD-0021/FMX-152
  pipeline modifiers, use hidden
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
- [[../60-Research/staff-skill-mvp-scope-2026-06-15]] — FMX-152 refresh of
  the GD-0021 staff-skill MVP decision gate. Source-checks real-world backroom
  specialization, Football Manager/EA FC game precedents and DDD/CQRS
  contracts. Nico accepted D1-D4 = B/A/A/A on 2026-06-16 in
  [[../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]].

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
- [[../60-Research/raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]] -
  FMX-53 four-theme country-economy pass (revenue mix, media/control regime,
  matchday & ST culture / ownership, commercial scale & tax/levy); promoted into
  [[../60-Research/top5-country-economy-profiles-2026-05-29]].
- [[../60-Research/raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01]] -
  FMX-51 four-pass AI-club-economy research (genre AI-club economy mechanics;
  real-club financial archetypes + ratio bands; AI architecture / anti-runaway /
  anti-zombie / soak-test patterns; per-country regulatory rails); promoted into
  [[../60-Research/ai-club-economy-behaviour-2026-06-01]].
- [[../60-Research/raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01]] -
  FMX-52 three-pass calibration/soak research (simulation balancing & long-run economy
  testing; financial stress-testing & scenario/reverse-stress analysis; deterministic-sim
  testing techniques + attendance/fan-demand elasticity); promoted into
  [[../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]].
- [[../60-Research/raw-perplexity/raw-fan-persona-privacy-and-naming-2026-06-01]] -
  FMX-54 three-pass fan-persona privacy and naming research (GDPR boundary for
  fictional fan groups/reps; IP-safe naming for fan/media/sponsor/venue
  surfaces; Community Overlay DSA/AI/UGC future gate); promoted into
  [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]].

## Research Rules

- Use Ref for library, framework, API, and SDK documentation.
- Use Perplexity for broader external research; wired automatically via
  `.cursor/mcp.json`, see [[../90-Meta/mcp-memory-integration]].
- Keep citations and assumptions in the research note.
- Promote final choices into accepted ADRs or approved product/game notes.
