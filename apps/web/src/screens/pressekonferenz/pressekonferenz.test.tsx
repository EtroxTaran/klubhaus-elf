import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Pressekonferenz } from './pressekonferenz'

describe('Pressekonferenz', () => {
  it('opens on the first question with the answer choices', async () => {
    await renderScreen(<Pressekonferenz />)
    expect(screen.getByText('Vor Northbridge')).toBeInTheDocument()
    expect(
      screen.getByText('„Hafenstadt zwei Punkte hinter Riverdale. Was sagen Sie zum Titelrennen?"'),
    ).toBeInTheDocument()
    expect(screen.getByText('Ihre Antwort')).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('reveals the room reaction after an answer is picked', async () => {
    await renderScreen(<Pressekonferenz />)
    fireEvent.click(screen.getByText('„Wir holen Riverdale. Punkt."'))
    expect(screen.getByText('Reaktion im Raum')).toBeInTheDocument()
    expect(screen.getByText(/Eine ungewöhnlich offene Antwort/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Nächste Frage/ })).toBeInTheDocument()
  })

  it('advances to the next question and resets the choice', async () => {
    await renderScreen(<Pressekonferenz />)
    fireEvent.click(screen.getByText('„Wir konzentrieren uns auf das nächste Spiel."'))
    fireEvent.click(screen.getByRole('button', { name: /Nächste Frage/ }))
    expect(screen.getByText('2/3')).toBeInTheDocument()
    expect(
      screen.getByText('„Brody wird mit Riverdale in Verbindung gebracht. Bestätigen Sie das?"'),
    ).toBeInTheDocument()
    expect(screen.getByText('Ihre Antwort')).toBeInTheDocument()
  })
})
