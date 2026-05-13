import { z } from "zod";

import { deliveryLineSchema, deliveryOrderSchema } from "./entities";

// DELIVERY ORDER
export const deliveryOrderForm = deliveryOrderSchema.pick({
    limitDate: true,
    userIdClient: true,
});

export const deliveryOrderCommentForm = deliveryOrderSchema.pick({
    movementComment: true,
});

export const deliveryOrderChangeLimitDateForm = deliveryOrderSchema.pick({
    limitDate: true,
});

export type DeliveryOrderForm = z.infer<typeof deliveryOrderForm>;
export type DeliveryOrderCommentForm = z.infer<typeof deliveryOrderCommentForm>;
export type DeliveryOrderChangeLimitDateForm = z.infer<
    typeof deliveryOrderChangeLimitDateForm
>;

// DELIVERY LINE
export const deliveryLineForm = deliveryLineSchema.pick({
    requiredQuantity: true,
    locationId: true,
    limitDate: true,
    modelId: true,
});

export const deliveryLineAllocateForm = deliveryLineSchema.pick({
    quantity: true,
    stockLotsIds: true,
});

export const deliveryLineAlterForm = deliveryLineSchema.pick({
    quantity: true,
    movementComment: true,
});

export const deliveryLineUpdateForm = deliveryLineSchema.pick({
    requiredQuantity: true,
    limitDate: true,
    movementComment: true,
});

export type DeliveryLineForm = z.infer<typeof deliveryLineForm>;
export type DeliveryLineAllocateForm = z.infer<typeof deliveryLineAllocateForm>;
export type DeliveryLineAlterForm = z.infer<typeof deliveryLineAlterForm>;
export type DeliveryLineUpdateForm = z.infer<typeof deliveryLineUpdateForm>;
