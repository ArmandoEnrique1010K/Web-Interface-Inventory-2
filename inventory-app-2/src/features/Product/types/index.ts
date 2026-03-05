import { z } from "zod"

export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const modelSchema = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    entryDate: z.string(),
    caducityDate: z.string(),
    totalQuantityAvailable: z.number(),
    totalQuantityReceived: z.number(),
    totalQuantityDelivered: z.number(),
    status: z.boolean(),
})

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    length: z.string(),
    width: z.string(),
    height: z.string(),
    quantityModels: z.number(),
    status: z.boolean(),

    // Categoria
    categoryName: z.string(),
    categoryId: z.string(),

    // Modelo
    modelName: z.string(),
    modelImageUrl: z.string(),
    modelEntryDate: z.string(),
    modelCaducityDate: z.string(),

    // Tipo
    typeId: z.string(),
    typeName: z.string(),
})

export const typeSchema = z.object({
    id: z.number(),
    name: z.string(),
})

type Category = z.infer<typeof categorySchema>
type Model = z.infer<typeof modelSchema>
type Product = z.infer<typeof productSchema>
type Type = z.infer<typeof typeSchema>

export type CategoryItem = Category;
export type CategoryForm = Pick<Category, "name">;
export type ModelForm = Model;
export type ProductCreateForm = Pick<Product, 'name' | 'length' | 'width' | 'height' | 'modelName' | 'modelImageUrl' | 'modelEntryDate' | 'modelCaducityDate' | 'categoryId' | 'typeId'>;
export type ProductUpdateForm = Pick<Product, "name" | "length" | "width" | "height" | "categoryId" | "typeId">;
export type ProductItem = Pick<Product, "id" | "name" | "length" | "width" | "height" | "quantityModels" | "status" | "categoryId" | "categoryName" | "typeId" | "typeName">;

export type ModelItem = Pick<Model, "id" | "name" | "imageUrl" | "entryDate" | "caducityDate" | "totalQuantityAvailable" | "totalQuantityReceived" | "totalQuantityDelivered" | "status">;

export type TypeForm = Pick<Type, "name">;
export type TypeItem = Type
