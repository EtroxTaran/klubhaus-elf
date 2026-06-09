---
title: GDPR Compliance — RoPA, lawful basis, retention, DPIA, DPO
status: current
tags: [research, gdpr, eprivacy, privacy, ropa, dpia, compliance]
created: 2026-05-18
updated: 2026-06-09
type: research
binding: true
related:
  - "[[../95-Archive/gap-reports/wave-3-gap-analysis]]"
  - "[[telemetry-privacy]]"
  - "[[threat-model]]"
  - "[[../30-Implementation/privacy-and-consent]]"
  - "[[../30-Implementation/auth-flows]]"
  - "[[../30-Implementation/session-management]]"
  - "[[../30-Implementation/account-recovery]]"
  - "[[../30-Implementation/audit-trail]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
---

# GDPR Compliance — RoPA, lawful basis, retention, DPIA, DPO

This note resolves Wave 3 gap **F6** (Privacy & GDPR compliance, **P0**)
on the **legal-foundation side**. It is the **binding research
synthesis** that locks the:

- Article 30 **Record of Processing Activities (RoPA)** with 8
  processing activities × 6 data categories
- **Lawful basis** per activity (Art. 6 only — no Art. 9 special
  categories present)
- **Retention schedule** per category, including the audit-trail
  exception
- **Voluntary DPIA** (Art. 35 not mandatory at our scale)
- **DPO determination** (not required; founder = Privacy Lead)
- **Third-country transfer posture** (none; we sidestep Chapter V
  entirely)
- **Children's data stance** (16+ self-declaration gate; no
  parental-consent flow)
- **Processor Art. 28 DPA checklist**
- **Compliance overhead estimate** for a 1-3 founder indie studio

The companion note [[../30-Implementation/privacy-and-consent]]
locks the **implementation surface** (privacy notice content,
DSAR endpoint, deletion flow, Settings → Privacy Center UX, breach
runbook). Together they close the F6 P0 gap and discharge the
F2 FU-6 + F2 FU-7 + F3 FU-8 + F5 FU-8 + F5 FU-9 follow-ups.

## 1. Scope and stance

### 1.1 Profile

- **Controller**: DE-domiciled indie studio (1-3 founders), UG /
  GmbH form recommended.
- **Service**: offline-first PWA football manager game, EU-focused
  consumer audience.
- **Scale at launch**: ~thousands of users; 5-year horizon
  10-50 k users.
- **Processors**: Hetzner (infra, DE), transactional email vendor
  (Brevo / Mailjet / IONOS — all EU-domiciled, pending §11.4
  selection), Dokploy (self-hosted on our VM, not a third party).
- **Special-category data**: **none** processed (§5).
- **Behavioural analytics**: **none** at MVP (deferred to H7 /
  G3; will require new consent layer when shipped).
- **Third-country transfers**: **none** intentional or
  unintentional in 2026 deployment.
- **Lead supervisory authority**: BfDI (federal, Germany) per
  Art. 56 one-stop-shop; cooperation with national DPAs under
  Art. 60.

### 1.2 Legal landscape locked

| Instrument                                 | Applies to us? | Why |
| ---                                        | ---            | --- |
| GDPR (Regulation (EU) 2016/679)            | **Yes**         | Direct controller obligations Art. 4-99 |
| ePrivacy Directive 2002/58 (as amended)    | **Yes**         | Art. 5(3) terminal-equipment storage applies to IndexedDB / Service Worker per CJEU *Planet49* (C-673/17) |
| ePrivacy Regulation (proposed 2017+)       | **No**         | Still a Council draft in 2026; not adopted; not part of our compliance basis |
| BDSG (Germany)                             | **Yes**         | § 38 DPO threshold + § 26 employee data (NA, no employees) + opening clauses |
| EU-US Data Privacy Framework (DPF)         | **No (irrelevant)** | We do no US transfers; sidestepping the entire Chapter V apparatus |
| Standard Contractual Clauses (SCCs)        | **No (irrelevant)** | Same — no third-country transfers |
| Digital Services Act (DSA, Reg. 2022/2065) | **De minimis**  | Not a VLOP (45 M MAU threshold), no marketplace, no UGC hosting beyond normal account content |
| Digital Markets Act (DMA, Reg. 2022/1925)  | **No**         | Not a designated gatekeeper |
| EU AI Act (Reg. 2024/1689)                 | **No (low-risk)** | Deterministic procedural worldgen per ADR-0007; no high-risk AI use; no Art. 22 automated decisions |
| NIS2 Directive (2022/2555)                 | **No**         | Not an essential / important entity per Annex I/II at our scale |

The "what is correctly NOT relevant" framing matters for audit
defensibility — DPAs and Bugbot agents both expect a documented
scoping decision rather than silence.

### 1.3 What F6 locks vs defers

**Locked here:**

- Art. 30 RoPA shape and content (§3-4).
- Lawful basis per activity (§4).
- Retention per category, including audit-permanent-but-
  pseudonymised-on-Art.17 stance (§7).
- Voluntary DPIA (§8) — the document lives in this note.
- DPO determination (§9).
- Third-country transfer posture (§10).
- Children's data stance (§11).
- Processor DPA checklist (§12).

**Deferred to [[../30-Implementation/privacy-and-consent]]:**

- The privacy notice content + structure (Art. 13).
- The signup consent checkbox copy (DE / EN).
- The Settings → Privacy Center UX.
- The DSAR / portability / erasure endpoint specs.
- The breach notification runbook + Art. 33/34 decision tree.
- The cookie inventory table.

**Deferred to other gaps:**

- Edge WAF + per-endpoint quotas → **F12 Rate limiting**.
- Pentest strategy → **F13 (P3)**.
- DPIA for future analytics → **H7 / G3** when they land.
- DPIA for future payments → new ADR + this note's update when
  payments enter scope.

## 2. ePrivacy + GDPR 2026 framing for an offline-first PWA

### 2.1 ePrivacy Art. 5(3) applies to our IndexedDB / SW

CJEU *Planet49* (C-673/17) and *Orange România* (C-61/19)
established that **any storing or accessing of information on the
user's terminal equipment** triggers Art. 5(3) — regardless of
whether the storage is a cookie, localStorage, IndexedDB, the
Cache API, or Service Worker scope. There is no "PWA exemption".

The "strictly necessary" exemption to consent requirement applies
when the storage is **indispensable for delivering the
user-requested service**. Per CNIL + BfDI + ICO interpretation in
2024-2026:

| Stored item                                              | Strictly necessary? | Rationale |
| ---                                                      | ---                 | --- |
| `session_id` cookie                                      | **yes**             | auth session required for the service the user asked for |
| `refresh_token` cookie                                   | **yes**             | session continuity = part of the service |
| `csrf_token` cookie                                      | **yes**             | security mechanism for the authed session |
| `theme` cookie (UI preference)                           | **yes (defensible)** | user-requested UI personalisation; alternative: tag as "functional" not "necessary", per F2 §5.1 we mark it `SameSite=Lax` and disclose in the cookie table |
| IndexedDB save data (encrypted)                          | **yes**             | the entire offline-play capability is the user's primary requested service |
| IndexedDB `account_keystore` (wrapped master key)        | **yes**             | required to open any save offline |
| IndexedDB `device_id` token                              | **yes**             | device identification for F2 §5.3 bootstrap + F3 §9 device list (security) |
| IndexedDB onboarding state                               | **yes**             | resumable tutorial across reloads (user-requested) |
| Service Worker cache (PWA shell, assets)                 | **yes**             | offline-first is the contracted service |
| Future: behavioural analytics localStorage / IndexedDB   | **no** — consent required when H7 lands |

**Conclusion**: at MVP we set **zero non-essential storage**, so
no consent banner is required. A Privacy Policy link in the
footer + the §3 RoPA + the [[../30-Implementation/privacy-and-consent]]
notice satisfies the Art. 13 transparency obligation.

### 2.2 What does NOT apply to us

Already covered in §1.2. To restate for audit-defensibility:

- **No US transfers** → no DPF basis, no SCCs, no TIA.
- **No VLOP / gatekeeper status** → DSA / DMA not in scope.
- **No high-risk AI** → AI Act low-risk path; deterministic
  worldgen per ADR-0007.
- **No special categories** → §5 confirmation.
- **No employer data** → BDSG § 26 NA.

## 3. RoPA — 8 processing activities

The Art. 30 record is organised **by processing activity / purpose**
(EDPB + CNIL + Irish DPC convention) rather than by data class.
Each row maps to several of the six data categories A-F from §4.

| #  | Activity                                          | Lawful basis (Art. 6)            | Data categories | Recipients                | Transfer | Retention                                                                          | DPIA risk      |
| -- | ---                                               | ---                              | ---             | ---                       | ---      | ---                                                                                | ---            |
| 1  | Account registration & lifecycle                  | 6(1)(b) contract                 | A               | self                      | none     | account life + 30 d soft-delete grace                                              | low            |
| 2  | Authentication (passkey / password / MFA)         | 6(1)(b) contract                 | A               | self                      | none     | password hash: account life · passkey: until removed · TOTP: until removed · 10 recovery codes: until used/regenerated | low |
| 3  | Session & refresh-token management                | 6(1)(b) contract                 | B               | self                      | none     | session: 12 h absolute · refresh: 30 d family · audit events: 60 d hot + archive forever (see §7.2) | low            |
| 4  | Game state storage & sync                          | 6(1)(b) contract                 | C               | self                      | none     | until user deletes + 30 d grace; encrypted at rest via F5 envelope                | low            |
| 5  | Multiplayer & social features                      | 6(1)(b) contract                 | F               | other users of the same MP group | none | group life; on user departure removed within 30 d (with retention of pseudonymised audit) | low            |
| 6  | Security: anomaly detection + audit + throttling   | 6(1)(f) legitimate interest      | B, D            | self                      | none     | hot 14-60 d depending on tier; archive pseudonymised forever (§7)                  | low (LIA done) |
| 7  | Operational observability (logs, traces, metrics, crashes) | 6(1)(f) legitimate interest      | D               | self (Loki / Tempo / Prom / GlitchTip, all self-hosted on Hetzner EU) | none | Loki 14 d · Tempo 7 d · Prom 15 m aggregated · GlitchTip 30 d (per ADR-0017) | low (LIA done) |
| 8  | Transactional email (verification, reset, security notifications) | 6(1)(b) contract       | A (email + display name) + verification/reset tokens | transactional email processor (Brevo / Mailjet / IONOS — §11.4) | none (all EU) | per-message: not retained beyond delivery + 30 d delivery logs                    | low            |

Future activities (deferred):

- **Behavioural analytics** (H7) — would add a row with 6(1)(a)
  consent + new lawful-basis assessment.
- **Payments** (post-MVP business decision) — would add a row
  with 6(1)(b) contract + 6(1)(c) for accounting retention
  (German tax law: 10 years per § 257 HGB).
- **External IdP** (Google / Apple / Discord per F2 §3.6
  post-MVP) — would re-evaluate transfer status.

## 4. Lawful basis per data category

### 4.1 Category mapping

| Cat. | Description                                       | Lawful basis        | LIA needed? |
| ---  | ---                                               | ---                 | ---         |
| A    | Account identity + credentials                    | 6(1)(b) contract    | no          |
| B    | Auth + session telemetry (IP-prefix, UA hash, geo, MFA timestamps, device records, refresh-token families, `auth.*` outbox events) | 6(1)(f) legitimate interest (anomaly + audit) **and** 6(1)(b) for the parts that make sign-in work | **yes** for the security portion |
| C    | Game state + saves + outbox commands              | 6(1)(b) contract    | no          |
| D    | Observability (logs, metrics, traces, crash reports) | 6(1)(f) legitimate interest | **yes** |
| E    | Transactional email metadata                      | 6(1)(b) contract    | no          |
| F    | Multiplayer derived data + spectator snapshots    | 6(1)(b) contract    | no          |

Cat. B is the only "split-basis" category: the session record
itself is contract-necessary (you can't have an authed session
without it), but the **anomaly-detection-specific fields**
(IP-prefix retained across rotation, `auth.anomaly.*` audit
events) are legitimate-interest. We split the LIA along that line.

### 4.2 LIA-1: Security anomaly detection + audit

Three-part legitimate-interest assessment per ICO / CNIL / BfDI
2024-2026 template:

**Purpose test.** Protect user accounts from takeover, credential
stuffing, refresh-token-reuse-based session theft, multi-account
abuse (F2 §8.5 catalogue). Lawful + clearly articulated + necessary
for the service the user contracted for (the contract includes "we
keep your account secure").

**Necessity test.** Is there a less-intrusive way?

- Could we skip IP-prefix? No — without it, impossible-travel
  and credential-stuffing detection are blind. We use only `/24`
  (IPv4) or `/56` (IPv6), the coarsest unit useful for the
  purpose.
- Could we skip UA hash? No — without it, "new device" anomaly
  signals are blind. We hash the UA before storage and never
  retain the raw UA in the hot store (it lives only in the
  `device.ua_full` audit column with 180-day retention per
  F3 §9.2).
- Could we shorten retention? Hot retention is already tight (14
  days for Loki ops logs, 60 days hot for the outbox audit per
  ADR-0013). The cold archive lives forever **because the audit
  trail is the only authoritative record of what happened**;
  shorter retention would break dispute resolution.

**Balancing test.** Impact on the user is minimal because:

- IP-prefix is coarse (`/24` or `/56`), city-level country only.
- UA is hashed in hot, full only in audit column with 180-day
  cap.
- Anomaly signals trigger **notification** to the user, not
  account lockout or profiling (F2 §8.5 disposition table).
- No third-country transfers (§10).
- The user can object under Art. 21 (§14 in
  [[../30-Implementation/privacy-and-consent]] documents the
  override rationale: anomaly detection is a Tier-A security
  control, so the override is documented but objection requests
  are processed via account closure rather than per-signal
  opt-out).
- Retention beyond 60 days is pseudonymised on Art. 17 erasure
  (§7.2): the audit event sequence survives but is disconnected
  from the natural person.

**Outcome**: 6(1)(f) legitimate interest with strong safeguards.
LIA stored in this note + referenced from the RoPA row.

### 4.3 LIA-2: Operational observability

**Purpose test.** Diagnose crashes, performance regressions,
sync correctness, save durability. Without these we cannot
deliver the contracted "offline-first save your game" service
reliably. Established legitimate-interest precedent under EDPB
+ national-DPA practice (e.g. CNIL on web error monitoring).

**Necessity test.** Already minimised per
[[telemetry-privacy]] D11:

- Redaction at the Alloy collector before ingest (F1 §4.4-I2
  deny-list).
- Sample-based traces (Tempo).
- Aggregated metrics with no per-user ID (Prometheus).
- Crash reports with PII redaction (GlitchTip).
- All EU-hosted, self-managed.

**Balancing test.** Impact is minimal: no behavioural
profiling, no marketing, no third-party data flow, no
recipient outside Hetzner EU.

**Outcome**: 6(1)(f) legitimate interest. LIA stored.

## 5. Special categories — none

Confirmed: we process **no** Art. 9 special-category data. Per
the category-by-category check:

- **Health data**: NA — we ask no health questions.
- **Genetic / biometric**: NA — passkey credentials store **only
  the cryptographic public key + credentialId**, not biometric
  templates. EDPB + W3C WebAuthn position: biometric verification
  happens **on-device** in the authenticator (Face ID, Touch ID,
  Windows Hello) and **only the signed challenge response**
  leaves the device. The server never sees biometric data. (Q2
  research confirmed; W3C WebAuthn-3 §1.2 + multiple national
  DPA opinions.)
- **Racial / ethnic origin**: NA — we do not collect.
- **Political opinions / religious beliefs / philosophical
  beliefs**: NA — we do not collect.
- **Trade-union membership**: NA — we do not collect.
- **Sex life / sexual orientation**: NA — we do not collect.

**Locale + timezone** are not special categories per the Art. 9
list, even though they can sometimes correlate with sensitive
attributes. They are processed for the explicit purpose of
"present the UI in the user's language + time zone" per Art. 6(1)(b).

The RoPA accordingly omits any Art. 9 column.

## 6. Children's data — 16+ self-declaration gate

### 6.1 Legal framing

- GDPR Art. 8(1): for information-society services offered
  directly to a child, consent-based processing is lawful only
  with parental authorisation below a national threshold (13-16).
- Germany sets the threshold at **16** (BDSG § 12).
- Our lawful basis for the core account is Art. 6(1)(b)
  contract, not consent — so Art. 8 strictly governs the consent
  layer only. However EDPB + national DPAs expect indie games
  to apply "age-appropriate design" regardless of legal basis.

### 6.2 Decision (locked)

- **Self-declaration age gate at signup**: a single radio
  question "Bist du 16 Jahre alt oder älter?" / "Are you 16 or
  older?". Required, unchecked by default.
- **Refusal copy** if "No": "Wir können leider noch keine Konten
  für Nutzer unter 16 erstellen." / "We can't create accounts
  for users under 16 yet."
- **Do not collect date of birth**. The age gate result is a
  single boolean derived from the radio; we persist it as
  `user.attested_age_band = '16+'` with no date.
- **Marketing posture**: we do not target under-16s (no
  cute/child-themed marketing copy, no age-flexible features
  marketed to children).
- **No parental-consent flow** at MVP. The operational burden
  is heavy (parent identity verification, signed authorisation,
  ongoing minor protection) and not justified by our product's
  audience.
- **Privacy notice statement**: "Wir bieten den Dienst nicht
  bewusst Nutzern unter 16 an und verarbeiten wissentlich keine
  Daten von Kindern. Wenn du erfährst, dass uns Daten eines
  Kindes übermittelt wurden, kontaktiere uns; wir löschen sie
  unverzüglich." (parallel EN copy in the implementation note).

This is the EDPB-acceptable "small-operator self-declaration"
approach and matches the BfDI / CNIL / ICO 2024-2026 stance for
non-high-risk services that don't actively target children.

## 7. Retention schedule

### 7.1 Per-category table

| Category | Specific items                                  | Hot retention                  | Archive               | Deletion trigger                                          |
| ---      | ---                                             | ---                            | ---                   | ---                                                       |
| A        | email, display name, locale, tz, attested_age_band | account life                  | n/a                   | account delete + 30 d grace → hard delete                  |
| A        | password Argon2id hash                          | account life                  | n/a                   | account delete + 30 d grace                                |
| A        | passkey credentials                             | until removed by user OR account delete + 30 d | n/a    | user removes credential OR account delete                  |
| A        | TOTP secret                                     | until removed                 | n/a                   | user disables MFA OR account delete                        |
| A        | recovery code Argon2id hash + env_recovery_i    | until used OR regenerated     | n/a                   | recovery-code use OR regen OR account delete               |
| A        | `accountSecret`, `Env_user`, `user_salt`, master-key envelope metadata | account life | n/a    | account delete + 30 d grace → cryptographic erasure (burn envelope) + ciphertext delete on next backup cycle |
| B        | session_id record (Redis hot)                   | 30 min idle / 12 h absolute    | n/a                   | TTL expiry OR logout                                       |
| B        | refresh-token + rtfam record                    | 30 d per token; family 30 d absolute | n/a            | rotation consumes; family-revoke on reuse / logout / 30 d expiry |
| B        | device record (`device` table)                  | account life                   | n/a                   | account delete + 30 d                                      |
| B        | `device.ua_full` (audit column)                 | **180 d** rolling              | n/a                   | scheduled per-day cleanup job                              |
| B + Audit| `auth.*` outbox events (login, MFA, password change, recovery, anomaly, …) | 60 d hot           | **archive forever, pseudonymised on Art. 17 erasure** | ADR-0013 retention + §7.2 pseudonymisation policy |
| C        | save data (IndexedDB encrypted)                  | until user deletes             | n/a                   | save delete + 30 d grace → DB drop                         |
| C        | save_registry rows                              | until save delete + 30 d       | n/a                   | save lifecycle (ADR-0005 §10)                              |
| C        | offline outbox (pending commands)                | until synced OR offline TTL    | n/a                   | sync success OR ADR-0002 cap eviction                      |
| D        | Loki operational logs                            | **14 d**                       | n/a                   | TTL                                                        |
| D        | Tempo traces                                    | **7 d**                        | n/a                   | TTL                                                        |
| D        | Prometheus metrics                              | **15 m** aggregated, no per-user IDs | n/a            | retention policy                                           |
| D        | GlitchTip crash reports                         | **30 d** PII-redacted          | n/a                   | TTL                                                        |
| E        | transactional email message body                | not retained beyond delivery  | n/a                   | delivery success → drop                                    |
| E        | transactional email delivery logs (vendor side) | **30 d**                       | n/a                   | vendor retention policy (per DPA)                          |
| F        | MP group membership                             | group life                    | n/a                   | group dissolution OR user leave (with 30 d audit retention) |
| F        | MP commands (in audit context)                  | same as `auth.*` outbox events| same                  | same as B + Audit                                          |
| F        | spectator snapshots (ADR-0015; post-MVP)        | session-bounded                | n/a                   | post-match cleanup                                         |

### 7.2 Permanent audit retention vs Art. 17 — pseudonymisation policy

ADR-0013 keeps the outbox cold archive **forever** for
forensic / dispute resolution. GDPR Art. 17 grants users the
right to deletion. These tensions resolve as follows:

- On account delete + 30 d grace expiry, we run a
  **pseudonymisation pass** on the cold archive: every event
  with this user as `aggregate_id` has the `user_id` field
  replaced by `pseudo:<HMAC-SHA256(server_secret, user_id)>`
  (a one-way mapping; the server cannot reverse it without
  storing a reverse map, which we explicitly **do not**).
- The event payload's `actor_id` is replaced with the same
  pseudonym.
- Any `ip_prefix`, `ua_hash`, `country` fields that survived
  redaction are dropped at the same time (the pseudonymisation
  pass also acts as a minimisation pass).
- The **event sequence and timestamps** survive — necessary for
  forensic continuity (e.g. "show me all commands in season X
  match Y").
- The pseudonymisation event itself is logged
  (`audit.user_pseudonymised`) as the final event referencing
  the natural person.

This aligns with EDPB Opinion 5/2014 on anonymisation techniques
+ updates: a one-way pseudonymisation that the controller cannot
reverse without additional information held by no one is treated
as effective erasure for Art. 17 purposes when applied to
records that must legitimately persist for an overriding
purpose (here: forensic + dispute resolution + legal-defence
posture per Art. 17(3)(e)).

### 7.3 Cryptographic erasure on account delete

The encrypted save data benefits from a **stronger form of
deletion**: on account delete + 30 d grace expiry, we burn
`Env_user` + all 10 `Env_recovery_i` + `accountSecret` server-
side. After that point, the at-rest ciphertext is
**cryptographically unreachable** even if the disk blocks have
not yet been physically overwritten. The actual ciphertext
blocks then drop on the next backup-rotation cycle (typically
≤ 30 d for Hetzner snapshot tier; full erasure ≤ 90 d).

EDPB has consistently treated cryptographic erasure as
effective Art. 17 fulfilment provided the key material is
verifiably destroyed (Opinion 5/2014 + 2020-2024 updates).
Our F5 design satisfies this because the master key `K` is
**never present server-side** in plaintext, so destroying
`Env_user` is destroying the only path to `K` we ever held.

### 7.4 Backup retention

- **Hetzner block-storage snapshots**: 7-day daily + 4-week
  weekly + 6-month monthly rotation. Configured in Dokploy.
- **sops + age encrypted secrets**: committed to git; rotation
  per F11 runbook.
- **Redis AOF + RDB**: every-second AOF + 5 min RDB; backup
  files retained 30 d per F3 §3.1.
- **SurrealDB exports**: weekly dump kept 30 d.

On Art. 17 erasure, **we do not scrub the backups**.
Justification: industry standard, EDPB-acceptable, and the
backup rotation makes the data unrecoverable within ≤ 90 d
without manual intervention. The privacy notice discloses this
("backups are rotated out within 90 days; data is unrecoverable
from any backup taken after the deletion event") to satisfy
Art. 13 transparency.

## 8. DPIA — voluntary, scope, content

### 8.1 Mandatory? No.

Art. 35(3) lists three mandatory-DPIA conditions:

- **(a)** systematic + extensive evaluation + automated
  decisions with legal/significant effects. **NA**: we do not
  make automated legal decisions; anomaly signals trigger
  user-notification, never account lockout.
- **(b)** large-scale processing of special categories. **NA**:
  no Art. 9 data.
- **(c)** systematic monitoring of publicly accessible area.
  **NA**: not applicable.

Cross-checks against EDPB WP248 + 2024-2026 national lists:

- BfDI Muss-Liste (German list of mandatory-DPIA processing
  operations): our profile does not match any entry. Closest
  near-misses (and why they don't apply):
  - "Profiling for credit scoring / employment decisions" —
    NA, we do no profiling.
  - "Large-scale processing of biometric data" — NA, no
    biometrics (§5).
  - "Combining datasets from different sources to evaluate
    persons" — NA, we use only our own data and never combine
    with external datasets.
- CNIL list of operations requiring DPIA: same — no match.
- ICO equivalent: same.

**Conclusion**: DPIA **not mandatory** under Art. 35(3) +
national lists at our current scale.

**Recommendation**: produce a **voluntary DPIA** as best
practice for an indie EU studio in 2026. The remainder of §8
IS that DPIA.

### 8.2 Voluntary DPIA — §A Description

The processing in scope:

- Account registration + email verification + minimal-PII
  identity (email + display name + locale + tz +
  attested_age_band).
- Authentication via passkey + password + TOTP + recovery codes.
- Session + refresh-token state in Redis + audit-event mirror
  in SurrealDB outbox.
- Game state in IndexedDB (encrypted with F5 envelope-derived
  key) + server-side platform DB for outbox / audit / save
  registry.
- Multiplayer command processing for friend groups.
- Server-anomaly detection on auth surfaces (F2 §8.5).
- Self-hosted observability (Grafana stack + GlitchTip) on
  Hetzner EU.
- Transactional email via EU vendor.

Data flows are documented in
[[../60-Research/threat-model]] §3 trust-boundary diagram.

### 8.3 §B Necessity & proportionality

Per §4 lawful-basis analysis + §7 retention schedule, all
processing is bounded:

- Minimal PII at signup (email + display name + locale + tz).
- IP truncated at /24 (IPv4) or /56 (IPv6) before storage.
- UA hashed for the hot store; full UA only in 180-d audit.
- All secrets column-encrypted at rest.
- Master key K never plaintext server-side.
- No third-party data flow.
- No third-country transfers.
- No special categories.

### 8.4 §C Risk assessment

| Risk                                                     | Likelihood | Severity | Net  | Notes                                                                              |
| ---                                                      | ---        | ---      | ---  | ---                                                                                |
| Account takeover via credential stuffing                  | medium     | medium   | medium | F2 §8.1 progressive throttling + HIBP check; F2 §8.5 anomaly emails                  |
| Account takeover via stolen passkey (device theft)        | low        | medium   | low  | Passkey UV (biometric / PIN) at the authenticator step; F3 §9.5 per-device revoke   |
| Server-side credential exposure (DB breach)               | low        | high     | medium | passwords Argon2id-hashed; accountSecret column-encrypted; F1 §4.6-E5 hardening      |
| Identification via observability data                     | very low   | low      | very low | Coarse IP-prefix only; hashed UA; 14-30 d hot retention; F1 §4.4-I2 redaction         |
| Identification via correlation of audit events            | low        | low      | low  | §7.2 pseudonymisation on Art. 17 erasure                                            |
| Loss of access to saves ("we can't recover" cliff)        | low        | medium   | low  | F2 + F5 surface the cliff explicitly; portable-export with passphrase is the escape  |
| Mass account compromise via supply-chain attack on us     | very low   | high     | medium | F1 §4.6-E4 supply-chain controls; Tier-A dependency audit                            |
| User unable to exercise rights (DSAR not honoured)        | very low   | low      | very low | DSAR endpoint automated per [[../30-Implementation/privacy-and-consent]]              |
| Children's data accidentally collected                    | very low   | medium   | low  | §6 age gate + privacy-notice statement                                              |
| Anomaly-detection false-positive locks user out          | very low   | low      | very low | F2 §8.5 explicitly disallows auto-lockout at MVP                                    |

### 8.5 §D Mitigations

All described in F1 / F2 / F3 / F5 + [[telemetry-privacy]] D11.
F6 adds no new mitigation primitives; this DPIA confirms the
existing controls are sufficient for the assessed risk profile.

### 8.6 §E Residual risks accepted

| #     | Residual                                           | Acceptance rationale                                              | Re-evaluate when |
| ---   | ---                                                | ---                                                               | ---              |
| RR-F6-1 | "Cannot recover" cliff loses user data           | F2 Q4 + F5 stance; we explicitly cannot have a master copy of K   | Critical-data tier (payments, real-money) ever added |
| RR-F6-2 | Backup retention up to 90 d post-Art.17           | Industry standard; EDPB-acceptable; transparency disclosed         | If any DPA challenges the disclosure |
| RR-F6-3 | Forensic pseudonymisation retains event sequence | Art. 17(3)(e) defence + dispute resolution; one-way HMAC          | If a DPA challenges or new EDPB opinion narrows |
| RR-F6-4 | Sub-millisecond timing oracle on signup endpoint  | F2 §8.2 + F5 §9-A6 dummy-Argon2id mitigation; residual is statistical | Demonstrated practical attack |
| RR-F6-5 | Pre-launch external pentest not scheduled         | F1 Q7 deferred; F13 P3 covers ongoing program                     | Pre-public-beta launch milestone |

### 8.7 §F DPO opinion / founder self-review

In lieu of a DPO (§9 — not required), the Privacy Lead
(founder, name to be filled in at filing time) has reviewed
this DPIA and concludes:

- The processing falls **below the Art. 35(3) mandatory-DPIA
  threshold**.
- The residual risks are accepted with the documented triggers.
- **Art. 36 prior DPA consultation is not required** (residual
  risk is not "high" per WP248 framing).
- The DPIA will be reviewed **annually** and on any of:
  - Adding behavioural analytics (H7).
  - Adding payments.
  - Adding external IdP (F2 §3.6).
  - Substantive change to F1-F5 architecture.
  - Major EDPB / national DPA guidance update.

## 9. DPO — not required

### 9.1 Art. 37 GDPR

- **37(1)(a)** public body — NA.
- **37(1)(b)** core activities = regular and systematic
  monitoring of data subjects on a **large scale**. EDPB WP243
  rev. 01 defines "large scale" via number of subjects, volume,
  range, duration, geographic extent — none of these reach the
  threshold at our profile.
- **37(1)(c)** core activities = large-scale processing of
  Art. 9 data — NA (§5).

### 9.2 BDSG § 38 Germany

§ 38(1) BDSG lowers the threshold: **20 persons permanently
engaged in automated processing**. A 1-3 founder studio is far
below this. The § 38 special cases (commercial data brokering,
scoring, DPIA-mandatory processing) do not apply.

### 9.3 Determination

**DPO is not mandatory.** Best practice for our profile:

- Designate **one founder as "Privacy Lead"** in internal
  documentation.
- Privacy Lead is responsible for: maintaining the RoPA, owning
  the DPIA, handling DSARs, owning the breach-notification
  runbook, owning the vendor-DPA review process.
- The Privacy Lead is **not** a DPO under Art. 37; the role is
  internal-organisational, not a regulatory appointment.

### 9.4 What would change this

- Scaling above ~100 k EU MAU with continuous monitoring →
  re-evaluate Art. 37(1)(b).
- Hiring ≥ 20 employees engaged in automated processing → § 38
  BDSG triggers automatically.
- Adding Art. 9 special-category processing at any scale →
  Art. 37(1)(c) triggers.
- Adding commercial data brokering / scoring → § 38 BDSG
  special case.
- Becoming DPIA-mandatory (Art. 35(3)) → § 38(2) BDSG triggers
  DPO requirement.

## 10. Third-country transfers — none

### 10.1 Our infrastructure path

| Surface                           | Provider                            | Location | Transfer? |
| ---                               | ---                                 | ---      | ---       |
| Application server                | Hetzner                             | DE       | none      |
| SurrealDB                         | Hetzner (self-hosted)              | DE       | none      |
| Redis                             | Hetzner (self-hosted)              | DE       | none      |
| Object storage (saves backups)    | Hetzner Storage Box                 | DE       | none      |
| Container deployment              | Dokploy (self-hosted)              | DE       | none      |
| Observability (Grafana stack + GlitchTip) | self-hosted on Hetzner       | DE       | none      |
| DNS                               | Hetzner DNS (or future IONOS DNS)   | DE       | none      |
| Email (transactional)             | Brevo / Mailjet / IONOS (§11.4)     | FR / DE  | none      |
| Source code + CI                  | GitHub                              | US       | **edge case** (§10.3) |
| Container registry                | GitHub Container Registry (ghcr.io) | US       | **edge case** (§10.3) |

**Locked posture**: zero personal-data transfers to third
countries during runtime. The two GitHub edge cases below are
explicitly assessed.

### 10.2 What this lets us skip

- **No SCC** (Standard Contractual Clauses) paperwork on file.
- **No TIA** (Transfer Impact Assessment) documents.
- **No DPF** (EU-US Data Privacy Framework) basis.
- **No Schrems-III contingency planning** (because we don't
  rely on adequacy / SCCs for runtime data).

The privacy notice + RoPA state explicitly: "no third-country
transfers".

### 10.3 GitHub edge case

GitHub is a US-domiciled processor (Microsoft Corporation
subsidiary, DPF-certified). **No personal data passes through
GitHub in our runtime architecture**:

- The source code in the repository contains no personal data.
- CI workflows (`pnpm check && typecheck && test && e2e`) run
  on GitHub-hosted runners but only against ephemeral fixture
  data, never against production data.
- Production secrets are sops-encrypted in git; the at-rest
  decryption key (age private key) lives only on the Hetzner
  deployment VM. GitHub Actions cannot decrypt them.
- IP addresses of CI-triggering developers (Nico + future
  collaborators) are processed by GitHub under the developer's
  own contract with Microsoft; not in scope for our
  controller-side analysis.

**Conclusion**: GitHub is not a processor of user personal data
for our service. We do not need an Art. 28 DPA with Microsoft /
GitHub for the Klubhaus Elf product. The relationship is
covered by Microsoft / GitHub's own published GDPR posture
for code-hosting customers.

If we ever ship CI workflows that touch production data, this
analysis must be revisited.

## 11. Processor Art. 28 DPAs

### 11.1 Required DPAs

| Processor             | Role                              | Action                                                                  |
| ---                   | ---                               | ---                                                                     |
| Hetzner Online GmbH   | Infra hosting + storage           | Sign Hetzner's standard Auftragsverarbeitungsvertrag (AVV) at signup    |
| Brevo / Mailjet / IONOS (§11.4) | Transactional email     | Sign vendor's Art. 28 DPA; verify EU subprocessors disclosure list      |

### 11.2 Not required

| Vendor          | Why                                                            |
| ---             | ---                                                            |
| Dokploy         | Self-hosted on our own VM; not a third party                   |
| GitHub          | No user personal data flows (§10.3)                            |
| Sentry          | Not used (we self-host GlitchTip)                              |
| Cloudflare      | Explicitly rejected per F2 §3.6 + F1 Q5                        |
| Google / Apple / Microsoft / Discord IdPs | None used at MVP (F2 §3.6)             |
| analytics SaaS  | None used (no behavioural analytics at MVP)                    |
| reCAPTCHA / hCaptcha / Turnstile | Explicitly rejected per F2 §8.3              |

### 11.3 Art. 28(3) bullet checklist (review on vendor onboarding)

For each new processor, confirm the DPA covers Art. 28(3) items:

- subject matter + duration of processing
- nature + purpose of processing
- type of personal data
- categories of data subjects
- obligations + rights of controller
- processor processes only on documented instructions (Art. 28(3)(a))
- confidentiality commitments for personnel (Art. 28(3)(b))
- technical + organisational measures Art. 32 (Art. 28(3)(c))
- engaging sub-processors only with prior authorisation (Art. 28(3)(d))
- assistance with data-subject rights (Art. 28(3)(e))
- assistance with security, breach notification, DPIA (Art. 28(3)(f))
- deletion or return of data at end of provision (Art. 28(3)(g))
- audit + inspection rights (Art. 28(3)(h))
- prohibition on processor as controller of new processing

### 11.4 Transactional email vendor pick (Q&A — see §14)

**Default**: Brevo (formerly SendinBlue; FR-domiciled, ISO 27001,
EU-only data residency option, signed DPA available off-the-
shelf). Mailjet (FR, owned by Sinch) is a strong alternative.
IONOS is DE-domiciled, smaller transactional API surface, also
acceptable. **Self-hosted Postfix on Hetzner**: full residency
+ full ops burden; **not recommended at MVP** for a 1-3 founder
team. (F2 §10.7 + F2 §11 Q6 already declared Brevo as default.)

## 12. Compliance overhead

### 12.1 Time budget (founder time, indie 1-3 person studio)

| Task                                             | Initial          | Ongoing                  |
| ---                                              | ---              | ---                      |
| RoPA + privacy notice + cookie inventory         | 1-3 days         | 0.5 d quarterly review   |
| DPIA + LIAs (this note)                          | 3-5 days         | 1 d annual review        |
| Vendor DPA review                                | 0.5 d per vendor | 0.5 d on each new vendor |
| DSAR handling (automated)                        | 1-2 d to build   | ~5 min per request once automated |
| Account-deletion runbook + automation            | 1-2 d            | ~5 min per request       |
| Breach-notification runbook + drill              | 1 d              | annual drill             |
| Privacy-notice maintenance                       | bundled with launch | ~0.5 d annual review |
| Children's age-gate maintenance                  | bundled with auth UI | n/a                  |
| EDPB guidance review                             | n/a              | 0.5 d quarterly scan      |

**Total launch budget**: ~7-15 founder days for the full
compliance push (incl. the F6 doc set you're reading).
**Total ongoing**: ~3-5 founder days per year + per-incident.

### 12.2 LLC + cyber insurance

Recommendation: operate as **UG / GmbH** (limited liability)
from the legal entity inception. A 1-founder UG with €1
nominal capital is acceptable to launch; convert to GmbH
(€25 k capital) once revenue justifies. Limited liability
caps GDPR Art. 82 exposure at the company level for non-
intentional violations.

Cyber-insurance: a "Cyber-Versicherung" / "IT-Haftpflicht" for
indie EU studios in 2026 costs roughly €500-2 000 / year at
the entry tier covering ≤ €100 k claim. Reasonable for
post-launch; not strictly required pre-launch.

### 12.3 Documentation discipline

This F6 note + the companion implementation note + the
F1-F5 + D11 vault notes ARE the GDPR documentation paper trail.
Per Art. 5(2) accountability principle, the controller must be
able to **demonstrate** compliance, not just assert it. The
vault discipline (one note per locked decision, with
sources + Q&A + follow-ups) satisfies this for an EU audit /
DPA inquiry.

## 13. Future-proof triggers — what changes the answers

| Architectural change                       | What triggers                                                  |
| ---                                        | ---                                                            |
| Add payments (Stripe / Paddle / Mollie)    | New RoPA row; new Art. 28 DPA; new retention (10y per § 257 HGB); possibly new DPIA |
| Add behavioural analytics (H7)             | New RoPA row; consent layer required; consent-banner needed; new DPIA |
| Add external IdP (Google / Apple / Discord per F2 §3.6) | Transfer status re-evaluation; new Art. 28 / 44 analysis; new RoPA row |
| Cross + non-EU staff hires                  | § 38 BDSG threshold check; possibly DPO trigger              |
| Public beta + > 100 k EU MAU                | Art. 37(1)(b) DPO threshold re-evaluation                    |
| Real-money in-game purchases                | New Art. 28 + retention + DPIA                                 |
| User-generated content moderation          | F9 gap + DSA "online platform" classification re-check        |
| Real-time MP with persistent player profiles + matchmaking ratings | New "profiling" analysis under Art. 22                |
| Adding biometric data (e.g. tone-of-voice for press conference UI) | Art. 9 trigger → DPO mandatory |
| Adding under-16 user support                 | Parental-consent flow → DPIA mandatory                       |

## 14. Open decisions for Nico (Q&A)

Per the workflow rule, F6 surfaces only the genuine
product-owner / one-way-door decisions. The rest are folded into
this note as locked best-practice defaults.

### Q1. Transactional email vendor pick

Confirm: **Brevo (FR, EU residency)** as default. Mailjet (FR)
or IONOS (DE) as fallbacks. Self-hosted Postfix rejected at MVP.

Default: **Brevo**.

### Q2. Age gate language

Confirm: at signup, a single mandatory radio question
"Bist du 16 Jahre alt oder älter?" / "Are you 16 or older?".
Refusal on "No". No date-of-birth collected. No parental-consent
flow at MVP.

Default: **confirmed**.

### Q3. Permanent audit retention + Art. 17 pseudonymisation

Confirm: the outbox cold archive is **forever** (ADR-0013),
with **one-way HMAC pseudonymisation** of `user_id` +
`actor_id` + drop of IP/UA fields on the Art. 17 erasure event.
Event sequence + timestamps survive for forensic continuity.

Default: **confirmed**.

### Q4. "We do not scrub backups" disclosure

Confirm: on Art. 17 erasure, we burn `Env_user` + recovery-code
envelopes + delete production records immediately, but **do
not** retroactively scrub Hetzner / Redis / SurrealDB backups.
The next backup-rotation cycle (≤ 30/90 d depending on tier)
makes the data unrecoverable. Privacy notice discloses this.

Default: **confirmed**.

### Q5. DPIA + LIAs as part of this F6 note (vs separate docs)

Confirm: the **voluntary DPIA** (§8) and the **two LIAs**
(§4.2, §4.3) live inside this F6 research note. Annual review
updates this note in-place; substantial architectural changes
trigger a status-bump per the vault governance.

Default: **confirmed**.

### Q6. Privacy Lead designation

Confirm: **founder Nico** is designated as Privacy Lead in
internal documentation (responsible for RoPA, DPIA reviews,
DSAR handling, breach notification, vendor DPA review). Not a
DPO under Art. 37. The companion implementation note records
the contact email surfaced in the privacy notice.

Default: **founder Nico**.

## 15. F6 follow-up tasks (deferred, not blocking)

| #     | Task                                                                | Owner gap |
| ---   | ---                                                                 | ---       |
| FU-1  | Implementation of `POST /api/me/data-export` DSAR endpoint          | [[../30-Implementation/privacy-and-consent]] §6 owns the spec; E10 + E11 own the build + tests |
| FU-2  | Implementation of `POST /api/me/delete-account` + 30 d grace job    | same as FU-1 |
| FU-3  | Breach notification runbook drill (annual)                          | F11 owns the operational runbook                                                                          |
| FU-4  | Vendor DPA signed copies on file (Hetzner + transactional email)    | Founder responsibility — to be done before public launch                                                  |
| FU-5  | Cyber insurance policy procurement                                  | Founder responsibility — post-launch                                                                      |
| FU-6  | LLC entity formation (UG / GmbH)                                    | Founder responsibility — pre-launch                                                                       |
| FU-7  | Annual DPIA review automation reminder                              | F11 or calendar reminder                                                                                  |
| FU-8  | Quarterly RoPA review automation reminder                           | F11 or calendar reminder                                                                                  |
| FU-9  | Update F6 + privacy-and-consent when H7 / G3 lands analytics consent layer | future task                                                                                       |

## 16. Sources

### Standards + regulation

- GDPR (Regulation (EU) 2016/679):
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- ePrivacy Directive 2002/58/EC + Cookie Directive 2009/136/EC:
  <https://eur-lex.europa.eu/eli/dir/2002/58/oj>
- BDSG (DE):
  <https://www.gesetze-im-internet.de/bdsg_2018/>
- EU AI Act (Regulation (EU) 2024/1689):
  <https://eur-lex.europa.eu/eli/reg/2024/1689/oj>
- DSA (Regulation (EU) 2022/2065):
  <https://eur-lex.europa.eu/eli/reg/2022/2065/oj>
- DMA (Regulation (EU) 2022/1925):
  <https://eur-lex.europa.eu/eli/reg/2022/1925/oj>

### CJEU rulings

- *Planet49* (C-673/17): consent for non-essential terminal-
  storage; pre-ticked boxes invalid.
- *Orange România* (C-61/19): strict consent standards.
- *Schrems II* (C-311/18): EU-US transfers require equivalent
  protection.

### EDPB + national DPA guidance

- EDPB Guidelines 03/2022 on Deceptive Design Patterns:
  <https://www.edpb.europa.eu/system/files/2023-02/edpb_03-2022_guidelines_on_deceptive_design_patterns_in_social_media_platform_interfaces_v2.0_en_0.pdf>
- EDPB Guidelines 2/2019 on Article 6(1)(b) contract necessity.
- EDPB Guidelines 3/2019 on processing for security purposes.
- EDPB Guidelines 05/2020 on consent.
- WP243 rev. 01 (endorsed by EDPB) on DPOs.
- WP248 rev. 01 (endorsed by EDPB) on DPIA.
- WP250 rev. 01 (endorsed by EDPB) on personal data breach
  notification.
- EDPB Opinion 5/2014 on anonymisation techniques.
- BfDI guidance for private bodies:
  <https://www.bfdi.bund.de/EN/Buerger/Inhalte/AlltagsThemen/Datenschutz.html>
- CNIL "Tenir un registre des activités de traitement":
  <https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement>
- BfDI Muss-Liste (mandatory DPIA list, DE):
  <https://www.bfdi.bund.de/SharedDocs/Downloads/DE/Konsultationsverfahren/8_DSFA-MussListe.pdf>
- ICO Records of Processing Activities guidance.

### Project-internal anchors

- [[telemetry-privacy]] (D11) — observability + consent input.
- [[threat-model]] (F1) §1.3 attacker tiers; §4.4 information
  disclosure; §5 cryptography.
- [[../30-Implementation/auth-flows]] (F2) §3 signup; §6
  recovery codes; §10 libraries.
- [[../30-Implementation/session-management]] (F3) §8
  revocation matrix.
- [[../30-Implementation/account-recovery]] (F5) §2 master-key
  envelope; §6 rotation; §11.5 GDPR cross-references.
- [[../30-Implementation/audit-trail]] outbox is the audit
  trail.
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  tiered retention (60 d hot + archive forever).
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  Loki / Tempo / Prom / GlitchTip retention.

### Perplexity research transcripts (this gap)

Seven focused Perplexity-sonar-pro queries, 2026-05-18, total
~52 k tokens, ~$0.15 estimated:

1. GDPR + ePrivacy 2026 state; ePrivacy Regulation status; DPF;
   DMA / DSA / AI Act applicability; EDPB 2024-2026 guidelines.
2. RoPA structure + lawful basis per category + special-
   category check + children's data + third-country transfers +
   Art. 28 DPA checklist.
3. Retention per category + audit-permanent-vs-Art.17
   tension + cryptographic erasure + backup retention.
4. DPIA scope + template + WebAuthn passkey biometric posture +
   anomaly-detection risk assessment + Art. 36 prior
   consultation.
5. User rights implementation (Art. 15 / 16 / 17 / 18 / 20 / 21 /
   22) + DSAR export shape + 30 d account-deletion grace +
   refusal grounds.
6. Consent UX 2026 + cookie banner threshold + Privacy Center
   pattern + signup consent copy + cookie inventory format.
7. DPO obligation + RoPA <250 exemption + breach notification
   runbook + Art. 28 DPA checklist + compliance overhead
   estimate.

Raw transcripts not committed (ephemeral); citations preserved
inline in §16 above + per-section anchors throughout the note.
