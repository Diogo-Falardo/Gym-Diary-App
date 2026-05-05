import { createServerFn } from '@tanstack/react-start'
import {
  createNewWorkout,
  getAllTheWorkoutsFromInternalUserId,
} from './workout.server'

export const sfGetAllTheWorkoutsFromInternalUserId = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    return await getAllTheWorkoutsFromInternalUserId(data.userId)
  })

export const sfCreateNewWorkout = createServerFn({ method: 'POST' })
  .inputValidator((data: { userId: string; name: string }) => data)
  .handler(async ({ data }) => {
    return await createNewWorkout(data.userId, data.name)
  })
