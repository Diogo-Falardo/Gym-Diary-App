import { createServerFn } from '@tanstack/react-start'
import { indexUser } from './user.server'

export const sfIndexUser = createServerFn({ method: 'POST' })
  .inputValidator((data: { clerkId: string }) => data)
  .handler(async ({ data }) => {
    return await indexUser(data.clerkId)
  })
