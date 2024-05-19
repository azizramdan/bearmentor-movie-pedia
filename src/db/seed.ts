import { OpenAPIHono } from '@hono/zod-openapi'
import { db } from './db'
import { actors, directors, genres, movies, moviesActors, moviesDirectors, moviesGenres, moviesWriters, writers } from './schema'

export const dbRoute = new OpenAPIHono()
  // seed database
  .openapi(
    {
      method: 'post',
      path: '/seed',
      description: 'Seed the database with sample data',
      responses: {
        200: {
          description: 'Database seeded',
        },
      },
      tags: ['Database'],
    },
    async (c) => {
      const seed = {
        movies: [
          {
            title: 'Pirates of the Caribbean: The Curse of the Black Pearl',
            year: 2003,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGYyZGM5MGMtYTY2Ni00M2Y1LWIzNjQtYWUzM2VlNGVhMDNhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
            type: 'movie',
            plot: 'Blacksmith Will Turner teams up with eccentric pirate "Captain" Jack Sparrow to save his love, the governor\'s daughter, from Jack\'s former pirate allies, who are now undead.',
            genres: ['Action', 'Adventure', 'Fantasy'],
            directors: ['Gore Verbinski'],
            writers: ['Ted Elliott', 'Terry Rossio', 'Stuart Beattie'],
            actors: ['Johnny Depp', 'Geoffrey Rush', 'Orlando Bloom'],
          },
          {
            title: 'Pirates of the Caribbean: Dead Man\'s Chest',
            year: 2006,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTcwODc1MTMxM15BMl5BanBnXkFtZTYwMDg1NzY3._V1_SX300.jpg',
            type: 'movie',
            plot: 'Jack Sparrow races to recover the heart of Davy Jones to avoid enslaving his soul to Jones\' service, as other friends and foes seek the heart for their own agenda as well.',
            genres: ['Action', 'Adventure', 'Fantasy'],
            directors: ['Gore Verbinski'],
            writers: ['Ted Elliott', 'Terry Rossio', 'Stuart Beattie'],
            actors: ['Johnny Depp', 'Orlando Bloom', 'Keira Knightley'],
          },
          {
            title: 'Pirates of the Caribbean: At World\'s End',
            year: 2007,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjIyNjkxNzEyMl5BMl5BanBnXkFtZTYwMjc3MDE3._V1_SX300.jpg',
            type: 'movie',
            plot: 'Captain Barbossa, Will Turner and Elizabeth Swann must sail off the edge of the map, navigate treachery and betrayal, find Jack Sparrow, and make their final alliances for one last decisive battle.',
            genres: ['Action', 'Adventure', 'Fantasy'],
            directors: ['Gore Verbinski'],
            writers: ['Ted Elliott', 'Terry Rossio', 'Stuart Beattie'],
            actors: ['Johnny Depp', 'Orlando Bloom', 'Keira Knightley'],
          },
          {
            title: 'Pirates of the Caribbean: On Stranger Tides',
            year: 2011,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjE5MjkwODI3Nl5BMl5BanBnXkFtZTcwNjcwMDk4NA@@._V1_SX300.jpg',
            type: 'movie',
            plot: 'Jack Sparrow and Barbossa embark on a quest to find the elusive fountain of youth, only to discover that Blackbeard and his daughter are after it too.',
            genres: ['Action', 'Adventure', 'Fantasy'],
            directors: ['Rob Marshall'],
            writers: ['Ted Elliott', 'Terry Rossio', 'Stuart Beattie'],
            actors: ['Johnny Depp', 'Penélope Cruz', 'Ian McShane'],
          },
          {
            title: 'Pirates of the Caribbean: Dead Men Tell No Tales',
            year: 2017,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTYyMTcxNzc5M15BMl5BanBnXkFtZTgwOTg2ODE2MTI@._V1_SX300.jpg',
            type: 'movie',
            plot: 'Captain Jack Sparrow is pursued by old rival Captain Salazar and a crew of deadly ghosts who have escaped from the Devil\'s Triangle. They\'re determined to kill every pirate at sea...notably Jack.',
            genres: ['Action', 'Adventure', 'Fantasy'],
            directors: ['Joachim Rønning', 'Espen Sandberg'],
            writers: ['Jeff Nathanson', 'Terry Rossio', 'Ted Elliott'],
            actors: ['Johnny Depp', 'Geoffrey Rush', 'Javier Bardem'],
          },
          {
            title: 'Pirates of the Caribbean: Tales of the Code: Wedlocked',
            year: 2011,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BZGFiZTQ0MDctM2ViMS00MGEwLWIxNzgtYWUzZDM4N2NiMmQyXkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_SX300.jpg',
            type: 'movie',
            plot: 'In this short prequel to the first Pirates of the Caribbean movie, two feisty brides-to-be discover that they have something in common - the absent groom. Still, there are plenty of pirates who\'d love to trade their goats for \'em.',
            genres: ['Short', 'Action', 'Adventure'],
            directors: ['James Ward Byrkit'],
            writers: ['Ted Elliott', 'Terry Rossio', 'Stuart Beattie'],
            actors: ['John Vickery', 'Vanessa Branch', 'Lauren Maher'],
          },
          {
            title: 'Silicon Valley',
            year: 2014,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2Q5YjNjZWMtYThmYy00N2ZjLWE2NDctNmZjMmZjYWE2NjEwXkEyXkFqcGdeQXVyMTAzMDM4MjM0._V1_SX300.jpg',
            type: 'series',
            plot: 'Follows the struggle of Richard Hendricks, a Silicon Valley engineer trying to build his own company called Pied Piper.',
            genres: ['Comedy'],
            directors: ['Mike Judge'],
            writers: ['John Altschuler', 'Mike Judge', 'Dave Krinsky'],
            actors: ['Thomas Middleditch', 'T.J. Miller', 'Josh Brener'],
          },
        ],
        genres: [
          'Action',
          'Adventure',
          'Comedy',
          'Drama',
          'Fantasy',
          'Horror',
          'Mystery',
          'Romance',
          'Sci-Fi',
          'Thriller',
        ],
      }

      await db.transaction(async (tx) => {
        // clean up db
        await Promise.all([
          tx.delete(genres),
          tx.delete(directors),
          tx.delete(writers),
          tx.delete(actors),
          tx.delete(movies),
        ])

        const extractGenres = seed.movies.map(movie => movie.genres).flat()
        const mergeGenres = new Set(seed.genres.concat(extractGenres))

        const genresFromDB = await tx.insert(genres)
          .values(
            Array.from(mergeGenres).map(name => ({ name })),
          )
          .returning()

        const extractDirectors = new Set(seed.movies.map(movie => movie.directors).flat())
        const directorsFromDB = await tx.insert(directors)
          .values(
            Array.from(extractDirectors).map(name => ({ name })),
          )
          .returning()

        const extractWriters = new Set(seed.movies.map(movie => movie.writers).flat())
        const writersFromDB = await tx.insert(writers)
          .values(
            Array.from(extractWriters).map(name => ({ name })),
          )
          .returning()

        const extractActors = new Set(seed.movies.map(movie => movie.actors).flat())
        const actorsFromDB = await tx.insert(actors)
          .values(
            Array.from(extractActors).map(name => ({ name })),
          )
          .returning()

        await Promise.all(seed.movies.map(async (movie) => {
          const movieFromDb = await tx.insert(movies)
            .values({
              title: movie.title,
              year: movie.year,
              posterUrl: movie.posterUrl,
              type: movie.type,
              plot: movie.plot,
            })
            .returning({ id: movies.id })

          const insertGenres = tx.insert(moviesGenres).values(movie.genres.map(genre => ({
            genreId: genresFromDB.find(_ => _.name === genre)!.id,
            movieId: movieFromDb[0].id,
          })))
          const insertDirectors = tx.insert(moviesDirectors).values(movie.directors.map(director => ({
            genreId: directorsFromDB.find(_ => _.name === director)!.id,
            movieId: movieFromDb[0].id,
          })))
          const insertWriters = tx.insert(moviesWriters).values(movie.writers.map(writer => ({
            genreId: writersFromDB.find(_ => _.name === writer)!.id,
            movieId: movieFromDb[0].id,
          })))
          const insertActors = tx.insert(moviesActors).values(movie.actors.map(actor => ({
            genreId: actorsFromDB.find(_ => _.name === actor)!.id,
            movieId: movieFromDb[0].id,
          })))

          await Promise.all([insertGenres, insertDirectors, insertWriters, insertActors])
        }))
      })

      return c.json({ message: 'Database seeded' })
    },
  )
