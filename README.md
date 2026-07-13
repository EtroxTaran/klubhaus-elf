# soccer-manager

Offline-first football manager PWA in the style of the classic Anstoß series.

> **Docs-vault-only repository (reset 2026-05-27).** The prior implementation
> (app, packages, match engine, Storybook showcase, toolchain) was removed; this
> repo now holds only the `docs/` Obsidian vault — the design memory the game is
> rebuilt from. See `AGENTS.md` for the full context.

## Quick start

```bash
pnpm docs:check     # validate the vault (frontmatter, wikilinks, no secrets)
pnpm docs:preview   # build + serve the Quartz docs site locally
```

See `AGENTS.md` for agent rules and `docs/00-Index/Home.md` for the Obsidian
Vault entry point.

## Automation on bb8

The repository-scoped runner `bb8-klubhaus-elf` executes trusted workflows with
the labels `self-hosted`, `Linux`, and `X64`. Because this is a public repository,
the runner accepts same-repository pull requests only; fork pull requests are
intentionally unable to satisfy the protected local checks.

AI review is a separate local path owned by
`ai-review-watch@klubhaus-elf.service`. The watcher posts
`ai-review/consensus` and remains the only live auto-merge actuator; copied
AI-review and auto-merge workflows are intentionally absent. Linear keeps the
binding `FMX-…` issue link, but the deterministic GitHub AC parser does not infer
acceptance criteria from that identifier. A pull request therefore needs either
an actually applicable safe file-class exemption or an explicitly resolvable AC
source before merge.

Run the local contracts with:

```bash
pnpm ci:runner-policy
pnpm docs:check
pnpm docs:status-check
```

## Docs vault preview

Open `docs/` as a vault in the Obsidian app, or preview it in a browser
(no Obsidian required):

```bash
pnpm docs:preview   # http://localhost:8080
```

## UI showcase (Storybook)

```bash
pnpm storybook      # http://localhost:6006
```

See `docs/90-Meta/obsidian-config.md` for vault details.
