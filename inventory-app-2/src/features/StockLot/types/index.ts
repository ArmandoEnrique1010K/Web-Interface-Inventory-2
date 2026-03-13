import { z } from "zod"

export const companySchema = z.object({
    id: z.number(),
    name: z.string()
})

export const stockLotSchema = z.object({
    id: z.number(),
    batch: z.string(),
    quantityReceived: z.string(),
    quantityAvailable: z.string(),
    quantityDelivered: z.string(),
    quantityLost: z.string(),
    quantityRecovered: z.string(),
    temporary: z.boolean(),
    zeroStock: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    status: z.boolean(),

    // Otras entidades asociadas a StockLot
    modelId: z.string(),
    modelName: z.string(),
    modelImageUrl: z.string(),

    companyId: z.string(),
    companyName: z.string(),

    productId: z.string(),
    productName: z.string(),

    typeId: z.string(),
    typeName: z.string(),

    categoryId: z.string(),
    categoryName: z.string(),

    // Otros campos 
    quantity: z.string(),
    comment: z.string(),
    stockLotReceiverId: z.string(),
})

type Company = z.infer<typeof companySchema>
type StockLot = z.infer<typeof stockLotSchema>

export type CompanyForm = Pick<Company, "name">;
export type StockLotReceiveForm = Pick<StockLot, "quantity" | "comment" | "modelId" | "companyId">;
export type StockLotTransferForm = Pick<StockLot, "quantity" | "comment" | "stockLotReceiverId">;
export type StockLotAdjustmentForm = Pick<StockLot, "quantity" | "comment">;

export type CompanyItem = Company;
export type StockLotItem = Pick<StockLot, "id" | "batch" | "quantityAvailable" | "quantityReceived" | "createdAt" | "modelId" | "modelName" | "modelImageUrl" | "productId" | "productName">
export type StockLotDetailsItem = Pick<StockLot, "id" | "batch" | "quantityReceived" | "quantityAvailable" |
    "quantityDelivered" | "quantityLost" | "quantityRecovered" | "temporary" | "createdAt" | "updatedAt" | "modelId" |
    "modelName" | "modelImageUrl" | "companyId" | "companyName" | "productId" | "productName" | "typeId" | "typeName" |
    "categoryId" | "categoryName">
export type StockLotSameProductItem = Pick<StockLot, "id" | "batch" | "quantityAvailable" | "createdAt">
