import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Halbzeit } from './halbzeit'

describe('Halbzeit', () => {
  it('renders as a modal dialog with formation, mentality and a suggested sub', async () => {
    await renderScreen(<Halbzeit />, '/spiel')
    const dialog = screen.getByRole('dialog', { name: 'Was passen wir an?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Formation')).toBeInTheDocument()
    expect(screen.getByText('Ausgeglichen')).toBeInTheDocument()
    expect(screen.getByText('Vorgeschlagener Wechsel')).toBeInTheDocument()
  })

  it('offers keep and apply actions back to the match', async () => {
    await renderScreen(<Halbzeit />, '/spiel')
    expect(screen.getByRole('link', { name: 'Wie bisher' })).toHaveAttribute('href', '/spiel')
    expect(screen.getByRole('link', { name: 'Übernehmen & weiter' })).toBeInTheDocument()
  })
})
