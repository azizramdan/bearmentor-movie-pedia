import { OpenAPIHono } from '@hono/zod-openapi'
import { WriterIdSchema, WriterRequestSchema } from './schema'
import * as writerService from './service'

const API_TAG = ['Writers']

export const writersRoute = new OpenAPIHono()
  // get all writers
  .openapi(
    {
      method: 'get',
      path: '/',
      description: 'Get all writers',
      responses: {
        200: {
          description: 'List of writers',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const writers = await writerService.getAll()

      return c.json({
        message: 'Success',
        data: writers,
      })
    },
  )

  // get writer by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      description: 'Get writer by id',
      request: {
        params: WriterIdSchema,
      },
      responses: {
        200: {
          description: 'Writer details',
        },
        404: {
          description: 'Writer not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const writer = await writerService.getById(Number(c.req.param('id')))

      if (!writer) {
        return c.json({ message: 'Writer not found' }, 404)
      }

      return c.json({
        message: 'Success',
        data: writer,
      })
    },
  )

  // create a new writer
  .openapi(
    {
      method: 'post',
      path: '/',
      description: 'Create a new writer',
      request: {
        body: {
          content: {
            'application/json': {
              schema: WriterRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Writer created',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')

      const writerId = await writerService.create(body)
      const writer = await writerService.getById(writerId)

      return c.json({
        message: 'Success',
        data: writer,
      }, 201)
    },
  )

  // delete all writers
  .openapi(
    {
      method: 'delete',
      path: '/',
      description: 'Delete all writers',
      responses: {
        200: {
          description: 'writers deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await writerService.deleteAll()

      return c.json({ message: 'Success' })
    },
  )

  // delete writer by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      description: 'Delete writer by id',
      request: {
        params: WriterIdSchema,
      },
      responses: {
        200: {
          description: 'Writer deleted',
        },
        404: {
          description: 'Writer not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const id = Number(c.req.param('id'))
      const exists = await writerService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Writer not found' }, 404)
      }

      await writerService.deleteById(id)

      return c.json({ message: 'Success' })
    },
  )

  // update writer by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      description: 'Update writer by id',
      request: {
        params: WriterIdSchema,
        body: {
          content: {
            'application/json': {
              schema: WriterRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Writer updated',
        },
        404: {
          description: 'Writer not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')
      const id = Number(c.req.param('id'))

      const exists = await writerService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Writer not found' }, 404)
      }

      await writerService.update(id, body)
      const writer = await writerService.getById(id)

      return c.json({
        message: 'Success',
        data: writer,
      })
    },
  )
