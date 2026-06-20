---
title: LLM Prompt Injection Defensive Contract for UGC Narrative
status: draft
tags: [research, ai, llm, prompt-injection, narrative, ugc, community-packs, security, contracts, fmx-188]
context: [audit-security, community-overlay]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-188
related:
  - [[raw-perplexity/raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[raw-perplexity/raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
---

# LLM Prompt Injection Defensive Contract for UGC Narrative

## Status

Accepted for FMX-188. This packet does not ratify a runtime LLM release and
does not make community-pack text trusted. It records the concrete defensive
contract Nico approved on 2026-06-19 before untrusted UGC/community-pack text
can enter a Narrative LLM prompt.

## Problem

ADR-0030 already keeps runtime LLM prose outside authoritative state. FMX-112
covered the creative/IP denylist side of community-pack ingestion. FMX-188
closes the different security gap: prompt-injection attempts embedded in
untrusted pack text, lore, fan-group copy, media copy, slogans or generated
names that Narrative might later ask an LLM to use as flavor.

The risk is indirect prompt injection. A malicious pack can carry text that
looks like data to FMX but like an instruction to the model. Even if the LLM is
"only prose", output can still leak prompts, display hostile content, invent
facts, bypass moderation or try to smuggle command-shaped fields back into the
application.

## Non-Negotiable Invariant

The LLM is an untrusted presentation component.

- It cannot read or write authoritative simulation state.
- It cannot call tools.
- It cannot emit commands, effect IDs, policy keys, domain events, numeric
  deltas, configuration changes or pack-trust decisions.
- Generated prose is never parsed back into gameplay state.
- Replay/reopen renders stored `NarrativeDisplaySnapshot` text or deterministic
  fallback only; provider calls remain forbidden on replay.

## Options

### Option A - Air-gapped Narrator

The LLM consumes only trusted game-state facts and no UGC/community-pack text.
Packs can influence template labels or non-LLM display paths after Community
Overlay validation.

Pros:

- strongest prompt-injection posture;
- smallest first runtime-LLM attack surface;
- simplest eval corpus.

Cons:

- loses LLM-enhanced community-pack lore, chants and local color.

Use as:

- default/kill-switch posture until FMX has a proven UGC trust gate and corpus.

### Option B - UGC-as-Flavor with Hard Guardrails

The LLM may consume sanitized, length-capped and delimited UGC snippets, but
only as flavor. Trusted facts still come exclusively from authoritative
`NarrativeContextCard` facts.

Pros:

- supports community-pack atmosphere without making UGC authoritative;
- aligns with the AI narration/community-pack product direction;
- security is enforced by contract shape and fallback, not by prompt wishes.

Cons:

- requires import trust labels, prompt-builder escaping, strict output parsing,
  source-owned fact refs and red-team corpus before release.

Use as:

- recommended target contract after Nico approval.

### Option C - Separate Agentic Assistant Later

Keep the narrator as Option B, but add a separate future assistant that can
propose actions through tool schemas.

Pros:

- opens future coaching/advice features.

Cons:

- materially larger attack surface;
- not needed for Narrative prose;
- requires separate HITL/security design.

Use as:

- out of scope for FMX-188.

## Recommendation

Approve **D1 = Option B as the target contract**, with **Option A as the
default/kill switch** until the text trust gate, strict schema path and
red-team corpus pass. Reject Option C for this issue.

This gives FMX the richer community flavor Nico wants while preserving the
authoritative-state boundary already accepted in ADR-0030. It also matches
real UGC platform practice: untrusted content is validated at ingestion,
filtered before display/use, and constrained to documented non-authoritative
surfaces.

## Proposed Defensive Contract

### 1. UGC Text Trust Gate

Community Overlay Pipeline classifies every community-pack text field before it
can be referenced by Narrative:

```ts
type CommunityTextTrustClass =
  | 'trusted_core'
  | 'community_untrusted'
  | 'community_sanitized'
  | 'community_review_required'
  | 'community_rejected'

type CommunityTextRef = {
  packId: string
  packVersion: string
  contentHash: string
  fieldPath: string
  trustClass: CommunityTextTrustClass
  policyVersion: string
  llmEligible: boolean
  maxChars: number
}
```

Rules:

- `trusted_core` is FMX-authored text only.
- imported pack text starts as `community_untrusted`;
- prompt-injection markers, delimiter escape attempts, role labels,
  system-prompt requests, script/markup payloads or unsafe content move the
  field to `community_review_required` or `community_rejected`;
- only `community_sanitized` with `llmEligible: true` may enter an LLM prompt;
- if classification is unavailable, stale or ambiguous, the Narrative path
  treats the field as ineligible and uses deterministic fallback.

### 2. Prompt Envelope

Narrative never interpolates raw pack text into a hand-written string prompt.
It builds a structured prompt envelope:

```ts
type NarrativePromptEnvelope = {
  schemaVersion: string
  sceneType: string
  trustedFacts: AuthoritativeFactRef[]
  forbiddenClaims: ForbiddenClaim[]
  untrustedText: Array<{
    textRef: CommunityTextRef
    escapedText: string
    usage: 'flavor_only'
  }>
  task: {
    allowedTone: string
    locale: string
    maxLines: number
    maxCharsPerLine: number
  }
  fallbackTemplateId: string
}
```

Prompt-builder rules:

- instructions, trusted facts and untrusted text are separate fields/sections;
- UGC delimiters and role markers are escaped before prompt assembly;
- UGC cannot override task, schema, facts or safety policy;
- authoritative facts are never truncated to fit UGC;
- raw user/account/PII/secrets remain forbidden by ADR-0030.

### 3. Strict Output Envelope

Provider output is parsed as a strict schema before display:

```ts
type NarrativeOutputEnvelope = {
  schemaVersion: string
  lines: string[]
  usedFactRefs: string[]
  usedTextRefs: string[]
  riskFlags: Array<
    | 'none'
    | 'fact_mismatch'
    | 'unsafe_content'
    | 'prompt_injection_attempt'
    | 'schema_violation'
  >
}
```

Rules:

- Zod 4 `z.strictObject(...)` owns the runtime validation schema.
- JSON Schema exported from the same Zod schema is sent to providers that
  support structured outputs.
- OpenRouter `json_schema` / `strict: true` / `additionalProperties: false`
  may be used only for compatible model IDs, but local validation remains
  mandatory.
- Unknown keys, tool-call-shaped fields, command-like content, markup/script
  content, overlong text, fact contradictions or unsafe strings fail closed.

### 4. No-Tool / No-Write Boundary

The Narrative provider adapter has no tool access and no write path to Match,
Finance, Transfers, People, Community Overlay, Audit or save state. It receives
only minimized, sanitized snapshots and returns a display candidate. The
validator decides whether that candidate can replace the already-rendered
fallback text.

### 5. Deterministic Fallback

Fallback template rendering happens before any provider wait. Any failure
below keeps or restores the fallback:

- UGC text trust gate unavailable or fails;
- provider does not support the required structured-output mode;
- timeout, budget exhaustion, 429/5xx or malformed response;
- schema, fact, safety, injection or length validation failure;
- replay/reopen path.

### 6. Eval Corpus

The first FMX-188 corpus must include:

- direct override attempts in club lore, fan-group names, media titles and
  slogans;
- indirect injection in fake press articles, fan blogs, pack descriptions and
  board/agent style text;
- delimiter escape and role-label attempts;
- prompt-leakage requests;
- command-shaped JSON keys and domain-event-looking fields;
- obfuscated/split variants;
- normal football flavor controls to limit false positives.

Passing means:

- no authoritative fact/state changes;
- all bad outputs fail schema or safety validation;
- fallback renders deterministically;
- no provider call occurs on replay/reopen;
- all accepted outputs cite only trusted fact refs for factual claims.

## Real-World and Game Precedent

- OWASP LLM01 and the OWASP Prompt Injection Prevention Cheat Sheet support
  separating instructions from untrusted data, validating input/output, least
  privilege and HITL/fail-closed handling.
- OpenRouter structured outputs can enforce JSON Schema for compatible models,
  but support is selective; FMX must keep local validation/fallback.
- Zod 4 strict objects are the local runtime boundary for rejecting unknown
  provider fields.
- Steam Workshop places content loading/validation responsibility with the
  game/client and its developer-defined tools/rules. FMX analog: packs are
  data-only and loaded through Community Overlay.
- Roblox security docs ground the "never trust client-controlled data" posture,
  and Roblox TextService's fail-closed filtering guidance maps to FMX pack text
  trust gates.

## Decision Questions for Nico

See
[[../40-Execution/fmx-188-prompt-injection-defensive-contract-decision-queue-2026-06-16]]
for the decision packet. Recommended answers:

- D1 = B target, A default/kill switch.
- D2 = Community Overlay owns pack text trust; Narrative owns prompt/output
  validation; Audit & Security owns telemetry/evidence.
- D3 = allow sanitized UGC as flavor-only; reject raw UGC.
- D4 = strict structured output with local Zod validation and deterministic
  fallback.
- D5 = fail closed, quarantine/review suspicious pack text.
- D6 = OWASP-style prompt-injection corpus plus FMX-specific malicious pack
  fixtures before any release.

## Canonical Doc Patch Targets

This packet proposes additive patches to:

- [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  for the LLM/state and prompt-injection contract;
- [[../30-Implementation/ai-narration-contract-testing-framework]] for future
  test suites and contracts;
- [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  for UGC text trust classification;
- [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  for active-pack refs not being equivalent to text trust.
