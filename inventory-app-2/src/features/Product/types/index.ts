import { z } from "zod"

export const categorySchema = z.object({
    id: z.number(),
    name: z.string(),
})


export const modelSchema = z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    // en Zod, nullable permite que un campo tenga el valor null, mientras que optional hace que el campo sea completamente opcional, es decir que podria no existir
    entryDate: z.string().nullable(),
    caducityDate: z.string().nullable(),
    totalQuantityAvailable: z.string(),
    totalQuantityReceived: z.string(),
    totalQuantityDelivered: z.string(),
    status: z.boolean(),

    productId: z.string(),
    productName: z.string(),
    productLength: z.string(),
    productWidth: z.string(),
    productHeight: z.string(),
    productStatus: z.boolean(),

    categoryId: z.string(),
    categoryName: z.string(),

    typeId: z.string(),
    typeName: z.string(),

    // Concatenación
    modelProductName: z.string(),
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

export type CategoryForm = Pick<Category, "name">;
export type ModelInProductForm = Pick<Model, 'name' | 'entryDate' | 'caducityDate'>;
export type ProductCreateForm = Pick<Product, 'name' | 'length' | 'width' | 'height' | 'modelName' |
    'modelEntryDate' | 'modelCaducityDate' | 'categoryId' | 'typeId'>;
export type ProductUpdateForm = Pick<Product, "name" | "length" | "width" | "height" | "categoryId" | "typeId">;
export type TypeForm = Pick<Type, "name">;

export type CategoryItem = Category;
export type ModelItem = Pick<Model, "id" | "name" | "imageUrl" | "entryDate" | "caducityDate" | "totalQuantityAvailable" |
    "totalQuantityReceived" | "totalQuantityDelivered" | "status" | "productId" | "productName" | "typeName" | "categoryName">
export type ModelDetailsItem = Pick<Model,
    "id" | "name" | "imageUrl" | "entryDate" | "caducityDate" | "totalQuantityAvailable" | "totalQuantityReceived" |
    "totalQuantityDelivered" | "status" | "productId" | "productName" | "productLength" | "productWidth" | "productHeight" |
    "productStatus" | "categoryId" | "categoryName" | "typeId" | "typeName">;

export type ModelSearchItem = Pick<Model, "id" | "name" | "imageUrl" | "productName" | "typeName" | "categoryId" | "categoryName">

export type ModelSearchFirstTenItems = Pick<Model, "id" | "modelProductName">

export type ProductItem = Pick<Product, "id" | "name" | "length" | "width" | "height" | "quantityModels" | "status" |
    "categoryId" | "categoryName" | "typeId" | "typeName">;
export type TypeItem = Type


