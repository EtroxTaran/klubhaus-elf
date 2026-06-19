---
title: Handoff - FMX-173 Argon2id KDF Validation
status: open
tags: [meta, execution, handoff, fmx-173, argon2id, kdf, security]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
related:
  - [[../../60-Research/argon2id-wasm-kdf-validation-2026-06-19]]
  - [[../fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# Handoff: FMX-173 Argon2id KDF Validation (2026-06-19)

## Linear

- Issue: FMX-173

## Done this session

- Claimed FMX-173 and worked from
  `codex/fmx-173-argon2id-kdf-validation` at current `origin/main`
  (`7192cbd`).
- Ran Perplexity-first research for Argon2id WASM provider, parameter, PWA and
  comparable-product questions.
- Source-checked the candidate set through Context7, Ref, npm registry, GitHub
  releases, OWASP, RFC 9106, MDN and Bitwarden docs.
- Created raw captures, synthesis and Nico decision queue.
- Updated ADR-0098/Risks/Quality/Crosscutting/Current-State/front-door indexes
  to point at the non-binding FMX-173 packet.

## Open / next step

- Nico needs to answer D1-D6 in
  [[../fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]] before a
  provider/profile/fallback/passphrase-normalization rule becomes binding.
- If Nico approves the recommended path, code phase should exact-pin
  `hash-wasm@4.12.0`, build a Worker benchmark harness and collect real
  target-device evidence before portable export ships.

## Blockers

- No real target-device benchmark exists yet. The risk is narrowed to a
  concrete gate, not closed as implementation-validated.
- Provider/profile/fallback decisions are security/architecture decisions and
  remain HITL.

## Changed vault paths

- `.cursor/plans/fmx-173-argon2id-kdf-validation.md`
- `docs/60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-kdf-2026-06-19.md`
- `docs/60-Research/raw-perplexity/raw-fmx-173-argon2id-wasm-source-checks-2026-06-19.md`
- `docs/60-Research/argon2id-wasm-kdf-validation-2026-06-19.md`
- `docs/40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19.md`
- `docs/40-Execution/session-handoffs/2026-06-19-fmx-173-argon2id-kdf-validation.md`

## Needs promotion

- D1-D6 need Nico approval before ADR-0098 can be promoted from "Argon2id path"
  to exact provider/profile/fallback/passphrase byte contract.

## Related

- [[../../60-Research/argon2id-wasm-kdf-validation-2026-06-19]]
- [[../fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
