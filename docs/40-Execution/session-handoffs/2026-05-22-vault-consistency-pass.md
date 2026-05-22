---
title: Handoff - Vault Consistency & Link-Health Pass
status: wrapped
tags: [meta, execution, handoff, documentation, consistency, links]
created: 2026-05-22
updated: 2026-05-22
type: handoff
binding: false
related: [[../../00-Index/Documentation-V1]], [[../../00-Index/Current-State]], [[../../00-Index/Decision-Log]], [[2026-05-22-documentation-v1-cleanup]]
---

# Handoff: Vault Consistency & Link-Health Pass (2026-05-22)

## Linear

- Issue: none linked in this session.

## Goal

Bring the whole vault to one current, consistent, clearly-linked state so a new
contributor gets a single unambiguous answer on stack, MVP, what is binding, and
where to start — with no stale signals to trip over. This completes the "full
vault link-health beat" left open by [[2026-05-22-documentation-v1-cleanup]].

## Done this session

- **Stack truth everywhere.** Realigned root `AGENTS.md`, the arc42 chapters,
  module + state-machine notes, accepted ADRs (0003/0005/0007/0011/0019/0020) and
  current implementation specs (auth-flows, session-management, account-recovery,
  secrets-management, transfer-market-implementation-plan, observability-runbook,
  mvp-implementation-roadmap, privacy-and-consent) to **PostgreSQL + Drizzle** as
  the system of record. SurrealQL DDL (`DEFINE TABLE`, `record(...)`, `RELATE`)
  was translated to Drizzle `pgTable` / `QueryGateway`. SurrealDB now appears
  only as the explicitly-deferred additive option (per ADR-0021/0023/0043).
- **Authority made explicit.** Added a "start here, read these five" front door to
  [[../../00-Index/Home]] and [[../../00-Index/Agent-Onboarding]]; added a
  GDDR-vs-system-note precedence rule + overlapping-topic table to
  [[../../50-Game-Design/README]]; superseded ADRs (0001/0002/0004/0013) and notes
  (surrealdb-integration, pwa-offline-strategy, surrealdb-schema-patterns) now
  self-announce with banners; normalised all `supersedes` / `superseded_by`
  frontmatter to the bare-slug convention the validator expects.
- **Structure.** Renamed `40-User-Docs` -> `70-User-Docs` (folder-number
  collision with `40-Execution`); consolidated the orphaned
  `90-Meta/session-handoffs` into the canonical `40-Execution/session-handoffs`.
- **Encoding.** Repaired ~3,561 mojibake sequences across 51 files and stripped 64
  stray UTF-8 BOMs (the BOMs were defeating the `^---` frontmatter check).
- **Link health.** Fixed ~340 broken wikilinks (corrected wrong relative paths to
  bare-basename links / recomputed paths for duplicate basenames), collapsed
  triple-bracket wikilink typos in the pre-mortem set, honestly de-linked
  planned-but-uncreated artefacts (`context-contracts/`, `testing-strategy`,
  `auth-mvp-launch-slice`, `team-ownership-matrix`) as `(planned)`, and escaped
  the wikilink-syntax meta-examples in [[../../90-Meta/vault-governance]].
- **Tooling.** Hardened `scripts/docs-check.mjs`: frozen `95-Archive` is exempt as
  a validation *source* but kept in the basename set as a valid link *target*.
  `node scripts/docs-check.mjs` now passes with **0 issues** (248 notes).

## Open / next step

- Optional: scaffold the `(planned)` artefacts (`context-contracts/` per-context
  contracts, `testing-strategy`, `auth-mvp-launch-slice`, `team-ownership-matrix`)
  as real stub specs when that implementation work begins.
- Deliberately deferred (low value / high churn): collapsing the overlap between
  Vision / Project-Goals / MVP-Scope / Current-State / Documentation-V1, and
  simplifying the ~18-value status vocabulary. Both are documented and working.

## Blockers

- None.

## Changed vault paths

- ~116 files across two commits. Key areas: root `AGENTS.md`; entry chain
  (`00-Index/Home`, `Agent-Onboarding`, `Research-Map`, `User-Docs-Map`,
  `Repository`); all `10-Architecture/**` (arc42, modules, state-machines, ADRs,
  bounded-context-map); `30-Implementation/**` current specs; `50-Game-Design/README`;
  `60-Research/**` (incl. pre-mortem); `90-Meta/vault-governance`,
  `mcp-memory-integration`; folder moves under `40-Execution` / `70-User-Docs`;
  `scripts/docs-check.mjs`. See commits `123b0a5` and `b32e2e1`.

## Needs promotion

- None. This was a documentation consistency + link-health pass, not a new
  architecture decision. All accepted ADRs / approved GDDRs are unchanged in
  substance.
