import { z } from "zod";

// SE AGRUPAN TODAS LAS PROPIEDADES DEFINIDAS EN CADA REQUEST Y RESPONSE DE LOS DTOs DEL BACKEND
// REPRESENTA UNA ENTIDAD DE LOS CAMPOS ASOCIADOS A UN SOLO MODULO
export const companySchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const stockLotSchema = z.object({
    id: z.number(),
    batch: z.string(),
    quantityReceived: z.number(),
    quantityAvailable: z.number(),
    quantityDelivered: z.number(),
    quantityLost: z.number(),
    quantityRecovered: z.number(),
    temporary: z.boolean(),
    zeroStock: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.boolean(),

    // Otras entidades asociadas a StockLot
    modelId: z.number(),
    modelName: z.string(),
    modelImageUrl: z.string(),

    companyId: z.number(),
    companyName: z.string(),

    productId: z.number(),
    productName: z.string(),

    typeId: z.number(),
    typeName: z.string(),

    categoryId: z.number(),
    categoryName: z.string(),

    // Otros campos
    quantity: z.number(),
    comment: z.string(),
    stockLotReceiverId: z.number(),
});
