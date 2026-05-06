import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  date,
  doublePrecision,
  integer,
} from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull(),
  username: varchar({ length: 15 }),
  dateOfBirth: date('date_of_birth'),
  height: doublePrecision('height'), // in centimeters
  weight: doublePrecision('weight'), // in kilograms
  createdAt: timestamp('created_at').defaultNow(),
})

export const workoutsTable = pgTable('workouts', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  name: varchar({ length: 64 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const workoutsExercisesTable = pgTable('workouts_exercises', {
  id: uuid().defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workoutsTable.id),
  name: varchar({ length: 64 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const exercisesPerformanceTable = pgTable('exercises_perfomance', {
  id: uuid().defaultRandom().primaryKey(),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => workoutsExercisesTable.id),
  setNumber: integer('set_number').notNull(),
  reps: integer(),
  weight: doublePrecision(),
})
