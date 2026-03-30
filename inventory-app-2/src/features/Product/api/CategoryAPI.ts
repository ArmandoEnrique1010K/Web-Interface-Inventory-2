import { api } from "@/lib/axiosConfig"
import type { CategoryForm, CategoryItem } from "../types"
import type { DataResponse, GeneralResponse } from "types"
import { handleApiError } from "@/utils/handleApiError"

// Solamente retorna un mensaje de acierto o de error
export async function registerCategory(formData: CategoryForm): Promise<string | void> {
    try {
        const url = `/categories`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllCategories(): Promise<CategoryItem[]> {
    try {
        const url = `/categories`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllActiveCategories(): Promise<CategoryItem[]> {
    try {
        const url = `/categories/active`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getCategory(id: string): Promise<CategoryItem> {
    try {
        const url = `/categories/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCategoryPayload = {
    categoryId: string;
    formData: CategoryForm;
}

export async function updateCategory({ categoryId, formData }: UpdateCategoryPayload): Promise<string | void> {
    try {
        const url = `/categories/${categoryId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusCategory(categoryId: string) {
    try {
        const url = `/categories/${categoryId}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}