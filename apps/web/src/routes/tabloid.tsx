import { createFileRoute } from '@tanstack/react-router'
import type { TabloidTone } from '@/screens/fixtures'
import { Tabloid } from '@/screens/tabloid/tabloid'

export interface TabloidSearch {
  tone?: TabloidTone
}

export const Route = createFileRoute('/tabloid')({
  validateSearch: (search: Record<string, unknown>): TabloidSearch =>
    search.tone === 'storm' ? { tone: 'storm' } : {},
  component: TabloidRoute,
})

function TabloidRoute() {
  const { tone } = Route.useSearch()
  return <Tabloid tone={tone ?? 'triumph'} />
}
