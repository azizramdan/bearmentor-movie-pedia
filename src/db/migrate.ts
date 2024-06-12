import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

(async () => {
  const sql = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: (process.env.DB_SSL as unknown) || false,
    max: 1,
  })

  await migrate(drizzle(sql), { migrationsFolder: 'src/db/migrations' })

  await sql.end()
})()
