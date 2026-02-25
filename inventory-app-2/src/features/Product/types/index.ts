import { z } from "zod"

export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const modelSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
    entryDate: z.date(),
    caducityDate: z.date(),
})

export const productSchema = z.object({
    name: z.string(),
    length: z.number(),
    width: z.number(),
    height: z.number(),

    // Modelo
    modelName: z.string(),
    modelImageUrl: z.string(),
    modelEntryDate: z.date(),
    modelCaducityDate: z.date(),
    categoryId: z.number(),
    typeId: z.number(),
})

export const typeSchema = z.object({
    name: z.string(),
})

type Category = z.infer<typeof categorySchema>
type Model = z.infer<typeof modelSchema>
type Product = z.infer<typeof productSchema>
type Type = z.infer<typeof typeSchema>

export type CategoryItem = Category;
export type CategoryForm = Pick<Category, "name">;
export type ModelForm = Model;
export type ProductCreateForm = Product;
export type ProductUpdateForm = Pick<Product, "name" | "length" | "width" | "height" | "categoryId" | "typeId">;
export type TypeForm = Type;