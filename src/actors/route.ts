import { OpenAPIHono } from '@hono/zod-openapi'
import { ActorIdSchema, ActorRequestSchema, QueryActorSchema } from './schema'
import * as actorService from './service'

const API_TAG = ['Actors']

export const actorsRoute = new OpenAPIHono()
  // get all actors
  .openapi(
    {
      method: 'get',
      path: '/',
      description: 'Get all actors',
      request: {
        query: QueryActorSchema,
      },
      responses: {
        200: {
          description: 'List of actors',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const actors = await actorService.getAll(c.req.query())

      return c.json({
        message: 'Success',
        data: actors,
      })
    },
  )

  // get actor by id
  .openapi(
    {
      method: 'get',
      path: '/{id}',
      description: 'Get actor by id',
      request: {
        params: ActorIdSchema,
      },
      responses: {
        200: {
          description: 'Actor details',
        },
        404: {
          description: 'Actor not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const actor = await actorService.getById(Number(c.req.param('id')))

      if (!actor) {
        return c.json({ message: 'Actor not found' }, 404)
      }

      return c.json({
        message: 'Success',
        data: actor,
      })
    },
  )

  // create a new actor
  .openapi(
    {
      method: 'post',
      path: '/',
      description: 'Create a new actor',
      request: {
        body: {
          content: {
            'application/json': {
              schema: ActorRequestSchema,
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Actor created',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')

      const actorId = await actorService.create(body)
      const actor = await actorService.getById(actorId)

      return c.json({
        message: 'Success',
        data: actor,
      }, 201)
    },
  )

  // delete all actors
  .openapi(
    {
      method: 'delete',
      path: '/',
      description: 'Delete all actors',
      responses: {
        200: {
          description: 'actors deleted',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      await actorService.deleteAll()

      return c.json({ message: 'Success' })
    },
  )

  // delete actor by id
  .openapi(
    {
      method: 'delete',
      path: '/{id}',
      description: 'Delete actor by id',
      request: {
        params: ActorIdSchema,
      },
      responses: {
        200: {
          description: 'Actor deleted',
        },
        404: {
          description: 'Actor not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const id = Number(c.req.param('id'))
      const exists = await actorService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Actor not found' }, 404)
      }

      await actorService.deleteById(id)

      return c.json({ message: 'Success' })
    },
  )

  // update actor by id
  .openapi(
    {
      method: 'put',
      path: '/{id}',
      description: 'Update actor by id',
      request: {
        params: ActorIdSchema,
        body: {
          content: {
            'application/json': {
              schema: ActorRequestSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Actor updated',
        },
        404: {
          description: 'Actor not found',
        },
      },
      tags: API_TAG,
    },
    async (c) => {
      const body = c.req.valid('json')
      const id = Number(c.req.param('id'))

      const exists = await actorService.isExists(id)

      if (!exists) {
        return c.json({ message: 'Actor not found' }, 404)
      }

      await actorService.update(id, body)
      const actor = await actorService.getById(id)

      return c.json({
        message: 'Success',
        data: actor,
      })
    },
  )
