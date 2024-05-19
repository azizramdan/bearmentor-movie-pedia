CREATE TABLE IF NOT EXISTS "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"year" integer NOT NULL,
	"posterUrl" varchar NOT NULL,
	"type" varchar NOT NULL,
	"plot" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesToActors" (
	"movieId" integer NOT NULL,
	"actorId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesToActors_movieId_actorId_pk" PRIMARY KEY("movieId","actorId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesToDirectors" (
	"movieId" integer NOT NULL,
	"directorId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesToDirectors_movieId_directorId_pk" PRIMARY KEY("movieId","directorId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesToGenres" (
	"movieId" integer NOT NULL,
	"genreId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesToGenres_movieId_genreId_pk" PRIMARY KEY("movieId","genreId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesToWriters" (
	"movieId" integer NOT NULL,
	"writerId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesToWriters_movieId_writerId_pk" PRIMARY KEY("movieId","writerId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "writers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToActors" ADD CONSTRAINT "moviesToActors_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToActors" ADD CONSTRAINT "moviesToActors_actorId_actors_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToDirectors" ADD CONSTRAINT "moviesToDirectors_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToDirectors" ADD CONSTRAINT "moviesToDirectors_directorId_directors_id_fk" FOREIGN KEY ("directorId") REFERENCES "public"."directors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToGenres" ADD CONSTRAINT "moviesToGenres_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToGenres" ADD CONSTRAINT "moviesToGenres_genreId_genres_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToWriters" ADD CONSTRAINT "moviesToWriters_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesToWriters" ADD CONSTRAINT "moviesToWriters_writerId_writers_id_fk" FOREIGN KEY ("writerId") REFERENCES "public"."writers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
