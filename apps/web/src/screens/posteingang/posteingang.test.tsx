import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderScreen } from '@/test/render-screen'
import { Posteingang } from './posteingang'

describe('Posteingang', () => {
  it('renders the title, unread count and filter chips', async () => {
    await renderScreen(<Posteingang />, '/posteingang')
    expect(screen.getByText('Posteingang')).toBeInTheDocument()
    expect(screen.getByText('5 ungelesen')).toBeInTheDocument()
    expect(screen.getByText('Sponsor')).toBeInTheDocument()
  })

  it('renders every inbox message with the four action pills', async () => {
    await renderScreen(<Posteingang />, '/posteingang')
    expect(screen.getByText('Drei Punkte — oder es wird ungemütlich.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Annehmen' })).toHaveLength(5)
    expect(screen.getAllByRole('button', { name: 'Mehr' })).toHaveLength(5)
  })
})
