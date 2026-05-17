import type { Meta, StoryObj } from '@storybook/react'
import { StrBar } from '@/components/atoms/str-bar/str-bar'

const meta = {
  title: 'Atoms/StrBar',
  component: StrBar,
  parameters: { layout: 'centered' },
  args: { n: 7 },
} satisfies Meta<typeof StrBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      {[3, 5, 7, 9, 10].map((n) => (
        <StrBar key={n} n={n} />
      ))}
    </div>
  ),
}
