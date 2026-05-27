---
title: "Pre-Mortem 2026-05-20 · 16 · Test-Strategy-Depth"
status: current
tags: [research, pre-mortem, testing, vitest, playwright, stryker, fast-check, determinism, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-16
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-10-accessibility-and-inclusion]]
  - [[PM-2026-05-20-12-long-term-balance-and-meta]]
  - [[../determinism-and-replay]]
---

# Pre-Mortem 2026-05-20 · 16 · Test-Strategy-Depth

> **Failure-Headlines**
> - ”žTest-Pyramid kollabiert: Unit-only, kein Mutation/Property — Off-by-One in Goal-Diff-Tiebreaker shipped — Replay zwischen v1.4 → v1.5 weg."
> - ”žCI-Minuten brennen GitHub-Free-Tier in Woche 4 — 22.000 min/Mo nötig — Founder schaltet Determinism-Gate ab."
> - ”ž50-Year-Soak passt lokal, deadlock at year-47 on CI (4 vCPU 7 GB OOM) — silent continue-on-error — Live-User-Wall nach 6 in-game-Monaten."
> - ”žVisual-Regression-False-Positive-Fatigue → Snapshots disabled → echte LCP-Regression unbemerkt."
> - ”žSave-Forward-Compat assumed, never tested — v2.0-Engine korrumpiert v1.4-Saves silent."

## Top Failure-Hypothesen

### PM-2026-05-20-16-F-01 — Vitest 3 Browser-Mode + Playwright Provider als Component-Test-Baseline

```yaml
id: PM-2026-05-20-16-F-01
priority: P2
domain: testing
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - metric: "Tool-Overhead (jsdom-Mocks veraltet)"
    threshold: "qualitativ"
mitigation_summary: "Eine Test-Runner-Achse: vitest 3.x mit @vitest/browser-playwright (Chromium); Unit jsdom, Component browser-pool + Sharding"
linked_adrs: []
linked_specs: [[PM-2026-05-20-10-accessibility-and-inclusion]]
linked_code: []
sources:
  - title: "Vitest Browser Mode"
    url: "https://vitest.dev/guide/browser/"
    accessed: "2026-05-20"
    publisher: "Vitest"
    confidence: high
  - title: "Vitest Parallelism"
    url: "https://vitest.dev/guide/parallelism"
    accessed: "2026-05-20"
    publisher: "Vitest"
    confidence: high
  - title: "Vitest Browser vs Playwright CT 2026"
    url: "https://www.pkgpulse.com/blog/vitest-browser-mode-vs-playwright-component-testing-vs-2026"
    accessed: "2026-05-20"
    publisher: "PkgPulse"
    confidence: medium
verification_notes: "Vitest 3.x browser mode matured 2025–2026, Playwright-provider recommended. Sharding via --shard=N/M + --reporter=blob; CI wall-time -4× auf 500-test suite."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `vitest 3.x` mit `@vitest/browser-playwright` (Chromium-Provider). Unit-Tests jsdom-pool; UI browser-pool mit Sharding `--shard=$SHARD/4 --reporter=blob` und `vitest --merge-reports`. `maxWorkers: '50%'`.

**Verifikation.** CI-Wall-Time-Budget Vitest-Browser-Job ≤ 6 min/PR. Lokal `pnpm test --shard=1/4` reproduziert CI. Kein Aufkommen von `happy-dom`/`jsdom`-Mocks für Browser-APIs.

### PM-2026-05-20-16-F-02 — Property-based testing (fast-check) ist highest-leverage Layer

```yaml
id: PM-2026-05-20-16-F-02
priority: P1
domain: testing
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "Engine-Invariant-Coverage"
    threshold: "< 5 core props"
mitigation_summary: "fast-check 4.x für Match-Engine-Invariants + Save-Parser + Player-Attribute-Generator; Seed aus engine_bundle_hash"
linked_adrs: []
linked_specs: [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-12-long-term-balance-and-meta]]
linked_code: ["packages/match-engine/src/*.test.ts"]
sources:
  - title: "fast-check.dev"
    url: "https://fast-check.dev/docs/introduction/what-is-property-based-testing/"
    accessed: "2026-05-20"
    publisher: "fast-check"
    confidence: high
  - title: "innoQ: 1000 in one blow"
    url: "https://www.innoq.com/en/articles/2023/04/testing-fast-check/"
    accessed: "2026-05-20"
    publisher: "innoQ"
    confidence: high
verification_notes: "Example-Based-Tests übersehen Edge-Cases (Ball verschwindet bei equal-vector collisions, Score nicht monoton, Attribute-Boundary). Property-Tests finden mit > 99 % Wahrscheinlichkeit in < 100 Iterationen."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** `fast-check` ≥ 4.x mit `fc.assert(..., { seed: PRNG_SEED, numRuns: 200, endOnFailure: false })`. Seed deriviert aus `engine_bundle_hash` für CI-Reproduzierbarkeit. **5 Core-Invariants**: (a) `ball.position` immer auf-Feld oder dead-ball-state; (b) `score` monoton wachsend pro Team; (c) `playerCount` pro Seite ≤ 11 âˆ§ ≥ 7; (d) Save-roundtrip `parse(serialize(save)) === save` für N=1000 zufällige Saves; (e) Player-Attribute-Generator → mean ± Ïƒ in vorhersagbarem Band.

**Verifikation.** Shrinking-Output bei Fehlschlag im CI-Artifact als `counterexample.json`. Reproduzieren: `pnpm test:prop --seed=<seed>` regeneriert identisch.

### PM-2026-05-20-16-F-03 — Stryker Mutation Testing scoped auf /engine, nicht project-weit

```yaml
id: PM-2026-05-20-16-F-03
priority: P3
domain: testing
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - metric: "Stryker CI-Time"
    threshold: "> 45 min/PR (kann zu Mutation-Fatigue führen)"
mitigation_summary: "Stryker 8.x + @stryker-mutator/vitest-runner + --incremental + scoped src/engine/**; UI gedeckt durch Visual + axe + component"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Stryker Incremental"
    url: "https://stryker-mutator.io/docs/stryker-js/incremental/"
    accessed: "2026-05-20"
    publisher: "Stryker"
    confidence: high
  - title: "StrykerJS 7.0"
    url: "https://stryker-mutator.io/blog/announcing-stryker-js-7/"
    accessed: "2026-05-20"
    publisher: "Stryker"
    confidence: high
  - title: "Mutation Testing 2026"
    url: "https://oneuptime.com/blog/post/2026-01-25-mutation-testing-with-stryker/view"
    accessed: "2026-05-20"
    publisher: "OneUptime"
    confidence: medium
verification_notes: "Default-Konfig auf gesamtem Repo: > 45 min CI/PR + Mutation-Fatigue. Solo-Founder schaltet ab. Scope-Tier nötig."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Stryker 8.x + `@stryker-mutator/vitest-runner` + `--incremental` (`reports/stryker-incremental.json` committed-cached). Scope-Tier:
- **Tier-A (PR-gate, fail)**: `src/engine/**` (match-engine, RNG, save-parser, command-log) → break 70, low 80, high 90.
- **Tier-B (nightly only)**: `src/domain/**` (tactic, player, training) → break 50, low 65.
- **Tier-C (excluded)**: `src/ui/**` (UI gedeckt durch Visual + axe + component).

**Verifikation.** Nightly-Report in `docs/40-Quality/mutation-trend.md`. Drop > 5pp in PR → blocks. Incremental-Cache-Hit-Rate ≥ 80 %.

### PM-2026-05-20-16-F-04 — Determinism-CI-Gate: 1000-seed overkill für PR; Tiered N

```yaml
id: PM-2026-05-20-16-F-04
priority: P1
domain: testing
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "PR-Determinism-Gate-Time"
    threshold: "> 5 min (Founder lockert Gate)"
mitigation_summary: "Bit-identischer Hash-Vergleich (sha256(event-log)) in fast-pfad; struktureller Diff nur bei Mismatch. Tier 32/PR · 1000/nightly · 10k/release"
linked_adrs: []
linked_specs: [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-12-long-term-balance-and-meta]]
linked_code: ["packages/match-engine/", ".github/workflows/ci.yml"]
sources:
  - title: "Developing your own replay system"
    url: "https://www.gamedeveloper.com/programming/developing-your-own-replay-system"
    accessed: "2026-05-20"
    publisher: "Game Developer"
    confidence: medium
  - title: "PRNGs and randomized testing"
    url: "https://tessapower.xyz/blog/prngs-and-randomized-testing"
    accessed: "2026-05-20"
    publisher: "Tessa Power"
    confidence: medium
verification_notes: "1000 Seeds × 90-Min-Match × 8 RNG-Streams pro PR ~12 min CI bei optimaler Parallelisierung. Tiered N reduziert auf 2 min PR / 25 min nightly / 60 min release."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Tiered N:
- **PR-Gate (fail-fast)**: 32 Smoke-Seeds, ≤ 2 min, hard-fail bei Hash-Mismatch.
- **Nightly**: 1000 Seeds, ≤ 25 min, statistische Diff-Berichte (latency, AI-tactic-entropy).
- **Release-Tag**: 10.000 Seeds verteilt auf Self-Hosted-Hetzner-Runner-Pool (parallel-shard 10×), 60-min-Budget.

**Verifikation.** Smoke-Seeds in `tests/fixtures/determinism/smoke.seeds` versioniert. Mismatch erzeugt Artifact mit erstem divergierendem Tick + Stream-ID.

### PM-2026-05-20-16-F-05 — Save-Forward-Compatibility: N-2 Fixture-Matrix or es existiert nicht

```yaml
id: PM-2026-05-20-16-F-05
priority: P1
domain: testing
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - signal: "Keine versionierten Save-Fixtures in tests/fixtures/saves/"
mitigation_summary: "Versionierte Save-Fixture-Matrix + Migration-Replay-Test; engine-version-pinning pro Save; älterer Engine refuses neue Save graceful"
linked_adrs: []
linked_specs: [[PM-2026-05-20-05-security-and-integrity]], [[PM-2026-05-20-12-long-term-balance-and-meta]]
linked_code: ["tests/fixtures/saves/v{N-2,N-1,N}/canonical.save"]
sources:
  - title: "Confluent Schema Evolution"
    url: "https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html"
    accessed: "2026-05-20"
    publisher: "Confluent"
    confidence: high
  - title: "Protocol Buffers Schema Evolution"
    url: "https://jsontotable.org/blog/protobuf/protobuf-schema-evolution"
    accessed: "2026-05-20"
    publisher: "JsonToTable"
    confidence: medium
verification_notes: "Ohne versionierte Save-Fixtures ist 'Forward-Compat' Behauptung ohne Test. Erste Engine-MAJOR-Migration korrumpiert silent Player-Saves."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) `tests/fixtures/saves/v{N-2,N-1,N}/canonical.save` + `golden-replay-events.jsonl`. (2) **Migration-Replay-Test**: Lade `v(N-2)` in Engine `v(N)`, replay `command_log`, vergleiche `merkle_root` mit goldenem. Schema-Diff via JSON-Schema + ajv-strict (additive-only check on MINOR). (3) **Engine-Version-Pinning**: jedes Save speichert `engine_bundle_hash`. Load-Pfad routet via Migration-Registry (`migrations/{from}→{to}.ts`). (4) **Forward-Compat-Sanity**: ältere Engine darf neues Save nicht laden (graceful refuse statt crash), getestet, nicht behauptet.

**Verifikation.** Compat-Matrix-Job (nightly): N×N replay-grid, ≤ 8 min. Schema-Diff-Bot kommentiert PRs ”žBREAKING / ADDITIVE / NONE".

### PM-2026-05-20-16-F-06 — 50-Year-Headless-Soak: Assertions + Drift-Baseline, nicht nur ”žläuft durch"

```yaml
id: PM-2026-05-20-16-F-06
priority: P1
domain: testing
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "Soak-Test asserts (memory, save-size, narrative-burn, tactic-entropy)"
    threshold: "Drift > 3Ïƒ baseline"
mitigation_summary: "Soak-Assertions: heap-Steady-State, Save-Size-Growth, Narrative-Template-Burn ≤ 40 %, Tactic-Entropy ≥ 1.8 bits; baseline-diff via Mahalanobis-Distance"
linked_adrs: []
linked_specs: [[PM-2026-05-20-12-long-term-balance-and-meta]]
linked_code: ["tests/soak/"]
sources:
  - title: "Memory leak guide (Browserless)"
    url: "https://www.browserless.io/blog/memory-leak-how-to-find-fix-prevent-them"
    accessed: "2026-05-20"
    publisher: "Browserless"
    confidence: medium
verification_notes: "Wenn Soak nur 'terminate without throw' prüft, übersieht das eigentliche Risiko: lineare Memory-Growth (10 KB/Saison × 50 Jahre = 500 MB), Save-File-Bloat, Narrative-Exhaustion, AI-Entropy-Collapse."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Soak-Assertions:
- `heapUsed(year=50) - heapUsed(year=5) ≤ 50 MB` (Steady-State).
- `saveSize(year=50) / saveSize(year=5) ≤ 3.0`.
- `narrative.templateBurnRate ≤ 0.4` (max 40 % Templates verbraucht).
- `shannon_entropy(tactic_distribution) ≥ 1.8 bits` an jedem Jahresende.
- Baseline: `golden-soak-summary.json` committed. CI: Mahalanobis-Distance gegen Baseline > 3Ïƒ → fail.
- Runtime-Budget: ≤ 15 min auf `ubuntu-latest` (4 vCPU). Tier-3 (nightly + release).

**Verifikation.** `pnpm soak:50y --baseline=goldens/soak-baseline-v{engine}.json` reproduziert lokal < 15 min. Drift-Report als PR-Artifact.

### PM-2026-05-20-16-F-07 — Visual-Regression: Argos (OSS, $19) statt Chromatic ($179+); Pseudo-Loc + RTL als Variants

```yaml
id: PM-2026-05-20-16-F-07
priority: P3
domain: testing
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - metric: "Visual-Regression False-Positive-Rate"
    threshold: "> 5 % Quartärlicher Audit"
mitigation_summary: "Argos als visual-regression spine; Pseudo-Loc + RTL als Story-Decorators (nicht separate Runs); Mask dynamic content"
linked_adrs: []
linked_specs: [[PM-2026-05-20-09-i18n-and-localization]]
linked_code: []
sources:
  - title: "Argos pricing"
    url: "https://argos-ci.com/pricing"
    accessed: "2026-05-20"
    publisher: "Argos"
    confidence: high
  - title: "Vizzly comparison Percy/Chromatic/Argos"
    url: "https://vizzly.dev/visual-testing-tools-comparison/"
    accessed: "2026-05-20"
    publisher: "Vizzly"
    confidence: medium
  - title: "Playwright Visual Regression 2026"
    url: "https://bug0.com/knowledge-base/playwright-visual-regression-testing"
    accessed: "2026-05-20"
    publisher: "Bug0"
    confidence: medium
verification_notes: "Jede Story 3 Locales × 2 Direction × 3 Viewport = 18 Snapshots ohne Maskierung von dynamic-content = False-Positives → Tool deaktiviert. Argos Hobby-Free, Team $19. Chromatic Starter $179."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** **Argos** als Visual-Backbone (OSS, Hobby-Free, Team $19/Mo). Storybook + `@storybook/test-runner` rendert headless → `argos upload`. Discipline:
- `animations: 'disabled'`, `caret: 'hide'`, `mask: [time-elements, avatar-randomized]`.
- Pseudo-Loc + RTL als Story-Decorators (1 Job, mehr Stories).
- Per-component-Threshold `maxDiffPixelRatio: 0.001` Engine-Vis, `0.005` Marketing.
- Baselines in Argos hosted, NICHT git → spart Repo-Bloat.

**Verifikation.** False-Positive-Rate ≤ 5 % Quartärlicher Audit (100 Argos-Builds-Sample). Diff-Review-SLA ≤ 24 h.

### PM-2026-05-20-16-F-08 — Chaos-Engineering: Toxiproxy + Bespoke SW-Chaos

```yaml
id: PM-2026-05-20-16-F-08
priority: P3
domain: testing
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "Chaos-Job-MTTR"
    threshold: "Steigend"
mitigation_summary: "Toxiproxy in docker-compose.test.yml; SW-Chaos via Playwright context.setOffline(); Tier nightly, klein beginnen (1 Toxic, Skalierung nach Green-Pass)"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Chaos engineering Netflix"
    url: "https://publications.computer.org/computer-magazine/2018/11/15/netlfix-chaos-engineering/"
    accessed: "2026-05-20"
    publisher: "IEEE Computer"
    confidence: medium
  - title: "Toxiproxy Chaos Toolkit"
    url: "https://chaostoolkit.org/drivers/toxiproxy/"
    accessed: "2026-05-20"
    publisher: "Chaos Toolkit"
    confidence: high
verification_notes: "Football-Manager-PWA muss offline-first. Wenn nur Happy-Path getestet, fallen 5xx vom Sync-Backend + 200-aber-corrupt-JSON + slow-3G + abrupte SW-Transitionen durchs Raster und korrumpieren Saves."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Toxiproxy in `docker-compose.test.yml`. CI-Job ”žchaos-network" injiziert: latency 2000 ms, bandwidth 50 KB/s, slicer, timeout 30 %. SW-Chaos via Playwright `context.setOffline(true/false)` Zufallsmuster während long-session. Tier: chaos nightly, nicht PR. Beginnt klein (1 Toxic), Skalierung nur nach Green-Pass.

### PM-2026-05-20-16-F-09 — Cross-Browser für Solo: Playwright `--project` + LambdaTest $15 für RealDevice

```yaml
id: PM-2026-05-20-16-F-09
priority: P3
domain: testing
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - signal: "iOS-Safari-Bug erst bei Beta-Tester sichtbar"
mitigation_summary: "Playwright --project=chromium,firefox,webkit als CI-Default; LambdaTest $15 als manual Real-Device-Verifikation 1×/Release"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "LambdaTest vs BrowserStack 2026"
    url: "https://bug0.com/knowledge-base/lambdatest-vs-browserstack"
    accessed: "2026-05-20"
    publisher: "Bug0"
    confidence: medium
  - title: "BrowserStack pricing 2026"
    url: "https://bug0.com/knowledge-base/browserstack-pricing"
    accessed: "2026-05-20"
    publisher: "Bug0"
    confidence: medium
  - title: "Playwright CI"
    url: "https://playwright.dev/docs/ci"
    accessed: "2026-05-20"
    publisher: "Playwright"
    confidence: high
verification_notes: "BrowserStack Automate $129+ ist nicht solo-budget. Selenium-Grid self-host Wartungs-Black-Hole. Playwright deckt Chromium/Firefox/WebKit headless. iOS-Safari (echte Touch-Events, PWA-Install-Banner) + Samsung Internet = blinde Flecken."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Playwright `--project=chromium,firefox,webkit` als CI-Default. Mobile-Emulation `Pixel 7`, `iPhone 15`. LambdaTest Live $15/Mo (”žTestMu AI" seit 2026-01) für manuelle Real-Device-Verifikation iOS Safari + Samsung Internet 1×/Release. **Kein BrowserStack Automate-Slot** — Kosten/Nutzen schlecht für Solo.

**Verifikation.** Pre-Release-Checklist (`docs/40-Quality/release-checklist.md`) listet Real-Device-Smoke.

### PM-2026-05-20-16-F-10 — CI-Budget für Solo: Hybrid (GH PR-Hot + Hetzner Nightly), Break-Even ~15k min/Mo

```yaml
id: PM-2026-05-20-16-F-10
priority: P1
domain: testing
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "GitHub Actions monthly CI-minutes"
    threshold: "Approaching free tier 2000 min"
mitigation_summary: "GitHub-hosted für PR-Hot-Path (≤ 25 min/PR); Hetzner self-hosted für nightly+release; Break-Even ~15.000 min/Mo"
linked_adrs: []
linked_specs: []
linked_code: [".github/workflows/ci.yml"]
sources:
  - title: "GitHub self-hosted runner fee 2026 (RunsOn)"
    url: "https://runs-on.com/blog/github-self-hosted-runner-fee-2026/"
    accessed: "2026-05-20"
    publisher: "RunsOn"
    confidence: high
  - title: "Northflank GH alternatives 2026"
    url: "https://northflank.com/blog/github-pricing-change-self-hosted-alternatives-github-actions"
    accessed: "2026-05-20"
    publisher: "Northflank"
    confidence: high
  - title: "TestFlows Hetzner runners"
    url: "https://github.com/testflows/testflows-github-hetzner-runners"
    accessed: "2026-05-20"
    publisher: "TestFlows"
    confidence: high
verification_notes: "Free-Tier 2000 min/Mo Linux private; Overage $0.008/min. Bei allen Layern auf GitHub-hosted: ~7.000 min/Mo (60 PRs × 119 billed-min). Self-hosted-Fee $0.002/min ab 2026-03 für private repos."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: tech-lead
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Hybrid CI:
- **PR-Pfad (hot)**: GitHub-hosted `ubuntu-latest`. Ziel ≤ 25 min/PR (parallel-shard).
- **Nightly + Release (cold)**: Hetzner-Cloud autoscaling self-hosted Runner (`testflows/testflows-github-hetzner-runners`). CX32 (4 vCPU/8 GB) ~€7/Mo idle + on-demand.
- **GH self-hosted Platform-Fee** $0.002/min ab 2026-03-01 für private repos. Bei 50k min/Mo = +$100. **Public-Repo wäre exempt** — relevant falls Engine open-sourced.

**Verifikation.** Monatlicher CI-Spend-Report. Dashboard `docs/40-Quality/ci-budget.md`. Break-Even ~15k min/Mo: ab da Hetzner billiger.

## Test-Strategy-Pyramid (CORE OUTPUT)

| Layer | Tool | Coverage-Target | CI-Time | Trigger |
|---|---|---|---|---|
| Unit (Vitest 3) | `vitest` (node-pool, jsdom) | ≥ 85 % Line, ≥ 80 % Branch | ≤ 3 min/PR (shard 4) | every PR |
| Property-based | `fast-check` 4.x | All 5 Core-Engine-Invariants + Save-Roundtrip + Attribute-Generator | ≤ 2 min/PR (200 runs/prop) | every PR |
| Mutation (engine-only) | `@stryker-mutator/vitest-runner` incremental | Tier-A `src/engine/**` ≥ 70 break / 80 low / 90 high | ≤ 8 min nightly | nightly + release |
| Component (browser) | `vitest 3 --browser` + `@vitest/browser-playwright` Chromium | All `*.stories.tsx` interaction-test | ≤ 6 min/PR | every PR |
| Visual Regression | Argos + Storybook Test Runner | All Stories × {default, pseudo-loc, RTL} | ≤ 5 min/PR (parallel upload) | every PR |
| Integration | Vitest + msw + in-memory adapters | Save/load, command-log, sync-protocol | ≤ 4 min/PR | every PR |
| E2E (Playwright) | `@playwright/test` matrix Chromium/Firefox/WebKit | 12 critical user-journeys (Onboarding, Match-Day, Save-Import, BYOC) | ≤ 10 min/PR (shard 3) | every PR |
| A11y (axe-core) | `@axe-core/playwright` + Storybook a11y addon | All Routes + Stories, WCAG 2.2 AA | ≤ 3 min/PR | every PR |
| Determinism-Replay | Custom + `sha256(event-log)` | Tier 32 smoke / 1000 nightly / 10.000 release | ≤ 2 min/PR / 25 min nightly / 60 min release | tiered |
| Save-Forward-Compat | Migration-Replay-Matrix N×N | Saves last 3 Engine-MAJORs | ≤ 8 min nightly | nightly |
| Long-Run-Soak (50y) | Headless-Engine-Harness | Memory, save-size, narrative-burn, tactic-entropy | ≤ 15 min nightly | nightly |
| Cross-Browser | Playwright `--project` + LambdaTest manual | Chromium/Firefox/WebKit headless + iOS/Samsung real pre-release | in E2E + manual | every PR + manual pre-release |
| Chaos (network + SW) | Toxiproxy + Playwright SW chaos | 5 Toxics enabled, expand 1/quarter | ≤ 10 min nightly | nightly |
| Performance/Perf-Budget | Lighthouse-CI + size-limit | LCP p75 ≤ 2.5 s, INP p75 ≤ 200 ms (TBT proxy), CLS p75 ≤ 0.1, Bundle main ≤ 180 KB gz | ≤ 4 min/PR | every PR |
| Security/Tampering | Semgrep + `pnpm audit` + CycloneDX + Tampering-Suite (Iter-2-Report-05) | OWASP top-10 SAST clean, no high-sev deps, SBOM signed (cosign) | ≤ 3 min/PR (Semgrep incremental) | every PR + weekly full SCA |
| Load (k6) | `grafana/k6` OSS | ”žSaturday match tick" 400 CCU, ”žWeek Advance" batch | ≤ 12 min weekly | weekly + release |
| OWASP-ZAP DAST | ZAP baseline-scan GHA | Preview-deploy auf Release-Candidate URL | ≤ 8 min release | release-tag |

## CI-Pipeline-Composition (CORE OUTPUT)

```yaml
# .github/workflows/ci.yml (sketch)
name: ci
on:
  pull_request:
  push: { branches: [main] }
  schedule: [{ cron: '0 2 * * *' }]   # nightly
  release: { types: [created] }

concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }

jobs:
  # ---------- PR Hot-Path (~25 min wall, ~12 min billed parallel) ----------
  lint-typecheck:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest    # 2 min
  unit-prop-shard:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    strategy: { matrix: { shard: [1, 2, 3, 4] } }
    # vitest --shard --reporter=blob ; 3 min/shard, 12 min billed
  component-browser:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest    # 6 min, vitest --browser
  e2e:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    strategy: { matrix: { project: [chromium, firefox, webkit], shard: [1,2,3] } }
    # Playwright + axe-core + visual (Argos upload) ~10 min/cell
  perf-budget:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest    # Lighthouse-CI + size-limit, 4 min
  determinism-smoke:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest    # 32 seeds, hash-diff, 2 min
  security-incremental:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest    # Semgrep diff-aware + pnpm audit, 3 min

  # ---------- Nightly Cold-Path (Hetzner) ----------
  mutation:
    if: github.event_name == 'schedule'
    runs-on: [self-hosted, hetzner-cx32]
    # Stryker --incremental, scope=src/engine/**, 8 min
  determinism-1000:
    if: github.event_name == 'schedule'
    runs-on: [self-hosted, hetzner-cx32]
    strategy: { matrix: { shard: [1..10] } }
  soak-50y:
    if: github.event_name == 'schedule'
    runs-on: [self-hosted, hetzner-cx32]
    timeout-minutes: 20         # hard wall
  save-fwd-compat:
    if: github.event_name == 'schedule'
    runs-on: [self-hosted, hetzner-cx32]
  chaos-network:
    if: github.event_name == 'schedule'
    runs-on: [self-hosted, hetzner-cx32]
  load-k6:
    if: github.event.schedule == '0 2 * * 0'   # weekly Sunday
    runs-on: [self-hosted, hetzner-cx52]

  # ---------- Release-Tag (paranoid) ----------
  determinism-10k:
    if: github.event_name == 'release'
    runs-on: [self-hosted, hetzner-cx32]
    strategy: { matrix: { shard: [1..20] } }
  owasp-zap:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest      # 8 min baseline-scan staging
  sbom-sign:
    if: github.event_name == 'release'
    runs-on: ubuntu-latest      # CycloneDX + cosign
```

**Caching:** `actions/setup-node` cache:'pnpm'; `actions/cache` für `~/.cache/ms-playwright` keyed by `hashFiles('**/pnpm-lock.yaml')`; Stryker `.stryker-tmp/` + `reports/stryker-incremental.json` cached on main.

## Tool-Cost-Comparison (CORE OUTPUT)

| Tool | Indie-Tier | Cost/Mo | MVP? |
|---|---|---|---|
| Vitest 3.x | OSS | $0 | Yes (mandatory) |
| Playwright | OSS | $0 | Yes (mandatory) |
| Stryker | OSS | $0 | Yes, scoped /engine |
| fast-check | OSS | $0 | Yes (mandatory) |
| axe-core / `@axe-core/playwright` | OSS | $0 | Yes (mandatory BFSG) |
| **Argos** | Hobby free, Team $19 | $0 → $19 | Yes (Team plan ab Collaboratoren) |
| Chromatic | Starter $179, Pro $399 | $179+ | No (Cost-Cliff Solo) |
| Percy | $39 starter, ramps to $5,649 | $39 → $$$ | No |
| Lighthouse-CI self-hosted | OSS | $0 (~€4 Hetzner CX11) | Yes |
| size-limit | OSS | $0 | Yes (5× Adoption vs bundlewatch) |
| Toxiproxy | OSS (Shopify) | $0 | Yes (nightly only) |
| k6 OSS | OSS | $0 (Grafana k6 Cloud $0 starter / $25 Pro für Dashboards) | Yes (OSS only) |
| OWASP ZAP | OSS | $0 | Yes (release-only) |
| Semgrep CE | Free OSS | $0 | Yes (Pro $40/Mo per dev nicht nötig MVP) |
| CycloneDX (cdxgen) | OSS | $0 | Yes (release-only) |
| BrowserStack Automate | $129+ per parallel | $129+ | No |
| **LambdaTest Live** | $15/Mo | $15 | Yes (manual pre-release only) |
| **Hetzner CX32 runner** | self-hosted | €7–15/Mo | Yes (nightly + release) |
| GitHub Actions Linux private | 2000 free min then $0.008/min | $0 → ~$30 | Yes |
| GitHub self-hosted Platform-Fee 2026-03+ | $0.002/min | ~$20/Mo @10k min | Be aware |
| **MVP Total Recurring** | — | **~$45–60/Mo** | (Argos $19 + LambdaTest $15 + Hetzner $15 + GH overage $10) |

## Quantitatives Modell

**CI-min per PR (billed wall-time × instances):**

| Job | Wall | Cells | Billed-min |
|---|---|---|---|
| lint-typecheck | 2 | 1 | 2 |
| unit+prop (shard 4) | 3 | 4 | 12 |
| component-browser | 6 | 1 | 6 |
| e2e (3 browser × 3 shard) | 10 | 9 | 90 |
| perf-budget | 4 | 1 | 4 |
| determinism-smoke | 2 | 1 | 2 |
| security-incremental | 3 | 1 | 3 |
| **PR total** | **~12 wall** | | **~119 billed** |

**Monthly:** 60 PRs × 119 = **7.140 min/Mo PR-Path GitHub-hosted**. Free 2000 → overage 5.140 × $0.008 = **$41/Mo**. Optimierung: e2e webkit (~30 min billed) auf Hetzner → âˆ’1.800 min/Mo (~$14).

**Nightly+Release Hetzner self-hosted:** 30 nightlies × (mutation 8 + det-1000 25 + soak 20 + fwd-compat 8 + chaos 10) ≈ **2.130 min/Mo**. Hetzner CX32 ~€0.011/h = $0.0002/min compute → ~$0.40 raw + €7/Mo idle = **~$8/Mo total**. GH Platform-Fee 2026-03+: 2.130 × $0.002 = **$4.26/Mo**.

**Self-hosted Break-Even**: ~15.000 GH-hosted billed-min/Mo. Solo unter PR-Path-Schwelle, aber über Nightly — Hybrid korrekt.

## SLO-Vorschläge

| SLO | Ziel |
|---|---|
| Unit-test line-coverage `src/engine/**` | ≥ 85 % |
| Unit-test line-coverage `src/ui/**` | ≥ 60 % |
| Mutation-Score `src/engine/**` | break 70 / low 80 / high 90 |
| Property-test invariant count `src/engine/**` | ≥ 5 core props (wachsend) |
| Determinism-Replay failure rate | 0 über 30-Tage-Fenster |
| Save-Forward-Compat replay rate | 100 % across N-2 → N |
| 50-y-Soak success rate (nightly) | ≥ 28/30 nights grün |
| 50-y-Soak runtime | p95 ≤ 15 min |
| CI PR wall-time (median) | ≤ 15 min |
| CI PR wall-time (p95) | ≤ 25 min |
| A11y critical+serious violations | 0 |
| Lighthouse Perf (median, mobile) | ≥ 85 |
| LCP p75 / INP p75 / CLS p75 | 2.5 s / 200 ms / 0.1 |
| Bundle main entry gzip | ≤ 180 KB |
| Visual-Regression False-Positive-Rate | ≤ 5 % (Argos Sample-Audit) |
| Total CI Spend | ≤ $60/Mo MVP, ≤ $150/Mo post-launch |

## Future-scope decisions (classified future-scope)
1. Engine open-sourced? Wenn ja, GH-Actions public-repo = self-hosted-fee exempt, Hetzner ggf. nicht nötig.
2. Storybook `@storybook/test-runner` (Jest-Playwright) oder Vitest-Browser-Storybook-Integration (Storybook 8.4+)? Tendenz Vitest-Browser.
3. Save-Fixtures-Lagerung: Git-LFS (>1 MB)? In-Repo (versioniert, Bloat)? S3 mit git-annex? Empfehlung: in-repo bis ≤ 5 MB total, sonst LFS.
4. BYOC (Bring-Your-Own-Compute) Worker — wie testet man Bypass-Suite (Report 13) gegen Moderation? Adversarial-Fuzz-Corpus committed?
5. Visual-Regression-Diff im PR: Founder allein oder Argos ”žauto-approve auf trivial diff < 0.1 %"?
6. k6 Cloud Free-Tier oder Grafana-Cloud-Stack mit gemeinsamem Lighthouse-Dashboard?

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Determinism-CI-Gate dieses Sprint stehen** — selbst 32-Seed Smoke + Hash-Diff reicht zum Start. Ohne ist jeder andere Test-Layer downstream einer instabilen Foundation. Tier N upward as confidence grows (32 → 1000 → 10.000).
2. **`fast-check` für 5 Engine-Invariants vor Unit-Test-Wachstum adoptieren** — Property-Tests früh applied multiplizieren Coverage per LoC of Test. Retrofit kostet, jetzt-Add compoundet across every refactor.
3. **Save-Forward-Compat-Matrix sobald Engine v1.1 shipped** — checked-in `v{N-2}/canonical.save` + Migration-Replay-Test ist 4-Std-Investment. Differenz zwischen ”žsilent corruption on v2.0 launch" und ”žgreen-light migration path". **Single most-likely silent-failure mode des Projekts.**

## Verfolgung & Verkettung

IDs `PM-2026-05-20-16-F-NN`. Aggregat: [[findings-registry]].
## Related

- [[00-index]]
- [[findings-registry]]
- [[PM-2026-05-20-02-tech-and-ops]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-10-accessibility-and-inclusion]]
- [[PM-2026-05-20-12-long-term-balance-and-meta]]
- [[../determinism-and-replay]]
