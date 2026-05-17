// Build-time frontmatter sanitizer for the Quartz docs build.
//
// The Obsidian vault writes related-note links the Obsidian way, e.g.
//   related: [[A]], [[../x/B]], [[C#h|alias]]
// or as an unquoted block list:
//   related:
//     - [[A]]
//     - [[B]]
// Both are INVALID YAML — Quartz's strict js-yaml parser aborts the whole
// build on the first one ("bad indentation of a mapping entry"). We can't
// realistically hand-fix ~165 notes and authors keep writing Obsidian style,
// so normalise frontmatter to valid YAML at build time: every `[[link]]`
// becomes a double-quoted string, key/value forms become block lists.
//
// Usage: node sanitize-frontmatter.mjs <contentDir>

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2]
if (!root) {
  console.error('sanitize-frontmatter: missing <contentDir> argument')
  process.exit(1)
}

const WIKILINK = /\[\[[^\]]+\]\]/g

function quote(token) {
  // YAML double-quoted scalar; wikilink targets never contain `"` or `\`.
  return `"${token.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/** Rewrite the frontmatter block (between the first two `---` fences). */
function sanitize(text) {
  if (!text.startsWith('---\n') && !text.startsWith('---\r\n')) return text
  const nl = text.indexOf('\n') + 1
  const end = text.indexOf('\n---', nl)
  if (end === -1) return text
  const fmEnd = text.indexOf('\n', end + 1)
  const head = text.slice(0, nl) // opening ---
  const body = text.slice(fmEnd + 1) // after closing ---
  const fm = text.slice(nl, end + 1) // frontmatter lines (no fences)

  const lines = fm.split('\n')
  if (lines.length && lines[lines.length - 1] === '') lines.pop()
  const out = []
  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '')
    // key: <value containing [[...]]>
    const kv = line.match(/^(\s*)([A-Za-z0-9_-]+):[ \t]*(\S.*)$/)
    if (kv && kv[3].includes('[[')) {
      const [, indent, key, value] = kv
      const tokens = value.match(WIKILINK)
      if (tokens) {
        out.push(`${indent}${key}:`)
        for (const t of tokens) out.push(`${indent}  - ${quote(t)}`)
        continue
      }
      // contains [[ but no full token — quote the whole value defensively
      out.push(`${indent}${key}: ${quote(value)}`)
      continue
    }
    // unquoted block-list item:  - [[x]]
    const li = line.match(/^(\s*-\s*)(\[\[[^\]]+\]\].*)$/)
    if (li) {
      const tok = li[2].match(WIKILINK)
      if (tok) {
        out.push(`${li[1]}${quote(tok[0])}`)
        continue
      }
    }
    out.push(rawLine)
  }
  const closing = text.slice(end + 1, fmEnd + 1) // the `---\n` fence line
  return head + out.join('\n') + (out.length ? '\n' : '') + closing + body
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p)
    else if (name.endsWith('.md')) {
      const before = readFileSync(p, 'utf8')
      const after = sanitize(before)
      if (after !== before) writeFileSync(p, after)
    }
  }
}

walk(root)
console.log(`sanitize-frontmatter: normalised wikilink frontmatter under ${root}`)
