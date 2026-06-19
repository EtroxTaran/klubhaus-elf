---
title: ADR-0132 Release Versioning and App Build Process
status: accepted
tags: [adr, architecture, release, versioning, app-build, dokploy, pwa, telemetry, provenance, sbom, fmx-178, draft, accepted]
created: 2026-06-16
updated: 2026-06-19
type: adr
binding: true
linear: FMX-178
amends:
  - [[ADR-0017-observability-logging]]
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
related:
  - [[../../60-Research/release-versioning-process-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
  - [[../../30-Implementation/release-versioning-app-build-process]]
  - [[../../30-Implementation/deployment-dokploy]]
  - [[../../30-Implementation/client-telemetry]]
  - [[../../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# ADR-0132: Release Versioning and App Build Process

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> **Proposal only (FMX-178).** This ADR defines the recommended release
> versioning and app-build identity contract after Perplexity-first research and
> source checks. It does not activate release tooling, deployment changes,
> version scripts, CI publication or PWA update behavior until Nico approves
> D1-D7 in
> [[../../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]].

## Date

- Drafted: 2026-06-16
- Binding status: accepted by Nico 2026-06-19

## Context

FMX has accepted and draft docs that already assume a `release/build id`:

- ADR-0017 allows release/build id in crash/error diagnostics and ties source
  maps to release/build identity.
- [[../../30-Implementation/client-telemetry]] allows release/build id but does
  not define the exact fields.
- [[../../30-Implementation/deployment-dokploy]] documents Dokploy as the
  chosen deployment platform and explicitly calls out stale `:latest` image
  risk.
- ADR-0124 proposes PWA/offline/mobile release and content-QA gates, but it is
  still draft.
- ADR-0005 and ADR-0098 keep save/export/content references versioned, but no
  app release train ties app, content and save compatibility together.

FMX-178 supplies the missing release identity contract so future code can build,
deploy, support and roll back the app without relying on mutable branch names,
human memory or ambiguous "current production" shorthand.

## Decision Drivers

- A football-manager PWA has long-running saves; every release must say whether
  existing saves and content packs remain compatible.
- Offline-capable sessions and service-worker updates must avoid surprising a
  player during active gameplay.
- Crash triage and source-map lookup need stable release/build identity.
- Dokploy deployment must avoid mutable `latest`/branch tag ambiguity.
- Beta must be able to roll back to a known-good image and manifest.
- Supply-chain evidence must be attached to the artifact actually deployed.

## Options Considered

### D1 - technical version scheme

| Option | Meaning | Assessment |
|---|---|---|
| **A. SemVer technical version plus player label** | Canonical app version is SemVer; UI/notes can use season/beta labels. | **Recommended.** Best signal for compatibility while preserving product-friendly language. |
| B. Calendar version | Date-based version is the main app identity. | Useful cadence signal but weak breaking/non-breaking meaning. |
| C. Human label plus opaque build id | Player label is the only visible version; build id is hidden. | Too weak for support and compatibility. |

### D2 - release identity manifest

| Option | Meaning | Assessment |
|---|---|---|
| **A. Generated `release.json` manifest** | Build emits a manifest with version, build, commit, digest, channel, content/save versions and evidence refs. | **Recommended.** One inspectable release fact for app, support, telemetry and rollback. |
| B. Runtime env vars only | Inject version fields into app/server env. | Useful but incomplete after rollback or artifact export. |
| C. `package.json#version` only | Use package version as the only identity. | Too weak for Docker, PWA cache, source maps and content compatibility. |

### D3 - promotion and rollback

| Option | Meaning | Assessment |
|---|---|---|
| **A. Build once, promote digest** | One OCI image digest is verified and promoted through dev/staging/prod; rollback redeploys a prior digest. | **Recommended.** Avoids artifact drift and matches source-checked Docker/Dokploy behavior. |
| B. Rebuild per environment | Each environment builds from the same git ref. | Easier branch wiring, but the artifact is not the exact tested one. |
| C. Deploy mutable tags | Deploy `latest`, branch names or moving aliases as truth. | Rejected; mutable tags are incompatible with reliable rollback/support. |

### D4 - PWA/service-worker update UX

| Option | Meaning | Assessment |
|---|---|---|
| **A. Prompt-to-refresh at safe points** | Waiting worker prompts; current active session keeps old code until safe reload. | **Recommended.** Best fit for offline-capable gameplay. |
| B. Always skip waiting | New worker activates immediately. | Useful for critical fixes but risky as default. |
| C. Silent next-visit only | Never show update prompt. | Too opaque for support, security and incompatible-version cases. |

### D5 - save/content compatibility

| Option | Meaning | Assessment |
|---|---|---|
| **A. Four-layer compatibility matrix** | Track app release, API/contract version, save schema version and content pack version separately. | **Recommended.** Fits long saves, content updates and future mobile wrappers. |
| B. App-major-only compatibility | Only app major versions define compatibility. | Too coarse for saves/content. |
| C. Force new save for content changes | Any content update starts a new save. | Simple but hostile to careers. |

### D6 - release evidence

| Option | Meaning | Assessment |
|---|---|---|
| **A. SBOM plus provenance/attestation per production digest** | Production image digest has SBOM and build provenance references. | **Recommended.** Strong beta/support/security floor. |
| B. SBOM only | Keep dependency inventory without source-to-image proof. | Better than nothing but incomplete. |
| C. Defer evidence | Add evidence after beta. | Rejected for release reliability. |

### D7 - runbook ownership and beta gate

| Option | Meaning | Assessment |
|---|---|---|
| **A. Named release owner plus dry-run before beta** | Each release has a captain; release/rollback/source-map/evidence checklist is dry-run before public beta. | **Recommended.** Prevents deployment memory from becoming the release process. |
| B. Tool-owner only | Dokploy/GitHub owner handles release informally. | Too person-dependent. |
| C. No explicit runbook until launch | Document later. | Rejected; beta needs this first. |

## Proposed Decision

Accepted by Nico 2026-06-19 approval:

- **D1 = A:** SemVer is the canonical technical app version. Git tags may use
  `vX.Y.Z`; the manifest stores `X.Y.Z`. Before stable public compatibility,
  start at `0.1.0` and use pre-release labels for alpha/beta/rc.
- **D2 = A:** every future app build emits a `release.json` manifest.
- **D3 = A:** build once and promote the same immutable OCI digest through
  environments; never deploy `:latest` as release truth.
- **D4 = A:** ordinary PWA releases use prompt-to-refresh at safe points;
  skip-waiting/forced reload is reserved for critical incompatibility/security
  cases and must be visible in the release manifest.
- **D5 = A:** each release declares app/API/save/content compatibility.
- **D6 = A:** production images require SBOM plus provenance/attestation
  references attached to the deployed digest.
- **D7 = A:** a named release captain owns the runbook for each release; the
  runbook and rollback path must be dry-run before public beta.

## Proposed Release Identity

Future build tooling should generate a manifest with this logical shape:

| Field | Meaning |
|---|---|
| `releaseVersion` | Canonical SemVer app version, for example `0.1.0-beta.1`. |
| `playerReleaseLabel` | Friendly label for UI/release notes, for example `Closed Beta 1`. |
| `buildId` | Unique build identity, for example `0.1.0-beta.1+202606161845.289b119.1234`. |
| `gitSha` | Full source commit. |
| `sourceRef` | Tag or ref used for the build. |
| `releaseChannel` | `dev`, `alpha`, `beta`, `rc`, `prod` or later accepted channel. |
| `builtAt` | UTC build timestamp. |
| `image` / `imageDigest` | Fully qualified image plus immutable digest. |
| `sbomRef` | SBOM attestation/artifact reference. |
| `provenanceRef` | Build provenance/attestation reference. |
| `contentVersion` | Active content/database pack version. |
| `saveSchemaVersion` | Current save schema/envelope compatibility version. |
| `minSupportedSaveSchemaVersion` | Oldest save schema this build can open/migrate. |
| `minSupportedClientVersion` | Oldest client still supported by server/API. |
| `rollbackPredecessor` | Previous known-good release/build target. |

The browser may expose only the subset needed for support and telemetry:
`releaseVersion`, `playerReleaseLabel`, `buildId`, `releaseChannel`,
`contentVersion` and `saveSchemaVersion`. Server-only or supply-chain evidence
details can stay operational.

## Proposed Build and Promotion Flow

1. Release captain creates/approves a release candidate from a clean green commit
   or release tag.
2. CI builds the app image once, emits `release.json`, uploads source maps with
   the same release/build identity and produces SBOM/provenance evidence.
3. The resulting OCI digest is deployed to dev or staging.
4. Release smoke validates `/healthz`, service-worker update behavior,
   source-map matching, telemetry release fields, save compatibility and
   rollback target.
5. Production promotion uses the same digest and manifest.
6. Rollback redeploys the prior known-good digest/manifest and records the
   rollback in the release log.

## Proposed PWA Update Rule

The service worker may install and wait. The app informs the player that a new
version is available and applies it at a safe refresh point. Active match,
save-write, migration or offline-outbox flows must not be interrupted by a
routine update.

Forced update is a separate release flag reserved for:

- security fixes;
- data-loss fixes;
- unsupported old client/server contract;
- save/content migration requiring an app restart.

Any forced update requires release notes and compatibility wording in the
release manifest.

## Proposed Save and Content Compatibility Rule

Each release declares:

- whether existing saves open unchanged;
- whether a save migration runs;
- whether the release can read old save schemas;
- whether old app versions can keep using the server;
- whether a content/database pack change applies to existing saves or requires a
  new run/career.

Default planning policy:

- PATCH releases must preserve save compatibility.
- MINOR releases may add compatible content/features and migrations.
- MAJOR releases may break compatibility, but require explicit migration/new-save
  communication and rollback analysis.
- Pre-1.0 releases use the same discipline even though SemVer allows faster
  change.

## Consequences

Positive:

- Crash reports, source maps, support tickets and Dokploy deployments all refer
  to the same release identity.
- Beta can roll forward or back by manifest/digest rather than memory.
- Service-worker update UX protects active offline-capable play.
- Save/content compatibility becomes a first-class release fact, not a hidden
  implementation assumption.

Negative / constraints:

- Future code phase must add manifest generation, CI evidence, source-map
  upload identity, Dokploy registry rollback configuration and compatibility
  tests.
- Release captain ownership must be assigned before beta.
- Strong provenance/SBOM evidence adds workflow complexity, but it pays for
  itself during support and incident response.

## Boundaries

- This ADR does not implement release tooling in the docs-only repository.
- This ADR does not choose a paid CI/CD vendor beyond current GitHub/Dokploy
  assumptions.
- This ADR does not supersede ADR-0124; PWA/offline release QA remains its own
  broader draft gate.
- This ADR does not change ADR-0017 retention or telemetry consent rules; it
  only proposes the concrete release identity fields that telemetry may carry.

## Related Docs

- [[../../60-Research/release-versioning-process-2026-06-16]]
- [[../../60-Research/raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
- [[../../60-Research/raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
- [[../../30-Implementation/release-versioning-app-build-process]]
- [[../../30-Implementation/deployment-dokploy]]
- [[../../30-Implementation/client-telemetry]]
- [[../../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
