import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from './theme-provider'
import { useTheme } from './use-theme'

function Probe() {
  const { scheme, clubId, club, toggleScheme, setClub } = useTheme()
  return (
    <div>
      <span data-testid="scheme">{scheme}</span>
      <span data-testid="club">{clubId}</span>
      <span data-testid="club-name">{club.name}</span>
      <button type="button" onClick={toggleScheme}>
        toggle
      </button>
      <button type="button" onClick={() => setClub('kaltenbach')}>
        kaltenbach
      </button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-scheme')
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.cssText = ''
})
afterEach(() => {
  localStorage.clear()
})

describe('ThemeProvider', () => {
  it('defaults to light scheme and FC Hafenstadt, applied to <html>', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('scheme')).toHaveTextContent('light')
    expect(screen.getByTestId('club')).toHaveTextContent('hafenstadt')
    expect(screen.getByTestId('club-name')).toHaveTextContent('FC Hafenstadt')
    expect(document.documentElement.dataset.scheme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('A_hafenstadt')
    expect(document.documentElement.style.getPropertyValue('--c-accent')).toBe('#0e3a5f')
    expect(document.documentElement.style.getPropertyValue('--c-accent-2')).toBe('#c8a45a')
  })

  it('honours explicit defaults', () => {
    render(
      <ThemeProvider defaultScheme="dark" defaultClubId="auerbach">
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('scheme')).toHaveTextContent('dark')
    expect(document.documentElement.dataset.scheme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('A_auerbach')
  })

  it('toggles scheme and persists it', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    await user.click(screen.getByText('toggle'))
    expect(screen.getByTestId('scheme')).toHaveTextContent('dark')
    expect(document.documentElement.dataset.scheme).toBe('dark')
    expect(localStorage.getItem('ap.scheme')).toBe('dark')
  })

  it('changes club, re-tints accent and persists it', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    await user.click(screen.getByText('kaltenbach'))
    expect(screen.getByTestId('club')).toHaveTextContent('kaltenbach')
    expect(document.documentElement.dataset.theme).toBe('A_kaltenbach')
    expect(document.documentElement.style.getPropertyValue('--c-accent')).toBe('#4a2a2a')
    expect(localStorage.getItem('ap.club')).toBe('kaltenbach')
  })

  it('restores persisted scheme and club on mount', () => {
    localStorage.setItem('ap.scheme', 'dark')
    localStorage.setItem('ap.club', 'sauveterre')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('scheme')).toHaveTextContent('dark')
    expect(screen.getByTestId('club')).toHaveTextContent('sauveterre')
  })
})

describe('useTheme', () => {
  it('throws when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/)
  })
})
