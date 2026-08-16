import { z } from "zod"
import type { selectExerciceSchema } from "./exercises.schemas"

export type outputExercise = z.infer<typeof selectExerciceSchema>
