---
title: Raw LLM Prompt Injection Defensive Contract Source Checks
status: raw
tags: [research, raw, source-check, ai, llm, prompt-injection, narrative, ugc, community-packs, security, fmx-188]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-188
related:
  - [[raw-llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# Raw LLM Prompt Injection Defensive Contract Source Checks

## Method

Perplexity was used as discovery. The claims promoted into the synthesis were
then checked against primary or official documentation where available. Weak
secondary-only claims stay as pattern evidence, not canonical authority.

## OWASP LLM01 Prompt Injection

URL: https://genai.owasp.org/llmrisk/llm01-prompt-injection/

Checked claims:

- Prompt injection includes direct malicious input and indirect attacks where
  instructions are embedded in external content such as files, web pages or
  other documents.
- Impact includes system-prompt leakage, content manipulation, unauthorized
  function access, sensitive-data exposure and critical decision manipulation.
- Mitigations include constraining model behavior, output-format validation,
  input/output filtering, least privilege and human confirmation for high-risk
  actions.

FMX implication:

- UGC/community-pack text must be treated as indirect-prompt-injection input
  when Narrative asks an LLM to summarize or style it.
- The LLM cannot be an authority path. It can only emit validated display text
  or fail to deterministic templates.

## OWASP Prompt Injection Prevention Cheat Sheet

URL: https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html

Checked claims:

- Defenses include input validation/sanitization, structured prompt separation,
  output monitoring/validation, human-in-the-loop controls and least privilege.
- Structured prompts should separate instructions from user data and explicitly
  mark untrusted content.
- Output validation is required because prompt-level instructions alone are not
  a security boundary.

FMX implication:

- `NarrativePromptEnvelope` should isolate trusted facts, untrusted text and
  task instructions as separate fields.
- `NarrativeOutputEnvelope` must be schema-bound and post-validated before
  display; unknown fields and unsafe content fail closed.

## OpenRouter Structured Outputs

URL: https://openrouter.ai/docs/guides/features/structured-outputs.md#structured-outputs

Checked claims:

- OpenRouter supports structured outputs for compatible models via
  `response_format` with `type: json_schema`.
- The official example uses `strict: true` and JSON Schema
  `additionalProperties: false`.
- Model support is selective; callers should check supported parameters and can
  require supported parameters in provider routing.
- Error cases include unsupported structured outputs and invalid schemas.

FMX implication:

- Provider-side structured output is useful but not sufficient. FMX still needs
  local Zod validation and deterministic fallback when a model/provider does
  not support the required response format or returns invalid content.

## Zod 4 Strict Runtime Contracts

Source: Context7 `/websites/zod_dev_v4`, queried 2026-06-16.

Checked claims:

- Zod 4 exposes `z.strictObject(...)` for object schemas that reject
  unrecognized keys.
- Plain `z.object(...)` strips unknown keys by default, so it is not enough
  when extra provider fields must be a hard failure.
- Zod 4 can export JSON Schema from the same runtime schema with
  `z.toJSONSchema(...)`.

FMX implication:

- Boundary contracts should be authored as Zod 4 strict objects and exported to
  provider JSON Schema from the same definitions.
- Unknown fields in provider responses are a validation failure, not silently
  ignored, because tool-call-shaped or state-changing fields may be hostile.

## Steam Workshop

URL: https://partner.steamgames.com/doc/features/workshop

Checked claims:

- Steam documents Workshop as a system where the game/client is responsible for
  how content is loaded and can provide upload tools and content rules.
- Steam documentation points developers toward validation/restriction of
  submitted content and rules about what is allowed.

FMX implication:

- FMX community packs should stay data-only and be loaded through the
  Community Overlay Pipeline, not as arbitrary narrative scripts.
- Pack text fields need a documented trust class and review status before they
  can feed runtime LLM prose.

## Roblox Security Tactics

URL: https://create.roblox.com/docs/en-us/scripting/security/security-tactics.md

Checked claims:

- Roblox's security guidance centers "never trust the client" and server
  authority.
- It recommends threat-modeling features before implementation and keeping
  critical logic validated or executed on the server.

FMX implication:

- For FMX, treat UGC/community-pack text like client-controlled input. It may
  influence presentation only after validation; it cannot own facts, mechanics
  or privileged decisions.

## Roblox TextService

URL: https://create.roblox.com/docs/en-us/reference/engine/classes/TextService.md

Checked claims:

- `FilterStringAsync` filters a user-submitted string and should be called once
  per submitted message.
- If filtering fails, the text should not be displayed to any user.

FMX implication:

- Pack text trust gates should fail closed. If the filter/sanitizer cannot
  classify a text field, FMX should not display it through the LLM path; use a
  deterministic safe template or mark the pack text as review-needed.

## CurseForge / Modpack Pattern

URL checked: https://support.curseforge.com/en/support/solutions/articles/9000197912-sharing-modpacks-custom-profiles

Checked claims:

- The accessible official page confirmed modpack/profile export/import as an
  explicit packaging workflow, including config/mod selection for sharing.
- The previously returned "Project Statuses 101" moderation-status page was
  not reliably accessible in this session and is not promoted as source-checked
  authority.

FMX implication:

- Use CurseForge only as a packaging/dependency precedent here. Moderation
  lifecycle claims are grounded instead in Steam/Roblox plus FMX's own
  Community Overlay IP/privacy gate.

## Source-Check Conclusion

Promoted recommendation:

- Option B, UGC-as-flavor with hard guardrails, is technically viable only if
  FMX adds a text trust gate, strict prompt envelope, strict output envelope,
  no-tool/no-write LLM boundary and deterministic fallback.
- Option A, no UGC in LLM prompts, remains the safest default/kill switch until
  that evidence exists.
- Option C, agentic assistant/tool use, is out of FMX-188 scope and should be a
  separate future decision.
