import { randomGymExercises, randomGymWorkouts } from '#/data/generator.data'
import { db } from '#/db'
import {
  table_exercises,
  table_workoutExercises,
  table_workouts,
} from '#/db/schema'
import { createServerFn } from '@tanstack/react-start'

export async function generateExercices() {
  await db.insert(table_exercises).values(
    randomGymExercises.map((name) => ({ name })),
  )
}

export async function generateWorkouts() {
  let exercises = await db.select().from(table_exercises)

  if (exercises.length === 0) {
    await generateExercices()
    exercises = await db.select().from(table_exercises)
  }

  const exerciseIdByName = new Map(
    exercises.map((exercise) => [exercise.name, exercise.id]),
  )

  for (const workout of randomGymWorkouts) {
    const [createdWorkout] = await db
      .insert(table_workouts)
      .values({ name: workout.name })
      .returning()

    const workoutExercises = workout.exercises.flatMap((exerciseName: string) => {
      const exerciseId = exerciseIdByName.get(exerciseName)
      if (!exerciseId) return []

      return [
        {
          workoutId: createdWorkout.id,
          exerciseId,
        },
      ]
    })

    if (workoutExercises.length > 0) {
      await db.insert(table_workoutExercises).values(workoutExercises)
    }
  }
}

export const sfGenerateWorkouts = createServerFn({ method: "POST" }).handler(async () => await generateWorkouts())
