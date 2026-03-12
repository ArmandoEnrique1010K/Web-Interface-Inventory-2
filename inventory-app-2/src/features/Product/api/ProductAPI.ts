import { api } from "@/lib/axiosConfig";
import type { ProductCreateForm, ProductUpdateForm } from "../types";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

type ProductCreatePayload = {
    data: ProductCreateForm,
    file?: File
}

export async function registerProduct({ data, file }: ProductCreatePayload) {

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("length", data.length)
    formData.append("width", data.width)
    formData.append("height", data.height)
    formData.append("modelName", data.modelName)
    formData.append("modelEntryDate", data.modelEntryDate)
    formData.append("modelCaducityDate", data.modelCaducityDate)
    formData.append("categoryId", data.categoryId)
    formData.append("typeId", data.typeId)

    if (file) {
        formData.append("file", file)
    }

    try {
        const url = `/products`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export type ProductQueryParams = {
    page?: number;
    name?: string;
    status?: boolean;
    categoryId?: string;
    typeId?: string;
}

export async function listAllProducts(params: ProductQueryParams) {
    try {
        const url = `/products`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getProduct(id: string) {
    try {
        const url = `/products/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateProductPayload = {
    productId: string;
    formData: ProductUpdateForm;
}

export async function updateProduct({ productId, formData }: UpdateProductPayload) {
    try {
        const url = `/products/${productId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusProduct(productId: string) {
    try {
        const url = `/products/${productId}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}