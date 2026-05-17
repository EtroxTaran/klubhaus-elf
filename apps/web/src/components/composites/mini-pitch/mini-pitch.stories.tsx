import type { Meta, StoryObj } from '@storybook/react'
import { MiniPitch } from '@/components/composites/mini-pitch/mini-pitch'

const meta = {
  title: 'Composites/MiniPitch',
  component: MiniPitch,
  parameters: { layout: 'centered' },
  args: { size: 48, className: 'text-ink-mute' },
} satisfies Meta<typeof MiniPitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
