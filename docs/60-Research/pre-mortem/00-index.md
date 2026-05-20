---
title: "Pre-Mortem 2026-05-20 · Cluster Index"
status: draft
tags: [research, pre-mortem, index, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
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
  - [[findings-registry]]
  - [[../wave-3-gap-analysis]]
  - [[../../00-Index/Current-State]]
  - [[../../00-Index/Research-Map]]
  - [[../../00-Index/Home]]
---

# Pre-Mortem 2026-05-20 · Cluster Index

> **Frage, die diese Übung beantwortet:** Was sind die wahrscheinlichsten Gründe, dass football-manager-x in sechs Monaten bei 10.000 Spielern gescheitert ist — und was tun wir *jetzt*, damit das nicht passiert?

Diese Pre-Mortem ist ein **Intent-Layer**-Dokument (`binding: false`). Empfehlungen werden über ADRs/GDDRs ratifiziert, nicht direkt aus diesem Cluster implementiert.

## Cluster

| Report | Domain | Findings | Höchster Score |
|---|---|---|---|
| [[PM-2026-05-20-01-architecture]] | Architektur | 10 | 25 |
| [[PM-2026-05-20-02-tech-and-ops]] | Tech & Ops & Security | 10 | 25 |
| [[PM-2026-05-20-03-gameplay]] | Gameplay | 10 | 20 |
| [[PM-2026-05-20-04-monetization]] | Monetarisierung & Compliance | 10 | 25 |
| [[findings-registry]] | Status-Tracking aller 40 Findings | — | — |

## Annahmen

| Parameter | Wert |
|---|---|
| Horizont | 2026-11-20 (6 Monate ab heute) |
| Registrierte Spieler | 10.000 |
| DAU | ~2.500 (25 % MAU) |
| Peak CCU am Match-Tick | ~200–400 |
| Szenario A | Single-node Hetzner (Ist) |
| Szenario B | Cloud-Autoscaling (Nutzer-Annahme) |

## Executive Summary

Aus 40 Findings ergeben sich **vier dominante Failure-Themen**:

1. **Verbrauchsfertige Infrastruktur fehlt.** SurrealDB single-node ist nicht produktionserprobt für 10k Spieler; Migrations-Story (Schema-Migration ohne Downtime, Restore-Drill) ist Placeholder.
2. **Determinismus ist Versprechen ohne Garantie.** Match-Engine soll deterministisch und replay-bar sein — ohne CI-Gate + Semgrep-Regel kann ein einziger `Math.random` das in Production lautlos brechen. Trifft Tech *und* Gameplay (Cross-Cutting).
3. **Gameplay-UX-Risiken (Onboarding, Insolvency, Content-Burn)** ohne Telemetrie blind. Wir messen Performance via Lighthouse, aber kein Comprehension/Funnel.
4. **Monetarisierung ist 0 % implementiert.** Keine Hypothese committed, keine Product-Analytics, keine Feature-Flags, keine Retention-Mechanik. Selbst ein technisch makelloser Launch produziert dann 0 € MRR.

## Risk-Heatmap (Probability × Impact)

|  | Impact 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **Probability 5** | | | | | **01-F-02 · 02-F-04 · 04-F-01** (Score 25) |
| **4** | | | | **01-F-01 · 02-F-01 · 02-F-10 · 03-F-04 · 04-F-04** (16) | **01-F-03 · 01-F-06 · 02-F-02 · 02-F-03 · 03-F-01 · 03-F-02 · 03-F-03 · 04-F-02 · 04-F-07** (20) |
| **3** | | | **01-F-08 · 01-F-10 · 02-F-09 · 03-F-07 · 03-F-09 · 03-F-10** (9) | **01-F-04 · 01-F-05 · 01-F-07 · 01-F-09 · 02-F-05 · 02-F-07 · 02-F-08 · 03-F-05 · 03-F-06 · 03-F-08 · 04-F-03 · 04-F-08 · 04-F-10** (12) | **02-F-06 · 04-F-06** (15) |
| **2** | | | | **04-F-09** (8) | **04-F-05** (10) |
| **1** | | | | | |

> Rote Zone (Score ≥ 20): 12 Findings → **Mitigations vor Launch verpflichtend**.

## Cross-Cutting Risks (Findings mit Mehrfachwirkung)

- **Determinismus-Drift** trifft Tech (Replays) + Gameplay (Spielerwahrnehmung):
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02]] ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02]].
- **Web-Worker-Bridge für Match-Engine** trifft Architektur (Server-Worker) + Gameplay (Mobile-Performance):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04]] ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06]].
- **Single-Node-Outage** trifft Architektur + Monetarisierung (verlorene Conversion-Events, Reputations-Schaden):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02]] ↔ [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09]].
- **Observability ohne Dashboards** macht Auth/Anti-Abuse + Determinismus + Outbox blind:
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03]] ↔ [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09]].

## Top-10-Mitigations (nach Hebel: Score × 1/Aufwand)

1. **Determinism-CI-Gate** (S-Aufwand, Score 20 × 2 Findings = sehr hoch). Adressiert: 02-F-02, 03-F-02.
2. **Restore-Drill automatisieren** (M-Aufwand, Score 25). Adressiert: 02-F-04.
3. **Monetarisierungs-Hypothese committen** (M-Aufwand, Score 25). Adressiert: 04-F-01.
4. **Mindest-Alert-Catalog + Dashboards-as-Code** (M-Aufwand, Score 20 + Cross-Cutting). Adressiert: 02-F-03, indirekt 01-F-09.
5. **PostHog (Analytics) + Funnel-Events Tag 1** (M-Aufwand, Score 20). Adressiert: 04-F-02.
6. **Migrations-Framework + Schema-blue/green** (M-Aufwand, Score 20). Adressiert: 01-F-06.
7. **Onboarding-Funnel-Telemetrie + Usability-Test (n=20)** (M-Aufwand, Score 20). Adressiert: 03-F-03.
8. **Retention-Loop (Brevo + Web-Push)** (M-Aufwand, Score 20). Adressiert: 04-F-07.
9. **Chunked Week-Tick + Outbox-Dashboards** (M-Aufwand, Score 20 + 12). Adressiert: 01-F-03, 01-F-09.
10. **Web-Worker-Bridge für Match-Engine** (M-Aufwand, Score 12 + Cross-Cutting). Adressiert: 01-F-04, 03-F-06.

## 30/60/90-Tage-Plan vor Launch

> Annahme: Launch in T-180. Plan beginnt in T-90 (3 Monate vor Launch). Bei tatsächlich anderem Launch-Datum entsprechend verschieben.

### T-90 bis T-60 — Foundation

- **Determinism-CI-Gate live** (Mitigation #1).
- **Migrations-Framework live** + erster echter Schema-Change in Staging (Mit #6).
- **Mindest-Alert-Catalog deployt**, Dashboards-as-Code (Mit #4).
- **Restore-Drill** als Monthly-Cron etabliert, RTO/RPO gemessen (Mit #2).
- **Monetarisierungs-GDDR + Pricing-ADR** approved (Mit #3).
- **PostHog deployed**, Event-Taxonomie definiert (Mit #5).

### T-60 bis T-30 — Validation

- **Soft-Launch / Closed-Beta in DE/CH** mit 200–500 Beta-Tester (4-F-04).
- **Onboarding-Usability-Test (n=20)** (Mit #7).
- **Web-Worker-Bridge** für Match-Engine live (Mit #10).
- **Chunked Week-Tick** mit Outbox-Beobachtbarkeit (Mit #9).
- **Retention-Loop initial** (Welcome-Series + Match-Push) (Mit #8).
- **Feature-Flags (GrowthBook) deployed**, erstes A/B im Beta (04-F-03).

### T-30 bis T-0 — Hardening

- **DR-Drill voller Restore** mit echtem Daten-Volumen.
- **Tabletop-Übung** mit allen Runbooks (RB-A1/2/3, RB-T1/2/3/4, RB-G1/2/3, RB-M1/2/3/4).
- **Legal-Review abgeschlossen** (AGB, Widerruf, Impressum) — 04-F-06.
- **Penetration-Test** durch externen Dienstleister (Gap F13).
- **WAF / Bot-Management aktiviert** (02-F-07).
- **Helpdesk live**, FAQ-Seite veröffentlicht (04-F-08).

## Decision Log (was bis wann zu entscheiden ist)

| Entscheidung | Owner | Stichtag | Status |
|---|---|---|---|
| Cloud-Provider (Fly.io vs AWS vs GCP vs Hetzner-Stack) | platform | T-90 | offen |
| DB-Strategie (SurrealDB beibehalten vs Postgres-Fallback) | platform+architecture | T-60 | offen |
| Monetarisierungs-Modell (F2P/Cosmetic vs Premium vs Hybrid) | product+founder | T-90 | offen |
| Payment-Provider (Stripe direkt vs Paddle MoR) | finance+backend | T-75 | offen |
| Analytics-Stack (PostHog self-host vs SaaS) | data+platform | T-90 | offen |
| Soft-Launch-Region (DE / CH / AT) | product+marketing | T-60 | offen |
| Promotion GD-0002 Match-Engine (DRAFT → APPROVED) | game-design | T-75 | offen |
| WAF / Bot-Management Provider | platform+security | T-45 | offen |
| Helpdesk-Tool (FreeScout self-host vs Plain vs Email) | support | T-30 | offen |
| Status-Page-Tool | platform | T-30 | offen |

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
- **Bei Wave-3-Gap-Schließung:** Findings die diesen Gap referenzieren auf `mitigating` setzen.

## Verifikation der Pre-Mortem selbst

- **Cross-Reference-Check:** alle Wikilinks und Code-Pfade müssen auflösbar sein (`grep`-Skript).
- **Wave-3-Coverage:** alle P0/P1-Gaps aus [[../wave-3-gap-analysis]] sind mindestens einmal abgedeckt (siehe Abdeckungs-Notiz unten).
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
- [[findings-registry]]
- [[../00-summary]]
- [[../wave-3-gap-analysis]]
- [[../feature-gap-analysis]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Home]]
- [[../../90-Meta/vault-governance]]
- [[../../90-Meta/agent-memory-protocol]]
