---
title: "Pre-Mortem 2026-05-20 · Prioritization Matrix"
status: current
tags: [research, pre-mortem, prioritization, matrix, index, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: index
binding: false
report_set: 2026-05-20
related:
  - [[00-index]]
  - [[execution-index]]
  - [[findings-registry]]
  - [[threat-model]]
---

# Pre-Mortem 2026-05-20 · Prioritization Matrix

> **Zweck.** Visualisiert die ~191 Findings nach **Wahrscheinlichkeit × Impact** (klassisches Risiko-Heatmap-Modell) UND nach **Score × Effort** (Hebel-Modell für Ressourcen-Allokation). Schwesterdatei zu [[execution-index]] (expertise-basierte Gruppierung) und [[findings-registry]] (priorisierte Status-Tabelle).

## Lese-Reihenfolge

- **[[execution-index]]** zuerst: was bearbeitet welche Expertise?
- **[[findings-registry]]**: vollständige P0–P4-Tabelle mit Status-Tracking
- **Diese Matrix**: visueller Cross-Check + Hebel-Identifikation

## Prioritäts-Schema (vereinheitlicht über Cluster)

| Tag | Definition | Count |
|---|---|---|
| **P0** | Pre-Launch-Blocker: Score 25 ODER harter regulatorischer Stichtag ≤ 12 Mo ODER P0-Total-Outage | **13** |
| **P1** | Pre-Launch dringend empfohlen: Score 20–24 | **37** |
| **P2** | Erste 90 Tage Post-Launch: Score 16–19 | **24** |
| **P3** | Erste 6 Monate Post-Launch: Score 9–15 | **73** |
| **P4** | Backlog / accepted-risk: Score < 9 oder Future-Scope | **44** |

## Risiko-Heatmap: Wahrscheinlichkeit × Impact

Findings nach (Wahrscheinlichkeit 1–5) × (Impact 1–5). **Score = P × I**. Format: `<Finding-ID-kurz>` mit Domain-Präfix.

|  | **Impact 1** | **2** | **3** | **4** | **5 (existenziell)** |
|---|---|---|---|---|---|
| **Wahrscheinl. 5** (fast sicher) | – | – | 13-F-05 (15) · 13-F-10 (12) · 15-F-05 (9) · 09-F-05 (15) · 14-F-06 (15) · 17-F-11 (10) · 18-F-04 (20) | 08-F-04 (10) · 08-F-06 (20) · 12-F-02 (20) · 13-F-03 (20) · 13-F-04 (20) · 18-F-08 (20) · 18-F-02 (20) · 17-F-07 (25) | 01-F-02 (25) · 02-F-04 (25) · 04-F-01 (25) · 05-F-01 (25) · 05-F-02 (25) · 10-F-01 (25) · 13-F-01 (25) · 14-F-01 (25) · 15-F-01 (25) · 16-F-02 (20)<sup>P=4</sup> |
| **4** (sehr wahrscheinlich) | – | 09-F-04 (8) · 09-F-08 (8) · 09-F-09 (8) | 01-F-01 (16) · 02-F-01 (16) · 02-F-10 (16) · 03-F-04 (16) · 04-F-04 (16) · 05-F-04 (16) · 07-F-03 (16) · 10-F-03 (16) · 10-F-06 (16) · 10-F-11 (16) · 11-F-06 (12) · 11-F-11 (12) · 12-F-04 (16) · 13-F-06 (16) · 14-F-02 (16) · 14-F-07 (16) · 15-F-04 (16) · 16-F-01 (16) · 18-F-07 (20)<sup>I=5</sup> | 03-F-01 (20) · 03-F-02 (20) · 03-F-03 (20) · 04-F-02 (20) · 04-F-07 (20) · 05-F-03 (20) · 05-F-05 (20) · 07-F-01 (20) · 07-F-02 (20) · 07-F-08 (20) · 10-F-02 (20) · 12-F-01 (20) · 12-F-03 (20) · 12-F-08 (20) · 15-F-02 (20) · 15-F-09 (16)<sup>P=4,I=4</sup> · 16-F-04 (20) · 16-F-05 (20) · 16-F-06 (20) · 16-F-10 (20) |
| **3** (möglich) | 04-F-09 (8) · 17-F-12 (6) | 11-F-10 (4) · 12-F-09 (9) · 15-F-05 (9) · 17-F-05 (6) · 17-F-08 (6) · 17-F-10 (6) · 18-F-11 (6) · 18-F-12 (6) · 18-F-09 (9) · 18-F-10 (9) | 01-F-08 (9) · 01-F-10 (9) · 02-F-09 (9) · 03-F-05 (12) · 03-F-06 (12) · 03-F-08 (12) · 03-F-07 (9) · 03-F-09 (9) · 03-F-10 (9) · 04-F-03 (12) · 04-F-08 (12) · 04-F-10 (12) · 05-F-11 (9) · 06-F-06 (9) · 06-F-08 (12) · 06-F-09 (12) · 06-F-10 (12) · 07-F-05 (15) · 07-F-06 (12) · 07-F-07 (12) · 07-F-10 (12) · 08-F-01 (12) · 08-F-03 (12) · 08-F-08 (12) · 08-F-13 (4) · 09-F-01 (12) · 09-F-02 (12) · 09-F-03 (12) · 09-F-06 (9) · 09-F-07 (9) · 09-F-10 (9) · 10-F-04 (12) · 10-F-08 (12) · 10-F-09 (9) · 10-F-10 (9) · 11-F-01 (12) · 11-F-03 (9) · 11-F-04 (12) · 11-F-05 (9) · 11-F-07 (6) · 11-F-08 (6) · 11-F-09 (6) · 12-F-05 (15) · 12-F-06 (12) · 12-F-07 (9) · 13-F-07 (12) · 13-F-08 (12) · 13-F-09 (12) · 13-F-11 (12) · 14-F-03 (12) · 14-F-04 (12) · 14-F-05 (12) · 14-F-09 (9) · 15-F-03 (12) · 15-F-06 (12) · 15-F-07 (9) · 16-F-03 (9) · 16-F-07 (9) · 16-F-08 (9) · 16-F-09 (9) · 17-F-06 (9) · 18-F-01 (9) · 18-F-03 (9) · 18-F-06 (9) · 18-F-05 (4)<sup>P=2</sup> | 02-F-05 (12) · 02-F-07 (12) · 02-F-08 (12) · 06-F-02 (15) · 06-F-03 (15) · 06-F-07 (12) · 07-F-04 (15) · 08-F-10 (15) · 08-F-11 (15) · 12-F-10 (16)<sup>P=4</sup> · 13-F-02 (20)<sup>P=4</sup> · 17-F-01 (15) · 17-F-02 (15) · 17-F-03 (12) · 17-F-04 (15) · 02-F-06 (15) · 05-F-06 (12) · 05-F-07 (15) · 05-F-08 (12) · 05-F-09 (15) · 05-F-10 (15) · 05-F-12 (12) · 01-F-04 (12) · 01-F-05 (12) · 01-F-07 (12) · 01-F-09 (12) | 04-F-06 (15) · 08-F-12 (4)<sup>P=2,I=2</sup> · 11-F-12 (4) · 17-F-09 (10)<sup>P=2,I=5</sup> · 14-F-08 (6)<sup>P=3,I=2</sup> |
| **2** (unwahrscheinlich) | 06-F-04 (20)<sup>P=4,I=5</sup> | 05-F-11 (9)<sup>P=3,I=3</sup> · 14-F-08 (6) · 17-F-05 (6) · 17-F-08 (6) · 17-F-10 (6) · 18-F-05 (4) · 18-F-11 (6) · 18-F-12 (6) | 02-F-09 (9)<sup>P=3,I=3</sup> · 11-F-07 (6) · 11-F-08 (6) · 11-F-09 (6) · 11-F-10 (4) · 11-F-12 (4) | 04-F-05 (10) · 08-F-07 (8) · 15-F-08 (8) · 07-F-09 (10) · 17-F-09 (10) | 11-F-02 (10) · 06-F-01 (20)<sup>P=4</sup> · 06-F-05 (20)<sup>P=4</sup> |
| **1** (selten) | 08-F-09 (3) | – | – | – | – |

> Hochgestellte Annotationen wie `<sup>P=4</sup>` zeigen die korrigierte Position (Tabelle vereinfacht — die echte P×I-Klassifikation steht im YAML jedes Findings).

### Heatmap-Quick-Read

- **Tiefrote Zone (P=5, I=5, Score 25)**: 9 Findings — alles muss vor Public-Launch adressiert sein.
- **Rote Zone (Score 20–24)**: 37 Findings — Pre-Launch-Hardening-Sprint.
- **Orange Zone (Score 16–19)**: 24 Findings — Erste 90 Tage Post-Launch.
- **Gelbe Zone (Score 9–15)**: 73 Findings — Erste 6 Monate.
- **Grüne Zone (Score < 9)**: 44 Findings — Backlog, inkl. BYOC-Future-Scope.

## Hebel-Matrix: Score × Effort

Anders gelesen: hohe Wirkung pro Aufwand = höchster Hebel. Effort: **S** (≤ 3 PT), **M** (3–10 PT), **L** (≥ 10 PT).

### Höchster Hebel (Score ≥ 20, Effort S–M) — „Quick-High-Impact"

Diese sollten zuerst gepickt werden:

| Finding | Score | Effort | Hebel-Note |
|---|---|---|---|
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03\|05-F-03]] — Determinism-CI-Gate | 20 | M | **Foundation-Hebel** (Anti-Cheat + BYOC + AI-Act + Replay) |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-01\|07-F-01]] — RUM-Coverage | 20 | M | Sichtbarkeit-Foundation |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-08\|07-F-08]] — Service-Hours + Backup-Buddy | 20 | S | Founder-Schutz, ~0 Code |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02\|10-F-02]] — BFSG Accessibility-Statement | 20 | M | Compliance-Pflicht |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-01\|15-F-01]] — iOS-Safari A2HS-Onboarding | 25 | M | 30 % Mobile-Markt rettet |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-02\|15-F-02]] — gzip + Pre-Write-Quota-Probe | 20 | M | Foundation Storage |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04\|16-F-04]] — Determinism-Tiered-CI | 20 | M | Cross-cutting Foundation |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-09\|17-F-09]] — INWX + DNS-Resilience | 10 | S | 1 PT, eliminiert Threat-Class |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-08\|18-F-08]] — gitleaks + Push-Protection | 20 | S | 4h Setup, 99 % Schutz |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05\|08-F-05]] / [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-01\|14-F-01]] — Rebrand SEGA/SI | 25 | M | Eine Anwältin-Stunde + Domain = Existenz-Risiko aus dem Weg |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11\|08-F-11]] / [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01\|13-F-01]] — DSA Art. 16 Webform + Mail | 25 | M | Webform + Mail-Setup; DSGVO + DSA compliance |

### Höchster Score, höchster Effort (Score ≥ 20, Effort L) — „Major-Investment-Decisions"

Strategische Entscheidungen, brauchen Sprint-Planung:

| Finding | Score | Effort |
|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02\|01-F-02]] — SurrealDB SPOF → Cloud-Autoscaling | 25 | L |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04\|02-F-04]] — Backups Restore-Drill | 25 | L |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01\|04-F-01]] — Monetarisierungs-Hypothese | 25 | L (strategic) |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] — Save-Schema v2 | 25 | L |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02\|05-F-02]] — Command Signing | 25 | L |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-01\|10-F-01]] — react-aria DnD für Tactic-Board | 25 | M-L |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] — Versioned Balance Constants | 20 | L |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-02\|13-F-02]] — § 86a Wappen-Pipeline | 20 | L |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04\|13-F-04]] — Mod-Tier-System | 20 | L |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-02\|17-F-02]] — SurrealDB Fallback-Adapter | 15 | L |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-02\|18-F-02]] — License-Decision (AGPL-3.0 split-repo) | 20 | M (Entscheidung) |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-07\|18-F-07]] — Split-Repo Architecture | 20 | M (Refactor) |

## Score × Confidence-Matrix

Mit welcher Sicherheit kennen wir das Risiko? Helps prioritise validation effort.

| Score-Band | High Confidence | Medium Confidence | Low Confidence |
|---|---|---|---|
| Score 20+ | 27 Findings — sicher relevant | 8 Findings — Annahme validieren | 1 Finding — externe Recherche |
| Score 16–19 | 18 Findings | 5 Findings | 1 Finding |
| Score 9–15 | 38 Findings | 31 Findings | 4 Findings |
| Score < 9 | 19 Findings | 22 Findings | 3 Findings |

**Implikation**: P0/P1 sind großmehrheitlich high-confidence — sofort handeln. P3/P4 mit low/medium confidence brauchen ggf. Validation vor Aufwand-Allokation.

## Regulatorische Deadlines als harte Constraint-Linie

Findings die an regulatorische Stichtage gekoppelt sind:

| Datum | Finding | Action-Deadline |
|---|---|---|
| **2026-08-02** | [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-05\|11-F-05]] AI-Act Art. 50 (neue Systeme) | Bei erstem Runtime-LLM |
| **2026-08-02** | [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-12\|08-F-12]] AI-Act Art. 50 | Bei erstem Runtime-LLM |
| **2026-09-11** | [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07\|17-F-07]] **CRA Vulnerability-Reporting** | **Pflicht — 24h-SLA ab CVSS ≥ 9.0** |
| **2026-12-02** | AI-Act Art. 50 für Bestandssysteme | Falls LLM aktiviert |
| **Q4 2026** | EU Digital Fairness Act Proposal | Watch + [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04\|18-F-04]] |
| **2027-08-02** | AI-Act High-Risk-System-Pflichten | nicht uns betreffend |
| **2027-12-11** | **CRA volle Anwendbarkeit (SBOM, 5-Jahre-Updates)** | [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07\|17-F-07]] |
| **DSA seit 2024-02** | [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11\|08-F-11]] / [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01\|13-F-01]] Art. 16 Notice | sofort bei UGC-Public |
| **BFSG seit 2025-06** | [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02\|10-F-02]] EAA / BFSG | sofort bei E-Commerce-Funktion |

## Cross-Cutting-Cluster (gleiche Root-Cause, mehrere Findings)

Diese gehören gemeinsam gefixt — das spart 30–60 % Aufwand:

### Cluster A — „Determinismus-Foundation" (5-fach-Hebel)
Eine Implementierung (Tiered-CI-Gate mit Hash-Diff + Engine-Bundle-Hash) löst:
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02\|02-F-02]] Tech-Drift
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02\|03-F-02]] Gameplay-Replay-Drift
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03\|05-F-03]] Anti-Cheat-Foundation
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-02\|11-F-02]] LLM-Boundary + AI-Act-Befreiung
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] Balance-Hotfix-Replay-Schutz
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04\|16-F-04]] Tiered-CI-Gate
- BYOC-Voraussetzung (Report 06)

### Cluster B — „Save-Schema v2 mit trust_level" (5-fach)
Eine Save-Format-Migration löst:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] Save-Forgery
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] Versioned Balance Constants
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-03\|15-F-03]] Brotli + engine_bundle_hash Header
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-09\|15-F-09]] DevTools-Tampering-Schutz
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05\|16-F-05]] Save-Forward-Compat-Matrix
- BYOC-Voraussetzung (Report 06)

### Cluster C — „DSA Art. 16 + UGC-Block-List" (3-fach)
Eine Implementierung (Webform + 6-Stufen-Matcher) löst:
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-06\|08-F-06]] UGC DFL-Logos
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11\|08-F-11]] DSA Art. 16
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01\|13-F-01]] Notice-SLA
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-03\|13-F-03]] Vereins-Blocklist
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-10\|13-F-10]] Username-Squatting

### Cluster D — „Founder-Bus-Faktor" (5-fach, organisatorisch)
Ein Service-Hours + Backup-Buddy + Workflow-Doc löst:
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-08\|07-F-08]] Live-Ops-Burnout
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-01\|08-F-01]] (indirekt) Legal-Response-Zeiten
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-01\|11-F-01]] Claude-Code-Bus-Faktor
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04\|13-F-04]] Mod-Burnout
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-01\|17-F-01]] Hetzner-Single-Account-Suspend

### Cluster E — „MVP-Linie: ohne X" (8-fach Constraint)
Ein einzelner ADR „MVP-Scope-Linie" dokumentiert:
- Kein Runtime-LLM ([[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks|Report 11]])
- Kein Image-Upload ([[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-02\|13-F-02]])
- Kein Free-Form-Chat ([[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-08\|13-F-08]])
- Kein aktives Marketing ([[PM-2026-05-20-14-brand-pr-and-crisis-comms|Report 14]])
- Kein Cloudflare-Workers-Lock ([[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-06\|17-F-06]])
- WebAuthn nicht required ([[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-08\|15-F-08]])
- Keine Lootboxes ([[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-10\|08-F-10]])
- Keine Daily-Login-Streaks ([[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04\|18-F-04]])

### Cluster F — „Vendor-Adapter-Layer" (4-fach)
Eine Repository-Pattern-Investition löst:
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-02\|17-F-02]] SurrealDB ↔ Postgres-Switch
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-04\|17-F-04]] Stripe ↔ Paddle-Switch
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-05\|17-F-05]] GlitchTip ↔ Sentry-Switch
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-08\|11-F-08]] LLM-Provider-Switch (Mistral ↔ OpenAI ↔ Anthropic)

### Cluster G — „CRA + License + SBOM" (3-fach)
Ein CI-Gate löst:
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07\|17-F-07]] CRA-SBOM-Pflicht
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-02\|18-F-02]] License-Decision (AGPL-3.0)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-05\|05-F-05]] Supply-Chain-Hardening

## Domain-Verteilung der ~191 Findings

| Domain | P0 | P1 | P2 | P3 | P4 | Total |
|---|---|---|---|---|---|---|
| Architecture (01) | 1 | 2 | 1 | 4 | 2 | 10 |
| Tech & Ops (02) | 1 | 2 | 2 | 4 | 1 | 10 |
| Gameplay (03) | 0 | 3 | 1 | 3 | 3 | 10 |
| Monetization (04) | 1 | 2 | 1 | 4 | 2 | 10 |
| Security & Integrity (05) | 2 | 2 | 1 | 6 | 1 | 12 |
| BYOC (06, Future) | 0 | 0 | 0 | 0 | 10 (accepted-risk) | 10 |
| Live-Ops (07) | 0 | 3 | 1 | 5 | 1 | 10 |
| Legal/Tax (08) | 3 | 0 | 2 | 5 | 3 | 13 |
| i18n (09) | 0 | 0 | 1 | 7 | 2 | 10 |
| Accessibility (10) | 1 | 1 | 4 | 3 | 2 | 11 |
| AI/LLM (11) | 0 | 1 | 0 | 6 | 5 | 12 |
| Long-Term Balance (12) | 0 | 4 | 3 | 2 | 1 | 10 |
| Community/UGC (13) | 1 | 3 | 2 | 5 | 0 | 11 |
| Brand/PR (14) | 1 | 0 | 3 | 4 | 1 | 9 |
| Browser/Storage (15) | 1 | 2 | 1 | 4 | 1 | 9 |
| Test-Strategy (16) | 0 | 5 | 1 | 4 | 0 | 10 |
| Vendor/ESG (17) | 1 | 3 | 1 | 2 | 5 | 12 |
| Responsible-Gaming/OSS (18) | 0 | 4 | 0 | 5 | 3 | 12 |
| **Total** | **13** | **37** | **24** | **73** | **44** | **~191** |

## Empfohlene Sprint-Belegung (Pre-Launch T-90 → T-0)

### Sprint 1–2 (T-90 → T-60): „Foundation-Sprint"

Alle Findings aus **Cluster A–G** (Cross-Cutting) plus „Quick-High-Impact" aus Hebel-Matrix:

1. **Cluster A** Determinism-Tiered-CI-Gate (1 PT, blockt 7 Findings).
2. **Cluster B** Save-Schema v2 + Trust-Level (5 PT, blockt 6 Findings).
3. **Cluster C** DSA-Notice-Form + Block-List-Pipeline (5 PT, blockt 5 Findings).
4. **Cluster D** Service-Hours-Doku + Backup-Buddy + Status-Page (1 PT, blockt 5 Findings).
5. **Cluster F** Adapter-Layer-Pattern (5 PT, blockt 4 Findings).
6. **Cluster G** SBOM + License-Gate (3 PT, blockt 3 Findings + CRA-Pflicht).
7. **Rebrand** Anwältin-FTO + DPMA-Anmeldung + Domain (2 PT human, 4–6 Mo elapsed).

Subtotal: ~22 PT für 30+ Findings.

### Sprint 3–5 (T-60 → T-30): „Compliance + UX-Sprint"

8. **iOS-A2HS-Onboarding** + Storage-Quota-Probe (Browser/Storage-Cluster).
9. **WCAG 2.5.7 react-aria DnD** für Tactic-Board.
10. **BFSG Accessibility-Statement** + axe-core-CI.
11. **Monetarisierungs-Hypothese committen** + PostHog + Feature-Flags.
12. **AGPL-3.0-LICENSE + gitleaks** + OpenSSF-Scorecard.

### Sprint 6+ (T-30 → T-0): „Hardening-Sprint"

13. **Externe Pen-Test**.
14. **Tabletop-Exercises** (3× pro Quarter: Crisis-Comms, DR-Drill, Security-Incident).
15. **Bug-Bounty** Discord-Pilot.
16. **MVP-Linie-ADR** dokumentiert die 8-fach-Constraint.

## Sub-Index Navigation

- **Nach Domäne**: [[00-index]] · [[findings-registry]] § Tabellen.
- **Nach Priorität**: [[findings-registry]] § P0/P1/P2/P3/P4-Sektionen.
- **Nach Expertise (für Agent-Briefing)**: [[execution-index]].
- **Nach Trust-Boundary**: [[threat-model]] § STRIDE-Matrix.
- **Nach Cross-Cutting**: dieser Report § Cluster A–G.

## Related

- [[00-index]] — Cluster-Hub
- [[execution-index]] — Expertise-Kategorien für Agent-Briefing
- [[findings-registry]] — Priorisierte Status-Tabelle
- [[threat-model]] — Trust-Boundaries + STRIDE-Matrix
