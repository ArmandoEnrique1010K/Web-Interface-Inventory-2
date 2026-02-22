import { z } from "zod"

export const responseSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(),
    // fields: z.optional(z.array(z.object({
    //     field: z.string(),
    //     message: z.string(),
    // }))),
    fields: z.optional(z.record(z.string(), z.string()))

})

export type GeneralResponse = z.infer<typeof responseSchema>
// export type ApiFieldErrors = {
//     message: string,
//     fields: Record<string, string>
// }

// Inferido del responseSchema cuando hay errores
export type ApiFieldErrors = Extract<GeneralResponse, { type: 'error' }> & {
    fields: NonNullable<GeneralResponse['fields']>
}