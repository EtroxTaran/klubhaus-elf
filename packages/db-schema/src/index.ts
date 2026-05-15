import { z } from 'zod'

export const recordIdSchema = z.string().regex(/^[a-z_]+:[A-Za-z0-9_-]+$/)

export type RecordId = z.infer<typeof recordIdSchema>
