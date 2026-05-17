import { createFileRoute } from '@tanstack/react-router'
import { Pressekonferenz } from '@/screens/pressekonferenz/pressekonferenz'

export const Route = createFileRoute('/pressekonferenz')({
  component: Pressekonferenz,
})
