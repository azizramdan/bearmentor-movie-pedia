import { eq } from 'drizzle-orm'
import type { z } from 'zod'
import { db } from '../db/db'
import * as dbSchema from '../db/schema'
import type { WriterRequestSchema } from './schema'

export async function getAll() {
  return await db.query.writers.findMany()
}

export async function getById(id: number) {
  const writer = await db.query.writers.findFirst({
    where: (eq(dbSchema.writers.id, id)),
  })

  return writer || null
}

export async function create(data: z.infer<typeof WriterRequestSchema>) {
  return (await db.insert(dbSchema.writers).values(data).returning({ id: dbSchema.writers.id }))[0].id
}

export async function deleteAll() {
  await db.delete(dbSchema.writers)
}

export async function deleteById(id: number) {
  await db.delete(dbSchema.writers).where(eq(dbSchema.writers.id, id))
}

export async function update(id: number, data: Partial<z.infer<typeof WriterRequestSchema>>) {
  await db.update(dbSchema.writers)
    .set(data)
    .where(eq(dbSchema.writers.id, id))
}

export async function isExists(id: number) {
  const exists = await db.query.writers.findFirst({
    columns: { id: true },
    where: eq(dbSchema.writers.id, id),
  })

  return Boolean(exists)
}
