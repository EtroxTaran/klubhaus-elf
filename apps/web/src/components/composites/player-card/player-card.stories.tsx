import type { Meta, StoryObj } from '@storybook/react'
import { PlayerCard } from '@/components/composites/player-card/player-card'
import { SQUAD } from '@/screens/fixtures'

const [samplePlayer] = SQUAD
if (!samplePlayer) throw new Error('SQUAD fixture is empty')

const meta = {
  title: 'Composites/PlayerCard',
  component: PlayerCard,
  parameters: { layout: 'padded' },
  args: { player: samplePlayer, className: 'w-80' },
} satisfies Meta<typeof PlayerCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Squad: Story = {
  render: () => (
    <div className="w-80">
      {SQUAD.slice(0, 5).map((p) => (
        <PlayerCard key={p.shirt} player={p} />
      ))}
    </div>
  ),
}
