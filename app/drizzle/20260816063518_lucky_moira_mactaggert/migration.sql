CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workout_exercises_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_performance_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer,
	"weight" double precision
);
--> statement-breakpoint
CREATE TABLE "workout_performance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(64) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id");--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id");--> statement-breakpoint
ALTER TABLE "workout_exercises_performance" ADD CONSTRAINT "workout_exercises_performance_w2IX51bkfDZw_fkey" FOREIGN KEY ("workout_performance_id") REFERENCES "workout_performance"("id");--> statement-breakpoint
ALTER TABLE "workout_exercises_performance" ADD CONSTRAINT "workout_exercises_performance_BTo6Kl0Y0E9t_fkey" FOREIGN KEY ("exercise_id") REFERENCES "workout_exercises"("id");--> statement-breakpoint
ALTER TABLE "workout_performance" ADD CONSTRAINT "workout_performance_workout_id_workouts_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id");