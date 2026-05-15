import { generateSW } from 'workbox-build'

const { count, size, warnings } = await generateSW({
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  globDirectory: 'dist/client',
  globPatterns: ['**/*.{js,css,html,svg,webmanifest}'],
  navigateFallback: '/offline.html',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.method === 'GET' && request.mode === 'navigate',
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
  skipWaiting: true,
  swDest: 'dist/client/service-worker.js',
})

for (const warning of warnings) {
  console.warn(warning)
}

console.log(`Generated service worker with ${count} precached files (${size} bytes).`)
