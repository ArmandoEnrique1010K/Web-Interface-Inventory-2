import { z } from "zod";

import { companySchema, stockLotSchema } from "./entities";

// POR CADA "RESPONSE" SE DEFINE UN SCHEMA, EN EL QUE SE EXTRAE LAS PROPIEDADES NECESARIAS DE CADA ITEM
export const stockLotItemSchema = stockLotSchema.pick({
    id: true,
    batch: true,
    quantityAvailable: true,
    quantityReceived: true,
    createdAt: true,
    modelId: true,
    modelName: true,
    modelImageUrl: true,
    productId: true,
    productName: true,
});

export const stockLotDetailItemSchema = stockLotSchema.pick({
    id: true,
    batch: true,
    quantityReceived: true,
    quantityAvailable: true,
    quantityDelivered: true,
    quantityLost: true,
    quantityRecovered: true,
    temporary: true,
    createdAt: true,
    updatedAt: true,
    modelId: true,
    modelName: true,
    modelImageUrl: true,
    companyId: true,
    companyName: true,
    productId: true,
    productName: true,
    typeId: true,
    typeName: true,
    categoryId: true,
    categoryName: true,
});

export const stockLotSameProductItemSchema = stockLotSchema.pick({
    id: true,
    batch: true,
    quantityAvailable: true,
    createdAt: true,
});

export const companyItemSchema = companySchema;

// EL UNICO AL QUE SE UTILIZARA TODAS LAS PROPIEDADES
export type CompanyItem = z.infer<typeof companyItemSchema>;

export type StockLotItem = z.infer<typeof stockLotItemSchema>;
export type StockLotDetailItem = z.infer<typeof stockLotDetailItemSchema>;
export type StockLotSameProductItem = z.infer<
    typeof stockLotSameProductItemSchema
>;
