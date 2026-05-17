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

  it('keeps the next-fixture card when kick-off is far off', async () => {
    await renderScreen(<OfficeHub kickoffSeconds={3 * 60 * 60} />)
    expect(screen.getByText('Nächster Termin')).toBeInTheDocument()
    expect(screen.queryByText('Anpfiff in')).toBeNull()
  })

  it('swaps to the kick-off countdown under 30 minutes (T1.5)', async () => {
    await renderScreen(<OfficeHub kickoffSeconds={23 * 60 + 14} />)
    expect(screen.queryByText('Nächster Termin')).toBeNull()
    expect(screen.getByText(/Anpfiff in/)).toBeInTheDocument()
    expect(screen.getByText('23:14')).toBeInTheDocument()
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
