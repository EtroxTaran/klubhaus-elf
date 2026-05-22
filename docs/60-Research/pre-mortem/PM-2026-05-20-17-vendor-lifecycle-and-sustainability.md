---
title: "Pre-Mortem 2026-05-20 Â· 17 Â· Vendor-Lifecycle & Sustainability"
status: current
tags: [research, pre-mortem, vendor, lifecycle, esg, sbom, cra, sustainability, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-17
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]]
---

# Pre-Mortem 2026-05-20 Â· 17 Â· Vendor-Lifecycle & Sustainability/ESG

> **Failure-Headlines**
> - â€žHetzner suspendet Account am Launch-Wochenende â€” 10 k Spieler offline 72 h â€” kein zweiter Cloud-Account."
> - â€žSurrealDB 3.x breaking-change v3.4 Computed Fields â€” Backup-Restore-Drill schlug nie an â€” 14 PT manuelle Recovery."
> - â€žStripe friert Auszahlungen ein â€” 'Football Manager' als Gambling-adjacent geflagged â€” 90-Tage-Reserve auf â‚¬4.500 â€” kein Paddle-Backup."
> - â€žTanStack Start stagniert ab Q4/2026 â€” Tanner Linsley auf Router-only â€” Migration zu Next.js 16 = 30â€“40 PT."
> - â€žCRA-Stichtag 11.12.2027: SBOM-Pflicht nicht eingehalten â€” Marktverbot EU + â‚¬15 M BuÃŸgeldrahmen."

## Top Failure-Hypothesen

### PM-2026-05-20-17-F-01 â€” Hetzner Acceptable-Use & Single-Account-Konzentration

```yaml
id: PM-2026-05-20-17-F-01
priority: P1
domain: vendor-infra
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - signal: "ToS-Verstoss (Spam-Flag bei Brevo-IPs, fehlende DSGVO-Reaktion in Fristen, Zahlungsverzug)"
  - signal: "Abuse-Report via Hetzner-Abuse-Team"
mitigation_summary: "Dual-Account-Pattern + Fly.io Cold-Standby + IaC fÃ¼r 1-Klick-Provisioning + Hetzner-ToS jÃ¤hrlich diffen"
linked_adrs: []
linked_specs: []
linked_code: ["infra/terraform/"]
sources:
  - title: "Hetzner System Policies"
    url: "https://www.hetzner.com/legal/system-policies/"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
  - title: "Hetzner Sustainability"
    url: "https://docs.hetzner.com/general/company-and-policy/sustainability-at-hetzner/"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
  - title: "Hetzner Cloud Docs"
    url: "https://docs.hetzner.cloud/"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
verification_notes: "Game-Server-Hosting ist erlaubt, aber Football-Manager-PWA = normale Web-App. Spam-Flag (Brevo via Hetzner-IPs) kann gesamten Cloud-Account suspendieren. Cloud-Console + Robot unter einem Auth-Konto."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Dual-Account-Pattern**: zweiter Hetzner-Account (GbR-Holding oder Backup-Org) â€” Cold-Standby andere Hetzner-Location (FI statt DE). (2) **Externer Cold-Failover** zu Fly.io oder Scaleway: vollstÃ¤ndiges Terraform-Modul fÃ¼r 1-Klick-Provisioning, monatlicher Boot-Test (~â‚¬4/Mo Idle auf Fly.io Free-Tier). (3) **Pre-flight Migration-Runbook** (RB-17-A). (4) Cloud-API + Robot-API in IaC (kein Console-Click-Ops). (5) Brevo + Cloudflare-IPs fÃ¼r Outbound-Mail, nicht Hetzner-IPs (Spam-Listing vermeiden).

**Verifikation.** QuartÃ¤rlicher Failover-Drill: Stack auf Fly.io aus letztem Backup, RTO < 4 h. Hetzner-ToS jÃ¤hrlich diffen (hash-Snapshot in `docs/40-Compliance/vendor-tos-snapshots/`).

### PM-2026-05-20-17-F-02 â€” SurrealDB 3.x Monthly-Release-Cadence + Backup-Restore-Reife

```yaml
id: PM-2026-05-20-17-F-02
priority: P1
domain: vendor-data
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "SurrealDB monthly release breaking-change marker"
    threshold: "any"
  - metric: "Restore-Drill success-rate"
    threshold: "< 95 %"
mitigation_summary: "Logical-Export tar.zst tÃ¤glich nach Hetzner-Storage-Box + Backblaze B2 (off-vendor); Schema-as-Code reversible Migrations; Fallback-Adapter-Layer fÃ¼r Postgres-PoC"
linked_adrs: []
linked_specs: []
linked_code: ["apps/api/src/server/db/repos/*"]
sources:
  - title: "SurrealDB GitHub"
    url: "https://github.com/surrealdb/surrealdb"
    accessed: "2026-05-20"
    publisher: "SurrealDB"
    confidence: high
  - title: "SurrealDB Monthly Release Schedule"
    url: "https://surrealdb.com/blog/introducing-our-new-monthly-release-schedule"
    accessed: "2026-05-20"
    publisher: "SurrealDB"
    confidence: high
  - title: "SurrealDB $23M Series A"
    url: "https://www.hpcwire.com/bigdatawire/this-just-in/surrealdb-secures-23m-series-a-boost-launches-surrealdb-3-0/"
    accessed: "2026-05-20"
    publisher: "HPCwire"
    confidence: high
  - title: "Migrating data to 2.x"
    url: "https://surrealdb.com/docs/surrealdb/installation/upgrading/migrating-data-to-2x"
    accessed: "2026-05-20"
    publisher: "SurrealDB"
    confidence: high
verification_notes: "SurrealDB 3.0-GA mit $23 M Series A (Feb 2026), 31k Stars, Referenzkunden (Verizon, Walmart, ING, Samsung). Monthly Release-Cadence (2. Dienstag) erhÃ¶ht Drift-Risiko. 1.xâ†’2.x verlangte explizite Daten-Transformation."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+architecture
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Logical-Export per `surreal export`** in CycloneDX-getaggte tar.zst-Files, tÃ¤glich nach Hetzner-Storage-Box + Backblaze B2 (off-vendor). (2) **Schema-as-Code** Migrations-Files (kein Live-DDL), reversible-Pattern. (3) **Fallback-Adapter-Layer**: Queries Ã¼ber Repository-Pattern (`@/server/db/repos/*`), Postgres-Adapter parallel testbar. (4) **CockroachDB-Spike-PoC** 2 Wochen Bench: kann Domain-Model in Postgres-Mode abgebildet werden? Falls ja â†’ Migration-Cost dokumentieren. (5) Monatlicher Restore-Drill in CI.

**Verifikation.** SLO â€žDB-Restore < 30 min fÃ¼r 10k-DAU-Snapshot" als CI-Gate. SurrealDB-Release-Notes monatlich diffen.

### PM-2026-05-20-17-F-03 â€” TanStack Start v1.x Maintainer-Konzentration

```yaml
id: PM-2026-05-20-17-F-03
priority: P3
domain: vendor-frontend
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - signal: "Tanner Linsley publishes hiatus / Sponsor-Count drops 3+/90d"
  - signal: "Last commit TanStack/router > 6 Monate"
mitigation_summary: "Architektur-Isolations-Pattern (Business-Logik framework-agnostic); Server-Functions als HTTP-RPC; Sponsoring $30/Mo; Migration-Pfad Remix + Next.js 16"
linked_adrs: []
linked_specs: []
linked_code: ["apps/web/src/server/features/*"]
sources:
  - title: "TanStack Start v1"
    url: "https://tanstack.com/blog/announcing-tanstack-start-v1"
    accessed: "2026-05-20"
    publisher: "TanStack"
    confidence: high
  - title: "Tanner Linsley TanStack 2 years"
    url: "https://tanstack.com/blog/tanstack-2-years"
    accessed: "2026-05-20"
    publisher: "TanStack"
    confidence: high
  - title: "Tanner Linsley Scarf interview"
    url: "https://about.scarf.sh/post/tanner-linsley"
    accessed: "2026-05-20"
    publisher: "Scarf"
    confidence: medium
verification_notes: "v1.0-RC im MÃ¤rz 2026 (Beta-Risk teilweise mitigiert). 16 Partner-Sponsoren finanzieren; Wegfall 2â€“3 in Recession-Year gefÃ¤hrdet Linsley-Vollzeit-Salary. Tanner Linsley = primary Bus-Factor (Router + Query + Form + Start + 9 weitere Libs)."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Architektur-Isolation**: Business-Logik in `@/server/features/*` framework-agnostic, Router-Bindings dÃ¼nn. (2) **Server-Functions als HTTP-RPC** (Ã¼ber `@tanstack/start/server`) statt direkter Loader-Coupling â€” leichter zu Hono/Elysia/Next portierbar. (3) **Sponsoring**: $30/Mo GitHub-Sponsor symbolisch + Daten-Signal. (4) **Migration-Pfad dokumentiert** zu Remix (Vite-basiert, Ã¤hnliches Loader-Model) als 1. Backup, Next.js 16 als 2. Backup.

**Verifikation.** HalbjÃ¤hrlicher TanStack-Health-Check: Last-Commit, # Contributors letzte 90 Tage, Linsley-Activity, Sponsor-Count.

### PM-2026-05-20-17-F-04 â€” Stripe vs Paddle Gaming-High-Risk Lock-In

```yaml
id: PM-2026-05-20-17-F-04
priority: P2
domain: vendor-payment
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - signal: "Stripe Dashboard 'Action required: account review'"
  - signal: "Chargeback rate > 1 % rolling 30d (Stripe-Risk-Score-Trigger)"
mitigation_summary: "Paddle als MoR-Default; Stripe als parallel-aktivierter Secondary; Subscription-Migration-Schicht; No-PII-in-Paddle; MCC-Code-Klarheit 'Productivity Software / Sports Management Simulation'"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-04-monetization]], [[PM-2026-05-20-08-legal-consumer-law-and-tax]]]
linked_code: []
sources:
  - title: "Stripe High-Risk Business"
    url: "https://www.chargeback.io/blog/stripe-high-risk-business-what-it-means"
    accessed: "2026-05-20"
    publisher: "Chargeback.io"
    confidence: high
  - title: "Stripe Account Closure Stories"
    url: "https://www.seamlesschex.com/blog/stripe-closed-my-account"
    accessed: "2026-05-20"
    publisher: "SeamlessChex"
    confidence: medium
  - title: "Paddle vs Stripe Comparison"
    url: "https://unibee.dev/blog/paddle-vs-stripe-the-ultimate-comparison/"
    accessed: "2026-05-20"
    publisher: "UniBee"
    confidence: medium
verification_notes: "Stripe listet Gaming explizit als High-Risk-Category. 70 % High-Risk-Merchants unaware der no-warning-closure-Risiken. Football-Manager mit Auction-House gerne als gambling-adjacent geflagged. Paddle MoR: Sub-Migration laut Anekdoten 4 Monate (Tax-Records exportieren schwierig). Crossover ~$50â€“100k MRR."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+finance
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Paddle als Default-MVP-Provider** (MoR macht Single-Founder MwSt-Pflicht in 27 EU + UK + US-States obsolet). (2) **Stripe als parallel-aktivierter Secondary** ab Tag 1 â€” Test-Mode-Account, monatlicher Smoke-Test. (3) **Subscription-Migration-Schicht**: eigene `subscription_id`-Abstraktion in DB (nicht direkt Paddle-`subscription_id`); Webhook-Adapter pro Provider. (4) **No-PII-in-Paddle**: nur Paddle-customer-id â†” unsere user-id. (5) **MCC-Code-Klarheit**: Paddle-Onboarding prÃ¤zise als â€žProductivity Software / Sports Management Simulation", nicht â€žGame", nicht â€žGambling".

**Verifikation.** QuartÃ¤rlicher Stripe-Test-Mode-Smoke. Paddle-Sandbox-to-Production-Cutover-Drill 1Ã—/Jahr.

### PM-2026-05-20-17-F-05 â€” GlitchTip Maintainer-Konzentration

```yaml
id: PM-2026-05-20-17-F-05
priority: P4
domain: vendor-obs
probability: 2
impact: 3
score: 6
confidence: medium
early_warning:
  - metric: "GlitchTip release cadence"
    threshold: "> 6 Monate ohne Release"
  - signal: "License-Change-Diff"
mitigation_summary: "Sentry-SDK-KompatibilitÃ¤t ausnutzen (DSN-Switch reicht fÃ¼r Migration); Error-Routing-Layer mit Beforesend-Hook + Loki-Push-Fallback; License-Watch"
linked_adrs: []
linked_specs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_code: []
sources:
  - title: "GlitchTip 6.0 Release Feb 2026"
    url: "https://glitchtip.com/blog/2026-02-03-glitchtip-6-released/"
    accessed: "2026-05-20"
    publisher: "GlitchTip"
    confidence: high
  - title: "GlitchTip GitLab"
    url: "https://gitlab.com/glitchtip"
    accessed: "2026-05-20"
    publisher: "GlitchTip"
    confidence: high
verification_notes: "GlitchTip 6.0 erschien Feb 2026 (positiv); primÃ¤r von Burke Software (David Burke) als Side-Project. Enterprise-Support-Offering ($15/User/Mo) deutet auf Monetisierungs-Druck â†’ mÃ¶gliche BSL/SSPL-Pivot wie Sentry 2019."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Sentry-SDK-KompatibilitÃ¤t ausnutzen (DSN-Switch reicht fÃ¼r Sentry-SaaS-Free 5k events/Mo oder Bugsink). Error-Routing-Layer: Beforesend-Hook bei DSN-Failure â†’ lokaler Loki-Push-Endpoint. License-Watch auf GitLab.

### PM-2026-05-20-17-F-06 â€” Cloudflare-Workers Proprietary-Lock vs bunny.net

```yaml
id: PM-2026-05-20-17-F-06
priority: P3
domain: vendor-edge
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "Code-Suchen nach 'cf.', 'KVNamespace', 'DurableObjectStub'"
    threshold: "> 3 Stellen"
mitigation_summary: "Workers vermeiden fÃ¼r MVP â€” pure-CDN + WAF + DNS reicht; falls Edge-Compute spÃ¤ter: standard Web-APIs, Terraform-Provider-Swap-fÃ¤hig; DNS separat halten (INWX als Registrar)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "bunny.net vs Cloudflare 2026"
    url: "https://www.kunalganglani.com/blog/bunnynet-vs-cloudflare-2026"
    accessed: "2026-05-20"
    publisher: "Kunal Ganglani"
    confidence: medium
  - title: "Cloudflare alternatives 2026"
    url: "https://www.truefoundry.com/blog/top-9-cloudflare-ai-alternatives-and-competitors-for-2026-ranked"
    accessed: "2026-05-20"
    publisher: "TrueFoundry"
    confidence: medium
verification_notes: "Cloudflare-Workers + Page-Rules + R2 sind proprietÃ¤r ohne Migration. bunny.net (Slovenien, DSGVO-nativ) gÃ¼nstiger ohne Workers-Lock, aber Edge-Compute 'Magic Containers' weniger reif."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Workers vermeiden** fÃ¼r MVP â€” pure-CDN + WAF + DNS reicht. (2) Falls spÃ¤ter Edge-Compute: standard Web-APIs (Fetch, Streams), keine `KV`/`D1`/`Durable Objects`. (3) Page-Rules als Code (Terraform `cloudflare_ruleset`) â€” Migration via Terraform-Provider-Swap. (4) DNS separat halten (siehe F-09): selbst wenn CF als CDN, Registrar lieber INWX.

**Verifikation.** Architektur-Review: `cf.`, `KVNamespace`, `DurableObjectStub`-Anzahl als Lock-In-Metrik, Ziel < 3.

### PM-2026-05-20-17-F-07 â€” License-Compliance & SBOM-Pflicht (CRA 2027)

```yaml
id: PM-2026-05-20-17-F-07
priority: P1
domain: vendor-supply-chain
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "License-Checker AGPL/SSPL/BSL violations"
    threshold: "> 0 in CI"
  - metric: "SBOM-Generation"
    threshold: "fehlt bei Release-Tag"
mitigation_summary: "CI-Gate cdxgen + cosign attach sbom + license-checker --failOn 'AGPL-3.0;SSPL-1.0;Commons Clause;BUSL-1.1'; Container-Signing cosign; Vulnerability-Reporting an ENISA in < 24 h ab 11.09.2026"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[PM-2026-05-20-08-legal-consumer-law-and-tax]]]
linked_code: [".github/workflows/sbom-and-license.yml", "Dockerfile"]
sources:
  - title: "EU Cyber Resilience Act"
    url: "https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act"
    accessed: "2026-05-20"
    publisher: "European Commission"
    confidence: high
  - title: "CRA SBOM-Pflichten (FOSSA)"
    url: "https://fossa.com/blog/sbom-requirements-cra-cyber-resilience-act/"
    accessed: "2026-05-20"
    publisher: "FOSSA"
    confidence: high
  - title: "@cyclonedx/cdxgen"
    url: "https://www.npmjs.com/package/@cyclonedx/cdxgen"
    accessed: "2026-05-20"
    publisher: "npm"
    confidence: high
  - title: "EU Cyber Laws OSS"
    url: "https://eu-cyber-laws.com/cra/open-source/"
    accessed: "2026-05-20"
    publisher: "eu-cyber-laws.com"
    confidence: high
  - title: "SBOM Management"
    url: "https://sbom-management.com/"
    accessed: "2026-05-20"
    publisher: "SBOM Management"
    confidence: medium
verification_notes: "EU CRA volle Anwendbarkeit 11.12.2027 fÃ¼r 'products with digital elements'. F2P-PWA mit Mikrotransaktionen fÃ¤llt NICHT unter Non-Commercial-OSS-Exempt. Pflichten: (a) maschinenlesbare SBOM (CycloneDX 1.6 / SPDX 3.0.1 per BSI TR-03183-2), (b) Vulnerability-Reporting an ENISA in 24 h ab 11.09.2026 (< 4 Monate!), (c) Update-Pflichten 5 Jahre. License-Risk: AGPL-3.0 viral bei Server-Use, SSPL-1.0 viral auf Service-Stack."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **CI-Gate `cdxgen`**: bei jedem Tag â†’ CycloneDX-JSON + XML, in OCI-Registry als Attachment via `cosign attach sbom`. (2) **`@cyclonedx/cdxgen` v11+** fÃ¼r JS/TS, Syft fÃ¼r Container-Layer. (3) **License-Check-Gate** in CI mit `license-checker --failOn 'AGPL-3.0;SSPL-1.0;Commons Clause;BUSL-1.1'` â€” Build-bricht-bei-viralem-License-Eintreten. (4) **Container-Signing**: `cosign sign` + Sigstore-Transparency-Log. (5) **Vulnerability-Handling-Runbook**: GlitchTip â†’ Trivy-Daily-Scan â†’ manueller Triage â†’ ENISA-Form binnen 24 h fÃ¼r CVSS â‰¥ 9.0. (6) **License-Whitelist** in `docs/40-Compliance/license-policy.md`: MIT, BSD-2/3, Apache-2.0, ISC, MPL-2.0, LGPL-2.1+ (caveat), CC0. Greylist: AGPL-3.0 fÃ¼r client-only Dev-Tools (Dev-only, nicht `dependencies`).

**Verifikation.** CI-Workflow `sbom-and-license.yml` required-check. QuartÃ¤rlicher SBOM-Audit: random Release-SBOM gegen `npm ls --all`; Drift > 5 % = Red-Flag.

### PM-2026-05-20-17-F-08 â€” Grafana-LGTM-Vendor-Konzentration

```yaml
id: PM-2026-05-20-17-F-08
priority: P4
domain: vendor-obs
probability: 2
impact: 3
score: 6
confidence: medium
early_warning:
  - signal: "Grafana License-Change-Announcement (BSL/SSPL-Pivot)"
mitigation_summary: "Keine Grafana-Code-Modifikationen (nur Config + Dashboards-JSON = user-content); OpenObserve und SigNoz als evaluierte Backups; License-Watch alle 6 Mo"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Grafana LGTM AGPLv3 Relicense"
    url: "https://grafana.com/blog/grafana-loki-tempo-relicensing-to-agplv3/"
    accessed: "2026-05-20"
    publisher: "Grafana"
    confidence: high
  - title: "Grafana Licensing"
    url: "https://grafana.com/licensing/"
    accessed: "2026-05-20"
    publisher: "Grafana"
    confidence: high
  - title: "OpenObserve Top 10 Alternatives"
    url: "https://openobserve.ai/blog/top-10-grafana-alternatives/"
    accessed: "2026-05-20"
    publisher: "OpenObserve"
    confidence: medium
verification_notes: "Grafana Labs 2021 von Apache-2.0 zu AGPLv3 (Grafana, Loki, Tempo). Mimir, Alloy gemischt. Erneute Pivot zu BSL/SSPL (wie HashiCorp 2023, Redis 2024) nicht ausgeschlossen."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Keine Grafana-Code-Modifikationen** (nur Config + Dashboards-JSON = user-content, kein AGPL-Disclosure-Trigger). (2) **OpenObserve** als Backup-Stack evaluiert (single binary, S3-Backend, 60â€“90 % Storage-Savings) â€” Migration ~5â€“10 PT (OTel-Compatible). (3) **SigNoz** als zweite Alternative (ClickHouse, MIT). (4) License-Watch alle 6 Monate.

### PM-2026-05-20-17-F-09 â€” Domain-Registrar Single-Point-of-Failure

```yaml
id: PM-2026-05-20-17-F-09
priority: P1
domain: vendor-dns
probability: 2
impact: 5
score: 10
confidence: high
early_warning:
  - signal: "Domain-Hijacking via Social-Engineering"
  - signal: "Unbezahlte VerlÃ¤ngerung"
  - metric: "DNS-Audit Trends"
    threshold: "WHOIS-Diff, DNSSEC-Validation-Fail"
mitigation_summary: "INWX (Berlin, DSGVO-nativ) als Primary; Cloudflare als DNS-Hoster (Anycast + DNSSEC); Registry-Lock; YubiKey-2FA NIE SMS; Auto-Renew + Pre-Pay 5 Jahre; Notarize Domain-Ownership"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Best Domain Registrars 2026"
    url: "https://domaindetails.com/kb/getting-started/best-domain-registrars-compared"
    accessed: "2026-05-20"
    publisher: "DomainDetails"
    confidence: medium
  - title: "Best registrars 2026 (Names Center)"
    url: "https://names.center/blog/best-domain-registrars-2026.php"
    accessed: "2026-05-20"
    publisher: "Names Center"
    confidence: medium
  - title: "Largest Domain Registrars"
    url: "https://cybernews.com/best-domain-registrars/largest-domain-registrars/"
    accessed: "2026-05-20"
    publisher: "Cybernews"
    confidence: medium
verification_notes: "Domain-Hijacking (Social-Engineering Registrar-Support, unbezahlte VerlÃ¤ngerung). Hetzner-DNS hÃ¤ngt am Hetzner-Account (Coupling F-01). **GoDaddy EU-untauglich seit Feb 2026** (Reclassifizierung als 'Business Customers'). INWX (Berlin) hat eigene ICANN-Akkreditierung, DSGVO-nativ, akzeptiert Hardware-Key-2FA."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **INWX** (Berlin, eigene ICANN-Akkreditierung) als Primary-Registrar â€” DSGVO-nativ, gute API, Hardware-Key-2FA. (2) **DNS getrennt vom Registrar**: Cloudflare als DNS-Hoster (Anycast + DNSSEC + 1-Click-Failover) â€” wenn Hetzner-Account weg, DNS bleibt. (3) **Registry-Lock** aktivieren (server-side hold, ~â‚¬20/Jahr bei INWX). (4) **2FA mit YubiKey** fÃ¼r Registrar-Account, **KEINE SMS**. (5) **Auto-Renew + Pre-Pay 5 Jahre** (verhindert Domain-Lapse). (6) **Notarize Domain-Ownership** via WHOIS-Snapshot + BankÃ¼berweisungs-Beleg im Vault (`docs/40-Compliance/domain-ownership-proof/`).

**Verifikation.** QuartÃ¤rlicher DNS-Audit: WHOIS-Diff, DNSSEC-Validation (https://dnsviz.net/), DMARC/SPF/MTA-STS. Renewal-Calendar T-60/T-30/T-7.

### PM-2026-05-20-17-F-10 â€” sops + age Secret-Management Sustainability

```yaml
id: PM-2026-05-20-17-F-10
priority: P4
domain: vendor-secrets
probability: 2
impact: 3
score: 6
confidence: medium
early_warning:
  - metric: "Last release age (FiloSottile)"
    threshold: "> 12 Monate ohne Activity"
mitigation_summary: "Dual-Recipient sops (age + PGP/YubiKey); HashiCorp Vault als 5-PT-Migration dokumentiert; age-Key-Rotation alle 12 Monate"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "getsops.io"
    url: "https://getsops.io/"
    accessed: "2026-05-20"
    publisher: "CNCF"
    confidence: high
  - title: "sops releases"
    url: "https://github.com/getsops/sops/releases"
    accessed: "2026-05-20"
    publisher: "GitHub"
    confidence: high
  - title: "FiloSottile/age"
    url: "https://github.com/FiloSottile/age"
    accessed: "2026-05-20"
    publisher: "GitHub"
    confidence: high
  - title: "Filo maintenance model"
    url: "https://github.com/FiloSottile/FiloSottile/blob/main/maintenance.md"
    accessed: "2026-05-20"
    publisher: "GitHub"
    confidence: medium
verification_notes: "sops 2015 Mozilla, 2023 CNCF-Sandbox; aktive Maintenance Mai 2026. age = Filippo Valsorda Solo, 'professional independent full-time maintainer' Modell â€” formal positiv, faktisch Bus-Factor 1. v1.1.0-rc.1 mit YubiKey-Plugin-Support."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Dual-Recipient**: jeder Secret verschlÃ¼sselt fÃ¼r `--age` UND `--pgp` (YubiKey-PGP-Key) â€” wenn age inkompatibel, GPG bleibt. (2) **Plain-Vault-Fallback**: HashiCorp Vault BSL/MPL-2.0 (BSL 1.1 seit 2023, Self-Host < $25M Revenue OK) als dokumentierte 5-PT-Migration. (3) **Secret-Inventar** in `docs/40-Compliance/secret-catalog.md`. (4) **age-Key-Rotation alle 12 Monate** (Hygiene + testet Tooling).

### PM-2026-05-20-17-F-11 â€” Hosting-Carbon-Footprint & Hetzner-Climate-Claims

```yaml
id: PM-2026-05-20-17-F-11
priority: P4
domain: sustainability
probability: 5
impact: 2
score: 10
confidence: medium
early_warning: []
mitigation_summary: "Hetzner DE 100% Hydropower (Eigenangabe); Marketing-Claim 'Hosted on 100% renewable energy' zulÃ¤ssig; NICHT 'Carbon-Neutral' sagen (Hetzner explizit nicht); Match-Sim auf FI-Region wenn Latenz erlaubt"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Hetzner Sustainability Docs"
    url: "https://docs.hetzner.com/general/company-and-policy/sustainability-at-hetzner/"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
  - title: "Hetzner Nachhaltigkeit"
    url: "https://www.hetzner.com/unternehmen/nachhaltigkeit"
    accessed: "2026-05-20"
    publisher: "Hetzner"
    confidence: high
  - title: "Green Software Foundation SCI"
    url: "https://greensoftware.foundation/standards/sci/"
    accessed: "2026-05-20"
    publisher: "Green Software Foundation"
    confidence: high
  - title: "Nowtricity Germany"
    url: "https://www.nowtricity.com/country/germany/"
    accessed: "2026-05-20"
    publisher: "Nowtricity"
    confidence: medium
verification_notes: "Hetzner DE 100 % Hydropower (Eigenangabe); PUE 1.13 best-in-class. HT Clean Energy GmbH 2024 fÃ¼r Solar-Parks. 2025-CSRD-pflichtig. FI-Nordischer Mix ~50â€“70 gCOâ‚‚eq/kWh vs DE-Grid 328 gCOâ‚‚eq/kWh. Football-PWA + Match-Sim CPU-light â†’ Footprint < 5 kg COâ‚‚eq/Monat MVP."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Marketing-Claim** â€žHosted on 100% renewable energy (Hetzner DE)" zulÃ¤ssig â€” referenz auf Hetzner-Dok. (2) **NICHT** â€žCarbon-Neutral" sagen â€” Hetzner explizit nicht klimaneutral. (3) **Match-Sim auf FI-Region** wenn Latenz erlaubt â€” niedrigster COâ‚‚eq/kWh. (4) **SCI-Score** per Functional Unit (per Match-Sim) berechnen mit https://github.com/Green-Software-Foundation/sci (ISO 21031:2024).

**Verifikation.** JÃ¤hrliche SCI-Berechnung in `docs/40-Compliance/sci-report-YYYY.md`. Hetzner-Sustainability-Report-Diff (2025-FY erwartet H2-2026).

### PM-2026-05-20-17-F-12 â€” CSRD/CSDDD-Scope und freiwilliges ESG-Statement

```yaml
id: PM-2026-05-20-17-F-12
priority: P4
domain: sustainability-governance
probability: 3
impact: 2
score: 6
confidence: medium
early_warning:
  - signal: "B2B-Tier-2-Anfragen (Stripe/Paddle/Hetzner CSRD-pflichtige Kunden fragen Supply-Chain-Daten)"
mitigation_summary: "Freiwilliges 1-Seiten-VSME-Statement /about/sustainability publishen; Hosting-Provider (Hetzner DE/FI), keine MA, keine physische Lieferkette, SaaS-Vendor-Liste; SCI-Score als KPI"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "CSRD Reporting (Coolset)"
    url: "https://www.coolset.com/academy/csrd-reporting"
    accessed: "2026-05-20"
    publisher: "Coolset"
    confidence: medium
  - title: "CSRD after 2026 EU Omnibus"
    url: "https://mybusinessfuture.com/en/csrd-after-2026-eu-omnibus-who-still-reports-and-what-esrs-relief-means-for-smes/"
    accessed: "2026-05-20"
    publisher: "MyBusinessFuture"
    confidence: medium
  - title: "SCI / CSRD Compliance (GSF)"
    url: "https://greensoftware.foundation/policy/research/sci-csrd-compliance/"
    accessed: "2026-05-20"
    publisher: "Green Software Foundation"
    confidence: high
verification_notes: "Nach EU-Omnibus-I-Reform 2026: CSRD-Scope > 1.000 MA AND > â‚¬450M Net-Turnover. Wir = Single-Founder + F2P < â‚¬1M â†’ out-of-scope. LkSG/CSDDD erst ab 1.000 MA. B2B-Tier-2-Anfragen via VSME-Standard abblockbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Freiwilliges 1-Seiten-VSME-Statement** unter `/about/sustainability` â€” preempt Tier-2-Anfragen. (2) Inhalt: Hosting-Provider (Hetzner DE/FI, 100 % renew electricity), keine Mitarbeiter, keine physische Lieferkette, SaaS-Vendor-Liste (Stripe/Paddle, Brevo, Cloudflare). (3) **SCI-Score** als KPI im Statement. (4) **VSME-Standard** als Template (EFRAG-published, freiwilliger SME-Standard).

**Verifikation.** JÃ¤hrlicher Update vor 31. MÃ¤rz.

## Vendor-Risk-Matrix (CORE OUTPUT)

| Vendor | Tier | Lock-In | Lifecycle-Risk | Backup-Plan | Migration-Cost | Priority |
|---|---|---|---|---|---|---|
| **Hetzner Cloud (DE/FI)** | infra | high | low | Fly.io (cold), Scaleway, AWS Lightsail | M (5â€“10 PT) | **high** |
| **Hetzner Robot (dedicated)** | infra | high | low | OVH, Latitude.sh | L (10â€“20 PT) | medium |
| **SurrealDB 3.x** | data | high | medium | Postgres+JSONB (primary), CockroachDB | L (15â€“25 PT) | **high** |
| **TanStack Start 1.x** | frontend | high | medium | Remix, Next.js 16 | L (30â€“40 PT) | medium |
| **Stripe** (post-MVP) | payment | medium | medium (gaming-risk) | Paddle, Lemon Squeezy | S (3â€“5 PT, mit Adapter) | medium |
| **Paddle** (post-MVP) | payment | high (MoR data-lock) | low | Stripe + own-MoR | M (1â€“4 Mo per Anekdoten) | medium |
| **GlitchTip** (self-host) | obs | low | medium | Sentry-Self-Hosted, Bugsink | S (2â€“3 PT) | low |
| **Cloudflare (CDN+DNS)** | edge | medium | low | bunny.net, CloudFront, INWX-DNS | M (5â€“8 PT) | medium |
| **Cloudflare Workers** (NICHT empfohlen MVP) | edge | high | low | Fly.io edge, AWS Lambda@Edge | M-L | avoid |
| **INWX (Registrar empfohlen)** | dns | low | low | Cloudflare-Registrar, Hetzner-DNS | S (1â€“2 PT) | medium |
| **Brevo (transactional email)** | comms | medium | low | Postmark, Mailgun-EU | S (1 PT) | medium |
| **sops (CNCF) + age** | secret | low | low | HashiCorp Vault, dual-recipient PGP | S (3â€“5 PT) | low |
| **Grafana LGTM** | obs | medium | low | OpenObserve, SigNoz | M (5â€“10 PT) | low |
| **Tolgee (i18n self-host)** | i18n | low | low (W2-R09) | Crowdin, Weblate | S (2â€“3 PT) | low |
| **DeepL Pro (MT)** | i18n | low | low | Google MT, Azure Translator | S (1 PT) | low |
| **GitHub Actions / GitHub** | ci | medium | low | Gitea + Forgejo Actions, Dokploy-Build | M | low |
| **Dokploy** | deploy | medium | medium | Coolify, raw Compose+systemd | S (3â€“5 PT) | low |
| **Anthropic / Claude Code** | dev tool | low | medium (W1-R11) | Cursor, Aider, Continue | S | medium |

**Legend**: Lock-In tight coupling. Lifecycle = will vendor change/disappear. Migration-Cost: S < 5 PT, M 5â€“15 PT, L > 15 PT.

## ESG-Stance-Statement (CORE OUTPUT)

**Public-facing 1-Absatz fÃ¼r `/about/sustainability`:**

> *Football Manager X is a single-developer, self-funded indie project hosted entirely within the European Union on Hetzner Online infrastructure in Germany and Finland. Hetzner sources 100% of its German electricity from hydropower and operates at an industry-leading PUE of 1.13 (source: Hetzner Sustainability Docs, 2026). We measure the Software Carbon Intensity (SCI) of one simulated match per 10k daily active users in line with ISO/IEC 21031:2024 and publish our annual estimate alongside our voluntary VSME-aligned sustainability note. We use no physical supply chain, employ no staff, and our carbon-relevant vendors (Hetzner, Cloudflare, Brevo, Paddle/Stripe) are all EU-headquartered or operate EU data residency. We do not make "carbon-neutral" claims because we do not offset; we focus on absolute reduction via efficient match simulation, server-side rendering with edge caching, and a minimal-JS client bundle.*

**Audit-Points (internal):**
1. SCI-Score per Match-Sim documented in `docs/40-Compliance/sci-report-YYYY.md`.
2. Hosting-Provider-Energy-Mix-Snapshot pro Quartal.
3. Total estimated kgCOâ‚‚eq/Monat for production stack â€” `docs/40-Compliance/carbon-budget.md`.
4. Vendor-List with EU-residency + License-Note.
5. Voluntary VSME-Statement aktualisiert vor 31. MÃ¤rz jeden Jahres.
6. Keine â€žcarbon-neutral"-Claims ohne Verifikation (EU Green Claims Directive in Kraft 2026).

## Quantitatives Modell

**Vendor-Cost-Estimate at 10k DAU (Steady-State, EUR/Mo):**

| Vendor | MVP Single-Node | 10k DAU Production |
|---|---|---|
| Hetzner Cloud (CX22 + Storage-Box) | â‚¬6 | â‚¬40â€“â‚¬80 (CX42 + LB + Volume + Backup) |
| Hetzner Object-Storage (S3) | â‚¬1 | â‚¬5â€“â‚¬10 |
| Cloudflare (CDN+DNS+WAF Pro) | â‚¬0 (Free) | â‚¬0â€“â‚¬20 |
| INWX Domain (.com .de) | â‚¬1 | â‚¬1 |
| Brevo (transactional ~30k mails) | â‚¬0 (Free 300/d) | â‚¬20â€“â‚¬40 (Lite) |
| Paddle (MoR fee auf ~â‚¬500 MRR) | n/a | ~â‚¬30 fees auf â‚¬500 |
| GlitchTip self-host (in Hetzner-Node) | â‚¬0 | â‚¬0 |
| Grafana LGTM self-host | â‚¬0 | â‚¬0 |
| GitHub Actions (Free 2000 min) | â‚¬0 | â‚¬0â€“â‚¬10 |
| **Total infra-only** | **~â‚¬8/Mo** | **~â‚¬100â€“â‚¬160/Mo + Paddle ~5 % Umsatz** |

**Migration-Effort (PT):**

| Migration | PT |
|---|---|
| Hetzner â†’ Fly.io (App) | 5â€“8 |
| Hetzner â†’ AWS (lift+shift) | 15â€“25 |
| SurrealDB â†’ Postgres+JSONB | 15â€“25 |
| SurrealDB â†’ CockroachDB (verliert graph queries) | 20â€“30 |
| TanStack Start â†’ Remix | 25â€“35 |
| TanStack Start â†’ Next.js 16 | 30â€“40 |
| Stripe â†’ Paddle (oder umgekehrt) | 8â€“12 (mit Adapter); 4 Monate (ohne) |
| GlitchTip â†’ Sentry-Self-Host | 2â€“3 |
| Cloudflare CDN â†’ bunny.net | 3â€“5 |
| Grafana LGTM â†’ OpenObserve | 5â€“10 |

**Carbon-Footprint (geschÃ¤tzt, kgCOâ‚‚eq/Monat):**

| Scenario | Calc | kgCOâ‚‚eq |
|---|---|---|
| MVP single CX22 (Hetzner DE 100 % hydro) | ~20 W Ã— 730 h Ã— 10 gCOâ‚‚eq/kWh | **~0.15 kg** |
| 10k DAU prod stack (3Ã— CX42 + LB + DB) | ~250 W Ã— 730 h Ã— 10 gCOâ‚‚eq/kWh | **~1.8 kg** |
| Hypothesis DE-Grid-Mix (328 gCOâ‚‚eq/kWh) | Ã— 32.8 | ~60 kg |
| Client 10k DAU Ã— 5 min/d Ã— 2 W mobile | 10k Ã— 5/60 Ã— 2 Ã— 30 Ã— 250 g | ~25 kg |
| **Total server+client (10k DAU/Mo)** | | **~27 kg COâ‚‚eq** |

Vergleich: ~27 kg/Mo = ~100 km Auto (Benzin) pro Monat fÃ¼r 10k aktive Spieler. **Server-Side < 2 kg** â†’ â€žGreen Indie"-Claim defensiv haltbar.

## SLO-VorschlÃ¤ge

| SLO | Ziel | Owner |
|---|---|---|
| Annual Vendor-Review | 100 % tier-1+2 vendors reviewed each year | Founder |
| Secret-Rotation | every 12 months | Founder |
| Backup-Restore-Drill | quarterly, RTO < 30 min, RPO < 24 h | Founder |
| Hetzner-Failover-Drill | annually | Founder |
| License-Compliance-CI-Gate | 100 % builds pass license-checker allowlist | Founder |
| SBOM-Generation | every release tag | CI |
| **Vulnerability-Triage (CRA ab 11.09.2026)** | CVSS â‰¥ 9.0 in 24 h, â‰¥ 7.0 in 72 h | Founder |
| Domain-Auto-Renew | T-60/30/7 reminders, prepaid â‰¥ 2 years | Founder |
| SCI-Report | annual, vor 31.03 | Founder |
| VSME-Sustainability-Statement | annual, public | Founder |
| Vendor-ToS-Diff | quarterly per tier-1 (Hetzner, Stripe/Paddle, CF, GitHub) | Founder |

## Test-Plan

**Vendor-Failover-Drills:**
1. **Hetzner-Suspension-Sim** (annually): Disable Hetzner via Firewall; restore on Fly.io aus latest backup; RTO < 4 h.
2. **SurrealDB-Restore-Drill** (quarterly): `surreal export` â†’ fresh CX22 â†’ `surreal import` â†’ hash-roundtrip.
3. **Stripeâ†’Paddle-Cutover-Drill** (annually, sandbox): Subscription-States, Webhook-Adapter, E2E smoke.
4. **DNS-Failover-Drill** (semiannual): authoritative DNS CF â†’ INWX-DNS, Propagation messen.
5. **GlitchTipâ†’Sentry-DSN-Swap** (annual): DSN-env-flag, smoke-test.

**License-Audit:**
- CI: `license-checker --failOn 'AGPL-3.0;SSPL-1.0;Commons Clause;BUSL-1.1;Elastic-2.0;BSL-1.1'` per PR.
- Quarterly manual: `package-lock.json` + Cargo + Go-mod fÃ¼r neue transitive AGPL/SSPL. Exceptions in `docs/40-Compliance/license-exceptions.md`.

**SBOM-CI-Gate:**
- Every tag: `cdxgen -t js -o sbom.cdx.json` + Syft fÃ¼r Container + `cyclonedx-cli merge` â†’ `cosign attach sbom` â†’ Sigstore-Transparency-Log.
- Quarterly Audit: random Release-SBOM â†” `npm ls --all`. Drift > 5 % = bug.

**Carbon-Footprint:**
- Annual: websitecarbon.com Snapshot in `docs/40-Compliance/carbon-history.md`.
- Annual SCI per Match-Sim, ISO 21031:2024 dokumentiert.

## Runbook-Skizzen

### RB-17-A: Hetzner-Account-Suspension

1. **Detection**: monitoring alarm via Loki external-uptime-checker (UptimeRobot/Healthchecks.io, NICHT auf Hetzner).
2. **Confirm**: Hetzner Console-Login versuchen; Hetzner-Support +49 9831 5050 0; Suspension-Reason capture.
3. **Public Comms**: `status.<domain>.eu` (hosted bunny.net Static Edge, AUSSERHALB Hetzner). Twitter/Mastodon â€žInfrastructure issues, ETA <X>."
4. **Fly.io Cold-Standby aktivieren**:
   - `fly deploy --config fly.toml --image ghcr.io/.../app:latest`
   - DB-Restore aus latest off-Hetzner-Backup (Backblaze B2): `surreal import â€¦`
   - Secrets via sops decrypt + `fly secrets set $(sops -d secrets.env)`.
5. **DNS-Cutover**: Cloudflare-DNS â†’ A-Record â†’ Fly.io IP (TTL pre-lowered auf 60s).
6. **Verify**: smoke /healthz, /metrics, login, ein Match-Sim.
7. **Hetzner-Resolution**: Respond an Abuse-Team in stated deadline. Falls permanent: neuer Account (anderes Rechtssubjekt), Fly.io als neuer Primary.
8. Post-Incident-Postmortem in `docs/30-Operations/incidents/YYYY-MM-DD-hetzner.md`.

### RB-17-B: TanStack Start EOL / Project-Abandonment

**Trigger (any)**: No commit > 6 Mo; Linsley public hiatus; 3+ of 16 partners drop in 90 days.

1. Convene â€žframework review" (1-day spike).
2. Evaluate Remix v3 (Vite-basiert, Ã¤hnliches loader-model, same Vite plugins).
3. Branch `migrate/remix` â€” port `routes/_app.tsx` first as smoke.
4. Keep TanStack-Router (separate library, mehr sustainable) â€” manual-router-mode if needed.
5. Estimate full migration: 25â€“35 PT.
6. Communicate to stakeholders, feature freeze 4 Wochen.
7. Migrate, ship as v2.0, Postmortem.

### RB-17-C: Stripe-Account-Closure (â€žhigh-risk reason")

**Trigger**: Stripe Dashboard-Banner ODER E-Mail "Action required: account review".

**Steps (in 24 h):**
1. **Export ALL Stripe-Daten** via Sigma/API: customers, subscriptions, payment_intents, invoices. Encrypted Hetzner-Box (sops-age).
2. **Disable Stripe-Webhook-Endpoints** (sonst Sub-State-Diffs verlieren).
3. **Paddle Production aktivieren** (war Sandbox-tested).
4. **Comms an Active-Subscribers** (~100 wenn early): Brevo-Email â€žWe're moving payment processors; subscription paused; cancel anytime."
5. **Reset payment_method** fÃ¼r jeden User â€” sie mÃ¼ssen via Paddle re-subscribe.
6. **Refund** caught-in-the-middle Payments.
7. **Stripe-Appeal** filen (low success rate, aber erforderlich fÃ¼r frozen-reserve release).
8. **90 Tage spÃ¤ter**: Stripe-Reserve einsammeln, Account schlieÃŸen.
9. Postmortem + Vendor-Risk-Matrix-Update (Stripe â†’ 'closed').

## Future-scope decisions (classified future-scope)
1. **Datenresidenz Fly.io**: bei Failover landen Daten ggf. auÃŸerhalb EU (machine-region). DPA-Pre-Sign-Off mit Fly.io fÃ¼r Notfall-Aktivierung? â†’ Recht-Spike 1 PT.
2. **VSME-Standard endgÃ¼ltig**: EFRAG-VSME published? Status-Check Q4/2026.
3. **CRA-OSS-Exempt fÃ¼r F2P mit Mikrotransaktionen**: ist kostenloses F2P "commercial activity" iSv CRA wenn IAP aktiv? â†’ Rechts-Spike 1 PT + ENISA-Q&A.
4. **Hetzner-CSRD-Bericht 2025-FY**: H2/2026 erwartet â€” Auswertung danach.
5. **SurrealDB vs Postgres-Fallback PoC**: vor oder nach Beta-Launch?
6. **Cloudflare-Workers**: akzeptabel als Lock-in oder harte Linie?

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Decouple via Adapter-Layers (S, ~5 PT).** Subscription-Repo + DB-Repo + Error-Sink hinter Interfaces â€” Stripeâ†”Paddle, SurrealDBâ†”Postgres, GlitchTipâ†”Sentry werden zu DSN/env-Swaps. **Highest ROI**: hebelt 4 Vendor-Risiken auf einmal.
2. **CI-Gate fÃ¼r SBOM + License (M, ~3 PT).** `cdxgen` + `cosign attach sbom` + `license-checker --failOn AGPL-3.0;SSPL-1.0` als required CI-check **vor 11.09.2026** (CRA-Vuln-Reporting-Pflicht). Nicht optional.
3. **Domain + DNS-Resilience (S, ~1 PT + â‚¬50/Jahr).** Registrar = INWX (DSGVO + Registry-Lock + YubiKey-2FA), DNS = Cloudflare (Anycast + DNSSEC), TTLs 60 s, 5-Jahres-Pre-Pay. Eliminiert eine ganze Threat-Class.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-17-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]]
- [[PM-2026-05-20-02-tech-and-ops]] Â· [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-08-legal-consumer-law-and-tax]] (CRA-SBOM) Â· [[PM-2026-05-20-11-ai-llm-dependency-and-fallbacks]] (Anthropic-Bus-Faktor)
- [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[../../30-Implementation/secrets-management]]
