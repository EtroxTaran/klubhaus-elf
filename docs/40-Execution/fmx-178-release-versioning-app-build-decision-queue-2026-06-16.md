---
title: FMX-178 Release Versioning and App Build Decision Queue
status: current
tags: [execution, decision-queue, release, versioning, app-build, dokploy, pwa, telemetry, provenance, save-compatibility, fmx-178]
created: 2026-06-16
updated: 2026-06-16
type: decision-queue
binding: false
linear: FMX-178
related:
  - [[../60-Research/release-versioning-process-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../30-Implementation/release-versioning-app-build-process]]
---

# FMX-178 Release Versioning and App Build Decision Queue

This queue captures the decisions Nico needs to approve before ADR-0132 can
become binding.

## Decision Summary

Recommended packet: accept **A for D1-D7**.

| Decision | Recommendation | Why |
|---|---|---|
| D1 - version scheme | A. SemVer technical version plus player label | Best compatibility signal while preserving season/beta copy. |
| D2 - release identity | A. Generated `release.json` manifest | One inspectable release fact for app, support, telemetry and rollback. |
| D3 - promotion/rollback | A. Build once, promote digest | Prevents artifact drift and avoids mutable-tag ambiguity. |
| D4 - PWA update UX | A. Prompt-to-refresh at safe points | Protects active offline-capable gameplay. |
| D5 - compatibility | A. Four-layer compatibility matrix | Separates app, API/contract, save schema and content pack changes. |
| D6 - evidence | A. SBOM plus provenance/attestation | Strong beta/support/security floor. |
| D7 - ownership | A. Release captain plus beta dry-run | Makes release reliability explicit before players see beta. |

## D1 - Technical version scheme

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | SemVer is the canonical technical app version; player-facing labels are aliases in UI/release notes. | **Yes** | Pending |
| B | Calendar version is the primary technical version. | No | Pending |
| C | Player label plus opaque build ID only. | No | Pending |

Best practice basis: SemVer communicates breaking/additive/patch meaning and
allows pre-release/build metadata. Calendar or season labels are useful product
copy but weak as save/API compatibility signals.

## D2 - Release identity manifest

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Generate `release.json` with release version, player label, build ID, commit, channel, digest, content/save versions, SBOM/provenance refs and rollback predecessor. | **Yes** | Pending |
| B | Use runtime environment variables only. | No | Pending |
| C | Use `package.json#version` only. | No | Pending |

Best practice basis: support, telemetry, source maps, PWA caches and rollback all
need one release fact that survives deployment history.

## D3 - Dokploy promotion and rollback

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Build one OCI image, promote the same digest through dev/staging/prod and roll back to a prior digest/manifest. | **Yes** | Pending |
| B | Rebuild separately per environment from the same git ref. | No | Pending |
| C | Deploy mutable tags such as `latest`, `main` or branch names as release truth. | No | Pending |

Best practice basis: Docker digests are immutable, tags can move, and Dokploy's
registry rollback depends on durable registry images. This also resolves the
stale `:latest` risk already documented in the Dokploy note.

## D4 - PWA/service-worker update UX

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Default prompt-to-refresh at safe points; no forced activation during active gameplay/session-critical flows. | **Yes** | Pending |
| B | Always call skip-waiting and activate immediately. | No | Pending |
| C | Never prompt; apply only on next full visit. | No | Pending |

Best practice basis: Workbox documents a waiting service worker and user update
notification path. FMX's long-running/offline sessions make forced activation
too risky as the default.

## D5 - Save/content compatibility policy

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Track app release, API/contract version, save schema version and content pack version separately; declare compatibility per release. | **Yes** | Pending |
| B | Let only app major versions define compatibility. | No | Pending |
| C | Require a new save for every content/data change. | No | Pending |

Best practice/game basis: Football Manager shows the needed distinction:
gameplay fixes can apply to current careers, while data changes may require a
new save. FMX should decide that explicitly per release instead of hiding it in
patch notes.

## D6 - Release evidence level

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Every production digest has SBOM plus provenance/attestation references. | **Yes** | Pending |
| B | SBOM only. | No | Pending |
| C | Defer evidence until after beta. | No | Pending |

Best practice basis: GitHub artifact attestations and SLSA-style provenance
give source-to-image traceability. Beta support and rollback need this before
live players depend on releases.

## D7 - Release runbook ownership and beta prerequisite

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Each release has a named release captain; runbook, promotion and rollback are dry-run before public beta. | **Yes** | Pending |
| B | Dokploy/GitHub tool owner handles release informally. | No | Pending |
| C | No explicit runbook until launch. | No | Pending |

Best practice basis: release reliability is operational ownership, not just a
tool setting. The beta gate should prove promotion, rollback, source maps,
telemetry release fields and compatibility fixtures before public players see
the app.

## If Accepted

Promote these docs in the same follow-up PR:

- [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  to `accepted` / `binding: true`.
- [[../30-Implementation/release-versioning-app-build-process]] to current
  implementation guidance.
- [[../30-Implementation/deployment-dokploy]],
  [[../30-Implementation/client-telemetry]] and
  [[../30-Implementation/mvp-implementation-roadmap]] from draft references to
  active requirements.

## Source Basis

- [[../60-Research/release-versioning-process-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
- [[../60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
