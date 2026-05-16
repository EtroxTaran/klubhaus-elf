import { createFileRoute } from '@tanstack/react-router'
import { Spiel } from '@/screens/spiel/spiel'

export interface SpielSearch {
  halbzeit?: number
}

export const Route = createFileRoute('/spiel')({
  validateSearch: (search: Record<string, unknown>): SpielSearch => {
    const raw = Number(search.halbzeit)
    return raw === 1 ? { halbzeit: 1 } : {}
  },
  component: SpielRoute,
})

function SpielRoute() {
  const { halbzeit } = Route.useSearch()
  return <Spiel halftimeOpen={halbzeit === 1} />
}
