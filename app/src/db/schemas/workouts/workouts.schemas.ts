import { table_workoutExercises, table_workoutExercisesPerformance, table_workoutPerformance, table_workouts } from "#/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"

export const selectWorkoutSchema = createSelectSchema(table_workouts)
export const insertWorkoutSchema = createInsertSchema(table_workouts)

export const selectWorkoutExerciseSchema = createSelectSchema(table_workoutExercises)
export const insertWorkoutExerciseSchema = createInsertSchema(table_workoutExercises)

export const selectWorkoutPerformanceSchema = createSelectSchema(table_workoutPerformance)
export const insertWorkoutPerformanceSchema = createInsertSchema(table_workoutPerformance)

export const selectWorkoutExercisePermormanceSchema = createSelectSchema(table_workoutExercisesPerformance)
export const insertWorkoutExercisePermormanceSchema = createInsertSchema(table_workoutExercisesPerformance)
