import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

export const todos = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),

  createdAt: timestamp('created_at').defaultNow(),
})
