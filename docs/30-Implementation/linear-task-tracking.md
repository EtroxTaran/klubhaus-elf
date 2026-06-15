---
title: Linear Task Tracking & GitHub Integration
status: current
tags: [meta, implementation, linear, github, tracking]
created: 2026-05-27
updated: 2026-06-02
type: implementation
binding: true
related: [[../90-Meta/collaboration-and-decision-protocol]], [[agent-workflow-pattern]], [[../90-Meta/vault-governance]], [[../00-Index/Current-State]], [[../00-Index/Decision-Log]], [[../10-Architecture/bounded-context-map]], [[../90-Meta/mcp-memory-integration]]
---

# Linear Task Tracking & GitHub Integration

Canonical conventions for **Linear (team FMX)** and its **GitHub integration**.
Linear holds **operational status**; the `docs/` vault holds **durable knowledge**
— nothing is duplicated between them. `AGENTS.md` and `.cursor/rules` are
orchestrators that point here (canonical-location rule, [[../90-Meta/vault-governance]]).
Roles, the ask-first gate and the current phase: [[../90-Meta/collaboration-and-decision-protocol]].

- **Workspace / team:** `coding-x` / **FMX** — <https://linear.app/coding-x/team/FMX/active>
- **Active project:** *Phase 1 — Research & Architecture* (milestones: Discovery →
  Architecture → Game-Design → Decision-Ratification). **No cycles** in the
  research phase; no initiatives.

## Labels (target schema)

Grouped, prefixed, kebab-case. One `type:` + one `area:` are **mandatory** on
every issue.

- **type:** `research` · `game-design` · `adr` · `doc` · `chore` · `bug` · `refactor`
- **area:** (7 clusters, derived from [[../10-Architecture/bounded-context-map]])
  `match` (match engine + watch party) · `squad-club` (squad & player, training,
  club, finance, youth) · `transfer` · `platform` (identity, sync, audit/security,
  data, infra, build, deploy) · `notification` · `ui-ux` · `meta` (vault,
  governance, process, tooling). Split finer only when the build phase needs it.
- **needs:** `nico-decision` — the [[../90-Meta/collaboration-and-decision-protocol|ask-first gate]].
- **risk:** `security` · `legal` · `data-loss` (sparingly, only when action-guiding).
- **Priority:** Linear's **native priority field** (Urgent/High/Medium/Low) — not a
  label. Pre-mortem findings are referenced by ID (`PM-2026-05-20-…`) in the body.
- **Estimates:** none for now; the human sets them at triage if needed.

## Workflow states

`Backlog` → `Todo` → `In Progress` → `In Review` → `Done`; `Blocked` when stuck;
`Canceled`. `Blocked` is a **state, not a label**.

Agents may claim only issues in `Backlog` or `Todo`. Claiming means: verify that
no active branch, PR, or worktree already owns the issue, then move Linear to
`In Progress` as the **first visible action** before creating a branch/worktree
or editing files. Agents may then move `In Progress → In Review`, or
`→ Blocked` with a comment; **never** to `Done`/`Canceled` (Nico only).

## Issue conventions

- **Title:** `Verb + area + object` (e.g. "Recherchiere Match-Engine-Determinismus").
- **Body:** `## Summary` / `## Context` (+ vault links) / `## Requirements` /
  `## Acceptance Criteria`.
- Every issue **links the canonical vault note** it concerns and carries one
  `type:` + one `area:` label.
- **Agents:** create issues only in `Backlog` (type+area required); search for a
  duplicate first (idempotent); **max 3 new issues per session**; never change the
  schema (labels/states). Creating and immediately working an issue is two steps:
  create it in `Backlog`, then claim it by moving `Backlog → In Progress`.
  Decompose with sub-issues; order with blocking relations.

## GitHub integration & traceability

The Linear issue ID in the **branch name** is the auto-link key.

- **Branch + worktree:** one issue ↔ one git worktree ↔ one branch (ADR-0045).
  Humans `feat/fmx-<n>-<slug>`; agents `claude|codex|cursor/fmx-<n>-<slug>`.
- **PR title:** `[FMX-<n>] …`. **PR body first line:** `Closes FMX-<n>` — **1 PR ↔
  1 issue**, merge auto-closes it (`Part of FMX-<n>` only when one issue truly needs
  several PRs).
- **Team automations:** PR opened → `In Progress` remains a fallback/reinforcement;
  PR merged → `Done`. Agent claim status must happen earlier than PR creation, so
  agents still move `Backlog|Todo → In Progress` explicitly through Linear MCP.
  Merge is Nico's action, so the human-only `Done` rule is preserved.
- **Merge:** **auto-merge-when-green** (ADR-0044) — squash to `main`, branch-protected
  (PR required, no force-push/deletion, linear history). Docs/low-risk: green required
  checks (`docs-check` + `linear-id`) → merges, **no review, no manual Nico-merge**.
  Code → `main`: green checks **plus ≥1 CODEOWNER review** (activates with code-CI).
- **Attribution:** Linear **assignee = responsible human (Nico)**. Agents are
  **GitHub-only actors**, not mapped to Linear users; commits stay authored as
  `Nico <dev@etrox.de>` (repo rule: agents are assistants, not authors). Which
  agent did the work is shown by the **branch prefix** + a PR `Agent:` line.
- **GitHub Sync** (2-way issue sync) stays **off** — Linear is the source of truth.
- **Enforcement:** `.github/PULL_REQUEST_TEMPLATE.md` pre-fills `Closes/Part of FMX-<n>` + the `Agent:` line; `.github/workflows/linear-link-check.yml` fails a PR whose branch lacks `fmx-<n>` or whose title/body lacks `FMX-<n>`.

## Setup status

Done by agent (2026-05-27, [[../00-Index/Current-State|FMX-1]]): project
*Phase 1 — Research & Architecture* + 4 milestones, and the target labels
(`type:game-design|bug|refactor`, `area:match|squad-club|platform|notification|ui-ux|meta`,
`needs:nico-decision`, `risk:security|legal|data-loss`) via Linear MCP. Existing
good labels kept: `type:chore|research|adr|doc`, `area:transfer`. On GitHub (via
`gh`): merge method set to **squash-only** (+ delete-branch-on-merge), and `main`
**branch-protected** (PR required, 0 approvals, no force-push/deletion, linear
history, admin-bypass on — the solo merger is not locked out). Issue ⇄ branch ⇄
commit ⇄ PR auto-link is confirmed working.

### One-time cleanup & wiring — Nico (UI/OAuth; the MCP cannot do these)

1. **Delete the legacy/duplicate labels** (0 issues use them — safe):
   - type duplicates: `type:config`, `type:qa`, `type:infra`, `type:feature`; bare `Bug`, `Feature`, `Improvement`
   - old area labels: `area:infra`, `area:training`, `area:squad`, `area:match-engine`, `area:stadium`, `area:league`, `area:finance`, `area:youth`, `area:feature`, `area:gamedata`, `area:research`, `area:docs`, `area:architecture`, `area:pwa`, `area:save`
   - priority labels: `prio:medium|high|critical`, `priority:low|medium|high|critical`
   - size labels: `size:s|m|l`, `complexity:XS|S|M|L|XL`
   - `parallel:*` (all 10) and `phase:*` (all 4)
   - `needs-decision` (replaced by `needs:nico-decision`)
2. **Add workflow state `Blocked`** (type *started*); optionally rename `Todo` → `Planned`.
3. **Linear → Settings → Integrations → GitHub:** install the app (org level),
   grant `EtroxTaran/klubhaus-elf`, enable **PR linking**, set
   **Branch format = identifier-title**, add automations *PR opened → In Progress*
   and *PR merged → Done*. If personal/account git automation is enabled, branch
   creation may also assign and move issues forward for human users; agents still
   use the explicit Linear-MCP claim rule. Leave **GitHub Sync off**.
4. **GitHub (later, optional):** add required status checks to the `main`
   protection once CI returns, and decide whether to require ≥1 review (left off
   now — solo merger). Squash-only + base branch protection are already applied.

## Related

- [[../90-Meta/collaboration-and-decision-protocol]] — roles, ask-first gate, phase
- [[agent-workflow-pattern]] — the beat loop and stop conditions
- [[../90-Meta/vault-governance]] — canonical-location rule, supersede discipline
- [[../00-Index/Current-State]] · [[../00-Index/Decision-Log]] · [[../50-Game-Design/README]]
- [[../10-Architecture/bounded-context-map]] — source of the `area:` clusters
- [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]] — CI/CD + auto-merge policy
- [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]] — issue-first + worktree
