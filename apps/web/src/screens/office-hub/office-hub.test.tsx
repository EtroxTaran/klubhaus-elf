import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { OfficeHub } from './office-hub'

describe('OfficeHub', () => {
  it('renders the tabloid quote and next-fixture card', async () => {
    await renderScreen(<OfficeHub />)
    expect(screen.getByText(/Heute klärt sich, ob der Vorstand Geduld kennt/)).toBeInTheDocument()
    expect(screen.getByText('Nächster Termin')).toBeInTheDocument()
    expect(screen.getByText(/Northbridge City/)).toBeInTheDocument()
  })

  it('shows the four hub tiles with flags', async () => {
    await renderScreen(<OfficeHub />)
    expect(screen.getByText('Trainingsplan')).toBeInTheDocument()
    expect(screen.getByText('Vorstandsvertrauen')).toBeInTheDocument()
    expect(screen.getByText('· Druck wächst')).toBeInTheDocument()
  })

  it('links to the inbox and the advance flow', async () => {
    await renderScreen(<OfficeHub />)
    expect(screen.getByRole('link', { name: 'Posteingang öffnen' })).toHaveAttribute(
      'href',
      '/posteingang',
    )
    expect(screen.getByRole('link', { name: /Weiter zum nächsten Termin/ })).toHaveAttribute(
      'href',
      '/anpfiff',
    )
  })
})
