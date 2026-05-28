---
title: Session Handoffs
status: current
tags: [meta, execution, hot]
created: 2026-05-17
updated: 2026-05-28
type: index
binding: true
related: [[../../90-Meta/agent-memory-protocol]]
---

# Session Handoffs

Hot working memory. One note per substantial session, named
`YYYY-MM-DD-<slug>.md`, created from [[../../90-Meta/templates/handoff]].

Handoffs are working memory, not durable decisions. Promote durable outcomes
into [[../../00-Index/Current-State]], accepted ADRs, approved design notes,
feature specs, or implementation docs — then the handoff may be marked
`status: promoted` or `archived`.

Start-of-session: read the latest handoff if continuing a prior thread.
End-of-session: write or update one (see [[../../90-Meta/agent-memory-protocol]]
§ Session Wrap-Up).

This is the **single** canonical handoff location. (An older
`90-Meta/session-handoffs/` folder was consolidated here on 2026-05-22.)

## Naming

`YYYY-MM-DD-<slug>.md`, e.g. `2026-05-22-presentation-renderer-strategy.md`.

## Required sections

- Goals
- Completed
- Open Tasks
- Decisions Made
- Blockers
- Durable Notes Updated
- Promotion Needed

## Handoffs

- [[2026-05-28-fmx-26-staff-backroom]] - FMX-26 ownership dossier for
  Staff & Backroom residual scope after ADR-0052. Three Perplexity
  queries (genre / DDD / real-world 2024-2026 Sporting Director model),
  synthesis recommending Option B (own Staff Operations bounded context
  as 13th), draft ADR-0053 with three options + §Recommendation + §Map
  patch proposal. Awaiting Nico decision.
- [[2026-05-28-fmx-25-manager-legacy-ratification]] - FMX-25 ratification
  pass for ADR-0051 Manager & Legacy Context. Three Perplexity queries
  (roguelite genre, DDD, football-sim precedent), synthesis recommending
  Accept (Option A), ADR-0051 expanded with three concrete options + map
  patch proposal. Awaiting Nico decision.
- [[2026-05-28-ai-narration-framework-testing]] - anchored follow-up AI
  narration testing/framework research into raw notes, synthesis, ADR-0054,
  contract-testing framework and map/current-state updates.
- [[2026-05-28-fmx-23-eos-people-skills-personas]] - anchored the EOS
  Player/Staff Values report and follow-up research into research synthesis,
  draft GD-0020, feature spec, draft ADR-0052 and map/current-state links.
- [[2026-05-27-fmx-16-manager-archetype-roguelite]] - anchored the
  Manager-Archetype Roguelite raw report into research synthesis, draft GDDR,
  draft ADR-0051, MVP hook updates and index/current-state links.
- [[2026-05-27-fmx-13-club-economy-blueprint]] - anchored the club-economy
  raw report into research synthesis, draft GDDR/system notes, feature spec,
  ADR-0050 and implementation-contract notes.
- [[2026-05-27-ai-narrative-runtime-integration]] - promoted the two
  narrative/LLM raw reports into AI narrative runtime research, draft GD-0018
  and draft ADR-0030.
- [[2026-05-22-vault-consistency-pass]] - vault-wide consistency + link-health
  pass: Postgres/Drizzle realignment, supersede/front-door/authority hygiene,
  structure renames, mojibake/BOM repair, broken-link fixes; docs-check green.
- [[2026-05-22-documentation-v1-cleanup]] - consolidated the documentation V1
  baseline.
- [[2026-05-22-notification-messaging-platform]] - locked the notification &
  messaging platform (ADR-0043).
- [[2026-05-22-presentation-renderer-strategy]] - locked the two-renderer
  presentation strategy (ADR-0041).
- [[2026-05-18-mvp-scope-realignment]] - MVP realigned to hybrid-online
  Create-a-Club Roguelite first playable with future selective offline/export
  seams preserved.
- [[2026-05-17-impact-lens-docs]] - player-strength research promoted into
  Impact Lens gameplay, architecture, feature and index docs.
- [[2026-05-17-match-engine-runtime-docs]] - match-engine runtime research
  promoted into architecture, gameplay, implementation and index docs.
- [[2026-05-17-transfer-market-docs]] - transfer-market research promoted into
  the transfer-market architecture, gameplay and implementation docs.
