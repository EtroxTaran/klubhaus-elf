import { createFileRoute } from '@tanstack/react-router'
import { Finanzen } from '@/screens/finanzen/finanzen'

export const Route = createFileRoute('/finanzen')({
  component: Finanzen,
})
