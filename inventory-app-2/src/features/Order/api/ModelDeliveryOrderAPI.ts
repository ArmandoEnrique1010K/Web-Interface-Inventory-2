import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

export async function registerRelationModelToDeliveryOrder(modelId: string, deliveryOrderId: string) {
    try {
        const url = `/models-delivery-orders/model/${modelId}/deliveryOrder/${deliveryOrderId}`
        const { data } = await api.post<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllModelsByDeliveryOrder(deliveryOrderId: string) {
    try {
        const url = `/models-delivery-orders/models/deliveryOrder/${deliveryOrderId}`
        const { data } = await api.get<DataResponse>(url)
        return data.data
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function inactiveRelationModelToDeliveryOrder(deliveryOrderId: string) {
    try {
        const url = `/models-delivery-orders/${deliveryOrderId}`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}
