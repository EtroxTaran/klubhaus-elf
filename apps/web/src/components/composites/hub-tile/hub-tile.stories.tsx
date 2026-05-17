import type { Meta, StoryObj } from '@storybook/react'
import { Users } from 'lucide-react'
import { HubTile } from '@/components/composites/hub-tile/hub-tile'

const meta = {
  title: 'Composites/HubTile',
  component: HubTile,
  parameters: { layout: 'centered' },
  args: {
    icon: <Users size={18} />,
    label: 'Kader',
    sub: '24 Spieler · 3 verletzt',
    className: 'w-44',
  },
} satisfies Meta<typeof HubTile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithFlag: Story = { args: { flag: '2 Verträge laufen aus' } }
