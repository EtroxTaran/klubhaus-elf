import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { ScreenShell } from '@/components/layout/screen-shell'
import { clubById } from '@/theme/club-registry'
import type { ClubId } from '@/types/club'
import { COUNTRIES, ONBOARDING_CLUBS } from '../fixtures'

export type OnboardingStep = 1 | 2 | 3

function Progress({ step }: { step: OnboardingStep }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-ink' : 'bg-rule'}`} />
      ))}
    </div>
  )
}

export function Onboarding({ step = 1 }: { step?: OnboardingStep }) {
  const { t } = useTranslation('onboarding')
  return (
    <ScreenShell label={t('country.title')}>
      <header className="px-4 pb-2 pt-1">
        <Progress step={step} />
        <div className="mt-2.5 text-[10px] font-bold uppercase tracking-wide text-ink-mute">
          {t('stepOf', { step })}
        </div>
      </header>

      {step === 1 && (
        <>
          <div className="px-4">
            <span className="block font-display text-[28px] font-bold leading-tight text-ink">
              {t('country.title')}
            </span>
            <p className="mt-1.5 font-display text-[13px] italic text-ink-mute">
              {t('country.sub')}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pt-2.5">
            {COUNTRIES.map((c) => (
              <div
                key={c.n}
                className={`mb-2 flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 ${
                  c.sel ? 'border-ink bg-ink text-bg' : 'border-rule bg-card text-ink'
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg-ink text-xl">
                  {c.flag}
                </span>
                <div className="flex-1">
                  <span className="font-display text-base font-bold">{c.n}</span>
                  <div className="text-[11px] opacity-70">
                    {c.league} · {c.tier}
                  </div>
                </div>
                {c.sel && <Check size={18} />}
              </div>
            ))}
          </div>
          <div className="p-4 pb-6">
            <Link
              to="/onboarding"
              search={{ step: 2 }}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-extrabold text-white"
            >
              {t('country.next')} <ArrowRight size={18} />
            </Link>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="px-4">
            <span className="block font-display text-2xl font-bold leading-tight text-ink">
              {t('club.title')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {ONBOARDING_CLUBS.map((c, i) => {
                const club = clubById(c.id as ClubId)
                return (
                  <div
                    key={c.id}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-2.5 ${
                      i === 0 ? 'border-accent bg-accent-soft' : 'border-rule bg-card'
                    }`}
                  >
                    <Crest {...club.crest} size={42} label={c.name} />
                    <span className="mt-0.5 font-display text-[13px] font-bold leading-tight text-ink">
                      {c.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide ${
                        i === 0 ? 'text-accent' : 'text-ink-mute'
                      }`}
                    >
                      {c.league}
                    </span>
                    <span className="font-display text-[10.5px] italic leading-snug text-ink-mute">
                      {c.pitch}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex gap-2 p-4 pb-6">
            <Link
              to="/onboarding"
              search={{ step: 1 }}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-rule text-sm font-bold text-ink"
            >
              {t('club.reroll')}
            </Link>
            <Link
              to="/onboarding"
              search={{ step: 3 }}
              className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-extrabold text-white"
            >
              {t('club.take', { club: 'FC Hafenstadt' })} <ArrowRight size={18} />
            </Link>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="px-4">
            <span className="block font-display text-2xl font-bold leading-tight text-ink">
              {t('manager.title')}
            </span>
            <p className="mt-1 font-display text-xs italic text-ink-mute">{t('manager.sub')}</p>
          </div>
          <div className="flex flex-col items-center gap-3.5 px-4 pt-6">
            <div className="grid h-[120px] w-[120px] place-items-center rounded-full border-2 border-accent bg-accent-soft font-display text-5xl font-extrabold text-accent">
              JL
            </div>
          </div>
          <div className="px-4 pt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {t('manager.nameLabel')}
            </div>
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-rule bg-card px-3.5 py-3">
              <span className="font-display text-lg font-bold text-ink">Julia Lindquist</span>
              <span className="flex-1" />
              <button type="button" className="text-[11px] font-bold text-accent">
                {t('manager.change')}
              </button>
            </div>
          </div>
          <div className="flex-1" />
          <div className="p-4 pb-6">
            <Link
              to="/"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-ink text-base font-extrabold text-bg"
            >
              {t('manager.start')} <ArrowRight size={20} />
            </Link>
          </div>
        </>
      )}
    </ScreenShell>
  )
}
