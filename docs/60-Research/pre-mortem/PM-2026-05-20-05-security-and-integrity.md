---
title: "Pre-Mortem 2026-05-20 · 05 · Security & Integrity"
status: current
tags: [research, pre-mortem, security, integrity, anti-tamper, save-format, anti-cheat, 2026-Q2]
created: 2026-05-20
updated: 2026-06-14
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
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../../30-Implementation/auth-flows]]
  - [[../../30-Implementation/session-management]]
  - [[../../30-Implementation/rate-limiting-anti-abuse]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Pre-Mortem 2026-05-20 · 05 · Security & Integrity

> **Failure-Headline-Kandidaten**
> - ”žEin Tampering-Skandal zerstörte das Vertrauen in async Liga-Resultate — 60 % der Premium-Spieler kündigten."
> - ”žEin Save-Forgery-Tool kursierte im Discord — Hall of Fame war Wochen lang unbenutzbar."
> - ”žEin npm-Supply-Chain-Angriff schleuste Code in die Match-Engine ein — wir mussten wochenlang offline gehen."
> - ”žEine DSGVO-Anfrage zu einem gelöschten Account ergab, dass PII in Loki-Logs steckte — Bußgeld + Reputationsschaden."

## Scope

Querschnittlicher Synthese-Report zu Security, Daten-Integrität und Anti-Cheat. Bündelt alles, was Tampering / Save-Import-Export / Crypto / Anti-Cheat betrifft, statt es über die vier Domänen-Reports zu verteilen. Verweist auf domänenspezifische Findings in 1–4 (insbesondere deren Iteration-2-Addenda), ergänzt sie um eigene querschnittliche Findings F-01…F-12.

**Trust-Modell.** Siehe [[threat-model]] für Zonen, Assets, Adversare und STRIDE-Matrix. Dieser Report operationalisiert das Threat-Model in konkrete Pre-Mortem-Findings.

**Leitsatz.** Single-Player ist das Fundament — aber jedes Datenformat ist so designed, dass es auch unter Z4-Vertrauen trägt. Ein Stack mit zuschaltbarem Trust-Level.

## Top Failure-Hypothesen

Jede Failure-Hypothese erhält eine immutable ID (`PM-2026-05-20-05-F-NN`) zur Verkettung mit Fixes — siehe `## Verfolgung & Verkettung` am Ende.

---

### PM-2026-05-20-05-F-01 — Save-Format authentisiert Kenntnis, nicht Herkunft

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
linked_adrs: [[ADR-0005-save-format]]
linked_specs: [[threat-model]]
linked_code:
  - "packages/save-format/ (geplant)"
  - "apps/web/src/save/import.ts (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** ADR-0005 spezifiziert AES-256-GCM-Envelope mit PBKDF2-KDF aus `accountSecret + deviceSalt`. AES-GCM authentifiziert *Kenntnis des Schlüssels*, **nicht** *Herkunft* oder *Server-Approval*. Wer einen lokalen Save entschlüsselt, modifiziert und neu verschlüsselt — kann ihn ohne Server-Spur einspielen und beansprucht "verified" weil der Envelope intakt ist.

**Frühwarnindikatoren.** Save-Import-Schema-Mismatch-Spike (Forger-Tool im Umlauf). Existenz unsigner Exports in Production-Builds.

**Mitigation.** Save-Schema v2 (siehe §Save-Format unten): Pflichtfelder `schema_version`, `save_id` (UUIDv7), `command_log_merkle_root`, `engine_bundle_hash`, `trust_level`, `server_hmac` (optional, vorhanden iff cloud-synced). Importe ohne Server-HMAC bekommen `trust_level: unverified` und sind von Leaderboards/Hall-of-Fame ausgeschlossen.

> **FMX-184 correction (2026-06-14):** The old sentence "ADR-0028 ratifies
> this" is invalid after ADR re-numbering; current ADR-0028 is the Postgres
> transactional outbox. The accepted home is
> [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture|ADR-0116]]:
> derived `SaveTrustLevel` plus `PublicEligibility`, internal server HMAC proof,
> strict public downgrade rules and public surfaces limited to
> server-verified/imported-verified eligible histories.

**Verifikation.** Tampering-Test-Suite (siehe §Load-Tests): 12 Mutation-Klassen werden gegen den Import-Pfad geworfen; jede muss `reject` oder `unverified` ergeben.

---

### PM-2026-05-20-05-F-02 — Commands sind nicht signiert / nicht replay-geschützt

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
linked_specs: [[threat-model]], [[../../30-Implementation/auth-flows]], [[../../30-Implementation/session-management]]
linked_code:
  - "apps/web/src/transport/command-bus.ts (geplant)"
  - "apps/web/src/server/command-router.ts (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: L
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Aktuell vertrauen Server-Routen der Session und akzeptieren JSON-Bodies. Ein authentifizierter Spieler kann via DevTools beliebige Commands ausführen (z. B. ”žVertrag mit -1 € Wage abschließen"); ein passiver Beobachter kann Commands replay'en, wenn Session-Cookies leaken.

**Frühwarnindikatoren.** `cmd_signature_invalid_total`, `cmd_nonce_replay_total`.

**Mitigation (historical sketch).** Command-Bus mit Pflichtfeldern:
```
{ commandId: UUIDv7, payload: { … }, nonce: BLAKE3-128(commandId||clientTime||deviceKey),
  clientTime: ISO, deviceKey: ed25519-pub, signature: ed25519(commandId||payload||nonce||clientTime) }
```
Server prüft Signatur, Nonce-Freshness (30-Tage-Bloom-Filter), Sender-Authorization, Time-Skew (< 60 s). Antwortet mit `CommandReceipt(commandId, serverTime, resultingStateHash, serverSig)`. Client validiert & speichert für späteren Replay-Beweis.

> **FMX-184 correction (2026-06-14):** The old sentence "ADR-0026 ratifies
> this" is invalid after ADR re-numbering; current ADR-0026 is the Match Frame
> Contract. The accepted home is
> [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture|ADR-0115]].
> FMX keeps server-authoritative validation, `commandId` idempotency,
> `expectedVersion` and processed-command dedup as authority. It also requires a
> full app-managed/device Ed25519 command-evidence envelope from the first code
> phase; that signature is provenance evidence, not authority.

**Verifikation.** Penetration-Test: forged Commands, replay'd Commands, expired Nonces — alle müssen `reject`.

---

### PM-2026-05-20-05-F-03 — Determinismus-CI-Gate fehlt → Anti-Cheat-Foundation bröckelt

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
linked_adrs: [[ADR-0003-match-engine]]
linked_specs: [[determinism-and-replay]], [[../../50-Game-Design/GD-0002-match-engine]]
linked_code:
  - "packages/match-engine/src/"
  - ".github/workflows/ci.yml"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Ohne automatisierten Replay-Diff im CI kann ein versehentlicher `Math.random()`, `Date.now()` oder eine nicht-deterministische Bibliotheksaufruf in der Match-Engine über Wochen unentdeckt bleiben. Das *zerstört Anti-Cheat-Foundation*: Server kann eingehende Resultate nicht mehr re-simulieren, BYOC-Validatoren divergieren, Replays bei Bug-Reports sind nicht reproduzierbar.

**Frühwarnindikatoren.** CI-Failure `determinism_replay_mismatch_total > 0`.

**Mitigation.**
1. CI-Job ”žDeterminism Gate": 1.000 fixe Seeds × Replay × Bit-Equal-Assert.
2. Stryker-Mutation darf den Determinism-Test nicht überleben (separate non-mutated ”žintegrity"-Test).
3. Semgrep-Regel: `Math.random|Date.now|Date()` in `packages/match-engine/**` ist blocker.
4. Engine-Bundle-Hash bei jedem Build, in jedem Match-Record gespeichert.

**Verifikation.** Synthetische Mutation in `match-engine` (z. B. eine Stelle `Math.random()` einfügen) → CI muss innerhalb 1 Run blocken.

---

### PM-2026-05-20-05-F-04 — Save-Import als Deserialisierungs-/Exploit-Vektor

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
    threshold: "> 0 → Investigate"
mitigation_summary: "Strikter Zod-Schema-Validator, Size-Limit 50 MB, Object.create(null), kein eval/Function"
linked_adrs: []
linked_specs: [[threat-model]]
linked_code:
  - "apps/web/src/save/import.ts (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Community-Import erlaubt Beliebige-JSON-aus-Internet. Ohne strikte Validierung sind Prototype-Pollution, Hash-Collision-DoS, ZIP-Bomben (komprimierte Saves), Resource-Exhaustion (gigantische Spielerlisten) und Code-Execution via gefährliche Helper realistische Angriffe.

**Frühwarnindikatoren.** Spike an Validation-Errors / Oversize-Rejects.

**Mitigation.**
1. Zod / typia Schema mit `strict: true`, `passthrough: false`.
2. Size-Limit hart (50 MB) bevor Parsing beginnt.
3. `Object.create(null)` für interne Maps, niemals `Object.assign({}, untrusted)`.
4. Kein `eval`, kein `Function`-Konstruktor, kein dynamisches `import()` aus User-Data.
5. Property-Whitelist statt Blacklist; unbekannte Felder werden gestrippt, nicht durchgereicht.
6. Fuzz-Test mit `fast-check` über mutierte JSON-Inputs.

**Verifikation.** Fuzz-Suite läuft 1.000 Iterationen ohne Crash / OOM / Eskalation.

---

### PM-2026-05-20-05-F-05 — Supply-Chain (npm + Container) unkontrolliert

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
mitigation_summary: "SBOM, cosign-signed Container, Renovate-Quarantäne, pnpm audit als CI-Gate"
linked_adrs: [[ADR-0017-observability-logging]]
linked_specs: [[secrets-management]]
linked_code:
  - ".github/workflows/ci.yml"
  - "Dockerfile"
  - "package.json"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Manager-Sim ist High-Profile-Ziel für Supply-Chain (Long-Tail-Spieler-Basis, hohe Spielzeit, Live-Service). npm-Compromise einer Lib in match-engine oder web-Build ist katastrophal — Determinismus-Garantie bricht still, kompromittierter Code läuft auf jedem Client.

**Mitigation.**
1. `pnpm install --frozen-lockfile` in CI.
2. `pnpm audit --audit-level=high` als blocking gate.
3. SBOM (CycloneDX) je Release-Tag; `sbom-diff` als nicht-blocking Warning bei unerwarteten neuen Deps.
4. Container-Images mit `cosign` signiert; Dokploy/Deployment akzeptiert nur signierte Images.
5. Renovate-Bot in Quarantäne-Branch + 72 h Cooldown vor Auto-Merge.
6. Critical Path Libs (`pure-rand`, `match-engine`-deps) auf Lock-Pin + Manual-Approval.

**Verifikation.** Tabletop: simulierter npm-Compromise einer Dep → wie schnell entdecken wir es? (Ziel: < 7 Tage.)

---

### PM-2026-05-20-05-F-06 — Bounded-Context-Grenzen ohne Authorization-Checks

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
linked_adrs: [[ADR-0019-modular-monolith-ddd]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/**/handlers/*.ts (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
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
3. Static-Check (madge / custom Lint): Direct-Imports zwischen Contexts → Fehler (nur über deklarierte Public Bus).

---

### PM-2026-05-20-05-F-07 — Webhook-Forgery (Payment, GitHub, MCP)

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
mitigation_summary: "Webhook-Signaturen prüfen (Stripe `stripe-signature`); Idempotenz via eventId; IP-Allow-List wo möglich"
linked_adrs: []
linked_specs: [[PM-2026-05-20-04-monetization]]
linked_code:
  - "apps/web/src/server/webhooks/* (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: S
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Webhook-Endpoints (Stripe-IPN, GitHub-MCP für Auto-PR-Reviewer, sentry-glitchtip-Alerts) sind öffentlich erreichbar. Ohne Signatur-Validation kann ein Angreifer ”žbezahlte" Entitlements grant'en oder Audit-Log-Spam verursachen.

**Mitigation.** Stripe `stripe-signature` Header prüfen mit Webhook-Secret; Idempotenz via `eventId` aus Payload (30 Tage Replay-Window); WebHook-Receiver hinter Cloudflare mit IP-Allow-List wo Provider statisch.

---

### PM-2026-05-20-05-F-08 — Audit-Log lückenhaft / nicht durchsuchbar

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
linked_adrs: [[ADR-0013-transactional-outbox]], [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/audit-security/*"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Forensik nach Vorfall (”žwer hat die Lineup verändert?" / ”žwarum hat das Match dieses Resultat?") braucht ein durchsuchbares, append-only Audit-Log. Wenn das fehlt oder nur via Outbox-Lag verfügbar ist, sind Incidents oft nicht beweisbar.

**Mitigation.** Audit-Context (existiert in ADR-0019) muss `command_executed`, `state_transition`, `authz_check`, `auth_event` als Loki-Stream `stream=audit` mit 90-Tage-Retention pushen. Grafana-Dashboard mit häufigen Queries als Default-View.

---

### PM-2026-05-20-05-F-09 — PII in Logs trotz Redaction (DSGVO-Bußgeld-Risiko)

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
linked_adrs: [[ADR-0017-observability-logging]]
linked_specs: [[client-telemetry]], [[../gdpr-compliance]]
linked_code:
  - "tests/security/pii-leak.test.ts (geplant)"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: platform
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wir loggen viel (OTel, GlitchTip, Audit). Ein neuer Code-Pfad pushed Email/IP ungeshasht. Redaction-Regeln sind Deny-Lists, neue Felder fallen durch. Bei DSGVO-Auskunft taucht das auf — Bußgeld + Reputation.

**Mitigation.**
1. CI-Test: synthetic PII (`pii.test@example.com`, `192.0.2.42`) wird durch alle Code-Pfade geschickt; Loki-Query nach Test muss 0 Treffer ergeben.
2. Redaction als Allow-List statt Deny-List: nur explizit erlaubte Felder kommen ungeshasht durch.
3. DSAR-Export-Test pro Release: exportierte ZIP enthält erwartete Felder, *keine* unerwarteten.

---

### PM-2026-05-20-05-F-10 — Account-Übernahme via Recovery-Code-Schwächen

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
    threshold: "Spike → Investigate"
mitigation_summary: "Recovery-Code single-use, time-bounded, Cooldown, 2nd Channel Bestätigung bei Passkey-Re-Registration"
linked_adrs: []
linked_specs: [[auth-flows]], [[../../30-Implementation/session-management]]
linked_code:
  - "apps/web/src/contexts/identity-access/*"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Recovery-Codes (ADR-0011-Pfad) sind nützlich, aber ein leakender Code öffnet Account ohne Passkey-Besitz. Ein Angreifer registriert seine eigene Passkey, alter User ist ausgesperrt.

**Mitigation.** Recovery-Codes single-use, time-bounded, max. 1 Re-Generation/30 Tage; Passkey-Re-Registration nach Recovery erfordert 2nd-Channel-Bestätigung (Email-Link); 24 h Sperrfrist auf Premium-Features nach Recovery.

---

### PM-2026-05-20-05-F-11 — Achievement-Farming via Trivial-Liga

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
mitigation_summary: "Achievements binden an Server-Re-Sim-Bestätigung + Liga-Strength + Min. Humans"
linked_adrs: [[ADR-0011-server-authoritative-multiplayer]]
linked_specs: []
linked_code:
  - "apps/web/src/contexts/league-orchestration/*"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Spieler erstellt 100 NPC-Ligen mit schwachen Gegnern, farmt Trophies → Hall of Fame ist wertlos.

**Mitigation.** Achievement-Eligibility-Regel: Liga muss N ≥ 4 menschliche Mitspieler haben und Spieler-Strength-Median > Schwelle. Server-bestätigte Re-Sim ist Voraussetzung. Trophies aus Solo-Ligen sind sichtbar im SP, aber `unverified` für Hall of Fame.

---

### PM-2026-05-20-05-F-12 — Engine-Bundle-Hash-Rotation ohne Plan

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
linked_adrs: [[ADR-0003-match-engine]]
linked_specs: [[determinism-and-replay]]
linked_code:
  - "packages/match-engine/"
linked_issues: []
resolved_by:
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
status: mitigated
owner_suggested: backend
effort: M
created: 2026-05-20
updated: 2026-05-22
```

**Hypothese.** Wenn die Match-Engine sich ändert (Bugfix, neue Mechanik), bricht Replay alter Saves. Ohne Versions-Pinning verlieren Spieler ihre Replays, Server-Re-Sim für Anti-Cheat funktioniert nicht mehr für ältere Matches.

**Mitigation.** Jeder Match-Record speichert `engine_bundle_hash`. Server hält N letzte Engine-Versionen im Worker-Pool. Migrate-Job für Saves > 12 Monate alt (best-effort, sonst `verified` → `unverified-by-engine-migration`).

---

## Save-Format-Vorschlag (Schema v2)

Historical sketch. The intended `ADR-0028 Save Import/Export Trust Levels` never
became that ADR; current ADR-0028 is Postgres transactional outbox. The accepted
home is
[[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture|ADR-0116]].

```typescript
// packages/save-format/src/schema.ts (geplant)
export type SaveTrustLevel =
  | 'local-only'               // Niemals synchronisiert; SP-Default.
  | 'server-verified'          // Server hat Command-Log/proof chain akzeptiert.
  | 'imported-unverified'      // Aus Datei importiert, nicht serverseitig geprüft.
  | 'imported-verified'        // Importiert + serverseitig proof-chain akzeptiert.
  | 'unverified-by-engine-migration'
  | 'dev-or-debug'
  | 'invalid-or-modified';

export interface SaveFileV2 {
  schema_version: 2;
  save_id: string;             // UUIDv7
  created_at: string;          // ISO-8601
  last_verified_at?: string;
  engine_bundle_hash: string;  // BLAKE3 über engine bundle
  command_log_merkle_root: string;
  command_log: ReadonlyArray<SignedCommand>;
  snapshot: ClubSnapshot;      // schema'd
  trust_level: SaveTrustLevel;
  device_signature: string;    // Ed25519 evidence over canonical bytes/root.
  server_hmac?: string;        // HMAC-SHA-256 (nur bei server/imported-verified)
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

**Verschlüsselung.** Bestand bleibt: AES-256-GCM-Envelope (ADR-0005) um diese Struktur, PBKDF2 KDF.

**Migration.** Saves v1 → v2 via einmaligem Re-Hash-Job. `trust_level` v1-Saves = `local-only`.

## Import/Export-Pfade

| Pfad | Quelle | Validierung | Resultierender `trust_level` | Cloud-Effekt |
|------|--------|-------------|------------------------------|--------------|
| SP-Export → eigene Festplatte | Z2 → Z3 | Device-Signatur erzeugt | `local-only` | Keiner |
| Lokales Save laden | Z3 → Z2 | Device-Signatur prüfen | unverändert | Keiner |
| Cloud-Sync upload | Z2 → Z1 | Server prueft Command-Log/proof chain | `server-verified` (bei Erfolg) | Server-HMAC wird gesetzt |
| Cloud-Sync download | Z1 → Z2 | Server-HMAC prüfen | `server-verified` | Keiner |
| Community-Import (lokal nur) | Z5 → Z2 | Schema-Validate | `imported-unverified` | Spielbar, nicht für Leaderboards |
| Community-Import + Server-Verify | Z5 → Z2 → Z1 | Schema + Server-Pruefung | `imported-verified` bei valider Proof-Chain | Eligible für Hall-of-Fame |

## Quantitatives Modell

### Kryptografie-Overhead

| Operation | Aufwand | Häufigkeit |
|-----------|---------|------------|
| Ed25519 Sign (Command) | ~50 µs CPU | 1× pro Command (Client) |
| Ed25519 Verify (Command) | ~150 µs CPU | 1× pro Command (Server) |
| HMAC-SHA-256 (Save) | ~5 µs/MB | 1× pro Cloud-Sync |
| BLAKE3 Merkle-Root über Command-Log | ~10 ms / 5 MB | 1× pro Save-Write |
| Server-Re-Sim für Cloud-Verify | ~50 ms / Saison | 1× pro Save-Sync |

**Server-Overhead bei 10k DAU × 1,4 Sessions × 20 Commands/Session = 280k Commands/Tag** × 150 µs = 42 s CPU/Tag = vernachlässigbar.

**Server-Re-Sim bei 10k Cloud-Syncs/Tag** × 50 ms = 500 s CPU/Tag = 0,6 % einer dedizierten Core — vernachlässigbar.

### Cheat-Detection-Volumen

Branchen-Erfahrung: 0,5–3 % der MP-Aktionen sind Cheat-Versuche. Bei 280k Commands/Tag: 1.400–8.400 verdächtige Commands/Tag. Automatische Heuristiken filtern; Human-Review-Queue erhält 1–5 % davon → 50 Cases/Tag manuell, machbar mit 0,2 FTE.

## SLO-Vorschläge

| SLO | Ziel | Severity bei Verletzung |
|-----|------|-------------------------|
| Save-Integrity-Verification-Time | < 2 s P95 für 1-Saison-Save | S3 |
| Detected-Tampering-Rate (synthetic Suite) | ≥ 95 % | S2 |
| Auth-Recovery-Time (median) | < 5 min | S3 |
| Webhook-Replay-Detected-Rate | 100 % | S1 |
| PII-Leak-Tests in CI | 0 Treffer | S1 |
| Determinism-Replay-Mismatch | 0 in CI, 0 in Prod | S1 |
| Command-Signing-Coverage | 100 % aller mutierenden Routen | S2 |

## Load-/Stress-Test-Plan

### Tampering-Test-Suite (CI, nightly)

12 Mutation-Klassen gegen Save-Import + Command-Receive:
1. Garbage Bytes am Envelope-Ende.
2. Modified Snapshot, Merkle-Root unverändert.
3. Modified Command in Log, Merkle-Root unverändert.
4. Engine-Version-Mismatch.
5. Time-Skew > 60 s.
6. Nonce-Replay innerhalb 30-Tage-Window.
7. Device-Key-Substitution (anderer Spieler).
8. Server-HMAC entfernt.
9. Schema-Version-Downgrade.
10. Oversized Payload (> 50 MB).
11. Prototype-Pollution-Payload (`__proto__: …`).
12. Hash-Collision-Spam.

**Pass-Kriterium:** Alle 12 müssen `reject` oder `unverified` ergeben. CI blockt bei Regression.

### Fuzz-Import (lokal, on-demand)

`fast-check` × 1.000 Iterationen über mutierte Save-JSONs. Kein Crash, kein OOM, kein Eskalations-Pfad.

### Penetration-Test (extern, vor Launch)

- Scope: Web, Auth, Save-Import/Export, Webhook-Endpoints, API.
- Lieferant: Externe Security-Boutique, ggf. via yeswehack.
- Budget: 3–5 Tester-Tage, ~5–8 k €.

### Bug-Bounty (post-Launch, optional)

- Phase 1: Discord-only-Pool, max 500 € pro Critical, max 2 k €/Monat Budget.
- Phase 2: HackerOne / yeswehack, falls Phase 1 zu wenig Findings liefert.

## Runbook-Skizzen

### RB-S1: Verbreitetes Save-Forgery-Tool entdeckt
1. **Detect:** Spike `save_import_schema_mismatch_total` + Reports aus Community.
2. **Triage:** Forensik-Sample analysieren, Mutation-Klasse bestimmen.
3. **Sofort:** Engine-Bundle-Hash-Rotation; Schema-Version-Bump auf v3 mit zusätzlichem Feld; Detection-Heuristik in Audit.
4. **Comms:** Status-Page, Discord-Ankündigung; klare Trennung ”žweiterspielen ja / Leaderboards pausiert ja".
5. **Sanction:** Stufenmodell — verifizierte Forgery-Saves bekommen `unverified`-Flag rückwirkend.
6. **Postmortem:** binnen 14 Tagen.

### RB-S2: Account-Übernahme-Welle (Credential-Stuffing)
1. **Detect:** Spike `auth_token_reuse_detected_total` oder `recovery_code_redeem_per_account_24h`.
2. **Sofort:** Captcha-Schwelle senken, Rate-Limit pro IP verschärfen, Mass-Force-Reauth optional.
3. **Hunt:** Loki-Query nach Pattern, Forensik der ersten 10 Cases.
4. **Comms:** Email an betroffene Accounts mit Recovery-Anleitung.
5. **Followup:** Passwort-Reuse-Check (haveibeenpwned-API).

### RB-S3: DSGVO-Auskunfts-/Löschanfrage in Konflikt mit Audit-Aufbewahrung

> **FMX-186 note (2026-06-16):** This runbook remains a historical risk sketch.
> Field-level payment/receipt erasure-vs-retention partitioning is now routed to
> [[../erasure-vs-hgb-retention-partition-2026-06-16]] and draft
> [[../../10-Architecture/09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]].
> Do not implement payment/receipt field handling from this sketch alone.

1. **Detect:** Privacy-Anfrage via Email/Portal eintrudelt.
2. **Triage:** Account + zugehörige Audit-Events identifizieren.
3. **Action:** Pseudonymisierung der Audit-Events (PII-Felder → Hash); Account-Daten löschen via kryptografische Erasure; Steuer-relevante Records (falls Premium) bleiben gemäß ADR-0127/HGB-AO 10/8/6-Feldpartition aber pseudonymisiert bzw. identity-severed.
4. **Comms:** Brief-Template an Anfragenden mit Aufschlüsselung was wann gelöscht/aufbewahrt wurde.
5. **Followup:** DSAR-Export-Test im CI prüft, dass Anfrage automatisiert beantwortbar ist.

## Future-scope decisions (classified future-scope)

- **OQ-S-01.** Passkey-Device-Key direkt für Command-Signing — Ergonomie vs Hygiene?
- **OQ-S-02.** Welche Loki-Felder dürfen unredigiert bleiben (Allow-List)?
- **OQ-S-03.** Bug-Bounty: Discord-Pilot ja/nein, Budget?
- **OQ-S-04.** Externes Pentest-Engagement: Lieferant, Timing, Budget.
- **OQ-S-05.** Engine-Versions-Storage-Policy: wie viele alte Engine-Builds halten wir vorrätig?
- **OQ-S-06.** Cloud-Sync für SP-Saves opt-in oder opt-out?

## ”žWenn wir nur 3 Dinge tun"-Liste

1. **Command-Integrität + Server-Re-Sim für Match-Resultate** (accepted ADR-0115) — fängt offensichtliche Replay-/Duplication- und Regelverletzungsversuche über Server-Authority, `commandId`, `expectedVersion`, Audit-Dedup und app-managed Ed25519 evidence.
2. **Save-Schema v2 mit `SaveTrustLevel` + Server-Proof** (accepted ADR-0116) — entkoppelt Spielbarkeit von Wettkampf-Eignung; macht SP-Foundation MP-kompatibel.
3. **Determinism-CI-Gate als harter Block** vor jedem Merge — schützt Qualität *und* Anti-Cheat-Foundation simultan.

## Single-Player-Foundation-Check

Single-Player darf permissiv sein — aber die *Datenstrukturen* sind dieselben wie für MP/BYOC:

- Auch SP-Saves nutzen Save-Schema v2 mit `SaveTrustLevel: local-only`.
- Auch SP-Commands nutzen denselben Command-Envelope mit `commandId` und
  `expectedVersion` plus app-managed/device Ed25519 evidence; die Signatur ist
  Nachweis-/Tamper-Evidence, nicht Server-Authority.
- Auch SP-Match-Records speichern `engine_bundle_hash` — Determinismus-Replay funktioniert für Bug-Reports.
- Auch SP-Save-Export ist `device_signed` — Spieler kann seinen eigenen Save später cloud-syncen oder teilen.

**Kosten dieser Disziplin: gering.** ~1–2 ms zusätzliche CPU pro SP-Match-Tick, +30 % Storage pro Save (Merkle-Tree-Footprint). **Nutzen: groß.** Wir bauen keinen zweiten Stack, MP/BYOC ist nicht ”žbolt-on" sondern ”žswitch-on".

## Verfolgung & Verkettung (Finding → Fix)

Jedes Finding hat eine immutable ID (`PM-2026-05-20-05-F-NN`).

- **Im Code:** Commits/PRs zitieren `Addresses PM-2026-05-20-05-F-NN`.
- **Im Vault:** neue ADRs tragen `addresses: [PM-2026-05-20-05-F-NN]` Frontmatter.
- **Status-Übergänge:** `open → mitigating → mitigated → verified`.
- **Aggregat:** [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]] · [[threat-model]]
- [[PM-2026-05-20-01-architecture]] · [[PM-2026-05-20-02-tech-and-ops]] · [[PM-2026-05-20-03-gameplay]] · [[PM-2026-05-20-04-monetization]] · [[PM-2026-05-20-06-distributed-match-compute]]
- [[../determinism-and-replay]]
- [[../gdpr-compliance]]
- [[../../95-Archive/gap-reports/wave-3-gap-analysis]]
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
