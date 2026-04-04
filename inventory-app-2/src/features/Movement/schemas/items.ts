import { z } from "zod";
import { movementSchema } from "./entities";

export const movementItemSchema = movementSchema.pick({
    id: true,
    quantity: true,
    createdAt: true,
    movementType: true,
    userName: true,
    modelId: true,
    modelName: true,
});

export const movementItemDetailSchema = movementSchema.pick({
    id: true,
    quantity: true,
    comment: true,
    createdAt: true,
    movementType: true,
    userName: true,
    modelId: true,
    modelName: true,
    movements_StockLots: true,
    stockLotReceiverId: true,
    stockLotReceiverBatch: true,
    stockLotEmitterId: true,
    stockLotEmitterBatch: true,
    deliveryLineId: true,
});

export type MovementItem = z.infer<typeof movementItemSchema>;
export type MovementDetailItem = z.infer<typeof movementItemDetailSchema>;

export type MovementTypeOptions = {
    value: MovementItem["movementType"];
    label: string;
    icon: React.ReactNode;
    color: string;
};
