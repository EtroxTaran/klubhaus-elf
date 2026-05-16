import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  // CI flake control: retry transient failures (a genuinely broken test
  // still fails every attempt) and make `trace: 'on-first-retry'`
  // meaningful. Never used to mask a real failure — root causes are fixed
  // at source (see docs/30-Implementation/ci-and-review-process.md).
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    serviceWorkers: 'allow',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command:
      'pnpm --filter @soccer-manager/web build && pnpm --filter @soccer-manager/web exec vite preview --host localhost --port 3000',
    reuseExistingServer: !process.env.CI,
    url: 'http://localhost:3000',
  },
})
