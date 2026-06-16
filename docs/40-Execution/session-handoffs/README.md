---
title: Session Handoffs
status: current
tags: [meta, execution, hot]
created: 2026-05-17
updated: 2026-06-16
type: index
binding: true
related: [[../../90-Meta/agent-memory-protocol]], [[2026-06-16-fmx-155-loan-cap-obligation-catalog]]
---

# Session Handoffs

Hot working memory. One note per substantial session, named
`YYYY-MM-DD-<slug>.md`, created from [[../../90-Meta/templates/handoff]].

Handoffs are working memory, not durable decisions. Promote durable outcomes
into [[../../00-Index/Current-State]], accepted ADRs, approved design notes,
feature specs, or implementation docs — then the handoff may be marked
`status: promoted` or `archived`.

Start-of-session: read the latest handoff if continuing a prior thread.
End-of-session: write or update one (see [[../../90-Meta/agent-memory-protocol]]
§ Session Wrap-Up).

This is the **single** canonical handoff location. (An older
`90-Meta/session-handoffs/` folder was consolidated here on 2026-05-22.)

## Naming

`YYYY-MM-DD-<slug>.md`, e.g. `2026-05-22-presentation-renderer-strategy.md`.

## Required sections

- Goals
- Completed
- Open Tasks
- Decisions Made
- Blockers
- Durable Notes Updated
- Promotion Needed

## Handoffs

- [[2026-06-16-fmx-155-loan-cap-obligation-catalog]] - FMX-155 loan-cap and
  obligation catalog: raw Perplexity/source-check captures, synthesis, accepted
  decision queue, ADR-0075/GD-0006/regulations cleanup and front-door updates.
  Nico accepted layered `LoanRegulationProfile`, focused
  `ObligationConditionCatalog`, Regulations-owned shape, static per-save
  snapshots and exact inspectable clause visibility.
- [[2026-06-16-fmx-188-prompt-injection-defensive-contract]] - FMX-188
  prompt-injection defensive contract for untrusted UGC/community-pack text in
  Narrative LLM prose: raw Perplexity/source-check captures, synthesis,
  decision queue and proposed patches to ADR-0030, ADR-0059, ADR-0098 and the
  AI narration contract-testing framework. Pending Nico D1-D6; recommendation
  is UGC-as-flavor with hard guardrails, air-gapped narrator as default/kill
  switch, strict output schema, fail-closed review and mandatory red-team
  corpus.
- [[2026-06-16-fmx-187-webhook-receiver-security]] - FMX-187 webhook receiver
  security packet: raw Perplexity/source-check captures, synthesis, accepted
  decision record, accepted ADR-0128 and security evidence hook. Nico accepted
  a dedicated ADR, provider-native crypto/JWT/signed-payload verification plus
  delivery/event and business-object dedupe, and focused external pentest before
  public beta/paid launch with public bug bounty deferred until maturity.
- [[2026-06-16-fmx-151-hof-induction-reconciliation]] - FMX-151
  Hall-of-Fame induction RNG reconciliation: raw Perplexity/source-check
  captures, synthesis and decision record closing stale open wording against
  the 2026-06-08 ADR-0083 ratified pure deterministic MVP induction choice.
- [[2026-06-16-fmx-186-erasure-hgb-retention]] - FMX-186 erasure-vs-HGB
  retention packet: raw Perplexity/source-check captures, synthesis, accepted
  decision record, accepted ADR-0127 and legal-review evidence hook. Nico
  accepted current HGB/AO 10/8/6 buckets, detached account-to-finance mapping
  and hybrid shared-history handling; legal/accounting review remains open
  before paid activation.
- [[2026-06-16-fmx-140-live-match-pause-ratification]] - FMX-140 live-match
  pause ratification cleanup: raw Perplexity/source-check captures, synthesis,
  accepted decision queue and ADR-0087/GD-0035/state-machine cleanup. Nico
  chose Design 1 active-manager pause semantics, one MVP tactics pause per
  managed side per half, local pause-trust tier, small Head Coach/host +
  trusted-tier additive ordinary-pause privileges and audit-gated revocation.
- [[2026-06-15-fmx-152-staff-skill-mvp-scope]] - FMX-152 staff-skill MVP
  scope packet: raw Perplexity/source-check captures, synthesis and decision
  queue. Nico accepted D1-D4 = B/A/A/A on 2026-06-16: narrow Staff Operations
  pipeline modifiers, GD-0021 promotion, banded pipeline explanations and
  People -> Staff Operations -> consumer-context contract boundary.
- [[2026-06-15-fmx-130-career-bundestrainer-reconciliation]] - FMX-130 Career
  Bundestrainer reconciliation: raw Perplexity/source-check captures,
  synthesis, accepted decision queue and Career-mode cleanup. Nico chose
  D1-D3=A/A/A: keep GD-0033's `rep >= 75 AND 5 seasons` gate with no trophy
  shortcut, mark hard board-confidence numbers as calibration debt, and use
  per-region reputation plus a global aggregate.
- [[2026-06-15-fmx-170-postgres-schema-ceiling]] - FMX-170 PostgreSQL
  schema-ceiling packet: raw Perplexity/source-check captures, synthesis,
  accepted decision queue and binding ADR-0097 closure. Nico accepted D1-D3:
  300/1000 live-schema SLO, user-confirmed hybrid archive pressure and no
  platform `audit_log`.
- [[2026-06-15-fmx-192-cosmetic-identity-catalog]] - FMX-192 cosmetic identity
  catalog packet: raw Perplexity/source-check captures, synthesis, draft
  GD-0045, draft feature slice and decision queue. Pending Nico D1-D7;
  recommended packet is all A for draft GDDR + feature note, free baseline
  identity, eight-family taxonomy, deterministic non-tradeable/no-RNG
  acquisition, light gated async visibility, item+bundle IP/accessibility
  evidence and a later cosmetic-only deterministic season card.
- [[2026-06-15-fmx-162-effect-intent-taxonomy]] - FMX-162 effect-intent
  taxonomy packet: raw Perplexity/source-check captures, synthesis, draft
  decision queue and draft ADR-0126. Pending Nico D1-D7; recommended packet is
  all A for one published-language catalog, advisory-only producer metadata,
  owner-context validation/application, full v1 catalog rows, People as
  gate/scaler owner, visible bounded audit/history and a future exhaustive
  mapping contract test.
- [[2026-06-15-fmx-163-identity-access-context]] - FMX-163 Identity & Access
  context-definition packet: raw Perplexity/source-check captures, synthesis,
  accepted decision queue and accepted ADR-0123. Nico accepted D1/D2/D3 =
  A/A/A: core I&A only, passkey-first plus password fallback and binding ADR.
  Identity owns account/session/device/global-claim truth and publishes
  `PrincipalContext`; domain memberships, payments/entitlements, age policy,
  Offline Sync queues, Community Overlay pack lifecycle and Audit & Security
  retention stay outside.
- [[2026-06-15-fmx-197-pwa-offline-mobile-release-qa]] - FMX-197
  PWA/offline/mobile release/content-QA packet: raw Perplexity/source-check
  captures, synthesis, draft decision queue, draft ADR-0124 and draft quality
  runbook. Pending Nico D1-D7; recommended packet is all A for hybrid-online
  offline contract, tiered storage budgets/eviction UX, user-mediated SW update
  plus no-op/rescue rollback, staged rollout gates, manifested content-pack
  validation, template-first generated/localized content gates and versioned
  evidence/rebaseline records.
- [[2026-06-15-fmx-172-stryker-mutation-gate]] - FMX-172 Stryker
  mutation-testing gate packet: raw Perplexity/source-check captures,
  synthesis, draft decision queue, draft ADR-0125 and draft quality runbook.
  Pending Nico D1-D6; recommended packet is all A for ADR-0118 high-risk
  deterministic/domain scope, baseline-first 70/80/90 activation,
  reporting/nightly/release cadence before any PR subgate, latest-stable
  Stryker/Vitest pairing at adoption, CI-only incremental artifacts and strict
  deterministic survivor triage.
- [[2026-06-15-fmx-193-responsible-gaming]] - FMX-193 responsible-gaming
  binding record packet: raw Perplexity/source-check captures, synthesis, draft
  decision queue, draft ADR-0122 and draft compliance home. Pending Nico D1-D7;
  recommended packet is all A for dedicated ADR + compliance home, hard no paid
  random rewards, dark-pattern release self-audit, optional local reminders,
  versioned statement now, PM-18 OSS/license split-out and independent guardrail
  acceptance before monetization SKU ratification.
- [[2026-06-15-fmx-168-tooling-currency]] - FMX-168 tooling-currency sweep:
  raw Perplexity/source-check captures, synthesis, draft Stack Currency Ledger
  and Nico decision queue. Recommended packet is D1-D5=A: one vault ledger now,
  stable numeric latest with explicit source-conflict ledger, PostgreSQL 18.x
  as future code bootstrap target after approval, latest-stable compatibility
  bundle at bootstrap and dependency automation after the real workspace exists.
- [[2026-06-15-fmx-167-architecture-fitness-function]] - FMX-167 architecture
  fitness function packet: raw Perplexity/source-check captures, synthesis,
  accepted decision queue, accepted ADR-0121 and current quality runbook. Nico
  accepted D1/D2/D3 = A/A/A: `dependency-cruiser` plus custom TypeScript/SQL
  scanners, hard-fail core boundary/storage violations after real code-phase
  scripts and burn-in, and no code dependencies or fake scripts in docs-only
  phase.
- [[2026-06-15-fmx-183-bfdi-breach-notification]] - FMX-183 BfDI breach
  notification playbook: raw Perplexity/source-check captures, synthesis,
  decision queue and incident-response runbook update. Privacy-and-consent §9
  remains the binding Art. 33/34 legal tree/template; incident-response now
  owns `T0`, 72-hour checkpoints, BfDI/national-authority route verification,
  severity mapping, RACI, Art. 33 checklist, Art. 34 handoff and drill cadence.
- [[2026-06-15-fmx-158-babylon-renderer-stack]] - FMX-158 Babylon renderer-stack
  cleanup: raw Perplexity/source-check captures, synthesis, decision queue and
  cross-vault guidance updates. Canvas 2D stays match-authoritative; Babylon.js
  is the only planned optional presentation 3D stack; Three.js/R3F, PixiJS and
  PlayCanvas are historical/rejected paths unless a future ADR reopens them
  with measured evidence.
- [[2026-06-15-fmx-175-code-ci-pipeline]] - FMX-175 code-CI context packet:
  raw Perplexity/source-check captures, synthesis, decision queue and
  ADR-0044/CI-process cleanup. Nico accepted script/domain-aligned future code
  contexts (`quality`, `e2e`, `security`), burn-in before branch protection and
  in-place D-002 compression; no code workflows or dependencies were added.
- [[2026-06-15-fmx-164-replay-dedup-seam]] - FMX-164 replay/dedup ownership
  seam packet: raw Perplexity/source-check captures, synthesis, accepted
  decision queue and accepted ADR-0119. Approved packet is D1/D2/D3 = A/A/A:
  Audit & Security owns authoritative replay/dedup through synchronous Command
  Reception, Offline Sync owns client queue/retry/rebase UX, and ADR-0028 stays
  post-commit publication/domain mutation trail.
- [[2026-06-15-fmx-196-deterministic-simulation-qa]] - FMX-196 deterministic
  simulation QA packet: raw Perplexity/source-check captures, synthesis, draft
  decision queue, draft ADR-0120 and draft quality runbook. Pending Nico D1-D7;
  recommended packet is all A for replay evidence levels, seed tiers, profile
  gates, soak metrics, save-forward boundary, same-WASM parity and
  rebaseline/retention policy.
- [[2026-06-15-fmx-156-notification-platform]] - FMX-156 Notification platform
  ratification packet: ADR-0102 normalized to `draft` / `binding: false`,
  raw Perplexity/source-check captures and synthesis preserved, and D1-D5
  recommendations queued for Nico. Recommended package is inbox-first replay,
  Web Push/native push as best-effort wake/attention, conservative push
  suppression and dependency-version routing to follow-up.
- [[2026-06-15-fmx-195-pnpm-tooling-currency]] - FMX-195 pnpm tooling-currency
  update: active pins moved from pnpm 11.1.2 to 11.7.0, with raw
  Perplexity/source-check captures, synthesis and decision queue. Nico selected
  the newest-published-version rule despite npm `latest` / `latest-11` still
  pointing at 11.6.0 on June 15.
- [[2026-06-14-fmx-177-test-strategy]] - FMX-177 test strategy and quality
  gates packet: raw Perplexity/source-check captures, synthesis, decision
  record, accepted ADR-0118 and current quality note. Nico accepted D1-D4=A,
  D5=A (`85/85/85/75`) and D6=A-custom: portable GitHub-hosted path plus
  future local `xAi` runner capability, inactive until a separate
  compatibility/isolation/secrets/maintenance/cost gate proves it. Follow-ups:
  FMX-196 deterministic sim/replay/soak/save-forward matrix and FMX-197
  PWA/offline/mobile/rollback/content-QA gates.
- [[2026-06-14-fmx-153-llm-prose-replay-determinism]] - FMX-153 LLM prose
  replay determinism packet: raw Perplexity/source-check captures, synthesis,
  decision queue and accepted ADR-0117. Approved packet is D1/D2/D3 = A/A/A:
  exact persisted display snapshots for player-visible revisitable
  Template/LLM prose, per-save Narrative-owned snapshot/provenance storage and
  match commentary as Narrative display over committed match events rather than
  `MatchFrame` or replay-bearing match state.
- [[2026-06-14-fmx-179-monorepo-workspace-bootstrap]] - FMX-179
  monorepo/workspace bootstrap packet: raw Perplexity/source-check captures,
  synthesis, decision queue, draft ADR-0114 and exact scaffold plan. Recommended
  packet is D1-D8 = A/A/A/A/A/A/A/A: progressive one-context package catalog,
  real foundation packages only, workspace package facades, pnpm workspace
  linking + TypeScript references + Nx TypeScript plugin, no placeholder green
  gates, `@klubhaus-elf/*` namespace, module owner metadata now / domain
  CODEOWNERS later and scaffold-time version re-check/exact pinning.
- [[2026-06-14-fmx-138-determinism-portfolio-principle]] - FMX-138
  portfolio determinism + seeded-variance principle packet: raw
  Perplexity/Web/source-check captures, synthesis, decision queue and draft
  ADR-0113. Recommended packet is D1/D2/D3 = A/A/A: classify surfaces by
  portfolio role, use bounded seeded variance only through existing
  owner-context RNG streams and keep Hall-of-Fame induction pure deterministic
  for MVP unless a future approved owner-stream flavor rule is added.
- [[2026-06-14-fmx-184-command-signing-save-trust]] - FMX-184 command-signing
  and save-trust packet: raw Perplexity/source-check captures, synthesis,
  decision record and accepted ADR-0115/ADR-0116. Approved packet is D1-D15:
  server-authoritative commands plus mandatory app-managed/device Ed25519
  evidence, passkeys only for login/high-value ceremonies, derived save trust
  plus public eligibility, internal HMAC proof over root/hash evidence,
  strict irreversible public downgrade rules and public features limited to
  server-verified or imported-verified eligible histories.
- [[2026-06-14-fmx-185-age-assurance]] - FMX-185 age assurance and IARC/USK
  rating-evidence packet: raw Perplexity/Web captures, synthesis, compliance
  evidence home, decision queue and draft ADR-0112. Recommended packet is
  D1-D6 = A/A/A/A/A/A: 16+ self-declaration before account fields/optional
  telemetry, no under-16 account/refusal persistence/optional telemetry trail,
  no DOB at MVP, IARC-first rating path, no default AVS/JmSchB appointment
  until risk triggers fire, and a store/rating evidence packet before store or
  paid activation.
- [[2026-06-14-fmx-134-rivalry-commercial-signal]] - FMX-134
  RivalryCommercialSignal orphan-contract packet: raw Perplexity/Web captures,
  synthesis, decision queue and draft ADR-0111. Recommended packet is D1/D2/D3
  = B/A/A: remove the orphan signal, let CommercialPortfolio derive from
  `RivalryTierTransitioned` / `DerbyContext` through a local ACL/projection,
  keep fan-side `derby_factor` with Audience & Atmosphere and apply accepted
  ADR/map cleanup after Nico approval.
- [[2026-06-14-fmx-142-pitch-condition-state-ownership]] - FMX-142
  pitch-condition ownership reconciliation: raw Perplexity/Web captures,
  synthesis and decision queue. Confirmed accepted line is Stadium Operations
  owns pitch-condition state and `PitchConditionChanged`; Environment &
  Climate owns weather facts, forecasts and pitch-weather derivation rules.
- [[2026-06-14-fmx-180-code-phase-dod-transition]] - FMX-180 executable
  docs-phase -> code-phase DoD bridge: raw Perplexity/tool captures, synthesis,
  decision queue, accepted ADR-0110 and current implementation checklist. Nico
  approved phase-split DoD, Nx day one, target-only `apps/web`/`packages/*` paths
  until bootstrap and separate pnpm currency issue FMX-195.
- [[2026-06-14-fmx-154-hidden-attribute-reveal-contract]] - FMX-154 hidden-attribute
  reveal contract cleanup: raw Perplexity/Web capture, synthesis and accepted
  GD-0027/GD-0021 reconciliation. Confirmed line is People derives/owns hidden
  persona-label truth, Scouting owns confidence/reveal state, and Squad/UI
  presents banded read models; no new gameplay thresholds or ADRs.
- [[2026-06-14-fmx-137-roguelite-tuning]] - FMX-137 Create-a-Club Roguelite
  run tuning packet: raw Perplexity captures, synthesis, decision queue and
  accepted GD-0044. Approved packet is D1-D6 = A/A/A/A/A/A: staged run-end
  ladder, two unresolved month-end liquidity/licence failures after rescue
  exhaustion, board loss through GD-0030 `last_chance`, capped logarithmic
  functional carry slots to max 3, light async kit-pattern visibility and
  deferred archetype taxonomy.
- [[2026-06-13-fmx-141-gameplay-calibration-owner]] - FMX-141 gameplay
  calibration ownership packet: raw Perplexity/source-check captures, synthesis,
  draft GD-0043, gameplay calibration runbook, HITL queue and affected GDDR
  retargeting from generic FMX-52 calibration to named slots. Recommended
  packet is A/A/A/A/A: gameplay-wide umbrella, 14-slot taxonomy, T0-T4 harness
  tiers, Nico-owned rebaseline authority until delegated and realism-anchored
  fun/perception overrides.
- [[2026-06-13-fmx-133-match-engine-core-model]] - FMX-133 match-engine core
  model decision packet: raw Perplexity/source-check captures, synthesis, HITL
  queue and draft GD-0042. Recommended packet is A/A/A/A/A/A: hybrid
  event-chain + xT/EPV utility + shot xG + attribute contests, broad v1
  statistical envelopes, profile spatial-density rules, tiered calibration
  harness and ADR-0096 numeric representation closure preserved.
- [[2026-06-13-fmx-194-monetization-legal-gates]] - FMX-194 monetization legal
  gates decision packet: raw Perplexity/source captures, synthesis, compliance
  evidence home, HITL queue and draft ADR-0109. Recommended packet is A/A/A/A/A:
  web MoR-first with direct PSP fallback, Apple/Google IAP for native in-app
  digital cash, immediate-delivery waiver plus unspent-only revocation/no
  gameplay rollback, proportional age assurance and paid soft-launch
  compliance-gated activation.
- [[2026-06-13-fmx-190-no-p2w-mp-fairness]] - FMX-190 no-P2W /
  MP-fairness invariant decision packet: raw Perplexity/Web/tooling captures,
  synthesis, HITL queue and draft ADR-0108. Recommended packet is A/A/A/A/A:
  dedicated project-wide ADR, broad shared/competitive surfaces, docs-level
  test contract now with code gates later, paid information as forbidden power,
  and visible cosmetics non-competitive only when mechanically inert.
- [[2026-06-13-fmx-191-monetization-model]] - FMX-191 monetization model and
  no-P2W canon decision packet: raw Perplexity/Web captures, synthesis, HITL
  queue and draft GD-0041 / ADR-0107. Recommended packet is A/A/A/A/A: free
  core, deterministic cosmetics, optional non-power Supporter Club, later
  cosmetic-only season card, ADR-0063 Investor isolated to singleplayer and
  FMX-190 left for CI/test enforcement.
- [[2026-06-13-fmx-150-chart-of-accounts]] - FMX-150 chart-of-accounts
  decision packet: raw Perplexity captures, synthesis and accepted ADR-0106.
  Nico approved semantic dotted account codes, a 40-account medium chart,
  separate versioned `categoryCode` catalog and Expert statements plus
  drilldown/audit drawer.
- [[2026-06-12-fmx-147-quality-profile-reconciliation]] - FMX-147 quality-profile
  enum reconciliation: raw/synthesis research, Nico-approved D3 decision and
  accepted ADR-0070/ADR-0101 amendments. ADR-0070 now uses
  `FixtureCommercialProfilesPublished.schemaVersion: 2` with canonical
  `qualityProfile` plus derived `settlementPath`; ADR-0101 is fully
  `binding: true`.
- [[2026-06-12-fmx-135-match-engine-contract]] - FMX-135 match-engine contract
  ratification: raw/synthesis research, decision record and accepted ADR
  updates. Nico approved D1-D5 live on 2026-06-12: ADR-0096 is binding with one
  Rust/WASM module everywhere (server Wasmtime, browser WebAssembly API),
  mandatory integer/fixed-point replay-bearing math, D2-A quality-profile replay
  precedence, D3-A carry-forward/9-stream cleanup and D4 single-WASM readiness
  spike before Match runtime implementation. ADR-0072/0077/0078/0086/0087 were
  also cleaned to `binding: true`.
- [[2026-06-12-fmx-146-insolvency-ledger-contract]] - FMX-146 insolvency
  event-to-ledger posting contract: raw/synthesis research and accepted ADR/GDDR
  amendments for the ADR-0050 / ADR-0079 seam. Captures the selected line:
  ADR-0079/GD-0030 own the shared `InsolvencyCaseStage`; administration,
  embargo, points deduction, wage-cap policy and fire-sale opening are
  state/policy facts only; completed fire sales reuse ADR-0105 registration
  postings; creditor haircut/forgiveness uses `InsolvencyCreditorWriteOffPosted`.
  FMX-147 closed D3 on 2026-06-13, so ADR-0101 is now fully binding.
- [[2026-06-12-fmx-131-standings-authority]] - FMX-131 standings authority
  clarification: raw/synthesis research and accepted ADR amendments for the
  ADR-0066 / ADR-0068 / ADR-0081 seam. Captures Nico's selected split: League
  Orchestration owns tie-break rules, official current/final ordering,
  promotion/relegation, qualification and season rollover via
  `GetOfficialCompetitionStandings` / `CompetitionStandingsFinalizedV1`;
  Statistics & Analytics owns `CompetitionStandingsHistory`, league leaders,
  Analytics Hub projections and handoff snapshots only.
- [[2026-06-05-fmx-94-statistics-analytics]] - FMX-94 statistics and
  analytics read-model owner: raw/synthesis research, proposed ADR-0081, draft
  GD-0031 and MVP feature spec for G19 / ADR-0068 `standingsRef`. Captures
  Nico's D1-D4 choices: dedicated projection-only Statistics & Analytics owner,
  per-save projections plus immutable Manager & Legacy / HoF handoff snapshots,
  full MVP Analytics Hub and core-plus-model metric set. Keeps the ratified
  bounded-context table at 19 until ADR-0081 is accepted.
- [[2026-06-05-fmx-67-opposition-template-ai-consumption]] - FMX-67
  opposition-template AI consumption contract: raw/synthesis research and
  proposed ADR-0080 for G11. Captures Nico's D1-D3 choices: split event model,
  final immutability at `lineup_locked` and dedicated `WorldAiMgmtRng`
  sub-label. Keeps Tactics as catalog + selector/publisher owner, AI-management
  as planning-context owner and Match as lock-time `TacticSnapshot` consumer;
  no new bounded context or map change. Template weights/taxonomy and
  scouting-confidence effects remain future calibration/design debt.
- [[2026-06-14-fmx-136-opposition-template-ratification]] - FMX-136
  opposition-template ratification cleanup: raw/synthesis research, decision
  queue and accepted ADR-0080/ADR-0055/map reconciliation. Captures Nico's
  D4-D6 choices: AI World Simulation canonical planning source, fail-fast
  `opposition_template_selection_missing` and embedded
  `TacticSnapshot.oppositionTemplate` replay payload. No new bounded context;
  taxonomy/weights remain calibration debt.
- [[2026-06-05-fmx-80-player-discipline]] - FMX-80 player discipline
  sub-aggregate: raw/synthesis research, proposed ADR-0078 and
  [[../../10-Architecture/state-machines/player-discipline]] for G18.
  Captures Nico's D1-D4 choices: Squad & Player process manager/sub-aggregate
  (no new BC), straight-red appeals only, Regulations-profile-driven
  `competition`/`domestic`/`all` scopes and appeal resolution before the next
  relevant fixture. Defines canonical `PlayerSuspendedV1` as a Squad & Player
  event consumed by Narrative/Notification; thresholds and ban lengths remain
  FMX-52/Regulations-profile calibration.
- [[2026-06-05-fmx-87-dialogue-intent-taxonomy]] - FMX-87 dialogue intent
  taxonomy + mechanical effect matrix: raw/synthesis research, draft GD-0027,
  ADR-0030/ADR-0054 contract updates and feature/map/index alignment for
  finite player/staff/board/press/fan/agent dialogue intents. Captures Nico's
  D1-D3 choices: broad MVP surfaces, banded effects, persona gate plus bounded
  scaling. Numeric tuning remains FMX-52; implementation waits on ratification.
- [[2026-06-03-fmx-99-onboarding-guided-first-season]] - FMX-99 onboarding
  60-second flow + guided first season: GD-0012 R2-05 resolved after Nico chose
  current FTUE path, Season-1 objective roadmap and wage-runway first economy
  lesson. Durable outputs are
  [[../../60-Research/onboarding-guided-first-season-2026-06-03]],
  [[../../50-Game-Design/GD-0012-onboarding]] and
  [[../../50-Game-Design/onboarding-and-tutorial]]. Records deterministic
  feed-card scoring, per-save behaviour adjustment, assistant auto-handling
  boundary and WCAG 2.2 AA route requirements; live stopwatch evidence remains a
  future prototype gate.
- [[2026-06-03-fmx-98-mobile-route-map-ia-client-state]] - FMX-98 mobile route map +
  IA + client-state: ADR-0008 ratified (`draft → accepted`, Nico D1–D3 = A,A,A
  2026-06-03). **D1** bottom-nav hybrid (4–5 tabs + Club/More bottom-sheet + Home
  task-hub) + MVP route map + WCAG 2.2 AA shell; **D2** layered client state + a narrow
  Zustand v5 client-only slice (resolves the GD-0016↔ADR-0021 Zustand contradiction) +
  resilient/optimistic UI contract; **D3** hybrid worker bridge (Comlink control-plane +
  `postMessage` event stream) on a dedicated deterministic engine worker. Resolves
  GD-0016 R2-07/R2-17; R2-16 → FMX-100. Reconciled GD-0016 + ADR-0021; unblocks FMX-99 +
  FMX-100.
- [[2026-06-03-fmx-91-ai-world-drift-algorithm]] - FMX-91 AI world-drift
  algorithm: proposed long-save drift model for rising rivals, fallen giants and
  continental era shifts. Captures Nico's selected options: future AI World
  Simulation BC ownership, hybrid RNG lanes, reputation-first rising nations and
  two-level caps. Durable outputs are [[../../60-Research/ai-world-drift-algorithm-2026-06-03]],
  [[../../50-Game-Design/GD-0024-ai-world-drift-algorithm]] and
  [[../../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]].
- [[2026-06-03-fmx-78-fixture-commercial-revenue-profiles]] - FMX-78 League
  Orchestration -> CommercialPortfolio publication contract for
  `CompetitionRevenueProfilePublished` and `FixtureCommercialProfilesPublished`.
  ADR-0070 is accepted after Nico ratified A/A/A on 2026-06-03:
  event-plus-query, League-owned stable fixture/competition commercial rule facts
  only, and CommercialPortfolio-owned settlement/accrual interpretation. Map
  output names now list the accepted profile events + snapshot queries.
- [[2026-06-02-fmx-31-narrative-media-press-ownership]] - FMX-31 Narrative
  Media / Press content ownership: proposed ADR-0065 extends ADR-0054 Narrative
  with Press/Media authoring (`PressStorylet`, `ConferenceResponseTree`,
  `PressArticle`, `ToneProfileLibrary`, `PressPublicationPolicy`), deterministic
  ICU fallback coverage, validation, provenance and optional schema-validated LLM
  paraphrase controls. Notification remains delivery; People supplies persona
  cards; owning domains keep authoritative state. Awaiting Nico ratification.
- [[2026-06-02-fmx-55-agent-claim-status-rule]] - FMX-55 operational workflow
  update: claimable Linear issues are `Backlog` or `Todo`; an agent's first
  visible action is now to verify no active branch/PR/worktree owns the issue and
  move it to `In Progress` before branch/worktree or file edits. PR-open
  automation remains fallback/reinforcement; agents still never move issues to
  `Done` or `Canceled`.
- [[2026-06-01-fmx-54-fan-privacy-naming]] - FMX-54 fan persona privacy and
  creative IP-safe naming review: fan groups and fan reps stay fictional
  aggregate/narrative actors; no real fans, handles, membership lists,
  private-person data or special-category fan labels; ADR-0007/GD-0015 naming
  policy extends to fan groups, reps, slogans/chants, media, sponsors, venues
  and community overlay names; MVP Community Overlay remains local/P2P, with
  hosted distribution blocked behind future DSA/UGC/privacy/AI-transparency
  gates.
- [[2026-06-01-fmx-51-ai-club-economy-behaviour]] - FMX-51 AI club economy
  behaviour: composes the locked manager AI ([[../../60-Research/ai-manager-behaviour]])
  + transfer tiering with a thin financial-policy layer (five archetypes), a
  three-regime FSM (Healthy/Stressed/Distressed), soft diegetic homeostasis (no AI
  stat cheats), staged distress with rare bounded insolvency + per-country distress
  personalities, tiered fidelity (Tier 0 active commercial choices, Tier 1+ banded)
  and structured rationale tags. New draft GD-0023; wired GD-0022/GD-0010 hooks. AI
  owner support is in-fiction, never the singleplayer Investor. Bands/dampers are
  FMX-52 calibration inputs.
- [[2026-06-01-fmx-49-club-financing-tools]] - FMX-49 club financing tools
  separate from Investor: Club Management-owned `FinancingFacility`,
  `CashflowRunwayForecast`, `OverduePayablesAging`, `DebtServiceSchedule`,
  `CovenantStatusBoard`, `FinancingOptionBoard` and emergency-sale mandate;
  first-playable overdraft/credit line, bank loan, sponsor advance, receivable
  factoring, restructuring/payment holiday, owner support and emergency-sale
  mandate; CommercialPortfolio emits commercial receivable, advance eligibility,
  contract-liability and fair-value facts; Investor remains clean SP entitlement
  cash only. Awaiting Nico decisions on thresholds, media-advance activation,
  board guarantees, emergency-sale hardness and supplier-arrears depth.
- [[2026-06-01-fmx-50-investor-compliance-entitlement-boundary]] - FMX-50 Investor
  compliance & entitlement boundary (`risk:legal`): `PaymentProviderPort`
  (Apple/Google consumable IAP + web PSP/MoR), server-authoritative idempotent
  entitlement state machine bound to the account, refund/revocation via Apple
  ASSN / Google void, plain "In-Game Purchases" age rating, EU/DE/UK/US
  consumer-law disclosure, abuse prevention, audit and SP-allowed/MP-denied allow
  matrix. New proposed ADR-0063; refined GD-0022, commercial-contracts, ADR-0058,
  ADR-0050. Gameplay rule unchanged. Payment vendor, refund policy, age-gate and
  activation timing are HITL/legal gates.
- [[2026-06-01-fmx-48-fan-service-campaigns]] - FMX-48 fan-service campaign
  catalog and effects: CommercialPortfolio-owned `FanEventCampaign` lifecycle;
  ten IP-clean campaign kinds for away travel, family/community/fan events,
  choreo/supporter dialogue, beverage rewards and digital fan challenges;
  segment-specific fan effects; sponsor contribution, KPI, make-good and
  cooldown fields; travel/alcohol/safety/children/digital risk gates; ADR-0050
  event additions and ADR-0058 boundary amendment. Stays inside the accepted
  CommercialPortfolio / Audience & Atmosphere / Stadium Operations /
  Regulations / Club Management split. Awaiting Nico decisions on first-playable
  catalog size, Quick-mode campaign board depth, alcohol abstraction, cooldown
  hardness, SLO staff depth, travel disruption depth and sponsor make-good
  visibility.
- [[2026-05-29-fmx-53-country-economy-profiles]] - FMX-53 Top-5 country economy
  calibration profiles: Germany/England/Spain/Italy/France plus abstract
  fallback; IP-clean `CountryEconomyProfile` (revenue mix, media weights &
  cadence, attendance/utilisation, season-ticket culture, stadium ownership,
  commercial multiplier, financial-control regime, parachute and tax/levy);
  gameplay-affecting differences; banded calibration ranges (not final);
  first-baseline recommendation and open Nico decisions.
- [[2026-05-29-fmx-46-matchday-operating-costs]] - FMX-46 matchday
  operating-cost and risk-cost settlement dossier: UEFA/national safety,
  stewarding, policing, supporter-travel, alcohol, disciplinary and stadium
  operations patterns; CommercialPortfolio-owned `MatchdayOperatingCostProfile`;
  risk tiers from routine to closed-door; settlement families for stewarding,
  security, policing contribution, medical, cleaning/waste, energy, temporary
  staff, officials, pitch recovery, insurance/compliance allocation, damage
  reserve, sanctions, sector closures, away-fan restrictions, alcohol
  restrictions and ghost matches. Refined GD-0022, Economy System,
  Regulations, Matchday Event Engine, Rivalry, Stadium/Campus, Audience &
  Atmosphere, Club Economy MVP pillar, ADR-0050, ADR-0058 and
  commercial-contract surfaces. Awaiting Nico decisions on final cost ranges,
  auto-mitigation defaults, policing-control depth and severe incident
  frequency.
- [[2026-06-01-fmx-47-catering-merchandise-operations]] - FMX-47 catering and
  merchandise operations depth: per-family `operatingModel` risk dial; catering
  revenue capped by service capacity and stockouts; explicit COGS, labour, waste,
  inventory, markdown, write-down and returns ledger lines; merchandise demand
  spikes; service-quality → Audience & Atmosphere coupling; alcohol-policy
  revenue↔safety dial; supplier pouring-rights/exclusivity carve-outs; IFRS 15
  cash-vs-recognition. Refined draft GD-0022, Economy System, Stadium & Campus,
  commercial-contract surface, ADR-0050 events and ADR-0058 boundary amendment.
  Stays inside CommercialPortfolio; awaiting Nico decisions on operational depth
  ceiling, per-country defaults, alcohol depth, penalty hardness and Quick-mode
  abstraction.
- [[2026-05-28-fmx-45-cup-competition-revenue]] - FMX-45 cup and
  competition revenue dossier: Germany/England/Spain/Italy/France plus
  continental source patterns; IP-clean `CompetitionRevenueProfile` preset
  families; prize, gate-share, ticket allocation, media/facility, travel,
  security, neutral venue, sponsor/merch and fixture-congestion fields;
  hard cash vs receivable vs future EV separation; elimination-shock read model
  instead of hidden cash loss. Refined draft GD-0022, Economy System,
  Regulations, Club Economy MVP pillar, ADR-0050, ADR-0058 and
  commercial-contract surfaces. Awaiting Nico decisions on final calibration,
  Quick budget reliance on cup EV, replay activation and season-ticket cup
  material-right liabilities.
- [[2026-05-28-fmx-44-commercial-contract-lifecycle]] - FMX-44 commercial
  contract lifecycle and breach dossier: shared `CommercialContract` shell for
  sponsorship, catering, merchandise, hospitality, supplier and
  venue-activation deals; family-specific schedules; structured
  category/territory/asset exclusivity; curable/material/critical breach
  severity; renewal windows; cash-vs-recognition timing; Quick / Standard /
  Expert contract surfaces and AI-club hooks reserved for FMX-51. Refined draft
  GD-0022, Economy System, Sponsorship Portfolio, Stadium/Campus, Club Economy
  MVP pillar, ADR-0058 and commercial-contract surfaces. Awaiting Nico
  decisions on ADR-0058 acceptance, default presets, Quick conflict strictness,
  controversial categories, Standard-vs-Expert true-ups and auto-renew
  confirmation.
- [[2026-05-28-fmx-43-season-ticket-lifecycle-accounting]] - FMX-43
  season-ticket lifecycle and accounting dossier: renewal, relocation,
  member-presale, waitlist, public-sale and in-season adjustment states;
  group-level no-show / seat-release / transfer / compensation policies;
  seat-class quotas including standing, seating, family, premium/suites and
  accessibility; full accrual accounting through cash, receivables, deferred
  revenue, match recognition and credit/refund liability pools. Refined draft
  GD-0022, Economy System, Fan Ecology, Stadium/Campus, Club Economy MVP
  pillar and commercial-contract surfaces; awaiting Nico decisions on
  share/discount ranges, Quick waitlist visibility, instalment risk, cup
  material-right depth and utilisation strictness.
- [[2026-05-28-fmx-29-youth-academy]] - FMX-29 ownership dossier for
  the annual youth academy lifecycle (intake calendar + cohort
  generation + intake event + promotion gate + per-season investment
  slider + productivity score + home-grown share counter) including
  four coordinated FSMs (`AcademySeason` + `YouthCohort` +
  `CohortMember` + `AcademyInvestmentLevel`). Three Perplexity queries
  (genre FM annual March intake + HoYD + Junior Coaching + Youth
  Recruitment + Development Centre + EA FC rolling youth scouting +
  OOTP amateur draft + Minor League System + FIFA Manager Youth
  Center + Anstoss Nachwuchsabteilung / DDD Vernon long-running-
  process + Process Manager / Saga + Snapshot pattern with university-
  admissions cohort + clinical-trial subject cohort + apprenticeship
  textbook own-BC analogues / real-world Premier League EPPP
  Categories 1-4 + DFB-NLZ + UEFA Home-Grown Player rule 8/25 + 4
  club-trained 15-21 + Academy Director reporting to Sporting Director
  + La Masia + De Toekomst + City Football Academy + Hohenbuschei +
  Liefering exemplars + Brexit GBE + FIFA Article 19 + NCAA NIL),
  synthesis recommending Option C (own Youth Academy bounded context).
  Six-of-six DDD split criteria fire (equal to FMX-33 wave high).
  **Strongest single argument**: real-world EPPP + DFB-NLZ + UEFA HGP
  structurally separate audited organisational unit + Academy Director
  reporting to Sporting Director, **and** every major football
  management sim treats academy as structurally separate persistent
  area. Draft ADR-0060 with four options + §Recommendation + §Map
  patch proposal (order-tolerant - applies as 17th or 18th depending
  on ADR-0059 ratification order). New state-machine note
  `state-machines/youth-academy.md` with four coordinated FSMs.
  `risk:legal` label set. Awaiting Nico decision.
- [[2026-05-28-fmx-42-fan-demand-price-elasticity]] - FMX-42 demand and pricing
  dossier: segment-specific latent fan demand before capacity allocation,
  season-ticket renewal versus single-ticket curves, top-match surcharge and
  bounded dynamic-pricing risks, capacity pressure, country-profile demand
  tendencies, and persistent ticketing trust feeding renewal, boycott,
  atmosphere and sponsor-fit risk. Refined draft Fan Ecology, GD-0022,
  Economy System and commercial-contract surfaces; awaiting Nico decisions on
  dynamic-pricing scope, country guardrail hardness and Quick-mode trust
  visibility.
- [[2026-05-28-fmx-33-community-overlay-pipeline]] - FMX-33 ownership
  dossier for the community pack registry + import-session FSM +
  manifest validation + IP-safety gate + multi-BC semantic-validation
  delegation orchestration + save-creation-only activation + per-save
  snapshot immutability. Three Perplexity queries (genre FM `.fmf`
  save-creation-only activation + multiple-pack selection / DDD Vernon
  ingestion-as-bounded-context with Stripe Connect + Avalara +
  Salesforce + GitHub Actions + OpenStreetMap analogues / real-world
  Bethesda Creation Kit + Bethesda.net + Steam Workshop + CurseForge
  + Modrinth + EU DSA 2023-2026), synthesis recommending Option D
  (own Community Overlay Pipeline bounded context). Six-of-six DDD
  split criteria fire (strongest in the wave). **Strongest single
  argument**: ratified ADR-0056 + ADR-0057 explicitly reference
  "FMX-33 Community Overlay Pipeline" as upstream orchestrator. Draft
  ADR-0059 with four options + Option E anti-pattern + §Recommendation
  + §Map patch proposal (order-tolerant). `risk:legal` label set.
  Awaiting Nico decision.
- [[2026-05-28-fmx-41-economy-impact-map]] - FMX-41 economy impact map
  and commercial-contract dossier: direct financial-success domains, Top-5
  research anchors, season-ticket and ticket-pricing trade-offs, fan segment
  demand, catering/merchandise/sponsorship contract families, cup revenue,
  fan-service campaigns and Investor clean singleplayer cash. Added draft
  GD-0022, draft ADR-0058 and draft commercial contract note; awaiting Nico
  decisions on ADR-0058 boundary and Investor activation timing.
- [[2026-05-28-fmx-34-rivalry-system]] - FMX-34 ownership dossier
  for the rivalry-edge graph + 5-sub-score formula (regional +
  historical + sporting + fan-incident + transfer-tension) +
  threshold-tier FSM + per-season decay. Three Perplexity queries
  (genre source-thin; DDD Vernon scoring-context pattern with
  credit-rating / customer-affinity / recommendation analogues;
  real-world UEFA risk-match + Premier League Category A/B/C +
  Bundesliga DFL Rotspiel), synthesis recommending Option C (own
  Rivalry System bounded context), draft ADR-0057 with three options
  + Option D anti-pattern + §Recommendation + §Map patch proposal
  (order-tolerant). Smallest carve in the wave (lighter scope than
  Tactics / Regulations) - cross-cutting consumer count + Vernon
  pattern tip it toward separate context. Awaiting Nico decision.
- [[2026-05-28-fmx-30-regulations-compliance]] - FMX-30 ownership
  dossier for the regulatory rule catalog (FFP/SCR/PSR, work permits
  / GBE, home-grown quotas, transfer windows, license-tier facility
  requirements, sanction catalog). Three Perplexity queries (genre
  FM Advanced Rules editor + Test Rules validator / DDD Vernon
  Tax-catalog pattern Stripe Tax + Avalara / real-world 2024-2026
  multi-regulator landscape UEFA SCR + Premier League PSR + La Liga
  cost control + Bundesliga licensing + GBE), synthesis recommending
  Option B (own Regulations & Compliance bounded context), draft
  ADR-0056 with four options + §Recommendation + §Map patch proposal
  (order-tolerant). `risk:legal` label set - IP-clean surface
  contained in one context per GD-0015 + ADR-0007. Awaiting Nico
  decision.
- [[2026-05-28-fmx-28-tactics-persistence]] - FMX-28 ownership dossier
  for the persistent tactics library (presets, set-piece routines,
  opposition templates, role/duty configurations) distinct from
  Match's per-match `tactic lock`. Three Perplexity queries (genre /
  DDD library-vs-instance / real-world 2023-2026 club tactical
  archives), synthesis recommending Option C (own Tactics bounded
  context), draft ADR-0055 with four options + §Recommendation + §Map
  patch proposal (order-tolerant). Awaiting Nico decision.
- [[2026-05-28-fmx-38-player-staff-development-decision-model]] - anchored
  FMX-38 player/staff development and decision-influence analysis into research
  synthesis, draft GD-0021, feature/game-design/ADR links and an explicit
  staff-skill MVP option gate. Awaiting Nico decision on GD-0021 approval and
  staff-skill option A/B/C.
- [[2026-05-28-fmx-26-staff-backroom]] - FMX-26 ownership dossier for
  Staff & Backroom residual scope after ADR-0052. Three Perplexity
  queries (genre / DDD / real-world 2024-2026 Sporting Director model),
  synthesis recommending Option B (own Staff Operations bounded context
  as 13th), draft ADR-0053 with three options + §Recommendation + §Map
  patch proposal. Awaiting Nico decision.
- [[2026-05-28-fmx-25-manager-legacy-ratification]] - FMX-25 ratification
  pass for ADR-0051 Manager & Legacy Context. Three Perplexity queries
  (roguelite genre, DDD, football-sim precedent), synthesis recommending
  Accept (Option A), ADR-0051 expanded with three concrete options + map
  patch proposal. Awaiting Nico decision.
- [[2026-05-28-ai-narration-framework-testing]] - anchored follow-up AI
  narration testing/framework research into raw notes, synthesis, ADR-0054,
  contract-testing framework and map/current-state updates.
- [[2026-05-28-fmx-23-eos-people-skills-personas]] - anchored the EOS
  Player/Staff Values report and follow-up research into research synthesis,
  draft GD-0020, feature spec, draft ADR-0052 and map/current-state links.
- [[2026-05-27-fmx-16-manager-archetype-roguelite]] - anchored the
  Manager-Archetype Roguelite raw report into research synthesis, draft GDDR,
  draft ADR-0051, MVP hook updates and index/current-state links.
- [[2026-05-27-fmx-13-club-economy-blueprint]] - anchored the club-economy
  raw report into research synthesis, draft GDDR/system notes, feature spec,
  ADR-0050 and implementation-contract notes.
- [[2026-05-27-ai-narrative-runtime-integration]] - promoted the two
  narrative/LLM raw reports into AI narrative runtime research, draft GD-0018
  and draft ADR-0030.
- [[2026-05-22-vault-consistency-pass]] - vault-wide consistency + link-health
  pass: Postgres/Drizzle realignment, supersede/front-door/authority hygiene,
  structure renames, mojibake/BOM repair, broken-link fixes; docs-check green.
- [[2026-05-22-documentation-v1-cleanup]] - consolidated the documentation V1
  baseline.
- [[2026-05-22-notification-messaging-platform]] - locked the notification &
  messaging platform (ADR-0043).
- [[2026-05-22-presentation-renderer-strategy]] - locked the two-renderer
  presentation strategy (ADR-0041).
- [[2026-05-18-mvp-scope-realignment]] - MVP realigned to hybrid-online
  Create-a-Club Roguelite first playable with future selective offline/export
  seams preserved.
- [[2026-05-17-impact-lens-docs]] - player-strength research promoted into
  Impact Lens gameplay, architecture, feature and index docs.
- [[2026-05-17-match-engine-runtime-docs]] - match-engine runtime research
  promoted into architecture, gameplay, implementation and index docs.
- [[2026-05-17-transfer-market-docs]] - transfer-market research promoted into
  the transfer-market architecture, gameplay and implementation docs.
