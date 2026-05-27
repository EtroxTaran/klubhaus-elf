#!/usr/bin/env node
// Local browser preview of the Obsidian vault (docs/) via Quartz v4.
//
// Quartz v4 ships as a self-contained template repo, not a publishable CLI, so
// it is cloned into a gitignored, vendored checkout. Its own npm dependencies
// are installed *inside that checkout only* — they never touch the pnpm
// workspace, so the repo's pnpm-only rule is unaffected.
//
// Usage: pnpm docs:preview   (serves http://localhost:8080)
//   Pin/override the Quartz ref with QUARTZ_REF (branch or tag).

import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..', '..')
const vaultDir = join(repoRoot, 'docs')
const quartzDir = join(here, '.quartz')
const contentDir = join(quartzDir, 'content')

// Pinned to a fixed Quartz release for a reproducible **default** skin/layout
// (the rolling `v5` branch drifts over time). Override with QUARTZ_REF.
const quartzRef = process.env.QUARTZ_REF ?? 'v5.0.0'
const quartzRepo = 'https://github.com/jackyzha0/quartz.git'

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    throw new Error(`\`${cmd} ${args.join(' ')}\` failed with exit code ${result.status}`)
  }
}

if (!existsSync(vaultDir)) {
  throw new Error(`Vault directory not found at ${vaultDir}`)
}

if (!existsSync(quartzDir)) {
  console.log(`Cloning Quartz (${quartzRef}) into ${quartzDir} ...`)
  run('git', ['clone', '--depth', '1', '--branch', quartzRef, quartzRepo, quartzDir], repoRoot)
  console.log('Installing Quartz dependencies (isolated, npm — vendored tool only) ...')
  run('npm', ['install'], quartzDir)
} else {
  console.log('Reusing existing Quartz checkout (delete tools/docs-preview/.quartz to refresh).')
}

// Wiki uses DEFAULT Quartz styling: our custom.scss is intentionally empty
// (FMX-11 revert), copied over Quartz's own (empty) quartz/styles/custom.scss.
// Keep it empty / colour-variable-only — NEVER add `@import url(...)`, which
// breaks the Quartz build ("@import rules must precede all rules").
const themeSrc = join(here, 'custom.scss')
const themeDest = join(quartzDir, 'quartz', 'styles', 'custom.scss')
if (existsSync(themeSrc)) {
  cpSync(themeSrc, themeDest)
  console.log('Copied custom.scss (empty = stock Quartz) into Quartz.')
}

// Mirror the vault into Quartz's content directory, excluding Obsidian's
// private workspace state. The archival GitHub issue-suite is kept in the
// build (a few canonical notes link D-001/D-002), but is filtered out of the
// graph view at read time — see docs/90-Meta/obsidian-config.md.
rmSync(contentDir, { recursive: true, force: true })
mkdirSync(contentDir, { recursive: true })
cpSync(vaultDir, contentDir, {
  recursive: true,
  filter: (src) =>
    !src.includes(`${vaultDir}\\.obsidian`) && !src.includes(`${vaultDir}/.obsidian`),
})

// Quartz renders content/index.md as the site landing page; the vault's entry
// point is 00-Index/Home.md, so surface it as the homepage.
const home = join(contentDir, '00-Index', 'Home.md')
if (existsSync(home)) {
  cpSync(home, join(contentDir, 'index.md'))
} else {
  console.warn('00-Index/Home.md not found; Quartz will use its default landing page.')
}

// Mirror the repo-root onboarding docs into the wiki (parity with the image).
const indexDir = join(contentDir, '00-Index')
for (const [srcName, destName] of [
  ['README.md', 'Repository-README.md'],
  ['CONTRIBUTING.md', 'Contributing.md'],
  ['AGENTS.md', 'Agent-Guide.md'],
  ['CLAUDE.md', 'Claude-Guide.md'],
]) {
  const src = join(repoRoot, srcName)
  if (existsSync(src)) cpSync(src, join(indexDir, destName))
}

// Resolve the UI-Showcase link: real domain if set, else the local hint.
const showcaseDoc = join(indexDir, 'UI-Showcase.md')
if (existsSync(showcaseDoc)) {
  const target = process.env.SHOWCASE_DOMAIN ?? 'localhost:6006 (pnpm storybook)'
  writeFileSync(
    showcaseDoc,
    readFileSync(showcaseDoc, 'utf8').replaceAll('SHOWCASE_DOMAIN_PLACEHOLDER', target),
  )
}

// Quartz v5 config is YAML. Start from the shipped default (= default skin/
// layout) and apply only deploy tweaks (baseUrl from DOCS_DOMAIN, keep
// 90-Meta/templates, and the OFM parseTags workaround) via configure-quartz.mjs.
// Copy the configurer into the checkout so its `import 'yaml'` resolves to
// Quartz's bundled dependency.
const configurer = join(quartzDir, 'configure-quartz.mjs')
cpSync(join(here, 'configure-quartz.mjs'), configurer)
const cfgYaml = join(quartzDir, 'quartz.config.yaml')
cpSync(join(quartzDir, 'quartz.config.default.yaml'), cfgYaml)
run('node', [configurer, cfgYaml], quartzDir)

// v5: install community plugins pinned in quartz.lock.json, then build + serve.
console.log('Restoring Quartz community plugins (v5, from lockfile) ...')
run('npx', ['quartz', 'plugin', 'restore'], quartzDir)

console.log(
  `Serving ${readdirSync(contentDir).length} top-level vault entries at http://localhost:8080`,
)
run('npx', ['quartz', 'build', '--serve'], quartzDir)
