import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface HubTileProps {
  icon: ReactNode
  label: string
  sub: string
  flag?: string
  className?: string
}

/** Office-hub navigation tile: icon box + title + sub + scarlet flag line. */
export function HubTile({ icon, label, sub, flag, className }: HubTileProps) {
  return (
    <div
      className={cn(
        'flex min-h-hub flex-col justify-between rounded-lg border border-rule bg-card p-3',
        className,
      )}
    >
      <div className="flex justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-bg-ink text-ink">{icon}</div>
        <ChevronRight size={14} className="text-ink-soft" aria-hidden />
      </div>
      <div>
        <div className="text-[13px] font-bold leading-tight text-ink">{label}</div>
        <div className="mt-0.5 text-[11px] text-ink-mute">{sub}</div>
        {flag && <div className="mt-1 text-[10px] font-semibold text-accent">· {flag}</div>}
      </div>
    </div>
  )
}
