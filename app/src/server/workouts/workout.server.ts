import { db } from "#/db"
import { table_exercises, table_workoutExercises, table_workouts } from "#/db/schema";
import { selectWorkoutSchema } from "#/db/schemas/workouts/workouts.schemas";
import type { outputWorkout } from "#/db/schemas/workouts/workouts.types";
import { eq } from "drizzle-orm";


class Workouts {

  static async exercices(workoutId: string): Promise<Array<{ exerciseId: string, name: string }>> {
    const exercices = await db.select().from(table_workoutExercises).where(eq(table_workoutExercises.workoutId, workoutId))
    let out: Array<{ exerciseId: string, name: string }> = []
    for (const { exerciseId } of exercices) {
      const [exercise] = await db.select().from(table_exercises).where(eq(table_exercises.id, exerciseId))
      out.push({ exerciseId, name: exercise.name })
    }
    return out
  }
}

export async function getWorkouts(): Promise<Array<outputWorkout>> {
  let workouts = await db.select().from(table_workouts)
  workouts = selectWorkoutSchema.array().parse(workouts)
  if (workouts.length === 0) {
    throw new Error("no workouts")
  }

  return Promise.all(workouts.map(async w => {
    const exercises = await Workouts.exercices(w.id)
    return {
      id: w.id,
      name: w.name,
      exercises
    }
  })
  )
}


