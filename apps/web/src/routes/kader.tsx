import { createFileRoute } from '@tanstack/react-router'
import { Kader } from '@/screens/kader/kader'

export const Route = createFileRoute('/kader')({
  component: Kader,
})
