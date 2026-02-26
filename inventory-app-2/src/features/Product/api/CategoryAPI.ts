
import { api } from "@/lib/axiosConfig"
import type { CategoryForm } from "../types"
import type { DataResponse, GeneralResponse } from "types"
import { handleApiError } from "@/utils/handleApiError"

export async function registerCategory(formData: CategoryForm) {
    try {
        const url = `/categories`
        const { data } = await api.post<GeneralResponse>(url, formData, {
            withCredentials: true,
        })
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllCategories() {
    try {
        const url = `/categories`
        const { data } = await api.get<DataResponse>(url,
            {
                withCredentials: true,
            }
        )
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getCategory(id: string) {
    try {
        const url = `/categories/${id}`
        const { data } = await api.get<DataResponse>(url,
            {
                withCredentials: true,
            }
        )
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCategoryPayload = {
    categoryId: string;
    formData: CategoryForm;
}

export async function updateCategory({ categoryId, formData }: UpdateCategoryPayload) {
    try {
        const url = `/categories/${categoryId}`
        const { data } = await api.put<GeneralResponse>(url, formData,
            {
                withCredentials: true,
            }
        )
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}