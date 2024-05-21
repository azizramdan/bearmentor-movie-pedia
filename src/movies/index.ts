import { OpenAPIHono } from '@hono/zod-openapi'
import { and, eq, notInArray } from 'drizzle-orm'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import { MovieIdSchema, MovieRequestSchema } from './schema'

const API_TAG = ['Movies']

export const moviesRoute = new OpenAPIHono()
  // get all movies
  .openapi(
    {
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'List of movies',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const movies = (await db.query.movies
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

      return c.json(movies)
    },
  )

  // get movie by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      request: {
        params: MovieIdSchema,
      },
      responses: {
        200: {
          description: 'Movie details',
        },
        404: {
          description: 'Movie not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const movie = (await db.query.movies.findFirst({
        where: (eq(dbSchema.movies.id, Number(c.req.param('id')))),
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

      if (!movie) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      return c.json({
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
      })
    },
  )

  // create a new movie
  .openapi(
    {
      method: 'post',
      path: '/',
      request: {
        body: {
          content: {
            'application/json': {
              schema: MovieRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Movie created',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')

      const movie = await db.transaction(async (tx) => {
        const movie = (await tx.insert(dbSchema.movies).values(body).returning())[0]

        await Promise.all([
          tx.insert(dbSchema.moviesToGenres).values(body.genres.map(genreId => ({
            genreId,
            movieId: movie.id,
          }))),
          tx.insert(dbSchema.moviesToDirectors).values(body.directors.map(directorId => ({
            directorId,
            movieId: movie.id,
          }))),
          tx.insert(dbSchema.moviesToWriters).values(body.writers.map(writerId => ({
            writerId,
            movieId: movie.id,
          }))),
          tx.insert(dbSchema.moviesToActors).values(body.actors.map(actorId => ({
            actorId,
            movieId: movie.id,
          }))),
        ])

        return movie
      })

      return c.json(movie, 201)
    },
  )

  // delete all movies
  .openapi(
    {
      method: 'delete',
      path: '/',
      responses: {
        200: {
          description: 'Movies deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await db.delete(dbSchema.movies)

      return c.json({ message: 'Movies deleted' })
    },
  )

  // delete movie by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      request: {
        params: MovieIdSchema,
      },
      responses: {
        200: {
          description: 'Movie deleted',
        },
        404: {
          description: 'Movie not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await db.delete(dbSchema.movies).where(eq(dbSchema.movies.id, Number(c.req.param('id'))))

      return c.json({ message: 'Movie deleted' })
    },
  )

  // update movie by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      request: {
        params: MovieIdSchema,
        body: {
          content: {
            'application/json': {
              schema: MovieRequestSchema.partial(),
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Movie updated',
        },
        404: {
          description: 'Movie not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')
      const id = Number(c.req.param('id'))

      const exists = await db.query.movies.findFirst({
        columns: { id: true },
        where: eq(dbSchema.movies.id, id),
      })

      if (!exists) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      await db.transaction(async (tx) => {
        await tx.update(dbSchema.movies)
          .set(body)
          .where(eq(dbSchema.movies.id, id))

        const genres = body.genres
        const directors = body.directors
        const writers = body.writers
        const actors = body.actors

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

      return c.json({ message: 'Movie updated' })
    },
  )
