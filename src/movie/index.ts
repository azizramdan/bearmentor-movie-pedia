import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { movieSchema, movies } from './data'

export const moviesRoute = new Hono()
  .get('/', (c) => {
    return c.json(movies)
  })

  .get('/:id', (c) => {
    const id = Number(c.req.param('id'))
    const movie = movies.find(m => m.id === id)

    if (!movie) {
      return c.json({ message: 'Movie not found' }, 404)
    }

    return c.json(movie)
  })

  .post('/', zValidator('json', movieSchema), async (c) => {
    const body = c.req.valid('json')

    const id = Number.parseInt((Math.random() * 10000000000).toString())
    const movie = { id, ...body }
    movies.push(movie)

    return c.json(movie, 201)
  })

  .delete('/', (c) => {
    movies.length = 0

    return c.json({ message: 'Movies deleted' })
  })

  .delete('/:id', (c) => {
    const id = Number(c.req.param('id'))
    const index = movies.findIndex(m => m.id === id)

    if (index === -1) {
      return c.json({ message: 'Movie not found' }, 404)
    }

    movies.splice(index, 1)

    return c.json({ message: 'Movie deleted' })
  })

  .put('/:id', zValidator('json', movieSchema.partial()), (c) => {
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
      poster: body.poster ?? movie.poster,
      type: body.type ?? movie.type,
      plot: body.plot ?? movie.plot,
      actors: body.actors ?? movie.actors,
    } }

    return c.json(movies[index])
  })
