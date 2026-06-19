---
title: SurrealDB Deferral Re-evaluation Watch
status: draft
tags: [research, fmx-166, surrealdb, postgresql, graph, realtime, projection, risk, adr, dependency-currency]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-166
sourceType: synthesis
related:
  - [[raw-perplexity/raw-fmx-166-surrealdb-deferral-reevaluation-2026-06-19]]
  - [[raw-perplexity/raw-fmx-166-surrealdb-deferral-governance-2026-06-19]]
  - [[raw-perplexity/raw-fmx-166-surrealdb-deferral-game-precedents-2026-06-19]]
  - [[raw-perplexity/raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../10-Architecture/11-Risks]]
  - [[../10-Architecture/07-Deployment]]
---

# SurrealDB Deferral Re-evaluation Watch

## Question

How should FMX replace the stale "SurrealDB stable 1.x / re-evaluate 2.x"
deferral wording with a concrete re-evaluation trigger, owner and watch
mechanism without reopening PostgreSQL as the system of record?

## Short answer

SurrealDB remains **deferred / Assess**, not adopted. The current source check
does change one fact: the old `1.x` pin is stale. On 2026-06-19 the observed
current stable SurrealDB patch is **3.1.4**, so future FMX work must never
inherit "1.x" as a planning pin. If SurrealDB is ever trialed, it must be
source-checked and exact-pinned to the current stable release line at that
future date.

Recommended non-binding watch protocol for Nico:

- owner: Lead Architect / Data Platform owner until a dedicated platform owner
  exists;
- cadence: quarterly light watch plus event-driven review on major release,
  critical security advisory, backup/migration maturity change or concrete FMX
  graph/live product need;
- trigger: re-evaluate only when both conditions are true:
  1. an FMX feature proves a multi-hop graph/live projection need that
     PostgreSQL/read models/in-memory graph logic cannot meet against a written
     target;
  2. the current SurrealDB stable line passes release, security, migration,
     backup/restore, observability and operations checks;
- Trial boundary: non-authoritative, rebuildable projection only, behind the
  existing realtime/projection interface, with disable/rebuild/rollback
  evidence and no money/progression/contract/save truth.

This packet is a **decision queue**, not an acceptance. It preserves the
research and recommendations for Nico's D1-D5 approval.

## Source-checked current facts

| Fact | Evidence | FMX implication |
|---|---|---|
| SurrealDB latest stable line moved past the old wording | Official releases page lists 3.1 as latest and 3.1.4 as latest patch on 2026-06-10; GitHub tag/release evidence agrees. | Remove `1.x` as a future planning pin. At a future Trial, verify and exact-pin the then-current stable line. |
| Roadmap items are not guaranteed | SurrealDB roadmap says items and timescales can change; distributed live queries and incremental backups are watch items, not proof. | Roadmap movement can trigger a review, but not adoption. |
| Graph/live features are real product surface | Official docs and Context7/Ref checks expose graph/record links, live queries, migrations and observability. | Keep the option open for a projection/live graph store. |
| Backup/import/export maturity is still a trial gate | Official docs describe SurrealQL export/import and validation; roadmap tracks incremental backups separately. | Any future Trial must prove rebuild/restore objectives for the projection data. |
| FMX has no current must-have graph/live need | Current accepted data architecture uses PostgreSQL + Drizzle as system of record, with typed read models and recursive CTEs for modest graph needs. | Keep SurrealDB at Assess. Do not add infrastructure before a product feature proves need. |

## Real-world and game-world product analysis

Likely SurrealDB **Trial candidates** if they become central to the product:

| Candidate | Why a graph/live projection may help | First target before Trial |
|---|---|---|
| Scouting knowledge network | Scouts, regions, observations, source confidence, player relationships and discovery paths can become multi-hop. | A scouting feature needs relationship traversal or live knowledge propagation that PostgreSQL read models cannot meet. |
| People/influence network | Locker-room groups, morale propagation, agents, media and staff/player influence can become graph-shaped. | A design-approved people/influence feature needs explainable multi-hop propagation and interactive exploration. |
| Tactical interaction graph | Passing lanes, pressing dependencies, chemistry and opponent-style relationships could become graph-heavy. | Match/tactics design must require graph read models outside deterministic match authority. |
| Regulations / clause dependency graph | Loan limits, obligation clauses, eligibility and transfer windows can produce dependency chains. | Regulations/Transfer proves that rules explanation or validation needs graph traversal beyond typed relational projections. |
| Watch/social live projections | Watch Party or spectator overlays may need fast non-authoritative live relationship/read models. | Watch Party or Notification needs a measured live projection target not covered by SSE/Centrifugo + PostgreSQL outbox/read models. |

Workloads that should stay PostgreSQL/read-model first:

- money, contracts, ledger, entitlement, save/progression and audit/outbox;
- fixtures, standings, schedules and historical tables;
- player/staff attributes and deterministic progression;
- training/injury/availability facts;
- ordinary list, dashboard, search and reporting screens.

## Recommended watch protocol

### Re-evaluation triggers

Start a SurrealDB watch review when one of these events occurs. A Trial still
requires both a concrete FMX graph/live product need and current stable
ops/security/recovery readiness.

- **ProductNeedGraphLive:** a proposed feature includes a written graph/live
  requirement and a rejected PostgreSQL/read-model/in-memory alternative.
- **SurrealDBMajorRelease:** a new SurrealDB major/minor claims relevant graph,
  live-query, backup, migration or operational maturity improvements.
- **SurrealDBSecurityOpsSignal:** critical security advisory, permission/live
  query issue, data-loss advisory, backup/restore change or release-process
  change.
- **ProjectionPain:** FMX's PostgreSQL read-model approach misses a measured
  latency, complexity or operability target on a non-authoritative projection.

### Trial gate

A Trial proposal must include:

- exact current stable version, release notes and tag/source evidence;
- dependency/security review, CVE/advisory check and upgrade path;
- backup/rebuild/restore playbook and measured recovery target;
- observability and alert plan;
- disable switch and rebuild-from-PostgreSQL procedure;
- projection data contract proving no authoritative writes;
- success metrics and time-boxed exit decision.

### Adopt gate

Adoption is possible only after a successful Trial proves:

- the graph/live feature materially improves gameplay or operations;
- PostgreSQL remains the source of record;
- projection rebuild is tested;
- on-call/upgrade/backup ownership is named;
- rollback is practiced;
- Nico accepts the ADR amendment.

## Recommendation for Nico

Approve the D1-D5 packet in
[[../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]:

- D1 = C, compound trigger: product need plus current stable/ops readiness.
- D2 = A, Lead Architect/Data Platform watch owner, quarterly plus event-driven
  checks.
- D3 = A, replace `1.x` wording with "exact current stable at Trial"; note
  3.1.4 only as the 2026-06-19 observed fact.
- D4 = A, Assess -> Trial only for non-authoritative rebuildable projection
  with written exit metrics.
- D5 = A, canonical homes split across ADR-0021, ADR-0097, `11-Risks` and
  `07-Deployment`, with this packet as the evidence trail.

## Related

- [[raw-perplexity/raw-fmx-166-surrealdb-deferral-reevaluation-2026-06-19]]
- [[raw-perplexity/raw-fmx-166-surrealdb-deferral-governance-2026-06-19]]
- [[raw-perplexity/raw-fmx-166-surrealdb-deferral-game-precedents-2026-06-19]]
- [[raw-perplexity/raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
- [[../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
- [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
- [[../10-Architecture/11-Risks]]
- [[../10-Architecture/07-Deployment]]
