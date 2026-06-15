---
title: "FMX-195 pnpm tooling currency decision queue"
status: current
tags: [execution, decision-queue, tooling, pnpm, dependency-currency, fmx-195]
created: 2026-06-15
updated: 2026-06-15
type: execution
binding: false
linear: FMX-195
related:
  - [[../60-Research/pnpm-tooling-currency-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-pnpm-tooling-currency-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-pnpm-source-checks-2026-06-15]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# FMX-195 pnpm tooling currency decision queue

## Context

FMX-180 routed the stale `pnpm@11.1.2` pin to FMX-195. On 2026-06-15,
source checks found a channel mismatch: npm `latest` / `latest-11` still point
to `11.6.0`, but `pnpm@11.7.0` is published to npm and GitHub as a public
non-prerelease release.

## D1 - pnpm target for this beat

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| A | Pin `pnpm@11.6.0` because npm `latest` and `latest-11` still point there. | No | Rejected |
| **B** | Pin `pnpm@11.7.0` because it is the newest published non-prerelease package after source checks. | **Yes** | **Accepted** |
| C | Defer until npm promotes `11.7.0` to `latest`. | No | Rejected |

Outcome: FMX pins `pnpm@11.7.0` now. The dist-tag lag is recorded in the
research note and does not block the project rule to use the newest version.

## D2 - Scope in docs-only phase

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Update active repo pins now because they already control docs tooling. | **Yes** | **Accepted** |
| B | Only document the future target and leave active pins stale until code phase. | No | Rejected |
| C | Expand this beat into workspace/Nx/security-policy setup. | No | Rejected |

Outcome: update `package.json` and `.mise.toml` only; do not add workspace or
code-phase infrastructure in FMX-195.

## Follow-up guardrails

- Re-check tool versions again in FMX-179 / first code bootstrap before
  installing or pinning workspace dependencies.
- Route `minimumReleaseAge`, `trustPolicy`, `trustLockfile` and
  `devEngines.packageManager` policy to the broader tooling/workspace work.
- Keep exact committed pins; do not commit floating `latest` ranges.

## Related

- [[../60-Research/pnpm-tooling-currency-2026-06-15]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
