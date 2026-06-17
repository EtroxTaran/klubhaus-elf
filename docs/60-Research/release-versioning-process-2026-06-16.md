---
title: Release Versioning and App Build Process
status: current
tags: [research, release, versioning, app-build, dokploy, pwa, telemetry, provenance, sbom, save-compatibility, fmx-178]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-178
related:
  - [[raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
  - [[raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
  - [[../30-Implementation/release-versioning-app-build-process]]
  - [[../30-Implementation/deployment-dokploy]]
  - [[../30-Implementation/client-telemetry]]
  - [[../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
---

# Release Versioning and App Build Process

FMX-178 defines the missing release identity layer for the future app build.
This research is non-binding; the proposed architecture lives in draft
[[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
and waits for Nico's answers in
[[../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]].

## Recommendation

Use **SemVer for the technical app version**, a **player-facing release label**
for communication and a **machine-readable release manifest** for support,
telemetry, provenance and rollback.

Recommended target:

- `releaseVersion`: canonical SemVer, starting at `0.1.0` before stable public
  compatibility.
- `playerReleaseLabel`: player-facing label such as `Closed Beta 1` or
  `Season Update 2026.1`.
- `buildId`: unique build identity derived from version, UTC timestamp, short
  commit SHA and CI run number.
- `imageDigest`: immutable OCI digest promoted through environments.
- `release.json`: manifest containing release, build, content, save-schema,
  provenance, SBOM and rollback fields.

The key rule is: **build once, promote the same digest, and always know which
save/content versions that digest can safely open**.

## Research Basis

| Topic | Source-checked result | FMX consequence |
|---|---|---|
| SemVer | SemVer defines `MAJOR.MINOR.PATCH`, supports pre-release/build metadata, treats `0.y.z` as initial development and forbids modifying released versions. | Use SemVer as the technical compatibility signal; use `v` only for git tags. |
| OCI digests | Docker documents digests as immutable SHA-256 content identifiers, unlike reusable tags. | Promote and rollback by digest; do not deploy `:latest`. |
| Attestation/SBOM | GitHub artifact attestations bind image subject name and SHA-256 digest; SBOM can be attached by `sbom-path`. | Production release evidence should attach provenance and SBOM to the digest. |
| SLSA | Provenance records build definition, run details and resolved source/dependency digests. | Release evidence should prove what source/build produced the digest. |
| Dokploy | Dokploy supports health-check rollback and registry-based rollback to previous deployment images. | Configure registry-backed rollback before beta and record rollback targets. |
| Workbox | A new service worker can wait until clients unload; users can be informed that an update is available; skip-waiting is explicit. | Ordinary PWA updates should prompt at safe points, not force-refresh active gameplay. |
| Crash/release telemetry | Sentry-compatible docs tie release names to regression detection, sessions and source-map application. | ADR-0017's release/build id needs concrete `releaseVersion` and `buildId` fields. |

Raw evidence:

- [[raw-perplexity/raw-release-versioning-app-build-2026-06-16]]
- [[raw-perplexity/raw-release-versioning-source-checks-2026-06-16]]

## Real-World and Game Precedent

Real-world release engineering separates version meaning from artifact identity:
SemVer communicates compatibility, while commit SHAs, build IDs, image digests,
SBOMs and provenance records prove the exact artifact. Dokploy's rollback model
also depends on registry-backed deployment images, so the FMX release process
should not rely on mutable tags or branch names as release truth.

Sports-management precedent adds an important gameplay-specific split:
Football Manager's 2024 main data update applied gameplay fixes to current
careers, while data changes required a new save. FMX needs the same explicit
per-release answer: can existing saves continue, do content/database changes
require a new run, and is an old client still supported?

## Options

### D1 - Version Scheme

| Option | Description | Assessment |
|---|---|---|
| **A. SemVer technical version plus player label** | Use SemVer internally and in release manifests; expose friendly season/beta labels in UI/notes. | **Recommended.** Best compatibility signal while still allowing product-friendly communication. |
| B. Calendar version technical scheme | Use date/cadence as the main version. | Good for fixed cadence, weaker for save/API compatibility. |
| C. Player label plus opaque build id | Treat "Season 1 Patch 2" as the main identity and rely on hidden build IDs. | Support/debugging risk; compatibility is not visible. |

### D2 - Release Identity

| Option | Description | Assessment |
|---|---|---|
| **A. `release.json` manifest** | Generated at build with app version, build ID, commit, digest, channel, content version, save schema, provenance/SBOM refs and rollback predecessor. | **Recommended.** One durable artifact identity across app, support, telemetry and rollback. |
| B. Environment variables only | Inject version/build variables into runtime without a persisted manifest. | Useful but incomplete; hard to inspect after rollback. |
| C. Package version only | Use `package.json#version` as the only identity. | Too weak for Docker, PWA, source maps and content/save compatibility. |

### D3 - Promotion and Rollback

| Option | Description | Assessment |
|---|---|---|
| **A. Build once, promote digest** | Build image once, verify in dev/staging, promote same digest to prod, rollback to prior known-good digest. | **Recommended.** Prevents environment drift and matches Docker/Dokploy evidence. |
| B. Rebuild per environment | Build the same git ref separately for dev/prod. | Easier branch wiring, but artifact drift breaks support evidence. |
| C. Deploy mutable tags | Use `latest`, `main` or branch tags as deploy identity. | Rejected; mutable tags caused exactly the class of stale-image risk already documented in Dokploy notes. |

### D4 - PWA Update UX

| Option | Description | Assessment |
|---|---|---|
| **A. Prompt-to-refresh at safe points** | Let current tabs keep old code until safe refresh; prompt when a new worker waits. | **Recommended.** Protects active gameplay/offline sessions. |
| B. Always skip waiting | Activate the new worker immediately. | Simpler, but can interrupt or mix old runtime with new assets. |
| C. Never prompt | Apply only on next full visit. | Too opaque for security/data-loss or player support cases. |

### D5 - Save and Content Compatibility

| Option | Description | Assessment |
|---|---|---|
| **A. Four-layer compatibility matrix** | Track app release, API/contract version, save schema version and content pack version separately; declare support and migration per release. | **Recommended.** Fits offline PWA, content updates and future mobile wrappers. |
| B. Major-only compatibility policy | Treat only major app versions as compatibility boundaries. | Too coarse for save/content changes. |
| C. Force-new-save for content changes | Make every content/data update require a new save. | Operationally simple but hostile to long careers. |

### D6 - Release Evidence

| Option | Description | Assessment |
|---|---|---|
| **A. SBOM plus provenance/attestation for prod digest** | Attach SBOM and build provenance to every production image digest. | **Recommended.** Strong support/security posture before beta. |
| B. SBOM only | Keep dependency inventory without provenance. | Better than nothing, but weak source-to-image proof. |
| C. Defer evidence until post-beta | Skip release evidence at first. | Not recommended; rollback/support debt appears exactly during beta. |

### D7 - Runbook Ownership and Beta Gate

| Option | Description | Assessment |
|---|---|---|
| **A. Named release owner plus dry-run before beta** | Assign a release captain for each release, run the checklist in dev/staging and require rollback/source-map/evidence proof before public beta. | **Recommended.** Keeps app-build reliability out of ad hoc deploy memory. |
| B. Tool owner only | Dokploy/GitHub settings owner handles releases informally. | Too dependent on one operator's memory. |
| C. No explicit runbook until launch | Document later. | Rejected; beta is when release mistakes first hurt players. |

## Proposed Release Manifest Shape

```json
{
  "releaseVersion": "0.1.0-beta.1",
  "playerReleaseLabel": "Closed Beta 1",
  "buildId": "0.1.0-beta.1+202606161845.289b119.1234",
  "gitSha": "289b119...",
  "sourceRef": "refs/tags/v0.1.0-beta.1",
  "releaseChannel": "beta",
  "builtAt": "2026-06-16T18:45:00Z",
  "image": "ghcr.io/etroxtaran/klubhaus-elf@sha256:...",
  "imageDigest": "sha256:...",
  "sbomRef": "ghcr.io/.../attestations/sbom/...",
  "provenanceRef": "ghcr.io/.../attestations/provenance/...",
  "contentVersion": "content-2026.06.16",
  "saveSchemaVersion": "save-0005.3",
  "minSupportedSaveSchemaVersion": "save-0005.1",
  "minSupportedClientVersion": "0.1.0-beta.0",
  "rollbackPredecessor": "0.1.0-alpha.4+20260610...."
}
```

Exact generation tooling is future code-phase work and must re-check current
GitHub/Docker/Dokploy docs before implementation.

## Open Decision Packet

The questions above are copied into
[[../40-Execution/fmx-178-release-versioning-app-build-decision-queue-2026-06-16]]
with clear recommendations. Until Nico accepts them:

- ADR-0132 stays `status: draft` and `binding: false`.
- [[../30-Implementation/release-versioning-app-build-process]] is a draft
  runbook, not an active deployment procedure.
- Existing accepted docs that mention generic `release/build id` remain
  binding only at that generic level.
