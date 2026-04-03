import { z } from "zod";

import {
    categorySchema,
    modelSchema,
    productSchema,
    typeSchema,
} from "./entities";

export const categoryForm = categorySchema.pick({
    name: true,
});

export const typeForm = typeSchema.pick({
    name: true,
});

export const modelForm = modelSchema.pick({
    name: true,
    entryDate: true,
    caducityDate: true,
});

export const productCreateForm = productSchema.pick({
    name: true,
    length: true,
    width: true,
    height: true,
    modelName: true,
    modelEntryDate: true,
    modelCaducityDate: true,
    categoryId: true,
    typeId: true,
});

export const productUpdateForm = productSchema.pick({
    name: true,
    length: true,
    width: true,
    height: true,
    categoryId: true,
    typeId: true,
});

export type CategoryForm = z.infer<typeof categoryForm>;
export type TypeForm = z.infer<typeof typeForm>;
export type ModelForm = z.infer<typeof modelForm>;
export type ProductCreateForm = z.infer<typeof productCreateForm>;
export type ProductUpdateForm = z.infer<typeof productUpdateForm>;
