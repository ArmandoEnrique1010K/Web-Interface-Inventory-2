import { api } from "@/lib/axiosConfig";
import type { DataResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

export async function listAllRoles() {
    try {
        const url = `/roles`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

