import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type { ProductCreateForm, ProductUpdateForm } from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    productDetailResponseSchema,
    productsPageResponseSchema,
} from "../schemas/responses";

type ProductCreatePayload = {
    data: ProductCreateForm;
    file?: File;
};

// El formato de datos que se enviaran cambia cuando se quiere subir una imagen
export async function registerProduct({ data, file }: ProductCreatePayload) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.length) {
        formData.append("length", data.length.toString());
    }
    if (data.width) {
        formData.append("width", data.width.toString());
    }
    if (data.height) {
        formData.append("height", data.height.toString());
    }
    formData.append("modelName", data.modelName);
    formData.append("modelEntryDate", data.modelEntryDate);
    formData.append("modelCaducityDate", data.modelCaducityDate);
    formData.append("categoryId", data.categoryId.toString());
    formData.append("typeId", data.typeId.toString());
    formData.append(
        "modelMinimumAvailableQuantity",
        String(data.modelMinimumAvailableQuantity ?? ""),
    );

    if (file) {
        formData.append("file", file);
    }

    try {
        const url = `/products`;
        const { data } = await api.post(url, formData);

        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export type ProductQueryParams = {
    page?: number;
    name?: string;
    status?: boolean;
    categoryId?: string;
    typeId?: string;
    direction?: "desc" | "asc";
    sortBy?: "id" | "name" | "categoryName" | "typeName";
};

export async function listAllProducts(params: ProductQueryParams) {
    try {
        const url = `/products`;
        const { data } = await api.get(url, {
            params,
        });
        const parsed = productsPageResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getProduct(id: number) {
    try {
        const url = `/products/${id}`;
        const { data } = await api.get(url);
        const parsed = productDetailResponseSchema.parse(data);
        console.log(parsed);
        return parsed.data;
    } catch (error) {
        console.log(error);
        throwApiErrorMessage(error);
    }
}

type UpdateProductPayload = {
    productId: number;
    formData: ProductUpdateForm;
};

export async function updateProduct({
    productId,
    formData,
}: UpdateProductPayload) {
    try {
        const url = `/products/${productId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function changeStatusProduct(productId: number) {
    try {
        const url = `/products/${productId}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
