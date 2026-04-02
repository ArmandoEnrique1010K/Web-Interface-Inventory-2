import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import {
    categoryItemSchema,
    modelDetailsItemSchema,
    modelListItemSchema,
    modelListSearchFirstTenItemSchema,
    modelListSearchItemSchema,
    productItemSchema,
    typeItemSchema,
} from "./items";

// SINTAXIS: [entidad] + [forma] + ResponseSchema

// CATEGORIA
export const categoryListSchema = createDataListSchema(categoryItemSchema);
export const categoryDetailsSchema = createDataSchema(categoryItemSchema);

// TIPO
export const typeListSchema = createDataListSchema(typeItemSchema);
export const typeDetailsSchema = createDataSchema(typeItemSchema);

// MODELO

// LISTA SIMPLE
export const modelListResponseSchema =
    createDataListSchema(modelListItemSchema);

// PAGINADO
export const modelPageResponseSchema =
    createPageDataListSchema(modelListItemSchema);

// SEARCH (aunque sea paginado en backend, aquí es otra forma de dato)
export const modelSearchPageListResponseSchema = createDataListSchema(
    modelListSearchItemSchema,
);

// TOP 10
export const modelTopTenResponseSchema = createDataListSchema(
    modelListSearchFirstTenItemSchema,
);

// DETALLE
export const modelDetailsResponseSchema = createDataSchema(
    modelDetailsItemSchema,
);

// PRODUCTO
export const productPageResponseSchema =
    createPageDataListSchema(productItemSchema);
export const productDetailsResponseSchema = createDataSchema(productItemSchema);
