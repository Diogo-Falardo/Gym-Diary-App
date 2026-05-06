ALTER TABLE "exercises_perfomance" RENAME TO "exercises_performance";--> statement-breakpoint
ALTER TABLE "exercises_performance" DROP CONSTRAINT "exercises_perfomance_exercise_id_workouts_exercises_id_fk";
--> statement-breakpoint
ALTER TABLE "exercises_performance" ADD CONSTRAINT "exercises_performance_exercise_id_workouts_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."workouts_exercises"("id") ON DELETE no action ON UPDATE no action;