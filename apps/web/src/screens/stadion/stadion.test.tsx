import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Stadion } from './stadion'

describe('Stadion', () => {
  it('opens on the facility tab with the plot and capacity', async () => {
    await renderScreen(<Stadion />, '/stadion')
    expect(screen.getByText('Stadionausbau')).toBeInTheDocument()
    expect(screen.getByText('27.412')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Stadionausbau' })).toBeInTheDocument()
  })

  it('switches to the stands tab and shows side-views per stand', async () => {
    const user = userEvent.setup()
    await renderScreen(<Stadion />, '/stadion')
    await user.click(screen.getByRole('button', { name: 'Tribünen' }))
    expect(screen.getByRole('img', { name: 'Nordtribüne Seitenansicht' })).toBeInTheDocument()
    expect(screen.getAllByText('Dach komplett').length).toBeGreaterThanOrEqual(1)
  })

  it('switches to the stadium-type gallery', async () => {
    const user = userEvent.setup()
    await renderScreen(<Stadion />, '/stadion')
    await user.click(screen.getByRole('button', { name: 'Stadiontyp' }))
    expect(screen.getByRole('img', { name: 'Stadiontyp Geschlossene Arena' })).toBeInTheDocument()
  })

  it('renders the pitch and catering tabs', async () => {
    const user = userEvent.setup()
    await renderScreen(<Stadion />, '/stadion')
    await user.click(screen.getByRole('button', { name: 'Rasen & Licht' }))
    expect(screen.getByText(/Rasenheizung/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Gastro' }))
    expect(screen.getByText(/Vereinsrestaurant/)).toBeInTheDocument()
  })
})
