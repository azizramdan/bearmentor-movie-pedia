import type { SQL } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { integer, pgTable, serial, text, timestamp, unique, varchar } from 'drizzle-orm/pg-core'

export const genres = pgTable('genres', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
})

export const directors = pgTable('directors', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
})

export const writers = pgTable('writers', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
})

export const actors = pgTable('actors', {
  id: serial('id').primaryKey(),
  name: varchar('name'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
})

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title'),
  year: integer('year'),
  posterUrl: varchar('posterUrl'),
  type: varchar('type'),
  plot: text('plot'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
})

export const moviesGenres = pgTable(
  'moviesGenres',
  {
    movieId: integer('movieId').references(() => movies.id, { onDelete: 'cascade' }),
    genreId: integer('genreId').references(() => genres.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
  },
  t => ({
    unique: unique().on(t.movieId, t.genreId),
  }),
)

export const moviesDirectors = pgTable(
  'moviesDirectors',
  {
    movieId: integer('movieId').references(() => movies.id, { onDelete: 'cascade' }),
    directorId: integer('directorId').references(() => directors.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
  },
  t => ({
    unique: unique().on(t.movieId, t.directorId),
  }),
)

export const moviesWriters = pgTable(
  'moviesWriters',
  {
    movieId: integer('movieId').references(() => movies.id, { onDelete: 'cascade' }),
    writerId: integer('writerId').references(() => writers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
  },
  t => ({
    unique: unique().on(t.movieId, t.writerId),
  }),
)

export const moviesActors = pgTable(
  'moviesActors',
  {
    movieId: integer('movieId').references(() => movies.id, { onDelete: 'cascade' }),
    actorId: integer('actorId').references(() => actors.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate((): SQL => sql`now()`),
  },
  t => ({
    unique: unique().on(t.movieId, t.actorId),
  }),
)
