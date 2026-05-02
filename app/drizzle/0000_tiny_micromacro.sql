CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"username" varchar(15),
	"date_of_birth" date,
	"height" double precision,
	"weight" double precision,
	"created_at" timestamp DEFAULT now()
);
