# Bugbot Configuration

This file is an orchestrator. Durable rules live in the vault.

## Flag Always

- Missing same-PR vault updates for changes that affect architecture, product
  scope, gameplay, operations, or user-facing behavior.
- Implementing from `draft`, `superseded`, `archived`, or otherwise
  non-ratified notes.
- New or changed active content notes without `related:` frontmatter and a
  mirrored `## Related` section.
- Secret exposure or attempts to bypass the project safety rules.

Canonical sources:

- `docs/90-Meta/vault-governance.md`
- `docs/90-Meta/agent-memory-protocol.md`
- `docs/90-Meta/collaboration-and-decision-protocol.md`
- `docs/00-Index/Current-State.md`

## Tone

Inline comments only, cite specific line numbers, and reference the vault source.
