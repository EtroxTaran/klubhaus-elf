import type { Meta, StoryObj } from '@storybook/react'
import { StatBar } from '@/components/atoms/stat-bar/stat-bar'

const meta = {
  title: 'Atoms/StatBar',
  component: StatBar,
  parameters: { layout: 'padded' },
  args: { label: 'Ballbesitz', a: 42, b: 58, mode: 'pct' },
} satisfies Meta<typeof StatBar>

export default meta
type Story = StoryObj<typeof meta>

export const Possession: Story = {}
export const Count: Story = { args: { label: 'Schüsse', a: 9, b: 14, mode: 'count' } }
export const ExpectedGoals: Story = {
  args: { label: 'xG', a: 1.2, b: 2.1, mode: 'xg', last: true },
}

export const LiveBlock: Story = {
  render: () => (
    <div className="w-80 rounded-[14px] border border-rule bg-card px-3.5 py-2">
      <StatBar label="Ballbesitz" a={42} b={58} mode="pct" />
      <StatBar label="Schüsse" a={9} b={14} mode="count" />
      <StatBar label="Aufs Tor" a={3} b={6} mode="count" />
      <StatBar label="xG" a={1.2} b={2.1} mode="xg" last />
    </div>
  ),
}
