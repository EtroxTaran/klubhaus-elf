import { createFileRoute } from '@tanstack/react-router'
import { LandingHero } from '@/components/landing/landing-hero'

export const Route = createFileRoute('/')({
  component: LandingHero,
})
