import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

(async () => {
  const sql = postgres(String(process.env.DATABASE_URL), { max: 1 })

  await migrate(drizzle(sql), { migrationsFolder: 'src/db/migrations' })

  await sql.end()
})()
