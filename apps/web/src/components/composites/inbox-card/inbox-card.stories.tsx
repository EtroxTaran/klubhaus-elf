import type { Meta, StoryObj } from '@storybook/react'
import { PillBtn } from '@/components/atoms/pill-btn/pill-btn'
import { InboxCard } from '@/components/composites/inbox-card/inbox-card'

const meta = {
  title: 'Composites/InboxCard',
  component: InboxCard,
  parameters: { layout: 'padded' },
  args: {
    tone: 'board',
    senderLabel: 'Vorstand',
    from: 'Dr. Lehmann',
    title: 'Wir erwarten einen Platz unter den ersten Sechs.',
    body: 'Die Saisonziele wurden im Aufsichtsrat bestätigt. Halten Sie uns auf dem Laufenden.',
    time: 'vor 2 Std.',
    children: (
      <>
        <PillBtn intent="accept">Verstanden</PillBtn>
        <PillBtn intent="soft">Später</PillBtn>
      </>
    ),
  },
} satisfies Meta<typeof InboxCard>

export default meta
type Story = StoryObj<typeof meta>

export const Board: Story = {}
export const Media: Story = { args: { tone: 'media', senderLabel: 'Presse', from: 'Tagblatt' } }
export const Sponsor: Story = {
  args: { tone: 'sponsor', senderLabel: 'Sponsor', from: 'Hafen-Bräu' },
}
export const Scout: Story = { args: { tone: 'scout', senderLabel: 'Scouting', from: 'A. Vogt' } }
export const Fan: Story = { args: { tone: 'fan', senderLabel: 'Fanclub', from: 'Nordkurve' } }
