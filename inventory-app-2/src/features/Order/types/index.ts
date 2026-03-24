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
    modelImageUrl: z.string()
})

type DeliveryOrder = z.infer<typeof deliveryOrderSchema>
type ModelDeliveryOrder = z.infer<typeof modelDeliveryOrderSchema>

// DeliveryOrder
export type DeliveryOrderForm = Pick<DeliveryOrder, "limitDate" | "userIdClient">;
export type DeliveryOrderCommentForm = Pick<DeliveryOrder, "movementComment">;

export type DeliveryOrderItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "userClientFullname" | "orderStatus">;
export type DeliveryOrderDetailsItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "priorityDate" | "createdByUser" | "updatedByUser" | "userClientFullname" | "createdAt" | "updatedAt" | "orderStatus">;
export type DeliveryOrderClientItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "priorityDate" | "orderStatus">
export type DeliveryOrderClientDetailsItem = Pick<DeliveryOrder, "id" | "batch" | "limitDate" | "userClientFullname" | "orderStatus">


// ModelDeliveryOrder
export type ModelDeliveryOrderItem = ModelDeliveryOrder;