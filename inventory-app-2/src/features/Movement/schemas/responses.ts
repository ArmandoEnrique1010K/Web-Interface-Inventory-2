import { createDataSchema, createPageDataListSchema } from "@/types";
import { movementItemDetailSchema, movementItemSchema } from "./items";

export const movementsPageListResponseSchema =
    createPageDataListSchema(movementItemSchema);

export const movementDetailResponseSchema = createDataSchema(
    movementItemDetailSchema,
);
