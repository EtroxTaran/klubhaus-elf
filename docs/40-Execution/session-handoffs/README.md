---
title: Session Handoffs
status: current
tags: [meta, execution, hot]
created: 2026-05-17
updated: 2026-05-18
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
