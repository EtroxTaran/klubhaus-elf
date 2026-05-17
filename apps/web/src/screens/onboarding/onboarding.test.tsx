import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Onboarding } from './onboarding'

describe('Onboarding', () => {
  it('step 1 — country & league with progress', async () => {
    await renderScreen(<Onboarding step={1} />, '/onboarding')
    expect(screen.getByText('Schritt 1 von 3')).toBeInTheDocument()
    expect(screen.getByText('Deutschland')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Weiter/ })).toHaveAttribute(
      'href',
      expect.stringContaining('/onboarding'),
    )
  })

  it('step 2 — six procedural club crests', async () => {
    await renderScreen(<Onboarding step={2} />, '/onboarding')
    expect(screen.getByText('Schritt 2 von 3')).toBeInTheDocument()
    expect(screen.getByText('Olympique Sauveterre')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'FC Hafenstadt' })).toBeInTheDocument()
  })

  it('step 3 — manager chip and start', async () => {
    await renderScreen(<Onboarding step={3} />, '/onboarding')
    expect(screen.getByText('Schritt 3 von 3')).toBeInTheDocument()
    expect(screen.getByText('Julia Lindquist')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Karriere starten/ })).toHaveAttribute('href', '/')
  })
})
