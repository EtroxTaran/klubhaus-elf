import type { Meta, StoryObj } from '@storybook/react'
import { BreakBar } from '@/components/atoms/break-bar/break-bar'

const meta = {
  title: 'Atoms/BreakBar',
  component: BreakBar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BreakBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    rows: [
      { label: 'Gehälter', value: 52, color: 'var(--c-accent)' },
      { label: 'Stadion', value: 28, color: 'var(--color-ok)' },
      { label: 'Sonstiges', value: 20, color: 'var(--color-warn)' },
    ],
    className: 'w-64',
  },
}
