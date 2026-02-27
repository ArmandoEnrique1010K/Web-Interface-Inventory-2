import type { DataResponse, GeneralResponse } from "@/types/index";
import type { TypeForm } from "../types";
import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";

export async function registerType(formData: TypeForm) {
    try {
        const url = `/types`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function listAllTypes() {
    try {
        const url = `/types`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function getType(id: string) {
    try {
        const url = `/types/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateTypePayload = {
    typeId: string;
    formData: TypeForm;
}

export async function updateType({ typeId, formData }: UpdateTypePayload) {
    try {
        const url = `/types/${typeId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}