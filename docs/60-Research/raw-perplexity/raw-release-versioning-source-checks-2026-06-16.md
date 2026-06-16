---
title: Raw Release Versioning Source Checks
status: raw
tags: [research, raw, source-check, release, versioning, app-build, dokploy, workbox, pwa, telemetry, semver, provenance, sbom, fmx-178]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-178
related:
  - [[../release-versioning-process-2026-06-16]]
  - [[raw-release-versioning-app-build-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# Raw Release Versioning Source Checks

## Primary Technical Sources

### Semantic Versioning

Source: [Semantic Versioning 2.0.0](https://semver.org/)

Verified facts:

- SemVer uses `MAJOR.MINOR.PATCH`.
- MAJOR communicates incompatible changes, MINOR backward-compatible additions
  and PATCH backward-compatible fixes.
- Pre-release and build metadata are supported extensions.
- Released version contents must not be modified; changes require a new version.
- Major version zero (`0.y.z`) is explicitly initial development; the FAQ
  suggests starting at `0.1.0`.
- `v1.2.3` is a common git tag spelling; the SemVer value is `1.2.3`.

FMX implication:

- Use `0.MINOR.PATCH` before the first stable public compatibility contract.
- Use git tags like `v0.1.0` while storing the canonical app version as
  `0.1.0`.
- Do not mutate released manifests or images for a published version.

### Docker image digests

Source: [Docker docs - Image digests](https://docs.docker.com/dhi/core-concepts/digests/)

Verified facts:

- A Docker image digest is a SHA-256 content identifier.
- Tags can be reused or changed; a digest is immutable.
- Pulling by digest retrieves the exact image tied to that digest.
- Digests improve consistency across environments and reduce tampering risk.

FMX implication:

- `:latest` is not a deploy target.
- A release record must carry the digest used for dev, staging and prod.
- Rollback should select a previous digest/release record, not rebuild an older
  mutable tag.

### GitHub artifact attestations and SBOM

Source:
[GitHub Docs - Using artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)

Verified facts:

- GitHub's attestation action can bind an attestation to an image subject name
  and `sha256` subject digest.
- For container images, `subject-name` should be the fully qualified image name
  without a tag.
- SBOM attestations use `sbom-path` and can be pushed to the registry.

FMX implication:

- If GitHub Actions remains the build platform, production release evidence can
  attach provenance and SBOM to the OCI digest.
- The release manifest should store `provenanceRef` and `sbomRef` as references,
  not copy sensitive build logs into the client.

### SLSA provenance

Source: [SLSA v1.0 provenance](https://slsa.dev/spec/v1.0/provenance)

Verified facts:

- SLSA provenance includes a `buildDefinition` and `runDetails`.
- `buildDefinition` records build type, parameters and
  `resolvedDependencies`.
- Source refs can be represented with URI plus digest, for example a git ref
  plus `gitCommit` digest.

FMX implication:

- The release packet should require build provenance at the release-artifact
  boundary, not merely a handwritten version string.
- Release evidence should capture source revision and build system identity.

### Dokploy rollback behavior

Source: [Dokploy docs - Rollbacks](https://docs.dokploy.com/docs/core/applications/rollbacks)

Verified facts:

- Dokploy documents Docker Swarm automatic rollback for failed health checks.
- Dokploy also supports registry-based rollbacks at deployment level.
- Registry rollback saves deployment images to a configured registry, associates
  deployment records with image tags and can roll back to previous deployments.
- Registry rollback requires a configured registry and registry credentials.

FMX implication:

- FMX should configure registry-backed rollback before beta.
- Health-check rollback and explicit rollback-to-known-good are separate
  mechanisms.
- The runbook should record both Dokploy deployment identity and the underlying
  OCI digest/manifest.

### Workbox service-worker update lifecycle

Source:
[Chrome Developers - workbox-window](https://developer.chrome.com/docs/workbox/modules/workbox-window/)

Verified facts:

- A newly installed service worker can remain in the `waiting` phase.
- Without `skipWaiting()`, the updated worker does not activate until currently
  controlled pages unload.
- The docs explicitly suggest informing users that an update is available.
- `messageSkipWaiting()` can tell a waiting worker to skip the waiting phase.

FMX implication:

- For ordinary releases, prompt-to-refresh is safer than forced activation
  during active gameplay.
- Forced update paths should be reserved and explicit: security, data-loss,
  incompatible save/schema or unsupported old client.

### Sentry-compatible release fields

Source:
[Sentry JavaScript docs - Releases and Health](https://docs.sentry.io/platforms/javascript/configuration/releases/)

Verified facts:

- A release is a version of code deployed to an environment.
- Setting a release lets Sentry identify regressions, commits and deploy events.
- Releases are used for source-map application.
- JavaScript SDK initialization accepts a `release` value.
- Sessions link to releases for release health.

FMX implication:

- ADR-0017's generic release/build id should become a concrete
  `releaseVersion` + `buildId`/`dist` mapping after ADR-0132 is accepted.
- Source map upload must use the same release/dist identity emitted by the app
  and service worker.

## Comparable Game/Product Sources

### Football Manager data/update behavior

Source:
[Football Manager 2024 Main Data Update Out Now](https://www.footballmanager.com/news/football-manager-2024-main-data-update-out-now)

Verified facts:

- The Football Manager 2024 main data update was announced as live across all
  platforms.
- It included a large roster/player data refresh plus fixes and improvements.
- Gameplay adjustments applied to current careers, but data changes required a
  new save game.
- Downloads were expected to be automatic for most players.

FMX implication:

- Sports-management games need a split between app/gameplay fixes that affect
  existing careers and database/content updates that may require a new save.
- FMX should declare per-release whether the app update, content pack and save
  schema apply to existing saves or require a new run/career.

### Google Play artifact/release precedent

Source:
[Google Play Console Help - Create and set up your app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)

Verified facts:

- Play Console distinguishes release states such as draft, active and archived.
- App bundle explorer provides version filtering and artifact inspection.

FMX implication:

- Even if the MVP is PWA/Dokploy first, future mobile wrapper releases need
  durable artifact identity, version state and artifact inspection.
- The web release manifest should avoid assumptions that break later store
  wrapper promotion.

## Context7/Docs Cross-Checks

Context7 was used as an additional docs-discovery pass for Dokploy, Workbox and
Sentry-compatible release fields. It confirmed the same topics used above:

- Dokploy registry rollback and saved deployment images.
- Workbox `waiting` event and `messageSkipWaiting()` update path.
- Sentry SDK `release`/distribution-style build identity and source-map
  matching requirements.

The canonical citations for this packet remain the primary URLs above.
