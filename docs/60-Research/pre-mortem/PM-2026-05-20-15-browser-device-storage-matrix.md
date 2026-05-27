---
title: "Pre-Mortem 2026-05-20 · 15 · Browser/Device/Storage Matrix"
status: current
tags: [research, pre-mortem, browser, ios-safari, indexeddb, storage, pwa, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-15
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-05-security-and-integrity]]
  - [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
  - [[PM-2026-05-20-12-long-term-balance-and-meta]]
  - [[../performance-budgets]]
  - [[../pwa-offline-patterns]]
---

# Pre-Mortem 2026-05-20 · 15 · Browser/Device-Matrix & Storage-Quota

> **Failure-Headline-Kandidaten**
> - ”žiOS-Safari 7-Day-Eviction wiped installed saves on non-home-screen users — 10 % first-week saves silently weg auf 30 % iOS-DAU."
> - ”žQuotaExceededError mid-save on Floor-Android with Large-world save."
> - ”žBrotli-CompressionStream Annahme bricht Chrome ≤ 138 + Firefox ≤ 146 — alle Save-Writes fehlschlagen."
> - ”žMatch-Worker OOM-killed auf 3 GB Android während 90-min Live-Match — 45 Minuten Play verloren."
> - ”ž`navigator.deviceMemory` undefined auf iOS Safari + Firefox → 50 % User mis-tiered, Premium-iPhones in Floor-Mode."

## Top Failure-Hypothesen

### PM-2026-05-20-15-F-01 — iOS-Safari 7-Day-Eviction wiped non-home-screen save

```yaml
id: PM-2026-05-20-15-F-01
priority: P0
domain: browser-storage
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "% of iOS sessions with display-mode != standalone"
    threshold: "> 70 %"
  - metric: "save_load_failed reason=envelope_missing on iOS Safari"
    threshold: "Spike"
  - signal: "Support-Tickets 'mein Save vanished' aus iOS"
mitigation_summary: "Aggressive Add-to-Home-Screen-Onboarding; navigator.storage.persist() bei erstem Save; Export-Reminder ≤ 5 Tage; Banner falls browser-mode detected"
linked_adrs: [[ADR-0002-offline-first]], [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
linked_specs: [[pwa-offline-patterns]]
linked_code: ["apps/web/public/sw-register.js", "apps/web/src/storage/persist.ts"]
sources:
  - title: "WebKit Storage Policy Updates"
    url: "https://webkit.org/blog/14403/updates-to-storage-policy/"
    accessed: "2026-05-20"
    publisher: "WebKit"
    confidence: high
  - title: "MDN Storage quotas and eviction"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "WebKit ITP 2.3"
    url: "https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/"
    accessed: "2026-05-20"
    publisher: "WebKit"
    confidence: high
verification_notes: "Safari löscht IndexedDB/Cache/OPFS nach 7 Tagen ohne User-Interaction (ITP-2.3, iOS 17/18 fortgeführt). Home-Screen-installierte PWAs haben eigenen 7-Tage-Counter und sind exempt — solange via Home-Icon gestartet. persist() unter Safari ist Heuristik, kein User-Prompt."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend+ux
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **First-Save-Hook**: nach erstem `writeSaveAtomically` → `navigator.storage.persist()`; Resultat in `meta.persistGranted`. Unter Safari faktisch nur wirksam wenn schon Home-Screen-installiert → kein Schutz vor *erster* Eviction. (2) **A2HS-Onboarding mit Story-Beats**: iOS-Detection via `window.matchMedia('(display-mode: standalone)').matches` + UA-iOS; nach erstem Save Coach-Mark ”žKarriere sichern → zum Home-Bildschirm" mit Bild-Anleitung (Share-Icon → ”žZum Home-Bildschirm"). (3) **Export-Reminder ≤ 5 Tage**: Save-Management-Screen + In-App-Toast ”ž4 Tage nicht exportiert — jetzt sichern". (4) **Web-Push als Engagement-Trigger** (Safari 16.4+ und nur installiert): ”žDein Save läuft in 48 h ab". (5) **Telemetry-Flag** `iosBrowserModeSession` an ADR-0017-Pipeline → Dashboard.

**Verifikation.** Synthetic Playwright + iOS-Simulator: Save → Tab schließen → 7+ Tage Systemzeit simulieren → assert weg. Field-Telemetry: iOS-Safari-non-installed save-load-failure < 1 %.

### PM-2026-05-20-15-F-02 — QuotaExceededError mid-save on Floor-tier Android

```yaml
id: PM-2026-05-20-15-F-02
priority: P1
domain: browser-storage
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "storage_estimate_usage_ratio p95"
    threshold: "> 0.7"
  - metric: "save_write_quota_exceeded_rate per device-tier"
    threshold: "> 0.1 %"
mitigation_summary: "Pre-write quota probe; refuse Large-world creation on Floor; LRU eviction old replays at 70 % usage; refuse autosave at 90 %; explicit user UI"
linked_adrs: [[ADR-0002-offline-first]], [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
linked_specs: [[performance-budgets]], [[../pwa-offline-patterns]]
linked_code: ["packages/save-core/src/quota.ts", "apps/web/src/storage/dexie.ts"]
sources:
  - title: "Chrome Storage Buckets"
    url: "https://developer.chrome.com/docs/web-platform/storage-buckets"
    accessed: "2026-05-20"
    publisher: "Chrome for Developers"
    confidence: high
  - title: "MDN Storage quotas and eviction"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "web.dev Storage for the web"
    url: "https://web.dev/articles/storage-for-the-web"
    accessed: "2026-05-20"
    publisher: "web.dev"
    confidence: high
  - title: "RxDB IndexedDB max storage"
    url: "https://rxdb.info/articles/indexeddb-max-storage-limit.html"
    accessed: "2026-05-20"
    publisher: "RxDB"
    confidence: high
verification_notes: "Chromium 'up to 60 % disk' Soft-Cap, aber estimate() padded (MDN). Floor-Tier (3 GB RAM, < 2 GB frei): gemeldete Quota 9 GB, Write-Erfolg aber bei 80 MB scheitert wegen 80 % Gesamt-Disk-Pressure → LRU-Eviction."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend+platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Pre-write quota probe**: vor jedem Save `estimate()`; `free = quota - usage` vergleicht mit `serializedSize × 1.2`. Bei < Marge → Soft-Refuse mit UI ”žSpeicher fast voll, lösche alte Replays". (2) **LRU-Eviction-Tier in `save_blobs`**: Replays > 30 in-game years getaggt `cold_lru_eligible=true`. Bei `usage > 0.7 × quota` → automatic eviction bis < 0.5. (3) **World-Size-Refuse on Floor**: Floor-Tier kann Medium/Large öffnen aber NICHT erstellen; UI ”žDein Gerät ist für Small empfohlen". (4) **Atomic-Transaction-Recovery**: IndexedDB-Transactions atomar (Dexie 4); bei `QuotaExceededError` rollt zurück, vorheriger Save überlebt. UI ”žSpeicher voll" + Export-Anstoß. (5) **Storage-Buckets-API (post-MVP)**: Chrome 122+ stable; `career-buckets/main` trennt Save-Storage vom Asset-Cache. Firefox/Safari noch nicht; feature-detect + Fallback.

**Verifikation.** Vitest mit `fake-indexeddb` + Mock `quota=200MB` → assert Pre-write-Probe fängt ab. SLO `save_write_quota_exceeded_rate < 0.1 % p99 per device-tier-week`.

### PM-2026-05-20-15-F-03 — Brotli in `CompressionStream` nicht available auf Chrome ≤ 138 / Firefox ≤ 146

```yaml
id: PM-2026-05-20-15-F-03
priority: P3
domain: browser-storage
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "CompressionStream-with-brotli unsupported share"
    threshold: "Telemetry"
  - metric: "save_serialize_failed rate per browser-version cohort"
    threshold: "> 0.5 %"
mitigation_summary: "gzip via CompressionStream als universal floor (Chrome 80+/Firefox 113+/Safari 16.4+); Brotli opt-in feature-detected; niemals WASM-Brotli (681 KB Bundle)"
linked_adrs: [[ADR-0005-save-format]]
linked_specs: [[pwa-offline-patterns]]
linked_code: ["packages/save-core/src/compress.ts"]
sources:
  - title: "caniuse Brotli CompressionStream"
    url: "https://caniuse.com/mdn-api_compressionstream_compressionstream_brotli"
    accessed: "2026-05-20"
    publisher: "caniuse"
    confidence: high
  - title: "MDN browser-compat-data #26994"
    url: "https://github.com/mdn/browser-compat-data/issues/26994"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "Bugzilla Brotli CompressionStream Firefox"
    url: "https://bugzilla.mozilla.org/show_bug.cgi?id=1921583"
    accessed: "2026-05-20"
    publisher: "Mozilla"
    confidence: high
  - title: "WASM compression benchmarks (nickb.dev)"
    url: "https://nickb.dev/blog/wasm-compression-benchmarks-and-the-cost-of-missing-compression-apis/"
    accessed: "2026-05-20"
    publisher: "nickb.dev"
    confidence: medium
verification_notes: "Safari 18.4 (April 2025) shipped Brotli in CompressionStream; Firefox 147 release notes (late 2025) hat Brotli. Chromium hat Brotli-Content-Encoding seit Jahren, CompressionStream-API mit Brotli erst in jüngsten Versionen. WASM-Brotli ~681 KB Bundle-Cost."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **gzip als Floor**: `CompressionStream("gzip")` Chrome 80+/Firefox 113+/Safari 16.4+. Save-v1 committet sich auf gzip-Default; CR 25–30 %. (2) **Brotli als feature-detected upgrade**:
```ts
const supportsBrotliStream = (() => {
  try { new CompressionStream('brotli'); return true } catch { return false }
})()
```
Save-Envelope-Header speichert `compression: 'gzip' | 'brotli'`. (3) **Kein WASM-Brotli im Hot-Path**: 681 KB Bundle-Cost. Nur als Lazy-Import für Recovery (Import alter Saves mit Brotli, wenn User-Browser kein Native-Brotli). (4) Zstd post-MVP nicht riskieren (nicht in Safari/Firefox stable 2026).

**Verifikation.** Browser-Capability-Matrix Vitest; assert jeder Save-Read in mindestens gzip-Fallback. E2E Chrome 110 (gzip-only) + Chrome latest (brotli) + Safari 16.4/18.4 → Save-Write/Read round-trip.

### PM-2026-05-20-15-F-04 — Web-Worker OOM-Kill on 3 GB Android during live match

```yaml
id: PM-2026-05-20-15-F-04
priority: P2
domain: browser-performance
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "worker_terminated_unexpected_rate per device-tier"
    threshold: "> 1 % on Floor tier"
  - metric: "match_completion_rate"
    threshold: "< 95 % on Floor tier"
mitigation_summary: "Match-event-log chunked-flush ≤ 60 s wall-clock; Worker-heap target ≤ 50 MB on Floor; downgrade to Text & Stats bei first memory-pressure signal"
linked_adrs: [[ADR-0003-match-engine]]
linked_specs: [[performance-budgets]], [[../match-engine-runtime-strategy]]
linked_code: ["packages/match-engine/src/worker-entry.ts"]
sources:
  - title: "Android WebView OOM (WonderShare)"
    url: "https://drfone.wondershare.com/android-problems/fix-android-system-webview-crash.html"
    accessed: "2026-05-20"
    publisher: "WonderShare"
    confidence: medium
  - title: "Tab throttling in browsers"
    url: "https://aboutfrontend.blog/tab-throttling-in-browsers/"
    accessed: "2026-05-20"
    publisher: "About Frontend"
    confidence: medium
verification_notes: "Android System WebView ist single-process; OOM-Kill auf OS-Level bei free RAM Drop. Workers laufen im Renderer-Prozess → mit-killed."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: match-engine+platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Incremental-Flush**: Worker schreibt Event-Log alle 15 in-game-Min in `save_blobs`. Resume-Tokens im Header. Bei Kill weiterführen aus letztem Token. (2) **Floor-Tier zwingt Text & Stats** (per performance-budgets §6.1+§6.3). (3) **Memory-Pressure-API Hook** (Chromium 122+, post-MVP Origin-Trial): `level='critical'` → automatisch `background-fast`-Profile, Canvas pause, Snapshot persistieren. (4) **`performance.memory.usedJSHeapSize` Polling** (Chromium-only): alle 10 s; > 100 MB auf Floor sofort flushing + Profile-Downgrade + UI-Warn. (5) **Worker-Side `beforeunload`-Equivalent**: postMessage zur Main mit Snapshot-Pointer; bei hard-kill hilft das nicht, aber Incremental-Flush schon.

**Verifikation.** Chrome DevTools Memory-Pressure-Sim in Playwright. LambdaTest Phase 2 auf Galaxy A12 (3 GB) mit anderen Apps im Hintergrund, 90-min-Match → assert match_resumes_from_last_flush.

### PM-2026-05-20-15-F-05 — `navigator.deviceMemory` undefined auf iOS Safari + Firefox → tier mis-detection

```yaml
id: PM-2026-05-20-15-F-05
priority: P3
domain: browser-tiering
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - metric: "tier-distribution by user-agent"
    threshold: "> 80 % iOS in Floor"
  - signal: "Premium-iPhone users self-report 'feels low-fi'"
mitigation_summary: "Multi-signal tier detection; iOS via iOS-version + model heuristic; user-overridable downward; nie trust single signal"
linked_adrs: [[ADR-0008-mobile-first-ui]]
linked_specs: [[performance-budgets]]
linked_code: ["apps/web/src/core/device-tier.ts"]
sources:
  - title: "MDN Navigator.deviceMemory"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "Privacy Sandbox UA-CH"
    url: "https://privacysandbox.google.com/protections/user-agent"
    accessed: "2026-05-20"
    publisher: "Google"
    confidence: high
verification_notes: "MDN: 'Firefox and Safari don't implement [deviceMemory] — calling returns undefined.' Chromium rundet auf Power-of-2 für Fingerprint-Resistance."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Multi-signal Tier-Detection**: Chromium-Android `deviceMemory + hardwareConcurrency + UA-CH model`; iOS Safari `iOS-version (via UA-pattern) + iPhone-model-heuristik` (iOS ≥ 17 → Standard, iOS 16 → Floor, < 16 → off-target); Firefox `hardwareConcurrency + connection.effectiveType + saveData`. **Niemals einzelnes Signal**; `deviceMemory == undefined` ist *kein* Floor-Signal. (2) **User-overridable downward, nie upward**: Settings ”žForce Floor mode" (Battery-Saver-Hook) erlaubt; ”žForce Premium" verboten. (3) **Self-tuning loop**: Telemetrie FPS/INP pro Tier; systematische p95-Reissen auf UA-Cohort → Server-Config-Korrektur. (4) Test-Matrix: Mock-Navigator iOS 16/17/18, Firefox 110+, Chrome 110+, Samsung 22+.

**Verifikation.** Unit: `detectTier({deviceMemory: undefined, hardwareConcurrency: 6, ua: 'iPhone OS 17_0'}) === 'standard'`. Field: 90 % iOS-Sessions Standard/Premium (nicht Floor).

### PM-2026-05-20-15-F-06 — Service-Worker stale-cache nach PWA-Update wipes interactive state

```yaml
id: PM-2026-05-20-15-F-06
priority: P3
domain: browser-pwa
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "sw_update_to_controlling_latency p95"
    threshold: "Hoch nach Release"
  - metric: "sw_skip_waiting still=true in production"
    threshold: "true"
mitigation_summary: "skipWaiting:true → false; workbox-window update-prompt; Outbox+Autosave flush vor reload; toast mit explicit user action"
linked_adrs: [[ADR-0002-offline-first]]
linked_specs: [[pwa-offline-patterns]]
linked_code: ["apps/web/scripts/build-pwa.mjs", "apps/web/public/sw-register.js"]
sources:
  - title: "Workbox Handling service worker updates"
    url: "https://developer.chrome.com/docs/workbox/handling-service-worker-updates"
    accessed: "2026-05-20"
    publisher: "Chrome for Developers"
    confidence: high
  - title: "web.dev PWA Installation prompt"
    url: "https://web.dev/learn/pwa/installation-prompt"
    accessed: "2026-05-20"
    publisher: "web.dev"
    confidence: high
verification_notes: "Aktuelle SW: skipWaiting:true. Neuer SW übernimmt sofort, gecachte HTMLs ersetzen live laufenden — Update mitten im Spiel reißt unsaved State ab."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** workbox-window-Prompt + SKIP_WAITING-Message, Outbox-Flush vor Reload — wortwörtlich pwa-offline-patterns §5.3 umsetzen.

### PM-2026-05-20-15-F-07 — Network-flakiness EU mobile triggers half-synced state

```yaml
id: PM-2026-05-20-15-F-07
priority: P3
domain: browser-network
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "outbox_drain_failure_rate"
    threshold: "Spike"
  - metric: "online_event_to_drain_latency p95"
    threshold: "Hoch"
mitigation_summary: "Outbox-Pattern (ADR-0002); nie nur online-Event trusten; ping-based connectivity-check; exponential backoff"
linked_adrs: [[ADR-0002-offline-first]]
linked_specs: [[pwa-offline-patterns]]
linked_code: ["apps/web/src/sync/outbox.ts"]
sources:
  - title: "MDN NetworkInformation"
    url: "https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "WICG NetInfo"
    url: "https://wicg.github.io/netinfo/"
    accessed: "2026-05-20"
    publisher: "WICG"
    confidence: high
verification_notes: "navigator.onLine notoriously unreliable (true bei Captive-Portals). effectiveType in NetInfo gibt ECT Signal aber Safari/Firefox shippen es nicht."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: frontend
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) Outbox-Pattern aus pwa-offline-patterns §6.2 — nicht Background-Sync-API. (2) Connectivity-Probe vor Drain: HEAD `/health` mit 3 s Timeout. (3) `effectiveType`-Adaptive: bei `slow-2g` längere Backoff, Daten-Saver-Mode. (4) Background-Sync API später opt-in, niemals Single-Source-of-Truth.

### PM-2026-05-20-15-F-08 — WebAuthn / Passkey degradation auf iOS < 16 / Android < 9

```yaml
id: PM-2026-05-20-15-F-08
priority: P4
domain: browser-auth
probability: 2
impact: 4
score: 8
confidence: high
early_warning:
  - metric: "webauthn_create_failed_rate per device-tier"
    threshold: "Spike"
  - metric: "% users below WebAuthn-min-version"
    threshold: "> 5 %"
mitigation_summary: "Email-link OTP als universal Fallback; WebAuthn nice-to-have nie required; conditional-UI wenn supported"
linked_adrs: []
linked_specs: [[PM-2026-05-20-10-accessibility-and-inclusion]], [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
linked_code: ["apps/web/src/auth/webauthn.ts"]
sources:
  - title: "WebAuthn Passkeys Developer Guide 2025"
    url: "https://blog.magicauth.app/articles/webauthn-passkeys-developer-guide-2025"
    accessed: "2026-05-20"
    publisher: "Magic Auth"
    confidence: medium
  - title: "Passkeys compatibility (Authgear)"
    url: "https://www.authgear.com/post/passkeys-compatibility/"
    accessed: "2026-05-20"
    publisher: "Authgear"
    confidence: high
  - title: "WebAuthn Conditional UI (Corbado)"
    url: "https://www.corbado.com/blog/webauthn-conditional-ui-passkeys-autofill"
    accessed: "2026-05-20"
    publisher: "Corbado"
    confidence: high
verification_notes: "iOS 16 erste Version mit Passkeys; iOS 18+/Android 14+ third-party passkey-providers + conditional create. Conditional-UI Chrome/Edge/Safari/Firefox 122+."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: auth+frontend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** (1) **Auth-Floor = Email-Magic-Link**. Funktioniert auf jedem 16+ Browser. (2) **WebAuthn Capability-Detect**: `PublicKeyCredential && isUserVerifyingPlatformAuthenticatorAvailable()` → wenn true, biete Passkey an. (3) **Conditional-UI nur** Chrome/Edge/Safari 18+/Firefox 122+ via UA-CH; sonst klassischer Passkey-Login-Button. (4) **Cross-Device-Fallback**: QR-Code-CDA (WebAuthn-Hybrid-Transport) für Plattform-Wechsel. Email-Link bleibt Fallback.

**Verifikation.** E2E-Auth-Matrix Chrome/Safari 16/Safari 18/Firefox/Edge × Email + Passkey + CDA.

### PM-2026-05-20-15-F-09 — DevTools-edit of IndexedDB enables save-tampering trivially

```yaml
id: PM-2026-05-20-15-F-09
priority: P1
domain: browser-security
probability: 4
impact: 4
score: 16
confidence: high
early_warning:
  - "Report 05 flags this as 05-F-02 (Save-Forgery)"
mitigation_summary: "Save-envelope HMAC tied to server-issued installation key; trust_level field; server validiert bei Upload für async MP; client treats local saves as untrusted by default"
linked_adrs: [[ADR-0005-save-format]]
linked_specs: [[PM-2026-05-20-05-security-and-integrity]]
linked_code: ["packages/save-core/src/envelope.ts"]
sources:
  - title: "Pre-Mortem Report 05 (project-internal)"
    url: "docs/60-Research/pre-mortem/PM-2026-05-20-05-security-and-integrity.md"
    accessed: "2026-05-20"
    publisher: "internal"
    confidence: high
verification_notes: "Cross-Ref Report 05 05-F-02: AES-256-GCM-Envelope authentisiert 'Kenntnis des Keys' (im Bundle), nicht 'Herkunft'. DevTools → Application → IndexedDB editiert Save trivial."
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform+security
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Mitigation.** Per Report 05: Save-Schema-v2-trust_level + Server-side Validation für Async-MP. Hier nur Cross-Ref für Browser-Quirks-Lens.

## Browser-Support-Matrix (CORE OUTPUT)

| Browser | Min Version | Reason for Min | Notes |
|---|---|---|---|
| Chrome (Desktop) | 110 | ES2022, CompressionStream("gzip"), Service Worker, WebAuthn L2, IDB 3.0 | Brotli-in-CompressionStream später (~134+, exact TBD per #26994) |
| Edge (Desktop) | 110 | Chromium-equivalent | Windows Hello WebAuthn passthrough |
| Firefox (Desktop) | 113 | CompressionStream("gzip") (April 2023) | Brotli-CompressionStream nur 147+ (late 2025); kein `deviceMemory`; kein Storage-Buckets; Conditional-UI ab 122 |
| Safari (Desktop) | 16.4 | CompressionStream/gzip + Web Push (installed PWA) + Storage API | iOS 17/macOS Sonoma improved storage; Brotli-CompressionStream 18.4+ |
| Chrome (Android) | 110 | Chromium-baseline; `navigator.deviceMemory` available | Android-WebView-OOM auf Floor-Tier; aggressive bg-tab throttling |
| Samsung Internet | 22 | Chromium-100-class (early 2024); full SW + PWA + WebAuthn | v23 (Feb 2024) confirmed stable. Same PWA API als Chromium |
| Safari (iOS) | 16.4 | Web-Push-on-iOS milestone; Storage API; CompressionStream-gzip; A2HS-PWA-PushPermission | **7-day ITP eviction in browser mode; home-screen-installed exempt.** EU DMA iOS 17.4+ alternative engines möglich |
| **Off-target hard-block** | < Chrome 110 / Firefox 113 / Safari 16 | Missing IDB v3, CompressionStream, Web Crypto SubtleCrypto AES-GCM-256, ES2022 | Statische HTML "your browser is outdated" |
| **IE / Edge Legacy** | Any | Frozen 2022; no SW, no IDB 2+ | Hard-block. No polyfill |

## Compression-Comparison (CORE OUTPUT)

| Algorithm | Browser-Native | CR vs raw JSON | CPU 1MB Pixel-4a | Bundle | Recommendation |
|---|---|---|---|---|---|
| **gzip** (CompressionStream) | Chrome 80+, FF 113+, Safari 16.4+ | ~75–80 % | ~30–50 ms | 0 KB | **MVP default — universal floor** |
| **deflate-raw** | Same as gzip | ~73–78 % | ~25–40 ms | 0 KB | nur bei header-less wire-format |
| **Brotli** (CompressionStream) | Safari 18.4+, FF 147+, Chrome very recent | ~80–85 % | ~60–120 ms | 0 KB | **Opt-in feature-detect post-MVP** |
| **Brotli (WASM)** | Universal | ~80–85 % | ~120–250 ms | **~681 KB** | **Last-resort recovery only** |
| **LZ-String** | Universal (JS) | ~50–60 % | ~50–100 ms | ~5 KB | nur wenn Stream/Blob-APIs vermieden |
| **Zstd** | Not in CompressionStream 2026 | ~80–85 % | Fast | ~150–300 KB WASM | Skip |

**Decision**: Save-v1 = **gzip via CompressionStream**. Save-v2 (post-MVP) = Brotli feature-detected opt-in. `compression` Header dokumentiert.

## Storage-Strategy-Decision-Tree

```
On app boot:
  1. Detect signals: navigator.storage.estimate(), display-mode, UA
  2. Tier-detection (multi-signal, F-05)
  3. Persistence: navigator.storage.persist() nach erstem Save → meta.persistGranted
     Surface "Saves may be evicted"-Chip if !granted && iOS && !installed
  
On save-write:
  1. Compute serialized+gzipped size
  2. estimate() → free = quota - usage
  3. If free < 1.5× serializedSize:
     a. LRU-Eviction cold replays
     b. Recompute
     c. Still insufficient → refuse "Storage full, export+delete"
  4. Write in atomic Dexie 'rw' transaction
  5. On QuotaExceededError: rollback, UI "Save failed — storage full", telemetry
  
On iOS browser-mode (display-mode !== 'standalone'):
  1. One-time educational toast A2HS
  2. Re-show every 3 days while not installed
  3. Track install-rate per cohort
  
On shutdown / visibility-hidden:
  1. Flush outbox
  2. Flush autosave
  3. Show "Don't forget to export" if last-export > 5 days

On Storage-Pressure (Chromium 122+):
  → Eject cold replays first, then ask user
```

## Quantitatives Modell

**Save-Size-Growth (gzip, refined from Welle-2-Report-12):**

| In-game Jahr | Snapshot raw | Snapshot gzip | Snapshot brotli | Events (cold-tier) | Total IDB |
|---|---|---|---|---|---|
| y1 | ~250 KB | ~60 KB | ~45 KB | ~50 KB | ~110 KB |
| y10 | ~700 KB | ~170 KB | ~125 KB | ~400 KB | ~570 KB |
| y30 | ~1.6–2.5 MB | ~400–630 KB | ~300–470 KB | ~1.0 MB | ~1.5–1.7 MB |
| y50 | ~3 MB | ~750 KB | ~560 KB | ~1.8 MB | ~2.6 MB |

Plus PWA-Precache (≤ 5 MB), optionale Country-Packs (≤ 30 MB), Engine-Versionen (≤ 5 MB). **Worst-Case y50 Large-World Premium-engaged**: ~50 MB. Soft-Cap 300 MB OK auf jedem Tier außer Floor + Android-Disk-Pressure.

**IndexedDB Cold-Start-Latency Pixel-4a (gzip + decompress + Zod):**

| Save | gzip read | decompress | parse + hydrate | total |
|---|---|---|---|---|
| 60 KB (y1) | ~15 ms | ~10 ms | ~30 ms | **~55 ms** |
| 170 KB (y10) | ~25 ms | ~25 ms | ~80 ms | **~130 ms** |
| 630 KB (y30) | ~60 ms | ~80 ms | ~250 ms | **~390 ms** |
| 750 KB (y50) | ~80 ms | ~95 ms | ~300 ms | **~475 ms** |

Performance-budgets §9.2 "Save deserialization ≤ 800 ms Large save" — tight auf Floor.

**Storage-Quota Soft-Limits 2026 (MDN + WebKit):**

| Browser | Best-effort | Persistent | Per-origin-cap Heuristik |
|---|---|---|---|
| Chrome (Desktop) | ~60 % Disk | ~60 % Disk | Eviction ab ~80 % global pressure |
| Chrome (Android) | ~60 % Disk | ~60 % Disk | OOM-kill aggressiver auf < 4 GB |
| Firefox | 10 % Disk / 10 GiB Group-Cap | bis 50 % Disk, 8 TiB Cap | Group-Cap shared mit eTLD-Origins |
| Safari iOS 17+ (browser/A2HS) | ~60 % Disk | Heuristik, kein Prompt | **7-day ITP eviction in browser mode**; A2HS exempt |
| Safari embedded WKWebView | ~15 % Disk | n/a | Refuse new saves |
| Samsung Internet | Chromium-equiv | Chromium-equiv | Same as Chrome Android |

## SLO-Vorschläge

| SLO | Ziel | Window |
|---|---|---|
| **iOS save-loss-rate** | < 0.5 % iOS-DAU | 30 d |
| **QuotaExceededError rate** | < 0.1 % save-writes (alle Plattformen) | 7 d |
| **Save round-trip integrity** (write → read → bit-equal) | 100 % über alle supported browser versions | per release |
| **Tier-misdetection rate** (FPS p95 < target × 0.6 für 30 s) | < 5 % Sessions per tier | 14 d |
| **PWA-install-rate iOS-first-week** | ≥ 25 % (Lever für F-01) | 7 d after activation |

## Test-Plan

**Phase 1 (MVP, emulated):**
- Vitest + `fake-indexeddb` Matrix: alle Migrators × Quota-Overflow-Sim × Envelope-Corruption × Browser-Capability-Mock.
- Playwright auf Chromium-CI: install PWA flow, offline-reload, save/load/import/export round-trip.
- Lighthouse-CI: `installable-manifest` audit must pass.
- Bundle-size-CI: assert `brotli-wasm` nie in initial chunk (dynamic-import only).
- Capability-feature-detect Unit-Tests: jeder `CompressionStream`, `WebAuthn`, `Storage API`, `deviceMemory`, `connection`-Usage covered.

**Phase 2 (post-MVP nightly real-device):**
- LambdaTest: Galaxy A12 (3 GB Floor), Galaxy A54 (Standard), Pixel 7a (Standard), iPhone 11 (Standard iOS), iPhone SE 3, iPhone XS (Floor iOS), Samsung Internet auf Galaxy S.
- Storage-Bloat: y50 Large + 10 Replays auf each device; assert kein QuotaExceededError on Standard, graceful refuse on Floor.
- 7-day Eviction synthetic: programmatic clock-skew iOS-Sim für F-01 Mitigation-Validation.
- Web-Worker OOM: 90-min Sim mit 100 MB synthetic heap → graceful Profile-Downgrade + match resume.

**Phase 3 (only if needed):**
- Hardware-Rig per performance-budgets §11.4.
- Manual Pen-Test DevTools-IDB-Tampering per Report 05 F-02.

## Runbook-Skizzen

### RB-15-A: IndexedDB-Quota-Exceeded-Spike
**Trigger**: `save_write_quota_exceeded_rate > 0.5 %` (P2).
**Symptom**: Cohort (Floor-Android oder iOS-old-iPhone) kann nicht speichern.
1. Telemetry-Breakdown per Tier + Browser.
2. Floor-Android: `storage.estimate()` ratio p95 > 0.7 → LRU-Eviction-Tuning aggressiver.
3. iOS: 7-day-ITP-Eviction nicht actual cause (F-01) verifizieren.
4. Hotfix: Remote-Config-Flag `auto_lru_threshold = 0.6`.
5. UX: In-App ”žStorage full" Deep-Link zu Export+Delete-Management.
6. Status-Page-Notify; ETA < 24 h.
Postmortem: > 5 affected users.

### RB-15-B: iOS-Safari 7-Day-Eviction wiped saves
**Trigger**: `save_load_failed.reason=envelope_missing` + iOS Safari + display-mode=browser (P2 Datenverlust).
1. 7-day-no-interaction-Pattern in Session-Log validieren (ohne PII per ADR-0017).
2. Bulk-Check: Cohort-Größe, % iOS-DAU affected.
3. Bei > 0.5 %: In-App-Banner global ”žiOS users: install to home screen".
4. A8HS-Onboarding-Redesign-Sprint re-priorisieren.
5. Email-Comms an Affected (falls Email captured): ”žwe've lost data, here's how to prevent it".
6. `persist()` granted-rate per cohort validieren.
Postmortem: jede Occurrence (Datenverlust = high-trust risk).

### RB-15-C: Web Worker OOM auf Floor Android
**Trigger**: `worker_terminated_unexpected_rate > 1 %` on Floor (P3).
**Symptom**: Matches abort mid-90-min auf 3 GB Android.
1. Confirm Cohort: < 4 GB RAM + Chromium WebView.
2. Verify Incremental-Flush-Coverage (last-flush-token-Freshness).
3. Hotfix: Default-Profile competitive-full → interactive-standard auf Floor (remote-config).
4. Push Update mit strikterem Heap-Pressure-Threshold (50 MB statt 100 MB).
5. Changelog erwähnt Stability-Fix.
Postmortem: > 2 % rate > 24 h.

## Future-scope decisions (classified future-scope)
1. **Chrome-min-version für Brotli-in-CompressionStream**: exact Chromium milestone undocumented (#26994 open). Capability-Check in Tracer-Build vor Brotli-Reliance.
2. **Storage-Buckets-API als primary save namespace post-MVP?** Chrome-only stable; Firefox/Safari kein Signal. Polyfill-or-skip-Pfad. 3-Mo-Observation vor Commitment.
3. **Memory-Pressure-API origin trial**: stable enough 2026-Q3 für match-engine-wiring? Chrome-only experimental.
4. **iOS DMA fork**: 2026 EU users *might* Gecko/Blink-on-iOS via DMA alternative engines (iOS 18.2+). Detect-and-adapt nur when telemetry > 1 % EU-iOS.
5. **`prefers-reduced-data` Media Query**: Chromium-only 2026. Honoring sinnvoll, nicht blocking.
6. **OPFS-as-secondary-store**: per pwa-offline-patterns §10 — recommend against. Confirm at start of Welle-3.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **F-01 first.** iOS-Safari-7-Day-Eviction = P0 Datenverlust auf 30 % Mobile-Markt. Aggressive A2HS-Onboarding + `persist()` + 5-Tage-Export-Reminder **vor** iOS-Public-Launch. Ohne das wird iOS-User-Gain aus Wave-2 zu 1-Star-Refund-Reviews.
2. **F-02 + F-03 zusammen: gzip-CompressionStream jetzt, Brotli später.** Save-v1 mit `CompressionStream("gzip")` + capability-feature-detect; Pre-Write-Quota-Probe + LRU-Eviction *bevor* Large-Worlds erlaubt werden. Schützt Floor-Android vor `QuotaExceededError`. Foundation, die Welle-2-Report-12 schon annahm.
3. **F-05 Multi-Signal-Tier-Detection.** Ohne das iOS-Premium-User = Floor-Experience = Engagement-Crater. 1-Tag-Fix, höchster Hebel pro Stunde.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-15-F-NN`. Aggregat: [[findings-registry]].
## Related

- [[00-index]]
- [[findings-registry]]
- [[PM-2026-05-20-05-security-and-integrity]]
- [[PM-2026-05-20-07-live-ops-and-client-telemetry]]
- [[PM-2026-05-20-12-long-term-balance-and-meta]]
- [[../performance-budgets]]
- [[../pwa-offline-patterns]]
