import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const webSrc = fileURLToPath(new URL('./apps/web/src', import.meta.url))

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'lcov'],
      // Scope coverage to product logic. Framework wiring and test-only
      // helpers carry no unit-testable logic; thresholds for everything
      // else stay at the strict per-file 85/75 below.
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        'apps/web/src/test/**',
        'apps/web/src/routes/**',
        'apps/web/src/routeTree.gen.ts',
        'apps/web/src/router.tsx',
        'apps/web/src/server.ts',
        'apps/web/src/sw/**',
        'apps/web/src/workers/**',
        'apps/web/scripts/**',
        'scripts/**',
      ],
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
    projects: [
      {
        // apps/web — React components need a DOM environment for RTL.
        resolve: {
          alias: {
            '@': webSrc,
          },
        },
        test: {
          name: 'web',
          environment: 'jsdom',
          globals: false,
          setupFiles: ['./apps/web/src/test/setup.ts'],
          include: ['apps/**/*.test.ts', 'apps/**/*.test.tsx'],
        },
      },
      {
        // Engine/data packages stay node-only and fast.
        test: {
          name: 'node',
          environment: 'node',
          globals: false,
          include: ['packages/**/*.test.ts'],
        },
      },
    ],
  },
})
