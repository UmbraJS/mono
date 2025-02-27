import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  const db = hubDatabase()
  return drizzle(db, { schema })
}

export type User = typeof tables.user.$inferSelect
export type Session = typeof tables.session.$inferSelect
export type Account = typeof tables.account.$inferSelect
export type Verification = typeof tables.verification.$inferSelect
