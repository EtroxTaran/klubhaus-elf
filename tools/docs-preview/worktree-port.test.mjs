import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const preview = readFileSync(new URL('./preview.mjs', import.meta.url), 'utf8')

test('Dev-Runtime folgt dem gemanagten Worktree-Portblock', () => {
  assert.match(preview, /const port = process\.env\.PORT_BASE \?\? '8080'/)
  assert.match(preview, /const wsPort = process\.env\.PORT_BASE \? String\(Number\(port\) \+ 1\) : '3001'/)
  assert.match(preview, /'--port', port/)
  assert.match(preview, /'--wsPort', wsPort/)
  assert.match(preview, /localhost:\$\{port\}/)
})
