import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import type { ClubId } from '@/types/club'
import { CLUB_REGISTRY, clubById, themeKeyFor } from './club-registry'
import { type Scheme, ThemeContext } from './theme-context'

const SCHEME_KEY = 'ap.scheme'
const CLUB_KEY = 'ap.club'

function isScheme(value: string | null): value is Scheme {
  return value === 'light' || value === 'dark'
}

function isClubId(value: string | null): value is ClubId {
  return value !== null && value in CLUB_REGISTRY
}

function readStored(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode / quota) — non-fatal */
  }
}

export interface ThemeProviderProps {
  children: ReactNode
  defaultScheme?: Scheme
  defaultClubId?: ClubId
}

export function ThemeProvider({
  children,
  defaultScheme = 'light',
  defaultClubId = 'hafenstadt',
}: ThemeProviderProps) {
  const [scheme, setSchemeState] = useState<Scheme>(() => {
    const stored = readStored(SCHEME_KEY)
    return isScheme(stored) ? stored : defaultScheme
  })
  const [clubId, setClubIdState] = useState<ClubId>(() => {
    const stored = readStored(CLUB_KEY)
    return isClubId(stored) ? stored : defaultClubId
  })

  const club = useMemo(() => clubById(clubId), [clubId])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.scheme = scheme
    root.dataset.theme = themeKeyFor(clubId)
    root.style.setProperty('--c-accent', club.primary)
    root.style.setProperty('--c-accent-2', club.secondary)
  }, [scheme, clubId, club])

  const setScheme = useCallback((next: Scheme) => {
    setSchemeState(next)
    writeStored(SCHEME_KEY, next)
  }, [])

  const toggleScheme = useCallback(() => {
    setSchemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      writeStored(SCHEME_KEY, next)
      return next
    })
  }, [])

  const setClub = useCallback((next: ClubId) => {
    setClubIdState(next)
    writeStored(CLUB_KEY, next)
  }, [])

  const value = useMemo(
    () => ({ scheme, clubId, club, setScheme, toggleScheme, setClub }),
    [scheme, clubId, club, setScheme, toggleScheme, setClub],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
