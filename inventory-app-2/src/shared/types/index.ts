import { z } from "zod"

export const responseSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(),
    fields: z.optional(z.record(z.string(), z.string())),
    secretField: z.optional(z.string())
})

// TODO: INVESTIGAR EL TIPO DE DATO QUE DEVUELVE LA API REST EN  PAGINAS
export const dataSchema = z.object({
    data: z.any()
})

// export const pageDataSchema ...

export type GeneralResponse = z.infer<typeof responseSchema>
export type DataResponse = z.infer<typeof dataSchema>


// Tipo de dato de los items del menu en Sidebar
export type MenuItem = {
    label: string;
    icon: React.ReactNode;
    to: string;
}
