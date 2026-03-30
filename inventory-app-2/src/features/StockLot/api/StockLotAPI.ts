import { api } from "@/lib/axiosConfig";
import type { DataPageResponse, DataResponse, GeneralResponse } from "@/types/index";
import { handleApiError } from "@/utils/handleApiError";
import type { StockLotAdjustmentForm, StockLotReceiveForm, StockLotTransferForm } from "../types";

export async function registerStockLot({ formData }: { formData: StockLotReceiveForm }) {
    try {
        const url = `/stock-lots`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
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
    modelId?: string;
}

export async function listAllStockLots(params: StockLotQueryParams) {
    try {
        const url = `/stock-lots`
        const { data } = await api.get<DataPageResponse>(url, { params: params })
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}


export async function listAllStockLotsByModelAndExcludeOne(idStockLot: string, idCompany: string, idModel: string) {
    try {
        const url = `/stock-lots/exclude/${idStockLot}/company/${idCompany}/model/${idModel}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }

}

export async function getStockLot(id: string) {
    try {
        const url = `/stock-lots/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type ChangeQuantityStockLotPayload = {
    stockLotId: string;
    formData: StockLotAdjustmentForm;
}

export async function increaseStockLot({ stockLotId, formData }: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/increase`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}


export async function decreaseStockLot({ stockLotId, formData }: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/decrease`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

export async function recoveryStockLot({ stockLotId, formData }: ChangeQuantityStockLotPayload) {
    try {
        const url = `/stock-lots/${stockLotId}/recovery`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}

type TransferQuantityInStockLotsPayload = {
    stockLotEmitterId: string;
    formData: StockLotTransferForm;
}

export async function transferStockLot({ stockLotEmitterId, formData }: TransferQuantityInStockLotsPayload) {
    try {
        const url = `/stock-lots/${stockLotEmitterId}/transfer`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}