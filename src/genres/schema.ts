import { z } from 'zod'

export const GenreRequestSchema = z
  .object({
    name: z.string().min(1),
  })

export const GenreIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})
