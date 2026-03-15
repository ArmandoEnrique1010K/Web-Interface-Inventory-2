import { api } from "@/lib/axiosConfig";
import type { DataPageResponse, DataResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

export type LocationQueryParams = {
    page?: number;
    minQuantity?: string;
    maxQuantity?: string;
    minCreatedAt?: string;
    maxCreatedAt?: string;
    movementType?: string;
    deliveryLineId?: string;
    username?: string; // Nombre de usuario
    keyword?: string; // Nombre de producto o modelo
    modelId?: string;
    userId?: string; // Id de usuario
    stockLotReceiverId?: string // Lote de stock receptor
}

export async function listAllMovements(params: LocationQueryParams) {
    try {
        const url = `/movements`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getMovement(id: string) {
    try {
        const url = `/movements/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}
