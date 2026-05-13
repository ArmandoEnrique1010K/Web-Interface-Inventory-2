import { z } from "zod";
import { movement_StockLotSchema, movementSchema } from "./entities";

export const movementItemSchema = movementSchema.pick({
    id: true,
    quantity: true,
    createdAt: true,
    movementType: true,
    userName: true,
    modelId: true,
    modelName: true,
    productId: true,
    productName: true,
});

export const movementItemDetailSchema = movementSchema.pick({
    id: true,
    quantity: true,
    comment: true,
    createdAt: true,
    movementType: true,
    userName: true,
    productId: true,
    productName: true,
    modelId: true,
    modelName: true,
    imageUrl: true,
    movements_StockLots: true,
    stockLotReceiverId: true,
    stockLotReceiverBatch: true,
    stockLotEmitterId: true,
    stockLotEmitterBatch: true,
    deliveryLineId: true,
    deliveryOrderId: true,
    deliveryOrderBatch: true,
});

export const movement_StockLotItemSchema = movement_StockLotSchema;

export type MovementItem = z.infer<typeof movementItemSchema>;
export type MovementDetailItem = z.infer<typeof movementItemDetailSchema>;
export type MovementStockLotItem = z.infer<typeof movement_StockLotItemSchema>;

export type MovementTypeOptions = {
    value: MovementItem["movementType"];
    label: string;
    icon: React.ReactNode;
    color: string;
};
