import {
    searchLocationItemSchema,
    subregionItemSchema,
    subregionListItemSchema,
} from "./items";
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
export const subregionsListNamesResponseSchema = createDataListSchema(
    subregionListItemSchema,
);
// LOCATION
export const locationsListResponseSchema =
    createPageDataListSchema(locationItemSchema);
export const locationsTopTenResponseSchema = createDataListSchema(
    searchLocationItemSchema,
);
export const locationDetailResponseSchema =
    createDataSchema(locationItemSchema);
