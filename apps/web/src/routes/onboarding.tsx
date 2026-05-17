import { createFileRoute } from '@tanstack/react-router'
import { Onboarding, type OnboardingStep } from '@/screens/onboarding/onboarding'

export interface OnboardingSearch {
  step: OnboardingStep
}

export const Route = createFileRoute('/onboarding')({
  validateSearch: (search: Record<string, unknown>): OnboardingSearch => {
    const step = Number(search.step)
    return { step: step === 2 ? 2 : step === 3 ? 3 : 1 }
  },
  component: OnboardingRoute,
})

function OnboardingRoute() {
  const { step } = Route.useSearch()
  return <Onboarding step={step} />
}
