import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { moviesRoute } from './movies'
import { dbRoute } from './db/seed'

export default new OpenAPIHono({ strict: false })
  .route('/api/movies', moviesRoute)
  .route('/api/db', dbRoute)

  .doc31('/api-spec', {
    openapi: '3.1.0',
    info: {
      version: '0.0.1',
      title: 'MoviePedia API',
      description: 'Explore a world of cinematic insights with ease using the **MoviePedia API**. Access comprehensive movie data for seamless exploration and discovery.',
    },
  })
  .get('/api', swaggerUI({ url: '/api-spec' }))

  .get('/', (c) => {
    return c.text('Hello Hono!')
  })
