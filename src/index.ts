import { Hono } from 'hono'
import { moviesRoute } from './movie'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/movies', moviesRoute)

export default app
