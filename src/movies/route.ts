import { OpenAPIHono } from '@hono/zod-openapi'
import { MovieIdSchema, MovieRequestSchema } from './schema'
import * as movieService from './service'

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
      const movies = await movieService.getAll()

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
      const movie = await movieService.getById(Number(c.req.param('id')))

      if (!movie) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      return c.json(movie)
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

      const movie = await movieService.create(body)

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
      await movieService.deleteAll()

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
      const id = Number(c.req.param('id'))
      const exists = await movieService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      await movieService.deleteById(id)

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

      const exists = await movieService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      await movieService.update(id, body)

      return c.json({ message: 'Movie updated' })
    },
  )
