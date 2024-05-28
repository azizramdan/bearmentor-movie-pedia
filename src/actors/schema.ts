import { z } from 'zod'

export const ActorRequestSchema = z
  .object({
    name: z.string().min(1),
  })

export const ActorIdSchema = z.object({
  id: z.coerce.number().int().min(1),
})

export const QueryActorSchema = z.object({
  name: z.string().optional(),
})
