import { eq, ilike } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { DirectorRequestSchema, QueryDirectorSchema } from './schema'

export async function getAll(query?: z.infer<typeof QueryDirectorSchema>) {
  return await db.query.directors.findMany({
    where: (
      query?.name
        ? ilike(dbSchema.directors.name, `%${query.name}%`)
        : undefined
    ),
  })
}

export async function getById(id: number) {
  const director = await db.query.directors.findFirst({
    where: (eq(dbSchema.directors.id, id)),
  })

  return director || null
}

export async function create(data: z.infer<typeof DirectorRequestSchema>) {
  return (await db.insert(dbSchema.directors).values(data).returning({ id: dbSchema.directors.id }))[0].id
}

export async function deleteAll() {
  await db.delete(dbSchema.directors)
}

export async function deleteById(id: number) {
  await db.delete(dbSchema.directors).where(eq(dbSchema.directors.id, id))
}

export async function update(id: number, data: Partial<z.infer<typeof DirectorRequestSchema>>) {
  await db.update(dbSchema.directors)
    .set(data)
    .where(eq(dbSchema.directors.id, id))
}

export async function isExists(id: number) {
  const exists = await db.query.directors.findFirst({
    columns: { id: true },
    where: eq(dbSchema.directors.id, id),
  })

  return Boolean(exists)
}
