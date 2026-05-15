import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      srcDir: 'src/workers',
      filename: 'service-worker.ts',
      manifest: {
        name: 'soccer-manager',
        short_name: 'Soccer',
        description: 'Offline-first Fußballmanager im Anstoß-Stil.',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/',
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.method === 'GET' && request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
            },
          },
          {
            urlPattern: ({ request }) =>
              request.method === 'GET' &&
              ['script', 'style', 'image', 'font'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets',
            },
          },
        ],
      },
    }),
  ],
})
