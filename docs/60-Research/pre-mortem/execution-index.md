---
title: "Pre-Mortem 2026-05-20 · Execution Index (Expertise-Kategorien)"
status: current
tags: [research, pre-mortem, execution, index, expertise, agent-brief, 2026-Q2]
created: 2026-05-20
updated: 2026-06-15
type: index
binding: false
report_set: 2026-05-20
related:
  - [[00-index]]
  - [[prioritization-matrix]]
  - [[findings-registry]]
  - [[threat-model]]
---

# Pre-Mortem 2026-05-20 · Execution Index — Expertise-basierte Kategorien

> **Zweck.** Diese Datei gruppiert die ~191 Findings nach **Skill-Domäne** statt nach Topic-Report, sodass ein frischer Agent (Mensch oder LLM) sich für **eine Kategorie** zuständig erklären und systematisch durch alle Findings dieser Kategorie arbeiten kann. Jede Kategorie liefert: Briefing-Block (Self-Contained Context), Findings-Liste (sortiert nach P0–P4), erwartete Output-Artefakte (ADR / Implementation-Spec / Runbook / Solution-Doc), Verifikations-Kriterien.
>
> **Schwesterdateien**: [[prioritization-matrix]] für Hebel-Analyse, [[findings-registry]] für vollständige Tabelle mit Status, [[00-index]] für Cluster-Übersicht, [[threat-model]] für Trust-Boundaries.

## Wie ein frischer Agent diese Datei nutzt

1. **Wähle eine Kategorie** (z. B. „SEC — Security & Cryptography Engineer").
2. **Lies den Kategorie-Brief** (Self-Contained-Context, max 1 Seite).
3. **Arbeite die Findings dieser Kategorie sequentiell durch** — beginnend mit P0, dann P1, P2, P3, P4.
4. Pro Finding:
   - Öffne den Quell-Report via Wikilink-Anchor (z. B. `[[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01]]`).
   - Lies Hypothese, Mitigation, Verifikation, linked_adrs, linked_code.
   - Produziere ein **Solution-Artefakt** (siehe Output-Vorlagen pro Kategorie).
   - Update das Finding-YAML: `status: mitigating` + `resolved_by: [docs/path-zur-Lösung]` + `linked_issues: [LIN-XX]`.
   - Spiegle Status in [[findings-registry]].
5. **Bei Cross-Cutting-Cluster** (siehe [[prioritization-matrix]] § Cluster A–G): bearbeite das ganze Cluster im Stück, nicht Finding-für-Finding — sonst Aufwand-Verschwendung.

## Output-Artefakt-Vorlagen

Pro Solution-Pfad ein konkretes Vault-Ziel:

| Solution-Typ | Pfad | Template |
|---|---|---|
| Architecture-Decision-Record | `docs/10-Architecture/09-Decisions/ADR-XXXX-<slug>.md` | [[../../90-Meta/templates/adr]] |
| Game-Design-Decision-Record | `docs/50-Game-Design/GD-XXXX-<slug>.md` | [[../../90-Meta/templates/game-design]] |
| Implementation-Spec | `docs/30-Implementation/<area>.md` | [[../../90-Meta/templates/implementation-note]] |
| Compliance-Doc | `docs/40-Compliance/<topic>.md` (neuer Ordner) | freie Form, mit Frontmatter |
| Runbook | `docs/40-Operations/runbooks/<id>-<name>.md` (neuer Ordner) | freie Form |
| Solution-Note (Diskussion) | `docs/30-Implementation/solutions/<finding-id>-<slug>.md` (neuer Ordner) | Hypothese → Decision → Impl-Sketch |

## Kategorien-Übersicht

| ID | Kategorie | Findings | P0-Anzahl | Typische Outputs |
|---|---|---|---|---|
| [SEC](#sec) | Security & Cryptography Engineer | ~19 | 2 | ADRs 0026/0028/0031/0032, Tampering-Test-Suite, gitleaks-Config |
| [BACKEND](#backend) | Backend & Persistence Engineer | ~17 | 2 | ADRs 0036/0039, SurrealDB-Migrations, Outbox-Spec |
| [PLATFORM](#platform) | Platform / DevOps / SRE | ~16 | 1 | ADR-0037 SBOM-CI, ADR-0038 DNS-Resilience, Runbooks |
| [FRONTEND](#frontend) | Frontend Engineer (PWA/Browser) | ~24 | 2 | Storage-Strategy, Compression-Config, i18n-Library, RUM-Setup |
| [DETERMINISM](#determinism) | Game-Engine / Determinism Engineer | ~11 | 1 | ADR-0030 LLM-Boundary, Determinism-CI-Gate, Save-Forward-Compat-Matrix |
| [GAMEDESIGN](#gamedesign) | Game-Design (Balance/Narrative/Long-Term) | ~16 | 0 | GDDRs, Markov-Slot-Pipeline, Balance-Constants-Versions |
| [TEST](#test) | Test-Engineering / QA | ~10 | 0 | Superseded by FMX-177 ADR-0118 test strategy packet, CI-Pipeline, axe-core-Setup |
| [A11Y](#a11y) | Accessibility / Design-System / UX | ~13 | 1 | react-aria-DnD, axe-core-CI, BFSG-Statement, Voice-Style-Guide |
| [LEGAL](#legal) | Legal / Compliance / DPO | ~18 | 3 | AGB, Impressum, FTO-Memo, DSA-Notice-Workflow, OSS-Registration |
| [PRODUCT](#product) | Product / Monetization / Analytics | ~10 | 1 | Monetisierungs-GDDR, PostHog-Setup, Feature-Flags |
| [AI](#ai) | AI / LLM Integration Engineer | ~12 | 0 | ADRs 0029/0030/0031/0032/0033, LLMService-Adapter, Fallback-Chain |
| [COMM](#comm) | Community / Moderation / UGC Engineer | ~12 | 1 | Block-List-Pipeline, Strike-System, Llama-Guard-Setup |
| [BRAND](#brand) | Brand / Marketing / PR / Crisis-Comms | ~9 | 1 | Rebrand-Decision, Pressekit, Crisis-Templates, Voice-Style-Guide |
| [FOUNDER](#founder) | Founder / Strategy / Decisions | ~10 | 0 | Service-Hours-Doc, License-Decision, Backup-Buddy-Contract |
| [SUSTAIN](#sustain) | Sustainability / ESG / Carbon | ~2 | 0 | VSME-Statement, SCI-Report |

> Manche Findings tauchen in mehreren Kategorien auf, weil sie multi-disziplinär sind (z. B. „Marken-Kollision SEGA/SI" = LEGAL + BRAND + FOUNDER). Die primäre Kategorie ist die, die den Hauptlift trägt.

---

## SEC — Security & Cryptography Engineer

**Briefing**. Du bist für alle Themen rund um Crypto-Bausteine, Save-Format-Integrität, Command-Integrität, Replay-Schutz, Audit-Log, Anti-Cheat-Foundation, Supply-Chain, Secret-Management, Account-Übernahme-Schutz, PII-Redaction zuständig. Kerntechnologien: Ed25519, HMAC-SHA-256, AES-256-GCM, BLAKE3, PBKDF2/Argon2id, WebAuthn/Passkey, cosign, sops + age, Sigstore, CycloneDX. Du baust auf [[threat-model]] auf (Trust-Zonen Z0–Z5, STRIDE-Matrix) und lieferst aktuelle Entscheidungsartefakte wie **ADR-0115 Command Integrity & Replay Protection** und **ADR-0116 Save Trust Levels & Provenance** (FMX-184 accepted) sowie spaetere PII/AI-Act/SBOM-Gates. Wichtig: dein Output muss kompatibel mit DETERMINISM-Kategorie sein (Replay-Foundation darf nicht brechen) und mit FRONTEND (Save-Format ist Frontend-konsumiert).

**Findings (sortiert P0 → P4)**

P0:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-01\|05-F-01]] — Save-Format authentisiert Kenntnis, nicht Herkunft (Score 25)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-02\|05-F-02]] — Commands nicht signiert / replay-geschützt (Score 25)

P1:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-05\|05-F-05]] — Supply-Chain unkontrolliert (Score 20)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03\|05-F-03]] — Determinismus-CI-Gate (Score 20, **Cross-Ref DETERMINISM**)
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-09\|15-F-09]] — DevTools-IDB-Tampering (Score 16)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-08\|18-F-08]] — gitleaks + Push-Protection (Score 20, **Quick-Win S-Effort**)

P2:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-04\|05-F-04]] — Save-Import als Deserialisierungs-Vektor (Score 16)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-06\|02-F-06]] — Auth/Recovery-Lücken (Score 15)

P3:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-06\|05-F-06]] — Bounded-Context-Authz (Score 12)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-07\|05-F-07]] — Webhook-Forgery (Score 15)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-08\|05-F-08]] — Audit-Log lückenhaft (Score 12)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09\|05-F-09]] — PII in Logs trotz Redaction (Score 15)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-10\|05-F-10]] — Account-Übernahme via Recovery-Codes (Score 15)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12\|05-F-12]] — Engine-Bundle-Hash-Rotation (Score 12)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-07\|02-F-07]] — Rate-Limiting nicht enforced (Score 12)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-08\|02-F-08]] — Secrets-Rotation nie geübt (Score 12)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-09\|18-F-09]] — OpenSSF Scorecard 7/10 (Score 9)

P4:
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-11\|05-F-11]] — Achievement-Farming Trivial-Liga (Score 9)
- BYOC-F-01/F-03/F-04/F-07 (accepted-risk, Future-Scope) — siehe [[PM-2026-05-20-06-distributed-match-compute]]

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture.md`
- `docs/10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture.md`
- `docs/10-Architecture/09-Decisions/ADR-0031-pii-redaction-llm-routing.md`
- `docs/10-Architecture/09-Decisions/ADR-0032-ai-act-art-50-compliance.md`
- `docs/30-Implementation/save-format-v2.md` (Schema-Spec)
- `docs/30-Implementation/command-bus-signing.md`
- `docs/30-Implementation/tampering-test-suite.md`
- `docs/40-Operations/runbooks/RB-S1-save-forgery-tool.md`
- `docs/40-Operations/runbooks/RB-S2-account-takeover-wave.md`
- `docs/40-Operations/runbooks/RB-S3-dsar-vs-audit.md`
- `.husky/pre-commit` mit gitleaks
- `.github/workflows/security-incremental.yml` (Semgrep + pnpm audit + Push-Protection-Hint)

**Verifikations-Kriterien**
- Tampering-Test-Suite läuft im CI (12 Mutation-Klassen alle reject/unverified).
- Pen-Test extern: forged Commands + replay'd Commands + expired Nonces → alle reject.
- gitleaks blockt synthetisches AWS-Key-Commit lokal + GitHub-Push-Protection blockt.
- OpenSSF Scorecard ≥ 7.0 auf `main`.
- DSAR-Erasure-Drill: Plaintext-Mail pseudonymisiert, Audit-Trail bleibt.

---

## BACKEND — Backend & Persistence Engineer

**Briefing**. Du bist für SurrealDB-Schema, Migrations-Framework, Outbox-Pattern, Command-Router, Server-Authoritative-Replay, Bounded-Context-Implementierung, Database-Backups + Restore-Drill zuständig. Stack: Node.js/TypeScript, SurrealDB 3.x (mit dokumentiertem Postgres-Fallback-Pfad), Redis (planned für Outbox), TanStack Start Server-Functions. Liefere ADR-Updates für **ADR-0019 Modular Monolith** (operative Lücken), **ADR-0013 Transactional Outbox** (Implementation), und neue **ADR-0036 Vendor Adapter-Layer Pattern**, **ADR-0039 Storage Strategy**. Kerne-Cross-Refs: [[PM-2026-05-20-01-architecture]], [[PM-2026-05-20-02-tech-and-ops]].

**Findings**

P0:
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-02\|01-F-02]] — SurrealDB Single-Node SPOF (Score 25)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-04\|02-F-04]] — Backups nie restored (Score 25)

P1:
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-03\|01-F-03]] — Week-Tick-Lastspitze ohne Batching (Score 20)
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-06\|01-F-06]] — Schema-Migration ohne Downtime (Score 20)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] — Versioned Balance Constants (Score 20, **Cross-Ref GAMEDESIGN**)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-02\|17-F-02]] — SurrealDB Monthly-Drift + Postgres-Fallback (Score 15)

P2:
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-01\|01-F-01]] — Bounded-Context-Erosion (Score 16)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-03\|12-F-03]] — Save-Bloat 30k Events (Score 20, **Cross-Ref FRONTEND** für IndexedDB-Tier-Storage)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05\|16-F-05]] — Save-Forward-Compat-Matrix (Score 20, **Cross-Ref TEST**)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-02\|07-F-02]] — Save-Stuck Reproduktions-Pfad (Score 20, **Cross-Ref PLATFORM** für CLI-Tool)

P3:
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-04\|01-F-04]] — Match-Engine nicht in Web-Worker (Score 12, **Cross-Ref FRONTEND**)
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-05\|01-F-05]] — Spectator-Snapshot Fan-Out (Score 12)
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-07\|01-F-07]] — Session-Store / Cross-Instance (Score 12)
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-09\|01-F-09]] — Outbox ohne Beobachtbarkeit (Score 12)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-05\|07-F-05]] — Determinismus-Drift state_hash (Score 15, **Cross-Ref DETERMINISM**)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-06\|07-F-06]] — Anomaly-Detection-as-Code (invariants.ts) (Score 12)

P4:
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-08\|01-F-08]] — Multi-Region-Latenz (Score 9)
- [[PM-2026-05-20-01-architecture#PM-2026-05-20-01-F-10\|01-F-10]] — Storage-Wachstum (Score 9)

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0036-vendor-adapter-layer-pattern.md`
- `docs/10-Architecture/09-Decisions/ADR-0039-storage-strategy-gzip-quota.md`
- `docs/30-Implementation/surrealdb-migration-framework.md` (replaces `db-migrate-placeholder.mjs`)
- `docs/30-Implementation/outbox-implementation.md`
- `docs/30-Implementation/save-replay-cli.md`
- `docs/30-Implementation/postgres-fallback-poc.md` (2-Wochen-Spike-Doc)
- `db/schema.surql` ausbauen über `club`-Stub hinaus
- `docs/40-Operations/runbooks/RB-A1-surrealdb-unresponsive.md`
- `docs/40-Operations/runbooks/RB-A2-week-tick-blocked.md`

**Verifikations-Kriterien**
- Monatlicher Restore-Drill in CI: `surreal import` auf ephemeren CX22, Roundtrip-Hash-Check.
- Load-Test-Profil „Week Advance": 1000 simulierte Saves Week-Tick simultan, < 60 s, Outbox-Lag < 30 s.
- Postgres-Fallback-PoC dokumentiert Migration-Cost in PT.

---

## PLATFORM — Platform / DevOps / SRE

**Briefing**. Du bist für CI/CD, Hetzner-Infrastruktur, Cloud-Migration-Pfad, Backups, Observability-Stack (OTel+Loki+Prometheus+Tempo+Grafana+GlitchTip), Incident-Response, Status-Page, DNS-Resilience, Secret-Management (sops+age), Container-Signing (cosign), Vendor-Lifecycle. Historisch nannte dieser Index **0040 Test-Pyramid + CI-Hybrid**; FMX-177 ersetzt diesen Zielslot durch accepted [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]] + current [[../../40-Quality/test-strategy]]. Liefere weiterhin ADRs **0037 SBOM + License-CI** und **0038 Domain & DNS Resilience**. Cross-Refs: [[PM-2026-05-20-02-tech-and-ops]], [[PM-2026-05-20-07-live-ops-and-client-telemetry]], [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]].

**Findings**

P0:
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-07\|17-F-07]] — CRA-SBOM-Pflicht (Score 25, **Stichtag 11.09.2026 Vuln-Reporting!**)

P1:
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-03\|02-F-03]] — Observability ohne Dashboards/Alerts (Score 20)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-01\|17-F-01]] — Hetzner-Suspension + Single-Account (Score 15)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-09\|17-F-09]] — Domain-Registrar SPOF (Score 10, **S-Effort Quick-Win**)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-10\|16-F-10]] — CI-Budget Hybrid (Score 20, **Cross-Ref TEST**)

P2:
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-10\|02-F-10]] — Incident-Response nur auf Papier (Score 16)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-03\|07-F-03]] — Severity-Klassifikation (Score 16)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-04\|07-F-04]] — Statuspage (Score 15)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-05\|02-F-05]] — Kein blue/green / Rollback (Score 12)

P3:
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-07\|07-F-07]] — Loki-Cardinality-Explosion (Score 12)
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-10\|07-F-10]] — Status-Page-Schweigen (Score 12)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-06\|17-F-06]] — Cloudflare-Workers Lock (Score 9)

P4:
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-09\|07-F-09]] — Session-Replay-Falle (Score 10)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-05\|17-F-05]] — GlitchTip Maintainer (Score 6)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-08\|17-F-08]] — Grafana LGTM AGPL-Pivot (Score 6)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-10\|17-F-10]] — sops/age Sustainability (Score 6)

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0037-sbom-license-ci-gate.md`
- `docs/10-Architecture/09-Decisions/ADR-0038-domain-dns-resilience.md`
- `docs/10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates.md` (FMX-177 accepted; replaces the old ADR-0040 placeholder)
- `.github/workflows/sbom-and-license.yml`
- `.github/workflows/ci.yml` ausgebaut (Hybrid GH + Hetzner-Runner)
- `infra/terraform/` Hetzner Cloud + Fly.io Cold-Standby-Modul
- `docs/40-Operations/incident-response.md` (Severity-Schema, On-Call-Window)
- `docs/40-Operations/runbooks/RB-T1-restore-drill.md`
- `docs/40-Operations/runbooks/RB-17-A-hetzner-suspension.md`
- `docs/40-Operations/observability-runbook.md` (Grafana-Dashboards-as-Code)
- Status-Page-Setup (Uptime Kuma oder OpenStatus auf externem Hosting)

**Verifikations-Kriterien**
- Restore-Drill quartärlich grün, RTO < 30 min, RPO < 24 h.
- Hetzner-Failover-Drill jährlich: Fly.io-Stack-up in < 4 h aus letztem Backup.
- SBOM in OCI-Registry mit cosign attached pro Release-Tag.
- ENISA-Vuln-Reporting-Workflow tested vor 2026-09-11.

---

## FRONTEND — Frontend Engineer (PWA / Browser)

**Briefing**. Du bist für Browser-Compatibility (Chrome 110+ / Firefox 113+ / Safari 16.4+ / Samsung 22+), IndexedDB-Quota-Management, Service-Worker-Strategy, Web-Worker-Stability, gzip-CompressionStream, RUM-Setup (web-vitals/attribution), iOS-A2HS-Onboarding, i18n-Implementation (Paraglide JS empfohlen), Telemetrie-Sampling. Stack: React + TanStack Start, shadcn/ui, Tailwind. Liefere **ADR-0039 Storage Strategy**, Implementation-Specs für Quota-Probe + LRU-Eviction + Service-Worker-Update-Flow.

**Findings**

P0:
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-01\|15-F-01]] — iOS-Safari 7-Tage-Eviction (Score 25)

P1:
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-01\|07-F-01]] — RUM-Coverage INP/LCP/CLS (Score 20)
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-02\|15-F-02]] — QuotaExceededError Floor-Android (Score 20)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-03\|12-F-03]] — Save-Bloat 30k Events (Score 20, **Cross-Ref BACKEND**)

P2:
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-04\|15-F-04]] — Web-Worker OOM 3 GB Android (Score 16)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-01\|02-F-01]] — TanStack Start Beta-Bruch (Score 16)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-05\|09-F-05]] — Unicode-Property-Escapes statt [a-zA-Z] (Score 15)

P3:
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-03\|15-F-03]] — Brotli-CompressionStream feature-detect (Score 12)
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-05\|15-F-05]] — deviceMemory Tier-Misdetection (Score 9)
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-06\|15-F-06]] — Service-Worker stale-cache (Score 12)
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-07\|15-F-07]] — Network-Flakiness EU mobile (Score 9)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-01\|09-F-01]] — ICU MF flektierte Klubnamen (Score 12)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-02\|09-F-02]] — Library-Lock Paraglide vs i18next (Score 12)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-03\|09-F-03]] — RTL Logical-Properties (Score 12)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-06\|09-F-06]] — TMS Tolgee self-host (Score 9)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-07\|09-F-07]] — Locale-Detection-Hierarchie (Score 9)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-10\|09-F-10]] — Service-Worker Locale-Cache (Score 9)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-03\|10-F-03]] — Live-Region Match-Ticker (Score 16, **Cross-Ref A11Y**)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-06\|10-F-06]] — Squad-DataGrid role=grid (Score 16, **Cross-Ref A11Y**)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-07\|10-F-07]] — Halbzeit-Modal Focus-Trap (Score 12, **Cross-Ref A11Y**)

P4:
- [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-08\|15-F-08]] — WebAuthn-Degradation (Score 8)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-04\|09-F-04]] — Pseudo-Localization-CI (Score 8)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-08\|09-F-08]] — Schriftarten-Bloat CJK (Score 8)
- [[PM-2026-05-20-09-i18n-and-localization#PM-2026-05-20-09-F-09\|09-F-09]] — Übersetzer-Style-Guide (Score 8, **Cross-Ref BRAND**)

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0039-storage-strategy.md`
- `docs/30-Implementation/ios-a2hs-onboarding.md`
- `docs/30-Implementation/client-telemetry.md` ausgebaut um RUM-Web-Vitals
- `docs/30-Implementation/i18n-pipeline.md` (Paraglide JS + Tolgee)
- `docs/30-Implementation/storage-quota-probe.md`
- `docs/30-Implementation/service-worker-update-flow.md`
- `packages/save-core/src/compress.ts` (feature-detect gzip/brotli)
- `packages/save-core/src/quota.ts` (Pre-Write-Probe + LRU)
- `apps/web/src/core/device-tier.ts` (Multi-Signal-Tier)
- `apps/web/src/lib/i18n/pseudo.ts` (Pseudo-Loc-Generator)

**Verifikations-Kriterien**
- LambdaTest Real-Device-Smoke pro Release (Galaxy A12 + iPhone XS).
- Lighthouse-CI INP p75 ≤ 200 ms / LCP p75 ≤ 2.5 s / CLS p75 ≤ 0.1.
- Storage-Bloat-Test: 30-Jahre-Save lädt < 3 s auf Pixel-4a-Profil.
- iOS-A2HS-Install-Rate ≥ 25 % in iOS-First-Week-Cohort.

---

## DETERMINISM — Game-Engine / Determinism Engineer

**Briefing**. Du sorgst dafür, dass die Match-Engine bit-identisch replizierbar ist über Browser, Engine-Versionen und Server↔Client. Stack: TypeScript, PCG32 (pure-rand), 8 RNG-Streams (ADR-0003), fast-check für Property-Tests, Stryker für Mutation-Tests. Liefere **ADR-0030 LLM-out-of-Authoritative-State-Boundary**; die historische **ADR-0040 Test-Pyramid mit Tiered-Determinism** ist durch die akzeptierte FMX-177 ADR [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]] ersetzt. Hartes Constraint: jede deine Implementation darf weder `Math.random` noch `Date.now` noch externe nicht-deterministische Libs in `packages/match-engine/**` einführen. Cross-Refs: [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-12-long-term-balance-and-meta]], [[PM-2026-05-20-16-test-strategy-depth]], [[../determinism-and-replay]].

**Findings**

P1:
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-02\|02-F-02]] — Determinismus-Drift unentdeckt (Score 20)
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-02\|03-F-02]] — Determinismus-Drift bei Replays (Score 20)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03\|05-F-03]] — Determinismus-CI-Gate (Score 20)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-02\|11-F-02]] — LLM in Match-Engine-Pfad (Score 10, P1 wegen Impact-5)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-08\|12-F-08]] — Balance-Hotfix bricht Replay (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-02\|16-F-02]] — fast-check Property-Tests (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04\|16-F-04]] — Determinism-Tiered-CI-Gate 32/1000/10k (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05\|16-F-05]] — Save-Forward-Compat-Matrix (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-06\|16-F-06]] — 50-Year-Soak-Assertions (Score 20)

P3:
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-06\|03-F-06]] — Mobile-Performance-Budget Match-Sim (Score 12)
- [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-12\|05-F-12]] — Engine-Bundle-Hash-Rotation (Score 12, **Cross-Ref SEC**)

P4 (Future-Scope BYOC):
- Alle Report-06-Findings als accepted-risk

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md`
- `docs/10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates.md` (gemeinsam mit TEST; accepted FMX-177)
- `docs/30-Implementation/determinism-replay-protocol.md`
- `docs/30-Implementation/balance-constants-versioning.md` (Temporal-Pattern)
- `docs/30-Implementation/match-engine-invariants.md`
- `packages/match-engine/src/replay.ts`
- `packages/match-engine/src/invariants.ts`
- `tests/fixtures/saves/v{N-2}/canonical.save` Test-Fixtures-Pflege
- `.github/workflows/determinism-tiered.yml` (32-Smoke / 1000-Nightly / 10k-Release)
- ESLint-Rule `no-llm-in-engine` für `packages/match-engine/**`
- Semgrep-Rule `no-math-random-in-engine`

**Verifikations-Kriterien**
- CI-Job `determinism-smoke` (32 Seeds) blockt PR bei Hash-Mismatch.
- Save-Forward-Compat-Matrix N×N replay-grid nightly grün.
- 50-Year-Soak ≤ 15 min, Mahalanobis-Distance ≤ 3σ gegen Baseline.
- fast-check 5 Engine-Invarianten als CI-required-check.
- ESLint-Rule blockt Test-Commit mit synthetic `Math.random` in Engine-Folder.

---

## GAMEDESIGN — Game-Design (Balance / Narrative / Long-Term)

**Briefing**. Du arbeitest an Match-Engine-Varianz, Roguelite-Mode-Tuning, Narrative-Templates-Burn, AI-Manager-Behaviour, Insolvency-Spirale, Achievements + Endgame-Hooks, Continental-Cup-Pacing. Stack: GDDR-Format (siehe [[../../50-Game-Design/README]] als Game-Design-Log). Cross-Refs: [[../late-game-systems]], [[../ai-manager-behaviour]], [[../narrative-content-pipeline]], [[../../50-Game-Design/GD-0008-finance-economy]], [[../../50-Game-Design/mode-create-a-club-roguelite]].

**Findings**

P1:
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-01\|03-F-01]] — Match-Engine-Varianz zu niedrig (Score 20)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-01\|12-F-01]] — Wage-/Prize-Inflation (Score 20)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-02\|12-F-02]] — AI-Manager-Convergence (Score 20)

P2:
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-04\|03-F-04]] — Insolvency-Spiral unverständlich (Score 16, **Cross-Ref A11Y/UX**)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-04\|12-F-04]] — Carry-Slot-Compound (Score 16)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-05\|12-F-05]] — Narrative-Template Burn (Score 15)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-10\|12-F-10]] — Achievement-Saturation / Endgame (Score 16)

P3:
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-05\|03-F-05]] — Content-Burn (Score 12)
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-08\|03-F-08]] — Endgame leer (Score 12)
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-07\|03-F-07]] — Async-MP Zeitzonen (Score 9)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-06\|12-F-06]] — Insolvency-Spiral Calibration (Score 12)
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-09\|12-F-09]] — Player-Attribute Outliers (Score 9)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-01\|18-F-01]] — Roguelite-Insolvency Dark-Pattern-Audit (Score 9, **Cross-Ref LEGAL**)

P4:
- [[PM-2026-05-20-12-long-term-balance-and-meta#PM-2026-05-20-12-F-07\|12-F-07]] — Continental-Cup Repetition (Score 9)

**Erwartete Output-Artefakte**
- `docs/50-Game-Design/GD-0002-match-engine.md` (DRAFT → APPROVED)
- `docs/50-Game-Design/GD-0008-finance-economy.md` Update — Wage-Cap-Macro-Anchor
- `docs/50-Game-Design/ai-manager-tactical-stubbornness.md`
- `docs/30-Implementation/markov-slot-narrative-generator.md` (deterministic, build-time)
- `docs/50-Game-Design/achievement-tiered-3-stufen.md`
- `docs/50-Game-Design/dark-pattern-audit-checklist.md` (15-Item-PR-Template)

**Verifikations-Kriterien**
- 50-Saison-Headless-Sim: median Cash-to-Wage-Ratio < 8.
- Tactic-Family-Entropie ≥ 2.0 bit @ Saison 20.
- Narrative-Template-Repeat-Rate < 35 %/Saison nach Markov-Slot-Expansion.
- NPS-Frage „lebendig nach 10 Jahren?" ≥ +25 in n=20-Playtest.

---

## TEST — Test-Engineering / QA

**Briefing**. Du baust die 16-Layer-Test-Pyramide (Unit/Property/Mutation/Component/Visual/Integration/E2E/A11y/Determinism/Forward-Compat/Soak/Cross-Browser/Chaos/Perf/Security/Load/DAST). Stack und Tool-Versionen sind nicht mehr aus diesem historischen Index zu übernehmen: FMX-177 prüfte 2026-06-15 die aktuellen offiziellen Quellen und akzeptiert Vitest 4 / Playwright / Stryker / fast-check via [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]] + [[../../40-Quality/test-strategy]]. Cross-Refs zu jedem anderen Kategorien-Vertical (du baust ihre Verifikations-Gates).

**Findings**

P1:
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-02\|16-F-02]] — Property-based Testing (Score 20, **Cross-Ref DETERMINISM**)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-04\|16-F-04]] — Determinism-Tiered-CI (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-05\|16-F-05]] — Save-Forward-Compat-Matrix (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-06\|16-F-06]] — 50-Year-Soak-Assertions (Score 20)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-10\|16-F-10]] — CI-Budget Hybrid (Score 20)

P2:
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-01\|16-F-01]] — Vitest Browser-Mode baseline (historical Vitest 3 wording superseded by FMX-177 current-version checks; Score 16)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-11\|10-F-11]] — axe-core CI (Score 16, **Cross-Ref A11Y**)

P3:
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-03\|16-F-03]] — Stryker scoped /engine (Score 9)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-07\|16-F-07]] — Argos Visual-Regression (Score 9)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-08\|16-F-08]] — Chaos-Engineering Toxiproxy (Score 9)
- [[PM-2026-05-20-16-test-strategy-depth#PM-2026-05-20-16-F-09\|16-F-09]] — Cross-Browser LambdaTest (Score 9)
- [[PM-2026-05-20-02-tech-and-ops#PM-2026-05-20-02-F-09\|02-F-09]] — Coverage-Ratchet greenfield-blind (Score 9)

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates.md` (FMX-177 accepted; replaces the old ADR-0040 placeholder)
- `.github/workflows/ci.yml` (Hybrid GH-PR + Hetzner-Nightly + Release)
- `docs/40-Quality/test-strategy.md` (16-Layer-Pyramide dokumentiert)
- `docs/40-Quality/mutation-trend.md` (Stryker Tier-A-Scope)
- `docs/40-Quality/ci-budget.md` (Monatlich tracked)
- `docs/40-Quality/release-checklist.md`
- `tests/property/match-engine-invariants.test.ts` (5 Core-Properties)
- `tests/soak/50-year-headless.test.ts`
- Hetzner self-hosted Runner-Setup (`testflows/testflows-github-hetzner-runners`)

**Verifikations-Kriterien**
- CI-PR-Wall-Time median ≤ 15 min, p95 ≤ 25 min.
- Mutation-Score `src/engine/**` ≥ 70 break / 80 low / 90 high.
- a11y critical+serious violations = 0 pro PR.
- Total CI-Spend ≤ $60/Mo MVP.

---

## A11Y — Accessibility / Design-System / UX

**Briefing**. Du sicherst WCAG 2.2 AA + EAA-2025 + BFSG. Stack: shadcn/ui (Radix), Tailwind CSS Logical-Properties, react-aria (für komplexe DnD-Pattern). Cross-Refs: [[../../10-Architecture/09-Design-System]] für Design-Token-Audit. Solid foundation in der UX/Onboarding-Story (Single-Advance-Verb ist bereits Anti-Dark-Pattern).

**Findings**

P0:
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-01\|10-F-01]] — WCAG 2.5.7 Dragging Movements (Score 25)

P1:
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-03\|03-F-03]] — Onboarding 60s-Spec vs Realität (Score 20)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-02\|10-F-02]] — BFSG-Geltungsbereich (Score 20)

P2:
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-03\|10-F-03]] — Live-Region Match-Ticker (Score 16)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-05\|10-F-05]] — Color-Only Status (Score 15)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-06\|10-F-06]] — Squad-DataGrid role=grid (Score 16)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-11\|10-F-11]] — axe-core CI (Score 16, **Cross-Ref TEST**)

P3:
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-04\|10-F-04]] — prefers-reduced-motion (Score 12)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-07\|10-F-07]] — Halbzeit-Modal Focus-Trap (Score 12)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-08\|10-F-08]] — Touch-Target 2.5.8 (Score 12)
- [[PM-2026-05-20-03-gameplay#PM-2026-05-20-03-F-09\|03-F-09]] — Accessibility-Schuld (Score 9)

P4:
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-09\|10-F-09]] — Kontrast shadcn/ui Slate (Score 9)
- [[PM-2026-05-20-10-accessibility-and-inclusion#PM-2026-05-20-10-F-10\|10-F-10]] — Accessible Authentication 3.3.8 (Score 9)

**Erwartete Output-Artefakte**
- `docs/30-Implementation/accessibility-statement.md` (BFSG / EN 301 549 v3.2.1)
- `docs/30-Implementation/tactic-board-react-aria-dnd.md`
- `docs/10-Architecture/09-Design-System.md` Update — Status-Token-Pattern + Lint-Rule
- `docs/30-Implementation/onboarding-funnel-usability-test.md`
- `tests/a11y/playwright-axe-suite.test.ts`
- Storybook `addon-a11y` standardmäßig aktiv

**Verifikations-Kriterien**
- axe-core critical+serious = 0 pro PR auf allen Top-Level-Routes.
- Lighthouse a11y ≥ 95 pro Route.
- SR-Time-to-Complete Halbzeit-Sub ≤ 2× Sighted-Baseline (NVDA + VoiceOver).
- Aktion Mensch / DBSV Real-User-Test 1×/Jahr.

---

## LEGAL — Legal / Compliance / DPO

**Briefing**. Du bist für DSGVO-konformen Umsetzungs-Stack, EU-Verbraucherrecht (BGB §§ 327 ff., AGB-Kontrolle, Widerrufsbelehrung), DDG-Impressum, Markenrecht (DPMA + EUIPO), DSA (Art. 11/16/19/23/25), BFSG, EAA, AI-Act, CRA, Glücksspielrecht, Steuerrecht (OSS, DAC7, Kleinunternehmer). Du brauchst eine externe DE-Fachanwältin für IT-/Markenrecht. Liefere AGB + Impressum + Datenschutzerklärung + Trust-Center + FTO-Memo. Cross-Refs: [[../gdpr-compliance]] (locked), [[../ip-and-licensing]] (locked).

**Findings**

P0:
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-05\|08-F-05]] — Marken-Kollision SEGA/SI (Score 20, **Cross-Ref BRAND + FOUNDER**)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-06\|08-F-06]] — UGC DFL-Vereinslogos (Score 20)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-11\|08-F-11]] — DSA Art. 16 (Score 15, **P0 wegen Compliance**, Cross-Ref COMM)

P1:
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-04\|18-F-04]] — DSA Art. 25 + DFA 2026 (Score 20)

P2:
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-04\|08-F-04]] — Impressum § 5 DDG (Score 10)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-10\|08-F-10]] — Lootbox/Glücksspielrecht (Score 15)

P3:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-06\|04-F-06]] — DSGVO/Verbraucherschutz beim Bezahlen (Score 15)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-01\|08-F-01]] — § 327f BGB Update-Pflicht (Score 12)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-02\|08-F-02]] — § 356 Widerrufsrecht (Score 10)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-03\|08-F-03]] — AGB-Kontrolle §§ 305 ff. (Score 12)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-08\|08-F-08]] — OSS-Schwelle 10 k € (Score 12, **Cross-Ref PRODUCT**)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-04\|11-F-04]] — DSGVO US-LLM (Score 12, **Cross-Ref AI**)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-05\|11-F-05]] — AI-Act Art. 50 (Score 9)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-09\|13-F-09]] — Notice-Reporter-PII vs Audit (Score 12, **Cross-Ref COMM**)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-03\|18-F-03]] — AT-OGH Lootbox-Update (Score 9)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-06\|18-F-06]] — Children's Data 16+ (Score 9)

P4:
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-07\|08-F-07]] — FIFPro/Player-Likeness (Score 8)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-09\|08-F-09]] — DAC7 Marketplace (Score 3)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-12\|08-F-12]] — AI-Act Art. 50 (Score 4)
- [[PM-2026-05-20-08-legal-consumer-law-and-tax#PM-2026-05-20-08-F-13\|08-F-13]] — Withholding-Tax US (Score 4)

**Erwartete Output-Artefakte**
- `docs/40-Compliance/agb-final.md`
- `docs/40-Compliance/impressum.md`
- `docs/40-Compliance/datenschutzerklärung-final.md`
- `docs/40-Compliance/fto-memo.md` (von Anwältin signiert)
- `docs/40-Compliance/dsa-notice-and-action-spec.md`
- `docs/40-Compliance/oss-vat-registration.md`
- `docs/40-Compliance/iarc-rating.md`
- `docs/40-Operations/runbooks/RB-L1-abmahnung.md`
- `docs/40-Operations/runbooks/RB-L2-dsar-vs-tax-retention.md`
- `docs/40-Operations/runbooks/RB-L3-trademark-cease-desist.md`

**Verifikations-Kriterien**
- AGB durch DE-Fachanwältin signiert.
- Impressum-Check: alle § 5 DDG-Pflichtfelder, kein TMG-Rest, kein OS-Plattform-Link.
- FTO-Memo Top-3-Brand-Finalisten + DPMA-Anmeldung-Beleg.
- DSA Notice-Form 24h-ACK / 7d-Decision-SLA verifiziert.

---

## PRODUCT — Product / Monetization / Analytics

**Briefing**. Du committest die Monetarisierungs-Hypothese, baust Funnel-Analytics auf (PostHog self-hosted empfohlen), aktivierst Feature-Flags (GrowthBook), Retention-Loops (Brevo + Web-Push), Soft-Launch-Strategy (DE/CH 4–6 Wo), Helpdesk. Stack: Stripe + Paddle TBD (Paddle MoR empfohlen für MVP).

**Findings**

P0:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-01\|04-F-01]] — Keine Monetarisierungs-Hypothese (Score 25)

P1:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-02\|04-F-02]] — Kein Product-Analytics (Score 20)
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-07\|04-F-07]] — Retention-Loop fehlt (Score 20)

P2:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-04\|04-F-04]] — Kein Soft-Launch / Beta (Score 16)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-04\|17-F-04]] — Stripe vs Paddle MoR (Score 15)

P3:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-03\|04-F-03]] — Keine Feature-Flags / A/B (Score 12)
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-08\|04-F-08]] — Kein Customer-Support (Score 12)
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-10\|04-F-10]] — Refund-/Chargeback-Welle (Score 12)

P4:
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-05\|04-F-05]] — Payment-Provider-Lock-In (Score 10)
- [[PM-2026-05-20-04-monetization#PM-2026-05-20-04-F-09\|04-F-09]] — Kosten-Explosion viraler Spike (Score 8, **Cross-Ref PLATFORM**)

**Erwartete Output-Artefakte**
- `docs/50-Game-Design/GD-XXXX-monetization-hypothesis.md` (Cosmetics-only-Battle-Pass empfohlen; NO Lootbox, NO Trade)
- `docs/10-Architecture/09-Decisions/ADR-XXXX-payment-provider-paddle.md`
- `docs/30-Implementation/posthog-self-host.md`
- `docs/30-Implementation/feature-flags-growthbook.md`
- `docs/30-Implementation/retention-loop-brevo-webpush.md`
- `docs/30-Implementation/soft-launch-strategy.md` (DE-only 4–6 Wo)
- `docs/30-Implementation/helpdesk-setup.md` (FreeScout self-host oder Plain)

**Verifikations-Kriterien**
- Monetarisierungs-GDDR approved vor T-90.
- PostHog-Funnel-Events live ab Beta.
- Payment-Smoke-Test Stripe + Paddle parallel funktional.
- Retention-Welcome-Series + Match-Push live.

---

## AI — AI / LLM Integration Engineer

**Briefing**. Du bist verantwortlich für LLM-Use-Case-Architektur (post-MVP), Provider-Selection (Mistral EU als Primary empfohlen), Fallback-Chain mit Circuit-Breaker + Cost-Cap, PII-Filter-Layer, Determinism-Boundary (`packages/match-engine/**` ist NO-GO), EU AI Act Art. 50-Compliance, Adapter-Layer (kein direkter SDK-Call außerhalb `packages/llm-adapter/`). Stack: Mistral SDK, Anthropic SDK (via AWS Bedrock eu-central-1), Vertex AI Frankfurt, OpenRouter (optional aggregator). Liefere **ADR-0029/0030/0031/0032/0033**. Cross-Refs: [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-08-legal-consumer-law-and-tax]].

**Findings**

P1:
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-02\|11-F-02]] — LLM in Match-Engine-Pfad (Score 10, P1 wegen Impact-5, **Cross-Ref DETERMINISM**)

P3:
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-01\|11-F-01]] — Anthropic Bus-Faktor Dev (Score 12)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-03\|11-F-03]] — Kosten-Explosion (Score 9)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-04\|11-F-04]] — DSGVO US-LLM (Score 12)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-05\|11-F-05]] — AI-Act Art. 50 (Score 9)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-06\|11-F-06]] — LLM-Halluzination (Score 12)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-11\|11-F-11]] — Customer-Support-Bot Halluzinationen (Score 12)

P4:
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-07\|11-F-07]] — Local-LLM-Hosting-Limits (Score 6)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-08\|11-F-08]] — SDK-Provider-Lock-In (Score 6)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-09\|11-F-09]] — OSS-Model-Lizenz-Risiko (Score 6)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-10\|11-F-10]] — Pricing-Schock Cursor/CC (Score 4)
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-12\|11-F-12]] — ToS-AI-on-AI (Score 4)

**Erwartete Output-Artefakte (alle post-MVP, vor erstem Runtime-LLM-Feature)**
- `docs/10-Architecture/09-Decisions/ADR-0029-llm-provider-selection-fallback.md`
- `docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md` (gemeinsam mit DETERMINISM)
- `docs/10-Architecture/09-Decisions/ADR-0031-pii-redaction-llm-routing.md`
- `docs/10-Architecture/09-Decisions/ADR-0032-ai-act-art-50-compliance.md`
- `docs/10-Architecture/09-Decisions/ADR-0033-dev-tooling-bus-factor-plan.md`
- `packages/llm-adapter/src/` (Anti-Corruption-Layer)
- `docs/30-Implementation/ai-literacy-onboarding.md` (Art. 4 AI Act)

**Verifikations-Kriterien**
- ESLint-Rule `no-direct-llm-sdk` (Imports nur in `packages/llm-adapter/`).
- CI-Job `match-engine-offline` schlägt bei Egress fehl.
- Synthetic Outage Mistral → Sekundär-Provider greift in < 800 ms.
- Cost-Canary tracked $/DAU/Tag.
- Quartärlicher „Tag ohne Claude Code"-Drill: Recovery < 4 h.

---

## COMM — Community / Moderation / UGC Engineer

**Briefing**. Du baust den DSA-Art-16-Notice-Workflow, die UGC-Block-List-Pipeline (Wikidata-Build + 6-Stufen-Matcher mit Confusable-Decode + Leet-Decode + Jaro-Winkler + Double-Metaphone), Strike-System, Moderation-Tooling (Llama-Guard 3 self-host EU + Obscenity + confusable-homoglyphs + Sharp+pHash für Wappen falls je aktiv). Stack: pNode/TS, Llama-Guard, NSFWJS optional. Cross-Refs: [[PM-2026-05-20-08-legal-consumer-law-and-tax]], [[PM-2026-05-20-13-community-moderation-and-ugc]].

**Findings**

P0:
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-01\|13-F-01]] — DSA Art. 16 SLA-Maschine (Score 25)

P1:
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-02\|13-F-02]] — § 86a Wappen-Pipeline (Score 20)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-03\|13-F-03]] — Vereins-Trademark-Blocklist (Score 20)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04\|13-F-04]] — Mod-Tier-System (Score 20)

P2:
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-05\|13-F-05]] — Hate-Speech-Bypass (Score 15)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-06\|13-F-06]] — Repeat-Offender-Policy (Score 16)

P3:
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-07\|13-F-07]] — Translation-UGC (Score 12)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-08\|13-F-08]] — Async-MP-Chat (Score 12)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-09\|13-F-09]] — Notice-Reporter-PII vs Audit (Score 12)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-10\|13-F-10]] — Username-Squatting (Score 12)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-11\|13-F-11]] — Save-Sharing-Forum (Score 12)

**Erwartete Output-Artefakte**
- `docs/10-Architecture/09-Decisions/ADR-XXXX-dsa-notice-action-workflow.md`
- `docs/30-Implementation/blocklist-pipeline-wikidata.md`
- `docs/30-Implementation/blocklist-matcher-6-stages.md`
- `docs/30-Implementation/strike-system.md`
- `docs/30-Implementation/llama-guard-self-host.md`
- `docs/40-Operations/runbooks/RB-C1-dfl-anwaltsschreiben.md`
- `docs/40-Operations/runbooks/RB-C2-mass-hate-speech-spam.md`
- `docs/40-Operations/runbooks/RB-C3-paragraph-86a-vorfall.md`
- `packages/moderation/src/blocklist/` + `packages/moderation/src/text/profanity.ts`
- `apps/web/src/pages/legal/notice.tsx`

**Verifikations-Kriterien**
- Notice-Acknowledgement p95 < 24 h, Decision p95 < 7 d.
- Bypass-Test-Suite ≥ 90 % Recall der Top-30-Profanity, ≤ 3 % False-Positive.
- 100 % der BL + 2.BL + UEFA-Top-100 in Block-List.
- Synthetic-Hate-Speech-Spam-Welle (200 Bot-Submissions/90 s) wird automatisch gethrottlet.

---

## BRAND — Brand / Marketing / PR / Crisis-Comms

**Briefing**. Du leitest den Rebrand (Top-3 Heimrunde/Klubkönig/Formationfuchs), arbeitest mit der DE-Markenanwältin, baust Stealth-Mode-Landing-Page, Pressekit, Mention-Monitoring-Zero-Cost-Stack, Crisis-Comms-Playbook mit 7 Templates. MVP-Modus = Stealth-Beta, kein aktives Marketing. Cross-Refs: [[PM-2026-05-20-14-brand-pr-and-crisis-comms]], [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (Markenrecht).

**Findings**

P0:
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-01\|14-F-01]] — Marken-Kollision (re-anchored from 08-F-05, Score 25)

P2:
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-02\|14-F-02]] — Crisis-Comms-Playbook (Score 16)
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-06\|14-F-06]] — Mention-Monitoring (Score 15)
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-07\|14-F-07]] — Crisis-Message-Archetypes 7 Templates (Score 16)

P3:
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-03\|14-F-03]] — Stealth-Beta-Discovery (Score 12)
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-04\|14-F-04]] — Founder-Voice Style-Guide (Score 12)
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-05\|14-F-05]] — Pressekit (Score 12)
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-09\|14-F-09]] — Apology-/Engagement-Patterns 90/10 (Score 9)

P4:
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms#PM-2026-05-20-14-F-08\|14-F-08]] — Reputation-Archiv (Score 6)

**Erwartete Output-Artefakte**
- `docs/30-Product/rebrand-decision.md` (Top-1 final + Backup-2)
- `docs/40-Compliance/fto-memo.md` (gemeinsam mit LEGAL)
- `apps/landing/` Stealth-Mode-Page (1-Screen, Email-Capture, Double-Opt-In)
- `apps/landing/press/` Pressekit (Logo + 8 Screenshots + Fact-Sheet DE+EN + Bio + ZIP)
- `docs/40-Operations/crisis-templates/` mit 7 Markdown-Templates (outage/save-corruption/account-hack/p2w/a11y/gdpr/tm-cease-desist)
- `docs/30-Product/voice-style-guide.md` (1 Seite, Ich-Form + 90/10-Regel)
- `docs/30-Product/engagement-rules.md`
- `docs/40-Operations/mention-monitoring-setup.md` (Google Alerts + Talkwalker Free + F5Bot + Discord-Bot)
- `docs/60-Research/reputation-archive.md` (laufend)

**Verifikations-Kriterien**
- DPMA-Markenanmeldung eingereicht vor T-60.
- Pressekit ZIP < 5 s Download, externe Testperson 200-Wort-Article ohne Rückfragen.
- Mention-Monitoring-Drill < 30 min für synthetic Brand-Mention.
- Crisis-Comms-Tabletop quartärlich grün.

---

## FOUNDER — Founder / Strategy / Decisions

**Briefing**. Du triffst die Top-Level-Entscheidungen: Service-Hours-Communication, License-Choice (AGPL-3.0 Client + proprietär Server empfohlen), Split-Repo-Architecture, Bus-Faktor-Mitigation (Backup-Buddy, alternative Dev-Tools), Vendor-Verträge (Hetzner-Dual-Account, Stripe vs Paddle Decision). Alle Findings hier sind „organisatorisch" — selten Code-only. Cross-Refs: alle anderen Kategorien gehen durch dich für Approval.

**Findings**

P1:
- [[PM-2026-05-20-07-live-ops-and-client-telemetry#PM-2026-05-20-07-F-08\|07-F-08]] — Service-Hours + Backup-Buddy (Score 20)
- [[PM-2026-05-20-13-community-moderation-and-ugc#PM-2026-05-20-13-F-04\|13-F-04]] — Founder als Mod-Burnout (Score 20, **Cross-Ref COMM**)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-01\|17-F-01]] — Hetzner-Single-Account-Suspend (Score 15)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-02\|18-F-02]] — License-Decision (Score 20)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-07\|18-F-07]] — Fork-Risk-Asymmetry / Split-Repo (Score 20)

P3:
- [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks#PM-2026-05-20-11-F-01\|11-F-01]] — Anthropic Bus-Faktor Dev (Score 12, **Cross-Ref AI**)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-03\|17-F-03]] — TanStack Start Maintainer (Score 12)
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-10\|18-F-10]] — DCO vs CLA (Score 9)

P4:
- [[PM-2026-05-20-18-responsible-gaming-and-open-source#PM-2026-05-20-18-F-11\|18-F-11]] — Public Roadmap Solo (Score 6)

**Erwartete Output-Artefakte**
- `docs/00-Index/Service-Hours.md` (öffentlich erklärt: Werktags + Saturday-Match-Window)
- `docs/30-Product/backup-buddy-contract.md` (DSGVO-DPA für Trusted-Helper)
- `LICENSE` (AGPL-3.0-or-later) + `SPDX-License-Identifier:` in jeder Source-Datei
- `docs/10-Architecture/09-Decisions/ADR-0034-license-decision.md`
- `docs/10-Architecture/09-Decisions/ADR-0035-split-repo-architecture.md`
- `docs/10-Architecture/09-Decisions/ADR-0033-dev-tooling-bus-factor-plan.md` (gemeinsam mit AI)
- `docs/40-Operations/runbooks/RB-F1-hetzner-suspension.md`
- `docs/40-Operations/founder-wellness-protocol.md` (Quartärlich-Urlaub-Pflicht)

**Verifikations-Kriterien**
- Service-Hours auf Landing-Page + im Discord-Server-Topic publiziert.
- Backup-Buddy hat geübten Restart-Container + Statuspage-Post-Workflow.
- LICENSE-File in Repo-Root + REUSE-Tool-Check grün.
- Quartärlicher „Tag ohne Claude Code"-Drill durchgeführt.
- Founder-Journal: max 1 Page > 60 h/Woche pro Quartal.

---

## SUSTAIN — Sustainability / ESG / Carbon

**Briefing**. Du baust den VSME-aligned Sustainability-Stack: SCI-Score pro Match-Sim (ISO 21031:2024), Carbon-Footprint-Report, Vendor-EU-Residency-Liste, Hetzner-Climate-Marketing-Claim. Kein Greenwashing („carbon-neutral" ohne Offset = verboten unter EU Green Claims Directive 2026).

**Findings**

P4:
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-11\|17-F-11]] — Hetzner Climate-Marketing (Score 10)
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability#PM-2026-05-20-17-F-12\|17-F-12]] — CSRD/VSME-Statement (Score 6)

**Erwartete Output-Artefakte**
- `docs/40-Compliance/sci-report-YYYY.md` (jährlich vor 31.03)
- `docs/40-Compliance/carbon-budget.md`
- `docs/30-Product/about-sustainability.md` (öffentlich, VSME-aligned 1-Pager)

**Verifikations-Kriterien**
- SCI-Score pro Match-Sim dokumentiert.
- Hetzner-Sustainability-Snapshot pro Quartal.
- VSME-Statement vor 31.03 jeden Jahres aktualisiert.

---

## Sprint-Empfehlung für Multi-Agent-Parallelisierung

Wenn mehrere frische Agenten parallel arbeiten, hier die Empfehlungen für minimale Cross-Wave-Interferenz:

### Welle Foundation (parallel)
- **SEC** + **DETERMINISM** synchronisieren sich auf Save-Schema v2 + Determinism-Tiered-CI
- **PLATFORM** + **TEST** synchronisieren sich auf CI-Pipeline-Composition
- **LEGAL** + **BRAND** synchronisieren sich auf Rebrand + FTO

### Welle UX (nach Foundation)
- **A11Y** + **FRONTEND** synchronisieren sich auf react-aria-DnD + Design-System-Token-Audit
- **GAMEDESIGN** alone arbeitet (GDDRs sind isolated)
- **PRODUCT** alone arbeitet (Monetisierungs-Hypothese + Analytics)

### Welle Operations (post-Launch)
- **COMM** rollt Moderation-Pipeline aus
- **AI** kommt erst bei erstem Runtime-LLM-Use-Case
- **FOUNDER** + **SUSTAIN** = laufende strategische Decisions

## Related

- [[00-index]] — Cluster-Hub
- [[prioritization-matrix]] — P × I Heatmap + Score × Effort + Cluster A–G
- [[findings-registry]] — vollständige Priorisierungs-Tabelle
- [[threat-model]] — Trust-Boundaries + STRIDE-Matrix
- [[../../90-Meta/templates/adr]] — ADR-Template
- [[../../90-Meta/templates/game-design]] — GDDR-Template
- [[../../90-Meta/templates/implementation-note]] — Implementation-Spec-Template
