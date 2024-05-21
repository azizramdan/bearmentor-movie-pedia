import { relations } from 'drizzle-orm'
import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const genres = pgTable('genres', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
})

export const directors = pgTable('directors', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
})

export const writers = pgTable('writers', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
})

export const actors = pgTable('actors', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
})

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  year: integer('year').notNull(),
  posterUrl: varchar('posterUrl').notNull(),
  type: varchar('type').notNull(),
  plot: text('plot').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
})

export const moviesToGenres = pgTable(
  'moviesToGenres',
  {
    movieId: integer('movieId').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    genreId: integer('genreId').notNull().references(() => genres.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
  },
  t => ({
    pk: primaryKey({ columns: [t.movieId, t.genreId] }),
  }),
)

export const moviesToDirectors = pgTable(
  'moviesToDirectors',
  {
    movieId: integer('movieId').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    directorId: integer('directorId').notNull().references(() => directors.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
  },
  t => ({
    pk: primaryKey({ columns: [t.movieId, t.directorId] }),
  }),
)

export const moviesToWriters = pgTable(
  'moviesToWriters',
  {
    movieId: integer('movieId').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    writerId: integer('writerId').notNull().references(() => writers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
  },
  t => ({
    pk: primaryKey({ columns: [t.movieId, t.writerId] }),
  }),
)

export const moviesToActors = pgTable(
  'moviesToActors',
  {
    movieId: integer('movieId').notNull().references(() => movies.id, { onDelete: 'cascade' }),
    actorId: integer('actorId').notNull().references(() => actors.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date()),
  },
  t => ({
    pk: primaryKey({ columns: [t.movieId, t.actorId] }),
  }),
)

export const moviesRelations = relations(movies, ({ many }) => ({
  moviesToGenres: many(moviesToGenres),
  moviesToDirectors: many(moviesToDirectors),
  moviesToWriters: many(moviesToWriters),
  moviesToActors: many(moviesToActors),
}))

export const moviesToGenresRelations = relations(moviesToGenres, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToGenres.movieId],
    references: [movies.id],
  }),
  genre: one(genres, {
    fields: [moviesToGenres.genreId],
    references: [genres.id],
  }),
}))

export const moviesToDirectorsRelations = relations(moviesToDirectors, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToDirectors.movieId],
    references: [movies.id],
  }),
  director: one(directors, {
    fields: [moviesToDirectors.directorId],
    references: [directors.id],
  }),
}))

export const moviesToWritersRelations = relations(moviesToWriters, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToWriters.movieId],
    references: [movies.id],
  }),
  writer: one(writers, {
    fields: [moviesToWriters.writerId],
    references: [writers.id],
  }),
}))

export const moviesToActorsRelations = relations(moviesToActors, ({ one }) => ({
  movie: one(movies, {
    fields: [moviesToActors.movieId],
    references: [movies.id],
  }),
  actor: one(actors, {
    fields: [moviesToActors.actorId],
    references: [actors.id],
  }),
}))
