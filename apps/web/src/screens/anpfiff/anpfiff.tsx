import { Link } from '@tanstack/react-router'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Crest } from '@/components/atoms/crest/crest'
import { FormStrip } from '@/components/atoms/form-strip/form-strip'
import { Jersey } from '@/components/atoms/jersey/jersey'
import { PosPill } from '@/components/atoms/pos-pill/pos-pill'
import { StatStrip } from '@/components/composites/stat-strip/stat-strip'
import { ScreenShell } from '@/components/layout/screen-shell'
import { clubByName } from '@/theme/club-registry'
import { H2H, OPP, OWN } from '../fixtures'

const NBC = clubByName('Northbridge City')
const FCH = clubByName('FC Hafenstadt')

export function Anpfiff() {
  const { t } = useTranslation(['anpfiff', 'common'])
  return (
    <ScreenShell label={t('anpfiff:cta')}>
      <header className="px-4 pb-2 pt-1.5">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            aria-label={t('common:back')}
            className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="text-center text-[11px] font-bold uppercase tracking-wide text-ink-mute">
            {t('anpfiff:competition')}
            <br />
            <span className="font-normal normal-case">{t('anpfiff:kickoff')}</span>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-md border border-rule bg-card text-ink">
            <MoreHorizontal size={16} />
          </span>
        </div>
      </header>

      <div className="flex items-center gap-2.5 px-4 pt-2.5">
        <div className="flex flex-1 flex-col items-start gap-1.5">
          <div className="flex items-end gap-1.5">
            <Crest {...NBC.crest} size={56} label={NBC.name} />
            <Jersey
              pattern={NBC.kit.pattern}
              a={NBC.crest.a}
              b={NBC.crest.b}
              sleeveAccent={NBC.kit.sleeveAccent}
              size={40}
            />
          </div>
          <span className="font-display text-[17px] font-bold leading-tight text-ink">
            {OPP.name}
          </span>
          <span className="text-[10px] text-ink-mute">{OPP.ranking}</span>
        </div>
        <span className="font-display text-3xl font-bold italic text-ink-soft">
          {t('anpfiff:vs')}
        </span>
        <div className="flex flex-1 flex-col items-end gap-1.5">
          <div className="flex flex-row-reverse items-end gap-1.5">
            <Crest {...FCH.crest} size={56} label={FCH.name} />
            <Jersey
              pattern={FCH.kit.pattern}
              a={FCH.crest.a}
              b={FCH.crest.b}
              sleeveAccent={FCH.kit.sleeveAccent}
              size={40}
            />
          </div>
          <span className="font-display text-[17px] font-bold leading-tight text-ink">
            {OWN.name}
          </span>
          <span className="text-[10px] text-ink-mute">{OWN.ranking}</span>
        </div>
      </div>

      <div className="mx-4 mt-3.5 rounded-xl border border-rule bg-card px-3.5">
        <StatStrip
          label={t('anpfiff:rows.strength')}
          a="7,4"
          b="7,6"
          accentSide="b"
          hint={t('anpfiff:strengthHint')}
        />
        <StatStrip
          label={t('anpfiff:rows.form')}
          mono={false}
          a={<FormStrip form="SUNSU" />}
          b={<FormStrip form="SSNSU" />}
        />
        <StatStrip label={t('anpfiff:rows.table')} a="4." b="2." accentSide="b" />
      </div>

      <div className="px-4 pt-3">
        <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
          {t('anpfiff:keyPlayers')}
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {OPP.key.map((k) => (
            <div key={k.n} className="rounded-lg border border-rule bg-card px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">{k.n}</span>
                <PosPill pos={k.pos} />
              </div>
              <div className="mt-0.5 text-[10px] text-ink-mute">
                {OPP.short} · {k.tag}
              </div>
            </div>
          ))}
          {OWN.key.map((k) => (
            <div key={k.n} className="rounded-lg border border-accent bg-accent-soft px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-accent">{k.n}</span>
                <PosPill pos={k.pos} />
              </div>
              <div className="mt-0.5 text-[10px] font-bold text-accent">
                {OWN.short} · {t('anpfiff:inForm')} · {k.tag}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="rounded-xl border border-rule bg-card px-3 py-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wide text-ink-mute">
            {t('anpfiff:h2h')}
          </div>
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[13px] font-bold">
            <span className="text-ink-mute">{OPP.short}</span>
            <div className="flex flex-1 gap-1">
              {H2H.map((x) => (
                <div
                  key={x.l}
                  title={x.l}
                  className={`grid h-6 flex-1 place-items-center rounded-[5px] text-[9px] text-white ${
                    x.c === 'S' ? 'bg-ok' : x.c === 'N' ? 'bg-danger' : 'bg-warn'
                  }`}
                >
                  {x.c}
                </div>
              ))}
            </div>
            <span className="text-ink">{OWN.short}</span>
          </div>
          <p className="mt-1.5 font-display text-[11px] italic text-ink-mute">
            {t('anpfiff:h2hQuote')}
          </p>
        </div>
      </div>

      <div className="flex-1" />
      <div className="p-4 pb-6">
        <Link
          to="/spiel"
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-accent text-lg font-extrabold text-white"
        >
          {t('anpfiff:cta')}
        </Link>
      </div>
    </ScreenShell>
  )
}
