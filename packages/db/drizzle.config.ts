import { defineConfig } from 'drizzle-kit'

// Migrations are forward-only and generated from src/schema.ts.
// DATABASE_URL is injected via the secrets pipeline (sops+age+direnv, F11);
// never hard-code credentials.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://localhost:5432/soccer_manager',
  },
})
