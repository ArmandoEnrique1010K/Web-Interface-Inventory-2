import { api } from "@/lib/axiosConfig";
import type { ProductCreateForm } from "../types";
import type { GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

export async function registerProduct(formData: ProductCreateForm) {
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
