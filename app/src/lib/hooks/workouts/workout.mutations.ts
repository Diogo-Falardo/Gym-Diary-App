import { sfSaveWorkout } from '#/server/workouts/workout.function';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSaveWorkout(workoutId: string) {
  return useMutation({
    mutationFn: async () => sfSaveWorkout({ data: { workoutId } })
  })
}
