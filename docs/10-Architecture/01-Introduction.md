---
title: Introduction
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-06-08
type: arch
related: [[02-Constraints]], [[03-Context]], [[04-Solution-Strategy]], [[../00-Index/Vision]]
---

# Introduction

`soccer-manager` is an offline-first football management PWA (Anstoss-style) built
around a Create-a-Club roguelite vision, a deterministic match simulation, and
fully IP-clean generated game data. The system is decomposed into a **ratified
28-bounded-context portfolio grouped into six subdomain clusters**
([[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]];
canonical catalog in [[bounded-context-map]]). The offline-first client is the
core; a narrow cloud-sync seam and optional cloud narration are deliberately
scoped touchpoints, not dependencies.

The project is currently in its **research / analysis / architecture-planning
phase — no development has started**. The specifications in this vault are the
current single source of truth, but binding implementation is deferred until the
decision gate opens the build phase
([[../90-Meta/collaboration-and-decision-protocol]]).

## Quality goals

- **Determinism & reproducibility** — the match engine and numeric surface are
  reproducible across runtimes
  ([[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]);
  builds pin exact versions (no floating `latest`)
  ([[09-Decisions/ADR-0021-revised-tech-stack]]).
- **Offline-first availability** — the client stays usable without connectivity;
  runtime staging toward full offline-first singleplayer is governed by
  [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]].
- **IP cleanliness** — no real clubs, people, or sponsors; every generated name
  passes the IP-safe naming gate
  ([[09-Decisions/ADR-0007-naming-schema]]).
- **Modular evolvability** — a service-ready modular monolith whose contexts can
  be split out without a refactor
  ([[09-Decisions/ADR-0019-modular-monolith-ddd]]).

## Stakeholders

- **Lead Architect / Project lead (Nico)** — owns architecture, scope, gameplay
  and technology decisions; the ask-first decision gate routes through this role.
- **Coding agents (Claude, Codex, Cursor)** — produce research, ADR drafts and,
  once the build phase opens, implementation under the collaboration protocol.
- **Player** — the single primary external actor in the MVP (see [[03-Context]]).

## Related

- [[../00-Index/Vision]] — goals this realizes · [[../00-Index/MVP-Scope]] — MVP scope · [[../00-Index/Non-Goals]]
- [[02-Constraints]] · [[03-Context]] · [[04-Solution-Strategy]] — arc42 siblings
- [[bounded-context-map]] — canonical 28-context catalog · [[../00-Index/Home]] — vault hub
