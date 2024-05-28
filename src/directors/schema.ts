import { z } from 'zod'

export const DirectorRequestSchema = z
  .object({
    name: z.string().min(1),
  })

export const DirectorIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const QueryDirectorSchema = z.object({
  name: z.string().optional(),
})
