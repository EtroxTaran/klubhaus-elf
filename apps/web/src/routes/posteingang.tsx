import { createFileRoute } from '@tanstack/react-router'
import { Posteingang } from '@/screens/posteingang/posteingang'

export const Route = createFileRoute('/posteingang')({
  component: Posteingang,
})
