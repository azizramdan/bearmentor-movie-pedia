import { OpenAPIHono } from '@hono/zod-openapi'
import { movies } from './data'
import { MovieIdSchema, MovieSchema } from './schema'

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
    (c) => {
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
    (c) => {
      const id = Number(c.req.param('id'))
      const movie = movies.find(m => m.id === id)

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
              schema: MovieSchema,
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
    (c) => {
      const body = c.req.valid('json')

      const id = Number.parseInt((Math.random() * 10000000000).toString())
      const movie = { id, ...body }
      movies.push(movie)

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
    (c) => {
      movies.length = 0

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
    (c) => {
      const id = Number(c.req.param('id'))
      const index = movies.findIndex(m => m.id === id)

      if (index === -1) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      movies.splice(index, 1)

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
              schema: MovieSchema.partial(),
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
    (c) => {
      const id = Number(c.req.param('id'))
      const index = movies.findIndex(m => m.id === id)

      if (index === -1) {
        return c.json({ message: 'Movie not found' }, 404)
      }

      const body = c.req.valid('json')
      const movie = movies[index]

      movies[index] = { id, ...{
        title: body.title ?? movie.title,
        year: body.year ?? movie.year,
        genres: body.genres ?? movie.genres,
        directors: body.directors ?? movie.directors,
        writers: body.writers ?? movie.writers,
        posterUrl: body.posterUrl ?? movie.posterUrl,
        type: body.type ?? movie.type,
        plot: body.plot ?? movie.plot,
        actors: body.actors ?? movie.actors,
      } }

      return c.json(movies[index])
    },
  )
