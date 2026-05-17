import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { HalbzeitBubbles } from './halbzeit-bubbles'

describe('HalbzeitBubbles', () => {
  it('shows the dressing-room talk with all three voices', async () => {
    await renderScreen(<HalbzeitBubbles />)
    expect(screen.getByText('Was hörst du?')).toBeInTheDocument()
    expect(screen.getByText('2:48 Pause')).toBeInTheDocument()
    expect(screen.getByText('Marek Brody')).toBeInTheDocument()
    expect(screen.getByText('Aleksy Wieser')).toBeInTheDocument()
    expect(screen.getByText('Sven Holtmann')).toBeInTheDocument()
  })

  it('lets the manager pick one reaction per voice', async () => {
    await renderScreen(<HalbzeitBubbles />)
    const choice = screen.getByRole('button', { name: /Du bist mein Kapitän heute/ })
    expect(choice).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(choice)
    expect(choice).toHaveAttribute('aria-pressed', 'true')
  })

  it('offers the half-time exits', async () => {
    await renderScreen(<HalbzeitBubbles />)
    expect(screen.getByRole('button', { name: 'Mehr Taktik' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anpfiff der 2. Hälfte' })).toBeInTheDocument()
  })
})
