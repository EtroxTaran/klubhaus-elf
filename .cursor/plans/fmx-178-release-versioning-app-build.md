---
title: FMX-178 Release Versioning and App Build Plan
status: current
tags: [plan, fmx-178, release, versioning, app-build, dokploy, pwa, telemetry]
created: 2026-06-16
updated: 2026-06-16
type: plan
binding: false
related:
  - [[../../docs/60-Research/release-versioning-process-2026-06-16]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../../docs/30-Implementation/release-versioning-app-build-process]]
  - [[../../docs/40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# FMX-178 Release Versioning and App Build Plan

## Goal

Create a source-grounded, decision-pending release/versioning packet for the
future app build: technical version scheme, release/build identity, Dokploy
promotion and rollback, PWA update UX, telemetry release fields and save/content
compatibility.

## Steps

1. Claim FMX-178 in Linear and work from a clean
   `codex/fmx-178-release-versioning-app-build` branch.
2. Refresh Perplexity discovery and source-check with primary docs for SemVer,
   OCI image digests, GitHub artifact attestations, SLSA provenance, Dokploy
   rollback, Workbox service-worker update UX, Sentry-compatible release fields
   and comparable football-game update practices.
3. Preserve raw research, source checks and synthesis in `docs/60-Research`.
4. Draft ADR-0132 as non-binding until Nico approves the decision queue.
5. Add a draft implementation runbook and wire references from telemetry,
   deployment, roadmap and front-door indexes.
6. Validate the vault, open a draft PR and keep FMX-178 `In Progress` while
   decisions remain pending.

## HITL Decisions Pending

Nico still needs to approve or alter D1-D7 in
[[../../docs/40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]:

- D1 technical version scheme.
- D2 release identity manifest fields.
- D3 immutable Dokploy promotion and rollback.
- D4 PWA/service-worker update UX.
- D5 save/content compatibility policy.
- D6 SBOM/provenance evidence level.
- D7 release-runbook ownership and beta gate.
