// Standalone Zod validation mirror of the PostgreSQL system of record
// (ADR-0021, supersedes ADR-0001). Intentionally dependency-free (zod only)
// so this stays a self-contained composite project. The drizzle-derived
// schemas live in @soccer-manager/db; this package is the boundary-validation
// mirror those map onto. The previous SurrealDB `recordId` regex was removed —
// SurrealDB is no longer the primary store.

import { z } from 'zod'

export const clubInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  city: z.string(),
  createdAt: z.date().optional(),
})

export const clubSelectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  city: z.string(),
  createdAt: z.date(),
})

export type ClubInsert = z.infer<typeof clubInsertSchema>
export type ClubSelect = z.infer<typeof clubSelectSchema>
