import { api } from "@/lib/axiosConfig";
import type { DeliveryOrderCommentForm, DeliveryOrderForm } from "../types";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";

export async function registerDeliveryOrder({ formData }: { formData: DeliveryOrderForm }) {
    try {
        const url = `/delivery-orders`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export type DeliveryOrderQueryParams = {
    page?: number;
    batch?: string;
    startDate?: string;
    endDate?: string;
    userClientName?: string;
    status?: 'ORDER_READY' | 'ORDER_PENDING' | 'ORDER_DELIVERED' | 'ORDER_CANCELED' | '';
}

export async function listAllDeliveryOrders(params: DeliveryOrderQueryParams) {
    try {
        const url = `/delivery-orders`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllPendingDeliveryOrders(params: Omit<DeliveryOrderQueryParams, "status">) {
    try {
        const url = `/delivery-orders/in-progress`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function listAllDeliveryOrdersByClient(params: Omit<DeliveryOrderQueryParams, "userClientName">) {
    try {
        const url = `/delivery-orders/client`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getDeliveryOrder(id: string) {
    try {
        const url = `/delivery-orders/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getDeliveryOrderForClient(id: string) {
    try {
        const url = `/delivery-orders/${id}/client`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

// TODO: VERIFICAR ESTE ENDPOINT
export async function changeLimitDateDeliveryOrder(id: string, params: { limitDate: string }) {
    try {
        const url = `/delivery-orders/${id}`
        const { data } = await api.patch<GeneralResponse>(url, { params })
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateLocationPayload = {
    deliveryOrderId: string;
    formData: DeliveryOrderCommentForm;
}

export async function cancelDeliveryOrder({ deliveryOrderId, formData }: UpdateLocationPayload) {
    try {
        const url = `/delivery-orders/${deliveryOrderId}/cancel`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function sendDeliveryOrder(id: string) {
    try {
        const url = `/delivery-orders/${id}/send`
        const { data } = await api.patch<GeneralResponse>(url)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}