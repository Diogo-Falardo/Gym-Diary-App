import { sfGetExercices } from "#/server/exercices/exercises.functions";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const useGetExercicesOptions = () =>
  queryOptions({
    queryKey: ["exercices"],
    queryFn: () => sfGetExercices()
  })

export function useGetExercices() {
  return useQuery(useGetExercicesOptions())
}

