// Quality-profile predicate (ADR-0026 §9).

import type { MatchQualityProfile } from './types'

const RENDERABLE: ReadonlySet<MatchQualityProfile> = new Set([
  'competitive-full',
  'interactive-standard',
])

/**
 * Only `competitive-full` and `interactive-standard` produce renderable
 * frames at MVP. `background-detailed` and `background-fast` are
 * summary-only / no-spatial.
 */
export function isRenderableProfile(p: MatchQualityProfile): boolean {
  return RENDERABLE.has(p)
}
