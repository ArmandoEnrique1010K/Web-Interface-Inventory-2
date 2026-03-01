import { api } from "@/lib/axiosConfig";
import type { DataResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";


export async function listAllModelsByProductId(productId: string) {
    try {
        const url = `/models/product/${productId}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}
