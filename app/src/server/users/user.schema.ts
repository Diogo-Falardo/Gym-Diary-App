import { z } from 'zod'

export const userSchema = z.object({
  id: z.uuid(),
  clerkId: z.string(),
  username: z
    .string()
    .min(3, { message: 'Minimum of 3 characters in username!' })
    .max(15, { message: 'Max of 15 characters in username!' })
    .optional()
    .nullable(),
  dateOfBirth: z.string().optional().nullable(),
  height: z.number().optional().nullable(),
  weight: z.number().optional().nullable(),
  createdAt: z.date(),
})
export type typeUserSchema = z.infer<typeof userSchema>
