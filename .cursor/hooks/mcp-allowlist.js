#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
const server = String(input.server || input.serverName || '')
const allowedServers = new Set(['Context7', 'Linear', 'Figma'])

if (allowedServers.has(server)) {
  console.log(JSON.stringify({ decision: 'allow' }))
} else {
  console.log(
    JSON.stringify({
      decision: 'deny',
      user_message: `Blocked MCP server: ${server || 'unknown'}`,
      agent_message: 'MCP server is not in the project allowlist.',
    }),
  )
}
