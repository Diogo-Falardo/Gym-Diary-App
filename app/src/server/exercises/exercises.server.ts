import { db } from "#/db";
import { table_exercises } from "#/db/schema";
import type { outputExercise } from "#/db/schemas/exercises/exercices.types";
import { selectExerciceSchema } from "#/db/schemas/exercises/exercises.schemas";

export async function getExercises(): Promise<Array<outputExercise>> {
  const exercices = await db.select().from(table_exercises)
  return selectExerciceSchema.array().parse(exercices)
}
