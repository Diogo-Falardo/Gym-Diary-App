import { sfGetWorkouts } from "#/server/workouts/workout.function";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useGetWorkoutsOptions = () => queryOptions({
  queryKey: ["workouts"],
  queryFn: () => sfGetWorkouts()
})

export function useGetWorkouts() {
  return useQuery(useGetWorkoutsOptions())
}
