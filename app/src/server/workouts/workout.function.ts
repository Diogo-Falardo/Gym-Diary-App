import { createServerFn } from "@tanstack/react-start";
import { getWorkouts } from "./workout.server";

export const sfGetWorkouts = createServerFn({ method: "GET" }).handler(async () => await getWorkouts())
