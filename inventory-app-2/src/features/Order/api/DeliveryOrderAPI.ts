import { api } from "@/lib/axiosConfig";
import type {
    DeliveryOrderCommentForm,
    DeliveryOrderForm,
    OrderStatusEnum,
} from "../types";
import type {
    DataPageResponse,
    DataResponse,
    GeneralResponse,
} from "@/types/index";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";

export async function registerDeliveryOrder({
    formData,
}: {
    formData: DeliveryOrderForm;
}) {
    try {
        const url = `/delivery-orders`;
        const { data } = await api.post<GeneralResponse>(url, formData);
        if (data.type === "success") {
            return data.message;
        }
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
    status?: OrderStatusEnum;
};

export async function listAllDeliveryOrders(params: DeliveryOrderQueryParams) {
    try {
        const url = `/delivery-orders`;
        const { data } = await api.get<DataPageResponse>(url, {
            params: params,
        });
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllPendingDeliveryOrders(
    params: Omit<DeliveryOrderQueryParams, "status">,
) {
    try {
        const url = `/delivery-orders/in-progress`;
        const { data } = await api.get<DataPageResponse>(url, {
            params: params,
        });
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllDeliveryOrdersByClient(
    params: Omit<DeliveryOrderQueryParams, "userClientName">,
) {
    try {
        const url = `/delivery-orders/client`;
        const { data } = await api.get<DataPageResponse>(url, {
            params: params,
        });
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDeliveryOrder(id: string) {
    try {
        const url = `/delivery-orders/${id}`;
        const { data } = await api.get<DataResponse>(url);
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getDeliveryOrderForClient(id: string) {
    try {
        const url = `/delivery-orders/${id}/client`;
        const { data } = await api.get<DataResponse>(url);
        return data.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

// Se pasa la fecha limite como un queryParam a la API REST
export async function changeLimitDateDeliveryOrder(
    id: string,
    params: { limitDate: string | null },
) {
    try {
        const url = `/delivery-orders/${id}`;
        const { data } = await api.patch<GeneralResponse>(
            url,
            null, // No hay body
            { params },
        );

        if (data.type === "success") {
            return data.message;
        }
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type UpdateLocationPayload = {
    deliveryOrderId: string;
    formData: DeliveryOrderCommentForm;
};

export async function cancelDeliveryOrder({
    deliveryOrderId,
    formData,
}: UpdateLocationPayload) {
    try {
        const url = `/delivery-orders/${deliveryOrderId}/cancel`;
        const { data } = await api.put<GeneralResponse>(url, formData);
        if (data.type === "success") {
            return data.message;
        }
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function sendDeliveryOrder(id: string) {
    try {
        const url = `/delivery-orders/${id}/send`;
        const { data } = await api.patch<GeneralResponse>(url);
        if (data.type === "success") {
            return data.message;
        }
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
