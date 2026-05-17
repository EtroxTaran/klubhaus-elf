import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Tabloid } from './tabloid'

describe('Tabloid', () => {
  it('renders the triumph edition by default with masthead, headline and facts', async () => {
    await renderScreen(<Tabloid />)
    expect(screen.getByText('DER HAFEN-BOTE')).toBeInTheDocument()
    expect(screen.getByText('„Brody schießt sich in die Herzen."')).toBeInTheDocument()
    expect(screen.getByText('Auf einen Blick')).toBeInTheDocument()
    expect(screen.getByText('Northbridge 1 : 2 Hafenstadt')).toBeInTheDocument()
    expect(screen.getByText('· POKAL-VIERTELFINALE ·')).toBeInTheDocument()
  })

  it('renders the storm edition when toned for crisis', async () => {
    await renderScreen(<Tabloid tone="storm" />)
    expect(screen.getByText('· KRISE IM VORSTAND ·')).toBeInTheDocument()
    expect(screen.getByText('„Drei Wochen, dann fällt die Geduld."')).toBeInTheDocument()
    expect(screen.getByText('— Julia Lindquist, Cheftrainerin')).toBeInTheDocument()
  })

  it('offers a close affordance back to the hub', async () => {
    await renderScreen(<Tabloid />)
    expect(screen.getByRole('link', { name: 'Schließen' })).toHaveAttribute('href', '/')
  })
})
