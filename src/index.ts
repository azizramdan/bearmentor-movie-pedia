import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { moviesRoute } from './movies'

export default new OpenAPIHono({ strict: false })
  .route('/api/movies', moviesRoute)

  .doc31('/api-spec', {
    openapi: '3.1.0',
    info: {
      version: '0.0.1',
      title: 'MoviePedia API',
    },
  })
  .get('/api', swaggerUI({ url: '/api-spec' }))

  .get('/', (c) => {
    return c.text('Hello Hono!')
  })
