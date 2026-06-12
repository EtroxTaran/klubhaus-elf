---
title: "Raw - Match-engine runtime fork determinism (FMX-135)"
status: raw
tags: [research, raw, perplexity, match-engine, determinism, wasm, wasmtime, rust, typescript, fixed-point, fmx-135]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-135
related:
  - [[../match-engine-contract-ratification-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
  - [[../../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]
  - [[../../10-Architecture/09-Decisions/ADR-0003-match-engine]]
---

# Raw capture - Match-engine runtime fork determinism (Perplexity, 2026-06-12)

Perplexity capture for **FMX-135**. Status `raw`: this is source input only; the
synthesis is [[../match-engine-contract-ratification-2026-06-12]].

No FMX private data, secrets or user data were sent. The prompt was a generic
architecture/product research prompt.

## Prompt - runtime decision and cross-runtime replay determinism

**Prompt.** Research the runtime decision for a deterministic football-manager
match engine in 2026. Compare: A) Rust-native authoritative engine with
Rust-to-WASM browser replay/sandbox, B) single WASM module executed everywhere
(browser plus server via Wasmtime), C) TypeScript-first MVP behind a
MatchEnginePort. Focus on cross-runtime replay determinism risks: FMA,
libm/transcendental functions, compiler reordering/extended precision,
subnormal handling, NaN payload/canonicalization, relaxed SIMD, host imports,
memory/table growth, and interruption. Give 2-3 best-practice options with a
clear recommendation, and list source URLs.

## Key captured findings

- WebAssembly is a stronger cross-runtime boundary than native+WASM split for
  replay determinism because the same module avoids native-only FMA fusion,
  extended-precision and platform-libm paths. It still needs policy for host
  imports, NaNs, relaxed SIMD, memory/table growth and interruption.
- Rust-native authoritative plus Rust-to-WASM replay can work only if all
  replay-bearing computation is integer/fixed-point, build flags avoid fast
  math, any math-library use is deterministic, and CI compares native vs WASM
  golden traces continuously. It has the highest performance headroom but also
  the largest cross-runtime proof burden.
- Single WASM everywhere is the cleanest determinism architecture if replay
  integrity matters more than native peak throughput: browser and server execute
  the same bytecode; server hosting uses Wasmtime; all nondeterministic imports
  must be removed or virtualized.
- TypeScript-first MVP is acceptable only as a short-lived path behind
  `MatchEnginePort`, with fixed-point integer math, a pinned authoritative
  Node/runtime and no `Math.random`, `Date`, timers or floating `Math.*` in the
  authoritative engine.
- A mandatory integer/fixed-point numeric surface is safe under all three
  runtime options. The live decision is which runtime becomes authoritative.
- Recommendation returned by Perplexity: prefer single-WASM-everywhere for
  strongest long-term replay determinism; use Rust-native+WASM only with strict
  integer-surface and parity-harness constraints; use TS-first only as fallback.

## Source quality note

Perplexity's source list for this answer was weak for the specific runtime
claims: it included several Football Manager community/video links that do not
substantiate Wasmtime, Rust, WASM or floating-point determinism. The synthesis
therefore treats this answer as a brainstorming capture and verifies the actual
library/runtime facts against primary sources:

- Wasmtime deterministic execution docs:
  <https://github.com/bytecodealliance/wasmtime/blob/main/docs/examples-deterministic-wasm-execution.md>
- Wasmtime interruption docs:
  <https://github.com/bytecodealliance/wasmtime/blob/main/docs/examples-interrupting-wasm.md>
- Wasmtime crate registry:
  <https://crates.io/crates/wasmtime>
- Rust `libm` / compiler-builtins docs:
  <https://github.com/rust-lang/rust/blob/master/library/compiler-builtins/libm/README.md>
- `pure-rand` README and npm registry:
  <https://github.com/dubzzz/pure-rand>
  <https://www.npmjs.com/package/pure-rand>

