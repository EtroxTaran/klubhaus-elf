---
title: FMX-173 Argon2id KDF Validation Plan
status: current
tags: [plan, fmx-173, argon2id, kdf, save-format, security, pwa]
created: 2026-06-19
updated: 2026-06-19
type: plan
binding: false
related:
  - [[../../docs/60-Research/argon2id-wasm-kdf-validation-2026-06-19]]
  - [[../../docs/40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
  - [[../../docs/10-Architecture/11-Risks]]
---

# FMX-173 Argon2id KDF Validation Plan

## Goal

Close the open ADR-0098 follow-up around the portable-export passphrase KDF:
candidate Argon2id WASM provider, exact current version, parameter floor,
mobile/browser benchmark gate, offline PWA loading posture and Nico decision
questions.

## Steps

1. Confirm FMX-173 is claimable and move it to `In Progress`.
2. Work in `codex/fmx-173-argon2id-kdf-validation` from current `origin/main`.
3. Audit ADR-0098, `11-Risks`, `10-Quality`, `08-Crosscutting` and current
   state for existing KDF truth.
4. Run Perplexity-first research for Argon2id WASM libraries, OWASP/RFC
   parameter guidance, PWA/offline loading and comparable product patterns.
5. Source-check current library docs and version metadata through Context7, Ref,
   npm registry, GitHub releases and primary security/browser docs.
6. Preserve raw discovery and targeted source checks under
   `docs/60-Research/raw-perplexity/`.
7. Synthesize options and recommendation in `docs/60-Research`.
8. Add a decision queue for Nico before any KDF provider/profile becomes
   binding.
9. Update ADR-0098, Risks, Quality, Crosscutting, Current-State and vault
   indexes with the non-binding validation packet.
10. Validate with `node scripts/docs-check.mjs`,
    `node scripts/status-consistency-check.mjs` if status/binding semantics
    change, `git diff --check` and `pnpm docs:check`.

## HITL Decisions Pending

Nico needs to answer D1-D6 in
[[../../docs/40-Execution/fmx-173-argon2id-kdf-validation-decision-queue-2026-06-19]]
before the branch should treat provider, profile, fallback or
passphrase-normalization as binding implementation guidance.
