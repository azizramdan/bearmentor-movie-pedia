import { z } from 'zod'

export const MovieRequestSchema = z
  .object({
    title: z.string().min(1),
    year: z.coerce.number().int().min(1900).max(2100),
    genres: z.array(z.coerce.number().int().min(1)).min(1),
    directors: z.array(z.coerce.number().int().min(1)).min(1),
    writers: z.array(z.coerce.number().int().min(1)).min(1),
    posterUrl: z.string().url(),
    type: z.enum(['movie', 'series']),
    plot: z.string().min(1),
    actors: z.array(z.coerce.number().int().min(1)).min(1),
  })

export const MovieIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})
