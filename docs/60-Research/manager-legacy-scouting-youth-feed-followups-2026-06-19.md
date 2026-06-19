---
title: Manager Legacy Scouting Youth Feed Follow-ups
status: draft
tags: [research, synthesis, fmx-157, manager-legacy, scouting, youth, academy, contracts, retention]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-157
sourceType: synthesis
related:
  - [[raw-perplexity/raw-fmx-157-academy-audit-retention-2026-06-19]]
  - [[raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
  - [[raw-perplexity/raw-fmx-157-handoff-schemas-2026-06-19]]
  - [[raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../10-Architecture/state-machines/youth-academy]]
  - [[../10-Architecture/state-machines/loan-orchestration]]
---

# Manager Legacy Scouting Youth Feed Follow-ups

## Question

How should FMX close the named-but-underdefined seams around Youth Academy
audit/retention, Scouting -> Youth Academy discovery, Youth Academy -> Transfer
loan handoff, opposition scouting and Manager & Legacy youth-style summaries
without reopening already accepted context boundaries?

## Short answer

Keep the existing owners. FMX-157 should be an **additive decision packet**, not
three new accepted ADRs:

- Youth Academy remains owner of academy category/audit facts, cohort history
  and youth-pipeline summary production.
- Scouting remains owner of external discovery, report freshness and
  `ExternalYouthProspectIdentified`.
- Transfer's Loan-Orchestration PM remains the consumer/host for `YouthLoaned`.
- Tactics remains owner of match-plan/template interpretation; Scouting can
  produce opposition reports, but Match only consumes frozen Tactics snapshots.
- Manager & Legacy consumes immutable youth/scouting summaries at run/save
  watermarks. It does not read live producer state and does not become a second
  source of youth, scouting or loan truth.

Accepted packet is D1-D6 in
[[../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]].
The approved choices are binding after Nico approved them on 2026-06-19.

## Source-checked basis

- The official Premier League EPPP page supports an academy-category audit
  analogue: long-term youth development, U9-U23 phases, central academy data,
  independent audit, Category 1-4 and factors including productivity,
  facilities, coaching, education and welfare.
- DDD source checks support explicit bounded-context handoffs with
  producer-owned events, private data ownership, consumer-owned projections and
  no cross-context table joins.
- Event-sourcing and snapshot references support retaining long-save summaries
  and milestones without keeping every detailed cohort/report payload hot
  forever.
- Opposition-scouting external evidence was weaker. Use it as workflow/player
  expectation only; rely on ADR-0064/ADR-0080 for architecture.

## Recommended decisions

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 - canonical home | Targeted amendments to ADR-0060/0064/0075/0080 plus this decision queue, not a standalone accepted ADR yet. | The context boundaries already exist; FMX-157 adds unresolved detail. |
| D2 - academy audit owner | Youth Academy owns an `AcademyCategoryAuditCycle` PM and publishes summary facts; Manager & Legacy consumes snapshots only. | Matches EPPP audit analogue and ADR-0051 read-only-at-creation/run-analysis rule. |
| D3 - retention/cadence | Proposed game cadence: audit every 2 academy seasons; full detail 5 seasons; 20+ season yearly summaries/milestones. | Playable, testable and long-save friendly. Exact values need Nico/calibration because cadence was not a strong external fact. |
| D4 - opposition split | Scouting owns report execution/freshness; Tactics owns interpretation into match-plan/template inputs. | Avoids turning Tactics into intelligence gathering or Scouting into match planning. |
| D5 - schema pattern | Producer-owned Published Language event plus consumer ACL/snapshot. No shared kernel/fat cross-context event. | Best fit with FMX no-join rules and DDD source checks. |
| D6 - MVP scope | Keep these as named post-MVP/reserved stubs until Nico promotes them. | Prevents docs-phase scope creep while preserving the follow-up trail. |

## Candidate contract sketches

These are draft shapes for Nico's decision queue. Field names are intentionally
conservative and avoid PII-heavy youth/player payloads.

### `ExternalYouthProspectIdentified`

Producer: Scouting. Consumer: Youth Academy.

```ts
type ExternalYouthProspectIdentifiedV1 = {
  eventId: EventId
  schemaVersion: 1
  occurredAtSeq: number
  producerContext: 'scouting'
  saveId: SaveId
  scoutingClubId: ClubId
  prospectRef: ProspectRef
  sourceCoverageRef: CoveragePlanRef
  regionRef: RegionRef
  ageBand: 'u15' | 'u16' | 'u17' | 'u18'
  positionGroup: PositionGroup
  scoutingConfidenceBand: 'low' | 'medium' | 'high'
  potentialBand: 'depth' | 'prospect' | 'high-upside' | 'elite-risk'
  riskFlags: ReadonlyArray<string>
  recommendation: 'monitor' | 'invite-to-intake' | 'priority-review'
  correlationId: CorrelationId
}
```

Youth Academy copies the fields it needs into its intake ACL projection. It
does not join Scouting report tables.

### `YouthLoaned`

Producer: Youth Academy. Consumer: Transfer `LoanOrchestrationProcessManager`.

```ts
type YouthLoanedV1 = {
  eventId: EventId
  schemaVersion: 1
  occurredAtSeq: number
  producerContext: 'youth-academy'
  saveId: SaveId
  academyPlayerRef: PlayerRef
  cohortRef: YouthCohortRef
  parentClubId: ClubId
  decisionId: YouthDecisionId
  proposedLoanWindow: TransferWindowRef
  targetLoanProfile: {
    competitionTierBand: 'development' | 'rotation' | 'senior-minutes'
    minutesObjectiveBand: 'low' | 'medium' | 'high'
    developmentObjectives: ReadonlyArray<string>
    noRivalLoan: boolean
  }
  constraints: {
    maxDuration: 'window-to-window' | 'season'
    recallPreferred: boolean
  }
  correlationId: CorrelationId
}
```

Transfer materializes a `proposed` `LoanAgreement` through ADR-0075. Youth
Academy does not own negotiation, eligibility, minutes monitoring or finance.

### `AcademyPipelineSummaryUpdated`

Producer: Youth Academy. Consumer: Manager & Legacy.

```ts
type AcademyPipelineSummaryUpdatedV1 = {
  eventId: EventId
  schemaVersion: 1
  occurredAtSeq: number
  producerContext: 'youth-academy'
  saveId: SaveId
  clubId: ClubId
  academySeasonRef: AcademySeasonRef
  auditWindowRef: AcademyAuditWindowRef
  categoryBand: 'foundation' | 'developing' | 'strong' | 'elite'
  productivityBand: 'low' | 'medium' | 'high'
  cohortSummary: {
    generatedCountBand: 'small' | 'normal' | 'large'
    promotedCount: number
    loanedCount: number
    releasedCount: number
  }
  notableMilestoneRefs: ReadonlyArray<MilestoneRef>
  summaryVersion: 'academy-pipeline-summary-v1'
}
```

Manager & Legacy stores this as analysis input only. Source facts remain in
Youth Academy/Squad/Training/Transfer.

## Risks and guardrails

- Do not use real EPPP/NLZ/UEFA names in player-facing gameplay. Keep them as
  research analogues only.
- Do not store youth/player PII-heavy identity fields in cross-context events
  when stable refs and bands are enough.
- Do not create a shared youth/scouting kernel or a "mega youth report" event.
- Do not introduce new RNG. All proposed summaries are projections of already
  committed facts.
- Do not pull full opposition scouting into MVP. The report hook can remain
  reserved until a Tactics-adjacent issue needs it.

## Related

- [[raw-perplexity/raw-fmx-157-academy-audit-retention-2026-06-19]]
- [[raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
- [[raw-perplexity/raw-fmx-157-handoff-schemas-2026-06-19]]
- [[raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
- [[../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
- [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
- [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
- [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
- [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
- [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
- [[../10-Architecture/state-machines/youth-academy]]
- [[../10-Architecture/state-machines/loan-orchestration]]
