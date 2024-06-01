import { z } from 'zod'

export const MovieRequestSchema = z
  .object({
    title: z.string().min(1),
    year: z.coerce.number().int().min(1900).max(2100),
    genres: z.array(z.coerce.number().int().min(1)).optional(),
    directors: z.array(z.coerce.number().int().min(1)).optional(),
    writers: z.array(z.coerce.number().int().min(1)).optional(),
    posterUrl: z.string().url(),
    type: z.enum(['movie', 'series']),
    plot: z.string().min(1),
    actors: z.array(z.coerce.number().int().min(1)).optional(),
  })

export const MovieIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const QueryMovieSchema = z.object({
  title: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  type: z.enum(['movie', 'series']).optional(),
  sortBy: z.enum(['title', 'year', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
