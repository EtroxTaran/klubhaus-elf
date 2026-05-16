import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom does not implement scrollTo; TanStack Router's scroll restoration
// calls it on navigation.
vi.stubGlobal('scrollTo', vi.fn())

// globals:false means RTL's automatic afterEach cleanup is not registered.
afterEach(() => {
  cleanup()
})
