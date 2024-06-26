import { desc, eq, ilike } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { ActorRequestSchema, QueryActorSchema } from './schema'

export async function getAll(query?: z.infer<typeof QueryActorSchema>) {
  return await db.query.actors.findMany({
    where: (
      query?.name
        ? ilike(dbSchema.actors.name, `%${query.name}%`)
        : undefined
    ),
    orderBy: query?.sortBy
      ? [query.sortOrder === 'desc' ? desc(dbSchema.actors[query.sortBy]) : dbSchema.actors[query.sortBy]]
      : dbSchema.actors.id,
  })
}

export async function getById(id: number) {
  const actor = await db.query.actors.findFirst({
    where: (eq(dbSchema.actors.id, id)),
  })

  return actor || null
}

export async function create(data: z.infer<typeof ActorRequestSchema>) {
  return (await db.insert(dbSchema.actors).values(data).returning({ id: dbSchema.actors.id }))[0].id
}

export async function deleteAll() {
  await db.delete(dbSchema.actors)
}

export async function deleteById(id: number) {
  await db.delete(dbSchema.actors).where(eq(dbSchema.actors.id, id))
}

export async function update(id: number, data: Partial<z.infer<typeof ActorRequestSchema>>) {
  await db.update(dbSchema.actors)
    .set(data)
    .where(eq(dbSchema.actors.id, id))
}

export async function isExists(id: number) {
  const exists = await db.query.actors.findFirst({
    columns: { id: true },
    where: eq(dbSchema.actors.id, id),
  })

  return Boolean(exists)
}
