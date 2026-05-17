import { Link } from '@tanstack/react-router'
import { ArrowRight, DollarSign, Inbox, Megaphone, Target, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { FormStrip } from '@/components/atoms/form-strip/form-strip'
import { HubTile } from '@/components/composites/hub-tile/hub-tile'
import { ScreenShell } from '@/components/layout/screen-shell'
import { clubByName } from '@/theme/club-registry'
import { NEXT_FIXTURE } from '../fixtures'

const HAFENSTADT = clubByName('FC Hafenstadt')

/** Kick-off within this window swaps the next-match card for the countdown. */
const KICKOFF_SOON_S = 30 * 60

export interface OfficeHubProps {
  /** Seconds until the next kick-off — under 30 min shows the T1.5 countdown. */
  kickoffSeconds?: number
}

export function OfficeHub({ kickoffSeconds = NEXT_FIXTURE.kickoffSeconds }: OfficeHubProps = {}) {
  const { t } = useTranslation(['officeHub', 'common'])
  const isSoon = kickoffSeconds < KICKOFF_SOON_S
  const mm = String(Math.floor(kickoffSeconds / 60)).padStart(2, '0')
  const ss = String(kickoffSeconds % 60).padStart(2, '0')
  const tiles = [
    { key: 'training', icon: <Target size={20} />, to: '/kader' },
    { key: 'transfers', icon: <Users size={20} />, to: '/kader' },
    { key: 'board', icon: <Megaphone size={20} />, to: '/finanzen' },
    { key: 'finance', icon: <DollarSign size={20} />, to: '/finanzen' },
  ] as const

  return (
    <ScreenShell label={t('common:appName')}>
      <div className="relative flex flex-1 flex-col px-4 pb-thumb">
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <Crest {...HAFENSTADT.crest} size={34} label={HAFENSTADT.name} />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
                {t('officeHub:eyebrow')}
              </div>
              <span className="font-display text-lg font-bold leading-none text-ink">
                {t('officeHub:headline')}
              </span>
            </div>
          </div>
          <Link
            to="/posteingang"
            aria-label={t('officeHub:inboxAria')}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-rule bg-card text-ink"
          >
            <Inbox size={18} />
            <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white">
              5
            </span>
          </Link>
        </header>

        <p className="mb-3.5 border-b border-rule pb-2.5 font-display text-[13px] italic text-ink-mute">
          {t('officeHub:quote')}
        </p>

        {isSoon ? (
          <section
            data-state="countdown"
            className="rounded-2xl border border-accent bg-accent-soft p-3.5 text-center"
          >
            <div className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-accent">
              · {t('officeHub:kickoffIn')} ·
            </div>
            <div className="mt-1 font-mono text-[52px] font-extrabold leading-none tracking-tighter text-ink tabular-nums">
              {mm}:{ss}
            </div>
            <span className="mt-1.5 block font-display text-[15px] font-bold text-ink">
              {NEXT_FIXTURE.home} <span className="text-ink-soft">{t('officeHub:matchVs')}</span>{' '}
              Hafenstadt
            </span>
            <div className="mt-0.5 text-[11px] text-ink-mute">
              {NEXT_FIXTURE.comp} · {NEXT_FIXTURE.venue}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-rule bg-card p-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[1.2px] text-accent">
                {t('officeHub:nextLabel')}
              </span>
              <span className="text-[11px] tabular-nums text-ink-mute">
                {NEXT_FIXTURE.date} · {NEXT_FIXTURE.time}
              </span>
            </div>
            <span className="mt-1.5 block font-display text-[22px] font-bold leading-tight text-ink">
              {NEXT_FIXTURE.home} <span className="text-ink-soft">{t('officeHub:matchVs')}</span>{' '}
              Hafenstadt
            </span>
            <div className="mt-1 text-xs text-ink-mute">
              {NEXT_FIXTURE.comp} · {NEXT_FIXTURE.venue}
            </div>
            <div className="mt-3 flex items-center gap-5">
              <div>
                <div className="text-[10px] font-semibold text-ink-mute">
                  {t('officeHub:strength')}
                </div>
                <div className="mt-1 flex items-center gap-1.5 font-mono text-[13px] font-bold text-ink">
                  7,6 <span className="text-[10px] text-ink-soft">vs</span> 7,4
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-ink-mute">{t('officeHub:form')}</div>
                <div className="mt-1">
                  <FormStrip form="SSNSU" />
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          {tiles.map((tile) => (
            <Link key={tile.key} to={tile.to} className="block">
              <HubTile
                icon={tile.icon}
                label={t(`officeHub:tiles.${tile.key}.title`)}
                sub={t(`officeHub:tiles.${tile.key}.sub`)}
                flag={t(`officeHub:tiles.${tile.key}.flag`)}
              />
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg from-70% to-transparent p-4 pb-6">
          <Link
            to="/anpfiff"
            className="relative flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-ink text-base font-bold text-bg"
          >
            <span className="absolute left-3.5 top-1.5 text-[9px] font-bold uppercase tracking-wide text-bg-ink opacity-80">
              {t('officeHub:advanceOffset')}
            </span>
            {t('officeHub:advance')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </ScreenShell>
  )
}
