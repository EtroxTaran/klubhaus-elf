---
title: Vault Home
status: current
tags: [meta]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
---

# soccer-manager Vault

This Obsidian Vault is the documentation single source of truth for the
`soccer-manager` project. Agents start at [[Agent-Onboarding]].

## Start here (agents)

- [[Agent-Onboarding]] — first read every session
- [[Current-State]] — hot snapshot: building / stable / blocked
- [[../90-Meta/agent-memory-protocol]] — session start/update/wrap-up steps
- [[../90-Meta/vault-governance]] — memory classes, supersede discipline

## Context

- [[Vision]] — goals
- [[Non-Goals]] — explicit exclusions
- [[Glossary]] — terminology

## Maps of Content (domain hubs)

The graph is hub-and-spoke. Each MOC links all notes in its domain; every
content note links back to its MOC and to its ADRs/modules (see
[[../90-Meta/vault-governance]] § Knowledge connectivity).

- [[../60-Research/00-summary]] — **Research** (inputs)
- [[../50-Game-Design/README]] — **Game Design** (GDDRs — how the game works)
- [[Decision-Log]] — **ADRs** (how it is built — status + lineage)
- [[../10-Architecture/README]] — **Architecture** (arc42)
- [[../10-Architecture/05-Building-Blocks]] — **Modules**
- [[../30-Implementation/README]] — **Implementation** (process, CI, infra)

The order above is the causal chain: research → game design → ADRs →
architecture → implementation.

## Other entry points

- [[../10-Architecture/01-Introduction]] · [[../10-Architecture/09-Design-System]]
- [[../30-Implementation/agent-workflow-pattern]] · [[../30-Implementation/cursor-cloud-agent-workflow]]
- [[../90-Meta/conventions]] · [[../90-Meta/obsidian-config]]
