import type { Meta, StoryObj } from '@storybook/react'
import { Crest } from '@/components/atoms/crest/crest'

const meta = {
  title: 'Atoms/Crest',
  component: Crest,
  parameters: {
    layout: 'centered',
  },
  args: {
    shape: 'heater',
    a: '#0b5f3a',
    b: '#e8ddc5',
    charge: 'ship',
    motto: 'Mare Nostrum',
    size: 120,
    label: 'FC Hafenstadt',
  },
} satisfies Meta<typeof Crest>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Roundel: Story = {
  args: { shape: 'roundel', charge: 'wave', a: '#1d4ed8', b: '#fff', motto: '' },
}

export const Gonfalon: Story = {
  args: { shape: 'gonfalon', charge: 'lion', a: '#7a1f2b', b: '#f4c542' },
}
