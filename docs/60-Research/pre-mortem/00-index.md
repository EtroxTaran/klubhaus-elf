---
title: "Pre-Mortem 2026-05-20 · Cluster Index"
status: current
tags: [research, pre-mortem, index, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: index
binding: false
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
related:
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-06-distributed-match-compute]]
  - [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[PM-2026-05-20-09-i18n-and-localization]]
  - [[PM-2026-05-20-10-accessibility-and-inclusion]]
  - [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
  - [[PM-2026-05-20-12-long-term-balance-and-meta]]
  - [[PM-2026-05-20-13-community-moderation-and-ugc]]
  - [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
  - [[PM-2026-05-20-15-browser-device-storage-matrix]]
  - [[PM-2026-05-20-16-test-strategy-depth]]
  - [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]]
  - [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
  - [[threat-model]]
  - [[findings-registry]]
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  - [[prioritization-matrix]]
  - [[execution-index]]
  - [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
  - [[../../00-Index/Current-State]]
  - [[../../00-Index/Research-Map]]
  - [[../../00-Index/Home]]
  - [[../../00-Index/Documentation-V1]]
---

# Pre-Mortem 2026-05-20 · Cluster Index

> **Frage, die diese Übung beantwortet:** Was sind die wahrscheinlichsten Gründe, dass football-manager-x in sechs Monaten bei 10.000 Spielern gescheitert ist — und was tun wir *jetzt*, damit das nicht passiert?

Diese Pre-Mortem ist ein **Intent-Layer**-Dokument (`binding: false`). Empfehlungen werden über ADRs/GDDRs ratifiziert, nicht direkt aus diesem Cluster implementiert.

> **Frischer Agent? Start hier:**
> - **[[execution-index]]** — 15 Expertise-Kategorien mit Briefings, Findings-Listen und erwarteten Output-Artefakten (ADRs / GDDRs / Implementation-Specs / Runbooks). Jede Kategorie ist self-contained genug für einen einzelnen Agent.
> - **[[prioritization-matrix]]** — Risiko-Heatmap (P×I), Score×Effort-Hebel, Cross-Cutting-Cluster A–G, regulatorische Deadlines, Sprint-Belegung T-90→T-0.
> - **[[findings-registry]]** — Status aller ~191 Findings, sortiert nach P0–P4.
> - **[[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]** — Konzept-Closure für alle ehemals offenen Findings: 15 Solution Tracks, externe Best-Practice-Quellen, Differenzierung gegen den Markt, `mitigated` vs `verified` Semantik.

## Cluster (3 Iterationen, 14 Reports + Threat-Model + Registry)

### Iteration 1 — Original 4 Domänen
| Report | Domain | Findings | Höchster Score |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture]] | Architektur | 10 (+Iter-2-Addendum) | 25 |
| [[PM-2026-05-20-02-tech-and-ops]] | Tech & Ops & Security | 10 (+Iter-2-Addendum) | 25 |
| [[PM-2026-05-20-03-gameplay]] | Gameplay | 10 (+Iter-2-Addendum) | 20 |
| [[PM-2026-05-20-04-monetization]] | Monetarisierung & Compliance | 10 (+Iter-2-Addendum) | 25 |

### Iteration 2 — Security & BYOC + Threat-Model
| [[PM-2026-05-20-05-security-and-integrity]] | Security & Integrity | 12 | 25 |
| [[PM-2026-05-20-06-distributed-match-compute]] | Distributed Match Compute / BYOC (Future-Scope) | 10 (accepted-risk) | 20 |
| [[threat-model]] | Trust-Boundaries & STRIDE-Matrix | — | — |

### Iteration 3 — Deep-Dive Coverage (12 weitere Domänen)
| Report | Domain | Findings | Höchster Score |
|---|---|---|---|
| [[PM-2026-05-20-07-live-ops-and-client-telemetry]] | Live-Ops & Client-Telemetrie & Game-Edge-Cases | 10 | 20 |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax]] | Legal/Consumer-Law/Tax (beyond DSGVO) | 13 | 20 |
| [[PM-2026-05-20-09-i18n-and-localization]] | i18n/l10n | 10 | 15 |
| [[PM-2026-05-20-10-accessibility-and-inclusion]] | Accessibility & Inclusion (WCAG/EAA/BFSG) | 11 | 25 |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]] | AI/LLM Dependency & Fallbacks | 12 | 12 |
| [[PM-2026-05-20-12-long-term-balance-and-meta]] | Long-Term Balance & Meta | 10 | 20 |
| [[PM-2026-05-20-13-community-moderation-and-ugc]] | Community/Moderation/UGC | 11 | 25 |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms]] | Brand/PR/Crisis-Comms + Re-Branding | 9 (+12 Brand-Candidates) | 25 |
| [[PM-2026-05-20-15-browser-device-storage-matrix]] | Browser/Device/Storage-Matrix | 9 | 25 |
| [[PM-2026-05-20-16-test-strategy-depth]] | Test-Strategy-Depth | 10 | 20 |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]] | Vendor-Lifecycle & Sustainability/ESG | 12 | 25 |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source]] | Responsible-Gaming + Open-Source-Strategy | 12 | 20 |

| [[findings-registry]] | **Status-Tracking aller ~191 Findings mit P0–P4-Priorität** | — | — |
| [[prioritization-matrix]] | **Heatmap P×I, Score×Effort-Hebel, Cross-Cutting-Cluster A–G, Regulatorische Deadlines, Sprint-Belegung T-90→T-0** | — | — |
| [[execution-index]] | **15 Expertise-Kategorien (SEC, BACKEND, PLATFORM, FRONTEND, DETERMINISM, GAMEDESIGN, TEST, A11Y, LEGAL, PRODUCT, AI, COMM, BRAND, FOUNDER, SUSTAIN) — Briefings + Findings-Listen + Output-Artefakte für frische Agenten** | — | — |

## Annahmen

| Parameter | Wert |
|---|---|
| Horizont | 2026-11-20 (6 Monate ab heute) |
| Registrierte Spieler | 10.000 |
| DAU | ~2.500 (25 % MAU) |
| Peak CCU am Match-Tick | ~200–400 |
| Szenario A | Single-node Hetzner (Ist) |
| Szenario B | Cloud-Autoscaling (Nutzer-Annahme) |

## Executive Summary (Iter 1+2+3 — ~191 Findings)

Aus ~191 Findings (40 Iter-1 + 22 Iter-2 + 129 Iter-3) verteilt auf **18 Reports + Threat-Model**, mit Prioritäts-Tagging:
- **13 P0** (Pre-Launch-Blocker)
- **37 P1** (Pre-Launch dringend empfohlen)
- **24 P2** (erste 90 Tage Post-Launch)
- **73 P3** (erste 6 Monate Post-Launch)
- **44 P4** (Backlog / accepted-risk inkl. 10 BYOC-Future-Scope)

Vollständige Prioritäts-Sortierung in [[findings-registry]].

**Acht dominante Failure-Themen:**

1. **Verbrauchsfertige Infrastruktur fehlt.** SurrealDB single-node nicht produktionserprobt für 10k; Migrations-Story Placeholder. ([[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02|01-F-02]] P0, [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04|02-F-04]] P0, [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-02|17-F-02]] P1)
2. **Determinismus = Anti-Cheat-Foundation + AI-Act-Befreiung + BYOC-Voraussetzung + Balance-Hotfix-Replay.** 5-fach-Hebel. ([[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03|05-F-03]] P1, [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08|12-F-08]] P1, [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04|16-F-04]] P1)
3. **Gameplay-UX-Risiken blind ohne Telemetrie.** Onboarding-60s-Spec vs Realität. ([[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-03|03-F-03]] P1, [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-01|07-F-01]] P1)
4. **Monetarisierung 0 % implementiert.** Keine Hypothese, keine Analytics, keine Flags, keine Retention. ([[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01|04-F-01]] P0)
5. **Security-Fundament unvollständig.** AES-GCM-Save authentisiert *Kenntnis*, nicht *Herkunft*; Commands nicht signiert/replay-geschützt; Supply-Chain unkontrolliert. ([[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01|05-F-01]] P0, [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02|05-F-02]] P0)
6. **Single-Player-Foundation MP-/BYOC-tragend oder bricht später.** Save-Schema v2 + Command-Modell + Determinismus von Anfang an MP-/BYOC-kompatibel.
7. **DSA + BFSG + EAA + CRA + AI-Act-Stack** (4 regulatorische Stichtage 2026/2027). ([[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11|08-F-11]] P0, [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01|13-F-01]] P0, [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-01|10-F-01]] P0 + [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02|10-F-02]] P1, [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07|17-F-07]] P0)
8. **Marken-Kollision SEGA/SI ”žfootball-manager-x"** — Rebrand vor Public-Launch zwingend. Top-3-Finalisten: Heimrunde / Klubkönig / Formationfuchs. ([[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05|08-F-05]] P0, [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-01|14-F-01]] P0)

> **Leitsatz Iteration 2/3.** *Single-Player ist das Fundament — aber jedes Datenformat, jeder Command-Pfad und jede State-Übergangsfunktion wird so entworfen, dass sie auch unter dem strengeren Vertrauensmodell von async Multiplayer und (zukünftig) Distributed Match Compute trägt. Ein Stack mit zuschaltbarem Trust-Level — nicht zwei Stacks. MVP-Linie: kein Runtime-LLM, kein Image-Upload, kein Free-Form-Chat, kein aktives Marketing, kein Cloudflare-Workers-Lock, keine Lootboxes, keine Daily-Login-Streaks.*

## Regulatorische Stichtage 2026/2027

| Datum | Was | Pflicht ab |
|---|---|---|
| **2026-08-02** | EU AI Act Art. 50 (Kennzeichnung synthetic content) | Neue Systeme |
| **2026-09-11** | CRA Vulnerability-Reporting an ENISA (24 h ab CVSS ≥ 9.0) | Pflicht |
| **2026-12-02** | EU AI Act Art. 50 Bestandssysteme | Pflicht |
| **Q4 2026** | EU Digital Fairness Act Proposal erwartet | Watch |
| **2027-08-02** | EU AI Act High-Risk-System-Pflichten | Watch |
| **2027-12-11** | EU CRA volle Anwendbarkeit (SBOM, 5-Jahre-Updates) | **Pflicht** |

## Risk-Heatmap (Probability × Impact) — Iteration 1 + 2

Iter-2-Findings (Security/Report 05 + BYOC/Report 06) sind **fett markiert**. BYOC-Findings sind Future-Scope (`accepted-risk`).

|  | Impact 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **Probability 5** | | | | | **01-F-02 · 02-F-04 · 04-F-01** + **05-F-01 · 05-F-02** (Score 25) |
| **4** | | | | **01-F-01 · 02-F-01 · 02-F-10 · 03-F-04 · 04-F-04** + **05-F-04** (16) | **01-F-03 · 01-F-06 · 02-F-02 · 02-F-03 · 03-F-01 · 03-F-02 · 03-F-03 · 04-F-02 · 04-F-07** + **05-F-03 · 05-F-05 · 06-F-01 · 06-F-04 · 06-F-05** (20) |
| **3** | | | **01-F-08 · 01-F-10 · 02-F-09 · 03-F-07 · 03-F-09 · 03-F-10** + **05-F-11 · 06-F-06** (9) | **01-F-04 · 01-F-05 · 01-F-07 · 01-F-09 · 02-F-05 · 02-F-07 · 02-F-08 · 03-F-05 · 03-F-06 · 03-F-08 · 04-F-03 · 04-F-08 · 04-F-10** + **05-F-06 · 05-F-08 · 05-F-12 · 06-F-07 · 06-F-08 · 06-F-09 · 06-F-10** (12) | **02-F-06 · 04-F-06** + **05-F-07 · 05-F-09 · 05-F-10 · 06-F-02 · 06-F-03** (15) |
| **2** | | | | **04-F-09** (8) | **04-F-05** (10) |
| **1** | | | | | |

> Rote Zone (Score ≥ 20): jetzt 19 Findings (12 Iter-1 + 5 Iter-2-Security + 2 Iter-2-BYOC-`accepted-risk`) → Iter-1 + Iter-2-Security sind **Mitigations vor Launch verpflichtend**; Iter-2-BYOC nur aktiviert bei Decision-Gate-Passage.

## Cross-Cutting Risks (Findings mit Mehrfachwirkung)

- **Determinismus-Drift** trifft Tech + Gameplay + Security (Anti-Cheat-Foundation) + BYOC-Voraussetzung:
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02]] ←” [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02]] ←” [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03]] ←” Foundation [[PM-2026-05-20-06-distributed-match-compute]].
- **Web-Worker-Bridge für Match-Engine** trifft Architektur + Gameplay (Mobile-Performance):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04]] ←” [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06]].
- **Single-Node-Outage** trifft Architektur + Monetarisierung (verlorene Conversion-Events):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02]] ←” [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09]].
- **Observability ohne Dashboards** macht Auth/Anti-Abuse + Determinismus + Outbox blind:
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03]] ←” [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09]].
- **Save-Format-Inkompatibilität SP ←” MP (NEU Iter 2)**: ohne Schema v2 mit `trust_level` ist SP-Save später nicht für Cloud-Verify/Leaderboards verwendbar:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01]] ←” Single-Player-Foundation-Check in [[PM-2026-05-20-01-architecture#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 01]] und [[PM-2026-05-20-03-gameplay#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 03]].
- **Engine-Bundle-Hash-Rotation (NEU Iter 2)**: betrifft Save-Verify, Match-Replay und BYOC-Quorum gleichermaßen:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12]] ←” [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-04]].
- **DSGVO-Erasure vs Audit-Aufbewahrung (NEU Iter 2)**: Pseudonymisierungs-Pflichten:
  [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06]] ←” [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09]] ←” Runbook RB-S3.
- **Command-Signing als Cross-Cutting-Foundation (NEU Iter 2)**: deckt Tampering, Replay-Schutz, Audit, BYOC ab:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02]] ←” Authorization-Checks in [[PM-2026-05-20-01-architecture#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 01]] ←” Anti-Cheat-Hebel in [[PM-2026-05-20-03-gameplay#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 03]] ←” Webhook-Idempotenz in [[PM-2026-05-20-04-monetization#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 04]].

## Top-Mitigations (nach Hebel: Score × 1/Aufwand) — Iter 1 + 2

1. **Determinism-CI-Gate** (S-Aufwand, Score 20 × 4 Findings = sehr hoch). Adressiert: 02-F-02, 03-F-02, 05-F-03, Foundation für BYOC.
2. **Save-Schema v2 mit trust_level + Server-HMAC (Iter 2)** (L-Aufwand, Score 25). Adressiert: 05-F-01, Foundation für 05-F-11, Single-Player-Foundation in 01/03 Addenda. **ADR-0028 (proposed).**
3. **Command-Signing + Replay-Protection (Iter 2)** (L-Aufwand, Score 25). Adressiert: 05-F-02, indirekt 05-F-06, 05-F-08. **ADR-0026 (proposed).**
4. **Restore-Drill automatisieren** (M-Aufwand, Score 25). Adressiert: 02-F-04.
5. **Monetarisierungs-Hypothese committen** (M-Aufwand, Score 25). Adressiert: 04-F-01.
6. **Mindest-Alert-Catalog + Dashboards-as-Code** (M-Aufwand, Score 20 + Cross-Cutting). Adressiert: 02-F-03, 01-F-09, neue Iter-2-Security-Alerts.
7. **PostHog (Analytics) + Funnel-Events Tag 1** (M-Aufwand, Score 20). Adressiert: 04-F-02.
8. **Migrations-Framework + Schema-blue/green** (M-Aufwand, Score 20). Adressiert: 01-F-06.
9. **Supply-Chain-Hardening (cosign + SBOM + Renovate-Quarantäne)** (M-Aufwand, Score 20). Adressiert: 05-F-05.
10. **Onboarding-Funnel-Telemetrie + Usability-Test (n=20)** (M-Aufwand, Score 20). Adressiert: 03-F-03.
11. **Retention-Loop (Brevo + Web-Push)** (M-Aufwand, Score 20). Adressiert: 04-F-07.
12. **Chunked Week-Tick + Outbox-Dashboards** (M-Aufwand, Score 20 + 12). Adressiert: 01-F-03, 01-F-09.
13. **Save-Import-Härtung (Iter 2)** (M-Aufwand, Score 16). Adressiert: 05-F-04.
14. **Web-Worker-Bridge für Match-Engine** (M-Aufwand, Score 12 + Cross-Cutting). Adressiert: 01-F-04, 03-F-06.
15. **PII-Allow-List + DSAR-Export-CI-Test (Iter 2)** (M-Aufwand, Score 15). Adressiert: 05-F-09.
16. **Webhook-Signatur + Idempotenz (Iter 2)** (S-Aufwand, Score 15). Adressiert: 05-F-07.

## 30/60/90-Tage-Plan vor Launch

> Annahme: Launch in T-180. Plan beginnt in T-90 (3 Monate vor Launch). Bei tatsächlich anderem Launch-Datum entsprechend verschieben.

### T-90 bis T-60 — Foundation

- **Determinism-CI-Gate live** (Mit #1).
- **Save-Schema v2 + Command-Signing landed (Iter 2)** (Mit #2, #3); ADR-0026 + ADR-0028 approved.
- **Migrations-Framework live** + erster echter Schema-Change in Staging (Mit #8).
- **Mindest-Alert-Catalog deployt**, Dashboards-as-Code (Mit #6).
- **Restore-Drill** als Monthly-Cron etabliert, RTO/RPO gemessen (Mit #4).
- **Monetarisierungs-GDDR + Pricing-ADR** approved (Mit #5).
- **PostHog deployed**, Event-Taxonomie definiert (Mit #7).
- **Supply-Chain-Hardening (Iter 2): cosign + SBOM + Renovate-Quarantäne** aktiv (Mit #9).
- **Webhook-Signatur + Idempotenz (Iter 2)** für Stripe/MCP/Webhook-Endpoints (Mit #16).

### T-60 bis T-30 — Validation

- **Soft-Launch / Closed-Beta in DE/CH** mit 200–500 Beta-Tester (04-F-04).
- **Onboarding-Usability-Test (n=20)** (Mit #10).
- **Web-Worker-Bridge** für Match-Engine live (Mit #14).
- **Chunked Week-Tick** mit Outbox-Beobachtbarkeit (Mit #12).
- **Retention-Loop initial** (Welcome-Series + Match-Push) (Mit #11).
- **Feature-Flags (GrowthBook) deployed**, erstes A/B im Beta (04-F-03).
- **Save-Import-Härtung (Iter 2)** als Beta-tauglich (Mit #13); Fuzz-Suite läuft im CI.
- **Tampering-Test-Suite (Iter 2)** nightly aktiv; Coverage ≥ 95 %.

### T-30 bis T-0 — Hardening

- **DR-Drill voller Restore** mit echtem Daten-Volumen.
- **Tabletop-Übung** mit allen Runbooks (RB-A1/2/3, RB-T1/2/3/4, RB-G1/2/3, RB-M1/2/3/4, **RB-S1/2/3 (Iter 2)**).
- **Legal-Review abgeschlossen** (AGB, Widerruf, Impressum) — 04-F-06.
- **Penetration-Test** durch externen Dienstleister (Gap F13) — Scope inkl. Save-Import, Command-Bus, Webhook-Endpoints (Iter 2).
- **WAF / Bot-Management aktiviert** (02-F-07).
- **Helpdesk live**, FAQ-Seite veröffentlicht (04-F-08).
- **PII-Leak-Tests (Iter 2)** im CI: 0 Treffer als Release-Voraussetzung (Mit #15).
- **Recovery-Code-Härtung (Iter 2)** validiert: single-use, time-bounded, Re-Registration-Cooldown (05-F-10).

## Decision Register (classified 2026-05-22)

This table is historical pre-mortem planning context. The active closure state is
[[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] plus
[[../../00-Index/Documentation-V1]].
No row below is an unclassified documentation gap.

| Entscheidung | Owner | Temporal class | 2026-05-22 Status |
|---|---|---|---|
| Cloud-Provider (Fly.io vs AWS vs GCP vs Hetzner-Stack) | platform | MVP binding / ops | Covered by Dokploy-on-Hetzner baseline; re-open only on migration trigger. |
| DB-Strategie (SurrealDB vs Postgres) | platform+architecture | Architecture binding | Decided by ADR-0021 / ADR-0027: PostgreSQL + Drizzle system of record; SurrealDB optional additive. |
| Monetarisierungs-Modell | product+founder | Pre-launch product evidence | Concept-covered by gap closure ST-04; requires product validation before public launch. |
| Payment-Provider | finance+backend | Pre-launch product evidence | Concept-covered by ST-04 / ST-08; choose when payments enter scope. |
| Analytics-Stack | data+platform | Pre-launch evidence | Concept-covered by ST-07; implement only with privacy baseline. |
| Soft-Launch-Region | product+marketing | Pre-launch product evidence | Concept-covered by ST-04 / ST-14. |
| Promotion GD-0002 Match-Engine | game-design | Optional cleanup | Current match-engine notes are binding; promotion not a blocking gap. |
| WAF / Bot-Management Provider | platform+security | Trigger-gated ops | Covered by rate-limiting/anti-abuse baseline; edge WAF is trigger-based. |
| Helpdesk-Tool | support | Pre-launch ops | Concept-covered by ST-08 / ST-13; select before public support launch. |
| Status-Page-Tool | platform | Pre-launch ops | Concept-covered by ST-02 / ST-07; select during launch hardening. |
| Save-Schema v2 + trust_level | architecture+security | Architecture binding | Covered by ADR-0027 / ADR-0028 and ST-01 / ST-05. |
| Command-Signing-Protokoll | architecture+security | Architecture/security | Concept-covered by ST-05; implement when command bus enters scope. |
| BYOC-Decision-Gate | product+platform | Future-scope gate | `accepted-risk`; do not implement before gate passes. |
| Bug-Bounty-Programm | security | Pre-launch/post-launch security | Concept-covered by ST-05 / ST-17; pilot after responsible-disclosure path exists. |
| Externer Pentest-Lieferant | security | Pre-launch evidence | Evidence gate before public launch; not a documentation gap. |
| Re-Branding / Markenanwaeltin | founder+legal | Pre-launch hard gate | Concept-covered by ST-14; public launch blocked until brand/legal sign-off. |
| OSS license / split repo | founder+architecture | Founder decision | Concept-covered by ST-18; decide before external OSS release. |
| Runtime LLM provider | tech-lead | Future-scope gate | No runtime LLM at MVP; decide only when promoted. |
| i18n locales / tone / library / TMS | founder+content+frontend | Pre-launch/post-MVP content | Concept-covered by ST-09; promote when i18n implementation starts. |
| Registrar / DNS / backup region / cold standby | platform | Launch ops | Concept-covered by ST-02 / ST-17; execute through ops runbooks. |
| Postgres fallback PoC | platform+architecture | Superseded by ADRs | Closed by ADR-0021 / ADR-0027; Postgres is primary, not fallback. |
| Visual regression / CI hybrid | tech-lead | Engineering evidence | Concept-covered by ST-16 / ST-17; implement through CI hardening tasks. |
## Vault-Integration

- Reports folgen [[../../90-Meta/vault-governance]] (binding=false, status=draft).
- IDs sind immutable und in Commits/PRs/ADRs zitierbar (`Addresses PM-2026-05-20-XX-F-NN`).
- ADRs, die als Antwort entstehen, tragen `addresses: [PM-…]` Frontmatter.
- Status-Tracking: [[findings-registry]].
- Obsidian-Graph: jeder Report hat `## Related` + `related:` Frontmatter — Backlinks aktiv.

## Re-Review-Trigger

- **Monatlich:** Registry-Status durchgehen, Owner-Touch enforced.
- **Bei Cloud-Migration:** Findings unter `scenario: [cloud-autoscaling]` neu bewerten.
- **Nach Soft-Launch:** Neue Pre-Mortem `PM-<soft-launch-date>-*` erstellen, dieses Bündel ggf. `superseded`.
- **Bei neuer Gap-Eröffnung: Baseline, Registry und zuständige Map im gleichen PR aktualisieren.

## Verifikation der Pre-Mortem selbst

- **Cross-Reference-Check:** alle Wikilinks und Code-Pfade müssen auflösbar sein (`grep`-Skript).
- **Wave-3-Coverage:** alle P0/P1-Gaps aus [[../../95-Archive/gap-reports/wave-3-gap-analysis]] sind mindestens einmal abgedeckt (siehe Abdeckungs-Notiz unten).
- **Peer-Review:** Index + 2 zufällig gewählte Reports von externer Person signiert.
- **Tabletop:** mindestens ein Runbook pro Report mündlich simuliert vor Launch.

### Abdeckung von Wave-3-Gaps (Stichprobe)

| Gap | Adressiert in |
|---|---|
| A1 ADR-0001 Tech Stack | indirekt 02-F-01 (Framework-Risiko) |
| A2 ADR-0003 Match Engine | 01-F-04, 02-F-02, 03-F-01, 03-F-02 |
| E10 CI/CD Pipeline | 02-F-05 |
| E13 Web Worker Bridge | 01-F-04, 03-F-06 |
| E14 Job Queue / Scheduler | 01-F-03, 01-F-09 |
| F2–F5 Auth Implementation | 02-F-06 |
| F13 Pentest | 30-Tage-Plan |
| G3 Success Metrics / KPIs | 04-F-02 |
| G4 Monetisation Strategy | 04-F-01 |
| G5 Pricing Model | 04-F-01 |
| G6 Beta Program | 04-F-04 |
| G8 Support Workflow | 04-F-08 |
| H1 Incident Response | 02-F-10 |
| H2 On-Call Setup | 02-F-10, 30-Tage-Plan |
| H3 Backup & Recovery | 02-F-04 |
| H4 Production DB Migration | 01-F-06 |
| H5 Feature-Flag-System | 04-F-03 |
| H6 A/B Testing | 04-F-03 |
| H7 Analytics / Metrics | 04-F-02 |
| H8 Live-Ops Capabilities | 04-F-07 |
| H11 Status Page | 02-F-10 |
| I11 Roguelite Carry / Insolvency Tuning | 03-F-04 |

(Vollständige Abdeckung wird im Verifikations-Pass nachgezogen.)
## Related

- [[PM-2026-05-20-01-architecture]]
- [[PM-2026-05-20-02-tech-and-ops]]
- [[PM-2026-05-20-03-gameplay]]
- [[PM-2026-05-20-04-monetization]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-06-distributed-match-compute]]
- [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
- [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
- [[PM-2026-05-20-09-i18n-and-localization]]
- [[PM-2026-05-20-10-accessibility-and-inclusion]]
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
- [[PM-2026-05-20-12-long-term-balance-and-meta]]
- [[PM-2026-05-20-13-community-moderation-and-ugc]]
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
- [[PM-2026-05-20-15-browser-device-storage-matrix]]
- [[PM-2026-05-20-16-test-strategy-depth]]
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]]
- [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
- [[threat-model]]
- [[findings-registry]]
- [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
- [[prioritization-matrix]]
- [[execution-index]]
- [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Home]]
- [[../../00-Index/Documentation-V1]]
