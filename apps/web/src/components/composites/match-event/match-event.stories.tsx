import type { Meta, StoryObj } from '@storybook/react'
import { MatchEvent } from '@/components/composites/match-event/match-event'

const meta = {
  title: 'Composites/MatchEvent',
  component: MatchEvent,
  parameters: { layout: 'padded' },
  args: {
    min: "63'",
    kind: 'goal',
    title: 'Hartmann trifft zum 2:1!',
    sub: 'Flanke von rechts, Kopfball ins lange Eck.',
    score: '2:1',
  },
} satisfies Meta<typeof MatchEvent>

export default meta
type Story = StoryObj<typeof meta>

export const Goal: Story = {}

export const Feed: Story = {
  render: () => (
    <div className="w-80">
      <MatchEvent min="12'" kind="chance" title="Erste Chance" sub="Distanzschuss knapp vorbei." />
      <MatchEvent
        min="34'"
        kind="card"
        title="Gelb für Brandt"
        sub="Taktisches Foul im Mittelfeld."
      />
      <MatchEvent min="45'" kind="set" title="Eckstoß" sub="Kurz ausgeführt." />
      <MatchEvent
        min="63'"
        kind="goal"
        title="Hartmann trifft!"
        sub="Kopfball ins Eck."
        score="2:1"
      />
      <MatchEvent min="70'" kind="sub" title="Wechsel" sub="Keita für Vogt." />
      <MatchEvent min="90'" kind="whistle" title="Abpfiff" sub="Heimsieg." />
    </div>
  ),
}
