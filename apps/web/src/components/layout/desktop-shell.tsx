import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  CloudOff,
  HeartPulse,
  Inbox,
  Landmark,
  Search,
  Settings,
  TrendingUp,
  Trophy,
  Users,
  UsersRound,
  Wallet,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { cn } from '@/lib/utils'
import { useTheme } from '@/theme/use-theme'

export type DesktopSection =
  | 'hub'
  | 'inbox'
  | 'squad'
  | 'tactics'
  | 'training'
  | 'medical'
  | 'scouting'
  | 'transfers'
  | 'finance'
  | 'stadium'
  | 'competitions'
  | 'stats'
  | 'staff'
  | 'settings'

const NAV: Array<{ id: DesktopSection; icon: ReactNode; badge?: number }> = [
  { id: 'hub', icon: <Building2 size={20} /> },
  { id: 'inbox', icon: <Inbox size={20} />, badge: 5 },
  { id: 'squad', icon: <Users size={20} /> },
  { id: 'tactics', icon: <ClipboardList size={20} /> },
  { id: 'training', icon: <CalendarDays size={20} /> },
  { id: 'medical', icon: <HeartPulse size={20} /> },
  { id: 'scouting', icon: <Search size={20} /> },
  { id: 'transfers', icon: <ArrowLeftRight size={20} /> },
  { id: 'finance', icon: <Wallet size={20} /> },
  { id: 'stadium', icon: <Landmark size={20} /> },
  { id: 'competitions', icon: <Trophy size={20} /> },
  { id: 'stats', icon: <TrendingUp size={20} /> },
  { id: 'staff', icon: <UsersRound size={20} /> },
  { id: 'settings', icon: <Settings size={20} /> },
]

export interface DesktopShellProps {
  /** Highlighted nav entry. */
  section?: DesktopSection
  /** Breadcrumb tail shown in the top bar. */
  breadcrumb?: string
  /** Optional right context rail (desktop ≥ xl only). */
  rightRail?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Adaptive office shell. Below `lg` the chrome is hidden and `children`
 * render full-width — the existing mobile screens (their own ScreenShell)
 * pass straight through. From `lg` a 3-column cockpit wraps them: top bar,
 * left nav rail, main column, optional right context rail (`xl`+).
 * Token-driven, so scheme/club cascade from the ThemeProvider attributes.
 */
export function DesktopShell({
  section = 'hub',
  breadcrumb,
  rightRail,
  children,
  className,
}: DesktopShellProps) {
  const { t } = useTranslation(['nav', 'common'])
  const { club } = useTheme()
  const crumb = breadcrumb ?? t(`nav:${section}`)

  return (
    <div className={cn('flex min-h-dvh flex-col bg-bg font-sans text-ink', className)}>
      <header className="hidden h-14 shrink-0 items-center gap-4 border-b border-rule bg-card px-5 lg:flex">
        <div className="flex items-center gap-3">
          <Crest {...club.crest} size={32} label={club.name} />
          <div className="leading-tight">
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-ink-mute">
              {club.name}
            </div>
            <span className="font-display text-sm font-bold text-ink">{t('nav:season')}</span>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2 text-ink-mute">
          <span className="text-xs">{t('nav:hub')}</span>
          <ChevronRight size={12} className="text-ink-soft" aria-hidden />
          <span className="font-display text-sm font-bold text-ink">{crumb}</span>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-ink px-4 text-[12.5px] font-extrabold text-bg"
        >
          {t('nav:advance')}
          <ArrowRight size={14} aria-hidden />
        </button>
      </header>

      <div
        className={cn(
          'min-h-0 flex-1 lg:grid',
          rightRail
            ? 'lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_340px]'
            : 'lg:grid-cols-[220px_1fr]',
        )}
      >
        <nav
          aria-label={t('nav:railLabel')}
          className="hidden flex-col gap-px overflow-y-auto border-r border-rule bg-card p-2 lg:flex"
        >
          {NAV.map((n) => {
            const active = n.id === section
            return (
              <span
                key={n.id}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13px] font-semibold',
                  active ? 'bg-accent-soft font-bold text-accent' : 'text-ink',
                )}
              >
                {active && (
                  <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent" />
                )}
                <span className={cn('inline-flex', active ? 'text-accent' : 'text-ink-mute')}>
                  {n.icon}
                </span>
                <span className="flex-1">{t(`nav:${n.id}`)}</span>
                {n.badge ? (
                  <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1.5 text-[10px] font-extrabold text-white">
                    {n.badge}
                  </span>
                ) : null}
              </span>
            )
          })}
          <span className="flex-1" />
          <span className="inline-flex items-center gap-1.5 px-3 py-2.5 font-display text-[10px] italic text-ink-soft">
            <CloudOff size={11} aria-hidden /> {t('nav:offline')}
          </span>
        </nav>

        <main className="overflow-auto p-4 lg:p-5">{children}</main>

        {rightRail ? (
          <aside className="hidden overflow-y-auto border-l border-rule bg-card p-4 xl:block">
            {rightRail}
          </aside>
        ) : null}
      </div>
    </div>
  )
}
