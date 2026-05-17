import type { Decorator } from '@storybook/react'
import type { Scheme } from '@/theme/theme-context'
import { ThemeProvider } from '@/theme/theme-provider'
import type { ClubId } from '@/types/club'

// ThemeProvider seeds its state from localStorage (falling back to the
// defaults). Write the toolbar selection there so the toolbar is always
// authoritative, then remount via `key` so the whole catalogue retints.
export const withTheme: Decorator = (Story, context) => {
  const scheme = (context.globals.scheme ?? 'light') as Scheme
  const clubId = (context.globals.club ?? 'hafenstadt') as ClubId

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('ap.scheme', scheme)
    window.localStorage.setItem('ap.club', clubId)
  }

  return (
    <ThemeProvider key={`${scheme}:${clubId}`} defaultScheme={scheme} defaultClubId={clubId}>
      <Story />
    </ThemeProvider>
  )
}
