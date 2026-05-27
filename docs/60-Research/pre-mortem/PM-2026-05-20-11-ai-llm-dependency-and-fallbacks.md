---
title: "Pre-Mortem 2026-05-20 · 11 · AI/LLM Dependency & Fallbacks"
status: current
tags: [research, pre-mortem, ai, llm, mistral, anthropic, ai-act, fallback, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-11
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[threat-model]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[PM-2026-05-20-13-community-moderation-and-ugc]]
  - [[../narrative-content-pipeline]]
  - [[../ai-manager-behaviour]]
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
---

# Pre-Mortem 2026-05-20 · 11 · AI/LLM Dependency, Content Strategy & Fallback Architecture

> **Failure-Headline-Kandidaten**
> - ”žAnthropic sperrte Dev-Konto wegen ToS-Verdacht — 5 Tage Stillstand, Launch um 2 Wochen verschoben."
> - ”žOpus 4.7 Tokenizer-Update +35 % Kosten über Nacht — Monats-Burn € 380 → € 510."
> - ”žUS-LLM-Anbindung schickte personalisierte Manager-Namen an OpenAI ohne EU-Endpoint — DSAR-Anfrage landete bei BfDI."
> - ”žEU AI-Act Art. 50 trat 2026-08-02 in Kraft — KI-generierte NPC-Dialoge ohne Kennzeichnung; Cease-and-Desist eines Compliance-Anwalts."
> - ”žDeepSeek V3.2 lieferte halluzinierte Spielerstatistiken im Audit-Explainer — Reddit-Screenshot 'Haaland 1987 geboren'."
> - ”žClaude Code Outage am Release-Weekend — 11 h, kein Fallback-Workflow."

**User-Decision (Welle-2)**: **MVP bleibt LLM-frei in Runtime.** Dev-/Build-Time-LLM voll genutzt. Post-MVP: LLM-Use-Cases evaluierbar mit Fallback-Chain.

## Top Failure-Hypothesen

### PM-2026-05-20-11-F-01 — Bus-Faktor ”žAnthropic" im Dev-Workflow

```yaml
id: PM-2026-05-20-11-F-01
priority: P3
domain: ai-llm
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "Anthropic API 5xx Error-Rate (rolling 7d)"
    threshold: "> 2 % oder > 2 Outages/Monat"
  - metric: "Claude Code monthly cost"
    threshold: "> 150 % Q1-Baseline"
  - signal: "ToS-Update relating gaming/UGC"
mitigation_summary: "Sekundärer BYOK-Pfad (Cursor Pro + Aider+OpenRouter); quarterly 'Tag ohne Claude Code'-Drill; lokales Qwen2.5-Coder-32B auf Hetzner GEX44 als Ultimate-Fallback"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Claude Code vs Cursor 2026"
    url: "https://www.builder.io/blog/cursor-vs-claude-code"
    accessed: "2026-05-20"
    publisher: "builder.io"
    confidence: medium
  - title: "Anthropic Status History"
    url: "https://status.anthropic.com/history"
    accessed: "2026-05-20"
    publisher: "Anthropic"
    confidence: high
  - title: "AI Coding Tools Pricing 2026"
    url: "https://spectrumailab.com/blog/ai-coding-tools-pricing-compared-2026"
    accessed: "2026-05-20"
    publisher: "Spectrum AI Lab"
    confidence: medium
verification_notes: "Anthropic > 1.251 Incidents in 2 Jahren laut Aggregator-Daten, MTTR ~177 min. Letzter Major-Outage 2026-05-19 (Opus 4.7)."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Claude Code ist Single-Point-of-Failure unserer Dev-Velocity. Outage 24 h am Release-Wochenende = 1–3 Mannstage Verlust; Account-Ban = bis 5 Mannstage Re-Productivity auf alternativer Pipeline.

**Mitigation.** (1) Cursor Pro ($20/mo) + Aider mit OpenRouter-BYOK als Hot-Backup. (2) Quartärlich ”žTag ohne Claude Code"-Drill. (3) Lokales `qwen2.5-coder:32b` (Ollama) auf GEX44 (€184/Mo, RTX 4000 Ada, 16,9 tok/s) als Ultimate-Offline-Fallback. (4) Alle Skills/Rules editor-agnostisch in `docs/90-Meta/`.

**Verifikation.** Drill-Protokoll mit Time-to-First-Productive-Commit. Ziel: < 4 h Switch-Cost zu Cursor, < 1 d zu Aider+local.

### PM-2026-05-20-11-F-02 — LLM leakt in Match-Engine-Pfad (Determinismus-Bruch)

```yaml
id: PM-2026-05-20-11-F-02
priority: P1
domain: ai-llm
probability: 2
impact: 5
score: 10
confidence: high
early_warning:
  - metric: "ESLint custom rule 'no-llm-in-engine' violations"
    threshold: ">= 1"
  - metric: "Match-Engine offline-canary build"
    threshold: "Any network egress detected"
mitigation_summary: "Statische Lint-Regel + Architectural-Fitness-Function; ADR-0030 LLM-out-of-Authoritative-State"
linked_adrs: [[ADR-0003-match-engine]]
linked_specs: [[PM-2026-05-20-05-security-and-integrity]]
linked_code: ["packages/match-engine/**"]
sources:
  - title: "ADR-0003 Deterministic Match Engine (internal)"
    url: "docs/10-Architecture/09-Decisions/ADR-0003-match-engine.md"
    accessed: "2026-05-20"
    publisher: "internal"
    confidence: high
verification_notes: "Pre-Mortem Report 05 etabliert Determinismus als Anti-Cheat-Foundation; AI-Act-Art-50-Befreiung hängt davon ab."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne harte Boundary wandert ein hilfreicher LLM-Call (”žgenerate flavor string for goal") in den Engine-Pfad → Replay-Determinismus weg → Anti-Cheat tot, BYOC unmöglich, Art-50-Befreiung weg.

**Mitigation.** (1) ESLint `no-restricted-imports` in `packages/match-engine/**` für alle LLM-SDKs (`anthropic`, `openai`, `mistralai`, `@google/genai`, `ollama`) + HTTP-Clients. (2) DI-Container exponiert kein `LLMService` an Engine-Bounded-Context. (3) CI-Canary: Match-Engine-Determinism-Tests laufen mit `--no-net` Sandbox. (4) **ADR-0030 LLM-out-of-Authoritative-Game-State Boundary**.

**Verifikation.** CI-Job `match-engine-offline` schlägt fehl bei Egress. Replay-Snapshot-Tests bit-identische Outputs.

### PM-2026-05-20-11-F-03 — Kosten-Explosion bei post-MVP Runtime-LLM

```yaml
id: PM-2026-05-20-11-F-03
priority: P3
domain: ai-llm
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "LLM cost per DAU"
    threshold: "> € 0.02/DAU/mo bei einem Provider"
  - metric: "Daily token-spend"
    threshold: "> 2× 7d-rolling-median"
mitigation_summary: "Mistral Small/Medium als Primary für DE-Generative; hard daily cost-cap; Template-Fallback IMMER vor LLM-Call"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Claude API Pricing 2026"
    url: "https://benchlm.ai/blog/posts/claude-api-pricing"
    accessed: "2026-05-20"
    publisher: "BenchLM"
    confidence: medium
  - title: "Mistral API Pricing"
    url: "https://mistral.ai/pricing"
    accessed: "2026-05-20"
    publisher: "Mistral AI"
    confidence: high
verification_notes: "Opus-4.7-Tokenizer kann +35 % Kosten bei gleichem Text verursachen. Mistral Small 3.1 ist ~25× günstiger pro Output-Token als Opus 4.7."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Press-Conference-Texte via Opus 4.7 ($25/M out) bei 10k DAU × 500 out-tok/Interaktion/Tag ≈ $3.750/Mo. Mistral Small 3.1 ($0.60/M out): ~$90/Mo gleich.

**Mitigation.** (1) Hard cost-cap pro Use-Case (daily EUR-Cap in Redis-Counter); Überschreitung → 100 % Templates. (2) Default-Provider Mistral Small 3.1 für DE-Generative. (3) Aggressiv cachen (Anthropic Prompt Caching âˆ’90 %). (4) Batch-API wo Latenz egal (Inbox-Nightly): âˆ’50 %.

**Verifikation.** Cost-Canary 7-d-Synthetic-Load gegen jeden Provider, Vergleich EUR/User/mo. Grafana-Alert bei > € 0.02/DAU/d.

### PM-2026-05-20-11-F-04 — DSGVO-Verstoß durch US-LLM ohne EU-Endpoint

```yaml
id: PM-2026-05-20-11-F-04
priority: P3
domain: ai-llm
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "Outbound LLM calls without EU-region header"
    threshold: "> 0"
  - metric: "DSAR-Anfragen eingegangen"
    threshold: ">= 1"
mitigation_summary: "Kein US-LLM-Call mit PII ohne EU-Endpoint. Mistral default; OpenAI nur EU-Project + ZDR; Anthropic nur via AWS Bedrock eu-central-1 oder Vertex Frankfurt"
linked_adrs: []
linked_specs: [[gdpr-compliance]]
linked_code: []
sources:
  - title: "Anthropic vs OpenAI GDPR 2026"
    url: "https://www.aipolicydesk.com/blog/anthropic-vs-openai-gdpr-compliance-2026"
    accessed: "2026-05-20"
    publisher: "AI Policy Desk"
    confidence: medium
  - title: "OpenAI Data Residency in Europe"
    url: "https://openai.com/index/introducing-data-residency-in-europe/"
    accessed: "2026-05-20"
    publisher: "OpenAI"
    confidence: high
  - title: "Anthropic EU Data Residency"
    url: "https://compound.law/en-DE/tools/claude-enterprise/"
    accessed: "2026-05-20"
    publisher: "Compound Law"
    confidence: medium
verification_notes: "Anthropic 2026: KEIN natives EU-Residency, nur via AWS Bedrock Frankfurt oder Vertex EU; Foundry EU 'Coming 2026'. OpenAI: Per-Project EU + ZDR (Zero Data Retention). Mistral: Paris/EU nativ."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+dpo
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Runtime-LLM mit PII (Spielername, Vereinsname, Mail) an US-Endpoint ohne ZDR → BfDI-Beschwerde post-Schrems-II realistisches Reputations-/Bußgeld-Risiko.

**Mitigation.** (1) **PII-Filter-Layer**: Eigennamen vor LLM-Call durch Token (`{{player_name}}`) ersetzen + Antwort rein-substituieren. (2) EU-only Default: **Mistral (Paris)** für PII-Use-Cases. (3) OpenAI nur via EU-Project + ZDR. (4) Anthropic nur via AWS Bedrock eu-central-1 oder Vertex Frankfurt. (5) DPA + SCC verlinkt im Trust-Center; AVV-Register-Eintrag pro Subprocessor.

**Verifikation.** Quarterly DPIA-Light. Network-Egress-Monitoring (Falco/eBPF): keine LLM-Egress außerhalb EU.

### PM-2026-05-20-11-F-05 — EU AI Act Art. 50 Kennzeichnungspflicht verpasst (Deadline 2026-08-02)

```yaml
id: PM-2026-05-20-11-F-05
priority: P3
domain: ai-llm
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - metric: "Audit-Checkpoint AI-Act-Art50"
    threshold: "synthetic-text Outputs ohne machine-readable Marker"
  - metric: "User-facing 'KI-generiert'-Disclosure"
    threshold: "fehlt"
mitigation_summary: "Vor 2026-08-02: Art-50-Compliance-Pack (machine-readable Wasserzeichen + sichtbares Label 'KI-Text'); MVP-Templates-only entlastet"
linked_adrs: []
linked_specs: [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
linked_code: []
sources:
  - title: "Article 50 EU AI Act"
    url: "https://artificialintelligenceact.eu/article/50/"
    accessed: "2026-05-20"
    publisher: "Future of Life Institute"
    confidence: high
  - title: "Code of Practice on AI-generated content"
    url: "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content"
    accessed: "2026-05-20"
    publisher: "European Commission"
    confidence: high
  - title: "Bird & Bird transparency code"
    url: "https://www.twobirds.com/en/insights/2026/taking-the-eu-ai-act-to-practice-understanding-the-draft-transparency-code-of-practice"
    accessed: "2026-05-20"
    publisher: "Bird & Bird"
    confidence: high
verification_notes: "Art. 50 angewendet ab 2026-08-02; Bestandssysteme bis 2026-12-02. Penalty bis € 7,5 M / 1,5 % global turnover. MVP-Templates = nicht kennzeichnungspflichtig."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead+founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **MVP-Templates-only beibehalten** (Determinismus + AI-Act-Befreiung). (2) Post-MVP: KI-Texte mit Tag `[KI]` in UI + invisible C2PA-style watermark im Markdown-Source. (3) `i18n.aiDisclosure` Key pro Locale. (4) AI-Act-Compliance-Checkpoint im Release-Gate (`pnpm verify:ai-act`).

**Verifikation.** Unit-Test asserted: jeder AI-String trägt `data-ai-generated="true"` + i18n-Label.

### PM-2026-05-20-11-F-06 — LLM-Halluzination im User-facing Output ohne Guard

```yaml
id: PM-2026-05-20-11-F-06
priority: P3
domain: ai-llm
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "User reports 'wrong facts in AI text'"
    threshold: ">= 3/week"
  - metric: "Schema validation failures on LLM output"
    threshold: "> 5 %"
mitigation_summary: "Constrained generation (JSON-Schema); Post-Hoc-Fact-Check gegen Game-State; NeMo Guardrails / Llama-Guard für Toxicity; Template-Fallback bei Schema-Violation"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "NeMo Guardrails 2026"
    url: "https://appsecsanta.com/nemo-guardrails"
    accessed: "2026-05-20"
    publisher: "AppSec Santa"
    confidence: medium
  - title: "LLM Guardrails 2026"
    url: "https://aisecurityandsafety.org/en/guides/llm-guardrails/"
    accessed: "2026-05-20"
    publisher: "AI Safety Directory"
    confidence: medium
verification_notes: "Halluzinationen bei Frontier-Modellen bei kreativen Tasks signifikant; Sport-Domain (Spielergeburtstage, Vereinsgründungen) häufige Halluzinationsquelle."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** LLM für ”žErling Haaland"-Press-Conference halluziniert reale Trainingsdaten hinein (Trainingsdaten-Leak). Bei kreierten Spielernamen halluziniert es Stats.

**Mitigation.** (1) **Constrained generation**: JSON-Schema (Sprache DE, max-len, allowed-tokens). (2) Spielernamen generisch maskiert (`{{striker_1}}`) vor LLM-Call. (3) Fact-grounding: Spielerstats explizit im Prompt + Post-Hoc-Regex-Match. (4) Toxicity-Guard: Llama-Guard 3 (lokal) als 50-ms-Filter. (5) Schema-Fail-Fallback: Templates statt LLM-Output.

**Verifikation.** Golden-Set 500 Match-Outputs manuell labellen, Hallucination-Rate < 2 % als Release-Gate.

### PM-2026-05-20-11-F-07 — Lokales LLM-Hosting (Hetzner) nicht ausreichend für synchrone Use-Cases

```yaml
id: PM-2026-05-20-11-F-07
priority: P4
domain: ai-llm
probability: 3
impact: 2
score: 6
confidence: high
early_warning:
  - metric: "P95-Latenz lokales Modell"
    threshold: "> 2 s"
  - metric: "Concurrent inference vs GPU VRAM"
    threshold: "> 3 parallel auf RTX 4000 Ada"
mitigation_summary: "Lokales LLM nur für asynchrone Use-Cases (Nightly-Inbox, Audit-Explainer); synchrone via Mistral-Cloud"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Hetzner GEX44 GPU Server"
    url: "https://www.hetzner.com/dedicated-rootserver/gex44/"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
  - title: "Benchmarking Local LLMs 2026"
    url: "https://dasroot.net/posts/2026/04/benchmarking-local-llms-speed-quality-resource-usage/"
    accessed: "2026-05-20"
    publisher: "dasroot.net"
    confidence: medium
verification_notes: "GEX44 €184/Mo, RTX 4000 SFF Ada 20 GB, Qwen2.5-32B @ IQ4_XS ~16,9 tok/s. Genug für 1–2 parallele User, NICHT für 10k DAU synchron."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Local nur für async (Nightly-Inbox-Batch). Cloud (Mistral) für sync. GEX44 als Dev/Test-Fallback + Embedding-Server. Bei Production-Bedarf: Cluster 2× GEX44 + LiteLLM-Load-Balancer.

### PM-2026-05-20-11-F-08 — Provider-Lock-In durch SDK-Spezifika

```yaml
id: PM-2026-05-20-11-F-08
priority: P4
domain: ai-llm
probability: 3
impact: 2
score: 6
confidence: medium
early_warning:
  - metric: "Direct LLM-SDK-calls outside LLM-adapter"
    threshold: "> 3 Stellen"
mitigation_summary: "Anti-Corruption-Layer: internes LLMService-Interface; OpenRouter oder LiteLLM als unified Backend für Failover"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "OpenRouter Model Fallbacks"
    url: "https://openrouter.ai/docs/guides/routing/model-fallbacks"
    accessed: "2026-05-20"
    publisher: "OpenRouter"
    confidence: high
verification_notes: "OpenRouter erlaubt Failover-Arrays von Modell-IDs; passthrough-pricing + 5,5 % Platform-Fee."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Eigenes `LLMService`-Interface mit `generateText`, `streamText`. Backends: AnthropicAdapter, OpenAIAdapter, MistralAdapter, OllamaAdapter. Optional **OpenRouter** als single-vendor-API. ESLint-Regel: Provider-SDK-Imports nur in `packages/llm-adapter/src/adapters/**`.

### PM-2026-05-20-11-F-09 — Open-Source-Modell-Trainingsdaten-Lizenz-Risiko

```yaml
id: PM-2026-05-20-11-F-09
priority: P4
domain: ai-llm
probability: 2
impact: 3
score: 6
confidence: low
early_warning:
  - metric: "Model card non-commercial restriction"
    threshold: ">= 1"
mitigation_summary: "Nur Modelle mit permissiver Lizenz (Apache-2.0/MIT/Llama-3.x-Community mit Commercial)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "EU AI Act GPAI for OSS Developers"
    url: "https://huggingface.co/blog/yjernite/eu-act-os-guideai"
    accessed: "2026-05-20"
    publisher: "Hugging Face"
    confidence: high
verification_notes: "Llama 3.3 Community License erlaubt commercial bis 700M MAU; Qwen 2.5 Apache 2.0; DeepSeek MIT-Style; Phi 3 MIT. Mistral via API proprietär."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Modell-Lizenz-Liste in ADR-0029: Apache-2.0/MIT/Llama-3-Community/Qwen-Apache. Vermeiden: Llama-2-non-commercial, ”žResearch use only". Bei Mistral/Anthropic/OpenAI: API-ToS reicht.

### PM-2026-05-20-11-F-10 — Cursor-Pricing-Schock: Claude Code Max heute günstigster Power-Plan

```yaml
id: PM-2026-05-20-11-F-10
priority: P4
domain: ai-llm
probability: 2
impact: 2
score: 4
confidence: medium
early_warning:
  - signal: "Anthropic / Cursor Pricing-Change-Announcement"
mitigation_summary: "Switch-Plan: Cursor Pro $20 als Hot-Backup; bei Anthropic-Preisverdopplung Tools-Budget neu"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Cursor vs Claude Code 2026"
    url: "https://www.shareuhack.com/en/posts/cursor-vs-claude-code-vs-windsurf-2026"
    accessed: "2026-05-20"
    publisher: "Shareuhack"
    confidence: medium
verification_notes: "Claude Code via Anthropic Pro $20/Mo - Max-Tier $100-125/Mo. Claude Code ~5,5× token-effizienter als Cursor für gleiche Tasks."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

### PM-2026-05-20-11-F-11 — Halluzinierte Compliance-Antworten im Customer-Support-Bot

```yaml
id: PM-2026-05-20-11-F-11
priority: P3
domain: ai-llm
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "Customer-support bot answers about refund/account-deletion/data-export"
    threshold: "any without retrieval-grounding"
mitigation_summary: "Customer-Support-Bot post-MVP nur RAG mit fixem FAQ-Korpus; 'Ich bin AI; bei rechtlichen Fragen → human'"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "EU AI Act Limited-Risk Transparency"
    url: "https://www.aoshearman.com/en/insights/ao-shearman-on-tech/zooming-in-on-ai-11-eu-ai-act-what-are-the-obligations-for-the-limited-risk-ai-systems"
    accessed: "2026-05-20"
    publisher: "A&O Shearman"
    confidence: high
verification_notes: "Falsche Auskünfte zu DSGVO-Rechten oder Refund-Policy = direkte Compliance- und Reputationsrisiken."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+dpo
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) RAG mit kuratiertem FAQ-Korpus (Markdown im Repo). (2) Hard-coded Topics (”ždata-export", ”ždelete-account") routen direkt zu deterministischen Templates / Human-Hand-off. (3) Pflicht-Disclaimer ”žIch bin eine KI."

**Verifikation.** Adversarial-Testset 100 Fragen rund um DSGVO/Refund; halluzinierte Antwort = Bug-P0.

### PM-2026-05-20-11-F-12 — ToS-Verbot ”žAI-trained-on-AI" für Spielkontext

```yaml
id: PM-2026-05-20-11-F-12
priority: P4
domain: ai-llm
probability: 2
impact: 2
score: 4
confidence: low
early_warning:
  - signal: "OpenAI/Anthropic/Mistral ToS update keywords 'game', 'synthetic data', 'training'"
mitigation_summary: "Outputs nie als persistente Game-State (Determinismus erfüllt das schon); Logs nicht zum Re-Training"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "OpenAI Usage Policies"
    url: "https://openai.com/policies/usage-policies/"
    accessed: "2026-05-20"
    publisher: "OpenAI"
    confidence: high
verification_notes: "OpenAI/Anthropic verbieten 'Building competing models'. Solange LLM-Outputs nur Display-Text: low risk."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Adapter-Layer protokolliert ToS-Version-Hash pro Provider; quartärliche Re-Review. Provider-ToS-Snapshots in `docs/90-Meta/external-tos/`.

## Provider-Comparison-Table (CORE OUTPUT, Mai 2026, $/1M Tokens)

| Provider/Model | $/M in | $/M out | Latenz P50 | EU residency | Free tier | Quality (Arena/Aider) | License/ToS |
|---|---|---|---|---|---|---|---|
| Anthropic Claude Opus 4.7 | 5.00 | 25.00 | ~3–6 s (reasoning) | nur via AWS Bedrock eu-central-1 / Vertex EU | nein | Arena ~1500 (Top-3), Aider ~72 % | API ToS, DPA + SCC |
| Anthropic Claude Sonnet 4.6 | 3.00 | 15.00 | ~1–2 s | nur Bedrock/Vertex EU | nein | starkes Coding/Reasoning | API ToS |
| Anthropic Claude Haiku 4.5 | 1.00 | 5.00 | ~0.5–1 s | nur Bedrock/Vertex EU | nein | gut für Routing/Klassifikation | API ToS |
| OpenAI GPT-5.5 | 5.00 | 30.00 | ~1–2 s (Batch -50 %) | Per-Project EU + ZDR | nein | Arena Top-3 | API ToS |
| OpenAI GPT-5.4 | 2.50 | 15.00 | ~1–2 s | Per-Project EU | nein | Aider 88 % (high reasoning) | API ToS |
| OpenAI GPT-4o | 2.50 | 10.00 | ~0.8 s | Per-Project EU | nein | Arena ~1380 | API ToS |
| Google Gemini 2.5 Pro | 1.25 (<=200k) / 2.50 | 10.00 / 15.00 | ~1–2 s | Vertex AI EU-regions | AI Studio | Arena Top-3 | API ToS |
| Google Gemini 2.5 Flash | 0.30 | 2.50 | ~0.4 s | Vertex AI EU | ja, generös | gut High-Volume | API ToS |
| **Mistral Large 3** | 2.00 | 6.00 | ~1–2 s | **Paris EU nativ** | Experiment | strong, EU-best | API ToS |
| **Mistral Medium 3** | 0.40 | 2.00 | ~0.8 s | **Paris EU** | Experiment | gut für DE-Texte | API ToS |
| **Mistral Small 3.1** | 0.20 | 0.60 | ~0.4 s | **Paris EU** | Experiment (1B tok/Mo) | gut Templates+Generierung | API ToS |
| Mistral Ministral 8B | 0.10 | 0.10 | ~0.3 s | **Paris EU** | ja | klein, kreativ | API ToS + Apache-2.0 weights |
| Codestral | 0.30 | 0.90 | ~0.4 s | **Paris EU** | Experiment | spezialisiert Code | API ToS |
| Groq Llama 3.3 70B | 0.59 | 0.79 | ~0.2 s (LPU!) | nein (US) | 30 RPM/6k TPM/1k RPD | gut | open weights, Groq ToS |
| Groq Llama 4 Scout | ~0.11 / ~0.34 | ~0.11 / ~0.34 | ~0.2 s | nein | ja | Frontier-class open | open weights |
| OpenRouter | passthrough +5.5 % | passthrough +5.5 % | provider-dep. | provider-dep. | nein | beliebig | aggregate ToS |
| Local Ollama Qwen2.5-Coder 32B (GEX44) | selfhost ~€184/Mo | selfhost | ~17 tok/s @ 1 user | **ja, self** | n/a | nahe GPT-4o im Coding | Apache-2.0 |
| Local Llama 3.3 70B (48GB+) | selfhost | selfhost | ~5–12 tok/s | **ja, self** | n/a | strong general | Llama Community |
| Local Phi-3 mini / Qwen2.5-7B (CCX-CPU) | selfhost | selfhost | 1–2 tok/s | **ja, self** | n/a | nur kleine Tasks | MIT/Apache |

Sources per row:
- Anthropic: <https://benchlm.ai/blog/posts/claude-api-pricing>, <https://compound.law/en-DE/tools/claude-enterprise/>
- OpenAI: <https://openai.com/api/pricing/>, <https://openai.com/index/introducing-data-residency-in-europe/>
- Google: <https://ai.google.dev/gemini-api/docs/pricing>
- Mistral: <https://mistral.ai/pricing>, <https://docs.mistral.ai/deployment/ai-studio/tier>
- Groq: <https://groq.com/pricing>, <https://console.groq.com/docs/rate-limits>
- OpenRouter: <https://openrouter.ai/pricing>, <https://openrouter.ai/docs/guides/routing/model-fallbacks>
- Hetzner: <https://www.hetzner.com/dedicated-rootserver/gex44/>
- Local benchmarks: <https://dasroot.net/posts/2026/04/benchmarking-local-llms-speed-quality-resource-usage/>
- Quality: <https://www.swfte.com/ai/leaderboard>, <https://aider.chat/docs/leaderboards/>

## Use-Case × Provider Recommendation Matrix (CORE OUTPUT)

Annahme 10k DAU. USD/Mo.

| Use-Case | Primary | Secondary | Templates Fallback | Cost @ 10k DAU/Mo |
|---|---|---|---|---|
| Dev workflow heute | Claude Code (Anthropic Pro $20) | Cursor Pro ($20), Aider+OpenRouter, Continue+Ollama | n/a | $20–125/seat |
| Press-Conference (post-MVP) | Mistral Small 3.1 (EU) | Mistral Medium 3, Gemini 2.5 Flash | **ja** (Markdown+ICU) | ~$25–90 (batch+cache) |
| NPC manager dialogue | Mistral Medium 3 (EU) | Anthropic Haiku 4.5 Bedrock-EU | **ja** canned per persona | ~$80–200 |
| Inbox dynamic copy | Mistral Small 3.1 (batch âˆ’50 %) | Gemini 2.5 Flash | **ja** 80–120 ICU-Templates | ~$15–40 (nightly) |
| Customer-Support Chat | Mistral Small 3.1 + RAG (EU) | OpenAI GPT-4o EU-Project | **ja** statisches FAQ + Hand-off | ~$30–80 |
| Translation QA | Mistral Large 3 (EU) | Claude Sonnet via Bedrock-EU | n/a | ~$10 |
| Audit-Anomaly-Explainer | local Qwen2.5-14B on GEX44 | Mistral Small 3.1 | n/a (zeigt nur Daten) | 0 (selfhost amortized) |
| Game-State-Explainer | Mistral Medium 3 (EU) | Gemini 2.5 Flash | **ja** rule-based | ~$20–50 |
| **NEVER** Match-Engine | – | – | **only deterministic** | 0 (must be) |
| **NEVER** Player-Attribute-Generation | – | – | **only PCG32 from seed** | 0 (must be) |
| **NEVER** Authoritative Game-State | – | – | **only deterministic** | 0 (must be) |

## Fallback-Chain-Architecture (CORE OUTPUT)

```
Request → Cost-Cap-Counter → Cache-Lookup → Circuit-Breaker
  → Primary: Mistral Small 3.1 (EU)         [800ms timeout]
  → Secondary: Mistral Medium 3 (EU)        [1500ms]
  → Tertiary: Gemini 2.5 Flash via Vertex EU [1500ms]
  → Templates (ICU deterministic, always succeeds)

Post-LLM Guards:
  - JSON-schema validation
  - PII re-substitution
  - Llama-Guard / regex toxicity
  - Hallucination fact-check vs game-state hash
  Any fail → Templates

AI-disclosure label (Art. 50) → Display
```

Circuit-Breaker (Hystrix): Window 60 s, threshold 50 % failures über >=10 Requests → open. Half-open Probe every 30 s; 3 consecutive successes → close.

Time-Budget: 800 ms sync user-facing; 30 s async batch (Inbox-Nightly).

Cost-Cap pro Use-Case/Tag: Press-Conf €5, NPC €8, Support €3, Translation €2, Audit €0 (lokal).

## EU AI Act Compliance Assessment

- **Risk class**: text-only Manager-Sim mit deterministischen Templates = **minimal risk**. LLM-Runtime für End-User-Outputs = **limited risk** mit Art-50-Transparenz-Pflicht.
- **Art. 50 (gilt ab 2026-08-02; Bestand bis 2026-12-02)**: synthetic-Text machine-readable als KI-generiert markiert (C2PA-style watermark im Markdown-Source); user-facing Disclosure-Label.
- **Code of Practice** (Draft Mar 2026, Final Jun 2026) als de-facto-Standard.
- **GPAI**: wir konsumieren, trainieren nicht → wir sind ”žDeployer". Article 4 (AI Literacy seit 2025-02-02) gilt: Founder + Team brauchen nachweisbar AI-Literacy (Onboarding-Modul ”žLLM-Risiken").
- **MVP-Status mit Determinismus + Templates befreit uns weitgehend** — starkes Argument für Templates-First.

## Quantitatives Modell

10k DAU, 20 % Engagement (Interaktion mit LLM-Feature), 1 Interaktion/Tag = 60k Interaktionen/Mo pro Use-Case.

| Use-Case | tok in/int | tok out/int | mo tok in (M) | mo tok out (M) | Mistral Small | Opus 4.7 | Gemini Flash |
|---|---|---|---|---|---|---|---|
| Press-Conf | 400 | 200 | 24 | 12 | $12 | $420 | $37 |
| NPC dialogue | 800 | 300 | 48 | 18 | $21 | $690 | $60 |
| Inbox (batch -50 %) | 300 | 150 | 18 | 9 | $4.5 | $157 | $14 |
| Support chat | 800 | 250 | 48 | 15 | $19 | $615 | $52 |
| Translation QA | 1000 | 100 | 12 (Wave) | 1.2 | $3 | $90 | $7 |
| **Total Mistral-Stack** | – | – | – | – | **~$60/Mo** | **~$2.000/Mo** | **~$170/Mo** |

Bei 30 % Cache-Hit-Rate + Prompt-Caching (âˆ’90 % Anthropic / âˆ’50 % Mistral cached input): Mistral-Stack realistisch **~$30–40/Mo**.

**Break-Even local vs cloud**: GEX44 €184/Mo + Setup vs $60/Mo Mistral-Stack. Cloud klar billiger; lokal lohnt erst > $300/Mo Cloud-Spend ODER bei strenger EU-Residency-Notwendigkeit. **Cloud-first via Mistral, lokal nur sensitive async.**

**Latenz-Budget sync 800 ms total**: Network EU←”Paris ~30–50 ms + Mistral Small Inference ~300–400 ms (200 out tok) + Guards ~30 ms + Cache ~5 ms = ~300 ms Reserve.

## SLO-Vorschläge

1. **LLM response latency P99 ≤ 1.500 ms** (oder Templates-Fallback).
2. **Fallback-rate (LLM→Templates) ≤ 5 %** monatlich; bei > 5 % Provider-Health-Review.
3. **Daily-cost-cap per use-case** (EUR-fixed); > 100 % → Templates erzwungen.
4. **Hallucination-detected rate ≤ 1 %** (schema-fail + Golden-Set-Spot-Check).
5. **Provider-availability ≥ 99,5 %** (rolling 30d) — bei < 99 % Sekundär als Default.
6. **AI-Disclosure-Marker coverage = 100 %** (CI-Assertion).

## Test-Plan

- **Synthetic Outage**: ChaosMonkey-style scheduled Provider-Down (Mistral 1 h/Woche in Staging); Fallback-Chain bis Templates validiert.
- **Integration tests mit mocked LLMs**: Adapter-Layer hat Vitest-Mocks pro Provider; Edge-Cases 5xx, 429, malformed JSON, timeout, toxicity-positive.
- **Cost-Canary in Staging**: synthetic 24h-load 50k Requests gegen jeden Provider; cost-per-1k in Grafana; Alert bei Drift > 20 %.
- **Determinism-Canary**: Match-Engine + Replay-Test im `--no-net` Sandbox.
- **Adversarial-Test**: 200 prompt-injection-Versuche; Pass-Rate >= 99 %.
- **Hallucination Golden-Set**: 500 game-state-snapshots; Fact-Match-Score; Release-Gate >= 98 %.
- **Locale-Switch**: DE-Outputs validieren, kein EN-Leak; Anti-mixed-language regex.

## Runbook-Skizzen

### RB-11-A: Anthropic-Outage detected
1. Pager via Statuspage-Scraper.
2. Bei Dev-Tool-Outage > 30 min: Cursor Pro (Backup-Account) + Aider als Terminal-Backup.
3. Bei Runtime-Outage: Circuit-Breaker öffnet automatisch → Mistral Medium (sekundär) oder Templates.
4. Cost-Bookkeeping: Sekundär-Provider-Spike 4h OK, > 4h Templates-Only erzwingen.

### RB-11-B: LLM-Cost-Cap exceeded
1. Grafana-Alert (> 200 % rolling-7d median).
2. Auto-rollback: Use-Case-LLM disabled, Templates-Only.
3. Diagnose: Tokenizer-Drift? Prompt-Bloat? Cache-Miss? Replay-Attack?
4. Legitime Demand → Cap raisen (Founder-Approval). Token-Drift → Provider-Wechsel.

### RB-11-C: Halluzination in Production
1. User-Report / Schema-Validation-Fail-Alert.
2. Sofort Feature-Flag `llmEnabled=false` → Templates-Fallback.
3. Sample-Audit letzte 1k Outputs; PII-Leakage-Check parallel.
4. Systematisch: Provider-Wechsel oder Prompt-Hardening + Retrieval-Grounding.
5. Trust-Center-Note + ggf. korrigierte In-Game-Message.
6. Re-enable nur nach Golden-Set re-pass.

## Future-scope decisions (classified future-scope)
1. Wann darf Mistral statt Templates greifen? Konkrete Trigger pro Use-Case (z.B. ≥ 3 Templates → rotation; < 3 → LLM-augment).
2. Anthropic Bedrock EU vs Mistral nativ bei ~50–100 USD/Mo Spend (AWS-Account-Overhead vs Mistral-direct)?
3. **AI-Literacy-Modul (Art. 4)** — inhouse oder externes Training? DE-Sprachiges Modul?
4. Lokales LLM (Ollama) als Privacy-Anchor für Audit-Explainer — lohnt GEX44 (€184/Mo) auch ohne hohen Cloud-Spend? Alt: Modal/Replicate Spot-on-Demand.
5. Player-data-Redaction-Policy: welche Felder nie an Server, welche nur EU-Hosts, welche US mit ZDR? → separates **ADR-0031** mit DPO-Sign-Off.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **MVP bleibt LLM-frei in Runtime.** Markdown + ICU-Templates für 100 % User-facing Texte. Spart Cost + Komplexität + Determinismus-Risiko + AI-Act-Pflichten. (Highest leverage; aligned mit Narrative-Pipeline-Decision.)
2. **LLMService-Adapter + Mistral-as-default + Fallback-Chain bauen, sobald erster post-MVP-LLM-Use-Case kommt.** Kein direkter SDK-Call außerhalb `packages/llm-adapter/`. Erzwingt Provider-Agnostik, EU-Residency-Default, Cost-Cap, Guards.
3. **Dev-Tool-Bus-Factor-Drill quartärlich.** 1 Sprint-Woche ohne Claude Code (Cursor + Aider + Ollama-Backup). Garantiert Recovery < 1 d.

## ADR-Vorschläge

- **ADR-0029 LLM Provider Selection & Fallback Chain**
- **ADR-0030 LLM-out-of-Authoritative-Game-State Boundary**
- **ADR-0031 PII Redaction & EU-LLM-Routing-Policy**
- **ADR-0032 EU AI Act Article 50 Compliance**
- **ADR-0033 Dev-Tooling Bus-Factor Plan**

## Verfolgung & Verkettung

IDs `PM-2026-05-20-11-F-NN`. Aggregat: [[findings-registry]].
## Related

- [[00-index]]
- [[findings-registry]]
- [[threat-model]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
- [[PM-2026-05-20-13-community-moderation-and-ugc]]
- [[../narrative-content-pipeline]]
- [[../ai-manager-behaviour]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
