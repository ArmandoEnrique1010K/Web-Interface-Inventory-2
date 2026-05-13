import { z } from "zod";

export const movementSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    comment: z.string(),
    createdAt: z.string(),
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
    userName: z.string(),

    productId: z.number(),
    productName: z.string(),

    modelId: z.number(),
    modelName: z.string(),
    imageUrl: z.string(),
    // .nullable(): Permite null
    // .optional(): Permite undefined

    movements_StockLots: z.array(z.number().nullable()),
    stockLotReceiverId: z.number().nullable(),
    stockLotReceiverBatch: z.string().nullable(),
    stockLotEmitterId: z.number().nullable(),
    stockLotEmitterBatch: z.string().nullable(),
    deliveryLineId: z.number().nullable(),
    deliveryOrderId: z.number().nullable(),
    deliveryOrderBatch: z.string().nullable(),
});

export const movement_StockLotSchema = z.object({
    id: z.number(),
    quantityTaken: z.number(),
    stockLotId: z.number(),
    stockLotBatch: z.string(),
});
