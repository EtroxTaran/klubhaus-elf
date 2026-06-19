---
title: FMX-188 Prompt Injection Defensive Contract Decision Queue
status: accepted
tags: [execution, decision-queue, ai, llm, prompt-injection, narrative, ugc, community-packs, security, fmx-188, accepted]
created: 2026-06-16
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-188
related:
  - [[../60-Research/llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../60-Research/raw-perplexity/raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
---

# FMX-188 Prompt Injection Defensive Contract Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-188.


## Status

Accepted by Nico on 2026-06-19. This queue records recommendations only; no FMX-188 guardrail is
binding after Nico approved it on 2026-06-19.

## D1 - LLM UGC Exposure Posture

Options:

- **A. Air-gapped Narrator.** LLM receives trusted FMX facts only. No UGC text
  enters runtime prompts.
- **B. UGC-as-Flavor with Hard Guardrails.** Sanitized, length-capped,
  delimited community text may enter prompts as flavor only; all factual claims
  come from trusted `NarrativeContextCard` facts.
- **C. Agentic Assistant Path.** Future assistant/tool path can propose actions
  through validated tool schemas.

Recommendation: **B as target, A as default/kill switch; reject C for
FMX-188.**

Reason: B preserves community flavor without crossing the ADR-0030 state
boundary. A is the safe operational fallback until evidence exists. C is a
different attack surface and should get a separate issue/ADR.

## D2 - Owner Split

Options:

- **A. Split ownership.** Community Overlay owns pack text trust classification;
  Narrative owns prompt/output schema validation and fallback; Audit & Security
  owns telemetry/evidence.
- **B. Narrative owns all text safety.** Community Overlay only passes pack
  text through.
- **C. Community Overlay owns the whole LLM defense contract.** Narrative trusts
  imported sanitized fields.

Recommendation: **A.**

Reason: import-time content governance belongs with Community Overlay, runtime
prompt/output behavior belongs with Narrative, and security telemetry belongs
with Audit & Security. B makes Narrative a content-moderation importer. C makes
Community Overlay responsible for provider/runtime behavior it does not own.

## D3 - UGC Text Handling

Options:

- **A. Sanitized flavor-only refs.** Only `community_sanitized` +
  `llmEligible: true` text refs may enter prompts, escaped and capped.
- **B. Raw UGC allowed with prompt instructions.** Trust the system prompt to
  tell the model to ignore malicious text.
- **C. No UGC ever in LLM prompts.** Equivalent to D1 A.

Recommendation: **A.**

Reason: prompt text alone is not a security boundary. A gives the product
benefit with explicit trust labels, source refs, caps and fallbacks.

## D4 - Output Contract

Options:

- **A. Strict structured output + local validation.** Provider JSON Schema
  strict mode where supported; Zod 4 strict local validation always; unknown
  fields fail closed.
- **B. Free-form prose with post-hoc filters.** Let the provider return text and
  run regex/classifier screens.
- **C. Template-only output for community-pack scenes.** No provider output for
  scenes touched by community text.

Recommendation: **A.**

Reason: A minimizes parser ambiguity and lets the same schema drive provider
format and runtime validation. B is too weak for injected command-shaped text.
C is safe but removes the reason to support UGC-aware prose.

## D5 - Failure and Review Policy

Options:

- **A. Fail closed.** Use deterministic fallback, mark text/pack for review or
  quarantine, preserve evidence.
- **B. Best-effort degrade.** Strip suspicious fragments and still call the
  provider when possible.
- **C. User override.** Let local players accept a risky pack and continue.

Recommendation: **A.**

Reason: prompt injection and UGC moderation failures are security/content
signals, not flavor-quality issues. Best-effort salvage creates ambiguous
evidence and user override pushes a security decision into product UX.

## D6 - Release Evidence

Options:

- **A. Mandatory prompt-injection corpus.** OWASP-inspired attack classes plus
  FMX-specific malicious pack fixtures must pass before runtime release.
- **B. Manual playtest only.** Security review is a human checklist.
- **C. Provider safety mode only.** Rely on model/provider safeguards.

Recommendation: **A.**

Reason: model/provider safeguards are useful but not project evidence. FMX
needs regression fixtures that prove authoritative-state isolation, schema
failure, fallback and replay behavior.

## Consolidated Recommendation

Approve **D1=B/A, D2=A, D3=A, D4=A, D5=A, D6=A**.

Operational interpretation:

- target design: UGC-aware prose only through a hard text-trust and schema
  boundary;
- runtime default until evidence: air-gapped narrator or templates;
- every suspicious case: fallback plus evidence, not salvage.

## Nico Decision Log

## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=B target + A default/kill switch, D2=A, D3=A, D4=A, D5=A, D6=A**.

No open Nico decision remains for FMX-188.
