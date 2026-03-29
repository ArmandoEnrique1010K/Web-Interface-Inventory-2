import { api } from "@/lib/axiosConfig";
import type { DeliveryLineForm, LineStatusEnum } from "../types";
import type { DataPageResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";


export type RegisterDeliveryOrderPayload = {
    deliveryOrderId: string,
    formData: DeliveryLineForm
}

export async function registerDeliveryOrder({ deliveryOrderId, formData }: RegisterDeliveryOrderPayload) {
    try {
        const url = `/delivery-lines/delivery-order/${deliveryOrderId}`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}


export type DeliveryLinesByDeliveryOrderParams = {
    page?: number;
    minRequiredQuantity?: string;
    maxRequiredQuantity?: string;
    minLimitDate?: string;
    maxLimitDate?: string;
    lineStatus?: LineStatusEnum;
    location?: string;
    subregionId?: string;
    regionId?: string;
    modelId?: string;
}

export async function listAllDeliveryLinesByDeliveryOrder(deliveryOrderId: string, params: DeliveryLinesByDeliveryOrderParams) {
    try {
        const url = `/delivery-lines/delivery-order/${deliveryOrderId}`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}


// TODO: CREAR UN ENDPOINT PARA CAMBIAR LA FECHA DE ENTREGA DE VARIAS LINEAS DE ENTREGA A LA VEZ
