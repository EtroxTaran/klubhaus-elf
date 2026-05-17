import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PillIntent = 'accept' | 'neutral' | 'soft' | 'danger'

const INTENT: Record<PillIntent, string> = {
  accept: 'bg-accent text-white border-accent',
  neutral: 'bg-transparent text-ink border-rule',
  soft: 'bg-bg-ink text-ink border-transparent',
  danger: 'bg-transparent text-danger border-rule',
}

export interface PillBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: PillIntent
  icon?: ReactNode
  children: ReactNode
}

/** Inbox-style action pill. ≥44px tap target via min sizing. */
export function PillBtn({
  intent = 'neutral',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: PillBtnProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-9 min-w-11 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-3 text-[12.5px] font-semibold',
        INTENT[intent],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
