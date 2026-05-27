---
title: Agent Workflow Pattern
status: draft
tags: [implementation, process, workflow]
created: 2026-05-17
updated: 2026-05-17
type: implementation
related: [[../00-Index/Home]], [[../00-Index/Decision-Log]], [[../90-Meta/agent-memory-protocol]], [[../90-Meta/vault-governance]], [[ci-and-review-process]], [[cursor-cloud-agent-workflow]], [[design-sync-workflow]], [[../10-Architecture/09-Design-System]]
---

# Agent Workflow Pattern

**This is the single source of truth for how every agent works in this repo**
(Cursor Local + Cloud Agents, Bugbot, Claude). It is bound from
[[../00-Index/Home]], `AGENTS.md`, and `.cursor/rules/80-workflow-vault.mdc`
(`alwaysApply`). No agent runs without it.

It exists to make seven principles inescapable rather than scattered:

1. **No invented style.** Agents never define their own style or layout — the
   design system is used in full and exclusively.
2. **Ask, don't work around.** Unclear architecture or feature → escalate to the
   human. Never a shortcut, stub, or guess.
3. **Small, modular, reviewed.** Clear, small, modular beats; short turns;
   explicit review phases.
4. **Vault-reflected.** Every change is reflected in the Obsidian vault and
   checked against the knowledge base.
5. **Drift escalates.** Discovered misalignment with the knowledge base stops
   work and escalates — it is never papered over.
6. **Living documentation.** The vault evolves with the project; docs are a
   moving artifact, not a one-time write.
7. **Future-proof.** No decision may foreclose evolution. Modular, feature- and
   future-proof by default.

## The Loop

Every beat follows this cycle. Do not skip a step; do not reorder.

1. **Pick** one small beat from Linear (team FMX). Not ad-hoc chat work.
2. **Confirm understanding.** Re-state the beat's intent and acceptance
   criteria. If anything is unclear → **stop and escalate** (see *Ask, don't
   work around*). Do not proceed on a guess.
3. **Plan** in `.cursor/plans/` for any multi-file work; link the plan in the
   Linear issue (per [[cursor-cloud-agent-workflow]]).
4. **Implement** using the design system only (see *Design system is
   mandatory*). Keep the change modular and within package boundaries.
5. **Reflect in the vault** in the *same change* (see *Vault reflection*).
6. **Knowledge-base alignment check** before review (see *Alignment gate*).
7. **Draft PR** → self-check green → **review phase** (Bugbot + human) →
   green required checks → squash-merge.
8. **Close Linear** only after merge: comment outcome, PR link, and final
   vault paths.

## Beat sizing

- One beat = one focused, modular change with its own acceptance criteria.
- If a beat needs more than a short turn, it is too big — split it in Linear
  before starting.
- Schema, config, and cross-package changes are **serialized** (one at a time).
  Independent feature beats may **fan out** in parallel.
- Keep services and packages modular: a beat touches the minimum surface and
  respects existing boundaries (`apps/web`, `packages/*`).

## Design system is mandatory

All UI is built **only** from the existing design system. There is no
agent-defined styling or layout.

- **Tokens:** colors, spacing, radius, fonts come from
  `apps/web/src/styles/app.css` CSS variables / Tailwind tokens.
- **Class composition:** use the `cn()` helper in `apps/web/src/lib/utils.ts`.
- **Theming:** use the theme context/provider in `apps/web/src/theme/*` and the
  club registry — never re-implement scheme or accent logic.
- **Components:** reuse the atoms and composites in
  `apps/web/src/components/{atoms,composites,layout}`. shadcn primitives in
  `src/components/ui/**` are generated — never hand-edited.
- **Forbidden:** raw hex colors; arbitrary Tailwind values (`bg-[#...]`,
  `p-[13px]`, `text-[11px]`); inline `style=` for visual design; a new one-off
  styled component when a design-system primitive already covers the need;
  color-only semantics (always dual-code with a glyph, per the design system).

If the design system **lacks** a primitive the beat needs, that is a stop
condition: propose it to the human, add it to the system and
[[../10-Architecture/09-Design-System]] **first**, then build the feature on
top. Never improvise a visual pattern inside a feature PR.

## Ask, don't work around

The following are **stop conditions**. On any of them the agent does **not**
guess, scaffold a placeholder, weaken scope, or invent a convention — it
escalates and halts that beat:

- The architecture for the beat is ambiguous or undocumented.
- The feature spec is missing, incomplete, or self-contradictory.
- No ADR covers the decision the beat forces, and it is not reversible.
- The design system lacks a required primitive.
- The change would contradict a documented decision (ADR / architecture).

A workaround that "unblocks" a beat by violating one of these is worse than a
blocked beat. Blocked-and-escalated is the correct state.

## HITL escalation protocol

When a stop condition is hit:

1. Open or comment a Linear issue (team FMX), tagged for **Nico**, describing
   the ambiguity and the options considered (do not pick one).
2. Set the beat status to **Blocked** in Linear.
3. If a PR exists, keep it a **draft** and add an `## ALIGNMENT` section
   describing the divergence and the open question.
4. **Halt that beat.** Other independent beats may continue.
5. Resume only after the human resolves it (and the resolution lands in the
   vault — see *Living documentation*).

This reuses the human-sign-off escalation path defined in
`.cursor/rules/99-safety.mdc`. Architecture-wide trade-offs and one-way-door
decisions always go to Nico.

## Vault reflection (mandatory)

Code and vault docs ship in the **same PR**. A PR that changes behaviour
without a vault delta is incomplete. Where each kind of change goes:

| Change | Vault delta |
|---|---|
| A decision / trade-off | new or updated `ADR-XXXX` in `docs/10-Architecture/09-Decisions/` + line in [[../00-Index/Decision-Log]] |
| New/changed feature behaviour | feature spec under `docs/20-Features/` |
| Architecture / boundary change | the relevant `docs/10-Architecture/NN-*.md` |
| Any of the above | one-line update to the relevant index/MOC ([[../00-Index/Home]] or Decision-Log) |
| New domain term | [[../00-Index/Glossary]] |

Frontmatter follows the vault convention (`title`, `status`, `tags`,
`updated`). Use Obsidian wiki-links so the graph stays connected.

## Knowledge-base alignment gate

Before requesting review, diff the change against existing ADRs, architecture
docs, and feature specs:

- [ ] Does it **contradict** a documented ADR or architecture decision?
      → **stop and escalate** (HITL). Do not silently diverge.
- [ ] Does it **extend** the knowledge base (new behaviour/decision)?
      → update the docs **in this PR** (living documentation).
- [ ] Does it leave a doc **stale** (now wrong)? → fix the doc in this PR.
- [ ] Is the relevant index/MOC still accurate? → update the one line.

The vault is a moving artifact: every beat either confirms it or evolves it.
"The code changed but the docs didn't" is a defect.

## Modularity & future-proofing gate

Reject the implementation (and rework or escalate) if it:

- (a) couples a feature into another package's internals instead of its public
  surface;
- (b) bypasses `src/db/client.ts` or any package boundary;
- (c) hard-codes what should be data or config;
- (d) forecloses a documented future direction (offline mutation sync, i18n,
  SurrealDB sync, additional clubs/locales) without an ADR.

One-way-door decisions require an **ADR + HITL sign-off** before merge. Prefer
the reversible, modular option; when unsure whether a door is one-way, treat it
as one-way and escalate.

## Review phases

1. **Self-check:** `pnpm check` + `pnpm typecheck` + `pnpm test` (+ `pnpm
   test:e2e` for app changes). "Works locally" is not done.
2. **Draft PR** with the standard template sections filled, including the
   design-system, knowledge-base-alignment, and modularity sections.
3. **Review:** Bugbot (design-system + boundary + vault-delta flags) and human.
4. **Green required checks** → squash-merge.

Definition of done is [[ci-and-review-process]] **plus** the three gates above
(design system, vault delta, knowledge-base alignment). Green-by-default still
holds: a red required check is an incident, never a backlog item.

## See also

- [[ci-and-review-process]]
- [[cursor-cloud-agent-workflow]]
- [[design-sync-workflow]]
- [[../10-Architecture/09-Design-System]]
- [[../00-Index/Decision-Log]]

Memory system (same entry chain every agent uses):

- [[../00-Index/Agent-Onboarding]] — session start
- [[../90-Meta/agent-memory-protocol]] — start/update/wrap-up steps
- [[../90-Meta/vault-governance]] — memory classes, supersede discipline, connectivity
