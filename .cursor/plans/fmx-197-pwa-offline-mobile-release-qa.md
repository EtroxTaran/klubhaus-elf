---
title: FMX-197 PWA Offline Mobile Release Content QA Plan
status: current
tags: [plan, fmx-197, pwa, offline, mobile, rollback, content-qa, quality]
created: 2026-06-15
updated: 2026-06-15
type: plan
binding: false
linear: FMX-197
related:
  - [[../../docs/60-Research/pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[../../docs/40-Quality/pwa-offline-mobile-release-content-qa-gates]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[../../docs/40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
---

# FMX-197 PWA Offline Mobile Release Content QA Plan

## Goal

Define a sourced, decision-gated QA packet for the PWA storage/offline/mobile
degradation matrix, release rollback gates and content-validation gates split
out of ADR-0118.

## Scope

- Preserve Perplexity-first research plus source checks.
- Anchor the proposal on ADR-0020, ADR-0090, ADR-0104 and ADR-0118.
- Keep MVP authoritative game progression online/server-confirmed.
- Prepare Nico decisions; do not self-ratify.

## Execution

1. Sync `main`; claim FMX-197; create
   `codex/fmx-197-pwa-offline-mobile-release-qa`.
2. Run Perplexity-first research and source-check weak claims against primary
   or high-signal sources.
3. Save raw captures under `docs/60-Research/raw-perplexity/`.
4. Write synthesis, draft ADR-0124, draft quality runbook and HITL decision
   queue.
5. Update Decision-Log, Current-State, Research Map, research summary, raw
   index, test strategy and session handoff index.
6. Validate with `node scripts/docs-check.mjs`, status consistency and
   `git diff --check`.

## Acceptance

- `FMX-197` remains non-binding until Nico approves the decision packet.
- The hybrid-online MVP posture remains intact: local drafts and confirmed
  read caches are offline; authoritative progression is not.
- Content QA is treated as release evidence, not a runtime LLM permission.
