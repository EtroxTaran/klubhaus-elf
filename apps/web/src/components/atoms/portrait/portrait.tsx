import { cn } from '@/lib/utils'

export interface PortraitProps {
  name: string
  size?: number
  variant?: 'player' | 'staff'
  className?: string
}

/** Deterministic initials avatar (no photo uploads in v1, by design). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  if (first === undefined) return '?'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? first
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export function Portrait({ name, size = 48, variant = 'staff', className }: PortraitProps) {
  return (
    <span
      role="img"
      aria-label={name}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={cn(
        'inline-grid place-items-center rounded-full bg-accent-soft font-display font-extrabold text-accent',
        variant === 'player' && 'ring-2 ring-accent',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
