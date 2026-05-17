/// <reference types="vite/client" />
import { createRootRoute, Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '../i18n/init'
import { ThemeProvider } from '../theme/theme-provider'
import '../styles/app.css'

export const Route = createRootRoute({
  component: RootComponent,
})

// Applied before hydration so the paper/ink scheme never flashes.
const NO_FLASH = `(function(){try{var s=localStorage.getItem('ap.scheme');var c=localStorage.getItem('ap.club');var r=document.documentElement;if(s==='light'||s==='dark')r.setAttribute('data-scheme',s);if(c)r.setAttribute('data-theme','A_'+c);}catch(e){}})();`

function RootComponent() {
  return (
    <RootDocument>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </I18nextProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de" data-scheme="light" data-theme="A_hafenstadt">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Aurelia Premier</title>
        <meta name="description" content="Offline-first Fußballmanager im Anstoß-Stil." />
        <meta name="theme-color" content="#f4ede0" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        {children}
        <script defer src="/sw-register.js" />
      </body>
    </html>
  )
}
