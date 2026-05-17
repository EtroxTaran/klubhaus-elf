import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Identity } from './identity'

describe('Identity', () => {
  it('renders the crest editor by default', async () => {
    await renderScreen(<Identity />, '/identity')
    expect(screen.getByText('Klub-Identität')).toBeInTheDocument()
    expect(screen.getByText('Schildform')).toBeInTheDocument()
    expect(screen.getByText('Wappensymbol')).toBeInTheDocument()
    expect(screen.getByText('Auf Klub anwenden')).toBeInTheDocument()
  })

  it('switches to the jersey editor and back', async () => {
    await renderScreen(<Identity />, '/identity')
    fireEvent.click(screen.getByRole('button', { name: 'Trikot' }))
    expect(screen.getByText('Trikotmuster')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Wappen' }))
    expect(screen.getByText('Schildform')).toBeInTheDocument()
  })

  it('updates the shape selection', async () => {
    await renderScreen(<Identity />, '/identity')
    const gonfalon = screen.getByRole('button', { name: 'Gonfalon' })
    fireEvent.click(gonfalon)
    expect(gonfalon).toHaveAttribute('aria-pressed', 'true')
  })

  it('selects a charge and both tinctures', async () => {
    await renderScreen(<Identity />, '/identity')
    const lion = screen.getByRole('button', { name: 'Löwe' })
    fireEvent.click(lion)
    expect(lion).toHaveAttribute('aria-pressed', 'true')
    // tincture A grid + tincture B grid both expose a Weinrot swatch
    const [swatchA, swatchB] = screen.getAllByRole('button', { name: 'Weinrot' })
    if (!swatchA || !swatchB) throw new Error('expected two Weinrot swatches')
    fireEvent.click(swatchA)
    fireEvent.click(swatchB)
    expect(swatchA).toHaveAttribute('aria-pressed', 'true')
    expect(swatchB).toHaveAttribute('aria-pressed', 'true')
  })

  it('edits the motto and caps it at 32 characters', async () => {
    await renderScreen(<Identity />, '/identity')
    const motto = screen.getByLabelText('Motto') as HTMLInputElement
    fireEvent.change(motto, { target: { value: 'x'.repeat(40) } })
    expect(motto.value).toHaveLength(32)
  })

  it('picks a jersey pattern and toggles both detail switches', async () => {
    await renderScreen(<Identity />, '/identity')
    fireEvent.click(screen.getByRole('button', { name: 'Trikot' }))

    const chevron = screen.getByRole('button', { name: 'Spitze' })
    fireEvent.click(chevron)
    expect(chevron).toHaveAttribute('aria-pressed', 'true')

    const sleeve = screen.getByRole('button', { name: /Ärmel-Akzent/ })
    expect(sleeve).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(sleeve)
    expect(sleeve).toHaveAttribute('aria-pressed', 'false')

    const back = screen.getByRole('button', { name: /Rückseite zeigen/ })
    fireEvent.click(back)
    expect(back).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Rückseite')).toBeInTheDocument()
  })
})
