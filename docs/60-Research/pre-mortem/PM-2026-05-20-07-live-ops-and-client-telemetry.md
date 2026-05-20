---
title: "Pre-Mortem 2026-05-20 · 07 · Live-Ops & Client-Telemetry"
status: draft
tags: [research, pre-mortem, live-ops, telemetry, observability, incident-response, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: research
binding: false
report_id: PM-2026-05-20-07
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[threat-model]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-15-browser-device-storage-matrix]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../../30-Implementation/client-telemetry]]
---

# Pre-Mortem 2026-05-20 · 07 · Live-Ops & Client-Telemetry & Game-Edge-Cases

> **Failure-Headline-Kandidaten**
> - „Saturday-Match-Tick-Crash-Spike — niemand merkt es, weil der Solo-Founder schläft und keine Eskalation existiert."
> - „Save-State driftet seit Release X, kein Determinismus-Replay-Checksum-Pfad — Bug-Reports nicht reproduzierbar."
> - „Web Vitals (INP > 500 ms) nur in DevTools sichtbar — reale EU-Mobilfunk-Spieler erleben unspielbares Match-UI."
> - „Status-Page existiert nicht; Discord-Posts ersetzen Kommunikation; Late-Night-Outage → Spieler halten Projekt für tot."

## Scope

Live-Ops-Pre-Mortem: Telemetrie-Coverage, Severity-Klassifikation für Solo-Founder, „komische Game-Situationen" (Anomalie-Detection), Save-Stuck-Recovery, Status-Page-Kommunikation. Querschnittlich zu [[PM-2026-05-20-02-tech-and-ops]] (CI/CD-Reife) und [[PM-2026-05-20-15-browser-device-storage-matrix]] (Browser-Quirks).

## Top Failure-Hypothesen

Jede Failure-Hypothese erhält eine immutable ID (`PM-2026-05-20-07-F-NN`) und ein Prioritäts-Tag (P0–P4). Score = Wahrscheinlichkeit × Impact (je 1–5).

---

### PM-2026-05-20-07-F-01 — Fehlende RUM-Coverage für INP/LCP/CLS auf realen Geräten

```yaml
id: PM-2026-05-20-07-F-01
priority: P1
domain: live-ops
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "web_vitals_inp_p75_ms"
    threshold: "> 200 ms (web.dev good)"
  - metric: "web_vitals_lcp_p75_ms"
    threshold: "> 2500 ms"
  - metric: "web_vitals_cls_p75"
    threshold: "> 0.1"
mitigation_summary: "web-vitals v5 mit Attribution-Build + OTel-Browser-SDK + Beacon + Segmentierung (Route × Gerät × Netz)"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/client-telemetry]]]
linked_code:
  - "apps/web/src/routes/__root.tsx"
  - "apps/web/public/sw-register.js"
sources:
  - title: "Web Vitals"
    url: "https://web.dev/articles/vitals"
    accessed: "2026-05-20"
    publisher: "web.dev / Google"
    confidence: high
  - title: "web-vitals npm v5"
    url: "https://www.npmjs.com/package/web-vitals"
    accessed: "2026-05-20"
    publisher: "Google Chrome team"
    confidence: high
  - title: "Web Vitals Monitoring with OpenTelemetry Metrics"
    url: "https://signoz.io/docs/frontend-monitoring/web-vitals-with-metrics/"
    accessed: "2026-05-20"
    publisher: "SigNoz"
    confidence: medium
verification_notes: "INP ersetzt FID seit März 2024 als Core Web Vital. web-vitals v5 Attribution-Build liefert interactionTarget, inputDelay, processingDuration, presentationDelay für gezielte Mitigation."
status: open
owner_suggested: frontend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Ohne Field-RUM sehen wir Performance-Regressionen erst, wenn Spieler im Discord melden. INP ist sensibel auf Long-Tasks aus Match-Tick-Worker; auf Mid-Range Android schnell > 500 ms (poor).

**Mitigation.** `web-vitals/attribution` einbinden, alle vier Metriken (INP, LCP, CLS, TTFB) via `navigator.sendBeacon` an Same-Origin-Endpoint `/telemetry/v1/vitals`, durch Alloy/OTel als Prometheus-Histogramme. Sampling 100 % bis 50 req/s, dann 10–25 %. Segmentierung nach `route_id`, `effective_connection_type`, `device_class` (deviceMemory/hardwareConcurrency). CWV gilt als „strictly necessary" → keine Consent-Pflicht (EDPB ePrivacy-Position dokumentieren).

**Verifikation.** Lighthouse-CI Mid-Range-Profil (Slow 4G, 4× CPU throttle): INP ≤ 200 ms / LCP ≤ 2500 ms. Wöchentlicher Grafana-Report; p75 INP > 300 ms → Issue.

---

### PM-2026-05-20-07-F-02 — Kein Reproduktions-Pfad bei „Save lädt nicht"-Tickets

```yaml
id: PM-2026-05-20-07-F-02
priority: P1
domain: live-ops
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "save_load_failure_rate"
    threshold: "> 0.5 % über 1 h"
  - metric: "save_schema_version_mismatch_count"
    threshold: "> 0 / Release"
mitigation_summary: "Versionierte Save-Header + In-Game-Bug-Report mit (verschlüsseltem) Save-Upload + correlation_id; deterministische Replay-CLI server-side"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/client-telemetry]], [[PM-2026-05-20-05-security-and-integrity]]]
linked_code:
  - "apps/web/src/workers/match-engine/*"
  - "packages/save/* (geplant)"
sources:
  - title: "Sentry User Feedback"
    url: "https://docs.sentry.io/product/user-feedback/"
    accessed: "2026-05-20"
    publisher: "Sentry"
    confidence: high
  - title: "IndexedDB problems & oddities"
    url: "https://gist.github.com/pesterhazy/4de96193af89a6dd5ce682ce2adff49a"
    accessed: "2026-05-20"
    publisher: "Community"
    confidence: medium
verification_notes: "GlitchTip akzeptiert Sentry-JS-SDK-userFeedback-Protokoll ≥ 7.85. Schema-Bruch erfordert explizite Migration."
status: open
owner_suggested: backend+frontend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Beim ersten Schema-Bruch (z. B. neue RNG-Stream-Reihenfolge) bricht Load mit unspezifischem `TypeError`. Ohne Schema-Header (`{format: 'fmx.save', v: 7, engine: '0.42.1'}`) und ohne forensisch sicheren Snapshot-Upload muss der Founder per Discord-DM „Schick mir die Datei" — fehleranfällig, langsam, DSGVO-unsauber.

**Mitigation.** (1) Save-Format mit semver-Header + CRC32-Footer; Load-Pfad branchet auf `v` + Migration-Funktion. (2) In-Game-Bug-Report-Widget mit `correlation_id`, `release`, `engineVersion`, `save_id`, `save_version`. (3) Optionaler „Save zur Diagnose hochladen"-Button → Public-Key-verschlüsselt in S3-kompatiblen Bucket mit 30-Tage-TTL. (4) Server-CLI: `replay save+inputs` reproduziert lokal — pflicht vor jedem Engine-Release.

**Verifikation.** Synthetischer Negativtest in Staging: provoziere Schema-Mismatch, Bug-Report-Flow muss in < 90 s vollständiges Issue erzeugen. Quarterly „Restore from user report"-Game-Day.

---

### PM-2026-05-20-07-F-03 — Keine Severity-Klassifikation, Solo-Founder priorisiert nach Bauchgefühl

```yaml
id: PM-2026-05-20-07-F-03
priority: P2
domain: live-ops
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "mttr_minutes_sev1"
    threshold: "> 60 min"
mitigation_summary: "4-Stufen-SEV-Schema (PagerDuty/incident.io 2026), Trigger-Regeln in Grafana-Annotations, 2-Level-Eskalation (Self → Trusted-Buddy)"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-02-tech-and-ops]]]
linked_code: []
sources:
  - title: "PagerDuty Severity Levels"
    url: "https://response.pagerduty.com/before/severity_levels/"
    accessed: "2026-05-20"
    publisher: "PagerDuty"
    confidence: high
  - title: "incident.io best practices 2026"
    url: "https://incident.io/blog/incident-management-best-practices-2026"
    accessed: "2026-05-20"
    publisher: "incident.io"
    confidence: high
  - title: "Atlassian developer severities"
    url: "https://developer.atlassian.com/developer-guide/app-incident-severity-levels/"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
verification_notes: "Industrielle Konvention: 3- oder 5-Stufen-SEV mit „im Zweifel niedrigere Zahl = höhere Severity, im Postmortem korrigieren"."
status: open
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Ohne dokumentiertes SEV-Vokabular eskaliert der Founder zufällig oder verbrennt sich an Non-Issues.

**Mitigation.** **SEV1** = totaler Outage / Datenverlust / Security-Breach, Statuspage-Post < 15 min; **SEV2** = Major-Feature gebrochen oder Saturday-Peak betroffen, < 30 min; **SEV3** = nicht-kritisch, nächster Werktag; **SEV4** = kosmetisch / Backlog. Trigger als Boolean-Regeln in Grafana-Alert-Annotations. Solo-On-Call: Werktags-Default, Saturday 14–22 CET als „explicit on-call window" (Match-Tick-Slot), Backup-Buddy mit minimalen Admin-Rechten.

**Verifikation.** Tabletop-Exercise: Founder klassifiziert 5 fiktive Alerts, Buddy reviewt. Quartärlich Postmortem-Drift-Check.

---

### PM-2026-05-20-07-F-04 — Kein Statuspage, Kommunikation rein über Discord

```yaml
id: PM-2026-05-20-07-F-04
priority: P2
domain: live-ops
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "uptime_kuma_synthetic_check_failed_total"
    threshold: ">= 2 fails in 5 min"
mitigation_summary: "Uptime Kuma oder OpenStatus self-hosted, Grafana-Alert-gespeist, Discord-Webhook als Spiegel; SEV1 Updates alle 30 min auch ohne News"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Best Open Source Status Page Tools 2026"
    url: "https://www.openstatus.dev/guides/best-opensource-status-page-2026"
    accessed: "2026-05-20"
    publisher: "OpenStatus"
    confidence: high
  - title: "Atlassian Postmortems handbook"
    url: "https://www.atlassian.com/incident-management/handbook/postmortems"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
verification_notes: "Atlassian: „Always be communicating"; Discord allein erreicht ~30 % der Spielerschaft und ist nicht durchsuchbar."
status: open
owner_suggested: platform+founder
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Schweigen bei Outage = „Projekt tot" in der Spielerwahrnehmung.

**Mitigation.** Self-hosted Uptime Kuma (Hetzner-Sidecar) oder OpenStatus für `status.<domain>`. Auto-Komponenten: Match-Engine, API, Auth, Sync. Update-Kadenz: SEV1 alle 30 min auch ohne News („Investigating, no new ETA"), SEV2 alle 60 min. Public-Postmortem nach jedem SEV1/2 binnen 5 Werktagen, blameless.

**Verifikation.** Game-Day: simuliere Outage, Statuspage muss binnen 10 min auf „Investigating" stehen (Grafana-Webhook → OpenStatus-API).

---

### PM-2026-05-20-07-F-05 — Determinismus-Drift unerkannt, Match-Engine-Replay-Mismatch

```yaml
id: PM-2026-05-20-07-F-05
priority: P1
domain: live-ops
probability: 3
impact: 5
score: 15
confidence: high
early_warning:
  - metric: "match_tick_checksum_mismatch_total"
    threshold: "> 0"
mitigation_summary: "Pro-Tick state_hash (FNV-1a/BLAKE3) im Outbox-Event; Server vergleicht Client-Hash gegen Server-Replay"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]]
linked_specs: [[[../determinism-and-replay]], [[PM-2026-05-20-05-security-and-integrity]]]
linked_code: ["apps/web/src/workers/match-engine/*"]
sources:
  - title: "Deterministic Lockstep (Gaffer On Games)"
    url: "https://gafferongames.com/post/deterministic_lockstep/"
    accessed: "2026-05-20"
    publisher: "Gaffer On Games"
    confidence: high
  - title: "How to Debug Multiplayer Desync"
    url: "https://bugnet.io/blog/how-to-debug-multiplayer-desync-issues-in-games"
    accessed: "2026-05-20"
    publisher: "Bugnet"
    confidence: medium
verification_notes: "TypeScript-Floats sind theoretisch deterministisch in einer V8-Version, cross-browser oder cross-engine-version aber Drift-Risiko."
status: open
owner_suggested: backend
effort: L
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Cross-Browser- oder Engine-Update-Drifts fallen erst auf, wenn League-Tabellen-Stände öffentlich-sichtbar nicht passen.

**Mitigation.** Jeder Match-Tick erzeugt `state_hash` (FNV-1a über kanonisch serialisierten relevant-State). Client schickt in jedem Outbox-Command; Server replay'ed, vergleicht. Mismatch → Alert + Save-Snapshot-Quarantäne. RNG-Streams protokollieren `stream_id`, `advance_count`. CI replay't 100 historische Saves bit-identisch pro Engine-Release.

**Verifikation.** Stryker-Mutation auf Engine-Code muss mind. einen Replay-Test brechen. Prod-Alert auf > 0 Mismatches/Tag.

---

### PM-2026-05-20-07-F-06 — Anomaly-Detection-as-Code für unmögliche Spielzustände fehlt

```yaml
id: PM-2026-05-20-07-F-06
priority: P3
domain: live-ops
probability: 4
impact: 3
score: 12
confidence: medium
early_warning:
  - metric: "invariant_violation_total{rule}"
    threshold: "> 0"
mitigation_summary: "Invariant-Engine (~30–60 deklarative Regeln) läuft post-tick + nightly batch; Violation → Save-Quarantäne"
linked_adrs: []
linked_specs: []
linked_code: ["packages/match-engine/src/invariants.ts (geplant)"]
sources:
  - title: "Google SRE - Alerting on SLOs"
    url: "https://sre.google/workbook/alerting-on-slos/"
    accessed: "2026-05-20"
    publisher: "Google SRE"
    confidence: high
verification_notes: "Design-by-Contract-Pattern. Konkret für Game: cash >= -10M, no future-dated finished matches, age 16-50, stadium-capacity >= sold-tickets."
status: open
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** „Weird situations" sind selten als generelle Anomalie erkennbar (ML overkill, falsch-positiv-anfällig) — aber als explizite Invariants sehr wohl.

**Mitigation.** Zentrale `invariants.ts` mit deklarativen Regeln. Engine-Worker `assertInvariants()` post-tick; Nightly-Batch-Scan aller Saves. Violation → `domain.invariant_violated` Outbox-Event → Grafana-Alert + Issue-Auto-Open. Save als „needs review" markiert; Spieler darf weiterspielen.

**Verifikation.** Property-based Tests (fast-check) generieren zufällige Saves, müssen alle Invarianten erfüllen.

---

### PM-2026-05-20-07-F-07 — Telemetrie-Datenvolumen explodiert bei Saturday-Peak, Loki kippt

```yaml
id: PM-2026-05-20-07-F-07
priority: P3
domain: live-ops
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "loki_ingest_bytes_per_second"
    threshold: "> 80 % single-node Kapazität"
  - metric: "client_telemetry_queue_drop_total"
    threshold: "> 1 % der Events"
mitigation_summary: "Sampling-Klassen pro Event-Typ (Errors 100 %, Vitals 25 % bei Peak, Spans 10 %); Beacon-Batching; Loki-Cardinality < 10k"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/client-telemetry]]]
linked_code: []
sources:
  - title: "OpenTelemetry Browser sampling"
    url: "https://opentelemetry.io/docs/languages/js/getting-started/browser/"
    accessed: "2026-05-20"
    publisher: "OpenTelemetry"
    confidence: high
verification_notes: "OTel docs: browser instrumentation experimental; Sampling empfohlen wegen Volumen."
status: open
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** 200–400 CCU Saturday-Peak × 50 Vitals × 20 Spans × Match-Tick-Bursts ≈ 1–5 Mio Events/Tag. Cardinality-Explosion durch `user_id`/`match_id` als Loki-Labels killt es.

**Mitigation.** Sampling-Klassen: Errors 100 %, Web-Vitals 100 % bis 50 req/s dann 25 %, OTel-Spans 10 % head-based, Long-Tasks 5 %. Beacon-Batch alle 5 s oder 30 KB. Loki-Labels nur auf `service`, `env`, `release`, `level`, `route_id`; alles ID-artige im JSON-Body. Outbox-Token-Bucket: max 50 events/min/Client.

**Verifikation.** k6-Last-Run 400 CCU + 5 % Crash-Rate; Loki < 70 % Disk; Cardinality < 10k.

---

### PM-2026-05-20-07-F-08 — Solo-Founder-Burnout durch Always-On-Erwartung

```yaml
id: PM-2026-05-20-07-F-08
priority: P1
domain: live-ops
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "pages_outside_business_hours_per_week"
    threshold: "> 3"
mitigation_summary: "Werktags-Only-Coverage + explizites Saturday-On-Call-Window (14–22 CET) + Backup-Buddy + Auto-Throttle bei Eskalation"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "On-Call Scheduling for Small Teams (Hyperping)"
    url: "https://hyperping.com/blog/oncall-scheduling-small-teams"
    accessed: "2026-05-20"
    publisher: "Hyperping"
    confidence: medium
  - title: "Atlassian on-call schedules"
    url: "https://www.atlassian.com/incident-management/on-call/on-call-schedules"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
  - title: "Xurrent On-Call Guide 2026"
    url: "https://www.xurrent.com/blog/on-call-rotations-and-schedules-guide"
    accessed: "2026-05-20"
    publisher: "Xurrent"
    confidence: medium
verification_notes: "Konsens aller Quellen: Teams < 3 Personen können kein 24/7-Coverage tragen ohne Burnout."
status: open
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Mit 10k Registrierten in 6 Monaten entsteht „muss immer laufen"-Erwartung. Ein Saturday-22-Uhr-Match-Tick-Crash wiederholt sich 4× → Founder ausgebrannt.

**Mitigation.** **Service-Hours explizit kommunizieren** („Best-Effort-Support Mo–Fr 09–18 CET, Saturday-Match-Window 14–22 CET"). Außerhalb: nur Auto-Healing + Statuspage. Backup-Buddy mit Restart-Container + Statuspage-Post-Rechten, kein DB-Zugriff. Auto-Throttling: > 3 Pages/Stunde → non-essential Features (Friend-Match-Erstellung) abgeschaltet, „degraded"-Mode. Quartalsweise Pflicht-Urlaub 1 Woche ohne Pager.

**Verifikation.** Wöchentlicher Founder-Journal-Check. Jährliches Postmortem-Lese: Incidents außerhalb Window?

---

### PM-2026-05-20-07-F-09 — Session-Replay-Falle: DSGVO-Tretmine ohne Mehrwert

```yaml
id: PM-2026-05-20-07-F-09
priority: P4
domain: live-ops
probability: 2
impact: 5
score: 10
confidence: high
early_warning:
  - signal: "Wunsch nach Replay nach erster harter Bugjagd"
mitigation_summary: "Session Replay bewusst NICHT bauen; statt dessen strukturierte Breadcrumbs + Save+Inputs als Replay-Substitut"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/client-telemetry]]]
linked_code: []
sources:
  - title: "Sentry Session Replay Privacy"
    url: "https://docs.sentry.io/security-legal-pii/scrubbing/protecting-user-privacy/"
    accessed: "2026-05-20"
    publisher: "Sentry"
    confidence: high
  - title: "GlitchTip vs Sentry"
    url: "https://www.bugsink.com/blog/glitchtip-vs-sentry-vs-bugsink/"
    accessed: "2026-05-20"
    publisher: "Bugsink"
    confidence: medium
verification_notes: "GlitchTip kann Session Replay nicht. Self-Hosted Sentry-Stack 10+ Container = unverhältnismäßig teuer für Solo-Founder."
status: open
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Session Replay wirkt verlockend, aber DSGVO macht Default-Mask aggressiv unleserlich, Datenvolumen 5–10× andere Telemetrie. Für deterministische Engine ist `(initial_save, input_log)` besseres Replay als Pixel-Stream.

**Mitigation.** Explizit in ADR-0017-Followup: „kein Session Replay". Strukturierte Breadcrumbs (Route, UI-Click-Targets ohne Inhalt, Command-Names) + Save-Snapshot-Upload bei Bugreport. Re-Evaluation falls 3 Incidents in Folge „Replay hätte geholfen".

**Verifikation.** Bei jedem schweren Bug retrospektiv prüfen.

---

### PM-2026-05-20-07-F-10 — Status-Page-Schweigen während Long-Outage zerstört Vertrauen

```yaml
id: PM-2026-05-20-07-F-10
priority: P3
domain: live-ops
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "minutes_since_last_incident_update"
    threshold: "> 30 min während offenem SEV1"
mitigation_summary: "Update-Kadenz fixiert (SEV1: 30 min, SEV2: 60 min); vorgefertigte Templates; bilingual DE/EN"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Atlassian Postmortems handbook"
    url: "https://www.atlassian.com/incident-management/handbook/postmortems"
    accessed: "2026-05-20"
    publisher: "Atlassian"
    confidence: high
  - title: "GitLab Communication and Culture"
    url: "https://handbook.gitlab.com/handbook/engineering/development/sec/software-supply-chain-security/oncall/communication-and-culture/"
    accessed: "2026-05-20"
    publisher: "GitLab"
    confidence: high
verification_notes: "„Always be communicating" (Atlassian). Solo-Founder fokussiert Fix, vergisst Comms."
status: open
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Spieler-Frustration kommt nicht vom Outage, sondern vom Schweigen.

**Mitigation.** Statuspage-Templates vorab („Investigating", „Identified", „Monitoring", „Resolved"). Set-and-Forget-Reminder im Incident-Tool: SEV1 alle 30 min anpingen. Public-Postmortem binnen 5 Werktagen, fokus „what" nicht „who". DACH-Sprache + EN.

**Verifikation.** Quartärlicher Audit: mean_time_between_updates < 30 min für SEV1.

---

## Quantitatives Modell

**Telemetrie-Volumen bei 2.500 DAU / 200–400 CCU Peak:**
- Crash/Error: ~12 Events/Tag baseline, 100/h Burst.
- Web Vitals: ~30k Events/Tag = ~0,35 req/s avg, ~3 req/s Peak.
- OTel-Spans 10 % Sampling: ~12.500/Tag.
- Loki-Bytes: ~250 MB/Tag total, ~3,5 GB/14d Retention — single-node passt.

**Incident-Frequency (Indie-Backend, 2.500 DAU, erste 6 Monate):**
- SEV1: 1–2/Quartal · SEV2: 4–8/Quartal · SEV3: ~20/Quartal · Bug-Reports: 50–150/Monat (~5 % "Save lädt nicht").

## SLO-Vorschläge

| SLO | Ziel | Severity bei Verletzung |
|-----|------|-------------------------|
| API-Verfügbarkeit | 99,5 % monthly | S2 |
| Match-Sim-Wall-Time P95 | < 2,5 s pro Wochentick | S3 |
| Save-Load-Erfolgsrate | 99,9 % monthly | S1 (potentiell Schema-Bruch) |
| INP P75 Production | ≤ 200 ms (28-Tage-Fenster) | S3 |
| Command-Round-Trip P95 | < 500 ms | S2 |

## Load-/Test-Plan

- **Synthetic-Anomaly-Injection**: Wochenjob feuert invalide Game-States in Staging.
- **Determinismus-Replay-Regression**: pro Engine-PR re-simuliert CI 100 Saves bit-identisch.
- **Saturday-Peak-Last**: k6 400 CCU + 50 Match-Ticks parallel, 30 min.
- **Save-Stuck-Game-Day**: quartärlich End-to-End vom Discord-Ticket bis Fix-Commit.
- **Slow-3G-Mobile**: wöchentlich Lighthouse-CI Mid-Range Android.

## Runbook-Skizzen

### RB-07-A: Match-Tick stuck / Worker crash
1. Alert `match_tick_duration_seconds > 30s` ODER `match_engine_fatal_total > 0`.
2. Grafana-Trace, `state_hash` pre/post, Save-ID lokal via Replay-CLI.
3. Engine-Bug: Hot-Patch oder Rollback. Save-Korruption: quarantänisieren, Spieler-Mail mit Restore-Option.
4. Statuspage SEV2, Discord-Spiegel.
5. Postmortem binnen 5 Werktagen; neue Invariante falls neue Klasse.

### RB-07-B: „Save lädt nicht" Player-Report
1. Discord-Ticket / In-Game-Feedback `error_code = SAVE_LOAD_FAIL`.
2. `correlation_id` → GlitchTip-Event → Save-Schema-Version + ggf. verschlüsselter Save-Upload.
3. Replay-CLI lokal. Pfade: (1) Migration-Bug → Hot-Patch, (2) Korruption → Re-Hydrate aus Server-Outbox-Snapshot, (3) IndexedDB-Quota → User-Guide.
4. Direkter Reply; > 5 ähnliche Tickets/Tag → Statuspage-Notice.

### RB-07-C: IndexedDB-Quota-Exceeded-Spike
1. Metric `indexeddb_quota_error_total > 10/h`.
2. Browser-/OS-Verteilung; iOS-Safari häufiger Übeltäter (Cross-Ref [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-02|15-F-02]]).
3. Clear-Cache-Button freischalten, `persist()`-Request triggern. Mittel: Old-Save-Eviction-Logik.
4. > 100 User/h → Statuspage SEV3.

## Offene Fragen

1. Forensische Save-Snapshot-Upload-Kapazität schon zum Beta-Start oder erst nach erstem Schmerz-Incident?
2. GlitchTip-Limit (kein Replay, kein Tracing) für 12 Monate vs Sentry-Self-Hosted-Migration als Q3-Item?
3. Backup-Buddy rechtlich DSGVO-tauglich (DPA, Auftragsverarbeiter)?
4. Service-Hours nach außen: „Best-effort 24/7" oder „Werktags + Saturday-Window"?
5. Statuspage-Hosting: zusätzlicher Hetzner-Container oder externer Anbieter (eigener Outage würde sonst Statuspage mitnehmen)?

## „Wenn wir nur 3 Dinge tun"-Liste

1. **Determinismus-Replay-Pfad (F-05 + F-02)**: Save-Schema mit Version + Server-CLI + In-Game-Bug-Report mit Save-Upload. Ersetzt Session Replay, deckt 80 % aller „weird situation"-Tickets ab.
2. **Werktags-Window-On-Call + SEV-Schema (F-03 + F-08 + F-10)**: 4-Stufen-SEV, Service-Hours kommuniziert, Backup-Buddy, Statuspage-Kadenz. Nahezu Null Code-Aufwand, schützt Burnout und Community-Vertrauen.
3. **Web-Vitals-RUM mit OTel-Browser (F-01 + F-07)**: `web-vitals/attribution` + Beacon + Sampling-Disziplin. Einziger Weg, INP-Regressionen vor der Discord-Welle zu sehen.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-07-F-NN`. Aggregat-Status: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]] · [[threat-model]]
- [[PM-2026-05-20-02-tech-and-ops]] — CI/CD- und Observability-Reife
- [[PM-2026-05-20-05-security-and-integrity]] — Save-Schema-v2 + Determinismus-CI-Gate
- [[PM-2026-05-20-15-browser-device-storage-matrix]] — Browser-Quirks (iOS-Safari, IndexedDB)
- [[PM-2026-05-20-16-test-strategy-depth]] — Determinismus-Replay-CI-Tiering
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[../../30-Implementation/client-telemetry]]
