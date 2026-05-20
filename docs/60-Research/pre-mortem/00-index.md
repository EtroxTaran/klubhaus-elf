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
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-06-distributed-match-compute]]
  - [[threat-model]]
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
| [[PM-2026-05-20-01-architecture]] | Architektur | 10 (+Iter-2-Addendum) | 25 |
| [[PM-2026-05-20-02-tech-and-ops]] | Tech & Ops & Security | 10 (+Iter-2-Addendum) | 25 |
| [[PM-2026-05-20-03-gameplay]] | Gameplay | 10 (+Iter-2-Addendum) | 20 |
| [[PM-2026-05-20-04-monetization]] | Monetarisierung & Compliance | 10 (+Iter-2-Addendum) | 25 |
| [[PM-2026-05-20-05-security-and-integrity]] | Security & Integrity (Iter 2) | 12 | 25 |
| [[PM-2026-05-20-06-distributed-match-compute]] | Distributed Match Compute / BYOC (Iter 2, Future-Scope) | 10 (accepted-risk) | 20 |
| [[threat-model]] | Trust-Boundaries & STRIDE (Iter 2) | — | — |
| [[findings-registry]] | Status-Tracking aller 62 Findings | — | — |

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

Aus jetzt 62 Findings (40 Iter-1 + 12 Iter-2-Security + 10 Iter-2-BYOC, letztere `accepted-risk`) ergeben sich **sechs dominante Failure-Themen**:

1. **Verbrauchsfertige Infrastruktur fehlt.** SurrealDB single-node ist nicht produktionserprobt für 10k Spieler; Migrations-Story ist Placeholder.
2. **Determinismus ist Versprechen ohne Garantie.** Ohne CI-Gate + Semgrep-Regel kann ein `Math.random` das lautlos brechen. **Cross-Cutting: Tech + Gameplay + Security (Anti-Cheat-Foundation) + BYOC-Voraussetzung.**
3. **Gameplay-UX-Risiken** ohne Telemetrie blind.
4. **Monetarisierung ist 0 % implementiert.** Keine Hypothese, keine Analytics, keine Flags, keine Retention.
5. **Security-Fundament unvollständig (Iteration 2).** AES-GCM-Save-Envelope authentisiert *Kenntnis*, nicht *Herkunft* — Save-Forgery ist machbar; Commands sind nicht signiert/replay-geschützt; Supply-Chain unkontrolliert. Tampering-Skandal in async MP würde Vertrauen für Wochen zerstören.
6. **Single-Player-Foundation ist MP-/BYOC-tragend oder bricht später.** Wenn Save-Schema, Command-Modell und Determinismus-Garantie nicht *von Anfang an* MP-/BYOC-kompatibel gebaut werden, kosten Retrofits Quartale und brechen Determinismus-Replay.

> **Leitsatz Iteration 2.** *Single-Player ist das Fundament — aber jedes Datenformat, jeder Command-Pfad und jede State-Übergangsfunktion wird so entworfen, dass sie auch unter dem strengeren Vertrauensmodell von async Multiplayer und (zukünftig) Distributed Match Compute trägt. Ein Stack mit zuschaltbarem Trust-Level — nicht zwei Stacks.*

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
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02]] ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02]] ↔ [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03]] ↔ Foundation [[PM-2026-05-20-06-distributed-match-compute]].
- **Web-Worker-Bridge für Match-Engine** trifft Architektur + Gameplay (Mobile-Performance):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04]] ↔ [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06]].
- **Single-Node-Outage** trifft Architektur + Monetarisierung (verlorene Conversion-Events):
  [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02]] ↔ [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09]].
- **Observability ohne Dashboards** macht Auth/Anti-Abuse + Determinismus + Outbox blind:
  [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03]] ↔ [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09]].
- **Save-Format-Inkompatibilität SP ↔ MP (NEU Iter 2)**: ohne Schema v2 mit `trust_level` ist SP-Save später nicht für Cloud-Verify/Leaderboards verwendbar:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01]] ↔ Single-Player-Foundation-Check in [[PM-2026-05-20-01-architecture#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 01]] und [[PM-2026-05-20-03-gameplay#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 03]].
- **Engine-Bundle-Hash-Rotation (NEU Iter 2)**: betrifft Save-Verify, Match-Replay und BYOC-Quorum gleichermaßen:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12]] ↔ [[PM-2026-05-20-06-distributed-match-compute#PM-2026-05-20-06-F-04]].
- **DSGVO-Erasure vs Audit-Aufbewahrung (NEU Iter 2)**: Pseudonymisierungs-Pflichten:
  [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06]] ↔ [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09]] ↔ Runbook RB-S3.
- **Command-Signing als Cross-Cutting-Foundation (NEU Iter 2)**: deckt Tampering, Replay-Schutz, Audit, BYOC ab:
  [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02]] ↔ Authorization-Checks in [[PM-2026-05-20-01-architecture#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 01]] ↔ Anti-Cheat-Hebel in [[PM-2026-05-20-03-gameplay#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 03]] ↔ Webhook-Idempotenz in [[PM-2026-05-20-04-monetization#Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation|Report 04]].

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
| **Save-Schema v2 + trust_level Modell (ADR-0028) (Iter 2)** | architecture+security | T-90 | offen |
| **Command-Signing-Protokoll (ADR-0026) (Iter 2)** | architecture+security | T-90 | offen |
| **BYOC-Decision-Gate-Status (Iter 2)** | product+platform | T-0+90 (post-launch) | nicht gebaut, Future-Scope |
| **Bug-Bounty-Programm (Discord-Pilot vs HackerOne) (Iter 2)** | security | T-30 | offen |
| **Externer Pentest-Lieferant (Iter 2)** | security | T-60 | offen |

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
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-06-distributed-match-compute]]
- [[threat-model]]
- [[findings-registry]]
- [[../00-summary]]
- [[../wave-3-gap-analysis]]
- [[../feature-gap-analysis]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Home]]
- [[../../90-Meta/vault-governance]]
- [[../../90-Meta/agent-memory-protocol]]
