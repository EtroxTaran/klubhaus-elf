import type { Meta, StoryObj } from '@storybook/react'
import { Jersey } from '@/components/atoms/jersey/jersey'

const meta = {
  title: 'Atoms/Jersey',
  component: Jersey,
  parameters: { layout: 'centered' },
  args: {
    pattern: 'stripes',
    a: '#0e3a5f',
    b: '#c8a45a',
    sleeveAccent: true,
    size: 180,
    label: 'Heimtrikot FC Hafenstadt',
  },
} satisfies Meta<typeof Jersey>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCrest: Story = {
  args: {
    crest: { shape: 'heater', a: '#0e3a5f', b: '#c8a45a', charge: 'ship' },
  },
}

export const Hoops: Story = {
  args: { pattern: 'hoops', a: '#7a1a1a', b: '#f0e8d8' },
}

export const Sash: Story = {
  args: { pattern: 'sash', a: '#1f4a3a', b: '#e8d28a' },
}

export const Back: Story = {
  args: { showBack: true, number: '9', name: 'Brody', a: '#0e3a5f', b: '#c8a45a' },
}
