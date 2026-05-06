import {
  sfFullWorkoutInfo,
  sfGetAllTheWorkoutsFromInternalUserId,
} from '#/server/workouts/workout.function'
import { useQuery } from '@tanstack/react-query'

export function useSfGetAllTheWorkoutsFromInternalUserId({
  userId,
}: {
  userId: string
}) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => sfGetAllTheWorkoutsFromInternalUserId({ data: { userId } }),
  })
}

export function useSfFullWorkoutInfo({
  userId,
  workoutId,
}: {
  userId: string
  workoutId: string
}) {
  return useQuery({
    queryKey: ['workout', userId, workoutId],
    queryFn: () => sfFullWorkoutInfo({ data: { userId, workoutId } }),
  })
}
