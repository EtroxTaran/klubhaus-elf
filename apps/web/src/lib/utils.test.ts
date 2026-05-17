import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('supports clsx object and array syntax', () => {
    expect(cn('a', { b: true, c: false }, ['d', 'e'])).toBe('a b d e')
  })

  it('merges conflicting tailwind utilities, last wins', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('text-ink', 'text-accent')).toBe('text-accent')
  })

  it('keeps non-conflicting tailwind utilities', () => {
    expect(cn('bg-card', 'text-ink', 'border-rule')).toBe('bg-card text-ink border-rule')
  })
})
