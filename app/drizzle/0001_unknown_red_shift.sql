CREATE TABLE "exercises_perfomance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"reps" integer,
	"weight" double precision
);
--> statement-breakpoint
CREATE TABLE "workouts_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workout_id" uuid NOT NULL,
	"name" varchar(64),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(64),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exercises_perfomance" ADD CONSTRAINT "exercises_perfomance_exercise_id_workouts_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."workouts_exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts_exercises" ADD CONSTRAINT "workouts_exercises_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;