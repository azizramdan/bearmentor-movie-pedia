import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { moviesRoute } from './movies'
import { dbRoute } from './db/seed'
import { WelcomePage } from './welcome'

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

  .get('/', c => c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to MoviePedia REST API</title>
        <meta name="description" content="Web API about movies" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <WelcomePage />
      </body>
    </html>,
  ))
