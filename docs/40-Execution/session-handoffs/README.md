---
title: Session Handoffs
status: current
tags: [meta, execution, hot]
created: 2026-05-17
updated: 2026-06-14
type: index
binding: true
related: [[../../90-Meta/agent-memory-protocol]]
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
