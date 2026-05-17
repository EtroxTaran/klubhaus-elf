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

// Quartz keeps `v4` as its rolling stable branch; override with a tag for a
// fully reproducible pin (e.g. QUARTZ_REF=v4.5.1).
const quartzRef = process.env.QUARTZ_REF ?? 'v4'
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

// Mirror the vault into Quartz's content directory, excluding Obsidian's
// private workspace state.
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

// Parity with the deployable image: when DOCS_DOMAIN is set, point Quartz's
// baseUrl at it so previewed sitemap/RSS/OG URLs match production.
const docsDomain = process.env.DOCS_DOMAIN
if (docsDomain) {
  const quartzConfig = join(quartzDir, 'quartz.config.ts')
  const patched = readFileSync(quartzConfig, 'utf8').replace(
    /baseUrl:\s*['"][^'"]*['"]/,
    `baseUrl: "${docsDomain}"`,
  )
  writeFileSync(quartzConfig, patched)
  console.log(`Set Quartz baseUrl to ${docsDomain}`)
}

console.log(
  `Serving ${readdirSync(contentDir).length} top-level vault entries at http://localhost:8080`,
)
run('npx', ['quartz', 'build', '--serve'], quartzDir)
