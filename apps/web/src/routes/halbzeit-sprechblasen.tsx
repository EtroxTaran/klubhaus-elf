import { createFileRoute } from '@tanstack/react-router'
import { HalbzeitBubbles } from '@/screens/halbzeit-bubbles/halbzeit-bubbles'

export const Route = createFileRoute('/halbzeit-sprechblasen')({
  component: HalbzeitBubbles,
})
