---
title: Ratification-status inventory & reconciliation record (FMX-143)
status: current
tags: [execution, governance, ratification, status-ssot, inventory, fmx-143]
created: 2026-06-11
updated: 2026-06-11
type: execution
binding: false
linear: FMX-143
related:
  - [[decision-queue-2026-06-08-ratified]]
  - [[decision-queue-2026-06-08]]
  - [[../60-Research/adr-re-audit-master-2026-06-08]]
  - [[../60-Research/ratification-status-ssot-reconciliation-2026-06-11]]
  - [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]]
  - [[../10-Architecture/09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]
  - [[../00-Index/Decision-Log]]
  - [[../00-Index/Current-State]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# Ratification-status inventory & reconciliation record (FMX-143)

Full inventory of every ADR/GDDR across the four status sources (frontmatter ·
body `## Status` · bounded-context-map claim · Open-Decisions-Dossier claim),
taken **after** the merged ratification PRs #153/#157–#161 and **before** the
FMX-143 reconciliation sweep; the Action column records what the sweep did.
Frontmatter is the status SSOT per
[[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]];
research grounding:
[[../60-Research/ratification-status-ssot-reconciliation-2026-06-11]].

## 1. Summary

- **133 records scanned** (93 ADRs + 40 GDDRs).
- Pre-sweep body⇄frontmatter state: **94 status-lag divergences (A)** ·
  **7 referee-checked cases (B)** · **10 without a body status section (C)** ·
  **22 already-consistent (=)** (prose-style consistent bodies were normalized
  to the bare status word + dated history so the standing checker can be strict).
- **Map claims:** 4 stale "not accepted yet / not added until Nico accepts"
  paragraphs (ADR-0052/0054/0071/0081) + the "17th/18th/19th depending on
  counting order" residue → rewritten as ratified statements / ADR-0089 catalog
  reference. §1 table (28 contexts) unchanged — it was already correct.
- **Dossier claims:** §A1–A5, §B M1–M3, §C, §D ×15 all listed open although
  ratified 2026-06-08 → closed with per-section ratification annotations; note
  marked a closed historical index.
- **Banners:** "PR pending Nico's merge" in Current-State / Decision-Log /
  GD README → flipped to merged (2026-06-08/09, #153/#157–#161); 2026-05-27
  reopen banners demoted to dated history (never deleted).
- **Supersession hygiene:** standard SUPERSEDED banners added under H1 of
  ADR-0006/0009/0015/0025/0043/0049 (ADR-0003 already carried its
  re-evaluation note); all seven carry inline `superseded_by:`.
- **System/mode notes (out-of-ledger, class D):** 27 notes in
  `docs/50-Game-Design/` stay `draft` (H2); `binding: true → false` while
  draft; "approved" prose demoted via a status-note banner;
  `onboarding-and-tutorial.md` aligned `approved → draft` (H4 oversight).

## 2. HITL outcomes (Nico, live 2026-06-11)

| # | Fork | Decision |
|---|---|---|
| H1 | ADR-0100 vs ADR-0076/0085 — ledger says "0076/0085→0100", ADR-0100 body says thread-portions only | **Amendment pattern** (like ADR-0095/0097/0098): predecessors stay `accepted` + `amended_by:`; ADR-0100 frontmatter `supersedes:` → `amends:`; dated partial-supersession notes in both predecessors |
| H2 | 27 system/mode notes claim "approved product rule" but were not among the 133 ratified decisions | **Keep `draft`**; demote "approved" wording to history; `binding: false` while draft; re-approval = later HITL pass |
| H3 | Standing drift checker | **Script + CI**: `scripts/status-consistency-check.mjs` wired into the docs-check workflow |
| H4 | `onboarding-and-tutorial.md` sole surviving `approved` system note | **Oversight** — aligned per H2 (GD-0012 carries the ratified onboarding decisions) |

## 3. Ledger erratum (recorded here; the ledger itself is unchanged)

[[decision-queue-2026-06-08-ratified]] line "ADR-0076/0085→0100" reads as a
full supersession. Applied disposition (per ADR-0100's own scope text + H1):
**partial supersession recorded as an amendment** — ADR-0100 `amends`
ADR-0076 + ADR-0085 (thread-ownership / thread-naming portions only); both
predecessors remain `accepted`. The ledger stays untouched as a frozen scribe
record; this inventory is the authoritative interpretation record.

## 4. Conventions confirmed by this sweep

- Body `## Status` = the bare frontmatter status word + a dated history
  blockquote (ADR-0092 demotion mechanic); a **missing** body status section is
  valid (narrative is optional).
- Pre-ratification banners are **demoted, never deleted** ("History
  (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143)").
- `superseded_by:` is kept **inline** (docs-check's line-based parser cannot
  see list-style values).
- The standing checker `scripts/status-consistency-check.mjs` enforces:
  body⇄frontmatter agreement, map header⇄table-row count, no stale
  ratify-gate/"PR pending" phrases, superseded ⇒ resolvable inline
  `superseded_by:`.

## 5. Full inventory (133 records)

Class: **A** = status-lag (body older than frontmatter) · **B** =
open-decision body language, decided against a referee (ledger row /
joint-wave ADR-0093 / H1) · **C** = no body status section · **=** =
already consistent. "Body (pre)" is the first status line on `origin/main`
before this sweep; "Body (now)" after it.

| File | FM status | FM binding | Body (pre) | Body (now) | Class | Action / referee |
|---|---|---|---|---|---|---|
| `ADR-0001-tech-stack.md` | `superseded` | `true` | Superseded (2026-05-19 by ADR-0021-revised-tech-stack). | superseded | = | pre-existing supersession; prose body normalized to bare word + history 2026-06-11 (checker strictness) |
| `ADR-0002-offline-first.md` | `superseded` | `true` | Superseded (2026-05-18 by ADR-0020-hybrid-online-mvp-offli | superseded | = | pre-existing supersession; prose body normalized to bare word + history 2026-06-11 (checker strictness) |
| `ADR-0003-match-engine.md` | `superseded` | `false` | Accepted (2026-05-16, gap A3 of ../../95-Archive/gap-repor | superseded | A | body → frontmatter + dated history |
| `ADR-0004-data-model.md` | `superseded` | `true` | Superseded (2026-05-19 by ADR-0027-postgres-data-model). | superseded | = | pre-existing supersession; prose body normalized to bare word + history 2026-06-11 (checker strictness) |
| `ADR-0005-save-format.md` | `accepted` | `true` | Accepted (2026-05-16, gap A5 of ../../95-Archive/gap-repor | accepted | A | body → frontmatter + dated history |
| `ADR-0006-i18n.md` | `superseded` | `false` | draft | superseded | A | body → frontmatter + dated history |
| `ADR-0007-naming-schema.md` | `accepted` | `true` | Accepted (2026-05-17, gap D2 of | accepted | A | body → frontmatter + dated history |
| `ADR-0008-mobile-first-ui.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0009-cursor-orchestration.md` | `superseded` | `true` | accepted | superseded | A | body → frontmatter + dated history |
| `ADR-0010-design-system.md` | `accepted` | `` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `ADR-0011-server-authoritative-multiplayer.md` | `accepted` | `true` | Accepted (2026-05-16, gap B2 of ../../95-Archive/gap-repor | accepted | A | body → frontmatter + dated history |
| `ADR-0012-async-cadence-models.md` | `accepted` | `false` | Proposed (2026-05-16). Needs Nico's review before acceptance | accepted | B | ledger/HITL referee → recorded |
| `ADR-0013-transactional-outbox.md` | `superseded` | `true` | Superseded (2026-05-19 by ADR-0028-postgres-transactional- | superseded | = | pre-existing supersession; prose body normalized to bare word + history 2026-06-11 (checker strictness) |
| `ADR-0014-state-machines.md` | `accepted` | `false` | Proposed (2026-05-16). Needs Nico's review before acceptance | accepted | B | ledger/HITL referee → recorded |
| `ADR-0015-spectator-snapshot-streaming.md` | `superseded` | `false` | Proposed (2026-05-16). Needs Nico's review before acceptance | superseded | B | ledger/HITL referee → recorded |
| `ADR-0016-community-dataset-overrides.md` | `accepted` | `false` | Proposed (2026-05-16). Needs Nico's review before acceptance | accepted | B | ledger/HITL referee → recorded |
| `ADR-0017-observability-logging.md` | `accepted` | `true` | Accepted (2026-05-17, gap D11 / C6 / E3 planning pass). | accepted | A | body → frontmatter + dated history |
| `ADR-0018-systemic-events-and-player-lifecycle.md` | `accepted` | `true` | Accepted (2026-05-17, systemic events / player lifecycle doc | accepted | A | body → frontmatter + dated history |
| `ADR-0019-modular-monolith-ddd.md` | `accepted` | `true` | Accepted (2026-05-16, gap B1 of ../../95-Archive/gap-repor | accepted | A | body → frontmatter + dated history |
| `ADR-0020-hybrid-online-mvp-offline-ready.md` | `accepted` | `true` | Accepted (2026-05-18). Supersedes ADR-0002-offline-first | accepted | A | body → frontmatter + dated history |
| `ADR-0021-revised-tech-stack.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0022-animation-game-feel.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0023-realtime-transport.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0024-match-renderer-abstraction.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0025-mobile-delivery.md` | `superseded` | `true` | accepted | superseded | A | body → frontmatter + dated history |
| `ADR-0026-match-frame-contract.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0027-postgres-data-model.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0028-postgres-transactional-outbox.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0029-3d-presentation-layer.md` | `accepted` | `true` | Accepted (2026-05-20). Precises — does **not** supersede — t | accepted | A | body → frontmatter + dated history |
| `ADR-0030-llm-out-of-authoritative-state.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0041-presentation-renderer-strategy.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0043-notification-and-messaging-platform.md` | `superseded` | `true` | accepted | superseded | A | body → frontmatter + dated history |
| `ADR-0044-cicd-and-merge-policy.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0045-issue-first-worktree-workflow.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0046-team-topology-and-scaling.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0047-babylon-3d-presentation-engine.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0048-design-update-and-migration-path.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0049-swappable-spatial-event-match-engine.md` | `superseded` | `false` | draft | superseded | A | body → frontmatter + dated history |
| `ADR-0050-club-economy-accounting-ledger.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0051-manager-and-legacy-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0052-people-persona-and-skills-context.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history — map §1.1 said "not accepted yet" vs §1 table row → fixed; §A1 listed open → closed |
| `ADR-0053-staff-operations-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0054-narrative-context-and-ai-narration-framework.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history — map §1.3 said "not accepted yet" vs §1 table row → fixed; §D row unchecked → ticked |
| `ADR-0055-tactics-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0056-regulations-compliance-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0057-rivalry-system-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0058-club-economy-commercial-impact-boundary.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0059-community-overlay-pipeline-context.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §A2 listed open → closed |
| `ADR-0060-youth-academy-context.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §A3 listed open → closed |
| `ADR-0061-club-management-sub-aggregate-audit.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0062-audience-and-atmosphere-context.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0063-investor-entitlement-and-payment-boundary.md` | `accepted` | `false` | **draft / proposed** — research-phase ADR. Decisions in this | accepted | A | body → frontmatter + dated history |
| `ADR-0064-scouting-activity-context.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0065-narrative-media-press-content-ownership.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0066-competition-registry-sub-aggregate.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0067-set-piece-variant-selection-determinism.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0068-fixture-scheduling-contract.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0069-league-regulations-eligibility-handoff.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0070-fixture-commercial-revenue-profile-contract.md` | `accepted` | `true` | accepted | accepted | = | already consistent — history line added where prose-style |
| `ADR-0071-ai-world-simulation-context-and-drift-contract.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — map prose said "future …, not added until Nico accepts" vs §1 table row → fixed; §D row unchecked → ticked |
| `ADR-0072-in-match-control-seam.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0073-player-contract-lifecycle-fsm.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0074-tactical-identity-fingerprint-aggregation.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0075-loan-orchestration-process-manager.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0076-narrative-newsworthiness-event-contracts.md` | `accepted` | `false` | proposed | accepted | B | ledger/HITL referee → recorded |
| `ADR-0077-environment-and-climate-context-weather-and-pitch.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §B M3 + §D row → closed |
| `ADR-0078-player-discipline-suspension-contracts.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0079-dynasty-board-ownership-and-bankruptcy.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0080-opposition-template-ai-consumption-contract.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0081-statistics-analytics-read-model-owner.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — map prose said "future …, not added until Nico accepts" vs §1 table row → fixed; §D row unchecked → ticked |
| `ADR-0082-manager-style-signal-and-run-analysis-contract.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0083-awards-honours-records-and-hall-of-fame-contract.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §B M2 + §D row → closed |
| `ADR-0084-national-team-dual-role-and-international-window-contract.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history |
| `ADR-0085-media-ecology-context-and-outlet-operational-behaviour.md` | `accepted` | `false` | proposed | accepted | B | ledger/HITL referee → recorded — map row uses ADR-0100 `CoverageThread` naming → consistent w/ amendment (H1); §B M1 + §D row → closed |
| `ADR-0086-background-fast-matchday-cost-settlement.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0087-live-match-intervention-buffer-and-pause-vote.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §D row unchecked → ticked |
| `ADR-0089-bounded-context-portfolio-reconciliation.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — map header/table = 28 contexts (catalog ordinals) → consistent; §C listed open → closed |
| `ADR-0090-offline-sync-scope-and-conflict-strategy.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §A4 listed open → closed |
| `ADR-0091-audit-security-context-definition.md` | `accepted` | `false` | proposed | accepted | A | body → frontmatter + dated history — §A5 listed open → closed |
| `ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0093-joint-ratification-wave-async-coordination-foundation.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0094-i18n-stack-and-locale-scope.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0095-balanced-transfer-ledger-posting-invariant.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0096-match-engine-cross-runtime-determinism-numeric-surface.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0097-postgres-scale-envelope-and-audit-canonicalisation.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0098-save-format-kdf-argon2id-and-active-pack-refs.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0099-spectator-watch-party-streaming-over-committed-event-log.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0100-story-thread-ownership-and-cross-context-naming.md` | `accepted` | `false` | draft | accepted | B | ledger/HITL referee → recorded — map Narrative row uses `StoryThread` origination → consistent w/ amendment (H1) |
| `ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0102-notification-platform-re-ratification-offline-delivery-clause.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0103-multi-agent-orchestration-conflict-serialization.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `ADR-0104-mobile-delivery-grounding-and-ratification.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0001-core-loop.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0002-match-engine.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0003-squad-players.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0004-tactics.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0005-training.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0006-transfers.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0007-youth.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0008-finance-economy.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0009-league-structure.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0010-ai-world.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0011-career-progression.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0012-onboarding.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0013-narrative-inbox.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0014-save-career-model.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0015-ip-clean-data.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0016-mobile-ux-loop.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0017-mvp-scope-and-mode-sequencing.md` | `accepted` | `true` | approved | accepted | A | body → frontmatter + dated history |
| `GD-0018-ai-narrative-personas-and-dialogue.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0019-manager-archetype-roguelite-progression.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0020-eos-player-skills-personas-and-people.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0021-player-staff-development-and-decision-influence.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0022-economy-commercial-impact-and-contracts.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0023-ai-club-economy-behaviour.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0024-ai-world-drift-algorithm.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0025-in-match-controls.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0026-set-piece-coach-readiness.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0027-hidden-attribute-substrate-mapping.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0028-dialogue-intent-taxonomy-effect-matrix.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0029-weather-and-pitch-design-model.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0030-dynasty-board-and-ownership.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0031-analytics-hub-and-statistics.md` | `accepted` | `false` | draft | accepted | A | body → frontmatter + dated history |
| `GD-0032-awards-honours-records-and-hall-of-fame.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0033-national-team-dual-role.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0034-media-outlet-ecology-model.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0035-live-coaching-intervention-and-pause-rules.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0036-transfer-escalation-and-inactivity-pressure.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0037-offline-narration-tier-on-device-webgpu.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0038-bounded-context-portfolio-trim-merge-review-gate.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0039-c6-status-reconciliation-and-cluster-ratification-order.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |
| `GD-0040-future-contracts-clm-extraction-seam.md` | `accepted` | `false` | — | — | C | no body status section — OK (narrative optional per ADR-0092) |

## 6. Out-of-ledger notes (class D — system/mode notes)

27 non-numbered notes in `docs/50-Game-Design/` (e.g. `mode-create-a-club-roguelite.md`,
`mode-manage-a-club-career.md`, `singleplayer-baseline.md`, `onboarding-and-tutorial.md`)
+ `fan-ecology.md` (`superseded`, untouched). All kept `draft` per H2/H4 with the
status-note banner; see §2.
