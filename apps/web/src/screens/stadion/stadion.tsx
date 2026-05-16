import { Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CapacityBar } from '@/components/composites/stadium/capacity-bar'
import {
  GlyphFloodlight,
  GlyphHeating,
  GlyphRoof,
  GlyphRoofOpen,
  GlyphRoofPartial,
} from '@/components/composites/stadium/stadium-glyphs'
import { StadiumPlot } from '@/components/composites/stadium/stadium-plot'
import { StadiumTypePlan } from '@/components/composites/stadium/stadium-type-plan'
import { StandSideView } from '@/components/composites/stadium/stand-side-view'
import { ScreenShell } from '@/components/layout/screen-shell'
import type { RoofKind } from '@/types/stadium'
import { nf, STADIUM_AMENITIES, STADIUM_INFO, STADIUM_TYPES, STANDS } from '../fixtures'

const TABS = ['facility', 'stands', 'pitch', 'catering', 'types'] as const
type Tab = (typeof TABS)[number]

function RoofGlyph({ roof }: { roof: RoofKind }) {
  if (roof === 'full') return <GlyphRoof size={14} className="text-ok" />
  if (roof === 'partial') return <GlyphRoofPartial size={14} className="text-warn" />
  return <GlyphRoofOpen size={14} className="text-danger" />
}

export function Stadion() {
  const { t } = useTranslation(['stadion', 'common'])
  const [tab, setTab] = useState<Tab>('facility')
  return (
    <ScreenShell label={t('stadion:title')}>
      <header className="px-4 pb-2 pt-1">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              aria-label={t('common:back')}
              className="grid h-8 w-8 place-items-center rounded-md border border-rule bg-card text-ink"
            >
              <ChevronLeft size={16} />
            </Link>
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-mute">
                {t('stadion:eyebrow', {
                  name: STADIUM_INFO.name,
                  built: STADIUM_INFO.built,
                })}
              </div>
              <span className="block font-display text-2xl font-bold leading-none text-ink">
                {t('stadion:title')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
              {t('stadion:capacity')}
            </div>
            <span className="font-display font-mono text-lg font-extrabold text-ink">
              {nf.format(STADIUM_INFO.capacity)}
            </span>
          </div>
        </div>
      </header>

      <div className="px-3 pt-1">
        <div className="flex gap-1 rounded-lg bg-bg-ink p-[3px]">
          {TABS.map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => setTab(tb)}
              className={`flex-1 rounded-md py-1.5 text-[10.5px] font-bold ${
                tab === tb ? 'bg-card text-ink shadow-paper' : 'text-ink-mute'
              }`}
            >
              {t(`stadion:tabs.${tb}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-5 pt-2.5">
        {tab === 'facility' && (
          <>
            <div className="rounded-xl border border-rule bg-bg p-1.5">
              <StadiumPlot amenities={STADIUM_AMENITIES} label={t('stadion:title')} />
            </div>
            <div className="flex flex-wrap gap-3 px-1 pt-2 text-[10px] font-semibold text-ink-mute">
              <span className="inline-flex items-center gap-1">
                <GlyphRoof size={12} className="text-ink" /> {t('stadion:legend.roofed')}
              </span>
              <span className="inline-flex items-center gap-1">
                <GlyphRoofOpen size={12} className="text-ink-mute" /> {t('stadion:legend.open')}
              </span>
              <span className="inline-flex items-center gap-1">
                <GlyphFloodlight size={12} className="text-warn" /> {t('stadion:legend.floodlight')}
              </span>
              <span className="inline-flex items-center gap-1">
                <GlyphHeating size={12} className="text-accent" /> {t('stadion:legend.heating')}
              </span>
            </div>
            <div className="px-1 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-wide text-ink-mute">
              {t('stadion:buildings')} · {t('stadion:budget')}
            </div>
            {STADIUM_AMENITIES.slice(0, 4).map((a) => (
              <div
                key={a.label}
                className="mb-2 flex items-center justify-between rounded-lg border border-rule bg-card px-3 py-2.5"
              >
                <span className="font-display text-sm font-bold text-ink">{a.label}</span>
                <span className="text-[10.5px] font-bold text-ok">{t('stadion:build')}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'stands' && (
          <>
            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-bg-ink px-2.5 py-2 text-[11px] font-bold text-ink-mute">
              {t('stadion:roofRow')}
            </div>
            {STANDS.map((s) => (
              <div key={s.id} className="mb-2.5 rounded-2xl border border-rule bg-card p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-md bg-ink text-[13px] font-extrabold text-bg">
                      {s.id}
                    </div>
                    <div>
                      <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
                      <div className="mt-0.5 text-[11px] text-ink-mute">
                        <span className="font-mono font-bold text-ink">{nf.format(s.cap)}</span>{' '}
                        {t('stadion:standMeta', { rows: s.rows, blocks: s.blocks })}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold">
                    <RoofGlyph roof={s.roof} />
                    {t(`stadion:roof.${s.roof}`)}
                  </span>
                </div>
                <div className="mt-2.5 rounded-lg border border-rule bg-bg p-1.5">
                  <StandSideView stand={s} />
                </div>
                <div className="mt-2.5">
                  <CapacityBar stand={s} />
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'pitch' && (
          <div className="rounded-xl border border-rule bg-card px-3 py-3 text-sm text-ink-mute">
            {t('stadion:legend.heating')} · {t('stadion:legend.floodlight')}
          </div>
        )}

        {tab === 'catering' && (
          <div className="rounded-xl border border-rule bg-card px-3 py-3 text-sm text-ink-mute">
            {STADIUM_AMENITIES.slice(4)
              .map((a) => a.label)
              .join(' · ')}
          </div>
        )}

        {tab === 'types' && (
          <>
            <p className="px-1 pb-2 font-display text-[11px] italic text-ink-mute">
              {t('stadion:typesIntro')}
            </p>
            {STADIUM_TYPES.map((tp) => (
              <div
                key={tp.id}
                className={`mb-2.5 flex items-start gap-3 rounded-2xl border p-3.5 ${
                  tp.current ? 'border-accent bg-accent-soft' : 'border-rule bg-card'
                }`}
              >
                <div className="w-[120px] shrink-0 overflow-hidden rounded-lg border border-rule bg-bg">
                  <StadiumTypePlan type={tp} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`font-display text-[15px] font-bold leading-tight ${
                        tp.current ? 'text-accent' : 'text-ink'
                      }`}
                    >
                      {tp.name}
                    </span>
                    {tp.current && (
                      <span className="text-[10px] font-extrabold tracking-wide text-accent">
                        {t('stadion:current')}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">{tp.desc}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-bg-ink px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">
                      {tp.capRange}
                    </span>
                    <span className="rounded-full bg-bg-ink px-1.5 py-0.5 text-[10px] font-bold text-ink-mute">
                      {tp.pitch}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </ScreenShell>
  )
}
