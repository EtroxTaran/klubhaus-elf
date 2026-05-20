// @soccer-manager/db — PostgreSQL + Drizzle, the system of record (ADR-0021).
//
// Single source of truth: the Drizzle schema in ./schema. Runtime validation
// for server-function boundaries is derived from it via drizzle-zod (no
// codegen step, types stay in sync with the table definitions). Driver wiring
// (node-postgres / Hetzner connection, pooling, migrations runner) lands in
// the next engineering wave with the ADR-0004 domain-model rework.

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { clubs } from './schema'

export type { Club, NewClub } from './schema'
export * as schema from './schema'

export const clubInsertSchema = createInsertSchema(clubs)
export const clubSelectSchema = createSelectSchema(clubs)

export type ClubInsert = z.infer<typeof clubInsertSchema>
export type ClubSelect = z.infer<typeof clubSelectSchema>
