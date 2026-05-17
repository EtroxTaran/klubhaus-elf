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

// Breakpoints from the design brief (TASKS Q.1): phone ≤768 · tablet
// 769–1199 · desktop ≥1200. Mobile-first, so phone is the default frame.
const aureliaViewports = {
  phone: {
    name: 'Phone · 390',
    styles: { width: '390px', height: '844px' },
    type: 'mobile' as const,
  },
  tablet: {
    name: 'Tablet · 1024',
    styles: { width: '1024px', height: '768px' },
    type: 'tablet' as const,
  },
  desktop: {
    name: 'Desktop · 1440',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop' as const,
  },
}

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withRouter, withTheme, withI18n],
  parameters: {
    backgrounds: { disable: true },
    viewport: {
      viewports: aureliaViewports,
      defaultViewport: 'phone',
    },
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
