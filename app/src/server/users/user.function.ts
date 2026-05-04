import { createServerFn } from '@tanstack/react-start'
import {
  fetchUserInfoByUserId,
  indexUser,
  updateUserProfile,
} from './user.server'
import type { typeUserPatchSchema } from './user.schema'

export const sfIndexUser = createServerFn({ method: 'POST' })
  .inputValidator((data: { clerkId: string }) => data)
  .handler(async ({ data }) => {
    return await indexUser(data.clerkId)
  })

export const sfFetchUserInfoByUserId = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    return await fetchUserInfoByUserId(data.userId)
  })

export const sfUpdateUserProfile = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; profile: typeUserPatchSchema }) => data,
  )
  .handler(async ({ data }) => {
    return await updateUserProfile(data.userId, data.profile)
  })
