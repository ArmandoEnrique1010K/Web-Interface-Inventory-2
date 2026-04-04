import { z } from "zod";

// Se definen esquemas por cada tipo de dato que devuelve la API REST, a excepcion de un solo mensaje como respuesta
export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
    status: z.boolean(),
});

export const typeSchema = z.object({
    id: z.number(),
    name: z.string(),
    status: z.boolean(),
});

export const modelSchema = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    // en Zod, nullable permite que un campo tenga el valor null, mientras que optional hace que el campo sea completamente opcional, es decir que podria no existir
    entryDate: z.string().nullable(),
    caducityDate: z.string().nullable(),
    totalQuantityAvailable: z.number(),
    totalQuantityReceived: z.number(),
    totalQuantityDelivered: z.number(),
    status: z.boolean(),

    productId: z.number(),
    productName: z.string(),
    productLength: z.number().nullable(),
    productWidth: z.number().nullable(),
    productHeight: z.number().nullable(),
    productStatus: z.boolean(),

    categoryId: z.number(),
    categoryName: z.string(),

    typeId: z.number(),
    typeName: z.string(),

    // Concatenación
    modelProductName: z.string(),
});

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    length: z.number().nullable(), // INDICA QUE EL CAMPO EXISTE PERO PUEDE SER NULL
    width: z.number().nullable(),
    height: z.number().nullable(),
    quantityModels: z.number(),
    status: z.boolean(),

    // Categoria
    categoryId: z.number(),
    categoryName: z.string(),

    // Modelo
    modelName: z.string(),
    modelImageUrl: z.string(),
    modelEntryDate: z.string(),
    modelCaducityDate: z.string(),

    // Tipo
    typeId: z.number(),
    typeName: z.string(),
});

