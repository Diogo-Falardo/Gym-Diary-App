import { db } from '#/db'
import { usersTable } from '#/db/schema'
import { log } from '#/middlewares/logger'
import { eq } from 'drizzle-orm'
import { userSchema, type typeUserSchema } from './user.schema'

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
      log.withError(error).error('Failed to getUserByClerId')
      throw new Error('Failed to load user')
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
      log.withError(error).error('Failed to createUser')
      throw new Error('Failed to create user')
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
