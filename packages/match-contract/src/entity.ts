// Entity-id helpers (ADR-0026 §6).

export const ballEntityId = 'ball' as const

export function entityId(side: 'home' | 'away', playerId: number): string {
  return `${side}-${playerId}`
}

export type ParsedEntityId =
  | { readonly kind: 'ball' }
  | { readonly kind: 'home' | 'away'; readonly playerId: number }

/**
 * Parse an entity id back into its parts. Returns `null` for malformed input
 * (callers can treat that as an unknown entity rather than crashing).
 */
export function parseEntityId(id: string): ParsedEntityId | null {
  if (id === ballEntityId) return { kind: 'ball' }
  const dash = id.indexOf('-')
  if (dash < 0) return null
  const side = id.slice(0, dash)
  const rest = id.slice(dash + 1)
  if (side !== 'home' && side !== 'away') return null
  if (rest.length === 0 || !/^\d+$/.test(rest)) return null
  const playerId = Number.parseInt(rest, 10)
  if (!Number.isInteger(playerId)) return null
  return { kind: side, playerId }
}
