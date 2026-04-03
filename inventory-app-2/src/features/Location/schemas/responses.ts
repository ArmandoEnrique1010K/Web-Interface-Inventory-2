import { subregionItemSchema } from "./items";
import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import { locationItemSchema, regionItemSchema } from "./items";

// REGION
export const regionsListResponseSchema = createDataListSchema(regionItemSchema);
export const regionDetailResponseSchema = createDataSchema(regionItemSchema);

// SUBREGION
export const subregionsListResponseSchema =
    createDataListSchema(subregionItemSchema);
export const subregionDetailResponseSchema =
    createDataSchema(subregionItemSchema);

// LOCATION
export const locationsListResponseSchema =
    createPageDataListSchema(locationItemSchema);
export const locationsTopTenResponseSchema =
    createDataListSchema(locationItemSchema);
export const locationDetailResponseSchema =
    createDataSchema(locationItemSchema);
