import { Link } from '@tanstack/react-router'
import { Download, Share2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScreenShell } from '@/components/layout/screen-shell'
import { cn } from '@/lib/utils'
import { TABLOID, type TabloidTone } from '../fixtures'

export interface TabloidProps {
  /** Editorial preset: post-win vs board-crisis. */
  tone?: TabloidTone
}

function TabloidPhoto({
  caption,
  stamp,
  accent,
}: {
  caption: string
  stamp: string
  accent: string
}) {
  return (
    <div className="relative mx-[-4px] mb-3 aspect-video overflow-hidden rounded-[4px] bg-ink">
      <svg viewBox="0 0 320 180" className="block h-full w-full" role="img" aria-label={caption}>
        <defs>
          <pattern id="tb-dots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r=".6" fill="#fff" opacity=".25" />
          </pattern>
        </defs>
        <rect width="320" height="180" fill="#0b0808" />
        <rect width="320" height="180" fill="url(#tb-dots)" />
        <path
          d="M0 165 L60 140 L80 130 L120 122 L160 118 L200 122 L240 130 L260 140 L320 165 L320 180 L0 180 Z"
          fill="#1a1410"
          opacity=".9"
        />
        <g fill="#fff" opacity=".18">
          {Array.from({ length: 50 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative fixed-length crowd-dot loop
            <circle key={i} cx={6 + i * 6.4} cy={155 + (i % 3) * 4} r="2.8" />
          ))}
        </g>
        <g fill="#fff" opacity=".95">
          <circle cx="160" cy="80" r="10" />
          <path d="M152 90 L168 90 L172 130 L156 130 Z" />
          <path d="M152 90 L138 110 L142 116 L156 100 Z" />
          <path d="M168 90 L182 96 L186 84 L170 80 Z" />
          <path d="M156 130 L148 158 L156 158 L162 134 Z" />
          <path d="M172 130 L184 155 L176 158 L168 134 Z" />
        </g>
        <text
          x="12"
          y="173"
          fontSize="6"
          fontWeight="700"
          letterSpacing="1"
          fill="#fff"
          opacity=".6"
        >
          {caption}
        </text>
      </svg>
      <div
        className="absolute right-2.5 top-2.5 rotate-[8deg] border-2 bg-white px-2.5 py-1 text-[9.5px] font-black tracking-[1.5px]"
        style={{ borderColor: accent, color: accent }}
      >
        {stamp}
      </div>
    </div>
  )
}

/** Screen #35 — full-bleed post-match newspaper special. */
export function Tabloid({ tone = 'triumph' }: TabloidProps) {
  const { t } = useTranslation(['tabloid', 'common'])
  const s = TABLOID[tone]
  const accentVar = tone === 'storm' ? 'var(--c-danger)' : 'var(--c-accent)'
  const accentText = tone === 'storm' ? 'text-danger' : 'text-accent'

  return (
    <ScreenShell label={s.masthead}>
      <div className="relative flex flex-1 flex-col">
        <Link
          to="/"
          aria-label={t('tabloid:close')}
          className="absolute right-3 top-2 z-20 grid h-9 w-9 place-items-center rounded-full border border-rule bg-card text-ink"
        >
          <X size={16} />
        </Link>

        <div className="flex-1 overflow-y-auto bg-bg-ink px-5 pb-24 pt-[18px]">
          <div className="mb-3 border-b-2 border-ink pb-2 text-center">
            <div className="font-display text-[34px] font-extrabold leading-none tracking-tighter text-ink">
              {s.masthead}
            </div>
            <div className="mt-1.5 flex justify-between text-[9.5px] font-bold uppercase tracking-wide text-ink-mute">
              <span>{s.date}</span>
              <span className="font-display normal-case italic tracking-normal">
                {t('tabloid:strapline')}
              </span>
              <span>{s.edition}</span>
            </div>
          </div>

          <div className={cn('mb-1 text-[10.5px] font-extrabold tracking-[1.4px]', accentText)}>
            · {s.kicker} ·
          </div>
          <h1 className="mb-2 text-balance font-display text-[34px] font-extrabold leading-[1.04] tracking-tight text-ink">
            {s.headline}
          </h1>
          <p className="mb-4 font-display text-[15px] italic leading-snug text-ink-mute">{s.sub}</p>

          <TabloidPhoto caption={t('tabloid:photoCaption')} stamp={s.stamp} accent={accentVar} />

          <div className="mb-3.5 grid grid-cols-[1.4fr_1fr] gap-3.5">
            <div>
              <p className="font-display text-sm leading-relaxed text-ink">
                <span
                  className={cn(
                    'float-left mr-1.5 mt-1 font-display text-[46px] font-extrabold leading-[.85]',
                    accentText,
                  )}
                >
                  {s.dropcap}
                </span>
                {s.body}
              </p>
              <blockquote
                className="mt-2.5 pl-2.5 font-display text-[13px] italic leading-snug text-ink-mute"
                style={{ borderLeft: `3px solid var(--c-accent)` }}
              >
                {s.quote}
                <div className="mt-1 text-[11px] not-italic text-ink-soft">{s.quoteWho}</div>
              </blockquote>
            </div>
            <div className="border-l border-rule pl-3">
              <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-mute">
                {t('tabloid:glance')}
              </div>
              {s.facts.map((f, i) => (
                <div
                  key={f.l}
                  className={cn(
                    'py-1.5',
                    i < s.facts.length - 1 && 'border-b border-dashed border-rule',
                  )}
                >
                  <div className="text-[9.5px] font-bold uppercase tracking-wide text-ink-soft">
                    {f.l}
                  </div>
                  <div className="mt-0.5 text-[12.5px] font-bold text-ink">{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t-2 border-ink pt-3">
            {s.teasers.map((c) => (
              <div key={c.kicker}>
                <div className={cn('text-[9.5px] font-extrabold tracking-wide', accentText)}>
                  {c.kicker}
                </div>
                <span className="mt-0.5 block font-display text-sm font-bold leading-tight text-ink">
                  {c.t}
                </span>
                <div className="mt-0.5 text-[11px] italic text-ink-mute">{c.s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-bg via-bg to-transparent p-4 pb-5">
          <button
            type="button"
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rule bg-card text-xs font-bold text-ink"
          >
            <Download size={15} /> {t('tabloid:album')}
          </button>
          <button
            type="button"
            className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rule bg-card text-xs font-bold text-ink"
          >
            <Share2 size={15} /> {t('tabloid:share')}
          </button>
          <Link
            to="/"
            className="inline-flex h-12 flex-[1.6] items-center justify-center rounded-xl bg-ink text-[13px] font-extrabold text-bg"
          >
            {t('tabloid:advance')}
          </Link>
        </div>
      </div>
    </ScreenShell>
  )
}
