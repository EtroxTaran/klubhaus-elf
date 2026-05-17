import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ScreenShellProps {
  children: ReactNode
  /** Accessible name for the screen landmark. */
  label?: string
  className?: string
}

/**
 * Production screen frame: paper/ink token surface, mobile-first centered
 * column. Tokens cascade from the `<html>` data-scheme/data-theme attributes
 * set by ThemeProvider, so this component is scheme- and club-agnostic.
 */
export function ScreenShell({ children, label, className }: ScreenShellProps) {
  return (
    <main aria-label={label} className={cn('min-h-dvh bg-bg text-ink font-sans', className)}>
      <div data-shell-column className="mx-auto flex min-h-dvh w-full max-w-[28rem] flex-col">
        {children}
      </div>
    </main>
  )
}
