import { createServerFn } from '@tanstack/react-start'
import {
  createNewExercise,
  createNewWorkout,
  fullWorkoutInfo,
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

export const sfFullWorkoutInfo = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { userId: string; workoutId: string }) => data)
  .handler(async ({ data }) => {
    return await fullWorkoutInfo(data.userId, data.workoutId)
  })

export const sfCreateNewExercise = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { userId: string; workoutId: string; name: string }) => data,
  )
  .handler(async ({ data }) => {
    return await createNewExercise(data.userId, data.workoutId, data.name)
  })
