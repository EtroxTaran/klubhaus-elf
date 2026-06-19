---
title: FMX-193 Responsible gaming binding record handoff
status: current
tags: [execution, handoff, responsible-gaming, dark-patterns, monetization, compliance, fmx-193]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-193
related:
  - [[../../60-Research/responsible-gaming-binding-record-2026-06-15]]
  - [[../../40-Compliance/responsible-gaming]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../fmx-193-responsible-gaming-decision-queue-2026-06-15]]
---

# FMX-193 Responsible gaming binding record handoff

## Branch

`codex/fmx-193-responsible-gaming-binding-record`

## Linear

FMX-193 was moved from `Backlog` to `In Progress` on 2026-06-15 after main was
updated to `bc8dadc`.

## Durable notes updated

- [[../../60-Research/responsible-gaming-binding-record-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-responsible-gaming-legal-regulatory-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-responsible-gaming-game-precedents-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
- [[../../40-Compliance/responsible-gaming]]
- [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
- [[../fmx-193-responsible-gaming-decision-queue-2026-06-15]]

## Packet status

Draft/non-binding. Nico decisions are pending.

Recommended packet: **D1-D7 = A/A/A/A/A/A/A**:

- dedicated ADR-0122 plus compliance home;
- hard ban on paid random rewards / loot boxes / paid packs / paid trading;
- dark-pattern ban plus release self-audit;
- optional local session reminders, default off for 18+;
- versioned responsible-gaming statement now, product route later;
- PM-18 responsible-gaming scope only, OSS/license split to a separate issue;
- responsible-gaming guardrails are binding independently of monetization SKU
  ratification.

## Promotion needed

If Nico accepts D1-D7, promote:

- [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  to `accepted` / `binding: true`;
- [[../../40-Compliance/responsible-gaming]] to `current` / `binding: true`;
- the responsible-gaming rows in PM-18 from unresolved linked placeholders to
  the accepted record.

ADR-0107, ADR-0108 and GD-0041 remain separate decision gates unless Nico
explicitly ratifies them.
