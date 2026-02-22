import { z } from "zod"

export const responseSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(),
    fields: z.optional(z.record(z.string(), z.string())),
    secretField: z.optional(z.string())
})

export type GeneralResponse = z.infer<typeof responseSchema>