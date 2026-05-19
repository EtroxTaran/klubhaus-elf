---
title: Secrets Management — sops + age + direnv, rotation, leak response, dep audit, backup drills
status: current
tags: [implementation, secrets, sops, age, direnv, key-rotation, leak-response, supply-chain, backups]
created: 2026-05-18
updated: 2026-05-18
type: implementation
binding: true
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
related:
  - "[[secrets-rotation]]"
  - "[[deployment-dokploy]]"
  - "[[audit-trail]]"
  - "[[incident-response]]"
  - "[[../60-Research/threat-model]]"
  - "[[../60-Research/gdpr-compliance]]"
  - "[[auth-flows]]"
  - "[[session-management]]"
  - "[[account-recovery]]"
  - "[[privacy-and-consent]]"
---

# Secrets Management — sops + age + direnv, rotation, leak response, dep audit, backup drills

This note resolves Wave 3 gap **F11** (Secrets management runbook,
**P1**) and is the **binding implementation specification** for:

- sops + age + direnv repo layout, key hierarchy, and lifecycle.
- The **15-category secret inventory** (A–O) with per-category
  rotation cadence, overlap window, and outbox event.
- **Zero-downtime rotation recipes** for the four highest-impact
  categories: HMAC pepper, `accountSecret` column-encryption key,
  age keys, DB credentials.
- The **secret-injection** pattern into CI (GitHub Actions) and
  production (Dokploy on Hetzner) — zero-secret CI + Dokploy
  decrypts locally per the 2026 best-practice recommendation.
- The **5-tier accidental-leak response runbook** with detection
  sources, 1-hour playbook, leaked-age-key procedure, and
  leaked-column-encryption-key procedure.
- The **quarterly Tier-A dependency audit runbook** (closes F1
  FU-4).
- The **backup + recovery drill schedule** (Redis monthly,
  SurrealDB semi-annually, age key annually, full system
  quarterly), closing F3 FU-6.
- Six **DR tabletop scenarios** for annual exercises.

F11 closes:

- **F1 FU-4** Quarterly Tier-A dependency audit runbook
- **F1 FU-6** Sigstore Rekor-outage runbook (verification fallback path)
- **F3 FU-6** Redis persistence drill (restore from AOF + RDB into a fresh box)

It anchors on F1 (threat model, supply chain, crypto), F2 (auth
pepper rotation, HMAC token hash), F3 (Redis hot store + session
secrets), F5 (master-key envelope rotation; this note covers the
**column-encryption** key one layer below), F6 (RoPA + breach
notification + retention; F11 is where the operational secrets
side lives).

The shorter, narrowly-scoped [[secrets-rotation]] note remains as
the **cloud-agent-credential-boundary** policy (Cloud Agents must
not receive production credentials; staging tokens rotate at
least quarterly). This note (F11) is the broader runbook; both
co-exist.

## 1. Scope and stance

### 1.1 Profile

- **Stack baseline**: sops + age + direnv (chosen per
  `.cursor/rules/00-stack-always.mdc`; not up for revision in
  this gap).
- **Deployment**: Hetzner EU VM via Dokploy (self-hosted, single-
  tenant per deployment).
- **CI**: GitHub Actions; container registry ghcr.io; cosign
  keyless signing via GitHub OIDC + Sigstore public-good per
  F1 §4.2 T6.
- **Team**: 1-3 founders at launch; designed for scale to ≤ 5
  developers without a hard re-architecture.
- **Compliance basis**: GDPR Art. 32 + ENISA + OWASP Secrets
  Management Cheat Sheet + NIST SP 800-57 Pt. 1 key lifecycle +
  NIST SP 800-61 incident handling.

### 1.2 What F11 locks

- **Repo layout** for sops-encrypted secrets (§3).
- **age key hierarchy** with three classes (human / environment
  / CI) and the recovery escrow pattern (§4).
- **15-category secret inventory** A–O with rotation policy (§5).
- **Zero-downtime rotation recipes** for HMAC peppers, column-
  encryption key, age keys, DB credentials (§6).
- **CI + Dokploy secret-injection pattern** — zero-secret CI
  + local Dokploy decryption + tmpfs runtime injection (§7).
- **Onboarding + offboarding checklist** for developers (§8).
- **5-tier leak classification** + detection sources + 1-hour
  response playbook + leaked-age-key playbook + leaked-column-
  key playbook (§9).
- **Tier-A dependency audit runbook** + quarterly cadence + tool
  selection (§10).
- **Backup + recovery drill schedule** with concrete recipes
  for Redis / SurrealDB / age key / full-system drills (§11).
- **Six DR tabletop scenarios** for annual exercises (§12).
- **Audit integration** — every rotation emits an outbox event
  per ADR-0013 + audit-trail catalogue (§13).
- **Future-proof "when to graduate"** triggers for migration to
  Vault / Bitwarden Secrets Manager / Infisical / 1Password
  Connect (§14).

### 1.3 What F11 defers

- **F12 Rate limiting / anti-abuse** — F11 sets the secret-
  injection envelope for rate-limit counters and the edge WAF
  API key; F12 will own the per-endpoint quota numerics + WAF
  graduation triggers.
- **F13 Pentest strategy** — F11's leak-response runbook
  references but does not own the ongoing pentest program.
- **Deployment automation details** — F11 references
  [[deployment-dokploy]]; that note owns the Dokploy-specific
  config. Updates land there in the same PR when F11 makes
  changes touching deploy steps.
- **The detailed operational incident-response runbook** —
  [[incident-response]] owns the full 4-phase NIST SP 800-61
  flow; F11 owns the secrets-specific procedures inside it.

## 2. Secret hierarchy and identifiers

We refer to secret categories by single-letter IDs A–O throughout
this note + the audit catalogue. Each category has a stable name
+ owner + storage location.

| ID | Name                                       | Owner / scope                          | Storage at rest                                                                                  |
| -- | ---                                        | ---                                    | ---                                                                                              |
| A  | **age private keys**                       | per-developer + per-environment + per-CI | dev laptop (`~/.config/age/key.txt`) + paper backup + password manager · prod VM `/etc/age/prod.key` (0400) · CI: GitHub Actions encrypted secret `AGE_KEY_CI` |
| B  | **SurrealDB credentials**                  | root + per-context users (per ADR-0019) | sops `secrets/prod/db.enc.yaml` → runtime tmpfs                                                  |
| C  | **Redis password**                         | one per deployment                     | sops `secrets/prod/db.enc.yaml` → runtime tmpfs                                                  |
| D  | **Refresh-token `hash` HMAC pepper**       | one per deployment (F3 §4.4)            | sops `secrets/prod/app.enc.env` → runtime env                                                    |
| E  | **`accountSecret` column-encryption key**  | one per deployment (versioned)         | sops `secrets/prod/app.enc.env` keyring → runtime env                                            |
| F  | **Server-master-secret for engine seed**   | one per deployment (F1 §4.2 T8)         | sops `secrets/prod/app.enc.env` → runtime env                                                    |
| G  | **CSRF-token signing HMAC**                | one per deployment (F2 §5.4)            | sops `secrets/prod/app.enc.env` → runtime env                                                    |
| H  | **JWT signing key** (reserved)             | post-MVP API tokens                    | sops `secrets/prod/app.enc.env` (slot reserved)                                                  |
| I  | **Transactional email API key**            | Brevo / Mailjet / IONOS (F2 §10.7)      | sops `secrets/prod/app.enc.env` → runtime env                                                    |
| J  | **OTel ingest token** for Alloy            | one per deployment                     | sops `secrets/prod/observability.enc.yaml` → runtime env                                         |
| K  | **GlitchTip DSN**                          | one per deployment                     | sops `secrets/prod/observability.enc.yaml` → runtime env                                         |
| L  | **GitHub PAT for ghcr.io push**            | CI only                                | GitHub Actions encrypted secret `GHCR_PAT` (no sops file)                                        |
| M  | **Dokploy webhook secret**                 | CI ↔ Dokploy                            | GitHub Actions encrypted secret `DOKPLOY_WEBHOOK_SECRET` + Dokploy admin UI                       |
| N  | **Email verification + reset token pepper** | one per deployment (F2 §10.2, F5 §10.2)| sops `secrets/prod/app.enc.env` → runtime env                                                    |
| O  | **OAuth client secrets** (reserved)        | post-MVP per F2 §3.6 social IdP        | sops `secrets/prod/app.enc.env` (slot reserved)                                                  |

Cosign keyless container signing **does not** need a static key
— GitHub OIDC + Sigstore public-good Fulcio mint a short-lived
certificate per F1 §4.2 T6. Tracked separately from this table.

## 3. Repo layout

```text
.
├── .sops.yaml                 # sops creation rules — encrypt only values
├── .envrc                     # direnv hook: sops decrypts dev env on `cd`
├── env/
│   ├── dev.env                # non-secret defaults
│   ├── staging.env
│   └── prod.env
├── secrets/
│   ├── age/
│   │   ├── README.md          # age key hierarchy + recovery instructions
│   │   ├── team.pub.txt       # team age public keys
│   │   └── environments.pub.txt  # env-specific age public keys
│   ├── dev/
│   │   ├── app.enc.env
│   │   ├── db.enc.yaml
│   │   ├── observability.enc.yaml
│   │   └── infra.enc.yaml
│   ├── staging/
│   │   ├── app.enc.env
│   │   ├── db.enc.yaml
│   │   ├── observability.enc.yaml
│   │   └── infra.enc.yaml
│   └── prod/
│       ├── app.enc.env        # categories D, E (current+escrow), F, G, H, I, N, O
│       ├── db.enc.yaml        # categories B, C
│       ├── observability.enc.yaml  # categories J, K
│       └── infra.enc.yaml     # cosign cert misc, runbook contact info
├── deploy/
│   ├── dokploy/
│   │   ├── docker-compose.yaml
│   │   └── dokploy.yaml
│   └── github-actions/
│       ├── ci.yaml            # zero-secret CI per §7
│       └── release.yaml       # deploy pipeline
└── docs/
    └── 40-Execution/
        ├── dep-audits/        # quarterly Tier-A audit reports
        │   └── YYYY-Qn.md
        ├── restore-drills/    # backup-drill outcomes
        │   └── YYYY-MM-DD-<scope>.md
        └── incidents/         # leak-response post-mortems
            └── YYYY-MM-DD-<slug>.md
```

### 3.1 `.sops.yaml` (canonical)

```yaml
# .sops.yaml
creation_rules:
  - path_regex: secrets/dev/.*\.enc\..*$
    encrypted_regex: '^(.*_secret|.*_key|.*_token|.*_password|password|token|key|dsn|api_key)$'
    age: >-
      age1q8m4r0...nico-public-key,
      age1ns0qq0...future-dev-public-key
  - path_regex: secrets/staging/.*\.enc\..*$
    encrypted_regex: '^(.*_secret|.*_key|.*_token|.*_password|password|token|key|dsn|api_key)$'
    age: >-
      age1q8m4r0...nico-public-key,
      age1ns0qq0...future-dev-public-key,
      age1abc1234...staging-env-public-key
  - path_regex: secrets/prod/.*\.enc\..*$
    encrypted_regex: '^(.*_secret|.*_key|.*_token|.*_password|password|token|key|dsn|api_key)$'
    age: >-
      age1q8m4r0...nico-public-key,
      age1xyz9876...prod-env-public-key
    # Note: production rule deliberately excludes the CI recipient and
    # non-founder developers. CI never decrypts production secrets; Dokploy on
    # the VM does, using `age1xyz9876...prod-env-public-key`'s private key.
```

**Key points**:

- `encrypted_regex` keeps **YAML structure + comments visible**,
  encrypts only values matching the pattern. Makes `git diff`
  readable while protecting secrets.
- **Production rule excludes CI** — see §7 for the zero-secret-
  CI rationale.
- **MAC validation is enabled by default** in sops v3.x.
  Confirmed via every encrypted file carrying a `sops_mac` field.
- New environments add a new rule + new env age key; new
  developers add their public key to dev + staging rules only.

### 3.2 `.envrc` (canonical)

```bash
# .envrc
# direnv loads this on `cd` into the repo. Requires `direnv allow`.

# Load non-secret defaults
dotenv env/dev.env

# Decrypt dev secrets via the developer's age private key.
# sops resolves it via SOPS_AGE_KEY_FILE or ~/.config/sops/age/keys.txt.
# We use `sops exec-env` to avoid writing plaintext to /tmp.
if has sops && [ -f secrets/dev/app.enc.env ]; then
  # Pattern: each call exports the decrypted values into the current shell.
  eval "$(sops --output-type=dotenv -d secrets/dev/app.enc.env | sed 's/^/export /')"
  eval "$(sops --output-type=dotenv -d secrets/dev/db.enc.yaml | sed 's/^/export /')"
  eval "$(sops --output-type=dotenv -d secrets/dev/observability.enc.yaml | sed 's/^/export /')"
  eval "$(sops --output-type=dotenv -d secrets/dev/infra.enc.yaml | sed 's/^/export /')"
fi

# Sanity check: refuse to proceed if a dev tries to load prod secrets.
if [ -f secrets/prod/app.enc.env ] && [ "${ALLOW_PROD_DECRYPT:-0}" = "1" ]; then
  echo "Refusing to decrypt prod secrets in direnv. Use 'sops -d' directly with explicit intent." >&2
fi
```

**Notes**:

- We use `eval "$(sops --output-type=dotenv -d ...)"` rather than
  writing to a tempfile in `/tmp` — keeps the plaintext out of
  disk. Q1 research recommended this pattern over `direnv-sops`
  plugins which were inconsistent in 2026.
- Production secrets are deliberately **not** decryptable via
  direnv on a developer laptop unless `ALLOW_PROD_DECRYPT=1` is
  manually set + the developer's age key is in the prod rule
  (only the founder's is, by default).
- Each developer must have their age key available via
  `~/.config/sops/age/keys.txt` or `SOPS_AGE_KEY_FILE`.

### 3.3 Naming convention: `*.enc.*`

All encrypted files MUST have `.enc.` in their name (e.g.
`app.enc.env`, `db.enc.yaml`). CI lint gate (F11 FU-3) refuses
to push if it sees a file matching `secrets/**/*.{env,yaml,yml,json}`
that does NOT contain `.enc.` — preventing accidental commit of
plaintext secrets.

## 4. age key hierarchy

### 4.1 Three key classes (locked)

| Class                | Holder                                          | Storage                                                                                                                | Recovery                                              |
| ---                  | ---                                             | ---                                                                                                                    | ---                                                   |
| **Human developer**  | Each developer (Nico + ≤ 4 future)              | `~/.config/age/key.txt` (0400) + password-manager secure note + **paper-backup phrase** (printed via `age` ascii) in safe | Personal escrow (paper + safe). Family escrow contact for the founder. |
| **Environment** (dev / staging / prod) | The Hetzner VM where the env runs              | `/etc/age/prod.key` (0400, owned by `dokploy` service user) + 1Password shared vault (encrypted backup)                  | 1Password shared vault accessible by founder + Privacy Lead. |
| **CI**               | GitHub Actions `AGE_KEY_CI` repository secret    | GitHub-encrypted secret, ONLY accessible to the `release.yaml` workflow scoped to the `production` environment           | Re-generate + re-encrypt only the dev + staging files this key has access to. |

### 4.2 Public-key registry

`secrets/age/team.pub.txt` and `secrets/age/environments.pub.txt`
hold the public keys. Format:

```text
# team.pub.txt
# Nico (founder, full prod access)
age1q8m4r0...

# Future dev 2 (dev + staging access; NO prod access by default)
age1ns0qq0...
```

```text
# environments.pub.txt
# dev environment age key (CI decrypts dev secrets in PR builds)
age1devdev123...

# staging environment age key (Hetzner staging VM)
age1stgenv456...

# prod environment age key (Hetzner production VM)
age1xyz9876...

# CI deploy-only key (decrypts only deploy/infra secrets, never DB root)
age1cide7890...
```

### 4.3 Generation procedure

```bash
# On each new key generation event:
age-keygen -o ~/.config/age/key.txt          # generates private key
age-keygen -y ~/.config/age/key.txt          # prints public key
# Append the public key to the appropriate .pub.txt file with a comment
# Commit the .pub.txt update + rotate sops files

# For paper backup, the founder prints the private key contents and stores
# it in a fireproof safe + a family-escrowed copy at a separate physical
# location.
```

### 4.4 Storage rules (locked)

- Private keys NEVER committed to any repo (CI gate: gitleaks
  pattern `AGE-SECRET-KEY-1[0-9A-Z]{58}` is blocked at push).
- Private keys NEVER stored in plaintext in cloud storage
  (e.g. iCloud Drive, Dropbox). Only inside dedicated password
  managers (1Password, Bitwarden, etc.) as encrypted secure
  notes.
- Production private keys NEVER on a developer laptop unless
  the developer is the founder AND has explicit reason (e.g.
  emergency rotation, restore drill).

## 5. Per-category rotation policy

The table below extends [[secrets-rotation]] with the full
F11 surface. Cadences chosen per Q2 research + OWASP Secrets
Management Cheat Sheet + NIST SP 800-57 Pt. 1.

| ID | Secret                                | Normal cadence              | Triggers                                                          | Overlap window     | Outbox event                       | Annual review entry |
| -- | ---                                   | ---                         | ---                                                               | ---                | ---                                | ---                 |
| A  | age keys (per-dev / per-env / per-CI) | Prod: 12 m · dev: 24 m · CI: 12 m | schedule, onboarding / offboarding, leak-suspected               | None at runtime; sops files re-encrypted to new recipient set | `infra.secret_rotated{type:"age",scope:"prod"}` | yes |
| B  | SurrealDB credentials                 | Root: 6-12 m · app-users: 90 d | schedule, leak-suspected, role-change                              | 7-14 d (dual-user pattern §6.4) | `infra.secret_rotated{type:"db_user",user:"…"}` | yes |
| C  | Redis password                        | 90-180 d                    | schedule, leak-suspected                                          | Brief (≤ 1 min) restart window OR dual-pwd if Redis version supports | `infra.secret_rotated{type:"redis"}` | yes |
| D  | Refresh-token HMAC pepper             | 6 m                         | schedule, leak-suspected                                          | 7 d versioned pepper (§6.1) | `auth.secret_rotated{type:"refresh_pepper"}` | yes |
| E  | `accountSecret` column-encryption key | 12-24 m                     | schedule, leak-suspected, crypto-parameter change                  | 90 d escrow for old key (§6.2) | `auth.secret_rotated{type:"accountSecret_col_key",version:N}` | yes (+ migration report) |
| F  | Server-master-secret (match engine)   | 12 m                        | schedule, leak-suspected                                          | Indefinite (versioned per match record) | `infra.secret_rotated{type:"match_engine_master"}` | yes |
| G  | CSRF-token signing HMAC                | 6 m                         | schedule, leak-suspected, config-change                            | 7-30 d versioned (§6.1) | `auth.secret_rotated{type:"csrf_hmac"}` | yes |
| H  | JWT signing key (reserved)            | 6 m when used               | schedule, leak-suspected, algorithm-change                         | 7-30 d via `kid` header (§6.1) | `auth.secret_rotated{type:"jwt_signing",kid:"…"}` | yes |
| I  | Transactional email API key (Brevo / etc.) | 90-180 d              | schedule, vendor-compromise alert                                  | ≤ 24 h dual-key window (§6.3) | `infra.secret_rotated{type:"email_api",provider:"…"}` | yes |
| J  | OTel ingest token                     | 90-180 d                    | schedule, vendor-compromise, config-change                         | ≤ 24 h dual-token | `infra.secret_rotated{type:"otel_ingest"}` | yes |
| K  | GlitchTip DSN                         | 90-180 d                    | schedule, leak-suspected                                          | ≤ 24 h | `infra.secret_rotated{type:"error_dsn"}` | yes |
| L  | GitHub PAT for ghcr.io push           | 90 d                        | schedule, role-change, GitHub advisory                             | None (single-cut) | `infra.secret_rotated{type:"github_pat"}` | yes |
| M  | Dokploy webhook secret                | 6-12 m                      | schedule, leak-suspected, infra-change                             | Optional 1-2 deploys with both accepted | `infra.secret_rotated{type:"dokploy_webhook"}` | yes |
| N  | Email verification + reset token pepper | 6 m                       | schedule, leak-suspected                                          | 7-14 d versioned (§6.1) | `auth.secret_rotated{type:"email_reset_pepper"}` | yes |
| O  | OAuth client secrets (post-MVP)        | 90-180 d when used         | schedule, leak-suspected, app-registration change                  | 1-7 d (per IdP capability) | `auth.secret_rotated{type:"oauth_client_secret",provider:"…"}` | yes |

### 5.1 Cadence-pick rationale (lock)

- **Short (90 d / 6 m)** for high-risk credentials that an
  attacker who learns them can immediately exploit: D / G / I / J
  / K / L / N (HMAC peppers, API keys, PATs). 90 d aligns with
  AWS / GCP defaults + OWASP best practice for high-impact
  credentials.
- **Medium (6-12 m)** for credentials with strong crypto
  surrounding them: B (DB root), C (Redis password), M (webhook
  secret). Lower frequency justified by the strong-crypto
  perimeter + lower risk of opportunistic compromise.
- **Long (12-24 m)** for crypto material whose rotation cost is
  high and whose protection is provably strong: A (age keys, no
  runtime impact at rotation), E (column-encryption key, full
  background migration), F (server-master-secret, versioned per
  match record so no migration needed).

### 5.2 Compliance anchors

- **GDPR Art. 32(1)(b)** — confidentiality / integrity /
  availability ongoing assurance. The rotation policy directly
  supports this.
- **NIST SP 800-57 Pt. 1 rev. 5 §5** — key lifecycle phases:
  generation, distribution, rotation, destruction.
- **OWASP Secrets Management Cheat Sheet 2024-2026** — rotation
  cadence + zero-trust principles.
- **F6 §11 + §12** — RoPA + maintenance cadence; each rotation
  is an annual-review-table entry.

## 6. Zero-downtime rotation recipes

### 6.1 HMAC pepper rotation (categories D, G, N) — versioned pepper

**Pattern**: each token / hash carries a `version` field; the
server keeps multiple active pepper versions for an overlap
window; the latest version is used for new writes.

**Config shape** (in `apps/web/src/server/secrets/pepper-config.ts`,
loaded from sops-decrypted env on startup):

```ts
export type PepperConfig = Readonly<{
  currentVersion: number
  active: ReadonlyMap<number, Uint8Array> // version -> 32 bytes
  purpose: 'refresh' | 'csrf' | 'email-reset'
}>

export function sign(pc: PepperConfig, value: string) {
  const v = pc.currentVersion
  const pepper = pc.active.get(v)
  if (!pepper) throw new Error('current pepper missing')
  const mac = hmacSha256(pepper, `${pc.purpose}|${value}`)
  return { version: v, mac }
}

export function verify(pc: PepperConfig, value: string, version: number, mac: Uint8Array) {
  const pepper = pc.active.get(version)
  if (!pepper) return false // version retired
  return timingSafeEqual(mac, hmacSha256(pepper, `${pc.purpose}|${value}`))
}
```

**Rotation procedure** (one operator runbook, ≤ 30 minutes
elapsed):

1. Generate new pepper `P_new` (32 random bytes from
   `crypto.randomBytes`).
2. Edit `secrets/prod/app.enc.env`:
   ```dotenv
   REFRESH_TOKEN_PEPPER_V1=<existing-v1-bytes-base64>
   REFRESH_TOKEN_PEPPER_V2=<new-v2-bytes-base64>
   REFRESH_TOKEN_PEPPER_CURRENT_VERSION=2
   ```
3. Commit + push + CI deploys.
4. On deploy, the running app picks up both peppers; new tokens
   are signed with v2; existing tokens verify with v1 (still
   present).
5. Wait **7 days** (matches the refresh-token grace window from
   F3 §5.1).
6. Edit `secrets/prod/app.enc.env` again: remove v1 entirely.
   ```dotenv
   REFRESH_TOKEN_PEPPER_V2=<v2-bytes-base64>
   REFRESH_TOKEN_PEPPER_CURRENT_VERSION=2
   ```
7. Commit + push + CI deploys. The v1 pepper is gone; any token
   still presenting `version: 1` now fails verification → forces
   re-auth (acceptable, the 30-d refresh family TTL has already
   expired by overlap-window construction).
8. Emit `auth.secret_rotated` outbox event per ADR-0013.

CSRF (G) follows the same procedure with `CSRF_HMAC_*` env names
and a 7-30 d overlap (depends on dormant session distribution).
Email-reset pepper (N) follows the same with a 7-14 d overlap.

### 6.2 `accountSecret` column-encryption key rotation (E) — versioned KEK

**Important**: this is the *column-level* key that protects
`user.accountSecret` at rest in the platform DB. It is **NOT**
the F5 master key `K` — that lives only client-side, never on
the server. The column-encryption key rotates independently of
the F5 envelope rotation.

**Schema** (already provisioned per F2 §2.1):

```surql
DEFINE FIELD account_secret_ciphertext       ON user TYPE bytes;
DEFINE FIELD account_secret_column_key_version ON user TYPE int VALUE 1;
```

**Config shape** (in `apps/web/src/server/secrets/account-secret-keyring.ts`):

```ts
export type AccountSecretKeyring = Readonly<{
  currentVersion: number
  keys: ReadonlyMap<number, CryptoKey> // version -> AES-GCM-256
}>
```

**Rotation procedure** (background migration, ~hours-to-days for
~10-50k users):

1. Generate new 256-bit AES-GCM key `K_E_new`.
2. Edit `secrets/prod/app.enc.env`:
   ```dotenv
   ACCOUNT_SECRET_COLUMN_KEY_V1=<base64-existing>
   ACCOUNT_SECRET_COLUMN_KEY_V2=<base64-new>
   ACCOUNT_SECRET_COLUMN_KEY_CURRENT_VERSION=2
   ```
3. Deploy. App now serves reads via either v1 or v2 (lookup by
   `user.account_secret_column_key_version`); writes always use
   v2.
4. Run the **background migration job** (`pnpm migrate:rewrap-accountsecret`):
   - Iterate `user` rows in batches of 500 ordered by `id`.
   - For each row with `account_secret_column_key_version = 1`:
     - Decrypt `account_secret_ciphertext` with `K_E_v1`.
     - Re-encrypt with `K_E_v2`.
     - `UPDATE user SET account_secret_ciphertext = new_ct, account_secret_column_key_version = 2`.
   - Idempotent: re-running picks up unmigrated rows.
   - Checkpoint progress to a `migration_state` table.
   - Emit periodic `auth.column_key_migration_progress` outbox
     events for observability.
5. When migration completes, **keep `K_E_v1` available for 90
   days** (escrow window — allows restoration from a backup
   taken before the migration).
6. After 90 days, remove `ACCOUNT_SECRET_COLUMN_KEY_V1` from
   sops + redeploy. Emit `auth.secret_rotated{type:"accountSecret_col_key",retired:1}`.

**Zero-downtime characteristics**: reads + writes continue
uninterrupted; the migration runs at low priority and pauses
under load (cf. ADR-0013 throughput).

### 6.3 age key rotation (A) — re-encrypt sops files

**Trigger**: scheduled (every 12-24 m), or onboarding/offboarding,
or leak-suspected.

**Procedure** (~30-60 minutes elapsed):

1. Generate the new age keypair (locally on the holder's
   machine).
2. Add the new public key to the appropriate `*.pub.txt` file.
3. Update `.sops.yaml` to add the new recipient (and remove the
   old one if rotating a leaked / offboarding key).
4. Run `sops updatekeys secrets/**/*.enc.*` — this re-encrypts
   every file's data key under the new recipient set. The
   underlying plaintext is unchanged.
5. Commit + push.
6. Deploy via CI; the new key takes effect immediately on the
   target environment.
7. **Old key retention**: keep the OLD private key in personal
   escrow (paper + password manager) for **90 days** to allow
   emergency decrypt of any pre-rotation snapshot if needed.
   After 90 d, securely destroy the old key (paper shredded + cross-
   cut + password-manager entry deleted).
8. Emit `infra.secret_rotated{type:"age",scope:"…"}` outbox
   event.

**No runtime overlap needed** — only the *sops layer* sees the
rotation; the application doesn't know which age key was used
to decrypt at startup.

### 6.4 SurrealDB credential rotation (B) — dual-user pattern

**Pattern**: create a new user, deploy the app with the new
credentials, then revoke the old user after the overlap window.

**Procedure** (~15-30 minutes elapsed):

1. Connect to SurrealDB as root: `surreal sql --user root ...`.
2. Create a new user with the same permissions:
   ```surql
   DEFINE USER app_rw_v2 ON DATABASE PASSWORD "<new-password>"
     ROLES OWNER;  -- or the scoped role per ADR-0019
   ```
3. Edit `secrets/prod/db.enc.yaml`:
   ```yaml
   surreal:
     users:
       app_readwrite:
         username: app_rw_v2  # was app_rw
         password: "<new>"
   ```
4. Commit + push + CI deploys. The app now connects as `app_rw_v2`.
5. Wait **7-14 days** (long enough for any in-flight connection
   to drain).
6. Revoke the old user:
   ```surql
   REMOVE USER app_rw ON DATABASE;
   ```
7. Emit `infra.secret_rotated{type:"db_user",user:"app_readwrite"}`
   outbox event.

For SurrealDB **root** rotation (rare, 6-12 m cadence), same
pattern but for the root user. The new root is configured in
sops + Dokploy; the old root revoked after the overlap.

## 7. CI + Dokploy secret-injection — zero-secret CI

### 7.1 Decision: Pattern D (zero-secret CI + Dokploy decrypts locally)

Per Q3 research, four patterns were considered for secret
injection into CI:

- **Pattern A** — store age private key as a GitHub repo secret.
  Rejected: re-introduces a static long-lived key in
  GitHub-controlled storage.
- **Pattern B** — GitHub OIDC + cloud KMS. Rejected: pulls in a
  US cloud dependency we explicitly avoid per F6.
- **Pattern C** — only-decrypt-what-CI-needs. Partial; still has
  some static key in GitHub.
- **Pattern D (locked)** — zero-secret CI: CI builds the
  container image (no secrets), pushes to ghcr.io with OIDC,
  signs with cosign keyless. **Dokploy on the Hetzner VM pulls
  the image and decrypts its own sops-encrypted runtime config
  locally using the VM's own age key** (which never leaves the
  VM).

### 7.2 CI workflow (canonical)

`.github/workflows/ci.yaml` — runs on every PR + push to main.
No secrets needed (other than ghcr.io publishing on the deploy
job).

```yaml
name: CI
on: [pull_request, push]
permissions:
  contents: read
  id-token: write   # for cosign OIDC (release.yaml only; ignored here)
  packages: write   # release.yaml only

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check          # biome
      - run: pnpm typecheck
      - run: pnpm test           # vitest
      - run: pnpm test:e2e       # playwright
      # No secrets are read.
```

`.github/workflows/release.yaml` — runs on tag push, builds +
signs + publishes container.

```yaml
name: Release
on:
  push:
    tags: ['v*']
permissions:
  contents: read
  id-token: write          # cosign OIDC
  packages: write          # ghcr.io push

jobs:
  build-and-sign:
    runs-on: ubuntu-latest
    environment: production  # required for `id-token` write scope
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - name: Login to ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}   # built-in, not a static PAT
      - name: Build + push
        run: |
          docker buildx build --push -t ghcr.io/${{ github.repository_owner }}/soccer-manager:${{ github.ref_name }} .
      - name: cosign keyless sign
        uses: sigstore/cosign-installer@v3
      - run: cosign sign --yes ghcr.io/${{ github.repository_owner }}/soccer-manager:${{ github.ref_name }}
      - name: Notify Dokploy
        run: |
          curl -X POST -H "X-Dokploy-Token: ${{ secrets.DOKPLOY_WEBHOOK_SECRET }}" \
            https://dokploy.<canonical-domain>/api/deploy
```

**Notes**:

- The only GitHub-stored static secret is `DOKPLOY_WEBHOOK_SECRET`
  (category M) — used to authenticate the webhook call. Compromise
  scope is bounded to "trigger a deploy", not "read production
  secrets".
- `GITHUB_TOKEN` is automatically minted per-workflow-run,
  short-lived, scoped to the current repo. No static PAT.
- Container signing uses GitHub OIDC + Sigstore public-good
  Fulcio; no static cosign key.

### 7.3 Dokploy runtime decryption

On the Hetzner production VM:

```text
/etc/age/prod.key                # 0400, owned by dokploy user
/opt/soccer-manager/secrets/     # sops files mirrored from git on deploy
  ├── app.enc.env
  ├── db.enc.yaml
  ├── observability.enc.yaml
  └── infra.enc.yaml
/run/secrets/                    # tmpfs mount populated at container start
```

The container's entrypoint (per `Dockerfile`):

```dockerfile
ENTRYPOINT ["/usr/local/bin/run-with-secrets.sh"]
```

`/usr/local/bin/run-with-secrets.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# tmpfs already mounted at /run/secrets by docker-compose

# Decrypt each secret file to tmpfs
for f in app.enc.env db.enc.yaml observability.enc.yaml infra.enc.yaml; do
  sops -d /opt/soccer-manager/secrets/"$f" > /run/secrets/"${f%.enc.*}"
done

# Export app.env values as environment variables
set -a
. /run/secrets/app.env
set +a

# Run the app
exec node /app/dist/server.mjs
```

`docker-compose.yaml`:

```yaml
services:
  app:
    image: ghcr.io/<owner>/soccer-manager:${IMAGE_TAG}
    tmpfs:
      - /run/secrets:size=1m,mode=0700,uid=1000  # tmpfs, not disk
    read_only: true
    user: "1000:1000"
    volumes:
      - /opt/soccer-manager/secrets:/opt/soccer-manager/secrets:ro
      - /etc/age/prod.key:/etc/age/prod.key:ro  # only the entrypoint reads this
    environment:
      - SOPS_AGE_KEY_FILE=/etc/age/prod.key
```

**Why tmpfs not env vars**: env vars leak via `/proc/<pid>/environ`
which any process running as the same user can read. tmpfs with
`mode=0700` is readable only by the explicit owner. NIST SP
800-190 + CIS Docker Benchmark 5.x align on this.

**Why `read_only: true`**: the container filesystem is immutable
at runtime; secrets exist only in tmpfs that gets wiped at
container stop.

### 7.4 CI log redaction

- Every secret value retrieved in a workflow MUST be passed
  through `echo "::add-mask::$VALUE"` immediately after
  retrieval, before any further step that might log it.
- No `set -x` / `bash -x` in any step that handles secrets.
- `pnpm` + `node` commands are vetted to not log credentials in
  their default output.

### 7.5 Secret scanning

- **gitleaks pre-commit hook** (`.husky/pre-commit`) blocks any
  commit that matches a known secret pattern (age private key,
  Brevo API key prefix, GitHub PAT, JWT, etc.).
- **GitHub Actions secret scanning** push-protection enabled at
  the repo level — blocks push of any known-pattern secret to
  any branch.
- **trufflehog** as a CI gate (`pnpm scan:secrets`) — scans the
  full repo + git history on every PR.
- **Custom pattern**: any file matching `secrets/**/*.{env,yaml,yml,json}`
  without `.enc.` in the name fails the CI lint.

## 8. Developer onboarding + offboarding

### 8.1 Onboarding a new developer

1. New dev generates their age keypair locally:
   ```bash
   age-keygen -o ~/.config/age/key.txt
   age-keygen -y ~/.config/age/key.txt   # share this public key
   ```
2. They share their **public key** with the founder via signed
   PR (no email; the public key is fine to commit).
3. Founder appends the public key to `secrets/age/team.pub.txt`
   + adds it to the `dev` and `staging` rules in `.sops.yaml`
   (NOT the prod rule by default).
4. Founder runs `sops updatekeys secrets/dev/*.enc.*` and `sops updatekeys secrets/staging/*.enc.*`.
5. Founder commits + merges the PR.
6. New dev pulls main, runs `direnv allow`, decrypts dev
   secrets successfully.
7. Add new dev's GitHub user to the repo's collaborators with
   write access (not admin, unless co-founder).
8. Document the new dev's role in `docs/40-Execution/team.md`.

### 8.2 Offboarding a developer

1. Revoke their GitHub access (remove from collaborators).
2. Revoke their SSH access to the Hetzner VM (if granted).
3. Remove their public key from `secrets/age/team.pub.txt` +
   `.sops.yaml` recipient lists.
4. Run `sops updatekeys secrets/**/*.enc.*` to re-encrypt every
   file under the new (smaller) recipient set.
5. **Rotate every credential they had access to** per NIST SP
   800-53 PS-4 personnel termination:
   - All dev-scope secrets.
   - All staging-scope secrets (if they had access).
   - Any DB user / SSH key / GitHub PAT named after them.
6. Emit `infra.personnel_offboarded` outbox event.
7. Update `docs/40-Execution/team.md`.

## 9. Accidental-leak response runbook

### 9.1 Five-tier classification

| Tier | Severity         | Examples                                                                                  | Response window |
| ---  | ---              | ---                                                                                       | ---             |
| 1    | catastrophic     | Production age private key leaked → entire sops hierarchy compromised. Rotate all A-O.    | 1 hour          |
| 2    | high             | Production DB cred / `accountSecret` column key / server-master-secret leaked.            | 1 hour          |
| 3    | medium           | HMAC pepper / CSRF signing key / email API key leaked.                                    | 24 hours        |
| 4    | low              | Dev / staging credentials leaked.                                                          | 7 days          |
| 5    | informational    | Non-secret token / public DSN leaked.                                                      | document only   |

### 9.2 Detection sources

- **GitHub secret-scanning** push-protection alert.
- **trufflehog / gitleaks** CI hits.
- **Suspicious access logs** (per F2 §8.5 anomaly signals).
- **External responsible-disclosure email** to `privacy-lead@<domain>`.
- **GitHub Advisory database** alert on a dependency we use.
- **Vendor compromise notice** (e.g. Brevo emails us about a
  breach).

### 9.3 1-hour response playbook (Tier 1-2)

| Time      | Action                                                                                  | Owner          |
| ---       | ---                                                                                     | ---            |
| 0-5 min   | **Containment**: revoke the leaked credential at the source (rotate age key / revoke DB user / regen API key / kill session). | Privacy Lead   |
| 5-20 min  | **Assessment**: identify scope. What data was potentially accessible? Was the credential actually used (access-log review)? Reference F1 §3 trust boundary. | Privacy Lead + tech |
| 20-60 min | **Rotation**: per-category recipe from §6.                                              | tech           |
| 60-180 min| **Audit replay**: review outbox events from `auth.*` + Loki access logs in the leak window. | Privacy Lead + tech |
| ≤ 72 h    | **Art. 33 BfDI notification** (if personal data potentially accessed) per F6 §9.        | Privacy Lead   |
| ≤ 24 h after triage | **Art. 34 user notification** (if high risk) per F6 §9.4.                    | Privacy Lead   |
| ≤ 7 d after triage  | **Post-mortem** in `docs/40-Execution/incidents/YYYY-MM-DD-<slug>.md`.        | Privacy Lead   |

### 9.4 Leaked age private key — specific playbook

1. **Generate a new age keypair** on a fresh, clean machine
   (founder's laptop verified not compromised).
2. **Update `.sops.yaml`** — add the new public key, REMOVE the
   leaked key's public key.
3. Run `sops updatekeys secrets/**/*.enc.*` — every file is now
   re-encrypted to the new recipient set; the leaked key can no
   longer decrypt them.
4. **For production**: SSH into the Hetzner VM, replace
   `/etc/age/prod.key` with the new private key, restart the
   Dokploy stack.
5. Commit + push the `.sops.yaml` + re-encrypted files.
6. **Retain the leaked old key in personal offline escrow** for
   30 days for emergency decrypt of any pre-rotation snapshot
   (e.g. recovering an old backup blob that was encrypted under
   the leaked key — those blobs need decrypting before they
   rotate out of backup retention).
7. **Audit**: review GitHub repository access logs to confirm
   the leaked key was not used to clone the repo + decrypt the
   sops files in the leak window.
8. Emit `infra.secret_rotated{type:"age",scope:"prod",reason:"leak"}`
   outbox event + open `docs/40-Execution/incidents/YYYY-MM-DD-age-key-leak.md`.

### 9.5 Leaked `accountSecret` column-encryption key — specific playbook

1. Generate new column-encryption key `K_E_new`.
2. Add to sops `app.enc.env` as `_V_N` (new version).
3. Bump `ACCOUNT_SECRET_COLUMN_KEY_CURRENT_VERSION`.
4. Deploy.
5. **Trigger emergency background migration** to re-encrypt all
   `user.account_secret_ciphertext` rows with the new key
   (see §6.2 — but with **higher priority + more workers** in
   the emergency case).
6. While the migration runs:
   - **Force re-authentication** for all users on next request
     (bump `user.token_version` per F3 §8.2 globally).
   - The migration cannot block reads because old + new keys are
     both available.
7. After migration completes, remove the leaked old key from
   sops + redeploy.
8. **Art. 33 BfDI notification** likely required (personal data
   potentially accessible if attacker has both leaked key + a
   DB dump). Make notification within 72 h.
9. **Art. 34 user notification** — assess: if there's no
   evidence the leaked key was used, may be borderline. Default
   to notification if user count > ~1000 affected.

### 9.6 Sigstore Rekor outage — verification fallback (closes F1 FU-6)

If Sigstore public-good Rekor / Fulcio becomes unreachable
during a deploy:

1. **Dokploy verification step**: `cosign verify` against the
   image. On failure:
   - Check whether Rekor is down (`curl https://rekor.sigstore.dev/api/v1/log/`).
   - If Rekor is down: **fall back to local cosign trust** —
     `cosign verify` using a locally-cached `cosign.pub` key
     manifest extracted from the image's prior successful
     deploy.
2. **If the failure persists > 4 hours**: pause deploys; alert
   founder.
3. **Long-term contingency** (FU-1 below): self-host a Rekor
   instance as a secondary trust root. Not built at MVP; the
   Sigstore SLA + the cached-trust fallback is sufficient at our
   scale.

Reference: Sigstore 2026 SLA + community status page.

## 10. Tier-A dependency audit runbook (closes F1 FU-4)

### 10.1 Tier-A list (locked)

Initial list per F1 §5.6 + F2 §10:

- `@simplewebauthn/server` + `@simplewebauthn/browser` (WebAuthn)
- `argon2` (libsodium-backed Node native addon)
- `argon2-browser` (post-MVP, F5 portable export)
- `surrealdb` (official JS client)
- `workbox-*` packages (Service Worker tooling)
- `dexie` (IndexedDB)
- `zod` (validation across server functions)
- `cookie-es` (cookie parsing)
- `ioredis` (Redis client + Lua wrapper)
- `openid-client` (post-MVP F2 §3.6)
- `jose` (signed-token utility)

### 10.2 Add / remove from Tier-A — triggers

**Add when** any of:

- A new dep lands under `apps/web/src/server/auth/**`,
  `apps/web/src/server/secrets/**`, `apps/web/src/server/gdpr/**`,
  `packages/save-format/**`, or anywhere handling
  credentials / crypto / session state.
- A package is added to `pnpm.overrides` for a security pin.
- A package is identified by an external auditor as Tier-A-worthy.

**Remove when**:

- The package is no longer in the auth / crypto / SW surface.
- Replaced by an alternative that becomes the Tier-A entry.

CI lint rule (F11 FU-2): `pnpm add` of a package matching known
crypto/auth patterns (`*crypto*`, `*hash*`, `*auth*`, `*jwt*`,
`*webauthn*`, `*sops*`, `*age*`) emits a warning suggesting
Tier-A review.

### 10.3 Quarterly audit procedure

Filed in `docs/40-Execution/dep-audits/YYYY-Qn.md`.

For each Tier-A package, check + document:

| Field                    | How to check                                                                                |
| ---                      | ---                                                                                         |
| Installed version + date | `pnpm list <pkg>`                                                                            |
| Direct + transitive deps | `pnpm why <pkg>` + `pnpm-lock.yaml` review                                                  |
| New maintainer?          | npm registry metadata + GitHub repo "Maintainers" tab                                       |
| New major version?       | `npm view <pkg> versions` + release notes for breaking + security changes                   |
| Open CVE?                | Socket.dev / Snyk / OSV / GitHub Advisory                                                   |
| Provenance signature?    | `npm view <pkg> dist.attestations` + `npm audit signatures`                                 |
| Active maintenance?      | Last commit + open-issue count + last release date (GitHub repo)                            |
| Sub-deps Tier-A worthy?  | Any transitive deps that would warrant Tier-A in their own right?                           |

Tools used (2026 best practice):

- **Socket.dev** — real-time alerts on package changes (free
  tier covers OSS); install scripts, network calls, new
  maintainer detection.
- **GitHub Advisory Database** — `npm audit` or
  `pnpm audit --audit-level=high` in CI.
- **OSV scanner** — vulnerability cross-reference.
- **Dependabot** (GitHub native) — weekly PR for prod deps.
- **`npm audit signatures`** — confirms provenance for packages
  that publish it; warn on packages that don't.
- **Quarterly review**: run the audit, file the report, open
  Linear tickets for any action needed (CVE patch, version bump,
  override addition / removal).

### 10.4 `pnpm.overrides` + `SECURITY_OVERRIDES.md`

When pinning a transitive dep for security:

1. Add the override to `package.json`:
   ```json
   "pnpm": {
     "overrides": {
       "some-transitive-dep@<2.0.0": "2.0.1"
     }
   }
   ```
2. Add an entry to `SECURITY_OVERRIDES.md` at repo root:
   ```markdown
   ## some-transitive-dep — 2.0.1

   - Reason: CVE-2026-XXXXX in versions < 2.0.1
   - Upstream parent: workbox-* still depends on the vulnerable range
   - Pinned: 2026-05-18
   - Cleanup task: remove when workbox-* releases a version with the fix landed upstream
   - Tracking: Linear SECN-XXX
   ```
3. Quarterly audit re-checks every override and removes those
   that are no longer needed.

### 10.5 SLSA target

- **SLSA Level 2** at MVP — build provenance generated for our
  own container images via cosign + GitHub OIDC + Sigstore
  Rekor; SBOM (Syft) attached to image labels.
- **SLSA Level 3** as post-MVP stretch — requires isolated build
  + non-falsifiable provenance. Hetzner self-hosted runners could
  enable this if we ever need it.

## 11. Backup + recovery drill schedule

### 11.1 Cadence

| Drill                              | Cadence       | Output location                                            |
| ---                                | ---           | ---                                                        |
| Redis-only restore                 | Monthly       | `docs/40-Execution/restore-drills/YYYY-MM-DD-redis.md`     |
| SurrealDB-only restore             | Semi-annually | `docs/40-Execution/restore-drills/YYYY-MM-DD-surrealdb.md` |
| age-key recovery from paper backup | Annually      | `docs/40-Execution/restore-drills/YYYY-MM-DD-age-key.md`   |
| Full-system restore from snapshot  | Quarterly     | `docs/40-Execution/restore-drills/YYYY-MM-DD-full.md`      |
| DR tabletop scenarios              | Annually      | `docs/40-Execution/restore-drills/YYYY-MM-DD-tabletop.md`  |

### 11.2 Redis restore drill (closes F3 FU-6)

**Goal**: confirm that the latest Redis backup can be loaded
into a fresh Redis instance and that session lookups work.

1. Spin up a fresh Redis container (same version + config —
   AOF + RDB enabled).
2. Copy the latest `appendonly.aof` + `dump.rdb` from the
   production backup location to the new container's `/data`.
3. Start Redis; verify it loads without errors. Check
   `redis-cli INFO persistence` for `loading:0`.
4. Run the validation script (`scripts/redis-restore-drill.ts`):
   - Pick a known `sess:<id>` from the backup era → expect to
     find it via `HGETALL`.
   - Pick a known `rtfam:<id>` → verify it's `active` with the
     expected `current_token_id`.
   - Pick a known `user_sess:<user_id>` SET → verify membership.
5. Document the drill outcome (success / failure + observations).
6. If failure, open a Linear incident ticket + investigate
   before next deploy.

### 11.3 SurrealDB restore drill

1. Spin up a fresh SurrealDB instance.
2. `surreal import <latest-weekly-dump.surql>`.
3. Verify schema integrity: `INFO FOR NS soccer_manager`,
   `INFO FOR DB platform`, `INFO FOR TABLE user`.
4. Sample queries:
   - Known `user` row → expect to find it.
   - Known `outbox_event` → verify shape.
   - Known `device` → verify schema.
5. F5 envelope decrypt test: pick a known test user, attempt to
   decrypt their `account_secret_ciphertext` with the test
   `K_E_v_current`. Expect success.
6. Document.

### 11.4 age-key recovery drill

1. Pretend the founder's laptop is destroyed.
2. Recover the age private key from the paper backup (or
   family-escrowed copy).
3. On a fresh laptop, place the recovered key at
   `~/.config/age/key.txt`.
4. Verify `sops -d secrets/prod/db.enc.yaml` succeeds.
5. Document.

### 11.5 Full-system restore drill (quarterly)

1. From the latest daily Hetzner snapshot, restore into a fresh
   Hetzner VM (staging-equivalent size).
2. Bring up the Dokploy stack on the restored VM.
3. Verify the application boots: `/healthz` returns 200.
4. Sessions work: log in with a known test account, complete
   passkey + step-up MFA.
5. Saves decrypt: open a known save in the test account.
6. Audit events replay: query the outbox cold archive for the
   last 7 days; confirm count + latest event timestamps match
   production.
7. Tear down the restore VM after drill complete.
8. Document.

## 12. DR tabletop scenarios (annual)

| Scenario | Description                                                    | Recovery procedure                                                                                    |
| ---      | ---                                                            | ---                                                                                                   |
| 1        | Founder's laptop stolen during travel                          | Recover age key from paper backup; rotate the founder's age key per §6.3                              |
| 2        | Hetzner VM hardware failure                                    | Restore from latest snapshot into a new VM (RTO < 2 h, RPO ≤ 24 h)                                    |
| 3        | Hetzner Nuremberg region outage                                | Restore into Falkenstein or Helsinki using cross-region snapshot copy                                  |
| 4        | Ransomware on dev laptop; age key compromised                  | Tier-1 leak response per §9.4; rotate all sops files; verify no production credentials exposed         |
| 5        | SurrealDB corruption                                           | Restore from weekly dump; replay outbox events from the last 7 days; force re-auth on all sessions     |
| 6        | Redis lost (AOF corrupted, no backup)                          | Accepted per F3 §3.2: sessions all invalidated; users must re-sign-in                                  |

Each tabletop exercise:

- 60-90 minutes elapsed.
- All participants role-play through the scenario.
- Document decision points + gaps + improvements in the
  YYYY-MM-DD-tabletop.md file.

## 13. Audit integration

Every rotation, leak-response action, dep audit, and drill
emits an outbox event per ADR-0013 + [[audit-trail]] catalogue:

| Event                                          | Aggregate        | When                                          |
| ---                                            | ---              | ---                                           |
| `auth.secret_rotated`                          | `user` (system)  | Categories D, E, G, H, N, O rotation          |
| `infra.secret_rotated`                         | system           | Categories A, B, C, F, I, J, K, L, M rotation |
| `infra.personnel_offboarded`                   | system           | Developer offboarding                         |
| `infra.dep_audit_completed`                    | system           | Quarterly Tier-A audit filed                  |
| `infra.restore_drill_completed`                | system           | Each drill                                    |
| `infra.dr_tabletop_completed`                  | system           | Annual tabletop                               |
| `auth.column_key_migration_progress`           | system           | Periodic during E rotation migration          |
| `infra.leak_response_<tier>_started`           | system           | Tier 1-2 detection event                      |
| `infra.leak_response_<tier>_completed`         | system           | Post-mortem filed                             |

Event payloads follow the F3 §8.3 + audit-trail.md catalogue
shape. Redaction deny-list applies (NEVER log the rotated value
itself; only key id / version).

## 14. Future-proof — graduating from sops + age

### 14.1 Triggers to migrate to a managed secret store

| Trigger                                        | Recommended next step                                                                       |
| ---                                            | ---                                                                                         |
| ≥ 5 developers                                 | Add per-team ACLs that sops doesn't natively support → consider Bitwarden Secrets Manager   |
| ≥ 3 environments (e.g. add eu-region-2)        | Operational overhead of `.sops.yaml` rule maintenance increases — re-evaluate               |
| SOC 2 / ISO 27001 / TISAX compliance audit     | Auditor will likely want centralised secret-access audit logs — managed store with audit log |
| Real-money payments                            | PCI DSS (if it applies) requires managed secret store with strong audit                     |
| Multi-region deployment                        | Cross-region replication of secrets becomes operationally important                          |

### 14.2 Migration story (additive)

The codebase already has a `Secrets` service interface in
`apps/web/src/server/secrets/index.ts`:

```ts
// apps/web/src/server/secrets/index.ts
export interface SecretsProvider {
  /** Returns the value for a given secret key; throws if not configured. */
  get(key: string): Promise<string>
  /** Returns the value or `undefined` if not configured. */
  getOptional(key: string): Promise<string | undefined>
  /** Returns the keyring for the named category, with current + escrow versions. */
  getKeyring(category: string): Promise<Map<number, Uint8Array>>
}
```

At MVP, the implementation is `EnvSecretsProvider` (reads from
sops-decrypted env vars). Future implementations:

- `BitwardenSecretsManagerProvider` (if/when we graduate)
- `InfisicalProvider` (if/when we graduate)
- `OnePasswordConnectProvider` (EU-friendly managed option)
- `VaultProvider` (if we ever go enterprise)

The application code calls `secrets.get(...)` everywhere — no
direct `process.env.*` access (CI lint rule: F1 FU-2 +
F11 FU-1). Migration is then a one-line config swap.

### 14.3 Alternatives explicitly NOT chosen at MVP

- **HashiCorp Vault**: heavyweight, only justified for ≥ 10
  developers or compliance.
- **AWS Secrets Manager / Google Secret Manager**: out — we're
  EU-only + sidestep US clouds per F6 §10.
- **Doppler**: US-domiciled — same reason.
- **Bitwarden Secrets Manager**: candidate for the post-graduation
  path; EU-region available.
- **Infisical**: candidate; self-hostable.
- **1Password Connect**: candidate for managed EU.
- **sops + GPG**: legacy; replaced by age in 2024+.

## 15. Open decisions for Nico (Q&A)

Per the "use defaults + clear best practices" workflow:

### Q1. Sigstore Rekor self-hosting timing

Confirm: defer self-hosted Rekor to post-MVP; rely on
public-good Sigstore + cached-trust fallback at MVP.

Default: **defer**.

### Q2. Cyber-insurance policy procurement

Confirm: post-launch acquisition of a "Cyber-Versicherung" /
"IT-Haftpflicht" at the entry tier (~€500-2000/year coverage
≤ €100k claim). Pre-launch is optional but recommended.

Default: **post-launch**.

### Q3. Quarterly Tier-A audit calendar

Confirm: quarterly cadence anchored to fiscal quarter starts
(Q1 = 1 January; Q2 = 1 April; Q3 = 1 July; Q4 = 1 October).
Owner: Privacy Lead.

Default: **confirmed**.

### Q4. Personnel-escrow contact for age key recovery

Confirm: the founder's age key has a family member as the
physical-paper-backup escrow contact. This is a one-way-door
decision the founder must make personally; not in scope for
F11 spec.

Default: **placeholder** — flagged for founder resolution.

### Q5. Annual rotation review meeting

Confirm: once a year, the Privacy Lead reviews the F11 §5
rotation log + outbox `*.secret_rotated` events against
schedule. Variance reasons documented.

Default: **confirmed**.

### Q6. Tier-A initial list

Confirm the §10.1 list (11 packages). Additions/removals on
quarterly review.

Default: **confirmed**.

## 16. F11 follow-up tasks (deferred, not blocking)

| #    | Task                                                                          | Owner     |
| ---  | ---                                                                           | ---       |
| FU-1 | Implement `SecretsProvider` interface + `EnvSecretsProvider` in `apps/web/src/server/secrets/` | E10       |
| FU-2 | Biome custom lint rule blocking direct `process.env.*` outside the secrets package | E10       |
| FU-3 | CI gate: refuse pushes containing `secrets/**/*.{env,yaml,yml,json}` files without `.enc.` in the name | E10       |
| FU-4 | gitleaks + trufflehog CI integration                                          | E10       |
| FU-5 | Self-hosted Rekor as a secondary trust root (post-MVP, contingency)            | post-MVP  |
| FU-6 | Background-migration framework for the `accountSecret` column-key rotation (and future migrations) | E10 + E11 |
| FU-7 | DR tabletop annual ceremony reminder + template                               | calendar  |
| FU-8 | Bitwarden Secrets Manager / Infisical / 1Password Connect evaluation when triggers hit | post-MVP  |
| FU-9 | LLC formation + Hetzner account in entity name (F6 cross-reference)            | founder   |

## 17. Sources

### Standards + frameworks

- OWASP Secrets Management Cheat Sheet (2024-2026):
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
- NIST SP 800-57 Pt. 1 rev. 5 Key Management Lifecycle:
  <https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final>
- NIST SP 800-61 rev. 2 Computer Security Incident Handling:
  <https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final>
- NIST SP 800-34 rev. 1 Contingency Planning:
  <https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final>
- NIST SP 800-190 Container Security:
  <https://csrc.nist.gov/publications/detail/sp/800-190/final>
- NIST SP 800-53 PS-4 Personnel Termination:
  <https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final>
- GDPR Art. 32 (security of processing).
- SLSA Framework v1.0: <https://slsa.dev/>
- ENISA Good Practices for Security:
  <https://www.enisa.europa.eu/topics/cloud-and-big-data>
- CIS Docker Benchmark.

### Tooling

- Mozilla sops: <https://github.com/getsops/sops>
- age: <https://github.com/FiloSottile/age>
- direnv: <https://direnv.net/>
- Dokploy: <https://dokploy.com/>
- Sigstore + cosign: <https://www.sigstore.dev/>
- GitHub OIDC for Actions:
  <https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect>
- gitleaks: <https://github.com/gitleaks/gitleaks>
- trufflehog: <https://github.com/trufflesecurity/trufflehog>
- Socket.dev: <https://socket.dev/>
- npm provenance + Trusted Publishers:
  <https://docs.npmjs.com/generating-provenance-statements/>
- Syft (SBOM): <https://github.com/anchore/syft>

### Project-internal anchors

- [[secrets-rotation]] — Cloud-Agent credential boundary policy
  (narrower scope; F11 supersedes nothing; both coexist).
- [[deployment-dokploy]] — Dokploy-specific deployment config.
- [[../60-Research/threat-model]] (F1) §4.6-E4 supply chain,
  §4.2-T6 image signing, §5.6 Tier-A dependency proposal.
- [[auth-flows]] (F2) §10.2 token pepper, §10.3 Argon2id params,
  §10.7 transactional email vendor.
- [[session-management]] (F3) §3.1 Redis AOF + RDB, §4.4
  refresh-token `hash` HMAC pepper.
- [[account-recovery]] (F5) §10.2 reset-token pepper, §10.4
  HIBP rebuild runbook.
- [[../60-Research/gdpr-compliance]] (F6) §7 retention; §11
  vendor Art. 28 DPAs; §12 compliance overhead.
- [[privacy-and-consent]] (F6-impl) §9 Art. 33/34 breach
  notification runbook → cross-link to F11 §9.
- [[audit-trail]] — outbox events catalogue including
  `infra.*` + `auth.secret_rotated`.
- [[incident-response]] — overall incident-response runbook.
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  — outbox for audit events.
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  — Loki redaction.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  — per-context scoped DB users.

### Perplexity research transcripts (this gap)

Six focused Perplexity-sonar-pro queries, 2026-05-18, total
~42 k tokens, ~$0.12 estimated:

1. sops v3.x + age v1.x best-practice file layout +
   `.sops.yaml` template + age key hierarchy + direnv
   integration + future-proof extension story.
2. Per-category rotation cadence + zero-downtime recipes
   (versioned pepper, column-key with per-row version,
   dual-user DB pattern) + 1-hour emergency playbook +
   graduation triggers.
3. Pattern A-D for CI secret-injection; recommended Pattern D
   (zero-secret CI + Dokploy decrypts locally); GitHub OIDC +
   cosign keyless; tmpfs runtime injection per NIST SP 800-190.
4. 5-tier leak classification + detection toolbox + 1-hour
   response playbook + leaked-age-key playbook + leaked-column-
   key playbook + Sigstore Rekor outage contingency.
5. Quarterly Tier-A audit runbook + npm provenance + Sigstore
   for npm + `pnpm.overrides` + `SECURITY_OVERRIDES.md` + SLSA
   target.
6. Backup + recovery drill schedule + per-drill recipe (Redis
   monthly, SurrealDB semi-annually, age annually, full
   quarterly) + 6 DR tabletop scenarios + backup verification.

Raw transcripts not committed (ephemeral); citations preserved
inline in §17 above + per-section anchors throughout the note.
