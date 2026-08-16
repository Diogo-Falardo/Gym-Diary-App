import { createServerFn } from "@tanstack/react-start";
import { getExercises } from "./exercises.server";
import type { outputExercise } from "#/db/schemas/exercises/exercises.types";
export const sfGetExercices = createServerFn({ method: "POST" }).handler(async (): Promise<Array<outputExercise>> => await getExercises())
