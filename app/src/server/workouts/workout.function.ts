import { getWorkoutPerformanceSchema, saveWorkoutInputSchema } from "#/db/schemas/workouts/workouts.schemas"
import { createServerFn } from "@tanstack/react-start"
import { getWorkoutPerformamance, getWorkouts, saveWorkout } from "./workout.server"

export const sfGetWorkouts = createServerFn({ method: "GET" }).handler(async () => await getWorkouts())

export const sfSaveWorkout = createServerFn({ method: "POST" })
  .inputValidator(saveWorkoutInputSchema)
  .handler(async ({ data }) => saveWorkout(data.workoutId))

export const sfGetWorkoutPerformance = createServerFn({ method: "GET" })
  .inputValidator(getWorkoutPerformanceSchema)
  .handler(async ({ data }) => getWorkoutPerformamance(data.id))

