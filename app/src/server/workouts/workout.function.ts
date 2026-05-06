import { createServerFn } from '@tanstack/react-start'
import {
  createNewExercise,
  createNewSet,
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

export const sfCreateNewSet = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { exerciseId: string; reps: number; weight: number }) => data,
  )
  .handler(async ({ data }) => {
    return await createNewSet(data.exerciseId, data.reps, data.weight)
  })
