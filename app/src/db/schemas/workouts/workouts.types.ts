import { z } from "zod"
import type { outputWorkout } from "./workouts.schemas"

export type outputWorkout = z.infer<typeof outputWorkout>
