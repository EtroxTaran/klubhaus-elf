import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'lcov'],
      thresholds: {
        autoUpdate: false,
        perFile: true,
        lines: 85,
        functions: 85,
        statements: 85,
        branches: 75,
        'packages/match-engine/**': {
          lines: 100,
          functions: 100,
          branches: 100,
        },
        'packages/game-data/**': {
          lines: 95,
          functions: 95,
          branches: 90,
        },
        'packages/db-schema/**': {
          lines: 100,
          functions: 100,
          branches: 100,
        },
      },
    },
    globals: false,
    include: ['apps/**/*.test.ts', 'apps/**/*.test.tsx', 'packages/**/*.test.ts'],
  },
})
