import { z } from "zod"

export const movementSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    comment: z.string(),
    createdAt: z.string(),
    movementType: z.string(),
    userName: z.string(),
    modelId: z.string(),
    modelName: z.string(),
    movements_StockLots: z.array(z.number()),
    stockLotReceiverId: z.string(),
    stockLotReceiverBatch: z.string(),
    stockLotEmitterId: z.string(),
    stockLotEmitterBatch: z.string(),
    deliveryLineId: z.string()
})

export type Movement = z.infer<typeof movementSchema>

export type MovementItem = Pick<Movement, "id" | "quantity" | "createdAt" | "movementType" | "userName" | "modelId" | "modelName">
export type MovementDetailsItem = Movement;