import { createFileRoute } from '@tanstack/react-router'
import { Identity } from '@/screens/identity/identity'

export const Route = createFileRoute('/identity')({
  component: Identity,
})
