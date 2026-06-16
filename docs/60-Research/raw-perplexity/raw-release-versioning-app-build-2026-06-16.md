---
title: Raw Release Versioning and App Build Research
status: raw
tags: [research, raw, perplexity, release, versioning, app-build, dokploy, pwa, telemetry, save-compatibility, fmx-178]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-178
related:
  - [[../release-versioning-process-2026-06-16]]
  - [[raw-release-versioning-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# Raw Release Versioning and App Build Research

## Prompt

Research best practices for a docs-only architecture decision packet about app
release versioning and app build/release identity for an offline-capable PWA
football-manager game deployed via Docker/Dokploy.

Requested coverage:

- SemVer vs calendar/version labels.
- `release.json` / build metadata.
- OCI image immutable tags/digests.
- SBOM/provenance/SLSA or GitHub artifact attestation.
- Dokploy promotion dev -> prod and rollback.
- Workbox/service-worker update UX.
- Telemetry/crash release and build fields.
- Save/content compatibility and migrations.
- Comparable game/live-service release labeling practices.
- 2-3 decision options with recommendation and sources.

## Perplexity Discovery Capture

Perplexity recommended a two-identifier model: a human-facing app/release
version and a machine-facing build/release identity. Its primary recommendation
was SemVer for technical compatibility plus immutable build metadata and OCI
digests for deployment traceability.

### Recommendation

Use SemVer plus build metadata and immutable deploy artifacts as the default.
SemVer communicates compatibility better than pure calendar labels when save
schemas, content packs, client/server contracts and migration behavior matter.
Calendar/date labels are useful for fixed cadence products but weaker as a
compatibility signal. Marketing labels such as seasons or named updates work
best as player-facing aliases, not as the only technical version.

### Options returned

| Option | Version label | Best fit | Risk | Perplexity recommendation |
|---|---|---|---|---|
| A. SemVer plus build metadata | `1.8.0+build.20260616.1234` or `1.8.0` plus separate build SHA | Save compatibility, feature gating, release notes and support windows | Requires discipline to separate user version from build ID | Best default |
| B. CalVer plus build metadata | `2026.06.16+sha` | Fixed cadence, frequent updates, marketing by date | Weak breaking/non-breaking signal | Use only if date cadence is the product story |
| C. Human release label plus opaque build ID | `Season 4 Patch 2` plus git SHA/internal build | Marketing-heavy live service | Compatibility meaning hidden from support and code | Acceptable only if SemVer is still tracked elsewhere |

### Release identity fields suggested

Perplexity suggested a machine-readable manifest with at least:

- `appVersion`
- `buildSha`
- `releaseChannel`
- `releasedAt`
- `commit`
- `imageDigest`
- `contentVersion`
- `saveSchemaVersion`

It also recommended separating build metadata from deployment identity: SemVer
build metadata can carry timestamp/SHA/run hints, but promotion and rollback
should still pin the concrete OCI digest and release manifest.

### Deployment guidance returned

- Promote the same immutable image digest from dev to production after
  verification; do not rebuild per environment.
- Treat tags as convenience aliases and digests as the tested deployment target.
- Rollback should redeploy the previous known-good digest and matching release
  manifest, not rebuild an older tag.
- Each release gate should record source commit, image digest, manifest version,
  approver and rollback target.

### PWA/service-worker guidance returned

- Avoid surprise updates that interrupt an active game session.
- Show an update-available prompt and let the player refresh at a safe point for
  ordinary changes.
- Reserve forced update/reload for critical data-loss, security or incompatible
  schema cases.
- Define whether open tabs keep the old version until refresh and whether a
  save migration requires restart or confirmation.

### Telemetry guidance returned

Perplexity recommended carrying release/build/content/save-schema identifiers
on analytics and crash diagnostics:

- `appVersion`
- `buildSha`
- `imageDigest`
- `releaseChannel`
- `saveSchemaVersion`
- `contentPackVersion`

This maps to crash grouping, release regression tracking and support triage.

### Save/content compatibility guidance returned

Perplexity recommended three compatibility layers:

- code/app release;
- save schema version;
- content/data version.

Practical mapping:

- PATCH: save-compatible fixes.
- MINOR: additive features/content, existing saves still load.
- MAJOR: incompatible save/schema or major simulation change.

It recommended requiring a migration plan, backup/restore behavior and rollback
note for any release that changes save format.

### Comparable game/live-service pattern returned

The game/live-service precedent pattern was a split between player-facing labels
and internal build identifiers:

- user-visible version name or season/patch label;
- internal build number/code;
- supported / recommended update / must-update state;
- staged rollout and rollback readiness.

For FMX this maps to a player-facing release label, an ops-facing
SemVer/build/digest tuple and explicit old-save/old-client support status.

## Source Quality Caveat

The Perplexity pass included several secondary product/practice articles. This
packet uses them only as discovery input. The canonical source checks for
accepted wording are captured in
[[raw-release-versioning-source-checks-2026-06-16]] and prefer primary docs:
SemVer, Docker, GitHub, SLSA, Dokploy, Workbox, Sentry-compatible release docs
and official Football Manager update notes.
