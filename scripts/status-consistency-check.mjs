#!/usr/bin/env node
// Status-consistency check (FMX-143, ADR-0092): the YAML frontmatter `status`
// is the single source of truth; this script verifies the other status
// surfaces never drift from it again. Companion to docs-check.mjs (which
// validates frontmatter presence, wikilinks, supersession link targets);
// this script covers docs-check's known blind spots:
//   1. body `## Status` word must equal frontmatter `status` (section optional)
//   2. bounded-context-map §1 header count must equal its table-row count,
//      with no stale ratify-gate phrases anywhere in the map
//   3. no stale "PR pending Nico's merge" banners outside archive/raw/scribe dirs
//   4. every `status: superseded` note must carry an INLINE `superseded_by:`
//      resolving to an existing note (docs-check's line parser cannot see
//      list-style values, so list-style is also rejected here)
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsRoot = path.join(root, 'docs')
const errors = []

const ignoredPathParts = [
  `${path.sep}.obsidian${path.sep}`,
  `${path.sep}90-Meta${path.sep}templates${path.sep}`,
  `${path.sep}90-Meta${path.sep}github-issue-suite${path.sep}issues${path.sep}`,
  `${path.sep}95-Archive${path.sep}`,
]

// Frozen scribe records + raw research transcripts may quote historical banners.
const staleBannerExemptParts = [
  ...ignoredPathParts,
  `${path.sep}40-Execution${path.sep}`,
  `${path.sep}60-Research${path.sep}raw-perplexity${path.sep}`,
]

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return walk(absolute)
    }
    return absolute.endsWith('.md') ? [absolute] : []
  })
}

function toPosix(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function isIgnored(filePath) {
  return ignoredPathParts.some((part) => filePath.includes(part))
}

function frontmatterStatus(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return null
  const field = match[1].match(/^status:\s*(.*)$/m)
  return field ? field[1].trim() : null
}

function bodyStatusWord(content) {
  const section = content.match(/^##\s+Status\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/m)
  if (!section) return null
  for (const line of section[1].split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed) return trimmed
  }
  return null
}

const files = walk(docsRoot)
const basenames = new Set(files.map((f) => path.basename(f, '.md')))

// 1. body `## Status` ⇄ frontmatter status (decision records only)
const decisionRecord = /(09-Decisions[\\/]ADR-|50-Game-Design[\\/]GD-)\d{4}-/
for (const file of files) {
  if (isIgnored(file) || !decisionRecord.test(file)) continue
  const content = readFileSync(file, 'utf8')
  const fm = frontmatterStatus(content)
  const body = bodyStatusWord(content)
  if (body === null) continue // body status section is optional narrative
  if (!/^[a-z]+$/.test(body)) {
    errors.push(`${toPosix(file)}: body "## Status" first line must be the bare status word (found "${body.slice(0, 60)}")`)
  } else if (body !== fm) {
    errors.push(`${toPosix(file)}: body status "${body}" diverges from frontmatter status "${fm}"`)
  }
}

// 2. bounded-context-map: header count ⇄ table rows, no stale ratify-gate prose
const mapPath = path.join(docsRoot, '10-Architecture', 'bounded-context-map.md')
if (existsSync(mapPath)) {
  const map = readFileSync(mapPath, 'utf8')
  const numberWords = {
    twenty: 20, 'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23,
    'twenty-four': 24, 'twenty-five': 25, 'twenty-six': 26,
    'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, thirty: 30,
  }
  const header = map.match(/^## 1\. ([A-Za-z-]+) bounded contexts/m)
  const section = map.match(/^## 1\.[\s\S]*?(?=^### |^## [^1])/m)
  if (header && section) {
    const declared = numberWords[header[1].toLowerCase()]
    const rows = section[0]
      .split(/\r?\n/)
      .filter((l) => /^\| \*\*/.test(l)).length
    if (declared !== undefined && declared !== rows) {
      errors.push(`bounded-context-map.md: §1 header says ${header[1]} (${declared}) but the table has ${rows} context rows`)
    }
  }
  for (const phrase of ['not added to the ratified context table', 'depending on counting order', 'not accepted yet', 'until Nico accepts']) {
    if (map.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`bounded-context-map.md: stale ratify-gate phrase "${phrase}"`)
    }
  }
}

// 3. stale merged-PR banners
for (const file of files) {
  if (staleBannerExemptParts.some((part) => file.includes(part))) continue
  const content = readFileSync(file, 'utf8')
  if (content.includes("PR pending Nico's merge")) {
    errors.push(`${toPosix(file)}: stale "PR pending Nico's merge" banner — the ratification PRs are merged`)
  }
}

// 4. superseded ⇒ resolvable inline superseded_by
for (const file of files) {
  if (isIgnored(file)) continue
  const content = readFileSync(file, 'utf8')
  if (frontmatterStatus(content) !== 'superseded') continue
  const fmBlock = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  const inline = fmBlock?.[1].match(/^superseded_by:\s*(.+)$/m)
  if (!inline) {
    errors.push(`${toPosix(file)}: status superseded but no INLINE superseded_by (list-style values are invisible to docs-check)`)
    continue
  }
  const target = inline[1].replace(/\[\[|\]\]/g, '').split('|')[0].trim()
  const targetBase = path.basename(target, '.md')
  if (!basenames.has(targetBase)) {
    errors.push(`${toPosix(file)}: superseded_by target "${targetBase}" does not exist`)
  }
}

if (errors.length > 0) {
  console.error(`status-consistency-check failed with ${errors.length} issue(s):`)
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('status-consistency-check passed')
