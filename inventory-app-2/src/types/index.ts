import { z } from "zod"

// SCHEMA GENERICO CON UN <T>
export const createDataResponseSchema = <T extends z.ZodType>(schema: T) =>
    z.object({
        type: z.enum(['success', 'error']),
        status: z.number(),
        // Los 2 campos son opcionales porque puede devolver un mensaje, un objeto o un arreglo con los datos
        message: z.string().optional(),  // <--- opcional
        data: schema.optional()
    })

// Schema específico para datos no tipados (manteniendo compatibilidad)
export const dataSchema = createDataResponseSchema(z.any())

export const createMessageResponseSchema = () => z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(), // obligatorio
})


// Una pagina como respuesta
export const createPageSchema = <T extends z.ZodType>(schema: T) => z.object({
    content: z.array(schema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    first: z.boolean(),
    last: z.boolean()
})

// Una lista de datos como respuesta
export const createListSchema = <T extends z.ZodType>(schema: T) => z.array(
    schema
)

export const createListDataResponseSchema = <T extends z.ZodType>(schema: T) =>
    createDataResponseSchema(createListSchema(schema))


// // Un solo dato como respuesta
// export const createDataSchema = <T extends z.ZodType>(schema: T) => z.object(
//     schema.optional()
// )


export const messageResponseSchema = createMessageResponseSchema();






// O si quieres mantener compatibilidad con Zod:
export type DataResponse<T = unknown> = z.infer<typeof dataSchema> & {
    data: T
}

export type DataPageResponse<T = unknown> = z.infer<typeof dataSchema> & {
    data: {
        content: T,
        page: number,
        size: number,
        totalElements: number,
        totalPages: number,
        first: boolean,
        last: boolean
    }
}


export const responseSchema = z.object({
    type: z.enum(['success', 'error']),
    status: z.number(),
    message: z.string(),
    fields: z.optional(z.record(z.string(), z.string())),
    secretField: z.optional(z.string())
})


export type GeneralResponse = z.infer<typeof responseSchema>


// Mensaje de error generico
export type GeneralError = {
    type: string,
    message: string,
    fields: Record<string, string>
}


// Tipo de dato de los items del menu en Sidebar
export type MenuItem = {
    label: string;
    icon: React.ReactNode;
    to: string;
}
