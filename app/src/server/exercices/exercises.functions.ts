import type { outputExercice } from "#/db/schemas/exercises/exercices.types";
import { createServerFn } from "@tanstack/react-start";
import { getExercises } from "./exercices.server";

export const sfGetExercices = createServerFn({ method: "POST" }).handler(async (): Promise<Array<outputExercice>> => await getExercises())
