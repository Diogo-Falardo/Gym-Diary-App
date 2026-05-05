import { db } from '#/db'
import { workoutsTable } from '#/db/schema'
import { log } from '#/middlewares/logger'
import { eq } from 'drizzle-orm'
import { fetchUserInfoByUserId } from '../users/user.server'
import { workoutSchema, type typeWorkoutSchema } from './workout.schema'

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

      log.withMetadata({ userId, name }).info('workout created')
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
}

const workoutService = new workoutServer()

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
