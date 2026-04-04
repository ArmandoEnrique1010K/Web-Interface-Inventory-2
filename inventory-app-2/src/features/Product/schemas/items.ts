import { z } from "zod";
import {
    categorySchema,
    modelSchema,
    productSchema,
    typeSchema,
} from "./entities";

export const categoryItemSchema = categorySchema.pick({
    id: true,
    name: true,
    status: true,
});

export const typeItemSchema = typeSchema.pick({
    id: true,
    name: true,
    status: true,
});

export const modelListItemSchema = modelSchema.pick({
    id: true,
    name: true,
    imageUrl: true,
    entryDate: true,
    caducityDate: true,
    totalQuantityAvailable: true,
    totalQuantityReceived: true,
    totalQuantityDelivered: true,
    status: true,
    productId: true,
    productName: true,
    typeName: true,
    categoryName: true,
});

export const modelDetailsItemSchema = modelSchema.pick({
    id: true,
    name: true,
    imageUrl: true,
    entryDate: true,
    caducityDate: true,
    totalQuantityAvailable: true,
    totalQuantityReceived: true,
    totalQuantityDelivered: true,
    status: true,
    productId: true,
    productName: true,
    productLength: true,
    productWidth: true,
    productHeight: true,
    productStatus: true,
    categoryId: true,
    categoryName: true,
    typeId: true,
    typeName: true,
});

export const modelListSearchItemSchema = modelSchema.pick({
    id: true,
    name: true,
    imageUrl: true,
    productName: true,
    typeName: true,
    categoryId: true,
    categoryName: true,
});

export const modelListSearchFirstTenItemSchema = modelSchema.pick({
    id: true,
    modelProductName: true,
});

export const productItemSchema = productSchema.pick({
    id: true,
    name: true,
    length: true,
    width: true,
    height: true,
    quantityModels: true,
    status: true,
    categoryId: true,
    categoryName: true,
    typeId: true,
    typeName: true,
});

export type ProductItem = z.infer<typeof productItemSchema>;
export type ModelItem = z.infer<typeof modelDetailsItemSchema>;
export type ModelSearchItem = z.infer<typeof modelListSearchItemSchema>;
