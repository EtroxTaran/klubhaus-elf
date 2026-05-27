---
title: Vault Home
status: current
tags: [meta]
created: 2026-05-15
updated: 2026-05-27
type: index
binding: true
---

# soccer-manager — Project Wiki

The documentation single source of truth for the `soccer-manager` project, and
the front door to every area. Agents start at [[Agent-Onboarding]]; humans can
read top-to-bottom or use the left **Explorer** to browse the full tree.

> **New here? Read these five, in order, and ignore the rest until a task needs
> it:** [[Agent-Onboarding]] → [[Current-State]] → [[Documentation-V1]] →
> [[Decision-Log]] → [[MVP-Scope]]. [[Documentation-V1]] is the single
> ground-truth baseline (current stack, MVP, and what is binding vs. historical).
> The wider vault (~160 files: features, game design, research, pre-mortem) is
> reference material, not required reading.

## Start here (agents)

- [[Agent-Onboarding]] — first read every session
- [[Current-State]] — hot snapshot: building / stable / blocked
- [[../90-Meta/collaboration-and-decision-protocol]] — roles, ask-first decision gate, current phase
- [[../90-Meta/agent-memory-protocol]] — session start/update/wrap-up steps
- [[../90-Meta/vault-governance]] — memory classes, supersede discipline

## Context

- [[Vision]] — goals
- [[MVP-Scope]] — canonical MVP scope
- [[Non-Goals]] — explicit exclusions
- [[Glossary]] · [[Decision-Log]] · [[Documentation-V1]]
- [[Repository]] — README, Contributing, Agent & Claude guides (repo-root docs)
- [[UI-Showcase]] — the live Storybook design-system showcase
- [[../90-Meta/conventions]] — how the vault is written and organised

## Architecture (arc42)

- [[../10-Architecture/01-Introduction]] · [[../10-Architecture/02-Constraints]] ·
  [[../10-Architecture/03-Context]] · [[../10-Architecture/04-Solution-Strategy]]
- [[../10-Architecture/05-Building-Blocks]] · [[../10-Architecture/06-Runtime]] ·
  [[../10-Architecture/07-Deployment]] · [[../10-Architecture/08-Crosscutting]]
- [[../10-Architecture/09-Design-System]] · [[../10-Architecture/09-Design-Styleguide]] ·
  [[../10-Architecture/10-Quality]] · [[../10-Architecture/11-Risks]]
- **Decisions:** the canonical ADR index with status and lineage is
  [[Decision-Log]] (covering ADR-0001 … ADR-0051 in
  `10-Architecture/09-Decisions/`). Current binding set includes the revised
  tech stack (ADR-0021), PostgreSQL data model + transactional outbox
  (ADR-0027/0028), hybrid-online MVP (ADR-0020), and the reopened match-engine
  line (ADR-0049 proposed; ADR-0003 historical),
  Club Economy accounting ledger (ADR-0050 draft),
  Manager & Legacy context proposal (ADR-0051 draft),
  realtime transport (ADR-0023), renderer + frame contract
  (ADR-0024/0026/0041), DDD modular monolith (ADR-0019), multiplayer
  (ADR-0011), design system (ADR-0010), observability (ADR-0017), systemic
  events (ADR-0018) and notification/messaging (ADR-0043). Superseded
  predecessors (ADR-0001/0002/0004/0013) are kept as historical memory only.

## Product

- [[../20-Features/README]] — feature specifications.
- [[../50-Game-Design/README]] — game-design specifications, including the
  GDDR decision-record set (`GD-0001`...`GD-0019`).
- [[../70-User-Docs/README]] — player-facing documentation.

Product authority flows research -> game design -> ADRs -> implementation.
Approved game-design records are the source for gameplay behaviour; accepted
ADRs are the source for technical shape.

## Implementation

- [[../30-Implementation/agent-workflow-pattern]] ·
  [[../30-Implementation/ci-and-review-process]] ·
  [[../30-Implementation/cursor-cloud-agent-workflow]]
- [[../30-Implementation/deployment-dokploy]] ·
  [[../30-Implementation/design-sync-workflow]]
- [[../30-Implementation/hybrid-online-pwa-strategy]] ·
  [[../30-Implementation/postgres-drizzle-integration]] ·
  [[../30-Implementation/secrets-management]]
- [[../30-Implementation/linear-task-tracking]] — Linear (team FMX) conventions + GitHub tracking

## Research

- [[../60-Research/00-summary]] — start here, then [[Research-Map]] for
  current research notes, including narrative, AI managers, match/runtime,
  club economy, manager-archetype Roguelite progression, performance, player
  strength, transfer market, systemic events and the 2026-05-22 V1 baseline.
- [[../60-Research/pre-mortem/00-index]] — Pre-Mortem 2026-05-20 (3 Iterationen,
  14 Reports + Threat-Model + Registry, ~191 Findings). **Iter 1**: 4 Original-
  Reports (Architecture, Tech-Ops, Gameplay, Monetization). **Iter 2**: Security
  & Integrity, BYOC Future-Scope, Threat-Model, Single-Player-Foundation-Addenda.
  **Iter 3**: 12 Deep-Dive-Reports (Live-Ops, Legal/Tax, i18n, Accessibility,
  AI/LLM, Long-Term-Balance, Community/UGC, Brand/PR + Re-Branding, Browser/
  Storage, Test-Strategy, Vendor/ESG, Responsible-Gaming/OSS). Alle Findings mit
  `PM-2026-05-20-XX-F-NN`-IDs + **P0–P4-Prioritäts-Tag** zur Verkettung mit Fixes.
  Siehe [[../60-Research/pre-mortem/findings-registry]] für Status (sortiert nach
  Priorität), [[../60-Research/pre-mortem/threat-model]] für Trust-Boundaries,
  [[../60-Research/pre-mortem/prioritization-matrix]] für Hebel/Cluster und
  [[../60-Research/pre-mortem/execution-index]] für 15 Expertise-Kategorien
  (Briefings für frische Agenten). [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  und [[Documentation-V1]] schließen den Konzept- und
  Dokumentations-Gap-Stand vom 2026-05-22; verbleibende Evidence-Gates laufen
  über Umsetzung, Tests, Runbooks, Legal Sign-off oder Produktionstelemetrie.

## Meta & process

- [[../90-Meta/README]] · [[../90-Meta/agent-memory-protocol]] ·
  [[../90-Meta/vault-governance]] · [[../90-Meta/obsidian-config]]
- [[../90-Meta/templates/README]] — Linear issue templates.
- GitHub issue suite & implementation backlog: `90-Meta/github-issue-suite/`.

## Maps

- [[Architecture-Map]]
- [[Game-Design-Map]]
- [[Feature-Map]]
- [[Research-Map]]
- [[Implementation-Map]]
- [[User-Docs-Map]]
