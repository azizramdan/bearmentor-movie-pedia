import { and, eq, inArray, notInArray } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { MovieRequestSchema } from './schema'

export async function getAll() {
  return (await db.query.movies
    .findMany({
      with: {
        moviesToGenres: {
          columns: {},
          with: {
            genre: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        moviesToDirectors: {
          columns: {},
          with: {
            director: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        moviesToWriters: {
          columns: {},
          with: {
            writer: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        moviesToActors: {
          columns: {},
          with: {
            actor: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }))
    .map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      posterUrl: movie.posterUrl,
      type: movie.type,
      plot: movie.plot,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      genres: movie.moviesToGenres.map(g => ({ id: g.genre.id, name: g.genre.name })),
      directors: movie.moviesToDirectors.map(d => ({ id: d.director.id, name: d.director.name })),
      writers: movie.moviesToWriters.map(w => ({ id: w.writer.id, name: w.writer.name })),
      actors: movie.moviesToActors.map(a => ({ id: a.actor.id, name: a.actor.name })),
    }))
}

export async function getById(id: number) {
  const movie = await db.query.movies.findFirst({
    where: (eq(dbSchema.movies.id, id)),
    with: {
      moviesToGenres: {
        columns: {},
        with: {
          genre: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
      moviesToDirectors: {
        columns: {},
        with: {
          director: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
      moviesToWriters: {
        columns: {},
        with: {
          writer: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
      moviesToActors: {
        columns: {},
        with: {
          actor: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!movie) {
    return null
  }

  return {
    id: movie.id,
    title: movie.title,
    year: movie.year,
    posterUrl: movie.posterUrl,
    type: movie.type,
    plot: movie.plot,
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt,
    genres: movie.moviesToGenres.map(g => ({ id: g.genre.id, name: g.genre.name })),
    directors: movie.moviesToDirectors.map(d => ({ id: d.director.id, name: d.director.name })),
    writers: movie.moviesToWriters.map(w => ({ id: w.writer.id, name: w.writer.name })),
    actors: movie.moviesToActors.map(a => ({ id: a.actor.id, name: a.actor.name })),
  }
}

export async function create(data: z.infer<typeof MovieRequestSchema>) {
  return await db.transaction(async (tx) => {
    const movieId = (await tx.insert(dbSchema.movies)
      .values(data)
      .returning({
        id: dbSchema.movies.id,
      }))[0].id

    const [genreIds, directorIds, writerIds, actorIds] = await Promise.all([
      getGenreIds(data.genres),
      getDirectorIds(data.directors),
      getWriterIds(data.writers),
      getActorIds(data.actors),
    ])

    await Promise.all([
      genreIds.length && tx.insert(dbSchema.moviesToGenres).values(genreIds.map(genreId => ({
        genreId,
        movieId,
      }))),
      directorIds.length && tx.insert(dbSchema.moviesToDirectors).values(directorIds.map(directorId => ({
        directorId,
        movieId,
      }))),
      writerIds.length && tx.insert(dbSchema.moviesToWriters).values(writerIds.map(writerId => ({
        writerId,
        movieId,
      }))),
      actorIds.length && tx.insert(dbSchema.moviesToActors).values(actorIds.map(actorId => ({
        actorId,
        movieId,
      }))),
    ])

    return movieId
  })
}

export async function deleteAll() {
  await db.delete(dbSchema.movies)
}

export async function deleteById(id: number) {
  await db.delete(dbSchema.movies).where(eq(dbSchema.movies.id, id))
}

export async function update(id: number, data: Partial<z.infer<typeof MovieRequestSchema>>) {
  await db.transaction(async (tx) => {
    await tx.update(dbSchema.movies)
      .set(data)
      .where(eq(dbSchema.movies.id, id))

    const genres = data.genres
    const directors = data.directors
    const writers = data.writers
    const actors = data.actors

    const updateGenres = async () => {
      if (!genres || !genres.length) {
        return
      }

      await Promise.all([
        tx.insert(dbSchema.moviesToGenres)
          .values((genres).map(genreId => ({
            genreId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        tx.delete(dbSchema.moviesToGenres)
          .where(and(eq(dbSchema.moviesToGenres.movieId, id), notInArray(dbSchema.moviesToGenres.genreId, genres))),
      ])
    }

    const updateDirectors = async () => {
      if (!directors || !directors.length) {
        return
      }

      await Promise.all([
        tx.insert(dbSchema.moviesToDirectors)
          .values((directors).map(directorId => ({
            directorId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        tx.delete(dbSchema.moviesToDirectors)
          .where(and(eq(dbSchema.moviesToDirectors.movieId, id), notInArray(dbSchema.moviesToDirectors.directorId, directors))),
      ])
    }

    const updateWriters = async () => {
      if (!writers || !writers.length) {
        return
      }

      await Promise.all([
        tx.insert(dbSchema.moviesToWriters)
          .values((writers).map(writerId => ({
            writerId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        tx.delete(dbSchema.moviesToWriters)
          .where(and(eq(dbSchema.moviesToWriters.movieId, id), notInArray(dbSchema.moviesToWriters.writerId, writers))),
      ])
    }

    const updateActors = async () => {
      if (!actors || !actors.length) {
        return
      }

      await Promise.all([
        tx.insert(dbSchema.moviesToActors)
          .values((actors).map(actorId => ({
            actorId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        tx.delete(dbSchema.moviesToActors)
          .where(and(eq(dbSchema.moviesToActors.movieId, id), notInArray(dbSchema.moviesToActors.actorId, actors))),
      ])
    }

    await Promise.all([
      updateGenres(),
      updateDirectors(),
      updateWriters(),
      updateActors(),
    ])
  })
}

export async function isExists(id: number) {
  const exists = await db.query.movies.findFirst({
    columns: { id: true },
    where: eq(dbSchema.movies.id, id),
  })

  return Boolean(exists)
}

async function getGenreIds(ids: Array<number> | undefined) {
  if (!ids || !ids.length) {
    return []
  }

  return (await db.query.genres
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.genres.id, ids)),
    }))
    .map(genre => genre.id)
}

async function getDirectorIds(ids: Array<number> | undefined) {
  if (!ids || !ids.length) {
    return []
  }

  return (await db.query.directors
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.directors.id, ids)),
    }))
    .map(director => director.id)
}

async function getWriterIds(ids: Array<number> | undefined) {
  if (!ids || !ids.length) {
    return []
  }

  return (await db.query.writers
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.writers.id, ids)),
    }))
    .map(writer => writer.id)
}

async function getActorIds(ids: Array<number> | undefined) {
  if (!ids || !ids.length) {
    return []
  }

  return (await db.query.actors
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.actors.id, ids)),
    }))
    .map(actor => actor.id)
}
