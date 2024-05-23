import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE!,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  verbose: true,
  strict: true,
})
