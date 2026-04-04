import { z } from "zod";
import {
    deliveryOrderSchema,
    modelDeliveryOrderSchema,
    deliveryLineSchema,
    stockLotDeliveryLineSchema,
} from "./entities";

// DeliveryOrder
export const deliveryOrderItemSchema = deliveryOrderSchema.pick({
    id: true,
    batch: true,
    limitDate: true,
    priorityDate: true,
    userClientFullname: true,
    orderStatus: true,
});

export const deliveryOrderDetailsItemSchema = deliveryOrderSchema.pick({
    id: true,
    batch: true,
    limitDate: true,
    priorityDate: true,
    createdByUser: true,
    updatedByUser: true,
    userClientFullname: true,
    createdAt: true,
    updatedAt: true,
    orderStatus: true,
});
export const deliveryOrderClientItemSchema = deliveryOrderSchema.pick({
    id: true,
    batch: true,
    limitDate: true,
    priorityDate: true,
    orderStatus: true,
});
export const deliveryOrderClientDetailsItemSchema = deliveryOrderSchema.pick({
    id: true,
    batch: true,
    limitDate: true,
    userClientFullname: true,
    orderStatus: true,
});

export type DeliveryOrderItem = z.infer<typeof deliveryOrderItemSchema>;
export type DeliveryOrderDetailsItem = z.infer<
    typeof deliveryOrderDetailsItemSchema
>;
export type DeliveryOrderClientItem = z.infer<
    typeof deliveryOrderClientItemSchema
>;
export type DeliveryOrderClientDetailsItem = z.infer<
    typeof deliveryOrderClientDetailsItemSchema
>;

// MODEL - DELIVERY ORDER
export const modelDeliveryOrderItemSchema = modelDeliveryOrderSchema;

export type ModelDeliveryOrderItem = z.infer<
    typeof modelDeliveryOrderItemSchema
>;

// DELIVERY LINE
export const deliveryLineItemSchema = deliveryLineSchema.pick({
    id: true,
    requiredQuantity: true,
    deliveredQuantity: true,
    pendingQuantity: true,
    limitDate: true,
    lineStatus: true,
    modelId: true,
    modelproductName: true,
    locationId: true,
    locationName: true,
    subregionId: true,
    subregionName: true,
    regionId: true,
    regionName: true,
});

export const deliveryLineDetailsItemSchema = deliveryLineSchema.pick({
    id: true,
    requiredQuantity: true,
    deliveredQuantity: true,
    pendingQuantity: true,
    limitDate: true,
    updatedAt: true,
    lineStatus: true,
    userUpdaterFullname: true,
    locationId: true,
    locationName: true,
    regionId: true,
    regionName: true,
    modelId: true,
    modelName: true,
    modelImageUrl: true,
    productId: true,
    productName: true,
    categoryId: true,
    categoryName: true,
    typeId: true,
    typeName: true,
    deliveryOrderId: true,
    deliveryOrderBatch: true,
    deliveryOrderLimitDate: true,
});

export type DeliveryLineItem = z.infer<typeof deliveryLineItemSchema>;
export type DeliveryLineDetailsItem = z.infer<
    typeof deliveryLineDetailsItemSchema
>;

// STOCK LOT - DELIVERY LINE
export const stockLotDeliveryLineItemSchema = stockLotDeliveryLineSchema;

export type StockLotDeliveryLineItem = z.infer<
    typeof stockLotDeliveryLineItemSchema
>;

export type LineStatusOptions = {
    value: DeliveryLineItem["lineStatus"];
    label: string;
    color?: string;
}[];

export type OrderStatusOptions = {
    value: DeliveryOrderItem["orderStatus"];
    label: string;
    color?: string;
}[];
