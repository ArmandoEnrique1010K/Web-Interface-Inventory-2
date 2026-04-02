import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import { responseSchema } from "@/types";
import type { CategoryForm } from "../schemas/requests";
import {
    categoryDetailsSchema,
    categoryListSchema,
} from "../schemas/responses";

// Solamente retorna un mensaje de acierto o de error
export async function registerCategory(formData: CategoryForm) {
    try {
        const url = `/categories`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllCategories() {
    try {
        const url = `/categories`;
        const { data } = await api.get(url);
        const parsed = categoryListSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllActiveCategories() {
    try {
        const url = `/categories/active`;
        const { data } = await api.get(url);
        const parsed = categoryListSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getCategory(id: number) {
    try {
        const url = `/categories/${id}`;
        const { data } = await api.get(url);
        const parsed = categoryDetailsSchema.parse(data);
        return parsed.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateCategoryPayload = {
    categoryId: number;
    formData: CategoryForm;
};

export async function updateCategory({
    categoryId,
    formData,
}: UpdateCategoryPayload) {
    try {
        const url = `/categories/${categoryId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}

export async function changeStatusCategory(categoryId: number) {
    try {
        const url = `/categories/${categoryId}/status`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        handleApiError(error);
    }
}
