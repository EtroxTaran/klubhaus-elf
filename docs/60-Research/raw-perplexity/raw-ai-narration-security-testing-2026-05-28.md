---
title: Raw Perplexity - AI Narration Security Testing 2026-05-28
status: raw
tags: [research, raw, perplexity, ai, llm, security, privacy, compliance, testing]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
sourceType: perplexity
related:
  - [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../ai-narration-testing-framework-2026-05-28]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# Raw Perplexity - AI Narration Security Testing 2026-05-28

## Prompt

Research current security, privacy, and compliance testing recommendations for
LLM-powered narrative/dialogue features in a game/application. Focus on prompt
injection, data leakage, PII minimization, hallucinated unsafe claims,
provenance/disclosure, model fallback, provider outage, and human-facing AI
disclosure. Give MVP-ready test categories and cite authoritative sources.

## Raw findings

- OWASP LLM risks map directly to FMX narration: prompt injection, insecure
  output handling, sensitive information disclosure, model denial of service /
  denial of wallet, supply-chain/provider risk, excessive agency and
  overreliance.
- Treat all model output as untrusted input. It must be schema-validated,
  fact-validated, safety-checked and escaped/sanitized before rendering.
- Prompt injection tests should include generated club names, fan group names,
  journalist copy, media questions, previous conversation snippets and fake
  system-prompt leakage attempts.
- Privacy tests should prove prompt payloads exclude account IDs, email,
  support data, raw user text, secrets, clear user-authored names and internal
  database IDs.
- Security tests should cover model/provider timeout, 429, 5xx, malformed JSON,
  schema violation, unsafe output, over-budget and kill-switch paths.
- Provenance is both a product and compliance control: each output needs
  source, model/provider, prompt/schema version, validation status, fallback
  reason, cache key and `aiGenerated`.
- EU AI Act Article 50 supports first-interaction disclosure for AI systems
  that interact directly with people and machine-readable marking for generated
  content. Legal review still decides the exact visible UX for fictional game
  content.
- NIST AI RMF / GenAI profile supports risk management around data privacy,
  information security, human-AI configuration, harmful bias and third-party AI
  incident response.
- Promptfoo-style red-team tooling can be evaluated later for automated
  security scans, but MVP does not need a new dependency if the project defines
  its own contract/eval corpus first.

## Source links returned / verified

- OWASP Top 10 for Large Language Model Applications:
  <https://owasp.org/www-project-top-10-for-large-language-model-applications/>
- NIST AI Risk Management Framework:
  <https://www.nist.gov/itl/ai-risk-management-framework>
- NIST AI RMF Generative AI Profile:
  <https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence>
- EU AI Act Article 50:
  <https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50>
- Promptfoo red-team guide:
  <https://www.promptfoo.dev/docs/guides/llm-redteaming/>
- Promptfoo quickstart:
  <https://www.promptfoo.dev/docs/red-team/quickstart/>

## Handling

This raw note is not authoritative. Promoted conclusions live in
[[../ai-narration-testing-framework-2026-05-28]],
[[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
and [[../../30-Implementation/ai-narration-contract-testing-framework]].

## Related

- [[../ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../ai-narration-testing-framework-2026-05-28]]
- [[../../30-Implementation/ai-narration-contract-testing-framework]]
- [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
- [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
