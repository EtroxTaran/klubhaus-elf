import type { Decorator } from '@storybook/react'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'

// Screens import `Link` from @tanstack/react-router, which needs a router in
// context. Give every story its own memory router whose routes all render the
// story, so Links render as inert anchors and never navigate away.
export const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute()
  const StoryRoute = () => <Story />
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: StoryRoute,
  })
  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: StoryRoute,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, catchAllRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return <RouterProvider router={router} />
}
