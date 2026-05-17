import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { TransferNeg } from './transfer-neg'

describe('TransferNeg', () => {
  it('shows the target, agent stress and the negotiation history', async () => {
    await renderScreen(<TransferNeg />)
    expect(screen.getAllByText('Élise Vannier').length).toBeGreaterThan(0)
    expect(screen.getByText(/Berater-Stress · angespannt/)).toBeInTheDocument()
    expect(screen.getByText('45 %')).toBeInTheDocument()
    expect(screen.getByText(/Wir bieten 1,8 plus Bonus/)).toBeInTheDocument()
    expect(screen.getByText('Verlauf · 4 Schritte')).toBeInTheDocument()
  })

  it('updates the total when a lever changes', async () => {
    await renderScreen(<TransferNeg />)
    const fee = screen.getByRole('slider', { name: 'Ablöse' })
    fireEvent.change(fee, { target: { value: '3000000' } })
    expect(screen.getByRole('button', { name: /Senden · 3,4 Mio\. €/ })).toBeInTheDocument()
  })

  it('offers the give-up exit', async () => {
    await renderScreen(<TransferNeg />)
    expect(screen.getByRole('button', { name: 'Aufgeben' })).toBeInTheDocument()
  })
})
