import { z } from "zod"
import type { selectExerciceSchema } from "./exercises.schemas"

export type outputExercice = z.infer<typeof selectExerciceSchema>
