import { z } from "zod";

export const deliveryOrderSchema = z.object({
    id: z.number(),
    batch: z.string(),
    limitDate: z.string().nullable(),
    priorityDate: z.string().nullable(),
    orderStatus: z.enum([
        "ORDER_READY",
        "ORDER_PENDING",
        "ORDER_DELIVERED",
        "ORDER_CANCELED",
        "ORDER_PARTIALLY_DELIVERED",
    ]),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdByUser: z.string(),
    updatedByUser: z.string(),
    userIdClient: z.number(),
    userClientFullname: z.string(),
    movementComment: z.string(),
    percentage: z.number(),
    deliveredAt: z.string().nullable(),
    onTimeStatus: z.enum(["UNKNOWN", "ON_TIME", "LATE"]),
});

export const modelDeliveryOrderSchema = z.object({
    id: z.number(),
    requiredQuantityTotal: z.number(),
    modelId: z.number(),
    modelName: z.string(),
    modelImageUrl: z.string(),
    productName: z.string(),
});

export const deliveryLineSchema = z.object({
    id: z.number(),
    requiredQuantity: z.number(),
    deliveredQuantity: z.number(),
    pendingQuantity: z.number(),
    limitDate: z.string().nullable(),
    updatedAt: z.string(),
    lineStatus: z.enum([
        "LINE_MISSING",
        "LINE_READY",
        "LINE_PENDING",
        "LINE_DELIVERED",
        "LINE_CANCELED",
        "LINE_EXCEEDED",
    ]),

    userUpdaterFullname: z.string(),

    modelId: z.number(),
    modelName: z.string(),
    modelImageUrl: z.string(),
    modelproductName: z.string(),

    productId: z.number(),
    productName: z.string(),

    categoryId: z.number(),
    categoryName: z.string(),

    typeId: z.number(),
    typeName: z.string(),

    locationId: z.number(),
    locationName: z.string(),

    subregionId: z.number(),
    subregionName: z.string(),

    regionId: z.number(),
    regionName: z.string(),

    deliveryOrderId: z.number(),
    deliveryOrderBatch: z.string(),
    deliveryOrderLimitDate: z.string(),

    movementComment: z.string(),
    stockLotsIds: z.array(z.number()),
    quantity: z.number(),
});

export const stockLotDeliveryLineSchema = z.object({
    id: z.number(),
    quantityUsed: z.number(),
    createdAt: z.string(),
    stockLotId: z.number(),
    stockLotBatch: z.string(),
});

// ARBOL: REGION -> SUBREGION -> MODEL - PRODUCT

const modelProductSchema = z.object({
    modelId: z.number(),
    modelName: z.string(),
    productId: z.number(),
    productName: z.string(),
    totalQuantity: z.number(),
});

const subregionSchema = z.object({
    subregionId: z.number(),
    subregionName: z.string(),
    totalQuantity: z.number(),
    items: z.array(modelProductSchema),
});

export const summarySchema = z.array(
    z.object({
        regionId: z.number(),
        regionName: z.string(),
        totalQuantity: z.number(),
        subregions: z.array(subregionSchema),
    }),
);

// export const deliveryOrderSummarySchema = z.object({
//     deliveryOrderId: z.number(),
//     regions: z.array(regionSchema),
// });
