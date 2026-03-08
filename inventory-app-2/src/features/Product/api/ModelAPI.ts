import { api } from "@/lib/axiosConfig";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";
import type { ModelInProductForm } from "../types";

export async function registerModelInProduct(productId: string, formData: ModelInProductForm) {
    try {
        const url = `/models/product/${productId}`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllModelsByProductId(productId: string) {
    try {
        const url = `/models/product/${productId}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}


export type ModelQueryParams = {
    page?: number;
    keyword?: string;
    minStock?: number;
    maxStock?: number;
    minEntryDate?: string;
    maxEntryDate?: string;
    status?: boolean;
    categoryId?: string;
    typeId?: string;
}

export async function listAllModels(params: ModelQueryParams) {
    try {
        const url = `/models`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getModel(id: string) {
    try {
        const url = `/models/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateModelPayload = {
    modelId: string;
    formData: ModelInProductForm;
}

export async function updateModel({ modelId, formData }: UpdateModelPayload) {
    try {
        const url = `/models/${modelId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusModel(id: string) {
    try {
        const url = `/models/${id}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}