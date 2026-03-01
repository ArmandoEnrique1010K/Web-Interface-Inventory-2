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

export const dataPageSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    data: z.object({
        content: z.array(z.any()),
        page: z.number(),
        size: z.number(),
        totalElements: z.number(),
        totalPages: z.number(),
        first: z.boolean(),
        last: z.boolean(),
    })
})



// export const pageDataSchema ...

export type GeneralResponse = z.infer<typeof responseSchema>
export type DataResponse = z.infer<typeof dataSchema>
export type DataPageResponse = z.infer<typeof dataPageSchema>


// Tipo de dato de los items del menu en Sidebar
export type MenuItem = {
    label: string;
    icon: React.ReactNode;
    to: string;
}

export type GeneralError = {
    type: string,
    message: string,
    fields: Record<string, string>
}
