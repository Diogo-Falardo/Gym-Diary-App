import { z } from 'zod'

export const workoutSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  name: z
    .string()
    .min(1, { message: 'name is required' })
    .max(64, { message: 'Max of 64 characters in name!' }),
  createdAt: z.date(),
})

export const createWorkoutSchema = workoutSchema.pick({
  name: true,
})

export type typeWorkoutSchema = z.infer<typeof workoutSchema>
export type typeCreateWorkoutSchema = z.infer<typeof createWorkoutSchema>

export const workoutExerciseSchema = z.object({
  id: z.uuid(),
  workoutId: z.uuid(),
  name: z
    .string()
    .min(1, { message: 'name is required' })
    .max(64, { message: 'Max of 64 characters in name!' }),
  createdAt: z.date(),
})

export const createWorkoutExerciseSchema = workoutExerciseSchema.pick({
  name: true,
})

export type typeWorkoutExerciseSchema = z.infer<typeof workoutExerciseSchema>
export type typeCreateWorkoutExerciseSchema = z.infer<
  typeof createWorkoutExerciseSchema
>

export const workoutExercisesPerformanceSchema = z.object({
  id: z.uuid(),
  exerciseId: z.uuid(),
  setNumber: z.number(),
  reps: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
})

export const createWorkoutExercisePerformanceSchema =
  workoutExercisesPerformanceSchema.pick({
    reps: true,
    weight: true,
  })

export type typeWorkoutExercisePerformanceSchema = z.infer<
  typeof workoutExercisesPerformanceSchema
>
