---
title: Release Versioning and App Build Process
status: draft
tags: [implementation, release, versioning, app-build, dokploy, pwa, telemetry, provenance, sbom, fmx-178]
created: 2026-06-16
updated: 2026-06-16
type: implementation
binding: false
linear: FMX-178
related:
  - [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../60-Research/release-versioning-process-2026-06-16]]
  - [[deployment-dokploy]]
  - [[client-telemetry]]
  - [[mvp-implementation-roadmap]]
  - [[../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# Release Versioning and App Build Process

This is the draft operational runbook for FMX-178. It becomes active only if
Nico accepts
[[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]].

## Purpose

Define the future code-phase release path for app versioning, artifact identity,
Dokploy promotion, rollback, PWA update UX, telemetry release fields and
save/content compatibility.

## Release Owner

Each release has one named release captain.

The captain owns:

- release candidate selection;
- version bump and player-facing release label;
- `release.json` inspection;
- Dokploy dev/staging/prod promotion;
- rollback target selection;
- source-map and telemetry release identity check;
- release evidence retention;
- post-release note and Linear/GitHub status.

Before public beta, the captain must dry-run the checklist against dev/staging
and prove rollback to a prior digest.

## Release Identity

Future build tooling emits `release.json` and injects the safe subset into the
browser/server runtime.

Minimum logical fields:

| Field | Required | Notes |
|---|---:|---|
| `releaseVersion` | Yes | Canonical SemVer, for example `0.1.0-beta.1`. |
| `playerReleaseLabel` | Yes | Player-facing label for UI/support. |
| `buildId` | Yes | Unique build identifier used by telemetry/source maps. |
| `gitSha` | Yes | Full source commit. |
| `sourceRef` | Yes | Tag/ref used for the build. |
| `releaseChannel` | Yes | `dev`, `alpha`, `beta`, `rc`, `prod`. |
| `builtAt` | Yes | UTC timestamp. |
| `imageDigest` | Prod yes | Immutable OCI digest. |
| `sbomRef` | Prod yes | SBOM evidence reference. |
| `provenanceRef` | Prod yes | Build provenance/attestation reference. |
| `contentVersion` | Yes | Active content/data pack version. |
| `saveSchemaVersion` | Yes | Current save schema/envelope version. |
| `minSupportedSaveSchemaVersion` | Yes | Oldest save schema supported by this build. |
| `minSupportedClientVersion` | Server yes | Oldest app client supported by server/API. |
| `rollbackPredecessor` | Prod yes | Previous known-good release/build. |

## Version Rules

- Start future app releases at `0.1.0` unless Nico chooses a different baseline.
- Use pre-release identifiers for alpha/beta/rc.
- Use git tags like `v0.1.0-beta.1`; store the SemVer value without `v` in the
  manifest.
- Do not mutate a released manifest or image. Fixes are new versions/builds.
- Player-facing labels can be season/beta names, but must map to exactly one
  release manifest.

## Build Flow

1. Confirm the release candidate commit is green for required checks.
2. Confirm the decision/runbook status is accepted before code-phase activation.
3. Generate `release.json`.
4. Build the OCI image once.
5. Publish the image to the configured registry.
6. Capture the immutable digest.
7. Generate and attach SBOM/provenance evidence to the digest.
8. Upload source maps using the same `releaseVersion`/`buildId`.
9. Store release evidence in the release log.

## Promotion Flow

1. Deploy the candidate digest to dev.
2. Verify `/healthz`.
3. Verify app UI reports the expected release/build identity.
4. Verify GlitchTip/source-map release mapping in a safe test event.
5. Verify service-worker update behavior from previous dev release.
6. Verify save/content compatibility fixtures.
7. Promote the same digest to staging if staging exists.
8. Promote the same digest to production after captain approval.

No environment rebuild is allowed for the same release.

## Rollback Flow

1. Identify the previous known-good release manifest.
2. Confirm the prior image digest is still present in the registry.
3. Confirm the rollback release supports the current save/content state or mark
   rollback unsafe and escalate.
4. Use Dokploy registry rollback or direct digest deploy to restore the previous
   deployment.
5. Verify `/healthz`, telemetry release identity and service-worker state.
6. Record rollback reason, target release and follow-up Linear issue.

## PWA Update UX

Default:

- A new service worker may wait.
- The app shows update-available copy at a safe point.
- Active match, save write, migration and offline outbox flows keep the current
  runtime until reload is safe.

Critical override:

- Forced update requires a manifest flag and release note.
- It is allowed only for security, data-loss, unsupported old-client or
  incompatible save/content state.
- It must not silently discard unsent commands or save writes.

## Save and Content Compatibility

Every release note records:

| Question | Answer required |
|---|---|
| Existing saves open unchanged? | yes/no |
| Save migration runs? | yes/no plus migration id |
| Existing career sees new content? | yes/no/partial |
| New save required for content/database changes? | yes/no |
| Old client remains supported? | min supported version |
| Rollback safe after migration? | yes/no/manual recovery |

Football Manager precedent shows why this matters: gameplay fixes can apply to
current careers while data updates may require a new save. FMX must make that
split explicit per release.

## Beta Prerequisite

Before public beta:

- ADR-0132 is accepted or superseded.
- This runbook is promoted from draft to current/binding implementation note.
- Dokploy registry rollback is configured and tested.
- One release candidate is promoted dev -> staging/prod-equivalent by digest.
- One rollback is tested from the registry.
- Source maps resolve against `releaseVersion`/`buildId`.
- Telemetry includes the approved release identity fields.
- Save/content compatibility fixtures exist for at least current and previous
  release manifests.

## Related

- [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
- [[../60-Research/release-versioning-process-2026-06-16]]
- [[deployment-dokploy]]
- [[client-telemetry]]
- [[mvp-implementation-roadmap]]
