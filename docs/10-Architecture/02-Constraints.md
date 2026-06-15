---
title: Constraints
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-06-15
type: arch
related: [[01-Introduction]], [[04-Solution-Strategy]], [[09-Decisions/ADR-0021-revised-tech-stack]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[../00-Index/MVP-Scope]]
---

# Constraints

- **Offline-first PWA, installable.** The client is usable without connectivity;
  runtime staging toward full offline-first singleplayer is governed by
  [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]].
- **Single-node deployment.** MVP ships as a single-node Dokploy / Docker Compose
  stack on Hetzner ([[09-Decisions/ADR-0044-cicd-and-merge-policy]]); it must stay
  operable on one node.
- **PostgreSQL 18.x is the system of record**, with a documented schema-per-save
  scale ceiling (**300** soft-warn / **1000** hard-stop live save schemas per
  single Dokploy node) and cold/archive fallback
  ([[09-Decisions/ADR-0027-postgres-data-model]],
  [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]).
- **Deterministic match engine** across runtimes, on an integer / fixed-point
  numeric surface
  ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **IP-safe naming gate.** No real club logos, club names, sponsors or player
  names; every generated name must read as evocative-but-clearly-fictional
  ([[09-Decisions/ADR-0007-naming-schema]]).
- **Version currency.** Always track the latest stable versions of libs/tools;
  no floating `latest` specifiers — all deps pinned, upgrades managed
  ([[09-Decisions/ADR-0021-revised-tech-stack]]).
- **German primary UI with i18n from day one.**
- **pnpm, Biome, Vitest, Playwright, and TypeScript strict are mandatory**
  ([[09-Decisions/ADR-0021-revised-tech-stack]]).
- **No-development phase.** The project is in research / analysis / architecture
  planning; specs are current but non-binding for implementation until the
  decision gate opens the build phase
  ([[../90-Meta/collaboration-and-decision-protocol]]).

## Related

- [[09-Decisions/ADR-0021-revised-tech-stack]] — stack & currency mandate · [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — offline-ready runtime staging · [[09-Decisions/ADR-0007-naming-schema]] — IP-safe naming gate
- [[09-Decisions/ADR-0044-cicd-and-merge-policy]] — single-node Dokploy/Hetzner deploy · [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] — deterministic engine
- [[01-Introduction]] · [[04-Solution-Strategy]] — arc42 siblings
- [[../00-Index/MVP-Scope]] — MVP boundaries · [[../00-Index/Non-Goals]] — explicit exclusions
