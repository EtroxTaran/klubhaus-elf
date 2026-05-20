// PostgreSQL schema — system of record (ADR-0021, supersedes ADR-0001).
//
// Schema-as-TypeScript via Drizzle: end-to-end inferred types, no codegen
// step. This is the seed; the full ADR-0004 domain model (clubs, players,
// contracts, leagues, fixtures, transfers, finances + the transactional
// outbox per ADR-0013) is reworked from the SurrealDB model in the next
// engineering wave. Graph-ish data (scouting, relationships) uses typed
// recursive CTEs, not a graph store.

import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const clubs = pgTable('clubs', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  city: text('city').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Club = typeof clubs.$inferSelect
export type NewClub = typeof clubs.$inferInsert
