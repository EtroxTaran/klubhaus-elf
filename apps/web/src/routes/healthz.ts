import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/healthz')({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          service: 'soccer-manager-web',
        }),
    },
  },
})
