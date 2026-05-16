import { cn } from '@/lib/utils'
import type { Stand } from '@/types/stadium'
import { GlyphSeat, GlyphStand, GlyphVIP } from './stadium-glyphs'

const nf = new Intl.NumberFormat('de-DE')

export interface CapacityBarProps {
  stand: Stand
  className?: string
}

/** Stacked standing | seating | VIP bar. Always shows glyphs AND numbers. */
export function CapacityBar({ stand, className }: CapacityBarProps) {
  const pct = (n: number) => `${(n / stand.cap) * 100}%`
  const seatsOnly = stand.seats - stand.vip
  return (
    <div className={className}>
      <div className="flex h-[18px] overflow-hidden rounded-md border border-rule">
        {stand.standing > 0 && (
          <div
            style={{ width: pct(stand.standing) }}
            className="flex items-center justify-center gap-1 bg-accent text-[9px] font-extrabold tracking-[0.4px] text-white"
          >
            <GlyphStand size={11} /> STEH
          </div>
        )}
        {seatsOnly > 0 && (
          <div
            style={{ width: pct(seatsOnly) }}
            className="flex items-center justify-center gap-1 bg-ink text-[9px] font-extrabold tracking-[0.4px] text-bg"
          >
            <GlyphSeat size={11} /> SITZ
          </div>
        )}
        {stand.vip > 0 && (
          <div
            style={{ width: pct(stand.vip) }}
            className="flex items-center justify-center gap-1 bg-warn text-[9px] font-extrabold tracking-[0.4px] text-white"
          >
            <GlyphVIP size={11} /> VIP
          </div>
        )}
      </div>
      <div
        className={cn(
          'mt-1.5 flex justify-between font-mono text-[10px] font-semibold text-ink-mute',
        )}
      >
        <span>{nf.format(stand.standing)}</span>
        <span>{nf.format(seatsOnly)}</span>
        <span>{stand.vip ? nf.format(stand.vip) : '–'}</span>
      </div>
    </div>
  )
}
