---
title: "Pre-Mortem 2026-05-20 · 04 · Monetization"
status: current
tags: [research, pre-mortem, monetization, analytics, retention, compliance, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-04
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[../gdpr-compliance]]
  - [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
  - [[../../30-Implementation/privacy-and-consent]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../00-Index/Current-State]]
---

# Pre-Mortem 2026-05-20 · 04 · Monetization

> **Pre-Mortem-Hypothese (Failure-Headline):**
> "In sechs Monaten waren wir gescheitert, weil 10.000 Spieler 0 € Umsatz produziert haben — wir hatten keine Monetarisierungs-Hypothese, keine Product-Analytics, keine Feature-Flags, kein Retention-Loop, und der nachgeschobene Battlepass produzierte Community-Backlash."

## Scope

Dieser Report adressiert **Monetarisierungs-, Compliance- und Live-Ops-Risiken** unter der Annahme von 10k Spielern in 6 Monaten. Ausgangslage: **Monetarisierung ist heute zu 0 % implementiert** (keine Payment-Lib, keine Product-Analytics, keine Feature-Flags, keine Push/E-Mail, keine Helpdesk). Wave-3 Gaps G3 (KPIs), G4 (Monetisation Strategy), G5 (Pricing), G6 (Beta), G7 (Marketing), G8 (Support), H5 (Feature-Flags), H6 (A/B), H7 (Analytics), H8 (Live-Ops) waren zum Reportzeitpunkt unclassified; 2026-05-22 concept-closed.

## Top Failure-Hypothesen

### PM-2026-05-20-04-F-01 — Keine Monetarisierungs-Hypothese vor Launch committed

```yaml
id: PM-2026-05-20-04-F-01
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "approved_monetization_GDDR_or_ADR_count"
    threshold: "=0"
mitigation_summary: "Monetarisierungs-GDDR + Pricing-ADR vor Soft-Launch-Beta"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: product+founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne ratifizierte Monetarisierungs-Hypothese (F2P + Cosmetics? One-time-Premium? Saison-Pass? Abo? Hybrid?) gibt es keine Conversion-Mechanik, kein Pricing, keinen Payment-Provider — und Nachreichen verursacht Backlash.

**Mitigation.**
1. **Decision-Workshop bis Monat -4 vor Launch:** F2P-mit-Cosmetics ist sehr wahrscheinlich richtig, aber explizit entscheiden.
2. **GDDR + Pricing-ADR** mit klaren Test-Hypothesen.
3. **Soft-Launch-Plan** (siehe F-04) mit Pricing-A/B.

**Verifikation.** Approved GDDR `G-monetization` und ADR `pricing-and-iap` im Vault sichtbar; `addresses: [PM-2026-05-20-04-F-01]` im Frontmatter.

---

### PM-2026-05-20-04-F-02 — Kein Product-Analytics → Conversion-Blindheit

```yaml
id: PM-2026-05-20-04-F-02
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "funnel_events_instrumented_count"
    threshold: "<10 critical events"
mitigation_summary: "PostHog self-hosted (DSGVO-fit) ab Tag 1 + Funnel-Definition + Event-Taxonomie"
linked_adrs:
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
linked_specs:
  - [[../../30-Implementation/client-telemetry]]
  - [[../../30-Implementation/privacy-and-consent]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: data+platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** OTel + Loki/Prometheus + GlitchTip messen Performance und Crashes — keine Conversion. Ohne Product-Analytics (PostHog/Mixpanel) sind wir bei 10k Spielern blind: warum kauft niemand? Wo droppen die Spieler?

**Mitigation.**
1. **PostHog self-hosted** (DSGVO-konform, kein EU-US-Transfer) oder ähnlich.
2. **Event-Taxonomie**: Mindest-Events `signup`, `onboarding_step_{n}`, `first_match_started`, `first_match_completed`, `purchase_initiated`, `purchase_completed`, `purchase_failed{reason}`, `refund_requested`, `entitlement_granted`.
3. **Funnel-Dashboards** Reg → D1 → D7 → D30 → First-Purchase → Repeat.
4. **Consent-Gate** für Analytics gemäß `privacy-and-consent.md`.

**Verifikation.** Funnel-Heatmap zeigt jeden Schritt; Drop-Offs identifizierbar.

---

### PM-2026-05-20-04-F-03 — Keine Feature-Flags / A/B → keine gefahrlosen Experimente

```yaml
id: PM-2026-05-20-04-F-03
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "feature_flag_system_in_prod"
    threshold: "absent"
mitigation_summary: "GrowthBook self-hosted + Server- & Client-SDK + Killswitch-Pattern"
linked_adrs: []
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

**Hypothese.** Ohne Feature-Flags ist jeder Monetarisierungs-Test eine harte Deploy-Entscheidung. Pricing-A/B, neuer Storefront, Trial-Period → alles muss flaggable sein.

**Mitigation.** GrowthBook self-hosted (DSGVO + offline-fit) oder Unleash. Killswitch für jede neue Feature-Flag. SDK in Server + Client.

---

### PM-2026-05-20-04-F-04 — Kein Soft-Launch / Beta → Skalierungs- und Pricing-Schock direkt im Hard-Launch

```yaml
id: PM-2026-05-20-04-F-04
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "weeks_of_beta_pre_hard_launch"
    threshold: "<4"
mitigation_summary: "Soft-Launch in 1 Land (DE oder CH) 4–6 Wochen + Beta-Programm + öffentlich kommuniziert"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: product+marketing
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Hard-Launch ohne Soft-Launch ist Russisches Roulette: Lasttests sind synthetisch, echte Spieler verhalten sich anders, Pricing-Resonanz unbekannt.

**Mitigation.** Beta-Programm (TestFlight-Equivalent / PWA-Invite); Pricing erst im Soft-Launch enthüllen; Telemetrie-Hard-Validierung.

---

### PM-2026-05-20-04-F-05 — Payment-Provider-Lock-In / Sperre-Risiko

```yaml
id: PM-2026-05-20-04-F-05
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 2
impact: 5
score: 10
confidence: medium
early_warning:
  - metric: "stripe_dispute_rate"
    threshold: ">0.5%"
  - metric: "stripe_review_emails_per_month"
    threshold: ">0"
mitigation_summary: "Multi-Provider-Layer (Adapter) + Paddle als Backup + Reserve aufbauen"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend+finance
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Gaming gilt bei Stripe als Risiko-Branche; eine Welle Chargebacks oder ein automatisierter Review kann Auszahlungen wochenlang einfrieren. Ohne Backup-Provider keine Aussteuerung.

**Mitigation.** Payment-Adapter (Interface), erst Stripe, Paddle als Fallback. Receipt-Verification serverseitig. Dispute-Rate < 0,5 % halten.

---

### PM-2026-05-20-04-F-06 — DSGVO-/Verbraucherschutz-Lücken beim Bezahlen

```yaml
id: PM-2026-05-20-04-F-06
domain: compliance
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 5
score: 15
confidence: high
early_warning:
  - metric: "active_pre-launch_legal_review_count"
    threshold: "=0"
  - metric: "missing artifacts: AGB, Widerruf, Impressum"
    threshold: ">=1"
mitigation_summary: "Legal-Review pre-Launch + AGB/Widerruf-Templates + DPA mit Payment-Provider"
linked_adrs: []
linked_specs:
  - [[../gdpr-compliance]]
  - [[../../30-Implementation/privacy-and-consent]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** DSGVO ist sauber (locked). Bezahlung bringt zusätzliche Pflichten: AGB, Widerrufsrecht (mit ausdrücklichem Verzicht für digitale Inhalte), Impressum, MOSS/OSS-VAT-Reporting, DPA mit Payment-Provider. Eine Verbraucherschutz-Abmahnung kostet Geld und Image.

**Mitigation.** Legal-Review vor Soft-Launch; Templates aus iubenda/Termly oder dezidierter Kanzlei. Paddle erleichtert via Merchant-of-Record-Modell.

---

### PM-2026-05-20-04-F-07 — Retention-Loop fehlt → D7/D30 katastrophal

```yaml
id: PM-2026-05-20-04-F-07
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "d7_retention_pct"
    threshold: "<15%"
  - metric: "emails_or_pushes_per_user_per_week"
    threshold: "=0"
mitigation_summary: "E-Mail-Lifecycle via Brevo + Web-Push + In-App-Digest"
linked_adrs: []
linked_specs:
  - [[../../30-Implementation/privacy-and-consent]]
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: product+marketing
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne aktive Re-Engagement (E-Mail-Welcome-Series, Match-Result-Push, Saison-Übergangs-Digest) verlieren wir 60+ % der Spieler in der ersten Woche.

**Mitigation.** Brevo (bereits in DPA-Scope) für E-Mail; Web-Push opt-in mit klarer Privacy-Erklärung; Digest "Was ist letzte Woche in deinem Save passiert?".

---

### PM-2026-05-20-04-F-08 — Kein Customer-Support → Reviews-Tornado

```yaml
id: PM-2026-05-20-04-F-08
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "median_response_time_user_email_hours"
    threshold: ">48h"
  - metric: "store_review_avg_rating"
    threshold: "<4.0"
mitigation_summary: "Helpdesk (Plain.com / FreeScout) + In-Game-Feedback + Public FAQ"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: support
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Lost-Account, Falsche-Abbuchung, Bugs — ohne Support-Pfad gehen Beschwerden in Store-Reviews und Twitter. Rating-Drop = Discoverability-Drop.

**Mitigation.** Light-Helpdesk (FreeScout self-hosted oder Plain free-tier); In-Game-Feedback-Sheet; FAQ-Seite.

---

### PM-2026-05-20-04-F-09 — Kosten-Explosion durch viralen Spike (Marketing-DDoS)

```yaml
id: PM-2026-05-20-04-F-09
domain: monetization
scenario: [cloud-autoscaling]
probability: 2
impact: 4
score: 8
confidence: low
early_warning:
  - metric: "cloud_cost_daily_eur"
    threshold: ">3x baseline"
  - metric: "autoscale_max_instances_hit"
    threshold: ">0"
mitigation_summary: "Cloud-Budget-Alerts + Autoscale-Caps + WAF-Rate-Limit + Queue-Wartebildschirm"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+finance
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Erfolgreicher Reddit/TikTok-Post zieht 50k neue Nutzer in 24 h. Cloud-Autoscale bläht die Bill um 10× auf, ohne dass Conversion folgt.

**Mitigation.** Hard-Cap auf Autoscale; Cloud-Budget-Alerts (50/80/100 %); WAF rate-limit; Notfall-Queue-Wartescreen.

---

### PM-2026-05-20-04-F-10 — Refund-/Chargeback-Welle bricht Unit-Economics

```yaml
id: PM-2026-05-20-04-F-10
domain: monetization
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "refund_rate_pct"
    threshold: ">10%"
  - metric: "chargeback_rate_pct"
    threshold: ">0.5%"
mitigation_summary: "Receipt-Verification serverseitig + Entitlement-Audit + UX-Refund-Pfad + Fraud-Detection"
linked_adrs: []
linked_specs: []
linked_code: []
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend+finance
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wenn Käufer das Spiel nicht versteht oder Kauf zu früh erfolgt, kommen Refund-Requests. Chargeback-Stürme können Stripe-Konto-Review triggern (siehe F-05).

**Mitigation.** Receipt-Verification, klar erklärte Entitlements, UX für Refund (eigeninitiativ via Helpdesk), Fraud-Patterns (gleicher Card, viele Accounts).

---

## Quantitatives Modell

### Revenue-Sensitivität (10k registriert ⇒ 2.500 DAU)

| Conversion (% DAU zahlend) | ARPPU (€) | Bruttoumsatz/Monat (€) |
|---|---|---|
| 0,5 % (12,5 Payer) | 8 | 100 |
| 0,5 % | 15 | 188 |
| 2,0 % (50 Payer) | 8 | 400 |
| 2,0 % | 15 | 750 |
| 2,0 % | 30 | 1.500 |
| 5,0 % (125 Payer) | 15 | 1.875 |
| 5,0 % | 30 | 3.750 |

⇒ Bei 2 % × 15 € ≈ 750 €/Monat brutto. Davon abzuziehen:
- Payment-Fees ~5 % (Paddle) bis ~3 % + 0,30 €/Transaktion (Stripe) ≈ 30–50 € entfallen.
- EU-VAT je nach MoR-Modell.

**Break-Even-Heuristik:**

| Szenario | Infra-Kosten/Monat | Break-Even-Bruttoumsatz |
|---|---|---|
| A (Hetzner) | ~100 € | erreichbar ab ~0,5 % Conv × 15 € ARPPU |
| B (Cloud) | ~360–400 $ ≈ 330–370 € | erreicht ab ~2 % Conv × 15 € ARPPU |

⇒ Im Cloud-Setup ist 2 % Conversion *Mindest*-Anspruch, nicht Stretch-Goal.

### Funnel-Mathematik (zu schaffen)

```
10k Reg → 70 % Onboarding-Completion → 7.000 D1
       → 30 % D7                     → 2.100 D7
       → 15 % D30                    → 1.050 D30
       → 2 % Payer von D30           → 21 erste Käufer/Monat
       → 1,5 € durchschn. Re-Buy/Monat → +50 € MRR
```

⇒ Selbst optimistisch braucht es viele Marketing-Kohorten / Wachstum, um 1.000+ € MRR zu erreichen. **Pre-Mortem:** Monetarisierung im MVP ist Validierungs-Vehikel, nicht Cashflow-Quelle.

---

## SLO-Vorschläge

| Indikator | Ziel |
|---|---|
| Payment-Success-Rate | ≥ 98 % |
| Receipt-to-Entitlement-Latency P99 | < 30 s |
| Refund-Response-Time | < 48 h |
| DSGVO-DSAR-Export | ≤ 30 Tage |
| Cloud-Budget-Burn-Alert | bei 50 / 80 / 100 % Monatslimit |
| D7-Retention | ≥ 18 % |
| D30-Retention | ≥ 8 % |

---

## Test-Plan (Soft-Launch-Telemetrie)

- **Pflicht-Events:** siehe F-02 Liste.
- **A/B-Frame:** GrowthBook live, mindestens 1 Pricing-A/B-Test im Soft-Launch.
- **Compliance-Checklist:** Impressum, AGB, Widerruf, Datenschutz, Cookie-Banner (ggf. nicht nötig — siehe `privacy-and-consent`), Altersprüfung 16+.
- **Pricing-A/B-Design:** mindestens 2 Varianten pro Bündel; Sample-Size-Tabelle (~500 Conv. pro Arm für signifikante Aussage).

---

## Runbook-Skizzen

### RB-M1: Stripe sperrt Konto
1. Backup-Provider (Paddle) aktivieren via Adapter-Switch.
2. Kommunikation: Status-Page + E-Mail an Käufer.
3. Stripe-Eskalation parallel.

### RB-M2: Chargeback-Welle
1. Detection-Schwelle: > 0,5 % oder 5 Chargebacks/Tag.
2. Receipt-Audit, betroffene Accounts identifizieren.
3. Stripe-Radar / Paddle-Fraud-Tools verschärfen.

### RB-M3: EU-VAT-Audit
1. Aus Paddle / Stripe-Tax die VAT-Berichte ziehen.
2. Buchhalter-Workflow folgen.
3. Datenherausgabe innerhalb 7 Tagen.

### RB-M4: Cloud-Budget über 80 %
1. Alert prüft, ob viraler Traffic (gut) oder Bug (schlecht).
2. Wenn Bug: Feature-Flag dis-armen, Rollback.
3. Wenn echte Last: Autoscale-Cap erhöhen, ggf. Wartelisten-Screen.

---

## Future-scope decisions (classified future-scope)

1. **Monetarisierungs-Modell:** F2P-Cosmetic? Premium-OneTime? Saison-Pass? Hybrid?
2. **Payment-Provider:** Stripe direkt oder Paddle (MoR)?
3. **Analytics-Stack:** PostHog self-hosted vs SaaS?
4. **Soft-Launch-Land:** DE, CH, AT? Auswahl der Reichweite.
5. **Beta-Programm-Tool:** TestFlight (iOS) entfällt für PWA — Invite-only via E-Mail + URL?

---

## ”žWenn-wir-nur-3-Dinge-tun"-Liste

1. **Monetarisierungs-Hypothese committen** (GDDR + Pricing-ADR) vor Soft-Launch-Beta.
2. **PostHog (oder ähnlich) + Funnel-Events von Tag 1.**
3. **Retention-Loop bauen** (E-Mail-Welcome-Series + Match-Push + Digest).

---

## Verfolgung & Verkettung

IDs `PM-2026-05-20-04-F-NN`. Aggregat: [[findings-registry]].

## Iteration 2 Addendum (2026-05-20) — Security & Single-Player-Foundation

> Ergänzt diesen Monetarisierungs-Report. Cross-Refs: [[threat-model]], [[PM-2026-05-20-05-security-and-integrity]].

### Security & Tamper-Resistance (Monetization)

- **Receipt-Replay.** Derselbe Stripe-Receipt mehrfach eingereicht → Server-Side-Idempotenz via `eventId` aus Webhook-Payload (30-Tage-Replay-Window). Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-07|05-F-07]].
- **Refund-Abuse.** Kauf → Entitlement-Grant → Refund → Entitlement bleibt. **Mitigation:** Webhook `charge.refunded` → automatischer Entitlement-Revoke mit Karenz für Disputes.
- **Webhook-Forgery.** Stripe-Webhook-Endpoint signiert prüfen (`stripe-signature` Header + Webhook-Secret); IP-Allow-List wo möglich.
- **Currency-Manipulation.** Client schlägt Preis vor → Server akzeptiert. **Mitigation:** Preise serverseitig autoritativ; Client zeigt nur an.
- **GDPR-Conflict.** Account-Löschung vs steuerliche Aufbewahrung (10 Jahre). **Mitigation:** Pseudonymisierung + Aufbewahrung der Steuer-Records; Account-Daten gelöscht. Cross-Ref: [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-09|05-F-09]] und Runbook RB-S3.
- **Chargeback-Fraud-Detection-Signale.** Rapider Kauf+Refund+Re-Kauf, mehrere Accounts ein Gerät, VPN/Geo-Mismatch → Manual-Review-Queue.
- **Hijacked-Entitlements.** Account-Übernahme transferiert Käufe. Verweis auf Auth-Hardening in [[PM-2026-05-20-02-tech-and-ops]] und [[PM-2026-05-20-05-security-and-integrity#PM-2026-05-20-05-F-10|05-F-10]].

### Single-Player-Foundation-Check (Monetization)

- **Monetarisierungs-Layer ist trust-aware.** Premium-Features (z. B. Carry-Slots) sind in `cloud-verified`-Saves explizit verfügbar; in `unverified`-Saves grayed-out oder mit Hinweis ”žPremium aktiv, Save nicht synchronisiert". Verhindert Refund-Argument ”žmeine Premium-Features waren weg" und schützt vor Cheat-Argument ”žich habe Premium von einem geforgten Save geerbt".
- **SP-Käufer ist MP-fähig.** Premium-Käufe an Account, nicht an Save. SP-Spieler, der später in MP wechselt, behält Entitlements ohne Sync-Problem.

---

## Related

- [[00-index]]
- [[findings-registry]]
- [[threat-model]]
- [[PM-2026-05-20-01-architecture]]
- [[PM-2026-05-20-02-tech-and-ops]]
- [[PM-2026-05-20-03-gameplay]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-06-distributed-match-compute]]
- [[../gdpr-compliance]]
- [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/client-telemetry]]
- [[../../00-Index/Current-State]]
