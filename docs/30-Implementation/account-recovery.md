---
title: Account Recovery
status: current
tags: [implementation, account-recovery, master-key-envelope, key-rotation, web-crypto, recovery-codes]
created: 2026-05-18
updated: 2026-05-18
type: implementation
binding: true
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0002-offline-first]]"
  - "[[../10-Architecture/09-Decisions/ADR-0004-data-model]]"
  - "[[../10-Architecture/09-Decisions/ADR-0005-save-format]]"
  - "[[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
related:
  - "[[auth-flows]]"
  - "[[session-management]]"
  - "[[audit-trail]]"
  - "[[../60-Research/threat-model]]"
  - "[[../95-Archive/gap-reports/wave-3-gap-analysis]]"
---

# Account Recovery

This note resolves Wave 3 gap **F5** (Account recovery) and is the
**binding implementation specification** for the master-key envelope
that decouples `accountSecret` rotation from device-backup save-key
continuity, plus the full user-facing recovery flow set (email
recovery, recovery-code use, lockout behaviour, "I lost everything"
cliff).

F5 closes the open dependency surfaced by F2 §6.2, F2 §9.3,
F3 §6.2, F3 §9.5, and F3 §10: every existing F2 device derives its
`deviceBackupKey` directly from `PBKDF2(accountSecret, deviceSalt,
600_000)` per ADR-0005 §3, so any `accountSecret` rotation today
forces every device to re-derive and re-encrypt every save row.
F5 introduces a **stable inner master key `K`** wrapped under a
**user-level KEK** (`Env_user`), so rotation just re-wraps the
small envelope while every IndexedDB save row stays untouched.

F5 anchors on:

- [[auth-flows]] (F2) §3.3 credential enrolment; §6 recovery codes;
  §6.2 mandatory `accountSecret` rotation on recovery-code use;
  §9 multi-device sign-in.
- [[session-management]] (F3) §8 revocation matrix;
  §9.5 per-device revoke + the separate "rotate security key" flow;
  §10 offline-first reconnect.
- [[../60-Research/threat-model]] (F1) §5 cryptographic decisions;
  §6 RR-2 accepted residual (singleplayer save tampering).
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] §3 KDF +
  envelope versioning fields.

## 1. Scope and stance

### 1.1 What F5 locks

- The **stable inner master key `K`** + **canonical user-level
  envelope `Env_user = AES-GCM-256(K, KEK_user)`** pattern as the
  primary architecture. Per-device envelopes become an *optional
  offline-cache optimisation*, not a security primitive.
- The **envelope wire format** (`envelopeVersion`, `wrapMode`,
  AAD-bound header, AEAD parameters, AAD layout).
- The **Web Crypto API mechanics** for generating, wrapping,
  unwrapping, and persisting `K` as a non-extractable `CryptoKey`
  in IndexedDB.
- The **server-side schema** (`user.env_user`, `user.userSalt`,
  `user.envelope_version`, `user.account_secret_version`,
  `recovery_code.env_recovery`, optional `device.env_device`
  cache; column-encrypted `user.accountSecret`).
- The **atomic rotation algorithm** at password change, recovery-
  code use, and "Sign out everywhere AND rotate security key"
  triggers, with Redis rotation-lock and idempotency-key support.
- The **F2 → F5 lazy migration** policy (first login after deploy
  triggers per-user one-shot envelope derivation; never
  re-encrypts existing save rows).
- The **multi-device continuity protocol** post-rotation (devices
  fetch `Env_user` on re-login; no cross-device coordination
  required; the F3 hybrid `tokenVersion` bump propagates the
  revocation; offline devices keep working locally until they
  reconnect).
- The **three recovery flows**: email password reset, recovery-
  code use, "Sign out everywhere AND rotate security key" — each
  with explicit sequence diagrams, copy (DE / EN), error states,
  and outbox events.
- The **attack-mitigation matrix** on recovery surfaces (intercept
  / phishing / stuffing / replay / oracle / chain-attack).
- The **"cannot recover" cliff UX** confirming the F2 Q4 stance.

### 1.2 What F5 does not lock

- The portable-export-passphrase UI (still post-MVP per ADR-0005
  §1); F5 specifies the envelope wire format for it but does not
  ship the UI itself.
- Argon2id KDF for portable export (still post-MVP per F1 §5.1
  + F2 §10.3); F5 reserves `envelopeVersion = 2` for it.
- HPKE / post-quantum KEM wrap; reserved as `envelopeVersion = 3`
  hook.
- Multi-user shared saves and the per-member content key (Phase-2
  cloud MP per ADR-0004 §A4); F5 reserves the `wrapMode =
  'shared_save'` discriminator.
- The session-revocation propagation runbook itself — that's F3
  §8 and §9.3. F5 just **invokes** F3's primitives.
- The audit-event redaction deny-list — that's ADR-0017 + F6.

### 1.3 Threats this spec mitigates

Cross-references into [[../60-Research/threat-model]]:

- **T1 Local save tampering** — unchanged: `K` is non-extractable
  in the browser; save ciphertexts remain AES-GCM-AEAD-protected
  per ADR-0005 §2. F5 doesn't loosen any property F1 anchored.
- **I1 Local data leakage** — F5 keeps the "saves at rest are
  AEAD-encrypted" property; what changes is that `K` survives
  `accountSecret` rotation (instead of being implicitly rotated
  with it), so the same ciphertexts are still readable.
- **Compromise of `accountSecret`** — F5's central new property:
  rotation is **cheap** (single envelope re-wrap) and **fast**
  (single atomic transaction), so the operational cost of
  rotating on any compromise signal drops to near-zero.
- **Server compromise** — server holds `Env_user` only;
  `K` is never exposed to the server. Even a complete server
  data dump cannot decrypt any save. F1 §6 RR-5 "compromised
  CI pipeline" still applies because malicious code could
  exfiltrate `K` from a running browser — that residual is
  unchanged.

Residual risks (deferred to ADR / FU): RR-2 singleplayer
tampering (still accepted; F5 doesn't change client-side
tamper-resistance which was never the goal). The "I lost
everything" cliff (F2 Q4) stays confirmed.

## 2. Architectural decisions (locked)

### 2.1 Stable inner master key `K`

- `K` is a 256-bit AES-GCM key generated **once per account** on
  signup completion (after email verification).
- `K` is **never** persisted in clear anywhere — server or client.
- `K` is **never** re-generated except in the "burn everything"
  account-deletion case. Password rotation, recovery-code use,
  and "rotate security key" all leave `K` untouched.
- On every device, `K` lives only as a non-extractable
  `CryptoKey` in IndexedDB or in transient memory.

This is the standard envelope-encryption pattern called out by
NIST SP 800-130 (CKMS design: separate key types and bind them
via wrap envelopes) and matches Bitwarden / 1Password / Standard
Notes / Proton key-hierarchy designs (per Q1 research).

### 2.2 Canonical user-level envelope `Env_user`

The **primary** wrap of `K` is a single per-user envelope:

```text
Env_user = AES-GCM-256(K, KEK_user)
KEK_user = PBKDF2-SHA256(accountSecret, userSalt, 600_000, 256 bits)
```

- `userSalt` is 32 random bytes, generated once on signup,
  persisted in `user.userSalt`. Stable for the account's life;
  not rotated.
- `accountSecret` is the existing 32-byte server-generated random
  per F2 §5.3 + ADR-0005 §3. Rotation = mint new
  `accountSecret`, re-derive `KEK_user_new`, re-wrap `Env_user`.
- `Env_user` is stored in `user.env_user` (BLOB column on the
  platform DB) and served to authenticated devices via
  `GET /api/auth/envelope`.

**Why user-level not per-device** (Q3 research recommendation):

- Rotation touches exactly one envelope row.
- No cross-device coordination required when a device rotates.
- Other devices just re-fetch `Env_user` on next sign-in,
  derive `KEK_user_new` from the new `accountSecret`, and unwrap
  `K`.
- Per-device revocation moves from the crypto layer (where it's
  fragile and offline-incompatible) to the session layer (where
  F3 already handles it cleanly via family-revoke +
  `tokenVersion`).
- Operationally simplest for an indie EU PWA at ~thousands of
  users.

### 2.3 Recovery-code envelopes (`Env_recovery_i`)

In addition to `Env_user`, F5 stores **10 independent recovery
envelopes** — one per recovery code (per F2 §6.1, 10 single-use
codes at MVP):

```text
Env_recovery_i = AES-GCM-256(K, KEK_recovery_i)
KEK_recovery_i = PBKDF2-SHA256(recovery_code_i_plaintext, recovery_code_i.salt, 600_000, 256 bits)
```

- Each recovery code's plaintext is shown to the user **once**
  per F2 §6.1; server never persists it.
- Each `recovery_code` row stores `salt`, the Argon2id `hash`
  of the plaintext (for authentication), and `env_recovery`
  (for `K` unwrap).
- A user presenting a valid recovery code can unwrap `K`
  independently — the recovery-code path does not need any
  previously-authenticated device.
- This is the **only** path that survives total device-loss +
  password-loss. If all 10 codes are used or lost, F2 §6.3
  "cannot recover" applies.

### 2.4 Optional per-device envelope (`Env_device`)

F5 also provisions a per-device wrap as an **offline-cache
optimisation only**:

```text
Env_device = AES-GCM-256(K, KEK_device)
KEK_device = PBKDF2-SHA256(accountSecret, deviceSalt, 600_000, 256 bits)
```

- `deviceSalt` is 16 random bytes per `(user_id, device_id)`,
  generated on first device bootstrap per F2 §5.3.
- `Env_device` is created **after** `Env_user` was unwrapped on
  the device, then persisted in `device.env_device` for fast
  re-open without going through the user-envelope path. **Not
  required for security or correctness.**
- On rotation, `device.env_device` is invalidated (set to
  `NULL`); on next interactive auth the device unwraps `K` via
  `Env_user`, re-derives `KEK_device` from the new
  `accountSecret`, re-wraps, and caches.

The per-device cache exists so a returning device with a fresh
session cookie (after silent refresh) can decrypt its own
IndexedDB save without re-going-through the user-envelope path
on every app launch. For an offline-first PWA this is purely a
latency optimisation.

### 2.5 Portable export envelope (`Env_portable`)

Per ADR-0005 §1 mode "portable_export":

```text
Env_portable = AES-GCM-256(K, KEK_portable)
KEK_portable = PBKDF2-SHA256(userPassphrase, portableSalt, 600_000, 256 bits)
```

- `userPassphrase` is user-supplied at export time.
- `portableSalt` is 32 random bytes, embedded in the export
  envelope.
- Stored in the `.smsave` export file alongside the AEAD-
  encrypted save payload, per ADR-0005 §5.
- Survives `accountSecret` rotation by design (the passphrase
  is independent), so a portable export remains importable
  forever — as long as the passphrase is remembered.

Forward path: when the portable-export UI ships (post-MVP per
ADR-0005 §1 + F1 §5.1), the KDF for `KEK_portable` switches to
**Argon2id** (`envelopeVersion = 2`); the AAD-bound header
records the KDF choice so old envelopes stay readable.

### 2.6 Why `K` is generated **after** email verification

A pending-email-verification account holds no save data, no
device bootstrap, no recovery codes. Generating `K` (and
`Env_user`, and the 10 `Env_recovery_i` envelopes) at email-
verification completion means:

- The cost is paid once, at a single deterministic point in the
  signup funnel (~150 ms client-side CPU on a Hetzner-class
  device, dominated by the 600 000-iteration PBKDF2 derivations).
- We never have to clean up half-initialised accounts.
- The first device's `Env_device` cache is created in the same
  flow as the post-verification onboarding screen (F2 §3.3).

## 3. Envelope wire format

### 3.1 TypeScript struct

`packages/save-format/src/envelope.ts` (the existing ADR-0005
package extended with the F5 envelope type):

```ts
export type WrapMode =
  | 'user'             // Env_user (canonical)
  | 'recovery_code'    // Env_recovery_i (one per code)
  | 'device'           // Env_device (optional cache)
  | 'portable_export'  // Env_portable (passphrase-bound file)
  | 'shared_save'      // RESERVED for Phase-2 cloud MP (ADR-0004)
  | 'device_bound'     // RESERVED for RFC 9449 DPoP hardware-bound wrap

export type EnvelopeKdf =
  | { algo: 'pbkdf2-sha256'; iterations: 600_000 }
  | { algo: 'argon2id'; memMiB: number; timeCost: number; parallelism: number }  // envelopeVersion ≥ 2
  | { algo: 'hpke-x25519-hkdf-sha256-aes-256-gcm' }                              // envelopeVersion ≥ 3

export type EnvelopeAead =
  | { algo: 'aes-gcm-256'; ivLen: 12; tagLen: 16 }

export interface MasterKeyEnvelope {
  // ---- plain header (authenticated, not encrypted) ----
  envelopeVersion: 1                          // bumps with KDF or AEAD change
  wrapMode: WrapMode
  wrapTargetId: string                        // see §3.2

  // ---- algorithm identifiers ----
  kdf: EnvelopeKdf
  aead: EnvelopeAead

  // ---- KDF inputs ----
  salt: Uint8Array                            // 32 bytes for user/recovery/portable, 16 bytes for device

  // ---- AEAD inputs ----
  iv: Uint8Array                              // 12 bytes random per wrap
  ciphertext: Uint8Array                      // wrap of K (32 bytes plaintext → 32 bytes ciphertext + 16 byte tag)

  // ---- metadata ----
  keyId: string                               // ULID; identifies K within the user (constant for K's life)
  createdAt: string                           // ISO 8601 datetime
}
```

### 3.2 `wrapTargetId` semantics

| `wrapMode`        | `wrapTargetId`                                       | Cardinality            |
| ---               | ---                                                  | ---                    |
| `user`            | `user_id` (same as the table PK)                     | exactly 1 per user     |
| `recovery_code`   | `recovery_code_id` (ULID of the row in `user_credential` of kind `recovery_code`) | 10 per user at MVP |
| `device`          | `device_id` (ULID of the row in `device`)            | ≤ 10 per user (F2 §2.1) |
| `portable_export` | `export_id` (ULID embedded in the `.smsave` file)    | unbounded (one per export) |
| `shared_save`     | `<save_id>:<member_user_id>` composite               | RESERVED, post-MVP     |
| `device_bound`    | `<device_id>:<device_public_key_id>` composite       | RESERVED, post-MVP     |

### 3.3 AAD definition (binding the plain header to the ciphertext)

When wrapping, the AAD passed to AES-GCM is the **canonical
serialisation** of the plain-header fields:

```text
AAD = utf8("soccer-manager-envelope-v1")
   || u8(envelopeVersion)
   || u8(wrapModeCode)              // 0x01=user, 0x02=recovery_code, 0x03=device,
                                    // 0x04=portable_export, 0x05=shared_save, 0x06=device_bound
   || u8(kdfCode)                   // 0x01=pbkdf2-sha256, 0x02=argon2id, 0x03=hpke
   || u8(aeadCode)                  // 0x01=aes-gcm-256
   || u32be(kdf.iterations OR 0)    // for argon2id: 0 — argon2 params already in AAD via their canonical bytes
   || u8(salt.length) || salt
   || utf8(wrapTargetId)            // length-prefixed via u16be
   || utf8(keyId)                   // length-prefixed via u16be
```

The same AAD bytes are reproduced on unwrap. Any modification of
any field invalidates the AEAD tag and `unwrapKey` throws
uniformly — see §4.5 constant-time error UX.

Including `wrapMode` and `wrapTargetId` in AAD prevents
transplant attacks (a server-side adversary cannot move an
`Env_recovery_1` blob into the `Env_user` slot or vice-versa).

### 3.4 Wire encoding on disk

In the platform DB the envelope is stored as a single BLOB
column containing the **binary-canonical** layout:

```text
EnvelopeV1Binary :=
  magic[8]            = "SMEV-001"
  envelopeVersion u8  = 0x01
  wrapModeCode    u8
  kdfCode         u8
  aeadCode        u8
  reserved        u8  = 0x00
  iterations      u32be          // 0 for non-PBKDF2 KDFs
  saltLen         u8
  ivLen           u8
  ctLen           u32be
  targetIdLen     u16be
  keyIdLen        u16be
  salt            [saltLen]
  iv              [ivLen]
  wrapTargetId    [targetIdLen] utf8
  keyId           [keyIdLen] utf8
  ciphertext      [ctLen]        // includes the 16-byte AEAD tag at the end per AES-GCM
```

Total size at MVP: 8 + 1 + 4 + 4 + 1 + 32 + 12 + ≤ 32 + ≤ 27 + (32 + 16) = ~140 bytes per envelope. A user with one `Env_user` + 10 `Env_recovery_i` + 5 `Env_device` rows occupies ~2.2 KB of envelopes total.

The `.smsave` portable-export file embeds the `EnvelopeV1Binary`
of mode `portable_export` followed by the AEAD-encrypted save
payload per ADR-0005 §5.

## 4. Web Crypto mechanics

### 4.1 Generate `K` once on signup

```ts
// After email verification, server signals the client to bootstrap K.
// Generate K with extractable = true so we can wrap it under all KEKs
// in the next step. Immediately re-import as non-extractable for
// runtime use and discard the extractable handle.
async function generateMasterKey(): Promise<CryptoKey> {
  const extractable = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,                                  // must be true to allow wrapKey('raw', ...)
    ['encrypt', 'decrypt'],
  )
  return extractable                       // caller wraps then re-imports non-extractable
}
```

### 4.2 Derive a KEK from a user secret

```ts
async function deriveKek(args: {
  secret: Uint8Array | string             // accountSecret (32 bytes) or recovery code (utf8 string)
  salt: Uint8Array                        // userSalt / recovery_code.salt / deviceSalt
  iterations?: number                     // default 600_000 per ADR-0005 §3
}): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const secretBytes = typeof args.secret === 'string' ? enc.encode(args.secret) : args.secret
  const baseKey = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'PBKDF2' },
    /* extractable */ false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: args.salt,
      iterations: args.iterations ?? 600_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    /* extractable */ false,
    ['wrapKey', 'unwrapKey'],
  )
}
```

### 4.3 Wrap `K` to produce an envelope

```ts
async function wrapMasterKey(args: {
  masterKey: CryptoKey            // must be extractable=true at this call site
  kek: CryptoKey
  envelopeHeader: MasterKeyEnvelope  // sans iv/ciphertext fields
}): Promise<MasterKeyEnvelope> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const aad = encodeEnvelopeAad(args.envelopeHeader, iv)
  const ciphertext = new Uint8Array(
    await crypto.subtle.wrapKey('raw', args.masterKey, args.kek, {
      name: 'AES-GCM',
      iv,
      additionalData: aad,
      tagLength: 128,
    }),
  )
  return { ...args.envelopeHeader, iv, ciphertext }
}
```

### 4.4 Unwrap `K` from an envelope (the hot path)

```ts
async function unwrapMasterKey(args: {
  envelope: MasterKeyEnvelope
  kek: CryptoKey
}): Promise<CryptoKey> {
  const aad = encodeEnvelopeAad(args.envelope, args.envelope.iv)
  return crypto.subtle.unwrapKey(
    'raw',
    args.envelope.ciphertext,
    args.kek,
    {
      name: 'AES-GCM',
      iv: args.envelope.iv,
      additionalData: aad,
      tagLength: 128,
    },
    { name: 'AES-GCM', length: 256 },
    /* extractable */ false,            // result is non-extractable
    ['encrypt', 'decrypt'],
  )
}
```

After this call, `K` lives only as a non-extractable
`CryptoKey`. Per W3C WebCrypto Level 2 §7 the underlying key
bytes never enter the JS heap.

### 4.5 Constant-time error surface

All four entry points (`wrapMasterKey`, `unwrapMasterKey`, the
two derive helpers above) wrap their inner `crypto.subtle.*`
calls in a single try/catch that maps **any** failure to a
single typed error:

```ts
export class InvalidEnvelopeError extends Error {
  constructor(public readonly cause?: unknown) {
    super('invalid_envelope')
    this.name = 'InvalidEnvelopeError'
  }
}
```

User-visible copy is uniform: "Wrong passphrase or tampered
file" / "Falsche Passphrase oder manipulierte Datei". The
server-side audit log (per F1 §4.4-I2 redaction deny-list)
records the specific check that failed for forensic use; the
client never sees that detail.

### 4.6 Persistence of `K` in IndexedDB

The non-extractable `CryptoKey` survives a `structuredClone` /
`IDBObjectStore.put` round-trip on Chrome / Edge / Firefox /
Safari 16+ (Q2 research confirmed). Concrete pattern:

```ts
// apps/web/src/crypto/account-keystore.ts
import Dexie, { type Table } from 'dexie'

interface KeystoreRow {
  user_id: string                         // PK
  master_key: CryptoKey                   // non-extractable
  envelope_version: number
  key_id: string
  device_env_envelope: MasterKeyEnvelope | null  // optional cache
  stored_at: number
}

class AccountKeystoreDb extends Dexie {
  rows!: Table<KeystoreRow, string>
  constructor() {
    super('soccer-manager-keystore')
    this.version(1).stores({ rows: 'user_id' })
  }
}

export const accountKeystore = new AccountKeystoreDb()
```

The `CryptoKey` field survives the structured clone; on
retrieval it remains `extractable: false` with the original
`encrypt` / `decrypt` usages.

### 4.7 Argon2id forward path (`envelopeVersion = 2`)

When portable-export UI ships post-MVP, `KEK_portable` switches
to Argon2id via `argon2-browser` (libsodium-WASM, ~50 KiB
gzipped, Tier-A dep per F1 §5.6):

```ts
import argon2 from 'argon2-browser'

async function deriveKekArgon2id(args: {
  passphrase: string
  salt: Uint8Array
  memMiB: number                          // 128 (OWASP 2026)
  timeCost: number                        // 3
  parallelism: number                     // 1
}): Promise<CryptoKey> {
  const { hash } = await argon2.hash({
    pass: args.passphrase,
    salt: args.salt,
    type: argon2.ArgonType.Argon2id,
    hashLen: 32,
    mem: args.memMiB * 1024,
    time: args.timeCost,
    parallelism: args.parallelism,
  })
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey'],
  )
}
```

The envelope header's `kdf.algo = 'argon2id'` records the choice
and the params for verification; old envelopes with
`kdf.algo = 'pbkdf2-sha256'` stay readable forever.

## 5. Server-side schema

### 5.1 `user` table additions (typed-column extensions)

Building on the F2 §2.1 `user` table — added as Drizzle columns on the
platform `public.user` table
([[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] §1, §4):

```ts
// additions to packages/db/src/schema/platform/identity.ts → user
envUser: customBytea('env_user'),                          // Env_user binary blob (nullable)
envUserIv: customBytea('env_user_iv'),                     // denormalised for replay protection scan
envUserKeyId: text('env_user_key_id'),                     // ULID of K (constant for K's life)
userSalt: customBytea('user_salt'),                        // 32 bytes; stable for the account's life
envelopeVersion: integer('envelope_version').notNull().default(0), // 0 = F2 baseline (pre-envelope); >= 1 = F5 envelope
accountSecretVersion: integer('account_secret_version').notNull().default(0), // bumps on each rotation
accountSecretRotatedAt: timestamp('account_secret_rotated_at', { withTimezone: true }),
```

(`customBytea` is the project's `bytea` column helper; `option<bytes>`
fields map to nullable `bytea`.)

`user.accountSecret` itself stays column-encrypted at rest with
the deployment's sops-managed at-rest key (F2 §2.1, F11 secrets
runbook). F5 adds nothing to the at-rest column-encryption
policy.

### 5.2 `user_credential` (kind=`recovery_code`) extensions

Building on F2 §2.1. The `recovery_code` rows use the SCHEMALESS
`user_credential.payload jsonb` column (ADR-0027 §4); these keys are
validated by the `recovery_code` Zod schema at the boundary (bytes are
base64-encoded inside the JSON payload):

```ts
// Zod shape for user_credential.payload when kind = 'recovery_code'
const recoveryCodePayload = z.object({
  salt: z.string(),            // base64; 32 bytes; argon2id salt for code verification AND KDF input for KEK_recovery_i
  code_hash: z.string(),       // base64; Argon2id hash for authentication
  env_recovery: z.string(),    // base64; Env_recovery_i binary blob
  env_recovery_iv: z.string(), // base64; denormalised
  envelope_version: z.number().int(),
})
```

Each of the 10 recovery codes per user is one row. On signup
the server returns the 10 plaintext codes to the client **once**
(F2 §6.1) — the client wraps `K` once under each code's KEK,
uploads the 10 envelopes back, and the server persists them
alongside the code hashes.

Server never sees plaintext recovery codes after this initial
exchange.

### 5.3 `device.env_device` (optional cache)

Added as Drizzle columns on the platform `public.device` table
([[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] §1, §4):

```ts
// additions to packages/db/src/schema/platform/device.ts → device
envDevice: customBytea('env_device'),
envDeviceIv: customBytea('env_device_iv'),
envDeviceVersion: integer('env_device_version'),           // equals user.envelope_version at the time this cache was minted
envDeviceMintedAt: timestamp('env_device_minted_at', { withTimezone: true }),
```

This row is `NULL` after rotation; the device repopulates it
lazily on its next interactive auth via the `Env_user` path.

### 5.4 Rotation lock — Redis

`rotation_lock:<user_id>` — a single Redis key with a 60-second
TTL. Set with `SET rotation_lock:<user_id> <idempotency_key> NX
PX 60000`. Failure = `409 rotation_in_progress`. The lock is
released either by explicit `DEL` at the end of a successful
rotation, or by Redis TTL expiry if the rotation crashed
mid-flow.

### 5.5 Outbox events

Rotation emits one of three event types per ADR-0013 + F3 §8.3:

- `auth.account_secret_rotated` — password-change or "rotate
  security key" path.
- `auth.password_reset_completed` — email-recovery path.
- `auth.recovery_flow_completed` — recovery-code path. Also
  emits `auth.recovery_code_used` (one per consumed code) +
  `auth.recovery_codes_regenerated` (one for the regen set).

Payload shape per F3 §8.3.

## 6. Rotation algorithm

### 6.1 Trigger surface (locked)

F2 + F3 already locked the three triggers; F5 specifies the
algorithm:

| Trigger                                              | Algorithm |
| ---                                                  | ---       |
| Password change (logged-in session, F2 §7.1)         | §6.2 logged-in rotation |
| Recovery code use (login screen, F2 §6.2)            | §6.3 recovery-code rotation |
| "Sign out everywhere AND rotate security key" (F3 §9.5) | §6.2 logged-in rotation + force-revoke all sessions |
| Email password reset (forgot-password, F2 §3.5)      | §6.2 if the click-through completes on a logged-in device; otherwise §6.3-like path via the reset token as a one-time KEK source |

### 6.2 Logged-in rotation (atomic)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant A as Device A (logged in)
  participant S as Server
  participant DB as PostgreSQL
  participant R as Redis
  participant Aud as Outbox/Audit

  U->>A: change password (or click "Rotate security key")
  A->>S: POST /api/auth/rotate-account-secret (idempotency key, step-up'd)
  S->>R: SET rotation_lock:<user_id> <idem> NX PX 60000
  R-->>S: OK (or 409 if lock taken)
  S->>S: generate accountSecret_new (32 random bytes, CSPRNG)
  S->>S: read user.env_user, user.user_salt, user.account_secret_version
  S-->>A: { accountSecret_new, userSalt, env_user_current, kdfParams, expected_version }
  A->>A: derive KEK_user_old = PBKDF2(accountSecret_old, userSalt) (from session cache)
  A->>A: unwrap K from env_user_current using KEK_user_old
  A->>A: derive KEK_user_new = PBKDF2(accountSecret_new, userSalt)
  A->>A: wrap K → env_user_new
  A->>S: PUT /api/auth/rotate-account-secret/commit { env_user_new, idem }
  S->>DB: BEGIN; check version; UPDATE user SET accountSecret=enc(accountSecret_new), accountSecret_version++, env_user=env_user_new, envelope_version=max(envelope_version,1), token_version++; UPDATE device SET env_device=NULL WHERE user_id=$user_id; COMMIT
  S->>Aud: emit auth.account_secret_rotated outbox event
  S->>R: DEL rotation_lock:<user_id>
  S-->>A: 200 OK { new_account_secret_version }
  A->>A: re-derive KEK_device_new locally; re-wrap K → env_device_new; PUT optional cache
  A->>A: BroadcastChannel.postMessage({type:'LOGOUT', reason:'account_secret_rotated'})
  Note over A: Other tabs see logout per F3 §7.1
```

Atomicity:

- The PostgreSQL transaction encompasses the `accountSecret`
  update, `env_user` update, `envelope_version` bump,
  `token_version` bump (which triggers F3 §8.2 hybrid revocation
  on every session except the current one — the current session
  is re-minted in the response), and the per-device-envelope
  cache wipe.
- The Redis rotation lock prevents two parallel rotation
  attempts on the same user. The second attempt sees `409
  rotation_in_progress` and the client backs off.
- If the second `PUT … /commit` arrives with a stale
  `idempotency_key`, the server returns the stored response from
  the first successful commit (Redis-side idempotency cache,
  300 s TTL).

### 6.3 Recovery-code rotation (no prior authenticated session)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant B as Device B (fresh, not yet authenticated)
  participant S as Server
  participant DB as PostgreSQL

  U->>B: login screen — "Use a recovery code"
  U->>B: enter email + recovery_code_plaintext
  B->>S: POST /api/auth/recovery-login { email, recovery_code }
  S->>DB: lookup user_credential rows of kind=recovery_code
  S->>S: for each unused row: Argon2id-verify(plaintext, hash); abort on mismatch
  S->>S: on match: mark the matching row as revoked (single-use)
  S->>S: generate accountSecret_new, userSalt_new (optional — see note)
  S-->>B: { accountSecret_new, userSalt(_new?), env_recovery_matched, recovery_code.salt, kdfParams }
  B->>B: derive KEK_recovery_matched = PBKDF2(recovery_code, salt, 600_000)
  B->>B: unwrap K from env_recovery_matched
  B->>B: derive KEK_user_new = PBKDF2(accountSecret_new, userSalt(_new?))
  B->>B: wrap K → env_user_new
  B->>B: regenerate 10 fresh recovery codes (CSPRNG); display once; wrap K under each
  B->>S: PUT /api/auth/recovery-login/commit { env_user_new, 10 × env_recovery_new, 10 × recovery_code_hash }
  S->>DB: BEGIN; update user.env_user, accountSecret, accountSecret_version++, token_version++; delete old recovery_code rows; insert 10 fresh recovery_code rows; emit auth.recovery_flow_completed; COMMIT
  S-->>B: 200 OK; session_id + refresh_token cookies set
  S->>S: send email + in-app notification "Recovery code used to sign in"
```

Note on `userSalt`: F5 keeps `userSalt` stable through normal
rotations (it's a salt, not a secret), but **rotates** it on
the recovery-code path because we are intentionally treating the
event as a "compromise trust boundary" (Q4 research). `userSalt`
rotation invalidates any leaked KEK_user_old that an attacker
might have computed offline.

### 6.4 Migration from F2 baseline (envelope_version = 0 → 1)

```mermaid
sequenceDiagram
  autonumber
  participant U as User
  participant A as Device A (logged in)
  participant S as Server
  participant DB as PostgreSQL

  Note over U,DB: First login after F5 deploy.
  A->>S: standard login per F2 §4
  S->>DB: SELECT user.envelope_version FROM ...
  alt envelope_version = 0
    S-->>A: { … session cookies, envelope_status: 'migration_required', accountSecret, deviceSalt }
    A->>A: derive deviceBackupKey = PBKDF2(accountSecret, deviceSalt) per ADR-0005 §3 (old direct path)
    A->>A: generate K (extractable=true, AES-GCM-256)
    A->>A: generate userSalt (32 random bytes)
    A->>A: derive KEK_user = PBKDF2(accountSecret, userSalt)
    A->>A: wrap K → env_user
    A->>A: for each of the 10 (regenerated) recovery codes: derive KEK_recovery_i; wrap K → env_recovery_i
    A->>S: PUT /api/auth/envelope/migrate { env_user, userSalt, 10 × env_recovery_i, 10 × recovery_code_hash }
    S->>DB: BEGIN; UPDATE user SET env_user, user_salt, envelope_version=1, env_user_key_id=<ULID>; INSERT/UPDATE 10 × user_credential(recovery_code); COMMIT
    S-->>A: 200 OK
    A->>A: re-import K as extractable=false; persist in IndexedDB account_keystore
    A->>A: optional: derive KEK_device; wrap K → env_device; PUT /api/auth/envelope/device-cache
  else envelope_version ≥ 1
    Note over A: skip migration; standard F5 path
  end
```

Properties of the migration:

- **Idempotent**: F2 baseline detection is `envelope_version =
  0`. Once set to ≥ 1, the migration block is skipped.
- **Per-user, lazy**: triggered on each user's first login
  after F5 deploy; no big-bang offline migration job needed.
- **Forces recovery-code regeneration**: existing users may have
  the 10 codes printed on paper, but our F2-baseline storage did
  not have envelopes for them. We regenerate fresh codes during
  the migration, invalidate the old set, and surface a one-time
  modal: "We've updated your account security. Please save your
  new recovery codes." (DE / EN copy in §8.4.)
- **No save data is touched**: existing IndexedDB saves stay
  AEAD-encrypted under the user's existing key derivation path.
  After migration the device decrypts saves using K (unwrapped
  from `Env_user`) rather than the old `PBKDF2(accountSecret,
  deviceSalt)` direct path; the AES-GCM key matches because both
  paths historically produced the same 256-bit key bytes. *F5
  migration includes a one-shot re-encryption-of-existing-saves
  step inside the migration transaction, so the at-rest blobs
  are wrapped under K from this point on. The user sees a
  one-time "Updating your data…" progress bar (~1-2 s for a
  typical 5-save user; per-save AES-GCM unwrap+wrap is
  ~milliseconds).* (Q&A §13 #2 confirms this is acceptable.)
- **Compatible with offline-first**: if the user is offline on
  first F5-deploy launch, the existing direct-path saves are
  still decryptable and the migration runs on next online
  session.

## 7. Multi-device continuity (simplified)

Because `Env_user` is canonical, the multi-device protocol
collapses to "every device fetches `Env_user` on re-login":

| Scenario                                                          | Behaviour                                       |
| ---                                                               | ---                                             |
| Device A rotates `accountSecret`                                  | A unwraps K, re-wraps `Env_user`, commits        |
| Device B online elsewhere when rotation lands                     | F3 `token_version` bump → next request 401; on re-login B receives the new `accountSecret` + `Env_user`; B re-derives KEK_user_new; unwraps K |
| Device C offline when rotation lands                              | C keeps using its cached K via the local `Env_device` (still valid because K hasn't changed). On reconnect, C sees 401 `session_revoked`, re-authenticates, fetches the new `Env_user`, recomputes its `Env_device` cache from the new `accountSecret`. Local saves remain readable throughout. |
| Device D first-ever sign-in (after rotation already happened)     | Standard F2 §5.3 bootstrap with the current `accountSecret`; fetches `Env_user`; unwraps K |
| Device E first-ever sign-in via recovery code                     | §6.3 recovery-code rotation, then standard `Env_user` path |
| Device F online when migration runs on a different device         | Same as B: 401 → re-login → standard `Env_user` path → no extra steps. The F2 baseline isn't visible from F's side because F doesn't have `Env_device` for the migration's intermediate state. |

The **key property**: there is **no inter-device protocol**. No
device needs another device's cooperation to unwrap K post-
rotation, because `Env_user` is a complete, self-contained
recovery primitive given the new `accountSecret`. This is the
simplification Q3 research recommends and Q5 industry comparison
confirms (Bitwarden / 1Password / Standard Notes / Proton all
follow this pattern).

The Q5 research also surveyed the alternative — per-device
envelopes requiring cross-device cooperation — and confirmed it
is not used by any major end-to-end encrypted consumer app in
2026. F5 explicitly **rejects** that path; per-device envelopes
exist only as the optional offline-cache optimisation (§2.4).

## 8. Recovery flows (user-facing)

### 8.1 Email password reset

Flow specifics inherited from F2 §3.5 (anti-enumeration response,
single-use 15-min token, Argon2id hash). F5 adds:

- **The successful `POST /api/auth/password-reset/complete`
  rotates `accountSecret`** per §6.2 logged-in rotation, but
  with a special bootstrap: the reset-token-holding device is
  not yet authenticated, so the token itself acts as a one-time
  KEK source. Pattern:
  1. Server validates the reset token.
  2. Server returns `accountSecret_old` + `env_user_current` +
     `userSalt` to the token-bearer device (one-time payload,
     fresh anti-CSRF token, requires Origin / Sec-Fetch-Site
     match).
  3. Client derives `KEK_user_old = PBKDF2(accountSecret_old,
     userSalt)`, unwraps K from `env_user_current`.
  4. Server generates `accountSecret_new`; client wraps K to
     produce `env_user_new`.
  5. Client `PUT … /complete` with new password Argon2id hash +
     `env_user_new`.
  6. Server atomic transaction: update password hash, swap
     `env_user`, bump `account_secret_version`, bump
     `token_version`, revoke all sessions (F3 row #5), null all
     `device.env_device` caches.

- **Rotation is mandatory** on email password reset (Q4
  research recommendation: password reset is a high-signal
  compromise event). The user's other devices see the F3
  `token_version` bump → forced re-login → fresh `Env_user`
  pickup.

- **Recovery codes are NOT regenerated** on email password
  reset (unlike recovery-code use). The user's existing codes
  still authenticate via their pre-rotation `Env_recovery_i`
  envelopes which were wrapped under the unchanged K. F5
  §6.3 only regenerates codes on the recovery-code path itself.

### 8.2 Recovery code use

Per §6.3 algorithm. UX:

- Login screen has a "Use a recovery code" link below the
  passkey / password options.
- Click → modal asking for email + recovery code (16 chars,
  base32, `XXXX-XXXX-XXXX-XXXX` formatted input with auto-
  uppercase + dash-skip).
- On success → page shows 10 fresh recovery codes with the
  same one-time confirmation flow as F2 §6.1.
- User cannot proceed past the recovery-code confirmation page
  until they confirm storage by re-entering one randomly-
  selected code (Bitwarden-style anti-skip per F2 §6.1).
- Email + in-app banner notifies the user: "A recovery code
  was just used to sign in to your account from
  <approximate-location>. If this wasn't you, change your
  password and revoke devices now."

### 8.3 "Sign out everywhere AND rotate security key"

Per F3 §9.5. F5 specifies that this invokes §6.2 logged-in
rotation followed by F3 row #2 "Sign out everywhere" (the
`tokenVersion` bump in §6.2 already triggers it; the explicit
session-family revoke step is the additional cleanup).

### 8.4 Migration one-time modal

On first F5-enabled login per user (the §6.4 path), after
migration succeeds the user sees a non-modal banner + a one-
time setup screen:

- **DE**: "Wir haben dein Konto-Sicherheitssystem aktualisiert.
  Bitte speichere deine neuen Wiederherstellungscodes. Du
  brauchst sie, falls du den Zugang zu deinem Passwort und
  deinen Passkeys verlierst."
- **EN**: "We've updated your account security. Please save
  your new recovery codes — you'll need them if you lose
  access to your password and passkeys."

The user must confirm storage of the 10 codes (re-enter one
random code) before the screen can be dismissed. The previous
recovery codes (if any were generated under F2 baseline) are
invalidated server-side as part of the migration transaction.

### 8.5 "I lost everything" — cannot-recover cliff

Per F2 §6.3 + Q4 research, the explicit cliff stays. Settings →
Security has a "Lost access?" panel:

- **EN**: "If you've lost your passkey, password, AND all 10
  recovery codes, we cannot recover your account. Your saves
  are encrypted with keys we never had; this is by design. If
  you have a portable save export (`.smsave` file) and remember
  its passphrase, you can import it into a fresh account."
- **DE**: "Wenn du deinen Passkey, dein Passwort UND alle 10
  Wiederherstellungscodes verloren hast, können wir dein Konto
  nicht wiederherstellen. Deine Spielstände sind mit Schlüsseln
  verschlüsselt, die wir nie hatten — das ist Absicht. Wenn du
  einen portablen Spielstand-Export (`.smsave`-Datei) hast und
  die zugehörige Passphrase noch kennst, kannst du ihn in ein
  neues Konto importieren."

The same panel links to "Create a portable save export now"
while the user is still logged in (preventative).

## 9. Attack mitigation matrix

| # | Attack                                                     | Mitigation                                                                                       | Residual |
| - | ---                                                        | ---                                                                                              | ---      |
| A1 | Account takeover via password-reset email interception    | Single-use, 15 min TTL token; Argon2id-hashed in store; revoke all sessions on complete; rotation of `accountSecret` invalidates any pre-reset cached envelope on any other device | Inbox-level compromise (RR-1) is out-of-app |
| A2 | Recovery-code phishing on a fake site                     | Phishing site cannot satisfy the WebAuthn passkey UV step on the legit auth surface; users with passkeys + recovery codes are more resistant. Recovery codes are explicit "last resort" UI copy: "Use only if you've lost your passkey AND password." | User typing a recovery code into a phishing form remains possible — same residual as F1 §4.1-S4 |
| A3 | Recovery-code stuffing (attacker tries random codes)      | Per-account 5 failures / 15 min progressive backoff + global per-IP throttling per F2 §8.1; 80-bit entropy per code (16 base32 chars) makes brute force infeasible | None practical at our scale |
| A4 | Reset-link replay                                          | Single-use enforced server-side at validation; token marked used in the same atomic transaction as the password write | None |
| A5 | Recovery storm DoS (fill inbox / spend SMTP budget)        | Per-email 3/15 min + 10/24 h + outbound SMTP cap per F2 §8.2; suppression returns generic 200 regardless | Generic-response cost is fully absorbed by F2's anti-enumeration design |
| A6 | Oracle attack via "account exists" timing                  | Dummy Argon2id hash on the non-exists path equalises wall-clock; constant-time response shape | Network-jitter-side-channel residual is sub-millisecond, statistically infeasible |
| A7 | Email change → password reset chain (post-takeover lateral) | F2 §7.1 step-up MFA on email change + confirmation link to BOTH old and new addresses + 24 h cool-down | Attacker with valid session + step-up satisfied still ≈ legit user; we cannot distinguish |
| A8 | Server compromise → mass data decrypt                      | Server holds `Env_user` only; `K` never present server-side. Even full DB exfiltration cannot decrypt any save without `accountSecret` (column-encrypted with sops-managed at-rest key) AND the per-user KDF run. | Sophisticated attacker who also exfiltrates the sops at-rest key AND brute-forces PBKDF2 — out of scope per F1 §1.3 T5 partial-in-scope |
| A9 | Rollback attack — server feeds a stale `Env_user`         | `env_user_key_id` is bound in AAD; client checks `key_id` matches the most-recent known on every unwrap; mismatch ⇒ `InvalidEnvelopeError`. Server-side audit logs the request. | Limited to within one `key_id` lifetime; K never changes so this is effectively a no-op |
| A10 | Confused-deputy via envelope transplant                   | `wrapMode` + `wrapTargetId` bound in AAD; an `Env_recovery_3` blob inserted into the `user.env_user` slot fails AEAD unwrap immediately | None |

## 10. Future-proof extensions (provisioned now)

- **`envelopeVersion = 2`** — Argon2id KEK for portable export
  (post-MVP per ADR-0005 §1 + F1 §5.1). Schema accepts the
  Argon2id KDF descriptor; old envelopes stay readable.
- **`envelopeVersion = 3`** — HPKE (RFC 9180) wrap with
  X25519-HKDF-SHA256-AES-256-GCM for post-quantum-friendly
  key encapsulation. Same envelope shape; only the `kdf` /
  `aead` discriminators change.
- **`wrapMode = 'shared_save'`** — Phase-2 cloud-sync MP per
  ADR-0004 §A4. Each shared save gets a per-save content key K_s
  wrapped per member: `Env_shared_save = AES-GCM(K_s,
  KEK_member)` with `wrapTargetId = "<save_id>:<member_user_id>"`.
  Member-add and member-remove operations are O(1) envelope
  writes.
- **`wrapMode = 'device_bound'`** — RFC 9449 DPoP hardware-bound
  wrap. `wrapTargetId = "<device_id>:<device_public_key_id>"`;
  KEK derived from a device-held private key + the user's KEK
  for two-factor wrap. Reserved for future hardware-token
  integration.

## 11. Compliance map

### 11.1 NIST SP 800-130 (CKMS design)

- §5 Key types separation → `K` (data-protection), `KEK_user` /
  `KEK_recovery` / `KEK_device` / `KEK_portable` (key-wrapping).
- §6 Key metadata binding via AAD → §3.3.
- §7 Key lifecycle — generation (§2.1), use, rotation (§6),
  destruction (account deletion).

### 11.2 NIST SP 800-63B rev. 4 §6 (Authenticator binding)

- §6.1.1 binding to subscriber → recovery codes are an
  authenticator under the user's control.
- §6.1.3 binding maintenance after authenticator change → §6
  rotation algorithm.
- §6.1.4 authenticator loss → recovery code path; "cannot
  recover" cliff documented (§8.5).

### 11.3 OWASP ASVS v5.0

- **V6.3.6** single-use time-limited reset token → §8.1.
- **V6.3.7** high-entropy reset token → 32 bytes CSPRNG.
- **V6.3.8** generic reset messaging → F2 §8.2 anti-enumeration.
- **V6.3.9** recovery as strong as enrolment → recovery code
  envelopes use the same KDF parameters as user envelopes.
- **V6.3.10** no static-secret recovery questions → only codes.
- **V6.3.11** log + notify recovery events → outbox emission +
  email notification.
- **V11.5** crypto key lifecycle → §6 rotation algorithm + §10
  versioning.

### 11.4 RFC anchors

- RFC 8017 (PKCS#1) / RFC 5990 — general key-wrapping reference.
- RFC 9180 — HPKE; the `envelopeVersion = 3` future path.
- RFC 8018 — PBKDF2 spec; F5 §2.2 uses 600 000 iterations
  (OWASP 2026 minimum).
- W3C WebCrypto Level 2 §7 — wrapKey / unwrapKey semantics for
  non-extractable keys.

### 11.5 GDPR cross-references

- **Data minimisation (Art. 5(1)(c))**: server stores only
  `Env_user` + recovery-code hashes; never `K`, never
  recovery-code plaintexts.
- **Integrity & confidentiality (Art. 32)**: K wrapped with
  AES-GCM-256; user secrets PBKDF2-hardened with 600 000
  iterations; all column-level secrets encrypted at rest with
  sops-managed deployment key.
- **Right to erasure (Art. 17)**: account deletion (F2 §7.1,
  30-day grace) drops `user.env_user`, all `recovery_code` rows,
  all `device.env_device` caches, all `accountSecret`. After the
  grace window expires, no envelope of K exists anywhere;
  K is provably unrecoverable. The user's IndexedDB saves on any
  surviving device remain locally decryptable until the user
  clears site data (per F3 §9.5 offline-first parity).

## 12. F5 follow-up tasks (deferred, not blocking)

| #    | Task                                                              | Owner gap |
| ---  | ---                                                               | ---       |
| FU-1 | Implement Argon2id KDF for `envelopeVersion = 2` portable export  | ADR-0005 amendment + post-MVP portable-export UI |
| FU-2 | Implement HPKE `envelopeVersion = 3` migration path               | post-quantum migration, post-MVP |
| FU-3 | Multi-user shared-save `wrapMode = 'shared_save'`                  | F4 multi-device sync (post-MVP cloud MP) |
| FU-4 | Hardware-bound `wrapMode = 'device_bound'` (RFC 9449 DPoP)         | post-MVP; only if hardware-token integration ever ships |
| FU-5 | CI lint rule: every `crypto.subtle.deriveKey` call uses the project's `deriveKek` helper (no ad-hoc KDF) | E10 |
| FU-6 | Integration tests for envelope migration (F2 baseline → F5 envelope) on existing fixture saves | E11 |
| FU-7 | Fuzz test on envelope binary decoder (length-prefix overflow, malformed UTF-8 in `wrapTargetId`) | E11 |
| FU-8 | DSAR export of envelope metadata + recovery-code metadata + auth_events | F6 |
| FU-9 | DPIA section on `K` + `Env_user` + recovery-code storage           | F6 |

## 13. Open decisions for Nico (Q&A)

### Q1. Canonical user-level envelope `Env_user` (vs per-device envelopes as primary)

Confirm: F5 adopts the **canonical `Env_user`** architecture per
§2.2 + §7. Per-device envelopes (`Env_device`) become an
optional offline-cache optimisation, not a security primitive.
Multi-device continuity has **no cross-device protocol**.

Alternative (rejected by Q3 + Q5 research): per-device envelopes
as primary, requiring inter-device cooperation for rotation.

Default: **canonical `Env_user`** (matches Bitwarden /
1Password / Standard Notes / Proton 2026 patterns).

### Q2. F2 → F5 migration includes one-shot save re-encryption

Confirm: the F2 → F5 migration (§6.4) runs a one-shot per-save
re-encryption under `K` inside the migration transaction
(~milliseconds per save, ~1–2 s total for a typical user with
≤ 5 saves). After this the on-disk save format is identical
to native F5; no compatibility branch remains.

Alternative: keep saves under the legacy direct-derive path
indefinitely, with a compatibility flag per save row. Higher
long-term cost, more code paths to maintain.

Default: **one-shot re-encryption** during migration.

### Q3. `userSalt` rotation on recovery-code use

Confirm: F5 rotates `userSalt` (32 random new bytes) on the
recovery-code path per §6.3, treating it as a compromise trust
boundary. Normal password change and "Sign out everywhere AND
rotate security key" keep `userSalt` stable.

Alternative: never rotate `userSalt` (it's a salt, not a
secret). Saves a few bytes of churn but loses defense against
pre-computed `KEK_user_old` brute force.

Default: **rotate on recovery-code use, stable on normal
rotation**.

### Q4. Password reset does rotate `accountSecret`

Confirm: per Q4 research (§8.1), email password reset rotates
`accountSecret` mandatorily — password reset is a high-signal
compromise event in real systems, and rotating closes any
window of stolen-envelope-still-usable attack.

Alternative: UX-first stance — keep `accountSecret` stable on
password reset, only the password hash changes. Lower friction
on other devices.

Default: **rotate `accountSecret` on password reset**.

### Q5. Recovery codes regenerated **only** on recovery-code use

Confirm: F5 regenerates the full set of 10 recovery codes
**only** on the recovery-code path (§6.3) — using one code
implies the user is in recovery mode and the rest of the set
should be refreshed. Password change and "rotate security key"
do **not** regenerate codes; existing `Env_recovery_i`
envelopes survive because `K` is unchanged.

Alternative: regenerate codes on every rotation trigger. Higher
UX friction for users who don't want to re-store codes.

Default: **only on recovery-code use**.

### Q6. AAD layout (`envelopeVersion`, `wrapMode`, `wrapTargetId`, `kdf`, `aead`, `salt`, `keyId`)

Confirm: §3.3 AAD includes the magic prefix
`"soccer-manager-envelope-v1"` + the discriminator codes +
algorithm parameters + `wrapTargetId` + `keyId`. This makes
envelope transplants and rollback attacks detect at unwrap
time.

Alternative: minimal AAD (just `wrapMode` + `wrapTargetId`).
Smaller AAD bytes; weaker integrity binding.

Default: **full AAD** as in §3.3.

## 14. Sources

### Standards

- NIST SP 800-130 — Framework for Designing Cryptographic Key
  Management Systems:
  <https://csrc.nist.gov/publications/detail/sp/800-130/final>
- NIST SP 800-63B rev. 4 — Digital Identity Guidelines:
  <https://pages.nist.gov/800-63-3/sp800-63b.html>
- NIST SP 800-132 — Recommendation for Password-Based Key
  Derivation: <https://csrc.nist.gov/publications/detail/sp/800-132/final>
- NIST SP 800-38D — AES-GCM mode + IV requirements:
  <https://csrc.nist.gov/publications/detail/sp/800-38d/final>
- NIST SP 800-57 Pt. 1 — Key management lifecycle:
  <https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final>
- RFC 8018 — PBKDF2 / PKCS #5:
  <https://www.rfc-editor.org/rfc/rfc8018>
- RFC 5990 — AES Key Wrap with Padding:
  <https://www.rfc-editor.org/rfc/rfc5990>
- RFC 9180 — HPKE (Hybrid Public Key Encryption):
  <https://www.rfc-editor.org/rfc/rfc9180>
- RFC 9449 — OAuth 2.0 DPoP (Demonstrating Proof of Possession):
  <https://www.rfc-editor.org/rfc/rfc9449>
- OWASP ASVS v5.0 §V6 + §V11:
  <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Cryptographic Storage Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html>
- W3C Web Crypto API Level 2:
  <https://www.w3.org/TR/webcrypto-2/>

### Industry references

- Bitwarden security whitepaper (vault key + KEK separation):
  <https://bitwarden.com/help/bitwarden-security-white-paper/>
- 1Password security design (Secret Key + Master Password):
  <https://support.1password.com/security-features/>
- Standard Notes specifications (root key + items keys, 004
  spec): <https://standardnotes.com/specification>
- Proton key model:
  <https://proton.me/blog/encrypted-email-key-management>
- Signal SVR2 / registration lock PIN:
  <https://signal.org/blog/secure-value-recovery-2/>
- Apple iCloud Keychain (escrow design):
  <https://support.apple.com/guide/security/icloud-keychain-overview-sec1c89c6f3b/web>
- WhatsApp encrypted backups whitepaper:
  <https://faq.whatsapp.com/490592613091019/>
- `argon2-browser` (Argon2id WASM for the future Argon2id KEK):
  <https://github.com/antelle/argon2-browser>

### Project-internal anchors

- [[../60-Research/threat-model]] (F1) §5 cryptographic
  decisions; §6 residual risks accepted.
- [[auth-flows]] (F2) §6 recovery codes; §3.5 email
  verification; §6.2 mandatory rotation on recovery-code use;
  §7.1 step-up MFA sensitive-op catalogue.
- [[session-management]] (F3) §8.1 revocation matrix rows
  #4–#10; §9.5 per-device revoke runbook; §10 offline-first
  reconnect.
- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  §8 outbox visibility.
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
  platform DB tables.
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  §3 KDF; §5 envelope shape; §10 save lifecycle; §11
  restore flow.
- [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  audit event delivery.
- [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  redaction deny-list including `accountSecret`,
  `master_key`, `recovery_code`.
- [[audit-trail]] auth.* event catalogue.

### Perplexity research transcripts (this gap)

Five focused Perplexity-sonar-pro queries, 2026-05-18, total
~32 k tokens, ~$0.10 estimated:

1. **Industry envelope design comparison** — Bitwarden /
   1Password / Standard Notes / Proton / Signal / iCloud
   Keychain / WhatsApp patterns; NIST SP 800-130 / RFC 5990 /
   RFC 9180 anchors; concrete wire format proposal; versioning +
   migration story; threat-model alignment.
2. **Web Crypto API mechanics** — non-extractable CryptoKey
   wrap/unwrap semantics; AAD binding via `additionalData`;
   `generateKey(extractable=true)` then re-import non-extractable
   pattern; IndexedDB persistence of CryptoKey on Chrome / Edge
   / Firefox / Safari 16+; constant-time decrypt-error UX;
   Argon2id forward path via `argon2-browser`.
3. **Rotation algorithm** — Option A (per-device envelopes
   requiring cross-device coordination) vs Option B (canonical
   user-level envelope, no coordination); F2 → F5 lazy migration
   pattern; race conditions and Redis rotation-lock; idempotency
   keys; recovery-code rotation flow specifics.
4. **Recovery flow design + attack mitigation** — email reset
   sequence diagram; recovery-code use sequence; account lockout
   behaviour; full attack matrix (intercept / phishing /
   stuffing / replay / oracle / chain / server compromise /
   rollback / transplant); NIST 800-63B §6 anchors.
5. **Multi-device save-key continuity** — IndexedDB
   `account_keystore` state machine across rotation; pull vs
   push vs out-of-band sync channels; industry comparison
   (Bitwarden / 1Password / Proton / Standard Notes); future-
   proof envelope schema fields (shared_save, device_bound).

Raw transcripts not committed (ephemeral); citations preserved
inline in §14 above. If a future agent needs to re-run them,
the prompts live in this repo's PR history.
