import { api } from "@/lib/axiosConfig";
import type { DeliveryLineAllocateForm, DeliveryLineAlterForm, DeliveryLineForm, DeliveryLineUpdateForm, LineStatusEnum } from "../types";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";


export type RegisterDeliveryLinePayload = {
    deliveryOrderId: string,
    formData: DeliveryLineForm
}

export async function registerDeliveryLine({ deliveryOrderId, formData }: RegisterDeliveryLinePayload) {
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


export async function getDeliveryLine(id: string) {
    try {
        const url = `/delivery-lines/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}


export type UpdateDeliveryLinePayload = {
    deliveryLineId: string,
    formData: DeliveryLineUpdateForm
}

export async function updateDeliveryLine({ deliveryLineId, formData }: UpdateDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}


export async function cancelDeliveryLine(id: string) {
    try {
        const url = `/delivery-lines/${id}/cancel`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function sendDeliveryLine(id: string) {
    try {
        const url = `/delivery-lines/${id}/deliver`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function missingDeliveryLine(id: string) {
    try {
        const url = `/delivery-lines/${id}/missing`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}


export type LostDeliveryLinePayload = {
    deliveryLineId: string,
    formData: DeliveryLineAlterForm
}

export async function lostDeliveryLine({ deliveryLineId, formData }: LostDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/lost`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export type ReturnDeliveryLinePayload = {
    deliveryLineId: string,
    formData: DeliveryLineAlterForm
}

export async function returnDeliveryLine({ deliveryLineId, formData }: ReturnDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/return`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export type AllocateStockInDeliveryLinePayload = {
    deliveryLineId: string,
    formData: DeliveryLineAllocateForm
}

export async function allocateStockInDeliveryLine({ deliveryLineId, formData }: AllocateStockInDeliveryLinePayload) {
    try {
        const url = `/delivery-lines/${deliveryLineId}/allocate-stock`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}


// TODO: CREAR UN ENDPOINT PARA CAMBIAR LA FECHA DE ENTREGA DE VARIAS LINEAS DE ENTREGA A LA VEZ
