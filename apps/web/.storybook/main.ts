import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const projectSrc = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

// @storybook/builder-vite inherits the app's vite.config.ts. Its
// `tanstackStart()` plugin hijacks the build (server/client split + PWA) so
// Storybook never emits its preview `iframe.html`. Strip TanStack Start/Router
// (and any PWA) plugins; @storybook/react-vite supplies its own React plugin.
function isBlockedPlugin(plugin: unknown): boolean {
  if (!plugin || typeof plugin !== 'object' || !('name' in plugin)) return false
  const name = String((plugin as { name?: unknown }).name ?? '')
  return (
    name.includes('tanstack') ||
    name.startsWith('tsr:') ||
    name.includes('vite-plugin-pwa') ||
    name.includes('nitro')
  )
}

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  viteFinal: async (viteConfig) => {
    const resolved = await Promise.all((viteConfig.plugins ?? []).flat(Number.POSITIVE_INFINITY))
    viteConfig.plugins = resolved.filter((plugin) => !isBlockedPlugin(plugin))
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@': projectSrc,
        },
      },
    })
  },
}

export default config
