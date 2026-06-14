---
title: "Pre-Mortem Findings Registry"
status: current
tags: [research, pre-mortem, registry, tracking, 2026-Q2]
created: 2026-05-20
updated: 2026-06-14
type: registry
binding: false
report_set: 2026-05-20
related:
  - [[00-index]]
  - [[threat-model]]
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
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  - [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
  - [[../../00-Index/Current-State]]
---

# Pre-Mortem Findings Registry — 2026-05-20

**Single Source of Truth** für alle Findings aus dem Pre-Mortem-Cluster vom 2026-05-20.

**Total: ~191 Findings** über 18 Reports + Threat-Model.

## Prioritäts-Schema

| Tag | Bedeutung |
|---|---|
| **P0** | Pre-Launch-Blocker: Score 25 ODER harter regulatorischer Stichtag ≤ 12 Monate ODER P0-Total-Outage |
| **P1** | Pre-Launch dringend empfohlen: Score 20–24 |
| **P2** | Erste 90 Tage Post-Launch: Score 16–19 |
| **P3** | Erste 6 Monate Post-Launch: Score 9–15 |
| **P4** | Backlog / accepted-risk: Score < 9 oder Future-Scope (BYOC) |

## Verwendung

- **Beim Eröffnen eines Fixes**: (1) `status: mitigating` im Quell-Report. (2) Linear-Issue-ID in `linked_issues:`. (3) `updated:` heute. (4) Status hier spiegeln.
- **Beim Mergen Fix-PR**: (1) `status: mitigated`, PR in `resolved_by:`. (2) ADR/GDDR-Frontmatter `addresses: [PM-2026-05-20-XX-F-NN]`.
- **Verifikation**: `status: verified`.

**Status-Werte**: `open` · `mitigating` · `mitigated` · `verified` · `accepted-risk` · `obsolete`

---

## P0 — Pre-Launch-Blocker (13 Findings)

Diese müssen vor Public-Launch adressiert sein. Status `mitigated` bedeutet hier: Konzeptlösung geschlossen via [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]], objektive Verifikation folgt in downstream PRs/Drills.

| Finding | Domain | Score | Status | Reason |
|---|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02\|01-F-02]] — SurrealDB Single-Node SPOF | architecture | 25 | mitigated | Score 25 + Total-Outage-Risiko |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04\|02-F-04]] — Backups nie restored | ops | 25 | mitigated | Score 25 + Datenverlust-Risiko |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01\|04-F-01]] — Keine Monetarisierungs-Hypothese | monetization | 25 | mitigated | Score 25 + Strategic-Blocker |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] — Save authentisiert Kenntnis, nicht Herkunft | security | 25 | mitigated | Score 25 + Anti-Cheat-Foundation; accepted home ADR-0115 (FMX-184) |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02\|05-F-02]] — Commands nicht signiert / replay-protected | security | 25 | mitigated | Score 25 + Cheat-Vector; accepted home ADR-0114 (FMX-184) |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05\|08-F-05]] — Marken-Kollision SEGA/SI | legal | 20 | mitigated | Pre-Launch sofort lösbar (Rebrand), aber Score 25 nach Public-Sichtbarkeit |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-06\|08-F-06]] — UGC DFL-Vereinslogos | legal | 20 | mitigated | DSA-Compliance vor Beta |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11\|08-F-11]] — DSA Art. 16 Notice-and-Action | legal | 15 | mitigated | DSA-Compliance vor Public-Hosting |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-01\|10-F-01]] — WCAG 2.5.7 Dragging Movements | accessibility | 25 | mitigated | Score 25 + BFSG-Compliance |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01\|13-F-01]] — DSA Art. 16 SLA-Maschine | community | 25 | mitigated | Score 25 + Bußgeld bis 6 % Umsatz |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-01\|14-F-01]] — Marken-Kollision (re-anchored) | brand | 25 | mitigated | Score 25 (Cross-Ref 08-F-05) |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-01\|15-F-01]] — iOS-Safari 7-Tage-Eviction | browser-storage | 25 | mitigated | Score 25 + ~30 % Mobile-Markt Datenverlust |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07\|17-F-07]] — CRA-SBOM-Pflicht | vendor-supply-chain | 25 | mitigated | Score 25 + Stichtag 11.09.2026 (Vuln-Reporting) |

---

## P1 — Pre-Launch dringend empfohlen (Score 20–24)

| Finding | Domain | Score | Status |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-03\|01-F-03]] — Week-Tick-Lastspitze ohne Batching | architecture | 20 | mitigated |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-06\|01-F-06]] — Schema-Migration ohne Downtime nicht designed | architecture | 20 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02\|02-F-02]] — Determinismus-Drift unentdeckt | tech | 20 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03\|02-F-03]] — Observability ohne Dashboards/Alerts | ops | 20 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-01\|03-F-01]] — Match-Engine-Varianz zu niedrig | gameplay | 20 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02\|03-F-02]] — Determinismus-Drift sichtbar bei Replays | gameplay | 20 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-03\|03-F-03]] — Onboarding 60s-Spec vs Realität | gameplay | 20 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-02\|04-F-02]] — Kein Product-Analytics | monetization | 20 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-07\|04-F-07]] — Retention-Loop fehlt | monetization | 20 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03\|05-F-03]] — Determinismus-CI-Gate fehlt | security | 20 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-05\|05-F-05]] — Supply-Chain unkontrolliert | security | 20 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-01\|07-F-01]] — RUM-Coverage INP/LCP/CLS fehlt | live-ops | 20 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-02\|07-F-02]] — Save-Stuck-Reproduktions-Pfad fehlt | live-ops | 20 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-08\|07-F-08]] — Solo-Founder-Burnout | live-ops | 20 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02\|10-F-02]] — BFSG-Geltungsbereich falsch | accessibility | 20 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-02\|11-F-02]] — LLM in Match-Engine-Pfad (Determinismus-Bruch) | ai-llm | 10 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-01\|12-F-01]] — Wage- & Prize-Money-Inflation | game-balance | 20 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-02\|12-F-02]] — AI-Manager-Tactical-Convergence | game-balance | 20 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-03\|12-F-03]] — Save-Bloat 30k Events | performance | 20 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] — Balance-Hotfix bricht Determinismus-Replay | ops+trust | 20 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-02\|13-F-02]] — § 86a StGB Custom-Wappen-Upload | community | 20 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-03\|13-F-03]] — Vereins-Trademark-Blocklist | community | 20 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04\|13-F-04]] — Single-Founder als Mod (Burnout+SLA) | community | 20 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-02\|15-F-02]] — QuotaExceededError Floor-Android | browser-storage | 20 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-09\|15-F-09]] — DevTools-IDB-Tampering (Cross-Ref 05) | browser-security | 16 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-02\|16-F-02]] — Property-based Testing fehlt | testing | 20 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04\|16-F-04]] — Determinism-Tiered-CI-Gate | testing | 20 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05\|16-F-05]] — Save-Forward-Compat-Matrix | testing | 20 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-06\|16-F-06]] — 50-Year-Soak Assertions | testing | 20 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-10\|16-F-10]] — CI-Budget Hybrid (GH + Hetzner) | testing | 20 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-01\|17-F-01]] — Hetzner-Suspension + Single-Account | vendor-infra | 15 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-02\|17-F-02]] — SurrealDB 3.x Monthly-Drift | vendor-data | 15 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-09\|17-F-09]] — Domain-Registrar SPOF | vendor-dns | 10 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-02\|18-F-02]] — License-Decision blockt OSS-Strategie | open-source | 20 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04\|18-F-04]] — DSA Art. 25 + DFA 2026 | responsible-gaming | 20 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-07\|18-F-07]] — Fork-Risk-Asymmetry (Server-Moat) | open-source | 20 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-08\|18-F-08]] — Secret-Scan + Push-Protection fehlt | security-oss | 20 | mitigated |

---

## P2 — Erste 90 Tage Post-Launch (Score 16–19)

| Finding | Domain | Score | Status |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-01\|01-F-01]] — Bounded-Context-Erosion | architecture | 16 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-01\|02-F-01]] — TanStack Start Beta-Bruch | tech | 16 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-10\|02-F-10]] — Incident-Response nur auf Papier | ops | 16 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-04\|03-F-04]] — Insolvency-Spiral unverständlich | gameplay | 16 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-04\|04-F-04]] — Kein Soft-Launch / Beta | monetization | 16 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-04\|05-F-04]] — Save-Import Deserialisierung | security | 16 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-03\|07-F-03]] — Severity-Klassifikation fehlt | live-ops | 16 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-04\|08-F-04]] — Impressumspflicht § 5 DDG | legal | 10 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-10\|08-F-10]] — Lootbox/Glücksspielrecht | legal | 15 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-05\|09-F-05]] — `[a-zA-Z]`-Validation blockt EU-User | i18n | 15 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-03\|10-F-03]] — Live-Region Match-Ticker | accessibility | 16 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-05\|10-F-05]] — Color-Only Status/Form/Moral | accessibility | 15 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-06\|10-F-06]] — Squad-DataGrid ohne `role=grid` | accessibility | 16 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-11\|10-F-11]] — axe-core-CI fehlt | accessibility | 16 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-04\|12-F-04]] — Roguelite Carry-Slot-Compound | game-balance | 16 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-05\|12-F-05]] — Narrative-Template Burn | content | 15 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-10\|12-F-10]] — Achievement-Saturation/Endgame | retention | 16 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-05\|13-F-05]] — Hate-Speech-Bypass | community | 15 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-06\|13-F-06]] — Repeat-Offender-Policy (Art. 23 DSA) | community | 16 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-02\|14-F-02]] — Crisis-Comms-Playbook fehlt | brand | 16 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-06\|14-F-06]] — Mention-Monitoring nicht aufgesetzt | brand | 15 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-07\|14-F-07]] — Crisis-Message-Archetypes (7 Templates) | brand | 16 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-04\|15-F-04]] — Web-Worker OOM auf 3 GB Android | browser-performance | 16 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-01\|16-F-01]] — Vitest 3 Browser-Mode Baseline | testing | 16 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-04\|17-F-04]] — Stripe-Gaming-High-Risk vs Paddle-MoR-Lock | vendor-payment | 15 | mitigated |

---

## P3 — Erste 6 Monate Post-Launch (Score 9–15)

| Finding | Domain | Score | Status |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04\|01-F-04]] — Match-Engine nicht in Web-Worker | architecture | 12 | mitigated |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-05\|01-F-05]] — Spectator-Snapshot Fan-Out | architecture | 12 | mitigated |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-07\|01-F-07]] — Session-Store / Cross-Instance | architecture | 12 | mitigated |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09\|01-F-09]] — Outbox ohne Beobachtbarkeit | architecture | 12 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-05\|02-F-05]] — Kein blue/green oder Rollback | ops | 12 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-06\|02-F-06]] — Auth/Recovery-Lücken | security | 15 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-07\|02-F-07]] — Rate-Limiting nicht enforced | security | 12 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-08\|02-F-08]] — Secrets-Rotation nie geübt | security | 12 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-05\|03-F-05]] — Content-Burn | gameplay | 12 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06\|03-F-06]] — Mobile-Performance-Budget | gameplay | 12 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-08\|03-F-08]] — Endgame leer | gameplay | 12 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-03\|04-F-03]] — Keine Feature-Flags / A/B | monetization | 12 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06\|04-F-06]] — DSGVO/Verbraucherschutz beim Bezahlen | compliance | 15 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-08\|04-F-08]] — Kein Customer-Support | monetization | 12 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-10\|04-F-10]] — Refund-/Chargeback-Welle | monetization | 12 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-06\|05-F-06]] — Bounded-Context-Authz | security | 12 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-07\|05-F-07]] — Webhook-Forgery | security | 15 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-08\|05-F-08]] — Audit-Log lückenhaft | security | 12 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09\|05-F-09]] — PII in Logs trotz Redaction | security | 15 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-10\|05-F-10]] — Account-Übernahme via Recovery-Codes | security | 15 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12\|05-F-12]] — Engine-Bundle-Hash-Rotation | security | 12 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-04\|07-F-04]] — Kein Statuspage | live-ops | 15 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-05\|07-F-05]] — Determinismus-Drift unerkannt | live-ops | 15 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-06\|07-F-06]] — Anomaly-Detection-as-Code | live-ops | 12 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-07\|07-F-07]] — Loki-Cardinality-Explosion | live-ops | 12 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-10\|07-F-10]] — Status-Page-Schweigen | live-ops | 12 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-01\|08-F-01]] — § 327f BGB Update-Pflicht | legal | 12 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-02\|08-F-02]] — § 356 Widerrufsrecht | legal | 10 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-03\|08-F-03]] — AGB-Kontrolle §§ 305 ff. | legal | 12 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-08\|08-F-08]] — OSS-Schwelle 10k € | tax | 12 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-12\|08-F-12]] — AI Act Art. 50 | legal | 4 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-01\|09-F-01]] — ICU MF flektierte Klubnamen | i18n | 12 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-02\|09-F-02]] — Library-Lock-In (Paraglide) | i18n | 12 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-03\|09-F-03]] — RTL Logical-Properties | i18n | 12 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-06\|09-F-06]] — TMS-Lock (Tolgee self-host) | i18n | 9 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-07\|09-F-07]] — Locale-Detection-Hierarchie | i18n | 9 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-09\|09-F-09]] — Übersetzer-Style-Guide | i18n | 8 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-10\|09-F-10]] — Service-Worker-Locale-Cache | i18n | 9 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-04\|10-F-04]] — prefers-reduced-motion | accessibility | 12 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-07\|10-F-07]] — Halbzeit-Modal Focus-Trap | accessibility | 12 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-08\|10-F-08]] — Touch-Target 2.5.8 | accessibility | 12 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-01\|11-F-01]] — Anthropic Bus-Faktor Dev | ai-llm | 12 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-03\|11-F-03]] — Kosten-Explosion post-MVP-LLM | ai-llm | 9 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-04\|11-F-04]] — DSGVO US-LLM | ai-llm | 12 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-05\|11-F-05]] — AI Act Art. 50 (2026-08-02) | ai-llm | 9 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-06\|11-F-06]] — LLM-Halluzination | ai-llm | 12 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-11\|11-F-11]] — Customer-Support-Bot-Halluzinationen | ai-llm | 12 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-06\|12-F-06]] — Insolvency-Spiral trivial/unvermeidbar | game-balance | 12 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-09\|12-F-09]] — Player-Attribute Outliers | game-balance | 9 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-07\|13-F-07]] — Translation-UGC | community | 12 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-08\|13-F-08]] — Async-MP-Chat post-MVP | community | 12 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-09\|13-F-09]] — Notice-Reporter-PII vs Audit | privacy-moderation | 12 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-10\|13-F-10]] — Username-Squatting | community | 12 | mitigated |
| [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-11\|13-F-11]] — Save-Sharing-Forum post-MVP | community | 12 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-03\|14-F-03]] — Stealth-Beta Discovery | brand | 12 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-04\|14-F-04]] — Founder-Voice Style-Guide | brand | 12 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-05\|14-F-05]] — Pressekit-Absence | brand | 12 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-09\|14-F-09]] — Apology-/Engagement-Patterns | brand | 9 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-03\|15-F-03]] — Brotli-CompressionStream | browser-storage | 12 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-05\|15-F-05]] — deviceMemory tier-misdetection | browser-tiering | 9 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-06\|15-F-06]] — Service-Worker stale-cache | browser-pwa | 12 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-07\|15-F-07]] — Network-Flakiness EU mobile | browser-network | 9 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-03\|16-F-03]] — Stryker scoped /engine | testing | 9 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-07\|16-F-07]] — Argos vs Chromatic | testing | 9 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-08\|16-F-08]] — Chaos Toxiproxy | testing | 9 | mitigated |
| [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-09\|16-F-09]] — Cross-Browser Solo | testing | 9 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-03\|17-F-03]] — TanStack Bus-Faktor | vendor-frontend | 12 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-06\|17-F-06]] — Cloudflare-Workers Lock | vendor-edge | 9 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-01\|18-F-01]] — Roguelite-Insolvency loss-aversion-Audit | responsible-gaming | 9 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-03\|18-F-03]] — AT-OGH Lootbox-Update | responsible-gaming | 9 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-06\|18-F-06]] — Children's Data 16+ | responsible-gaming | 9 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-09\|18-F-09]] — OpenSSF Scorecard 7/10 | security-oss | 9 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-10\|18-F-10]] — DCO vs CLA | open-source | 9 | mitigated |

---

## P4 — Backlog / accepted-risk (Score < 9 oder Future-Scope)

| Finding | Domain | Score | Status |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-08\|01-F-08]] — Multi-Region-Latenz | architecture | 9 | mitigated |
| [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-10\|01-F-10]] — Storage-Wachstum | architecture | 9 | mitigated |
| [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-09\|02-F-09]] — Coverage-Ratchet greenfield-blind | tech | 9 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-07\|03-F-07]] — Async-MP Zeitzonen | gameplay | 9 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-09\|03-F-09]] — Accessibility-Schuld | gameplay | 9 | mitigated |
| [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-10\|03-F-10]] — PWA-Offline-Erwartung | gameplay | 9 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-05\|04-F-05]] — Payment-Provider-Lock-In | monetization | 10 | mitigated |
| [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09\|04-F-09]] — Kosten-Explosion viraler Spike | monetization | 8 | mitigated |
| [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-11\|05-F-11]] — Achievement-Farming Trivial-Liga | security | 9 | mitigated |
| [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-09\|07-F-09]] — Session-Replay-Falle | live-ops | 10 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-07\|08-F-07]] — FIFPro/Player-Likeness | legal | 8 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-09\|08-F-09]] — DAC7 Marketplace | tax | 3 | mitigated |
| [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-13\|08-F-13]] — Withholding Tax US | tax | 4 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-04\|09-F-04]] — Pseudo-Localization CI | i18n | 8 | mitigated |
| [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-08\|09-F-08]] — Schriftarten-Bloat CJK | i18n | 8 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-09\|10-F-09]] — Kontrast shadcn/ui Slate | accessibility | 9 | mitigated |
| [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-10\|10-F-10]] — Accessible Authentication 3.3.8 | accessibility | 9 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-07\|11-F-07]] — Local-LLM-Hosting Limits | ai-llm | 6 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-08\|11-F-08]] — SDK-Provider-Lock-In | ai-llm | 6 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-09\|11-F-09]] — OSS-Model-Lizenz-Risiko | ai-llm | 6 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-10\|11-F-10]] — Pricing-Schock Cursor/CC | ai-llm | 4 | mitigated |
| [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-12\|11-F-12]] — ToS AI-on-AI | ai-llm | 4 | mitigated |
| [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-07\|12-F-07]] — Continental-Cup Repetition | game-balance | 9 | mitigated |
| [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-08\|14-F-08]] — Reputation-Archiv | brand | 6 | mitigated |
| [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-08\|15-F-08]] — WebAuthn Degradation | browser-auth | 8 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-05\|17-F-05]] — GlitchTip Maintainer | vendor-obs | 6 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-08\|17-F-08]] — Grafana LGTM AGPL-Pivot | vendor-obs | 6 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-10\|17-F-10]] — sops/age Sustainability | vendor-secrets | 6 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-11\|17-F-11]] — Hetzner Climate-Marketing | sustainability | 10 | mitigated |
| [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-12\|17-F-12]] — CSRD/VSME-Statement | sustainability-governance | 6 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-05\|18-F-05]] — Time-Spent-Reminder | responsible-gaming | 4 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-11\|18-F-11]] — Public Roadmap Solo | open-source | 6 | mitigated |
| [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-12\|18-F-12]] — Responsible-Gaming-Statement | responsible-gaming | 6 | mitigated |

### Future-Scope BYOC (alle accepted-risk bis Decision-Gate)

| Finding | Domain | Score | Status |
|---|---|---|---|
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-01\|06-F-01]] — Sybil-Cluster | byoc | 20 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-02\|06-F-02]] — Collusion-Wahrscheinlichkeit | byoc | 15 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-03\|06-F-03]] — Lineup/Tactic-Manipulation | byoc | 15 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-04\|06-F-04]] — Engine-Bundle-Mismatch | byoc | 20 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-05\|06-F-05]] — Verfügbarkeits-Kollaps Mobile | byoc | 20 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-06\|06-F-06]] — Privacy-Leak Tactic-Sicht | byoc | 9 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-07\|06-F-07]] — Reputations-/Slashing-Dysfunktional | byoc | 12 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-08\|06-F-08]] — DoS Geräte-Erschöpfung | byoc | 12 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-09\|06-F-09]] — DSGVO/Auftragsverarbeitung | byoc | 12 | accepted-risk |
| [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-10\|06-F-10]] — Wirtschaftlichkeit nicht gegeben | byoc | 12 | accepted-risk |

---

## Domain-Distribution (alle Reports)

| Domain | Total | P0 | P1 | P2 | P3 | P4 |
|---|---|---|---|---|---|---|
| Architecture | 10 | 1 | 2 | 1 | 4 | 2 |
| Tech & Ops | 10 | 1 | 2 | 2 | 4 | 1 |
| Gameplay | 10 | 0 | 3 | 1 | 3 | 3 |
| Monetization / Compliance | 10 | 1 | 2 | 1 | 4 | 2 |
| Security & Integrity (Report 05) | 12 | 2 | 2 | 1 | 6 | 1 |
| BYOC (Report 06) | 10 | 0 | 0 | 0 | 0 | 10 (accepted-risk) |
| Live-Ops (Report 07) | 10 | 0 | 3 | 1 | 5 | 1 |
| Legal/Tax (Report 08) | 13 | 3 | 0 | 2 | 5 | 3 |
| i18n (Report 09) | 10 | 0 | 0 | 1 | 7 | 2 |
| Accessibility (Report 10) | 11 | 1 | 1 | 4 | 3 | 2 |
| AI/LLM (Report 11) | 12 | 0 | 1 | 0 | 6 | 5 |
| Long-Term Balance (Report 12) | 10 | 0 | 4 | 3 | 2 | 1 |
| Community/UGC (Report 13) | 11 | 1 | 3 | 2 | 5 | 0 |
| Brand/PR (Report 14) | 9 | 1 | 0 | 3 | 4 | 1 |
| Browser/Device (Report 15) | 9 | 1 | 2 | 1 | 4 | 1 |
| Test-Strategy (Report 16) | 10 | 0 | 5 | 1 | 4 | 0 |
| Vendor-Lifecycle (Report 17) | 12 | 1 | 3 | 1 | 2 | 5 |
| Responsible-Gaming/OSS (Report 18) | 12 | 0 | 4 | 0 | 5 | 3 |
| **Total** | **~191** | **13** | **37** | **24** | **73** | **44** |

## Cross-Cutting-Findings

Findings mit Mehrfach-Wirkung — gemeinsam fixen:

- **Determinismus** ist 5-fach-Hebel:
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02]] (Tech) ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02]] (Gameplay) ↔ [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03]] (Anti-Cheat) ↔ [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-02]] (AI-Act-Befreiung) ↔ [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08]] (Balance-Hotfix-Replay) ↔ [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04]] (CI-Gate-Tiered) ↔ Foundation für [[PM-2026-05-20-06-distributed-match-compute|BYOC]].

- **Founder-Bus-Faktor** in 5 Reports:
  [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-08]] (Live-Ops) ↔ [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (Legal-Response) ↔ [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-01]] (Claude Code) ↔ [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04]] (Mod-Burnout) ↔ [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-01]] (Hetzner-Single-Account).

- **"MVP ohne X"-Linie** komplettiert:
  Kein Runtime-LLM ([[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]), kein Image-Upload ([[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-02]]), kein Free-Form-Chat ([[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-08]]), kein aktives Marketing ([[PM-2026-05-20-14-brand-pr-and-crisis-comms]]), kein Cloudflare-Workers-Lock ([[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-06]]), kein WebAuthn-Required ([[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-08]]), keine Lootboxes ([[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-10]]), keine Daily-Login-Streaks ([[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04]]).

- **Save-Schema v2 mit `SaveTrustLevel`** Konvergenz aus 5 Reports (accepted home: ADR-0115, FMX-184):
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01]] (Crypto-Anchor) ↔ [[PM-2026-05-20-06-distributed-match-compute|BYOC-Future]] ↔ [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08]] (versioned balance constants) ↔ [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-03]] (Brotli + engine_bundle_hash) ↔ [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05]] (Save-Forward-Compat-Matrix).

- **DSGVO + DSA + BFSG + CRA Compliance-Stack** (4 regulatorische Stichtage 2026):
  [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11]] (DSA Art. 16) ↔ [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02]] (BFSG/EAA-2025) ↔ [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-05]] (AI-Act-Art-50, 2026-08-02) ↔ [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07]] (CRA-Vuln-Reporting 2026-09-11, SBOM 2027-12-11) ↔ [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04]] (DSA Art. 25 + DFA Q4 2026).

- **Engine-Bundle-Hash-Rotation**:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12]] (Security) ↔ [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-04]] (BYOC) ↔ [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08]] (Balance) ↔ [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-03]] (Storage Compression-Header).

- **DSGVO-Erasure vs Audit-Aufbewahrung**:
  [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06]] (Steuer-Aufbewahrung 10 Jahre) ↔ [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09]] (PII in Logs) ↔ [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-09]] (Notice-Reporter-PII).

- **Command-Integritaet als Cross-Cutting-Foundation** (accepted home: ADR-0114, FMX-184):
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02]] (Security) ↔ Authz-Checks in [[PM-2026-05-20-01-architecture]] ↔ Anti-Cheat-Hebel in [[PM-2026-05-20-03-gameplay]] ↔ Webhook-Idempotenz [[PM-2026-05-20-04-monetization]].

## Konvention für Fix-Verkettung

In Commits, ADRs, Linear-Issues konsistent verwenden:
```
Addresses PM-2026-05-20-XX-F-NN
```
oder bei Vollständigkeit:
```
Fixes PM-2026-05-20-XX-F-NN
```

ADRs die als Antwort entstehen tragen Frontmatter:
```yaml
addresses: [PM-2026-05-20-XX-F-NN, PM-2026-05-20-XX-F-MM]
```

## Vorgeschlagene ADRs aus Iter 2 + 3

| ADR | Topic | Aus Report |
|---|---|---|
| ADR-0114 | Command Integrity & Replay Protection Posture | 05 (Iter 2), FMX-184 accepted |
| Future ADR TBD | BYOC Match Validation Quorum (Future-Scope) | 06 (Iter 2), unassigned after ADR renumbering |
| ADR-0115 | Save Trust Levels & Provenance Posture | 05 (Iter 2), FMX-184 accepted |
| ADR-0029 | LLM Provider Selection & Fallback Chain | 11 (Iter 3) |
| ADR-0030 | LLM-out-of-Authoritative-Game-State Boundary | 11 (Iter 3) |
| ADR-0031 | PII Redaction & EU-LLM-Routing-Policy | 11 (Iter 3) |
| ADR-0032 | EU AI Act Article 50 Compliance | 11 (Iter 3) |
| ADR-0033 | Dev-Tooling Bus-Factor Plan (Claude Code Backup) | 11 (Iter 3) |
| ADR-0034 | License Decision (AGPL-3.0 Client) | 18 (Iter 3) |
| ADR-0035 | Split-Repo Architecture (Client OSS / Server proprietär) | 18 (Iter 3) |
| ADR-0036 | Vendor Adapter-Layer Pattern (Subscription/DB/Error-Sink) | 17 (Iter 3) |
| ADR-0037 | SBOM + License-Compliance CI-Gate (CRA-2026/2027) | 17 (Iter 3) |
| ADR-0038 | Domain & DNS Resilience (INWX + Cloudflare-DNS + Registry-Lock) | 17 (Iter 3) |
| ADR-0039 | Storage Strategy (gzip-CompressionStream, Quota-Probe, LRU) | 15 (Iter 3) |
| ADR-0040 | Test-Strategy-Pyramid (16 Layer, Tiered Determinism, CI Hybrid) | 16 (Iter 3) |

## Re-Review

- **Monatlich**: Registry-Status durchgehen, Owner-Touch enforced.
- **Quartärlich**: Cluster-Index aktualisieren, Heatmap.
- **Nach Soft-Launch**: Neues Pre-Mortem-Bündel `PM-<soft-launch-date>-*` erstellen, dieses ggf. `superseded` wenn massiv überholt.
- **Bei Regulatory-Update**: 2026-08-02 (AI-Act-Art-50), 2026-09-11 (CRA-Vuln-Reporting), 2027-12-11 (CRA-volle Anwendbarkeit) — Registry erneut prüfen.

## Related

- [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
- [[00-index]] · [[threat-model]]
- Iter 1: [[PM-2026-05-20-01-architecture]] · [[PM-2026-05-20-02-tech-and-ops]] · [[PM-2026-05-20-03-gameplay]] · [[PM-2026-05-20-04-monetization]]
- Iter 2: [[PM-2026-05-20-05-security-and-integrity]] · [[PM-2026-05-20-06-distributed-match-compute]]
- Iter 3: [[PM-2026-05-20-07-live-ops-and-client-telemetry]] · [[PM-2026-05-20-08-legal-consumer-law-and-tax]] · [[PM-2026-05-20-09-i18n-and-localization]] · [[PM-2026-05-20-10-accessibility-and-inclusion]] · [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]] · [[PM-2026-05-20-12-long-term-balance-and-meta]] · [[PM-2026-05-20-13-community-moderation-and-ugc]] · [[PM-2026-05-20-14-brand-pr-and-crisis-comms]] · [[PM-2026-05-20-15-browser-device-storage-matrix]] · [[PM-2026-05-20-16-test-strategy-depth]] · [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]] · [[PM-2026-05-20-18-responsible-gaming-and-open-source]]
- [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
- [[../../00-Index/Current-State]]
