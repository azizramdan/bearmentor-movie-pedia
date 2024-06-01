import { desc, eq, ilike } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { GenreRequestSchema, QueryGenreSchema } from './schema'

export async function getAll(query?: z.infer<typeof QueryGenreSchema>) {
  return await db.query.genres.findMany({
    where: (
      query?.name
        ? ilike(dbSchema.genres.name, `%${query.name}%`)
        : undefined
    ),
    orderBy: query?.sortBy
      ? [query.sortOrder === 'desc' ? desc(dbSchema.genres[query.sortBy]) : dbSchema.genres[query.sortBy]]
      : dbSchema.genres.id,
  })
}

export async function getById(id: number) {
  const genre = await db.query.genres.findFirst({
    where: (eq(dbSchema.genres.id, id)),
  })

  return genre || null
}

export async function create(data: z.infer<typeof GenreRequestSchema>) {
  return (await db.insert(dbSchema.genres).values(data).returning({ id: dbSchema.genres.id }))[0].id
}

export async function deleteAll() {
  await db.delete(dbSchema.genres)
}

export async function deleteById(id: number) {
  await db.delete(dbSchema.genres).where(eq(dbSchema.genres.id, id))
}

export async function update(id: number, data: Partial<z.infer<typeof GenreRequestSchema>>) {
  await db.update(dbSchema.genres)
    .set(data)
    .where(eq(dbSchema.genres.id, id))
}

export async function isExists(id: number) {
  const exists = await db.query.genres.findFirst({
    columns: { id: true },
    where: eq(dbSchema.genres.id, id),
  })

  return Boolean(exists)
}
