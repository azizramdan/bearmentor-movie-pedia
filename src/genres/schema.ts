import { z } from 'zod'

export const GenreRequestSchema = z
  .object({
    name: z.string().min(1),
  })

export const GenreIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const QueryGenreSchema = z.object({
  name: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
