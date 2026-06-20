#!/usr/bin/env node
// Status-consistency check (FMX-143, ADR-0092): the YAML frontmatter `status`
// is the single source of truth; this script verifies the other status
// surfaces never drift from it again. Companion to docs-check.mjs (which
// validates frontmatter presence, wikilinks, supersession link targets);
// this script covers docs-check's known blind spots:
//   1. body `## Status` word must equal frontmatter `status` (section optional)
//   2. bounded-context-map §1 header count must equal its table-row count,
//      with no stale ratify-gate phrases anywhere in the map — and the check
//      FAILS LOUD if the header/section cannot be parsed (a drift guard that
//      silently no-ops at the edges is worse than none)
//   3. no stale "PR pending …" banners outside archive/raw/scribe dirs
//   4. every `status: superseded` note must carry an INLINE `superseded_by:`
//      resolving to existing note(s) (docs-check's line parser cannot see
//      list-style values, so list-style is also rejected here)
//   5. every `context:` value must be one of the 28 known bounded-context
//      slugs (ADR-0134) — guards the NotebookLM-export membership SSOT against
//      typos / slugs that name no bundle
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsRoot = path.join(root, 'docs')
const errors = []

// The 28 bounded-context bundle slugs (ADR-0089 / ADR-0134). Keep in sync with
// the DOMAINS array in scripts/export-notebooklm.mjs.
const KNOWN_CONTEXTS = new Set([
  'identity-access', 'league-orchestration', 'club-management-economy', 'squad-player',
  'training', 'transfer', 'match', 'watch-party', 'notification', 'manager-legacy',
  'staff-operations', 'tactics', 'regulations-compliance', 'rivalry', 'stadium-operations',
  'audience-atmosphere', 'commercial-portfolio', 'offline-sync', 'audit-security',
  'ai-world-simulation', 'narrative-dialogue', 'youth-academy', 'statistics-analytics',
  'people-persona-skills', 'scouting', 'environment-climate', 'media-ecology', 'community-overlay',
])

// Mirrors docs-check.mjs — keep the two lists in sync when adding frozen dirs.
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

// Mirrors docs-check.mjs walk/toPosix.
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

function frontmatterStatus(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return { block: null, status: null }
  const field = match[1].match(/^status:\s*(.*)$/m)
  return { block: match[1], status: field ? field[1].trim() : null }
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
const decisionRecord = /(09-Decisions[\\/]ADR-|50-Game-Design[\\/]GD-)\d{4}-/

// Single pass: checks 1, 3 and 4 are per-file rules with per-check scoping.
for (const file of files) {
  const ignored = ignoredPathParts.some((part) => file.includes(part))
  const bannerExempt = staleBannerExemptParts.some((part) => file.includes(part))
  if (ignored && bannerExempt) continue
  const content = readFileSync(file, 'utf8')
  const { block, status } = frontmatterStatus(content)

  // 1. body `## Status` ⇄ frontmatter status (decision records only).
  //    A missing frontmatter status is docs-check's finding, not a divergence.
  if (!ignored && decisionRecord.test(file) && status !== null) {
    const body = bodyStatusWord(content)
    if (body !== null) {
      if (!/^[a-z][a-z-]*$/.test(body)) {
        errors.push(`${toPosix(file)}: body "## Status" first line must be the bare status word (found "${body.slice(0, 60)}")`)
      } else if (body !== status) {
        errors.push(`${toPosix(file)}: body status "${body}" diverges from frontmatter status "${status}"`)
      }
    }
  }

  // 3. stale merged-PR banners ("PR pending Nico's merge" and variants).
  if (!bannerExempt && /PR pending/i.test(content)) {
    errors.push(`${toPosix(file)}: stale "PR pending …" banner — record merged state (or move the quote to a scribe/archive note)`)
  }

  // 4. superseded ⇒ resolvable inline superseded_by (one or more, comma-separated).
  if (!ignored && status === 'superseded') {
    const inline = block?.match(/^superseded_by:\s*(.+)$/m)
    if (!inline) {
      errors.push(`${toPosix(file)}: status superseded but no INLINE superseded_by (list-style values are invisible to docs-check)`)
    } else {
      for (const part of inline[1].split(',')) {
        const target = part.replace(/\[\[|\]\]/g, '').split('|')[0].trim()
        if (!target) continue
        if (!basenames.has(path.basename(target, '.md'))) {
          errors.push(`${toPosix(file)}: superseded_by target "${target}" does not exist`)
        }
      }
    }
  }

  // 5. context: values must be known bounded-context slugs (ADR-0134).
  if (!ignored && block) {
    const ctx = block.match(/^context:\s*(.+)$/m)
    if (ctx) {
      const values = ctx[1]
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, '').toLowerCase())
        .filter(Boolean)
      for (const v of values) {
        if (!KNOWN_CONTEXTS.has(v)) {
          errors.push(`${toPosix(file)}: unknown context "${v}" — must be one of the 28 bounded-context slugs (ADR-0134)`)
        }
      }
    }
  }
}

// 2. bounded-context-map: header count ⇄ table rows, no stale ratify-gate prose.
const mapPath = path.join(docsRoot, '10-Architecture', 'bounded-context-map.md')
if (!existsSync(mapPath)) {
  errors.push('bounded-context-map.md: file not found — §1 count check cannot run')
} else {
  const map = readFileSync(mapPath, 'utf8')
  const numberWords = {
    nineteen: 19, twenty: 20, 'twenty-one': 21, 'twenty-two': 22,
    'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25, 'twenty-six': 26,
    'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29, thirty: 30,
    'thirty-one': 31, 'thirty-two': 32,
  }
  const header = map.match(/^## 1\. (\S+) bounded contexts/m)
  if (!header) {
    errors.push('bounded-context-map.md: could not parse the "## 1. <count> bounded contexts" header — fix the header or update status-consistency-check.mjs')
  } else {
    const word = header[1].toLowerCase()
    const declared = numberWords[word] ?? (Number.parseInt(word, 10) || undefined)
    if (declared === undefined) {
      errors.push(`bounded-context-map.md: §1 header count word "${header[1]}" is not recognized — extend numberWords in status-consistency-check.mjs`)
    } else {
      const afterHeader = map.slice(map.indexOf(header[0]))
      const nextHeading = afterHeader.search(/\r?\n##[#]? (?!1\. )/)
      const section = nextHeading === -1 ? afterHeader : afterHeader.slice(0, nextHeading)
      const rows = section.split(/\r?\n/).filter((l) => /^\| \*\*/.test(l)).length
      if (rows === 0) {
        errors.push('bounded-context-map.md: found no "| **Context**" table rows under §1 — table moved? Update status-consistency-check.mjs')
      } else if (declared !== rows) {
        errors.push(`bounded-context-map.md: §1 header says ${header[1]} (${declared}) but the table has ${rows} context rows`)
      }
    }
  }
  for (const phrase of ['not added to the ratified context table', 'depending on counting order', 'not accepted yet', 'until Nico accepts']) {
    if (map.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`bounded-context-map.md: stale ratify-gate phrase "${phrase}"`)
    }
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
