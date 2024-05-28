import { OpenAPIHono } from '@hono/zod-openapi'
import { DirectorIdSchema, DirectorRequestSchema, QueryDirectorSchema } from './schema'
import * as directorService from './service'

const API_TAG = ['Directors']

export const directorsRoute = new OpenAPIHono()
  // get all directors
  .openapi(
    {
      method: 'get',
      path: '/',
      description: 'Get all directors',
      request: {
        query: QueryDirectorSchema,
      },
      responses: {
        200: {
          description: 'List of directors',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const directors = await directorService.getAll(c.req.query())

      return c.json({
        message: 'Success',
        data: directors,
      })
    },
  )

  // get director by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      description: 'Get director by id',
      request: {
        params: DirectorIdSchema,
      },
      responses: {
        200: {
          description: 'Director details',
        },
        404: {
          description: 'Director not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const director = await directorService.getById(Number(c.req.param('id')))

      if (!director) {
        return c.json({ message: 'Director not found' }, 404)
      }

      return c.json({
        message: 'Success',
        data: director,
      })
    },
  )

  // create a new director
  .openapi(
    {
      method: 'post',
      path: '/',
      description: 'Create a new director',
      request: {
        body: {
          content: {
            'application/json': {
              schema: DirectorRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Director created',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')

      const directorId = await directorService.create(body)
      const director = await directorService.getById(directorId)

      return c.json({
        message: 'Success',
        data: director,
      }, 201)
    },
  )

  // delete all directors
  .openapi(
    {
      method: 'delete',
      path: '/',
      description: 'Delete all directors',
      responses: {
        200: {
          description: 'directors deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await directorService.deleteAll()

      return c.json({ message: 'Success' })
    },
  )

  // delete director by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      description: 'Delete director by id',
      request: {
        params: DirectorIdSchema,
      },
      responses: {
        200: {
          description: 'Director deleted',
        },
        404: {
          description: 'Director not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const id = Number(c.req.param('id'))
      const exists = await directorService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Director not found' }, 404)
      }

      await directorService.deleteById(id)

      return c.json({ message: 'Success' })
    },
  )

  // update director by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      description: 'Update director by id',
      request: {
        params: DirectorIdSchema,
        body: {
          content: {
            'application/json': {
              schema: DirectorRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Director updated',
        },
        404: {
          description: 'Director not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')
      const id = Number(c.req.param('id'))

      const exists = await directorService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Director not found' }, 404)
      }

      await directorService.update(id, body)
      const director = await directorService.getById(id)

      return c.json({
        message: 'Success',
        data: director,
      })
    },
  )
