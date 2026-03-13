import type { DataResponse, GeneralResponse } from "@/types/index";
import type { SubregionForm } from "../types";
import { api } from "@/lib/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";

export async function registerSubregion(formData: SubregionForm) {
    try {
        const url = `/subregions`
        const { data } = await api.post<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error: unknown) {
        handleApiError(error);
    }
}


export async function listAllSubregionsByRegionId(regionId: string) {
    try {
        const url = `/subregions/region/${regionId}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error: unknown) {
        handleApiError(error);
    }
}

export async function getSubregion(id: string) {
    try {
        const url = `/subregions/${id}`
        const { data } = await api.get<DataResponse>(url)
        return data.data;
    } catch (error) {
        handleApiError(error);
    }
}

type UpdateSubregionPayload = {
    subregionId: string;
    formData: SubregionForm;
}

export async function updateSubregion({ subregionId, formData }: UpdateSubregionPayload) {
    try {
        const url = `/subregions/${subregionId}`
        const { data } = await api.put<GeneralResponse>(url, formData)
        if (data.type === 'success') {
            return data.message
        }
    } catch (error) {
        handleApiError(error);
    }
}