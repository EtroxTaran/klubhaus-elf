import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { type RenderResult, render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/i18n/init'
import { ThemeProvider } from '@/theme/theme-provider'

const PATHS = [
  '/',
  '/posteingang',
  '/kader',
  '/anpfiff',
  '/spiel',
  '/finanzen',
  '/stadion',
  '/onboarding',
  '/karriere',
  '/identity',
] as const

function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nextProvider>
  )
}

/**
 * Renders a screen inside a real in-memory router so TanStack <Link>s resolve.
 * Every Phase-1 path is registered; `path` gets the screen under test, the
 * rest are stubs.
 */
export async function renderScreen(
  ui: ReactElement,
  path: (typeof PATHS)[number] = '/',
): Promise<RenderResult> {
  const rootRoute = createRootRoute({ component: Outlet })
  const children = PATHS.map((p) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: p,
      component: p === path ? () => ui : () => null,
    }),
  )
  const router = createRouter({
    routeTree: rootRoute.addChildren(children),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()
  return render(
    <Providers>
      {/* biome-ignore lint/suspicious/noExplicitAny: test router typing */}
      <RouterProvider router={router as any} />
    </Providers>,
  )
}
