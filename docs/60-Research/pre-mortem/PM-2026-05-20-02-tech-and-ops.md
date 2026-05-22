---
title: "Pre-Mortem 2026-05-20 Â· 02 Â· Tech & Ops"
status: current
tags: [research, pre-mortem, tech, ops, observability, ci-cd, security, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-02
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-01-architecture]]
  - [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
  - [[../determinism-and-replay]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/rate-limiting-anti-abuse]]
  - [[../../30-Implementation/client-telemetry]]
  - [[../../00-Index/Current-State]]
---

# Pre-Mortem 2026-05-20 Â· 02 Â· Tech & Ops

> **Pre-Mortem-Hypothese (Failure-Headline):**
> "In sechs Monaten waren wir gescheitert, weil ein TanStack-Start-Beta-Bruch uns wochenlang blockierte, das Observability-Stack die richtigen Symptome nicht sah, und der erste echte Produktions-Incident neun Stunden dauerte â€” wir hatten keine Backups getestet, kein blue/green Deploy, und der Determinismus driftete unbemerkt."

## Scope

Dieser Report bewertet **Technologie-, Betriebs- und Sicherheitsrisiken** fÃ¼r die 6-Monats-Horizont-Annahme (10k Spieler) Ã¼ber die zwei Szenarien (single-node Hetzner vs. Cloud-Autoscaling). Schwerpunkte: Framework-Risiko, Determinismus, Observability, CI/CD, Backup/DR, Auth-/Anti-Abuse-Implementierung, Test-Reife, Secrets.

## Top Failure-Hypothesen

### PM-2026-05-20-02-F-01 â€” TanStack-Start-Beta-Breaking-Change blockiert Build

```yaml
id: PM-2026-05-20-02-F-01
domain: tech
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "tanstack/start version bump in renovate"
    threshold: "any breaking change"
  - metric: "nightly CI build success rate"
    threshold: "<95%"
mitigation_summary: "Version-Pin + Upgrade-Smoke-Branch + Notfall-Migrationspfad (Next.js / Remix-Fallback)"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0001-tech-stack]]
linked_specs:
  - [[../../90-Meta/conventions]]
linked_code:
  - "apps/web/scripts/build-pwa.mjs"
  - "package.json"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** TanStack Start ist Beta; ein grÃ¶ÃŸeres Release (1.0, breaking) kommt mit unvermeidbaren InkompatibilitÃ¤ten (siehe schon dokumentierten `vite-plugin-pwa`-Konflikt). Ohne Notfallpfad steckt das Team in der Migration fest, wÃ¤hrend Konkurrenz launcht.

**Mitigation.**
1. Renovate auf Major-Bumps konservativ (auto-merge nur Minor/Patch).
2. WÃ¶chentlicher Smoke-Branch der TanStack-Start `latest` testet.
3. Notfall-ADR â€žWenn TanStack Start blockiert": Migrationspfad zu Next.js oder Remix vor-skizziert (nicht vor-implementiert).

**Verifikation.** Migrations-Spike als 1-Tages-Dokument pro Quartal aktualisieren.

---

### PM-2026-05-20-02-F-02 â€” Determinismus-Drift bleibt unentdeckt

```yaml
id: PM-2026-05-20-02-F-02
domain: tech
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "replay_diff_test_failures_per_week"
    threshold: ">0"
  - metric: "unbound Math.random|Date.now in match-engine package"
    threshold: ">0"
mitigation_summary: "Determinism-CI-Gate + Semgrep-Rule + Seed-Pinning + Replay-Diff-Test-Suite"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
linked_specs:
  - [[../determinism-and-replay]]
  - [[../match-engine-runtime-strategy]]
linked_code:
  - "packages/match-engine/src/"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Match-Engine ist designt fÃ¼r Determinismus (8 RNG-Streams via pure-rand, seedable). Ein einziger `Math.random()`, `Date.now()`, ein nicht-deterministischer `Array.sort` oder `Set`-Iteration und Replays divergieren. Ohne CI-Gate fÃ¤llt das erst in Production auf, wenn Spieler "mein Match war anders als das gestern" berichten.

**Mitigation.**
1. **Semgrep-Rule:** Verbiete `Math.random`, `Date.now()`, `performance.now()`, `Math.floor(Math.random()*X)` in `packages/match-engine/`.
2. **Replay-Diff-Test-Suite:** 1.000 Seeds Ã— Replay, Bit-Equal-Assertion. LÃ¤uft in Nightly + Pre-Release.
3. **Lint:** Verbiete `Set`/`Map` Iteration in der Engine wenn Ordering relevant (ESLint-Custom-Rule oder Biome-Plugin).
4. **Runtime-Guard:** in Dev, RNG-Aufrufe loggen; in Prod, Seed in Match-Header persistieren fÃ¼r jedes Replay.

**Verifikation.** Replay-Suite in CI grÃ¼n; manueller Replay einer 100-Match-Stichprobe nach Deploy.

---

### PM-2026-05-20-02-F-03 â€” Observability-Stack vorhanden, aber Dashboards/Alerts nicht gebaut

```yaml
id: PM-2026-05-20-02-F-03
domain: ops
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "alert_rules_loaded_count"
    threshold: "<20 critical rules"
  - metric: "grafana_dashboards_count"
    threshold: "<5"
mitigation_summary: "Dashboards-as-Code (ja oder nein, jetzt entscheiden) + Mindest-Alert-Catalog vor Launch"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
linked_specs:
  - [[../../30-Implementation/client-telemetry]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** ADR-0017 ist accepted, Stack ist deployed (Loki + Prometheus + Tempo + Grafana + GlitchTip). Aber Dashboards und Alert-Rules sind ein eigenes Produkt â€” die werden vergessen, bis der erste Incident sie braucht. Ohne sie sehen wir Symptome nicht (Match-Determinism-Drift, Outbox-Lag, Session-Reuse-StÃ¼rme).

**Mitigation.**
1. **Mindest-Alert-Catalog vor Launch:** App-up, DB-up, Match-Sim-P95, Outbox-Lag, Error-Rate, Disk-Voll, Cert-Expiry, Backup-Erfolg.
2. **Dashboards-as-Code:** Grafana-JSON in `infra/grafana/`, im selben PR wie das gemessene Feature (Same-PR-Rule).
3. **Tabletop-Drill:** QuartÃ¤rliche StÃ¶r-Ãœbung, bei der ein Team-Mitglied einen Incident nur via Dashboards diagnostiziert.

**Verifikation.** Pre-Launch-Checklist: alle 12 Alert-Rules feuern in Staging gegen synthetische Last.

---

### PM-2026-05-20-02-F-04 â€” Backups existieren, aber Restore wurde nie getestet

```yaml
id: PM-2026-05-20-02-F-04
domain: ops
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "last_successful_restore_test_age_days"
    threshold: ">30"
mitigation_summary: "60-Tage-DR-Drill als CI-cron, Restore-Doc, gemessene RTO/RPO"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** SchrÃ¶dingers Backup: existiert, bis du restore-st. Wave-3 Gap H3 war zum Reportzeitpunkt unclassified; 2026-05-22 concept-closed. Wir entdecken erst beim ersten Disk-Fail, dass das Backup-Format inkompatibel ist oder eine Index-Datei fehlt.

**Mitigation.**
1. StÃ¼ndliche Snapshots auf separates Storage (S3-kompatibel, encrypted).
2. **Monatlicher Restore-Drill** automatisiert: zieht Snapshot, restored in Throwaway-Container, validiert via Smoke-Suite.
3. RTO < 2 h, RPO < 1 h dokumentiert.

**Verifikation.** Letzter Restore-Drill â‰¤ 30 Tage alt, sichtbar in Dashboard.

---

### PM-2026-05-20-02-F-05 â€” CI/CD ohne blue/green oder Rollback-Pfad

```yaml
id: PM-2026-05-20-02-F-05
domain: ops
scenario: [cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "rollback_time_seconds_p95"
    threshold: ">300s"
  - metric: "manual_rollbacks_per_month"
    threshold: ">2"
mitigation_summary: "Deploy via Canary + automatischer Rollback bei Error-Rate-Spike + Schema-blue/green"
linked_adrs: []
linked_specs:
  - [[../../90-Meta/conventions]]
linked_code:
  - ".github/workflows/ci.yml"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Dokploy macht single-node Container-Swap; Cloud-Setup braucht Canary oder blue/green sonst macht ein Bad-Deploy 10k Spieler offline. Ohne Auto-Rollback ist die MTTR > 30 Min.

**Mitigation.** Canary fÃ¼r 10 % Traffic + Auto-Rollback bei 5xx-Rate > 2 %; Schema-Changes wie in F-A1-F-06 beschrieben.

---

### PM-2026-05-20-02-F-06 â€” Wave-3 Auth/Recovery-LÃ¼cken nicht code-vollstÃ¤ndig

```yaml
id: PM-2026-05-20-02-F-06
domain: security
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "auth_flow_coverage_unit+e2e"
    threshold: "<90%"
  - metric: "recovery_code_usage_in_e2e_tests"
    threshold: "=0"
mitigation_summary: "Implementierungs-Audit aller F-Gaps + e2e-Tests fÃ¼r jeden Auth-Pfad"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
linked_specs:
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend+security
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Auth-Specs (Passkey, TOTP, Recovery-Codes) sind dokumentiert (F2, F3, F5 done in der Vault), aber Code-Implementierung ist in der RealitÃ¤t oft hinter Doku. Eine Passkey-Edge-Case (Browser-Plattform-Bug, Cross-Device) fÃ¼hrt zu Lockouts; ohne Recovery-Code-UI KÃ¤uferverlust.

**Mitigation.**
1. Code-vs-Spec-Audit pro F-Gap (F2-F13).
2. e2e-Tests pro Recovery-Pfad: lost passkey, TOTP-Loss, account-recovery.
3. Support-Workflow fÃ¼r Lockouts (Gap G8).

---

### PM-2026-05-20-02-F-07 â€” Rate-Limiting/Anti-Abuse spezifiziert, aber nicht enforced

```yaml
id: PM-2026-05-20-02-F-07
domain: security
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "automated_signup_attempts_per_minute"
    threshold: ">100"
  - metric: "captcha_solve_rate_drop"
    threshold: ">10% below baseline"
mitigation_summary: "Cloudflare WAF/Bot-Mgmt vor Origin + mCaptcha live + Rate-Limits in Code"
linked_adrs: []
linked_specs:
  - [[../../30-Implementation/rate-limiting-anti-abuse]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend+security
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Spec ist locked, Code-Enforcement ist nicht garantiert. Bot-Signups fluten die DB; Login-Brute-Force ohne IP-Throttle; Match-Spam bei Multiplayer.

**Mitigation.** Cloudflare oder vergleichbarer WAF/Bot-Manager als erstes Glied; mCaptcha bei Signup; Token-Bucket pro Endpunkt; Anomaly-Detection (Loki-Alerts).

---

### PM-2026-05-20-02-F-08 â€” Secrets-Rotation nie geÃ¼bt

```yaml
id: PM-2026-05-20-02-F-08
domain: security
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "secret_age_days_max"
    threshold: ">180"
mitigation_summary: "QuartÃ¤rlicher Rotation-Drill + sops/age Runbook + Notfall-Zugriff dokumentiert"
linked_adrs: []
linked_specs:
  - [[../../30-Implementation/secrets-management]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+security
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** sops + age + direnv ist sauber dokumentiert. Wenn ein SchlÃ¼ssel kompromittiert wird (insider, leak), gibt es keinen *gemessenen* Rotation-Pfad. Im Zweifel rotiert keiner.

**Mitigation.** QuartÃ¤rlicher Mini-Drill: einen non-critical Secret rotieren end-to-end, Zeit messen.

---

### PM-2026-05-20-02-F-09 â€” Test-Coverage-RealitÃ¤t (Stryker, Vitest) bricht bei Greenfield-Code

```yaml
id: PM-2026-05-20-02-F-09
domain: tech
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "package coverage drop relative to ratchet"
    threshold: "any drop"
  - metric: "mutation_score_match_engine"
    threshold: "<70%"
mitigation_summary: "Coverage-Ratchets nur fÃ¼r lebenden Code; neuer Code â†’ Test-First-Disziplin"
linked_adrs: []
linked_specs:
  - [[../../90-Meta/conventions]]
linked_code:
  - "packages/match-engine/src/"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ratchet-CI verhindert *RÃ¼ckschritte* â€” sie verhindert nicht, dass die noch nicht geschriebene Match-Engine mit 30 % Coverage in Prod geht. Mutation-Testing greift erst, wenn da etwas zum Mutieren ist.

**Mitigation.** Pro Bounded Context: Coverage-Floor (z. B. 80 % unit, 60 % mutation) bevor er als â€ždone" gilt.

---

### PM-2026-05-20-02-F-10 â€” Incident-Response existiert nur auf Papier

```yaml
id: PM-2026-05-20-02-F-10
domain: ops
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "tabletop_drills_per_quarter"
    threshold: "<1"
  - metric: "incident_to_postmortem_lag_days"
    threshold: ">7"
mitigation_summary: "Runbook-Tabletop + On-Call-Rotation + Status-Page + Postmortem-Template"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wave-3 Gaps H1 (Incident-Response), H2 (On-Call), H11 (Status-Page) waren zum Reportzeitpunkt unclassified; 2026-05-22 concept-closed. Der erste echte Incident wird improvisiert; 5 Leute laufen parallel und treten sich auf die FÃ¼ÃŸe.

**Mitigation.** Runbook-Tabletop quartÃ¤rlich; On-Call-Rotation mit klaren Handoffs; Status-Page (statuspage.io oder oss); Postmortem in 7 Tagen.

---

## Quantitatives Modell

### Log-/Observability-Volumen

| DAU | Logs (MB/DAU/Tag) | Loki @ 14d (GB) | Metrics @ 15mo (GB) | Traces @ 7d (GB) |
|---|---|---|---|---|
| 1.000 | 10 | 140 | ~30 | ~10 |
| 2.500 | 10 | 350 | ~70 | ~25 |
| 10.000 | 10 | 1.400 | ~280 | ~100 |

â‡’ Selbst bei 10k DAU bleibt Observability-Storage unter 2 TB. Kein Engpass, aber Kosten in Cloud nicht trivial.

### Compute- und Plattformkosten (Tech-Ops-Anteil)

| Komponente | Szenario A (Hetzner) | Szenario B (Cloud) |
|---|---|---|
| App + DB + Cache | ~70 â‚¬/Monat | ~250 $/Monat |
| Observability (self-host) | enthalten | +60 $ managed Loki/Prom (Grafana Cloud free-tier reicht knapp) |
| Backup-Storage | 5 â‚¬/Monat | 30 $/Monat |
| WAF / Bot-Management | Cloudflare free â†’ 20 â‚¬ Pro | 20â€“60 $ |
| **Summe Tech-Ops** | **~100 â‚¬/Monat** | **~360â€“400 $/Monat** |

---

## SLO-VorschlÃ¤ge

| Indikator | Ziel | BegrÃ¼ndung |
|---|---|---|
| App-VerfÃ¼gbarkeit | 99,5 % MVP, 99,9 % nach 90 d | siehe Report 01 |
| Mean-Time-To-Detect (MTTD) | < 5 Min | Alert-Latenz |
| Mean-Time-To-Recover (MTTR) | < 30 Min | mit Runbook + Auto-Rollback |
| Backup-Success-Rate | > 99 % | Drift detection |
| Replay-Determinism | 100 % | nicht-verhandelbar |
| Match-Sim P95 Wall-Time | < 50 ms Mid-Tier Android | per ADR-0003 |

---

## Load-/Stress-Test-Plan

- **Profil â€žCI-Smoke-Lite":** Playwright-Suite gegen Staging, jedes Merge in `main`.
- **Profil â€žSoak":** 200 CCU Ã— 12 h, Hunt fÃ¼r Memory-Leaks, OTel-Memory.
- **Profil â€žAuth-Brute":** 5.000 Login-Attempts/Min auf einem Account â†’ Rate-Limit greift, kein Lockout legitimer User.
- **Profil â€žDeterminism-Replay":** 1.000 Seeds Ã— Replay, Bit-Equal.

---

## Runbook-Skizzen

### RB-T1: SurrealDB unresponsive
(Siehe `[[PM-2026-05-20-01-architecture#RB-A1]]` â€” Cross-Reference)

### RB-T2: Replay-Mismatch detektiert
1. **Detect:** Determinism-CI fail nach Merge, oder Bug-Report "Match war anders".
2. **Triage:** Seed + Match-Header aus Outbox ziehen; lokal replayen.
3. **Bisect:** Git-bisect auf Match-Engine-Package.
4. **Hotfix:** Determinismus-Bruch fixen, Match neu materialisieren (alle betroffenen Saves: opt-in â€ždiesen Match nochmal anzeigen").
5. **Postmortem:** Welche Lint-Regel hÃ¤tte das gefangen?

### RB-T3: Session-Reuse-Storm
1. **Detect:** Reuse-Detection-Rate > 5/Min fÃ¼r mehr als 5 Min.
2. **Triage:** Token-Family-Ursprung prÃ¼fen â€” Multi-Tab oder echter Angriff?
3. **Action:** Wenn Angriff â†’ Family revoken, User benachrichtigen, Session-Forensik.
4. **Followup:** Threshold tunen wenn False-Positive.

### RB-T4: GlitchTip Error-Spike
1. **Detect:** Error-Rate > 2Ã— baseline fÃ¼r 10 Min.
2. **Triage:** Top-Error in GlitchTip, Stack-Trace + User-Segment.
3. **Action:** Feature-Flag (sobald F-M-04 existiert) den Pfad deaktivieren, oder Rollback.

---

## Future-scope decisions (classified future-scope)

1. **Cloudflare oder anderer WAF?** Vor Launch entscheiden.
2. **On-Call-Tool:** PagerDuty (teuer) vs Discord-Webhook (heute) vs OpsGenie? Eskalations-Policy?
3. **Status-Page:** Gehostet oder self-hosted (z. B. statusnook)?
4. **Mutation-Score-Schwelle pro Package:** Welcher Floor (70 %? 80 %?), fÃ¼r welche Packages?

---

## â€žWenn-wir-nur-3-Dinge-tun"-Liste

1. **Determinism-CI-Gate live nehmen** â€” bevor die Match-Engine inhaltlich fertig ist.
2. **Restore-Drill automatisieren (monatlich)** â€” Backups sind nichts wert ohne getesteten Restore.
3. **Mindest-Alert-Catalog + Tabletop** â€” bevor der erste Incident dich findet.

---

## Verfolgung & Verkettung

IDs `PM-2026-05-20-02-F-NN` zitierbar in Commits/PRs/ADRs (`Addresses PM-2026-05-20-02-F-NN`). Aggregat-Status: [[findings-registry]].

## Iteration 2 Addendum (2026-05-20) â€” Security & Single-Player-Foundation

> ErgÃ¤nzt diesen Tech-/Ops-Report. Cross-Refs: [[threat-model]], [[PM-2026-05-20-05-security-and-integrity]].

### Security & Tamper-Resistance (Tech & Ops)

- **Supply-Chain.** `pnpm audit` als CI-Gate, signierte Container-Images (cosign), Renovate-QuarantÃ¤ne-Branch + 72 h Cooldown, SBOM (CycloneDX) pro Release. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-05|05-F-05]].
- **Secrets-Rotation-Runbook.** Konkret: was passiert wenn Hetzner-Token leakt? sops-Rotation, Service-Restart, Loki-Hunt nach Missbrauch. Verweis auf [[../../30-Implementation/secrets-management]].
- **Auth-Hardening.** WebAuthn-User-Verification = `required`, kein PW-only-Fallback in Production. Account-Recovery-Code-Verlust soll nicht zur Account-Ãœbernahme degenerieren. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-10|05-F-10]].
- **Rate-Limit / Anti-Abuse.** Konkrete Werte (â‰¤ 60 Commands/min/Account, â‰¤ 5 Login-Versuche/min/IP, Captcha-Schwellen) gem. [[../../30-Implementation/rate-limiting-anti-abuse]].
- **Determinismus-CI-Gate.** Replay-Diff im CI ist QualitÃ¤ts-Test *und* Anti-Cheat-Foundation. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-03|05-F-03]].
- **TLS / Cookie / Header.** HSTS, COOP/COEP, CSP (mit Nonce, kein `unsafe-inline`), Referrer-Policy `same-origin`, SameSite=Strict fÃ¼r Session-Cookies.
- **Privacy by Design.** PII gehasht oder eingeschrÃ¤nkt geloggt; Loki-Redaction als Allow-List statt Deny-List. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09|05-F-09]].
- **Backup-Crypto.** Backups Ende-zu-Ende verschlÃ¼sselt mit Off-Site-Key (kein gemeinsamer Cloud-KMS-Single-Point).
- **DDoS / WAF.** Cloudflare L7-Schutz vor TanStack-Routes; Anycast-Rate-Limit ergÃ¤nzt App-Layer.
- **Observability fÃ¼r Security.** Dedizierte Loki-Streams `stream=audit`, `stream=auth`; Grafana-Alerts fÃ¼r ungewÃ¶hnliche Token-Reuse-Frequenzen. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-08|05-F-08]].

### Single-Player-Foundation-Check (Tech & Ops)

- **Determinism-Test gilt auch SP.** Derselbe Test, der MP vor Cheats schÃ¼tzt, garantiert SP vor versteckten Bugs (Bug-Replays reproduzierbar).
- **Backup eines lokalen Saves.** Muss auch ohne Server-Verbindung erzeugbar sein (Export-Datei), mit demselben Schema und derselben Signatur-Struktur â€” sonst â€žBackup im SP" inkompatibel mit â€žCloud-Sync spÃ¤ter".
- **Auth funktioniert auch lokal.** Passkey-Erstellung darf nicht zwingend Online-Roundtrip benÃ¶tigen (Erst-Use offline aktivierbar); Sync passiert bei nÃ¤chster Online-Verbindung.

---

## Related

- [[00-index]]
- [[findings-registry]]
- [[threat-model]]
- [[PM-2026-05-20-01-architecture]]
- [[PM-2026-05-20-03-gameplay]]
- [[PM-2026-05-20-04-monetization]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-06-distributed-match-compute]]
- [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
- [[../determinism-and-replay]]
- [[../../10-Architecture/09-Decisions/ADR-0001-tech-stack]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/session-management]]
- [[../../30-Implementation/client-telemetry]]
- [[../../30-Implementation/rate-limiting-anti-abuse]]
- [[../../00-Index/Current-State]]
