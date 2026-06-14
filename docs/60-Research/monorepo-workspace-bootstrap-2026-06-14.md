---
title: Monorepo Workspace Bootstrap
status: current
tags: [research, monorepo, workspace, nx, pnpm, typescript, ddd, code-phase, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[raw-perplexity/raw-monorepo-workspace-ddd-package-granularity-2026-06-14]]
  - [[raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]]
  - [[raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]]
  - [[raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../30-Implementation/monorepo-workspace-bootstrap-plan]]
  - [[../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# Monorepo Workspace Bootstrap

FMX-179 refines the code-phase foundation shape after accepted ADR-0110. It
does **not** scaffold apps/packages. It preserves research, proposes
ADR-0114 and queues the decisions Nico needs to approve before a real bootstrap
PR creates `pnpm-workspace.yaml`, `nx.json`, `apps/web` or `packages/*`.

## Recommendation

Use a **progressive one-bounded-context package catalog**:

- every bounded context receives a stable future package slug and public
  contract rule;
- physical workspace package roots are created only when they contain real
  code, real targets and a module note;
- ADR-0089's six clusters stay cognitive/navigation aids, not physical package
  boundaries;
- technical packages remain thin and non-domain-owning (`ui`, `db`,
  `db-schema`, `game-data`, `match-contract`);
- code-phase gates activate only when their scripts and target surfaces exist.

This is stricter than the generic Perplexity cluster-first advice because FMX
already has accepted ADRs requiring service-ready bounded contexts
([[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]) and defining
clusters as aids rather than boundaries
([[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]).

## Findings

### F1 - workspace linking should be native, not alias-primary

Nx and pnpm documentation support package-manager workspaces plus TypeScript
project references as the foundation. `workspace:*` dependencies make local
linking explicit, and TypeScript solution/project references keep editor and
build ordering understandable. Root TypeScript `paths` should not be the primary
package linking mechanism in the proposed bootstrap.

Sources:

- [[raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
- https://nx.dev/docs/concepts/typescript-project-linking
- https://pnpm.io/workspaces
- https://www.typescriptlang.org/docs/handbook/project-references.html

### F2 - one package per context is the target, not day-one noise

One package per bounded context is the strongest extraction posture, but
creating 28 empty packages before code exists creates false confidence and
manifest/tsconfig churn. The target catalog should exist in docs, while the
physical package appears only with real source and tests/targets.

The immediate scaffold should create only the first real package roots. The
recommended initial set is:

| Root | Proposed package | Purpose | Create when |
|---|---|---|---|
| `apps/web` | `@klubhaus-elf/web` | TanStack Start PWA/app shell and server-function host. | The scaffold includes a real app shell and runnable typecheck/build target. |
| `packages/ui` | `@klubhaus-elf/ui` | Design-system primitives, tokens and stories. | There is at least one real exported DS surface and Storybook config can run. |
| `packages/db` | `@klubhaus-elf/db` | Drizzle schema, gateway and migrations. | The scaffold includes real schema/gateway source and no raw-pool escape. |
| `packages/db-schema` | `@klubhaus-elf/db-schema` | Generated zero-dependency validation mirror. | The generator/output contract exists; otherwise keep planned only. |
| `packages/game-data` | `@klubhaus-elf/game-data` | IP-clean data/content schemas and validation. | The package has real schema/data validation source. |
| `packages/match-contract` | `@klubhaus-elf/match-contract` | Neutral replay/frame/engine-renderer contract leaf. | The scaffold includes real contract types and contract tests. |

`packages/match-engine` should wait for the accepted match-engine runtime slice.
Creating an empty engine package in the foundation PR would violate ADR-0110's
no-placeholder gate.

### F3 - game production precedent supports UI/sim/data separation

The comparable-game pass reinforced a hard split between UI/presentation,
simulation contracts and content/data. The strongest public football-manager
precedent is Sports Interactive's FM25 UI migration talk: the usable lesson is
not its exact repo layout, but the explicit UI-data boundary and single
constrained entry point from UI toward game logic.

Sources:

- [[raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]]
- https://www.footballmanager.com/news/development-update-football-manager-25

### F4 - no-placeholder gates are part of the architecture

Vitest, Playwright and Storybook should not become active checks for packages
or apps that do not exist or contain no meaningful source. The root scripts can
exist only when they run real Nx targets. Coverage thresholds should activate
per real package once the package has product logic and tests; empty packages
must not create fake green confidence.

Sources:

- [[raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]]
- [[raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
- https://vitest.dev/guide/projects.md#defining-projects
- https://github.com/microsoft/playwright/blob/main/docs/src/test-configuration-js.md?plain=1#L10#basic-configuration
- https://storybook.js.org/docs/get-started/frameworks/react-vite

### F5 - namespace needs explicit approval

The vault already uses `@klubhaus-elf/*` in module notes and current
implementation docs, while `AGENTS.md` still contains older
`@soccer-manager/*` examples. Because package names become public import
contracts, FMX-179 records this as a Nico decision. The recommendation is
`@klubhaus-elf/*`, followed by AGENTS/workflow cleanup in the actual scaffold PR.

## Proposed context package catalog

If Nico approves D1=A in the decision queue, the future context packages are:

| Bounded context | Future package slug |
|---|---|
| Identity & Access | `@klubhaus-elf/identity-access` |
| League Orchestration | `@klubhaus-elf/league-orchestration` |
| Club Management | `@klubhaus-elf/club-management` |
| Squad & Player | `@klubhaus-elf/squad-player` |
| Training | `@klubhaus-elf/training` |
| Transfer | `@klubhaus-elf/transfer` |
| Match | `@klubhaus-elf/match` |
| Watch Party | `@klubhaus-elf/watch-party` |
| Notification | `@klubhaus-elf/notification` |
| Manager & Legacy | `@klubhaus-elf/manager-legacy` |
| Staff Operations | `@klubhaus-elf/staff-operations` |
| Tactics | `@klubhaus-elf/tactics` |
| Regulations & Compliance | `@klubhaus-elf/regulations-compliance` |
| Rivalry System | `@klubhaus-elf/rivalry-system` |
| Stadium Operations | `@klubhaus-elf/stadium-operations` |
| Audience & Atmosphere | `@klubhaus-elf/audience-atmosphere` |
| CommercialPortfolio | `@klubhaus-elf/commercial-portfolio` |
| Offline Sync | `@klubhaus-elf/offline-sync` |
| Audit & Security | `@klubhaus-elf/audit-security` |
| People / Persona & Skills | `@klubhaus-elf/people-persona-skills` |
| Narrative | `@klubhaus-elf/narrative` |
| Community Overlay Pipeline | `@klubhaus-elf/community-overlay-pipeline` |
| Youth Academy | `@klubhaus-elf/youth-academy` |
| Scouting | `@klubhaus-elf/scouting` |
| AI World Simulation | `@klubhaus-elf/ai-world-simulation` |
| Environment & Climate | `@klubhaus-elf/environment-climate` |
| Statistics & Analytics | `@klubhaus-elf/statistics-analytics` |
| Media Ecology | `@klubhaus-elf/media-ecology` |

## Recommended decision packet

Approve the queue in
[[../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]:

- D1=A: progressive one-context package catalog; no 28 empty package roots.
- D2=A: initial package set limited to real foundation packages and app roots.
- D3=A: replace ADR-0019's old `src/domain/<context>` implementation convention
  with workspace package public facades.
- D4=A: pnpm workspace linking + TypeScript project references + Nx
  `@nx/js/typescript`; root aliases are not the primary link.
- D5=A: no placeholder green gates; coverage/test/e2e/showcase checks activate
  only for real targets.
- D6=A: package namespace `@klubhaus-elf/*`.
- D7=A: keep CODEOWNERS root-owner until ADR-0046's domain-lead trigger; add
  package owner metadata/module notes now.
- D8=A: re-check and exact-pin versions in the scaffold PR; FMX-195 owns the
  pnpm pin update.

## Related

- [[raw-perplexity/raw-monorepo-workspace-ddd-package-granularity-2026-06-14]]
- [[raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]]
- [[raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]]
- [[raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
