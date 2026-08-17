import { db } from "#/db"
import { table_exercises, table_workoutExercises, table_workoutExercisesPerformance, table_workoutPerformance, table_workouts } from "#/db/schema";
import { outputWorkoutPerformanceSchema, outputWorkoutPerformanceSetSchema, selectWorkoutSchema } from "#/db/schemas/workouts/workouts.schemas";
import type { outputWorkout, outputWorkoutPerformance, outputWorkoutPerformanceExercise, outputWorkoutPerformanceSet } from "#/db/schemas/workouts/workouts.types";
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

  static async getWorkoutPerformance(workoutPerformanceId: string): Promise<{ id: string, workoutId: string, date: Date }> {
    try {
      const [performance] = await db.select().from(table_workoutPerformance).where(eq(table_workoutPerformance.id, workoutPerformanceId))
      if (!performance) {
        throw new Error("Workout not found")
      }

      return performance
    } catch (error) {
      log.withError(error).withMetadata({ workoutPerformanceId }).error("Workouts.getWorkoutPerformance")
      throw new Error("Internal server error")
    }
  }

  static async getWorkoutExercisePerformance(workoutPerformanceId: string, exerciseId: string): Promise<Array<outputWorkoutPerformanceSet>> {
    try {
      const exercisePerformance = await db.select().from(table_workoutExercisesPerformance).where(and(eq(table_workoutExercisesPerformance.workoutPerformanceId, workoutPerformanceId), eq(table_workoutExercisesPerformance.exerciseId, exerciseId)))

      return outputWorkoutPerformanceSetSchema.array().parse(exercisePerformance)
    } catch (error) {
      log.withError(error).withMetadata({ workoutPerformanceId, exerciseId }).error("Workouts.getWorkoutExercisePerformance")
      throw new Error("Internal server error")
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
 * limited to one workout per day
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

/**
 *  
 * */
export async function getWorkoutPerformamance(workoutPerformanceId: string): Promise<outputWorkoutPerformance> {

  const workoutPerformance = await Workouts.getWorkoutPerformance(workoutPerformanceId)

  const loadWorkoutExercices = await Workouts.exercices(workoutPerformance.workoutId)

  let exercicesPerformance: Array<outputWorkoutPerformanceExercise> = []
  for (const exercise of loadWorkoutExercices) {
    exercicesPerformance.push({
      ...exercise,
      sets: await Workouts.getWorkoutExercisePerformance(workoutPerformanceId, exercise.exerciseId)
    })
  }

  return outputWorkoutPerformanceSchema.parse({
    id: workoutPerformance.id,
    date: workoutPerformance.date,
    exercises: exercicesPerformance
  })

}
