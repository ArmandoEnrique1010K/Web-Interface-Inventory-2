import {
    createDataListSchema,
    createDataSchema,
    createPageDataListSchema,
} from "@/types";
import {
    companyItemSchema,
    stockLotDetailItemSchema,
    stockLotItemSchema,
    stockLotSameProductItemSchema,
} from "./items";

// POR CADA PETICION DE TIPO GET EN UN MODULO SE DEFINE UN SCHEMA

// LISTA DE EMPRESAS
export const companiesListResponseSchema =
    createDataListSchema(companyItemSchema);

// UNA EMPRESA
export const companyDetailResponseSchema = createDataSchema(companyItemSchema);

// PAGINA DE LOTES DE STOCK
export const stockLotPageListResponseSchema =
    createPageDataListSchema(stockLotItemSchema);

// LISTA DE LOTES DE STOCK Y EXCLUIR UNO
// LISTA DE STOCK POR MODELO ACTIVO
export const stockLotListResponseSchema = createDataListSchema(
    stockLotSameProductItemSchema,
);

// UN LOTE DE STOCK
export const stockLotDetailResponseSchema = createDataSchema(
    stockLotDetailItemSchema,
);
