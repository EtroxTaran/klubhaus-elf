---
title: FMX-188 Prompt Injection Defensive Contract Handoff
status: current
tags: [handoff, execution, ai, llm, prompt-injection, narrative, ugc, community-packs, fmx-188]
created: 2026-06-16
updated: 2026-06-16
type: handoff
binding: false
linear: FMX-188
related:
  - [[../../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]]
---

# FMX-188 Prompt Injection Defensive Contract Handoff

## Goals

- Define the defensive contract for prompt injection from untrusted
  UGC/community-pack text in Narrative LLM prose paths.
- Preserve Perplexity-first research, source checks, synthesis and Nico
  decision questions.
- Patch canonical docs without self-ratifying the guardrail.

## Completed

- Created raw Perplexity capture:
  [[../../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]].
- Created source-check capture:
  [[../../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]].
- Created synthesis:
  [[../../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]].
- Created decision queue:
  [[../fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]].
- Patched ADR-0030, ADR-0059, ADR-0098 and
  [[../../30-Implementation/ai-narration-contract-testing-framework]] with
  proposed FMX-188 guardrails.
- Updated front doors: Research Summary, Research Map, Current State, Decision
  Log, raw Perplexity README and this handoff index.

## Open Tasks

- Nico must answer D1-D6 in the decision queue.
- If accepted, promote the defensive contract from draft/pending wording into
  binding ADR/GDDR/spec wording.
- Future code phase must add the UGC text trust gate, strict Zod schemas,
  prompt-builder escaping, output validator and red-team corpus before any
  UGC-aware runtime LLM release.

## Decisions Made

None by the agent. Recommendations are D1=B/A, D2=A, D3=A, D4=A, D5=A,
D6=A.

## Blockers

- FMX-188 remains decision-pending until Nico approves the guardrail options.

## Durable Notes Updated

- [[../../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
- [[../fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
- [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]

## Promotion Needed

After Nico approval, update the decision queue with accepted answers and either
promote the ADR/spec wording or create a follow-up ratification/apply issue if
Nico wants a narrower scope.
