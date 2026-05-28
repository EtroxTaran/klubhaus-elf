---
title: Raw Perplexity - AI Narration Compliance and Safety 2026-05-28
status: raw
tags: [research, raw, perplexity, ai, llm, compliance, ai-act, gdpr, security]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narrative-runtime-integration]]
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
---

# Raw Perplexity - AI Narration Compliance and Safety 2026-05-28

## Prompt

Research 2026 compliance and safety requirements for a European consumer game
using runtime LLM-generated text for fictional in-game narration/dialogue. Cover
EU AI Act Article 50 transparency, machine-readable marking/provenance,
GDPR/data minimization/provider logging and retention, OWASP LLM Top 10
controls, monitoring/kill switch, and release gates. Return concrete checklist
items and URLs.

## Raw findings

- Article 50 should be treated as a release gate for runtime AI narration in an
  EU consumer game. Players need clear information at first interaction or
  exposure, plus accessible persistent information in settings/help.
- Generated text needs machine-readable provenance. The interim FMX contract
  should store `aiGenerated`, provider/model identifier, prompt/schema version,
  fallback template ID, validation status, cache key and timestamp.
- Fictional creative content may have more flexible visible-disclosure handling
  than public-interest text, but this remains a legal review point. Do not rely
  on "obviousness" for MVP.
- GDPR work remains necessary even with fictional game facts: prompt payloads,
  logs, cache keys, provider routing and telemetry can still become personal
  data if they include user names, account IDs, raw text or persistent user
  identifiers.
- Minimize prompts: no email, account ID, IP-derived location, payment/support
  data, secrets, raw user free text, or unmasked user-authored names.
- Provider contracts and configuration must address training use, logging,
  retention, sub-processors, third-country transfers and deletion/DSAR handling.
- OWASP LLM controls map directly to FMX risks: prompt injection, insecure
  output handling, model denial of service/denial of wallet, sensitive
  information disclosure, supply-chain vulnerabilities, excessive agency and
  overreliance.
- Runtime controls should include output moderation, content-policy filters,
  per-user/per-save rate limits, cost caps, provider error monitoring,
  reporting flow, model rollback and global/regional kill switches.
- Model/provider changes should be treated as product releases and require
  regression tests against the narrative evaluation corpus.

## Primary-source refresh used during synthesis

Perplexity returned several secondary legal sources. The synthesis prioritizes
these primary/current references instead:

- EU AI Act Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
- European Commission AI Act overview:
  <https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai>
- OWASP Top 10 for Large Language Model Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI RMF Generative AI Profile:
  <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>

## Handling

This raw note is not authoritative. Promoted release gates and contract
requirements live in [[../ai-narration-world-and-dialogue-mvp-2026-05-28]] and
[[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]].

## Related

- [[../ai-narrative-runtime-integration]]
- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
