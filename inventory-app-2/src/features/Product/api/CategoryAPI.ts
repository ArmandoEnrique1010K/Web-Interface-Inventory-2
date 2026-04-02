import { api } from "@/lib/axiosConfig"
import { categoryListResponseSchema, categoryResponseSchema, type CategoryForm } from "../types"
import type { GeneralResponse } from "types"
import { handleApiError } from "@/utils/handleApiError"

// Solamente retorna un mensaje de acierto o de error
export async function registerCategory(formData: CategoryForm) {
    try {
        const url = `/categories`
        const { data } = await api.post(url, formData)
        const parsed = categoryResponseSchema.parse(data);
        return parsed.message
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllCategories() {
    try {
        const url = `/categories`
        const { data } = await api.get(url)
        const parsed = categoryListResponseSchema.parse(data)
        return parsed.data
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllActiveCategories() {
    try {
        const url = `/categories/active`
        const { data } = await api.get(url)
        const parsed = categoryListResponseSchema.parse(data)
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getCategory(id: number) {
    try {
        const url = `/categories/${id}`
        const { data } = await api.get(url)
        const parsed = categoryResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCategoryPayload = {
    categoryId: number;
    formData: CategoryForm;
}

export async function updateCategory({ categoryId, formData }: UpdateCategoryPayload) {
    try {
        const url = `/categories/${categoryId}`
        const { data } = await api.put(url, formData)
        const parsed = categoryResponseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusCategory(categoryId: string) {
    try {
        const url = `/categories/${categoryId}/status`
        const { data } = await api.patch<GeneralResponse>(url)
        const parsed = categoryResponseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}