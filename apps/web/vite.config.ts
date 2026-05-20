import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      // Mirror the tsconfig.json `@/*` path mapping so Rollup can resolve
      // alias imports inside TanStack Start's `?tsr-split=*` virtual modules
      // (newer @tanstack/react-start needs the alias declared in vite config,
      // not just tsconfig).
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  plugins: [tanstackStart(), viteReact(), tailwindcss()],
})
