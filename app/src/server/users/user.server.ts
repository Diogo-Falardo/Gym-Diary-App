import { db } from '#/db'
import { usersTable } from '#/db/schema'
import { log } from '#/middlewares/logger'
import { eq } from 'drizzle-orm'
import {
  userPatchSchema,
  userPublicSchema,
  userSchema,
  type typeUserPatchSchema,
  type typeUserPublicSchema,
  type typeUserSchema,
} from './user.schema'

class UserServer {
  async getUserByClerkId(clerkId: string): Promise<typeUserSchema | false> {
    try {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkId, clerkId))

      if (!user[0]) {
        log.withMetadata({ clerkId }).warn('User by clerId was not found')
        return false
      }

      log
        .withMetadata({ clerkId, user: user[0] })
        .info('User by clerId was found')
      return userSchema.parse(user[0])
    } catch (error) {
      log.withMetadata({ error }).error('Failed to getUserByClerId')
      throw new Error('Failed to load user!')
    }
  }

  async getUserByInternalUserId(
    userId: string,
  ): Promise<typeUserSchema | false> {
    try {
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))

      if (!user[0]) {
        log.withMetadata({ userId }).warn('User by userId was not found')
        return false
      }

      log
        .withMetadata({ userId, user: user[0] })
        .info('User by userId was found')
      return userSchema.parse(user[0])
    } catch (error) {
      log.withMetadata({ error }).error('Failed to getUserByInternalUserId')
      throw new Error('Failed to load user!')
    }
  }

  async createUser(clerkId: string): Promise<typeUserSchema> {
    try {
      const user = await db
        .insert(usersTable)
        .values({
          clerkId,
        })
        .returning()

      log.withMetadata({ clerkId, user: user[0] }).info('User was created')

      return userSchema.parse(user[0])
    } catch (error) {
      log.withMetadata({ error }).error('Failed to createUser')
      throw new Error('Failed to create user!')
    }
  }

  async updateUser(
    userId: string,
    profile: typeUserPatchSchema,
  ): Promise<typeUserPatchSchema | string> {
    const user = await this.getUserByInternalUserId(userId)

    if (user === false) {
      log
        .withMetadata({ userId })
        .error('Failed to update the user, user not found')
      throw new Error('User was not found!')
    }

    const newUserData: Record<string | number, any> = {}

    if (
      typeof profile.username === 'string' &&
      profile.username !== user.username
    ) {
      newUserData.username = profile.username
    }

    if (
      typeof profile.dateOfBirth === 'string' &&
      profile.dateOfBirth !== user.dateOfBirth &&
      profile.dateOfBirth.trim() !== ''
    ) {
      newUserData.dateOfBirth = profile.dateOfBirth
    }

    if (typeof profile.height === 'number' && profile.height !== user.height) {
      newUserData.height = profile.height
    }

    if (typeof profile.weight === 'number' && profile.weight !== user.weight) {
      newUserData.weight = profile.weight
    }

    if (Object.keys(newUserData).length === 0) {
      log.withMetadata({ newUserData }).warn('no changes or no values provided')
      throw new Error('Nothing to update!')
    }

    try {
      await db
        .update(usersTable)
        .set(newUserData)
        .where(eq(usersTable.id, userId))

      return userPatchSchema.parse(newUserData)
    } catch (error) {
      log.withMetadata({ error }).error('Failed to updateUser')
      throw new Error('Failed to update user!')
    }
  }
}

const userService = new UserServer()

/**
 * This function responsibility is to:
 *
 * - If there is no user on db with that clerkId it
 * should add the user to the database
 * - If there is a user, simple return
 *
 * @param clerkId
 * @returns internal user id (uuid)
 */
export async function indexUser(clerkId: string): Promise<string> {
  const user = await userService.getUserByClerkId(clerkId)

  if (user === false) {
    const newUser = await userService.createUser(clerkId)
    log.withMetadata(newUser).info('New user was created')
    return newUser.id
  }

  log.withMetadata({ user }).info('User was indexed')
  return user.id
}

export async function fetchUserInfoByUserId(
  userId: string,
): Promise<typeUserPublicSchema> {
  const user = await userService.getUserByInternalUserId(userId)

  if (user === false) {
    log.withMetadata({ userId }).error('User was not found')
    throw new Error('User was not found!')
  }

  log.withMetadata(user).info('Info by user id')
  return userPublicSchema.parse(user)
}

export async function updateUserProfile(
  userId: string,
  profile: typeUserPatchSchema,
) {
  const user = await userService.getUserByInternalUserId(userId)

  if (user === false) {
    log.withMetadata({ userId }).error('User was not found')
    throw new Error('User was not found!')
  }

  return await userService.updateUser(userId, profile)
}
