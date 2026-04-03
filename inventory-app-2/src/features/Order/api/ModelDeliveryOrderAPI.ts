import { api } from "@/lib/axiosConfig";
import type { DataResponse, GeneralResponse } from "@/types/index";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";

export async function registerRelationModelToDeliveryOrder(
    modelId: string,
    deliveryOrderId: string,
) {
    try {
        const url = `/models-delivery-orders/model/${modelId}/deliveryOrder/${deliveryOrderId}`;
        const { data } = await api.post<GeneralResponse>(url);
        if (data.type === "success") {
            return data.message;
        }
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function listAllModelsByDeliveryOrder(deliveryOrderId: string) {
    try {
        const url = `/models-delivery-orders/models/deliveryOrder/${deliveryOrderId}`;
        const { data } = await api.get<DataResponse>(url);
        return data.data;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function inactiveRelationModelToDeliveryOrder(
    modelDeliveryOrderId: string,
) {
    try {
        const url = `/models-delivery-orders/${modelDeliveryOrderId}`;
        const { data } = await api.patch<GeneralResponse>(url);
        if (data.type === "success") {
            return data.message;
        }
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}
