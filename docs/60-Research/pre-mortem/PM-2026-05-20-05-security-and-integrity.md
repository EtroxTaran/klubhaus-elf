---
title: "Pre-Mortem 2026-05-20 Â· 05 Â· Security & Integrity"
status: current
tags: [research, pre-mortem, security, integrity, anti-tamper, save-format, anti-cheat, 2026-Q2]
created: 2026-05-20
updated: 2026-05-22
type: research
binding: false
report_id: PM-2026-05-20-05
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[threat-model]]
  - [[PM-2026-05-20-01-architecture]]
  - [[PM-2026-05-20-02-tech-and-ops]]
  - [[PM-2026-05-20-03-gameplay]]
  - [[PM-2026-05-20-04-monetization]]
  - [[PM-2026-05-20-06-distributed-match-compute]]
  - [[../determinism-and-replay]]
  - [[../gdpr-compliance]]
  - [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/rate-limiting-anti-abuse]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Pre-Mortem 2026-05-20 Â· 05 Â· Security & Integrity

> **Failure-Headline-Kandidaten**
> - â€žEin Tampering-Skandal zerstÃ¶rte das Vertrauen in async Liga-Resultate â€” 60 % der Premium-Spieler kÃ¼ndigten."
> - â€žEin Save-Forgery-Tool kursierte im Discord â€” Hall of Fame war Wochen lang unbenutzbar."
> - â€žEin npm-Supply-Chain-Angriff schleuste Code in die Match-Engine ein â€” wir mussten wochenlang offline gehen."
> - â€žEine DSGVO-Anfrage zu einem gelÃ¶schten Account ergab, dass PII in Loki-Logs steckte â€” BuÃŸgeld + Reputationsschaden."

## Scope

Querschnittlicher Synthese-Report zu Security, Daten-IntegritÃ¤t und Anti-Cheat. BÃ¼ndelt alles, was Tampering / Save-Import-Export / Crypto / Anti-Cheat betrifft, statt es Ã¼ber die vier DomÃ¤nen-Reports zu verteilen. Verweist auf domÃ¤nenspezifische Findings in 1â€“4 (insbesondere deren Iteration-2-Addenda), ergÃ¤nzt sie um eigene querschnittliche Findings F-01â€¦F-12.

**Trust-Modell.** Siehe [[threat-model]] fÃ¼r Zonen, Assets, Adversare und STRIDE-Matrix. Dieser Report operationalisiert das Threat-Model in konkrete Pre-Mortem-Findings.

**Leitsatz.** Single-Player ist das Fundament â€” aber jedes Datenformat ist so designed, dass es auch unter Z4-Vertrauen trÃ¤gt. Ein Stack mit zuschaltbarem Trust-Level.

## Top Failure-Hypothesen

Jede Failure-Hypothese erhÃ¤lt eine immutable ID (`PM-2026-05-20-05-F-NN`) zur Verkettung mit Fixes â€” siehe `## Verfolgung & Verkettung` am Ende.

---

### PM-2026-05-20-05-F-01 â€” Save-Format authentisiert Kenntnis, nicht Herkunft

```yaml
id: PM-2026-05-20-05-F-01
domain: security
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "save_import_schema_mismatch_total"
    threshold: "Spike > 50/day"
  - metric: "save_export_unsigned_total"
    threshold: "> 0 in prod build"
mitigation_summary: "Save-Schema v2: trust_level + Server-HMAC + Command-Log-Merkle-Root + Engine-Bundle-Hash"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0005-save-format]]]
linked_specs: [[[threat-model]]]
linked_code:
  - "packages/save-format/ (geplant)"
  - "apps/web/src/save/import.ts (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** ADR-0005 spezifiziert AES-256-GCM-Envelope mit PBKDF2-KDF aus `accountSecret + deviceSalt`. AES-GCM authentifiziert *Kenntnis des SchlÃ¼ssels*, **nicht** *Herkunft* oder *Server-Approval*. Wer einen lokalen Save entschlÃ¼sselt, modifiziert und neu verschlÃ¼sselt â€” kann ihn ohne Server-Spur einspielen und beansprucht "verified" weil der Envelope intakt ist.

**FrÃ¼hwarnindikatoren.** Save-Import-Schema-Mismatch-Spike (Forger-Tool im Umlauf). Existenz unsigner Exports in Production-Builds.

**Mitigation.** Save-Schema v2 (siehe Â§Save-Format unten): Pflichtfelder `schema_version`, `save_id` (UUIDv7), `command_log_merkle_root`, `engine_bundle_hash`, `trust_level`, `server_hmac` (optional, vorhanden iff cloud-synced). Importe ohne Server-HMAC bekommen `trust_level: unverified` und sind von Leaderboards/Hall-of-Fame ausgeschlossen. ADR-0028 ratifiziert das.

**Verifikation.** Tampering-Test-Suite (siehe Â§Load-Tests): 12 Mutation-Klassen werden gegen den Import-Pfad geworfen; jede muss `reject` oder `unverified` ergeben.

---

### PM-2026-05-20-05-F-02 â€” Commands sind nicht signiert / nicht replay-geschÃ¼tzt

```yaml
id: PM-2026-05-20-05-F-02
domain: security
scenario: [single-node-hetzner, cloud-autoscaling]
probability: 5
impact: 5
score: 25
confidence: high
early_warning:
  - metric: "cmd_signature_invalid_total"
    threshold: "> 1% of commands"
  - metric: "cmd_nonce_replay_total"
    threshold: "> 0"
mitigation_summary: "Ed25519-signierte Commands, UUIDv7 Command-IDs, Nonce-Bloom-Filter, signiertes CommandReceipt"
linked_adrs: []
linked_specs: [[[threat-model]], [[../../30-Implementation/auth-flows]], [[../../30-Implementation/session-management]]]
linked_code:
  - "apps/web/src/transport/command-bus.ts (geplant)"
  - "apps/web/src/server/command-router.ts (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Aktuell vertrauen Server-Routen der Session und akzeptieren JSON-Bodies. Ein authentifizierter Spieler kann via DevTools beliebige Commands ausfÃ¼hren (z. B. â€žVertrag mit -1 â‚¬ Wage abschlieÃŸen"); ein passiver Beobachter kann Commands replay'en, wenn Session-Cookies leaken.

**FrÃ¼hwarnindikatoren.** `cmd_signature_invalid_total`, `cmd_nonce_replay_total`.

**Mitigation.** Command-Bus mit Pflichtfeldern:
```
{ commandId: UUIDv7, payload: { â€¦ }, nonce: BLAKE3-128(commandId||clientTime||deviceKey),
  clientTime: ISO, deviceKey: ed25519-pub, signature: ed25519(commandId||payload||nonce||clientTime) }
```
Server prÃ¼ft Signatur, Nonce-Freshness (30-Tage-Bloom-Filter), Sender-Authorization, Time-Skew (< 60 s). Antwortet mit `CommandReceipt(commandId, serverTime, resultingStateHash, serverSig)`. Client validiert & speichert fÃ¼r spÃ¤teren Replay-Beweis. ADR-0026 ratifiziert.

**Verifikation.** Penetration-Test: forged Commands, replay'd Commands, expired Nonces â€” alle mÃ¼ssen `reject`.

---

### PM-2026-05-20-05-F-03 â€” Determinismus-CI-Gate fehlt â†’ Anti-Cheat-Foundation brÃ¶ckelt

```yaml
id: PM-2026-05-20-05-F-03
domain: security
scenario: [both]
probability: 4
impact: 5
score: 20
confidence: high
early_warning:
  - metric: "determinism_replay_mismatch_total"
    threshold: "> 0 in CI or prod"
mitigation_summary: "1000-Seed-Replay-Diff im CI als blocking gate; Engine-Bundle-Hash pinning"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]]
linked_specs: [[[../determinism-and-replay]], [[../../50-Game-Design/GD-0002-match-engine]]]
linked_code:
  - "packages/match-engine/src/"
  - ".github/workflows/ci.yml"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne automatisierten Replay-Diff im CI kann ein versehentlicher `Math.random()`, `Date.now()` oder eine nicht-deterministische Bibliotheksaufruf in der Match-Engine Ã¼ber Wochen unentdeckt bleiben. Das *zerstÃ¶rt Anti-Cheat-Foundation*: Server kann eingehende Resultate nicht mehr re-simulieren, BYOC-Validatoren divergieren, Replays bei Bug-Reports sind nicht reproduzierbar.

**FrÃ¼hwarnindikatoren.** CI-Failure `determinism_replay_mismatch_total > 0`.

**Mitigation.**
1. CI-Job â€žDeterminism Gate": 1.000 fixe Seeds Ã— Replay Ã— Bit-Equal-Assert.
2. Stryker-Mutation darf den Determinism-Test nicht Ã¼berleben (separate non-mutated â€žintegrity"-Test).
3. Semgrep-Regel: `Math.random|Date.now|Date()` in `packages/match-engine/**` ist blocker.
4. Engine-Bundle-Hash bei jedem Build, in jedem Match-Record gespeichert.

**Verifikation.** Synthetische Mutation in `match-engine` (z. B. eine Stelle `Math.random()` einfÃ¼gen) â†’ CI muss innerhalb 1 Run blocken.

---

### PM-2026-05-20-05-F-04 â€” Save-Import als Deserialisierungs-/Exploit-Vektor

```yaml
id: PM-2026-05-20-05-F-04
domain: security
scenario: [both]
probability: 4
impact: 4
score: 16
confidence: medium
early_warning:
  - metric: "save_import_validation_error_total"
    threshold: "Spike > 100/day"
  - metric: "save_import_oversize_reject_total"
    threshold: "> 0 â†’ Investigate"
mitigation_summary: "Strikter Zod-Schema-Validator, Size-Limit 50 MB, Object.create(null), kein eval/Function"
linked_adrs: []
linked_specs: [[[threat-model]]]
linked_code:
  - "apps/web/src/save/import.ts (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Community-Import erlaubt Beliebige-JSON-aus-Internet. Ohne strikte Validierung sind Prototype-Pollution, Hash-Collision-DoS, ZIP-Bomben (komprimierte Saves), Resource-Exhaustion (gigantische Spielerlisten) und Code-Execution via gefÃ¤hrliche Helper realistische Angriffe.

**FrÃ¼hwarnindikatoren.** Spike an Validation-Errors / Oversize-Rejects.

**Mitigation.**
1. Zod / typia Schema mit `strict: true`, `passthrough: false`.
2. Size-Limit hart (50 MB) bevor Parsing beginnt.
3. `Object.create(null)` fÃ¼r interne Maps, niemals `Object.assign({}, untrusted)`.
4. Kein `eval`, kein `Function`-Konstruktor, kein dynamisches `import()` aus User-Data.
5. Property-Whitelist statt Blacklist; unbekannte Felder werden gestrippt, nicht durchgereicht.
6. Fuzz-Test mit `fast-check` Ã¼ber mutierte JSON-Inputs.

**Verifikation.** Fuzz-Suite lÃ¤uft 1.000 Iterationen ohne Crash / OOM / Eskalation.

---

### PM-2026-05-20-05-F-05 â€” Supply-Chain (npm + Container) unkontrolliert

```yaml
id: PM-2026-05-20-05-F-05
domain: security
scenario: [both]
probability: 4
impact: 5
score: 20
confidence: medium
early_warning:
  - metric: "renovate_critical_advisories_open"
    threshold: "> 0 for > 7 days"
  - metric: "sbom_diff_unexpected_dep_total"
    threshold: "> 0 per release"
mitigation_summary: "SBOM, cosign-signed Container, Renovate-QuarantÃ¤ne, pnpm audit als CI-Gate"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/secrets-management]]]
linked_code:
  - ".github/workflows/ci.yml"
  - "Dockerfile"
  - "package.json"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Manager-Sim ist High-Profile-Ziel fÃ¼r Supply-Chain (Long-Tail-Spieler-Basis, hohe Spielzeit, Live-Service). npm-Compromise einer Lib in match-engine oder web-Build ist katastrophal â€” Determinismus-Garantie bricht still, kompromittierter Code lÃ¤uft auf jedem Client.

**Mitigation.**
1. `pnpm install --frozen-lockfile` in CI.
2. `pnpm audit --audit-level=high` als blocking gate.
3. SBOM (CycloneDX) je Release-Tag; `sbom-diff` als nicht-blocking Warning bei unerwarteten neuen Deps.
4. Container-Images mit `cosign` signiert; Dokploy/Deployment akzeptiert nur signierte Images.
5. Renovate-Bot in QuarantÃ¤ne-Branch + 72 h Cooldown vor Auto-Merge.
6. Critical Path Libs (`pure-rand`, `match-engine`-deps) auf Lock-Pin + Manual-Approval.

**Verifikation.** Tabletop: simulierter npm-Compromise einer Dep â†’ wie schnell entdecken wir es? (Ziel: < 7 Tage.)

---

### PM-2026-05-20-05-F-06 â€” Bounded-Context-Grenzen ohne Authorization-Checks

```yaml
id: PM-2026-05-20-05-F-06
domain: security
scenario: [both]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "context_authz_denied_total"
    threshold: "Sudden drop to 0 = Check is missing"
mitigation_summary: "Pro Context-Eintritt expliziter Authorization-Check; Audit-Log mit Caller-Identity"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/**/handlers/*.ts (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Im Modular-Monolith ist es leicht, von Context A in Context B zu rufen ohne Authorization-Check zu wiederholen. Ein kompromittierter Edge-Handler wird zum Lateral-Movement-Vektor. Auch ohne Compromise: ein Bug in Context A's Eingangs-Validierung wirkt sich auf Context B aus.

**Mitigation.**
1. Pflicht-Middleware: jeder Context-Handler beginnt mit `authz.check(caller, action, resource)`.
2. Audit-Stream: jeder Cross-Context-Call wird mit Caller-Identity + Action geloggt.
3. Static-Check (madge / custom Lint): Direct-Imports zwischen Contexts â†’ Fehler (nur Ã¼ber deklarierte Public Bus).

---

### PM-2026-05-20-05-F-07 â€” Webhook-Forgery (Payment, GitHub, MCP)

```yaml
id: PM-2026-05-20-05-F-07
domain: security
scenario: [cloud-autoscaling]
probability: 3
impact: 5
score: 15
confidence: high
early_warning:
  - metric: "webhook_signature_invalid_total"
    threshold: "> 0"
mitigation_summary: "Webhook-Signaturen prÃ¼fen (Stripe `stripe-signature`); Idempotenz via eventId; IP-Allow-List wo mÃ¶glich"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-04-monetization]]]
linked_code:
  - "apps/web/src/server/webhooks/* (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Webhook-Endpoints (Stripe-IPN, GitHub-MCP fÃ¼r Auto-PR-Reviewer, sentry-glitchtip-Alerts) sind Ã¶ffentlich erreichbar. Ohne Signatur-Validation kann ein Angreifer â€žbezahlte" Entitlements grant'en oder Audit-Log-Spam verursachen.

**Mitigation.** Stripe `stripe-signature` Header prÃ¼fen mit Webhook-Secret; Idempotenz via `eventId` aus Payload (30 Tage Replay-Window); WebHook-Receiver hinter Cloudflare mit IP-Allow-List wo Provider statisch.

---

### PM-2026-05-20-05-F-08 â€” Audit-Log lÃ¼ckenhaft / nicht durchsuchbar

```yaml
id: PM-2026-05-20-05-F-08
domain: security
scenario: [both]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "audit_event_drop_total"
    threshold: "> 0"
  - metric: "incident_forensic_blind_spot_total"
    threshold: "Nach jedem Incident, retrospektiv"
mitigation_summary: "Audit-Stream als first-class Loki-Stream; Append-only via Outbox; Retention 90 Tage"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]], [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/audit-security/*"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Forensik nach Vorfall (â€žwer hat die Lineup verÃ¤ndert?" / â€žwarum hat das Match dieses Resultat?") braucht ein durchsuchbares, append-only Audit-Log. Wenn das fehlt oder nur via Outbox-Lag verfÃ¼gbar ist, sind Incidents oft nicht beweisbar.

**Mitigation.** Audit-Context (existiert in ADR-0019) muss `command_executed`, `state_transition`, `authz_check`, `auth_event` als Loki-Stream `stream=audit` mit 90-Tage-Retention pushen. Grafana-Dashboard mit hÃ¤ufigen Queries als Default-View.

---

### PM-2026-05-20-05-F-09 â€” PII in Logs trotz Redaction (DSGVO-BuÃŸgeld-Risiko)

```yaml
id: PM-2026-05-20-05-F-09
domain: security
scenario: [both]
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "synthetic_pii_marker_in_loki_total"
    threshold: "> 0"
  - metric: "loki_redaction_rule_changes_per_week"
    threshold: "> 5 = stack instabil"
mitigation_summary: "Synthetic-PII-Marker im CI; Loki-Redaction-Whitelist (allow-list); DSAR-Export-Test pro Release"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]]
linked_specs: [[[../../30-Implementation/client-telemetry]], [[../gdpr-compliance]]]
linked_code:
  - "tests/security/pii-leak.test.ts (geplant)"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wir loggen viel (OTel, GlitchTip, Audit). Ein neuer Code-Pfad pushed Email/IP ungeshasht. Redaction-Regeln sind Deny-Lists, neue Felder fallen durch. Bei DSGVO-Auskunft taucht das auf â€” BuÃŸgeld + Reputation.

**Mitigation.**
1. CI-Test: synthetic PII (`pii.test@example.com`, `192.0.2.42`) wird durch alle Code-Pfade geschickt; Loki-Query nach Test muss 0 Treffer ergeben.
2. Redaction als Allow-List statt Deny-List: nur explizit erlaubte Felder kommen ungeshasht durch.
3. DSAR-Export-Test pro Release: exportierte ZIP enthÃ¤lt erwartete Felder, *keine* unerwarteten.

---

### PM-2026-05-20-05-F-10 â€” Account-Ãœbernahme via Recovery-Code-SchwÃ¤chen

```yaml
id: PM-2026-05-20-05-F-10
domain: security
scenario: [both]
probability: 3
impact: 5
score: 15
confidence: medium
early_warning:
  - metric: "recovery_code_redeem_per_account_24h"
    threshold: "> 1 = suspicious"
  - metric: "passkey_register_after_recovery_total"
    threshold: "Spike â†’ Investigate"
mitigation_summary: "Recovery-Code single-use, time-bounded, Cooldown, 2nd Channel BestÃ¤tigung bei Passkey-Re-Registration"
linked_adrs: []
linked_specs: [[[../../30-Implementation/auth-flows]], [[../../30-Implementation/session-management]]]
linked_code:
  - "apps/web/src/contexts/identity-access/*"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Recovery-Codes (ADR-0011-Pfad) sind nÃ¼tzlich, aber ein leakender Code Ã¶ffnet Account ohne Passkey-Besitz. Ein Angreifer registriert seine eigene Passkey, alter User ist ausgesperrt.

**Mitigation.** Recovery-Codes single-use, time-bounded, max. 1 Re-Generation/30 Tage; Passkey-Re-Registration nach Recovery erfordert 2nd-Channel-BestÃ¤tigung (Email-Link); 24 h Sperrfrist auf Premium-Features nach Recovery.

---

### PM-2026-05-20-05-F-11 â€” Achievement-Farming via Trivial-Liga

```yaml
id: PM-2026-05-20-05-F-11
domain: security
scenario: [both]
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "achievement_per_account_24h"
    threshold: "P99 > 5 = suspicious"
  - metric: "league_avg_human_count"
    threshold: "< 2 in leagues claiming achievements"
mitigation_summary: "Achievements binden an Server-Re-Sim-BestÃ¤tigung + Liga-Strength + Min. Humans"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/league-orchestration/*"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Spieler erstellt 100 NPC-Ligen mit schwachen Gegnern, farmt Trophies â†’ Hall of Fame ist wertlos.

**Mitigation.** Achievement-Eligibility-Regel: Liga muss N â‰¥ 4 menschliche Mitspieler haben und Spieler-Strength-Median > Schwelle. Server-bestÃ¤tigte Re-Sim ist Voraussetzung. Trophies aus Solo-Ligen sind sichtbar im SP, aber `unverified` fÃ¼r Hall of Fame.

---

### PM-2026-05-20-05-F-12 â€” Engine-Bundle-Hash-Rotation ohne Plan

```yaml
id: PM-2026-05-20-05-F-12
domain: security
scenario: [both]
probability: 3
impact: 4
score: 12
confidence: medium
early_warning:
  - metric: "engine_bundle_hash_mismatch_total"
    threshold: "Spike nach Release"
mitigation_summary: "Engine-Versions-Pinning pro Save; Rolling-Upgrade-Window; Migrate-old-Saves-Job"
linked_adrs: [[[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]]
linked_specs: [[[../determinism-and-replay]]]
linked_code:
  - "packages/match-engine/"
linked_issues: []
resolved_by:
  - [[gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wenn die Match-Engine sich Ã¤ndert (Bugfix, neue Mechanik), bricht Replay alter Saves. Ohne Versions-Pinning verlieren Spieler ihre Replays, Server-Re-Sim fÃ¼r Anti-Cheat funktioniert nicht mehr fÃ¼r Ã¤ltere Matches.

**Mitigation.** Jeder Match-Record speichert `engine_bundle_hash`. Server hÃ¤lt N letzte Engine-Versionen im Worker-Pool. Migrate-Job fÃ¼r Saves > 12 Monate alt (best-effort, sonst `verified` â†’ `unverified-by-engine-migration`).

---

## Save-Format-Vorschlag (Schema v2)

Ratifiziert durch geplante `ADR-0028 Save Import/Export Trust Levels`.

```typescript
// packages/save-format/src/schema.ts (geplant)
export type SaveTrustLevel =
  | 'local-only'               // Niemals synchronisiert; SP-Default.
  | 'cloud-verified'           // Server hat Command-Log replayed und gegengezeichnet.
  | 'imported-unverified'      // Aus Datei importiert, nicht serverseitig geprÃ¼ft.
  | 'imported-verified'        // Importiert + serverseitig replayed â†’ bit-identisch.
  | 'unverified-by-engine-migration'; // War verified, Engine-Version migriert, Re-Verify ausstehend.

export interface SaveFileV2 {
  schema_version: 2;
  save_id: string;             // UUIDv7
  created_at: string;          // ISO-8601
  last_verified_at?: string;
  engine_bundle_hash: string;  // BLAKE3 Ã¼ber engine bundle
  command_log_merkle_root: string;
  command_log: ReadonlyArray<SignedCommand>;
  snapshot: ClubSnapshot;      // schema'd
  trust_level: SaveTrustLevel;
  device_signature: string;    // ed25519 Ã¼ber (schema_version, save_id, merkle_root, snapshot_hash)
  server_hmac?: string;        // HMAC-SHA-256 (nur bei cloud-verified)
}

export interface SignedCommand {
  commandId: string;           // UUIDv7
  payload: CommandPayload;     // diskriminierte Union
  nonce: string;               // BLAKE3-128
  clientTime: string;
  deviceKey: string;           // ed25519-pub
  signature: string;           // ed25519
  serverReceipt?: ServerReceipt; // optional, nur nach Server-Round-Trip
}
```

**VerschlÃ¼sselung.** Bestand bleibt: AES-256-GCM-Envelope (ADR-0005) um diese Struktur, PBKDF2 KDF.

**Migration.** Saves v1 â†’ v2 via einmaligem Re-Hash-Job. `trust_level` v1-Saves = `local-only`.

## Import/Export-Pfade

| Pfad | Quelle | Validierung | Resultierender `trust_level` | Cloud-Effekt |
|------|--------|-------------|------------------------------|--------------|
| SP-Export â†’ eigene Festplatte | Z2 â†’ Z3 | Device-Signatur erzeugt | `local-only` | Keiner |
| Lokales Save laden | Z3 â†’ Z2 | Device-Signatur prÃ¼fen | unverÃ¤ndert | Keiner |
| Cloud-Sync upload | Z2 â†’ Z1 | Server replay'd Command-Log | `cloud-verified` (bei Erfolg) | Server-HMAC wird gesetzt |
| Cloud-Sync download | Z1 â†’ Z2 | Server-HMAC prÃ¼fen | `cloud-verified` | Keiner |
| Community-Import (lokal nur) | Z5 â†’ Z2 | Schema-Validate | `imported-unverified` | Spielbar, nicht fÃ¼r Leaderboards |
| Community-Import + Server-Verify | Z5 â†’ Z2 â†’ Z1 | Schema + Server-Replay | `imported-verified` bei Bit-IdentitÃ¤t | Eligible fÃ¼r Hall-of-Fame |

## Quantitatives Modell

### Kryptografie-Overhead

| Operation | Aufwand | HÃ¤ufigkeit |
|-----------|---------|------------|
| Ed25519 Sign (Command) | ~50 Âµs CPU | 1Ã— pro Command (Client) |
| Ed25519 Verify (Command) | ~150 Âµs CPU | 1Ã— pro Command (Server) |
| HMAC-SHA-256 (Save) | ~5 Âµs/MB | 1Ã— pro Cloud-Sync |
| BLAKE3 Merkle-Root Ã¼ber Command-Log | ~10 ms / 5 MB | 1Ã— pro Save-Write |
| Server-Re-Sim fÃ¼r Cloud-Verify | ~50 ms / Saison | 1Ã— pro Save-Sync |

**Server-Overhead bei 10k DAU Ã— 1,4 Sessions Ã— 20 Commands/Session = 280k Commands/Tag** Ã— 150 Âµs = 42 s CPU/Tag = vernachlÃ¤ssigbar.

**Server-Re-Sim bei 10k Cloud-Syncs/Tag** Ã— 50 ms = 500 s CPU/Tag = 0,6 % einer dedizierten Core â€” vernachlÃ¤ssigbar.

### Cheat-Detection-Volumen

Branchen-Erfahrung: 0,5â€“3 % der MP-Aktionen sind Cheat-Versuche. Bei 280k Commands/Tag: 1.400â€“8.400 verdÃ¤chtige Commands/Tag. Automatische Heuristiken filtern; Human-Review-Queue erhÃ¤lt 1â€“5 % davon â†’ 50 Cases/Tag manuell, machbar mit 0,2 FTE.

## SLO-VorschlÃ¤ge

| SLO | Ziel | Severity bei Verletzung |
|-----|------|-------------------------|
| Save-Integrity-Verification-Time | < 2 s P95 fÃ¼r 1-Saison-Save | S3 |
| Detected-Tampering-Rate (synthetic Suite) | â‰¥ 95 % | S2 |
| Auth-Recovery-Time (median) | < 5 min | S3 |
| Webhook-Replay-Detected-Rate | 100 % | S1 |
| PII-Leak-Tests in CI | 0 Treffer | S1 |
| Determinism-Replay-Mismatch | 0 in CI, 0 in Prod | S1 |
| Command-Signing-Coverage | 100 % aller mutierenden Routen | S2 |

## Load-/Stress-Test-Plan

### Tampering-Test-Suite (CI, nightly)

12 Mutation-Klassen gegen Save-Import + Command-Receive:
1. Garbage Bytes am Envelope-Ende.
2. Modified Snapshot, Merkle-Root unverÃ¤ndert.
3. Modified Command in Log, Merkle-Root unverÃ¤ndert.
4. Engine-Version-Mismatch.
5. Time-Skew > 60 s.
6. Nonce-Replay innerhalb 30-Tage-Window.
7. Device-Key-Substitution (anderer Spieler).
8. Server-HMAC entfernt.
9. Schema-Version-Downgrade.
10. Oversized Payload (> 50 MB).
11. Prototype-Pollution-Payload (`__proto__: â€¦`).
12. Hash-Collision-Spam.

**Pass-Kriterium:** Alle 12 mÃ¼ssen `reject` oder `unverified` ergeben. CI blockt bei Regression.

### Fuzz-Import (lokal, on-demand)

`fast-check` Ã— 1.000 Iterationen Ã¼ber mutierte Save-JSONs. Kein Crash, kein OOM, kein Eskalations-Pfad.

### Penetration-Test (extern, vor Launch)

- Scope: Web, Auth, Save-Import/Export, Webhook-Endpoints, API.
- Lieferant: Externe Security-Boutique, ggf. via yeswehack.
- Budget: 3â€“5 Tester-Tage, ~5â€“8 k â‚¬.

### Bug-Bounty (post-Launch, optional)

- Phase 1: Discord-only-Pool, max 500 â‚¬ pro Critical, max 2 k â‚¬/Monat Budget.
- Phase 2: HackerOne / yeswehack, falls Phase 1 zu wenig Findings liefert.

## Runbook-Skizzen

### RB-S1: Verbreitetes Save-Forgery-Tool entdeckt
1. **Detect:** Spike `save_import_schema_mismatch_total` + Reports aus Community.
2. **Triage:** Forensik-Sample analysieren, Mutation-Klasse bestimmen.
3. **Sofort:** Engine-Bundle-Hash-Rotation; Schema-Version-Bump auf v3 mit zusÃ¤tzlichem Feld; Detection-Heuristik in Audit.
4. **Comms:** Status-Page, Discord-AnkÃ¼ndigung; klare Trennung â€žweiterspielen ja / Leaderboards pausiert ja".
5. **Sanction:** Stufenmodell â€” verifizierte Forgery-Saves bekommen `unverified`-Flag rÃ¼ckwirkend.
6. **Postmortem:** binnen 14 Tagen.

### RB-S2: Account-Ãœbernahme-Welle (Credential-Stuffing)
1. **Detect:** Spike `auth_token_reuse_detected_total` oder `recovery_code_redeem_per_account_24h`.
2. **Sofort:** Captcha-Schwelle senken, Rate-Limit pro IP verschÃ¤rfen, Mass-Force-Reauth optional.
3. **Hunt:** Loki-Query nach Pattern, Forensik der ersten 10 Cases.
4. **Comms:** Email an betroffene Accounts mit Recovery-Anleitung.
5. **Followup:** Passwort-Reuse-Check (haveibeenpwned-API).

### RB-S3: DSGVO-Auskunfts-/LÃ¶schanfrage in Konflikt mit Audit-Aufbewahrung
1. **Detect:** Privacy-Anfrage via Email/Portal eintrudelt.
2. **Triage:** Account + zugehÃ¶rige Audit-Events identifizieren.
3. **Action:** Pseudonymisierung der Audit-Events (PII-Felder â†’ Hash); Account-Daten lÃ¶schen via kryptografische Erasure; Steuer-relevante Records (falls Premium) bleiben gemÃ¤ÃŸ 10-Jahre-Pflicht aber pseudonymisiert.
4. **Comms:** Brief-Template an Anfragenden mit AufschlÃ¼sselung was wann gelÃ¶scht/aufbewahrt wurde.
5. **Followup:** DSAR-Export-Test im CI prÃ¼ft, dass Anfrage automatisiert beantwortbar ist.

## Future-scope decisions (classified future-scope)

- **OQ-S-01.** Passkey-Device-Key direkt fÃ¼r Command-Signing â€” Ergonomie vs Hygiene?
- **OQ-S-02.** Welche Loki-Felder dÃ¼rfen unredigiert bleiben (Allow-List)?
- **OQ-S-03.** Bug-Bounty: Discord-Pilot ja/nein, Budget?
- **OQ-S-04.** Externes Pentest-Engagement: Lieferant, Timing, Budget.
- **OQ-S-05.** Engine-Versions-Storage-Policy: wie viele alte Engine-Builds halten wir vorrÃ¤tig?
- **OQ-S-06.** Cloud-Sync fÃ¼r SP-Saves opt-in oder opt-out?

## â€žWenn wir nur 3 Dinge tun"-Liste

1. **Command-Signing + Server-Re-Sim fÃ¼r Match-Resultate** (ADR-0026) â€” fÃ¤ngt 80 % aller offensichtlichen Tampering-Versuche.
2. **Save-Schema v2 mit `trust_level` + Server-HMAC** (ADR-0028) â€” entkoppelt Spielbarkeit von Wettkampf-Eignung; macht SP-Foundation MP-kompatibel.
3. **Determinism-CI-Gate als harter Block** vor jedem Merge â€” schÃ¼tzt QualitÃ¤t *und* Anti-Cheat-Foundation simultan.

## Single-Player-Foundation-Check

Single-Player darf permissiv sein â€” aber die *Datenstrukturen* sind dieselben wie fÃ¼r MP/BYOC:

- Auch SP-Saves nutzen Save-Schema v2 mit `trust_level: local-only`.
- Auch SP-Commands sind signiert â€” kostet ~50 Âµs/Command, ermÃ¶glicht spÃ¤ter retro-aktiv Cloud-Verify.
- Auch SP-Match-Records speichern `engine_bundle_hash` â€” Determinismus-Replay funktioniert fÃ¼r Bug-Reports.
- Auch SP-Save-Export ist `device_signed` â€” Spieler kann seinen eigenen Save spÃ¤ter cloud-syncen oder teilen.

**Kosten dieser Disziplin: gering.** ~1â€“2 ms zusÃ¤tzliche CPU pro SP-Match-Tick, +30 % Storage pro Save (Merkle-Tree-Footprint). **Nutzen: groÃŸ.** Wir bauen keinen zweiten Stack, MP/BYOC ist nicht â€žbolt-on" sondern â€žswitch-on".

## Verfolgung & Verkettung (Finding â†’ Fix)

Jedes Finding hat eine immutable ID (`PM-2026-05-20-05-F-NN`).

- **Im Code:** Commits/PRs zitieren `Addresses PM-2026-05-20-05-F-NN`.
- **Im Vault:** neue ADRs tragen `addresses: [PM-2026-05-20-05-F-NN]` Frontmatter.
- **Status-ÃœbergÃ¤nge:** `open â†’ mitigating â†’ mitigated â†’ verified`.
- **Aggregat:** [[findings-registry]].

## Related

- [[00-index]] Â· [[findings-registry]] Â· [[threat-model]]
- [[PM-2026-05-20-01-architecture]] Â· [[PM-2026-05-20-02-tech-and-ops]] Â· [[PM-2026-05-20-03-gameplay]] Â· [[PM-2026-05-20-04-monetization]] Â· [[PM-2026-05-20-06-distributed-match-compute]]
- [[../determinism-and-replay]]
- [[../gdpr-compliance]]
- [[../wave-3-gap-analysis]]
- [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
- [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
- [[../../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
- [[../../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
- [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
- [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
- [[../../30-Implementation/auth-flows]]
- [[../../30-Implementation/session-management]]
- [[../../30-Implementation/privacy-and-consent]]
- [[../../30-Implementation/rate-limiting-anti-abuse]]
- [[../../30-Implementation/secrets-management]]
- [[../../00-Index/Current-State]]
