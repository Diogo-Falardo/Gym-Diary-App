//bun --env-file=.env src/tests/generator.test.ts
import { config } from "dotenv"
import { db } from "#/db"
import { log } from "#/middlewares/logger"
import { generateWorkouts } from "#/server/appGenerator"
import { table_exercises, table_workoutExercises, table_workouts } from "#/db/schema"

config({ path: ".env" })

log.info("testing generator")

await generateWorkouts()

const exercises = await db.select().from(table_exercises)
const workouts = await db.select().from(table_workouts)
const links = await db.select().from(table_workoutExercises)

log.withMetadata({
  workouts: workouts.length,
  exercises: exercises.length,
  workoutExercises: links.length,
  workoutNames: workouts.map((workout) => workout.name),
}).info('database after generateWorkouts')
