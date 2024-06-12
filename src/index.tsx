import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { moviesRoute } from './movies/route'
import { dbRoute } from './db/route'
import { WelcomePage } from './welcome'
import { genresRoute } from './genres/route'
import { directorsRoute } from './directors/route'
import { writersRoute } from './writers/route'
import { actorsRoute } from './actors/route'

export default new OpenAPIHono({ strict: false })
  .route('/api/db', dbRoute)
  .route('/api/movies', moviesRoute)
  .route('/api/genres', genresRoute)
  .route('/api/directors', directorsRoute)
  .route('/api/writers', writersRoute)
  .route('/api/actors', actorsRoute)

  .doc31('/api-spec', {
    openapi: '3.1.0',
    info: {
      version: '1.2.1',
      title: 'MoviePedia API',
      description: 'MoviePedia REST API is a web service that provides access to a vast collection of movie data. It allows users to search for movies, retrieve movie details, and perform various operations related to movies.',
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
