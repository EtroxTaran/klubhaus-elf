---
title: Vault Home
status: current
tags: [meta]
created: 2026-05-15
updated: 2026-05-18
type: index
binding: true
---

# soccer-manager — Project Wiki

The documentation single source of truth for the `soccer-manager` project, and
the front door to every area. Agents start at [[Agent-Onboarding]]; humans can
read top-to-bottom or use the left **Explorer** to browse the full tree.

## Start here (agents)

- [[Agent-Onboarding]] — first read every session
- [[Current-State]] — hot snapshot: building / stable / blocked
- [[../90-Meta/agent-memory-protocol]] — session start/update/wrap-up steps
- [[../90-Meta/vault-governance]] — memory classes, supersede discipline

## Context

- [[Vision]] — goals
- [[MVP-Scope]] — canonical MVP scope
- [[Non-Goals]] — explicit exclusions
- [[Glossary]] · [[Decision-Log]]
- [[Repository]] — README, Contributing, Agent & Claude guides (repo-root docs)
- [[UI-Showcase]] — the live Storybook design-system showcase
- [[../90-Meta/conventions]] — how the vault is written and organised

## Architecture (arc42)

- [[../10-Architecture/01-Introduction]] · [[../10-Architecture/02-Constraints]] ·
  [[../10-Architecture/03-Context]] · [[../10-Architecture/04-Solution-Strategy]]
- [[../10-Architecture/05-Building-Blocks]] · [[../10-Architecture/06-Runtime]] ·
  [[../10-Architecture/07-Deployment]] · [[../10-Architecture/08-Crosscutting]]
- [[../10-Architecture/09-Design-System]] · [[../10-Architecture/10-Quality]] ·
  [[../10-Architecture/11-Risks]]
- **Decisions:** ADR-0001 … ADR-0020 in `10-Architecture/09-Decisions/`
  (tech stack, hybrid-online MVP, match engine, data model, save format, i18n,
  naming, mobile-first UI, cursor orchestration, design system, DDD,
  multiplayer, outbox, observability and systemic events).

## Product

- [[../20-Features/README]] — feature specifications.
- [[../50-Game-Design/README]] — game-design specifications, including the
  GDDR decision-record set (`GD-0001`...`GD-0016`).
- [[../40-User-Docs/README]] — player-facing documentation.

Product authority flows research -> game design -> ADRs -> implementation.
Approved game-design records are the source for gameplay behaviour; accepted
ADRs are the source for technical shape.

## Implementation

- [[../30-Implementation/agent-workflow-pattern]] ·
  [[../30-Implementation/ci-and-review-process]] ·
  [[../30-Implementation/cursor-cloud-agent-workflow]]
- [[../30-Implementation/deployment-dokploy]] ·
  [[../30-Implementation/design-sync-workflow]] ·
  [[../30-Implementation/linear-task-tracking]]
- [[../30-Implementation/pwa-offline-strategy]] ·
  [[../30-Implementation/secrets-rotation]] ·
  [[../30-Implementation/surrealdb-integration]]

## Research

- [[../60-Research/00-summary]] — start here, then [[Research-Map]] for
  locked Wave 3 notes, including narrative, AI managers, match/runtime,
  performance, player strength, transfer market and systemic events.

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
