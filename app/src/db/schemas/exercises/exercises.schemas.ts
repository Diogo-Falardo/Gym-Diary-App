import { table_exercises } from "#/db/schema"
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"

export const selectExerciceSchema = createSelectSchema(table_exercises)
export const insertExerciceSchema = createInsertSchema(table_exercises)
