import { useTranslation } from 'react-i18next'
import { PosPill } from '@/components/atoms/pos-pill/pos-pill'
import { StrBar } from '@/components/atoms/str-bar/str-bar'
import { Talent } from '@/components/atoms/talent/talent'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/player'

/** A contract is "soon" when it ends in the closest summer window. */
export function isContractSoon(contract: string): boolean {
  return contract.startsWith('06/26')
}

export interface PlayerCardProps {
  player: Player
  className?: string
}

/** Compact squad card. Numeric strength + talent + form (never colour-only). */
export function PlayerCard({ player, className }: PlayerCardProps) {
  const { t } = useTranslation('kader')
  const soon = isContractSoon(player.contract)
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2.5 rounded-md border border-rule bg-card px-3 py-2.5',
        className,
      )}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-bg-ink font-mono text-[13px] font-bold text-ink">
        {player.shirt}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold text-ink">{player.n}</span>
          <span className="font-mono text-[10px] text-ink-soft">{player.nat}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-mute">
          <PosPill pos={player.pos} />
          <span className="tabular-nums">{t('years', { count: player.age })}</span>
          <span className="tabular-nums">{t('formLabel', { value: player.form })}</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 tabular-nums',
              soon ? 'font-bold text-danger' : 'text-ink-mute',
            )}
          >
            {soon && (
              <span
                role="img"
                className="h-1 w-1 rounded-full bg-danger"
                aria-label="Vertrag läuft aus"
              />
            )}
            ▸ {player.contract}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StrBar n={player.str} />
        <Talent n={player.tal} />
      </div>
    </div>
  )
}
