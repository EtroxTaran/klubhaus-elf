---
title: Raw Source Checks - PWA Offline Mobile Release Content QA
status: raw
tags: [research, raw, source-check, pwa, offline, mobile, service-worker, workbox, rollback, content-qa, localization, llm, fmx-197]
created: 2026-06-15
updated: 2026-06-15
type: raw-research
binding: false
linear: FMX-197
related:
  - [[../pwa-offline-mobile-release-content-qa-gates-2026-06-15]]
  - [[raw-pwa-offline-mobile-release-content-qa-2026-06-15]]
  - [[../../40-Quality/pwa-offline-mobile-release-content-qa-gates]]
  - [[../../10-Architecture/09-Decisions/ADR-0124-pwa-offline-mobile-release-content-qa-gates]]
  - [[../../40-Execution/fmx-197-pwa-offline-mobile-release-content-qa-decision-queue-2026-06-15]]
---

# Raw Source Checks - PWA Offline Mobile Release Content QA

## Primary/high-signal checks

### MDN Storage quotas and eviction criteria

URL: <https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria>

Checked on 2026-06-15.

Grounded points:

- IndexedDB and Cache API are origin storage surfaces; quotas and eviction
  mechanisms differ by browser.
- Browser storage defaults to best-effort unless persistent storage is granted.
- `navigator.storage.persist()` can request persistent storage; browsers decide
  permission differently.
- `navigator.storage.estimate()` reports approximate usage/quota.
- Storage writes can fail with `QuotaExceededError` and must be handled.
- Eviction may remove all origin data together; partial origin eviction should
  not be assumed.
- Safari may proactively evict script-created data for origins without recent
  user interaction.

FMX implication: the offline contract must be budgeted, recoverable and honest.
No player-facing copy may imply that browser-local data is durable authority.

### web.dev offline data

URL: <https://web.dev/learn/pwa/offline-data>

Checked on 2026-06-15.

Grounded points:

- PWA storage includes multiple APIs: Cache Storage, IndexedDB, Web Storage and
  the service worker/dependencies.
- Storage capacity is shared across these surfaces and varies by browser.

FMX implication: release evidence needs combined cache plus IndexedDB budgets,
not isolated checks per API.

### Chrome/Workbox service worker update handling

URLs:

- <https://developer.chrome.com/docs/workbox/handling-service-worker-updates>
- <https://developer.chrome.com/docs/workbox/remove-buggy-service-workers>
- <https://developer.chrome.com/docs/workbox/understanding-storage-quota>
- Context7 `/googlechrome/workbox`, queried 2026-06-15.

Grounded points:

- By default, an installed updated service worker waits until existing
  controlled tabs close or navigate.
- `workbox-window` can detect a waiting service worker and prompt the user to
  reload; after acceptance it can message `SKIP_WAITING`.
- The docs explicitly note that apps may need to persist transient state before
  reload.
- Workbox's storage quota guidance recommends cache limits through
  `ExpirationPlugin` and marks `purgeOnQuotaError` as useful for caches that
  are safe to delete.
- Chrome documents deploying a no-op service worker at the same URL as a
  recovery path for buggy service workers; `Clear-Site-Data` can be an
  additional measure but is not universally supported and clears origin
  storage.

FMX implication: use user-mediated update activation for stateful sessions,
keep `sw.js` stable, preserve no-op/rescue procedure and never treat
`Clear-Site-Data` as a routine rollback because it can delete drafts/caches.

### Google Play staged rollouts

URL: <https://support.google.com/googleplay/android-developer/answer/6346149>

Checked on 2026-06-15.

Grounded points:

- Play Console staged rollouts use a rollout percentage.
- A rollout can be increased, halted and resumed.
- Halting means no additional users receive that version; users who already got
  it remain on it.
- Google recommends monitoring crash reports and user feedback during staged
  rollout.

FMX implication: PWA/web release gates should copy the principle, not the store
mechanism: staged exposure, halt criteria, monitoring and a fix-forward/rollback
path.

### Apple phased release

URL: <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/>

Checked on 2026-06-15.

Grounded points:

- App Store Connect phased release gradually releases eligible automatic
  updates over seven days: 1%, 2%, 5%, 10%, 20%, 50%, 100%.
- Phased releases can be paused for up to 30 total days.
- Apps can also be released to all users.

FMX implication: a concrete staged-release ladder and pause budget is a good
model for release evidence even before native wrappers exist.

### Microsoft pseudolocalization

URL: <https://learn.microsoft.com/en-us/globalization/methodology/pseudolocalization>

Checked on 2026-06-15.

Grounded points:

- Pseudolocalization verifies localizability before real translation.
- Pseudotranslation can add accents/scripts, expand strings, add delimiters and
  add identifiers.
- Microsoft recommends early and sustained pseudo testing; it helps reveal
  truncation, concatenation, font and formatting issues.

FMX implication: content QA should include pseudo-loc as a release gate before
real translation and before mobile layout acceptance.

### OWASP LLM Prompt Injection Prevention

URL: <https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html>

Checked on 2026-06-15.

Grounded points:

- Prompt injection happens when user/content data changes intended LLM
  behavior because instructions and data are not clearly separated.
- OWASP lists direct, indirect/remote, encoded/obfuscated, HTML/Markdown,
  multi-turn, prompt-extraction, data-exfiltration and RAG-poisoning attacks.
- Primary defenses include input validation/sanitization, structured prompt
  separation, output validation/monitoring and human-in-the-loop controls.

FMX implication: generated content and any later runtime LLM surface need
prompt-injection and output-validation gates. MVP content should stay
template-first and reviewable.

### Football Manager 25 cancellation

URL: <https://www.footballmanager.com/news/development-update-football-manager-25-1>

Checked on 2026-06-15.

Grounded points:

- Sports Interactive publicly cancelled FM25 after delays.
- The statement says the overall player experience and interface were not at
  the required standard despite progress in many areas.
- SI explicitly rejected releasing and fixing later, and shifted focus to the
  next release.

FMX implication: the safe precedent is quality-gate discipline, not private
internal process. A management game can preserve trust by not shipping
substandard UX/content even when release timing is painful.

## Claims kept as inference, not source fact

- "Content packs should be signed/manifested" is an FMX best-practice
  recommendation derived from software supply-chain, app release and live-game
  content patterns. It is not attributed to a specific studio.
- "Rescue SW that re-pins N-1 assets" is an FMX release-runbook inference. The
  primary source confirms a no-op SW recovery path, not FMX's exact rollback
  mechanics.
- "Football Manager separates data/content from code internally" is not
  claimed. Publicly safe statements are limited to announced patches,
  data/save-compatibility information and the FM25 cancellation record.

## Source-quality summary

| Source | Use in packet | Reliability |
|---|---|---|
| MDN storage quotas | Storage/quota/eviction contract | Primary/high |
| web.dev offline data | Combined storage surfaces | Primary/high |
| Chrome/Workbox docs + Context7 | SW lifecycle, update prompt, no-op recovery, quota cleanup | Primary/high |
| Google Play Help | Staged rollout/halt/monitor precedent | Primary/high |
| Apple Developer Help | Phased release/pause precedent | Primary/high |
| Microsoft Learn | Pseudo-localization QA | Primary/high |
| OWASP Cheat Sheet | Prompt-injection/content safety gates | High-signal security guidance |
| Football Manager official statement | Game-quality precedent | Primary for public SI statement |
