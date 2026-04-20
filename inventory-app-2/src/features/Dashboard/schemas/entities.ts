import { z } from "zod";

const pendingDeliveryOrdersSchema = z.object({
    id: z.number(),
    batch: z.string(),
    priorityDate: z.string().nullable(),
    percentage: z.number(),
});

const modelSchema = z.object({
    id: z.number(),
    modelName: z.string(),
    totalQuantityAvailable: z.number(),
    productId: z.number(),
    productName: z.string(),
    categoryName: z.string(),
    typeName: z.string(),
    entryDate: z.string(),
    caducityDate: z.string(),
});

const movementSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    movementType: z.enum([
        "MOVEMENT_STOCK_RECEIVE",
        "MOVEMENT_STOCK_INCREASE",
        "MOVEMENT_STOCK_DECREASE",
        "MOVEMENT_STOCK_RECOVERY",
        "MOVEMENT_STOCK_TRANSFER",
        "MOVEMENT_STOCK_REFUND",
        "MOVEMENT_LINE_ALLOCATE",
        "MOVEMENT_LINE_ALTER",
        "MOVEMENT_LINE_RETURN",
        "MOVEMENT_LINE_CHANGE",
        "MOVEMENT_LINE_CANCELED",
        "MOVEMENT_LINE_LOST",
        "MOVEMENT_LINE_MISSING",
        "MOVEMENT_LINE_DELIVERED",
        "MOVEMENT_LINE_SIMULTANEOUS",
    ]),
    userFirstname: z.string(),
    userLastName: z.string(),
    modelId: z.number(),
    modelName: z.string(),
    productId: z.number(),
    productName: z.string(),
});

export const dashboardSchema = z.object({
    pendingDeliveryOrdersByUserCount: z.number(),
    quantityDeliveryOrdersPending: z.number(),
    quantityModelsActive: z.number(),
    quantityLowStockModels: z.number(),
    quantityNearCaducityDateModels: z.number(),
    quantityMovementsToday: z.number(),

    pendingDeliveryOrdersByUser: z.array(pendingDeliveryOrdersSchema),
    pendingDeliveryOrders: z.array(pendingDeliveryOrdersSchema),
    lowStockModels: z.array(modelSchema),
    recentModels: z.array(modelSchema),
    expiringSoonModels: z.array(modelSchema),
    recentMovements: z.array(movementSchema),
});
