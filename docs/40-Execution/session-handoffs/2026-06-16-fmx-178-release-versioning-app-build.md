---
title: FMX-178 Release Versioning and App Build Handoff
status: wrapped
tags: [execution, handoff, fmx-178, release, versioning, app-build, dokploy, pwa, telemetry]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
related:
  - [[../../60-Research/release-versioning-process-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../../30-Implementation/release-versioning-app-build-process]]
  - [[../fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# Handoff: FMX-178 Release Versioning and App Build (2026-06-16)

## Goals

- Define the missing release/versioning and app-build identity proposal.
- Preserve Perplexity-first research plus source checks.
- Keep all architecture decisions pending Nico approval.

## Completed

- Claimed FMX-178 in Linear by moving it to `In Progress`.
- Created clean branch `codex/fmx-178-release-versioning-app-build` from
  current `origin/main`.
- Refreshed Perplexity discovery for SemVer, release manifests, immutable OCI
  digests, Dokploy promotion/rollback, PWA update UX, telemetry release fields,
  save/content compatibility and comparable game patterns.
- Source-checked primary docs for SemVer, Docker digests, GitHub artifact
  attestations, SLSA provenance, Dokploy rollbacks, Workbox service-worker
  lifecycle, Sentry-compatible releases and Football Manager update behavior.
- Added draft ADR-0132 and draft release runbook.
- Added FMX-178 decision queue with D1-D7 recommendations.
- Updated front doors and adjacent deployment/telemetry/roadmap notes with
  non-binding references.

## Open Tasks

- Nico decision needed for D1-D7 in
  [[../fmx-178-release-versioning-app-build-decision-queue-2026-06-16]].
- If accepted, promote ADR-0132 to accepted/binding and promote the runbook to
  current implementation guidance.
- Future code phase must implement manifest generation, source-map identity,
  SBOM/provenance evidence, Dokploy registry rollback checks and compatibility
  fixtures.

## Decisions Made

- No binding architecture decision was made by the agent.
- Recommendation is D1-D7 = A: SemVer technical version plus player label,
  generated `release.json`, build-once/promote-digest, prompt-to-refresh PWA UX,
  four-layer compatibility matrix, SBOM plus provenance and named release
  captain before beta.

## Blockers

- FMX-178 remains decision-pending until Nico approves or changes D1-D7.

## Durable Notes Updated

- `.cursor/plans/fmx-178-release-versioning-app-build.md`
- `docs/60-Research/release-versioning-process-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16.md`
- `docs/60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16.md`
- `docs/10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process.md`
- `docs/30-Implementation/release-versioning-app-build-process.md`
- `docs/40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16.md`
- `docs/30-Implementation/client-telemetry.md`
- `docs/30-Implementation/deployment-dokploy.md`
- `docs/30-Implementation/mvp-implementation-roadmap.md`

## Promotion Needed

- After Nico approval, convert draft references from "proposal only" to active
  release requirements and update Linear/PR status accordingly.
