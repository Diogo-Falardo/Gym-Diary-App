import { z } from "zod"
import type {
  outputWorkout,
  outputWorkoutPerformanceSchema,
  outputWorkoutPerformanceExerciseSchema,
  outputWorkoutPerformanceSetSchema,
} from "./workouts.schemas"

export type outputWorkout = z.infer<typeof outputWorkout>
export type outputWorkoutPerformance = z.infer<typeof outputWorkoutPerformanceSchema>
export type outputWorkoutPerformanceExercise = z.infer<typeof outputWorkoutPerformanceExerciseSchema>
export type outputWorkoutPerformanceSet = z.infer<typeof outputWorkoutPerformanceSetSchema>
