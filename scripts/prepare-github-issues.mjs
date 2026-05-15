#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const execute = process.argv.includes('--execute')
const manifestPath = 'docs/90-Meta/github-issue-suite/manifest.json'
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const tempDir = mkdtempSync(join(tmpdir(), 'soccer-manager-issues-'))

for (const issue of manifest) {
  const bodyPath = join(tempDir, issue.file.split('/').pop())
  const body = readFileSync(`docs/90-Meta/github-issue-suite/${issue.file}`, 'utf8')
  writeFileSync(bodyPath, body)

  const args = [
    'issue',
    'create',
    '--title',
    issue.title,
    '--body-file',
    bodyPath,
    '--milestone',
    issue.milestone,
  ]

  for (const label of issue.labels) {
    args.push('--label', label)
  }

  if (!execute) {
    console.log(
      ['gh', ...args.map((arg) => (arg.includes(' ') ? JSON.stringify(arg) : arg))].join(' '),
    )
    continue
  }

  const result = spawnSync('gh', args, { stdio: 'inherit' })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

if (!execute) {
  console.log(
    '\nDry run only. Re-run with --execute to create issues after labels and milestones exist.',
  )
}
