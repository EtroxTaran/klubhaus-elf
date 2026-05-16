#!/usr/bin/env node
// Design-sync: fetch a Claude Design export, snapshot it under
// design/handoff/<date>/, and diff it against the previous snapshot into a
// reviewable CHANGES.md. This script NEVER edits apps/web or vault docs —
// patching the implementation is a separate, manual, targeted PR.
//
// Safety (.cursor/rules/99-safety.mdc): zero external deps, network is only
// reached via `curl` writing to a file (never piped to a shell), no secrets
// are read. Mirrors the script idiom of scripts/prepare-github-issues.mjs.
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'

const API = 'https://api.anthropic.com/v1/design/h/'
const ROOT = join('design', 'handoff')

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function flagValue(argv, name) {
  const i = argv.indexOf(name)
  return i === -1 ? undefined : argv[i + 1]
}

function codeFromInput(input) {
  if (!input) return undefined
  const noQuery = input.split('?')[0].replace(/\/+$/, '')
  return noQuery.split('/').pop()
}

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(abs))
    else out.push(abs)
  }
  return out.sort()
}

function gitDiff(a, b, extraArgs) {
  const result = spawnSync('git', ['diff', '--no-index', ...extraArgs, a, b], {
    encoding: 'utf8',
  })
  // git diff --no-index exits 1 when differences exist, 0 when identical.
  if (result.status !== 0 && result.status !== 1) {
    fail(`git diff failed (exit ${result.status}): ${result.stderr ?? ''}`)
  }
  return result.stdout ?? ''
}

function classify(path) {
  const p = path.replace(/\\/g, '/')
  if (/\.(md)$/i.test(p) && /(RATIONALE|COMPONENTS|ACCESSIBILITY|TASKS)/i.test(p)) {
    return 'spec'
  }
  if (/tailwind\.config\.ts$|components\.json$|ui\.jsx$/i.test(p)) return 'token'
  if (/\.jsx$/i.test(p)) return 'screen'
  return 'other'
}

function changeReport(baselineProject, destProject, manifest) {
  const nameStatus = gitDiff(baselineProject, destProject, ['--name-status'])
  const buckets = { token: [], spec: [], screen: [], other: [], added: [], removed: [] }
  for (const line of nameStatus.split('\n').filter(Boolean)) {
    const [status, ...rest] = line.split('\t')
    const path = rest[rest.length - 1] ?? ''
    if (status.startsWith('A')) buckets.added.push(path)
    else if (status.startsWith('D')) buckets.removed.push(path)
    else buckets[classify(path)].push(`${status}\t${path}`)
  }
  const stat = gitDiff(baselineProject, destProject, ['--stat'])
  const full = gitDiff(baselineProject, destProject, [])
  const list = (xs) => (xs.length ? xs.map((x) => `- ${x}`).join('\n') : '_none_')
  return `# Design Handoff Changes — ${manifest.fetchedAt.slice(0, 10)}

Source: ${manifest.sourceUrl}
Baseline: ${manifest.baseline}
SHA-256: \`${manifest.sha256}\`

## Summary (git diff --stat)

\`\`\`
${stat.trim() || '(no textual changes)'}
\`\`\`

## Token / theme changes

${list(buckets.token)}

## Narrative / spec changes (RATIONALE / COMPONENTS / ACCESSIBILITY / TASKS)

${list(buckets.spec)}

## Screen / prototype changes

${list(buckets.screen)}

## Other changed files

${list(buckets.other)}

## New files

${list(buckets.added)}

## Removed files

${list(buckets.removed)}

## Mapping checklist (fill in when patching — separate targeted PR)

- [ ] Tokens → \`apps/web/src/styles/app.css\`
- [ ] Atoms → \`apps/web/src/components/atoms/**\`
- [ ] Composites → \`apps/web/src/components/composites/**\`
- [ ] Screens + routes → \`apps/web/src/screens/**\`, \`apps/web/src/routes/**\`
- [ ] Sample data / copy → \`apps/web/src/screens/fixtures.ts\`, \`apps/web/src/locales/{de,en}.ts\`
- [ ] Update \`docs/10-Architecture/09-Design-System.md\` if architecture shifted

<details><summary>Full unified diff</summary>

\`\`\`diff
${full.trim()}
\`\`\`

</details>
`
}

function seedReport(manifest) {
  return `# Design Handoff Snapshot — ${manifest.fetchedAt.slice(0, 10)} (baseline seed)

Source: ${manifest.sourceUrl}
SHA-256: \`${manifest.sha256}\`

This is the seeded baseline (no previous snapshot to diff against). Future
\`pnpm sync:design\` runs diff against this snapshot.

## Bundle inventory (${manifest.bundleFiles.length} files)

${manifest.bundleFiles.map((f) => `- ${f}`).join('\n')}
`
}

function main() {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run')
  const fromCache = argv.includes('--from-cache')
  const baselineArg = flagValue(argv, '--baseline')
  const input = argv.find((a) => !a.startsWith('--') && a !== baselineArg)
  const code = codeFromInput(input)

  const today = new Date().toISOString().slice(0, 10)
  const destDir = join(ROOT, today)

  if (existsSync(destDir) && !dryRun && !fromCache) {
    fail(`${destDir} already exists — pass --from-cache to re-extract, or remove the directory`)
  }

  const work = mkdtempSync(join(tmpdir(), 'design-sync-'))
  const tarPath = join(work, 'bundle.tar.gz')

  let sourceUrl
  if (fromCache) {
    const cached = join(destDir, 'bundle.tar.gz')
    if (!existsSync(cached)) {
      fail(`--from-cache needs ${cached} (place the export tarball there first)`)
    }
    cpSync(cached, tarPath)
    sourceUrl = '(re-extracted from cached bundle)'
  } else {
    if (!code) {
      fail('Usage: node scripts/design-sync.mjs <export-url|code> [--dry-run] [--baseline <dir>]')
    }
    sourceUrl = API + code
    const r = spawnSync('curl', ['-fL', '-sS', '-o', tarPath, sourceUrl], {
      stdio: ['ignore', 'inherit', 'inherit'],
    })
    if (r.status !== 0) {
      console.error(
        [
          `Design export not reachable (curl exit ${r.status}).`,
          'Claude Design share links expire and are per-export.',
          'Re-export from claude.ai/design, then re-run:',
          '  pnpm sync:design <fresh-url>',
        ].join('\n'),
      )
      process.exit(1)
    }
  }

  const sha256 = createHash('sha256').update(readFileSync(tarPath)).digest('hex')

  const extractDir = join(work, 'extracted')
  mkdirSync(extractDir)
  const x = spawnSync('tar', ['--force-local', '-xzf', tarPath, '-C', extractDir], {
    stdio: 'inherit',
  })
  if (x.status !== 0) {
    fail('tar extract failed — the bundle is truncated or corrupt')
  }

  const top = readdirSync(extractDir).filter((n) => statSync(join(extractDir, n)).isDirectory())
  if (top.length === 0) fail('extracted bundle has no top-level directory')
  const bundleRoot = join(extractDir, top[0])
  const bundleFiles = walk(bundleRoot).map((f) => relative(bundleRoot, f).replace(/\\/g, '/'))

  let baseline = baselineArg
  if (!baseline) {
    const prior = existsSync(ROOT)
      ? readdirSync(ROOT)
          .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d !== today)
          .sort()
      : []
    baseline = prior.length ? join(ROOT, prior[prior.length - 1]) : undefined
  }

  const manifest = {
    sourceUrl,
    code: code ?? null,
    fetchedAt: new Date().toISOString(),
    sha256,
    bundleFileCount: bundleFiles.length,
    bundleFiles,
    baseline: baseline ?? '(none — seed baseline)',
  }

  if (dryRun) {
    console.log(JSON.stringify(manifest, null, 2))
    if (baseline) {
      console.log(gitDiff(join(baseline, 'project'), join(bundleRoot, 'project'), ['--stat']))
    }
    console.log('\n--dry-run: nothing written under design/.')
    process.exit(0)
  }

  mkdirSync(destDir, { recursive: true })
  const readme = join(bundleRoot, 'README.md')
  if (existsSync(readme)) cpSync(readme, join(destDir, 'README.md'))
  cpSync(join(bundleRoot, 'project'), join(destDir, 'project'), { recursive: true })
  cpSync(tarPath, join(destDir, 'bundle.tar.gz'))
  writeFileSync(join(destDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  writeFileSync(
    join(destDir, 'CHANGES.md'),
    baseline
      ? changeReport(join(baseline, 'project'), join(destDir, 'project'), manifest)
      : seedReport(manifest),
  )

  console.log(`Snapshot written: ${destDir}`)
  console.log(`Review ${join(destDir, 'CHANGES.md')}, then land a targeted PR.`)
  console.log('NOTE: this script never edits apps/web — patching is manual and intentional.')
}

main()
