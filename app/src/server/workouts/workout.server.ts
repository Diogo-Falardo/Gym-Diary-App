import { db } from "#/db"
import { table_exercises, table_workoutExercises, table_workoutPerformance, table_workouts } from "#/db/schema";
import { selectWorkoutSchema } from "#/db/schemas/workouts/workouts.schemas";
import type { outputWorkout } from "#/db/schemas/workouts/workouts.types";
import { log } from "#/middlewares/logger";
import { addDays, startOfDay } from "date-fns";
import { and, eq, gte, lt } from "drizzle-orm";


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

  // tests the date
  // gte = greater than or equal to start of day
  // lt = less than end of the day
  static async workoutPerformanceDateChecker(date: Date): Promise<boolean> {
    try {
      const start = startOfDay(date) // 00:00:00 of the given day
      const end = addDays(start, 1) // 00:00:00 of the next day

      const [performance] = await db.select().from(table_workoutPerformance).where(and
        (gte(table_workoutPerformance.date, start), // date ≥ start of day
          lt(table_workoutPerformance.date, end))) // date < start of next day

      return !!performance // true if a record was found
    } catch (error) {
      log.withError(error).withMetadata(date).error("Workouts.workoutPerformanceDateChecker")
      throw new Error("Error loading workout!")
    }
  }

  /**
   * @returns the workoutPerformance id
   * */
  static async saveWorkoutPerformance(workoutId: string): Promise<string> {
    try {
      const [workout] = await db.insert(table_workoutPerformance).values({ workoutId }).returning()
      if (!workout) {
        throw new Error("Workout not saved! Internal server error")
      }

      return workout.id
    } catch (error) {
      log.withError(error).withMetadata({ workoutId }).error("Workouts.saveWorkoutPerformance")
      throw new Error("Workout not saved! Internal server error")
    }
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

/*
 * this funtion will be limited to one workout per day
 * @return workoutPerformance Id
 **/
export async function saveWorkout(workoutId: string): Promise<string> {
  const currentDate = new Date()

  // search if in workout performance there is already an
  // workout in that date
  const alreadySaved = await Workouts.workoutPerformanceDateChecker(currentDate)
  if (alreadySaved) {
    throw new Error("Workout already saved today")
  }

  const performanceId = await Workouts.saveWorkoutPerformance(workoutId)

  return performanceId
}

