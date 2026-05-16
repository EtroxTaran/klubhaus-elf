import { cn } from '@/lib/utils'

export interface FormStripProps {
  /** Sequence of S (Sieg) / U (Unentschieden) / N (Niederlage). */
  form: string
  className?: string
}

function toneClass(c: string): string {
  if (c === 'S') return 'bg-ok'
  if (c === 'N') return 'bg-danger'
  return 'bg-warn'
}

/** Five glyph-and-colour form tiles. The letter is always visible. */
export function FormStrip({ form, className }: FormStripProps) {
  const chars = form.split('')
  return (
    <div
      className={cn('flex gap-[3px]', className)}
      role="img"
      aria-label={`Form: ${chars.join(' ')}`}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex h-[18px] w-[18px] items-center justify-center rounded-[5px] font-mono text-[10px] font-extrabold text-white',
            toneClass(c),
          )}
        >
          {c}
        </span>
      ))}
    </div>
  )
}
