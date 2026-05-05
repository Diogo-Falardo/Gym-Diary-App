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
