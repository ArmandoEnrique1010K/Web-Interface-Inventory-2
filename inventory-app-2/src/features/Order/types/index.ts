import { z } from "zod"

export const deliveryOrderSchema = z.object({
    id: z.number(),
    batch: z.string(),
    limitDate: z.string().nullable(),
    priorityDate: z.string().nullable(),
    orderStatus: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),

    createdByUser: z.string(),
    updatedByUser: z.string(),

    userIdClient: z.string(),
    userClientFullname: z.string(),
    preparationStatus: z.string(),
    movementComment: z.string()
})

export const modelDeliveryOrderSchema = z.object({
    id: z.number(),
    requiredQuantityTotal: z.number(),
    modelId: z.string(),
    modelName: z.string(),
    modelImageUrl: z.string(),
    productName: z.string(),
})

export const deliveryLineSchema = z.object({
    id: z.number(),
    requiredQuantity: z.string(),
    deliveredQuantity: z.string(),
    pendingQuantity: z.string(),
    limitDate: z.string(),
    updatedAt: z.string(),
    lineStatus: z.string(), // ES UN ENUM

    userUpdaterFullname: z.string(),

    modelId: z.string(),
    modelName: z.string(),
    modelImageUrl: z.string(),
    modelproductName: z.string(),

    productId: z.string(),
    productName: z.string(),

    categoryId: z.string(),
    categoryName: z.string(),

    typeId: z.string(),
    typeName: z.string(),

    locationId: z.string(),
    locationName: z.string(),

    subregionId: z.string(),
    subregionName: z.string(),

    regionId: z.string(),
    regionName: z.string(),


    deliveryOrderId: z.string(),
    deliveryOrderBatch: z.string(),
    deliveryOrderLimitDate: z.string(),

    movementComment: z.string(),
    stockLotsIds: z.array(z.number()),
    quantity: z.string(),
})

export const stockLotDeliveryLineSchema = z.object({
    id: z.number(),
    quantityUsed: z.number(),
    createdAt: z.string(),
    stockLotId: z.number(),
    stockLotBatch: z.string()
})

type DeliveryOrder = z.infer<typeof deliveryOrderSchema>
type ModelDeliveryOrder = z.infer<typeof modelDeliveryOrderSchema>
type DeliveryLine = z.infer<typeof deliveryLineSchema>
type StockLotDeliveryLine = z.infer<typeof stockLotDeliveryLineSchema>

// DeliveryOrder
export type DeliveryOrderForm = Pick<DeliveryOrder, "limitDate" | "userIdClient">;
export type DeliveryOrderCommentForm = Pick<DeliveryOrder, "movementComment">;

export type DeliveryOrderItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "userClientFullname" | "orderStatus">;
export type DeliveryOrderDetailsItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "priorityDate" | "createdByUser" | "updatedByUser" | "userClientFullname" | "createdAt" | "updatedAt" | "orderStatus">;
export type DeliveryOrderClientItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "priorityDate" | "orderStatus">
export type DeliveryOrderClientDetailsItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "userClientFullname" | "orderStatus">


// ModelDeliveryOrder
export type ModelDeliveryOrderItem = ModelDeliveryOrder;

// DELIVERY LINE
export type DeliveryLineForm = Pick<DeliveryLine, "requiredQuantity" | "locationId" | "limitDate" | "modelId">
export type DeliveryLineAllocateForm = Pick<DeliveryLine, "quantity" | "stockLotsIds">
export type DeliveryLineAlterForm = Pick<DeliveryLine, "quantity" | "movementComment">
export type DeliveryLineUpdateForm = Pick<DeliveryLine, "requiredQuantity" | "limitDate" | "movementComment">

export type DeliveryLineItem = Pick<DeliveryLine, "id" | "requiredQuantity" | "deliveredQuantity" | "pendingQuantity" | "limitDate" | "lineStatus" | "modelId" | "modelproductName" | "locationId" | "locationName" | "subregionId" | "subregionName" | "regionId" | "regionName">
export type DeliveryLineDetailsItem = Pick<DeliveryLine, "id" | "requiredQuantity" | "deliveredQuantity" | "pendingQuantity" | "limitDate" | "updatedAt" | "lineStatus" | "userUpdaterFullname" | "locationId" | "locationName" | "regionId" | "regionName" | "modelId" | "modelName" | "modelImageUrl" | "productId" | "productName" | "categoryId" | "categoryName" | "typeId" | "typeName" | "deliveryOrderId" | "deliveryOrderBatch" | "deliveryOrderLimitDate">
export type StockLotDeliveryLineItem = StockLotDeliveryLine

export type LineStatusEnum = "LINE_MISSING" | "LINE_READY" | "LINE_PENDING" | "LINE_DELIVERED" | "LINE_CANCELED" | "LINE_EXCEEDED"