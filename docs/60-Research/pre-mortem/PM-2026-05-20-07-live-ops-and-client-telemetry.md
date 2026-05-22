---
title: "Pre-Mortem 2026-05-20 Â· 07 Â· Live-Ops & Client-Telemetry"
status: current
tags: [research, pre-mortem, live-ops, telemetry, observability, incident-response, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
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

# Pre-Mortem 2026-05-20 Â· 07 Â· Live-Ops & Client-Telemetry & Game-Edge-Cases

> **Failure-Headline-Kandidaten**
> - â€žSaturday-Match-Tick-Crash-Spike â€” niemand merkt es, weil der Solo-Founder schlÃ¤ft und keine Eskalation existiert."
> - â€žSave-State driftet seit Release X, kein Determinismus-Replay-Checksum-Pfad â€” Bug-Reports nicht reproduzierbar."
> - â€žWeb Vitals (INP > 500 ms) nur in DevTools sichtbar â€” reale EU-Mobilfunk-Spieler erleben unspielbares Match-UI."
> - â€žStatus-Page existiert nicht; Discord-Posts ersetzen Kommunikation; Late-Night-Outage â†’ Spieler halten Projekt fÃ¼r tot."

## Scope

Live-Ops-Pre-Mortem: Telemetrie-Coverage, Severity-Klassifikation fÃ¼r Solo-Founder, â€žkomische Game-Situationen" (Anomalie-Detection), Save-Stuck-Recovery, Status-Page-Kommunikation. Querschnittlich zu [[PM-2026-05-20-02-tech-and-ops]] (CI/CD-Reife) und [[PM-2026-05-20-15-browser-device-storage-matrix]] (Browser-Quirks).

## Top Failure-Hypothesen

Jede Failure-Hypothese erhÃ¤lt eine immutable ID (`PM-2026-05-20-07-F-NN`) und ein PrioritÃ¤ts-Tag (P0â€“P4). Score = Wahrscheinlichkeit Ã— Impact (je 1â€“5).

---

### PM-2026-05-20-07-F-01 â€” Fehlende RUM-Coverage fÃ¼r INP/LCP/CLS auf realen GerÃ¤ten

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
mitigation_summary: "web-vitals v5 mit Attribution-Build + OTel-Browser-SDK + Beacon + Segmentierung (Route Ã— GerÃ¤t Ã— Netz)"
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
verification_notes: "INP ersetzt FID seit MÃ¤rz 2024 als Core Web Vital. web-vitals v5 Attribution-Build liefert interactionTarget, inputDelay, processingDuration, presentationDelay fÃ¼r gezielte Mitigation."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne Field-RUM sehen wir Performance-Regressionen erst, wenn Spieler im Discord melden. INP ist sensibel auf Long-Tasks aus Match-Tick-Worker; auf Mid-Range Android schnell > 500 ms (poor).

**Mitigation.** `web-vitals/attribution` einbinden, alle vier Metriken (INP, LCP, CLS, TTFB) via `navigator.sendBeacon` an Same-Origin-Endpoint `/telemetry/v1/vitals`, durch Alloy/OTel als Prometheus-Histogramme. Sampling 100 % bis 50 req/s, dann 10â€“25 %. Segmentierung nach `route_id`, `effective_connection_type`, `device_class` (deviceMemory/hardwareConcurrency). CWV gilt als â€žstrictly necessary" â†’ keine Consent-Pflicht (EDPB ePrivacy-Position dokumentieren).

**Verifikation.** Lighthouse-CI Mid-Range-Profil (Slow 4G, 4Ã— CPU throttle): INP â‰¤ 200 ms / LCP â‰¤ 2500 ms. WÃ¶chentlicher Grafana-Report; p75 INP > 300 ms â†’ Issue.

---

### PM-2026-05-20-07-F-02 â€” Kein Reproduktions-Pfad bei â€žSave lÃ¤dt nicht"-Tickets

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
    threshold: "> 0.5 % Ã¼ber 1 h"
  - metric: "save_schema_version_mismatch_count"
    threshold: "> 0 / Release"
mitigation_summary: "Versionierte Save-Header + In-Game-Bug-Report mit (verschlÃ¼sseltem) Save-Upload + correlation_id; deterministische Replay-CLI server-side"
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
verification_notes: "GlitchTip akzeptiert Sentry-JS-SDK-userFeedback-Protokoll â‰¥ 7.85. Schema-Bruch erfordert explizite Migration."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend+frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Beim ersten Schema-Bruch (z. B. neue RNG-Stream-Reihenfolge) bricht Load mit unspezifischem `TypeError`. Ohne Schema-Header (`{format: 'fmx.save', v: 7, engine: '0.42.1'}`) und ohne forensisch sicheren Snapshot-Upload muss der Founder per Discord-DM â€žSchick mir die Datei" â€” fehleranfÃ¤llig, langsam, DSGVO-unsauber.

**Mitigation.** (1) Save-Format mit semver-Header + CRC32-Footer; Load-Pfad branchet auf `v` + Migration-Funktion. (2) In-Game-Bug-Report-Widget mit `correlation_id`, `release`, `engineVersion`, `save_id`, `save_version`. (3) Optionaler â€žSave zur Diagnose hochladen"-Button â†’ Public-Key-verschlÃ¼sselt in S3-kompatiblen Bucket mit 30-Tage-TTL. (4) Server-CLI: `replay save+inputs` reproduziert lokal â€” pflicht vor jedem Engine-Release.

**Verifikation.** Synthetischer Negativtest in Staging: provoziere Schema-Mismatch, Bug-Report-Flow muss in < 90 s vollstÃ¤ndiges Issue erzeugen. Quarterly â€žRestore from user report"-Game-Day.

---

### PM-2026-05-20-07-F-03 â€” Keine Severity-Klassifikation, Solo-Founder priorisiert nach BauchgefÃ¼hl

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
mitigation_summary: "4-Stufen-SEV-Schema (PagerDuty/incident.io 2026), Trigger-Regeln in Grafana-Annotations, 2-Level-Eskalation (Self â†’ Trusted-Buddy)"
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
verification_notes: "Industrielle Konvention: 3- oder 5-Stufen-SEV mit â€žim Zweifel niedrigere Zahl = hÃ¶here Severity, im Postmortem korrigieren"."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne dokumentiertes SEV-Vokabular eskaliert der Founder zufÃ¤llig oder verbrennt sich an Non-Issues.

**Mitigation.** **SEV1** = totaler Outage / Datenverlust / Security-Breach, Statuspage-Post < 15 min; **SEV2** = Major-Feature gebrochen oder Saturday-Peak betroffen, < 30 min; **SEV3** = nicht-kritisch, nÃ¤chster Werktag; **SEV4** = kosmetisch / Backlog. Trigger als Boolean-Regeln in Grafana-Alert-Annotations. Solo-On-Call: Werktags-Default, Saturday 14â€“22 CET als â€žexplicit on-call window" (Match-Tick-Slot), Backup-Buddy mit minimalen Admin-Rechten.

**Verifikation.** Tabletop-Exercise: Founder klassifiziert 5 fiktive Alerts, Buddy reviewt. QuartÃ¤rlich Postmortem-Drift-Check.

---

### PM-2026-05-20-07-F-04 â€” Kein Statuspage, Kommunikation rein Ã¼ber Discord

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
verification_notes: "Atlassian: â€žAlways be communicating"; Discord allein erreicht ~30 % der Spielerschaft und ist nicht durchsuchbar."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Schweigen bei Outage = â€žProjekt tot" in der Spielerwahrnehmung.

**Mitigation.** Self-hosted Uptime Kuma (Hetzner-Sidecar) oder OpenStatus fÃ¼r `status.<domain>`. Auto-Komponenten: Match-Engine, API, Auth, Sync. Update-Kadenz: SEV1 alle 30 min auch ohne News (â€žInvestigating, no new ETA"), SEV2 alle 60 min. Public-Postmortem nach jedem SEV1/2 binnen 5 Werktagen, blameless.

**Verifikation.** Game-Day: simuliere Outage, Statuspage muss binnen 10 min auf â€žInvestigating" stehen (Grafana-Webhook â†’ OpenStatus-API).

---

### PM-2026-05-20-07-F-05 â€” Determinismus-Drift unerkannt, Match-Engine-Replay-Mismatch

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
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Cross-Browser- oder Engine-Update-Drifts fallen erst auf, wenn League-Tabellen-StÃ¤nde Ã¶ffentlich-sichtbar nicht passen.

**Mitigation.** Jeder Match-Tick erzeugt `state_hash` (FNV-1a Ã¼ber kanonisch serialisierten relevant-State). Client schickt in jedem Outbox-Command; Server replay'ed, vergleicht. Mismatch â†’ Alert + Save-Snapshot-QuarantÃ¤ne. RNG-Streams protokollieren `stream_id`, `advance_count`. CI replay't 100 historische Saves bit-identisch pro Engine-Release.

**Verifikation.** Stryker-Mutation auf Engine-Code muss mind. einen Replay-Test brechen. Prod-Alert auf > 0 Mismatches/Tag.

---

### PM-2026-05-20-07-F-06 â€” Anomaly-Detection-as-Code fÃ¼r unmÃ¶gliche SpielzustÃ¤nde fehlt

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
mitigation_summary: "Invariant-Engine (~30â€“60 deklarative Regeln) lÃ¤uft post-tick + nightly batch; Violation â†’ Save-QuarantÃ¤ne"
linked_adrs: []
linked_specs: []
linked_code: ["packages/match-engine/src/invariants.ts (geplant)"]
sources:
  - title: "Google SRE - Alerting on SLOs"
    url: "https://sre.google/workbook/alerting-on-slos/"
    accessed: "2026-05-20"
    publisher: "Google SRE"
    confidence: high
verification_notes: "Design-by-Contract-Pattern. Konkret fÃ¼r Game: cash >= -10M, no future-dated finished matches, age 16-50, stadium-capacity >= sold-tickets."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** â€žWeird situations" sind selten als generelle Anomalie erkennbar (ML overkill, falsch-positiv-anfÃ¤llig) â€” aber als explizite Invariants sehr wohl.

**Mitigation.** Zentrale `invariants.ts` mit deklarativen Regeln. Engine-Worker `assertInvariants()` post-tick; Nightly-Batch-Scan aller Saves. Violation â†’ `domain.invariant_violated` Outbox-Event â†’ Grafana-Alert + Issue-Auto-Open. Save als â€žneeds review" markiert; Spieler darf weiterspielen.

**Verifikation.** Property-based Tests (fast-check) generieren zufÃ¤llige Saves, mÃ¼ssen alle Invarianten erfÃ¼llen.

---

### PM-2026-05-20-07-F-07 â€” Telemetrie-Datenvolumen explodiert bei Saturday-Peak, Loki kippt

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
    threshold: "> 80 % single-node KapazitÃ¤t"
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
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** 200â€“400 CCU Saturday-Peak Ã— 50 Vitals Ã— 20 Spans Ã— Match-Tick-Bursts â‰ˆ 1â€“5 Mio Events/Tag. Cardinality-Explosion durch `user_id`/`match_id` als Loki-Labels killt es.

**Mitigation.** Sampling-Klassen: Errors 100 %, Web-Vitals 100 % bis 50 req/s dann 25 %, OTel-Spans 10 % head-based, Long-Tasks 5 %. Beacon-Batch alle 5 s oder 30 KB. Loki-Labels nur auf `service`, `env`, `release`, `level`, `route_id`; alles ID-artige im JSON-Body. Outbox-Token-Bucket: max 50 events/min/Client.

**Verifikation.** k6-Last-Run 400 CCU + 5 % Crash-Rate; Loki < 70 % Disk; Cardinality < 10k.

---

### PM-2026-05-20-07-F-08 â€” Solo-Founder-Burnout durch Always-On-Erwartung

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
mitigation_summary: "Werktags-Only-Coverage + explizites Saturday-On-Call-Window (14â€“22 CET) + Backup-Buddy + Auto-Throttle bei Eskalation"
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
verification_notes: "Konsens aller Quellen: Teams < 3 Personen kÃ¶nnen kein 24/7-Coverage tragen ohne Burnout."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Mit 10k Registrierten in 6 Monaten entsteht â€žmuss immer laufen"-Erwartung. Ein Saturday-22-Uhr-Match-Tick-Crash wiederholt sich 4Ã— â†’ Founder ausgebrannt.

**Mitigation.** **Service-Hours explizit kommunizieren** (â€žBest-Effort-Support Moâ€“Fr 09â€“18 CET, Saturday-Match-Window 14â€“22 CET"). AuÃŸerhalb: nur Auto-Healing + Statuspage. Backup-Buddy mit Restart-Container + Statuspage-Post-Rechten, kein DB-Zugriff. Auto-Throttling: > 3 Pages/Stunde â†’ non-essential Features (Friend-Match-Erstellung) abgeschaltet, â€ždegraded"-Mode. Quartalsweise Pflicht-Urlaub 1 Woche ohne Pager.

**Verifikation.** WÃ¶chentlicher Founder-Journal-Check. JÃ¤hrliches Postmortem-Lese: Incidents auÃŸerhalb Window?

---

### PM-2026-05-20-07-F-09 â€” Session-Replay-Falle: DSGVO-Tretmine ohne Mehrwert

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
verification_notes: "GlitchTip kann Session Replay nicht. Self-Hosted Sentry-Stack 10+ Container = unverhÃ¤ltnismÃ¤ÃŸig teuer fÃ¼r Solo-Founder."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Session Replay wirkt verlockend, aber DSGVO macht Default-Mask aggressiv unleserlich, Datenvolumen 5â€“10Ã— andere Telemetrie. FÃ¼r deterministische Engine ist `(initial_save, input_log)` besseres Replay als Pixel-Stream.

**Mitigation.** Explizit in ADR-0017-Followup: â€žkein Session Replay". Strukturierte Breadcrumbs (Route, UI-Click-Targets ohne Inhalt, Command-Names) + Save-Snapshot-Upload bei Bugreport. Re-Evaluation falls 3 Incidents in Folge â€žReplay hÃ¤tte geholfen".

**Verifikation.** Bei jedem schweren Bug retrospektiv prÃ¼fen.

---

### PM-2026-05-20-07-F-10 â€” Status-Page-Schweigen wÃ¤hrend Long-Outage zerstÃ¶rt Vertrauen

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
    threshold: "> 30 min wÃ¤hrend offenem SEV1"
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
verification_notes: "â€žAlways be communicating" (Atlassian). Solo-Founder fokussiert Fix, vergisst Comms."
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Spieler-Frustration kommt nicht vom Outage, sondern vom Schweigen.

**Mitigation.** Statuspage-Templates vorab (â€žInvestigating", â€žIdentified", â€žMonitoring", â€žResolved"). Set-and-Forget-Reminder im Incident-Tool: SEV1 alle 30 min anpingen. Public-Postmortem binnen 5 Werktagen, fokus â€žwhat" nicht â€žwho". DACH-Sprache + EN.

**Verifikation.** QuartÃ¤rlicher Audit: mean_time_between_updates < 30 min fÃ¼r SEV1.

---

## Quantitatives Modell

**Telemetrie-Volumen bei 2.500 DAU / 200â€“400 CCU Peak:**
- Crash/Error: ~12 Events/Tag baseline, 100/h Burst.
- Web Vitals: ~30k Events/Tag = ~0,35 req/s avg, ~3 req/s Peak.
- OTel-Spans 10 % Sampling: ~12.500/Tag.
- Loki-Bytes: ~250 MB/Tag total, ~3,5 GB/14d Retention â€” single-node passt.

**Incident-Frequency (Indie-Backend, 2.500 DAU, erste 6 Monate):**
- SEV1: 1â€“2/Quartal Â· SEV2: 4â€“8/Quartal Â· SEV3: ~20/Quartal Â· Bug-Reports: 50â€“150/Monat (~5 % "Save lÃ¤dt nicht").

## SLO-VorschlÃ¤ge

| SLO | Ziel | Severity bei Verletzung |
|-----|------|-------------------------|
| API-VerfÃ¼gbarkeit | 99,5 % monthly | S2 |
| Match-Sim-Wall-Time P95 | < 2,5 s pro Wochentick | S3 |
| Save-Load-Erfolgsrate | 99,9 % monthly | S1 (potentiell Schema-Bruch) |
| INP P75 Production | â‰¤ 200 ms (28-Tage-Fenster) | S3 |
| Command-Round-Trip P95 | < 500 ms | S2 |

## Load-/Test-Plan

- **Synthetic-Anomaly-Injection**: Wochenjob feuert invalide Game-States in Staging.
- **Determinismus-Replay-Regression**: pro Engine-PR re-simuliert CI 100 Saves bit-identisch.
- **Saturday-Peak-Last**: k6 400 CCU + 50 Match-Ticks parallel, 30 min.
- **Save-Stuck-Game-Day**: quartÃ¤rlich End-to-End vom Discord-Ticket bis Fix-Commit.
- **Slow-3G-Mobile**: wÃ¶chentlich Lighthouse-CI Mid-Range Android.

## Runbook-Skizzen

### RB-07-A: Match-Tick stuck / Worker crash
1. Alert `match_tick_duration_seconds > 30s` ODER `match_engine_fatal_total > 0`.
2. Grafana-Trace, `state_hash` pre/post, Save-ID lokal via Replay-CLI.
3. Engine-Bug: Hot-Patch oder Rollback. Save-Korruption: quarantÃ¤nisieren, Spieler-Mail mit Restore-Option.
4. Statuspage SEV2, Discord-Spiegel.
5. Postmortem binnen 5 Werktagen; neue Invariante falls neue Klasse.

### RB-07-B: â€žSave lÃ¤dt nicht" Player-Report
1. Discord-Ticket / In-Game-Feedback `error_code = SAVE_LOAD_FAIL`.
2. `correlation_id` â†’ GlitchTip-Event â†’ Save-Schema-Version + ggf. verschlÃ¼sselter Save-Upload.
3. Replay-CLI lokal. Pfade: (1) Migration-Bug â†’ Hot-Patch, (2) Korruption â†’ Re-Hydrate aus Server-Outbox-Snapshot, (3) IndexedDB-Quota â†’ User-Guide.
4. Direkter Reply; > 5 Ã¤hnliche Tickets/Tag â†’ Statuspage-Notice.

### RB-07-C: IndexedDB-Quota-Exceeded-Spike
1. Metric `indexeddb_quota_error_total > 10/h`.
2. Browser-/OS-Verteilung; iOS-Safari hÃ¤ufiger ÃœbeltÃ¤ter (Cross-Ref [[PM-2026-05-20-15-browser-device-storage-matrix#PM-2026-05-20-15-F-02|15-F-02]]).
3. Clear-Cache-Button freischalten, `persist()`-Request triggern. Mittel: Old-Save-Eviction-Logik.
4. > 100 User/h â†’ Statuspage SEV3.

## Future-scope decisions (classified future-scope)
1. Forensische Save-Snapshot-Upload-KapazitÃ¤t schon zum Beta-Start oder erst nach erstem Schmerz-Incident?
2. GlitchTip-Limit (kein Replay, kein Tracing) fÃ¼r 12 Monate vs Sentry-Self-Hosted-Migration als Q3-Item?
3. Backup-Buddy rechtlich DSGVO-tauglich (DPA, Auftragsverarbeiter)?
4. Service-Hours nach auÃŸen: â€žBest-effort 24/7" oder â€žWerktags + Saturday-Window"?
5. Statuspage-Hosting: zusÃ¤tzlicher Hetzner-Container oder externer Anbieter (eigener Outage wÃ¼rde sonst Statuspage mitnehmen)?

## â€žWenn wir nur 3 Dinge tun"-Liste

1. **Determinismus-Replay-Pfad (F-05 + F-02)**: Save-Schema mit Version + Server-CLI + In-Game-Bug-Report mit Save-Upload. Ersetzt Session Replay, deckt 80 % aller â€žweird situation"-Tickets ab.
2. **Werktags-Window-On-Call + SEV-Schema (F-03 + F-08 + F-10)**: 4-Stufen-SEV, Service-Hours kommuniziert, Backup-Buddy, Statuspage-Kadenz. Nahezu Null Code-Aufwand, schÃ¼tzt Burnout und Community-Vertrauen.
3. **Web-Vitals-RUM mit OTel-Browser (F-01 + F-07)**: `web-vitals/attribution` + Beacon + Sampling-Disziplin. Einziger Weg, INP-Regressionen vor der Discord-Welle zu sehen.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-07-F-NN`. Aggregat-Status: [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]] Â· [[threat-model]]
- [[PM-2026-05-20-02-tech-and-ops]] â€” CI/CD- und Observability-Reife
- [[PM-2026-05-20-05-security-and-integrity]] â€” Save-Schema-v2 + Determinismus-CI-Gate
- [[PM-2026-05-20-15-browser-device-storage-matrix]] â€” Browser-Quirks (iOS-Safari, IndexedDB)
- [[PM-2026-05-20-16-test-strategy-depth]] â€” Determinismus-Replay-CI-Tiering
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[../../30-Implementation/client-telemetry]]
