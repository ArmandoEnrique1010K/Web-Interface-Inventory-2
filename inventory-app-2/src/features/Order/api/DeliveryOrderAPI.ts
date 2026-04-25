import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type {
    DeliveryOrderCommentForm,
    DeliveryOrderForm,
} from "../schemas/requests";
import { responseSchema } from "@/types";
import type { DeliveryOrderItem } from "../schemas/items";
import {
    deliveryOrderByClientDetailResponseSchema,
    deliveryOrderDetailResponseSchema,
    deliveryOrdersByClientPageListResponseSchema,
    deliveryOrdersPageListResponseSchema,
} from "../schemas/responses";

export async function registerDeliveryOrder(formData: DeliveryOrderForm) {
    try {
        const url = `/delivery-orders`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export type DeliveryOrderQueryParams = {
    page?: number;
    batch?: string;
    startDate?: string;
    endDate?: string;
    userClientName?: string;
    status?: DeliveryOrderItem["orderStatus"];
};

export async function listAllDeliveryOrders(params: DeliveryOrderQueryParams) {
    try {
        const url = `/delivery-orders`;
        const { data } = await api.get(url, {
            params,
        });
        const parsed = deliveryOrdersPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllPendingDeliveryOrders(
    params: Omit<DeliveryOrderQueryParams, "status">,
) {
    try {
        const url = `/delivery-orders/in-progress`;
        const { data } = await api.get(url, {
            params: params,
        });
        const parsed = deliveryOrdersPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllDeliveryOrdersByClient(
    params: Omit<DeliveryOrderQueryParams, "userClientName">,
) {
    try {
        const url = `/delivery-orders/client`;
        const { data } = await api.get(url, {
            params: params,
        });
        const parsed = deliveryOrdersByClientPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDeliveryOrder(id: number) {
    try {
        const url = `/delivery-orders/${id}`;
        const { data } = await api.get(url);
        const parsed = deliveryOrderDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        console.log(error);
        throwApiErrorMessage(error);
    }
}

export async function getDeliveryOrderForClient(id: number) {
    try {
        const url = `/delivery-orders/${id}/client`;
        const { data } = await api.get(url);
        const parsed = deliveryOrderByClientDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        console.log(error);
        throwApiErrorMessage(error);
    }
}

// Se pasa la fecha limite como un queryParam a la API REST
export async function changeLimitDateDeliveryOrder(
    id: number,
    params: { limitDate: string | null },
) {
    try {
        const url = `/delivery-orders/${id}`;
        const { data } = await api.patch(
            url,
            null, // No hay body
            { params },
        );
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type UpdateLocationPayload = {
    deliveryOrderId: number;
    formData: DeliveryOrderCommentForm;
};

export async function cancelDeliveryOrder({
    deliveryOrderId,
    formData,
}: UpdateLocationPayload) {
    try {
        const url = `/delivery-orders/${deliveryOrderId}/cancel`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function sendDeliveryOrder(id: number) {
    try {
        const url = `/delivery-orders/${id}/send`;
        const { data } = await api.patch(url);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
