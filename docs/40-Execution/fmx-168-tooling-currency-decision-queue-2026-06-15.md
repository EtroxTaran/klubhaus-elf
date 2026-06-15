---
title: FMX-168 Tooling currency decision queue
status: current
tags: [execution, decision-queue, tooling, dependency-currency, stack-ledger, bootstrap, fmx-168]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-168
related:
  - [[../60-Research/tooling-currency-sweep-2026-06-15]]
  - [[../30-Implementation/stack-currency-ledger]]
  - [[../60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../60-Research/pnpm-tooling-currency-2026-06-15]]
---

# FMX-168 Tooling currency decision queue

This is the HITL decision packet for FMX-168. No option below is accepted until
Nico decides.

## D1 - Stack Currency Ledger home and authority

| Option | Meaning | Assessment |
|---|---|---|
| **A. One vault ledger now, machine-readable export later** | Use [[../30-Implementation/stack-currency-ledger]] as the human-readable source during docs phase; add JSON/scripted export only after code bootstrap exists. | **Recommended.** Gives one current truth without inventing automation before there is a dependency graph. |
| B. ADR per tool family | Create separate ADRs for every package family now. | Too much ceremony; many rows are source-check facts, not architecture decisions. |
| C. Machine-readable ledger now | Add JSON/schema/scripts in docs phase. | Premature because there is no code workspace or package graph to validate. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - Source authority and conflict policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Stable numeric latest with conflict ledger** | Pin numeric stable versions only; when npm/docs/releases conflict, preserve the conflict and ask Nico before prerelease/holdback/downgrade. | **Recommended.** Matches project latest-stable rule and prevents silent exceptions. |
| B. npm `latest` only | Always trust dist-tags. | Too weak; FMX-195 already showed dist-tags can lag published artifacts. |
| C. Docs/release notes over npm always | Prefer docs/release text even if npm `latest` differs. | Better than B for guidance, but can still accept unpublished or prerelease-like signals accidentally. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - PostgreSQL 17 active pin vs PostgreSQL 18 current stable

| Option | Meaning | Assessment |
|---|---|---|
| **A. Target PostgreSQL 18.x for code bootstrap after approval** | Keep this PR docs-only, then update the future code-phase target/tool pin to current stable PostgreSQL 18.x in the bootstrap or a dedicated follow-up after Nico approves. | **Recommended.** Aligns with official current stable while respecting DB-major migration/hosting risk. |
| B. Stay on PostgreSQL 17 | Treat 17 as acceptable because it is supported until 2029. | Operationally safe short-term, but violates the project latest-stable rule unless Nico grants an exception. |
| C. Spike PostgreSQL 19 beta | Evaluate beta features now. | Not recommended for bootstrap; official PostgreSQL guidance says beta is for testing, not production. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - Code bootstrap package compatibility bundle

| Option | Meaning | Assessment |
|---|---|---|
| **A. Latest-stable compatibility bundle at bootstrap** | Re-check and pin the latest stable React/TanStack/TypeScript/build-tool/Nx/test stack as one tested bundle; any holdback becomes a Nico exception. | **Recommended.** Preserves the dependency rule and handles React 19 / TypeScript 6 / Vite 8 compatibility honestly. |
| B. Conservative previous-major bundle | Start on older majors such as React 18 or TypeScript 5 if examples are easier. | Not allowed without a documented exception. |
| C. Prerelease-forward bundle | Adopt RC/canary/alpha packages where they look promising. | Too risky for foundational bootstrap unless a specific approved spike requires it. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - Dependency automation timing

| Option | Meaning | Assessment |
|---|---|---|
| **A. Detection/reporting proposal now; bot/config after code bootstrap** | Document automation policy now, then add Renovate/reporting/frozen-lockfile gates only once `pnpm-workspace.yaml` and package manifests exist. | **Recommended.** Avoids nonfunctional config in a docs-only repo. |
| B. Add Renovate/Dependabot now | Configure bots before packages exist. | Premature and likely noisy. |
| C. Manual-only forever | Never automate detection. | Weak for long-lived tooling currency and security posture. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-168 selected after live Linear/worktree/GitHub triage.
- 2026-06-15: FMX-168 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-168-tooling-currency-sweep`.
- 2026-06-15: Perplexity-first research captured for tooling-currency process
  and real-world/game precedent.
- 2026-06-15: npm registry, Context7 and PostgreSQL official source checks
  preserved in
  [[../60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]].
- 2026-06-15: Draft [[../30-Implementation/stack-currency-ledger]] prepared.

## Proposed packet

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A**.

If accepted:

- Promote [[../30-Implementation/stack-currency-ledger]] to `status: current`
  / `binding: true` as the stack-currency process home.
- Patch the future code-phase/bootstrap docs to use PostgreSQL 18.x as the
  target after source re-check, leaving PostgreSQL 19 as beta-spike only.
- Add a code-bootstrap task to re-check and pin a complete latest-stable
  compatibility bundle rather than individual packages in isolation.
- Create a later code-phase automation task for Renovate/reporting/frozen
  lockfile gates after the workspace exists.

## Related

- [[../60-Research/tooling-currency-sweep-2026-06-15]]
- [[../30-Implementation/stack-currency-ledger]]
- [[../60-Research/raw-perplexity/raw-tooling-currency-sweep-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-tooling-currency-realworld-games-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-tooling-currency-source-checks-2026-06-15]]
