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
export const categoriesListResponseSchema =
    createDataListSchema(categoryItemSchema);
export const categoryDetailResponseSchema =
    createDataSchema(categoryItemSchema);

// TIPO
export const typesListResponseSchema = createDataListSchema(typeItemSchema);
export const typeDetailResponseSchema = createDataSchema(typeItemSchema);

// MODELO

// LISTA SIMPLE
export const modelsListResponseSchema =
    createDataListSchema(modelListItemSchema);

// PAGINADO
export const modelsPageResponseSchema =
    createPageDataListSchema(modelListItemSchema);

// SEARCH (aunque sea paginado en backend, aquí es otra forma de dato)
export const modelsSearchPageListResponseSchema = createPageDataListSchema(
    modelListSearchItemSchema,
);

// TOP 10
export const modelsTopTenResponseSchema = createDataListSchema(
    modelListSearchFirstTenItemSchema,
);

// DETALLE
export const modelDetailResponseSchema = createDataSchema(
    modelDetailsItemSchema,
);

// PRODUCTO
export const productsPageResponseSchema =
    createPageDataListSchema(productItemSchema);
export const productDetailResponseSchema = createDataSchema(productItemSchema);
