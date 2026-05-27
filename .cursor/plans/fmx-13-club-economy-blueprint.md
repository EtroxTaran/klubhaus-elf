---
title: FMX-13 Club Economy Blueprint
status: wrapped
linear: FMX-13
created: 2026-05-27
updated: 2026-05-27
---

# FMX-13 Club Economy Blueprint

## Goal

Promote Nico's club-economy research input from raw research into a full draft
documentation baseline across research, game design, feature planning and
architecture.

## Decisions already provided by Nico

- Full draft anchoring, not research-only.
- Economy is an MVP pillar.
- Weekly ledger is the target tick.
- Insolvency is a staged crisis, not instant game over.
- Full accounting is the target model.
- Country-specific profiles cover Germany, England, France, Italy and Spain,
  plus an abstract fallback.
- Calibration uses ranges and formulas, not final constants.
- UI stays progressive: Quick / Standard / Expert.
- Investor rescue is SP-only future-scope / monetization review, not MVP.

## Work items

- [x] Create a sourced research synthesis and link the raw report.
- [x] Rework the finance/economy GDDR and system note.
- [x] Add a Club Economy MVP feature spec.
- [x] Add a draft ADR for Club Management accounting ledger and contracts.
- [x] Add a draft implementation/contract spec for ledger events and read models.
- [x] Update related game-design notes, architecture maps, feature/research maps,
  Current-State, MVP-Scope and the handoff note.
- [x] Run the docs validation gate and record the outcome.

## Verification

- `node scripts/docs-check.mjs` passed on 2026-05-27.
- `git diff --check` passed on 2026-05-27.
- `pnpm docs:check` was attempted, but the local pnpm/Corepack wrapper failed
  with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`; the underlying validator was
  executed directly instead.
