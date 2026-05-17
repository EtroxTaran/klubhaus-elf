---
title: Current State
status: current
tags: [meta, execution, hot]
created: 2026-05-17
updated: 2026-05-17
type: index
binding: true
related: [[Agent-Onboarding]]
---

# Current State

Hot-memory snapshot. Update this in the same PR as any change to architecture,
scope, operations, or status. Keep it short; move durable detail into ADRs,
specs, or architecture notes.

## Now building

- Phase 1 research synthesis: feature-gap MoSCoW scope (AKOM-115, currently a
  stub) and the Phase 1 consolidation rewrite (AKOM-116).
- Memory-system hardening: vault entry chain, governance, and agent-config
  alignment so every agent uses memory identically.

## Stable

- Repo scaffold: pnpm workspaces, Biome, TypeScript strict, Vitest/Playwright
  gates, Cursor rules/hooks/BUGBOT, Docker/Dokploy, CI (`cursor-smoke`).
- Bootstrap landing shell in `apps/web` (no client hydration by design for
  Lighthouse budgets).
- Research Wave 1 (M1.1) complete — 5 research notes in `60-Research/`.
- Accepted ADRs: 0001 tech-stack, 0002 offline-first, 0005 save-format,
  0007 naming-schema, 0009 cursor-orchestration.

## Blocked

- ADR-0003 (match-engine), ADR-0004 (data-model), ADR-0006 (i18n),
  ADR-0008 (mobile-first-ui) remain `draft` — blocked on Research Wave 2
  ([[../60-Research/research-wave-2-gaps]]). Do not implement from them.
- M2–M8 seed epics (AKOM-129..135) blocked until the four draft ADRs settle.

## Open questions

- Wave 2 research scope/sequencing (see research-wave-2-gaps).
- `db:migrate` is still a placeholder; real migration runner not yet chosen.

## Last handoff

None yet. See [[../40-Execution/session-handoffs/README]].
