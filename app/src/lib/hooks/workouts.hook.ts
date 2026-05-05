import { sfGetAllTheWorkoutsFromInternalUserId } from '#/server/workouts/workout.function'
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
