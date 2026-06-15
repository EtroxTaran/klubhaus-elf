---
title: "Raw - pnpm tooling currency (FMX-195)"
status: raw
tags: [research, raw, perplexity, tooling, pnpm, dependency-currency, fmx-195]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-195
related:
  - [[../pnpm-tooling-currency-2026-06-15]]
  - [[raw-pnpm-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Raw - pnpm tooling currency (FMX-195)

## Research prompt

Perplexity was asked on 2026-06-15:

> As of 2026-06-15, check pnpm latest stable and summarize best practices and
> risks for updating a repo pin from pnpm 11.1.2 to 11.6.0. Context:
> package.json packageManager uses pnpm@11.1.2, .mise.toml uses
> pnpm = "11.1.2", Node is pinned as 22 in mise and local Node is v22.22.1.
> The repo is docs-only, but future code phase will use pnpm workspaces and Nx.
> What should be verified and documented?

## Source-quality note

Perplexity saw npm's `latest` channel as the stability source and therefore
recommended `pnpm@11.6.0`. That answer became a discovery input only. FMX-195
then performed direct source checks against npm registry metadata, the exact
`pnpm@11.7.0` package, GitHub releases, Context7 official pnpm docs and Ref
pnpm changesets. Nico then selected the project rule for this beat: pin the
newest published non-prerelease package after source checks, even when npm
dist-tags still lag.

## Extracted findings

- `package.json` should keep an exact `packageManager` pin so Corepack-aware
  environments select the same package manager version.
- `.mise.toml` should match the package-manager pin so mise-managed shells and
  Corepack-aware shells do not disagree.
- pnpm 11 requires Node 22+. The local FMX environment reports Node v22.22.1,
  which satisfies both `pnpm@11.6.0` and `pnpm@11.7.0` package engines
  (`>=22.13`).
- pnpm 11 moved to pure ESM and a SQLite-backed store index; this is mostly
  transparent for CLI use but should be treated as a cache/store compatibility
  detail when sharing stores across versions.
- Future workspace/code-phase work should centralize pnpm project settings in
  `pnpm-workspace.yaml` when that file exists.
- Supply-chain hardening options such as `minimumReleaseAge`, `trustPolicy`
  and `trustLockfile` are future workspace decisions and should not be invented
  in this docs-only pin update.
- Because the repo is currently docs-only, the immediate risk is environmental
  drift in docs tooling, not app/package build breakage.

## Perplexity citations surfaced

- pnpm 11.0 release notes: <https://pnpm.io/blog/releases/11.0>
- pnpm 11.3 release notes: <https://pnpm.io/blog/releases/11.3>
- pnpm 10.16 release notes: <https://pnpm.io/blog/releases/10.16>
- pnpm 10.21 release notes: <https://pnpm.io/blog/releases/10.21>
- pnpm update docs: <https://pnpm.io/cli/update>
- Corepack/packageManager discussion: <https://github.com/orgs/pnpm/discussions/4383>
- pnpm GitHub releases: <https://github.com/pnpm/pnpm/releases>
- npm pnpm package versions: <https://www.npmjs.com/package/pnpm?activeTab=versions>

## Related

- [[../pnpm-tooling-currency-2026-06-15]]
- [[raw-pnpm-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
