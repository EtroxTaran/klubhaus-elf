---
title: "Pre-Mortem 2026-05-20 · 18 · Responsible-Gaming & Open-Source-Strategy"
status: current
tags: [research, pre-mortem, responsible-gaming, dark-patterns, oss, license, agpl, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-18
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
  - [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
  - [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]]
---

# Pre-Mortem 2026-05-20 · 18 · Responsible-Gaming, Dark-Patterns & Open-Source-Strategy

> **Failure-Headlines**
> - ”žIndie unter MIT — 8 Mo später dominieren 3 Hosted-Forks von Bootleg-Anbietern den DACH-Markt; Original 0 zahlende Kunden."
> - ”žCarry-Slot Roguelite generiert 47 BzKJ-Hotline-Beschwerden: Eltern berichten 12-jährige spielen nächtlich 4-Stunden-Insolvency-Runs."
> - ”žWelle-3-Audit Dark-Pattern-Drift: 'Letzte Chance' Banner + Auto-Opt-In + roter Exit/grüner Continue — DSA-Art-25-Beschwerde Verbraucherzentrale NRW."
> - ”žAGPL-3.0 gewählt zur Fork-Defense, aber Steam erfordert proprietären Lizenz-Stack — Steam-Launch +6 Mo License-Audit."
> - ”žSecret aus 2024: AWS-Access-Key in .env.example committed (vergessen rotiert), Repo public seit 2024 — Crypto-Miner findet Key Tag 3 — 4.700 € Cloud-Bill."

## Top Failure-Hypothesen

### PM-2026-05-20-18-F-01 — Roguelite Insolvency-Spiral ist loss-aversion, NICHT Dark-Pattern (mit Caveats)

```yaml
id: PM-2026-05-20-18-F-01
priority: P3
domain: responsible-gaming
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - signal: "Zeitdruck/falsche Knappheit auf Carry-Slot-Auswahl"
  - signal: "'Last Chance to Save Run'-Käufe (post-Monetization)"
mitigation_summary: "End-of-Run-Screen explizit was bleibt/verschwindet; keine Countdown-Timers auf Run-End-Choices; 'Are you sure?'-Confirm bei voluntary Insolvency; Dark-Pattern-Self-Audit-Checklist pre-merge"
linked_adrs: []
linked_specs: [[GD-0008-finance-economy]]
linked_code: []
sources:
  - title: "Dark patterns in games (arxiv 2412.05039)"
    url: "https://arxiv.org/html/2412.05039v1"
    accessed: "2026-05-20"
    publisher: "arxiv"
    confidence: high
  - title: "deceptive.design (Brignull)"
    url: "https://www.deceptive.design/"
    accessed: "2026-05-20"
    publisher: "Harry Brignull"
    confidence: high
  - title: "From Motivating to Manipulative (arxiv 2503.22901)"
    url: "https://arxiv.org/html/2503.22901v1"
    accessed: "2026-05-20"
    publisher: "arxiv"
    confidence: medium
verification_notes: "Dark-Patterns-Forschung trennt deceptive design (intent to manipulate against player interest) von difficulty/loss-aversion (player-known, opt-in, no hidden monetization). Roguelites Hades/Slay-the-Spire/Dead Cells nutzen identische loss-of-progress als Kern-Loop ohne als dark-pattern klassifiziert — weil (1) transparent, (2) keine Monetization-Kopplung, (3) meta-Progression sichtbar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: game-design
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Insolvency-Spiral ist genre-typisches loss-aversion-design (legit) — wird Dark-Pattern, sobald (a) Carry-Slot-Auswahl unter Zeitdruck/Knappheit, (b) ”žLast Chance to Save Run"-Käufe, oder (c) versteckte/unklare ”žWas geht verloren?"-Kommunikation eingebaut.

**Mitigation.** (1) **End-of-Run-Screen** mit expliziter Liste: *Was bleibt (Carry-Slot, Hall-of-Fame, XP), was verschwindet (Squad, Liga, Vertrag)*. (2) Keine Zeitdruck-Choices auf Run-Ende-Screen (kein Countdown). (3) ”žAre you sure?"-Confirm bei voluntary Insolvency-Trigger. (4) Dark-Pattern-Self-Audit-Checklist (15 Items) pre-merge.

**Verifikation.** Audit-Checkliste manueller Review pro neuer UI; halbjährliche externe Peer-Review.

### PM-2026-05-20-18-F-02 — License-Decision blockt alle anderen OSS-Decisions

```yaml
id: PM-2026-05-20-18-F-02
priority: P1
domain: open-source
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - signal: "Repo public + no LICENSE = legal grey zone"
  - metric: "GitHub-Sponsors eligibility check"
    threshold: "blocked ohne OSI-Lizenz"
mitigation_summary: "Founder-Decision bis Welle-3: AGPL-3.0 für Client + proprietär closed Server (Mastodon-Pattern). LICENSE-Datei + SPDX-Identifier in jeder Source-Datei + REUSE-Tool-Check"
linked_adrs: []
linked_specs: [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
linked_code: ["LICENSE", "src/**/*.{ts,tsx}"]
sources:
  - title: "choosealicense.com / no-permission"
    url: "https://choosealicense.com/no-permission/"
    accessed: "2026-05-20"
    publisher: "GitHub"
    confidence: high
  - title: "Choose-a-License"
    url: "https://choosealicense.com/licenses/"
    accessed: "2026-05-20"
    publisher: "GitHub"
    confidence: high
verification_notes: "Aktuell `EtroxTaran/football-manager-x` ohne LICENSE = default 'All Rights Reserved' (Berner Konvention). Public lesbar, rechtlich nicht nutzbar. Worst of both worlds: discoverable but not contributable, untrusted."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Founder-Decision binnen Welle-3 für eine der 7 Optionen (siehe Decision-Matrix). Default-Empfehlung: **AGPL-3.0** für Client + proprietär closed-source Backend (Split-Repo, Mastodon-Pattern).

**Verifikation.** LICENSE-Datei in Repo-Root, SPDX-Identifier in jeder Source-Datei (`SPDX-License-Identifier: AGPL-3.0-or-later`), CI-Check via REUSE-Tool.

### PM-2026-05-20-18-F-03 — AT-OGH 12/2025 (6 Ob 228/24h) reduziert Lootbox-Pressure in DACH

```yaml
id: PM-2026-05-20-18-F-03
priority: P3
domain: responsible-gaming
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - signal: "EU Digital Fairness Act Q4 2026 Proposal-Status"
  - signal: "DE GlüStV-Reform-Entwurf (WestLotto 2024)"
mitigation_summary: "MVP-Decision 'no lootboxes' beibehalten (Welle-1-Report-08-F-10). Post-MVP zwei sichere Pfade: (a) cosmetic-only Battle-Pass NO-trade-NO-RNG-paid, (b) deterministic-currency-shop. Lootbox-Reopening frühestens bei Welle-4 Re-Audit"
linked_adrs: []
linked_specs: [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
linked_code: []
sources:
  - title: "AT-OGH 6 Ob 228/24h FIFA-Lootboxes (DLA Piper)"
    url: "https://www.dlapiper.com/en/insights/publications/2026/01/supreme-court-shifts-the-playing-field-lootboxes-fall-outside-the-austrian-gambling-act"
    accessed: "2026-05-20"
    publisher: "DLA Piper"
    confidence: high
  - title: "AT Supreme Court loot box ruling"
    url: "https://esportslegal.news/2026/01/28/austrian-supreme-court-loot-boxes/"
    accessed: "2026-05-20"
    publisher: "Esports Legal News"
    confidence: high
  - title: "Belgium loot-box-ban breakdown (Xiao 2023)"
    url: "https://online.ucpress.edu/collabra/article/9/1/57641/195100/Breaking-Ban-Belgium-s-Ineffective-Gambling-Law"
    accessed: "2026-05-20"
    publisher: "UC Press"
    confidence: high
  - title: "Belgium not enforcing loot box ban"
    url: "https://mcvuk.com/business-news/belgium-isnt-enforcing-loot-box-ban-claims-research-study/"
    accessed: "2026-05-20"
    publisher: "MCV/Develop"
    confidence: medium
verification_notes: "AT-OGH 18.12.2025: FIFA-Lootboxes NOT gambling, 'kann nicht isoliert betrachtet werden vom Spiel-Kontext'. Aligned mit NL Raad van State 2022. BE Gaming Commission 12/2024: 'generalized ban proved difficult to enforce'; 82 % der Top-100-iPhone-Games BE verkaufen Lootboxen. UK: government NICHT Gambling Act extended; Reform-Evaluation 2026. DE: GlüStV 2021 unverändert."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: legal+product
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** MVP-Empfehlung bleibt: keine Lootboxen. Post-MVP zwei sichere Pfade — (a) Cosmetic-Only Battle-Pass mit NO-trade-NO-RNG-paid, (b) Deterministic-Currency-Shop. Lootbox-Reopening frühestens Welle-4 Re-Audit.

**Verifikation.** Quartärlicher Monitor auf gluecksspielrecht.de + Pinsent-Masons-Newsletter; Trigger bei DSA-Annex-Update oder DE-GlüStV-Reform.

### PM-2026-05-20-18-F-04 — EU DSA Art. 25 + Digital Fairness Act 2026 = regulatorische Achse

```yaml
id: PM-2026-05-20-18-F-04
priority: P1
domain: responsible-gaming
probability: 5
impact: 4
score: 20
confidence: high
early_warning:
  - metric: "DSA Art. 25 enforcement"
    threshold: "EuComm-Fines on platforms"
  - signal: "Digital Fairness Act Q4 2026 Proposal-Veröffentlichung"
mitigation_summary: "Dark-Pattern-Free-by-Design als Constraint in Design-System; PR-Template-Checkliste (confirmshaming/false-urgency/hidden-default-opt-in/roach-motel/grinding-for-FOMO); WCAG-2.2-AA + Single-Advance-Verb sind bereits 50 % Schutz"
linked_adrs: [[09-Design-System]]
linked_specs: [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
linked_code: []
sources:
  - title: "EU DSA Art. 25 Enforcement X €120M Fine"
    url: "https://www.goodwinlaw.com/en/insights/publications/2025/12/alerts-practices-antc-ec-issues-first-non-compliance-fine-under"
    accessed: "2026-05-20"
    publisher: "Goodwin Law"
    confidence: high
  - title: "Regulating dark patterns in EU (EP 2025)"
    url: "https://www.europarl.europa.eu/RegData/etudes/ATAG/2025/767191/EPRS_ATA(2025)767191_EN.pdf"
    accessed: "2026-05-20"
    publisher: "European Parliament"
    confidence: high
  - title: "Digital Fairness Act Q4 2026 Proposal"
    url: "https://www.goodwinlaw.com/en/insights/publications/2025/11/alerts-practices-antc-from-dark-patterns-to-fair-play"
    accessed: "2026-05-20"
    publisher: "Goodwin Law"
    confidence: high
verification_notes: "DSA Art. 25 (in force 2024-02-17): 'providers shall not design interfaces that deceive or manipulate'. EuComm 2025-12-05 fine on X €120M. DSA Schwellen (>= 50 employees OR > €10M turnover für Art. 25) — solo unter Schwelle, aber DFA 2026 senkt Bar."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: design+founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) Dark-Pattern-Free-by-Design als Constraint in `docs/10-Architecture/09-Design-System.md`. (2) **PR-Template-Checkliste**: confirmshaming? false-urgency? hidden-default-opt-in? roach-motel? grinding-for-FOMO? (3) WCAG 2.2 AA + Single-Advance-Verb sind bereits ~50 % Schutz (kein hidden Focus, kein implicit-action).

**Verifikation.** Dark-Pattern-Audit-Tabelle (siehe CORE OUTPUT) quartärlich review.

### PM-2026-05-20-18-F-05 — Time-Spent-Reminder = low-cost, high-trust-signal

```yaml
id: PM-2026-05-20-18-F-05
priority: P4
domain: responsible-gaming
probability: 2
impact: 2
score: 4
confidence: medium
early_warning: []
mitigation_summary: "Settings → 'Wellness' Toggle (default ON für angemeldete <18; default OFF für 18+ mit prominentem Hinweis); 90/120/180-min Take-a-break-Toast"
linked_adrs: []
linked_specs: []
linked_code: ["src/features/wellness/"]
sources:
  - title: "WHO Gaming disorder ICD-11 6C51"
    url: "https://www.who.int/news-room/questions-and-answers/item/addictive-behaviours-gaming-disorder"
    accessed: "2026-05-20"
    publisher: "WHO"
    confidence: high
  - title: "Gaming disorder state of game"
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12640003/"
    accessed: "2026-05-20"
    publisher: "PMC"
    confidence: high
verification_notes: "ICD-11 6C51: 'impaired control' + 'priority over other activities' + 12+ months trotz harm. Apple Screen Time API: keine direkte Game-Integration, system-wide. PWA: navigator.userActivation + Visibility API + own session-timer reicht. Prevalenz 1–10 % gamers; vulnerable: Adoleszente, ADHD-comorbid."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: product
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Opt-in Session-Clock + soft ”žDu spielst seit 90 min — Pause?"-Toast nach 90/120/180 min (~4 h Dev-Task). Settings → ”žWellness" Toggle. Default ON für angemeldete <18 (wir haben 16+-gate, also 16/17-y-o); default OFF für 18+ mit prominentem Hinweis.

**Verifikation.** Telemetry-Event `wellness.session.long_break_prompt_shown`; SLO Coverage ≥ 98 %.

### PM-2026-05-20-18-F-06 — Children's Data: 16+-Gate korrekt für DE, aber Enforcement = Theater ohne Age-Assurance

```yaml
id: PM-2026-05-20-18-F-06
priority: P3
domain: responsible-gaming
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - signal: "Reasonable verification methods proportionate to risk"
  - signal: "EU Digital Identity Wallet 2026 Rollout"
mitigation_summary: "Self-declared 16+-Gate ist legal compliant baseline. Age-check VOR Telemetry/Account-Creation; keine Telemetry-Persist bei 'unter 16, exit' (ephemeral); IARC-Self-Rating kostenlos durchführen; Jugendschutzbeauftragter erst ab > 50k MAU"
linked_adrs: []
linked_specs: [[PM-2026-05-20-10-accessibility-and-inclusion]]
linked_code: []
sources:
  - title: "GDPR Art. 8"
    url: "https://gdpr-info.eu/art-8-gdpr/"
    accessed: "2026-05-20"
    publisher: "GDPR-Info"
    confidence: high
  - title: "Apple child safety initiatives Feb 2025"
    url: "https://techcrunch.com/2025/02/27/apple-introduces-new-child-safety-initiatives-including-an-age-checking-system-for-apps/"
    accessed: "2026-05-20"
    publisher: "TechCrunch"
    confidence: high
  - title: "USK cost overview 2025"
    url: "https://usk.de/en/home/cost-overview/"
    accessed: "2026-05-20"
    publisher: "USK"
    confidence: high
verification_notes: "GDPR Art. 8(1): Member States may lower to 13; DE BDSG §8(1): 16. EuComm Q&A 2024: 'reasonable verification methods proportionate to risk'. Apple 2025-02 age-check + EU Digital Identity Wallet 2026 = Landschaft shifting. USK 0/6/12 likely für text-only Manager mit Insolvency-Drama; USK 12 conservative. IARC questionnaire frei; USK paid €1.200 nur für Retail/Console. JMStV/BzKJ: Jugendschutzbeauftragten ab > 50k MAU."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder+legal
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) Age-check VOR Telemetry/Account-Creation (bereits Plan). (2) Kein Telemetry-Persist bei ”žunter 16, exit" → ephemeral. (3) **IARC-Self-Rating (kostenfrei)**, Ergebnis auf Landing-Page. (4) Jugendschutzbeauftragter erst ab Schwellenwert (User-Decision: Trigger bei 50k MAU).

**Verifikation.** Age-gate-Pen-Test pre-launch; IARC-Zertifikat in `docs/40-Compliance/`.

### PM-2026-05-20-18-F-07 — Fork-Risk-Asymmetry: Server-State ist der Moat, nicht Code

```yaml
id: PM-2026-05-20-18-F-07
priority: P1
domain: open-source
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "Architektur-Review server-authoritative-Code in public repo"
    threshold: "> 0"
mitigation_summary: "Split-Repo: football-manager-x-client (OSS, AGPL or MIT) + football-manager-x-backend (proprietär, closed). Brand-Trademark Welle-2-Report-14 Rebrand. Replay-Server-Endpoints unter ToS, nicht über OSS-Lizenz nutzbar"
linked_adrs: []
linked_specs: [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
linked_code: []
sources:
  - title: "Mastodon Trademark Policy"
    url: "https://joinmastodon.org/trademark"
    accessed: "2026-05-20"
    publisher: "Mastodon"
    confidence: high
  - title: "Mindustry (GPLv3 game precedent)"
    url: "https://en.wikipedia.org/wiki/Mindustry"
    accessed: "2026-05-20"
    publisher: "Wikipedia"
    confidence: high
verification_notes: "Mastodon: client+server beide AGPL-3.0, aber Mastodon gGmbH Trademark restricts brand-fork. Mindustry/Endless-Sky (GPLv3): forks existieren aber nie displaced original — community + maintainer-velocity + Steam-presence won. Football-Manager X server-authoritative (Determinismus + Anti-Cheat) — Server ist irreplaceable component."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wenn Game-State + Determinism-Seed-Engine + Liga-Backend server-side bleiben und NICHT in repo, ist Code-Fork ein nicht-funktionierender Client. ”žOpen client, closed server"-Pattern (Element/Matrix-hub, Mastodon-instance). Permissive licenses werden damit weniger riskant.

**Mitigation.** (1) **Split-Repo**: `football-manager-x-client` (OSS, AGPL or MIT) + `football-manager-x-backend` (proprietär closed). (2) Brand-Trademark Welle-2-Report-14 Rebrand vor Public-Launch. (3) Replay-Server-Endpoints unter ToS, nicht über OSS-Lizenz nutzbar.

**Verifikation.** Architektur-Review: kein server-authoritative-Code im public repo. CI-Check: Sensitive-Files-Pattern (`*/server/*.match.engine.ts`) blocked from public-branch.

### PM-2026-05-20-18-F-08 — Secret-Scan: gitleaks pre-commit + GitHub Push-Protection = 4h Setup, 99 % Schutz

```yaml
id: PM-2026-05-20-18-F-08
priority: P1
domain: security-open-source
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "gitleaks pre-commit failures"
    threshold: "any"
  - metric: "GitHub Push-Protection alerts"
    threshold: "any"
mitigation_summary: "gitleaks als husky-hook (4 h Setup); trufflehog --verified-only auf jeden PR; GitHub Push-Protection ON; bei Leaks BFG-Repo-Cleaner + Force-push to-detached + Rotate-secret"
linked_adrs: []
linked_specs: [[PM-2026-05-20-02-tech-and-ops]]
linked_code: [".husky/pre-commit", ".github/workflows/trufflehog.yml"]
sources:
  - title: "Gitleaks pre-commit"
    url: "https://github.com/gitleaks/gitleaks"
    accessed: "2026-05-20"
    publisher: "GitHub Gitleaks"
    confidence: high
  - title: "TruffleHog pre-commit"
    url: "https://docs.trufflesecurity.com/pre-commit-hooks"
    accessed: "2026-05-20"
    publisher: "Truffle Security"
    confidence: high
  - title: "Gitleaks vs TruffleHog 2026"
    url: "https://appsecsanta.com/secret-scanning-tools/gitleaks-vs-trufflehog"
    accessed: "2026-05-20"
    publisher: "AppSec Santa"
    confidence: medium
verification_notes: "28.65M secrets leaked on GitHub in 2025 (TruffleHog State of Secrets). GitHub Push Protection (free, all repos seit 2024-04) scans pre-push für 200+ secret-types. gitleaks <1s execution, 700+ regex patterns. TruffleHog verifies secrets against live APIs (FP reduction)."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Pre-commit**: `gitleaks` als husky-hook (4 h Setup). (2) **CI**: `trufflehog --verified-only` auf jeden PR. (3) **GitHub Push-Protection ON** (Settings → Code security). (4) **History-rewrite bei Leaks**: BFG-Repo-Cleaner + Force-push to-detached + Rotate-secret (NIE nur force-push: gh-cache, fork-cache persist).

**Verifikation.** Trockenübung 1×: dummy AWS-Key (AKIATEST...) in commit, verifizieren dass pre-commit-hook blockt UND GitHub Push-Protection blockt.

### PM-2026-05-20-18-F-09 — OpenSSF Scorecard 7/10 als externes Trust-Signal

```yaml
id: PM-2026-05-20-18-F-09
priority: P3
domain: security-open-source
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "OpenSSF Scorecard score"
    threshold: "< 7.0"
mitigation_summary: "Scorecard-Action in CI; Badge in README.md; Quick-Wins: Branch-Protection, Code-Review (PR-required), Pinned-Dependencies (Dependabot), Signed-Releases (cosign), CI-Tests, License-Check, SAST (CodeQL free), Dangerous-Workflow, SECURITY.md, Token-Permissions least-privilege"
linked_adrs: []
linked_specs: []
linked_code: [".github/workflows/scorecard.yml", "SECURITY.md"]
sources:
  - title: "OpenSSF Scorecard"
    url: "https://github.com/ossf/scorecard"
    accessed: "2026-05-20"
    publisher: "OpenSSF"
    confidence: high
verification_notes: "OpenSSF Scorecard 18 automated checks, 0–10 each, weighted. Quick wins für Solo (~7.0 score): Branch-Protection (main), Code-Review, Pinned-Deps, Signed-Releases (sigstore cosign), CI-Tests, License-Check, SAST, Dangerous-Workflow check, Security-Policy, Token-Permissions. Nicht realistisch für Solo: Fuzzing (8.5+), Maintained-criteria (>= 1 commit/week 90 days)."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Scorecard-Action in CI; Badge in README. Quick-Wins (Solo erreichbar ~7.0): Branch-Protection (main), Code-Review (require PR), Pinned-Dependencies (Renovate/Dependabot), Signed-Releases (sigstore cosign), CI-Tests, License-Check, SAST (CodeQL free), Dangerous-Workflow, SECURITY.md, Token-Permissions least-privilege.

**Verifikation.** scorecard.dev/viewer/?uri=github.com/EtroxTaran/football-manager-x — score ≥ 7.0.

### PM-2026-05-20-18-F-10 — DCO ist correct contributor-mechanism für Solo pre-License-Decision

```yaml
id: PM-2026-05-20-18-F-10
priority: P3
domain: open-source
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - signal: "External Contributors auftauchen"
  - signal: "License-Change geplant (z.B. AGPL → BSL Pivot)"
mitigation_summary: "DCO statt CLA (zero-friction, retain-copyright, low-overhead); --signoff Pre-commit-Hint; DCO-Probot enabled; CLA als Welle-4-Re-Eval-Item parken"
linked_adrs: []
linked_specs: []
linked_code: ["CONTRIBUTING.md", "README.md"]
sources:
  - title: "CLA vs DCO (Opensource.com)"
    url: "https://opensource.com/article/18/3/cla-vs-dco-whats-difference"
    accessed: "2026-05-20"
    publisher: "Opensource.com"
    confidence: high
  - title: "DCO Not CLA (Kyle Mitchell 2021)"
    url: "https://writing.kemitchell.com/2021/07/02/DCO-Not-CLA"
    accessed: "2026-05-20"
    publisher: "Kyle Mitchell"
    confidence: high
verification_notes: "DCO Linux Foundation v1.1: sign-off-line on commit = legal certification. CLA gibt copyright-assignment (enables license-change), aber signing-barrier + distrust-signal. DCO zero-friction, retain-copyright. Strapi case-study: switched DCO → CLA bei commercial pivot."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `--signoff` Pre-commit-Hint; DCO-Probot enabled. CLA als Welle-4-Re-Eval-Item parken (wenn Contributors auftauchen oder License-Change geplant).

### PM-2026-05-20-18-F-11 — Public Roadmap = high-cost-low-value für Solo ohne Community

```yaml
id: PM-2026-05-20-18-F-11
priority: P4
domain: open-source
probability: 3
impact: 2
score: 6
confidence: medium
early_warning:
  - signal: "Triage-Overhead 2–5 h/Woche bei null Traction"
mitigation_summary: "Pre-Traction: GitHub-Issues + Milestones (kein eigenes Projects-Board); Discussions OFF bis 50+ Stars; 3 Labels (mvp, post-mvp, idea)"
linked_adrs: []
linked_specs: []
linked_code: []
sources: []
verification_notes: "Discourse (radical-open): grosse Community kompensiert Roadmap-Diskussions-Overhead. Penpot: roadmap opaque, deliberate priorisation hidden = solo/small-team-pragma. GitHub-Issues + Milestones reichen für Solo."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Issues + 3 Labels (`mvp`, `post-mvp`, `idea`). Discussions OFF bis 50+ Stars. Welle-4 Re-Eval bei 100+ Stars oder ≥ 5 external Contributors.

### PM-2026-05-20-18-F-12 — Responsible-Gaming-Statement publishen = Brand-trust + Compliance-Karte

```yaml
id: PM-2026-05-20-18-F-12
priority: P4
domain: responsible-gaming
probability: 3
impact: 2
score: 6
confidence: medium
early_warning: []
mitigation_summary: "Draft Statement (siehe CORE OUTPUT) auf Landing-Page + About + Settings → 'Wellness' verlinken"
linked_adrs: []
linked_specs: []
linked_code: ["apps/web/src/pages/responsible-gaming.tsx (geplant)"]
sources:
  - title: "Public Postmortems as Marketing (openstatus)"
    url: "https://www.openstatus.dev/guides/public-postmortem-underrated-marketing"
    accessed: "2026-05-20"
    publisher: "OpenStatus"
    confidence: high
verification_notes: "Indie-Precedent: Concerned Ape (Stardew Valley) hat solchen Statement nicht; commercial AAA (Riot, Supercell) haben detaillierte Player-Wellness-Pages. Voluntary code-of-conduct = positive DSA/DFA Signal unter 'reasonable steps'."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: founder
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Statement-URL in Repo `docs/40-Compliance/responsible-gaming.md` + live unter `/responsible-gaming`.

## License-Decision-Matrix (CORE OUTPUT)

| License | Permissive? | Fork-Risk (1–5) | Commercial-Use-by-Others | Game-Industry Precedent | Recommendation |
|---|---|---|---|---|---|
| **MIT** | yes maximal | 5 | unrestricted; competitor SaaS-clone | viele Indie-Tools; selten für volle Games | **NO** — competitor full-launch ohne Server-State-Moat enforced |
| **Apache-2.0** | yes (patent grant) | 4.5 | unrestricted, patents protected | selten in Games | **NO** — Patent-Grant nice, gleiche Fork-Risk wie MIT |
| **GPLv3** | no (copyleft on distribution) | 3 | Forks open-source; competitor SaaS kann hosten w/o source-share (Loophole vs AGPL) | **Mindustry, Endless Sky, Veloren** — strongest game-industry precedent | **STRONG CANDIDATE** — aligned mit Peers, community-trust, server-side proprietary möglich |
| **AGPL-3.0** | no (copyleft + network-use trigger) | 2 | jeder hosted-service muss source share; closes SaaS-loophole | **Mastodon, Element/Synapse** — server-side OSS precedent | **STRONGEST CANDIDATE** wenn split-repo (client-AGPL, server-proprietär). Beide AGPL = unsere kommerzielle Zukunft locked. **Recommend client-AGPL + server-CLOSED** |
| **BSL (4y → Apache-2.0)** | source-available, not OSS | 2 | non-commercial OK; commercial bis Conversion | nicht in Games; HashiCorp, Sentry, MariaDB | **MEDIUM** — gibt 4y commercial-protection. Nicht OSI, kein GitHub-Sponsors-Boost, smaller contributor-pool, perception-risk ("hostile") |
| **Commons Clause + MIT** | source-available | 3.5 | non-commercial OK; "selling" prohibited (vage) | Redis-bridge-period only, abandoned | **NO** — Redis case-study (2018–2024) zeigt abandonment; vague "selling"; community-perception negativ |
| **All Rights Reserved** (no LICENSE) | no | 1 (cannot fork legally) | nothing | many proprietary indie | **NO** — Schrödinger-state: public aber unusable. Worst of both. Discoverable but not contributable, untrusted, no OSS-trust-signal |

### Recommendation: **AGPL-3.0 für `football-manager-x-client` (split off), `football-manager-x-backend` proprietär closed-source**

**Rationale (kurz):**
1. Strongest game-industry precedent ist GPL-family (Mindustry, Veloren, Endless Sky).
2. AGPL closes SaaS-fork-loophole das pure GPLv3 lässt.
3. Server-side proprietär = practical commercial-moat ohne OSS-trust zu kompromittieren.
4. AGPL + Trademark-Protection (post-Welle-2-Rebrand) = brand+code asymmetric protection (Mastodon-Pattern).
5. Spätere Relicense via DCO+contributor-replacement ODER ”žAGPL-3.0-or-later"-upgrade-clause.

**Alternative:** falls Founder AGPL-Perception unbequem (manche Companies blacklist), **GPLv3** ist safe runner-up (Mindustry-Precedent stark, schwächt nur SaaS-loophole closure).

## Dark-Pattern-Audit (CORE OUTPUT, applied to existing locked specs)

| Mechanism | Pattern Type | Verdict | Mitigation if borderline |
|---|---|---|---|
| **Roguelite Insolvency-Spiral** (GD-0008) | loss-aversion / sunk-cost | **legitimate** (genre-norm, transparent, no monetization-coupling) | (a) End-of-Run-Screen explizit ”žwhat survives vs what's lost"; (b) no countdown timers on run-end; (c) "Are you sure?"-confirm on voluntary insolvency |
| **Single-Advance-Verb** (GD-0001) | anti-engagement-trap (positiv) | **positive design** — explicit anti-misdirection | maintain; document in Design-System als Anti-Dark-Pattern |
| **Carry-Slot Legacy** | meta-progression / reward-loop | **legitimate** if reveal-logic deterministic + transparent | (a) Carry-Slot pick UI zeigt ALLE eligible options (no hidden 'rare slot'); (b) no time-limited pick; (c) opt-out: ”ždon't carry anything" 1-click |
| **Match-Sim Pre-Match Hype-Bar** (hypothetisch) | engagement-amplifier | **borderline** | Muss NOT auto-skip; user-controlled; no false-stakes (”žLAST CHANCE") wenn nicht faktisch |
| **Daily-Login-Streak** (NICHT in MVP) | FOMO / variable-reward | **dark-pattern-risk HIGH** | DO NOT IMPLEMENT in MVP. Falls post-MVP: streak-pause-on-illness, no streak-loss-on-30d-absence, no premium-recovery-purchase |
| **Insolvency-Notification Push** (post-MVP) | guilt / nag-prompt | **dark-pattern-risk MEDIUM** | Frequency-Cap max 1/Woche pro Club; opt-in default OFF; ”žmanage notifications"-Link in jedem Push |
| **Settings: default-opt-in toggles** | hidden-default / sunk-cost | **dark-pattern-risk HIGH if mishandled** | Alle Toggles default OFF except (a) accessibility (ON per WCAG), (b) wellness-prompt-<18 (ON); jedes data-sharing default OFF |
| **Exit-Confirmation Dialog** | confirmshaming-risk | **borderline** | Wording neutral: "Exit game?" - not "Sure? Your run will be lost forever!". Buttons symmetric, no green/red-coding |
| **In-game store** (post-MVP) | hidden-cost / drip-pricing | **N/A MVP**; flag als dark-pattern-watch-item | (a) real-currency-Preise IMMER in User-Locale; (b) keine virtual-currency-bundle-mismatch; (c) keine "limited offer" ohne Scarcity-Proof |
| **Push-Notification Re-Engagement 7d** | re-engagement-FOMO | **dark-pattern-risk MEDIUM** | Copy informational, nicht emotional (”ž3 matches this week" nicht ”žYour team misses you!"); user opt-out per channel |
| **Age-Gate** | Compliance + UX-design | **legitimate** | NICHT remember false-age claim langfristig; suspicious-pattern (rapid birthdate-toggle) triggert re-verify |
| **Carry-Slot ”žauto-pick best"-Suggestion** (hypothetisch) | nudge / default-choice | **borderline** | Falls implementiert: opt-in, nie default-pre-selected, gleiche Data-View für User und Algorithmus |

## Responsible-Gaming-Statement (CORE OUTPUT — Landing-Page-Draft)

> **Responsible Gaming — Our Commitment**
>
> Football Manager X is built to be enjoyed in measured sessions, not consumed in marathons. We deliberately design against engagement traps: there are no daily login streaks, no time-limited "last chance" offers, no random-purchase boxes, and no monetization mechanics that punish absence. The Roguelite Insolvency mode is a creative-tension feature, not a guilt loop — every run-end screen clearly shows what carries forward and what does not, and you can stop at any time without losing progress that wasn't already earned.
>
> If you are 16 or older (the minimum age to use this game in Germany under GDPR Art. 8), you can enable an optional Session Reminder in Settings → Wellness. After 90 minutes of continuous play, a gentle reminder will suggest a break. You can adjust or disable this at any time.
>
> If you or someone you know is experiencing problems related to gaming, the WHO recognizes Gaming Disorder (ICD-11 6C51) as a clinical condition. The German hotline of BZgA (Bundeszentrale für gesundheitliche Aufklärung) — 0800 1 37 27 00 — offers free, anonymous counseling.
>
> We will publish updates to this commitment whenever our game mechanics change. Last updated: 2026-XX-XX.

## Quantitatives Modell

### License-Decision-Impact (Schätzung)

| Scenario | Fork-Probability (12m) | Time-to-Competitive-Fork-Launch | Lost-Market-Share-if-fork-succeeds |
|---|---|---|---|
| MIT, server-public | 35 % | 4–6 Mo | 30–60 % |
| MIT, server-private | 10 % | 9–12 Mo (Server-Reimplementierung) | 5–15 % |
| AGPL-3.0, server-private | 3 % | 12–18 Mo (muss open-source competing-server) | 1–5 % |
| Proprietary (All Rights Reserved) | 0.5 % (illegal-fork only) | N/A | N/A |
| GPLv3, server-private | 5 % | 10–14 Mo | 3–10 % |

**Empfehlung**: AGPL-3.0 + server-private = best fork-defense + OSS-trust combination.

### GitHub Sponsors realistic income (10k DAU Indie, Jahr 1–2):

- Bottom 5 % maintainers: €0–10/Mo (most indie OSS games).
- Median: €30–120/Mo.
- Top 25 %: €200–800/Mo.
- Top 5 % mit active community/streaming/PR: €1.500–5.000/Mo.

Baseline football-manager-x bei 10k DAU, no marketing: **€50–200/Mo Jahr 1**, growing zu €200–800 Jahr 2 falls Twitch/YouTube-Community formt. Patreon/Ko-fi ~+50 % additional channel.

### USK rating cost (DE)

- USK board-rated (Retail/Console-Disc): **~€1.200**/Titel.
- IARC self-rating (Web/PWA/Mobile): **€0**.
- **Recommendation**: IARC only; USK upgrade nur bei Retail-Release-Plan (vermutlich nie für uns).

### Dev-Cost Dark-Pattern-Audit pro Release-Cycle

- Initial Checklist Setup: 4–6 h.
- Per-Release-Review: 30–60 min mit Checklist.
- Annual external Peer-Review (Community + WCAG-Auditor): €200–400 oder in-kind via OSS-Community.

## SLO-Vorschläge

| SLO | Ziel |
|---|---|
| Time-Spent-Reminder Coverage | ≥ 98 % Sessions ≥ 90 min zeigen Wellness-Prompt < 2 min nach Threshold (für Toggle-ON Users; 100 % unter-18 cohort) |
| Dark-Pattern Audit Cadence | 100 % PRs mit UI-Touch durchlaufen Checkliste (PR-template gating); volle Audit-Tabelle quartärlich re-reviewed |
| OpenSSF Scorecard Score | ≥ 7.0/10 auf `main`; failing-check Issue innerhalb 14 Tagen; monthly Scorecard-Action im CI |

## Future-scope decisions (classified future-scope)
1. **License-Choice für Client-Repo**: AGPL-3.0 (empfohlen) vs GPLv3 vs MIT vs deferred (proprietary closed bis post-MVP) — **bis Welle-3 entscheiden**, blocking contributor outreach + GitHub Sponsors eligibility.
2. **Split-Repo für Backend**: Wann fork `football-manager-x` in `*-client` (OSS) + `*-backend` (private)? Jetzt, bei MVP-Feature-Freeze, oder bei Public-Launch?
3. **Contributor-Mechanism**: DCO (empfohlen) vs CLA vs neither (private-by-invite-only)?
4. **Responsible-Gaming-Statement publication**: jetzt pre-MVP oder erst bei Public-Launch? Empfehlung: **jetzt** — kostet nichts, setzt Standard.
5. **Wellness-prompt default-on threshold**: Default ON für alle < 18, OFF für 18+? Oder ON für alle mit easy toggle-off?
6. **Rebrand-Timing vs OSS-Publication**: Welle-2-Report-14 empfahl Rebrand vor Public-Launch. Zählt AGPL-Adoption + LICENSE-file als "public launch"-Trigger?
7. **In-game store / Monetization**: re-confirm post-MVP cosmetics-only-no-RNG-no-trade (per Welle-1-Report-08-F-10), im Licht AT-OGH 12/2025-Relaxation? **Empfehlung: konservativ bleiben; re-eval bei Welle-5** sobald MVP DAU-Baseline existiert.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **AGPL-3.0 für Client-Repo + LICENSE-Datei jetzt.** Schrödinger-License-State ist gefährlicher als jede Entscheidung. Default AGPL-3.0 mit Split-Repo-Plan für Server. Blockt: GitHub-Sponsors, Contributor-Trust, License-Bot-CI.
2. **`gitleaks` pre-commit + GitHub Push-Protection heute aktivieren.** 30-min Setup; schützt vor wahrscheinlichstem OSS-Disaster (Secret-Leak in public history). Dann `trufflehog --since-commit=<first-commit>` einmal zur Scrub-of-current-history.
3. **Responsible-Gaming-Statement auf Landing-Page + Wellness-Settings mit opt-in 90-Min-Session-Reminder.** Null Monetization-Risk; setzt ethical Baseline; DSA-Art-25 ”žreasonable steps"-Defense-Evidence; differenziert von EA/2K/Konima im Football-Manager-Category durch Player-Care-Signal.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-18-F-NN`. Aggregat: [[findings-registry]].
## Related

- [[00-index]]
- [[findings-registry]]
- [[PM-2026-05-20-04-monetization]]
- [[PM-2026-05-20-08-legal-consumer-law-and-tax]]
- [[PM-2026-05-20-14-brand-pr-and-crisis-comms]]
- [[PM-2026-05-20-17-vendor-lifecycle-and-sustainability]]
