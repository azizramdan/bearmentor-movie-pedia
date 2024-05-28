import { OpenAPIHono } from '@hono/zod-openapi'
import { MovieIdSchema, MovieRequestSchema, QueryMovieSchema } from './schema'
import * as movieService from './service'

const API_TAG = ['Movies']

export const moviesRoute = new OpenAPIHono()
  // get all movies
  .openapi(
    {
      method: 'get',
      path: '/',
      description: 'Get all movies',
      request: {
        query: QueryMovieSchema,
      },
      responses: {
        200: {
          description: 'List of movies',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const movies = await movieService.getAll(c.req.query())

      return c.json({
        message: 'Success',
        data: movies,
      })
    },
  )

  // get movie by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      description: 'Get movie by id',
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
      const movie = await movieService.getById(Number(c.req.param('id')))

      if (!movie) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      return c.json({
        message: 'Success',
        data: movie,
      })
    },
  )

  // create a new movie
  .openapi(
    {
      method: 'post',
      path: '/',
      description: 'Create a new movie',
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

      const movieId = await movieService.create(body)
      const movie = await movieService.getById(movieId)

      return c.json({
        message: 'Success',
        data: movie,
      }, 201)
    },
  )

  // delete all movies
  .openapi(
    {
      method: 'delete',
      path: '/',
      description: 'Delete all movies',
      responses: {
        200: {
          description: 'Movies deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await movieService.deleteAll()

      return c.json({ message: 'Success' })
    },
  )

  // delete movie by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      description: 'Delete movie by id',
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
      const id = Number(c.req.param('id'))
      const exists = await movieService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      await movieService.deleteById(id)

      return c.json({ message: 'Success' })
    },
  )

  // update movie by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      description: 'Update movie by id',
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

      const exists = await movieService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      await movieService.update(id, body)
      const movie = await movieService.getById(id)

      return c.json({
        message: 'Success',
        data: movie,
      })
    },
  )
