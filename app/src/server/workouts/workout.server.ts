import { db } from '#/db'
import {
  exercisesPerformanceTable,
  workoutsExercisesTable,
  workoutsTable,
} from '#/db/schema'
import { log } from '#/middlewares/logger'
import { eq, sql } from 'drizzle-orm'
import { fetchUserInfoByUserId } from '../users/user.server'
import {
  workoutExerciseSchema,
  workoutExercisesPerformanceSchema,
  workoutSchema,
  type typeWorkoutExercisePerformanceSchema,
  type typeWorkoutExerciseSchema,
  type typeWorkoutSchema,
} from './workout.schema'

class workoutServer {
  async createWorkout(
    userId: string,
    name: string,
  ): Promise<typeWorkoutSchema> {
    try {
      const workout = await db
        .insert(workoutsTable)
        .values({
          userId,
          name,
        })
        .returning()

      log.withMetadata({ workout }).info('workout created')
      return workoutSchema.parse(workout[0])
    } catch (error) {
      log.withMetadata({ error }).error('Failed to createWorkout')
      throw new Error('Failed to create workout!')
    }
  }

  async getWorkoutsFromInternalUserId(
    userId: string,
  ): Promise<Array<typeWorkoutSchema>> {
    try {
      const workouts = await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.userId, userId))

      return workoutSchema.array().parse(workouts)
    } catch (error) {
      log
        .withMetadata({ error })
        .error('Failed to getWorkoutsFromInternalUserId')
      throw new Error('Failed to load workouts!')
    }
  }

  async getWorkoutInfoFromWorkoutId(
    workoutId: string,
  ): Promise<typeWorkoutSchema> {
    try {
      const [workout] = await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.id, workoutId))

      if (!workout) {
        log.withMetadata({ workoutId }).error('workout was not found')
        throw new Error('Workout was not found!')
      }

      return workoutSchema.parse(workout)
    } catch (error) {
      log.withMetadata({ error }).error('Failed to getWorkoutInfoFromWorkoutId')
      throw new Error('Failed to load workout!')
    }
  }
}

class workoutExercisesServer {
  async createExercise(
    workoutId: string,
    name: string,
  ): Promise<typeWorkoutExerciseSchema> {
    try {
      const exercise = await db
        .insert(workoutsExercisesTable)
        .values({
          workoutId,
          name,
        })
        .returning()

      log.withMetadata({ exercise }).info('exercise created')
      return workoutExerciseSchema.parse(exercise[0])
    } catch (error) {
      log.withMetadata({ error }).error('Failed to createExercise')
      throw new Error('Failed to create exercise!')
    }
  }

  async getListOfExercisesFromWorkoutId(
    workoutId: string,
  ): Promise<Array<typeWorkoutExerciseSchema>> {
    try {
      const exercises = await db
        .select()
        .from(workoutsExercisesTable)
        .where(eq(workoutsExercisesTable.workoutId, workoutId))

      return workoutExerciseSchema.array().parse(exercises)
    } catch (error) {
      log
        .withMetadata({ error })
        .error('Failed to getListOfExercisesFromWorkoutId')
      throw new Error('Failed to load exercises!')
    }
  }
}

class workoutExercisePerformanceServer {
  async createSet(
    exerciseId: string,
    reps: number = 0,
    weight: number = 0,
  ): Promise<typeWorkoutExercisePerformanceSchema> {
    try {
      const [set] = await db
        .insert(exercisesPerformanceTable)
        .values({
          exerciseId,
          reps,
          weight,
          setNumber: sql`(SELECT COALESCE(MAX(set_number), 0) + 1 FROM exercises_performance WHERE exercise_id = ${exerciseId})`,
        })
        .returning()
      log.withMetadata({ set }).info('new set created')
      return workoutExercisesPerformanceSchema.parse(set)
    } catch (error) {
      log.withMetadata({ error }).error('Failed to createSet')
      throw new Error('Failed to create set!')
    }
  }

  async getSetsFromExerciseId(
    exerciseId: string,
  ): Promise<Array<typeWorkoutExercisePerformanceSchema>> {
    try {
      const sets = await db
        .select()
        .from(exercisesPerformanceTable)
        .where(eq(exercisesPerformanceTable.exerciseId, exerciseId))

      return workoutExercisesPerformanceSchema.array().parse(sets)
    } catch (error) {
      log.withMetadata({ error }).error('Failed to getSetsFromExerciseId')
      throw new Error('Failed to load sets!')
    }
  }
}

const workoutService = new workoutServer()
const workoutExerciseService = new workoutExercisesServer()
const workoutExercisePerfomanceService = new workoutExercisePerformanceServer()

export async function getAllTheWorkoutsFromInternalUserId(userId: string) {
  // check if user exist if not exist it will automatically throw an error
  await fetchUserInfoByUserId(userId)
  return await workoutService.getWorkoutsFromInternalUserId(userId)
}

/**
 *
 * @param userId
 * @param name Workout name
 * @returns current workout data
 */
export async function createNewWorkout(userId: string, name: string) {
  await fetchUserInfoByUserId(userId)
  return await workoutService.createWorkout(userId, name)
}

/**
 * This function will return all the info from an workout
 * such as name, exercise list with all the sets from each exercise
 *
 * @param userId
 * @param workoutId
 */
export async function fullWorkoutInfo(userId: string, workoutId: string) {
  await fetchUserInfoByUserId(userId)
  const workout = await workoutService.getWorkoutInfoFromWorkoutId(workoutId)

  const ListOfExercisesFromWorkout =
    await workoutExerciseService.getListOfExercisesFromWorkoutId(workout.id)

  const exercisesWithSets = await Promise.all(
    ListOfExercisesFromWorkout.map(async (exercise) => {
      const sets = await workoutExercisePerfomanceService.getSetsFromExerciseId(
        exercise.id,
      )
      return {
        ...exercise,
        sets,
      }
    }),
  )

  return {
    ...workout,
    exercises: exercisesWithSets,
  }
}
/**
 * Creates a new exercise inside a workout
 * @param userId
 * @param workoutId
 * @param name exercise name
 * @returns
 */
export async function createNewExercise(
  userId: string,
  workoutId: string,
  name: string,
) {
  await fetchUserInfoByUserId(userId)
  await workoutService.getWorkoutInfoFromWorkoutId(workoutId)

  return await workoutExerciseService.createExercise(workoutId, name)
}
