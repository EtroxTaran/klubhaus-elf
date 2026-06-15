---
title: "pnpm tooling currency (FMX-195)"
status: current
tags: [research, synthesis, tooling, pnpm, dependency-currency, fmx-195]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-195
related:
  - [[raw-perplexity/raw-pnpm-tooling-currency-2026-06-15]]
  - [[raw-perplexity/raw-pnpm-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[code-phase-dod-transition-contract-2026-06-14]]
---

# pnpm tooling currency (FMX-195)

## Scope

FMX-195 closes the pnpm pin drift surfaced by FMX-180. It updates the active
docs-phase package-manager pin only; it does not bootstrap a workspace, install
Nx, add code scripts or decide future pnpm workspace security policy.

## Current facts

| Area | Finding |
|---|---|
| Active repo pins before FMX-195 | `package.json` pinned `pnpm@11.1.2`; `.mise.toml` pinned `pnpm = "11.1.2"`. |
| Runtime compatibility | Local Node is `v22.22.1`; `pnpm@11.7.0` declares `node >=22.13`. |
| Registry channel caveat | npm dist-tags still point `latest` / `latest-11` to `11.6.0`, while `11.7.0` is published under `next-11`. |
| Release artifact | GitHub release `v11.7.0` is public, non-draft and non-prerelease on 2026-06-15. |
| Immediate repo risk | Docs-only scripts are the active gate; no app/package install graph exists yet. |

## Decision

Pin `pnpm@11.7.0` in the active toolchain.

Rationale:

- Nico reaffirmed the project dependency rule: use the newest version after
  source checks, not the older dist-tag when a newer public non-prerelease
  package exists.
- `11.7.0` keeps the same package engine requirement (`node >=22.13`) as
  `11.6.0`, and the local Node 22 pin satisfies it.
- `11.7.0` includes supply-chain and determinism-adjacent fixes relevant to
  future workspace use, including lockfile alias hardening and deterministic
  child resolution.
- The new `frozenStore` feature has a stricter Node requirement only when that
  opt-in feature is used. FMX does not enable it in this beat.

## Constraints

- Do not add `pnpm-workspace.yaml`, `nx.json`, `apps/` or `packages/*` here.
  Those stay with FMX-179 / the code-phase bootstrap.
- Do not invent `minimumReleaseAge`, `trustPolicy`, `trustLockfile` or
  `devEngines.packageManager` policy here. Those are wider workspace/security
  decisions for FMX-168 / bootstrap follow-up.
- Keep exact pins. No floating `latest` or `latest-11` in committed config.
- Re-check package versions again at the actual code/workspace bootstrap; this
  note is a June 15, 2026 source check, not a future guarantee.

## Applied repo delta

- `package.json` uses `packageManager: pnpm@11.7.0`.
- `.mise.toml` uses `pnpm = "11.7.0"`.
- Current process docs now report the active pin as Node 22, pnpm 11.7.0,
  PostgreSQL 17, while preserving FMX-180's older June 14 registry observation
  as historical research.

## Sources

- Raw Perplexity capture:
  [[raw-perplexity/raw-pnpm-tooling-currency-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-pnpm-source-checks-2026-06-15]]
- npm package metadata:
  <https://registry.npmjs.org/pnpm>,
  <https://registry.npmjs.org/pnpm/11.7.0>
- GitHub release:
  <https://github.com/pnpm/pnpm/releases/tag/v11.7.0>
- Official docs checked through Context7 and Ref:
  <https://pnpm.io/installation>,
  <https://pnpm.io/configuring>,
  <https://pnpm.io/blog/releases/11.0>

## Related

- [[../40-Execution/fmx-195-pnpm-tooling-currency-decision-queue-2026-06-15]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[../30-Implementation/ci-and-review-process]]
