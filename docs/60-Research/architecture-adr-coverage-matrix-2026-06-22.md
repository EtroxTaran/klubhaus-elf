---
title: Architecture ADR Coverage Matrix
status: draft
tags: [research, fmx-211, architecture, adr, decision-coverage, compatibility, guardrails]
created: 2026-06-22
updated: 2026-06-22
type: research
binding: false
linear: FMX-211
sourceType: synthesis
related:
  - [[architecture-decision-portfolio-review-2026-06-22]]
  - [[raw-perplexity/raw-fmx-211-architecture-source-checks-2026-06-22]]
  - [[../40-Execution/fmx-211-architecture-review-decision-queue-2026-06-22]]
  - [[../00-Index/Decision-Log]]
  - [[../00-Index/Architecture-Map]]
---

# Architecture ADR Coverage Matrix

## Scope

This appendix gives FMX-211 explicit ADR-by-ADR coverage for the current
technical decision set. It covers every ADR file whose frontmatter status is
`accepted` on 2026-06-22.

Superseded ADRs are not current implementation authority. Their replacement
chain remains part of the review evidence, but code-phase work must implement
the accepted successor record instead.

## Coverage Result

| Metric | Result |
|---|---:|
| Current accepted ADRs checked | 112 |
| Superseded ADRs excluded from current authority | 11 |
| Broad replacement recommendation | 0 |
| Targeted hardening recommendations | Status-body hygiene, stack-currency follow-through, module-card readiness, ADR-0121 first-gate automation |

## Accepted ADR Matrix

| ADR | Decision checked | Best-current decision / alternative | Compatibility and guardrail |
|---|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0005-save-format]] | Save/export envelope and versioning | Keep encrypted/versioned envelope; alternative ad hoc JSON saves would weaken migration, provenance and trust. | Compatible with save-trust, import/export and SP/MP separation; enforce provenance and version gates. |
| [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] | IP-clean naming and generated data | Keep fictional/generated naming; alternative real club/player identity creates legal and licensing risk. | Compatible with community packs only behind override/moderation gates. |
| [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] | Mobile-first IA and client state | Keep mobile-first route/shell discipline; desktop-first alternative risks late responsive rewrites. | Compatible with PWA/mobile delivery; client state must not become authority. |
| [[../10-Architecture/09-Decisions/ADR-0010-design-system]] | Klubhaus design system | Keep single design-system source; one-off styling would fragment UI handoff. | Compatible with future Storybook/showcase flow; feature PRs must update docs and stories when code returns. |
| [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] | Server-authoritative MP | Keep server authority; peer/local authority alternative conflicts with replay, fairness and anti-cheat. | Compatible with offline drafts because authoritative progression stays server-confirmed. |
| [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]] | Async cadence models | Keep fixed/dynamic cadence options; single rigid cadence would limit league formats. | Compatible with League, Watch Party and notification deadlines; deadlines need explicit FSM ownership. |
| [[../10-Architecture/09-Decisions/ADR-0014-state-machines]] | Explicit workflow FSMs | Keep explicit FSMs; implicit status flags would hide legal transitions. | Compatible with DDD process managers; every time-critical flow needs owner and transition tests. |
| [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]] | Versioned community override packs | Keep future gated override packs; direct user edits into canonical data would break provenance. | Compatible only behind moderation/security/replay gates; not MVP authority. |
| [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]] | Self-hosted observability | Keep self-hosted logs/metrics/traces; vendor-first alternative can work but adds privacy/cost coupling early. | Compatible with audit/security; no secrets or personal data in logs. |
| [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] | Systemic event/lifecycle model | Keep event-driven lifecycle coordination; direct cross-context mutation would couple domains. | Compatible with outbox and opaque refs; consumers react through ACL/projections. |
| [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] | Service-ready DDD modular monolith | Keep modular monolith first; microservices-first adds distributed cost before seams are proven. | Core compatibility anchor; enforce no cross-context imports, joins or shared tables. |
| [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] | Hybrid-online, offline-ready MVP | Keep honest offline-ready scope; full offline authority in MVP is too risky. | Compatible with PWA and server authority; label drafts/cached/stale states clearly. |
| [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]] | Revised target stack | Keep stack direction with FMX-198 currency follow-through; broad stack reset lacks evidence. | Compatible if versions are re-source-checked before bootstrap; TanStack Start RC remains visible risk. |
| [[../10-Architecture/09-Decisions/ADR-0022-animation-game-feel]] | Animation/game-feel stack | Keep presentation-only animation stack; simulation-driven animation authority would blur domains. | Compatible with deterministic simulation because visuals consume snapshots only. |
| [[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]] | Realtime transport abstraction | Keep SSE-first with interface; WebSocket/Centrifugo-first adds ops too early. | Compatible with durable inbox/event log; realtime remains accelerant, not source of truth. |
| [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]] | Match renderer abstraction | Keep renderer behind contract; UI-bound simulation alternative blocks replacement. | Compatible with Canvas MVP and future 3D; renderer never owns match facts. |
| [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]] | Match frame contract | Keep versioned frame contract; ad hoc frame payloads would break replay/renderers. | Compatible with replay/watch/narrative; frame contract must stay deterministic. |
| [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] | PostgreSQL/Drizzle per-save schema | Keep PostgreSQL + Drizzle source of truth; SurrealDB/document-first alternatives weaken relational integrity. | Compatible with DDD if schema-per-save ceilings and no cross-context FK rules hold. |
| [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]] | Same-transaction outbox | Keep outbox; broker-first dual writes risk event loss or divergence. | Compatible with context events and future extraction; consumers must be idempotent. |
| [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]] | 3D presentation layer | Keep 3D as non-authoritative presentation; 3D-first match authority is unnecessary MVP risk. | Compatible with renderer abstraction; 3D consumes committed facts only. |
| [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] | LLM outside state authority | Keep LLM advisory/display-only; state-changing LLM output breaks determinism and security. | Compatible with narrative gameplay; owner contexts clamp/reject any effect intent. |
| [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]] | Two-renderer presentation strategy | Keep Canvas MVP plus future presentation path; one renderer for all surfaces risks either low fidelity or high cost. | Compatible with ADR-0024/0029; no presentation layer writes domain state. |
| [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]] | CI/CD and merge policy | Keep issue-linked green-check PR policy; manual/ad hoc merges reduce traceability. | Compatible with docs phase and future code phase; required checks must match active repo reality. |
| [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]] | Issue-first worktree workflow | Keep one issue/branch/worktree; shared branches cause multi-agent collisions. | Compatible with Linear/GitHub traceability; agents use scoped prefixes. |
| [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]] | Team topology | Keep bounded-context team topology; layer teams alone would cut across domain seams. | Compatible with DDD; module cards must define team handoff contracts. |
| [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]] | Babylon.js 3D engine | Keep Babylon as future presentation choice; custom 3D engine or Three-first rewrite adds little domain value. | Compatible because 3D is presentation-only and post-MVP. |
| [[../10-Architecture/09-Decisions/ADR-0048-design-update-and-migration-path]] | Design-system migration path | Keep managed design migration; feature-by-feature visual drift is the alternative risk. | Compatible with docs/design workflow; update showcase/docs with primitives. |
| [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] | Club economy ledger | Keep Club Management as ledger owner; distributed finance writes create accounting ambiguity. | Compatible with Commercial/Transfer producers through intents/events only. |
| [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] | Manager & Legacy context | Keep separate legacy/run-analysis context; mixing into League or Club would blur career meta-progression. | Compatible with roguelite gameplay; consumes snapshots, does not command source contexts. |
| [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] | People/persona/skills context | Keep People as persona/skill substrate; duplicating actor truth per context fragments identity. | Compatible through queries/cards; gameplay owners keep their own durable facts. |
| [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] | Staff operations context | Keep Staff Operations separate; embedding staff into Squad or Club hides different lifecycle rules. | Compatible through wage/role events and People references. |
| [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] | Narrative framework | Keep Narrative content owner; letting source domains author prose duplicates templates and LLM risk. | Compatible because source domains own facts/effects; Narrative owns display. |
| [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] | Tactics context | Keep Tactics as tactic/snapshot owner; Match owning tactic library would conflate setup with simulation. | Compatible with Training/Squad signals and Match lock-time snapshots. |
| [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]] | Regulations context | Keep Regulations as eligibility/rule verdict owner; duplicating rules in League/Transfer creates drift. | Compatible through verdict queries/events; domains consume, not reimplement, rules. |
| [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]] | Rivalry context | Keep Rivalry fact owner; commercial/fan domains deriving rivalry directly would couple data. | Compatible through projections/events into Audience/Commercial. |
| [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] | Commercial impact boundary | Keep CommercialPortfolio as producer and Club ledger as writer; direct revenue writes are unsafe. | Compatible with economy gameplay via ledger ACLs and events. |
| [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]] | Community overlay pipeline | Keep overlay pipeline future gated; direct mod data injection breaks provenance/trust. | Compatible with naming/data overrides only behind validation and audit. |
| [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]] | Youth Academy context | Keep Youth Academy separate; treating youth as normal squad players too early erases scouting/development lifecycle. | Compatible through player promotion contracts and People/Squad references. |
| [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]] | Club sub-aggregate ownership | Keep audited sub-aggregate split; monolithic Club aggregate risks hidden coupling. | Compatible with ledger/board/stadium/commercial seams. |
| [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]] | Audience & Atmosphere context | Keep fan-demand/atmosphere owner; embedding fan state into Stadium/Commercial duplicates signals. | Compatible through demand events and commercial/stadium ACLs. |
| [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]] | Investor/payment boundary | Keep entitlement/payment boundary; mixing payments with game economy risks P2W and compliance issues. | Compatible with no-P2W and payment gates; paid effects stay zero-power. |
| [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]] | Scouting Activity context | Keep scouting activity owner; direct hidden-attribute reads would break discovery gameplay. | Compatible with People/Squad truth through controlled reveal projections. |
| [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]] | Media/press content ownership | Keep Narrative/Media ownership split; source domains writing press content would duplicate editorial logic. | Compatible with People/Notification; content is display/advisory only. |
| [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]] | Competition/season registry | Keep League-owned registry; scattered competition definitions create scheduling/revenue drift. | Compatible with Regulations/Commercial through published profiles. |
| [[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]] | Set-piece determinism | Keep deterministic variant selection; random client-side choice breaks replay. | Compatible with Tactics/Training/Match snapshot locks. |
| [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]] | Fixture scheduling contract | Keep League-owned deterministic scheduling; ad hoc generators per mode would fragment calendars. | Compatible with Regulations eligibility and async deadlines. |
| [[../10-Architecture/09-Decisions/ADR-0069-league-regulations-eligibility-handoff]] | League-Regulations handoff | Keep explicit verdict handoff; League duplicating rules would drift. | Compatible with context map; Regulations owns rule facts, League owns fixture lifecycle. |
| [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]] | Commercial revenue profile publication | Keep profile publication contract; direct commercial reads from League internals couple contexts. | Compatible with Club ledger and CommercialPortfolio via published language. |
| [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]] | AI World drift context | Keep AI World as drift-policy publisher; consumer-owned global AI policies would diverge. | Compatible because consumers apply local effects and GD-0043 owns calibration. |
| [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] | In-match control seam | Keep intervention seam; free-form live commands would break deterministic simulation. | Compatible with Match authority and Tactics snapshots. |
| [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]] | Player contract lifecycle FSM | Keep Squad & Player contract truth plus Transfer process cases; one context owning all cases would overload the model. | Compatible with Regulations verdicts and Transfer orchestration. |
| [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]] | Tactical identity aggregation | Keep explicit aggregation algorithm; opaque ML/style labels would reduce explainability. | Compatible with Analytics/Narrative as consumers. |
| [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]] | Loan orchestration | Keep Transfer process manager; encoding loans as simple transfers hides recall/obligation states. | Compatible with Squad/Regulations/Club ledger through intents/events. |
| [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]] | Newsworthiness contracts | Keep source-owned newsworthy events; Narrative polling internals couples contexts. | Compatible with Narrative content selection and display snapshots. |
| [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]] | Environment/weather/pitch context | Keep environment owner; Match embedding weather truth would limit broader effects. | Compatible through matchday condition snapshots. |
| [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]] | Discipline/suspension contracts | Keep Squad & Player discipline aggregate; Match owning suspensions would conflate event facts and eligibility. | Compatible with Regulations and Match card facts. |
| [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]] | Dynasty board/ownership/bankruptcy FSMs | Keep explicit Club/board FSMs; hidden financial thresholds would be hard to test. | Compatible with ledger insolvency postings and Manager legacy. |
| [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]] | Opposition template AI consumption | Keep Tactics-published selected-template contract; Match deciding AI tactics late would blur planning authority. | Compatible with AI World inputs and Match snapshot freeze. |
| [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]] | Statistics/analytics owner | Keep projection-only analytics owner; making Analytics official standings authority would conflict with League. | Compatible with rebuildable read models and versioned metrics. |
| [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] | Manager style/run analysis | Keep Manager & Legacy as analysis owner; source domains deriving legacy independently would fragment progression. | Compatible through immutable end-of-run snapshots. |
| [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]] | Awards/records/HoF contract | Keep explicit ownership and snapshots; burying awards in League only limits career legacy. | Compatible with Manager & Legacy and Analytics projections. |
| [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]] | National-team dual-role/window | Keep scoped international-window contract; full national-team mode now would expand MVP scope. | Compatible with League calendar and player availability seams. |
| [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] | Media ecology context | Keep media outlet behavior owner; Narrative alone cannot model outlet incentives. | Compatible with Narrative/Notification as content/delivery consumers. |
| [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]] | Background-fast cost settlement | Keep explicit settlement pipeline; synchronous all-at-once matchday settlement could hurt UX and observability. | Compatible with outbox and Club ledger idempotency. |
| [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]] | Live intervention buffer/pause vote | Keep buffered deterministic intervention model; instant unbounded controls break replay and async fairness. | Compatible with Watch Party and Match event log. |
| [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]] | Async escalation/deadline source | Keep explicit deadline source; Notification-only deadlines would make delivery authority leak. | Compatible with League/Watch Party processes and inbox accelerants. |
| [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]] | Managed bounded-context portfolio | Keep managed 28-context ceiling; freeze/collapse both carry risk. | Compatible if new contexts require merge-review and map updates. |
| [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]] | Offline sync scope/conflicts | Keep non-authoritative draft/rebase MVP; full offline conflict authority is too broad. | Compatible with server authority and command reception dedup. |
| [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]] | Audit & Security context | Keep security/audit owner; scattering replay/auth auditing through domains creates inconsistent trust. | Compatible with command reception, save trust and webhook security. |
| [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]] | Vault governance SSOT | Keep frontmatter/status as SSOT; relying on body prose caused drift. | Compatible with docs-phase workflow; FMX-211 recommends hygiene follow-up. |
| [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]] | Async foundation ratification | Keep ratified async foundation; piecemeal hidden acceptance would reduce traceability. | Compatible with cadence/FSM/watch-party work. |
| [[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]] | i18n stack and locale scope | Keep explicit i18n stack/scope; late i18n retrofit is expensive. | Compatible with design/content systems and future locale expansion. |
| [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]] | Balanced ledger posting invariant | Keep balanced double-entry invariant; single-entry game accounting would weaken auditability. | Compatible with Club ledger and Transfer financial intents. |
| [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] | Match-engine determinism/numeric surface | Keep current match-engine authority; superseded ADR-0049 remains history only. | Compatible with replay, QA and renderer abstraction; all runtimes obey numeric contract. |
| [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] | Postgres scale/audit envelope | Keep explicit scale envelope; unlimited schema/table growth would be operationally unsafe. | Compatible with schema-per-save if ceilings are enforced. |
| [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]] | Save KDF and active pack refs | Keep Argon2id/passphrase path and pack refs; weak KDF or implicit packs weaken save trust. | Compatible with import/export and community pack provenance. |
| [[../10-Architecture/09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]] | Spectator/watch stream over event log | Keep committed-event-log stream; frame-only snapshots without log weaken replay. | Compatible with Watch Party and Match authority. |
| [[../10-Architecture/09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]] | Story-thread naming/ownership | Keep published naming split; shared ambiguous `thread` concepts caused coupling risk. | Compatible with Narrative/Media/Notification. |
| [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] | Settlement/profile/insolvency reconciliation | Keep reconciled value/profile contract; parallel vocabularies create ledger bugs. | Compatible with Club ledger, quality profiles and insolvency FSM. |
| [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]] | Notification platform/offline delivery | Keep Notification as delivery/inbox owner; push/email as authority would be wrong. | Compatible with offline and realtime accelerant posture. |
| [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]] | Multi-agent conflict serialization | Keep serialized agent workflow; concurrent uncoordinated edits caused prior drift. | Compatible with Linear, worktrees and PR checks. |
| [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]] | Mobile delivery grounding | Keep PWA/Capacitor-gated path; native-first rewrite is premature. | Compatible with offline/PWA QA gates and current web stack. |
| [[../10-Architecture/09-Decisions/ADR-0105-wage-and-transfer-fee-posting-contracts]] | Wage/fee posting contracts | Keep explicit posting contracts; direct payroll/transfer ledger writes are unsafe. | Compatible with Club ledger sole-writer rule. |
| [[../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]] | Chart of accounts/category catalog | Keep versioned accounting taxonomy; free-form categories break reporting and migration. | Compatible with ledger postings and analytics. |
| [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]] | Pricing/IAP boundary | Keep monetization boundary; embedding commerce in gameplay contexts risks fairness and compliance. | Compatible with no-P2W and payment legal gates. |
| [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]] | No-P2W fairness invariant | Keep zero-power paid effects; paid boosts conflict with shared/public legitimacy. | Compatible with cosmetics and responsible gaming. |
| [[../10-Architecture/09-Decisions/ADR-0109-payment-provider-and-monetization-legal-gates]] | Payment provider/legal gates | Keep provider/legal gate separation; early payment integration without gates is high-risk. | Compatible with pricing/IAP boundary and privacy/security. |
| [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]] | Code-phase DoD transition | Keep explicit transition contract; treating docs-phase gates as code-complete would be false. | Compatible with future quality/e2e/security gates. |
| [[../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation]] | Rivalry commercial signal reconciliation | Keep local ACL/projection; orphan cross-context signal would duplicate truth. | Compatible with Rivalry and Audience/Commercial ownership. |
| [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]] | Age/rating evidence posture | Keep evidence-gated posture; shipping public features before ratings/legal evidence is risky. | Compatible with monetization and release gates. |
| [[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]] | Portfolio determinism principle | Keep seeded variance principle; uncontrolled randomness breaks replay/testing. | Compatible across Match, AI World, economy and narrative. |
| [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]] | Monorepo workspace bootstrap | Keep package-boundary bootstrap plan; ad hoc package creation risks imports across contexts. | Compatible with ADR-0121 first-gate automation. |
| [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]] | Command integrity/replay protection | Keep command integrity posture; accepting raw retries in domains is unsafe. | Compatible with Audit & Security command reception and offline retry. |
| [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]] | Save trust/provenance | Keep trust-level model; treating all imported saves equally conflicts with MP/public eligibility. | Compatible with save format and community packs. |
| [[../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor]] | Narrative display snapshot replay | Keep persisted display snapshots; regenerating prose on replay breaks determinism. | Compatible with LLM-out-of-authority and Narrative display ownership. |
| [[../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]] | Test strategy/quality gates | Keep risk-scaled quality stack; coverage-only alternative is insufficient. | Compatible with deterministic sim, contracts and docs/code phase gates. |
| [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]] | Command reception dedup seam | Keep central dedup seam; per-domain dedupe scatters security semantics. | Compatible with offline retry, replay protection and outbox idempotency. |
| [[../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]] | Simulation QA/save-forward matrix | Keep replay/save-forward matrix; manual spot checks cannot prove determinism. | Compatible with Match, saves and migration gates. |
| [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] | Architecture fitness/no shared tables | Keep first-gate scanners; review-only enforcement will not scale. | Compatible with modular DDD; FMX-211 recommends first foundation PR timing. |
| [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]] | Responsible gaming/dark-pattern invariant | Keep invariant; monetization-only policy doc without architecture gates is weak. | Compatible with no-P2W, cosmetics and release compliance. |
| [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]] | Identity & Access context | Keep identity context definition; mixing identity into game domains weakens security boundaries. | Compatible with Audit & Security and command reception. |
| [[../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]] | PWA/offline/mobile QA gates | Keep release QA gates; assuming browser APIs are uniformly available is unsafe. | Compatible with service worker/IndexedDB/offline posture. |
| [[../10-Architecture/09-Decisions/ADR-0125-stryker-mutation-testing-gate]] | Mutation testing gate | Keep mutation gate for critical logic; line coverage alone misses weak assertions. | Compatible with risk-scaled quality strategy and deterministic simulation. |
| [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]] | Cross-producer effect-intent taxonomy | Keep finite advisory effect taxonomy; free-form producer effects would bypass owner domains. | Compatible with Narrative/Media and owner-context clamp/reject tests. |
| [[../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]] | Erasure vs retention partition | Keep field-level partition; blanket erase/retain both create legal risk. | Compatible with payment/legal/audit requirements. |
| [[../10-Architecture/09-Decisions/ADR-0128-webhook-receiver-security-contract]] | Webhook receiver security | Keep explicit webhook contract; generic handlers risk replay/spoofing. | Compatible with payments, audit and command integrity. |
| [[../10-Architecture/09-Decisions/ADR-0129-match-context-definition]] | Match context definition | Keep Match scoped to simulation/event log; owning durable player/tactics truth would overload it. | Compatible with Squad, Tactics, Training and Watch Party. |
| [[../10-Architecture/09-Decisions/ADR-0130-training-context-definition]] | Training context definition | Keep Training readiness/development owner; folding into Squad hides plan/load lifecycle. | Compatible with Tactics and Squad through readiness signals. |
| [[../10-Architecture/09-Decisions/ADR-0131-squad-and-player-context-definition]] | Squad & Player context definition | Keep player durable truth owner; distributing player truth across Match/Training/Transfer causes drift. | Compatible with contract, injury, discipline and availability seams. |
| [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]] | Release versioning/app build | Keep explicit release/build process; ad hoc versioning weakens rollback and store evidence. | Compatible with docs/code phase release gates. |
| [[../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]] | Watch Party context definition | Keep party/social orchestration owner; Match owning social state would conflate simulation and collaboration. | Compatible with Match event log, Notification delivery and Offline Sync. |
| [[../10-Architecture/09-Decisions/ADR-0134-context-frontmatter-membership-ssot]] | Context frontmatter membership SSOT | Keep frontmatter membership SSOT; duplicated index lists drift. | Compatible with docs vault export/governance and NotebookLM surfaces. |

## Superseded ADRs

| ADR | Current handling |
|---|---|
| [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] | Historical only; replaced by the accepted stack decision chain, primarily ADR-0021 plus FMX-198 follow-ups. |
| [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] | Historical only; replaced by hybrid-online/offline-ready posture in ADR-0020/0090/0124. |
| [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] | Historical only; superseded by later match-engine decisions, with ADR-0096 current for determinism. |
| [[../10-Architecture/09-Decisions/ADR-0004-data-model]] | Historical only; replaced by PostgreSQL/Drizzle data model chain ADR-0027/0097. |
| [[../10-Architecture/09-Decisions/ADR-0006-i18n]] | Historical only; superseded by ADR-0094. |
| [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] | Historical only; replaced by issue-first/multi-agent workflow ADR-0045/0103. |
| [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]] | Historical only; superseded by PostgreSQL outbox ADR-0028. |
| [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]] | Historical only; superseded by committed-event-log watch-party streaming ADR-0099. |
| [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]] | Historical only; superseded by ADR-0104. |
| [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]] | Historical only; superseded by ADR-0102. |
| [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] | Historical only; superseded by ADR-0096 for current match-engine determinism/numeric authority. |

## Conclusion

The current accepted ADR portfolio is internally compatible enough to proceed
with targeted hardening rather than a broad replacement sweep. The main code
phase risk is not a wrong top-level architecture decision; it is enforcing the
decisions early enough through module cards, public contracts and ADR-0121
fitness checks.
