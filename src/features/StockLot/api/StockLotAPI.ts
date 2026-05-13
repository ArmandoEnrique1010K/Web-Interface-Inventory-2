import { api } from "@/lib/axiosConfig";
import { throwApiErrorMessage } from "@/utils/throwApiErrorMessage";
import type {
    StockLotAdjustmentForm,
    StockLotReceiveForm,
    StockLotTransferForm,
} from "../schemas/requests";
import { responseSchema } from "@/types";
import {
    stockLotDetailResponseSchema,
    stockLotListResponseSchema,
    stockLotPageListResponseSchema,
} from "../schemas/responses";

export async function registerStockLot(formData: StockLotReceiveForm) {
    try {
        const url = `/stock-lots`;
        const { data } = await api.post(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error: unknown) {
        throwApiErrorMessage(error);
    }
}

export type StockLotQueryParams = {
    page?: number;
    minQuantityReceived?: string;
    maxQuantityReceived?: string;
    minQuantityAvailable?: string;
    maxQuantityAvailable?: string;
    minCreatedAt?: string;
    maxCreatedAt?: string;
    keyword?: string;
    companyId?: string;
    categoryId?: string;
    typeId?: string;
    // modelId?: string;
    direction?: "desc" | "asc";
    sortBy?:
        | "id"
        | "quantityReceived"
        | "quantityAvailable"
        | "createdAt"
        | "modelName"
        | "productName";
};

export async function listAllStockLots(params: StockLotQueryParams) {
    try {
        const url = `/stock-lots`;
        const { data } = await api.get(url, {
            params,
        });
        const parsed = stockLotPageListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllStockLotsByModelAndExcludeOne(
    idStockLot: number,
    idCompany: number,
    idModel: number,
) {
    try {
        const url = `/stock-lots/exclude/${idStockLot}/company/${idCompany}/model/${idModel}`;
        const { data } = await api.get(url);
        const parsed = stockLotListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function listAllStockLotsActiveByModel(idModel: number) {
    try {
        const url = `/stock-lots/model/${idModel}`;
        const { data } = await api.get(url);
        const parsed = stockLotListResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function getStockLot(id: number) {
    try {
        const url = `/stock-lots/${id}`;
        const { data } = await api.get(url);
        const parsed = stockLotDetailResponseSchema.parse(data);
        return parsed.data;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type ChangeQuantityStockLotPayload = {
    stockLotId: number;
    formData: StockLotAdjustmentForm;
};

export async function increaseStockLot({
    stockLotId,
    formData,
}: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/increase`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function decreaseStockLot({
    stockLotId,
    formData,
}: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/decrease`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

export async function recoveryStockLot({
    stockLotId,
    formData,
}: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/recovery`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}

type TransferQuantityInStockLotsPayload = {
    stockLotEmitterId: number;
    formData: StockLotTransferForm;
};

export async function transferStockLot({
    stockLotEmitterId,
    formData,
}: TransferQuantityInStockLotsPayload) {
    try {
        const url = `/stock-lots/${stockLotEmitterId}/transfer`;
        const { data } = await api.put(url, formData);
        const parsed = responseSchema.parse(data);
        return parsed.message;
    } catch (error) {
        throwApiErrorMessage(error);
    }
}
