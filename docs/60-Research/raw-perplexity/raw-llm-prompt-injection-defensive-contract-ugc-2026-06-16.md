---
title: Raw LLM Prompt Injection Defensive Contract for UGC Narrative
status: raw
tags: [research, raw, perplexity, ai, llm, prompt-injection, narrative, ugc, community-packs, security, fmx-188]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-188
related:
  - [[../llm-prompt-injection-defensive-contract-ugc-2026-06-16]]
  - [[raw-llm-prompt-injection-defensive-contract-source-checks-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]
---

# Raw LLM Prompt Injection Defensive Contract for UGC Narrative

## Prompt

Research best practices for defending an LLM narrative/prose pipeline against
prompt injection from untrusted UGC/community-pack text in a game. Include:
direct/indirect prompt injection, delimiter/role isolation, input sanitization
and length caps, schema-bound/allow-listed output, fact grounding,
tool/privilege isolation, deterministic fallback, eval/red-team tests, and
real-world/comparable game or UGC platform practices (modding/community packs
such as Steam Workshop, Roblox UGC text filtering, CurseForge-style
moderation). Provide clear recommendations and 2-3 decision options for FMX,
where the LLM must never affect authoritative simulation state.

## Perplexity Capture

Perplexity recommended treating every community-pack text field as hostile
input and designing the LLM layer as an untrusted UI renderer. The proposed
defense stack was:

- strict role/delimiter isolation;
- constrained schema-bound output;
- zero tool or privileged access;
- deterministic guards and fallbacks;
- continuous eval and red-team testing.

Threat framing:

- **Direct prompt injection**: a player or pack author puts instructions into
  text that is passed directly to the LLM, for example "ignore prior rules" or
  attempts to change match results, morale, finance or other game state.
- **Indirect prompt injection**: malicious instructions are embedded inside
  content the model is asked to summarize or use for flavor, such as mod
  descriptions, club lore, fan blogs, mock press articles or board emails.
- The application must enforce the boundary because the model cannot
  reliably distinguish trusted instructions from untrusted data by itself.

FMX-critical security goal:

> LLM outputs must never directly or indirectly change simulation state or
> privileged configuration. They may describe already-committed state, but all
> state changes are performed by deterministic game code only.

## Recommended Controls

### Delimiter and Role Isolation

- Use a dedicated system-role prompt for an FMX narrator that can only phrase
  commentary/narrative text.
- Explicitly state that all community-pack text is unreliable flavor data, not
  an instruction channel.
- Use tagged sections such as trusted game-state JSON, untrusted UGC block and
  task block.
- Strip or escape delimiter-like text from UGC at import or prompt assembly.
- Keep prompt versions server-side and recorded in provenance.

### Input Sanitization and Length Caps

- Run UGC through a text trust gate before it can become an LLM input.
- Detect and flag meta-instruction patterns such as role labels, system-prompt
  references, prompt leakage requests and "ignore previous instructions"
  variants.
- Escape markdown/code fences and delimiter-like markup before prompt assembly.
- Cap each UGC field and the total prompt size; never truncate authoritative
  game-state facts to make room for UGC.
- For long lore text, use a separate restrictive summarization stage or keep it
  template-only until the summary is trusted.

### Schema-Bound Output

- Require a structured wrapper around text, for example `summary`,
  `commentaryLines`, `riskFlags`, `usedFactRefs` and provenance.
- Reject unknown keys, malformed JSON, overlong fields, tool-call-shaped
  fields, markup/script content and forbidden state-changing language.
- The only user-visible content is display text. Game logic never branches on
  generated strings.

### Fact Grounding

- Treat authoritative game-state JSON as the only source for factual claims
  such as scores, injuries, money, standings, transfers or bans.
- Treat UGC as flavor-only: nicknames, chants, local color, rivalry labels and
  fictional atmosphere.
- Check numeric and named factual claims after generation against the provided
  fact refs.

### Tool and Privilege Isolation

- The narrative LLM has no tools, no database writes, no command handlers and
  no access to authoritative package internals.
- If a future assistant can propose actions, it must be a separate agent path;
  deterministic game code validates and executes any effect.
- Use least-privilege service access: read-only sanitized snapshots, no shared
  tokens with admin, analytics or mutation services.

### Deterministic Fallback

- Every surface has a local template fallback before the provider call.
- Schema, safety, injection, factuality, timeout, cost or provider failures use
  the deterministic fallback.
- Repeated failures for a pack/save can downgrade that pack or session to
  template-only narration.

### Eval and Red-Team Testing

- Build a malicious UGC corpus with direct overrides, indirect injection in
  articles/lore/chants, delimiter escape attempts, obfuscation and prompt
  leakage attempts.
- Run the corpus through the full prompt-builder/provider/validator/fallback
  path.
- Assert no authoritative fields change, no provider is called on replay, no
  injected instruction appears in output and malformed/unsafe responses fall
  back deterministically.
- Add mutation/fuzz variants so tests do not only catch exact strings.

## Comparable Game and UGC Platform Patterns

- Steam Workshop-like systems put content loading responsibility in the game
  client and give developers tools/guidelines to restrict submitted content.
  FMX analog: community packs are data-only, with documented fields and no
  arbitrary executable narrative hooks.
- Roblox-style UGC text handling treats player-submitted text as untrusted,
  filters it before display and fails closed if filtering is unavailable. FMX
  analog: untrusted pack text must pass the text trust gate before it is shown
  or passed to a model.
- CurseForge/modpack-style ecosystems make dependency/package metadata explicit.
  FMX analog: active pack refs and content hashes identify exactly which pack
  text snapshot is being used, but the hash does not make the text trusted.

## Perplexity Options for FMX

### Option A - Air-gapped Narrator

The LLM consumes only trusted game-state facts and no UGC text. Community packs
can affect non-LLM labels/templates only.

Pros:

- smallest prompt-injection attack surface;
- simplest security story;
- best fit for first runtime-LLM experiment.

Cons:

- loses community-pack lore/flavor in generated prose.

### Option B - UGC-as-Flavor with Hard Guardrails

The LLM may consume sanitized, delimited UGC snippets as flavor only. Trusted
facts still come exclusively from authoritative context cards.

Pros:

- supports richer community-pack atmosphere;
- keeps simulation authority separated;
- matches the desired FMX narrative/community-pack direction.

Cons:

- needs import trust labels, prompt-builder escaping, output validators and
  red-team corpus before release.

### Option C - Separate Agentic Assistant Later

Keep the narrator as in Option B, but add a future separate assistant that can
propose actions through tool schemas. Deterministic game code validates and
executes any effect.

Pros:

- enables future coaching/advice experiences.

Cons:

- larger attack surface;
- not suitable for the FMX-188 narrative defense contract.

## Perplexity Recommendation

Use **Option B** as the target design if Nico wants UGC-aware prose, but stage
release with an **Option A kill switch/default** until the UGC text trust gate,
strict output contract and red-team corpus exist. Option C is future-scope and
must not be coupled to the narrative renderer.

## URLs Returned

- https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks
- https://www.ibm.com/think/insights/prevent-prompt-injection
- https://www.offsec.com/blog/how-to-prevent-prompt-injection/
- https://onsecurity.io/article/llm-prompt-injection-top-techniques-and-how-to-defend-against-them/
- https://kili-technology.com/blog/preventing-adversarial-prompt-injections-with-llm-guardrails
- https://github.com/tldrsec/prompt-injection-defenses
