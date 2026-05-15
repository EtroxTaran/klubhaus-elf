/// <reference types="vite/client" />
import { createRootRoute, Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import '../styles/app.css'

export const Route = createRootRoute({
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>soccer-manager</title>
        <meta name="description" content="Offline-first Fußballmanager im Anstoß-Stil." />
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        {children}
        <script defer src="/sw-register.js" />
      </body>
    </html>
  )
}
