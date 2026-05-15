/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../styles/app.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'soccer-manager' },
      {
        name: 'description',
        content: 'Offline-first Fußballmanager im Anstoß-Stil.',
      },
      { name: 'theme-color', content: '#0f172a' },
    ],
    links: [{ rel: 'manifest', href: '/manifest.webmanifest' }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <script defer src="/sw-register.js" />
      </body>
    </html>
  )
}
