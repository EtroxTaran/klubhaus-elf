import type { Meta, StoryObj } from '@storybook/react'
import { ScreenShell } from '@/components/layout/screen-shell'

const meta = {
  title: 'Layout/ScreenShell',
  component: ScreenShell,
  parameters: { layout: 'fullscreen' },
  args: {
    label: 'Beispielbildschirm',
    children: (
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h1 className="font-display text-2xl font-extrabold text-ink">Hafenstadt</h1>
        <p className="text-sm text-ink-mute">
          Die mobile-first Papier-Oberfläche. Tokens kaskadieren aus den
          <code> data-scheme</code>/<code>data-theme</code> Attributen.
        </p>
        <div className="rounded-lg border border-rule bg-card p-3 text-sm text-ink">
          Karte auf der Papierfläche.
        </div>
      </div>
    ),
  },
} satisfies Meta<typeof ScreenShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
