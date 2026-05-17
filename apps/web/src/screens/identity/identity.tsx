import { Link } from '@tanstack/react-router'
import { Check, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { CHARGES } from '@/components/atoms/crest/crest-paths'
import { Jersey } from '@/components/atoms/jersey/jersey'
import { JERSEY_PATTERNS } from '@/components/atoms/jersey/jersey-paths'
import { ScreenShell } from '@/components/layout/screen-shell'
import type { CrestShape } from '@/types/club'
import { IDENT_TINCTURES } from '../fixtures'

const SHAPES: CrestShape[] = ['heater', 'iberian', 'gonfalon', 'roundel']
const TABS = ['crest', 'jersey'] as const
type Tab = (typeof TABS)[number]
const MOTTO_MAX = 32

function SectionLabel({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-2 mt-3.5 flex items-baseline justify-between">
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-mute">{children}</div>
      {hint && <div className="text-[10px] text-ink-soft">{hint}</div>}
    </div>
  )
}

function Swatch({
  hex,
  name,
  active,
  onClick,
}: {
  hex: string
  name: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={active}
      onClick={onClick}
      className={`h-8 w-8 rounded-lg border ${
        active ? 'border-[2.5px] border-ink ring-2 ring-bg' : 'border-rule'
      }`}
      style={{ background: hex }}
    />
  )
}

export function Identity() {
  const { t } = useTranslation(['identity', 'common'])
  const [tab, setTab] = useState<Tab>('crest')
  const [shape, setShape] = useState<CrestShape>('heater')
  const [tincA, setTincA] = useState('#0e3a5f')
  const [tincB, setTincB] = useState('#c8a45a')
  const [charge, setCharge] = useState<(typeof CHARGES)[number]>('ship')
  const [motto, setMotto] = useState('Per mare ad astra')
  const [pattern, setPattern] = useState<(typeof JERSEY_PATTERNS)[number]>('stripes')
  const [sleeveAccent, setSleeveAccent] = useState(true)
  const [showBack, setShowBack] = useState(false)

  const crest = { shape, a: tincA, b: tincB, charge }

  return (
    <ScreenShell label={t('identity:title')}>
      <header className="px-4 pb-2 pt-1.5">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label={t('identity:backAria')}
            className="grid h-9 w-9 place-items-center rounded-lg border border-rule bg-card text-ink"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="text-center">
            <span className="block font-display text-[17px] font-bold leading-none text-ink">
              {t('identity:title')}
            </span>
            <div className="mt-0.5 text-[10px] tracking-wide text-ink-soft">
              {t('identity:subtitle')}
            </div>
          </div>
          <button
            type="button"
            aria-label={t('identity:confirmAria')}
            className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-white"
          >
            <Check size={18} />
          </button>
        </div>
      </header>

      <div className="relative mx-4 rounded-xl border border-rule bg-card px-3 pb-2.5 pt-3.5">
        <div className="flex min-h-[188px] items-center justify-center">
          {tab === 'crest' ? (
            <div className="flex flex-col items-center">
              <Crest
                {...crest}
                {...(motto ? { motto } : {})}
                size={140}
                label={t('identity:title')}
              />
              <div className="mt-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {t(`identity:shapeLabel.${shape}`)} · {t(`identity:chargeLabel.${charge}`)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Jersey
                pattern={pattern}
                a={tincA}
                b={tincB}
                sleeveAccent={sleeveAccent}
                crest={crest}
                number="9"
                name="Brody"
                showBack={showBack}
                size={160}
                label={t('identity:title')}
              />
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-mute">
                {showBack ? t('identity:side.back') : t('identity:side.front')}
              </div>
            </div>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-center gap-1.5 border-t border-dashed border-rule pt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Jersey
              key={i}
              pattern={pattern}
              a={tincA}
              b={tincB}
              sleeveAccent={sleeveAccent}
              size={26}
            />
          ))}
          <span className="ml-1.5 text-[9.5px] font-bold uppercase tracking-wide text-ink-mute">
            {t('identity:lineupCaption')}
          </span>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="flex gap-0.5 rounded-lg border border-rule bg-bg-ink p-[3px]">
          {TABS.map((tb) => (
            <button
              key={tb}
              type="button"
              aria-pressed={tab === tb}
              onClick={() => setTab(tb)}
              className={`flex-1 rounded-md py-1.5 text-center text-xs font-bold ${
                tab === tb ? 'bg-card text-ink shadow-paper' : 'text-ink-mute'
              }`}
            >
              {t(`identity:tabs.${tb}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-5">
        {tab === 'crest' && (
          <>
            <SectionLabel hint={t('identity:hints.shapes')}>
              {t('identity:sections.shape')}
            </SectionLabel>
            <div className="grid grid-cols-4 gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={s === shape}
                  onClick={() => setShape(s)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2.5 ${
                    s === shape ? 'border-[1.5px] border-ink bg-bg-ink' : 'border-rule bg-card'
                  }`}
                >
                  <Crest shape={s} a={tincA} b={tincB} charge={charge} size={26} />
                  <span className="text-[10px] font-semibold text-ink">
                    {t(`identity:shapeLabel.${s}`)}
                  </span>
                </button>
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.tinctureA')}>
              {t('identity:sections.tinctureA')}
            </SectionLabel>
            <div className="grid grid-cols-6 justify-items-center gap-2">
              {IDENT_TINCTURES.map((c) => (
                <Swatch
                  key={c.id}
                  hex={c.hex}
                  name={c.name}
                  active={tincA === c.hex}
                  onClick={() => setTincA(c.hex)}
                />
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.tinctureB')}>
              {t('identity:sections.tinctureB')}
            </SectionLabel>
            <div className="grid grid-cols-6 justify-items-center gap-2">
              {IDENT_TINCTURES.map((c) => (
                <Swatch
                  key={c.id}
                  hex={c.hex}
                  name={c.name}
                  active={tincB === c.hex}
                  onClick={() => setTincB(c.hex)}
                />
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.charges')}>
              {t('identity:sections.charge')}
            </SectionLabel>
            <div className="grid grid-cols-5 justify-items-center gap-2">
              {CHARGES.map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-label={t(`identity:chargeLabel.${k}`)}
                  aria-pressed={charge === k}
                  onClick={() => setCharge(k)}
                  className={`grid h-11 w-11 place-items-center rounded-lg border ${
                    charge === k ? 'border-[1.5px] border-ink bg-bg-ink' : 'border-rule bg-card'
                  }`}
                >
                  <Crest shape="roundel" a="#fbf6ea" b="#fbf6ea" charge={k} size={32} />
                </button>
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.motto')}>
              {t('identity:sections.motto')}
            </SectionLabel>
            <input
              value={motto}
              onChange={(e) => setMotto(e.target.value.slice(0, MOTTO_MAX))}
              placeholder={t('identity:mottoPlaceholder')}
              aria-label={t('identity:sections.motto')}
              className="h-10 w-full rounded-lg border border-rule bg-card px-3 font-display text-[13px] italic text-ink outline-none"
            />
          </>
        )}

        {tab === 'jersey' && (
          <>
            <SectionLabel hint={t('identity:hints.patterns')}>
              {t('identity:sections.pattern')}
            </SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {JERSEY_PATTERNS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={p === pattern}
                  onClick={() => setPattern(p)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 ${
                    p === pattern ? 'border-[1.5px] border-ink bg-bg-ink' : 'border-rule bg-card'
                  }`}
                >
                  <Jersey pattern={p} a={tincA} b={tincB} sleeveAccent={sleeveAccent} size={42} />
                  <span className="text-[10px] font-semibold text-ink">
                    {t(`identity:patternLabel.${p}`)}
                  </span>
                </button>
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.tinctureAJersey')}>
              {t('identity:sections.tinctureA')}
            </SectionLabel>
            <div className="grid grid-cols-6 justify-items-center gap-2">
              {IDENT_TINCTURES.map((c) => (
                <Swatch
                  key={c.id}
                  hex={c.hex}
                  name={c.name}
                  active={tincA === c.hex}
                  onClick={() => setTincA(c.hex)}
                />
              ))}
            </div>

            <SectionLabel hint={t('identity:hints.tinctureBJersey')}>
              {t('identity:sections.tinctureB')}
            </SectionLabel>
            <div className="grid grid-cols-6 justify-items-center gap-2">
              {IDENT_TINCTURES.map((c) => (
                <Swatch
                  key={c.id}
                  hex={c.hex}
                  name={c.name}
                  active={tincB === c.hex}
                  onClick={() => setTincB(c.hex)}
                />
              ))}
            </div>

            <SectionLabel>{t('identity:sections.details')}</SectionLabel>
            <div className="rounded-xl border border-rule bg-card px-3">
              <ToggleRow
                label={t('identity:toggles.sleeve')}
                sub={t('identity:toggles.sleeveSub')}
                on={sleeveAccent}
                onChange={() => setSleeveAccent((v) => !v)}
              />
              <ToggleRow
                label={t('identity:toggles.showBack')}
                sub={t('identity:toggles.showBackSub')}
                on={showBack}
                onChange={() => setShowBack((v) => !v)}
                last
              />
            </div>
          </>
        )}
      </div>

      <div className="border-t border-rule bg-bg p-4 pb-6">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-white"
        >
          <Check size={16} />
          {t('identity:cta')}
        </button>
        <div className="mt-1.5 text-center text-[10px] tracking-wide text-ink-soft">
          {t('identity:ctaNote')}
        </div>
      </div>
    </ScreenShell>
  )
}

function ToggleRow({
  label,
  sub,
  on,
  onChange,
  last,
}: {
  label: string
  sub: string
  on: boolean
  onChange: () => void
  last?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onChange}
      className={`flex w-full items-center gap-2.5 py-2.5 text-left ${
        last ? '' : 'border-b border-rule'
      }`}
    >
      <div className="flex-1">
        <div className="text-[12.5px] font-bold text-ink">{label}</div>
        <div className="mt-0.5 text-[10.5px] text-ink-soft">{sub}</div>
      </div>
      <span
        className={`relative h-[22px] w-[38px] rounded-full transition-colors ${
          on ? 'bg-accent' : 'bg-bg-ink'
        }`}
      >
        <span
          className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-paper transition-all ${
            on ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}
