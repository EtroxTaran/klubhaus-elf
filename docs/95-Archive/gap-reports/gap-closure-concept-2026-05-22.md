---
title: "Gap Closure Concept 2026-05-22"
status: current
tags: [research, pre-mortem, gap-closure, concept, 2026-Q2]
created: 2026-05-22
updated: 2026-05-22
type: concept
binding: false
report_set: 2026-05-20
addresses: [PM-2026-05-20]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[execution-index]]
  - [[prioritization-matrix]]
  - [[threat-model]]
  - [[../../00-Index/Vision]]
  - [[../../00-Index/Project-Goals]]
  - [[../../00-Index/Current-State]]
  - [[../../00-Index/Research-Map]]
---

# Gap Closure Concept 2026-05-22

Dieses Dokument schließt die **Research- und Konzeptlücke** für alle offenen
Findings aus dem Pre-Mortem-Cluster 2026-05-20. Es ist kein Ersatz für
Implementierung, Rechtsprüfung, Pen-Test, Restore-Drill oder CI-Nachweis.
Status-Semantik ab 2026-05-22:

- `mitigated`: Es gibt eine dokumentierte, projektkompatible Lösungslinie mit
  klaren Folge-Artefakten.
- `verified`: bleibt fuer objektive Evidenz reserviert.
- `accepted-risk`: Future-Scope bleibt bewusst nicht gebaut, aber ist mit Gate
  und Exit-Kriterien beschrieben.

## Executive Decision

Wir schließen die Gaps nicht durch 191 isolierte Einzelmaßnahmen, sondern durch
15 Solution Tracks. Jeder Track hat eine klare DDD-/Vault-Heimat, eine
Best-Practice-Basis, ein Differenzierungsziel und eine Verifikationsform. Das
passt zur Vision: **IP-clean, mobile-first, offline-ready, deterministisch,
trust-aware, zugänglich, nicht exploitativ monetarisiert**.

Die wichtigste Produktdifferenzierung gegenüber Football Manager, Top Eleven,
OSM und Soccer Manager ist nicht "mehr Daten". Die Lücke im Markt ist:

1. **Anstoss-Charme + modernes Systemdesign**: inbox-driven, Zeitung/Narrative,
   aber deterministisch und testbar.
2. **Trust-Level statt Offline/Online-Bruch**: Singleplayer bleibt frei, aber
   Saves, Commands und Replays sind von Anfang an MP-/Cloud-verifizierbar.
3. **Mobile Performance als Produktfeature**: kein 3D-Match, keine schwere
   Lizenzdatenbank, 2D/Text-first, klare Budgets.
4. **Accessibility-by-default**: Tactic Board ohne Dragging-Zwang, grid-
   Semantik, reduzierte Bewegung, redundante Statuscodierung.
5. **Fair monetization**: keine Lootboxes, keine Daily-Streaks, keine Pay-to-win
   Stat-Boosts; bezahlbar sind kosmetische/komfortorientierte, trust-aware
   Entitlements.
6. **IP-clean generated football universe**: keine reale Club-/Spieler-
   Abhängigkeit, dadurch weniger Lizenzkosten, mehr Mod-/Scenario-Flexibilität.

## Source Baseline

Aktuelle externe Research-Basis, Stand 2026-05-22:

- EU CRA: ab **2026-09-11** müssen aktiv ausgenutzte Schwachstellen und schwere
  Sicherheitsvorfälle über die ENISA Single Reporting Platform gemeldet werden;
  Early Warning 24 h, vollständige Meldung 72 h. Quellen:
  [EU Commission CRA reporting](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting),
  [ENISA SRP](https://www.enisa.europa.eu/topics/product-security-and-certification/single-reporting-platform-srp).
- WCAG 2.2 ist W3C Recommendation seit 2023-10-05; relevant sind insbesondere
  2.5.7 Dragging Movements, 2.5.8 Target Size, 3.3.8 Accessible Authentication.
  Quelle: [W3C WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).
- WebKit ITP kann script-writable storage inklusive IndexedDB, Service Worker
  und Cache nach 7 Tagen ohne Nutzerinteraktion löschen. Quelle:
  [WebKit Tracking Prevention](https://webkit.org/tracking-prevention/).
- Web Storage bleibt "best effort", wenn Persistent Storage nicht erfolgreich
  beantragt wurde; QuotaExceededError muss explizit behandelt werden. Quelle:
  [web.dev Storage for the web](https://web.dev/storage-for-the-web/).
- Core Web Vitals bleiben LCP, INP, CLS; unsere Produktziele sind bewusst
  strenger als Google-"good". Quelle:
  [web.dev Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds).
- NIST SP 800-63 Revision 4 ist seit Juli 2025 final und integriert syncable
  authenticators/passkeys in den aktuellen Identity-Stand. Quelle:
  [NIST SP 800-63-4](https://pages.nist.gov/800-63-4/).
- OWASP API Security Top 10 2023 setzt Broken Object Level Authorization,
  Broken Authentication und Broken Object Property Level Authorization als
  Kernrisiken fuer API- und Command-Pfade. Quelle:
  [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/).
- Supply Chain: CycloneDX deckt Software, Hardware, ML, Source und
  Configuration BOMs ab; Sigstore/cosign erlaubt keyless OIDC-signing mit
  Fulcio/Rekor; OWASP SCVS liefert ein inkrementelles Kontrollmodell. Quellen:
  [CycloneDX spec overview](https://cyclonedx.org/specification/overview),
  [Sigstore keyless signing](https://docs.sigstore.dev/cosign/signing/overview/),
  [OWASP SCVS](https://scvs.owasp.org/).
- DSA: Article 16 Notice-and-Action und Article 25 Dark-Pattern-Verbot sind
  relevant, sobald UGC/Community-Flows online gehostet werden. Quelle:
  [EU Digital Services Act](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act).
- EAA/BFSG: e-commerce und digitale Consumer-Services muessen seit 2025-06-28
  barrierefrei angeboten werden. Quellen:
  [European Accessibility Act](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en),
  [BFSG overview](https://www.fgvw.de/en/news/digital-law-the-new-german-accessibility-reinforcement-act-how-will-this-affect-website-operators/).
- EU AI Act: Article 4 AI Literacy gilt seit 2025-02-02; Article 50
  Transparenzpflichten fuer bestimmte AI-Systeme werden ab 2026-08-02 relevant.
  Quellen: [AI literacy Q&A](https://digital-strategy.ec.europa.eu/en/faqs/ai-literacy-questions-answers),
  [AI Act Article 50 Service Desk](https://ai-act-service-desk.ec.europa.eu/de/ai-act/article-50).
- Konkurrenzlage 2026: Football Manager 26 ist nach Engine-/UI-Umbruch live,
  aber die Marktreaktion zeigt Risiko bei schwerer Desktop-Komplexitaet; Top
  Eleven setzt weiter auf mobile Live-Service-Progression; Soccer Manager 2026
  differenziert ueber grosse Lizenzabdeckung. Quellen:
  [FM26 Steam](https://store.steampowered.com/app/3551340/Football_Manager_26/),
  [Top Eleven 2026 update](https://www.pocketgamer.com/top-eleven/2026-update/),
  [Soccer Manager 2026 launch](https://gamingonphone.com/news/soccer-manager-2026-kicks-off-football-management-fun-with-official-launch-on-android-and-ios/).

## Solution Tracks

### T01 Data & Persistence Resilience

**Closes concept gap for:** 01-F-02, 01-F-06, 01-F-10, 02-F-04, 12-F-03,
15-F-01, 15-F-02, 15-F-03, 15-F-04, 15-F-06, 15-F-07, 17-F-02.

**Decision.** PostgreSQL + Drizzle bleibt system of record gemaess
ADR-0027/0028; SurrealDB ist nur noch optionaler additiver Realtime/Graph-
Adapter. Browserdaten sind Cache/Draft/UI-state, nicht alleinige Wahrheit fuer
wertvolle Saves. IndexedDB erhaelt Quota-Probe, LRU, Export-Hinweis und
Cloud-Verify-Pfad.

**Best practice.** O(1)-Deploys ueber lazy per-save migration, restore drills,
RTO/RPO-Metriken, schema-per-save Isolation, forward-only migrations,
Persistence-API best effort mit QuotaExceeded-Behandlung.

**Differenzierung.** Anders als klassische Manager mit schwerem Desktop-Save
und mobile F2P-Manager mit reiner Cloud-Persistence: Spieler bekommen lokale
Geschwindigkeit und Exportierbarkeit, aber klare Vertrauenstufen fuer Wettbewerb.

**Required artefacts.** `postgres-drizzle-integration` erweitern,
`storage-strategy-gzip-quota`, Restore-Runbook, Save-Replay-CLI,
storage telemetry.

**Verification.** Monatlicher Restore-Drill, browser storage eviction test,
quota fuzzing, migration compatibility matrix.

### T02 Deterministic Simulation & Replay

**Closes concept gap for:** 02-F-02, 03-F-01, 03-F-02, 05-F-03, 11-F-02,
12-F-08, 16-F-04, 16-F-05, 16-F-06.

**Decision.** Determinism is a release gate. Engine inputs include
`engineVersion`, `engineBundleHash`, RNG stream state, lineups, tactics,
weather/referee and versioned balance constants. Runtime LLMs are forbidden in
authoritative game-state paths.

**Best practice.** Golden replay corpus, property-based tests, statistical
envelope tests, mutation tests for determinism, semgrep bans for `Math.random`,
`Date.now`, non-stable iteration.

**Differenzierung.** We can explain and reproduce seasons. That enables credible
bug reports, cloud verification, old replay playback and future BYOC without a
trust rewrite.

**Required artefacts.** ADR for LLM boundary, determinism CI spec, 50-year soak
suite, balance constants versioning.

**Verification.** 1000 fixed seeds bit-equal in CI; nightly 50-year soak;
cross-browser deterministic parity before public beta.

### T03 Command Integrity, Save Trust & Anti-Cheat

**Closes concept gap for:** 05-F-01, 05-F-02, 05-F-04, 05-F-06, 05-F-08,
05-F-11, 05-F-12, 15-F-09.

**Decision.** Every mutating command is signed and replay-protected. Every save
has a `trust_level` (`local-only`, `cloud-verified`, `imported-unverified`,
`imported-verified`, `unverified-by-engine-migration`). Hall of Fame, public
achievements and async MP require server-verifiable state.

**Best practice.** Ed25519 command signatures, UUIDv7 command IDs,
server-signed receipts, nonce/replay window, AEAD AAD-bound envelopes,
strict Zod validation and size limits on imports.

**Differenzierung.** Singleplayer remains permissive, but competitive trust is
mathematically bounded. That avoids the usual "offline save vs leaderboard"
trap.

**Required artefacts.** ADR command signing, ADR save trust levels,
command-bus signing spec, tampering test suite.

**Verification.** Forged command, replayed nonce, device-key substitution,
HMAC removal and engine hash mismatch all reject or downgrade trust.

### T04 Security, Auth & Supply Chain

**Closes concept gap for:** 02-F-06, 02-F-07, 02-F-08, 05-F-05, 05-F-07,
05-F-09, 05-F-10, 17-F-07, 18-F-08, 18-F-09.

**Decision.** Security baseline is passkey-first auth with password fallback,
opaque sessions, Redis-backed throttling, webhook signature verification,
PII allow-list redaction, SBOM + cosign release evidence, secret scanning and
CRA-ready vulnerability reporting.

**Best practice.** NIST 800-63B-4 for authenticators, OWASP API Top 10 for
object/function authorization, CycloneDX SBOM, Sigstore keyless signing,
OpenSSF Scorecard, gitleaks/trufflehog/secret-scanning.

**Differenzierung.** Trust is visible to players via "verified" outcomes, not
just internal security posture.

**Required artefacts.** ADR SBOM/license gate, security workflow, webhook
receiver spec, CRA runbook, DSAR-vs-audit runbook.

**Verification.** OpenSSF Scorecard target, signed release image, SBOM diff,
synthetic PII marker absent from logs, webhook replay rejected.

### T05 Observability, Live-Ops & Incident Response

**Closes concept gap for:** 01-F-03, 01-F-09, 02-F-03, 02-F-05, 02-F-10,
07-F-01, 07-F-02, 07-F-03, 07-F-04, 07-F-05, 07-F-06, 07-F-07, 07-F-08,
07-F-09, 07-F-10, 16-F-10, 17-F-01, 17-F-09.

**Decision.** Operational readiness is a product feature. MVP needs RUM for
CWV, save-stuck reproduction, severity taxonomy, status page, dashboard-as-code,
restore drill, incident playbooks and founder service-hours boundaries.

**Best practice.** SLOs per critical flow, structured logs with bounded
cardinality, synthetic canaries, weekly operational review, external status
page, clear user comms.

**Differenzierung.** Indie trust through transparency: "we cannot promise
24/7 enterprise support, but we publish service hours, incident classes and
recovery behavior."

**Required artefacts.** Incident-response doc, observability runbook,
statuspage setup, save-stuck CLI, founder service-hours doc.

**Verification.** Tabletop drills, status-page synthetic incident, RTO/RPO
metrics, outbox lag alert.

### T06 Accessibility & Inclusive UX

**Closes concept gap for:** 03-F-09, 10-F-01, 10-F-02, 10-F-03, 10-F-04,
10-F-05, 10-F-06, 10-F-07, 10-F-08, 10-F-09, 10-F-10, 10-F-11.

**Decision.** WCAG 2.2 AA is a design-system gate, not a late audit. Dragging
is never the only way to operate a tactic board. Data grids use correct grid
semantics, status is not color-only, live match ticker is ARIA-aware and
reduced motion is honored.

**Best practice.** W3C WCAG 2.2 success criteria, EN 301 549 / EAA/BFSG
alignment, axe-core CI plus manual keyboard/screen-reader passes.

**Differenzierung.** The game becomes more readable and faster for all users,
especially mobile users, not only "compliant".

**Required artefacts.** Design-system accessibility chapter, tactic-board
keyboard spec, grid component story, axe Playwright gate.

**Verification.** Keyboard-only tactic setup, touch target checks, axe CI,
screen-reader smoke pass for match flow.

### T07 Product Analytics, Monetization & Retention

**Closes concept gap for:** 04-F-01, 04-F-02, 04-F-03, 04-F-04, 04-F-05,
04-F-07, 04-F-08, 04-F-09, 04-F-10, 17-F-04.

**Decision.** Monetization must be approved before soft launch. Preferred
direction: fair F2P or low-price premium hybrid with cosmetics/comfort only,
no lootboxes, no paid competitive stat advantage, no daily login streak
pressure. Product analytics is consent-gated and self-hosted where feasible.

**Best practice.** Funnel taxonomy, feature flags, closed beta, MoR payment
evaluation, refunds/support path, budget caps.

**Differenzierung.** We compete on trust and depth, not monetization pressure.
That directly separates us from many mobile live-service manager loops.

**Required artefacts.** Monetization GDDR, pricing/payment ADR, PostHog setup,
GrowthBook setup, support workflow, soft-launch strategy.

**Verification.** Approved GDDR, first purchase smoke test, funnel dashboard,
refund SLA and support response SLA.

### T08 Gameplay Balance, Long Careers & Narrative Freshness

**Closes concept gap for:** 03-F-03, 03-F-04, 03-F-05, 03-F-06, 03-F-08,
12-F-01, 12-F-02, 12-F-04, 12-F-05, 12-F-06, 12-F-07, 12-F-09, 12-F-10,
18-F-01, 18-F-05, 18-F-12.

**Decision.** Long-run balance is simulated and audited. Wage/prize inflation,
tactical convergence, player outliers, narrative repetition and insolvency
spirals get explicit metrics and 50-year soak tests. Responsible-gaming copy
is integrated into run-risk and time-spent surfaces.

**Best practice.** Economy invariants, archetype diversity budgets, content
frequency caps, endgame milestones, player-protection nudges without dark
patterns.

**Differenzierung.** Long saves stay legible and characterful. This is the
Anstoss heritage upgraded with measurable systems.

**Required artefacts.** Balance GDDR, insolvency UX spec, narrative burn-rate
spec, achievements/endgame spec, responsible-gaming statement.

**Verification.** 50-year soak assertions, tactical diversity metrics,
narrative duplicate caps, user test on insolvency comprehension.

### T09 i18n, Localization & Generated Identity

**Closes concept gap for:** 09-F-01, 09-F-02, 09-F-03, 09-F-04, 09-F-05,
09-F-06, 09-F-07, 09-F-08, 09-F-09, 09-F-10.

**Decision.** German remains primary, but strings, names, validation and caches
are locale-safe from day one. Use ICU/messageformat-capable tooling, Unicode
property validation, pseudo-localization and logical CSS properties.

**Best practice.** Namespace per route/domain, pseudo-loc CI, locale fallback
hierarchy, TMS export discipline, font subsetting.

**Differenzierung.** Fictional football universe can feel local without real IP
or real club names.

**Required artefacts.** i18n ADR depth pass, tone guide, locale-cache strategy,
translator style guide.

**Verification.** Pseudo-loc snapshot, Unicode-name test corpus, RTL smoke,
service-worker locale cache test.

### T10 Legal, Compliance, UGC & Moderation

**Closes concept gap for:** 08-F-01, 08-F-02, 08-F-03, 08-F-04, 08-F-05,
08-F-06, 08-F-07, 08-F-08, 08-F-09, 08-F-10, 08-F-11, 08-F-12, 08-F-13,
13-F-01, 13-F-02, 13-F-03, 13-F-05, 13-F-06, 13-F-07, 13-F-08, 13-F-09,
13-F-10, 13-F-11, 18-F-03, 18-F-04, 18-F-06.

**Decision.** No public UGC surface without DSA Notice-and-Action, repeat
offender policy, legal pages, trademark/logo blocklist and moderation workflow.
MVP omits image upload and free-form chat.

**Best practice.** DSA Article 16 form + ACK/decision SLA, Article 25
dark-pattern review, BFSG/EAA accessibility, no lootboxes, age gate 16+,
tax/legal retention mapped to privacy erasure.

**Differenzierung.** IP-clean and moderation-light by product design, not by
post-hoc takedown.

**Required artefacts.** FTO memo, Impressum, AGB/Widerruf, DSA notice spec,
blocklist pipeline, strike system, legal runbooks.

**Verification.** Legal review, synthetic notice drill, blocklist recall test,
no real-club/logo corpus test.

### T11 Brand, Rebrand & Crisis Communication

**Closes concept gap for:** 14-F-01, 14-F-02, 14-F-03, 14-F-04, 14-F-05,
14-F-06, 14-F-07, 14-F-08, 14-F-09.

**Decision.** `football-manager-x` is a working title only. Before public
visibility, pick an IP-clean brand candidate and get legal search. Brand voice:
founder-led, transparent, German-first, no fake studio scale.

**Best practice.** FTO memo before marketing, crisis templates, mention
monitoring, press kit, one-page voice guide.

**Differenzierung.** We do not fight FM on its name. We claim a different
position: German manager charm, fictional clubs, modern trust architecture.

**Required artefacts.** Rebrand decision, crisis playbook, press kit, voice
guide, mention monitoring setup.

**Verification.** DPMA/EUIPO search, crisis tabletop, external press-kit test.

### T12 AI/LLM Boundaries & Tooling Bus Factor

**Closes concept gap for:** 11-F-01, 11-F-03, 11-F-04, 11-F-05, 11-F-06,
11-F-07, 11-F-08, 11-F-09, 11-F-10, 11-F-11, 11-F-12, 17-F-03.

**Decision.** No runtime LLM in MVP. If post-MVP AI is added, it is outside
authoritative simulation, behind an adapter, cost-capped, EU-routed where
needed, labelled where Article 50 applies and never trusted as fact.

**Best practice.** Provider abstraction, prompt/output logging with PII
controls, fallback chain, AI literacy evidence, no direct SDK imports outside
adapter.

**Differenzierung.** AI assists authoring/support, but does not compromise
determinism or player trust.

**Required artefacts.** LLM provider ADR, LLM boundary ADR, PII routing ADR,
AI Act Art. 50 note, dev-tooling bus-factor plan.

**Verification.** CI egress guard for match engine, outage drill, cost canary,
"day without primary AI tool" drill.

### T13 Testing Strategy & Quality Gates

**Closes concept gap for:** 02-F-01, 02-F-09, 16-F-01, 16-F-02, 16-F-03,
16-F-07, 16-F-08, 16-F-09.

**Decision.** TDD is mandatory; the test stack must cover unit, property,
integration, browser-mode, E2E, visual, mutation, chaos and long-run soak at
different cadences.

**Best practice.** Fast PR gates, heavier nightly gates, deterministic fixtures,
mutation on engine core, visual regression for design-system screens, chaos on
storage/network.

**Differenzierung.** Agents can move fast because the repo proves behavior
instead of relying on manual QA.

**Required artefacts.** ADR test pyramid/CI hybrid, Vitest browser baseline,
property-test templates, Argos/visual decision, Toxiproxy chaos plan.

**Verification.** CI green with ratchets, seeded property tests, mutation
threshold, visual baseline review.

### T14 Vendor, DNS, Sustainability & Open Source Strategy

**Closes concept gap for:** 17-F-05, 17-F-06, 17-F-08, 17-F-10, 17-F-11,
17-F-12, 18-F-02, 18-F-07, 18-F-10, 18-F-11.

**Decision.** Keep operational independence: Hetzner primary, documented cold
standby, no Cloudflare Workers lock, adapter layers for payment/error/AI, OSS
license decision before public repo split, sustainability claims only with
evidence.

**Best practice.** Vendor exit criteria, dual-account recovery, DNS registrar
resilience, DCO/CLA decision, VSME-light sustainability statement.

**Differenzierung.** Credible indie stewardship: open where it builds trust,
proprietary where it protects server-side moat and operations.

**Required artefacts.** License ADR, split-repo ADR, vendor adapter ADR,
domain/DNS ADR, carbon/sustainability note.

**Verification.** Backup-buddy drill, DNS failover test, license scan,
annual sustainability update.

### T15 BYOC / Distributed Match Compute Gate

**Closes concept gap for accepted-risk:** 06-F-01, 06-F-02, 06-F-03, 06-F-04,
06-F-05, 06-F-06, 06-F-07, 06-F-08, 06-F-09, 06-F-10.

**Decision.** BYOC stays out of MVP and remains `accepted-risk` until all gate
conditions pass: compute cost > 500 EUR/month, external threat-model review,
DPIA update, one quarter server-only baseline, deterministic validator parity,
privacy-safe tactic visibility, Sybil/collusion model and operational support.

**Best practice.** Treat distributed compute as an adversarial system, not a
cost-saving shortcut.

**Differenzierung.** We reserve future community compute without compromising
launch trust.

**Required artefacts.** Future ADR only after gate; no MVP code.

**Verification.** Gate review, not implementation.

## Complete Coverage By Report

- Report 01 Architecture: PM-2026-05-20-01-F-01..F-10 -> tracks T01, T03, T05.
- Report 02 Tech/Ops: PM-2026-05-20-02-F-01..F-10 -> tracks T02, T04, T05, T13.
- Report 03 Gameplay: PM-2026-05-20-03-F-01..F-10 -> tracks T02, T06, T08.
- Report 04 Monetization: PM-2026-05-20-04-F-01..F-10 -> tracks T07, T10.
- Report 05 Security: PM-2026-05-20-05-F-01..F-12 -> tracks T03, T04.
- Report 06 BYOC: PM-2026-05-20-06-F-01..F-10 -> track T15 (`accepted-risk`).
- Report 07 Live-Ops: PM-2026-05-20-07-F-01..F-10 -> track T05.
- Report 08 Legal/Tax: PM-2026-05-20-08-F-01..F-13 -> track T10.
- Report 09 i18n: PM-2026-05-20-09-F-01..F-10 -> track T09.
- Report 10 Accessibility: PM-2026-05-20-10-F-01..F-11 -> track T06.
- Report 11 AI/LLM: PM-2026-05-20-11-F-01..F-12 -> tracks T02, T12.
- Report 12 Balance/Meta: PM-2026-05-20-12-F-01..F-10 -> tracks T01, T02, T08.
- Report 13 Community/UGC: PM-2026-05-20-13-F-01..F-11 -> track T10.
- Report 14 Brand/PR: PM-2026-05-20-14-F-01..F-09 -> track T11.
- Report 15 Browser/Storage: PM-2026-05-20-15-F-01..F-09 -> tracks T01, T03.
- Report 16 Test Strategy: PM-2026-05-20-16-F-01..F-10 -> tracks T02, T13.
- Report 17 Vendor/Sustainability: PM-2026-05-20-17-F-01..F-12 -> tracks T04, T05, T07, T14.
- Report 18 Responsible Gaming/OSS: PM-2026-05-20-18-F-01..F-12 -> tracks T04, T08, T10, T14.

The registry contains 191 unique IDs; all are covered by the report ranges
above. BYOC remains explicitly accepted-risk, not hidden.

## Implementation Order

1. Foundation P0/P1: T01, T02, T03, T04, T05, T06, T10, T11.
2. Product validation: T07, T08, T09, T13.
3. Stewardship: T12, T14.
4. Future gate only: T15.

## Closure Rule

All findings linked to this document may be marked `mitigated` for
concept/research closure. A later implementation PR must still reference the
same IDs and move only the implemented subset to `verified` after tests, legal
sign-off, drills or production evidence.

## Related

- [[00-index]]
- [[findings-registry]]
- [[execution-index]]
- [[prioritization-matrix]]
- [[threat-model]]
- [[../../00-Index/Vision]]
- [[../../00-Index/Project-Goals]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
