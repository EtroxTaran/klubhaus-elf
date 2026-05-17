import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { DesktopShell } from './desktop-shell'

describe('DesktopShell', () => {
  it('renders children in a main landmark with the office chrome', async () => {
    await renderScreen(
      <DesktopShell>
        <p>Bildschirminhalt</p>
      </DesktopShell>,
    )
    expect(within(screen.getByRole('main')).getByText('Bildschirminhalt')).toBeInTheDocument()
    expect(screen.getByText('Weiter zum nächsten Termin')).toBeInTheDocument()
    expect(screen.getByText('Aurelia Premier · Saison 2026/27')).toBeInTheDocument()
  })

  it('exposes the full navigation rail with a badge', async () => {
    await renderScreen(<DesktopShell>x</DesktopShell>)
    const rail = screen.getByRole('navigation', { name: 'Hauptnavigation' })
    for (const label of [
      'Büro',
      'Posteingang',
      'Kader',
      'Taktik',
      'Training',
      'Medizin',
      'Scouting',
      'Transferbüro',
      'Finanzen',
      'Stadion',
      'Wettbewerbe',
      'Statistik',
      'Stab',
      'Einstellungen',
    ]) {
      expect(within(rail).getByText(label)).toBeInTheDocument()
    }
    expect(within(rail).getByText('5')).toBeInTheDocument()
  })

  it('marks the active section and defaults the breadcrumb to it', async () => {
    await renderScreen(<DesktopShell section="squad">x</DesktopShell>)
    const rail = screen.getByRole('navigation', { name: 'Hauptnavigation' })
    const active = within(rail).getByText('Kader').closest('[aria-current]')
    expect(active).toHaveAttribute('aria-current', 'page')
    expect(active).toHaveClass('text-accent')
    // breadcrumb falls back to the active section label
    expect(screen.getAllByText('Kader').length).toBeGreaterThan(1)
  })

  it('uses an explicit breadcrumb and an optional right rail', async () => {
    await renderScreen(
      <DesktopShell section="finance" breadcrumb="Finanzen · Bilanz" rightRail={<p>Kontext</p>}>
        <p>Hauptbereich</p>
      </DesktopShell>,
    )
    expect(screen.getByText('Finanzen · Bilanz')).toBeInTheDocument()
    expect(screen.getByText('Kontext')).toBeInTheDocument()
  })
})
