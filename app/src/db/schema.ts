import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  doublePrecision,
  integer,
} from 'drizzle-orm/pg-core'

export const table_exercises = pgTable("exercises", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 64 }).notNull(),
})

export const table_workouts = pgTable('workouts', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 64 }).notNull(),
})

export const table_workoutExercises = pgTable('workout_exercises', {
  id: uuid().defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => table_workouts.id),
  exerciseId: uuid("exercise_id").notNull()
    .references(() => table_exercises.id),
})

export const table_workoutPerformance = pgTable("workout_performance", {
  id: uuid().defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => table_workouts.id),
  date: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const table_workoutExercisesPerformance = pgTable('workout_exercises_performance', {
  id: uuid().defaultRandom().primaryKey(),
  workoutPerformanceId: uuid("workout_performance_id").notNull().references(() => table_workoutPerformance.id),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => table_workoutExercises.id),
  setNumber: integer('set_number').notNull(),
  reps: integer(),
  weight: doublePrecision(),
})
