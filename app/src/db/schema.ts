import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  date,
  doublePrecision,
} from 'drizzle-orm/pg-core'

export const todos = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  username: varchar({ length: 15 }),
  dateOfBirth: date('date_of_birth'),
  height: doublePrecision('height'), // in centimeters
  weight: doublePrecision('weight'), // in kilograms
  createdAt: timestamp('created_at').defaultNow(),
})
