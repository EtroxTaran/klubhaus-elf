import type { Meta, StoryObj } from '@storybook/react'

// Documentation-only page: it has no component, so opt out of autodocs.
const meta = {
  title: 'Foundations/Design Tokens',
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const COLORS: Array<{ cls: string; name: string }> = [
  { cls: 'bg-bg', name: 'bg' },
  { cls: 'bg-bg-ink', name: 'bg-ink' },
  { cls: 'bg-card', name: 'card' },
  { cls: 'bg-accent', name: 'accent' },
  { cls: 'bg-accent-soft', name: 'accent-soft' },
  { cls: 'bg-ok', name: 'ok' },
  { cls: 'bg-warn', name: 'warn' },
  { cls: 'bg-danger', name: 'danger' },
]

export const Colours: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3">
      {COLORS.map((c) => (
        <div key={c.name} className="flex flex-col gap-1">
          <div className={`h-16 rounded-lg border border-rule ${c.cls}`} />
          <span className="font-mono text-[11px] text-ink-mute">--c-{c.name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-4 text-ink">
      <p className="font-display text-3xl font-extrabold">Newsreader — Display / Headlines</p>
      <p className="font-sans text-base">Inter — UI chrome, body und Controls.</p>
      <p className="font-mono text-base tabular-nums">JetBrains Mono — 12.500 € · 2,4 Mio. €</p>
    </div>
  ),
}

export const RadiusAndSpacing: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4 text-ink">
      {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl'].map((r) => (
        <div key={r} className="flex flex-col items-center gap-1">
          <div className={`h-16 w-16 border border-rule bg-card ${r}`} />
          <span className="font-mono text-[11px] text-ink-mute">{r}</span>
        </div>
      ))}
    </div>
  ),
}

export const Motion: Story = {
  render: () => (
    <div className="flex flex-col gap-3 text-ink">
      <span className="inline-block h-3 w-3 rounded-full bg-accent [animation:var(--animate-pulse-dot)]" />
      <p className="text-sm text-ink-mute">
        Tokens: <code>--animate-event-in</code>, <code>--animate-cheer</code>,
        <code> --animate-ticker-slide</code>, <code>--animate-pulse-dot</code> — alle unter
        <code> prefers-reduced-motion</code> neutralisiert.
      </p>
    </div>
  ),
}
