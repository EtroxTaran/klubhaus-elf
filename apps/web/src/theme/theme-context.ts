import { createContext } from 'react'
import type { Club, ClubId } from '@/types/club'

export type Scheme = 'light' | 'dark'

export interface ThemeContextValue {
  scheme: Scheme
  clubId: ClubId
  club: Club
  setScheme: (scheme: Scheme) => void
  toggleScheme: () => void
  setClub: (clubId: ClubId) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
