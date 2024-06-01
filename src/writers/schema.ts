import { z } from 'zod'

export const WriterRequestSchema = z
  .object({
    name: z.string().min(1),
  })

export const WriterIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const QueryWriterSchema = z.object({
  name: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
