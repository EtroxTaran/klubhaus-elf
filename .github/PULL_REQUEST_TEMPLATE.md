<!-- PR title must start with [FMX-<n>] -->
**Linear:** `Closes FMX-<n>` &nbsp;<!-- 1 PR ↔ 1 issue; merge auto-closes it. Use `Part of FMX-<n>` only when one issue genuinely needs several PRs. -->
**Agent:** Claude Code | OpenAI Codex | Cursor | human

## Summary

-

## Tests

-

## Vault/docs updates

-

## Design system compliance

- [ ] UI uses design-system tokens/components only (no raw hex, arbitrary
      Tailwind values, inline visual `style=`, or one-off styled components).
- [ ] Any new visual primitive was added to the system + `09-Design-System.md` first.

## Knowledge-base alignment

- [ ] Vault delta included in this PR (ADR / feature spec / architecture + index).
- [ ] Change does not contradict a documented ADR/architecture decision
      (if it does: escalated to Nico, Linear link below, not merged).
- Linear:

## Modularity / future-proofing

- [ ] No new cross-package coupling; package boundaries and `src/db/client.ts` respected.
- [ ] No one-way-door decision without an ADR + Nico sign-off.

## Risk / rollout notes

-
