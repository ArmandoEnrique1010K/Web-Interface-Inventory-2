import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import {
    deliveryLineDetailsItemSchema,
    deliveryLineItemSchema,
    deliveryOrderClientDetailsItemSchema,
    deliveryOrderClientItemSchema,
    deliveryOrderDetailsItemSchema,
    deliveryOrderItemSchema,
    modelDeliveryOrderItemSchema,
    stockLotDeliveryLineItemSchema,
} from "./items";

// PAGINA DE ORDENES DE ENTREGA
export const deliveryOrdersPageListResponseSchema = createPageDataListSchema(
    deliveryOrderItemSchema,
);

// PAGINA DE ORDENES DE ENTREGA POR CLIENTE
export const deliveryOrdersByClientPageListResponseSchema =
    createPageDataListSchema(deliveryOrderClientItemSchema);

// ORDEN DE ENTREGA
export const deliveryOrderDetailResponseSchema = createDataSchema(
    deliveryOrderDetailsItemSchema,
);

// ORDEN DE ENTREGA DE UN CLIENTE
export const deliveryOrderByClientDetailResponseSchema = createDataSchema(
    deliveryOrderClientDetailsItemSchema,
);

// LISTA DE MODELOS RELACIONADOS HACIA UNA ORDEN DE ENTREGA
export const modelsToDeliveryOrderListResponseSchema = createDataListSchema(
    modelDeliveryOrderItemSchema,
);

// PAGINA DE LINEAS DE ENTREGA
export const deliveryLinesPageListResponseSchema = createPageDataListSchema(
    deliveryLineItemSchema,
);

// UNA LINEA DE ENTREGA
export const deliveryLineDetailResponseSchema = createDataSchema(
    deliveryLineDetailsItemSchema,
);

// LISTA DE LOTES DE STOCKS RELACIONADOS HACIA UNA LINEA DE ENTREGA
export const stockLotsToDeliveryLineListResponseSchema = createDataListSchema(
    stockLotDeliveryLineItemSchema,
);
