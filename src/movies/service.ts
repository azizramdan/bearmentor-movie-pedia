import { and, desc, eq, ilike, inArray, notInArray } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { MovieRequestSchema, QueryMovieSchema } from './schema'

export async function getAll(query?: z.infer<typeof QueryMovieSchema>) {
  return (await db.query.movies
    .findMany({
      where: (and(
        query?.title
          ? ilike(dbSchema.movies.title, `%${query.title}%`)
          : undefined,
        query?.year
          ? eq(dbSchema.movies.year, query.year)
          : undefined,
        query?.type
          ? eq(dbSchema.movies.type, query.type)
          : undefined,
      )),
      orderBy: query?.sortBy
        ? [query.sortOrder === 'desc' ? desc(dbSchema.movies[query.sortBy]) : dbSchema.movies[query.sortBy]]
        : [dbSchema.movies.id],
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

    const [validGenreIds, validDirectorIds, validWriterIds, validActorIds] = await Promise.all([
      getValidGenreIds(data.genres || []),
      getValidDirectorIds(data.directors || []),
      getValidWriterIds(data.writers || []),
      getValidActorIds(data.actors || []),
    ])

    await Promise.all([
      validGenreIds.length && tx.insert(dbSchema.moviesToGenres).values(validGenreIds.map(genreId => ({
        genreId,
        movieId,
      }))),
      validDirectorIds.length && tx.insert(dbSchema.moviesToDirectors).values(validDirectorIds.map(directorId => ({
        directorId,
        movieId,
      }))),
      validWriterIds.length && tx.insert(dbSchema.moviesToWriters).values(validWriterIds.map(writerId => ({
        writerId,
        movieId,
      }))),
      validActorIds.length && tx.insert(dbSchema.moviesToActors).values(validActorIds.map(actorId => ({
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
  if (Object.keys(data).length === 0) {
    return
  }

  await db.transaction(async (tx) => {
    await tx.update(dbSchema.movies)
      .set(data)
      .where(eq(dbSchema.movies.id, id))

    const [validGenreIds, validDirectorIds, validWriterIds, validActorIds] = await Promise.all([
      getValidGenreIds(data.genres || []),
      getValidDirectorIds(data.directors || []),
      getValidWriterIds(data.writers || []),
      getValidActorIds(data.actors || []),
    ])

    /**
     * 1. if data.<relation> is undefined, no change is made
     * 2. if data.<relation> is an empty array, remove all relations
     * 3. if data.<relation> is a non-empty array but valid<relation>Ids is empty, treat it as point 2
     */

    const updateGenres = async () => {
      await Promise.all([
        validGenreIds.length && tx.insert(dbSchema.moviesToGenres)
          .values((validGenreIds).map(genreId => ({
            genreId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        data.genres && tx.delete(dbSchema.moviesToGenres)
          .where(and(
            eq(dbSchema.moviesToGenres.movieId, id),
            data.genres.length
              ? notInArray(dbSchema.moviesToGenres.genreId, data.genres)
              : undefined,
          )),
      ])
    }

    const updateDirectors = async () => {
      await Promise.all([
        validDirectorIds.length && tx.insert(dbSchema.moviesToDirectors)
          .values((validDirectorIds).map(directorId => ({
            directorId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        data.directors && tx.delete(dbSchema.moviesToDirectors)
          .where(and(
            eq(dbSchema.moviesToDirectors.movieId, id),
            data.directors.length
              ? notInArray(dbSchema.moviesToDirectors.directorId, data.directors)
              : undefined,
          )),
      ])
    }

    const updateWriters = async () => {
      await Promise.all([
        validWriterIds.length && tx.insert(dbSchema.moviesToWriters)
          .values((validWriterIds).map(writerId => ({
            writerId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        data.writers && tx.delete(dbSchema.moviesToWriters)
          .where(and(
            eq(dbSchema.moviesToWriters.movieId, id),
            data.writers.length
              ? notInArray(dbSchema.moviesToWriters.writerId, data.writers)
              : undefined,
          )),
      ])
    }

    const updateActors = async () => {
      await Promise.all([
        validActorIds.length && tx.insert(dbSchema.moviesToActors)
          .values((validActorIds).map(actorId => ({
            actorId,
            movieId: id,
          })))
          .onConflictDoNothing(),

        data.actors && tx.delete(dbSchema.moviesToActors)
          .where(and(
            eq(dbSchema.moviesToActors.movieId, id),
            data.actors.length
              ? notInArray(dbSchema.moviesToActors.actorId, data.actors)
              : undefined,
          )),
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

async function getValidGenreIds(ids: Array<number>) {
  if (!ids.length) {
    return []
  }

  return (await db.query.genres
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.genres.id, ids)),
    }))
    .map(genre => genre.id)
}

async function getValidDirectorIds(ids: Array<number>) {
  if (!ids.length) {
    return []
  }

  return (await db.query.directors
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.directors.id, ids)),
    }))
    .map(director => director.id)
}

async function getValidWriterIds(ids: Array<number>) {
  if (!ids.length) {
    return []
  }

  return (await db.query.writers
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.writers.id, ids)),
    }))
    .map(writer => writer.id)
}

async function getValidActorIds(ids: Array<number>) {
  if (!ids.length) {
    return []
  }

  return (await db.query.actors
    .findMany({
      columns: { id: true },
      where: (inArray(dbSchema.actors.id, ids)),
    }))
    .map(actor => actor.id)
}
