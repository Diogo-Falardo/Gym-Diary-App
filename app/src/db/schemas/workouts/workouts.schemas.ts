import { table_workoutExercises, table_workoutExercisesPerformance, table_workoutPerformance, table_workouts } from "#/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"
import { z } from "zod"

export const selectWorkoutSchema = createSelectSchema(table_workouts)
export const insertWorkoutSchema = createInsertSchema(table_workouts)

export const selectWorkoutExerciseSchema = createSelectSchema(table_workoutExercises)
export const insertWorkoutExerciseSchema = createInsertSchema(table_workoutExercises)

export const selectWorkoutPerformanceSchema = createSelectSchema(table_workoutPerformance)
export const insertWorkoutPerformanceSchema = createInsertSchema(table_workoutPerformance)

export const saveWorkoutInputSchema = insertWorkoutPerformanceSchema.pick({
  workoutId: true,
})

export const selectWorkoutExercisePerformanceSchema = createSelectSchema(table_workoutExercisesPerformance)
export const insertWorkoutExercisePerformanceSchema = createInsertSchema(table_workoutExercisesPerformance)

export const outputWorkout = selectWorkoutSchema.extend({
  exercises: selectWorkoutExerciseSchema.pick({
    exerciseId: true,
  }).extend({
    name: z.string()
  }).array()
})


export const outputWorkoutPerformanceSetSchema = selectWorkoutExercisePerformanceSchema.pick({
  id: true,
  setNumber: true,
  reps: true,
  weight: true,
})

export const outputWorkoutPerformanceExerciseSchema = z.object({
  exerciseId: z.uuid(),
  name: z.string(),
  sets: outputWorkoutPerformanceSetSchema.array(),
})

export const outputWorkoutPerformanceSchema = selectWorkoutPerformanceSchema.pick({
  id: true,
  date: true,
}).extend({
  exercises: outputWorkoutPerformanceExerciseSchema.array(),
})

export const getWorkoutPerformanceSchema = selectWorkoutPerformanceSchema.pick({
  id: true
})
