import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type {
    DeliveryLineAllocateForm,
    DeliveryLineAlterForm,
    DeliveryLineForm,
    DeliveryLineUpdateForm,
} from "../schemas/requests";
import { responseSchema } from "@/types";
import type { DeliveryLineItem } from "../schemas/items";
import {
    deliveryLineDetailResponseSchema,
    deliveryLinesPageListResponseSchema,
} from "../schemas/responses";

export type RegisterDeliveryLinePayload = {
    deliveryOrderId: number;
    formData: DeliveryLineForm;
};

export async function registerDeliveryLine({
    deliveryOrderId,
    formData,
}: RegisterDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/delivery-order/${deliveryOrderId}`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export type DeliveryLinesByDeliveryOrderParams = {
    page?: number;
    minRequiredQuantity?: string;
    maxRequiredQuantity?: string;
    minLimitDate?: string;
    maxLimitDate?: string;
    lineStatus?: DeliveryLineItem["lineStatus"];
    location?: string;
    subregionId?: string;
    regionId?: string;
    modelId?: string;
};

export async function listAllDeliveryLinesByDeliveryOrder(
    deliveryOrderId: number,
    params: DeliveryLinesByDeliveryOrderParams,
) {
    try {
        const url = `/delivery-lines/delivery-order/${deliveryOrderId}`;
        const { data } = await api.get(url, {
            params,
        });
        const parsed = deliveryLinesPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDeliveryLine(id: number) {
    try {
        const url = `/delivery-lines/${id}`;
        const { data } = await api.get(url);
        const parsed = deliveryLineDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export type UpdateDeliveryLinePayload = {
    deliveryLineId: number;
    formData: DeliveryLineUpdateForm;
};

export async function updateDeliveryLine({
    deliveryLineId,
    formData,
}: UpdateDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function cancelDeliveryLine(id: number) {
    try {
        const url = `/delivery-lines/${id}/cancel`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function sendDeliveryLine(id: number) {
    try {
        const url = `/delivery-lines/${id}/deliver`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function missingDeliveryLine(id: number) {
    try {
        const url = `/delivery-lines/${id}/missing`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export type LostDeliveryLinePayload = {
    deliveryLineId: number;
    formData: DeliveryLineAlterForm;
};

export async function lostDeliveryLine({
    deliveryLineId,
    formData,
}: LostDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/lost`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export type ReturnDeliveryLinePayload = {
    deliveryLineId: number;
    formData: DeliveryLineAlterForm;
};

export async function returnDeliveryLine({
    deliveryLineId,
    formData,
}: ReturnDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/return`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export type AllocateStockInDeliveryLinePayload = {
    deliveryLineId: number;
    formData: DeliveryLineAllocateForm;
};

export async function allocateStockInDeliveryLine({
    deliveryLineId,
    formData,
}: AllocateStockInDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/allocate-stock`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

// TODO: CREAR UN ENDPOINT PARA CAMBIAR LA FECHA DE ENTREGA DE VARIAS LINEAS DE ENTREGA A LA VEZ
