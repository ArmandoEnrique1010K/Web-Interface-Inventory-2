import { z } from "zod"

export const responseSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(),
    fields: z.optional(z.record(z.string(), z.string())),
    secretField: z.optional(z.string())
})

// TODO: INVESTIGAR EL TIPO DE DATO QUE DEVUELVE LA API REST EN LISTAS Y PAGINAS
export const dataSchema = z.object({
    data: z.any()
})

export type GeneralResponse = z.infer<typeof responseSchema>
export type DataResponse = z.infer<typeof dataSchema>



export type MenuItem = {
    label: string;
    icon: string;
    to: string;
}
