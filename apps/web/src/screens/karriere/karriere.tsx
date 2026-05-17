import { Link } from '@tanstack/react-router'
import { CloudOff, Download, Plus, Settings, Share, Trash2, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { Jersey } from '@/components/atoms/jersey/jersey'
import { ScreenShell } from '@/components/layout/screen-shell'
import { clubByName } from '@/theme/club-registry'
import { SAVE_SLOTS } from '../fixtures'

export function Karriere() {
  const { t } = useTranslation(['karriere', 'common'])
  return (
    <ScreenShell label={t('karriere:title')}>
      <header className="px-4 pb-3 pt-1">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-mute">
              {t('karriere:eyebrow')}
            </div>
            <Link to="/" className="block font-display text-[26px] font-bold leading-none text-ink">
              {t('karriere:title')}
            </Link>
          </div>
          <span
            role="img"
            aria-label={t('karriere:settingsAria')}
            className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink"
          >
            <Settings size={16} />
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-bg-ink px-2.5 py-2 text-[11px] font-semibold text-ink-mute">
          <CloudOff size={14} />
          {t('karriere:storage')}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {SAVE_SLOTS.map((s) =>
          s.empty ? (
            <button
              key={s.i}
              type="button"
              className="mb-2.5 flex w-full flex-col items-center gap-1 rounded-2xl border-[1.5px] border-dashed border-rule px-3.5 py-[18px] text-ink-mute"
            >
              <Plus size={20} />
              <span className="text-sm font-bold">{t('karriere:newCareer')}</span>
              <span className="text-[11px]">{t('karriere:freeSlot', { slot: s.i })}</span>
            </button>
          ) : (
            <div key={s.i} className="mb-2.5 rounded-2xl border border-rule bg-card p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative grid h-[54px] w-[54px] shrink-0 place-items-center rounded-xl border border-rule bg-bg">
                  <Jersey
                    pattern={clubByName(s.club).kit.pattern}
                    a={clubByName(s.club).crest.a}
                    b={clubByName(s.club).crest.b}
                    sleeveAccent={clubByName(s.club).kit.sleeveAccent}
                    size={42}
                  />
                  <span className="absolute -bottom-1 -right-1 grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px] border-rule bg-card">
                    <Crest {...clubByName(s.club).crest} size={18} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold leading-tight text-ink">
                    {s.name}
                  </span>
                  <div className="mt-0.5 text-[11px] text-ink-mute">
                    <span className="inline-flex items-center gap-1">
                      <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-accent-soft font-display text-[9px] font-extrabold text-accent">
                        {s.mgr}
                      </span>
                      {s.club} · {t('karriere:season', { season: s.season })}
                    </span>
                  </div>
                </div>
                <span className="whitespace-nowrap text-[10px] text-ink-soft">{s.stamp}</span>
              </div>
              <div className="mt-2.5">
                <div className="mb-[3px] flex justify-between font-mono text-[10px] text-ink-mute">
                  <span>{s.size} MB</span>
                  <span>{t('karriere:quota', { percent: Math.round(s.ratio * 100) })}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-bg-ink">
                  <div className="h-full bg-ink" style={{ width: `${s.ratio * 100}%` }} />
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <button
                  type="button"
                  className="h-10 flex-1 rounded-lg bg-ink text-[13px] font-extrabold text-bg"
                >
                  {t('karriere:resume')}
                </button>
                <button
                  type="button"
                  aria-label={t('karriere:exportAria')}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-rule bg-bg text-ink"
                >
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  aria-label={t('karriere:importAria')}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-rule bg-bg text-ink"
                >
                  <Upload size={16} />
                </button>
                <button
                  type="button"
                  aria-label={t('karriere:deleteAria')}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-rule bg-bg text-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ),
        )}

        <div className="mt-1.5 flex items-start gap-2.5 rounded-2xl border border-accent bg-accent-soft p-3.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent bg-white text-accent">
            <Share size={18} />
          </div>
          <div className="flex-1">
            <span className="block font-display text-sm font-extrabold text-accent">
              {t('karriere:installTitle')}
            </span>
            <p className="mt-0.5 text-[11.5px] leading-snug text-ink">
              {t('karriere:installBody')}{' '}
              <span className="text-ink-mute">{t('karriere:installHint')}</span>
            </p>
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}
