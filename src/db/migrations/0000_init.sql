CREATE TABLE IF NOT EXISTS "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"year" integer,
	"posterUrl" varchar,
	"type" varchar,
	"plot" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesActors" (
	"movieId" integer,
	"actorId" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesActors_movieId_actorId_unique" UNIQUE("movieId","actorId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesDirectors" (
	"movieId" integer,
	"directorId" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesDirectors_movieId_directorId_unique" UNIQUE("movieId","directorId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesGenres" (
	"movieId" integer,
	"genreId" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesGenres_movieId_genreId_unique" UNIQUE("movieId","genreId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "moviesWriters" (
	"movieId" integer,
	"writerId" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "moviesWriters_movieId_writerId_unique" UNIQUE("movieId","writerId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "writers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesActors" ADD CONSTRAINT "moviesActors_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesActors" ADD CONSTRAINT "moviesActors_actorId_actors_id_fk" FOREIGN KEY ("actorId") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesDirectors" ADD CONSTRAINT "moviesDirectors_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesDirectors" ADD CONSTRAINT "moviesDirectors_directorId_directors_id_fk" FOREIGN KEY ("directorId") REFERENCES "public"."directors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesGenres" ADD CONSTRAINT "moviesGenres_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesGenres" ADD CONSTRAINT "moviesGenres_genreId_genres_id_fk" FOREIGN KEY ("genreId") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesWriters" ADD CONSTRAINT "moviesWriters_movieId_movies_id_fk" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "moviesWriters" ADD CONSTRAINT "moviesWriters_writerId_writers_id_fk" FOREIGN KEY ("writerId") REFERENCES "public"."writers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
