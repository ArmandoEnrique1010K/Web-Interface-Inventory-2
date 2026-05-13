import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import {
    movement_StockLotItemSchema,
    movementItemDetailSchema,
    movementItemSchema,
} from "./items";

export const movementsPageListResponseSchema =
    createPageDataListSchema(movementItemSchema);

export const movementDetailResponseSchema = createDataSchema(
    movementItemDetailSchema,
);

export const movementStockLotListResponseSchema = createDataListSchema(
    movement_StockLotItemSchema,
);
