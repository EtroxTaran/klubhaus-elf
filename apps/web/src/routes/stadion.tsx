import { createFileRoute } from '@tanstack/react-router'
import { Stadion } from '@/screens/stadion/stadion'

export const Route = createFileRoute('/stadion')({
  component: Stadion,
})
