import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Karriere } from './karriere'

describe('Karriere', () => {
  it('lists save slots with storage and an empty slot', async () => {
    await renderScreen(<Karriere />, '/karriere')
    expect(screen.getByText('Meine Karrieren')).toBeInTheDocument()
    expect(screen.getByText('Offline gespeichert · 77 MB von 250 MB belegt')).toBeInTheDocument()
    expect(screen.getByText('FC Hafenstadt — Saison 3')).toBeInTheDocument()
    expect(screen.getByText('Neue Karriere starten')).toBeInTheDocument()
  })

  it('exposes save actions and the iOS install banner', async () => {
    await renderScreen(<Karriere />, '/karriere')
    expect(screen.getAllByRole('button', { name: 'Fortsetzen' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Löschen' })).toHaveLength(2)
    expect(screen.getByText('Auf Startbildschirm hinzufügen')).toBeInTheDocument()
  })
})
