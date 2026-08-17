import { sfGetWorkoutPerformance, sfGetWorkouts } from "#/server/workouts/workout.function";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useGetWorkoutsOptions = () => queryOptions({
  queryKey: ["workouts"],
  queryFn: () => sfGetWorkouts()
})

export function useGetWorkouts() {
  return useQuery(useGetWorkoutsOptions())
}

export const useGetWorkoutPerformanceOptions = (workoutPerformanceId: string) => queryOptions({
  queryKey: ["workoutPerformance", workoutPerformanceId],
  queryFn: () => sfGetWorkoutPerformance({ data: { id: workoutPerformanceId } })
})

export function useGetWorkoutPerformance(workoutPerformanceId: string) {
  return useQuery(useGetWorkoutPerformanceOptions(workoutPerformanceId))
}
