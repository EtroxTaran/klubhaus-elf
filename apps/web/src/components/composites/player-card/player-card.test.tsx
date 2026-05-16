import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import type { Player } from '@/types/player'
import { isContractSoon, PlayerCard } from './player-card'

const base: Player = {
  n: 'Marek Brody',
  pos: 'OM',
  age: 26,
  str: 8,
  tal: 3,
  form: '8,4',
  contract: '06/27',
  nat: 'DE',
  shirt: 10,
}

describe('isContractSoon', () => {
  it('flags contracts ending in the next summer window', () => {
    expect(isContractSoon('06/26')).toBe(true)
    expect(isContractSoon('06/27')).toBe(false)
  })
})

describe('PlayerCard', () => {
  it('shows name, shirt, position and German age/form copy', () => {
    renderWithProviders(<PlayerCard player={base} />)
    expect(screen.getByText('Marek Brody')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('OM')).toBeInTheDocument()
    expect(screen.getByText('26 J.')).toBeInTheDocument()
    expect(screen.getByText('Form 8,4')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Stärke 8 von 10' })).toBeInTheDocument()
  })

  it('marks an expiring contract with a glyph + colour', () => {
    renderWithProviders(<PlayerCard player={{ ...base, contract: '06/26' }} />)
    expect(screen.getByLabelText('Vertrag läuft aus')).toBeInTheDocument()
  })

  it('omits the expiry marker for a long contract', () => {
    renderWithProviders(<PlayerCard player={base} />)
    expect(screen.queryByLabelText('Vertrag läuft aus')).toBeNull()
  })
})
