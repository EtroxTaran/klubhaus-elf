import type { Preview } from '@storybook/react'
import { CLUB_REGISTRY } from '@/theme/club-registry'
import { withI18n } from './decorators/with-i18n'
import { withRouter } from './decorators/with-router'
import { withTheme } from './decorators/with-theme'
import '../src/styles/app.css'

const clubItems = Object.values(CLUB_REGISTRY).map((club) => ({
  value: club.id,
  title: club.name,
}))

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withRouter, withTheme, withI18n],
  parameters: {
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Foundations', 'Atoms', 'Composites', 'Layout', 'Screens'],
      },
    },
  },
  globalTypes: {
    scheme: {
      description: 'Colour scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Scheme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    club: {
      description: 'Club accent theme',
      defaultValue: 'hafenstadt',
      toolbar: {
        title: 'Club',
        icon: 'paintbrush',
        items: clubItems,
        dynamicTitle: true,
      },
    },
  },
}

export default preview
