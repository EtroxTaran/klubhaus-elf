---
title: Regulations & Compliance module
status: draft
tags: [architecture, module, regulations, compliance]
context: regulations-compliance
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0056-regulations-compliance-context]], [[../09-Decisions/ADR-0069-league-regulations-eligibility-handoff]], [[../09-Decisions/ADR-0078-player-discipline-suspension-contracts]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Regulations & Compliance Boundary

## Purpose

Sole owner of the versioned multi-regulator rule catalog and its derived
verdicts: exposes rule profiles, eligibility/compliance read models and the
transfer-window state via an Open Host Service + Published Language, while each
consuming context owns the enforcement of those rules against its own
aggregates (ADR-0056).

## Owns

- `RegulatoryProfile` aggregate — per regulator (UEFA-analogue, national-league
  analogue, national-association analogue) × competition × tier, versioned by
  effective date.
- `Rule` aggregate — type, scope, parameters, sanction catalog, version,
  effective range.
- `TransferWindow` aggregate — FSM `scheduled → open → countdown → closing →
  closed`, per competition × season.
- `WorkPermitCatalog` aggregate — per national association: GBE-points-equivalent
  scoring formula + threshold + exception procedures.
- `SanctionCatalog` aggregate — per rule escalation chain (warning → fine →
  points deduction → registration block → licence refusal).
- `LicenceTierRequirement` aggregate — per country × tier infrastructure /
  finance / operations thresholds.
- `CommunityRuleOverrideValidation` policy — schema + semantic validation of
  community-pack rule overrides.
- The published `DisciplineProfile` rule-profile read model — rule/profile data
  only; Regulations does **not** own per-player applied discipline state
  (ADR-0078).

## Public contract

Sourced from ADR-0056 ("Public contract direction", draft precision) and the
bounded-context-map exposed outputs. Treat shapes as draft until pinned.

Commands (draft):

- `RegisterRegulatoryProfile`
- `PublishRule`
- `SupersedeRule`
- `RetireRule`
- `ScheduleTransferWindow`
- `OpenTransferWindow`
- `CloseTransferWindow`
- `IssueSanction`
- `RegisterLicenceTier`
- `ImportRuleOverride` (consumed from Community Overlay Pipeline / ADR-0016)

Domain events (draft):

- `RuleSetPublished`
- `RuleSetSuperseded`
- `TransferWindowOpened`
- `TransferWindowCountdownStarted`
- `TransferWindowClosed`
- `SanctionIssued`
- `LicenceTierRequirementsUpdated`
- `RuleOverrideValidated`
- `RuleOverrideRejected`

Queries / read models (draft; the BCM-exposed subset is marked ★):

- ★ `EligibilityForTransfer(player, fromClub, toClub, window, date)` — composite
  pass/fail verdict with violation breakdown.
- `WorkPermitScore(player, targetClub)` — score + threshold + pass/fail.
- `HomeGrownStatus(player, club, date)` — home-grown / association-trained /
  neither + evidence.
- ★ `SquadRegistrationCheck(club, registrationList, competition)` — pass/fail
  with per-rule breakdown (mandatory at MVP per ADR-0069).
- ★ `LicenceTierCompliance(club, targetTier)` — pass/fail with remediation
  options (crash-build / special permit / ground-share / refuse). Reserved hook
  at MVP (ADR-0069).
- ★ `FfpRatioCheck(club, regulator, periodEnd)` — ratio + threshold + projected
  breach + headroom. Reserved hook at MVP (ADR-0069).
- ★ `CurrentTransferWindow(competition, date)` — open / countdown / closed.
- `SanctionsForBreach(rule, breach)` — escalation chain.
- ★ `EffectiveRuleSet(save, regulator, competition, date)` — the rule-set
  snapshot the consumer applies at this point in the save.
- `DisciplineProfile` (`DisciplineProfileV1`) — versioned discipline rule
  profile consumed by Squad & Player (ADR-0078).

## Storage ownership

- Stock rule catalogs live in `packages/game-data` (per country × competition ×
  tier × effective date).
- Per-save data lives in the save's own `save_<uuidv7hex>` schema per ADR-0027:
  active rule set, community overrides applied to that save, sanction history and
  window-state history. The active rule set is copied into the save snapshot at
  save creation (ADR-0051 determinism rule); no live reading of the mutable
  global catalog during a save.
- No shared tables and no cross-context joins: every fact crosses the boundary as
  a published event or a read-model query with opaque references
  (ADR-0121, ADR-0056).

## Consumers / Producers

Consumers of Regulations outputs:

- **League Orchestration** — queries `EffectiveRuleSet`, `SquadRegistrationCheck`,
  `CurrentTransferWindow` (+ reserved `LicenceTierCompliance`, `FfpRatioCheck`)
  from a stateless `CompetitionEligibilityPolicy`; no command mutates Regulations
  and no cross-context join (ADR-0069).
- **Transfer** — runs the transfer-completion eligibility Process Manager,
  querying window status / work permit / rule definitions.
- **Squad & Player** — consumes `DisciplineProfileV1` and owns the applied
  discipline ledger / suspension / eligibility state (ADR-0078); queried for
  registration / HG facts.
- **Club Management**, **Staff Operations**, **Tactics**, **Match** (line-up-lock
  eligibility), **Community Overlay Pipeline** — each consumes via Conformist /
  Anticorruption Layer.

Producers whose facts Regulations consumes (draft, ADR-0056):

- Club Management — `EconomyWeekAdvanced`, `FinanceLedgerEntryPosted`,
  `LeagueLicenceFinancialCheckFailed`.
- League Orchestration — `RogueliteRunStarted`, `RogueliteRunEnded`,
  `SeasonAdvanced`.
- Squad & Player — `PlayerHomeGrownTimeAccumulated`, `PlayerRegistered`.
- Staff Operations — `StaffContractSigned`.
- Transfer — `TransferOfferAccepted`.
- Match — `MatchLineupLocking`.
- Community Overlay Pipeline — `CommunityRulePackImported`.

## Invariants

- Regulations owns the **rule**; every consumer owns its **enforcement** against
  its own aggregate — no central compliance god-service (ADR-0056).
- Outputs cross the boundary only as published events or read-model queries with
  opaque references; no cross-context join, no shared tables
  (ADR-0121, ADR-0069 E1).
- No rule terminology crosses the boundary — consumers receive opaque `ruleRef` /
  `RemediationRef`, never rule text (IP / `risk:legal`; ADR-0069 E8).
- Verdicts are pure functions of (command input, aggregate state,
  `ruleSetVersion`): no wall-clock, no RNG, no live catalog read — replay-safe by
  recomputation against the immutable save snapshot (ADR-0069 E3, ADR-0051).
- A running save reads only its own rule-set snapshot plus pre-authored
  future-changes; the rule set is otherwise immutable after save creation
  (ADR-0056, ADR-0027).
- Regulations owns rule/profile data only, never per-player discipline counters or
  applied state (ADR-0078 D2).

## Open items

- ADR-0056's commands, events and read models are at **draft** precision only
  ("Public contract direction" / "Draft …"); none are version-pinned or finalised.
  `ImportRuleOverride` / `RuleOverrideValidated` / `RuleOverrideRejected` depend on
  the FMX-33 Community Overlay Pipeline surface (ADR-0016), not specified here.
- Concrete per-save table names / schema layout inside the `save_<uuidv7hex>`
  schema are not enumerated by ADR-0056 — only the data categories (active rule
  set, applied community overrides, sanction history, window-state history).
  ADR-0027 governs the convention; exact tables are unspecified.
- `LicenceTierCompliance` and `FfpRatioCheck` are reserved (post-MVP /
  single-tier-inert) hooks per ADR-0069; only `EffectiveRuleSet`,
  `SquadRegistrationCheck` and `CurrentTransferWindow` are mandatory at MVP.
- ADR-0078 exposes `DisciplineProfileV1` but does not set the discipline numbers;
  a future fictional discipline-profile catalog is required and its catalog
  command/event surface is unspecified.

## Dependencies

- [[../09-Decisions/ADR-0056-regulations-compliance-context]] (primary context
  ADR; accepted/binding — do not implement yet)
- [[../09-Decisions/ADR-0069-league-regulations-eligibility-handoff]]
  (League↔Regulations eligibility hand-off contract)
- [[../09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  (discipline-profile ownership split)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save schema convention;
  platform-scope catalogs)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context joins)
