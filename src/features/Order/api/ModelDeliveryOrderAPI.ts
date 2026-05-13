import { api } from "@/lib/axiosConfig";
import { responseSchema } from "@/types";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import { modelsToDeliveryOrderListResponseSchema } from "../schemas/responses";

export async function registerRelationModelToDeliveryOrder(
    modelId: number,
    deliveryOrderId: number,
) {
    try {
        const url = `/models-delivery-orders/model/${modelId}/deliveryOrder/${deliveryOrderId}`;
        const { data } = await api.post(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function listAllModelsByDeliveryOrder(deliveryOrderId: number) {
    try {
        const url = `/models-delivery-orders/models/deliveryOrder/${deliveryOrderId}`;
        const { data } = await api.get(url);
        const parsed = modelsToDeliveryOrderListResponseSchema.parse(data);
        return parsed.data;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export async function inactiveRelationModelToDeliveryOrder(
    modelDeliveryOrderId: number,
) {
    try {
        const url = `/models-delivery-orders/${modelDeliveryOrderId}`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}
