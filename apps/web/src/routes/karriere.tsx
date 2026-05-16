import { createFileRoute } from '@tanstack/react-router'
import { Karriere } from '@/screens/karriere/karriere'

export const Route = createFileRoute('/karriere')({
  component: Karriere,
})
