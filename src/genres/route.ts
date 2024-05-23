import { OpenAPIHono } from '@hono/zod-openapi'
import { GenreIdSchema, GenreRequestSchema } from './schema'
import * as genreService from './service'

const API_TAG = ['Genres']

export const genresRoute = new OpenAPIHono()
  // get all genres
  .openapi(
    {
      method: 'get',
      path: '/',
      description: 'Get all genres',
      responses: {
        200: {
          description: 'List of genres',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const genres = await genreService.getAll()

      return c.json({
        message: 'Success',
        data: genres,
      })
    },
  )

  // get genre by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      description: 'Get genre by id',
      request: {
        params: GenreIdSchema,
      },
      responses: {
        200: {
          description: 'Genre details',
        },
        404: {
          description: 'Genre not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const genre = await genreService.getById(Number(c.req.param('id')))

      if (!genre) {
        return c.json({ message: 'Genre not found' }, 404)
      }

      return c.json({
        message: 'Success',
        data: genre,
      })
    },
  )

  // create a new genre
  .openapi(
    {
      method: 'post',
      path: '/',
      description: 'Create a new genre',
      request: {
        body: {
          content: {
            'application/json': {
              schema: GenreRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Genre created',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')

      const genreId = await genreService.create(body)
      const genre = await genreService.getById(genreId)

      return c.json({
        message: 'Success',
        data: genre,
      }, 201)
    },
  )

  // delete all genres
  .openapi(
    {
      method: 'delete',
      path: '/',
      description: 'Delete all genres',
      responses: {
        200: {
          description: 'genres deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await genreService.deleteAll()

      return c.json({ message: 'Success' })
    },
  )

  // delete genre by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      description: 'Delete genre by id',
      request: {
        params: GenreIdSchema,
      },
      responses: {
        200: {
          description: 'Genre deleted',
        },
        404: {
          description: 'Genre not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const id = Number(c.req.param('id'))
      const exists = await genreService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Genre not found' }, 404)
      }

      await genreService.deleteById(id)

      return c.json({ message: 'Success' })
    },
  )

  // update genre by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      description: 'Update genre by id',
      request: {
        params: GenreIdSchema,
        body: {
          content: {
            'application/json': {
              schema: GenreRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Genre updated',
        },
        404: {
          description: 'Genre not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')
      const id = Number(c.req.param('id'))

      const exists = await genreService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Genre not found' }, 404)
      }

      await genreService.update(id, body)
      const genre = await genreService.getById(id)

      return c.json({
        message: 'Success',
        data: genre,
      })
    },
  )
