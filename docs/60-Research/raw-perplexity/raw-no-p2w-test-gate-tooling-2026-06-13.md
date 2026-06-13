---
title: "Raw - no-P2W architecture test gate tooling (FMX-190)"
status: raw
tags: [research, raw, perplexity, vitest, fast-check, testing, ci, architecture, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-190
related:
  - [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../../30-Implementation/ci-and-review-process]]
---

# Raw - no-P2W architecture test gate tooling (FMX-190)

## Research prompt

Perplexity was asked for DDD/modular-monolith patterns to enforce a no-P2W
invariant with contract tests, property-based tests and CI gates. Context7 and
Ref were then used to verify current Vitest and fast-check documentation.

## Perplexity findings

- The strongest enforcement shape is layered:
  - boundaries: competitive contexts do not import Commerce/Entitlement internals;
  - API contracts: competitive snapshots and ranking/matchmaking inputs do not
    include entitlement/payment/SKU fields;
  - behavioral tests: same seed/input with and without paid entitlements yields
    identical competitive outputs;
  - property/model tests: generated histories and entitlement assignments cannot
    change ranking, matchmaking, group composition, rewards or exports;
  - CI gate: forbidden import/API/behavior changes block merges.
- DDD rationale: paid entitlement delivery belongs in Commerce/Entitlements,
  while Match, League, Statistics, Transfer, Scouting and future MP surfaces must
  remain independent from payment facts except for explicitly cosmetic/profile
  presentation read models.
- Contract-test language is useful inside a modular monolith even without network
  services: public module APIs and event/read-model schemas are the contracts.

## Current tool-doc checks

Vitest:

- Context7 resolved `/vitest-dev/vitest`.
- Current docs describe Test Projects as the replacement for the older workspace
  naming and as a way to define multiple project configurations in one Vitest
  process.
- Vitest projects can isolate Node, browser, integration or architecture test
  suites with distinct includes/names/environments; `--project` can run a named
  subset in CI.
- Source: <https://vitest.dev/guide/projects.md#test-projects>

fast-check:

- Context7 resolved `/dubzzz/fast-check`.
- Ref docs describe property-based testing as random input generation, multiple
  runs and counterexample shrinking, compatible with common JS/TS test runners.
- Model-based testing can define commands and compare a simplified model against
  the real system with reproducible seeds/replay paths.
- Sources:
  <https://github.com/dubzzz/fast-check/blob/main/website/docs/introduction/what-is-property-based-testing.md?plain=1#L24#the-property-based-feature-set>
  and
  <https://github.com/dubzzz/fast-check/blob/main/website/docs/advanced/model-based-testing.md?plain=1#L5#model-based-testing>

## FMX-specific test-gate implications

- Do not introduce new dependencies in the docs-only phase.
- Specify the future implementation as a dedicated Vitest project, e.g.
  `architecture-contract`, once implementation returns.
- Use fast-check for generated entitlements and generated competitive histories:
  the property is equality of authoritative competitive outputs after stripping
  or shuffling paid entitlements.
- Mirror ADR-0089 D3's architecture-test invariant pattern: this ADR should be
  proposed-not-applied until code exists, but the future CI hook should be named
  clearly enough that implementation agents do not treat it as optional.

## Source trail

- Perplexity research pass, 2026-06-13: DDD/modular monolith invariant testing.
- SSW modular monolith testing:
  <https://www.ssw.com.au/rules/modular-monolith-testing>
- Milan Jovanovic, modular monolith system integration testing:
  <https://www.milanjovanovic.tech/blog/testing-modular-monoliths-system-integration-testing>
- Vitest projects:
  <https://vitest.dev/guide/projects.md#test-projects>
- fast-check property-based testing:
  <https://github.com/dubzzz/fast-check/blob/main/website/docs/introduction/what-is-property-based-testing.md?plain=1#L24#the-property-based-feature-set>
- fast-check model-based testing:
  <https://github.com/dubzzz/fast-check/blob/main/website/docs/advanced/model-based-testing.md?plain=1#L5#model-based-testing>

## Related

- [[../no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
- [[../../30-Implementation/ci-and-review-process]]
